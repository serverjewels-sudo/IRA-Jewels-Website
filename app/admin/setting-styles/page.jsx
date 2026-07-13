"use client";

import { useState, useEffect } from "react";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

const ALL_SETTING_STYLES = [
  "3 Prong", "4 Prong", "5 Prong", "6 Prong", "8 Prong", "Bezel", "Pavé", "Flush", 
  "Halo", "Double Halo", "Hidden Halo", "Basket", "Cathedral", "Knife Edge", 
  "Split Shank", "Twisted Shank", "Euro Shank", "Tulip Setting", "Lotus Setting", 
  "Crown Setting", "Micro Pavé", "Channel Set Solitaire", "Floating Ring"
];

export default function SettingStylesPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [visibleStyles, setVisibleStyles] = useState([]);
  
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) return;

        const response = await fetch("/api/admin/setting-styles", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setVisibleStyles(data.visible_setting_styles || []);
        } else {
          setErrorMsg("Could not load setting styles config.");
        }
      } catch (err) {
        console.error("Error loading setting styles:", err);
        setErrorMsg("An unexpected error occurred while fetching settings.");
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  const handleToggle = (style) => {
    setVisibleStyles((prev) => {
      if (prev.includes(style)) {
        return prev.filter((s) => s !== style);
      } else {
        return [...prev, style];
      }
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch("/api/admin/setting-styles", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          visible_setting_styles: visibleStyles,
        }),
      });

      if (response.ok) {
        setSuccessMsg("Setting styles visibility updated successfully.");
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        const errData = await response.json();
        setErrorMsg(errData.error || "Failed to update setting styles visibility.");
      }
    } catch (err) {
      console.error("Error saving setting styles:", err);
      setErrorMsg("Failed to connect to the database API.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="pb-5 border-b border-[#2E3135]/10">
          <div className="h-9 bg-[#2E3135]/10 rounded w-1/4 animate-pulse"></div>
          <div className="h-4 bg-[#2E3135]/10 rounded w-1/3 mt-2 animate-pulse"></div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-[#2E3135]/5 p-8 max-w-4xl space-y-6 animate-pulse">
          <div className="h-4 bg-[#F3F1EC] rounded w-1/3"></div>
          <div className="h-10 bg-[#F3F1EC] rounded w-full"></div>
          <div className="h-10 bg-[#F3F1EC] rounded w-full"></div>
          <div className="h-10 bg-[#F3F1EC] rounded w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="pb-5 border-b border-[#2E3135]/10">
        <h1 className="font-serif font-normal text-[36px] tracking-wide text-[#2E3135] uppercase">
          Setting Styles
        </h1>
        <p className="font-inter text-[13px] text-[#888888] mt-1 font-light">
          Manage which setting styles are visible on the homepage carousel.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-[#2E3135]/5 p-8 max-w-4xl">
        <form onSubmit={handleSave} className="space-y-6">
          
          <div className="flex flex-col space-y-3">
            <label className="font-inter text-[13px] font-semibold tracking-wider text-[#2E3135] uppercase">
              Homepage Carousel Visibility
            </label>
            <p className="font-inter text-[12px] text-[#888888] mb-4">
              Check the styles you want to display in the homepage Setting Styles carousel.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6 mt-4 p-5 bg-[#F9F9F9] border border-[#E5E5E5] rounded-md">
              {ALL_SETTING_STYLES.map((style) => (
                <label key={style} className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={visibleStyles.includes(style)}
                      onChange={() => handleToggle(style)}
                      className="peer w-5 h-5 text-[#2E3135] bg-white border-2 border-[#E5E5E5] rounded focus:ring-0 focus:ring-offset-0 cursor-pointer appearance-none checked:bg-[#2E3135] checked:border-[#2E3135] transition-all"
                    />
                    <svg
                      className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="font-inter text-[14px] text-[#2E3135] group-hover:text-[#CDB38B] transition-colors select-none">
                    {style}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Messages */}
          {errorMsg && (
            <div className="p-4 rounded-md bg-red-50 border border-red-200">
              <p className="text-[13px] font-inter text-red-600">{errorMsg}</p>
            </div>
          )}
          
          {successMsg && (
            <div className="p-4 rounded-md bg-green-50 border border-green-200">
              <p className="text-[13px] font-inter text-green-700">{successMsg}</p>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-6 border-t border-[#F3F1EC]">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#2E3135] text-white font-inter text-[12px] font-medium uppercase tracking-[2px] px-8 py-3.5 rounded transition-all duration-300 hover:bg-[#CDB38B] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : "Save Visibility Settings"}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
