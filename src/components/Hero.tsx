/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Star, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeroProps {
  onExplore: () => void;
  onBespokeInquiry: () => void;
}

const SHOTS = [
  {
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=1600',
    title: 'JAIPUR BESPOKE ATELIER',
    subtitle: 'Co-Create Your Eternal Royal Masterpiece',
    caption: 'Work side-by-side with our third-generation master jewelers to turn your ideas into a treasured heirloom.'
  },
  {
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=1600',
    title: 'THE COLOURED MAJESTY',
    subtitle: 'Traditional Kundan, Polki & Imperial Emeralds',
    caption: 'Vivid, authentic, ethically sourced specimens celebrating the historic fire of certified natural precious stones.'
  },
  {
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1600',
    title: 'THE DIAMOND HERITAGE',
    subtitle: 'Woven with Light, Forged for Generations',
    caption: 'Discover our signature Solitaire and Mangalsutra creations featuring master-grade ethical GIA certified diamonds.'
  }
];

export default function Hero({ onExplore, onBespokeInquiry }: HeroProps) {
  const [currentShot, setCurrentShot] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentShot((prev) => (prev + 1) % SHOTS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[80vh] min-h-[500px] w-full bg-[#022c22] overflow-hidden flex items-center">
      {/* Background Slideshow with high contrast vivid crossfades */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentShot}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 0.95, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${SHOTS[currentShot].image})`,
              filter: 'brightness(1.1) contrast(1.12) saturate(1.08)'
            }}
          />
        </AnimatePresence>
        {/* Deep jewel-tone dark teal gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#022c22]/95 via-[#022c22]/75 to-transparent" />
      </div>

      {/* Hero Central Content Wrapper with left gradient overlay */}
      <div className="absolute inset-0 z-10 flex items-center" style={{
        background: 'linear-gradient(to right, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.25) 50%, rgba(0, 0, 0, 0) 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full select-none font-sans">
          <div className="max-w-3xl text-left">
            <div className="inline-flex items-center space-x-2 bg-[#1a6b5c]/20 border border-[#1a6b5c]/40 rounded-full py-1.5 px-3.5 mb-6 backdrop-blur-md">
              <Sparkles size={11} className="text-[#34d399] animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#34d399] font-mono">
                THE APEX OF INDIAN ROYAL JEWELRY
              </span>
            </div>

            <div className="space-y-4">
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-light tracking-[0.08em] text-white leading-tight mb-4 uppercase">
                THE FINEST INDIAN JEWELLERY
                <span className="block text-xl sm:text-2xl font-serif font-light text-[#E5D3B3] italic tracking-[0.05em] mt-2 normal-case font-medium">
                  Colombian Emeralds • Polki Diamonds • Ceylon Sapphires
                </span>
              </h1>
              <p className="text-gray-200 font-sans text-xs sm:text-sm max-w-xl font-light leading-relaxed tracking-wide mb-8">
                Explore royal, BIS Hallmark certified treasures individually hand-finished in our Jaipur and Mumbai high-studios.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                id="hero-shop-boutique"
                onClick={onExplore}
                className="bg-[#1a6b5c] hover:bg-[#1a6b5c]/90 text-white font-semibold text-xs uppercase tracking-[0.2em] py-4 px-8 rounded-sm transition-all duration-300 transform shadow-lg shadow-[#1a6b5c]/25 hover:shadow-xl hover:shadow-[#1a6b5c]/30 flex items-center space-x-2.5 pointer-events-auto cursor-pointer"
              >
                <span>EXPLORE COLLECTIONS</span>
                <ArrowRight size={14} />
              </button>
              <button
                id="hero-bespoke-inquiry"
                onClick={onBespokeInquiry}
                className="bg-white hover:bg-white/95 text-[#022c22] font-bold text-xs uppercase tracking-[0.2em] py-4 px-8 rounded-sm transition-all duration-300 pointer-events-auto cursor-pointer shadow-lg shadow-black/15"
              >
                BOOK BESPOKE CONSULTATION
              </button>
            </div>

            {/* Mobile only quick stats */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '24px',
              flexWrap: 'wrap'
            }} className="mobile-stats">
              {[
                '500+ Designs',
                '10,000+ Customers',
                '100% Certified',
                'Since 2010'
              ].map((stat, i, arr) => (
                <span key={i} style={{
                  color: 'white',
                  fontSize: '11px',
                  letterSpacing: '1px',
                  opacity: 0.85
                }}>
                  {stat}
                  {i < arr.length - 1 && 
                    <span style={{
                      margin: '0 6px',
                      opacity: 0.5
                    }}>|</span>
                  }
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Slide Indicator Dots */}
      <div className="absolute bottom-8 right-8 z-10 flex space-x-2">
        {SHOTS.map((_, index) => (
          <button
            key={index}
            id={`slide-dot-${index}`}
            onClick={() => setCurrentShot(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 pointer-events-auto cursor-pointer ${
              currentShot === index ? 'w-8 bg-[#1a6b5c]' : 'bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Atelier Values Floating Section */}
      <div className="hidden md:flex absolute bottom-0 left-0 right-0 z-10 transform translate-y-1/2 justify-center max-w-5xl mx-auto px-4 select-none">
        <div className="bg-white border border-[#1a6b5c]/20 rounded-sm py-4 px-6 shadow-xl grid grid-cols-3 gap-6 w-full text-center">
          <div className="flex items-center space-x-3 justify-center border-r border-[#1a6b5c]/10 pr-4">
            <Award size={18} className="text-[#1a6b5c]" />
            <div className="text-left">
              <p className="text-[10px] text-[#999] font-mono tracking-widest uppercase">GIA & BIS HALLMARKED</p>
              <p className="text-xs text-[#0a0a0a] font-serif font-medium">100% Certified Purity</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 justify-center border-r border-[#1a6b5c]/10 px-4">
            <Sparkles size={18} className="text-[#1a6b5c]" />
            <div className="text-left">
              <p className="text-[10px] text-[#999] font-mono tracking-widest uppercase">JAIPUR & MUMBAI</p>
              <p className="text-xs text-[#0a0a0a] font-serif font-medium">Generations of Craft</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 justify-center pl-4">
            <Star size={18} className="text-[#1a6b5c]" />
            <div className="text-left">
              <p className="text-[10px] text-[#999] font-mono tracking-widest uppercase">LIFETIME SERVICE</p>
              <p className="text-xs text-[#0a0a0a] font-serif font-medium">Free Polishing & Assay Valuation</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
