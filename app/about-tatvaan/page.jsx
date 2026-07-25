import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "About Tatvaan | TATVAAN",
  description: "About Tatvaan.",
};

export default function AboutTatvaanPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Page Header */}
        <section className="w-full bg-[#2E3135] py-20 text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-cormorant italic text-[40px] md:text-[52px] text-white leading-tight font-normal">
              About Tatvaan
            </h1>
          </div>
        </section>

        {/* Content */}
        <section className="py-[60px] px-6 lg:px-16 bg-white">
          {/* Section 1 Wide Wrapper */}
          <div className="max-w-[1800px] mx-auto">
            {/* Intro */}
            <div className="grid grid-cols-1 md:grid-cols-[540px_1fr] gap-12 lg:gap-16 items-center">
              <div className="w-full">
                <img
                  src="https://labs.google/fx/api/og-image/shared/426018e9-d493-444d-8386-85d456c870a3"
                  alt="Every Piece, A Promise"
                  className="w-full aspect-square object-cover rounded-sm"
                />
              </div>
              <div className="space-y-6 text-left">
                <h2 className="font-cormorant italic text-[24px] md:text-[28px] text-[#2E3135] font-normal">
                  &quot;Every Piece, A Promise.&quot;
                </h2>
                <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                  Some jewellery is simply worn. Some becomes part of your story. At Tatvaan, we create lab-grown diamond jewellery for a new generation—people who celebrate love, ambition, individuality, and every milestone along the way. A first achievement. A new beginning. A promise to someone special. A gift to yourself. Every moment has meaning, and every Tatvaan piece is designed to hold it. We bring together modern design, skilled craftsmanship, and the brilliance of lab-grown diamonds to create jewellery that feels personal, effortless, and made for real life. Because jewellery should not stay inside a locker. It should move with you, shine with you, and become part of who you are.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-[60px] px-6 lg:px-16 bg-white">
          <div className="max-w-[1800px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_540px] gap-12 lg:gap-16 items-center">
              <div className="space-y-6 text-left">
                <h2 className="font-cormorant text-[28px] md:text-[36px] text-[#2E3135] font-normal">
                  Our Story
                </h2>
                <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                  Tatvaan began with a simple thought: Diamond jewellery should feel more relevant to today. For a long time, diamonds were seen as something reserved for weddings, anniversaries, or rare occasions. But today&apos;s generation celebrates life differently. A new job deserves a celebration. A personal goal deserves a reward. A friendship deserves something meaningful. And sometimes, you do not need a reason at all. Tatvaan was created for people who want beautiful diamond jewellery that fits their style, values, and everyday life. Our name comes from the Sanskrit word Tatva, meaning the true essence. For us, the true essence of jewellery is not only how it looks. It is how it makes you feel. Confident. Expressive. Connected. Completely yourself.
                </p>
              </div>
              <div className="w-full">
                <img
                  src="https://labs.google/fx/api/og-image/shared/8b48598a-0e23-4833-9e13-869b8674037c"
                  alt="Our Story"
                  className="w-full aspect-square object-cover rounded-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Made for a New Generation */}
        <section className="py-[60px] px-6 lg:px-16 bg-white">
          <div className="max-w-[1800px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[540px_1fr] gap-12 lg:gap-16 items-center">
              <div className="w-full">
                <img
                  src="https://labs.google/fx/api/og-image/shared/9999133d-2316-45d2-a858-89ace87cabe5"
                  alt="Made for a New Generation"
                  className="w-full aspect-square object-cover rounded-sm"
                />
              </div>
              <div className="space-y-6 text-left">
                <h2 className="font-cormorant text-[28px] md:text-[36px] text-[#2E3135] font-normal">
                  Made for a New Generation
                </h2>
                <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                  Tatvaan is designed for people who respect tradition but are not afraid to create their own. People who choose thoughtfully. People who care about design, quality, honesty, and value. Our jewellery is modern, versatile, and easy to style. It can be worn at a wedding, at work, over coffee, during a celebration, or on an ordinary day that you decide to make special. We create pieces that feel refined without feeling heavy, stylish without following every trend, and meaningful without trying too hard. Because your jewellery should match your life—not limit it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Jewellery for Every Version of You */}
        <section className="py-[60px] px-6 lg:px-16 bg-white">
          <div className="max-w-[1800px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_540px] gap-12 lg:gap-16 items-center">
              <div className="space-y-6 text-left">
                <h2 className="font-cormorant text-[28px] md:text-[36px] text-[#2E3135] font-normal">
                  Jewellery for Every Version of You
                </h2>
                <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                  You are not the same person every day. Some days you are bold. Some days you are minimal. Some days you dress to celebrate. Some days you just want to feel good. Tatvaan jewellery is created for every version of you. A delicate pendant for everyday confidence. A statement ring for your boldest moments. A timeless pair of earrings for celebrations. A bracelet that reminds you of how far you have come. Every piece is designed to feel personal, wearable, and easy to make your own. Because style is not about following rules. It is about expressing who you are.
                </p>
              </div>
              <div className="w-full">
                <img
                  src="https://labs.google/fx/api/og-image/shared/415df881-fd3d-415f-901f-b476292a619c"
                  alt="Jewellery for Every Version of You"
                  className="w-full aspect-square object-cover rounded-sm"
                />
              </div>
            </div>
          </div>
        </section>

        {/* This Is Tatvaan */}
        <section className="py-[60px] px-6 lg:px-16 bg-white">
          <div className="max-w-[1800px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-[540px_1fr] gap-12 lg:gap-16 items-center">
              <div className="w-full">
                <img
                  src="https://labs.google/fx/api/og-image/shared/1dddd731-e771-4454-918d-9e7471cfcfb2"
                  alt="This Is Tatvaan"
                  className="w-full aspect-square object-cover rounded-sm"
                />
              </div>
              <div className="space-y-6 text-left">
                <h2 className="font-cormorant text-[28px] md:text-[36px] text-[#2E3135] font-normal">
                  This Is Tatvaan
                </h2>
                <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                  Made for your moments. Designed for your style. Crafted for everyday confidence. Created for a new generation.
                </p>
                <p className="font-cormorant text-[22px] md:text-[26px] text-[#2E3135] font-medium italic mt-12">
                  Tatvaan — Every Piece, A Promise.
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
