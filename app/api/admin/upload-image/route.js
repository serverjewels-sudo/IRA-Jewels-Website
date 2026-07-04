import { NextResponse } from "next/server";
import { supabaseAdmin, isAdminUser } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

// Helper to authenticate requests using client's JWT
async function getAdminUser(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw new Error("No authorization header provided.");
  const token = authHeader.split(" ")[1];
  if (!token || token === "undefined" || token === "null") throw new Error(`Invalid token format: ${token}`);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) throw new Error("Server missing Supabase env variables.");

  const tempSupabase = createClient(supabaseUrl, supabaseAnonKey);
  
  const { data: { user }, error } = await tempSupabase.auth.getUser(token);
  if (error) throw new Error(`getUser error: ${error.message}`);
  if (!user) throw new Error("getUser returned no user data.");
  return user;
}

export async function POST(req) {
  let user;
  try {
    user = await getAdminUser(req);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 401 });
  }

  const check = await isAdminUser(user.email);
  if (!check) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Only JPG, PNG, and WebP are allowed." }, { status: 400 });
    }

    // Validate file size (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large. Maximum size is 5MB." }, { status: 400 });
    }

    // Generate unique filename
    const ext = file.name.split('.').pop();
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin
      .storage
      .from("product-images")
      .upload(uniqueFilename, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      console.error("Supabase storage upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin
      .storage
      .from("product-images")
      .getPublicUrl(data.path);

    return NextResponse.json({ url: publicUrl });

  } catch (err) {
    console.error("Image upload error:", err);
    return NextResponse.json({ error: "Internal server error during upload" }, { status: 500 });
  }
}
