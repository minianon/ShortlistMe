import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { supabaseAdmin } from "@/server/supabase";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let user;
    try {
      user = await currentUser();
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 401 });
      }
    } catch (error) {
      console.error("Clerk Error fetching currentUser:", error);
      return NextResponse.json({ error: "Unauthorized or session expired" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    if (file.size > 4.5 * 1024 * 1024) {
      return NextResponse.json({ error: "File too large (max 4.5MB). Please compress it." }, { status: 400 });
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
  } catch (err: any) {
    console.error("Resume Upload Error:", err);
    return NextResponse.json({ error: "Internal Server Error during upload." }, { status: 500 });
  }
}

