import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkUserId: userId },
    select: { id: true },
  });

  if (!dbUser) return NextResponse.json({ resumes: [] });

  const resumes = await prisma.resume.findMany({
    where: { userId: dbUser.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      originalFilename: true,
      mimeType: true,
      sizeBytes: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ resumes });
}
