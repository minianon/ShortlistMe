import { auth, currentUser, clerkClient } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import Groq from "groq-sdk";

// Helpers
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function deriveInfoFromEmail(email?: string | null) {
  if (!email) return { first: "", last: "", full: "", slug: "", derived: false };
  
  // Rule: Ignore numbers in the prefix
  let prefix = email.split('@')[0].replace(/\d+/g, "");
  if (!prefix) return { first: "", last: "", full: "", slug: "", derived: false };

  const parts = prefix.split(/[\._-]/);
  
  // If we have clear delimiters, use them
  if (parts.length > 1) {
    const first = parts[0]?.charAt(0).toUpperCase() + parts[0]?.slice(1) || "";
    const last = parts.slice(1).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
    const full = `${first} ${last}`.trim();
    const slug = slugify(prefix);
    return { first, last, full, slug, derived: true };
  }

  // If no delimiters, try a fast AI split (e.g., tradertushar -> Trader Tushar)
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "Split the input into professional First and Last names. Output JSON: {\"first\":\"\",\"last\":\"\"}. No extra text. If only one name is possible, put it in 'first'." },
        { role: "user", content: prefix }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });
    
    const { first, last } = JSON.parse(completion.choices[0]?.message?.content || "{}");
    if (first) {
      return { 
        first: first.charAt(0).toUpperCase() + first.slice(1), 
        last: last ? last.charAt(0).toUpperCase() + last.slice(1) : "", 
        full: `${first} ${last}`.trim(), 
        slug: slugify(prefix),
        derived: true 
      };
    }
  } catch (e) {
    console.error("AI Name Derivation Failed:", e);
  }

  // Fallback: Just return the capitalized prefix
  const fallback = prefix.charAt(0).toUpperCase() + prefix.slice(1);
  return { first: fallback, last: "", full: fallback, slug: slugify(prefix), derived: true };
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clerkUser = await currentUser();
  const email = clerkUser?.primaryEmailAddress?.emailAddress;
  const derived = await deriveInfoFromEmail(email);
  let clerkUpdated = false;

  // Sync derived name back to Clerk if missing
  if (clerkUser && !clerkUser.firstName && derived.first) {
    const client = await clerkClient();
    await client.users.updateUser(userId, {
      firstName: derived.first,
      lastName: derived.last,
    });
    clerkUpdated = true;
  }

  // 1. Auto-provision the user in the database
  const dbUser = await prisma.user.upsert({
    where: { clerkUserId: userId },
    create: {
      clerkUserId: userId,
      email: email ?? null,
      firstName: clerkUser?.firstName || derived.first || null,
      lastName: clerkUser?.lastName || derived.last || null,
    },
    update: {
      email: email ?? null,
      firstName: clerkUser?.firstName || derived.first || null,
      lastName: clerkUser?.lastName || derived.last || null,
    },
    select: { id: true, firstName: true, lastName: true },
  });

  // 2. Ensure the user has a portfolio (auto-provision one so they have a slug)
  const existingPortfolio = await prisma.portfolio.findUnique({
    where: { userId: dbUser.id },
    select: {
      id: true,
      slug: true,
      publishedVersionId: true,
      publishedVersion: { select: { data: true } },
      versions: { 
        select: { data: true },
        orderBy: { createdAt: "desc" },
        take: 1
      },
      isPublic: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { versions: true } },
    },
  });

  let activePortfolio = existingPortfolio;
  
  if (!activePortfolio) {
    // Check if they arrived with a claimed slug
    const cookieStore = await cookies();
    const preferredSlug = cookieStore.get("claimed_slug")?.value;

    // Generate a unique slug based on their name or fallbacks
    const fName = clerkUser?.firstName || dbUser.firstName || "";
    const lName = clerkUser?.lastName || dbUser.lastName || "";
    const parsedName = `${fName} ${lName}`.trim() || derived.full;
    
    const baseSlug = preferredSlug || slugify(parsedName) || derived.slug || userId.slice(0, 8);
    
    let slug = baseSlug;
    let attempt = 0;
    while (true) {
      const existing = await prisma.portfolio.findFirst({
        where: { 
          slug: {
            equals: slug,
            mode: 'insensitive'
          } 
        },
        select: { id: true },
      });
      if (!existing) break;
      attempt++;
      slug = `${baseSlug}-${attempt}`;
    }

    // Create a new portfolio
    activePortfolio = await prisma.portfolio.create({
      data: {
        userId: dbUser.id,
        slug,
      },
      select: {
        id: true,
        slug: true,
        publishedVersionId: true,
        publishedVersion: { select: { data: true } },
        versions: { 
          select: { data: true },
          orderBy: { createdAt: "desc" },
          take: 1
        },
        isPublic: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { versions: true } },
      },
    });

    // Create an empty default version and publish it
    const version = await prisma.portfolioVersion.create({
      data: {
        portfolioId: activePortfolio.id,
        data: {
          name: parsedName || null,
          title: "Professional",
          bio: "",
        },
      },
      select: { id: true },
    });

    await prisma.portfolio.update({
      where: { id: activePortfolio.id },
      data: { publishedVersionId: version.id },
    });
    
    activePortfolio.publishedVersionId = version.id;
    activePortfolio.publishedVersion = { data: { name: parsedName || null, title: "Professional", bio: "" } } as any;
    activePortfolio._count.versions = 1;

    // 8. Clean up claimed slug cookie if it was used
    (await cookies()).delete("claimed_slug");
  }

  const resumeCount = await prisma.resume.count({ where: { userId: dbUser.id } });

  return NextResponse.json({ portfolio: activePortfolio, resumeCount });
}
