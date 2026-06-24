/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShieldCheck, Tag, Gift, ChevronLeft } from 'lucide-react';
import { CartItem, PromoCode } from '../types';
import { PROMO_CODES } from '../data';

interface CartPageProps {
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: (appliedPromo: PromoCode | null) => void;
  user: any;
}

export default function CartPage({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  user
}: CartPageProps) {
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');

  // Compute pricing totals (in INR)
  const subtotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.discountType === 'percentage') {
      discount = (subtotal * appliedPromo.value) / 100;
    } else {
      discount = appliedPromo.value;
    }
  }

  // Cap discount at subtotal
  discount = Math.min(discount, subtotal);
  const estimatedTax = (subtotal - discount) * 0.03; // Correct 3% jewelry GST in India!
  const shipping = 0; // Complimentary VIP Shipping for all Indian luxury orders
  const total = subtotal - discount + estimatedTax + shipping;

  const hasUnavailableItems = cart.some(item => !item.product.inStock);

  const handleApplyPromo = () => {
    setPromoError('');
    if (!promoInput.trim()) return;

    const matched = PROMO_CODES.find(
      (p) => p.code.toUpperCase() === promoInput.toUpperCase().trim()
    );

    if (matched) {
      setAppliedPromo(matched);
      setPromoInput('');
    } else {
      setPromoError('Atelier promo invalid or expired.');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  const handleCheckoutClick = () => {
    if (cart.length === 0) return;
    if (!user) {
      sessionStorage.setItem('returnAfterLogin', '/checkout');
      navigate('/login');
      return;
    }
    onProceedToCheckout(appliedPromo);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 select-none text-[#0a0a0a]">
      {/* Back button link */}
      <button
        onClick={() => navigate('/')}
        className="inline-flex items-center space-x-2 text-xs uppercase tracking-widest text-[#1a6b5c]/80 hover:text-[#1a6b5c] mb-8 transition-colors duration-200 pointer-events-auto cursor-pointer"
      >
        <ChevronLeft size={14} />
        <span>Back to Boutique Collections</span>
      </button>

      <h1 className="font-serif text-3xl font-light tracking-wide text-[#0a0a0a] mb-8">
        Your Vault Bag
      </h1>

      {cart.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center space-y-6 bg-[#f5f0eb] border border-[#1a6b5c]/10 rounded-sm">
          <Gift size={48} className="text-[#1a6b5c] animate-pulse" />
          <p className="font-serif text-lg text-[#0a0a0a] font-light">Your shopping vault bag is empty.</p>
          <p className="text-sm text-[#666] max-w-sm font-light leading-relaxed">
            Browse our Indian e-Boutique and select custom metals or sizes to showcase traditional elegance.
          </p>
          <button
            onClick={() => navigate('/')}
            className="border border-[#1a6b5c] hover:bg-[#1a6b5c]/5 text-[#1a6b5c] text-xs uppercase tracking-widest py-3.5 px-8 rounded-sm mt-4 transition-colors duration-300 pointer-events-auto cursor-pointer font-medium"
          >
            Continue Browsing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart items list section (Left / 7 cols) */}
          <div className="lg:col-span-7 space-y-6 bg-white border border-[#1a6b5c]/10 p-6 rounded-sm">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0a0a0a] pb-4 border-b border-[#1a6b5c]/10">
              Registered Pieces ({cart.length})
            </h2>

            <div className="divide-y divide-[#1a6b5c]/10">
              {cart.map((item, idx) => (
                <div key={item.id} className={`flex items-start gap-4 ${idx > 0 ? 'pt-6' : ''} ${idx < cart.length - 1 ? 'pb-6' : ''}`}>
                  {/* Thumbnail Image */}
                  <div className="w-20 h-24 bg-[#f5f0eb] border border-[#1a6b5c]/10 rounded-xs overflow-hidden flex-shrink-0 select-none">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details section */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base font-medium text-[#0a0a0a]">
                      {item.product.name}
                    </h3>
                    
                    {!item.product.inStock && (
                      <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-[10px] font-mono font-medium rounded-full bg-red-50 text-red-700 border border-red-200 mt-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block shrink-0 animate-pulse" />
                        <span>Item no longer available</span>
                      </div>
                    )}

                    <p className="text-xs tracking-wider text-[#666] font-mono mt-1.5">
                      Finish: <span className="font-semibold text-stone-800">{item.selectedMetal}</span>
                    </p>
                    {item.selectedSize && (
                      <p className="text-xs tracking-wider text-[#666] font-mono mt-0.5">
                        Size: <span className="font-semibold text-stone-800">{item.selectedSize} (IN)</span>
                      </p>
                    )}
                    {item.engraving && (
                      <p className="text-xs italic text-[#1a6b5c] font-light mt-1.5 border-l-2 border-[#1a6b5c]/30 pl-2">
                        Engraved: &ldquo;{item.engraving}&rdquo;
                      </p>
                    )}

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border border-[#1a6b5c]/20 rounded-xs overflow-hidden bg-[#f5f0eb] select-none">
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 px-3 text-[#666] hover:text-[#0a0a0a] hover:bg-white transition-colors pointer-events-auto cursor-pointer"
                        >
                          <Minus size={10} />
                        </button>
                        <span className="px-3 text-xs text-[#0a0a0a] font-mono font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 px-3 text-[#666] hover:text-[#0a0a0a] hover:bg-white transition-colors pointer-events-auto cursor-pointer"
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-[#999] hover:text-red-500 p-1.5 pointer-events-auto cursor-pointer transition-colors"
                        title="Remove from Bag"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Pricing Column */}
                  <div className="text-right flex-shrink-0">
                    <span className="text-sm font-semibold text-[#0a0a0a] font-mono tracking-wider">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing summary cards (Right / 5 cols) */}
          <div className="lg:col-span-5 bg-[#f5f0eb] border border-[#1a6b5c]/15 p-6 rounded-sm space-y-6">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0a0a0a] pb-4 border-b border-[#1a6b5c]/15">
              Luxury Order Summary
            </h2>

            {/* Vintage style promo code input */}
            <div className="space-y-2">
              <label htmlFor="promo-code-input" className="text-[10px] uppercase font-mono tracking-widest text-[#666]">
                Atelier Promo / Gift Voucher
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={12} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="promo-code-input"
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="e.g., GOLDENGIFT"
                    className="w-full bg-white border border-[#1a6b5c]/20 text-xs rounded-sm pl-9 pr-3 py-2.5 text-[#0a0a0a] placeholder-gray-400 focus:outline-none focus:border-[#1a6b5c] uppercase"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="bg-[#0a0a0a] hover:bg-[#1a6b5c] text-white hover:text-white font-medium text-xs tracking-widest uppercase px-5 py-2.5 rounded-sm transition-colors duration-300 pointer-events-auto cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <p className="text-[10px] text-red-500 font-light mt-1 pl-1">
                  {promoError}
                </p>
              )}
              {appliedPromo && (
                <div className="flex items-center justify-between bg-[#1a6b5c]/5 border border-[#1a6b5c]/20 rounded-xs px-3 py-2 mt-2">
                  <span className="text-[10px] font-mono font-medium text-[#1a6b5c] flex items-center space-x-1.5">
                    <Tag size={10} />
                    <span>PROMO APPLIED: {appliedPromo.code} ({appliedPromo.discountType === 'percentage' ? `${appliedPromo.value}% off` : `₹${appliedPromo.value.toLocaleString('en-IN')} off`})</span>
                  </span>
                  <button
                    onClick={handleRemovePromo}
                    className="text-[#999] hover:text-[#0a0a0a] text-[10px] font-bold tracking-widest uppercase"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Pricing details table */}
            <div className="space-y-2.5 pt-4 border-t border-[#1a6b5c]/15 text-xs font-light font-mono">
              <div className="flex justify-between text-[#666]">
                <span>Atelier Gems subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-[#1a6b5c] font-medium">
                  <span>Atelier deduction</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-[#666]">
                <span>Estimated Jewellery GST (3%)</span>
                <span>₹{estimatedTax.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between text-[#666]">
                <span>Atelier Hand-Insured Shipping</span>
                <span>Complimentary</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#0a0a0a] pt-3 border-t border-[#1a6b5c]/10 tracking-wide">
                <span className="uppercase font-serif">Total Obligation</span>
                <span className="text-[#1a6b5c] font-bold">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 0 })} INR</span>
              </div>
            </div>

            {/* Checkout action buttons */}
            {hasUnavailableItems ? (
              <div className="space-y-3">
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs text-center font-mono font-medium rounded-sm">
                  Please remove unavailable items to continue
                </div>
                <button
                  disabled
                  className="w-full bg-neutral-200 text-neutral-400 border border-neutral-300 font-medium text-xs uppercase tracking-[0.2em] py-4 rounded-sm flex items-center justify-center space-x-2 cursor-not-allowed"
                >
                  <ShieldCheck size={14} />
                  <span>Proceed to Secure Checkout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={handleCheckoutClick}
                className="w-full bg-[#1a6b5c] hover:bg-[#1a6b5c]/85 text-white font-medium text-xs uppercase tracking-[0.2em] py-4 rounded-sm transition-colors duration-300 shadow-xl flex items-center justify-center space-x-2 pointer-events-auto cursor-pointer"
              >
                <ShieldCheck size={14} />
                <span>{user ? 'Proceed to Secure Checkout' : 'Login to Checkout'}</span>
              </button>
            )}

            <p className="text-[9px] text-center text-[#999] max-w-xs mx-auto leading-normal font-mono pt-2">
              Payments are encrypted via the LuxeLoom secure Indian gateway. We accept international Amex, major credit cards, UPI, and bank wires.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
