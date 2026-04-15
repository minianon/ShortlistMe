import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function GET() {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    // Join with User to find the portfolio using clerkUserId
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      include: {
        portfolio: {
          include: {
            versions: {
              orderBy: { createdAt: "desc" },
              take: 1
            }
          }
        }
      }
    });

    if (!user || !user.portfolio || user.portfolio.versions.length === 0) {
      return NextResponse.json({ 
        portfolio: null, 
        latestVersion: null,
        isLive: false 
      });
    }

    const portfolio = user.portfolio;
    const latestVersion = portfolio.versions[0];
    const isLive = portfolio.publishedVersionId === latestVersion.id;

    return NextResponse.json({
      portfolio: {
        id: portfolio.id,
        slug: portfolio.slug,
        isPublic: portfolio.isPublic,
      },
      latestVersion: {
        id: latestVersion.id,
        data: latestVersion.data,
        createdAt: latestVersion.createdAt
      },
      isLive
    });
  } catch (error) {
    console.error("[PORTFOLIO_PREVIEW_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
