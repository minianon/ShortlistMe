import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function POST(req: Request) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { data } = await req.json();
    if (!data) return NextResponse.json({ error: "No data provided" }, { status: 400 });

    // 1. Resolve internal User ID
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      include: { portfolio: true }
    });

    if (!user || !user.portfolio) {
      return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    // 2. Create a new version (The Draft)
    const newVersion = await prisma.portfolioVersion.create({
      data: {
        portfolioId: user.portfolio.id,
        data: data as any,
      },
      select: { id: true, createdAt: true }
    });

    // Note: We DO NOT update publishedVersionId here. 
    // This makes it a "Draft" until the user explicitly clicks Publish.

    return NextResponse.json({ 
      ok: true, 
      versionId: newVersion.id 
    });
  } catch (error) {
    console.error("[PORTFOLIO_SAVE_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
