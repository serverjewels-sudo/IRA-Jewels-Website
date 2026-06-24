/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Clock, Sparkles, Send, CheckCircle2, MapPin, Award, Shield, Landmark } from 'lucide-react';
import { STORIES } from '../data';

export default function Craftsmanship() {
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    topic: 'Engagement Design',
    preferredDate: '',
    preferredTime: '14:00',
    notes: ''
  });

  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name.trim() || !bookingForm.email.trim() || !bookingForm.preferredDate) {
      alert("Please provide name, email, and preferred date to schedule your consultation.");
      return;
    }
    setBookingSuccess(true);
  };

  const topicOptions = [
    { value: 'Engagement Design', label: 'Custom Royal Wedding Set & Heritage Kundan' },
    { value: 'Diamond Appraisal', label: 'BIS Hallmarking & GIA Diamond Sourcing' },
    { value: 'Atelier Resetting', label: 'Heirloom Resetting & Antique Polishing' },
    { value: 'Gemstone sourcing', label: 'Rare Kashmiri Ruby & Colombian Emerald Sourcing' }
  ];

  // Specific Studio Locations
  const studioLocations = [
    {
      name: "Mumbai Taj Mahal Palace Flagship",
      location: "Colaba, Mumbai",
      desc: "Our primary flame-casting studio. Overlooking the Arabian Sea, this heritage space features our active gold smelting hearth and live hand-filigree tables.",
      lead: "Keshubhai Soni",
      hours: "Mon — Sun: 11:00 AM - 8:00 PM"
    },
    {
      name: "Vasant Kunj Solitaire Private Suite",
      location: "DLF Emporio, New Delhi",
      desc: "Designed for premium privacy. Houses our advanced digital ring-fitting projection tables and provides secure viewings of certified solitaires over 5 carats.",
      lead: "Dr. Ananya Rawat",
      hours: "Mon — Sun: 11:00 AM - 7:30 PM"
    },
    {
      name: "Jaipur Heritage Vault & Lapidary",
      location: "Johari Bazaar, Jaipur",
      desc: "The heartbeat of our natural gemstone lapidary. Specialized in the cutting, sorting, and polishing of raw Zimbabwean emeralds and pigeon-blood rubies.",
      lead: "Rajeev Johari",
      hours: "Mon — Sat: 10:00 AM - 6:30 PM"
    }
  ];

  // Professional Consultant Details
  const consultants = [
    {
      name: "Keshubhai Soni",
      role: "Chief Master Goldsmith",
      specialty: "Heritage Hand-Smelted filigree & Royal Bridal Chokers",
      exp: "38 Years",
      origin: "Jaipur Guild Guildmaster"
    },
    {
      name: "Dr. Ananya Rawat",
      role: "Lead Gemologist & Solitaire Expert",
      specialty: "GIA Certified D-Flawless Diamond Grading & Sourcing",
      exp: "15 Years",
      origin: "Alumna, GIA Antwerp"
    },
    {
      name: "Rajeev Johari",
      role: "Antique Appraisal & Mineral Director",
      specialty: "Unheated Kashmiri Blue Sapphires & Polki Jadau Restorations",
      exp: "22 Years",
      origin: "Jaipur Mineralogical Society Advisor"
    }
  ];

  // Signature Consultation Offerings
  const offerings = [
    {
      title: "Bridal Trousseau Curation",
      desc: "A dedicated session to curate a harmonious suite of chokers, layered necklaces, kadas, and maang tikkas, matching your wedding attire's precise fabric tone and threadwork."
    },
    {
      title: "Legacy Gold Revival / Resetting",
      desc: "Breathe new life into your family heirlooms. We carefully detach antique stones and reconstruct them into highly wearable, structurally sound contemporary 18K lockets."
    },
    {
      title: "GIA Global Sourcing Commission",
      desc: "Direct access to international gem diamond exchanges. Commission our team to source rare cuts or custom fancy-colored blue/pink diamonds with secure certification."
    }
  ];

  // Specialized Atelier Services
  const services = [
    {
      title: "Complimentary Ultrasonic Polishing",
      desc: "Keep your diamonds performing at peak brilliance. Drop your LuxeLoom creations off at any studio for a complimentary multi-tier sonic cavitation cleaning."
    },
    {
      title: "Official BIS Hallmarking Registry",
      desc: "Every gram of gold we alloy is stamped with its laser-etched BIS registration ID, detailing the pure metal percentage configuration."
    },
    {
      title: "Secure Insured Armour Courier Service",
      desc: "For precious parcels, we coordinate direct home dispatch in certified armored, dual-custodied steel vaults, heavily insured at no additional cost."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 space-y-16 select-none text-[#0a0a0a]">
      
      {/* Atelier Description Introductory Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-[10px] uppercase font-mono tracking-[0.3em] text-[#1a6b5c] font-medium">
          THE LUXELOOM HERITAGE
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#0a0a0a] tracking-wide">
          Hand-Twisted Alloys, Ethically Fired Hearts
        </h2>
        <div className="w-16 h-0.5 bg-[#1a6b5c] mx-auto mt-2" />
        <p className="text-[#666] text-xs sm:text-sm font-light leading-relaxed max-w-2xl mx-auto">
          Every ring shank and necklace bail carrying the LuxeLoom seal has been hand-smelted, adjusted, and certified inside our dedicated Indian royal ateliers. We operate on a strict carbon-neutral, conflict-free gem philosophy.
        </p>
      </div>

      {/* Editorial Stories with Side Split View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
        {STORIES.map((story, i) => (
          <div
            key={i}
            className="group block bg-[#f5f0eb] border border-[#1a6b5c]/20 rounded-sm overflow-hidden p-6 sm:p-8 space-y-5 flex flex-col md:flex-row gap-6 hover:border-[#1a6b5c] transition-all duration-300"
          >
            <div className="md:w-1/3 aspect-[4/5] overflow-hidden rounded-xs bg-white">
              <img
                src={story.image}
                alt={story.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="md:w-2/3 flex flex-col justify-center space-y-3">
              <h3 className="font-serif text-base sm:text-lg font-light text-[#0a0a0a] flex items-center space-x-2">
                <Sparkles size={14} className="text-[#1a6b5c]" />
                <span>{story.title}</span>
              </h3>
              <p className="text-[#666] text-xs font-light leading-relaxed">
                {story.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* STUDIO LOCATIONS BLOCK */}
      <div className="space-y-6">
        <div className="border-b border-[#1a6b5c]/15 pb-3">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c]">OUR ATELIER NETWORKS</span>
          <h3 className="font-serif text-2xl font-light mt-1">Specific Studio Locations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {studioLocations.map((loc, idx) => (
            <div key={idx} className="bg-white border border-[#1a6b5c]/20 p-5 rounded-sm space-y-3 shadow-sm">
              <div className="flex items-center space-x-2 text-[#1a6b5c]">
                <MapPin size={15} />
                <span className="font-mono text-[10px] tracking-widest uppercase">{loc.location}</span>
              </div>
              <h4 className="font-serif text-base font-bold text-zinc-900">{loc.name}</h4>
              <p className="text-xs text-zinc-500 font-light leading-relaxed">{loc.desc}</p>
              <div className="pt-3 border-t border-zinc-100 text-[10px] text-zinc-400 font-mono flex flex-col space-y-1">
                <span>Studio Lead: <strong className="text-zinc-700">{loc.lead}</strong></span>
                <span>Active Hours: {loc.hours}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONSULTANTS STAFF DETAILS BLOCK */}
      <div className="space-y-6">
        <div className="border-b border-[#1a6b5c]/15 pb-3">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c]">MEET THE MASTERS</span>
          <h3 className="font-serif text-2xl font-light mt-1">Our Professional Consultants</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {consultants.map((con, idx) => (
            <div key={idx} className="bg-[#f5f0eb]/40 border border-[#1a6b5c]/15 p-5 rounded-sm space-y-3 hover:border-[#1a6b5c] transition-colors duration-300">
              <div className="flex items-center space-x-2 text-[#1a6b5c]">
                <Award size={15} />
                <span className="font-sans text-[9px] uppercase tracking-widest font-bold font-mono">{con.role}</span>
              </div>
              <div>
                <h4 className="font-serif text-base font-bold text-zinc-900 leading-tight">{con.name}</h4>
                <p className="text-[10px] text-zinc-400 mt-1 font-mono">{con.origin}</p>
              </div>
              <p className="text-xs text-zinc-600 font-light leading-relaxed"><strong className="text-zinc-800">Specialty: </strong>{con.specialty}</p>
              <div className="pt-2 border-t border-dashed border-zinc-200 text-[10px] text-zinc-500 font-mono">
                Atelier Senior Tenure: {con.exp}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SPECIFIC CONSULTATION OFFERINGS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Offerings Column */}
        <div className="space-y-6">
          <div className="border-b border-[#1a6b5c]/15 pb-3">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c]">PRIVATE COMMISSION SERVICES</span>
            <h3 className="font-serif text-2xl font-light mt-1">Consultation Offerings</h3>
          </div>
          <div className="space-y-4">
            {offerings.map((off, idx) => (
              <div key={idx} className="space-y-1.5 p-3.5 bg-zinc-50 rounded-xs border border-zinc-100">
                <h4 className="font-serif text-base font-bold text-[#1a6b5c]">{off.title}</h4>
                <p className="text-xs text-zinc-600 leading-relaxed font-light">{off.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Specialized Services Column */}
        <div className="space-y-6">
          <div className="border-b border-[#1a6b5c]/15 pb-3">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c]">LIFETIME ACCOMPANIMENT</span>
            <h3 className="font-serif text-2xl font-light mt-1">Atelier Services</h3>
          </div>
          <div className="space-y-4">
            {services.map((ser, idx) => (
              <div key={idx} className="space-y-1.5 p-3.5 bg-zinc-50 rounded-xs border border-zinc-100">
                <div className="flex items-center space-x-1.5">
                  <Shield size={13} className="text-[#1a6b5c]" />
                  <h4 className="font-serif text-base font-bold text-zinc-900 leading-tight">{ser.title}</h4>
                </div>
                <p className="text-xs text-zinc-600 leading-relaxed font-light">{ser.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Booking Consultation Panel */}
      <div className="bg-[#f5f0eb] border border-[#1a6b5c]/15 rounded-sm grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 items-center">
        {/* consultation detail */}
        <div className="lg:col-span-5 space-y-5">
          <span className="text-[9px] uppercase font-mono tracking-widest text-[#1a6b5c] bg-[#1a6b5c]/10 rounded-full px-3 py-1 font-medium flex inline-flex items-center justify-center space-x-1">
            <Landmark size={11} />
            <span>VIP Royal Service Desk</span>
          </span>
          <h3 className="font-serif text-xl sm:text-2xl font-light text-[#0a0a0a] tracking-wide">
            Book a Personal Atelier Consultation
          </h3>
          <p className="text-xs text-[#666] font-light leading-relaxed">
            Reserve a complimentary high-definition consultation. Our senior royal gemologist will guide you through our diamond indices, display carat sizing benchmarks, or align custom filigree carvings live under magnification.
          </p>

          <div className="space-y-3 font-mono text-[11px] text-[#666] select-none">
            <div className="flex items-center space-x-3">
              <Calendar size={13} className="text-[#1a6b5c]" />
              <span>Available Monday to Sunday</span>
            </div>
            <div className="flex items-center space-x-3">
              <Clock size={13} className="text-[#1a6b5c]" />
              <span>Times: 11:30 AM — 8:00 PM IST</span>
            </div>
          </div>
        </div>

        {/* booking form */}
        <div className="lg:col-span-7 bg-white border border-[#1a6b5c]/20 p-5 sm:p-6 rounded-xs">
          {bookingSuccess ? (
            <div className="text-center py-10 space-y-4 animate-fade-in">
              <span className="w-12 h-12 rounded-full bg-[#1a6b5c]/10 border border-[#1a6b5c] flex items-center justify-center text-[#1a6b5c] mx-auto">
                <CheckCircle2 size={24} />
              </span>
              <h4 className="font-serif text-base font-bold text-[#1a6b5c] uppercase tracking-wider">
                Atelier Consultation Requested
              </h4>
              <p className="text-xs text-[#666] max-w-sm mx-auto font-light leading-relaxed">
                Thank you, <strong>{bookingForm.name}</strong>. A dedicated gemologist will reach out to schedule and finalize your secure viewing link at <strong>{bookingForm.email}</strong>.
              </p>
              <button
                id="book-another-session"
                onClick={() => { setBookingSuccess(false); setBookingForm({ name: '', email: '', topic: 'Engagement Design', preferredDate: '', preferredTime: '14:00', notes: '' }); }}
                className="text-xs font-mono uppercase tracking-widest text-[#1a6b5c] hover:underline pointer-events-auto cursor-pointer font-medium"
              >
                Schedule Another Session
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1 font-medium">Your Full Name</label>
                  <input
                    id="booking-name"
                    type="text"
                    required
                    value={bookingForm.name}
                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                    className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 text-xs py-2 px-3 text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1 font-medium">Email Address</label>
                  <input
                    id="booking-email"
                    type="email"
                    required
                    value={bookingForm.email}
                    onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                    className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 text-xs py-2 px-3 text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] rounded-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1 font-medium">Consultation Objective</label>
                <select
                  id="booking-topic"
                  value={bookingForm.topic}
                  onChange={(e) => setBookingForm({ ...bookingForm, topic: e.target.value })}
                  className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 text-xs py-2.5 px-3 text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] pointer-events-auto cursor-pointer rounded-sm"
                >
                  {topicOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1 font-medium">Preferred Date</label>
                  <input
                    id="booking-date"
                    type="date"
                    required
                    value={bookingForm.preferredDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                    className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 text-xs py-2 px-3 text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] pointer-events-auto cursor-pointer rounded-sm"
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1 font-medium">Preferred Timing</label>
                  <select
                    id="booking-time"
                    value={bookingForm.preferredTime}
                    onChange={(e) => setBookingForm({ ...bookingForm, preferredTime: e.target.value })}
                    className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 text-xs py-2.5 px-3 text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] pointer-events-auto cursor-pointer rounded-sm"
                  >
                    <option value="11:30">11:30 AM</option>
                    <option value="13:00">01:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                    <option value="19:00">07:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[9px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1 font-medium">Design Notes (optional)</label>
                <textarea
                  id="booking-notes"
                  rows={2}
                  value={bookingForm.notes}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                  placeholder="Tell us about metal preferences, ring size guidelines or stone cuts..."
                  className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 text-xs py-2 px-3 text-[#0a0a0a] placeholder-gray-400 focus:outline-none focus:border-[#1a6b5c] rounded-sm"
                />
              </div>

              <button
                id="booking-submit-button"
                type="submit"
                className="w-full bg-[#1a6b5c] hover:bg-[#1a6b5c]/85 text-white font-medium text-xs uppercase tracking-[0.2em] py-3 rounded-sm transition-colors duration-300 flex items-center justify-center space-x-2 pointer-events-auto cursor-pointer shadow-sm"
              >
                <Send size={12} />
                <span>Submit Security Consultation Request</span>
              </button>
            </form>
          )}
        </div>
      </div>

    </div>
  );
}
