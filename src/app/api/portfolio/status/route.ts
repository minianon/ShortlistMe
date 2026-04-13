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

  if (!dbUser) return NextResponse.json({ portfolio: null, resumeCount: 0 });

  const [portfolio, resumeCount] = await Promise.all([
    prisma.portfolio.findUnique({
      where: { userId: dbUser.id },
      select: {
        id: true,
        slug: true,
        publishedVersionId: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { versions: true } },
      },
    }),
    prisma.resume.count({ where: { userId: dbUser.id } }),
  ]);

  return NextResponse.json({ portfolio, resumeCount });
}
