import { auth, currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { supabaseAdmin } from "@/server/supabase";
import Groq from "groq-sdk";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";

// Extract text and hyperlinks from a PDF buffer
async function extractTextAndLinksFromPDF(buffer: Buffer): Promise<string> {
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(buffer),
    useWorkerFetch: false,
    useSystemFonts: true,
    isEvalSupported: false
  });
  
  const pdf = await loadingTask.promise;
  let fullText = "";
  const foundLinks = new Set<string>();

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    
    // 1. Extract Text
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");
    fullText += pageText + "\n";

    // 2. Extract Annotations (Links)
    const annotations = await page.getAnnotations();
    annotations.forEach((ann: any) => {
      if (ann.subtype === 'Link' && ann.url) {
        foundLinks.add(ann.url);
      }
    });
  }

  // Append found links as a reference for the AI
  if (foundLinks.size > 0) {
    fullText += "\n\n--- DETECTED HYPERLINKS IN DOCUMENT ---\n";
    foundLinks.forEach(link => {
      fullText += `- ${link}\n`;
    });
    fullText += "\nNote: Associate the URLs above with the correct sections (like LinkedIn, GitHub, or individual Project URLs) based on context in the text.";
  }

  return fullText;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function deriveInfoFromEmail(email?: string | null) {
  if (!email) return { first: "", last: "", full: "", slug: "" };
  const prefix = email.split('@')[0];
  const parts = prefix.split(/[\._-]/);
  
  const first = parts[0]?.charAt(0).toUpperCase() + parts[0]?.slice(1) || "";
  const last = parts.slice(1).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
  const full = `${first} ${last}`.trim();
  const slug = slugify(prefix);
  
  return { first, last, full, slug };
}

