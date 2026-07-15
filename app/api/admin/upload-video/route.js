import { NextResponse } from "next/server";
import { supabaseServiceRole, isAdminUser } from "@/lib/supabase";
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

  const tempSupabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
  
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
    const body = await req.json();
    const { fileName, fileType } = body;

    if (!fileName || !fileType) {
      return NextResponse.json({ error: "Missing fileName or fileType" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["video/mp4"];
    if (!validTypes.includes(fileType)) {
      return NextResponse.json({ error: "Invalid file type. Only MP4 is allowed." }, { status: 400 });
    }

    // Generate unique filename
    const ext = fileName.split('.').pop();
    const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;

    // Create Signed Upload URL from Supabase
    const { data, error } = await supabaseServiceRole
      .storage
      .from("product-videos")
      .createSignedUploadUrl(uniqueFilename);

    if (error) {
      console.error("Supabase storage upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (err) {
    console.error("Video upload error:", err);
    return NextResponse.json({ error: "Internal server error during upload" }, { status: 500 });
  }
}
