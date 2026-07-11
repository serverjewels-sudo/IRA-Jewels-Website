"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";
import { generateInvoice } from "@/lib/invoiceGenerator";

export const dynamic = 'force-dynamic';

export default function AccountPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  async function fetchOrders(userId) {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_id", userId)
        .order("created_at", { ascending: false });
      
      if (!error && data) {
        setOrders(data);
      }
    } catch (err) {
      console.error("Error fetching user orders:", err);
    }
  }

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/account/login");
      } else {
        setUser(session.user);
        await fetchOrders(session.user.id);
        setLoading(false);
      }
    }
    getSession();

    // Subscribe to auth state changes to handle logout/session changes gracefully
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!session) {
          router.push("/account/login");
        } else {
          setUser(session.user);
          await fetchOrders(session.user.id);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const getStatusBadgeClass = (status) => {
    switch (String(status).toLowerCase()) {
      case "placed":
        return "bg-blue-50 text-blue-700 border border-blue-200";
      case "confirmed":
        return "bg-green-50 text-green-700 border border-green-200";
      case "shipped":
        return "bg-purple-50 text-purple-700 border border-purple-200";
      case "delivered":
        return "bg-gray-50 text-gray-700 border border-gray-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push("/shop");
      router.refresh();
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F3F1EC]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-[#2E3135] font-inter text-sm tracking-wider uppercase animate-pulse">
            Loading...
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Get display name
  const fullName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Valued Customer";

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F1EC]">
      <Navbar />
      
      <main className="flex-grow py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Welcome Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="font-serif text-[32px] font-normal text-[#2E3135] mb-2">
            Welcome, {fullName}
          </h1>
          <p className="font-inter text-sm text-[#2E3135]/60">
            Manage your details and view your order history below.
          </p>
        </div>

        {/* Account Dashboard Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* My Orders Card */}
          <div className="md:col-span-2 bg-[#FFFFFF] p-8 border border-[#2E3135]/10 rounded-none flex flex-col justify-between min-h-[300px]">
            <div>
              <h2 className="font-serif text-2xl text-[#2E3135] border-b border-[#F3F1EC] pb-4 mb-6">
                My Orders
              </h2>
              {orders.length > 0 ? (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {orders.map((order) => {
                    const itemCount = Array.isArray(order.items)
                      ? order.items.reduce((sum, item) => sum + (item.quantity || 1), 0)
                      : 0;

                    return (
                      <div
                        key={order.id}
                        className="border border-[#2E3135]/10 p-5 bg-[#F9F8F6] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition-all duration-300 hover:border-[#2E3135]/30 cursor-pointer"
                        onClick={() => router.push(`/order-confirmed/${order.id}`)}
                      >
                        <div className="space-y-1.5 font-inter">
                          <div className="flex items-center gap-3">
                            <span className="font-mono font-medium text-[14px] text-[#2E3135]">
                              {order.order_number}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase ${getStatusBadgeClass(order.status)}`}>
                              {order.status || "placed"}
                            </span>
                          </div>
                          <div className="text-[12px] text-[#888888] font-light">
                            Date: {new Date(order.created_at).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-[12px] text-[#2E3135]/80 mb-2">
                            {itemCount} {itemCount === 1 ? "item" : "items"}
                          </div>
                          
                          {/* Item Details List */}
                          {Array.isArray(order.items) && order.items.length > 0 && (
                            <div className="mt-3 space-y-3 border-t border-[#E5E5E5] pt-3">
                              {order.items.map((item, idx) => {
                                const variationDetails = [
                                  item.selectedSize ? `Size: ${item.selectedSize}` : null,
                                  item.selectedColour ? `Colour: ${item.selectedColour}` : null,
                                  item.selectedShape ? `Shape: ${item.selectedShape.charAt(0).toUpperCase() + item.selectedShape.slice(1)}` : null,
                                  item.karat ? `Karat: ${item.karat}` : null
                                ].filter(Boolean).join(" • ");

                                return (
                                  <div key={idx} className="flex flex-col">
                                    <span className="text-[13px] text-[#2E3135] font-medium">{item.name} {item.quantity > 1 ? `x${item.quantity}` : ''}</span>
                                    {variationDetails && (
                                      <span className="text-[11px] text-[#888] mt-0.5">{variationDetails}</span>
                                    )}
                                    {item.hasEngraving && (
                                      <div className="mt-1.5 inline-block bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] px-2.5 py-1.5 rounded self-start">
                                        <span className="text-[9px] font-semibold text-transform:uppercase tracking-wider block mb-0.5 uppercase">Personalization</span>
                                        <span className="text-[11px]">Font: <strong>{item.engravingFont}</strong> — Text: <strong style={{fontFamily: item.engravingFont === 'Garamond' ? "'Cormorant Garamond', serif" : "inherit"}} className={item.engravingFont === 'Garamond' ? 'italic text-[13px]' : ''}>"{item.engravingText}"</strong></span>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center gap-1 font-inter">
                          <span className="text-[11px] uppercase tracking-wider text-[#888888] font-light sm:block hidden">
                            Total Amount
                          </span>
                          <span className="text-[16px] font-medium text-[#2E3135]">
                            ₹{Number(order.total).toLocaleString("en-IN")}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              generateInvoice(order);
                            }}
                            className="mt-2 text-[10px] uppercase tracking-wider text-[#CDB38B] hover:text-[#2E3135] transition-colors duration-300 font-medium"
                          >
                            DOWNLOAD INVOICE
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <p className="font-inter text-sm text-[#2E3135]/60 mb-6">
                    No orders yet. Start shopping!
                  </p>
                  <Link
                    href="/shop"
                    className="bg-[#2E3135] text-[#FFFFFF] font-inter font-medium text-[11px] tracking-[1.5px] uppercase py-3 px-8 hover:bg-[#CDB38B] transition-colors duration-300"
                  >
                    SHOP NOW
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Details & Sign Out Column */}
          <div className="space-y-8">
            
            {/* My Details Card */}
            <div className="bg-[#FFFFFF] p-8 border border-[#2E3135]/10 rounded-none">
              <h2 className="font-serif text-2xl text-[#2E3135] border-b border-[#F3F1EC] pb-4 mb-6">
                My Details
              </h2>
              <div className="space-y-4 font-inter text-sm">
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[#2E3135]/50 mb-1">
                    Full Name
                  </span>
                  <span className="text-[#2E3135] font-medium">
                    {user?.user_metadata?.full_name || "—"}
                  </span>
                </div>
                <div>
                  <span className="block text-[11px] uppercase tracking-wider text-[#2E3135]/50 mb-1">
                    Email Address
                  </span>
                  <span className="text-[#2E3135] font-medium break-all">
                    {user?.email || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Sign Out Card */}
            <div className="bg-[#FFFFFF] p-8 border border-[#2E3135]/10 rounded-none">
              <h2 className="font-serif text-2xl text-[#2E3135] border-b border-[#F3F1EC] pb-4 mb-6">
                Account Actions
              </h2>
              <button
                onClick={handleSignOut}
                className="w-full bg-[#2E3135] text-[#FFFFFF] font-inter font-medium text-[11px] tracking-[1.5px] uppercase py-3 hover:bg-[#CDB38B] transition-colors duration-300"
              >
                SIGN OUT
              </button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
