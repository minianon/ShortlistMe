import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const client = await clerkClient();

    // 1. Delete from Prisma first (to ensure we don't have orphaned records if Clerk delete fails)
    // Cascade delete on User -> Portfolio and Resume in schema.prisma should take care of children
    await prisma.user.delete({
      where: { clerkUserId: userId }
    });

    // 2. Delete from Clerk
    await client.users.deleteUser(userId);

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("[USER_DELETE_ERROR]", e);
    return NextResponse.json({ error: e.message || "Failed to delete account" }, { status: 500 });
  }
}
