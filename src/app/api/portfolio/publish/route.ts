import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function POST(req: Request) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json().catch(() => ({}));
    const { data } = body;

    // 1. Get the internal user
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      include: {
        portfolio: true
      }
    });

    if (!user || !user.portfolio) {
      return NextResponse.json({ error: "Portfolio not found." }, { status: 404 });
    }

    let versionToPublishId: string;

    // 2. If data is provided, save it as a new version first
    if (data) {
       const newVersion = await prisma.portfolioVersion.create({
          data: {
             portfolioId: user.portfolio.id,
             data: data as any
          }
       });
       versionToPublishId = newVersion.id;
    } else {
       // fallback to latest version if no data sent
       const latest = await prisma.portfolioVersion.findFirst({
          where: { portfolioId: user.portfolio.id },
          orderBy: { createdAt: "desc" }
       });
       if (!latest) return NextResponse.json({ error: "No version found" }, { status: 400 });
       versionToPublishId = latest.id;
    }

    // 3. Set as the published version
    await prisma.portfolio.update({
      where: { id: user.portfolio.id },
      data: { publishedVersionId: versionToPublishId },
    });

    return NextResponse.json({ 
      ok: true, 
      publishedVersionId: versionToPublishId 
    });
  } catch (error) {
    console.error("[PORTFOLIO_PUBLISH_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
