/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Sparkles, HelpCircle, Shield, Award, Send, Check, Truck, RotateCcw, CreditCard } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-[#f5f0eb] border-t border-[#1a6b5c]/20 pt-16 pb-8 text-[#666] font-sans select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Brand Information Column */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-left">
            <span className="font-serif text-lg font-light tracking-[0.25em] text-[#0a0a0a] block">
              LUXELOOM
            </span>
            <span className="text-[8px] uppercase tracking-[0.55em] text-[#1a6b5c] block -mt-1.5 ml-0.5 font-medium">
              FINE JEWELS
            </span>
          </div>
          <p className="text-xs text-[#666] leading-relaxed font-light font-sans tracking-wide">
            A premier Indian heritage boutique jeweler. Individually designed, casted, hand-polished, and certified conflict-free in partnership with world-class gem certification bodies and the Responsible Jewellery Council.
          </p>

          <div className="flex flex-col gap-2 pt-2">
            <div className="flex items-center space-x-1.5 text-[10px] text-[#0a0a0a]/80 font-mono">
              <Award size={12} className="text-[#1a6b5c]" />
              <span>BIS Hallmark Certified (916 Gold, 925 Silver)</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[10px] text-[#0a0a0a]/80 font-mono">
              <Sparkles size={11} className="text-[#1a6b5c]" />
              <span>IGI Certified Diamonds & Solitaires</span>
            </div>
            <div className="flex items-center space-x-1.5 text-[10px] text-[#0a0a0a]/80 font-mono">
              <Shield size={12} className="text-[#1a6b5c]" />
              <span>RJC Member | 100% Conflict-Free Spec</span>
            </div>
            <div className="flex items-center space-x-1.5 mt-1 border-t border-[#1a6b5c]/10 pt-2">
              <span className="inline-flex items-center bg-[#1a6b5c]/10 text-[#1a6b5c] text-[9px] font-mono tracking-widest uppercase py-0.5 px-2 rounded-xs border border-[#1a6b5c]/15">
                🇮🇳 Make In India
              </span>
            </div>
          </div>
        </div>

        {/* Directory Navigation Columns */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#0a0a0a] font-semibold">
              The E-Boutique
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <button onClick={() => setActiveTab('rings')} className="hover:text-[#0a0a0a] hover:underline transition-colors pointer-events-auto cursor-pointer">
                  Solitaire Rings
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('necklaces')} className="hover:text-[#0a0a0a] hover:underline transition-colors pointer-events-auto cursor-pointer">
                  Premium Necklaces
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('earrings')} className="hover:text-[#0a0a0a] hover:underline transition-colors pointer-events-auto cursor-pointer">
                  Heritage Jhumkas & Studs
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('bracelets')} className="hover:text-[#0a0a0a] hover:underline transition-colors pointer-events-auto cursor-pointer">
                  Royal Rubies & cuffs
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#0a0a0a] font-semibold">
              Heritage Atelier
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <button onClick={() => setActiveTab('craftsmanship')} className="hover:text-[#0a0a0a] hover:underline transition-colors pointer-events-auto cursor-pointer">
                  Ancient Crafting Specs
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-[#0a0a0a] hover:underline transition-colors pointer-events-auto cursor-pointer">
                  Bespoke Consultations
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('contact')} className="hover:text-[#0a0a0a] hover:underline transition-colors pointer-events-auto cursor-pointer">
                  Bespoke Locator Map
                </button>
              </li>
              <li>
                <button onClick={() => alert("Our signature warranties cover: Complimentary Indian resizing, half-yearly audit inspections, structural lock overhauls, and official BIS valuation cards.")} className="hover:text-[#0a0a0a] hover:underline transition-colors pointer-events-auto cursor-pointer">
                  Lifetime Guarantees
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Registrations Column */}
        <div className="lg:col-span-4 space-y-4">
          <h4 className="text-[10px] uppercase font-mono tracking-widest text-[#0a0a0a] font-semibold">
            Boutique Bulletins
          </h4>
          <p className="text-xs text-[#666] leading-relaxed font-light">
            Get exclusive access to new arrivals, Dhanteras & Akshaya Tritiya pre-launches, and private atelier events.
          </p>

          {subscribed ? (
            <div className="flex items-center space-x-2 text-[#1a6b5c] text-xs font-mono bg-[#1a6b5c]/5 border border-[#1a6b5c]/20 px-3 py-2 rounded-xs select-none">
              <Check size={12} />
              <span>Registered to Royal Atelier Telegram & Bulletins</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                id="newsletter-email"
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="ateliers@luxeloom.in"
                className="flex-grow bg-white border border-[#1a6b5c]/20 text-xs py-2.5 px-3 focus:outline-none focus:border-[#1a6b5c] text-[#0a0a0a] rounded-sm placeholder-gray-400"
              />
              <button
                id="newsletter-submit-button"
                type="submit"
                className="bg-[#1a6b5c] hover:bg-[#1a6b5c]/95 text-white font-mono uppercase font-bold text-xs py-2.5 px-5 rounded-sm transition-colors pointer-events-auto cursor-pointer flex items-center justify-center shadow-md shadow-[#1a6b5c]/10 whitespace-nowrap"
              >
                SUBSCRIBE
              </button>
            </form>
          )}
        </div>

      </div>

      {/* Localized Trust Banner: Premium Shipping Features & Supported Indian Payment Methods */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-[#1a6b5c]/15">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="flex items-start space-x-3 justify-center sm:justify-start">
            <Truck size={16} className="text-[#1a6b5c] mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="text-[11px] font-mono tracking-wider text-[#0a0a0a] uppercase font-bold">Complimentary Shipping</h5>
              <p className="text-[11px] text-[#666] font-light mt-0.5">Free shipping above ₹10,000 across India.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 justify-center sm:justify-start">
            <Sparkles size={16} className="text-[#1a6b5c] mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="text-[11px] font-mono tracking-wider text-[#0a0a0a] uppercase font-bold">Nationwide Timelines</h5>
              <p className="text-[11px] text-[#666] font-light mt-0.5">2-5 days secured transit delivery across India.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 justify-center sm:justify-start">
            <Shield size={16} className="text-[#1a6b5c] mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="text-[11px] font-mono tracking-wider text-[#0a0a0a] uppercase font-bold">Metro Express Delivery</h5>
              <p className="text-[11px] text-[#666] font-light mt-0.5">Same-day armored delivery in Mumbai & Delhi.</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 justify-center sm:justify-start">
            <RotateCcw size={16} className="text-[#1a6b5c] mt-0.5 flex-shrink-0" />
            <div>
              <h5 className="text-[11px] font-mono tracking-wider text-[#0a0a0a] uppercase font-bold">Complimentary Resizing</h5>
              <p className="text-[11px] text-[#666] font-light mt-0.5">Free ring resizing within 30 days of placement.</p>
            </div>
          </div>
        </div>

        {/* Supported Payment Options Badges */}
        <div className="mt-8 pt-6 border-t border-[#1a6b5c]/10 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="text-center lg:text-left">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#0a0a0a] font-bold block">Accepted Premium Indian Payment Gateways</span>
            <span className="text-[9px] text-[#666] font-light mt-0.5 block">Insured via 256-bit secure gateway & instant BHIM API networks</span>
          </div>
          <div className="flex flex-wrap justify-center gap-1.5 max-w-xl">
            <span className="bg-[#1a6b5c]/5 text-[#1a6b5c] border border-[#1a6b5c]/15 text-[9px] font-mono py-1 px-2.5 rounded-xs">UPI (GPay, PhonePe, Paytm, BHIM)</span>
            <span className="bg-[#1a6b5c]/5 text-[#1a6b5c] border border-[#1a6b5c]/15 text-[9px] font-mono py-1 px-2.5 rounded-xs">Net Banking</span>
            <span className="bg-[#1a6b5c]/5 text-[#1a6b5c] border border-[#1a6b5c]/15 text-[9px] font-mono py-1 px-2.5 rounded-xs">Credit & Debit Card (including RuPay)</span>
            <span className="bg-[#1a6b5c]/5 text-[#1a6b5c] border border-[#1a6b5c]/15 text-[9px] font-mono py-1 px-2.5 rounded-xs">No-Cost EMI</span>
            <span className="bg-[#1a6b5c]/5 text-[#1a6b5c] border border-[#1a6b5c]/15 text-[9px] font-mono py-1 px-2.5 rounded-xs">Cash On Delivery</span>
            <span className="bg-[#1a6b5c]/5 text-[#1a6b5c] border border-[#1a6b5c]/15 text-[9px] font-mono py-1 px-2.5 rounded-xs">Bajaj Finserv & ZestMoney</span>
          </div>
        </div>
      </div>

      {/* Premium Payment Icons & Security Badges Row (FIX 4) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-[#1a6b5c]/15">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white/40 border border-[#1a6b5c]/10 p-4 rounded-sm">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
            {/* Visual payment identifiers */}
            <span className="bg-[#1a6b5c]/10 text-[#1a6b5c] px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-xs border border-[#1a6b5c]/10 select-none">UPI</span>
            <span className="bg-[#1a6b5c]/10 text-[#1a6b5c] px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-xs border border-[#1a6b5c]/10 select-none">Google Pay</span>
            <span className="bg-[#1a6b5c]/10 text-[#1a6b5c] px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-xs border border-[#1a6b5c]/10 select-none">PhonePe</span>
            <span className="bg-[#1a6b5c]/10 text-[#1a6b5c] px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-xs border border-[#1a6b5c]/10 select-none">Paytm</span>
            <span className="bg-[#1a6b5c]/10 text-[#1a6b5c] px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-xs border border-[#1a6b5c]/10 select-none">BHIM</span>
            <span className="bg-[#1a6b5c]/10 text-[#1a6b5c] px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-xs border border-[#1a6b5c]/10 select-none">Visa</span>
            <span className="bg-[#1a6b5c]/10 text-[#1a6b5c] px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-xs border border-[#1a6b5c]/10 select-none">Mastercard</span>
            <span className="bg-[#1a6b5c]/10 text-[#1a6b5c] px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-xs border border-[#1a6b5c]/10 select-none">RuPay</span>
            <span className="bg-[#1a6b5c]/10 text-[#1a6b5c] px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-xs border border-[#1a6b5c]/10 select-none">NetBanking</span>
            <span className="bg-[#1a6b5c]/10 text-[#1a6b5c] px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-wider rounded-xs border border-[#1a6b5c]/10 select-none">COD Option</span>
            <span className="bg-emerald-600 text-white px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-widest rounded-xs flex items-center space-x-1 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span>SSL SECURE</span>
            </span>
          </div>
          <div className="text-right flex items-center space-x-2">
            <span className="text-emerald-700 text-xs">🛡️</span>
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[#1a6b5c]">100% Safe Checkout</span>
          </div>
        </div>
      </div>

      {/* Footer Bottom accent credits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 pt-6 border-t border-[#1a6b5c]/15 flex flex-col md:flex-row items-center justify-between text-[10px] text-[#666] font-mono space-y-4 md:space-y-0">
        <p>© {new Date().getFullYear()} LUXELOOM FINE JEWELS. ALL RIGHTS RESERVED IN INDIA.</p>
        <div className="flex space-x-6 tracking-wider">
          <span className="hover:text-[#0a0a0a] cursor-pointer transition-colors" onClick={() => alert("LuxeLoom is committed to carbon-free outputs. Every diamond holds official IGI and BIS Hallmark certifications with conflict-free sourcing guarantees.")}>Ethical Sourcing Code</span>
          <span className="hover:text-[#0a0a0a] cursor-pointer transition-colors" onClick={() => alert("All sensitive details are encrypted with TLS standards.")}>Secured Data Protection</span>
        </div>
      </div>
    </footer>
  );
}
