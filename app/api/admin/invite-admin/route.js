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

export async function POST(req) {
  const user = await getAdminUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const check = await isAdminUser(user.email);
  if (!check) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    // Check if the user is already an admin
    const isAlreadyAdmin = await isAdminUser(email);
    if (isAlreadyAdmin) {
      return NextResponse.json({ error: "User is already an admin" }, { status: 400 });
    }

    // Determine the origin for the redirect URL
    const origin = req.headers.get("origin") || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const redirectTo = `${origin}/admin/reset-password`;

    // Use Supabase Service Role to invite the user
    const { data: inviteData, error: inviteError } = await supabaseServiceRole.auth.admin.inviteUserByEmail(email, {
      redirectTo
    });

    if (inviteError) {
      return NextResponse.json({ error: `Failed to invite user: ${inviteError.message}` }, { status: 500 });
    }

    // Add to admin_users table
    const { error: insertError } = await supabaseServiceRole
      .from("admin_users")
      .insert([{ email: email.toLowerCase().trim() }]);

    if (insertError) {
      // In a real app we might try to rollback the invite here, but for now just report the error
      return NextResponse.json({ error: `Failed to add admin role: ${insertError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Admin invited successfully" });
  } catch (err) {
    console.error("Invite Admin API Error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
