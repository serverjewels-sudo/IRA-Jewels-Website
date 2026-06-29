"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  // If user is already logged in, redirect them to /account
  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/account");
      }
    }
    checkUser();
  }, [router]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    // Validation
    if (!fullName || !email || !password || !confirmPassword) {
      setErrorMsg("All fields are required.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg("Account created! Please check your email to verify.");
        // Clear fields on success
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F1EC]">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-[#FFFFFF] p-8 sm:p-10 border border-[#2E3135]/10 shadow-sm rounded-none">
          <div className="text-center mb-8">
            <h1 className="font-serif text-[28px] font-normal tracking-[0.2em] text-[#2E3135] uppercase mb-2">
              IRA JEWELS
            </h1>
            <p className="font-inter text-sm text-[#2E3135]/70">
              Create your account
            </p>
          </div>

          {successMsg ? (
            <div className="text-center space-y-6">
              <p className="text-green-600 font-inter font-medium text-sm">
                {successMsg}
              </p>
              <div className="pt-4">
                <Link
                  href="/account/login"
                  className="inline-block bg-[#2E3135] text-[#FFFFFF] font-inter font-medium text-[13px] tracking-[2px] uppercase py-3.5 px-8 hover:bg-[#CDB38B] transition-colors duration-300"
                >
                  Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label 
                  htmlFor="fullName" 
                  className="block font-inter text-[12px] uppercase tracking-wider text-[#2E3135] mb-2 font-medium"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#FFFFFF] border border-[#2E3135] font-inter text-[15px] p-3 focus:outline-none focus:border-[#CDB38B] transition-colors duration-300 rounded-none text-[#2E3135]"
                  placeholder="John Doe"
                />
              </div>

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
                  placeholder="•••••••• (Min 6 characters)"
                />
              </div>

              <div>
                <label 
                  htmlFor="confirmPassword" 
                  className="block font-inter text-[12px] uppercase tracking-wider text-[#2E3135] mb-2 font-medium"
                >
                  Confirm Password
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2E3135] text-[#FFFFFF] font-inter font-medium text-[13px] tracking-[2px] uppercase py-3.5 hover:bg-[#CDB38B] transition-colors duration-300 disabled:opacity-50"
                >
                  {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                </button>
              </div>
              
              {errorMsg && (
                <p className="text-red-600 text-sm mt-2 text-center font-inter font-medium">
                  {errorMsg}
                </p>
              )}
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-[#F3F1EC] text-center">
            <p className="font-inter text-xs text-[#2E3135]/70">
              Already have an account?{" "}
              <Link 
                href="/account/login" 
                className="font-medium text-[#2E3135] hover:text-[#CDB38B] underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
