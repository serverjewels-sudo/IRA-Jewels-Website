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

// Helper to generate a unique slug
async function generateUniqueSlug(baseSlug, currentId = null) {
  let uniqueSlug = baseSlug;
  let counter = 2;
  
  while (true) {
    let query = supabaseServiceRole
      .from("collections")
      .select("id")
      .eq("slug", uniqueSlug)
      .limit(1);
      
    if (currentId) {
      query = query.neq("id", currentId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    if (!data || data.length === 0) {
      break;
    }
    
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return uniqueSlug;
}

export async function GET(req) {
  const user = await getAdminUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const checkPromise = isAdminUser(user.email);

  const dataPromise = id
    ? supabaseServiceRole.from("collections").select("*").eq("id", id).single()
    : supabaseServiceRole.from("collections").select("*").order("created_at", { ascending: false });

  const [check, dataResult] = await Promise.all([checkPromise, dataPromise]);

  if (!check) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  const { data, error } = dataResult;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
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
    const body = await req.json();
    
    // Auto-generate or guarantee unique slug
    let baseSlug = body.slug;
    if (!baseSlug && body.name) {
      baseSlug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    }
    if (baseSlug) {
      body.slug = await generateUniqueSlug(baseSlug);
    }

    const { data, error } = await supabaseServiceRole
      .from("collections")
      .insert([body])
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
    const { id, ...updateData } = body;
    if (!id) {
      return NextResponse.json({ error: "Collection ID is required" }, { status: 400 });
    }

    // Auto-generate or guarantee unique slug
    let baseSlug = updateData.slug;
    if (!baseSlug && updateData.name) {
      baseSlug = updateData.name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
    }
    if (baseSlug) {
      updateData.slug = await generateUniqueSlug(baseSlug, id);
    }

    const { data, error } = await supabaseServiceRole
      .from("collections")
      .update(updateData)
      .eq("id", id)
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

export async function DELETE(req) {
  const user = await getAdminUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const check = await isAdminUser(user.email);
  if (!check) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Collection ID is required" }, { status: 400 });
  }

  // First delete the collection
  const { error: deleteError } = await supabaseServiceRole
    .from("collections")
    .delete()
    .eq("id", id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  // Then update products to remove the collection ID
  try {
    // In Supabase SQL we can do: UPDATE products SET collection_ids = array_remove(collection_ids, id)
    // Through RPC this is easiest. Since we don't know if they have an RPC, we'll fetch products containing the ID and update them.
    const { data: productsWithCollection, error: fetchError } = await supabaseServiceRole
      .from("products")
      .select("id, collection_ids")
      .contains("collection_ids", [id]);

    if (!fetchError && productsWithCollection && productsWithCollection.length > 0) {
      for (const product of productsWithCollection) {
        const newCollectionIds = (product.collection_ids || []).filter(cId => cId !== id);
        await supabaseServiceRole
          .from("products")
          .update({ collection_ids: newCollectionIds })
          .eq("id", product.id);
      }
    }
  } catch (e) {
    console.error("Error removing collection from products:", e);
    // Non-fatal, the collection was deleted.
  }

  return NextResponse.json({ success: true });
}
