"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Double check that all fields are filled before submitting
    if (formData.name.trim() && formData.email.trim() && formData.phone.trim() && formData.message.trim()) {
      // Fire and forget the API request to send the email
      fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }).catch(err => console.error("Error submitting contact form:", err));

      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "" });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Main Container with 80px top and bottom padding */}
      <main className="flex-grow bg-white py-20 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        
        {/* Section 1: Page Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <h1 className="font-cormorant font-normal text-[48px] text-[#2E3135] tracking-wide leading-tight mb-3">
            Contact Us
          </h1>
          <p className="font-inter font-light text-[16px] text-[#888888]">
            We&apos;d love to hear from you
          </p>
          {/* Thin gold divider line */}
          <div className="w-16 h-[1px] bg-[#CDB38B] mt-5"></div>
        </div>

        {/* Page layout: two columns on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-12 lg:gap-16 items-start">
          
          {/* Section 2: Google Maps (left column, 55%) */}
          <div className="w-full h-full min-h-[450px]">
            <iframe
              src="https://www.google.com/maps?q=Mini+Bazar+Surat+Gujarat&output=embed"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: "8px" }}
              allowFullScreen=""
              loading="lazy"
              title="Store Location Map"
              className="w-full h-[450px] shadow-sm rounded-lg"
            ></iframe>
          </div>

          {/* Right column: Store details + enquiry form (45%) */}
          <div className="flex flex-col space-y-10">
            
            {/* Section 3: Store Details */}
            <div className="space-y-3">
              <div className="flex items-start gap-3.5 text-[14px] font-inter text-[#2E3135] leading-relaxed">
                <MapPin className="w-5 h-5 text-[#CDB38B] shrink-0 mt-0.5" />
                <span>Princess Plaza, Mini Bazar, 9th Floor, Office 905, Surat, Gujarat 395003</span>
              </div>
              
              <div className="flex items-center gap-3.5 text-[14px] font-inter text-[#2E3135]">
                <Phone className="w-5 h-5 text-[#CDB38B] shrink-0" />
                <a href="tel:+919023454014" className="hover:text-[#CDB38B] transition-colors">
                  +91 90234 54014
                </a>
              </div>
              
              <div className="flex items-center gap-3.5 text-[14px] font-inter text-[#2E3135]">
                <Mail className="w-5 h-5 text-[#CDB38B] shrink-0" />
                <a href="mailto:verifytatvaan@gmail.com" className="hover:text-[#CDB38B] transition-colors">
                  verifytatvaan@gmail.com
                </a>
              </div>
              
              <div className="flex items-center gap-3.5 text-[14px] font-inter text-[#2E3135]">
                <Clock className="w-5 h-5 text-[#CDB38B] shrink-0" />
                <span>Monday – Saturday, 10:00 AM – 7:00 PM</span>
              </div>
            </div>

            {/* Section 4: WhatsApp Button */}
            <div>
              <a
                href="https://wa.me/919023454014?text=Hello%20TATVAAN%2C%20I%20have%20an%20enquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-[#25D366] text-white py-[14px] text-[13px] font-inter font-medium tracking-[1.5px] uppercase hover:bg-[#20ba56] transition-colors rounded-none"
              >
                CHAT ON WHATSAPP
              </a>
            </div>

            {/* Section 5: Enquiry Form */}
            <div className="border-t border-[#F3F1EC] pt-8">
              {submitted ? (
                <div className="bg-white p-8 text-center rounded border border-[#CDB38B]/30 shadow-sm animate-in fade-in duration-300">
                  <p className="font-inter font-medium text-[16px] text-[#CDB38B] leading-relaxed">
                    Thank you! We will get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 font-inter text-[12px] text-[#2E3135] hover:text-[#CDB38B] underline uppercase tracking-wider transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label 
                      htmlFor="name" 
                      className="block font-inter font-medium text-[13px] text-[#2E3135] uppercase tracking-[1.5px] mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#2E3135] px-3 py-3 text-[15px] font-inter text-[#2E3135] focus:outline-none focus:border-[#CDB38B] transition-colors rounded-none"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="email" 
                      className="block font-inter font-medium text-[13px] text-[#2E3135] uppercase tracking-[1.5px] mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#2E3135] px-3 py-3 text-[15px] font-inter text-[#2E3135] focus:outline-none focus:border-[#CDB38B] transition-colors rounded-none"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="phone" 
                      className="block font-inter font-medium text-[13px] text-[#2E3135] uppercase tracking-[1.5px] mb-2"
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#2E3135] px-3 py-3 text-[15px] font-inter text-[#2E3135] focus:outline-none focus:border-[#CDB38B] transition-colors rounded-none"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label 
                      htmlFor="message" 
                      className="block font-inter font-medium text-[13px] text-[#2E3135] uppercase tracking-[1.5px] mb-2"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#2E3135] px-3 py-3 text-[15px] font-inter text-[#2E3135] focus:outline-none focus:border-[#CDB38B] transition-colors rounded-none resize-none"
                      placeholder="Write your message here"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#2E3135] text-white py-[14px] text-[13px] font-inter font-medium tracking-[1.5px] uppercase hover:bg-[#CDB38B] transition-colors rounded-none cursor-pointer"
                  >
                    SEND MESSAGE
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
