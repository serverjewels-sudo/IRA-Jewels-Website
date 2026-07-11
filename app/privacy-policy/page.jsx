import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy | TATVAAN",
  description: "TATVAAN respects your privacy and is committed to protecting your personal data. Read our privacy policy to understand how we collect, use, and share your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="w-full bg-[#2E3135] py-20 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-cormorant italic text-[40px] md:text-[52px] text-white leading-tight font-normal">
              Privacy Policy
            </h1>
            <p className="font-inter text-[14px] md:text-[15px] text-[#CDB38B] tracking-[0.05em] font-light mt-3">
              Last Updated: July 2026
            </p>
          </div>
        </section>

        {/* Policy Content */}
        <section className="py-[60px] px-6 sm:px-8 lg:px-12 bg-white">
          <div className="max-w-[860px] mx-auto space-y-10">
            <div>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                TATVAAN (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) respects your privacy and is committed to protecting your personal data. This policy explains what information we collect, how we use it, and your rights regarding it.
              </p>
            </div>

            {/* Information We Collect */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                Information We Collect
              </h2>
              <ul className="space-y-3 font-inter text-[15px] text-[#555] font-light list-disc pl-5 leading-[1.8]">
                <li>
                  <strong className="text-[#2E3135] font-medium">Personal details you provide:</strong> name, email address, phone number, and delivery address, when you register an account, place an order, or contact us
                </li>
                <li>
                  <strong className="text-[#2E3135] font-medium">Payment information:</strong> processed securely by Razorpay, our payment partner &mdash; we do not store your card, UPI, or banking details on our own servers
                </li>
                <li>
                  <strong className="text-[#2E3135] font-medium">Account information if you sign in with Google:</strong> your name and email address, as shared by Google
                </li>
                <li>
                  <strong className="text-[#2E3135] font-medium">Order history and preferences:</strong> items purchased, wishlist items, and reviews you submit
                </li>
                <li>
                  <strong className="text-[#2E3135] font-medium">Basic technical data:</strong> stored locally in your browser (such as your shopping cart and wishlist contents) to improve your experience
                </li>
              </ul>
            </div>

            {/* How We Use Your Information */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                How We Use Your Information
              </h2>
              <ul className="space-y-3 font-inter text-[15px] text-[#555] font-light list-disc pl-5 leading-[1.8]">
                <li>To process and deliver your orders</li>
                <li>To communicate with you about your orders (confirmations, order status, invoices)</li>
                <li>To manage your account and provide customer support</li>
                <li>To improve our website and services</li>
              </ul>
            </div>

            {/* Sharing Your Information */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                Sharing Your Information
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                We do not sell your personal data. We share information only as necessary with:
              </p>
              <ul className="space-y-3 font-inter text-[15px] text-[#555] font-light list-disc pl-5 leading-[1.8]">
                <li>
                  <strong className="text-[#2E3135] font-medium">Razorpay</strong>, to process payments securely
                </li>
                <li>Our delivery/courier partners, to fulfil and ship your orders</li>
                <li>
                  <strong className="text-[#2E3135] font-medium">Resend</strong>, our email service provider, to send order and account-related emails
                </li>
                <li>
                  <strong className="text-[#2E3135] font-medium">Supabase</strong>, our secure database provider, to store your account and order information
                </li>
              </ul>
            </div>

            {/* Data Security */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                Data Security
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                We take reasonable technical and organisational measures to protect your personal data from unauthorised access, loss, or misuse.
              </p>
            </div>

            {/* Your Rights */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                Your Rights
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                You may request access to, correction of, or deletion of your personal data at any time by contacting us using the details below. Note that we may need to retain certain order records as required by Indian tax and business law.
              </p>
            </div>

            {/* Cookies & Local Storage */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                Cookies & Local Storage
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                We use your browser&apos;s local storage to remember items in your shopping cart and wishlist, and to keep you signed in. This data stays on your device and is not used for advertising or tracking purposes.
              </p>
            </div>

            {/* Changes to This Policy */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                Changes to This Policy
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                We may update this policy from time to time. Changes will be posted on this page.
              </p>
            </div>

            {/* Contact Us */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                Contact Us
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                For any privacy-related questions or requests, please contact us via our Contact Us page, or write to us at:
              </p>
              <ul className="mt-4 space-y-2 font-inter text-[15px] text-[#555] font-light leading-[1.8]">
                <li>
                  <strong className="text-[#2E3135] font-medium">Email:</strong>{" "}
                  <a href="mailto:Irajewels849@gmail.com" className="text-[#CDB38B] hover:underline">
                    Irajewels849@gmail.com
                  </a>
                </li>
                <li>
                  <strong className="text-[#2E3135] font-medium">Address:</strong>{" "}
                  TATVAAN, Princess Plaza, Mini Bazar, 9th Floor 905, Surat, Gujarat
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
