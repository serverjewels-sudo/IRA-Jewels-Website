"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalCount } = useCart();
  const [accountLink, setAccountLink] = useState("/account/login");

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      setAccountLink(session ? "/account" : "/account/login");
    }
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setAccountLink(session ? "/account" : "/account/login");
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-[#F3F1EC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Left Side: Navigation Links (Desktop) */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            href="/shop" 
            className="text-[12px] font-medium tracking-widest text-[#2E3135] hover:text-[#CDB38B] transition-colors duration-300 uppercase"
          >
            Shop
          </Link>
          <Link 
            href="/about" 
            className="text-[12px] font-medium tracking-widest text-[#2E3135] hover:text-[#CDB38B] transition-colors duration-300 uppercase"
          >
            Our Story
          </Link>
          <Link 
            href="/contact" 
            className="text-[12px] font-medium tracking-widest text-[#2E3135] hover:text-[#CDB38B] transition-colors duration-300 uppercase"
          >
            Contact
          </Link>
        </div>

        {/* Mobile Menu Icon (Mobile) */}
        <div className="flex md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-[#2E3135] p-2 focus:outline-none"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>
        </div>

        {/* Center: Brand Logo */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Link href="/" className="group flex flex-col items-center">
            <span className="font-serif text-[22px] sm:text-[26px] font-normal tracking-[0.25em] text-[#2E3135] uppercase transition-colors duration-300 group-hover:text-[#CDB38B]">
              IRA Jewels
            </span>
          </Link>
        </div>

        {/* Right Side: Search, Account, Cart */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          <button 
            className="p-2 text-[#2E3135] hover:text-[#CDB38B] transition-colors duration-300"
            aria-label="Search"
          >
            <Search className="w-[18px] h-[18px] stroke-[1.5]" />
          </button>
          
          <Link 
            href={accountLink} 
            className="p-2 text-[#2E3135] hover:text-[#CDB38B] transition-colors duration-300 hidden sm:block"
            aria-label="Account"
          >
            <User className="w-[18px] h-[18px] stroke-[1.5]" />
          </Link>

          <Link 
            href="/cart" 
            className="p-2 text-[#2E3135] hover:text-[#CDB38B] transition-colors duration-300 flex items-center relative"
            aria-label="Cart"
          >
            <ShoppingBag className="w-[18px] h-[18px] stroke-[1.5]" />
            {totalCount > 0 && (
              <span className="absolute top-0.5 right-0.5 w-[16px] h-[16px] bg-[#CDB38B] text-white text-[10px] font-medium font-inter rounded-full flex items-center justify-center">
                {totalCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Slide-out Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#2E3135]/40 backdrop-blur-sm md:hidden">
          <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-white p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-10">
                <span className="font-serif text-[18px] tracking-[0.2em] text-[#2E3135] uppercase">
                  IRA
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-[#2E3135]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              <div className="flex flex-col space-y-6">
                <Link 
                  href="/shop" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[14px] font-medium tracking-widest text-[#2E3135] hover:text-[#CDB38B] uppercase"
                >
                  Shop
                </Link>
                <Link 
                  href="/about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[14px] font-medium tracking-widest text-[#2E3135] hover:text-[#CDB38B] uppercase"
                >
                  Our Story
                </Link>
                <Link 
                  href="/contact" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[14px] font-medium tracking-widest text-[#2E3135] hover:text-[#CDB38B] uppercase"
                >
                  Contact
                </Link>
                <Link 
                  href={accountLink} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[14px] font-medium tracking-widest text-[#2E3135] hover:text-[#CDB38B] uppercase"
                >
                  Account
                </Link>
              </div>
            </div>

            <div className="border-t border-[#F3F1EC] pt-6 text-center">
              <p className="text-[10px] tracking-wider text-[#2E3135]/50 uppercase">
                © IRA Jewels 2026
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

