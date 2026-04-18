import { auth, currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

// Slugify a name into a URL-safe identifier
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clerkUser = await currentUser();

  // 1. Auto-provision the user in the database
  const dbUser = await prisma.user.upsert({
    where: { clerkUserId: userId },
    create: {
      clerkUserId: userId,
      email: clerkUser?.primaryEmailAddress?.emailAddress ?? null,
      firstName: clerkUser?.firstName ?? null,
      lastName: clerkUser?.lastName ?? null,
    },
    update: {
      email: clerkUser?.primaryEmailAddress?.emailAddress ?? null,
      firstName: clerkUser?.firstName ?? null,
      lastName: clerkUser?.lastName ?? null,
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
    const parsedName = `${clerkUser?.firstName || dbUser.firstName || ""} ${clerkUser?.lastName || dbUser.lastName || ""}`.trim();
    const baseSlug = preferredSlug || slugify(parsedName) || userId.slice(0, 8);
    
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
