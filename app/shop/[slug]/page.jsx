import { supabase, mapSupabaseProduct } from "@/lib/supabase";
import ProductDetailClient from "./ProductDetailClient";

export const dynamic = 'force-dynamic';

export default async function ProductDetailPage({ params }) {
  const { slug } = params;

  try {
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !product) {
      return (
        <div style={{textAlign:'center', padding:'80px 20px', fontFamily:'Inter'}}>
          <h2 style={{fontFamily:'Cormorant Garamond', fontSize:'36px', color:'#2E3135', marginBottom:'12px'}}>Product Not Found</h2>
          <p style={{color:'#888', fontSize:'15px'}}>This product may no longer be available.</p>
          <a href="/shop" style={{display:'inline-block', marginTop:'28px', background:'#2E3135', color:'#fff', padding:'14px 36px', fontSize:'12px', letterSpacing:'2px', textDecoration:'none'}}>BACK TO SHOP</a>
        </div>
      );
    }

    const mappedProduct = mapSupabaseProduct(product);
    return <ProductDetailClient product={mappedProduct} slug={slug} />;
  } catch (err) {
    console.error('[ProductPage] Error:', err);
    return (
      <div style={{textAlign:'center', padding:'80px 20px', fontFamily:'Inter'}}>
        <h2 style={{fontFamily:'Cormorant Garamond', fontSize:'36px', color:'#2E3135', marginBottom:'12px'}}>Product Not Found</h2>
        <p style={{color:'#888', fontSize:'15px'}}>This product may no longer be available.</p>
        <a href="/shop" style={{display:'inline-block', marginTop:'28px', background:'#2E3135', color:'#fff', padding:'14px 36px', fontSize:'12px', letterSpacing:'2px', textDecoration:'none'}}>BACK TO SHOP</a>
      </div>
    );
  }
}
