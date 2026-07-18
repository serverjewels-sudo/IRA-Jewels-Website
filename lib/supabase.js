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
  
  const raw_colour_options = Array.isArray(p.colour_options) ? p.colour_options : [];
  const colour_options = [];
  const colour_swatches = {};

  raw_colour_options.forEach((opt) => {
    if (typeof opt === 'string' && opt.includes('|')) {
      const [name, hex] = opt.split('|');
      const cleanName = name.trim();
      colour_options.push(cleanName);
      if (hex && hex.trim()) {
        colour_swatches[cleanName] = hex.trim();
      }
    } else if (typeof opt === 'string') {
      const cleanName = opt.trim();
      colour_options.push(cleanName);
    }
  });

  return {
    ...p, // Pass all raw database fields through automatically

    // Explicitly override ONLY fields that need formatting, fallbacks, or safety checks
    collection_ids: Array.isArray(p.collection_ids) ? p.collection_ids : [],
    colour_variants: Array.isArray(p.colour_variants) ? p.colour_variants : [],
    diamond_price_matrix: Array.isArray(p.diamond_price_matrix) ? p.diamond_price_matrix : [],
    available_karats: Array.isArray(p.available_karats) ? p.available_karats : [],
    size_weight_variants: Array.isArray(p.size_weight_variants) ? p.size_weight_variants : [], // Immediate Fix
    
    // CamelCase mappings for legacy frontend components
    metalType: p.metal_type,
    stoneType: p.stone_type,
    
    // Formatting & Fallbacks
    metal: `${p.karat || ''} ${p.metal_type || ''}`.trim(),
    weight: p.weight_grams ? `${p.weight_grams} grams` : "",
    dateAdded: p.created_at,
    
    // Price formatting
    priceVal: priceVal,
    price: `₹${priceVal.toLocaleString("en-IN")}`,
    comparePriceVal: comparePriceVal,
    compare_price: comparePriceVal ? `₹${comparePriceVal.toLocaleString("en-IN")}` : null,
    
    // Images & Display Options
    image: images[0] || "",
    images: images,
    size_options: size_options,
    colour_options: colour_options,
    colour_swatches: colour_swatches,
    
    // Null safety
    stock_quantity: p.stock_quantity ?? p.stock ?? 0,
    video_url: p.video_url || null,
  };
}
