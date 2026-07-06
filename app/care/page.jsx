import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Care Instructions | TATVAAN",
  description: "Keep your jewellery looking its best. Discover our daily care tips, home cleaning steps, storage advice, and professional servicing recommendations.",
};

export default function CarePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="w-full bg-[#2E3135] py-20 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-cormorant italic text-[40px] md:text-[52px] text-white leading-tight font-normal">
              Care Instructions
            </h1>
            <p className="font-inter text-[14px] md:text-[15px] text-[#CDB38B] tracking-[0.05em] font-light mt-3">
              Keep your jewellery looking its best
            </p>
          </div>
        </section>

        {/* SECTION 1 — Everyday Care Tips */}
        <section className="py-[60px] px-4 md:px-0">
          <div className="max-w-[860px] mx-auto">
            <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal text-center">
              Everyday Care Tips
            </h2>
            <div className="w-[60px] h-[1px] bg-[#CDB38B] mx-auto mt-4 mb-8"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 */}
              <div className="bg-[#F3F1EC] rounded-lg p-6 transition-all duration-300 hover:shadow-sm">
                <span className="font-inter text-[11px] text-[#CDB38B] tracking-[1.5px] font-semibold uppercase block mb-2">
                  01
                </span>
                <h3 className="font-cormorant text-[22px] text-[#2E3135] mb-3 font-normal">
                  Put On Last
                </h3>
                <p className="font-inter text-[15px] text-[#555] leading-relaxed font-light">
                  Always put your jewellery on after applying perfume, hairspray, and lotions.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-[#F3F1EC] rounded-lg p-6 transition-all duration-300 hover:shadow-sm">
                <span className="font-inter text-[11px] text-[#CDB38B] tracking-[1.5px] font-semibold uppercase block mb-2">
                  02
                </span>
                <h3 className="font-cormorant text-[22px] text-[#2E3135] mb-3 font-normal">
                  Remove First
                </h3>
                <p className="font-inter text-[15px] text-[#555] leading-relaxed font-light">
                  Take your jewellery off before showering, swimming, or exercising.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-[#F3F1EC] rounded-lg p-6 transition-all duration-300 hover:shadow-sm">
                <span className="font-inter text-[11px] text-[#CDB38B] tracking-[1.5px] font-semibold uppercase block mb-2">
                  03
                </span>
                <h3 className="font-cormorant text-[22px] text-[#2E3135] mb-3 font-normal">
                  Avoid Chemicals
                </h3>
                <p className="font-inter text-[15px] text-[#555] leading-relaxed font-light">
                  Keep your pieces away from chlorine, bleach, and household cleaning products.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-[#F3F1EC] rounded-lg p-6 transition-all duration-300 hover:shadow-sm">
                <span className="font-inter text-[11px] text-[#CDB38B] tracking-[1.5px] font-semibold uppercase block mb-2">
                  04
                </span>
                <h3 className="font-cormorant text-[22px] text-[#2E3135] mb-3 font-normal">
                  Handle With Care
                </h3>
                <p className="font-inter text-[15px] text-[#555] leading-relaxed font-light">
                  Remove rings before heavy manual work to prevent scratches and damage.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2 — Cleaning Your Jewellery */}
        <section className="py-[60px] bg-white border-t border-[#F3F1EC] px-4 md:px-0">
          <div className="max-w-[860px] mx-auto">
            <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal text-center">
              How to Clean at Home
            </h2>
            <div className="w-[60px] h-[1px] bg-[#CDB38B] mx-auto mt-4 mb-8"></div>

            <div className="bg-[#F3F1EC] rounded-lg p-6 md:p-8 mb-6">
              <ol className="space-y-4 font-inter text-[15px] text-[#555] font-light">
                <li className="flex items-start">
                  <span className="font-medium text-[#2E3135] mr-3 mt-0.5">Step 1:</span>
                  <span>Fill a small bowl with warm water and a few drops of mild dish soap.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium text-[#2E3135] mr-3 mt-0.5">Step 2:</span>
                  <span>Soak your jewellery for 10&ndash;15 minutes.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium text-[#2E3135] mr-3 mt-0.5">Step 3:</span>
                  <span>Gently scrub with a very soft toothbrush &mdash; especially around the setting.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium text-[#2E3135] mr-3 mt-0.5">Step 4:</span>
                  <span>Rinse thoroughly under warm running water.</span>
                </li>
                <li className="flex items-start">
                  <span className="font-medium text-[#2E3135] mr-3 mt-0.5">Step 5:</span>
                  <span>Pat dry with a soft lint-free cloth. Never use paper towels.</span>
                </li>
              </ol>
            </div>

            {/* Warning Box */}
            <div className="border border-[#CDB38B] rounded-lg p-6 bg-white text-center">
              <p className="font-inter text-[15px] text-[#2E3135] leading-relaxed font-normal max-w-3xl mx-auto">
                ⚠️ <strong className="text-[#2E3135] font-medium">Warning:</strong> Never use ultrasonic cleaners, toothpaste, or baking soda on your lab diamond jewellery.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3 — Storing Your Jewellery */}
        <section className="py-[60px] bg-white border-t border-[#F3F1EC] px-4 md:px-0">
          <div className="max-w-[860px] mx-auto">
            <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal text-center">
              Storing Your Jewellery
            </h2>
            <div className="w-[60px] h-[1px] bg-[#CDB38B] mx-auto mt-4 mb-8"></div>

            <div className="bg-[#F3F1EC] rounded-lg p-6 md:p-8">
              <ul className="space-y-4 font-inter text-[15px] text-[#555] font-light">
                <li className="flex items-start">
                  <span className="text-[#CDB38B] mr-3 font-semibold text-lg leading-none">&bull;</span>
                  <span>Keep pieces in individual pouches or compartments to prevent scratching.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#CDB38B] mr-3 font-semibold text-lg leading-none">&bull;</span>
                  <span>Store in a cool, dry place away from direct sunlight.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#CDB38B] mr-3 font-semibold text-lg leading-none">&bull;</span>
                  <span>Keep your TATVAAN box &mdash; it&apos;s designed to protect your pieces long-term.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 4 — Professional Servicing */}
        <section className="py-[60px] bg-white border-t border-[#F3F1EC] px-4 md:px-0">
          <div className="max-w-[860px] mx-auto text-center">
            <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal">
              Professional Servicing
            </h2>
            <div className="w-[60px] h-[1px] bg-[#CDB38B] mx-auto mt-4 mb-8"></div>

            <p className="font-inter text-[16px] text-[#555] leading-[1.8] font-light max-w-2xl mx-auto">
              We recommend having your jewellery professionally cleaned and checked every 12 months. A jeweller can inspect the settings, re-polish the metal, and ensure your diamonds are secure. Bring it back to us &mdash; we&apos;ll take care of it.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
