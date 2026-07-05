"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg("Password updated successfully! Redirecting to login...");
        setTimeout(() => {
          router.push("/admin/login");
        }, 3000);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#F3F1EC]">
      <div className="bg-white rounded-lg shadow-xl p-10 max-w-md w-full border border-[#2E3135]/5 flex flex-col items-center">
        {/* Logo and Titles */}
        <h1 className="font-serif font-normal text-[32px] tracking-wide text-[#2E3135] text-center uppercase leading-none">
          TATVAAN
        </h1>
        <p className="font-inter text-[13px] text-[#CDB38B] tracking-[2px] font-semibold uppercase mt-2.5 mb-8 text-center">
          Reset Password
        </p>

        {/* Reset Form */}
        <form onSubmit={handleUpdatePassword} className="w-full space-y-5">
          {errorMsg && (
            <div className="text-red-600 text-[13px] font-inter text-center py-2 px-3 bg-red-50 rounded border border-red-100">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="text-green-600 text-[13px] font-inter text-center py-2 px-3 bg-green-50 rounded border border-green-100">
              {successMsg}
            </div>
          )}

          {/* New Password input */}
          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="password"
              className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#F3F1EC]/40 border border-[#E5E5E5] text-[#2E3135] rounded-md font-inter text-[13px] tracking-wide focus:outline-none focus:border-[#CDB38B] focus:bg-white transition-all placeholder:text-[#2E3135]/30"
            />
          </div>

          {/* Confirm Password input */}
          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="confirmPassword"
              className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase"
            >
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#F3F1EC]/40 border border-[#E5E5E5] text-[#2E3135] rounded-md font-inter text-[13px] tracking-wide focus:outline-none focus:border-[#CDB38B] focus:bg-white transition-all placeholder:text-[#2E3135]/30"
            />
          </div>

          {/* UPDATE Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#2E3135] hover:bg-[#CDB38B] text-white font-inter text-[12px] font-semibold tracking-[2px] uppercase rounded-md shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "UPDATE PASSWORD"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
