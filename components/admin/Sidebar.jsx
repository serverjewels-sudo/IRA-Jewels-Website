"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { Package, PlusCircle, ShoppingBag, Coins, LogOut, X, Users } from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    if (onClose) onClose();
    router.push("/admin/login");
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const isProductsActive = 
    pathname === "/admin/products" || 
    (pathname.startsWith("/admin/products/") && pathname !== "/admin/products/new");

  const isAddProductActive = pathname === "/admin/products/new";
  const isOrdersActive = pathname === "/admin/orders";
  const isGoldRateActive = pathname === "/admin/gold-rate";
  const isAdminsActive = pathname === "/admin/admins";

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#2E3135]/40 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar aside panel */}
      <aside 
        className={`w-[240px] shrink-0 bg-[#2E3135] flex flex-col justify-between min-h-screen md:h-screen text-white z-40 shadow-xl border-r border-white/5 transition-transform duration-300
          fixed md:sticky top-0 bottom-0 left-0 md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* Top Header */}
        <div>
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div>
              <h1 className="font-serif font-normal text-[20px] tracking-wide text-white leading-tight uppercase">
                TATVAAN
              </h1>
              <p className="font-inter text-[11px] text-[#CDB38B] tracking-wider mt-1 font-medium uppercase">
                Admin Panel
              </p>
            </div>
            
            {/* Close button on mobile screen heights */}
            <button
              onClick={onClose}
              className="md:hidden p-1 text-white/70 hover:text-white transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-8 space-y-1">
            {/* Products Link */}
            <Link
              href="/admin/products"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 py-3 px-6 text-[12px] font-medium tracking-[1.5px] uppercase font-inter transition-all duration-200 hover:text-[#CDB38B] ${
                isProductsActive
                  ? "border-l-[3px] border-[#CDB38B] text-[#CDB38B] pl-[21px]"
                  : "border-l-[3px] border-transparent text-white/70"
              }`}
            >
              <Package className="w-4 h-4 stroke-[1.5]" />
              Products
            </Link>

            {/* Add Product Link */}
            <Link
              href="/admin/products/new"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 py-3 px-6 text-[12px] font-medium tracking-[1.5px] uppercase font-inter transition-all duration-200 hover:text-[#CDB38B] ${
                isAddProductActive
                  ? "border-l-[3px] border-[#CDB38B] text-[#CDB38B] pl-[21px]"
                  : "border-l-[3px] border-transparent text-white/70"
              }`}
            >
              <PlusCircle className="w-4 h-4 stroke-[1.5]" />
              Add Product
            </Link>

            {/* Orders Link */}
            <Link
              href="/admin/orders"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 py-3 px-6 text-[12px] font-medium tracking-[1.5px] uppercase font-inter transition-all duration-200 hover:text-[#CDB38B] ${
                isOrdersActive
                  ? "border-l-[3px] border-[#CDB38B] text-[#CDB38B] pl-[21px]"
                  : "border-l-[3px] border-transparent text-white/70"
              }`}
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
              Orders
            </Link>

            {/* Gold Rate Link */}
            <Link
              href="/admin/gold-rate"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 py-3 px-6 text-[12px] font-medium tracking-[1.5px] uppercase font-inter transition-all duration-200 hover:text-[#CDB38B] ${
                isGoldRateActive
                  ? "border-l-[3px] border-[#CDB38B] text-[#CDB38B] pl-[21px]"
                  : "border-l-[3px] border-transparent text-white/70"
              }`}
            >
              <Coins className="w-4 h-4 stroke-[1.5]" />
              Gold Rate
            </Link>

            {/* Admins Link */}
            <Link
              href="/admin/admins"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 py-3 px-6 text-[12px] font-medium tracking-[1.5px] uppercase font-inter transition-all duration-200 hover:text-[#CDB38B] ${
                isAdminsActive
                  ? "border-l-[3px] border-[#CDB38B] text-[#CDB38B] pl-[21px]"
                  : "border-l-[3px] border-transparent text-white/70"
              }`}
            >
              <Users className="w-4 h-4 stroke-[1.5]" />
              Admins
            </Link>
          </nav>
        </div>

        {/* Bottom Sign Out */}
        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full py-2.5 px-4 rounded bg-white/5 border border-white/10 hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 text-white/70 font-inter text-[12px] font-medium tracking-[1.5px] uppercase transition-all duration-200"
          >
            <LogOut className="w-4 h-4 stroke-[1.5]" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
