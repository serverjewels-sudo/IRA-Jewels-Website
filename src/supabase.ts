import { createClient } from '@supabase/supabase-js';
import { Product, CartItem, OrderDetails } from './types';

const SUPABASE_URL = 'https://tvftfzeroallfzzzfvmi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_g3e9AlrqHT-ccZTM-oQvAw_ibUD9tQK';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// SQL Setup Schema guide for the user/admin
export const SQL_SCHEMA_GUIDE = `
-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  category_slug TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT NOT NULL,
  images TEXT[] NOT NULL,
  description TEXT NOT NULL,
  materials TEXT[] NOT NULL,
  details TEXT[] NOT NULL,
  care TEXT,
  rating NUMERIC DEFAULT 5.0,
  reviews_count NUMERIC DEFAULT 1,
  metals TEXT[] NOT NULL,
  sizes TEXT[] DEFAULT '{}',
  in_stock BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  bestseller BOOLEAN DEFAULT FALSE,
  sku TEXT NOT NULL,
  stock_quantity INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and add basic select and insert/update policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow all insert for anon" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update for anon" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Allow all delete for anon" ON public.products FOR DELETE USING (true);

-- 2. Create Cart Items Table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id TEXT PRIMARY KEY, -- combined combinationId
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  selected_metal TEXT NOT NULL,
  selected_size TEXT,
  engraving TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.cart_items FOR SELECT USING (true);
CREATE POLICY "Allow all insert for anon" ON public.cart_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update for anon" ON public.cart_items FOR UPDATE USING (true);
CREATE POLICY "Allow all delete for anon" ON public.cart_items FOR DELETE USING (true);

-- 3. Create Wishlist Table
CREATE TABLE IF NOT EXISTS public.wishlist (
  id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(product_id)
);

ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.wishlist FOR SELECT USING (true);
CREATE POLICY "Allow all insert for anon" ON public.wishlist FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update for anon" ON public.wishlist FOR UPDATE USING (true);
CREATE POLICY "Allow all delete for anon" ON public.wishlist FOR DELETE USING (true);

-- 4. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
  order_number TEXT PRIMARY KEY,
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_address TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_zip_code TEXT NOT NULL,
  customer_country TEXT NOT NULL,
  payment_cardholder_name TEXT,
  payment_card_number_masked TEXT,
  subtotal NUMERIC NOT NULL,
  shipping NUMERIC NOT NULL,
  tax NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  date TEXT NOT NULL,
  status TEXT DEFAULT 'Placed',
  items JSONB NOT NULL,
  utr_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Allow all insert for anon" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update for anon" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Allow all delete for anon" ON public.orders FOR DELETE USING (true);

-- 5. Create Admin Users Table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and add basic select & insert/update policies
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.admin_users FOR SELECT USING (true);
CREATE POLICY "Allow all insert for anon" ON public.admin_users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update for anon" ON public.admin_users FOR UPDATE USING (true);
CREATE POLICY "Allow all delete for anon" ON public.admin_users FOR DELETE USING (true);

-- 6. Create Bespoke Inquiries Table
CREATE TABLE IF NOT EXISTS public.bespoke_inquiries (
  id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_metal TEXT,
  preferred_gemstone TEXT,
  budget_range TEXT,
  timeline TEXT,
  consultation_type TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS and add basic select & insert/update policies
ALTER TABLE public.bespoke_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public select" ON public.bespoke_inquiries FOR SELECT USING (true);
CREATE POLICY "Allow all insert for anon" ON public.bespoke_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update for anon" ON public.bespoke_inquiries FOR UPDATE USING (true);
CREATE POLICY "Allow all delete for anon" ON public.bespoke_inquiries FOR DELETE USING (true);
`;

// Map product row helper standard db format
export function mapDbProduct(row: any): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    categorySlug: row.category_slug,
    price: Number(row.price),
    image: row.image,
    images: Array.isArray(row.images) ? row.images : [row.image],
    description: row.description,
    materials: Array.isArray(row.materials) ? row.materials : [],
    details: Array.isArray(row.details) ? row.details : [],
    care: row.care || '',
    rating: Number(row.rating || 5),
    reviewsCount: Number(row.reviews_count || 1),
    options: {
      metals: Array.isArray(row.metals) ? row.metals : ['18K Yellow Gold'],
      sizes: Array.isArray(row.sizes) ? row.sizes : undefined
    },
    inStock: !!row.in_stock,
    featured: !!row.featured,
    bestseller: !!row.bestseller,
    sku: row.sku,
    stockQuantity: row.stock_quantity !== undefined && row.stock_quantity !== null ? Number(row.stock_quantity) : 10
  };
}

