import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PHOTO_BUCKET_NAME, MAX_PHOTOS_PER_LISTING } from "@/lib/constants";

// POST /api/upload - Upload photos to Supabase Storage
export async function POST(request: NextRequest) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("photos") as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  if (files.length > MAX_PHOTOS_PER_LISTING) {
    return NextResponse.json(
      { error: `Maximum ${MAX_PHOTOS_PER_LISTING} photos allowed` },
      { status: 400 }
    );
  }

  const uploadedUrls: string[] = [];

  for (const file of files) {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${fileExt}`;

    // Convert File to ArrayBuffer for Supabase Storage
    const arrayBuffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from(PHOTO_BUCKET_NAME)
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
      });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(PHOTO_BUCKET_NAME).getPublicUrl(data.path);

    uploadedUrls.push(publicUrl);
  }

  return NextResponse.json({ urls: uploadedUrls });
}
