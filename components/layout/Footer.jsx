"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function Footer() {
  const [isShopFooterOpen, setIsShopFooterOpen] = useState(false);
  const [isHelpFooterOpen, setIsHelpFooterOpen] = useState(false);
  const [isLearnFooterOpen, setIsLearnFooterOpen] = useState(false);
  const [isAboutFooterOpen, setIsAboutFooterOpen] = useState(false);
  const [isConnectFooterOpen, setIsConnectFooterOpen] = useState(false);

  return (
    <footer className="w-full bg-[#FFFFFF] border-t border-[#F3F1EC] pt-16 pb-12 px-6 lg:px-16">
      <div className="max-w-[1800px] mx-auto">
        {/* Top: Columns Grid */}
        <div className="flex flex-col md:flex-row md:justify-between gap-10 md:gap-6 mb-16">
          {/* Column 0: Logo & Bio */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <img
              src="https://vlfxeyrhbsftlxczlgrs.supabase.co/storage/v1/object/public/site-assets/tatvaan-logo-trimmed.jpg"
              alt="TATVAAN"
              className="h-[220px] w-auto"
            />
          </div>

          {/* Column 1: Shop */}
          <div>
            {/* Mobile Toggle Button */}
            <button
              onClick={() => setIsShopFooterOpen(!isShopFooterOpen)}
              className="md:hidden w-full flex justify-between items-center font-serif text-[13px] tracking-widest text-[#2E3135] uppercase mb-5 font-semibold focus:outline-none"
            >
              <span>Shop</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isShopFooterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Desktop Static Heading */}
            <h3 className="hidden md:block font-serif text-[13px] tracking-widest text-[#2E3135] uppercase mb-5 font-semibold">
              Shop
            </h3>
            
            <ul className={`space-y-3 ${isShopFooterOpen ? 'block' : 'hidden'} md:block`}>
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
            {/* Mobile Toggle Button */}
            <button
              onClick={() => setIsHelpFooterOpen(!isHelpFooterOpen)}
              className="md:hidden w-full flex justify-between items-center font-serif text-[13px] tracking-widest text-[#2E3135] uppercase mb-5 font-semibold focus:outline-none"
            >
              <span>Customer Care</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isHelpFooterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Desktop Static Heading */}
            <h3 className="hidden md:block font-serif text-[13px] tracking-widest text-[#2E3135] uppercase mb-5 font-semibold">
              Customer Care
            </h3>
            
            <ul className={`space-y-3 ${isHelpFooterOpen ? 'block' : 'hidden'} md:block`}>
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
                <Link href="/contact" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  FAQ&apos;s
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Learn */}
          <div>
            {/* Mobile Toggle Button */}
            <button
              onClick={() => setIsLearnFooterOpen(!isLearnFooterOpen)}
              className="md:hidden w-full flex justify-between items-center font-serif text-[13px] tracking-widest text-[#2E3135] uppercase mb-5 font-semibold focus:outline-none"
            >
              <span>Learn</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isLearnFooterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Desktop Static Heading */}
            <h3 className="hidden md:block font-serif text-[13px] tracking-widest text-[#2E3135] uppercase mb-5 font-semibold">
              Learn
            </h3>
            
            <ul className={`space-y-3 ${isLearnFooterOpen ? 'block' : 'hidden'} md:block`}>
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
            </ul>
          </div>

          {/* Column 4: About */}
          <div>
            {/* Mobile Toggle Button */}
            <button
              onClick={() => setIsAboutFooterOpen(!isAboutFooterOpen)}
              className="md:hidden w-full flex justify-between items-center font-serif text-[13px] tracking-widest text-[#2E3135] uppercase mb-5 font-semibold focus:outline-none"
            >
              <span>About</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isAboutFooterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Desktop Static Heading */}
            <h3 className="hidden md:block font-serif text-[13px] tracking-widest text-[#2E3135] uppercase mb-5 font-semibold">
              About
            </h3>
            
            <ul className={`space-y-3 ${isAboutFooterOpen ? 'block' : 'hidden'} md:block`}>
              <li>
                <Link href="/about-tatvaan" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  About Tatvaan
                </Link>
              </li>
              <li>
                <Link href="/our-craft" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  Our Craft
                </Link>
              </li>
              <li>
                <Link href="/why-tatvaan" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  Why Tatvaan
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Connect */}
          <div>
            {/* Mobile Toggle Button */}
            <button
              onClick={() => setIsConnectFooterOpen(!isConnectFooterOpen)}
              className="md:hidden w-full flex justify-between items-center font-serif text-[13px] tracking-widest text-[#2E3135] uppercase mb-5 font-semibold focus:outline-none"
            >
              <span>Connect</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isConnectFooterOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Desktop Static Heading */}
            <h3 className="hidden md:block font-serif text-[13px] tracking-widest text-[#2E3135] uppercase mb-5 font-semibold">
              Connect
            </h3>
            
            <ul className={`space-y-3 ${isConnectFooterOpen ? 'block' : 'hidden'} md:block`}>
              <li>
                <Link href="/connect" className="text-[13px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300">
                  Connect With Us
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
          <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-3 mt-4 md:mt-0">
            <Link href="/terms-and-conditions" className="text-[11px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300 uppercase tracking-widest">
              Terms & Conditions
            </Link>
            <Link href="/return-refund-policy" className="text-[11px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300 uppercase tracking-widest">
              Return & Refund Policy
            </Link>
            <Link href="/privacy-policy" className="text-[11px] font-inter font-light text-[#2E3135]/70 hover:text-[#CDB38B] transition-colors duration-300 uppercase tracking-widest">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

