import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { 
    firstName, 
    lastName, 
    publicVisibility, 
    notifPortfolio, 
    notifMarketing,
    seoTitle,
    seoDescription,
    brandColor,
    dashboardTheme,
    reduceMotion
  } = body;

  const client = await clerkClient();

  // If there are metadata fields, we should fetch current user to merge metadata
  const METADATA_KEYS = [
    'publicVisibility', 'notifPortfolio', 'notifMarketing', 
    'seoTitle', 'seoDescription', 'brandColor', 
    'dashboardTheme', 'reduceMotion'
  ];

  const hasMetadata = METADATA_KEYS.some(key => body[key] !== undefined);
  let unsafeMetadata = {};

  if (hasMetadata) {
    const clerkUser = await client.users.getUser(userId);
    unsafeMetadata = { ...clerkUser.unsafeMetadata };
    
    METADATA_KEYS.forEach(key => {
      if (body[key] !== undefined) {
        unsafeMetadata = { ...unsafeMetadata, [key]: body[key] };
      }
    });
  }

  await client.users.updateUser(userId, {
    ...(firstName !== undefined && { firstName }),
    ...(lastName !== undefined && { lastName }),
    ...(Object.keys(unsafeMetadata).length > 0 && { unsafeMetadata }),
  });

  // Sync to local DB
  if (firstName !== undefined || lastName !== undefined) {
    await prisma.user.update({
      where: { clerkUserId: userId },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
      }
    });
  }

  // Sync with Prisma Portfolio if publicVisibility is changed
  if (publicVisibility !== undefined) {
    const dbUser = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { portfolio: { select: { id: true } } }
    });
    if (dbUser?.portfolio) {
      await prisma.portfolio.update({
        where: { id: dbUser.portfolio.id },
        data: { isPublic: publicVisibility }
      });
    }
  }

  return NextResponse.json({ ok: true });
}
