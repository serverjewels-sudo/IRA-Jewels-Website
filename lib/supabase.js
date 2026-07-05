import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Customer-facing browser client (singleton)
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Admin-facing browser client (singleton) with isolated session storage
export const supabaseAdmin = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storageKey: 'sb-admin-auth-token',
  },
});

// Server-side service role client for bypassing RLS
export const supabaseServiceRole = supabaseServiceKey
  ? createSupabaseClient(supabaseUrl, supabaseServiceKey)
  : null;

/**
 * Validates if the given email belongs to a registered admin user.
 * Bypasses RLS by querying via the supabaseServiceRole client.
 */
export async function isAdminUser(email) {
  if (!email || !supabaseServiceRole) return false;
  try {
    const { data, error } = await supabaseServiceRole
      .from("admin_users")
      .select("email")
      .eq("email", email)
      .maybeSingle();

    if (error || !data) {
      return false;
    }
    return true;
  } catch (err) {
    console.error("Error in isAdminUser check:", err);
    return false;
  }
}

/**
 * Maps Supabase product table columns to the format expected by the frontend.
 */
export function mapSupabaseProduct(p) {
  if (!p) return null;
  const priceVal = typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0;
  const comparePriceVal = p.compare_price ? (typeof p.compare_price === 'number' ? p.compare_price : parseFloat(p.compare_price) || 0) : null;
  const images = Array.isArray(p.images) ? p.images : (p.images ? [p.images] : []);
  const size_options = Array.isArray(p.size_options) ? p.size_options : [];
  const colour_options = Array.isArray(p.colour_options) ? p.colour_options : [];

  return {
    id: p.id,
    name: p.name,
    sku: p.sku,
    style_number: p.style_number,
    slug: p.slug,
    category: p.category,
    metal: `${p.karat || ''} ${p.metal_type || ''}`.trim(),
    metalType: p.metal_type,
    karat: p.karat,
    weight: p.weight_grams ? `${p.weight_grams} grams` : "",
    stoneType: p.stone_type,
    priceVal: priceVal,
    price: `₹${priceVal.toLocaleString("en-IN")}`,
    comparePriceVal: comparePriceVal,
    compare_price: comparePriceVal ? `₹${comparePriceVal.toLocaleString("en-IN")}` : null,
    dateAdded: p.created_at,
    image: images[0] || "",
    images: images,
    size_options: size_options,
    colour_options: colour_options,
    description: p.description,
    is_featured: p.is_featured,
    is_active: p.is_active,
    stock_quantity: p.stock_quantity ?? p.stock ?? 0,
    net_gold_weight: p.net_gold_weight,
    diamond_net_amount: p.diamond_net_amount,
    making_net_amount: p.making_net_amount,
    other_net_amount: p.other_net_amount,
    gst_percentage: p.gst_percentage,
  };
}
