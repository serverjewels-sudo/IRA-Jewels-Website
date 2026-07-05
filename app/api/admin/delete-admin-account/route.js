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
    const { id, email } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Admin ID is required for full deletion" }, { status: 400 });
    }

    // Identify target email to compare for self-removal
    let targetEmail = email;
    if (!targetEmail) {
      // fetch email if only id is provided
      const { data: adminData } = await supabaseServiceRole
        .from("admin_users")
        .select("email")
        .eq("id", id)
        .single();
      if (adminData) {
        targetEmail = adminData.email;
      }
    }

    // SAFETY GUARD 1: Prevent self-removal
    if (targetEmail && targetEmail.toLowerCase() === user.email.toLowerCase()) {
      return NextResponse.json({ error: "You cannot delete your own admin account" }, { status: 400 });
    }

    // SAFETY GUARD 2: Prevent removing the last admin
    const { count, error: countError } = await supabaseServiceRole
      .from("admin_users")
      .select("*", { count: "exact", head: true });

    if (countError) {
      return NextResponse.json({ error: "Failed to verify admin count" }, { status: 500 });
    }

    if (count <= 1) {
      return NextResponse.json({ error: "Cannot remove the last admin — at least one admin must remain" }, { status: 400 });
    }

    // Delete from auth.users (irreversible)
    const { error: deleteAuthError } = await supabaseServiceRole.auth.admin.deleteUser(id);
    if (deleteAuthError) {
      return NextResponse.json({ error: `Failed to delete auth user: ${deleteAuthError.message}` }, { status: 500 });
    }

    // Remove from admin_users (in case it doesn't cascade)
    const { error: removeError } = await supabaseServiceRole
      .from("admin_users")
      .delete()
      .eq("id", id);

    if (removeError) {
      console.warn("Failed to delete from admin_users after auth.user deleted. It may have cascaded.", removeError);
    }

    return NextResponse.json({ success: true, message: "Admin account deleted permanently" });
  } catch (err) {
    console.error("Delete Admin Account API Error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
