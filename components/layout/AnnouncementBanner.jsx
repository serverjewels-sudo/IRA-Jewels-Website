"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { X } from "lucide-react";

export default function AnnouncementBanner() {
  const [promoCodes, setPromoCodes] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem("promoBannerDismissed");
    if (isDismissed === "true") {
      return;
    }

    async function fetchPromos() {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*, collections(name)")
        .eq("is_active", true)
        .eq("show_in_banner", true);
        
      console.log("BANNER DIAGNOSTIC QUERY RESULT:", { data, error });

      if (!error && data && data.length > 0) {
        // Filter by date range
        const now = new Date();
        const validCodes = data.filter((promo) => {
          if (promo.start_date) {
            const start = new Date(promo.start_date);
            if (now < start) return false;
          }
          if (promo.end_date) {
            // Include the end date fully by setting time to 23:59:59
            const end = new Date(promo.end_date);
            end.setHours(23, 59, 59, 999);
            if (now > end) return false;
          }
          return true;
        });

        if (validCodes.length > 0) {
          setPromoCodes(validCodes);
          setIsVisible(true);
        }
      }
    }

    fetchPromos();
  }, []);

  useEffect(() => {
    if (promoCodes.length > 1 && isVisible) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % promoCodes.length);
      }, 4000); // Rotate every 4 seconds
      return () => clearInterval(interval);
    }
  }, [promoCodes.length, isVisible]);

  if (!isVisible || promoCodes.length === 0) return null;

  const currentPromo = promoCodes[currentIndex];
  const collectionText = `the ${currentPromo.collections?.name || "Collection"} Collection`;

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem("promoBannerDismissed", "true");
  };

  return (
    <div className="bg-[#2E3135] text-white py-1 md:py-2 px-4 relative flex items-center justify-center border-b border-white/5 transition-all duration-300">
      <p className="text-[10px] font-inter uppercase tracking-[2px] text-center pr-6">
        Use code <span className="text-[#CDB38B] font-semibold">{currentPromo.code}</span> for {currentPromo.discount_percentage}% off {collectionText}
      </p>
      <button 
        onClick={handleDismiss}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-white/70 hover:text-white transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