export const maxDuration = 60;

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const clerkUser = await currentUser();
    
    // Initialize Groq inside the handler to prevent top-level unhandled missing key crashes
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || "dummy" });

    // 1. Find the user and their latest resume
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        resumes: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    if (!dbUser || dbUser.resumes.length === 0) {
      return NextResponse.json({ error: "No resume found. Please upload a resume first." }, { status: 400 });
    }

    const resume = dbUser.resumes[0];

    // 2. Download the resume from Supabase storage
    const { data: fileData, error: downloadError } = await supabaseAdmin.storage
      .from(resume.storageBucket)
      .download(resume.storagePath);

    if (downloadError || !fileData) {
      return NextResponse.json({ error: "Failed to download resume from storage." }, { status: 500 });
    }

    // 3. Extract text content from the file
    let resumeText = "";
    try {
      const arrayBuffer = await fileData.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (resume.mimeType === "application/pdf" || resume.originalFilename?.endsWith(".pdf")) {
        resumeText = await extractTextAndLinksFromPDF(buffer);
      } else {
        // For DOCX/DOC — extract raw text (good enough for LLM parsing)
        resumeText = buffer.toString("utf-8").replace(/[^\x20-\x7E\n\r\t]/g, " ").trim();
      }
    } catch (err: any) {
      console.error("PDF Parsing Error:", err);
      return NextResponse.json({ error: "Failed to parse resume file.", details: err.message }, { status: 500 });
    }

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json({ error: "Resume appears to be empty or unreadable." }, { status: 400 });
    }

    // 4. Send to Groq for structured extraction
    const prompt = `You are a professional resume parser. Extract the following information from the resume text below and return it as a valid JSON object. 
IMPORTANT: URLs are listed at the very end of the text under 'DETECTED HYPERLINKS'. Use these provided URLs to fill the linkedin, github, and website fields by logically matching them to the labels, usernames, or project titles in the main text.

Do NOT include any markdown, code fences, or extra text — ONLY return the JSON object.

Extract these fields:
{
  "name": "Full name of the person",
  "title": "Professional title or headline",
  "bio": "2-3 sentence professional summary",
  "location": "City, Country (if available)",
  "email": "Email address (if available)",
  "phone": "Phone number (if available)",
  "linkedin": "Full LinkedIn profile URL",
  "github": "Full GitHub profile URL",
  "website": "Personal portfolio or website URL",
  "skills": ["skill1", "skill2", ...],
  "experience": [
    {
      "title": "Job title",
      "company": "Company name",
      "period": "e.g. 2021 — Present",
      "description": "2-3 sentence description of responsibilities and achievements"
    }
  ],
  "education": [
    {
      "degree": "Degree name",
      "institution": "School/University",
      "period": "e.g. 2016 — 2020",
      "detail": "Optional detail (GPA, honors, etc.)"
    }
  ],
  "projects": [
    {
      "title": "Project name",
      "description": "What it does and what you built",
      "tags": ["tech1", "tech2"]
    }
  ],
  "certifications": ["certification1", "certification2"]
}

If a field is not present, use null for strings or [] for arrays.

Resume text:
${resumeText.slice(0, 8000)}`;

    let portfolioData: Record<string, unknown>;
    try {
      const model = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";
      const completion = await groq.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 2048,
      });

      const raw = completion.choices[0]?.message?.content ?? "";
      // Strip any accidental markdown fences
      const cleaned = raw.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
      portfolioData = JSON.parse(cleaned);
    } catch {
      // Fallback: try the smaller model
      try {
        const fallback = process.env.GROQ_FALLBACK_MODEL ?? "llama-3.1-8b-instant";
        const completion2 = await groq.chat.completions.create({
          model: fallback,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2,
          max_tokens: 2048,
        });
        const raw2 = completion2.choices[0]?.message?.content ?? "";
        const cleaned2 = raw2.replace(/```(?:json)?/gi, "").replace(/```/g, "").trim();
        portfolioData = JSON.parse(cleaned2);
      } catch (err2: any) {
        return NextResponse.json({ error: "AI parsing failed. Please try again.", details: err2.message }, { status: 500 });
      }
    }

    // 5. Derive slug from claimed cookie, parsed name, or Clerk user name
    const cookieStore = await cookies();
    const preferredSlug = cookieStore.get("claimed_slug")?.value;

    const email = clerkUser?.primaryEmailAddress?.emailAddress;
    const derived = deriveInfoFromEmail(email);

    const fName = clerkUser?.firstName || dbUser?.firstName || "";
    const lName = clerkUser?.lastName || dbUser?.lastName || "";
    const parsedName = (portfolioData.name as string | null) || `${fName} ${lName}`.trim() || derived.full;
    
    const baseSlug = preferredSlug || slugify(parsedName) || derived.slug || userId.slice(0, 8);

    // Ensure slug uniqueness by checking the DB (Case-Insensitive)
    let slug = baseSlug;
    let attempt = 0;
    while (true) {
      const existing = await prisma.portfolio.findFirst({
        where: { 
          slug: {
            equals: slug,
            mode: 'insensitive'
          }, 
          NOT: { userId: dbUser.id } 
        },
        select: { id: true },
      });
      if (!existing) break;
      attempt++;
      slug = `${baseSlug}-${attempt}`;
    }

    // 6. Upsert Portfolio + create PortfolioVersion
    const portfolio = await prisma.portfolio.upsert({
      where: { userId: dbUser.id },
      create: { userId: dbUser.id, slug },
      update: {},
      select: { id: true, slug: true },
    });

    const version = await prisma.portfolioVersion.create({
      data: {
        portfolioId: portfolio.id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data: portfolioData as any,
      },
      select: { id: true },
    });

    // 7. Set this version as published
    await prisma.portfolio.update({
      where: { id: portfolio.id },
      data: { publishedVersionId: version.id },
    });

    // 8. Clean up claimed slug cookie if it was used
    if (preferredSlug) {
      // In Next.js App Router, cookies().delete() is used like this:
      cookieStore.delete("claimed_slug");
    }

    return NextResponse.json({ ok: true, slug: portfolio.slug });
  } catch (error: any) {
    console.error("Generate API Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
