import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Certification | IRA Jewels",
  description: "Every diamond comes with a certificate of authenticity. Learn about IGI certification, the 4Cs, and how to verify your lab-grown diamond certificate online.",
};

export default function CertificatePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="w-full bg-[#2E3135] py-20 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-cormorant italic text-[40px] md:text-[52px] text-white leading-tight font-normal">
              Certification
            </h1>
            <p className="font-inter text-[14px] md:text-[15px] text-[#CDB38B] tracking-[0.05em] font-light mt-3">
              Every diamond comes with a certificate of authenticity
            </p>
          </div>
        </section>

        {/* SECTION 1 — What is a Diamond Certificate */}
        <section className="py-[60px] px-4 md:px-0">
          <div className="max-w-[860px] mx-auto text-center">
            <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal">
              What is a Diamond Certificate?
            </h2>
            <div className="w-[60px] h-[1px] bg-[#CDB38B] mx-auto mt-4 mb-8"></div>

            <p className="font-inter text-[16px] text-[#555] leading-[1.8] font-light max-w-3xl mx-auto">
              A diamond grading certificate is an independent assessment of your diamond&apos;s quality, issued by a certified gemological laboratory. At IRA Jewels, every lab-grown diamond comes with an IGI (International Gemological Institute) certificate &mdash; the world&apos;s leading authority on lab-grown diamond grading.
            </p>
          </div>
        </section>

        {/* SECTION 2 — The 4Cs */}
        <section className="py-[60px] bg-white border-t border-[#F3F1EC] px-4 md:px-0">
          <div className="max-w-[860px] mx-auto">
            <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal text-center">
              What the Certificate Covers &mdash; The 4Cs
            </h2>
            <div className="w-[60px] h-[1px] bg-[#CDB38B] mx-auto mt-4 mb-8"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {/* Cut */}
              <div className="bg-[#F3F1EC] rounded-lg p-6 transition-all duration-300 hover:shadow-sm">
                <span className="font-cormorant text-[24px] text-[#2E3135] font-normal block mb-1">
                  Cut
                </span>
                <div className="w-[20px] h-[1px] bg-[#CDB38B] mb-3"></div>
                <p className="font-inter text-[14px] text-[#555] leading-relaxed font-light">
                  Determines how well the diamond reflects light. Our diamonds are graded Excellent to Very Good cut.
                </p>
              </div>

              {/* Clarity */}
              <div className="bg-[#F3F1EC] rounded-lg p-6 transition-all duration-300 hover:shadow-sm">
                <span className="font-cormorant text-[24px] text-[#2E3135] font-normal block mb-1">
                  Clarity
                </span>
                <div className="w-[20px] h-[1px] bg-[#CDB38B] mb-3"></div>
                <p className="font-inter text-[14px] text-[#555] leading-relaxed font-light">
                  Measures the presence of inclusions. Our diamonds range from VS1 to SI1 clarity.
                </p>
              </div>

              {/* Colour */}
              <div className="bg-[#F3F1EC] rounded-lg p-6 transition-all duration-300 hover:shadow-sm">
                <span className="font-cormorant text-[24px] text-[#2E3135] font-normal block mb-1">
                  Colour
                </span>
                <div className="w-[20px] h-[1px] bg-[#CDB38B] mb-3"></div>
                <p className="font-inter text-[14px] text-[#555] leading-relaxed font-light">
                  Graded from D (colourless) to Z. Our diamonds are typically D&ndash;F range.
                </p>
              </div>

              {/* Carat */}
              <div className="bg-[#F3F1EC] rounded-lg p-6 transition-all duration-300 hover:shadow-sm">
                <span className="font-cormorant text-[24px] text-[#2E3135] font-normal block mb-1">
                  Carat
                </span>
                <div className="w-[20px] h-[1px] bg-[#CDB38B] mb-3"></div>
                <p className="font-inter text-[14px] text-[#555] leading-relaxed font-light">
                  Measures the weight of the diamond. Shown on the certificate with precision to two decimal places.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 3 — Why IGI */}
        <section className="py-[60px] bg-white border-t border-[#F3F1EC] px-4 md:px-0">
          <div className="max-w-[860px] mx-auto">
            <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal text-center">
              Why IGI Certification?
            </h2>
            <div className="w-[60px] h-[1px] bg-[#CDB38B] mx-auto mt-4 mb-8"></div>

            <div className="bg-[#F3F1EC] rounded-lg p-6 md:p-8">
              <ul className="space-y-4 font-inter text-[15px] text-[#555] font-light">
                <li className="flex items-start">
                  <span className="text-[#CDB38B] mr-3 font-semibold text-lg leading-none">&checkmark;</span>
                  <span>IGI is the world&apos;s largest independent gemological laboratory.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#CDB38B] mr-3 font-semibold text-lg leading-none">&checkmark;</span>
                  <span>IGI is the global leader in lab-grown diamond certification.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#CDB38B] mr-3 font-semibold text-lg leading-none">&checkmark;</span>
                  <span>IGI certificates are accepted worldwide by jewellers, insurers, and resellers.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* SECTION 4 — Verify Your Certificate */}
        <section className="py-[60px] bg-white border-t border-[#F3F1EC] px-4 md:px-0">
          <div className="max-w-[860px] mx-auto">
            <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal text-center">
              Verify Your Certificate Online
            </h2>
            <div className="w-[60px] h-[1px] bg-[#CDB38B] mx-auto mt-4 mb-8"></div>

            <p className="font-inter text-[16px] text-[#555] leading-[1.8] font-light text-center mb-8">
              Every IRA Jewels diamond comes with a unique IGI report number. You can verify your certificate anytime at{" "}
              <a 
                href="https://www.igi.org" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[#CDB38B] hover:underline font-medium transition-colors duration-300"
              >
                igi.org
              </a>{" "}
              using this number. This gives you complete confidence in the authenticity and quality of your purchase.
            </p>

            {/* Gold Bordered Reminder Box */}
            <div className="border border-[#CDB38B] rounded-lg p-6 bg-white text-center">
              <p className="font-inter text-[15px] text-[#2E3135] leading-relaxed font-normal">
                Your certificate is included with your order. Store it safely &mdash; you&apos;ll need it for insurance, resale, or future servicing.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
