import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Terms & Conditions | TATVAAN",
  description: "Terms and conditions for using TATVAAN website and services.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="w-full bg-[#2E3135] py-20 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-cormorant italic text-[40px] md:text-[52px] text-white leading-tight font-normal">
              Terms & Conditions
            </h1>
            <p className="font-inter text-[14px] md:text-[15px] text-[#CDB38B] tracking-[0.05em] font-light mt-3">
              Last Updated: 01/07/2026
            </p>
          </div>
        </section>

        {/* Policy Content */}
        <section className="py-[60px] px-6 sm:px-8 lg:px-12 bg-white">
          <div className="max-w-[860px] mx-auto space-y-10">
            <div>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                These Website Terms of Use and Sale govern access to and use of www.tatvaan.com and purchases made through the website.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Tatvaan Jewels is owned and operated by Ira Jewels Pvt Ltd, operating under the brand name TATVAAN (details in Section 24). In these Terms, &quot;Tatvaan&quot;, &quot;we&quot;, &quot;our&quot; and &quot;us&quot; refer to that entity, and &quot;customer&quot;, &quot;you&quot; and &quot;your&quot; refer to a person accessing the website or purchasing from us.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                By accessing or using the website, creating an account or placing an order, you agree to these Terms and the policies incorporated into them, including the Privacy Policy, Shipping and Delivery Policy, Return and Refund Policy, Exchange and Buyback Policy, Warranty and Service Policy, and any product-specific or promotional terms disclosed before purchase.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                If a product-specific or promotional term conflicts with these Terms, the more specific term disclosed before purchase will apply to that product or promotion. Mandatory statutory rights remain unaffected.
              </p>
            </div>

            {/* 1. Eligibility and Customer Information */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                1. Eligibility and Customer Information
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Orders may be placed only by persons legally capable of entering into a binding contract under Indian law. A person under 18 may browse the website under the supervision of a parent or legal guardian, but an account used to place an order and the order itself must be created or placed by an adult.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                You must provide accurate, current and complete account, billing, payment and delivery information. Tatvaan may place an order on hold, request verification, restrict an account or cancel an order where information cannot reasonably be verified or fraud, misuse or unlawful activity is suspected.
              </p>
            </div>

            {/* 2. Products and Pre-Purchase Information */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                2. Products and Pre-Purchase Information
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Tatvaan offers fine jewellery made from precious metals, lab-grown diamonds and other materials described on the relevant product page.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Before purchase, the product page or checkout will display the information relevant to the product and required by applicable law, which may include metal purity and approximate weight, diamond or stone details, dimensions, certification, country of origin, total price, compulsory charges and taxes, delivery estimate, and return, exchange, buyback, warranty or service eligibility.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Any diamond described as lab-grown, laboratory-grown, CVD-grown or HPHT-grown is laboratory-created and is not a natural or mined diamond. Its origin will be disclosed on the product page, invoice, certificate or accompanying documentation. Importer details will be disclosed where required by law.
              </p>
            </div>

            {/* 3. Hallmarking, Invoice and Certification */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                3. Hallmarking, Invoice and Certification
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Gold jewellery will be BIS hallmarked and carry a HUID wherever required under applicable Indian law. Customers may verify an eligible HUID through the BIS CARE application or another official BIS facility.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                The invoice will state the product description, metal purity and relevant weight, diamond or stone details, charges, taxes and other information required by law.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Where an independent diamond certificate is expressly promised on the product page, the corresponding certificate will be supplied. Small or melee diamonds may instead be covered by a consolidated Tatvaan jewellery certificate where this is disclosed before purchase.
              </p>
            </div>

            {/* 4. Images, Dimensions and Manufacturing Variations */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                4. Images, Dimensions and Manufacturing Variations
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Tatvaan makes reasonable efforts to display products accurately. Images may be enlarged to show design details and may not represent actual size.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Minor differences in colour, polish, handmade finishing, dimensions, stone arrangement or weight may result from lighting, screen settings and normal manufacturing tolerances. Such differences will not be treated as defects where the delivered product materially matches the confirmed specifications.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                For a customised order, any material change in specification or price will be communicated for customer approval before final billing or dispatch.
              </p>
            </div>

            {/* 5. Pricing, Taxes and Obvious Errors */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                5. Pricing, Taxes and Obvious Errors
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Prices are displayed in Indian Rupees unless otherwise stated. The product page or checkout will show the total amount payable, including all compulsory charges and applicable taxes. Tatvaan may also separately show components such as metal value, diamond value, making charges, certification, hallmarking and delivery charges.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Market prices may change without notice. Once a standard order has been finally accepted and fully paid, later market movements will not change its confirmed price unless the customer requests a modification or approves a changed specification.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                If a price, discount or product detail is clearly incorrect because of a typographical, technical or system error, Tatvaan may contact the customer to offer the correct terms or cancel the affected order and refund the amount received.
              </p>
            </div>

            {/* 6. Order Placement and Acceptance */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                6. Order Placement and Acceptance
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Adding an item to the shopping bag does not reserve it. An order is submitted when checkout is completed and payment is authorised or another approved payment arrangement is confirmed.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                An automated acknowledgement confirms receipt of the order but does not necessarily constitute final acceptance. Acceptance may remain subject to payment verification, product availability, identity and address checks, fraud-prevention review, confirmation of size or custom details, and compliance with applicable law.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Tatvaan may limit quantities, refuse or cancel an order for a valid reason, including suspected resale or fraud. Where Tatvaan cancels a paid order, the refundable amount will be returned to the original payment method or another legally permitted verified method.
              </p>
            </div>

            {/* 7. Payments and Verification */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                7. Payments and Verification
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Available payment methods will be shown at checkout and may include cards, UPI, net banking, approved wallets, EMI, bank transfer or other authorised options.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Payments may be processed by authorised third-party payment providers. Customers must be authorised to use the selected payment method.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Tatvaan may request PAN, identity, bank or other verification documents where required for high-value transactions, refunds, delivery, exchange, buyback, fraud prevention or legal compliance.
              </p>
            </div>

            {/* 8. Cancellation and Customised Orders */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                8. Cancellation and Customised Orders
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                A standard ready-to-ship order may be cancelled before dispatch by contacting Customer Care. No cancellation fee will apply to an eligible standard order cancelled before dispatch. After dispatch, the customer may use the applicable return process if the product is eligible.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                A made-to-order or customised product may be cancelled within 24 hours only if sourcing or production has not begun. Once sourcing, production, engraving, resizing, special procurement or customisation has started, cancellation may be unavailable. Any non-refundable amount or deduction applicable to a customised order must be disclosed before purchase, reflect the nature of the order and costs incurred, and remain subject to applicable law.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Customised products include engraved or personalised jewellery, non-standard sizes, customer-selected specifications, altered website designs, specially sourced diamonds and customer-provided designs. Restrictions on cancellation or change-of-mind returns do not apply where the delivered product is incorrect, materially different from the approved specification, damaged in transit or affected by a verified manufacturing defect.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Tatvaan may cancel an order because of unavailability, failed payment or verification, incorrect pricing, delivery restrictions, suspected fraud, legal restrictions or circumstances beyond reasonable control. A fully paid order cancelled by Tatvaan will be refunded in accordance with applicable law.
              </p>
            </div>

            {/* 9. Shipping and Delivery */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                9. Shipping and Delivery
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Tatvaan provides insured delivery to serviceable locations in India. Shipping charges, if any, will be shown before the order is placed.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Delivery estimates depend on product availability, manufacturing, hallmarking, certification, payment and identity verification, customisation, customer location and courier serviceability. Unless expressly guaranteed in writing, an estimated delivery date is not a guaranteed date.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Tatvaan will communicate a material delay and provide an updated estimate. Any right available to the customer under applicable law because of delayed or failed delivery remains unaffected.
              </p>
            </div>

            {/* 10. Secure Delivery and Delivery Claims */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                10. Secure Delivery and Delivery Claims
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                High-value orders may require an OTP, signature, valid identification or delivery to the invoiced customer or an authorised recipient. Risk in the product passes after successful delivery to the customer or authorised recipient.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Where reasonably possible, a customer should refuse a package that appears opened, damaged or tampered with.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                If a package is damaged, the product is incorrect or an item is missing, contact Tatvaan as soon as reasonably possible, preferably within 48 hours, and provide the order details and available photographs or video.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                An unboxing video may assist an investigation but will not be treated as the only acceptable evidence. A requested reporting period does not remove any statutory right relating to a defect or shortage that could not reasonably have been discovered immediately.
              </p>
            </div>

            {/* 11. Returns and Refunds */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                11. Returns and Refunds
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Tatvaan offers a 15-calendar-day return period for eligible D2C website purchases delivered within India. The period begins on the delivery date.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                To qualify, the product must be unworn, unused, undamaged and unaltered, and returned with its invoice, certificate, tags, packaging, warranty documents and promotional gifts, where supplied. Returns must be arranged through Customer Care; jewellery should not be independently couriered without written instructions.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Tatvaan will arrange one complimentary insured return pickup for an eligible return from a serviceable Indian location. Where pickup is not available, Tatvaan will provide written return instructions and disclose any applicable logistics arrangement before the product is sent.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Customised, engraved, personalised, altered, resized, final-sale or clearly marked non-returnable products are not eligible for change-of-mind returns. This does not limit remedies for an incorrect, damaged, defective or materially misdescribed product.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Returned products are subject to identity and quality inspection. If approved, Tatvaan will ordinarily initiate the refund within 7 to 10 business days to the original payment method, after which the bank or payment provider may require additional processing time.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Unless a different treatment was clearly disclosed before purchase, an approved eligible return will receive the amount paid for the returned product, including applicable taxes. Premium delivery or other optional service charges may be non-refundable, except where the return results from an incorrect, damaged, defective or materially misdescribed product supplied by Tatvaan.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Tatvaan may make only clearly disclosed and legally permissible deductions, such as the value of an unreturned promotional gift, missing-certificate re-certification costs or repair of customer-caused damage. No such deduction will be made where the return is caused solely by Tatvaan supplying an incorrect, damaged or defective product.
              </p>
            </div>

            {/* 12. Exchange and Buyback */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                12. Exchange and Buyback
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Lifetime exchange or buyback applies only to products expressly identified as eligible on the product page, invoice or applicable Exchange and Buyback Policy.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Any valuation will be based on verified metal purity and net weight, verified diamond or stone details, product condition, authenticity and Tatvaan&apos;s disclosed rates on the valuation date. Making charges, taxes, certification, delivery, discounts and other service charges are not part of material value unless the applicable policy expressly states otherwise.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                The exact exchange percentage, buyback percentage, deductions, minimum new-purchase value, payment process and required documents will be governed by the Exchange and Buyback Policy disclosed at the time of purchase. A reference to a percentage of assessed value does not mean the same percentage of the original invoice amount.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Tatvaan may decline a product that cannot be authenticated, has substituted components, has been materially altered by another jeweller, is linked to fraud, theft or an ownership dispute, or does not satisfy applicable KYC or legal requirements.
              </p>
            </div>

            {/* 13. Warranty, Resizing and After-Sales Service */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                13. Warranty, Resizing and After-Sales Service
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Any manufacturing warranty, complimentary resizing or lifetime service support applies only as described on the product page, invoice or applicable Warranty and Service Policy.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                A manufacturing warranty covers only verified manufacturing or workmanship defects and does not cover normal wear, scratches, accidental damage, misuse, chemical damage, loss, theft, impact-related stone loss or repair or alteration by an unauthorised third party.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Where a service is chargeable, Tatvaan will communicate the proposed charges before work begins. Nothing in a voluntary warranty or service policy limits a mandatory consumer right relating to defective goods.
              </p>
            </div>

            {/* 14. Offers, Coupons and Promotional Gifts */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                14. Offers, Coupons and Promotional Gifts
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Promotions are governed by their stated conditions. Unless expressly stated, offers cannot be combined, applied retrospectively or redeemed for cash, and may be limited by product, period, inventory or minimum purchase value.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                A promotional gift supplied with an order must accompany an eligible return. Its disclosed value may be deducted if it is not returned, except where such a deduction is not legally permissible.
              </p>
            </div>

            {/* 15. Accounts and Acceptable Use */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                15. Accounts and Acceptable Use
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Customers are responsible for keeping account credentials confidential and for notifying Tatvaan of suspected unauthorised use.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                The website must not be used to commit fraud, place unlawful orders, misuse promotions, introduce malicious software, scrape content, interfere with systems, impersonate another person, submit false claims or reviews, or attempt unauthorised access.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Tatvaan may suspend or close an account used in breach of these Terms, subject to applicable law.
              </p>
            </div>

            {/* 16. Intellectual Property */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                16. Intellectual Property
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Tatvaan&apos;s name, logo, product photographs, videos, original text, graphics, packaging, certificates, website presentation and legally protected product designs are owned by or licensed to Tatvaan.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                No such content may be copied, reproduced, published, adapted, manufactured from or commercially used without written permission, except to the extent permitted by law.
              </p>
            </div>

            {/* 17. Reviews and Customer Content */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                17. Reviews and Customer Content
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                A customer submitting a review, photograph or other content confirms that it is genuine, lawful and does not infringe another person&apos;s rights.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Tatvaan may display or use submitted content in accordance with the consent and submission terms presented to the customer. Fraudulent, unlawful, abusive or irrelevant content may be removed, but a genuine review will not be removed merely because it is negative.
              </p>
            </div>

            {/* 18. Third-Party Services */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                18. Third-Party Services
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                The website may link to payment providers, couriers, certification laboratories, EMI providers, social-media platforms or other third parties. Their independent services may be governed by their own terms and privacy practices.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Tatvaan is not responsible for third-party content or systems except to the extent responsibility cannot legally be excluded or where Tatvaan remains responsible under applicable law.
              </p>
            </div>

            {/* 19. Privacy */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                19. Privacy
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Tatvaan&apos;s collection and use of personal data is governed by its Privacy Policy and applicable data-protection law. Customers should review the Privacy Policy before creating an account or placing an order.
              </p>
            </div>

            {/* 20. Liability */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                20. Liability
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Tatvaan is responsible for direct loss caused by its breach of these Terms to the extent required by law.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                To the extent legally permitted, Tatvaan is not responsible for indirect or consequential business loss, loss caused by inaccurate customer information, customer misuse, unauthorised repair, payment-provider failure, courier disruption or events beyond reasonable control.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Nothing in these Terms excludes liability that cannot lawfully be excluded or limits a customer&apos;s mandatory statutory rights.
              </p>
            </div>

            {/* 21. Events Beyond Reasonable Control */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                21. Events Beyond Reasonable Control
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Tatvaan will not be responsible for delay or failure caused by events beyond reasonable control, including natural disasters, fire, flood, war, civil disturbance, government restrictions, transport disruption, labour disputes, epidemics, system failures, or hallmarking, certification or courier interruption.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Tatvaan will take reasonable steps to inform affected customers and complete, reschedule, replace or refund affected orders as appropriate.
              </p>
            </div>

            {/* 22. Governing Law, Consumer Rights and General Provisions */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                22. Governing Law, Consumer Rights and General Provisions
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                These Terms are governed by the laws of India. The parties should first attempt to resolve a dispute through good-faith communication.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Subject to applicable consumer-protection law and the customer&apos;s right to approach a competent Consumer Commission or another legally available forum, courts at Bhavnagar, Gujarat will have jurisdiction.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                If any provision of these Terms is found unlawful or unenforceable, the remaining provisions will continue to apply. A failure or delay by Tatvaan in enforcing a provision does not waive its right to enforce that or another provision later.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Nothing in these Terms excludes or reduces a right that cannot lawfully be excluded or reduced.
              </p>
            </div>

            {/* 23. Changes to These Terms */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                23. Changes to These Terms
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light mb-4">
                Tatvaan may update these Terms for future use of the website and future orders. The version applicable to an order will ordinarily be the version displayed when that order was placed.
              </p>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                A later update will not retrospectively reduce a customer&apos;s confirmed contractual or statutory rights.
              </p>
            </div>

            {/* 24. Contact Details */}
            <div className="border-t border-[#F3F1EC] pt-8">
              <h2 className="font-cormorant text-[28px] md:text-[32px] text-[#2E3135] font-normal mb-4">
                24. Contact Details
              </h2>
              <ul className="space-y-3 font-inter text-[15px] text-[#555] font-light list-disc pl-5 leading-[1.8]">
                <li><strong className="text-[#2E3135] font-medium">Tatvaan Jewels</strong></li>
                <li><strong className="text-[#2E3135] font-medium">Legal Entity:</strong> Ira Jewels Pvt Ltd</li>
                <li><strong className="text-[#2E3135] font-medium">Registered Address:</strong> 3rd Floor, P 2557, 301, 302, 303, Sumantra Complex, Opp. Ram Mandir, Bhavnagar, Gujarat, 364002</li>
                <li><strong className="text-[#2E3135] font-medium">Customer Care:</strong> 9023454014</li>
                <li><strong className="text-[#2E3135] font-medium">Email:</strong> Irajewels849@gmail.com</li>
                <li><strong className="text-[#2E3135] font-medium">Website:</strong> www.tatvaan.com</li>
                <li><strong className="text-[#2E3135] font-medium">GSTIN:</strong> 24AAHCI5512M1ZH</li>
                <li><strong className="text-[#2E3135] font-medium">CIN/Registration Number:</strong> U32111GJ2024PTC149063</li>
              </ul>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
