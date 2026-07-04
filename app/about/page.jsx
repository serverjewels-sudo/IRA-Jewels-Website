import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export const metadata = {
  title: "Our Story | TATVAAN",
  description: "Born in Surat. Built for the modern woman. Discover our journey, our lab-grown diamonds, and our commitment to ethical, everyday luxury.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* SECTION 1 — Hero Banner */}
        <section className="w-full bg-[#2E3135] py-[100px] text-center px-4" id="about-hero">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-cormorant italic text-[48px] sm:text-[64px] text-white leading-tight font-normal">
              Our Story
            </h1>
            <p className="font-inter text-[14px] sm:text-[16px] text-[#CDB38B] tracking-[0.05em] mt-4 font-light">
              Born in Surat. Built for the modern woman.
            </p>
          </div>
        </section>

        {/* SECTION 2 — Brand Mission */}
        <section className="bg-white py-[80px] px-6 sm:px-8 lg:px-12" id="brand-mission">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left side: beautiful jewellery image */}
            <div className="w-full h-full relative aspect-square sm:aspect-[4/3] md:aspect-square overflow-hidden rounded-[8px]">
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop"
                alt="Fine lab-grown diamond jewellery"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
            {/* Right side: text block */}
            <div className="flex flex-col justify-center">
              <span className="font-inter text-[11px] text-[#CDB38B] tracking-[2px] font-semibold uppercase block mb-3">
                WHO WE ARE
              </span>
              <h2 className="font-cormorant text-[32px] sm:text-[36px] text-[#2E3135] leading-tight font-normal mb-5">
                Fine Jewellery for Everyday Life
              </h2>
              <p className="font-inter text-[15px] sm:text-[16px] text-[#555] leading-[1.8] font-light">
                TATVAAN was founded with one belief &mdash; that fine jewellery should not wait for special occasions. Every woman deserves to wear something beautiful every day. We create lab-grown diamond jewellery that is ethical, affordable, and crafted for real life.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3 — Three Values */}
        <section className="bg-[#F3F1EC] py-[80px] px-6 sm:px-8 lg:px-12" id="our-values">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-cormorant text-[36px] sm:text-[40px] text-[#2E3135] text-center mb-12 font-normal">
              Why TATVAAN?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-white rounded-[12px] p-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col items-start transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1">
                <div className="flex items-center justify-center mb-6">
                  {/* Diamond SVG icon */}
                  <svg 
                    className="w-8 h-8 text-[#CDB38B]" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M6 3h12l4 6-10 13L2 9z" />
                    <path d="M11 3 8 9l4 13 4-13-3-6" />
                    <path d="M2 9h20" />
                  </svg>
                </div>
                <h3 className="font-cormorant text-[22px] text-[#2E3135] mb-3 font-normal">
                  Lab-Grown Diamonds
                </h3>
                <p className="font-inter text-[15px] text-[#555] leading-relaxed font-light">
                  Every diamond we use is grown in a laboratory &mdash; chemically identical to mined diamonds, but ethically sourced and conflict-free.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-white rounded-[12px] p-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col items-start transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1">
                <div className="flex items-center justify-center mb-6">
                  {/* Sparkle SVG icon */}
                  <svg 
                    className="w-8 h-8 text-[#CDB38B]" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
                    <path d="m5 3 1 2.5L8.5 6 6 7 5 9.5 4 7 1.5 6 4 5Z" />
                    <path d="m19 17 1 2.5 2.5.5-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1Z" />
                  </svg>
                </div>
                <h3 className="font-cormorant text-[22px] text-[#2E3135] mb-3 font-normal">
                  Everyday Luxury
                </h3>
                <p className="font-inter text-[15px] text-[#555] leading-relaxed font-light">
                  We design jewellery for real life &mdash; pieces you can wear to work, to dinner, and everywhere in between. Luxury that doesn&apos;t live in a box.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-white rounded-[12px] p-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col items-start transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1">
                <div className="flex items-center justify-center mb-6">
                  {/* Shield Check SVG icon */}
                  <svg 
                    className="w-8 h-8 text-[#CDB38B]" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="font-cormorant text-[22px] text-[#2E3135] mb-3 font-normal">
                  Made to Last
                </h3>
                <p className="font-inter text-[15px] text-[#555] leading-relaxed font-light">
                  Each piece is crafted with precision and care, using the finest metals and certified lab-grown diamonds. Built to be worn every day, for a lifetime.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — Founder Note */}
        <section className="bg-white py-[80px] px-6" id="founder-note">
          <div className="max-w-[680px] mx-auto text-center flex flex-col items-center">
            <span className="font-inter text-[11px] text-[#CDB38B] tracking-[2px] font-semibold uppercase block mb-6">
              A NOTE FROM OUR FOUNDER
            </span>
            <span className="text-[#CDB38B] text-4xl font-serif leading-none mb-2" aria-hidden="true">&ldquo;</span>
            <blockquote className="font-cormorant italic text-[24px] sm:text-[28px] text-[#2E3135] leading-relaxed mb-6 font-normal">
              We started TATVAAN because we believed every woman deserves to feel luxurious &mdash; not just on her wedding day, but every single day.
            </blockquote>
            <cite className="font-inter text-[14px] text-[#888] font-normal not-italic">
              &mdash; Pavasiya Lakshya, Founder
            </cite>
          </div>
        </section>

        {/* SECTION 5 — CTA Banner */}
        <section className="w-full bg-[#2E3135] py-[80px] px-6 text-center" id="cta-banner">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-cormorant text-[34px] sm:text-[40px] text-white font-normal mb-4">
              Explore Our Collection
            </h2>
            <p className="font-inter text-[15px] sm:text-[16px] text-[#CDB38B] tracking-wide mb-8 font-light max-w-lg mx-auto">
              Lab-grown diamonds, crafted for everyday luxury. Starting from ₹8,000.
            </p>
            <Link
              href="/shop"
              id="cta-shop-btn"
              className="inline-block bg-white text-[#2E3135] hover:bg-[#F3F1EC] font-inter font-medium text-[13px] tracking-[2px] px-8 py-4 transition-all duration-300 rounded-[2px]"
            >
              SHOP NOW
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
