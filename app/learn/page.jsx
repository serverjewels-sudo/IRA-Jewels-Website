import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Lab-Grown Diamonds | TATVAAN",
  description: "Learn about lab-grown diamonds. Discover how they are made (CVD & HPHT), see how they compare to mined diamonds, and find answers to frequently asked questions.",
};

export default function LearnPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="w-full bg-[#2E3135] py-20 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-cormorant italic text-[40px] md:text-[52px] text-white leading-tight font-normal">
              Lab-Grown Diamonds
            </h1>
            <p className="font-inter text-[14px] md:text-[15px] text-[#CDB38B] tracking-[0.05em] font-light mt-3">
              Real diamonds. Grown responsibly.
            </p>
          </div>
        </section>

        {/* SECTION 1 — What Are Lab-Grown Diamonds */}
        <section className="py-[60px] px-4 md:px-0">
          <div className="max-w-[860px] mx-auto">
            <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal text-center">
              What Are Lab-Grown Diamonds?
            </h2>
            <div className="w-[60px] h-[1px] bg-[#CDB38B] mx-auto mt-4 mb-8"></div>

            <p className="font-inter text-[16px] text-[#555] leading-[1.8] font-light max-w-3xl mx-auto mb-8">
              Lab-grown diamonds are real diamonds &mdash; chemically, physically, and optically identical to diamonds mined from the earth. The only difference is where they were created. Instead of forming deep underground over millions of years, they are grown in a controlled laboratory environment in a matter of weeks.
            </p>

            {/* Highlight box */}
            <div className="bg-[#F3F1EC] rounded-lg p-6 border-l-4 border-[#CDB38B]">
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-normal max-w-3xl mx-auto">
                A lab-grown diamond is not a fake diamond, a cubic zirconia, or a simulant. It is a <strong className="text-[#2E3135] font-medium">real diamond</strong> &mdash; with the same carbon crystal structure, the same hardness (10 on the Mohs scale), and the same brilliance.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 2 — How They Are Made */}
        <section className="py-[60px] bg-white border-t border-[#F3F1EC] px-4 md:px-0">
          <div className="max-w-[860px] mx-auto">
            <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal text-center">
              How Are They Made?
            </h2>
            <div className="w-[60px] h-[1px] bg-[#CDB38B] mx-auto mt-4 mb-8"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CVD Card */}
              <div className="bg-[#F3F1EC] rounded-lg p-6 transition-all duration-300 hover:shadow-sm">
                <span className="font-inter text-[11px] text-[#CDB38B] tracking-[1.5px] font-semibold uppercase block mb-2">
                  Method 01
                </span>
                <h3 className="font-cormorant text-[22px] text-[#2E3135] mb-3 font-normal">
                  CVD (Chemical Vapour Deposition)
                </h3>
                <p className="font-inter text-[15px] text-[#555] leading-relaxed font-light">
                  A diamond seed is placed in a chamber filled with carbon-rich gas. The gas is energised, causing carbon atoms to crystallise onto the seed, layer by layer, forming a diamond.
                </p>
              </div>

              {/* HPHT Card */}
              <div className="bg-[#F3F1EC] rounded-lg p-6 transition-all duration-300 hover:shadow-sm">
                <span className="font-inter text-[11px] text-[#CDB38B] tracking-[1.5px] font-semibold uppercase block mb-2">
                  Method 02
                </span>
                <h3 className="font-cormorant text-[22px] text-[#2E3135] mb-3 font-normal">
                  HPHT (High Pressure High Temperature)
                </h3>
                <p className="font-inter text-[15px] text-[#555] leading-relaxed font-light">
                  A diamond seed is exposed to extreme heat and pressure &mdash; replicating the conditions deep within the earth &mdash; causing carbon to crystallise into a diamond.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 — Lab vs Mined Comparison */}
        <section className="py-[60px] bg-white border-t border-[#F3F1EC] px-4 md:px-0">
          <div className="max-w-[860px] mx-auto">
            <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal text-center">
              Lab-Grown vs Mined Diamonds
            </h2>
            <div className="w-[60px] h-[1px] bg-[#CDB38B] mx-auto mt-4 mb-8"></div>

            <div className="overflow-x-auto border border-[#E5E7EB] rounded-lg">
              <table className="w-full text-left border-collapse font-inter text-[14px]">
                <thead>
                  <tr className="bg-[#2E3135] text-white">
                    <th className="py-4 px-6 font-medium">Feature</th>
                    <th className="py-4 px-6 font-medium">Lab-Grown</th>
                    <th className="py-4 px-6 font-medium">Mined</th>
                  </tr>
                </thead>
                <tbody className="text-[#555]">
                  <tr className="bg-white border-b border-[#E5E7EB]">
                    <td className="py-4 px-6 font-medium text-[#2E3135]">Chemical composition</td>
                    <td className="py-4 px-6">Identical</td>
                    <td className="py-4 px-6">Identical</td>
                  </tr>
                  <tr className="bg-[#F3F1EC] border-b border-[#E5E7EB]">
                    <td className="py-4 px-6 font-medium text-[#2E3135]">Hardness</td>
                    <td className="py-4 px-6">10 (Mohs)</td>
                    <td className="py-4 px-6">10 (Mohs)</td>
                  </tr>
                  <tr className="bg-white border-b border-[#E5E7EB]">
                    <td className="py-4 px-6 font-medium text-[#2E3135]">Brilliance</td>
                    <td className="py-4 px-6">Same</td>
                    <td className="py-4 px-6">Same</td>
                  </tr>
                  <tr className="bg-[#F3F1EC] border-b border-[#E5E7EB]">
                    <td className="py-4 px-6 font-medium text-[#2E3135]">Origin</td>
                    <td className="py-4 px-6 text-[#CDB38B] font-medium">Grown responsibly</td>
                    <td className="py-4 px-6">Extracted from earth</td>
                  </tr>
                  <tr className="bg-white border-b border-[#E5E7EB]">
                    <td className="py-4 px-6 font-medium text-[#2E3135]">Environmental impact</td>
                    <td className="py-4 px-6 text-[#CDB38B] font-medium">Significantly lower</td>
                    <td className="py-4 px-6">High &mdash; land disruption</td>
                  </tr>
                  <tr className="bg-[#F3F1EC] border-b border-[#E5E7EB]">
                    <td className="py-4 px-6 font-medium text-[#2E3135]">Price</td>
                    <td className="py-4 px-6 text-[#CDB38B] font-medium">40&ndash;60% more affordable</td>
                    <td className="py-4 px-6">Higher cost</td>
                  </tr>
                  <tr className="bg-white">
                    <td className="py-4 px-6 font-medium text-[#2E3135]">Certification</td>
                    <td className="py-4 px-6">IGI certified</td>
                    <td className="py-4 px-6">GIA / IGI certified</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SECTION 4 — Why We Choose Lab-Grown */}
        <section className="py-[60px] bg-white border-t border-[#F3F1EC] px-4 md:px-0">
          <div className="max-w-[860px] mx-auto">
            <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal text-center">
              Why We Choose Lab-Grown
            </h2>
            <div className="w-[60px] h-[1px] bg-[#CDB38B] mx-auto mt-4 mb-8"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Ethical */}
              <div className="bg-[#F3F1EC] rounded-lg p-6 transition-all duration-300 hover:shadow-sm">
                <span className="font-inter text-[11px] text-[#CDB38B] tracking-[1.5px] font-semibold uppercase block mb-2">
                  Reason 01
                </span>
                <h3 className="font-cormorant text-[22px] text-[#2E3135] mb-3 font-normal">
                  Ethical
                </h3>
                <p className="font-inter text-[14px] text-[#555] leading-relaxed font-light">
                  No mining means no conflict diamonds, no exploited communities, and no environmental destruction.
                </p>
              </div>

              {/* Affordable */}
              <div className="bg-[#F3F1EC] rounded-lg p-6 transition-all duration-300 hover:shadow-sm">
                <span className="font-inter text-[11px] text-[#CDB38B] tracking-[1.5px] font-semibold uppercase block mb-2">
                  Reason 02
                </span>
                <h3 className="font-cormorant text-[22px] text-[#2E3135] mb-3 font-normal">
                  Affordable
                </h3>
                <p className="font-inter text-[14px] text-[#555] leading-relaxed font-light">
                  Lab-grown diamonds cost 40&ndash;60% less than mined diamonds of the same quality &mdash; so you get more for your money.
                </p>
              </div>

              {/* Identical Quality */}
              <div className="bg-[#F3F1EC] rounded-lg p-6 transition-all duration-300 hover:shadow-sm">
                <span className="font-inter text-[11px] text-[#CDB38B] tracking-[1.5px] font-semibold uppercase block mb-2">
                  Reason 03
                </span>
                <h3 className="font-cormorant text-[22px] text-[#2E3135] mb-3 font-normal">
                  Identical Quality
                </h3>
                <p className="font-inter text-[14px] text-[#555] leading-relaxed font-light">
                  Certified by IGI with the same 4C grading as mined diamonds. No compromise on quality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5 — FAQ */}
        <section className="py-[60px] bg-white border-t border-[#F3F1EC] px-4 md:px-0">
          <div className="max-w-[860px] mx-auto">
            <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal text-center">
              Common Questions
            </h2>
            <div className="w-[60px] h-[1px] bg-[#CDB38B] mx-auto mt-4 mb-8"></div>

            <div className="space-y-2">
              {/* Q1 */}
              <details className="group border-b border-[#F3F1EC] py-5 cursor-pointer">
                <summary className="flex justify-between items-center list-none [&::-webkit-details-marker]:hidden font-cormorant text-[20px] text-[#2E3135] font-medium focus:outline-none">
                  <span>Are lab-grown diamonds real diamonds?</span>
                  <span className="text-[#CDB38B] font-light text-[22px] block group-open:hidden leading-none">+</span>
                  <span className="text-[#CDB38B] font-light text-[22px] hidden group-open:block leading-none">&minus;</span>
                </summary>
                <p className="mt-3 font-inter text-[15px] text-[#555] leading-[1.8] font-light pl-2">
                  Yes. Lab-grown diamonds are 100% real diamonds. They have the same chemical composition (carbon), the same hardness, and the same optical properties as mined diamonds.
                </p>
              </details>

              {/* Q2 */}
              <details className="group border-b border-[#F3F1EC] py-5 cursor-pointer">
                <summary className="flex justify-between items-center list-none [&::-webkit-details-marker]:hidden font-cormorant text-[20px] text-[#2E3135] font-medium focus:outline-none">
                  <span>Will a lab-grown diamond lose its value?</span>
                  <span className="text-[#CDB38B] font-light text-[22px] block group-open:hidden leading-none">+</span>
                  <span className="text-[#CDB38B] font-light text-[22px] hidden group-open:block leading-none">&minus;</span>
                </summary>
                <p className="mt-3 font-inter text-[15px] text-[#555] leading-[1.8] font-light pl-2">
                  Like all diamonds, lab-grown diamonds retain their beauty and durability. As with mined diamonds, resale value depends on quality, size, and market conditions.
                </p>
              </details>

              {/* Q3 */}
              <details className="group border-b border-[#F3F1EC] py-5 cursor-pointer">
                <summary className="flex justify-between items-center list-none [&::-webkit-details-marker]:hidden font-cormorant text-[20px] text-[#2E3135] font-medium focus:outline-none">
                  <span>Can a jeweller tell the difference?</span>
                  <span className="text-[#CDB38B] font-light text-[22px] block group-open:hidden leading-none">+</span>
                  <span className="text-[#CDB38B] font-light text-[22px] hidden group-open:block leading-none">&minus;</span>
                </summary>
                <p className="mt-3 font-inter text-[15px] text-[#555] leading-[1.8] font-light pl-2">
                  Not with the naked eye. Even trained gemologists cannot tell the difference without specialised equipment. IGI certification confirms the diamond&apos;s origin.
                </p>
              </details>

              {/* Q4 */}
              <details className="group border-b border-[#F3F1EC] py-5 cursor-pointer">
                <summary className="flex justify-between items-center list-none [&::-webkit-details-marker]:hidden font-cormorant text-[20px] text-[#2E3135] font-medium focus:outline-none">
                  <span>Do lab-grown diamonds come with certification?</span>
                  <span className="text-[#CDB38B] font-light text-[22px] block group-open:hidden leading-none">+</span>
                  <span className="text-[#CDB38B] font-light text-[22px] hidden group-open:block leading-none">&minus;</span>
                </summary>
                <p className="mt-3 font-inter text-[15px] text-[#555] leading-[1.8] font-light pl-2">
                  Yes. Every TATVAAN diamond comes with an IGI certificate confirming its quality and lab-grown origin.
                </p>
              </details>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
