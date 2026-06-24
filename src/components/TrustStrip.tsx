/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Award, Truck, RotateCcw, ShieldCheck, CreditCard, Sparkles } from 'lucide-react';

export default function TrustStrip() {
  const points = [
    {
      icon: <Award size={16} className="text-[#1a6b5c]" />,
      title: 'BIS Hallmark Certified',
      desc: '916 Gold & 925 Silver Purity Secured'
    },
    {
      icon: <Truck size={16} className="text-[#1a6b5c]" />,
      title: 'Free Insured Shipping',
      desc: 'Armored Nationwide Doorsteps Transit'
    },
    {
      icon: <RotateCcw size={16} className="text-[#1a6b5c]" />,
      title: '15-Day Easy Returns',
      desc: '100% Value Back Handover Promises'
    },
    {
      icon: <ShieldCheck size={16} className="text-[#1a6b5c]" />,
      title: 'COD Available',
      desc: 'Pay at Delivery Under ₹75,000 threshold'
    },
    {
      icon: <CreditCard size={16} className="text-[#1a6b5c]" />,
      title: 'EMI Starting ₹2,999/month',
      desc: 'No-Cost Jewelry Finance Options'
    },
    {
      icon: <Sparkles size={16} className="text-[#1a6b5c]" />,
      title: '100% Conflict-Free Gems',
      desc: 'Ethically Sourced Solitaires & Emeralds'
    }
  ];

  return (
    <div className="w-full bg-[#f5f0eb]/90 border-b border-[#1a6b5c]/25 py-6 select-none shadow-sm relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-6 md:gap-8 justify-items-center text-center">
          {points.map((pt, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center space-y-2 group flex-1 min-w-0"
            >
              <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center border border-[#1a6b5c]/15 text-[#1a6b5c] transition-all duration-300 group-hover:scale-115 group-hover:bg-[#1a6b5c]/5 group-hover:border-[#1a6b5c]/45 shadow-sm">
                {pt.icon}
              </span>
              <div className="space-y-0.5">
                <h6 className="text-[11px] font-mono tracking-wider font-bold text-zinc-900 leading-tight uppercase font-sans">
                  {pt.title}
                </h6>
                <p className="text-[9px] text-zinc-500 font-light truncate max-w-[150px] font-sans">
                  {pt.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
