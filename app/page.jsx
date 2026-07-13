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
  const { data: settings } = await supabaseAdmin.from('homepage_settings').select('visible_setting_styles').single();
  const visibleStyles = settings?.visible_setting_styles || [];
  
  // Filter SETTING_STYLES based on whether the name or slug is in the visibleStyles array
  const filteredStyles = SETTING_STYLES.filter(style => 
    visibleStyles.includes(style.slug) || visibleStyles.includes(style.name)
  );

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
