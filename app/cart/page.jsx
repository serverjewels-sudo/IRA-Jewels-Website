"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Plus, Minus, ShieldCheck, Truck, ChevronDown } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/lib/CartContext";
import { supabase } from "@/lib/supabase";
import { calculateProductPrice } from "@/lib/priceUtils";

export default function CartPage() {
  const { items, totalCount, updateQuantity, removeFromCart } = useCart();
  const router = useRouter();

  const handleCheckoutClick = async (e) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      router.push("/checkout");
    } else {
      router.push(`/account/login?redirect=${encodeURIComponent("/checkout")}`);
    }
  };
  const [mounted, setMounted] = useState(false);
  const [rate999, setRate999] = useState(null);
  const [expandedItems, setExpandedItems] = useState(new Set());

  const toggleExpand = (productId) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  useEffect(() => {
    setMounted(true);

    async function fetchGoldRate() {
      try {
        const { data, error } = await supabase
          .from("gold_rates")
          .select("rate_999")
          .eq("id", 1)
          .maybeSingle();
        if (!error && data) {
          setRate999(data.rate_999);
        }
      } catch (err) {
        console.error("Failed to fetch gold rate in CartPage:", err);
      }
    }
    fetchGoldRate();
  }, []);

  // Live-calculate product prices based on current gold rate
  const cartItemsWithPrice = items.map((item) => {
    const calculated = calculateProductPrice(item, rate999);
    return {
      ...item,
      livePriceVal: calculated.priceVal,
      livePriceStr: calculated.price,
    };
  });

  const subtotal = cartItemsWithPrice.reduce((sum, item) => sum + item.livePriceVal * item.quantity, 0);

  // Format currency in Indian Style (INR)
  const formatPrice = (amount) => {
    return "₹" + Number(amount).toLocaleString("en-IN");
  };

  // Prevent hydration mismatches
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-[#2E3135]">
        <Navbar />
        <main className="flex-grow py-16 px-4 max-w-7xl mx-auto w-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 rounded-full border-2 border-t-[#CDB38B] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <p className="text-[14px] font-inter font-light text-[#888888] tracking-wider uppercase">Loading Cart...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#2E3135]">
      <Navbar />

      <main className="flex-grow py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Title */}
        <h1 className="font-cormorant font-normal text-[36px] sm:text-[40px] text-[#2E3135] text-center mb-12 tracking-wide">
          Your Cart
        </h1>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <p className="font-inter font-light text-[16px] text-[#2E3135] mb-8 tracking-wide">
              Your cart is empty
            </p>
            <Link
              href="/shop"
              className="inline-block bg-[#2E3135] text-white font-inter font-medium text-[12px] tracking-[2px] uppercase py-4 px-8 hover:bg-[#CDB38B] transition-all duration-300 shadow-sm"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          /* Cart with Items State */
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            
            {/* Left Column: Items List (65% width) */}
            <div className="w-full lg:w-[65%] space-y-6">
              <div className="border-t border-[#F3F1EC]">
                {cartItemsWithPrice.map((item) => {
                  const specs = [
                    { label: 'Size', value: item.selectedSize },
                    { label: 'Colour', value: item.selectedColour },
                    { label: 'Shape', value: item.selectedShape ? item.selectedShape.charAt(0).toUpperCase() + item.selectedShape.slice(1) : null },
                    { label: 'Karat', value: item.karat },
                    { label: 'Diamond', value: item.selectedDiamondWeight }
                  ].filter(s => s.value);
                  
                  const hasVariations = specs.length > 0 || (item.hasEngraving && item.hasEngraving !== "No");
                  const isExpanded = expandedItems.has(item.productId);

                  return (
                    <div
                      key={item.productId}
                      className="flex py-6 border-b border-[#F3F1EC] relative group"
                    >
                      {/* Product Image */}
                      <div className="w-[90px] h-[90px] flex-shrink-0 border border-[#F3F1EC] overflow-hidden bg-[#F9F9F9]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="ml-6 flex-grow flex flex-col justify-between pr-8">
                        <div>
                          {/* Name */}
                          <h3 className="font-inter font-medium text-[15px] text-[#2E3135] hover:text-[#CDB38B] transition-colors duration-300 mb-1">
                            <Link href={`/shop/${item.slug}`}>
                              {item.name}
                            </Link>
                          </h3>

                          {/* Variation Details Toggle */}
                          {hasVariations && (
                            <div className="mb-2">
                              <button
                                onClick={() => toggleExpand(item.productId)}
                                className="flex items-center gap-1.5 text-[11px] font-inter uppercase tracking-[1.5px] text-[#2E3135] hover:text-[#CDB38B] transition-colors py-1 focus:outline-none"
                              >
                                <span>View Details</span>
                                <ChevronDown 
                                  className={`w-3.5 h-3.5 text-[#CDB38B] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                                />
                              </button>
                              
                              {isExpanded && (
                                <div className="mt-2 text-[12px] font-inter text-[#888888] space-y-1 border-l-2 border-[#F3F1EC] pl-3">
                                  {specs.map((spec, idx) => (
                                    <div key={idx} className="flex">
                                      <span className="w-16 font-medium text-[#2E3135]">{spec.label}:</span>
                                      <span>{spec.value}</span>
                                    </div>
                                  ))}
                                  
                                  {item.hasEngraving && item.hasEngraving !== "No" && (
                                    <div className="mt-3 inline-block bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] px-3 py-2 rounded">
                                      <span className="font-inter font-semibold text-[11px] uppercase tracking-wider block mb-1">Personalization</span>
                                      <span className="font-inter text-[12px]">
                                        Font: <strong>{item.engravingFont}</strong> — Text: <strong style={{fontFamily: item.engravingFont === 'Garamond' ? "'Cormorant Garamond', serif" : "inherit"}} className={item.engravingFont === 'Garamond' ? 'italic text-[14px]' : ''}>&quot;{item.engravingText}&quot;</strong>
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Price and Quantity Control Row */}
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-inter font-medium text-[15px] text-[#2E3135]">
                            {formatPrice(item.livePriceVal * item.quantity)}
                          </span>

                          {/* Quantity control */}
                          <div className="flex items-center space-x-3 bg-white">
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 rounded-full border border-[#2E3135] flex items-center justify-center text-[#2E3135] hover:bg-[#F3F1EC] transition-all duration-300 disabled:opacity-30 disabled:hover:bg-transparent"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-[12px] h-[12px] stroke-[2]" />
                            </button>
                            <span className="font-inter font-medium text-[14px] text-[#2E3135] w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                              className="w-7 h-7 rounded-full border border-[#2E3135] flex items-center justify-center text-[#2E3135] hover:bg-[#F3F1EC] transition-all duration-300"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-[12px] h-[12px] stroke-[2]" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromCart(item.productId)}
                        className="absolute top-6 right-0 p-1 text-[#999999] hover:text-[#2E3135] transition-colors duration-300"
                        aria-label="Remove item"
                      >
                        <X className="w-[16px] h-[16px] stroke-[2.5]" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Order Summary (35% width) */}
            <div className="w-full lg:w-[35%] bg-[#F3F1EC] p-6 lg:p-8 flex flex-col">
              <h2 className="font-inter font-medium text-[12px] tracking-[1.5px] uppercase text-[#2E3135] mb-6">
                ORDER SUMMARY
              </h2>

              {/* Subtotal line */}
              <div className="flex justify-between items-center py-3 border-b border-[#2E3135]/5">
                <span className="font-inter font-light text-[14px] text-[#2E3135]">Subtotal</span>
                <span className="font-inter font-medium text-[15px] text-[#2E3135]">
                  {formatPrice(subtotal)}
                </span>
              </div>

              {/* Delivery line */}
              <div className="flex justify-between items-center py-3 border-b border-[#2E3135]/5">
                <span className="font-inter font-light text-[14px] text-[#2E3135]">Delivery</span>
                <span className="font-inter font-medium text-[14px] text-[#CDB38B]">FREE</span>
              </div>

              {/* Total line */}
              <div className="flex justify-between items-baseline pt-4 pb-1">
                <span className="font-inter font-medium text-[16px] text-[#2E3135]">Total</span>
                <span className="font-inter font-bold text-[20px] text-[#2E3135]">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="font-inter font-light text-[11px] text-[#888888] text-right mb-6">
                Inclusive of all taxes
              </p>

              {/* Checkout Button */}
              <button
                onClick={handleCheckoutClick}
                className="w-full h-[52px] bg-[#2E3135] text-white font-inter font-medium text-[12px] tracking-[2px] uppercase flex items-center justify-center hover:bg-[#CDB38B] transition-all duration-300 mb-6 shadow-sm"
              >
                PROCEED TO CHECKOUT
              </button>

              {/* Checkout Security / Delivery Footnote */}
              <div className="flex flex-col items-center justify-center space-y-2 text-[#888888] text-[11px] font-inter font-light">
                <div className="flex items-center space-x-1.5">
                  <Truck className="w-3.5 h-3.5 stroke-[#888888]" />
                  <span>Free delivery across India</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 stroke-[#888888]" />
                  <span>Secure checkout</span>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
