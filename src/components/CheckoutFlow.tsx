/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ShieldCheck, ChevronRight, Check, ArrowLeft, Heart, ShoppingBag, Sparkles, Smartphone, Building, Clock } from 'lucide-react';
import { CartItem, PromoCode, OrderDetails } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext.tsx';

interface CheckoutFlowProps {
  cart: CartItem[];
  appliedPromo: PromoCode | null;
  onOrderCompleted: (orderDetails: OrderDetails) => void;
  onCancel: () => void;
}

const INDIAN_STATES = [
  'Maharashtra', 'Delhi NCR', 'Karnataka', 'Rajasthan', 'Tamil Nadu', 
  'Gujarat', 'West Bengal', 'Telangana', 'Uttar Pradesh', 'Goa', 
  'Punjab', 'Haryana', 'Kerala', 'Madhya Pradesh', 'Bihar', 'Other'
];

export default function CheckoutFlow({
  cart,
  appliedPromo,
  onOrderCompleted,
  onCancel
}: CheckoutFlowProps) {
  const { user, loadingAuth } = useAuth();
  
  const navigate = (path: string) => {
    window.history.pushState(null, '', path);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  useEffect(() => {
    if (loadingAuth) return;
    if (!user) {
      sessionStorage.setItem('returnAfterLogin', '/checkout');
      navigate('/login');
    }
  }, [user, loadingAuth]);

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking' | 'emi' | 'cod' | 'finance'>('card');

  // Form states
  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '', // Indian Pin Code
    state: 'Maharashtra',
    country: 'India'
  });

  const [paymentForm, setPaymentForm] = useState({
    cardholderName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    upiId: '',
    utrNumber: '',
    bankName: 'HDFC Bank',
    emiBank: 'HDFC Bank No-Cost EMI',
    emiDuration: '6',
    financeProvider: 'Bajaj Finserv',
    financeId: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (loadingAuth || !user) return null;

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'percentage') {
      discount = (subtotal * appliedPromo.value) / 100;
    } else {
      discount = appliedPromo.value;
    }
  }
  discount = Math.min(discount, subtotal);
  const tax = (subtotal - discount) * 0.03; // 3% jewellery GST
  const shipping = 0; // Complimentary Insured Shipping across India
  const total = subtotal - discount + tax + shipping;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingForm({
      ...shippingForm,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let val = e.target.value;
    if (e.target.name === 'cardNumber') {
      // format card with spaces
      val = val.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (val.length > 19) return;
    } else if (e.target.name === 'expiry') {
      val = val.replace(/\s?/g, '').replace(/\/+/g, '/');
      if (val.length === 2 && !val.includes('/')) {
        val = val + '/';
      }
      if (val.length > 5) return;
    } else if (e.target.name === 'cvv') {
      val = val.replace(/\D/g, '');
      if (val.length > 4) return;
    }
    setPaymentForm({
      ...paymentForm,
      [e.target.name]: val
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateShipping = () => {
    const errs: Record<string, string> = {};
    if (!shippingForm.firstName.trim()) errs.firstName = 'First name is required.';
    if (!shippingForm.lastName.trim()) errs.lastName = 'Last name is required.';
    if (!shippingForm.email.trim() || !/\S+@\S+\.\S+/.test(shippingForm.email)) {
      errs.email = 'A valid email is required for secure tracking links.';
    }
    if (!shippingForm.phone.trim()) errs.phone = 'Mobile contact is required for delivery coordination.';
    if (!shippingForm.address.trim()) errs.address = 'A shipping address is required.';
    if (!shippingForm.city.trim()) errs.city = 'City is required.';
    const cleanPin = shippingForm.zipCode.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      errs.zipCode = 'Please enter a valid 6-digit Indian PIN Code.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validatePayment = () => {
    const errs: Record<string, string> = {};
    if (paymentMethod === 'card') {
      if (!paymentForm.cardholderName.trim()) {
        errs.cardholderName = 'Cardholder name is required.';
      }
      const cleanNum = paymentForm.cardNumber.replace(/\s/g, '');
      if (cleanNum.length < 13 || cleanNum.length > 19) {
        errs.cardNumber = 'Provide a valid credit/debit card number.';
      }
      if (paymentForm.expiry.length < 5 || !paymentForm.expiry.includes('/')) {
        errs.expiry = 'Expiration (MM/YY) is required.';
      }
      if (paymentForm.cvv.length < 3) {
        errs.cvv = 'Security CVV code is required.';
      }
    } else if (paymentMethod === 'upi') {
      if (!paymentForm.upiId.trim() || !paymentForm.upiId.includes('@')) {
        errs.upiId = 'Please enter a valid UPI ID (e.g., name@okhdfcbank).';
      }
      const cleanUtr = paymentForm.utrNumber.replace(/\D/g, '');
      if (cleanUtr.length !== 12) {
        errs.utrNumber = 'A valid 12-digit numeric UTR/Transaction ID is required to verify your deposit.';
      }
    } else if (paymentMethod === 'netbanking') {
      if (!paymentForm.bankName) {
        errs.bankName = 'Please choose your preferred bank.';
      }
    } else if (paymentMethod === 'emi') {
      if (total < 50000) {
        errs.emiError = 'No Cost EMI options are only valid on orders above ₹50,000.';
      }
    } else if (paymentMethod === 'cod') {
      if (total > 75000) {
        errs.codError = 'Cash on Delivery is protected and limited to orders below ₹75,000.';
      }
    } else if (paymentMethod === 'finance') {
      if (!paymentForm.financeId.trim()) {
        errs.financeId = 'Please provide your financing card or member number.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateCartBeforeCheckout = async (): Promise<boolean> => {
    try {
      for (const item of cart) {
        const { data: product, error } = await supabase
          .from('products')
          .select('in_stock, name')
          .eq('id', item.product.id)
          .single();

        if (error) {
          console.warn('Real-time validation database verify warning:', error);
          continue; // safe fallback or continue
        }

        if (!product || !product.in_stock) {
          const prodName = product?.name || item.product.name;
          alert(prodName + ' is no longer available. Please remove it from cart.');
          return false;
        }
      }
    } catch (err) {
      console.error('Validation error checking cart items state:', err);
    }
    return true;
  };

  const handleNextStep = async () => {
    // 1. Verify all cart items are currently in-stock in database
    const cartValid = await validateCartBeforeCheckout();
    if (!cartValid) {
      return; // block proceeding / placing order
    }

    if (step === 1) {
      if (validateShipping()) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validatePayment()) {
        // Complete Order & generate receipt details
        const orderId = `LL-${Math.floor(100000 + Math.random() * 900000)}-${new Date().getFullYear()}`;
        let paymentReference = '';
        if (paymentMethod === 'card') {
          paymentReference = `VIP Bank Card ending in •••• ${paymentForm.cardNumber.replace(/\s/g, '').slice(-4)}`;
        } else if (paymentMethod === 'upi') {
          paymentReference = `Instant UPI (${paymentForm.upiId})`;
        } else if (paymentMethod === 'netbanking') {
          paymentReference = `${paymentForm.bankName} Net Banking`;
        } else if (paymentMethod === 'emi') {
          paymentReference = `${paymentForm.emiBank} (${paymentForm.emiDuration} Months No-Cost EMI)`;
        } else if (paymentMethod === 'cod') {
          paymentReference = `Cash on Delivery (₹${total.toLocaleString('en-IN')})`;
        } else {
          paymentReference = `${paymentForm.financeProvider} Financing (ID: ${paymentForm.financeId})`;
        }
        
        onOrderCompleted({
          items: cart,
          customerInfo: {
            ...shippingForm,
            // join state name for compatibility
            city: `${shippingForm.city}, ${shippingForm.state}`
          },
          paymentInfo: {
            cardholderName: paymentMethod === 'card' ? paymentForm.cardholderName : shippingForm.firstName + ' ' + shippingForm.lastName,
            cardNumberMasked: paymentReference
          },
          subtotal,
          shipping,
          tax,
          discount,
          total,
          orderNumber: orderId,
          date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
          utrNumber: paymentMethod === 'upi' ? paymentForm.utrNumber : undefined
        });
        setStep(3);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 select-none text-[#0a0a0a]">
      {/* Back to boutique action */}
      <div className="mb-6">
        <button
          id="checkout-cancel-back"
          onClick={onCancel}
          className="text-xs uppercase tracking-[0.2em] text-[#1a6b5c] hover:text-[#0a0a0a] flex items-center space-x-2 pointer-events-auto cursor-pointer font-medium"
        >
          <ArrowLeft size={14} />
          <span>Abandon Vault, Back to Boutique</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Forms */}
        <div className="lg:col-span-8 bg-white border border-[#1a6b5c]/20 rounded-sm p-6 sm:p-8 space-y-8">
          
          {/* Progress Indicators */}
          <div className="flex items-center space-x-4 border-b border-[#1a6b5c]/15 pb-6">
            <div className="flex items-center space-x-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold ${
                step >= 1 ? 'bg-[#1a6b5c] text-white' : 'bg-[#f5f0eb] text-[#999]'
              }`}>
                {step > 1 ? <Check size={11} /> : '1'}
              </span>
              <span className={`text-xs uppercase tracking-widest font-mono ${
                step >= 1 ? 'text-[#0a0a0a]' : 'text-gray-400'
              }`}>INSURED DISPATCH</span>
            </div>
            <ChevronRight size={14} className="text-gray-400" />
            <div className="flex items-center space-x-2">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-mono font-bold ${
                step >= 2 ? 'bg-[#1a6b5c] text-white' : 'bg-[#f5f0eb] text-[#999]'
              }`}>
                {step > 2 ? <Check size={11} /> : '2'}
              </span>
              <span className={`text-xs uppercase tracking-widest font-mono ${
                step >= 2 ? 'text-[#0a0a0a]' : 'text-gray-400'
              }`}>PAYMENT SECURE</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-shipping"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-serif text-lg text-[#0a0a0a] font-light mb-1">Insured Shipping Parameters</h3>
                  <p className="text-xs text-[#666] font-light">
                    Your exquisite masterpieces will be packed in royal velvet jewelry cases and dispatched via armored courier with real-time GPS tracing.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1.5 font-medium">First Name</label>
                    <input
                      id="shipping-first-name"
                      type="text"
                      name="firstName"
                      value={shippingForm.firstName}
                      onChange={handleShippingChange}
                      className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 rounded-sm py-2 px-3 text-xs text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] focus:ring-1 focus:ring-[#1a6b5c]/30"
                    />
                    {errors.firstName && <span className="text-[10px] text-red-500 block mt-1">{errors.firstName}</span>}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1.5 font-medium">Last Name</label>
                    <input
                      id="shipping-last-name"
                      type="text"
                      name="lastName"
                      value={shippingForm.lastName}
                      onChange={handleShippingChange}
                      className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 rounded-sm py-2 px-3 text-xs text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] focus:ring-1 focus:ring-[#1a6b5c]/30"
                    />
                    {errors.lastName && <span className="text-[10px] text-red-500 block mt-1">{errors.lastName}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1.5 font-medium">Email Address (Secure Invoicing)</label>
                    <input
                      id="shipping-email"
                      type="email"
                      name="email"
                      value={shippingForm.email}
                      onChange={handleShippingChange}
                      className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 rounded-sm py-2 px-3 text-xs text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] focus:ring-1 focus:ring-[#1a6b5c]/30"
                    />
                    {errors.email && <span className="text-[10px] text-red-500 block mt-1">{errors.email}</span>}
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1.5 font-medium">Mobile Number (Indian Standard 10-digit)</label>
                    <input
                      id="shipping-phone"
                      type="tel"
                      name="phone"
                      value={shippingForm.phone}
                      onChange={handleShippingChange}
                      placeholder="+91"
                      className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 rounded-sm py-2 px-3 text-xs text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] focus:ring-1 focus:ring-[#1a6b5c]/30"
                    />
                    {errors.phone && <span className="text-[10px] text-red-500 block mt-1">{errors.phone}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1.5 font-medium">Atelier Shipping Address</label>
                  <input
                    id="shipping-address"
                    type="text"
                    name="address"
                    value={shippingForm.address}
                    onChange={handleShippingChange}
                    placeholder="Apartment, Landmark, Street details..."
                    className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 rounded-sm py-2 px-3 text-xs text-[#0a0a0a] placeholder-gray-400 focus:outline-none focus:border-[#1a6b5c] focus:ring-1 focus:ring-[#1a6b5c]/30"
                  />
                  {errors.address && <span className="text-[10px] text-red-500 block mt-1">{errors.address}</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1.5 font-medium">City</label>
                    <input
                      id="shipping-city"
                      type="text"
                      name="city"
                      value={shippingForm.city}
                      onChange={handleShippingChange}
                      className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 rounded-sm py-2 px-3 text-xs text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] focus:ring-1 focus:ring-[#1a6b5c]/30"
                    />
                    {errors.city && <span className="text-[10px] text-red-500 block mt-1">{errors.city}</span>}
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1.5 font-medium">State / UT</label>
                    <select
                      id="shipping-state"
                      name="state"
                      value={shippingForm.state}
                      onChange={handleShippingChange}
                      className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 rounded-sm py-2.5 px-3 text-xs text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] focus:ring-1 focus:ring-[#1a6b5c]/30 pointer-events-auto cursor-pointer"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1.5 font-medium">PIN Code (6-digit)</label>
                    <input
                      id="shipping-zip"
                      type="text"
                      name="zipCode"
                      maxLength={6}
                      placeholder="e.g., 400001"
                      value={shippingForm.zipCode}
                      onChange={handleShippingChange}
                      className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 rounded-sm py-2 px-3 text-xs text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] focus:ring-1 focus:ring-[#1a6b5c]/30 font-mono"
                    />
                    {errors.zipCode && <span className="text-[10px] text-red-500 block mt-1">{errors.zipCode}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1.5 font-medium">Country (Indian Exclusivity)</label>
                  <select
                    id="shipping-country"
                    name="country"
                    value={shippingForm.country}
                    onChange={handleShippingChange}
                    className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 rounded-sm py-2.5 px-3 text-xs text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] pointer-events-none opacity-80"
                  >
                    <option value="India">India (Atelier National Desk)</option>
                  </select>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-payment"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="font-serif text-lg text-[#0a0a0a] font-light mb-1 font-medium">Encrypted Payment Channel</h3>
                  <p className="text-xs text-[#666] font-light">
                    Every transaction is protected via isolated SSL keys. Specify your preferred payment mode below.
                  </p>
                </div>

                {/* Localized Luxury Payment Methods Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border-b border-[#1a6b5c]/15 pb-6">
                  {/* VIP CARD */}
                  <button
                    id="paymode-card"
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-3 px-2 text-center rounded-sm border transition-all pointer-events-auto cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'card' 
                        ? 'border-[#1a6b5c] bg-[#1a6b5c]/10 text-[#1a6b5c]' 
                        : 'border-[#1a6b5c]/15 text-[#666] hover:border-[#1a6b5c]/50 hover:bg-[#1a6b5c]/5'
                    }`}
                  >
                    <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Credit/Debit Card</span>
                    <span className="text-[8px] opacity-75">Visa, Mastercard, RuPay</span>
                  </button>

                  {/* INSTANT UPI */}
                  <button
                    id="paymode-upi"
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-3 px-2 text-center rounded-sm border transition-all pointer-events-auto cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'upi' 
                        ? 'border-[#1a6b5c] bg-[#1a6b5c]/10 text-[#1a6b5c]' 
                        : 'border-[#1a6b5c]/15 text-[#666] hover:border-[#1a6b5c]/50 hover:bg-[#1a6b5c]/5'
                    }`}
                  >
                    <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Instant UPI</span>
                    <span className="text-[8px] opacity-75">Paytm, Google Pay, PhonePe</span>
                  </button>

                  {/* NET BANKING */}
                  <button
                    id="paymode-netbanking"
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`py-3 px-2 text-center rounded-sm border transition-all pointer-events-auto cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'netbanking' 
                        ? 'border-[#1a6b5c] bg-[#1a6b5c]/10 text-[#1a6b5c]' 
                        : 'border-[#1a6b5c]/15 text-[#666] hover:border-[#1a6b5c]/50 hover:bg-[#1a6b5c]/5'
                    }`}
                  >
                    <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Net Banking</span>
                    <span className="text-[8px] opacity-75">All Premier Indian Banks</span>
                  </button>

                  {/* NO COST EMI */}
                  <button
                    id="paymode-emi"
                    type="button"
                    onClick={() => setPaymentMethod('emi')}
                    className={`py-3 px-2 text-center rounded-sm border transition-all pointer-events-auto cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'emi' 
                        ? 'border-[#1a6b5c] bg-[#1a6b5c]/10 text-[#1a6b5c]' 
                        : 'border-[#1a6b5c]/15 text-[#666] hover:border-[#1a6b5c]/50 hover:bg-[#1a6b5c]/5'
                    }`}
                  >
                    <span className="text-[10px] font-mono tracking-widest uppercase font-bold">No-Cost EMI</span>
                    <span className="text-[8px] text-[#1a6b5c] font-semibold">{total >= 50000 ? 'Eligible' : 'Above ₹50,000'}</span>
                  </button>

                  {/* CASH ON DELIVERY */}
                  <button
                    id="paymode-cod"
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`py-3 px-2 text-center rounded-sm border transition-all pointer-events-auto cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'cod' 
                        ? 'border-[#1a6b5c] bg-[#1a6b5c]/10 text-[#1a6b5c]' 
                        : 'border-[#1a6b5c]/15 text-[#666] hover:border-[#1a6b5c]/50 hover:bg-[#1a6b5c]/5'
                    }`}
                  >
                    <span className="text-[10px] font-mono tracking-widest uppercase font-bold">COD Option</span>
                    <span className="text-[8px] text-green-700 font-semibold">{total <= 75000 ? 'Available' : 'Below ₹75,000'}</span>
                  </button>

                  {/* BAJAJ FINSERV & ZESTMONEY */}
                  <button
                    id="paymode-finance"
                    type="button"
                    onClick={() => setPaymentMethod('finance')}
                    className={`py-3 px-2 text-center rounded-sm border transition-all pointer-events-auto cursor-pointer flex flex-col items-center justify-center gap-1 ${
                      paymentMethod === 'finance' 
                        ? 'border-[#1a6b5c] bg-[#1a6b5c]/10 text-[#1a6b5c]' 
                        : 'border-[#1a6b5c]/15 text-[#666] hover:border-[#1a6b5c]/50 hover:bg-[#1a6b5c]/5'
                    }`}
                  >
                    <span className="text-[10px] font-mono tracking-widest uppercase font-bold">Financing</span>
                    <span className="text-[8px] opacity-75">Bajaj Finserv & ZestMoney</span>
                  </button>
                </div>

                {/* Sub-panels */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    {/* Simulated luxury credit card graphic details */}
                    <div className="bg-gradient-to-tr from-[#1a6b5c] to-[#0a0a0a] border border-[#1a6b5c]/30 rounded-sm p-6 text-white space-y-6 relative overflow-hidden select-none shadow-md">
                      <div className="absolute right-0 top-0 w-24 h-24 bg-[#1a6b5c]/15 rounded-full filter blur-xl transform translate-x-8 -translate-y-8" />
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-serif tracking-[0.2em] font-semibold text-gray-200">LUXELOOM PATRON</span>
                          <p className="text-[8px] uppercase tracking-widest text-[#1a6b5c] font-mono">SUPREME INDIAN DESK</p>
                        </div>
                        <span className="text-[10px] font-mono font-bold tracking-widest text-[#1a6b5c] bg-white/10 px-2 py-0.5 rounded-xs border border-white/10">RuPay / Visa</span>
                      </div>

                      <div className="pt-4">
                        <p className="text-base font-mono tracking-widest text-white/95">
                          {paymentForm.cardNumber || '•••• •••• •••• ••••'}
                        </p>
                      </div>

                      <div className="flex justify-between items-end pt-2">
                        <div>
                          <span className="text-[7px] uppercase text-gray-400 font-mono tracking-wider block">PREMIER PATRON</span>
                          <p className="text-xs uppercase font-serif tracking-wider text-gray-200 truncate max-w-[200px]">
                            {paymentForm.cardholderName || `${shippingForm.firstName} ${shippingForm.lastName}` || 'LUXELOOM PATRON'}
                          </p>
                        </div>
                        <div>
                          <span className="text-[7px] uppercase text-gray-400 font-mono tracking-wider block">VALID THRU</span>
                          <p className="text-xs font-mono text-gray-200">
                            {paymentForm.expiry || 'MM/YY'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1.5 font-medium">Cardholder Name</label>
                        <input
                          id="payment-cardholder"
                          type="text"
                          name="cardholderName"
                          value={paymentForm.cardholderName}
                          onChange={handlePaymentChange}
                          placeholder="e.g., Priya Sharma"
                          className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 rounded-sm py-2 px-3 text-xs text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c]"
                        />
                        {errors.cardholderName && <span className="text-[10px] text-red-500 block mt-1">{errors.cardholderName}</span>}
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1.5 font-medium">Card Number (Supports RuPay, Visa, Mastercard)</label>
                        <input
                          id="payment-cardnumber"
                          type="text"
                          name="cardNumber"
                          value={paymentForm.cardNumber}
                          onChange={handlePaymentChange}
                          placeholder="4000 1234 5678 9010"
                          className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 rounded-sm py-2 px-3 text-xs text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] font-mono"
                        />
                        {errors.cardNumber && <span className="text-[10px] text-red-500 block mt-1">{errors.cardNumber}</span>}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1.5 font-medium">Expiry Date</label>
                          <input
                            id="payment-expiry"
                            type="text"
                            name="expiry"
                            value={paymentForm.expiry}
                            onChange={handlePaymentChange}
                            placeholder="MM/YY"
                            className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 rounded-sm py-2 px-3 text-xs text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] font-mono"
                          />
                          {errors.expiry && <span className="text-[10px] text-red-500 block mt-1">{errors.expiry}</span>}
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1.5 font-medium">Security CVV Code</label>
                          <input
                            id="payment-cvv"
                            type="password"
                            name="cvv"
                            value={paymentForm.cvv}
                            onChange={handlePaymentChange}
                            placeholder="•••"
                            className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 rounded-sm py-2 px-3 text-xs text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] font-mono"
                          />
                          {errors.cvv && <span className="text-[10px] text-red-500 block mt-1">{errors.cvv}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div className="space-y-6 p-5 bg-[#f5f0eb]/50 border border-[#1a6b5c]/15 rounded-sm">
                    <div className="flex items-center space-x-2">
                      <Smartphone size={16} className="text-[#1a6b5c]" />
                      <h4 className="text-xs uppercase font-mono tracking-wider text-[#0a0a0a] font-bold">BHIM / Paytm / PhonePe / GPay QR Payment</h4>
                    </div>

                    {/* QR Code and Instructions */}
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pt-2 pb-4 border-b border-dashed border-[#1a6b5c]/10">
                      <div className="bg-white p-3 border border-[#1a6b5c]/15 rounded-sm flex items-center justify-center shrink-0">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&color=1a6b5c&data=${encodeURIComponent(`upi://pay?pa=sonawanev141998-2@okhdfcbank&pn=LuxeLoom%20Jewels&am=${total}&cu=INR`)}`}
                          alt="LuxeLoom UPI QR Code"
                          className="w-40 h-40"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="space-y-3 text-[11px] leading-relaxed text-[#666]">
                        <p className="font-semibold text-zinc-900 font-serif text-sm">Scan to Liquidate Secure Deposit</p>
                        <p>
                          1. Open any UPI application (GPay, PhonePe, Paytm, BHIM) on your mobile device.<br />
                          2. Scan the secure QR code or copy the Boutique Merchant UPI ID below.<br />
                          3. Make a direct payment of <strong className="text-[#1a6b5c] text-xs">₹{total.toLocaleString('en-IN')}</strong>.<br />
                          4. Submit the transaction's 12-digit UTR (Unique Transaction Reference) number below for verification.
                        </p>
                      </div>
                    </div>

                    {/* Copy UPI ID */}
                    <div className="bg-white border border-[#1a6b5c]/10 p-3 flex justify-between items-center text-xs font-mono">
                      <div>
                        <span className="text-[9px] uppercase text-zinc-400 block font-sans">Boutique Merchant UPI ID</span>
                        <span className="font-bold text-zinc-800">sonawanev141998-2@okhdfcbank</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText("sonawanev141998-2@okhdfcbank");
                          alert("Merchant UPI ID copied to clipboard!");
                        }}
                        className="py-1 px-3 bg-[#1a6b5c] text-white text-[9px] tracking-wider uppercase rounded-xs font-bold font-sans"
                      >
                        Copy UPI ID
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Payer VPA Input */}
                      <div>
                        <label className="block text-[9px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1.5 font-medium">Your UPI ID (VPA)</label>
                        <input
                          id="payment-upi-id"
                          type="text"
                          name="upiId"
                          value={paymentForm.upiId}
                          onChange={(e) => setPaymentForm({ ...paymentForm, upiId: e.target.value })}
                          placeholder="e.g., sharmas@okhdfcbank"
                          className="w-full bg-white border border-[#1a6b5c]/20 rounded-sm py-2 px-3 text-xs text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] font-mono"
                        />
                        {errors.upiId && <span className="text-[10px] text-red-500 block mt-1">{errors.upiId}</span>}
                      </div>

                      {/* UTR Input */}
                      <div>
                        <label className="block text-[9px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1.5 font-medium">12-Digit UTR Number</label>
                        <input
                          id="payment-utr-number"
                          type="text"
                          name="utrNumber"
                          value={paymentForm.utrNumber}
                          onChange={(e) => setPaymentForm({ ...paymentForm, utrNumber: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                          placeholder="e.g., 314981765234"
                          maxLength={12}
                          className="w-full bg-white border border-[#1a6b5c]/20 rounded-sm py-2 px-3 text-xs text-[#0a0a0a] focus:outline-none focus:border-[#1a6b5c] font-mono"
                        />
                        {errors.utrNumber && <span className="text-[10px] text-red-500 block mt-1">{errors.utrNumber}</span>}
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="space-y-4 p-5 bg-[#f5f0eb]/50 border border-[#1a6b5c]/15 rounded-sm">
                    <div className="flex items-center space-x-2">
                      <Building size={16} className="text-[#1a6b5c]" />
                      <h4 className="text-xs uppercase font-mono tracking-wider text-[#0a0a0a] font-bold">Major Indian Banks Routing</h4>
                    </div>
                    <p className="text-[11px] text-[#666] leading-relaxed">
                      Secure checkout directly via your corporate or personal banking panel.
                    </p>
                    <div>
                      <label className="block text-[9px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1.5 font-medium">Select Indian Bank</label>
                      <select
                        id="payment-bank"
                        name="bankName"
                        value={paymentForm.bankName}
                        onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })}
                        className="w-full bg-white border border-[#1a6b5c]/20 rounded-sm py-2 px-3 text-xs text-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#1a6b5c]/30 pointer-events-auto cursor-pointer"
                      >
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="State Bank of India">State Bank of India (SBI)</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                        <option value="IndusInd Bank">IndusInd Bank</option>
                      </select>
                    </div>
                  </div>
                )}

                {paymentMethod === 'emi' && (
                  <div className="space-y-4 p-5 bg-[#f5f0eb]/50 border border-[#1a6b5c]/15 rounded-sm">
                    <div className="flex items-center space-x-2">
                      <Sparkles size={16} className="text-[#1a6b5c]" />
                      <h4 className="text-xs uppercase font-mono tracking-wider text-[#0a0a0a] font-bold">Atelier No-Cost EMI Financing</h4>
                    </div>
                    {total >= 50000 ? (
                      <div className="space-y-3">
                        <p className="text-[11px] text-[#666] leading-relaxed">
                          Your purchase of <strong>₹{total.toLocaleString('en-IN')}</strong> qualifies for our interest-free No-Cost EMI program. Select your bank below:
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[9.5px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1 font-medium">Select EMI Partner</label>
                            <select
                              id="payment-emi-bank"
                              name="emiBank"
                              value={paymentForm.emiBank}
                              onChange={(e) => setPaymentForm({ ...paymentForm, emiBank: e.target.value })}
                              className="w-full bg-white border border-[#1a6b5c]/20 rounded-sm py-2 px-2 text-xs text-[#0a0a0a] pointer-events-auto cursor-pointer"
                            >
                              <option value="HDFC Bank No-Cost EMI">HDFC Bank</option>
                              <option value="ICICI Bank No-Cost EMI">ICICI Bank</option>
                              <option value="SBI No-Cost EMI">SBI Card</option>
                              <option value="Axis Bank No-Cost EMI">Axis Bank</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[9.5px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1 font-medium">Repayment Period</label>
                            <select
                              id="payment-emi-period"
                              name="emiDuration"
                              value={paymentForm.emiDuration}
                              onChange={(e) => setPaymentForm({ ...paymentForm, emiDuration: e.target.value })}
                              className="w-full bg-white border border-[#1a6b5c]/20 rounded-sm py-2 px-2 text-xs text-[#0a0a0a] pointer-events-auto cursor-pointer font-mono"
                            >
                              <option value="3">3 Months (₹{Math.floor(total / 3).toLocaleString('en-IN')}/mo)</option>
                              <option value="6">6 Months (₹{Math.floor(total / 6).toLocaleString('en-IN')}/mo)</option>
                              <option value="9">9 Months (₹{Math.floor(total / 9).toLocaleString('en-IN')}/mo)</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-sm text-xs font-light">
                        No-Cost EMI plans are strictly calibrated for jewelry investments above <strong>₹50,000</strong>. Your order total (₹{total.toLocaleString('en-IN')}) requires a lower amount. Kindly add items to qualify, or select other premier methods.
                      </div>
                    )}
                    {errors.emiError && <p className="text-[11px] text-red-600 font-mono">{errors.emiError}</p>}
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="space-y-4 p-5 bg-[#f5f0eb]/50 border border-[#1a6b5c]/15 rounded-sm">
                    <div className="flex items-center space-x-2">
                      <Clock size={16} className="text-[#1a6b5c]" />
                      <h4 className="text-xs uppercase font-mono tracking-wider text-[#0a0a0a] font-bold">Cash on Delivery (COD) Inspection</h4>
                    </div>
                    {total <= 75000 ? (
                      <div className="space-y-2">
                        <p className="text-[11px] text-[#666] leading-relaxed">
                          Your order of <strong>₹{total.toLocaleString('en-IN')}</strong> qualifies for COD.
                        </p>
                        <p className="text-[10px] text-gray-500 font-light leading-normal">
                          LuxeLoom armored shipping team will verify the hallmark registry on-site. You can settle in cash or complete instant mobile UPI scanning up to ₹75,000.
                        </p>
                      </div>
                    ) : (
                      <div className="p-3 bg-red-50 border border-red-100 text-red-900 rounded-sm text-xs font-light">
                        For supreme transit security, Cash on Delivery is strictly capped at orders below <strong>₹75,000</strong>. Your order total reaches ₹{total.toLocaleString('en-IN')}. Please settle security credits via Bank Wire or VIP cards.
                      </div>
                    )}
                    {errors.codError && <p className="text-[11px] text-red-600 font-mono">{errors.codError}</p>}
                  </div>
                )}

                {paymentMethod === 'finance' && (
                  <div className="space-y-4 p-5 bg-[#f5f0eb]/50 border border-[#1a6b5c]/15 rounded-sm">
                    <div className="flex items-center space-x-2">
                      <Sparkles size={16} className="text-[#1a6b5c]" />
                      <h4 className="text-xs uppercase font-mono tracking-wider text-[#0a0a0a] font-bold">Premium FinTech Financing</h4>
                    </div>
                    <p className="text-[11px] text-[#666] leading-relaxed">
                      Settle your bill directly using registered Bajaj Finserv Insta EMI card credits or your active ZestMoney profile limits.
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[9px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1 font-medium">Financing Provider</label>
                        <select
                          id="payment-finance-provider"
                          name="financeProvider"
                          value={paymentForm.financeProvider}
                          onChange={(e) => setPaymentForm({ ...paymentForm, financeProvider: e.target.value })}
                          className="w-full bg-white border border-[#1a6b5c]/20 rounded-sm py-2 px-2 text-xs text-[#0a0a0a] pointer-events-auto cursor-pointer font-sans"
                        >
                          <option value="Bajaj Finserv">Bajaj Finserv</option>
                          <option value="ZestMoney">ZestMoney</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1 font-medium">Registered Mobile / Card No.</label>
                        <input
                          id="payment-finance-id"
                          type="text"
                          name="financeId"
                          value={paymentForm.financeId}
                          onChange={(e) => setPaymentForm({ ...paymentForm, financeId: e.target.value })}
                          placeholder="e.g., 98200XXXXX"
                          className="w-full bg-white border border-[#1a6b5c]/20 rounded-sm py-2 px-3 text-xs text-[#0a0a0a] font-mono"
                        />
                        {errors.financeId && <p className="text-[10px] text-red-500 mt-1">{errors.financeId}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Checkout action line */}
          <div className="flex items-center justify-between pt-6 border-t border-[#1a6b5c]/15">
            {step > 1 ? (
              <button
                id="checkout-step-back"
                onClick={() => setStep(step - 1)}
                className="text-xs uppercase tracking-widest font-mono text-gray-400 hover:text-[#0a0a0a] pointer-events-auto cursor-pointer"
              >
                &larr; Back to Shipping
              </button>
            ) : (
              <div />
            )}
            
            <button
              id="checkout-step-next"
              onClick={handleNextStep}
              className="bg-[#1a6b5c] hover:bg-[#1a6b5c]/85 text-white font-medium text-xs uppercase tracking-[0.2em] py-3.5 px-8 rounded-sm transition-all duration-300 hover:shadow-lg flex items-center space-x-1 pointer-events-auto cursor-pointer"
            >
              <span>{step === 2 ? 'Authorize Placement' : 'Continue to Payment'}</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Side: Cart Summary Breakdown */}
        <div className="lg:col-span-4 bg-[#f5f0eb] border border-[#1a6b5c]/20 rounded-sm p-6 space-y-6">
          <h3 className="font-serif text-sm font-semibold uppercase tracking-[0.2em] text-[#0a0a0a] pb-3 border-b border-[#1a6b5c]/15">
            Selected Vault items
          </h3>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 divide-y divide-[#1a6b5c]/10">
            {cart.map((item, idx) => (
              <div key={item.id} className={`flex items-start gap-3 ${idx > 0 ? 'pt-4' : ''}`}>
                <div className="w-12 h-15 bg-white border border-[#1a6b5c]/10 rounded-xs overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-xs font-semibold text-[#0a0a0a] line-clamp-1">{item.product.name}</h4>
                  <p className="text-[9px] uppercase text-[#666] font-mono mt-0.5">Finish: {item.selectedMetal}</p>
                  {item.selectedSize && <p className="text-[9px] uppercase text-[#666] font-mono">Size: {item.selectedSize} (IN)</p>}
                  <p className="text-[10px] text-[#666] font-mono font-medium mt-1">Qt: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-[#0a0a0a] font-mono">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing breakdowns */}
          <div className="space-y-2.5 pt-4 border-t border-[#1a6b5c]/15 text-xs font-mono font-light text-[#0a0a0a]">
            <div className="flex justify-between text-[#666]">
              <span>Atelier Items Total</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {appliedPromo && (
              <div className="flex justify-between text-[#1a6b5c] font-medium">
                <span>Atelier discount ({appliedPromo.code})</span>
                <span>-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-[#666]">
              <span>Estimated Jewellery GST (3%)</span>
              <span>₹{tax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between text-[#666]">
              <span>Hand-Insured Armed Courier</span>
              <span>Complimentary</span>
            </div>
            <div className="flex justify-between pt-3 border-t border-[#1a6b5c]/15 text-sm font-semibold text-[#0a0a0a] tracking-wide">
              <span>TOTAL OBLIGATION</span>
              <span className="text-[#1a6b5c] font-bold">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
            </div>
          </div>

          <div className="bg-white border border-[#1a6b5c]/10 rounded-xs p-3.5 flex items-start space-x-3">
            <ShieldCheck size={16} className="text-[#1a6b5c] mt-0.5 flex-shrink-0" />
            <p className="text-[9px] text-[#666] font-light leading-relaxed">
              <strong>Bespoke Quality Seal:</strong> Your transaction is protected with insured transport. Resizings and authenticity audits are covered in lifetime schedules under our Indian boutiques.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
