/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Search, Menu, X, Phone, Compass, User, Sparkles, ChevronDown, Heart, MapPin, ClipboardList, LogOut, ShieldCheck, Truck, Database } from 'lucide-react';
import { CartItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase';

interface HeaderProps {
  cart: CartItem[];
  onOpenCart: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
  isLoggedIn?: boolean;
  onLogout?: () => void;
  customerName?: string;
  isAdminLoggedIn?: boolean;
}

const MEGA_CATEGORIES = [
  { id: 'rings', label: 'Solitaire Rings', icon: '💍', desc: 'Ananya Solitaires & Emerald halos', img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=200' },
  { id: 'earrings', label: 'Heritage Jhumkas & Studs', icon: '✨', desc: 'Chandbali & Polki statement droplets', img: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=200' },
  { id: 'pendants', label: 'Elegant Pendants', icon: '💎', desc: 'Solitaire pieces & floral emerald pendants', img: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=200' },
  { id: 'necklaces', label: 'Premium Necklaces', icon: '📿', desc: 'Rani Haar diamonds & Kundan Chokers', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=200' },
  { id: 'bangles', label: 'Royal Bangles', icon: '🌟', desc: 'Gold Kadas & detailed Meenakari', img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=200' },
  { id: 'bracelets', label: 'Fine Bracelets', icon: '💫', desc: 'Tennis chains & raw gemstone cuffs', img: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=200' },
  { id: 'nosepins', label: 'Dainty Nosepins', icon: '👃', desc: 'Minimalist diamond studs & traditional rings', img: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=200' }
];

export default function Header({
  cart,
  onOpenCart,
  activeTab,
  setActiveTab,
  onSearchChange,
  searchQuery,
  isLoggedIn = false,
  onLogout,
  customerName = '',
  isAdminLoggedIn = false
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setAccountDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkIfAdmin = async () => {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      const { data } = await supabase
        .from('admin_users')
        .select('email')
        .eq('email', user.email)
        .single();

      setIsAdmin(!!data);
    };

    checkIfAdmin();
  }, [user]);

  // Calculate total items in cart
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    { id: 'all', label: 'E-Boutique' },
    { id: 'craftsmanship', label: 'Our Atelier' },
    { id: 'contact', label: 'Bespoke Inquiry' }
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    setMegaMenuOpen(false);
    setAccountDropdownOpen(false);
  };

  const handleCategorySelect = (slug: string) => {
    setActiveTab(slug);
    setMegaMenuOpen(false);
    setMobileMenuOpen(false);
    setAccountDropdownOpen(false);
    setTimeout(() => {
      document.getElementById('boutique-catalog-anchor')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <>
      {/* Top Banner Accent with LuxeLoom Brand Colors */}
      <div className="w-full bg-[#0a0a0a] text-[#1a6b5c] text-[10px] tracking-[0.25em] py-2 text-center border-b border-[#1a6b5c]/20 font-mono select-none">
        FREE INSURED SHIPPING ACROSS INDIA | COD AVAILABLE | BIS 916 HALLMARK CERTIFIED | GST INVOICE
      </div>

      <header className="sticky top-0 z-50 bg-[#f5f0eb]/95 backdrop-blur-md border-b border-[#1a6b5c]/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Desktop Navigation Left */}
            <nav className="hidden lg:flex space-x-6 items-center flex-1">
              <button
                id="nav-item-all"
                onClick={() => handleNavClick('all')}
                className={`text-xs uppercase tracking-[0.18em] transition-all duration-300 pointer-events-auto cursor-pointer ${
                  activeTab === 'all' ? 'text-[#1a6b5c] font-semibold font-sans' : 'text-[#0a0a0a]/70 hover:text-[#1a6b5c]'
                }`}
              >
                E-Boutique
              </button>

              {/* Mega Menu Selector Toggle button */}
              <div className="relative">
                <button
                  id="mega-menu-trigger"
                  onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                  onMouseEnter={() => setMegaMenuOpen(true)}
                  className={`text-xs uppercase tracking-[0.18em] transition-all duration-300 flex items-center space-x-1 pointer-events-auto cursor-pointer ${
                    MEGA_CATEGORIES.some(cat => cat.id === activeTab) ? 'text-[#1a6b5c] font-semibold' : 'text-[#0a0a0a]/70 hover:text-[#1a6b5c]'
                  }`}
                >
                  <span>Collections</span>
                  <ChevronDown size={12} className={`transition-transform duration-300 ${megaMenuOpen ? 'rotate-180 text-[#1a6b5c]' : ''}`} />
                </button>
              </div>

              <button
                id="nav-item-craftsmanship"
                onClick={() => handleNavClick('craftsmanship')}
                className={`text-xs uppercase tracking-[0.18em] transition-all duration-300 pointer-events-auto cursor-pointer ${
                  activeTab === 'craftsmanship' ? 'text-[#1a6b5c] font-semibold font-sans' : 'text-[#0a0a0a]/70 hover:text-[#1a6b5c]'
                }`}
              >
                Our Atelier
              </button>

              <button
                id="nav-item-contact"
                onClick={() => handleNavClick('contact')}
                className={`text-xs uppercase tracking-[0.18em] transition-all duration-300 pointer-events-auto cursor-pointer ${
                  activeTab === 'contact' ? 'text-[#1a6b5c] font-semibold font-sans' : 'text-[#0a0a0a]/70 hover:text-[#1a6b5c]'
                }`}
              >
                Bespoke Inquiry
              </button>
            </nav>

            {/* Mobile menu trigger */}
            <div className="flex lg:hidden">
              <button
                id="mobile-menu-trigger"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-[#0a0a0a] hover:text-[#1a6b5c] pointer-events-auto cursor-pointer p-2"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>

            {/* Brand Logo Header */}
            <div className="flex-shrink-0 text-center flex flex-col items-center justify-center pointer-events-auto cursor-pointer select-none px-4" onClick={() => handleNavClick('all')}>
              <span className="font-serif text-xl sm:text-2xl font-light tracking-[0.3em] text-[#0a0a0a] select-none hover:text-[#1a6b5c] transition-colors duration-300 uppercase animate-fade-in">
                LUXELOOM
              </span>
              <span className="text-[8px] tracking-[0.5em] uppercase text-center text-[#1a6b5c] -mt-1 font-mono flex items-center justify-center gap-1.5">
                Fine Jewels
              </span>
            </div>

            {/* Navigation Right (Search, Shopping Cart, Secure Client Account) */}
            <div className="flex items-center justify-end space-x-4 sm:space-x-6 flex-1">
              
              {/* Dynamic Live Search Input */}
              <div className="relative flex items-center">
                {searchOpen && (
                  <input
                    id="search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search gems, gold, kundan..."
                    className="w-36 sm:w-56 bg-white border border-[#1a6b5c]/25 rounded-md px-4 py-1.5 text-xs text-[#0a0a0a] placeholder-[#999] focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] mr-2 font-light"
                    autoFocus
                  />
                )}
                <button
                  id="search-button-toggle"
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="text-[#0a0a0a] hover:text-[#1a6b5c] transition-colors duration-300 p-2 pointer-events-auto cursor-pointer"
                  title="Search masterpieces"
                >
                  {searchOpen ? <X size={18} /> : <Search size={18} />}
                </button>
              </div>

               {/* CLIENT ACCOUNT SYSTEM INTERFACE - Login/Profile icon layout */}
              <div className="relative">
                {isLoggedIn || isAdminLoggedIn ? (
                  <div ref={dropdownRef} className="relative">
                    <button
                      id="account-trigger-button"
                      onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                      className="text-xs tracking-wider text-[#0a0a0a] hover:text-[#1a6b5c] flex items-center space-x-1.5 focus:outline-none py-2 pointer-events-auto cursor-pointer"
                    >
                      <User size={18} className="text-[#1a6b5c]" />
                      {isAdminLoggedIn ? (
                        <span className="bg-[#1a6b5c] text-white text-[9px] px-2 py-0.5 rounded-sm font-sans font-bold flex items-center gap-1 shrink-0">
                          <ShieldCheck size={9} /> ADMIN
                        </span>
                      ) : (
                        <span className="hidden md:inline font-mono text-[11px] font-semibold">{customerName.split(' ')[0]}</span>
                      )}
                      <ChevronDown size={10} className={`text-[#666] transition-all ${accountDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Client private private settings dropdown */}
                    {accountDropdownOpen && (
                      <div
                        onMouseLeave={() => setAccountDropdownOpen(false)}
                        className="absolute right-0 mt-2 w-52 bg-white border border-[#1a6b5c]/15 shadow-xl py-2 text-xs font-mono rounded-sm text-[#0a0a0a] animate-scale-in z-50 select-none"
                      >
                        <div className="px-3.5 py-2.5 border-b border-[#1a6b5c]/10 bg-[#fbfbfb]">
                          <p className="text-[10px] text-zinc-400 uppercase">Private Vault Access</p>
                          <p className="font-semibold text-zinc-900 font-serif text-sm truncate mt-0.5">
                            {customerName || 'Client'}
                          </p>
                        </div>
                        <button
                          onClick={() => handleNavClick('account')}
                          className="w-full text-left px-4 py-2 hover:bg-[#1a6b5c]/5 hover:text-[#1a6b5c] flex items-center space-x-2.5"
                        >
                          <ClipboardList size={13} /> <span>My Orders</span>
                        </button>
                        <button
                          onClick={() => handleNavClick('account')}
                          className="w-full text-left px-4 py-2 hover:bg-[#1a6b5c]/5 hover:text-[#1a6b5c] flex items-center space-x-2.5"
                        >
                          <Heart size={13} /> <span>My Wishlist</span>
                        </button>
                        <button
                          onClick={() => handleNavClick('account')}
                          className="w-full text-left px-4 py-2 hover:bg-[#1a6b5c]/5 hover:text-[#1a6b5c] flex items-center space-x-2.5"
                        >
                          <Compass size={13} /> <span>My Profile</span>
                        </button>
                        <button
                          onClick={() => handleNavClick('account')}
                          className="w-full text-left px-4 py-2 hover:bg-[#1a6b5c]/5 hover:text-[#1a6b5c] flex items-center space-x-2.5"
                        >
                          <MapPin size={13} /> <span>My Addresses</span>
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => handleNavClick('admin')}
                            className="w-full text-left px-4 py-2 hover:bg-[#1a6b5c]/5 hover:text-[#1a6b5c] flex items-center space-x-2.5"
                            style={{
                              color: '#1a6b5c',
                              fontWeight: 'bold',
                              borderTop: '1px solid #eee',
                              marginTop: '8px',
                              paddingTop: '8px'
                            }}
                          >
                            <Database size={13} className="text-[#1a6b5c]" /> <span>⚙️ Atelier Admin</span>
                          </button>
                        )}
                        <div className="border-t border-[#1a6b5c]/10 mt-1 pt-1">
                          <button
                            onClick={() => {
                              if (onLogout) onLogout();
                              setAccountDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-neutral-50 flex items-center space-x-2.5"
                          >
                            <LogOut size={13} /> <span className="font-semibold">Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavClick('account')}
                    className="text-xs uppercase tracking-widest font-semibold flex items-center space-x-1.5 hover:text-[#1a6b5c] py-2 pointer-events-auto cursor-pointer"
                  >
                    <User size={18} />
                    <span className="hidden sm:inline font-mono text-[10px]">Vault Login</span>
                  </button>
                )}
              </div>

              {/* Shopping Bag Icon with dynamic items indicator */}
              <button
                id="cart-trigger-button"
                onClick={onOpenCart}
                className="relative text-[#0a0a0a] hover:text-[#1a6b5c] transition-colors duration-300 p-2 pointer-events-auto cursor-pointer group"
                aria-label="Open Cart"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#0a0a0a] group-hover:bg-[#1a6b5c] text-white text-[9px] font-mono leading-none rounded-full w-4.5 h-4.5 flex items-center justify-center font-bold transition-all">
                    {cartCount}
                  </span>
                )}
              </button>

            </div>
          </div>
        </div>

        {/* ==================== EXPERIMENTAL FULL WIDTH MEGA MENU DROP DOWN ==================== */}
        {megaMenuOpen && (
          <div
            id="mega-menu-overlay"
            onMouseLeave={() => setMegaMenuOpen(false)}
            className="hidden lg:block absolute left-0 right-0 bg-[#f5f0eb] border-y border-[#1a6b5c]/25 py-8 shadow-2xl z-40 text-xs font-sans select-none animate-slide-down"
          >
            <div className="max-w-7xl mx-auto px-8 grid grid-cols-5 gap-6">
              {MEGA_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  className="group relative cursor-pointer bg-white border border-[#1a6b5c]/10 rounded-sm p-3.5 hover:border-[#1a6b5c] hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-44"
                >
                  <div className="absolute inset-0 bg-cover bg-center rounded-sm group-hover:opacity-10 opacity-0 transition-opacity duration-300" style={{ backgroundImage: `url(${cat.img})` }} />
                  
                  <div className="relative z-10 space-y-1.5">
                    <span className="text-xl">{cat.icon}</span>
                    <h4 className="font-serif text-[#0a0a0a] text-[13px] font-semibold tracking-wide uppercase group-hover:text-[#1a6b5c] transition-colors">
                      {cat.label}
                    </h4>
                    <p className="text-[10px] text-[#666] font-light leading-snug line-clamp-2">
                      {cat.desc}
                    </p>
                  </div>

                  <div className="relative z-10 border-t border-dotted border-[#1a6b5c]/30 pt-2 flex justify-between items-center text-[9px] uppercase font-mono tracking-wider font-semibold text-[#1a6b5c]">
                    <span>Atelier Suite</span>
                    <span className="transition-transform group-hover:translate-x-1.5">&rarr;</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Certifications Row inside Mega Menu */}
            <div className="max-w-7xl mx-auto px-8 mt-6 pt-5 border-t border-[#1a6b5c]/15 flex justify-between items-center text-[10px] text-[#1a6b5c] font-mono select-none">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck size={13} />
                <span>ALL PRODUCTS EMBED WITH SECURED INDIAN CERTIFICATES (BIS 916 HALLMARK & IGI SOLITAIRES)</span>
              </span>
              <span>JAIPUR DESIGN CENTER & MUMBAI VAULT ALLOCATIONS</span>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#1a6b5c]/20 bg-[#f5f0eb] py-4 px-6 space-y-4 shadow-2xl absolute w-full left-0 z-40 max-h-[80vh] overflow-y-auto">
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => handleNavClick('all')}
                className={`text-left text-xs uppercase tracking-[0.2em] py-2 transition-all duration-300 pointer-events-auto cursor-pointer ${
                  activeTab === 'all' ? 'text-[#1a6b5c] font-bold pl-2 border-l-2 border-[#1a6b5c]' : 'text-[#0a0a0a]/70 hover:text-[#1a6b5c]'
                }`}
              >
                E-Boutique Home
              </button>

              <div className="border-t border-[#1a6b5c]/10 py-2 my-1">
                <p className="text-[10px] text-[#999] font-mono tracking-wider mb-2 uppercase select-none">Shop Categories</p>
                <div className="grid grid-cols-2 gap-2">
                  {MEGA_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`text-left text-[11px] uppercase tracking-wider py-1.5 px-2 bg-white/70 rounded-xs border transition-all duration-300 ${
                        activeTab === cat.id ? 'border-[#1a6b5c] text-[#1a6b5c] bg-[#1a6b5c]/5 font-semibold' : 'border-neutral-200 text-[#0a0a0a]/80'
                      }`}
                    >
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleNavClick('craftsmanship')}
                className={`text-left text-xs uppercase tracking-[0.2em] py-2 transition-all duration-300 pointer-events-auto cursor-pointer ${
                  activeTab === 'craftsmanship' ? 'text-[#1a6b5c] font-bold pl-2 border-l-2 border-[#1a6b5c]' : 'text-[#0a0a0a]/70 hover:text-[#1a6b5c]'
                }`}
              >
                Our Atelier
              </button>

              <button
                onClick={() => handleNavClick('contact')}
                className={`text-left text-xs uppercase tracking-[0.2em] py-2 transition-all duration-300 pointer-events-auto cursor-pointer ${
                  activeTab === 'contact' ? 'text-[#1a6b5c] font-bold pl-2 border-l-2 border-[#1a6b5c]' : 'text-[#0a0a0a]/70 hover:text-[#1a6b5c]'
                }`}
              >
                Bespoke Inquiry
              </button>

              <button
                onClick={() => handleNavClick('account')}
                className={`text-left text-xs uppercase tracking-[0.2em] py-2 transition-all duration-300 pointer-events-auto cursor-pointer ${
                  activeTab === 'account' ? 'text-[#1a6b5c] font-bold pl-2 border-l-2 border-[#1a6b5c]' : 'text-[#0a0a0a]/70 hover:text-[#1a6b5c]'
                }`}
              >
                My Account Drawer
              </button>
            </div>
            <div className="pt-4 border-t border-[#1a6b5c]/10 flex items-center text-[10px] text-[#999] space-x-1.5 font-mono select-none">
              <Compass size={12} className="text-[#1a6b5c]" />
              <span>BOUTIQUES: MUMBAI (TAJ PALACE) • DELHI (EMP EMPORIO) • JAIPUR (JAIPUR PALACE)</span>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
