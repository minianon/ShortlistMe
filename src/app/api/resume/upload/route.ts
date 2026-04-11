import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { supabaseAdmin } from "@/server/supabase";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await currentUser();

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
  }

  const bucket = process.env.SUPABASE_RESUME_BUCKET || "resumes";
  const safeName = file.name.replace(/[^\w.\-() ]+/g, "_");
  const objectPath = `${userId}/${Date.now()}-${safeName}`;

  const dbUser = await prisma.user.upsert({
    where: { clerkUserId: userId },
    create: {
      clerkUserId: userId,
      email: user?.primaryEmailAddress?.emailAddress ?? null,
    },
    update: {
      email: user?.primaryEmailAddress?.emailAddress ?? null,
    },
    select: { id: true },
  });

  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(objectPath, arrayBuffer, {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: "Upload failed", details: uploadError.message },
      { status: 500 },
    );
  }

  const resume = await prisma.resume.create({
    data: {
      userId: dbUser.id,
      storageBucket: bucket,
      storagePath: objectPath,
      originalFilename: file.name,
      mimeType: file.type || null,
      sizeBytes: file.size,
    },
    select: { id: true, createdAt: true },
  });

  return NextResponse.json({ ok: true, resume });
}

