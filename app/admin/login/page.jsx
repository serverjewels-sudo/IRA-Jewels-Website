"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseAdmin as supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Forgot password state
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState("");
  const [resetError, setResetError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("error") === "unauthorized") {
        setErrorMsg("Access denied. You do not have administrator privileges.");
      }
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSubmitting(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg("Invalid email or password");
      } else {
        router.push("/admin/products");
      }
    } catch (err) {
      console.error("Login unexpected error:", err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError("");
    setResetMsg("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });

      if (error) {
        setResetError(error.message);
      } else {
        setResetMsg("If an account exists with this email, a reset link has been sent.");
        setResetEmail("");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setResetError("An unexpected error occurred. Please try again.");
    } finally {
      setResetLoading(false);
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
          {showReset ? "Reset Password" : "Admin Panel"}
        </p>

        {showReset ? (
          <div className="w-full">
            <form onSubmit={handleResetPassword} className="w-full space-y-5">
              {resetError && (
                <div className="text-red-600 text-[13px] font-inter text-center py-2 px-3 bg-red-50 rounded border border-red-100">
                  {resetError}
                </div>
              )}
              {resetMsg && (
                <div className="text-green-600 text-[13px] font-inter text-center py-2 px-3 bg-green-50 rounded border border-green-100">
                  {resetMsg}
                </div>
              )}

              <div className="flex flex-col space-y-1.5">
                <label
                  htmlFor="resetEmail"
                  className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase"
                >
                  Email Address
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="admin@irajewels.com"
                  className="w-full px-4 py-3 bg-[#F3F1EC]/40 border border-[#E5E5E5] text-[#2E3135] rounded-md font-inter text-[13px] tracking-wide focus:outline-none focus:border-[#CDB38B] focus:bg-white transition-all placeholder:text-[#2E3135]/30"
                />
              </div>

              <button
                type="submit"
                disabled={resetLoading}
                className="w-full py-3.5 bg-[#2E3135] hover:bg-[#CDB38B] text-white font-inter text-[12px] font-semibold tracking-[2px] uppercase rounded-md shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resetLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "SEND RESET LINK"
                )}
              </button>
            </form>
            
            <div className="mt-4 text-center w-full">
              <button
                type="button"
                onClick={() => {
                  setShowReset(false);
                  setResetError("");
                  setResetMsg("");
                  setResetEmail("");
                }}
                className="font-inter text-[12px] text-[#2E3135]/60 hover:text-[#CDB38B] underline transition-colors"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        ) : (
        <>
        {/* Login Form */}
        <form onSubmit={handleLogin} className="w-full space-y-5">
          {errorMsg && (
            <div className="text-red-600 text-[13px] font-inter text-center py-2 px-3 bg-red-50 rounded border border-red-100">
              {errorMsg}
            </div>
          )}

          {/* Email input */}
          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="email"
              className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@irajewels.com"
              className="w-full px-4 py-3 bg-[#F3F1EC]/40 border border-[#E5E5E5] text-[#2E3135] rounded-md font-inter text-[13px] tracking-wide focus:outline-none focus:border-[#CDB38B] focus:bg-white transition-all placeholder:text-[#2E3135]/30"
            />
          </div>

          {/* Password input */}
          <div className="flex flex-col space-y-1.5">
            <label
              htmlFor="password"
              className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase"
            >
              Password
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

          {/* SIGN IN Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-[#2E3135] hover:bg-[#CDB38B] text-white font-inter text-[12px] font-semibold tracking-[2px] uppercase rounded-md shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "SIGN IN"
            )}
          </button>
        </form>
        
        <div className="mt-4 text-center w-full">
          <button
            type="button"
            onClick={() => setShowReset(true)}
            className="font-inter text-[12px] text-[#2E3135]/60 hover:text-[#CDB38B] underline transition-colors"
          >
            Forgot Password?
          </button>
        </div>
      </>
      )}
      </div>
    </div>
  );
}
