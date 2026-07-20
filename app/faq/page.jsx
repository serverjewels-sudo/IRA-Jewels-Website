import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export const metadata = {
  title: "FAQ | TATVAAN",
  description: "Frequently asked questions about shipping, returns, sizing, and more.",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="w-full bg-[#2E3135] py-20 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-cormorant italic text-[40px] md:text-[52px] text-white leading-tight font-normal">
              Frequently Asked Questions
            </h1>
            <p className="font-inter text-[14px] md:text-[15px] text-[#CDB38B] tracking-[0.05em] font-light mt-3">
              Everything you need to know about your TATVAAN experience
            </p>
          </div>
        </section>

        {/* SECTION 1 — FAQ */}
        <section className="py-[60px] px-4 md:px-0">
          <div className="max-w-[860px] mx-auto">
            <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal text-center">
              Customer Care & Policies
            </h2>
            <div className="w-[60px] h-[1px] bg-[#CDB38B] mx-auto mt-4 mb-8"></div>

            <div className="space-y-2">
              {/* Q1 */}
              <details className="group border-b border-[#F3F1EC] py-5 cursor-pointer">
                <summary className="flex justify-between items-center list-none [&::-webkit-details-marker]:hidden font-cormorant text-[20px] text-[#2E3135] font-medium focus:outline-none">
                  <span>How long does shipping take and how can I track my order?</span>
                  <span className="text-[#CDB38B] font-light text-[22px] block group-open:hidden leading-none">+</span>
                  <span className="text-[#CDB38B] font-light text-[22px] hidden group-open:block leading-none">&minus;</span>
                </summary>
                <p className="mt-3 font-inter text-[15px] text-[#555] leading-[1.8] font-light pl-2">
                  Shipping times typically range from 5-7 business days depending on your location. You can track your shipment&apos;s progress at any time on our <Link href="/track-order" className="text-[#CDB38B] hover:underline font-medium">Track Order</Link> page.
                </p>
              </details>

              {/* Q2 */}
              <details className="group border-b border-[#F3F1EC] py-5 cursor-pointer">
                <summary className="flex justify-between items-center list-none [&::-webkit-details-marker]:hidden font-cormorant text-[20px] text-[#2E3135] font-medium focus:outline-none">
                  <span>What is your return and exchange policy?</span>
                  <span className="text-[#CDB38B] font-light text-[22px] block group-open:hidden leading-none">+</span>
                  <span className="text-[#CDB38B] font-light text-[22px] hidden group-open:block leading-none">&minus;</span>
                </summary>
                <p className="mt-3 font-inter text-[15px] text-[#555] leading-[1.8] font-light pl-2">
                  We offer a hassle-free return and exchange process within our designated window. Please read the full details and eligibility criteria in our <Link href="/return-refund-policy" className="text-[#CDB38B] hover:underline font-medium">Return Policy</Link>.
                </p>
              </details>

              {/* Q3 */}
              <details className="group border-b border-[#F3F1EC] py-5 cursor-pointer">
                <summary className="flex justify-between items-center list-none [&::-webkit-details-marker]:hidden font-cormorant text-[20px] text-[#2E3135] font-medium focus:outline-none">
                  <span>How do I determine my ring or bracelet size?</span>
                  <span className="text-[#CDB38B] font-light text-[22px] block group-open:hidden leading-none">+</span>
                  <span className="text-[#CDB38B] font-light text-[22px] hidden group-open:block leading-none">&minus;</span>
                </summary>
                <p className="mt-3 font-inter text-[15px] text-[#555] leading-[1.8] font-light pl-2">
                  Finding your perfect fit is easy! Check out our comprehensive <Link href="/size-guide" className="text-[#CDB38B] hover:underline font-medium">Size Guide</Link> for step-by-step instructions on measuring at home.
                </p>
              </details>

              {/* Q4 */}
              <details className="group border-b border-[#F3F1EC] py-5 cursor-pointer">
                <summary className="flex justify-between items-center list-none [&::-webkit-details-marker]:hidden font-cormorant text-[20px] text-[#2E3135] font-medium focus:outline-none">
                  <span>Are your lab-grown diamonds certified?</span>
                  <span className="text-[#CDB38B] font-light text-[22px] block group-open:hidden leading-none">+</span>
                  <span className="text-[#CDB38B] font-light text-[22px] hidden group-open:block leading-none">&minus;</span>
                </summary>
                <p className="mt-3 font-inter text-[15px] text-[#555] leading-[1.8] font-light pl-2">
                  Yes, absolutely. Our larger diamonds are graded and certified by reputable organizations like IGI. Find more detailed information on our <Link href="/certificate" className="text-[#CDB38B] hover:underline font-medium">Certificate Info</Link> page.
                </p>
              </details>

              {/* Q5 */}
              <details className="group border-b border-[#F3F1EC] py-5 cursor-pointer">
                <summary className="flex justify-between items-center list-none [&::-webkit-details-marker]:hidden font-cormorant text-[20px] text-[#2E3135] font-medium focus:outline-none">
                  <span>Where can I learn more about how lab-grown diamonds are made?</span>
                  <span className="text-[#CDB38B] font-light text-[22px] block group-open:hidden leading-none">+</span>
                  <span className="text-[#CDB38B] font-light text-[22px] hidden group-open:block leading-none">&minus;</span>
                </summary>
                <p className="mt-3 font-inter text-[15px] text-[#555] leading-[1.8] font-light pl-2">
                  Lab-grown diamonds are chemically and optically identical to mined diamonds. You can discover the science and ethics behind them on our <Link href="/learn" className="text-[#CDB38B] hover:underline font-medium">Learn</Link> page.
                </p>
              </details>

              {/* Q6 */}
              <details className="group border-b border-[#F3F1EC] py-5 cursor-pointer">
                <summary className="flex justify-between items-center list-none [&::-webkit-details-marker]:hidden font-cormorant text-[20px] text-[#2E3135] font-medium focus:outline-none">
                  <span>Can I request a custom jewellery design?</span>
                  <span className="text-[#CDB38B] font-light text-[22px] block group-open:hidden leading-none">+</span>
                  <span className="text-[#CDB38B] font-light text-[22px] hidden group-open:block leading-none">&minus;</span>
                </summary>
                <p className="mt-3 font-inter text-[15px] text-[#555] leading-[1.8] font-light pl-2">
                  We would love to bring your unique vision to life! Please visit our <Link href="/custom-order" className="text-[#CDB38B] hover:underline font-medium">Custom Order</Link> page to submit your inquiry and get started with our design team.
                </p>
              </details>

              {/* Q7 */}
              <details className="group border-b border-[#F3F1EC] py-5 cursor-pointer">
                <summary className="flex justify-between items-center list-none [&::-webkit-details-marker]:hidden font-cormorant text-[20px] text-[#2E3135] font-medium focus:outline-none">
                  <span>Do you offer international shipping?</span>
                  <span className="text-[#CDB38B] font-light text-[22px] block group-open:hidden leading-none">+</span>
                  <span className="text-[#CDB38B] font-light text-[22px] hidden group-open:block leading-none">&minus;</span>
                </summary>
                <p className="mt-3 font-inter text-[15px] text-[#555] leading-[1.8] font-light pl-2">
                  Currently, we ship across India. We are working on expanding our delivery network globally in the near future.
                </p>
              </details>

              {/* Q8 */}
              <details className="group border-b border-[#F3F1EC] py-5 cursor-pointer">
                <summary className="flex justify-between items-center list-none [&::-webkit-details-marker]:hidden font-cormorant text-[20px] text-[#2E3135] font-medium focus:outline-none">
                  <span>What payment methods are accepted?</span>
                  <span className="text-[#CDB38B] font-light text-[22px] block group-open:hidden leading-none">+</span>
                  <span className="text-[#CDB38B] font-light text-[22px] hidden group-open:block leading-none">&minus;</span>
                </summary>
                <p className="mt-3 font-inter text-[15px] text-[#555] leading-[1.8] font-light pl-2">
                  We accept all major credit and debit cards, UPI, Net Banking, and select mobile wallets through our secure payment gateway.
                </p>
              </details>

              {/* Q9 */}
              <details className="group border-b border-[#F3F1EC] py-5 cursor-pointer">
                <summary className="flex justify-between items-center list-none [&::-webkit-details-marker]:hidden font-cormorant text-[20px] text-[#2E3135] font-medium focus:outline-none">
                  <span>How should I care for and clean my jewellery?</span>
                  <span className="text-[#CDB38B] font-light text-[22px] block group-open:hidden leading-none">+</span>
                  <span className="text-[#CDB38B] font-light text-[22px] hidden group-open:block leading-none">&minus;</span>
                </summary>
                <p className="mt-3 font-inter text-[15px] text-[#555] leading-[1.8] font-light pl-2">
                  To keep your pieces sparkling, avoid harsh chemicals and store them properly. For a detailed guide, please see our <Link href="/care" className="text-[#CDB38B] hover:underline font-medium">Care Instructions</Link>.
                </p>
              </details>

              {/* Q10 */}
              <details className="group border-b border-[#F3F1EC] py-5 cursor-pointer">
                <summary className="flex justify-between items-center list-none [&::-webkit-details-marker]:hidden font-cormorant text-[20px] text-[#2E3135] font-medium focus:outline-none">
                  <span>Can I cancel or modify my order after it is placed?</span>
                  <span className="text-[#CDB38B] font-light text-[22px] block group-open:hidden leading-none">+</span>
                  <span className="text-[#CDB38B] font-light text-[22px] hidden group-open:block leading-none">&minus;</span>
                </summary>
                <p className="mt-3 font-inter text-[15px] text-[#555] leading-[1.8] font-light pl-2">
                  Orders can usually be modified or cancelled within 24 hours of placement. Please contact our support team immediately at <a href="mailto:support@tatvaan.com" className="text-[#CDB38B] hover:underline font-medium">support@tatvaan.com</a>.
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
