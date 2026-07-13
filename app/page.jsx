// build refresh
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Banner from "@/components/home/Banner";
import ShopCarousel from "@/components/home/ShopCarousel";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/layout/Footer";
import { supabaseAdmin } from "@/lib/supabase";
import { CATEGORIES, SETTING_STYLES, DIAMOND_SHAPES } from "@/lib/constants";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // Fetch setting_style and colour_variants from all active products to ensure we only show styles with real inventory
  const { data: activeProducts } = await supabaseAdmin
    .from('products')
    .select('setting_style, colour_variants')
    .eq('is_active', true);
    
  const activeStyleNames = new Set(
    activeProducts?.map(p => p.setting_style).filter(Boolean) || []
  );

  // Filter SETTING_STYLES: Must have at least one active product
  const filteredStyles = SETTING_STYLES.filter(style => {
    return activeStyleNames.has(style.name) || activeStyleNames.has(style.slug);
  });

  // Extract unique shape_ids from colour_variants
  const activeShapeIds = new Set();
  if (activeProducts) {
    activeProducts.forEach(p => {
      if (p.colour_variants && Array.isArray(p.colour_variants)) {
        p.colour_variants.forEach(v => {
          if (v.shapes && Array.isArray(v.shapes)) {
            v.shapes.forEach(s => {
              if (s.shape_id) activeShapeIds.add(s.shape_id.toLowerCase().trim());
            });
          }
        });
      }
    });
  }

  // Filter DIAMOND_SHAPES: Must have at least one active product
  const filteredDiamondShapes = DIAMOND_SHAPES.filter(shape => {
    return activeShapeIds.has(shape.slug.toLowerCase());
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Banner />
        
        <ShopCarousel 
          title="Shop by Category"
          subtitle="Explore the Collection"
          items={CATEGORIES}
          filterKey="category"
        />
        
        {filteredStyles.length > 0 && (
          <ShopCarousel 
            title="Shop by Style"
            subtitle="Find Your Perfect Setting"
            items={filteredStyles}
            filterKey="setting_style"
          />
        )}

        {filteredDiamondShapes.length > 0 && (
          <ShopCarousel 
            title="Shop by Diamond"
            subtitle="Find Your Perfect Cut"
            items={filteredDiamondShapes}
            filterKey="shape"
          />
        )}

        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
