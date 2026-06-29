"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // If it's the login page, bypass authentication check in layout
    if (pathname === "/admin/login") {
      setLoading(false);
      return;
    }

    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace("/admin/login");
        } else {
          setAuthenticated(true);
          setLoading(false);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        router.replace("/admin/login");
      }
    }
    
    checkAuth();
    
    // Subscribe to auth state changes to auto-redirect on session expiry or logouts
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" && pathname !== "/admin/login") {
        setAuthenticated(false);
        router.replace("/admin/login");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [pathname, router]);

  // If rendering login page, return layout-free children
  if (pathname === "/admin/login") {
    return <div className="min-h-screen bg-[#F3F1EC] text-[#2E3135]">{children}</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F3F1EC] flex items-center justify-center flex-col gap-4">
        {/* Sleek loader */}
        <div className="w-8 h-8 border-2 border-[#CDB38B] border-t-transparent rounded-full animate-spin"></div>
        <div className="text-[#2E3135]/60 font-inter text-[11px] uppercase tracking-[2px] font-semibold animate-pulse">
          Verifying Admin Credentials...
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return null; // Will redirect shortly
  }

  return (
    <div className="min-h-screen flex bg-[#F3F1EC] text-[#2E3135]">
      {/* Admin Sidebar */}
      <Sidebar />
      
      {/* Main Content Pane */}
      <main className="flex-grow p-8 md:p-12 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
