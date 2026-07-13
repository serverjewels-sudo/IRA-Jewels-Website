// build refresh
import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Banner from "@/components/home/Banner";
import ShopCarousel from "@/components/home/ShopCarousel";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/layout/Footer";
import { supabaseAdmin } from "@/lib/supabase";
import { CATEGORIES, SETTING_STYLES } from "@/lib/constants";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  // Fetch setting_style from all active products to ensure we only show styles with real inventory
  const { data: activeProducts } = await supabaseAdmin
    .from('products')
    .select('setting_style')
    .eq('is_active', true);
    
  const activeStyleNames = new Set(
    activeProducts?.map(p => p.setting_style).filter(Boolean) || []
  );

  // Filter SETTING_STYLES: Must have at least one active product
  const filteredStyles = SETTING_STYLES.filter(style => {
    return activeStyleNames.has(style.name) || activeStyleNames.has(style.slug);
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

        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}
