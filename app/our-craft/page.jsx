import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Our Craft | TATVAAN",
  description: "Our Craft.",
};

export default function OurCraftPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="w-full bg-[#2E3135] py-20 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-cormorant italic text-[40px] md:text-[52px] text-white leading-tight font-normal">
              Our Craft
            </h1>
          </div>
        </section>

        {/* Our Craftsmanship */}
        <section className="py-[60px] px-6 lg:px-16 bg-white">
          <div className="max-w-[1800px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[540px_1fr] gap-12 lg:gap-16 items-center">
              <div className="w-full">
                <img
                  src="https://labs.google/fx/api/og-image/shared/58f87cac-04fc-4485-8b46-8dbffaa70f86"
                  alt="Our Craftsmanship"
                  className="w-full aspect-square object-cover rounded-sm"
                />
              </div>
              <div className="space-y-6 text-left">
                <h2 className="font-cormorant text-[28px] md:text-[36px] text-[#2E3135] font-normal">
                  Our Craftsmanship
                </h2>
                <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                  Every Tatvaan piece begins with an idea and is brought to life with patience, precision, and care. Our skilled artisans combine jewellery-making expertise with modern techniques to create pieces that are elegant, comfortable, and made to last.
                </p>
                <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                  From the first sketch to the final polish, every detail matters. The balance of the design. The strength of the setting. The smoothness of the finish. The comfort of the fit. And the way every diamond catches the light.
                </p>
                <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                  The best craftsmanship is not always loud. Sometimes, it is simply felt in the way a piece sits perfectly, looks effortless, and becomes something you want to wear again and again.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Diamonds */}
        <section className="py-[60px] px-6 lg:px-16 bg-white">
          <div className="max-w-[1800px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_540px] gap-12 lg:gap-16 items-center">
              <div className="space-y-6 text-left">
                <h2 className="font-cormorant text-[28px] md:text-[36px] text-[#2E3135] font-normal">
                  Our Diamonds
                </h2>
                <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                  Every Tatvaan diamond is a real diamond. Our lab-grown diamonds have the same physical, chemical, and optical properties as mined diamonds. They offer the same brilliance, sparkle, strength, and beauty. The difference lies in how they are created.
                </p>
                <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                  Using advanced technology, lab-grown diamonds allow us to offer remarkable quality and design at a more accessible value.
                </p>
                <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                  Each diamond is carefully selected before becoming part of a Tatvaan creation. Where applicable, our diamonds are accompanied by certification from internationally recognised gemological laboratories such as IGI, giving you greater confidence and transparency.
                </p>
                <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                  But for us, a certificate is only part of the story. We also look at how the diamond performs in the design, how it reflects light, and how beautifully it comes together in the finished piece. Because a diamond should not only look good on paper. It should feel extraordinary when you wear it.
                </p>
              </div>
              <div className="w-full">
                <img
                  src="https://labs.google/fx/api/og-image/shared/7fb4d421-b380-49e1-9fbd-1fd2b82ab5aa"
                  alt="Our Diamonds"
                  className="w-full aspect-square object-cover rounded-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Lab-Grown Diamonds */}
        <section className="py-[60px] px-6 lg:px-16 bg-white">
          <div className="max-w-[1800px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[540px_1fr] gap-12 lg:gap-16 items-center">
              <div className="w-full">
                <img
                  src="https://labs.google/fx/api/og-image/shared/2ac54d33-6a78-4407-b210-f849bc69efda"
                  alt="Lab-Grown Diamonds"
                  className="w-full aspect-square object-cover rounded-sm"
                />
              </div>
              <div className="space-y-6 text-left">
                <div className="mb-6">
                  <h2 className="font-cormorant text-[28px] md:text-[36px] text-[#2E3135] font-normal mb-1">
                    Lab-Grown Diamonds
                  </h2>
                  <h3 className="font-cormorant italic text-[20px] md:text-[24px] text-[#CDB38B] font-normal">
                    Real Diamonds. Created Differently.
                  </h3>
                </div>
                <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                  Lab-grown diamonds are real diamonds created using advanced technology in carefully controlled environments. They have the same physical, chemical and optical properties as mined diamonds. They offer the same brilliance, strength and beauty. The difference is simply where they come from.
                </p>
                <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                  For Tatvaan, lab-grown diamonds represent a modern way to experience fine jewellery—giving you beautiful quality, thoughtful design and greater value.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Diamond Selection Process */}
        <section className="py-[60px] px-6 lg:px-16 bg-white">
          <div className="max-w-[1800px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_540px] gap-12 lg:gap-16 items-center">
              <div className="space-y-6 text-left">
                <div className="mb-6">
                  <h2 className="font-cormorant text-[28px] md:text-[36px] text-[#2E3135] font-normal mb-1">
                    Our Diamond Selection Process
                  </h2>
                  <h3 className="font-cormorant italic text-[20px] md:text-[24px] text-[#CDB38B] font-normal">
                    Chosen for More Than a Certificate
                  </h3>
                </div>
                <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                  Every diamond is carefully examined before it becomes part of a Tatvaan creation. We consider the qualities that influence its beauty:
                </p>
                <ul className="space-y-3 font-inter text-[15px] text-[#555] font-light list-disc pl-5 marker:text-[#CDB38B]">
                  <li>Cut and proportions</li>
                  <li>Colour and clarity</li>
                  <li>Brilliance and light performance</li>
                  <li>Shape and symmetry</li>
                  <li>Suitability for the final design</li>
                </ul>
                <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                  A diamond may look impressive on paper, but we also consider how it looks in the jewellery and how beautifully it shines when worn. Because the right diamond should not only meet technical standards. It should bring the entire piece to life.
                </p>
              </div>
              <div className="w-full">
                <img
                  src="https://labs.google/fx/api/og-image/shared/01d2311b-02aa-4920-ac93-e7f1dc90a81a"
                  alt="Our Diamond Selection Process"
                  className="w-full aspect-square object-cover rounded-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Certification You Can Trust */}
        <section className="py-[60px] px-6 lg:px-16 bg-white">
          <div className="max-w-[1800px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[540px_1fr] gap-12 lg:gap-16 items-center">
              <div className="w-full">
                <img
                  src="https://labs.google/fx/api/og-image/shared/ae5675c3-4bc4-4140-a51d-04dc26b17e1a"
                  alt="Certification You Can Trust"
                  className="w-full aspect-square object-cover rounded-sm"
                />
              </div>
              <div className="space-y-6 text-left">
                <div className="mb-6">
                  <h2 className="font-cormorant text-[28px] md:text-[36px] text-[#2E3135] font-normal mb-1">
                    Certification You Can Trust
                  </h2>
                  <h3 className="font-cormorant italic text-[20px] md:text-[24px] text-[#CDB38B] font-normal">
                    Confidence in Every Important Detail
                  </h3>
                </div>
                <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                  Where applicable, Tatvaan diamonds are accompanied by certification from internationally recognised gemological laboratories such as IGI. The certificate provides important information about the diamond, including its:
                </p>
                <ul className="space-y-3 font-inter text-[15px] text-[#555] font-light list-disc pl-5 marker:text-[#CDB38B]">
                  <li>Carat weight</li>
                  <li>Colour grade</li>
                  <li>Clarity grade</li>
                  <li>Cut grade, where applicable</li>
                  <li>Measurements</li>
                  <li>Unique identification details</li>
                </ul>
                <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                  Certification helps you understand what you are purchasing and gives you greater confidence in your choice. Certification availability depends on the diamond&apos;s size, jewellery design and product category. The applicable details will be clearly mentioned on the product page and invoice.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Beautifully Within Reach */}
        <section className="py-[60px] px-6 lg:px-16 bg-white">
          <div className="max-w-[1800px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_540px] gap-12 lg:gap-16 items-center">
              <div className="space-y-6 text-left">
                <div className="mb-6">
                  <h2 className="font-cormorant text-[28px] md:text-[36px] text-[#2E3135] font-normal mb-1">
                    Beautifully Within Reach
                  </h2>
                  <h3 className="font-cormorant italic text-[20px] md:text-[24px] text-[#CDB38B] font-normal">
                    Fine Jewellery for Life Today
                  </h3>
                </div>
                <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                  We believe beautiful diamond jewellery should feel special, but never out of reach. Lab-grown diamonds allow us to create jewellery with remarkable brilliance, refined craftsmanship and thoughtful design at a more accessible price.
                </p>
                <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                  This means you can choose a piece that feels more personal, explore a larger diamond or celebrate more of life&apos;s meaningful moments—without compromising on beauty or quality.
                </p>
                <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                  Tatvaan is not about making jewellery feel less precious. It is about making beautifully crafted diamond jewellery easier to own, wear and enjoy. Not only for weddings. Not only for anniversaries. But for every moment that matters to you.
                </p>
              </div>
              <div className="w-full">
                <img
                  src="https://labs.google/fx/api/og-image/shared/54a19da8-fefa-4024-bb5b-58a3ba159de0"
                  alt="Beautifully Within Reach"
                  className="w-full aspect-square object-cover rounded-sm"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
