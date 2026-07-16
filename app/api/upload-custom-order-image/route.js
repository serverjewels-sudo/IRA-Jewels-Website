import { NextResponse } from "next/server";
import { supabaseServiceRole } from "@/lib/supabase";

export async function POST(req) {
  try {
    const body = await req.json();
    const { fileName, fileType, fileSize } = body;

    if (!fileName || !fileType || !fileSize) {
      return NextResponse.json({ error: "Missing required file metadata" }, { status: 400 });
    }

    // Strictly validate file size (5MB max = 5 * 1024 * 1024 bytes)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (fileSize > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size exceeds the 5MB limit." }, { status: 400 });
    }

    // Strictly validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(fileType)) {
      return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, and WebP are allowed." }, { status: 400 });
    }

    // Generate unique random filename
    const ext = fileName.split('.').pop() || "img";
    // Discard the user's original filename completely for safety
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 12)}.${ext.toLowerCase()}`;

    // Create Signed Upload URL from Supabase using Service Role (since customer is unauthenticated)
    const { data, error } = await supabaseServiceRole
      .storage
      .from("custom-order-references")
      .createSignedUploadUrl(uniqueFilename);

    if (error) {
      console.error("Supabase storage upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Image upload error in /api/upload-custom-order-image:", err);
    return NextResponse.json({ error: "Internal server error during upload request" }, { status: 500 });
  }
}
