"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determine redirect target, defaulting to /account
  const redirect = searchParams.get("redirect") || "/account";

  // If user is already logged in, redirect them
  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push(redirect);
      }
    }
    checkUser();
  }, [router, redirect]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.session) {
        router.push(redirect);
        router.refresh();
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
          IRA JEWELS
        </h1>
        <p className="font-inter text-sm text-[#2E3135]/70">
          Sign in to your account
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSignIn}>
        <div>
          <label 
            htmlFor="email" 
            className="block font-inter text-[12px] uppercase tracking-wider text-[#2E3135] mb-2 font-medium"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#FFFFFF] border border-[#2E3135] font-inter text-[15px] p-3 focus:outline-none focus:border-[#CDB38B] transition-colors duration-300 rounded-none text-[#2E3135]"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label 
            htmlFor="password" 
            className="block font-inter text-[12px] uppercase tracking-wider text-[#2E3135] mb-2 font-medium"
          >
            Password
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
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2E3135] text-[#FFFFFF] font-inter font-medium text-[13px] tracking-[2px] uppercase py-3.5 hover:bg-[#CDB38B] transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </div>
        
        {errorMsg && (
          <p className="text-red-600 text-sm mt-2 text-center font-inter font-medium">
            {errorMsg}
          </p>
        )}
      </form>

      <div className="mt-8 pt-6 border-t border-[#F3F1EC] text-center space-y-4">
        <p className="font-inter text-xs text-[#2E3135]/70">
          Don&apos;t have an account?{" "}
          <Link 
            href={redirect !== "/account" ? `/account/register?redirect=${encodeURIComponent(redirect)}` : "/account/register"} 
            className="font-medium text-[#2E3135] hover:text-[#CDB38B] underline transition-colors"
          >
            Create one
          </Link>
        </p>
        <p className="font-inter text-xs">
          <Link 
            href="/shop" 
            className="font-medium text-[#2E3135]/50 hover:text-[#CDB38B] transition-colors uppercase tracking-wider text-[10px]"
          >
            Continue as Guest
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F3F1EC]">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={
          <div className="text-[#2E3135] font-inter text-sm tracking-wider uppercase animate-pulse">
            Loading...
          </div>
        }>
          <LoginForm />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
