import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Why Tatvaan | TATVAAN",
  description: "Why Tatvaan.",
};

export default function WhyTatvaanPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="w-full bg-[#2E3135] py-20 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-cormorant italic text-[40px] md:text-[52px] text-white leading-tight font-normal">
              Why Tatvaan
            </h1>
          </div>
        </section>

        {/* Content */}
        <section className="py-[60px] px-6 sm:px-8 lg:px-12 bg-white">
          <div className="max-w-[860px] mx-auto space-y-12 text-left">
            
            {/* What Makes Tatvaan Different */}
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="font-cormorant text-[28px] md:text-[36px] text-[#2E3135] font-normal mb-1">
                  What Makes Tatvaan Different
                </h2>
                <h3 className="font-cormorant italic text-[20px] md:text-[24px] text-[#CDB38B] font-normal">
                  Made Around You
                </h3>
              </div>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Tatvaan creates jewellery for a new generation—people who want modern style, dependable quality and honest value. We focus on what truly matters:
              </p>
              <ul className="space-y-3 font-inter text-[15px] text-[#555] font-light list-disc pl-5 marker:text-[#CDB38B]">
                <li>Designs that feel personal and easy to wear</li>
                <li>Carefully selected lab-grown diamonds</li>
                <li>Skilled craftsmanship and comfortable finishing</li>
                <li>Clear product information</li>
                <li>Transparent pricing and applicable certification</li>
                <li>Reliable service before and after your purchase</li>
              </ul>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                We do not create jewellery only to look beautiful inside a box. We create it to become part of your life.
              </p>
            </div>

            {/* Thoughtful Design */}
            <div className="space-y-6 pt-8 border-t border-[#F3F1EC]">
              <div className="text-center mb-6">
                <h2 className="font-cormorant text-[28px] md:text-[36px] text-[#2E3135] font-normal mb-1">
                  Thoughtful Design
                </h2>
                <h3 className="font-cormorant italic text-[20px] md:text-[24px] text-[#CDB38B] font-normal">
                  Beauty With a Purpose
                </h3>
              </div>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Every Tatvaan design begins with one simple question: Will you love wearing it? We think carefully about every detail—from the size and placement of the diamonds to the strength of the setting and comfort of the fit. Our jewellery is designed to feel:
              </p>
              <ul className="space-y-3 font-inter text-[15px] text-[#555] font-light list-disc pl-5 marker:text-[#CDB38B]">
                <li>Modern but timeless</li>
                <li>Refined but effortless</li>
                <li>Beautiful but comfortable</li>
                <li>Special but easy to wear</li>
              </ul>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Whether you are attending a celebration, going to work or enjoying an ordinary day, your jewellery should feel naturally yours. Because good design gets attention. Thoughtful design stays with you.
              </p>
            </div>

            {/* Honest Value and Clear Communication */}
            <div className="space-y-6 pt-8 border-t border-[#F3F1EC]">
              <div className="text-center mb-6">
                <h2 className="font-cormorant text-[28px] md:text-[36px] text-[#2E3135] font-normal mb-1">
                  Honest Value and Clear Communication
                </h2>
                <h3 className="font-cormorant italic text-[20px] md:text-[24px] text-[#CDB38B] font-normal">
                  Know What You Are Choosing
                </h3>
              </div>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Buying diamond jewellery should feel exciting, not confusing. That is why we explain the important details in simple words. Where applicable, you will receive clear information about:
              </p>
              <ul className="space-y-3 font-inter text-[15px] text-[#555] font-light list-disc pl-5 marker:text-[#CDB38B]">
                <li>Gold purity and colour</li>
                <li>Gold and product weight</li>
                <li>Diamond carat weight</li>
                <li>Diamond colour and clarity</li>
                <li>Certification</li>
                <li>Product dimensions</li>
                <li>Pricing and applicable taxes</li>
                <li>Expected delivery time</li>
                <li>Care, return and exchange terms</li>
              </ul>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                We avoid unnecessary jargon and hidden details. Our aim is simple: you should understand your jewellery, feel confident about its value and enjoy choosing it.
              </p>
            </div>

            {/* Quality and Transparency */}
            <div className="space-y-6 pt-8 border-t border-[#F3F1EC]">
              <div className="text-center mb-6">
                <h2 className="font-cormorant text-[28px] md:text-[36px] text-[#2E3135] font-normal mb-1">
                  Quality and Transparency
                </h2>
                <h3 className="font-cormorant italic text-[20px] md:text-[24px] text-[#CDB38B] font-normal">
                  Confidence From the Inside Out
                </h3>
              </div>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Quality is not limited to what you can see. It can be felt in the strength of the setting, the smoothness of the finish, the comfort of the fit and the way the entire piece comes together. Every Tatvaan creation goes through careful quality checks before it reaches you. We inspect the jewellery for:
              </p>
              <ul className="space-y-3 font-inter text-[15px] text-[#555] font-light list-disc pl-5 marker:text-[#CDB38B]">
                <li>Diamond security and setting</li>
                <li>Finishing and polish</li>
                <li>Design proportions</li>
                <li>Comfort and wearability</li>
                <li>Product specifications</li>
                <li>Overall appearance</li>
              </ul>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                We also provide clear information about the materials, diamonds and certification applicable to your jewellery. Because trust is built when beautiful promises are supported by clear details.
              </p>
            </div>

            {/* Our Promise */}
            <div className="space-y-6 pt-8 border-t border-[#F3F1EC]">
              <h2 className="font-cormorant text-[28px] md:text-[36px] text-[#2E3135] font-normal text-center">
                Our Promise
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Every Tatvaan piece carries a promise. A promise of thoughtful design. A promise of carefully selected lab-grown diamonds. A promise of skilled craftsmanship and attention to detail. A promise of honesty, transparency, and reliable quality. And most importantly, a promise to create jewellery that becomes part of your life.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                A piece that celebrates your wins. Reminds you of your people. Marks your new beginnings. And stays connected to the moments you never want to forget.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Because the true value of jewellery is not measured only by how brightly it shines. It is measured by what it means to you.
              </p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
