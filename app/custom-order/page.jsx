"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Check, Image as ImageIcon, X, UploadCloud } from "lucide-react";
import Link from "next/link";

export default function CustomOrderPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    jewelleryType: "",
    preferredMetal: "Not decided yet",
    karat: "Not decided yet",
    preferredStone: "Lab-Grown Diamond",
    budget: "",
    occasion: "",
    vision: "",
    heardAboutUs: ""
  });

  const [submitted, setSubmitted] = useState(false);
  const [successName, setSuccessName] = useState("");
  const [successPhone, setSuccessPhone] = useState("");
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileChange = (e) => {
    setUploadError("");
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds 5MB limit.");
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setUploadError("Invalid file type. Only JPG, PNG, and WebP are allowed.");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    setUploadError("");
  };

  useEffect(() => {
    document.title = "Custom Order | TATVAAN";
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.fullName.trim() &&
      formData.phone.trim() &&
      formData.email.trim() &&
      formData.jewelleryType &&
      formData.budget &&
      formData.vision.trim()
    ) {
      setIsSubmitting(true);
      
      let imageUrl = "";

      if (selectedFile) {
        try {
          const res = await fetch("/api/upload-custom-order-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              fileName: selectedFile.name, 
              fileType: selectedFile.type,
              fileSize: selectedFile.size
            })
          });
          const signedData = await res.json();
          
          if (!res.ok) {
            throw new Error(signedData.error || "Failed to get upload URL");
          }

          const { signedUrl, path } = signedData;

          const uploadRes = await fetch(signedUrl, {
            method: "PUT",
            headers: { "Content-Type": selectedFile.type },
            body: selectedFile
          });

          if (!uploadRes.ok) {
            throw new Error("Failed to upload image to storage");
          }

          const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
          imageUrl = `${supabaseUrl}/storage/v1/object/public/custom-order-references/${path}`;
        } catch (error) {
          console.error("Image upload error:", error);
          setUploadError("Image upload failed. Submitting request without image.");
        }
      }

      await fetch('/api/custom-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, imageUrl })
      }).catch(err => console.error("Error sending custom order form:", err));

      setSuccessName(formData.fullName.trim());
      setSuccessPhone(formData.phone.trim());
      setSubmitted(true);
      setIsSubmitting(false);

      setFormData({
        fullName: "",
        phone: "",
        email: "",
        jewelleryType: "",
        preferredMetal: "Not decided yet",
        karat: "Not decided yet",
        preferredStone: "Lab-Grown Diamond",
        budget: "",
        occasion: "",
        vision: "",
        heardAboutUs: ""
      });
      setSelectedFile(null);
      setFilePreview(null);
      setUploadError("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* PAGE HEADER */}
        <section className="w-full bg-[#2E3135] py-[80px] text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-cormorant italic text-[52px] text-white leading-tight font-normal">
              Custom Order
            </h1>
            <p className="font-inter text-[15px] text-[#CDB38B] tracking-wide mt-2 font-light">
              Tell us your dream piece — we&apos;ll craft it just for you
            </p>
          </div>
        </section>

        {/* SECTION 1 — Intro text */}
        <section className="bg-white py-[60px] px-4 text-center">
          <div className="max-w-[700px] mx-auto">
            <h2 className="font-cormorant text-[36px] text-[#2E3135] leading-tight font-normal">
              Your Vision, Our Craft
            </h2>
            <div className="w-[60px] h-[1px] bg-[#CDB38B] mx-auto my-6"></div>
            <p className="font-inter text-[16px] text-[#555555] leading-[1.8] font-light max-w-3xl mx-auto">
              Every piece of jewellery has a story. Whether it&apos;s a ring for your engagement, a necklace for your mother, or a bangle to mark a milestone — we craft it exactly the way you imagine it. Share your vision below and our team will get back to you within 24 hours.
            </p>
          </div>
        </section>

        {/* SECTION 2 — Custom Order Form */}
        <section className="bg-[#F3F1EC] py-[60px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-[700px] mx-auto bg-white rounded-[8px] p-6 sm:p-12 shadow-sm">
            {submitted ? (
              <div className="text-center flex flex-col items-center py-4 animate-in fade-in duration-300">
                {/* Gold Checkmark Icon */}
                <div className="w-16 h-16 rounded-full bg-[#FBF9F6] flex items-center justify-center text-[#CDB38B] mb-6">
                  <Check className="w-8 h-8 stroke-[2.5]" />
                </div>
                
                <h3 className="font-cormorant text-[32px] text-[#2E3135] font-normal mb-4">
                  Request Received!
                </h3>
                
                <p className="font-inter text-[16px] text-[#555555] leading-relaxed font-light mb-8 max-w-md">
                  Thank you, <span className="font-semibold text-[#2E3135]">{successName}</span>! We&apos;ve received your custom order request and will contact you within 24 hours on <span className="font-semibold text-[#2E3135]">{successPhone}</span>.
                </p>

                <div className="w-full space-y-4">
                  <a
                    href="https://wa.me/919023454014?text=Hi%20TATVAAN%2C%20I%20just%20submitted%20a%20custom%20order%20request"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-[#25D366] hover:bg-[#20ba56] text-white py-[16px] text-[13px] font-inter font-medium tracking-[1.5px] uppercase transition-colors"
                  >
                    CHAT WITH US ON WHATSAPP
                  </a>
                  
                  <Link
                    href="/shop"
                    className="block w-full text-center bg-[#2E3135] hover:bg-[#CDB38B] text-white py-[16px] text-[13px] font-inter font-medium tracking-[1.5px] uppercase transition-colors"
                  >
                    Browse Our Collection
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Row 1 — two columns on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block font-inter font-medium text-[13px] text-[#2E3135] uppercase tracking-[1.5px] mb-2">
                      Full Name<span className="text-[#CDB38B] ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full bg-white border border-[#2E3135] p-3 text-[15px] font-inter text-[#2E3135] focus:border-[#CDB38B] focus:outline-none transition-colors rounded-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block font-inter font-medium text-[13px] text-[#2E3135] uppercase tracking-[1.5px] mb-2">
                      Phone Number<span className="text-[#CDB38B] ml-1">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="w-full bg-white border border-[#2E3135] p-3 text-[15px] font-inter text-[#2E3135] focus:border-[#CDB38B] focus:outline-none transition-colors rounded-none"
                    />
                  </div>
                </div>

                {/* Row 2 — full width */}
                <div>
                  <label htmlFor="email" className="block font-inter font-medium text-[13px] text-[#2E3135] uppercase tracking-[1.5px] mb-2">
                    Email Address<span className="text-[#CDB38B] ml-1">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full bg-white border border-[#2E3135] p-3 text-[15px] font-inter text-[#2E3135] focus:border-[#CDB38B] focus:outline-none transition-colors rounded-none"
                  />
                </div>

                {/* Row 3 — full width */}
                <div>
                  <label htmlFor="jewelleryType" className="block font-inter font-medium text-[13px] text-[#2E3135] uppercase tracking-[1.5px] mb-2">
                    Jewellery Type<span className="text-[#CDB38B] ml-1">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="jewelleryType"
                      name="jewelleryType"
                      required
                      value={formData.jewelleryType}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#2E3135] p-3 text-[15px] font-inter text-[#2E3135] focus:border-[#CDB38B] focus:outline-none transition-colors rounded-none appearance-none cursor-pointer"
                    >
                      <option value="">Select jewellery type</option>
                      <option value="Ring">Ring</option>
                      <option value="Necklace">Necklace</option>
                      <option value="Bangle">Bangle</option>
                      <option value="Earrings">Earrings</option>
                      <option value="Bracelet">Bracelet</option>
                      <option value="Pendant">Pendant</option>
                      <option value="Mangalsutra">Mangalsutra</option>
                      <option value="Anklet">Anklet</option>
                      <option value="Set">Set (multiple pieces)</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#2E3135]">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Row 4 — two columns on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="preferredMetal" className="block font-inter font-medium text-[13px] text-[#2E3135] uppercase tracking-[1.5px] mb-2">
                      Preferred Metal
                    </label>
                    <div className="relative">
                      <select
                        id="preferredMetal"
                        name="preferredMetal"
                        value={formData.preferredMetal}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-[#2E3135] p-3 text-[15px] font-inter text-[#2E3135] focus:border-[#CDB38B] focus:outline-none transition-colors rounded-none appearance-none cursor-pointer"
                      >
                        <option value="Not decided yet">Not decided yet</option>
                        <option value="Yellow Gold">Yellow Gold</option>
                        <option value="White Gold">White Gold</option>
                        <option value="Rose Gold">Rose Gold</option>
                        <option value="Silver">Silver</option>
                        <option value="Platinum">Platinum</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#2E3135]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="karat" className="block font-inter font-medium text-[13px] text-[#2E3135] uppercase tracking-[1.5px] mb-2">
                      Karat
                    </label>
                    <div className="relative">
                      <select
                        id="karat"
                        name="karat"
                        value={formData.karat}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-[#2E3135] p-3 text-[15px] font-inter text-[#2E3135] focus:border-[#CDB38B] focus:outline-none transition-colors rounded-none appearance-none cursor-pointer"
                      >
                        <option value="Not decided yet">Not decided yet</option>
                        <option value="9K">9K</option>
                        <option value="10K">10K</option>
                        <option value="14K">14K</option>
                        <option value="18K">18K</option>
                        <option value="22K">22K</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#2E3135]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 5 — two columns on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="preferredStone" className="block font-inter font-medium text-[13px] text-[#2E3135] uppercase tracking-[1.5px] mb-2">
                      Preferred Stone
                    </label>
                    <div className="relative">
                      <select
                        id="preferredStone"
                        name="preferredStone"
                        value={formData.preferredStone}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-[#2E3135] p-3 text-[15px] font-inter text-[#2E3135] focus:border-[#CDB38B] focus:outline-none transition-colors rounded-none appearance-none cursor-pointer"
                      >
                        <option value="Lab-Grown Diamond">Lab-Grown Diamond</option>
                        <option value="Natural Diamond">Natural Diamond</option>
                        <option value="Ruby">Ruby</option>
                        <option value="Emerald">Emerald</option>
                        <option value="Sapphire">Sapphire</option>
                        <option value="Pearl">Pearl</option>
                        <option value="No Stone">No Stone</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#2E3135]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="budget" className="block font-inter font-medium text-[13px] text-[#2E3135] uppercase tracking-[1.5px] mb-2">
                      Approximate Budget<span className="text-[#CDB38B] ml-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="budget"
                        name="budget"
                        required
                        value={formData.budget}
                        onChange={handleInputChange}
                        className="w-full bg-white border border-[#2E3135] p-3 text-[15px] font-inter text-[#2E3135] focus:border-[#CDB38B] focus:outline-none transition-colors rounded-none appearance-none cursor-pointer"
                      >
                        <option value="">Select budget range</option>
                        <option value="Under ₹10,000">Under ₹10,000</option>
                        <option value="₹10,000 – ₹25,000">₹10,000 – ₹25,000</option>
                        <option value="₹25,000 – ₹50,000">₹25,000 – ₹50,000</option>
                        <option value="₹50,000 – ₹1,00,000">₹50,000 – ₹1,00,000</option>
                        <option value="₹1,00,000 – ₹2,00,000">₹1,00,000 – ₹2,00,000</option>
                        <option value="Above ₹2,00,000">Above ₹2,00,000</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#2E3135]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 6 — full width */}
                <div>
                  <label htmlFor="occasion" className="block font-inter font-medium text-[13px] text-[#2E3135] uppercase tracking-[1.5px] mb-2">
                    Occasion
                  </label>
                  <input
                    type="text"
                    id="occasion"
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleInputChange}
                    placeholder="e.g. Anniversary, Engagement, Birthday, Baby shower gift..."
                    className="w-full bg-white border border-[#2E3135] p-3 text-[15px] font-inter text-[#2E3135] focus:border-[#CDB38B] focus:outline-none transition-colors rounded-none"
                  />
                </div>

                {/* Row 7 — full width */}
                <div>
                  <label htmlFor="vision" className="block font-inter font-medium text-[13px] text-[#2E3135] uppercase tracking-[1.5px] mb-2">
                    Your Vision<span className="text-[#CDB38B] ml-1">*</span>
                  </label>
                  <textarea
                    id="vision"
                    name="vision"
                    required
                    rows={5}
                    value={formData.vision}
                    onChange={handleInputChange}
                    placeholder="Describe your dream piece in as much detail as you like — style, size, inspiration, references, anything that helps us understand what you're looking for..."
                    className="w-full bg-white border border-[#2E3135] p-3 text-[15px] font-inter text-[#2E3135] focus:border-[#CDB38B] focus:outline-none transition-colors rounded-none resize-y"
                  />
                </div>

                {/* Row 7.5 — File Upload */}
                <div>
                  <label className="block font-inter font-medium text-[13px] text-[#2E3135] uppercase tracking-[1.5px] mb-2">
                    Reference Image <span className="text-[#555] lowercase tracking-normal font-normal">(optional)</span>
                  </label>
                  <p className="text-[12px] font-inter text-[#555555] mb-3">
                    Max size: 5MB. Formats: JPG, PNG, WebP.
                  </p>
                  
                  {!selectedFile ? (
                    <div className="relative border-2 border-dashed border-[#2E3135]/20 bg-[#F9F8F6] p-6 text-center hover:bg-[#F3F1EC] transition-colors cursor-pointer flex flex-col items-center justify-center">
                      <input
                        type="file"
                        accept="image/jpeg, image/png, image/webp"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        title="Upload reference image"
                      />
                      <UploadCloud className="w-8 h-8 text-[#CDB38B] mb-2" />
                      <span className="font-inter text-[13px] text-[#2E3135]">Click or drag to upload</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4 border border-[#2E3135]/20 p-3 bg-white">
                      {filePreview ? (
                        <img src={filePreview} alt="Preview" className="w-16 h-16 object-cover border border-[#F3F1EC]" />
                      ) : (
                        <div className="w-16 h-16 bg-[#F3F1EC] flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-[#2E3135]/40" />
                        </div>
                      )}
                      <div className="flex-grow overflow-hidden">
                        <p className="font-inter text-[13px] text-[#2E3135] truncate">{selectedFile.name}</p>
                        <p className="font-inter text-[11px] text-[#555555]">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-2 hover:bg-[#F3F1EC] text-[#2E3135] transition-colors"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  {uploadError && (
                    <p className="text-red-500 text-[12px] font-inter mt-2">{uploadError}</p>
                  )}
                </div>

                {/* Row 8 — full width */}
                <div>
                  <label htmlFor="heardAboutUs" className="block font-inter font-medium text-[13px] text-[#2E3135] uppercase tracking-[1.5px] mb-2">
                    How did you hear about us?
                  </label>
                  <div className="relative">
                    <select
                      id="heardAboutUs"
                      name="heardAboutUs"
                      value={formData.heardAboutUs}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-[#2E3135] p-3 text-[15px] font-inter text-[#2E3135] focus:border-[#CDB38B] focus:outline-none transition-colors rounded-none appearance-none cursor-pointer"
                    >
                      <option value="">Select an option</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Google Search">Google Search</option>
                      <option value="Friend or Family">Friend or Family</option>
                      <option value="WhatsApp">WhatsApp</option>
                      <option value="Walk-in">Walk-in</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#2E3135]">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#2E3135] text-white py-[16px] text-[13px] font-inter font-medium tracking-[1.5px] uppercase hover:bg-[#CDB38B] transition-colors duration-300 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        SUBMITTING...
                      </>
                    ) : (
                      "SUBMIT CUSTOM REQUEST"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </section>

        {/* SECTION 3 — Why Choose Custom */}
        <section className="bg-white py-[60px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-cormorant text-[36px] text-[#2E3135] text-center font-normal">
              Why Go Custom?
            </h2>
            <div className="w-[60px] h-[1px] bg-[#CDB38B] mx-auto mt-4 mb-12"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Card 1 */}
              <div className="bg-[#F3F1EC] rounded-[8px] p-[28px] flex flex-col items-start transition-all duration-300 hover:shadow-md">
                <span className="text-[#CDB38B] text-[24px] font-bold block mb-4" aria-hidden="true">✦</span>
                <h3 className="font-cormorant text-[22px] text-[#2E3135] mb-3 font-normal">
                  Made for You
                </h3>
                <p className="font-inter text-[15px] text-[#555555] leading-relaxed font-light">
                  Every detail — the metal, the stone, the setting, the size — is chosen by you. No compromises, no settling.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-[#F3F1EC] rounded-[8px] p-[28px] flex flex-col items-start transition-all duration-300 hover:shadow-md">
                <span className="text-[#CDB38B] text-[24px] font-bold block mb-4" aria-hidden="true">✦</span>
                <h3 className="font-cormorant text-[22px] text-[#2E3135] mb-3 font-normal">
                  Lab-Grown Excellence
                </h3>
                <p className="font-inter text-[15px] text-[#555555] leading-relaxed font-light">
                  All our custom pieces use certified IGI lab-grown diamonds. Same brilliance as mined diamonds, ethically grown, at a better price.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-[#F3F1EC] rounded-[8px] p-[28px] flex flex-col items-start transition-all duration-300 hover:shadow-md">
                <span className="text-[#CDB38B] text-[24px] font-bold block mb-4" aria-hidden="true">✦</span>
                <h3 className="font-cormorant text-[22px] text-[#2E3135] mb-3 font-normal">
                  24-Hour Response
                </h3>
                <p className="font-inter text-[15px] text-[#555555] leading-relaxed font-light">
                  Share your vision today. Our team will contact you within 24 hours with a quote, timeline, and design consultation.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
