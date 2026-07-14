"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Gem, ShieldCheck, Flower2 } from "lucide-react";

export default function Hero() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      // Set initial states to prevent FOUC (flash of unstyled content)
      gsap.set([".hero-headline", ".hero-divider", ".hero-subheadline", ".hero-cta", ".hero-trust"], { 
        opacity: 0, 
        y: 30 
      });

      tl.to(".hero-headline", {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out"
      })
      .to(".hero-divider", {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power3.out"
      }, "-=0.8")
      .to(".hero-subheadline", {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power3.out"
      }, "-=0.8")
      .to(".hero-cta", {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power3.out",
      }, "-=0.6")
      .to(".hero-trust", {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power3.out"
      }, "-=0.6");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-dvh flex items-end md:items-center overflow-hidden select-none"
    >
      {/* Background Image - Object Right ensures we never crop the model/jewelry on the right */}
      <img 
        src="https://vlfxeyrhbsftlxczlgrs.supabase.co/storage/v1/object/public/product-images/Perfect_change_need_white_2K_202607102235.jpeg" 
        alt="Premium Lab-Grown Diamond Jewelry" 
        className="absolute inset-0 w-full h-full object-cover object-right z-0"
        loading="eager"
      />

      {/* Light Gradient Overlay for text readability (specifically for mobile where image crops from left) */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#F3F1EC]/90 via-[#F3F1EC]/50 to-transparent md:from-[#F3F1EC]/30 md:via-transparent z-0"></div>

      {/* Content Column */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 lg:px-8 xl:px-12 pt-20 pb-16 md:pb-0">
        <div className="max-w-[540px]">
          {/* Headline */}
          <h1 className="hero-headline font-serif italic font-light text-[36px] min-[360px]:text-[40px] min-[390px]:text-[44px] min-[430px]:text-[52px] sm:text-[68px] md:text-[76px] lg:text-[84px] xl:text-[92px] text-[#2E3135] leading-[1.05] tracking-tight opacity-0">
            Every Piece,<br />
            a Promise.
          </h1>
          
          {/* Decorative Divider */}
          <div className="hero-divider flex items-center gap-4 mt-6 opacity-0">
            <div className="h-[1px] w-12 bg-[#2E3135]/30"></div>
            <Gem className="w-4 h-4 text-[#2E3135]/60 stroke-[1.5]" />
            <div className="h-[1px] w-12 bg-[#2E3135]/30"></div>
          </div>

          {/* Subheadline */}
          <p className="hero-subheadline font-sans font-normal text-[16px] sm:text-[17px] text-[#2E3135] leading-[1.8] mt-6 max-w-[420px] opacity-0">
            Luxury fine jewellery crafted to celebrate the moments that become memories.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8 md:mt-10 opacity-0">
            <Link 
              href="/shop"
              className="w-full sm:w-auto inline-block text-center bg-[#2E3135] text-white font-sans font-medium text-[12px] sm:text-[13px] uppercase tracking-[2px] px-6 sm:px-8 py-[16px] transition-all duration-300 hover:bg-[#CDB38B]"
            >
              EXPLORE COLLECTION &rarr;
            </Link>
            
            <Link 
              href="/about"
              className="w-full sm:w-auto inline-block text-center bg-white/30 backdrop-blur-sm border border-[#2E3135] text-[#2E3135] font-sans font-medium text-[12px] sm:text-[13px] uppercase tracking-[2px] px-6 sm:px-8 py-[16px] transition-all duration-300 hover:bg-[#2E3135] hover:text-white"
            >
              OUR STORY &rarr;
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="hero-trust flex flex-wrap items-center justify-between min-[430px]:justify-start min-[430px]:gap-x-6 gap-y-4 sm:gap-8 mt-12 md:mt-16 opacity-0 w-full min-[430px]:w-auto">
            {/* Badge 1 */}
            <div className="flex items-center gap-1.5 min-[375px]:gap-2 min-[430px]:gap-3">
              <div className="flex-shrink-0 w-7 h-7 min-[375px]:w-8 min-[375px]:h-8 min-[430px]:w-10 min-[430px]:h-10 rounded-full border border-[#2E3135]/40 flex items-center justify-center">
                <Gem className="w-3 h-3 min-[375px]:w-3.5 min-[375px]:h-3.5 min-[430px]:w-[18px] min-[430px]:h-[18px] text-[#2E3135] stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-semibold text-[7px] min-[360px]:text-[8px] min-[430px]:text-[10px] uppercase tracking-[0.1em] text-[#2E3135] leading-tight">IGI Certified</span>
                <span className="font-sans font-semibold text-[7px] min-[360px]:text-[8px] min-[430px]:text-[10px] uppercase tracking-[0.1em] text-[#2E3135]/70 leading-tight">Diamonds</span>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="flex items-center gap-1.5 min-[375px]:gap-2 min-[430px]:gap-3">
              <div className="flex-shrink-0 w-7 h-7 min-[375px]:w-8 min-[375px]:h-8 min-[430px]:w-10 min-[430px]:h-10 rounded-full border border-[#2E3135]/40 flex items-center justify-center">
                <ShieldCheck className="w-3 h-3 min-[375px]:w-3.5 min-[375px]:h-3.5 min-[430px]:w-[18px] min-[430px]:h-[18px] text-[#2E3135] stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-semibold text-[7px] min-[360px]:text-[8px] min-[430px]:text-[10px] uppercase tracking-[0.1em] text-[#2E3135] leading-tight">Lifetime</span>
                <span className="font-sans font-semibold text-[7px] min-[360px]:text-[8px] min-[430px]:text-[10px] uppercase tracking-[0.1em] text-[#2E3135]/70 leading-tight">Service</span>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="flex items-center gap-1.5 min-[375px]:gap-2 min-[430px]:gap-3">
              <div className="flex-shrink-0 w-7 h-7 min-[375px]:w-8 min-[375px]:h-8 min-[430px]:w-10 min-[430px]:h-10 rounded-full border border-[#2E3135]/40 flex items-center justify-center">
                <Flower2 className="w-3 h-3 min-[375px]:w-3.5 min-[375px]:h-3.5 min-[430px]:w-[18px] min-[430px]:h-[18px] text-[#2E3135] stroke-[1.5]" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans font-semibold text-[7px] min-[360px]:text-[8px] min-[430px]:text-[10px] uppercase tracking-[0.1em] text-[#2E3135] leading-tight">Crafted</span>
                <span className="font-sans font-semibold text-[7px] min-[360px]:text-[8px] min-[430px]:text-[10px] uppercase tracking-[0.1em] text-[#2E3135]/70 leading-tight">in India</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
