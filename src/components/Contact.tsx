/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageSquare, Send, ShieldCheck, Heart } from 'lucide-react';
import { addDbBespokeInquiry } from '../supabase';

export default function Contact() {
  const [inquiryForm, setInquiryForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    preferredMetal: '18K Yellow Gold',
    preferredGemstone: 'GIA Certified Solitaire Diamond',
    budgetRange: '₹2,00,000 - ₹5,00,000',
    timeline: 'Soon (Within 1 month)',
    consultationType: 'Virtual Video Showcase',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryForm.fullName.trim() || !inquiryForm.email.trim() || !inquiryForm.message.trim()) {
      alert("Please populate name, email, and description lines to file your inquiry.");
      return;
    }
    
    setIsSubmitting(true);
    const success = await addDbBespokeInquiry({
      fullName: inquiryForm.fullName,
      email: inquiryForm.email,
      phone: inquiryForm.phone,
      preferredMetal: inquiryForm.preferredMetal,
      preferredGemstone: inquiryForm.preferredGemstone,
      budgetRange: inquiryForm.budgetRange,
      timeline: inquiryForm.timeline,
      consultationType: inquiryForm.consultationType,
      message: inquiryForm.message
    });
    setIsSubmitting(false);

    if (success) {
      setSubmitted(true);
    } else {
      alert("We encountered an error saving your inquiry to our database. Please double-check your connection and try again.");
    }
  };

  const boutiqueLocations = [
    {
      city: 'MUMBAI',
      category: 'Taj Mahal Palace Flagship',
      phone: '+91 22 6631 1234',
      address: 'Taj Mahal Palace, Colaba, Mumbai 400001, India',
      hours: 'Mon — Sun: 11:00 - 20:00 (Appointment suggested)'
    },
    {
      city: 'DELHI',
      category: 'DLF Emporio Salon',
      phone: '+91 11 4611 2345',
      address: 'DLF Emporio Mall, Vasant Kunj, New Delhi 110070, India',
      hours: 'Mon — Sun: 11:00 - 19:30'
    },
    {
      city: 'SURAT',
      category: 'Diamond Cutters Atelier',
      phone: '+91 261 4891 234',
      address: 'VR Surat Mall, Dumas Road, Surat 395007, India',
      hours: 'Mon — Sat: 10:30 - 19:00'
    },
    {
      city: 'JAIPUR',
      category: 'Johari Bazaar Heritage Vault',
      phone: '+91 141 2568 901',
      address: 'Johari Bazaar, Pink City, Jaipur 302003, Rajasthan, India',
      hours: 'Mon — Sat: 10:00 - 18:30 (Scheduled VIPs only)'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-16 select-none text-[#0a0a0a]">
      
      {/* Intro details */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#1a6b5c] font-medium">
          CONCIERGE DESK
        </span>
        <h2 className="font-serif text-3xl font-light text-[#0a0a0a] tracking-wide">
          Reach Our Concierge Desk
        </h2>
        <p className="text-xs text-[#666] font-light max-w-lg mx-auto leading-relaxed">
          Our prestigious boutiques coordinate personal sizing consultations, secure armoured collection dispatch, and direct wire configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Hand: Office listings */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-6">
            <h3 className="font-serif text-lg font-light text-[#0a0a0a] uppercase tracking-wider border-b border-[#1a6b5c]/15 pb-3">Our Boutiques</h3>
            
            <div className="space-y-6">
              {boutiqueLocations.map((loc) => (
                <div key={loc.city} className="space-y-2 border-b border-[#1a6b5c]/10 pb-4 last:border-none">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif text-sm font-semibold text-[#1a6b5c] tracking-wider">{loc.city}</h4>
                    <span className="text-[9px] uppercase font-mono text-[#666] font-light">{loc.category}</span>
                  </div>
                  
                  <div className="space-y-1 pl-1 text-[11px] text-[#666] font-sans font-light">
                    <p className="flex items-center space-x-2">
                      <MapPin size={11} className="text-[#1a6b5c]" />
                      <span>{loc.address}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <Phone size={11} className="text-[#1a6b5c]" />
                      <span>{loc.phone}</span>
                    </p>
                    <p className="flex items-center space-x-2">
                      <Clock size={11} className="text-[#1a6b5c]" />
                      <span>{loc.hours}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-[#f5f0eb] border border-[#1a6b5c]/20 rounded-xs space-y-2.5">
            <h4 className="font-serif text-xs font-semibold uppercase text-[#0a0a0a] tracking-wide flex items-center space-x-2">
              <ShieldCheck size={14} className="text-[#1a6b5c]" />
              <span>Royal Safety & Custody Guard</span>
            </h4>
            <p className="text-[10px] text-[#666] leading-normal font-light">
              LuxeLoom Fine Jewels does not stock high-carat materials on the exhibition tables overnight. Our finest necklaces and rubies are continuously housed in multi-tiered electronic bank vaults and require a 24-hour preview request coordinate.
            </p>
          </div>
        </div>

        {/* Right Hand: Interactive message board */}
        <div className="lg:col-span-7 bg-white border border-[#1a6b5c]/20 rounded-sm p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-12 space-y-4 animate-fade-in">
              <span className="w-12 h-12 rounded-full bg-[#1a6b5c]/10 border border-[#1a6b5c] flex items-center justify-center text-[#1a6b5c] mx-auto">
                <Heart size={20} />
              </span>
              <h4 className="font-serif text-base font-bold text-[#1a6b5c] uppercase tracking-wider">
                Concierge Record Opened
              </h4>
              <p className="text-xs text-[#666] max-w-sm mx-auto font-light leading-relaxed">
                Greetings <strong>{inquiryForm.fullName}</strong>. A dedicated senior jewelry advisor has been assigned to coordinate your request (Preferred: {inquiryForm.preferredMetal} with {inquiryForm.preferredGemstone}). We shall touch base over <strong>{inquiryForm.email}</strong> or phone inside 2 hours.
              </p>
              <button
                id="reset-contact-form"
                onClick={() => {
                  setSubmitted(false);
                  setInquiryForm({
                    fullName: '',
                    email: '',
                    phone: '',
                    preferredMetal: '18K Yellow Gold',
                    preferredGemstone: 'GIA Certified Solitaire Diamond',
                    budgetRange: '₹2,00,000 - ₹5,00,000',
                    timeline: 'Soon (Within 1 month)',
                    consultationType: 'Virtual Video Showcase',
                    message: ''
                  });
                }}
                className="text-xs font-mono uppercase tracking-widest text-[#1a6b5c] hover:underline cursor-pointer pointer-events-auto font-medium"
              >
                Send Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitInquiry} className="space-y-5">
              <div>
                <h3 className="font-serif text-base font-semibold text-[#0a0a0a] uppercase tracking-wider mb-1 font-medium">Bespoke Inquiry Wire</h3>
                <p className="text-[11px] text-[#666] font-light">
                  Your details are transmitted directly to our Mumbai flagship office coordinates.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1 font-medium">Your Full Name</label>
                  <input
                    id="contact-fullname"
                    type="text"
                    required
                    value={inquiryForm.fullName}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, fullName: e.target.value })}
                    className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 text-xs py-2 px-3 text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1 font-medium">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 text-xs py-2 px-3 text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] rounded-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1 font-medium">Mobile Number (+91)</label>
                  <input
                    id="contact-phone"
                    type="tel"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 text-xs py-2 px-3 text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] rounded-sm"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1 font-medium">Preferred Metal</label>
                  <select
                    id="contact-preferred-metal"
                    value={inquiryForm.preferredMetal}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, preferredMetal: e.target.value })}
                    className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 text-xs py-2.5 px-3 text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] pointer-events-auto cursor-pointer rounded-sm"
                  >
                    <option value="18K Yellow Gold">18K Yellow Gold (Authentic BIS Hallmarked)</option>
                    <option value="22K Yellow Gold">22K Yellow Gold (Authentic BIS Hallmarked)</option>
                    <option value="18K White Gold">18K White Gold (Premium Palladium Mix)</option>
                    <option value="18K Rose Gold">18K Rose Gold (Copper Warm Alloy)</option>
                    <option value="Platinum 950">Platinum 950 (Ultra-Pure Platinum Group)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1 font-medium">Preferred Gemstone</label>
                  <select
                    id="contact-preferred-gemstone"
                    value={inquiryForm.preferredGemstone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, preferredGemstone: e.target.value })}
                    className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 text-xs py-2.5 px-3 text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] pointer-events-auto cursor-pointer rounded-sm"
                  >
                    <option value="GIA Certified Solitaire Diamond">GIA Certified Solitaire Diamond (DF/VVS+)</option>
                    <option value="Kashmiri Royal Sapphire">Kashmiri Royal Sapphire (Unheated Deep Blue)</option>
                    <option value="Colombian Muzo Emerald">Colombian Muzo Emerald (Vibrant Rich Green)</option>
                    <option value="Burmese Pigeon Blood Ruby">Burmese Pigeon Blood Ruby (Vivid Red Lustre)</option>
                    <option value="Natural Basra Pearls">Basra Pearls (Highly Collectible Natural Orient)</option>
                    <option value="No Gemstones - High Gold Only">No Gemstones - Pure Sculptural Solid Gold Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1 font-medium">Estimated Budget</label>
                  <select
                    id="contact-budget-range"
                    value={inquiryForm.budgetRange}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, budgetRange: e.target.value })}
                    className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 text-xs py-2.5 px-3 text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] pointer-events-auto cursor-pointer rounded-sm"
                  >
                    <option value="Under ₹2,00,000">Under ₹2,00,000 INR</option>
                    <option value="₹2,00,000 - ₹5,00,000">₹2,00,000 - ₹5,00,000 INR</option>
                    <option value="₹5,00,000 - ₹15,00,000">₹5,00,000 - ₹15,00,000 INR</option>
                    <option value="₹15,00,000 - ₹50,0,000">₹15,00,000 - ₹50,00,000 INR</option>
                    <option value="Above ₹50,00,000">Above ₹50,00,000 INR (Royal Heritage Portfolio)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1 font-medium">Intended Timeline</label>
                  <select
                    id="contact-timeline"
                    value={inquiryForm.timeline}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, timeline: e.target.value })}
                    className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 text-xs py-2.5 px-3 text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] pointer-events-auto cursor-pointer rounded-sm"
                  >
                    <option value="Soon (Within 1 month)">Immediate Crafting (Within 1 month)</option>
                    <option value="Wedding / Bridal (1-3 months)">Wedding / Bridal Season (1-3 months)</option>
                    <option value="Anniversary / Festival (3-6 months)">Anniversary / Festival Season (3-6 months)</option>
                    <option value="Design Collection Investment">Bespoke Design Collection Investment / No rush</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1 font-medium">Preferred Consultation Type</label>
                  <select
                    id="contact-consultation-type"
                    value={inquiryForm.consultationType}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, consultationType: e.target.value })}
                    className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 text-xs py-2.5 px-3 text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] pointer-events-auto cursor-pointer rounded-sm"
                  >
                    <option value="Virtual Video Showcase">Encrypted Virtual Video Showcase (1-on-1)</option>
                    <option value="In-Store Private Suite (Taj Palace Mumbai)">In-Store Private Suite (Taj Palace Hotel, Mumbai)</option>
                    <option value="In-Store Private Suite (DLF Emporio Delhi)">In-Store Private Suite (DLF Emporio, New Delhi)</option>
                    <option value="WhatsApp Personal Shopper Hotline">WhatsApp Direct Personal Shopper Chat (Private Concierge)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1 font-medium">Bespoke Inquiry Details & Context</label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  placeholder="Tell us about the heirloom piece or custom setting you desire..."
                  className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 text-xs py-2 px-3 text-[#0a0a0a] placeholder-gray-400 focus:outline-none focus:border-[#1a6b5c] rounded-sm"
                />
              </div>

              <button
                id="contact-submit"
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1a6b5c] hover:bg-[#1a6b5c]/85 disabled:bg-[#1a6b5c]/50 text-white font-medium text-xs uppercase tracking-[0.2em] py-3 rounded-sm transition-colors duration-300 flex items-center justify-center space-x-2 pointer-events-auto cursor-pointer shadow-sm"
              >
                <Send size={11} />
                <span>{isSubmitting ? 'Transmitting Inbound Secure Wire...' : 'Transmit Secured Inquiry'}</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* WhatsApp Quick Assist Chat line */}
      <div className="border-t border-[#1a6b5c]/15 pt-12 flex flex-col items-center space-y-4 select-none">
        <div className="flex items-center space-x-2.5">
          <MessageSquare size={16} className="text-[#1a6b5c] animate-bounce" />
          <p className="font-serif text-sm font-light text-[#0a0a0a]">Prefer Instant Conversation?</p>
        </div>
        <p className="text-[11px] text-[#666] max-w-sm text-center leading-normal font-light">
          Text instantly with our luxury Colaba showroom concierge on WhatsApp. Available 24/7.
        </p>
        <a
          id="whatsapp-chat-button"
          href="https://wa.me/912222820912"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-[#1a6b5c] hover:bg-[#1a6b5c]/10 text-[#1a6b5c] hover:text-[#0a0a0a] text-[10px] font-mono tracking-[0.2em] uppercase py-3 px-6 rounded-sm flex items-center space-x-2 transition-all duration-300 pointer-events-auto cursor-pointer"
        >
          <span>INITIATE ATELIER WHATSAPP HOTLINE</span>
          <span>&rarr;</span>
        </a>
      </div>

    </div>
  );
}
