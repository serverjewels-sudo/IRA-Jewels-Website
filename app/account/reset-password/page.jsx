"use client";

import { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  // Supabase automatically handles the hash in the URL and establishes a session 
  // for the password reset if it's a valid link. We don't need to manually parse it.
  
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
          router.push("/account/login");
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
    <div className="max-w-md w-full bg-[#FFFFFF] p-8 sm:p-10 border border-[#2E3135]/10 shadow-sm rounded-none">
      <div className="text-center mb-8">
        <h1 className="font-serif text-[28px] font-normal tracking-[0.2em] text-[#2E3135] uppercase mb-2">
          Reset Password
        </h1>
        <p className="font-inter text-sm text-[#2E3135]/70">
          Enter your new password below.
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleUpdatePassword}>
        <div>
          <label 
            htmlFor="password" 
            className="block font-inter text-[12px] uppercase tracking-wider text-[#2E3135] mb-2 font-medium"
          >
            New Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#FFFFFF] border border-[#2E3135] font-inter text-[15px] p-3 focus:outline-none focus:border-[#CDB38B] transition-colors duration-300 rounded-none text-[#2E3135]"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label 
            htmlFor="confirmPassword" 
            className="block font-inter text-[12px] uppercase tracking-wider text-[#2E3135] mb-2 font-medium"
          >
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-[#FFFFFF] border border-[#2E3135] font-inter text-[15px] p-3 focus:outline-none focus:border-[#CDB38B] transition-colors duration-300 rounded-none text-[#2E3135]"
            placeholder="••••••••"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2E3135] text-[#FFFFFF] font-inter font-medium text-[13px] tracking-[2px] uppercase py-3.5 hover:bg-[#CDB38B] transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? "UPDATING..." : "UPDATE PASSWORD"}
          </button>
        </div>
        
        {errorMsg && (
          <p className="text-red-600 text-sm mt-2 text-center font-inter font-medium">
            {errorMsg}
          </p>
        )}
        
        {successMsg && (
          <p className="text-green-600 text-sm mt-2 text-center font-inter font-medium">
            {successMsg}
          </p>
        )}
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F3F1EC]">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={
          <div className="text-[#2E3135] font-inter text-sm tracking-wider uppercase animate-pulse">
            Loading...
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
