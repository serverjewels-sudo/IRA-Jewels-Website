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

    if (!id && !email) {
      return NextResponse.json({ error: "Admin ID or email is required to remove" }, { status: 400 });
    }

    // Identify target email to compare for self-removal
    let targetEmail = email;
    if (id && !targetEmail) {
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
      return NextResponse.json({ error: "You cannot remove your own admin access" }, { status: 400 });
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

    // Perform removal from admin_users (does not delete underlying auth account)
    let removeQuery = supabaseServiceRole.from("admin_users").delete();
    if (id) {
      removeQuery = removeQuery.eq("id", id);
    } else {
      removeQuery = removeQuery.eq("email", targetEmail);
    }

    const { error: removeError } = await removeQuery;

    if (removeError) {
      return NextResponse.json({ error: `Failed to remove admin access: ${removeError.message}` }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Admin access removed successfully" });
  } catch (err) {
    console.error("Remove Admin API Error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
