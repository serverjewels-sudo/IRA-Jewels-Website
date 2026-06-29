import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabaseServer, mapSupabaseProduct } from "@/lib/supabase";
import ProductGallery from "@/components/product/ProductGallery";
import AddToCartButton from "@/components/product/AddToCartButton";

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }) {
  const { slug } = params;
  
  try {
    const { data: product, error } = await supabaseServer
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error || !product) {
      return <ProductNotFound />;
    }
    
    const mappedProduct = mapSupabaseProduct(product);
    return <ProductDetail product={mappedProduct} />;
    
  } catch (err) {
    console.error('[ProductPage] Error:', err);
    return <ProductNotFound />;
  }
}

function ProductDetail({ product }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#2E3135]">
      <Navbar />

      <main className="flex-grow py-8 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb at top of page */}
        <nav className="flex items-center space-x-2 font-inter text-[13px] text-[#888888] mb-8 md:mb-12">
          <Link href="/" className="hover:text-[#CDB38B] transition-colors duration-300">
            Home
          </Link>
          <span className="text-[#888888]/40">&gt;</span>
          <Link href="/shop" className="hover:text-[#CDB38B] transition-colors duration-300">
            Shop
          </Link>
          <span className="text-[#888888]/40">&gt;</span>
          <span className="text-[#2E3135] font-light truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Page Layout: Desktop side-by-side 55%/45%, Mobile single column */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* LEFT COLUMN: Image Gallery (55% width on desktop) */}
          <ProductGallery product={product} />

          {/* RIGHT COLUMN: Product Information (45% width on desktop) */}
          <div className="w-full lg:w-[45%] flex flex-col">
            {/* 1. Category tag */}
            <span className="font-inter font-medium text-[11px] tracking-[1.5px] uppercase text-[#CDB38B] mb-2 block">
              {product.category}
            </span>

            {/* 2. Product name */}
            <h1 className="font-cormorant font-normal text-[36px] sm:text-[40px] text-[#2E3135] leading-tight mb-4">
              {product.name}
            </h1>

            {/* 3. Price */}
            <div className="flex items-baseline mb-6">
              <span className="font-inter font-medium text-[22px] text-[#2E3135]">
                {product.price}
              </span>
              {product.compare_price && (
                <span className="font-inter font-light text-[16px] text-[#999999] line-through ml-3">
                  {product.compare_price}
                </span>
              )}
            </div>

            {/* 4. Thin divider line */}
            <div className="w-10 h-[1px] bg-[#CDB38B] my-4"></div>

            {/* 5. Details row */}
            <p className="font-inter font-light text-[14px] text-[#666666] mb-8">
              {product.karat} {product.metalType} &nbsp;•&nbsp; {product.weight} &nbsp;•&nbsp; {product.stoneType}
            </p>

            {/* 6, 7, 8, 9. Interactive Options & Actions Component */}
            <AddToCartButton product={product} />

            {/* 10. Description Section */}
            <div className="mt-8 pt-8 border-t border-[#F3F1EC]">
              <span className="font-inter font-medium text-[12px] tracking-[1.5px] uppercase text-[#2E3135] mb-3 block">
                Description
              </span>
              <p className="font-inter font-normal text-[15px] leading-[1.8] text-[#2E3135]">
                {product.description}
              </p>
            </div>

            {/* 11. Certification Line */}
            <div className="mt-8 pt-6 border-t border-[#F3F1EC]">
              <p className="font-inter font-light text-[13px] text-[#888888] leading-relaxed">
                ✦ Certified lab-grown diamond &nbsp;•&nbsp; Free delivery across India &nbsp;•&nbsp; Hallmarked
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function ProductNotFound() {
  return (
    <div style={{minHeight:'60vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', fontFamily:'Inter'}}>
      <h2 style={{fontFamily:'Cormorant Garamond', fontSize:'36px', color:'#2E3135', marginBottom:'12px'}}>Product Not Found</h2>
      <p style={{color:'#888', fontSize:'15px', marginBottom:'28px'}}>This product may no longer be available.</p>
      <a href="/shop" style={{background:'#2E3135', color:'#fff', padding:'14px 36px', fontSize:'12px', letterSpacing:'2px', textDecoration:'none', fontFamily:'Inter'}}>BACK TO SHOP</a>
    </div>
  );
}
