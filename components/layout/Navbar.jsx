"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, User, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalCount } = useCart();
  const [accountLink, setAccountLink] = useState("/account/login");
  const pathname = usePathname();
  const isHomepage = pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (!isHomepage) return;
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomepage]);

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

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const isTransparent = isHomepage && !isScrolled;
  const navPosition = isHomepage ? "fixed" : "sticky";
  const navBackground = isTransparent 
    ? "bg-transparent border-transparent" 
    : "bg-white/90 backdrop-blur-md border-b border-[#F3F1EC]";
  const iconColor = isTransparent ? "text-white" : "text-[#2E3135]";

  return (
    <>
      <header className={`${navPosition} top-0 z-50 w-full transition-all duration-300 ${navBackground}`}>
        <div className="w-full px-4 sm:px-6 md:px-4 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Left Side: Brand Logo */}
          <Link href="/" className="group flex flex-col items-center shrink-0">
            <span className="font-serif text-[14px] min-[400px]:text-[22px] sm:text-[26px] md:text-[17px] lg:text-[21px] xl:text-[26px] font-normal tracking-[0.12em] min-[400px]:tracking-[0.25em] md:tracking-[0.12em] lg:tracking-[0.18em] xl:tracking-[0.25em] text-[#2E3135] uppercase transition-colors duration-300 group-hover:text-[#CDB38B]">
              TATVAAN
            </span>
          </Link>

          {/* Center: Navigation Links (Desktop) */}
          <div className="hidden md:flex flex-1 justify-center items-center space-x-6 md:space-x-3 lg:space-x-5 xl:space-x-8 px-4">
              <Link 
                href="/shop" 
                className="text-[12px] md:text-[10px] lg:text-[12px] font-medium tracking-widest md:tracking-wider lg:tracking-widest text-[#2E3135] hover:text-[#CDB38B] transition-colors duration-300 uppercase"
              >
                Shop
              </Link>
              
              {/* Collections Dropdown */}
              <div className="relative group py-2">
                <button className="text-[12px] md:text-[10px] lg:text-[12px] font-medium tracking-widest md:tracking-wider lg:tracking-widest text-[#2E3135] hover:text-[#CDB38B] transition-colors duration-300 uppercase flex items-center gap-1">
                  Collections
                  <ChevronDown className="w-3 h-3 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white border border-[#F3F1EC] shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="py-2">
                    <Link href="/shop?category=rings" className="block px-4 py-2.5 text-[11px] font-medium tracking-widest text-[#2E3135] hover:bg-[#F9F8F6] hover:text-[#CDB38B] transition-colors duration-200 uppercase">
                      Rings
                    </Link>
                    <Link href="/shop?category=necklaces" className="block px-4 py-2.5 text-[11px] font-medium tracking-widest text-[#2E3135] hover:bg-[#F9F8F6] hover:text-[#CDB38B] transition-colors duration-200 uppercase">
                      Necklaces
                    </Link>
                    <Link href="/shop?category=earrings" className="block px-4 py-2.5 text-[11px] font-medium tracking-widest text-[#2E3135] hover:bg-[#F9F8F6] hover:text-[#CDB38B] transition-colors duration-200 uppercase">
                      Earrings
                    </Link>
                    <Link href="/shop?category=bangles" className="block px-4 py-2.5 text-[11px] font-medium tracking-widest text-[#2E3135] hover:bg-[#F9F8F6] hover:text-[#CDB38B] transition-colors duration-200 uppercase">
                      Bangles
                    </Link>
                    <Link href="/shop?category=bracelets" className="block px-4 py-2.5 text-[11px] font-medium tracking-widest text-[#2E3135] hover:bg-[#F9F8F6] hover:text-[#CDB38B] transition-colors duration-200 uppercase">
                      Bracelets
                    </Link>
                    <Link href="/shop" className="block px-4 py-2.5 text-[11px] font-semibold tracking-widest text-[#2E3135] hover:bg-[#F9F8F6] hover:text-[#CDB38B] transition-colors duration-200 uppercase border-t border-[#F3F1EC]">
                      All Jewellery
                    </Link>
                  </div>
                </div>
              </div>

              <Link 
                href="/offers" 
                className="text-[12px] md:text-[10px] lg:text-[12px] font-medium tracking-widest md:tracking-wider lg:tracking-widest text-[#2E3135] hover:text-[#CDB38B] transition-colors duration-300 uppercase"
              >
                Offers
              </Link>
              <Link 
                href="/blog" 
                className="text-[12px] md:text-[10px] lg:text-[12px] font-medium tracking-widest md:tracking-wider lg:tracking-widest text-[#2E3135] hover:text-[#CDB38B] transition-colors duration-300 uppercase"
              >
                Blog
              </Link>
              <Link 
                href="/about" 
                className="text-[12px] md:text-[10px] lg:text-[12px] font-medium tracking-widest md:tracking-wider lg:tracking-widest text-[#2E3135] hover:text-[#CDB38B] transition-colors duration-300 uppercase"
              >
                Our Story
              </Link>
              <Link 
                href="/contact" 
                className="text-[12px] md:text-[10px] lg:text-[12px] font-medium tracking-widest md:tracking-wider lg:tracking-widest text-[#2E3135] hover:text-[#CDB38B] transition-colors duration-300 uppercase"
              >
                Contact
              </Link>
            </div>

          {/* Right Side: Icons & Mobile Menu */}
          <div className="flex items-center space-x-3 sm:space-x-5 md:space-x-2 lg:space-x-4 xl:space-x-5 shrink-0">
            <button 
              className={`p-2 ${iconColor} hover:text-[#CDB38B] transition-colors duration-300`}
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px] stroke-[1.5]" />
            </button>
            
            <Link 
              href={accountLink} 
              className={`p-2 ${iconColor} hover:text-[#CDB38B] transition-colors duration-300 hidden sm:block`}
              aria-label="Account"
            >
              <User className="w-[18px] h-[18px] stroke-[1.5]" />
            </Link>

            <a href="/wishlist" aria-label="Wishlist" className={`${iconColor} hover:text-[#CDB38B] transition-colors duration-300 flex items-center`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </a>

            <Link 
              href="/cart" 
              className={`p-2 ${iconColor} hover:text-[#CDB38B] transition-colors duration-300 flex items-center relative`}
              aria-label="Cart"
            >
              <ShoppingBag className="w-[18px] h-[18px] stroke-[1.5]" />
              {totalCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-[16px] h-[16px] bg-[#CDB38B] text-white text-[10px] font-medium font-inter rounded-full flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Icon (Mobile) */}
            <div className="flex md:hidden ml-1">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`${iconColor} p-2 focus:outline-none transition-colors duration-300`}
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-[#2E3135]/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Slide-out Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="fixed top-0 left-0 w-[280px] h-dvh bg-white p-6 shadow-2xl flex flex-col justify-between z-50 md:hidden">
            <div>
              <div className="flex justify-between items-center mb-10">
                <span className="font-serif text-[18px] tracking-[0.2em] text-[#2E3135] uppercase">
                  TATVAAN
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1 text-[#2E3135]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              <div className="flex flex-col space-y-5 overflow-y-auto max-h-[calc(100dvh-180px)] pr-2">
                <Link 
                  href="/shop" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[13px] font-semibold tracking-widest text-[#2E3135] hover:text-[#CDB38B] uppercase"
                >
                  Shop
                </Link>
                
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold tracking-widest text-[#2E3135]/50 uppercase block">
                    Collections
                  </span>
                  <div className="pl-3 flex flex-col space-y-2.5 border-l border-[#F3F1EC]">
                    <Link 
                      href="/shop?category=rings" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[12px] font-medium tracking-widest text-[#2E3135] hover:text-[#CDB38B] uppercase"
                    >
                      Rings
                    </Link>
                    <Link 
                      href="/shop?category=necklaces" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[12px] font-medium tracking-widest text-[#2E3135] hover:text-[#CDB38B] uppercase"
                    >
                      Necklaces
                    </Link>
                    <Link 
                      href="/shop?category=earrings" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[12px] font-medium tracking-widest text-[#2E3135] hover:text-[#CDB38B] uppercase"
                    >
                      Earrings
                    </Link>
                    <Link 
                      href="/shop?category=bangles" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[12px] font-medium tracking-widest text-[#2E3135] hover:text-[#CDB38B] uppercase"
                    >
                      Bangles
                    </Link>
                    <Link 
                      href="/shop?category=bracelets" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[12px] font-medium tracking-widest text-[#2E3135] hover:text-[#CDB38B] uppercase"
                    >
                      Bracelets
                    </Link>
                    <Link 
                      href="/shop" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-[12px] font-semibold tracking-widest text-[#CDB38B] uppercase"
                    >
                      All Jewellery
                    </Link>
                  </div>
                </div>

                <Link 
                  href="/offers" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[13px] font-semibold tracking-widest text-[#2E3135] hover:text-[#CDB38B] uppercase"
                >
                  Offers
                </Link>
                
                <Link 
                  href="/blog" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[13px] font-semibold tracking-widest text-[#2E3135] hover:text-[#CDB38B] uppercase"
                >
                  Blog
                </Link>
                
                <Link 
                  href="/about" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[13px] font-semibold tracking-widest text-[#2E3135] hover:text-[#CDB38B] uppercase"
                >
                  Our Story
                </Link>
                
                <Link 
                  href="/contact" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[13px] font-semibold tracking-widest text-[#2E3135] hover:text-[#CDB38B] uppercase"
                >
                  Contact
                </Link>

                <Link 
                  href={accountLink} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[13px] font-semibold tracking-widest text-[#2E3135] hover:text-[#CDB38B] uppercase border-t border-[#F3F1EC] pt-4"
                >
                  Account
                </Link>
              </div>
            </div>

            <div className="border-t border-[#F3F1EC] pt-6 text-center">
              <p className="text-[10px] tracking-wider text-[#2E3135]/50 uppercase">
                © TATVAAN 2026
              </p>
            </div>
          </div>
      )}
    </>
  );
}

