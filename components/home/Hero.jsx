"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function Hero() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      
      // Set initial states to prevent FOUC (flash of unstyled content)
      gsap.set([".hero-headline", ".hero-subheadline", ".hero-cta"], { 
        opacity: 0, 
        y: 30 
      });

      tl.to(".hero-headline", {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out"
      })
      .to(".hero-subheadline", {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power3.out"
      }, "+=0.3") // Stagger 0.3s after headline starts/finishes
      .to(".hero-cta", {
        opacity: 1,
        y: 0,
        duration: 1.0,
        ease: "power3.out",
        stagger: 0.3 // Stagger 0.3s between the buttons
      }, "+=0.3"); // Stagger 0.3s after subheadline
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="relative w-full min-h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] bg-white flex flex-col md:grid md:grid-cols-12 overflow-hidden select-none"
    >
      {/* Left Column: Copy & CTAs */}
      <div className="col-span-6 flex flex-col justify-center px-6 py-12 sm:px-12 md:px-16 lg:px-24 xl:px-28 bg-white h-full">
        <div className="max-w-[540px]">
          {/* Headline */}
          <h1 className="hero-headline font-serif italic font-light text-[46px] sm:text-[62px] md:text-[68px] lg:text-[82px] xl:text-[90px] text-[#2E3135] leading-[1.1] tracking-tight opacity-0">
            You Deserve to Wear Fine Jewelry Every Day.
          </h1>
          
          {/* Subheadline */}
          <p className="hero-subheadline font-sans font-normal text-[17px] text-[#2E3135] leading-[1.8] mt-6 md:mt-8 max-w-[460px] opacity-0">
            Not just on anniversaries. Not just for celebrations. Everyday luxury — for you.
          </p>

          {/* CTA Buttons */}
          <div className="hero-cta-group flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 mt-8 md:mt-12 opacity-0 hero-cta">
            <Link 
              href="/shop"
              className="w-full sm:w-auto inline-block text-center bg-[#2E3135] text-white font-sans font-medium text-[13px] uppercase tracking-[2px] px-8 py-[18px] transition-all duration-300 hover:bg-[#CDB38B] hover:shadow-md"
            >
              FIND YOUR EVERYDAY PIECE
            </Link>
            
            <Link 
              href="/shop?collection=all"
              className="text-[#2E3135] font-sans font-medium text-[13px] uppercase tracking-[2px] py-3 border-b border-transparent hover:border-[#2E3135] transition-all duration-300"
            >
              Shop by Collection
            </Link>
          </div>
        </div>
      </div>

      {/* Right Column: Beautiful Lab Diamond Jewelry Image */}
      <div className="col-span-6 relative w-full h-[45vh] md:h-full overflow-hidden bg-[#F3F1EC]">
        <img 
          src="https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200" 
          alt="Premium Lab-Grown Diamond Jewelry" 
          className="w-full h-full object-cover object-center transition-transform duration-1000 hover:scale-105"
          loading="eager"
        />
        {/* Subtle Overlay to match high-end photo toning */}
        <div className="absolute inset-0 bg-[#2E3135]/5 mix-blend-multiply pointer-events-none"></div>
      </div>
    </section>
  );
}

