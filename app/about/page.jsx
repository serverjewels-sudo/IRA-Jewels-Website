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
              Every Piece, A Promise.
            </h1>
            <p className="font-inter text-[14px] sm:text-[16px] text-[#CDB38B] tracking-[0.05em] mt-4 font-light">
              Some jewellery is worn. Some becomes a part of your life. At Tatvaan, we believe jewellery is more than a beautiful accessory. It is a symbol of love, a celebration of milestones, and a reflection of the moments that matter most. Every piece carries a story—of a promise made, a dream fulfilled, a new beginning, or a memory that deserves to last forever. That belief inspires everything we create. Tatvaan brings together timeless design, exceptional craftsmanship, and the brilliance of premium lab-grown diamonds to create jewellery that feels meaningful today and remains beautiful for generations. For us, luxury is not about owning more. It is about choosing something that truly lasts.
            </p>
          </div>
        </section>

        {/* SECTION 2 — Brand Mission */}
        <section className="bg-white py-[80px] px-6 sm:px-8 lg:px-12" id="brand-mission">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left side: beautiful jewellery image */}
            <div className="w-full h-full relative aspect-square sm:aspect-[4/3] md:aspect-square overflow-hidden rounded-[8px]">
              <img
                src="https://labs.google/fx/api/og-image/shared/32fb1849-b810-46c3-b367-b4f5f20a2b4b"
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
                Our Story
              </h2>
              <p className="font-inter text-[15px] sm:text-[16px] text-[#555] leading-[1.8] font-light">
                Tatvaan was born from a simple belief. The future of fine jewellery deserves a new definition of luxury. As the world evolves, so do the values of those who wear fine jewellery. Today, people seek beauty with meaning, quality with honesty, and craftsmanship without compromise. Tatvaan was created for those who believe luxury should reflect not only elegance, but also authenticity and purpose. Our name is inspired by the Sanskrit word Tatva, meaning the true essence. It reminds us that genuine luxury is never defined by appearance alone. It is built through integrity, craftsmanship, and the emotions every piece carries. Every creation begins with a promise—to craft jewellery worthy of life&apos;s most meaningful moments.
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
              <div id="craftsmanship" className="bg-white rounded-[12px] p-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col items-start transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1">
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
                  Craftsmanship
                </h3>
                <p className="font-inter text-[15px] text-[#555] leading-relaxed font-light">
                  Every Tatvaan creation begins with extraordinary attention to detail. Our skilled artisans combine years of experience with modern techniques to transform precious materials into jewellery that is refined, elegant, and made to last. From the careful selection of every diamond to the final polish, every step is guided by patience, precision, and an uncompromising commitment to excellence.
                </p>
              </div>

              {/* Card 2 */}
              <div id="our-diamonds" className="bg-white rounded-[12px] p-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col items-start transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1">
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
                  Our Diamonds
                </h3>
                <p className="font-inter text-[15px] text-[#555] leading-relaxed font-light">
                  Every Tatvaan diamond is a real diamond. Our lab-grown diamonds possess the same physical, chemical, and optical properties as mined diamonds, offering the same exceptional brilliance, fire, sparkle, and durability. Every diamond is carefully selected and IGI certified, ensuring it meets our uncompromising standards before becoming part of a Tatvaan creation.
                </p>
              </div>

              {/* Card 3 */}
              <div id="our-promise" className="bg-white rounded-[12px] p-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col items-start transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:-translate-y-1">
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
                  Our Promise
                </h3>
                <ul className="font-inter text-[15px] text-[#555] leading-relaxed font-light list-disc pl-5">
                  <li>Timeless designs that remain elegant for years to come</li>
                  <li>Premium IGI-certified lab-grown diamonds selected for their exceptional beauty and quality</li>
                  <li>Craftsmanship that values every detail</li>
                  <li>Honesty, transparency, and uncompromising standards</li>
                  <li>Jewellery that becomes part of your story</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — Founder Note */}
        <section className="bg-white py-[80px] px-6" id="founder-note">
          <div className="max-w-[680px] mx-auto text-center flex flex-col items-center">
            <span className="font-inter text-[11px] text-[#CDB38B] tracking-[2px] font-semibold uppercase block mb-6">
              OUR PHILOSOPHY
            </span>
            <span className="text-[#CDB38B] text-4xl font-serif leading-none mb-2" aria-hidden="true">&ldquo;</span>
            <blockquote className="font-cormorant italic text-[24px] sm:text-[28px] text-[#2E3135] leading-relaxed mb-6 font-normal">
              Because the true value of jewellery is never measured by its sparkle alone. It is measured by the memories it holds, the emotions it represents, and the promises it keeps.
            </blockquote>
            <cite className="font-inter text-[14px] text-[#888] font-normal not-italic">
              &mdash; Tatvaan
            </cite>
          </div>
        </section>

        {/* SECTION 5 — CTA Banner */}
        <section className="w-full bg-[#2E3135] py-[80px] px-6 text-center" id="cta-banner">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-cormorant text-[34px] sm:text-[40px] text-white font-normal mb-8">
              Every Piece, A Promise.
            </h2>
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
