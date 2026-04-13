import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { firstName, lastName, publicVisibility, notifPortfolio, notifMarketing } = body;

  const client = await clerkClient();

  // If there are metadata fields, we should fetch current user to merge metadata
  let unsafeMetadata = {};
  if (publicVisibility !== undefined || notifPortfolio !== undefined || notifMarketing !== undefined) {
    const clerkUser = await client.users.getUser(userId);
    unsafeMetadata = {
      ...clerkUser.unsafeMetadata,
      ...(publicVisibility !== undefined && { publicVisibility }),
      ...(notifPortfolio !== undefined && { notifPortfolio }),
      ...(notifMarketing !== undefined && { notifMarketing }),
    };
  }

  await client.users.updateUser(userId, {
    ...(firstName !== undefined && { firstName }),
    ...(lastName !== undefined && { lastName }),
    ...(Object.keys(unsafeMetadata).length > 0 && { unsafeMetadata }),
  });

  return NextResponse.json({ ok: true });
}
