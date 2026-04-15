import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/server/db";

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();
    
    if (!clerkUserId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) return new NextResponse("User not found", { status: 404 });

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("[NOTIFICATIONS_GET_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) return new NextResponse("User not found", { status: 404 });

    const { id } = await req.json().catch(() => ({}));

    if (id) {
      // Mark specific notification as read
      await prisma.notification.update({
        where: { id, userId: user.id },
        data: { isRead: true },
      });
    } else {
      // Mark all as read
      await prisma.notification.updateMany({
        where: { 
          userId: user.id,
          isRead: false 
        },
        data: { isRead: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[NOTIFICATIONS_PATCH_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
