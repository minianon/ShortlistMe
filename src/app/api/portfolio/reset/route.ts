import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let clerkUser;
  try {
    clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }
  } catch (error) {
    console.error("Clerk Error fetching currentUser:", error);
    return NextResponse.json({ error: "Unauthorized or session expired" }, { status: 401 });
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      include: { portfolio: true }
    });

    if (!dbUser?.portfolio) {
      return NextResponse.json({ error: "No portfolio found" }, { status: 404 });
    }

    const portfolioId = dbUser.portfolio.id;

    // Nuclear Reset Sequence:
    // 1. Unlink the live site and set to Private
    await prisma.portfolio.update({
      where: { id: portfolioId },
      data: { 
        publishedVersionId: null,
        isPublic: false
      }
    });

    // 2. Erase existing data categories
    await Promise.all([
      // Clear Designs
      prisma.portfolioVersion.deleteMany({ where: { portfolioId } }),
      
      // Clear Analytics
      prisma.analyticsVisit.deleteMany({ where: { portfolioId } }),
      prisma.linkClick.deleteMany({ where: { portfolioId } }),
      
      // Clear Notifications for the user
      prisma.notification.deleteMany({ where: { userId: dbUser.id } })
    ]);

    // 3. Auto-provision a "Clean Slate" basic version (Minimal data)
    const name = `${clerkUser?.firstName ?? ""} ${clerkUser?.lastName ?? ""}`.trim();
    const version = await prisma.portfolioVersion.create({
      data: {
        portfolioId,
        data: {
          name: name || "User",
          title: "Professional",
          bio: "",
          skills: [],
          experience: [],
          education: [],
          projects: [],
          theme: "modern",
        },
      },
    });

    // 4. Publish this basic version
    await prisma.portfolio.update({
      where: { id: portfolioId },
      data: { publishedVersionId: version.id },
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
