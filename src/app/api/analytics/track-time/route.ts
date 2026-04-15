import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function POST(req: NextRequest) {
  try {
    const { visitId, durationSeconds } = await req.json();

    if (!visitId || durationSeconds === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Update the visit with the final duration spent on page
    const visit = await prisma.analyticsVisit.update({
      where: { id: visitId },
      data: {
        durationSeconds: Math.floor(durationSeconds),
      },
      include: {
        portfolio: {
          include: { user: true }
        }
      }
    });

    // Smart Engagement Notification: "Deep Dive" alert at 2 minutes
    if (durationSeconds >= 120) {
      // Check if we've already sent a deep dive alert for this specific visit
      const alertType = `engagement:deepdive:${visitId}`;
      const existingAlert = await prisma.notification.findFirst({
        where: {
          userId: visit.portfolio.user.id,
          type: alertType
        }
      });

      if (!existingAlert) {
        await prisma.notification.create({
          data: {
            userId: visit.portfolio.user.id,
            title: "High Interest Alert",
            message: `Someone is diving deep into your work! A visitor has been exploring for over 2 minutes.`,
            type: alertType,
            icon: "Zap",
          }
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[TRACK_TIME_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
