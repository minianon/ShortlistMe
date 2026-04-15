import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";

function isSlugValid(slug: string): boolean {
  // Only allow lowercase letters, numbers, and hyphens. No leading or trailing hyphens.
  const regex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return regex.test(slug) && slug.length >= 3 && slug.length <= 48;
}

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ available: false }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ available: false }, { status: 400 });
  }

  const newSlug = slug.toLowerCase().trim();

  if (!isSlugValid(newSlug)) {
    return NextResponse.json({ available: false });
  }

  // Find the current dbUser
  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  });

  if (!dbUser) return NextResponse.json({ available: false });

  // Find if slug exists and is NOT owned by the current user (Case-Insensitive)
  const existing = await prisma.portfolio.findFirst({
    where: { 
      slug: {
        equals: newSlug,
        mode: 'insensitive'
      }, 
      NOT: { userId: dbUser.id } 
    },
    select: { id: true },
  });

  return NextResponse.json({ available: !existing });
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { slug } = body;

  if (!slug || typeof slug !== "string") {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  const newSlug = slug.toLowerCase().trim();

  if (!isSlugValid(newSlug)) {
    return NextResponse.json({ 
      error: "Invalid slug. Use only lowercase letters, numbers, and hyphens (3-48 characters). Cannot start or end with a hyphen." 
    }, { status: 400 });
  }

  // Get the dbUser
  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, portfolio: { select: { id: true, slug: true } } },
  });

  if (!dbUser || !dbUser.portfolio) {
    return NextResponse.json({ error: "Portfolio not found. Please wait for it to be provisioned." }, { status: 404 });
  }

  if (dbUser.portfolio.slug === newSlug) {
    // No change needed
    return NextResponse.json({ ok: true, slug: newSlug });
  }

  // Check if slug is taken (Case-Insensitive)
  const existing = await prisma.portfolio.findFirst({
    where: { 
      slug: {
        equals: newSlug,
        mode: 'insensitive'
      }, 
      NOT: { userId: dbUser.id } 
    },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({ error: "This handle is already taken. Please choose another one." }, { status: 409 });
  }

  try {
    // Update slug
    await prisma.portfolio.update({
      where: { id: dbUser.portfolio.id },
      data: { slug: newSlug },
    });

    return NextResponse.json({ ok: true, slug: newSlug });
  } catch (error: any) {
    // Handle uniqueness constraint violations at the DB level
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "This handle was just taken by another user. Please choose a different one." }, { status: 409 });
    }
    throw error;
  }
}
