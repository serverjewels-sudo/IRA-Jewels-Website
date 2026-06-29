import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import Banner from "@/components/home/Banner";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Banner />
        <FeaturedProducts />
        <Testimonials />
      </main>
      <Footer />
    </div>
  );
}

