/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShieldCheck, Tag, Gift } from 'lucide-react';
import { CartItem, PromoCode } from '../types';
import { PROMO_CODES } from '../data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (cartItemId: string, quantity: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: (appliedPromo: PromoCode | null) => void;
  user: any;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  user
}: CartDrawerProps) {
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');

  if (!isOpen) return null;

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
  const shipping = 0; // Complimentry VIP Shipping for all Indian luxury orders
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
      // Trigger pathname popstate event to let App routing intercept
      window.history.pushState(null, '', '/login');
      window.dispatchEvent(new PopStateEvent('popstate'));
      onClose();
      return;
    }
    onProceedToCheckout(appliedPromo);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div id="cart-drawer-panel" className="w-screen max-w-md bg-white border-l border-[#1a6b5c]/20 flex flex-col shadow-2xl h-full text-[#0a0a0a]">
          {/* Cart Header */}
          <div className="p-6 border-b border-[#1a6b5c]/20 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0a0a0a] flex items-center space-x-2">
              <span>Your Vault Bag</span>
              <span className="text-[10px] text-[#999] font-mono">({cart.length} unique)</span>
            </h2>
            <button
              id="close-cart-drawer"
              onClick={onClose}
              className="text-[#0a0a0a]/70 hover:text-[#1a6b5c] p-2 pointer-events-auto cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Cart Empty State */}
          {cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-[#f5f0eb]">
              <Gift size={36} className="text-[#1a6b5c] animate-pulse" />
              <p className="font-serif text-base text-[#0a0a0a] font-light">Your shopping vault bag is empty.</p>
              <p className="text-xs text-[#666] max-w-xs font-light">
                Browse our Indian e-Boutique and select custom metals or sizes to showcase traditional elegance.
              </p>
              <button
                id="cart-back-to-shop"
                onClick={onClose}
                className="border border-[#1a6b5c] hover:bg-[#1a6b5c]/5 text-[#1a6b5c] text-xs uppercase tracking-widest py-3 px-6 rounded-xs mt-2 transition-colors duration-300 pointer-events-auto cursor-pointer font-medium"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            <>
              {/* Cart List Items scrollable */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 divide-y divide-[#1a6b5c]/10 bg-white">
                {cart.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-4 ${idx > 0 ? 'pt-6' : ''}`}
                  >
                    {/* Item Thumbnail */}
                    <div className="w-16 h-20 bg-[#f5f0eb] border border-[#1a6b5c]/10 rounded-xs overflow-hidden flex-shrink-0 select-none">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-sm font-medium text-[#0a0a0a] line-clamp-1">
                        {item.product.name}
                      </h4>
                      {/* Red warning badge for out of stock item */}
                      {!item.product.inStock && (
                        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 text-[10px] font-mono font-medium rounded-full bg-red-50 text-red-700 border border-red-200 mt-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block shrink-0 animate-pulse" />
                          <span>Item no longer available</span>
                        </div>
                      )}
                      <p className="text-[10px] uppercase tracking-wider text-[#666] font-mono mt-1">
                        Finish: {item.selectedMetal}
                      </p>
                      {item.selectedSize && (
                        <p className="text-[10px] uppercase tracking-wider text-[#666] font-mono mt-0.5">
                          Size: {item.selectedSize} (IN)
                        </p>
                      )}
                      {item.engraving && (
                        <p className="text-[10px] italic text-[#1a6b5c] font-light mt-1 border-l border-[#1a6b5c]/30 pl-2">
                          Engraved: &ldquo;{item.engraving}&rdquo;
                        </p>
                      )}

                      {/* Quantity Controls and Remove button */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-[#1a6b5c]/20 rounded-xs overflow-hidden bg-[#f5f0eb] select-none">
                          <button
                            id={`qty-dec-${item.id}`}
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-2.5 text-[#666] hover:text-[#0a0a0a] hover:bg-white transition-colors pointer-events-auto cursor-pointer"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="px-3 text-xs text-[#0a0a0a] font-mono font-medium">
                            {item.quantity}
                          </span>
                          <button
                            id={`qty-inc-${item.id}`}
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-2.5 text-[#666] hover:text-[#0a0a0a] hover:bg-white transition-colors pointer-events-auto cursor-pointer"
                          >
                            <Plus size={10} />
                          </button>
                        </div>

                        <button
                          id={`remove-item-${item.id}`}
                          onClick={() => onRemoveItem(item.id)}
                          className="text-[#999] hover:text-red-500 p-1 pointer-events-auto cursor-pointer transition-colors"
                          title="Remove from Bag"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Cost right side */}
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-semibold text-[#0a0a0a] font-mono tracking-wider">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Luxury Checkout Summary sheet */}
              <div className="bg-[#f5f0eb] border-t border-[#1a6b5c]/20 p-6 space-y-4">
                {/* Vintage promo input line */}
                <div className="space-y-1.5">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#999]">
                    Atelier Promo or Gift Voucher
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Tag size={12} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        id="promo-code-input"
                        type="text"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value)}
                        placeholder="e.g., GOLDENGIFT"
                        className="w-full bg-white border border-[#1a6b5c]/20 text-xs rounded-sm pl-9 pr-3 py-2 text-[#0a0a0a] placeholder-gray-400 focus:outline-none focus:border-[#1a6b5c] uppercase"
                      />
                    </div>
                    <button
                      id="apply-promo-button"
                      onClick={handleApplyPromo}
                      className="bg-[#0a0a0a] hover:bg-[#1a6b5c] text-white hover:text-white font-medium text-xs tracking-widest uppercase px-4 py-2 rounded-sm transition-colors duration-300 pointer-events-auto cursor-pointer"
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
                    <div className="flex items-center justify-between bg-[#1a6b5c]/5 border border-[#1a6b5c]/20 rounded-xs px-3 py-1.5 mt-1.5">
                      <span className="text-[10px] font-mono font-medium text-[#1a6b5c] flex items-center space-x-1.5">
                        <Tag size={10} />
                        <span>PROMO APPLIED: {appliedPromo.code} ({appliedPromo.discountType === 'percentage' ? `${appliedPromo.value}% off` : `₹${appliedPromo.value.toLocaleString('en-IN')} off`})</span>
                      </span>
                      <button
                        id="remove-promo-pill"
                        onClick={handleRemovePromo}
                        className="text-[#999] hover:text-[#0a0a0a] text-[10px] font-bold tracking-widest uppercase"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Pricing breakdowns */}
                <div className="space-y-2 pt-2 border-t border-[#1a6b5c]/20 text-xs font-light font-mono select-none">
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
                  <div className="flex justify-between text-sm font-semibold text-[#0a0a0a] pt-2 border-t border-[#1a6b5c]/10 tracking-wide">
                    <span className="uppercase font-serif">Total Obligation</span>
                    <span className="text-[#1a6b5c] font-bold">₹{total.toLocaleString('en-IN', { minimumFractionDigits: 0 })} INR</span>
                  </div>
                </div>

                {/* Secure Checkout and Guarantees */}
                {hasUnavailableItems ? (
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs text-center font-mono font-medium rounded-sm">
                      Please remove unavailable items to continue
                    </div>
                    <button
                      id="cart-proceed-checkout"
                      disabled
                      className="w-full bg-neutral-200 text-neutral-400 border border-neutral-300 font-medium text-xs uppercase tracking-[0.2em] py-4 rounded-sm flex items-center justify-center space-x-2 cursor-not-allowed"
                    >
                      <ShieldCheck size={14} />
                      <span>Proceed to Secure Checkout</span>
                    </button>
                  </div>
                ) : (
                  <button
                    id="cart-proceed-checkout"
                    onClick={handleCheckoutClick}
                    className="w-full bg-[#1a6b5c] hover:bg-[#1a6b5c]/85 text-white font-medium text-xs uppercase tracking-[0.2em] py-4 rounded-sm transition-colors duration-300 shadow-xl flex items-center justify-center space-x-2 pointer-events-auto cursor-pointer"
                  >
                    <ShieldCheck size={14} />
                    <span>{user ? 'Proceed to Secure Checkout' : 'Login to Checkout'}</span>
                  </button>
                )}

                <p className="text-[9px] text-center text-[#999] max-w-xs mx-auto leading-normal font-mono">
                  Payments are encrypted via the LuxeLoom secure Indian gateway. We accept international Amex, major credit cards, UPI, and bank wires.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
