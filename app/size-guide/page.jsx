import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Size Guide | IRA Jewels",
  description: "Find your perfect fit. Use our comprehensive size guide to determine the correct size for rings, bracelets, bangles, and necklaces.",
};

export default function SizeGuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="w-full bg-[#2E3135] py-20 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-cormorant italic text-[40px] md:text-[52px] text-white leading-tight font-normal">
              Size Guide
            </h1>
            <p className="font-inter text-[14px] md:text-[15px] text-[#CDB38B] tracking-[0.05em] font-light mt-3">
              Find your perfect fit
            </p>
          </div>
        </section>

        {/* SECTION 1 — Ring Sizes */}
        <section className="py-[60px] px-4 md:px-0">
          <div className="max-w-[860px] mx-auto">
            <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal text-center">
              Ring Sizes
            </h2>
            <div className="w-[60px] h-[1px] bg-[#CDB38B] mx-auto mt-4 mb-8"></div>
            
            <p className="font-inter text-[16px] text-[#555] leading-[1.8] font-light text-center mb-8">
              Not sure of your ring size? Use our guide below to find your perfect fit. If you&apos;re between sizes, we recommend choosing the larger size.
            </p>

            <div className="overflow-x-auto border border-[#E5E7EB] rounded-lg">
              <table className="w-full text-left border-collapse font-inter text-[14px]">
                <thead>
                  <tr className="bg-[#2E3135] text-white">
                    <th className="py-4 px-6 font-medium">India Size</th>
                    <th className="py-4 px-6 font-medium">US Size</th>
                    <th className="py-4 px-6 font-medium">Diameter (mm)</th>
                  </tr>
                </thead>
                <tbody className="text-[#555]">
                  <tr className="bg-white border-b border-[#E5E7EB]">
                    <td className="py-4 px-6">India 6</td>
                    <td className="py-4 px-6">US 3</td>
                    <td className="py-4 px-6">14.1mm</td>
                  </tr>
                  <tr className="bg-[#F3F1EC] border-b border-[#E5E7EB]">
                    <td className="py-4 px-6">India 8</td>
                    <td className="py-4 px-6">US 4</td>
                    <td className="py-4 px-6">14.8mm</td>
                  </tr>
                  <tr className="bg-white border-b border-[#E5E7EB]">
                    <td className="py-4 px-6">India 10</td>
                    <td className="py-4 px-6">US 5</td>
                    <td className="py-4 px-6">15.7mm</td>
                  </tr>
                  <tr className="bg-[#F3F1EC] border-b border-[#E5E7EB]">
                    <td className="py-4 px-6">India 12</td>
                    <td className="py-4 px-6">US 6</td>
                    <td className="py-4 px-6">16.5mm</td>
                  </tr>
                  <tr className="bg-white border-b border-[#E5E7EB]">
                    <td className="py-4 px-6">India 14</td>
                    <td className="py-4 px-6">US 7</td>
                    <td className="py-4 px-6">17.3mm</td>
                  </tr>
                  <tr className="bg-[#F3F1EC] border-b border-[#E5E7EB]">
                    <td className="py-4 px-6">India 16</td>
                    <td className="py-4 px-6">US 8</td>
                    <td className="py-4 px-6">18.2mm</td>
                  </tr>
                  <tr className="bg-white border-b border-[#E5E7EB]">
                    <td className="py-4 px-6">India 18</td>
                    <td className="py-4 px-6">US 9</td>
                    <td className="py-4 px-6">19.0mm</td>
                  </tr>
                  <tr className="bg-[#F3F1EC]">
                    <td className="py-4 px-6">India 20</td>
                    <td className="py-4 px-6">US 10</td>
                    <td className="py-4 px-6">19.8mm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 2 — How to Measure at Home */}
        <section className="py-[60px] bg-white border-t border-[#F3F1EC] px-4 md:px-0">
          <div className="max-w-[860px] mx-auto">
            <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal text-center">
              How to Measure at Home
            </h2>
            <div className="w-[60px] h-[1px] bg-[#CDB38B] mx-auto mt-4 mb-8"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Step 1 */}
              <div className="bg-[#F3F1EC] rounded-lg p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-sm">
                <div>
                  <span className="font-inter text-[11px] text-[#CDB38B] tracking-[1.5px] font-semibold uppercase block mb-2">
                    Step 01
                  </span>
                  <h3 className="font-cormorant text-[20px] text-[#2E3135] font-medium mb-3">
                    Use a Strip of Paper
                  </h3>
                  <p className="font-inter text-[14px] text-[#555] leading-relaxed font-light">
                    Wrap a thin strip of paper around your finger. Mark where it overlaps.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-[#F3F1EC] rounded-lg p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-sm">
                <div>
                  <span className="font-inter text-[11px] text-[#CDB38B] tracking-[1.5px] font-semibold uppercase block mb-2">
                    Step 02
                  </span>
                  <h3 className="font-cormorant text-[20px] text-[#2E3135] font-medium mb-3">
                    Measure the Length
                  </h3>
                  <p className="font-inter text-[14px] text-[#555] leading-relaxed font-light">
                    Lay the paper flat and measure in millimetres with a ruler.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-[#F3F1EC] rounded-lg p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-sm">
                <div>
                  <span className="font-inter text-[11px] text-[#CDB38B] tracking-[1.5px] font-semibold uppercase block mb-2">
                    Step 03
                  </span>
                  <h3 className="font-cormorant text-[20px] text-[#2E3135] font-medium mb-3">
                    Find Your Size
                  </h3>
                  <p className="font-inter text-[14px] text-[#555] leading-relaxed font-light">
                    Match your measurement to the diameter column in the table above.
                  </p>
                </div>
              </div>
            </div>

            {/* Tip Box */}
            <div className="bg-[#F3F1EC] rounded-lg p-6 border-l-4 border-[#CDB38B]">
              <p className="font-inter text-[15px] text-[#555] leading-relaxed font-normal">
                💡 <strong className="text-[#2E3135] font-medium">Tip:</strong> Measure your finger in the evening &mdash; fingers are slightly larger later in the day.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3 — Bangle & Bracelet Sizes */}
        <section className="py-[60px] bg-white border-t border-[#F3F1EC] px-4 md:px-0">
          <div className="max-w-[860px] mx-auto">
            <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal text-center">
              Bangle & Bracelet Sizes
            </h2>
            <div className="w-[60px] h-[1px] bg-[#CDB38B] mx-auto mt-4 mb-8"></div>

            <div className="overflow-x-auto border border-[#E5E7EB] rounded-lg">
              <table className="w-full text-left border-collapse font-inter text-[14px]">
                <thead>
                  <tr className="bg-[#2E3135] text-white">
                    <th className="py-4 px-6 font-medium">Size</th>
                    <th className="py-4 px-6 font-medium">Inner Diameter</th>
                    <th className="py-4 px-6 font-medium">Fits Wrist Up To</th>
                  </tr>
                </thead>
                <tbody className="text-[#555]">
                  <tr className="bg-white border-b border-[#E5E7EB]">
                    <td className="py-4 px-6 font-medium text-[#2E3135]">Small (S)</td>
                    <td className="py-4 px-6">58mm</td>
                    <td className="py-4 px-6">6.5 inches</td>
                  </tr>
                  <tr className="bg-[#F3F1EC] border-b border-[#E5E7EB]">
                    <td className="py-4 px-6 font-medium text-[#2E3135]">Medium (M)</td>
                    <td className="py-4 px-6">60mm</td>
                    <td className="py-4 px-6">7 inches</td>
                  </tr>
                  <tr className="bg-white border-b border-[#E5E7EB]">
                    <td className="py-4 px-6 font-medium text-[#2E3135]">Large (L)</td>
                    <td className="py-4 px-6">64mm</td>
                    <td className="py-4 px-6">7.5 inches</td>
                  </tr>
                  <tr className="bg-[#F3F1EC]">
                    <td className="py-4 px-6 font-medium text-[#2E3135]">Extra Large (XL)</td>
                    <td className="py-4 px-6">68mm</td>
                    <td className="py-4 px-6">8 inches</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 4 — Necklace Lengths */}
        <section className="py-[60px] bg-white border-t border-[#F3F1EC] px-4 md:px-0">
          <div className="max-w-[860px] mx-auto">
            <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal text-center">
              Necklace Lengths
            </h2>
            <div className="w-[60px] h-[1px] bg-[#CDB38B] mx-auto mt-4 mb-8"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Card 1 */}
              <div className="bg-[#F3F1EC] rounded-lg p-6 transition-all duration-300 hover:shadow-sm">
                <span className="font-cormorant text-[24px] text-[#2E3135] font-normal block mb-2">
                  14 inch
                </span>
                <p className="font-inter text-[13px] text-[#CDB38B] font-medium tracking-wider uppercase mb-3">
                  Collarbone
                </p>
                <p className="font-inter text-[14px] text-[#555] leading-relaxed font-light">
                  Sits at the collarbone. Perfect for pendants.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-[#F3F1EC] rounded-lg p-6 transition-all duration-300 hover:shadow-sm">
                <span className="font-cormorant text-[24px] text-[#2E3135] font-normal block mb-2">
                  16 inch
                </span>
                <p className="font-inter text-[13px] text-[#CDB38B] font-medium tracking-wider uppercase mb-3">
                  Below Collarbone
                </p>
                <p className="font-inter text-[14px] text-[#555] leading-relaxed font-light">
                  Sits just below the collarbone. Most popular length.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-[#F3F1EC] rounded-lg p-6 transition-all duration-300 hover:shadow-sm">
                <span className="font-cormorant text-[24px] text-[#2E3135] font-normal block mb-2">
                  18 inch
                </span>
                <p className="font-inter text-[13px] text-[#CDB38B] font-medium tracking-wider uppercase mb-3">
                  Neckline
                </p>
                <p className="font-inter text-[14px] text-[#555] leading-relaxed font-light">
                  Falls at the neckline. Versatile, suits all necklines.
                </p>
              </div>

              {/* Card 4 */}
              <div className="bg-[#F3F1EC] rounded-lg p-6 transition-all duration-300 hover:shadow-sm">
                <span className="font-cormorant text-[24px] text-[#2E3135] font-normal block mb-2">
                  20 inch
                </span>
                <p className="font-inter text-[13px] text-[#CDB38B] font-medium tracking-wider uppercase mb-3">
                  Below Neckline
                </p>
                <p className="font-inter text-[14px] text-[#555] leading-relaxed font-light">
                  Falls below the neckline. Great for longer pendants.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
