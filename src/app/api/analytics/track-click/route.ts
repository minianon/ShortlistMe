import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function POST(req: NextRequest) {
  try {
    const { portfolioId, linkType, linkUrl, linkName } = await req.json();

    if (!portfolioId || !linkType) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Fire-and-forget — don't block the user's click
    await prisma.linkClick.create({
      data: { portfolioId, linkType, linkUrl: linkUrl || null },
    });

    // Generate real-time notification for the portfolio owner
    const portfolio = await prisma.portfolio.findUnique({
      where: { id: portfolioId },
      include: { user: true }
    });

    if (portfolio?.user) {
      const message = linkName 
        ? `Someone just clicked your project "${linkName}"`
        : `Someone just clicked your ${linkType.replace(/_/g, ' ')} link`;

      await prisma.notification.create({
        data: {
          userId: portfolio.user.id,
          title: "New Engagement",
          message: message,
          type: "engagement",
          icon: "MousePointer2"
        }
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[TRACK_CLICK_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
