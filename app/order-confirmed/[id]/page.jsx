"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, ArrowRight, ShoppingBag } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

export default function OrderConfirmedDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    async function fetchOrder() {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", id)
          .single();

        if (error || !data) {
          console.error("Error fetching order:", error);
          setOrder(null);
        } else {
          setOrder(data);
        }
      } catch (err) {
        console.error("Unexpected error fetching order:", err);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [id]);

  const formatPrice = (amount) => {
    return "₹" + Number(amount).toLocaleString("en-IN");
  };

  const getPaymentMethodLabel = (method) => {
    switch (String(method).toLowerCase()) {
      case "cod":
        return "Cash on Delivery (COD)";
      case "upi":
        return "UPI (GPay/PhonePe)";
      case "card":
        return "Credit/Debit Card";
      case "netbanking":
        return "Net Banking";
      default:
        return method ? method.toUpperCase() : "Demo Payment";
    }
  };

  const getStatusLabel = (status) => {
    switch (String(status).toLowerCase()) {
      case "placed":
        return "Placed";
      case "confirmed":
        return "Confirmed";
      case "shipped":
        return "Shipped";
      case "delivered":
        return "Delivered";
      case "cancelled":
        return "Cancelled";
      default:
        return status ? status.toUpperCase() : "Placed";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-[#2E3135]">
        <Navbar />
        <main className="flex-grow py-16 px-4 max-w-7xl mx-auto w-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 rounded-full border-2 border-t-[#CDB38B] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <p className="text-[14px] font-inter font-light text-[#888888] tracking-wider uppercase">Loading Order Details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-[#2E3135]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-16 md:py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full text-center space-y-8">
            <div className="flex justify-center">
              <div className="rounded-full bg-[#FFF5F5] p-5 flex items-center justify-center">
                <AlertTriangle className="w-16 h-16 text-[#E53E3E] stroke-[1.25]" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="font-cormorant font-normal text-[36px] text-[#2E3135] leading-tight">
                Order Not Found
              </h1>
              <p className="font-inter font-light text-[15px] text-[#888888] max-w-sm mx-auto">
                We couldn&apos;t retrieve the details for this order. It might not exist or there was a system error.
              </p>
            </div>
            <div className="pt-4">
              <Link
                href="/shop"
                className="w-full h-14 bg-[#2E3135] text-white font-inter font-medium text-[12px] tracking-[2px] uppercase flex items-center justify-center hover:bg-[#CDB38B] transition-all duration-300 shadow-sm gap-2"
              >
                <span>RETURN TO SHOP</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const itemsList = Array.isArray(order.items) ? order.items : [];
  const orderDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#2E3135]">
      <Navbar />

      <main className="flex-grow py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        <div className="space-y-10">
          {/* Header Success Section */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="rounded-full bg-[#F3F1EC] p-5 flex items-center justify-center">
                <CheckCircle2 className="w-16 h-16 text-[#CDB38B] stroke-[1.25]" />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="font-cormorant font-normal text-[36px] sm:text-[40px] text-[#2E3135] leading-tight">
                Order Confirmed
              </h1>
              <p className="font-inter font-light text-[15px] text-[#888888] max-w-md mx-auto">
                Thank you, {order.customer_name}! Your order has been placed successfully and is currently being processed.
              </p>
            </div>
          </div>

          {/* Details & Summary Layout */}
          <div className="bg-[#F3F1EC] p-6 sm:p-8 rounded space-y-6 border border-[#E8E6E1]/50">
            {/* Meta Details */}
            <div className="grid grid-cols-2 gap-4 pb-6 border-b border-[#2E3135]/5 font-inter text-[13px]">
              <div>
                <span className="block text-[#888888] font-light uppercase tracking-wider text-[11px] mb-1">
                  Order Number
                </span>
                <span className="font-medium text-[#2E3135]">{order.order_number}</span>
              </div>
              <div>
                <span className="block text-[#888888] font-light uppercase tracking-wider text-[11px] mb-1">
                  Order Date
                </span>
                <span className="font-medium text-[#2E3135]">{orderDate}</span>
              </div>
              <div className="mt-2">
                <span className="block text-[#888888] font-light uppercase tracking-wider text-[11px] mb-1">
                  Payment Method
                </span>
                <span className="font-medium text-[#2E3135]">
                  {getPaymentMethodLabel(order.payment_method)}
                </span>
              </div>
              <div className="mt-2">
                <span className="block text-[#888888] font-light uppercase tracking-wider text-[11px] mb-1">
                  Order Status
                </span>
                <span className="font-medium text-[#CDB38B] uppercase tracking-wider text-[12px]">
                  {getStatusLabel(order.status)}
                </span>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              <h3 className="font-inter font-medium text-[12px] uppercase tracking-wider text-[#2E3135]">
                Order Items
              </h3>
              <div className="divide-y divide-[#E8E6E1] border-t border-b border-[#E8E6E1]">
                {itemsList.map((item, index) => (
                  <div key={index} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <div className="w-14 h-14 rounded overflow-hidden flex-shrink-0 bg-white border border-[#E8E6E1]">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-inter font-medium text-[14px] text-[#2E3135]">
                          {item.name}
                        </h4>
                        <p className="font-inter font-light text-[12px] text-[#888888] mt-0.5">
                          Qty: {item.quantity} × {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                    <span className="font-inter font-medium text-[14px] text-[#2E3135]">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Summary */}
            <div className="space-y-2 border-b border-[#2E3135]/5 pb-4 font-inter text-[14px]">
              <div className="flex justify-between items-center text-[#2E3135]/80">
                <span className="font-light">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-[#2E3135]/80">
                <span className="font-light">Shipping</span>
                <span>{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between items-center text-[16px] text-[#2E3135] pt-2 font-medium">
                <span>Total</span>
                <span className="text-[18px]">{formatPrice(order.total)}</span>
              </div>
            </div>

            {/* Shipping details */}
            <div className="font-inter text-[13px]">
              <h3 className="font-medium text-[12px] uppercase tracking-wider text-[#2E3135] mb-2">
                Shipping Address
              </h3>
              <p className="font-light text-[#888888] leading-relaxed">
                {order.shipping_address?.address}, <br />
                {order.shipping_address?.city}, {order.shipping_address?.state} – {order.shipping_address?.pincode}
              </p>
            </div>

            {/* Delivery Note */}
            <div className="bg-white p-4 border border-[#E8E6E1] text-center font-inter text-[13px] text-[#2E3135]/80">
              Estimated delivery: 5–7 business days
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3 max-w-sm mx-auto">
            <Link
              href="/shop"
              className="w-full h-14 bg-[#2E3135] text-white font-inter font-medium text-[12px] tracking-[2px] uppercase flex items-center justify-center hover:bg-[#CDB38B] transition-all duration-300 shadow-sm gap-2"
            >
              <span>CONTINUE SHOPPING</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
