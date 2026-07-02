import { createBrowserClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// 1. Browser client creator (for client components)
export const createClient = () => createBrowserClient(
  supabaseUrl,
  supabaseAnonKey
)

// 2. Server client (for server components — used in product detail, order pages)
export const supabaseServer = createSupabaseClient(
  supabaseUrl,
  supabaseAnonKey
)

// Browser/Anon client for backward compatibility
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey);

// Admin client for bypass RLS and full write operations
export const supabaseAdmin = supabaseServiceKey
  ? createSupabaseClient(supabaseUrl, supabaseServiceKey)
  : null;

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
  };
}