// 1. PRODUCTS DB SERVICE
export async function getDbProducts(onlyInStock: boolean = false): Promise<{ products: Product[]; dbActive: boolean; error?: string }> {
  try {
    let query = supabase
      .from('products')
      .select('*');

    if (onlyInStock) {
      query = query.eq('in_stock', true);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      return { products: [], dbActive: false, error: error.message };
    }
    return {
      products: (data || []).map(mapDbProduct),
      dbActive: true
    };
  } catch (err: any) {
    return { products: [], dbActive: false, error: err.message };
  }
}

export async function addDbProduct(prod: Product): Promise<boolean> {
  try {
    const payload: any = {
      id: prod.id,
      name: prod.name,
      category: prod.category,
      category_slug: prod.categorySlug,
      price: prod.price,
      image: prod.image,
      images: prod.images,
      description: prod.description,
      materials: prod.materials,
      details: prod.details,
      care: prod.care,
      rating: prod.rating,
      reviews_count: prod.reviewsCount,
      metals: prod.options.metals,
      sizes: prod.options.sizes || [],
      in_stock: prod.inStock,
      featured: prod.featured,
      bestseller: prod.bestseller,
      sku: prod.sku,
      stock_quantity: prod.stockQuantity ?? 10
    };

    const { error } = await supabase
      .from('products')
      .insert(payload);

    if (error && error.message && error.message.toLowerCase().includes('column') && error.message.toLowerCase().includes('stock_quantity')) {
      delete payload.stock_quantity;
      const { error: retryError } = await supabase
        .from('products')
        .insert(payload);
      return !retryError;
    }
    return !error;
  } catch {
    return false;
  }
}

export async function deleteDbProduct(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function updateDbProductStock(id: string, inStock: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .update({ in_stock: inStock })
      .eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

export async function updateDbProduct(prod: Product): Promise<boolean> {
  try {
    const payload: any = {
      name: prod.name,
      category: prod.category,
      category_slug: prod.categorySlug,
      price: prod.price,
      image: prod.image,
      images: prod.images,
      description: prod.description,
      materials: prod.materials,
      details: prod.details,
      care: prod.care,
      rating: prod.rating,
      reviews_count: prod.reviewsCount,
      metals: prod.options.metals,
      sizes: prod.options.sizes || [],
      in_stock: prod.inStock,
      featured: prod.featured,
      bestseller: prod.bestseller,
      sku: prod.sku,
      stock_quantity: prod.stockQuantity ?? 10
    };

    const { error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', prod.id);

    if (error && error.message && error.message.toLowerCase().includes('column') && error.message.toLowerCase().includes('stock_quantity')) {
      delete payload.stock_quantity;
      const { error: retryError } = await supabase
        .from('products')
        .update(payload)
        .eq('id', prod.id);
      return !retryError;
    }
    return !error;
  } catch {
    return false;
  }
}

// 2. CART ITEMS SERVICE
export async function getDbCart(): Promise<CartItem[]> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('customer_id', session.user.id);
    if (error || !data) return [];
    
    return data.map(item => ({
      id: item.id,
      selectedMetal: item.selected_metal,
      selectedSize: item.selected_size || undefined,
      engraving: item.engraving || undefined,
      quantity: item.quantity,
      product: mapDbProduct(item.products)
    }));
  } catch {
    return [];
  }
}

export async function saveDbCartItem(item: CartItem): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    const { error } = await supabase
      .from('cart_items')
      .upsert({
        id: item.id,
        product_id: item.product.id,
        customer_id: session.user.id,
        selected_metal: item.selectedMetal,
        selected_size: item.selectedSize || null,
        engraving: item.engraving || null,
        quantity: item.quantity,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
    return !error;
  } catch {
    return false;
  }
}

export async function removeDbCartItem(id: string): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', id)
      .eq('customer_id', session.user.id);
    return !error;
  } catch {
    return false;
  }
}

export async function clearAllDbCart(): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('customer_id', session.user.id);
    return !error;
  } catch {
    return false;
  }
}

// 3. WISHLIST SERVICE
export async function getDbWishlist(): Promise<Product[]> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return [];

    const { data, error } = await supabase
      .from('wishlist')
      .select('*, products(*)')
      .eq('customer_id', session.user.id);
    if (error || !data) return [];
    return data.filter(d => d.products).map(d => mapDbProduct(d.products));
  } catch {
    return [];
  }
}

export async function saveDbWishlistItem(productId: string): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    const { error } = await supabase
      .from('wishlist')
      .upsert({ 
        product_id: productId, 
        customer_id: session.user.id 
      }, { onConflict: 'product_id,customer_id' });
    return !error;
  } catch {
    return false;
  }
}

