"use client";

import { useEffect, useState } from "react";
import React from "react";
import { supabaseAdmin as supabase } from "@/lib/supabase";
import { ChevronDown, ChevronUp } from "lucide-react";

export const dynamic = 'force-dynamic';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderIds, setExpandedOrderIds] = useState(new Set());

  async function fetchOrders() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) return;

      const response = await fetch("/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error("Failed to fetch orders:", response.statusText);
      }
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;

      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      });

      if (response.ok) {
        // Optimistically update the status locally
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        console.error("Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

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

  const getPaymentMethodLabel = (method) => {
    switch (String(method).toLowerCase()) {
      case "cod":
        return "COD";
      case "upi":
        return "UPI";
      case "card":
        return "Card";
      case "netbanking":
        return "Net Banking";
      default:
        return method ? method.toUpperCase() : "Demo";
    }
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrderIds((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="pb-5 border-b border-[#2E3135]/10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="font-serif font-normal text-[36px] tracking-wide text-[#2E3135] uppercase">
            Orders
            <span className="font-inter text-[13px] text-[#888888] block mt-1 font-light normal-case">
              Track customer transactions and order statuses.
            </span>
          </h1>
        </div>
        {!loading && orders.length > 0 && (
          <div className="font-inter text-[13px] text-[#2E3135]/80 bg-[#F3F1EC] px-4 py-2 border border-[#2E3135]/5 font-medium tracking-wide">
            {orders.length} orders total
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow-sm border border-[#2E3135]/5 overflow-hidden">
        {loading ? (
          /* Loading Skeleton */
          <div className="p-8 space-y-4">
            <div className="flex space-x-4 border-b border-gray-100 pb-4">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className="h-4 bg-[#F3F1EC] rounded w-full animate-pulse"></div>
              ))}
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex space-x-4 pt-2">
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/4 animate-pulse my-auto"></div>
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/4 animate-pulse my-auto"></div>
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/6 animate-pulse my-auto"></div>
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/6 animate-pulse my-auto"></div>
                <div className="h-6 bg-[#F3F1EC]/60 rounded w-1/6 animate-pulse my-auto"></div>
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          /* Orders Table */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead>
                <tr className="border-b border-[#2E3135]/10 bg-[#F3F1EC]/30">
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">Order #</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">Customer</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">Date</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-right">Total</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-center">Payment</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-center">Status</th>
                  <th className="p-5 font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E3135]/5 font-inter text-[13px] text-[#2E3135]">
                {orders.map((order) => {
                  const isExpanded = expandedOrderIds.has(order.id);
                  const items = Array.isArray(order.items) ? order.items : [];
                  return (
                    <React.Fragment key={order.id}>
                      <tr className="hover:bg-[#F3F1EC]/20 transition-colors">
                        <td className="p-5 font-medium tracking-wide">
                          <button
                            onClick={() => toggleOrderExpand(order.id)}
                            className="flex items-center gap-2 text-left focus:outline-none group"
                          >
                            <span className="font-mono text-[12px] group-hover:text-[#CDB38B] transition-colors">{order.order_number}</span>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-[#CDB38B]" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#888] group-hover:text-[#CDB38B]" />
                            )}
                          </button>
                          <span className="block font-mono text-[9px] text-gray-400 mt-0.5">{order.id}</span>
                        </td>
                        <td className="p-5">
                          <div className="font-medium">{order.customer_name || "Guest User"}</div>
                          <div className="text-[11px] text-gray-400">{order.customer_email || "no-email"}</div>
                          {order.customer_phone && <div className="text-[10px] text-gray-400 mt-0.5">{order.customer_phone}</div>}
                        </td>
                        <td className="p-5 text-gray-500">
                          {new Date(order.created_at).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="p-5 text-right font-medium text-[14px]">
                          ₹{Number(order.total).toLocaleString("en-IN")}
                        </td>
                        <td className="p-5 text-center">
                          <span className="font-medium">{getPaymentMethodLabel(order.payment_method)}</span>
                          <span className="block text-[9px] uppercase tracking-wider text-gray-400 mt-0.5">{order.payment_status}</span>
                        </td>
                        <td className="p-5 text-center">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase ${getStatusBadgeClass(order.status)}`}>
                            {order.status || "placed"}
                          </span>
                        </td>
                        <td className="p-5 text-center">
                          <select
                            value={order.status || "placed"}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="bg-white border border-[#E0E0E0] rounded px-2.5 py-1.5 font-inter text-[12px] text-[#2E3135] focus:outline-none focus:border-[#2E3135] cursor-pointer"
                          >
                            <option value="placed">Placed</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                      
                      {/* Expanded Items Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan="7" className="p-0 border-b border-[#2E3135]/10 bg-[#FAFAFA]">
                            <div className="p-6">
                              <h4 className="font-inter font-medium text-[11px] tracking-[1.5px] text-[#888] uppercase mb-4">Order Items</h4>
                              <div className="space-y-4">
                                {items.length > 0 ? items.map((item, idx) => {
                                  const variationDetails = [
                                    item.style_number ? `Style: ${item.style_number}` : null,
                                    item.sku ? `SKU: ${item.sku}` : null,
                                    item.selectedSize ? `Size: ${item.selectedSize}` : null,
                                    item.selectedColour ? `Colour: ${item.selectedColour}` : null,
                                    item.selectedShape ? `Shape: ${item.selectedShape.charAt(0).toUpperCase() + item.selectedShape.slice(1)}` : null,
                                    item.karat ? `Karat: ${item.karat}` : null
                                  ].filter(Boolean).join(" • ");

                                  return (
                                    <div key={idx} className="flex gap-4 items-start bg-white p-4 border border-[#E0E0E0] rounded-md shadow-sm">
                                      {item.image && (
                                        <div className="w-16 h-16 flex-shrink-0 bg-[#F3F1EC] rounded overflow-hidden border border-[#E5E5E5]">
                                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                      )}
                                      <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                          <h5 className="font-inter font-medium text-[14px] text-[#2E3135]">{item.name}</h5>
                                          <span className="font-inter font-medium text-[14px] text-[#2E3135]">
                                            {item.quantity} x ₹{Number(item.price).toLocaleString("en-IN")}
                                          </span>
                                        </div>
                                        {variationDetails && (
                                          <p className="font-inter text-[12px] text-[#888] mt-1">{variationDetails}</p>
                                        )}
                                        {item.hasEngraving && (
                                          <div className="mt-3 inline-block bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] px-3 py-2 rounded">
                                            <span className="font-inter font-semibold text-[11px] uppercase tracking-wider block mb-1">Personalization</span>
                                            <span className="font-inter text-[13px]">
                                              Font: <strong>{item.engravingFont}</strong> — Text: <strong style={{fontFamily: item.engravingFont === 'Garamond' ? "'Cormorant Garamond', serif" : "inherit"}} className={item.engravingFont === 'Garamond' ? 'italic text-[15px]' : ''}>&quot;{item.engravingText}&quot;</strong>
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                }) : (
                                  <p className="font-inter text-[13px] text-[#888]">No items data found for this order.</p>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center px-6">
            <div className="w-16 h-16 rounded-full bg-[#F3F1EC] flex items-center justify-center mb-6 text-[#CDB38B]">
              <svg
                className="w-7 h-7 stroke-[1.5]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h3 className="font-serif font-normal text-[24px] text-[#2E3135] mb-3 uppercase">
              No Orders Found
            </h3>
            <p className="font-inter font-light text-[14px] text-[#888888] max-w-[420px] leading-relaxed">
              No orders yet. Orders will appear here once customers start purchasing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
