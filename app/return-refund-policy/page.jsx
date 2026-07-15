import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Return & Refund Policy | TATVAAN",
  description: "Learn about our 15-day return policy, cancellation process, and refund timelines for TATVAAN purchases.",
};

export default function ReturnRefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="w-full bg-[#2E3135] py-20 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-cormorant italic text-[40px] md:text-[52px] text-white leading-tight font-normal">
              Return & Refund Policy
            </h1>
            <p className="font-inter text-[14px] md:text-[15px] text-[#CDB38B] tracking-[0.05em] font-light mt-3">
              We want you to be completely satisfied with your purchase.
            </p>
          </div>
        </section>

        {/* Policy Content */}
        <section className="py-[60px] px-6 sm:px-8 lg:px-12 bg-white">
          <div className="max-w-[860px] mx-auto space-y-10">

            {/* Return Window & Conditions */}
            <div>
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                15-Day Return Window
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                We offer a 15-calendar-day return window for eligible Direct-to-Consumer (D2C) purchases from the date of delivery. To be eligible for a return, the following conditions must be met:
              </p>
              <ul className="space-y-3 font-inter text-[15px] text-[#555] font-light list-disc pl-5 leading-[1.8]">
                <li>The item must be completely unworn, unused, undamaged, and unaltered.</li>
                <li>The original invoice, diamond certificate, and all original tags must be intact.</li>
                <li>All original packaging and any promotional gifts included must be returned with the item.</li>
              </ul>
            </div>

            {/* How to Return */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                Return Process & Pickup
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                All returns must be arranged directly through our Customer Care team. Please do not independently courier the item back to us, as we cannot accept responsibility for items sent outside of our official process.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                For authorized returns, we provide a complimentary, fully insured return pickup service for your peace of mind.
              </p>
            </div>

            {/* Non-eligible Items */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                Non-Eligible Items
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                The following items are final sale and cannot be returned or exchanged:
              </p>
              <ul className="space-y-3 font-inter text-[15px] text-[#555] font-light list-disc pl-5 leading-[1.8]">
                <li>Customised or bespoke jewelry pieces</li>
                <li>Engraved or personalised items</li>
                <li>Items that have been altered or resized post-purchase</li>
                <li>Items specifically marked as final-sale</li>
              </ul>
            </div>

            {/* Refund Timeline */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                Refund Timeline
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Once we receive your returned item, our Quality Assurance team will inspect it. If approved, your refund will be processed within 7 to 10 business days. The refunded amount will be credited back to your original payment method.
              </p>
            </div>

            {/* Cancellation */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                Order Cancellation
              </h2>
              <ul className="space-y-3 font-inter text-[15px] text-[#555] font-light list-disc pl-5 leading-[1.8]">
                <li><strong className="text-[#2E3135] font-medium">Standard Orders:</strong> Can be cancelled prior to dispatch.</li>
                <li><strong className="text-[#2E3135] font-medium">Customised Orders:</strong> Can only be cancelled within 24 hours of placement, provided the production process has not yet commenced.</li>
              </ul>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
