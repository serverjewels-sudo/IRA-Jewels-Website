import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#FFFFFF] border-t border-[#F3F1EC] pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Top: Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-16">
          {/* Column 0: Logo & Bio */}
          <div className="flex flex-col space-y-4">
            <div className="font-serif text-[20px] tracking-[0.2em] text-[#2E3135] uppercase">
              TATVAAN
            </div>
            <p className="text-[12px] font-light font-inter text-[#2E3135]/70 leading-relaxed max-w-xs">
              Handcrafted everyday luxury made with ethical, stunning lab-grown diamonds.
            </p>
          </div>

          {/* Column 1: Shop */}
          <div>
            <h3 className="font-serif text-[13px] tracking-widest text-[#2E3135] uppercase mb-5 font-semibold">
              Shop
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shop" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  All Jewellery
                </Link>
              </li>
              <li>
                <Link href="/shop?category=rings" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  Rings
                </Link>
              </li>
              <li>
                <Link href="/shop?category=necklaces" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  Necklaces
                </Link>
              </li>
              <li>
                <Link href="/shop?category=earrings" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  Earrings
                </Link>
              </li>
              <li>
                <Link href="/shop?category=bangles" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  Bangles
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  Offers
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Help */}
          <div>
            <h3 className="font-serif text-[13px] tracking-widest text-[#2E3135] uppercase mb-5 font-semibold">
              Help
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/track-order" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  Size Guide
                </Link>
              </li>
              <li>
                <Link href="/care" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  Care Instructions
                </Link>
              </li>
              <li>
                <Link href="/custom-order" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  Custom Order
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Learn */}
          <div>
            <h3 className="font-serif text-[13px] tracking-widest text-[#2E3135] uppercase mb-5 font-semibold">
              Learn
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/learn" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  About Lab Diamonds
                </Link>
              </li>
              <li>
                <Link href="/certificate" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  Certificate Info
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/connect" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  Connect
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom: Copyright & Fine Print */}
        <div className="border-t border-[#F3F1EC] pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col space-y-2 items-center md:items-start">
            <div className="text-[11px] font-medium tracking-widest text-[#2E3135]/60 uppercase">
              &copy; {new Date().getFullYear()} TATVAAN. Handcrafted Everyday Luxury. All rights reserved.
            </div>
            <div className="text-[12px] font-inter font-light text-[#2E3135]">
              GSTIN: 24AAHCI5512M1ZH
            </div>
          </div>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="text-[11px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300 uppercase tracking-widest">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

