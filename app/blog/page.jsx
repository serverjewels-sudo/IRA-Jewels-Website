import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";

export const metadata = {
  title: "Stories & Insights | TATVAAN",
  description: "Jewellery care, diamond education, and style inspiration. Learn how to care for your pieces, understand the 4Cs, and get style inspiration.",
};

const articles = [
  {
    id: 1,
    category: "DIAMOND GUIDE",
    title: "What Makes a Lab Diamond Real?",
    excerpt: "Lab-grown diamonds are chemically, physically and optically identical to mined diamonds. Here's what that means for you.",
    date: "June 15, 2026",
    image: "https://labs.google/fx/api/og-image/shared/42ed3e14-b492-44c5-85ef-cb1d6562bc1f"
  },
  {
    id: 2,
    category: "JEWELLERY CARE",
    title: "How to Keep Your Gold Jewellery Shining Every Day",
    excerpt: "Simple habits that protect your pieces and maintain their brilliance for years to come.",
    date: "June 10, 2026",
    image: "https://labs.google/fx/api/og-image/shared/1adedbf0-21b7-426e-b840-2623822ae3f6"
  },
  {
    id: 3,
    category: "STYLE GUIDE",
    title: "Stacking Rings: The Art of Wearing More Than One",
    excerpt: "From minimalist to maximalist — how to stack rings across your fingers without it looking overdone.",
    date: "June 5, 2026",
    image: "https://labs.google/fx/api/og-image/shared/495c938e-39ea-4c22-83dd-0893d2d8e8ba"
  },
  {
    id: 4,
    category: "BUYING GUIDE",
    title: "The 4Cs Explained Simply — Cut, Colour, Clarity, Carat",
    excerpt: "Everything you need to know before buying a diamond, explained in plain language.",
    date: "May 28, 2026",
    image: "https://labs.google/fx/api/og-image/shared/e0411717-14c4-4e4b-b60e-60ed30bb526e"
  },
  {
    id: 5,
    category: "BEHIND THE SCENES",
    title: "How Every TATVAAN Piece Is Made",
    excerpt: "From raw lab-grown diamond to finished jewellery — a look at our crafting process and quality standards.",
    date: "May 20, 2026",
    image: "https://labs.google/fx/api/og-image/shared/2b2b474c-4608-46ba-9fd5-bbf092cb9409"
  },
  {
    id: 6,
    category: "GIFT GUIDE",
    title: "Gifting Fine Jewellery: A Complete Guide for Every Occasion",
    excerpt: "Anniversaries, birthdays, milestones — find the right piece for every moment that matters.",
    date: "May 12, 2026",
    image: "https://labs.google/fx/api/og-image/shared/f6ebf556-93c6-4128-a9d9-af09a4254be6"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* PAGE HERO */}
        <section className="bg-[#F3F1EC] py-20 text-center px-4" id="blog-hero">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-cormorant text-[52px] font-normal text-[#2E3135] leading-tight">
              Stories & Insights
            </h1>
            <p className="font-inter text-[16px] text-[#888] mt-3 font-normal">
              Jewellery care, diamond education, and style inspiration.
            </p>
          </div>
        </section>

        {/* BLOG GRID SECTION */}
        <section className="bg-white py-16 px-6 sm:px-8 lg:px-12" id="blog-grid">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href="#"
                  className="group flex flex-col h-full bg-white transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] p-4 rounded-[4px] border-0"
                >
                  {/* Image wrapper */}
                  <div className="aspect-[16/9] w-full overflow-hidden relative bg-gray-100 rounded-[2px]">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-[400ms] ease-in-out group-hover:scale-[1.03]"
                    />
                  </div>

                  {/* Content wrapper */}
                  <div className="flex flex-col flex-grow mt-6">
                    {/* Category tag */}
                    <span className="font-inter font-medium text-[10px] uppercase tracking-[1.5px] text-[#CDB38B]">
                      {article.category}
                    </span>

                    {/* Article title */}
                    <h2 className="font-cormorant text-[22px] font-normal text-[#2E3135] mt-3 line-clamp-2 leading-snug">
                      {article.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="font-inter text-[14px] text-[#888] leading-[1.7] mt-2 line-clamp-3 font-normal">
                      {article.excerpt}
                    </p>

                    {/* Bottom row (push to bottom using flex-grow spacer if needed) */}
                    <div className="mt-auto pt-6 flex items-center justify-between border-t border-gray-50/50">
                      <span className="font-inter text-[12px] text-[#aaa]">
                        {article.date}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
