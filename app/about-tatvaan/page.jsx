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
        <section className="py-[60px] px-6 sm:px-8 lg:px-12 bg-white">
          <div className="max-w-[860px] mx-auto space-y-12 text-left">
            
            {/* Intro */}
            <div className="space-y-6">
              <h2 className="font-cormorant italic text-[24px] md:text-[28px] text-[#2E3135] text-center font-normal">
                &quot;Every Piece, A Promise.&quot;
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Some jewellery is simply worn. Some becomes part of your story. At Tatvaan, we create lab-grown diamond jewellery for a new generation—people who celebrate love, ambition, individuality, and every milestone along the way. A first achievement. A new beginning. A promise to someone special. A gift to yourself. Every moment has meaning, and every Tatvaan piece is designed to hold it. We bring together modern design, skilled craftsmanship, and the brilliance of lab-grown diamonds to create jewellery that feels personal, effortless, and made for real life. Because jewellery should not stay inside a locker. It should move with you, shine with you, and become part of who you are.
              </p>
            </div>

            {/* Our Story */}
            <div className="space-y-6 pt-8 border-t border-[#F3F1EC]">
              <h2 className="font-cormorant text-[28px] md:text-[36px] text-[#2E3135] font-normal text-center">
                Our Story
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Tatvaan began with a simple thought: Diamond jewellery should feel more relevant to today. For a long time, diamonds were seen as something reserved for weddings, anniversaries, or rare occasions. But today&apos;s generation celebrates life differently. A new job deserves a celebration. A personal goal deserves a reward. A friendship deserves something meaningful. And sometimes, you do not need a reason at all. Tatvaan was created for people who want beautiful diamond jewellery that fits their style, values, and everyday life. Our name comes from the Sanskrit word Tatva, meaning the true essence. For us, the true essence of jewellery is not only how it looks. It is how it makes you feel. Confident. Expressive. Connected. Completely yourself.
              </p>
            </div>

            {/* Made for a New Generation */}
            <div className="space-y-6 pt-8 border-t border-[#F3F1EC]">
              <h2 className="font-cormorant text-[28px] md:text-[36px] text-[#2E3135] font-normal text-center">
                Made for a New Generation
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Tatvaan is designed for people who respect tradition but are not afraid to create their own. People who choose thoughtfully. People who care about design, quality, honesty, and value. Our jewellery is modern, versatile, and easy to style. It can be worn at a wedding, at work, over coffee, during a celebration, or on an ordinary day that you decide to make special. We create pieces that feel refined without feeling heavy, stylish without following every trend, and meaningful without trying too hard. Because your jewellery should match your life—not limit it.
              </p>
            </div>

            {/* Jewellery for Every Version of You */}
            <div className="space-y-6 pt-8 border-t border-[#F3F1EC]">
              <h2 className="font-cormorant text-[28px] md:text-[36px] text-[#2E3135] font-normal text-center">
                Jewellery for Every Version of You
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                You are not the same person every day. Some days you are bold. Some days you are minimal. Some days you dress to celebrate. Some days you just want to feel good. Tatvaan jewellery is created for every version of you. A delicate pendant for everyday confidence. A statement ring for your boldest moments. A timeless pair of earrings for celebrations. A bracelet that reminds you of how far you have come. Every piece is designed to feel personal, wearable, and easy to make your own. Because style is not about following rules. It is about expressing who you are.
              </p>
            </div>

            {/* This Is Tatvaan */}
            <div className="space-y-6 pt-8 border-t border-[#F3F1EC]">
              <h2 className="font-cormorant text-[28px] md:text-[36px] text-[#2E3135] font-normal text-center">
                This Is Tatvaan
              </h2>
              <p className="font-inter text-[15px] text-[#555] leading-[1.8] font-light">
                Made for your moments. Designed for your style. Crafted for everyday confidence. Created for a new generation.
              </p>
              <p className="font-cormorant text-[22px] md:text-[26px] text-[#2E3135] text-center font-medium italic mt-12">
                Tatvaan — Every Piece, A Promise.
              </p>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
