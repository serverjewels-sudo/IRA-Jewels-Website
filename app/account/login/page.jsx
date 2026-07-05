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
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setErrorMsg("");
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/account`,
        },
      });
      if (error) {
        setErrorMsg(error.message);
        setGoogleLoading(false);
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setErrorMsg("Failed to initiate Google sign-in. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-[#FFFFFF] p-8 sm:p-10 border border-[#2E3135]/10 shadow-sm rounded-none">
      <div className="text-center mb-8">
        <h1 className="font-serif text-[28px] font-normal tracking-[0.2em] text-[#2E3135] uppercase mb-2">
          TATVAAN
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

      <div className="my-6 text-center text-xs font-inter text-[#2E3135]/50 uppercase tracking-widest">— or —</div>

      <button
        type="button"
        disabled={googleLoading || loading}
        onClick={handleGoogleSignIn}
        className="w-full bg-[#FFFFFF] text-[#2E3135] border border-[#2E3135] font-inter font-medium text-[13px] tracking-[2px] uppercase py-3.5 hover:bg-[#F3F1EC] transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2 rounded-none"
      >
        {googleLoading ? (
          "Redirecting..."
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </>
        )}
      </button>

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
