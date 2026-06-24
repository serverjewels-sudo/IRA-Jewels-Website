/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star, Quote, Award, ShieldCheck } from 'lucide-react';

interface Testimonial {
  name: string;
  location: string;
  quote: string;
  rating: number;
  tag: string;
}

const TESTIMONIALS_DATA: Testimonial[] = [
  {
    name: 'Devika S.',
    location: 'Mumbai',
    quote: 'LuxeLoom recreated my grandmother’s antique choker set with absolute perfection. The BIS Hallmark and IGI diamonds provide complete peace of mind.',
    rating: 5,
    tag: 'Grand Choker Replica'
  },
  {
    name: 'Rohan M.',
    location: 'New Delhi',
    quote: 'Found the perfect solitaire engagement ring with conflict-free diamonds. The Bajaj No-Cost EMI made this premium acquisition flawless.',
    rating: 5,
    tag: 'Solitaire Engagement'
  },
  {
    name: 'Priya K.',
    location: 'Bangalore',
    quote: 'The custom mangalsutra designed at their Jaipur atelier is a masterpiece. Highly professional, and secure insured transit was very reliable.',
    rating: 5,
    tag: 'Atelier Custom Spec'
  }
];

export default function Testimonials() {
  return (
    <section className="bg-white border-y border-[#1a6b5c]/10 py-16 sm:py-20 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12 sm:mb-16">
          <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#1a6b5c] font-semibold block">
            Client Appraisals
          </span>
          <h2 className="font-serif text-2xl sm:text-3.5xl font-light text-[#0a0a0a] tracking-normal uppercase">
            Stories of Custom Grandeur
          </h2>
          <div className="w-12 h-0.5 bg-[#1a6b5c]/35 mx-auto rounded-full" />
        </div>

        {/* Testimonials Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS_DATA.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#f5f0eb]/40 border border-[#1a6b5c]/10 rounded-xs p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#1a6b5c]/40 hover:shadow-[0_12px_24px_rgba(26,107,92,0.04)] transition-all duration-300 relative"
            >
              {/* Luxury Quote Icon Overlay */}
              <span className="absolute top-4 right-4 text-[#1a6b5c]/5 pointer-events-none">
                <Quote size={40} />
              </span>

              {/* Star Rating Strip */}
              <div className="space-y-3">
                <div className="flex text-amber-500 space-x-0.5">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} size={13} fill="currentColor" />
                  ))}
                </div>
                {/* Quote details */}
                <p className="font-sans text-xs sm:text-[13px] text-[#0a0a0a]/85 leading-relaxed font-light italic">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </div>

              {/* Author Info Block */}
              <div className="pt-4 border-t border-[#1a6b5c]/10 flex items-center justify-between text-xs font-mono">
                <div>
                  <h4 className="font-serif text-xs font-semibold text-[#0a0a0a]">{item.name}</h4>
                  <p className="text-[9px] text-[#666] uppercase tracking-wide mt-0.5">{item.location}</p>
                </div>
                <span className="bg-[#1a6b5c]/5 text-[#1a6b5c] text-[8px] uppercase tracking-wider font-bold py-1 px-2.5 border border-[#1a6b5c]/10 rounded-xs">
                  {item.tag}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Trust Badge Stamp Strip */}
        <div className="mt-12 pt-8 border-t border-dashed border-[#1a6b5c]/15 flex flex-wrap justify-between items-center text-[10px] text-[#666] font-mono gap-4 lg:gap-8 px-2">
          <div className="flex items-center space-x-2">
            <Award size={14} className="text-[#1a6b5c]" />
            <span>AVERAGE CLIENT VALUATION: 4.95 / 5.0 (AUDITED BY CRISIL REVIEWS)</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck size={14} className="text-[#1a6b5c]" />
            <span>100% INDEPENDENTLY SEALED APPRASIAL INDICES ACROSS 3 METROS</span>
          </div>
        </div>
      </div>
    </section>
  );
}
