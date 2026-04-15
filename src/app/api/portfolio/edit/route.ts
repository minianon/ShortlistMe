import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, title, bio, email, location, github, linkedin } = body;

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true, portfolio: { select: { id: true, publishedVersion: true } } },
  });

  if (!dbUser || !dbUser.portfolio) {
    return NextResponse.json({ error: "Portfolio not found." }, { status: 404 });
  }

  // Get the current version's data so we don't overwrite arrays like skills or experience
  const currentData = dbUser.portfolio.publishedVersion?.data as Record<string, any> || {};

  const newData = {
    ...currentData,
    name: name !== undefined ? name : currentData.name,
    title: title !== undefined ? title : currentData.title,
    bio: bio !== undefined ? bio : currentData.bio,
    email: email !== undefined ? email : currentData.email,
    location: location !== undefined ? location : currentData.location,
    github: github !== undefined ? github : currentData.github,
    linkedin: linkedin !== undefined ? linkedin : currentData.linkedin,
  };

  // Create a new PortfolioVersion
  const version = await prisma.portfolioVersion.create({
    data: {
      portfolioId: dbUser.portfolio.id,
      data: newData as any,
    },
    select: { id: true },
  });

  // Set it as published
  await prisma.portfolio.update({
    where: { id: dbUser.portfolio.id },
    data: { publishedVersionId: version.id },
  });

  return NextResponse.json({ ok: true });
}
