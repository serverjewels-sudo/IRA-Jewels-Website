"use client";

import { useState, useEffect } from "react";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export const dynamic = 'force-dynamic';

export default function GoldRatePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [rate999, setRate999] = useState("");
  const [gstDefault, setGstDefault] = useState("");
  
  // Feedback Messages
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Fetch current gold rates on load
  useEffect(() => {
    async function fetchGoldRates() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) return;

        const response = await fetch("/api/admin/gold-rate", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRate999(data.rate_999 !== undefined && data.rate_999 !== null ? String(data.rate_999) : "");
          setGstDefault(data.gst_default !== undefined && data.gst_default !== null ? String(data.gst_default) : "");
        } else {
          setErrorMsg("Could not load gold rate details.");
        }
      } catch (err) {
        console.error("Error loading gold rates:", err);
        setErrorMsg("An unexpected error occurred while fetching gold rates.");
      } finally {
        setLoading(false);
      }
    }

    fetchGoldRates();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (rate999 === "" || gstDefault === "") {
      setErrorMsg("Please fill in both Today's 999 Gold Rate and Default GST %.");
      return;
    }

    const rateNum = parseFloat(rate999);
    const gstNum = parseFloat(gstDefault);

    if (isNaN(rateNum) || rateNum < 0) {
      setErrorMsg("Please enter a valid, non-negative gold rate.");
      return;
    }

    if (isNaN(gstNum) || gstNum < 0 || gstNum > 100) {
      setErrorMsg("Please enter a valid GST percentage between 0 and 100.");
      return;
    }

    setSaving(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch("/api/admin/gold-rate", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rate_999: rateNum,
          gst_default: gstNum,
        }),
      });

      if (response.ok) {
        setSuccessMsg("Gold rates and default GST updated successfully.");
        // Auto-dismiss success message after 4 seconds
        setTimeout(() => {
          setSuccessMsg("");
        }, 4000);
      } else {
        const errData = await response.json();
        setErrorMsg(errData.error || "Failed to update gold rate settings.");
      }
    } catch (err) {
      console.error("Error saving gold rates:", err);
      setErrorMsg("Failed to connect to the database API.");
    } finally {
      setSaving(false);
    }
  };

  // Live Calculations (Instant as client types)
  const currentRateNum = parseFloat(rate999) || 0;
  const rate22K = (currentRateNum / 24) * 22;
  const rate18K = (currentRateNum / 24) * 18;
  const rate14K = (currentRateNum / 24) * 14;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="pb-5 border-b border-[#2E3135]/10">
          <div className="h-9 bg-[#2E3135]/10 rounded w-1/4 animate-pulse"></div>
          <div className="h-4 bg-[#2E3135]/10 rounded w-1/3 mt-2 animate-pulse"></div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-[#2E3135]/5 p-8 max-w-4xl space-y-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="h-4 bg-[#F3F1EC] rounded w-1/3"></div>
              <div className="h-10 bg-[#F3F1EC] rounded w-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-[#F3F1EC] rounded w-1/3"></div>
              <div className="h-10 bg-[#F3F1EC] rounded w-full"></div>
            </div>
          </div>
          <div className="pt-6 border-t border-[#F3F1EC]">
            <div className="h-6 bg-[#F3F1EC] rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-3 gap-6">
              <div className="h-16 bg-[#F3F1EC] rounded"></div>
              <div className="h-16 bg-[#F3F1EC] rounded"></div>
              <div className="h-16 bg-[#F3F1EC] rounded"></div>
            </div>
          </div>
          <div className="h-12 bg-[#F3F1EC] rounded w-32 pt-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="pb-5 border-b border-[#2E3135]/10">
        <h1 className="font-serif font-normal text-[36px] tracking-wide text-[#2E3135] uppercase">
          Gold Rate Settings
        </h1>
        <p className="font-inter text-[13px] text-[#888888] mt-1 font-light">
          Manage the store&apos;s reference gold rates and global fallback GST settings.
        </p>
      </div>

      {/* Main Form container */}
      <div className="bg-white rounded-lg shadow-sm border border-[#2E3135]/5 p-8 max-w-4xl">
        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Notifications */}
          {successMsg && (
            <div className="text-green-700 text-[13px] font-inter py-3 px-4 bg-green-50 rounded border border-green-100">
              {successMsg}
            </div>
          )}
          
          {errorMsg && (
            <div className="text-red-600 text-[13px] font-inter py-3 px-4 bg-red-50 rounded border border-red-100">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 999 Gold Rate Input */}
            <div className="flex flex-col space-y-1.5">
              <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
                Today&apos;s 999 Gold Rate (₹ per gram) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={rate999}
                onChange={(e) => setRate999(e.target.value)}
                placeholder="e.g. 7250"
                className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all"
              />
            </div>

            {/* Default GST Input */}
            <div className="flex flex-col space-y-1.5">
              <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
                Default GST % <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                max="100"
                step="0.01"
                value={gstDefault}
                onChange={(e) => setGstDefault(e.target.value)}
                placeholder="e.g. 3"
                className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all"
              />
            </div>
          </div>

          {/* Live Preview Section */}
          <div className="pt-6 border-t border-[#2E3135]/10">
            <h3 className="font-serif font-normal text-[20px] tracking-wide text-[#2E3135] uppercase mb-4">
              Live Preview Calculations
            </h3>
            <p className="font-inter text-[12px] text-[#888888] mb-6 font-light">
              These reference values are calculated live using standard karat ratios from the 999 rate above.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 22K Preview */}
              <div className="flex flex-col space-y-1.5">
                <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
                  22K Gold Rate (₹/g)
                </label>
                <div className="px-4 py-2.5 border border-[#E5E5E5] bg-[#F3F1EC]/60 rounded-md font-inter text-[13px] text-[#2E3135]/80 font-medium">
                  ₹ {rate22K.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* 18K Preview */}
              <div className="flex flex-col space-y-1.5">
                <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
                  18K Gold Rate (₹/g)
                </label>
                <div className="px-4 py-2.5 border border-[#E5E5E5] bg-[#F3F1EC]/60 rounded-md font-inter text-[13px] text-[#2E3135]/80 font-medium">
                  ₹ {rate18K.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>

              {/* 14K Preview */}
              <div className="flex flex-col space-y-1.5">
                <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
                  14K Gold Rate (₹/g)
                </label>
                <div className="px-4 py-2.5 border border-[#E5E5E5] bg-[#F3F1EC]/60 rounded-md font-inter text-[13px] text-[#2E3135]/80 font-medium">
                  ₹ {rate14K.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex items-center gap-4 pt-4 border-t border-[#2E3135]/10">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3.5 bg-[#2E3135] hover:bg-[#CDB38B] text-white font-inter text-[11px] font-semibold tracking-[1.5px] uppercase rounded transition-all duration-300 flex items-center justify-center min-w-[120px] disabled:opacity-50"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Save Rates"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