export async function removeDbWishlistItem(productId: string): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return false;

    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('product_id', productId)
      .eq('customer_id', session.user.id);
    return !error;
  } catch {
    return false;
  }
}

// 4. ORDERS SERVICE
export async function getDbOrders(): Promise<OrderDetails[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(dbOrder => ({
      orderNumber: dbOrder.order_number,
      customerInfo: {
        firstName: dbOrder.customer_first_name,
        lastName: dbOrder.customer_last_name,
        email: dbOrder.customer_email,
        phone: dbOrder.customer_phone || '',
        address: dbOrder.customer_address,
        city: dbOrder.customer_city,
        zipCode: dbOrder.customer_zip_code,
        country: dbOrder.customer_country
      },
      paymentInfo: {
        cardholderName: dbOrder.payment_cardholder_name || '',
        cardNumberMasked: dbOrder.payment_card_number_masked || ''
      },
      subtotal: Number(dbOrder.subtotal),
      shipping: Number(dbOrder.shipping),
      tax: Number(dbOrder.tax),
      discount: Number(dbOrder.discount || 0),
      total: Number(dbOrder.total),
      date: dbOrder.date,
      status: dbOrder.status || 'Placed',
      items: dbOrder.items as unknown as CartItem[],
      utrNumber: dbOrder.utr_number || ''
    }));
  } catch {
    return [];
  }
}

export async function addDbOrder(order: OrderDetails): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    const customer_id = session?.user?.id || null;

    const { error } = await supabase
      .from('orders')
      .insert({
        order_number: order.orderNumber,
        customer_id: customer_id,
        customer_first_name: order.customerInfo.firstName,
        customer_last_name: order.customerInfo.lastName,
        customer_email: order.customerInfo.email,
        customer_phone: order.customerInfo.phone,
        customer_address: order.customerInfo.address,
        customer_city: order.customerInfo.city,
        customer_zip_code: order.customerInfo.zipCode,
        customer_country: order.customerInfo.country,
        payment_cardholder_name: order.paymentInfo.cardholderName,
        payment_card_number_masked: order.paymentInfo.cardNumberMasked,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        discount: order.discount,
        total: order.total,
        date: order.date,
        items: JSON.parse(JSON.stringify(order.items)), // sanitize or serialize
        utr_number: order.utrNumber || null
      });
    return !error;
  } catch {
    return false;
  }
}

export async function getAdminCustomers(): Promise<any[]> {
  try {
    const { data: allCustomers, error } = await supabase
      .from('orders')
      .select('customer_email, customer_first_name, customer_last_name');
    if (error) return [];
    return allCustomers || [];
  } catch {
    return [];
  }
}

export async function updateDbOrderStatus(orderNumber: string, status: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: status })
      .eq('order_number', orderNumber);
    return !error;
  } catch {
    return false;
  }
}

export async function checkIsAdminEmail(email: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('admin_users')
      .select('email')
      .eq('email', email.trim().toLowerCase());
    
    if (error) {
      console.warn('Error querying admin_users table in Supabase:', error.message);
      return false;
    }
    return !!(data && data.length > 0);
  } catch (err: any) {
    console.warn('Network or schema error verifying admin status:', err.message);
    return false;
  }
}

// 6. BESPOKE INQUIRIES SERVICE
export async function addDbBespokeInquiry(inquiry: {
  fullName: string;
  email: string;
  phone: string;
  preferredMetal: string;
  preferredGemstone: string;
  budgetRange: string;
  timeline: string;
  consultationType: string;
  message: string;
}): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('bespoke_inquiries')
      .insert({
        full_name: inquiry.fullName,
        email: inquiry.email,
        phone: inquiry.phone || null,
        preferred_metal: inquiry.preferredMetal,
        preferred_gemstone: inquiry.preferredGemstone,
        budget_range: inquiry.budgetRange,
        timeline: inquiry.timeline,
        consultation_type: inquiry.consultationType,
        message: inquiry.message
      });
    return !error;
  } catch {
    return false;
  }
}

export async function getDbBespokeInquiries(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('bespoke_inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(dbInq => ({
      id: dbInq.id,
      fullName: dbInq.full_name,
      email: dbInq.email,
      phone: dbInq.phone || '',
      preferredMetal: dbInq.preferred_metal || '',
      preferredGemstone: dbInq.preferred_gemstone || '',
      budgetRange: dbInq.budget_range || '',
      timeline: dbInq.timeline || '',
      consultationType: dbInq.consultation_type || '',
      message: dbInq.message || '',
      createdAt: dbInq.created_at
    }));
  } catch {
    return [];
  }
}

