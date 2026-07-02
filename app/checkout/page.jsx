"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { Lock, CreditCard, Landmark, Banknote, Smartphone, ShieldCheck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCart } from "@/lib/CartContext";
import { supabase } from "@/lib/supabase";

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

export default function CheckoutPage() {
  const { items, totalPrice, isLoaded, clearCart } = useCart();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Form Field States
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    pinCode: "",
  });

  const [errors, setErrors] = useState({});
  const [deliveryPref, setDeliveryPref] = useState("standard"); // "standard" or "express"
  const [paymentMethod, setPaymentMethod] = useState("razorpay"); // "razorpay", "cod"
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Empty cart protection: redirect to cart if empty
  useEffect(() => {
    if (mounted && isLoaded && items.length === 0 && !isSuccess) {
      router.push("/cart");
    }
  }, [mounted, isLoaded, items, router, isSuccess]);


  const formatPrice = (amount) => {
    return "₹" + Number(amount).toLocaleString("en-IN");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for field when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const tempErrors = {};
    if (!formData.fullName.trim()) {
      tempErrors.fullName = "Full name is required";
    }
    if (!formData.phone.trim()) {
      tempErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone.trim()) && !/^\+?\d{10,12}$/.test(formData.phone.trim())) {
      tempErrors.phone = "Enter a valid 10-digit phone number";
    }
    if (!formData.email.trim()) {
      tempErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Enter a valid email address";
    }
    if (!formData.address1.trim()) {
      tempErrors.address1 = "Address line 1 is required";
    }
    if (!formData.city.trim()) {
      tempErrors.city = "City is required";
    }
    if (!formData.state) {
      tempErrors.state = "State selection is required";
    }
    if (!formData.pinCode.trim()) {
      tempErrors.pinCode = "PIN Code is required";
    } else if (!/^\d{6}$/.test(formData.pinCode.trim())) {
      tempErrors.pinCode = "PIN Code must be exactly 6 digits";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const element = document.getElementsByName(firstErrorKey)[0];
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }

    setIsPlacingOrder(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const customerId = session?.user?.id || null;

      const year = new Date().getFullYear();
      const datePart = String(Date.now()).slice(-6);
      const orderNumber = `IRA-${year}-${datePart}`;

      const subtotal = items.reduce((sum, item) => sum + item.priceVal * item.quantity, 0);
      const shippingCost = deliveryPref === "express" ? 199 : 0;
      const finalTotal = subtotal + shippingCost;

      const orderItems = items.map((item) => ({
        product_id: item.id,
        name: item.name,
        price: item.priceVal,
        quantity: item.quantity,
        image: item.image,
      }));

      const shippingAddress = {
        address: formData.address1 + (formData.address2 ? ", " + formData.address2 : ""),
        city: formData.city,
        state: formData.state,
        pincode: formData.pinCode,
      };

      if (paymentMethod === "cod") {
        const { data: newOrder, error } = await supabase
          .from("orders")
          .insert([
            {
              order_number: orderNumber,
              customer_id: customerId,
              customer_name: formData.fullName,
              customer_email: formData.email,
              customer_phone: formData.phone,
              items: orderItems,
              subtotal: subtotal,
              shipping: shippingCost,
              total: finalTotal,
              payment_method: "cod",
              payment_status: "cod_pending",
              shipping_address: shippingAddress,
              status: "placed",
            },
          ])
          .select();

        if (error) {
          throw error;
        }

        if (!newOrder || newOrder.length === 0) {
          throw new Error("No order data returned from Supabase");
        }

        // On success: clear cart and redirect
        setIsSuccess(true);
        clearCart();
        router.push(`/order-confirmed/${newOrder[0].id}`);
      } else {
        // Razorpay Flow
        const createOrderRes = await fetch("/api/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: finalTotal }),
        });
        const orderData = await createOrderRes.json();

        if (!createOrderRes.ok) {
          throw new Error(orderData.error || "Failed to create Razorpay order");
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: finalTotal * 100,
          currency: "INR",
          name: "IRA Jewels",
          description: "Jewelry Purchase",
          order_id: orderData.orderId,
          handler: async function (response) {
            try {
              const verifyRes = await fetch("/api/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderData: {
                    order_number: orderNumber,
                    customer_id: customerId,
                    customer_name: formData.fullName,
                    customer_email: formData.email,
                    customer_phone: formData.phone,
                    items: orderItems,
                    subtotal: subtotal,
                    shipping: shippingCost,
                    total: finalTotal,
                    payment_method: "razorpay",
                    payment_status: "paid",
                    shipping_address: shippingAddress,
                    status: "placed",
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                  },
                }),
              });

              const verifyData = await verifyRes.json();

              if (!verifyRes.ok) {
                throw new Error(verifyData.error || "Payment verification failed");
              }

              setIsSuccess(true);
              clearCart();
              router.push(`/order-confirmed/${verifyData.order.id}`);
            } catch (err) {
              console.error("Verification error:", err);
              setSubmitError("Payment verification failed. Please contact support if amount was deducted.");
              setIsPlacingOrder(false);
            }
          },
          prefill: {
            name: formData.fullName,
            email: formData.email,
            contact: formData.phone,
          },
          theme: {
            color: "#2E3135",
          },
          modal: {
            ondismiss: function () {
              setSubmitError("Payment cancelled.");
              setIsPlacingOrder(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (response) {
          console.error("Payment Failed:", response.error);
          setSubmitError(response.error.description || "Payment failed. Please try again.");
          setIsPlacingOrder(false);
        });
        rzp.open();
      }
    } catch (err) {
      console.error("Error creating order:", err);
      setSubmitError(err.message || "Something went wrong. Please try again.");
      setIsPlacingOrder(false);
    }
  };

  // Prevent hydration mismatch or premature display while redirecting empty cart
  if (!mounted || !isLoaded || (items.length === 0 && !isSuccess)) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-[#2E3135]">
        <Navbar />
        <main className="flex-grow py-16 px-4 max-w-7xl mx-auto w-full flex flex-col items-center justify-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 rounded-full border-2 border-t-[#CDB38B] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
            <p className="text-[14px] font-inter font-light text-[#888888] tracking-wider uppercase">Loading Checkout...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const shippingCost = deliveryPref === "express" ? 199 : 0;
  const finalTotal = totalPrice + shippingCost;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#2E3135]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <Navbar />

      <main className="flex-grow py-12 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Page Title & Breadcrumbs */}
        <div className="mb-10">
          <h1 className="font-cormorant font-normal text-[40px] text-[#2E3135] leading-tight mb-2">
            Checkout
          </h1>
          <nav className="font-inter text-[13px] text-[#888888]">
            <Link href="/cart" className="hover:text-[#2E3135] transition-colors">
              Cart
            </Link>{" "}
            &gt; <span className="text-[#2E3135]">Checkout</span>
          </nav>
        </div>

        {/* Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Form (58% width) */}
          <form onSubmit={handleSubmit} className="w-full lg:w-[58%] space-y-12">
            
            {/* Section 1: Contact Information */}
            <div>
              <h2 className="font-inter font-medium text-[12px] tracking-[1.5px] uppercase text-[#2E3135] pb-3 border-b border-[#F3F1EC] mb-6">
                CONTACT INFORMATION
              </h2>
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block font-inter font-medium text-[13px] tracking-[1px] uppercase text-[#2E3135] mb-1.5">
                    Full Name <span className="text-[#E53E3E]">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className={`w-full h-12 border ${
                      errors.fullName ? "border-[#E53E3E]" : "border-[#E0E0E0]"
                    } rounded focus:outline-none focus:border-[#2E3135] px-4 font-inter font-normal text-[15px] text-[#2E3135] placeholder-[#999999] transition-all`}
                  />
                  {errors.fullName && (
                    <p className="mt-1.5 font-inter text-[12px] text-[#E53E3E]">{errors.fullName}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block font-inter font-medium text-[13px] tracking-[1px] uppercase text-[#2E3135] mb-1.5">
                    Phone Number <span className="text-[#E53E3E]">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter 10-digit mobile number"
                    className={`w-full h-12 border ${
                      errors.phone ? "border-[#E53E3E]" : "border-[#E0E0E0]"
                    } rounded focus:outline-none focus:border-[#2E3135] px-4 font-inter font-normal text-[15px] text-[#2E3135] placeholder-[#999999] transition-all`}
                  />
                  <p className="mt-1 font-inter font-light text-[12px] text-[#888888]">
                    For delivery updates
                  </p>
                  {errors.phone && (
                    <p className="mt-1.5 font-inter text-[12px] text-[#E53E3E]">{errors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block font-inter font-medium text-[13px] tracking-[1px] uppercase text-[#2E3135] mb-1.5">
                    Email Address <span className="text-[#E53E3E]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className={`w-full h-12 border ${
                      errors.email ? "border-[#E53E3E]" : "border-[#E0E0E0]"
                    } rounded focus:outline-none focus:border-[#2E3135] px-4 font-inter font-normal text-[15px] text-[#2E3135] placeholder-[#999999] transition-all`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 font-inter text-[12px] text-[#E53E3E]">{errors.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Delivery Address */}
            <div>
              <h2 className="font-inter font-medium text-[12px] tracking-[1.5px] uppercase text-[#2E3135] pb-3 border-b border-[#F3F1EC] mb-6">
                DELIVERY ADDRESS
              </h2>
              <div className="space-y-6">
                {/* Address Line 1 */}
                <div>
                  <label className="block font-inter font-medium text-[13px] tracking-[1px] uppercase text-[#2E3135] mb-1.5">
                    Address Line 1 <span className="text-[#E53E3E]">*</span>
                  </label>
                  <input
                    type="text"
                    name="address1"
                    value={formData.address1}
                    onChange={handleInputChange}
                    placeholder="House / Flat / Building"
                    className={`w-full h-12 border ${
                      errors.address1 ? "border-[#E53E3E]" : "border-[#E0E0E0]"
                    } rounded focus:outline-none focus:border-[#2E3135] px-4 font-inter font-normal text-[15px] text-[#2E3135] placeholder-[#999999] transition-all`}
                  />
                  {errors.address1 && (
                    <p className="mt-1.5 font-inter text-[12px] text-[#E53E3E]">{errors.address1}</p>
                  )}
                </div>

                {/* Address Line 2 */}
                <div>
                  <label className="block font-inter font-medium text-[13px] tracking-[1px] uppercase text-[#2E3135] mb-1.5">
                    Address Line 2 (Optional)
                  </label>
                  <input
                    type="text"
                    name="address2"
                    value={formData.address2}
                    onChange={handleInputChange}
                    placeholder="Street / Area / Locality"
                    className="w-full h-12 border border-[#E0E0E0] rounded focus:outline-none focus:border-[#2E3135] px-4 font-inter font-normal text-[15px] text-[#2E3135] placeholder-[#999999] transition-all"
                  />
                </div>

                {/* City, State, PIN Code Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* City */}
                  <div>
                    <label className="block font-inter font-medium text-[13px] tracking-[1px] uppercase text-[#2E3135] mb-1.5">
                      City <span className="text-[#E53E3E]">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className={`w-full h-12 border ${
                        errors.city ? "border-[#E53E3E]" : "border-[#E0E0E0]"
                      } rounded focus:outline-none focus:border-[#2E3135] px-4 font-inter font-normal text-[15px] text-[#2E3135] placeholder-[#999999] transition-all`}
                    />
                    {errors.city && (
                      <p className="mt-1.5 font-inter text-[12px] text-[#E53E3E]">{errors.city}</p>
                    )}
                  </div>

                  {/* State */}
                  <div>
                    <label className="block font-inter font-medium text-[13px] tracking-[1px] uppercase text-[#2E3135] mb-1.5">
                      State <span className="text-[#E53E3E]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className={`w-full h-12 border ${
                          errors.state ? "border-[#E53E3E]" : "border-[#E0E0E0]"
                        } rounded focus:outline-none focus:border-[#2E3135] px-4 font-inter font-normal text-[15px] text-[#2E3135] bg-white transition-all appearance-none`}
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#2E3135]">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                        </svg>
                      </div>
                    </div>
                    {errors.state && (
                      <p className="mt-1.5 font-inter text-[12px] text-[#E53E3E]">{errors.state}</p>
                    )}
                  </div>

                  {/* PIN Code */}
                  <div>
                    <label className="block font-inter font-medium text-[13px] tracking-[1px] uppercase text-[#2E3135] mb-1.5">
                      PIN Code <span className="text-[#E53E3E]">*</span>
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      maxLength={6}
                      placeholder="6 digits"
                      className={`w-full h-12 border ${
                        errors.pinCode ? "border-[#E53E3E]" : "border-[#E0E0E0]"
                      } rounded focus:outline-none focus:border-[#2E3135] px-4 font-inter font-normal text-[15px] text-[#2E3135] placeholder-[#999999] transition-all`}
                    />
                    {errors.pinCode && (
                      <p className="mt-1.5 font-inter text-[12px] text-[#E53E3E]">{errors.pinCode}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Delivery Preference */}
            <div>
              <h2 className="font-inter font-medium text-[12px] tracking-[1.5px] uppercase text-[#2E3135] pb-3 border-b border-[#F3F1EC] mb-6">
                DELIVERY PREFERENCE
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Standard Delivery */}
                <div
                  onClick={() => setDeliveryPref("standard")}
                  className={`cursor-pointer rounded-lg p-5 transition-all duration-300 flex flex-col justify-between ${
                    deliveryPref === "standard"
                      ? "border-2 border-[#2E3135] bg-[#F3F1EC]"
                      : "border border-[#E0E0E0] bg-white hover:border-[#2E3135]/50"
                  }`}
                >
                  <div>
                    <span className="block font-inter font-medium text-[14px] text-[#2E3135] mb-1">
                      Standard Delivery
                    </span>
                    <span className="block font-inter font-light text-[13px] text-[#888888]">
                      5–7 business days
                    </span>
                  </div>
                  <span className="block font-inter font-medium text-[14px] text-[#2E3135] mt-4">
                    FREE
                  </span>
                </div>

                {/* Express Delivery */}
                <div
                  onClick={() => setDeliveryPref("express")}
                  className={`cursor-pointer rounded-lg p-5 transition-all duration-300 flex flex-col justify-between ${
                    deliveryPref === "express"
                      ? "border-2 border-[#2E3135] bg-[#F3F1EC]"
                      : "border border-[#E0E0E0] bg-white hover:border-[#2E3135]/50"
                  }`}
                >
                  <div>
                    <span className="block font-inter font-medium text-[14px] text-[#2E3135] mb-1">
                      Express Delivery
                    </span>
                    <span className="block font-inter font-light text-[13px] text-[#888888]">
                      2–3 business days
                    </span>
                  </div>
                  <span className="block font-inter font-medium text-[14px] text-[#2E3135] mt-4">
                    ₹199
                  </span>
                </div>
              </div>
            </div>

            {/* Section 4: Payment Method */}
            <div>
              <h2 className="font-inter font-medium text-[12px] tracking-[1.5px] uppercase text-[#2E3135] pb-3 border-b border-[#F3F1EC] mb-6">
                PAYMENT METHOD
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Pay Online */}
                <div
                  onClick={() => setPaymentMethod("razorpay")}
                  className={`cursor-pointer rounded-lg p-4 transition-all duration-300 flex flex-col items-center justify-center text-center ${
                    paymentMethod === "razorpay"
                      ? "border-2 border-[#2E3135] bg-[#F3F1EC]"
                      : "border border-[#E0E0E0] bg-white hover:border-[#2E3135]/50"
                  }`}
                >
                  <CreditCard className="w-6 h-6 text-[#2E3135] mb-2 stroke-[1.5]" />
                  <span className="block font-inter font-medium text-[13px] text-[#2E3135]">
                    Pay Online
                  </span>
                  <span className="block font-inter font-light text-[11px] text-[#888888]">
                    UPI, Cards, Net Banking
                  </span>
                </div>

                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod("cod")}
                  className={`cursor-pointer rounded-lg p-4 transition-all duration-300 flex flex-col items-center justify-center text-center ${
                    paymentMethod === "cod"
                      ? "border-2 border-[#2E3135] bg-[#F3F1EC]"
                      : "border border-[#E0E0E0] bg-white hover:border-[#2E3135]/50"
                  }`}
                >
                  <Banknote className="w-6 h-6 text-[#2E3135] mb-2 stroke-[1.5]" />
                  <span className="block font-inter font-medium text-[13px] text-[#2E3135]">
                    Cash on Delivery
                  </span>
                  <span className="block font-inter font-light text-[11px] text-[#888888]">
                    Pay at your doorstep
                  </span>
                </div>
              </div>

              {/* Secure Payments Lock Note */}
              <div className="flex items-center space-x-2 text-[#888888] font-inter font-light text-[12px] mt-4">
                <Lock className="w-3.5 h-3.5" />
                <span>Secure payments powered by Razorpay</span>
              </div>
            </div>

            {/* Place Order & Footnote */}
            <div className="pt-4 space-y-4">
              {submitError && (
                <div className="p-3 bg-[#E53E3E]/10 border border-[#E53E3E]/20 text-[#E53E3E] text-center font-inter text-[13px] rounded">
                  {submitError}
                </div>
              )}
              <button
                type="submit"
                disabled={isPlacingOrder}
                className="w-full h-14 bg-[#2E3135] text-white font-inter font-medium text-[12px] tracking-[2px] uppercase flex items-center justify-center hover:bg-[#CDB38B] disabled:bg-[#888888] transition-all duration-300 shadow-sm"
              >
                {isPlacingOrder ? "PLACING ORDER..." : "PLACE ORDER"}
              </button>
              <p className="text-center font-inter font-light text-[12px] text-[#888888]">
                ✦ Free delivery across India on all orders
              </p>
            </div>

          </form>

          {/* Right Column: Order Summary (42% width) - Sticky */}
          <div className="w-full lg:w-[42%] lg:sticky lg:top-28 bg-[#F3F1EC] p-7 md:p-8 rounded">
            <h2 className="font-inter font-medium text-[12px] tracking-[1.5px] uppercase text-[#2E3135] mb-6">
              ORDER SUMMARY
            </h2>

            {/* Items List */}
            <div className="divide-y divide-[#E8E6E1] border-b border-[#E8E6E1] mb-6 max-h-[300px] overflow-y-auto pr-2">
              {items.map((item) => {
                const variationDetails = [
                  item.selectedSize ? `Size: ${item.selectedSize}` : null,
                  item.selectedColour ? `Colour: ${item.selectedColour}` : null
                ]
                  .filter(Boolean)
                  .join("  •  ");

                return (
                  <div key={item.productId} className="py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {/* Image */}
                      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-white border border-[#E8E6E1]">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Product details */}
                      <div>
                        <h4 className="font-inter font-medium text-[14px] text-[#2E3135] leading-snug">
                          {item.name}
                        </h4>
                        {variationDetails && (
                          <p className="font-inter font-light text-[13px] text-[#888888] mt-0.5">
                            {variationDetails}
                          </p>
                        )}
                        <p className="font-inter font-light text-[13px] text-[#888888] mt-0.5">
                          Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    {/* Price */}
                    <span className="font-inter font-medium text-[14px] text-[#2E3135] text-right">
                      {formatPrice(item.priceVal * item.quantity)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Summary lines */}
            <div className="space-y-3 font-inter">
              {/* Subtotal */}
              <div className="flex justify-between items-center text-[15px] text-[#2E3135]">
                <span className="font-light">Subtotal</span>
                <span className="font-medium">{formatPrice(totalPrice)}</span>
              </div>

              {/* Delivery */}
              <div className="flex justify-between items-center text-[15px] text-[#2E3135]">
                <span className="font-light">Delivery</span>
                <span className="font-medium">
                  {deliveryPref === "express" ? formatPrice(199) : "FREE"}
                </span>
              </div>

              <div className="border-t border-[#E8E6E1] my-2 pt-3">
                {/* Total */}
                <div className="flex justify-between items-baseline">
                  <span className="font-medium text-[16px] text-[#2E3135]">Total</span>
                  <span className="font-semibold text-[20px] text-[#2E3135]">
                    {formatPrice(finalTotal)}
                  </span>
                </div>
                <p className="font-light text-[12px] text-[#888888] text-right mt-1">
                  Inclusive of all taxes
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
