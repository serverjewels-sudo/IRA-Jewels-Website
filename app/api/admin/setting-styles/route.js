import { NextResponse } from "next/server";
import { supabaseServiceRole, isAdminUser } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

// Helper to authenticate requests using client's JWT
async function getAdminUser(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  if (!token) return null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const tempSupabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
  
  const { data: { user }, error } = await tempSupabase.auth.getUser(token);
  if (error || !user) return null;
  return user;
}

export async function GET(req) {
  const user = await getAdminUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const check = await isAdminUser(user.email);
  if (!check) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    const { data, error } = await supabaseServiceRole
      .from("homepage_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (error) {
      // If table/row doesn't exist yet, return an empty array for graceful handling
      return NextResponse.json({ visible_setting_styles: [] });
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  const user = await getAdminUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const check = await isAdminUser(user.email);
  if (!check) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { visible_setting_styles } = body;

    if (!Array.isArray(visible_setting_styles)) {
      return NextResponse.json({ error: "Missing or invalid visible_setting_styles" }, { status: 400 });
    }

    const { data, error } = await supabaseServiceRole
      .from("homepage_settings")
      .update({
        visible_setting_styles: visible_setting_styles
      })
      .eq("id", 1)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
