/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MobileCartSheetProps {
  isOpen: boolean;
  onClose: () => void;
  addedProduct: {
    id: string;
    name: string;
    image: string;
    selectedMetal: string;
    selectedSize?: string;
    price: number;
  } | null;
  onViewCart: () => void;
}

export default function MobileCartSheet({
  isOpen,
  onClose,
  addedProduct,
  onViewCart
}: MobileCartSheetProps) {
  const navigate = useNavigate();
  const [startY, setStartY] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startY === null) return;
    const endY = e.changedTouches[0].clientY;
    const diff = endY - startY;
    
    // Swipe down more than 80px = close the sheet
    if (diff > 80) {
      onClose();
    }
    setStartY(null);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Dark overlay */}
      <div
        id="mobile-cart-overlay"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 998,
          display: window.innerWidth < 768 ? 'block' : 'none'
        }}
      />

      {/* Bottom sheet */}
      <div
        id="mobile-cart-sheet"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '70vh',
          background: 'white',
          borderRadius: '20px 20px 0 0',
          zIndex: 999,
          padding: '0 20px 32px',
          display: window.innerWidth < 768 ? 'flex' : 'none',
          flexDirection: 'column',
          animation: 'slideUp 0.3s ease-out',
          overflowY: 'auto'
        }}
      >
        {/* Handle bar */}
        <div 
          id="mobile-cart-handle-bar"
          style={{
            width: '40px',
            height: '4px',
            background: '#ddd',
            borderRadius: '2px',
            margin: '12px auto 20px',
            flexShrink: 0
          }} 
        />

        {/* Added confirmation */}
        <div 
          id="mobile-cart-confirmation-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            flexShrink: 0
          }}
        >
          <div 
            id="mobile-cart-checkmark"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#1a6b5c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              flexShrink: 0
            }}
          >
            ✓
          </div>
          <span 
            id="mobile-cart-added-title"
            style={{
              fontSize: '16px',
              fontWeight: '500',
              color: '#0a0a0a'
            }}
          >
            Added to Cart
          </span>
        </div>

        {/* Product info */}
        <div 
          id="mobile-cart-product-container"
          style={{
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            padding: '16px',
            background: '#f9f9f7',
            borderRadius: '10px',
            marginBottom: '20px',
            flexShrink: 0
          }}
        >
          <img
            id="mobile-cart-product-image"
            src={addedProduct?.image}
            alt={addedProduct?.name}
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'cover',
              borderRadius: '8px',
              flexShrink: 0
            }}
          />
          <div>
            <p 
              id="mobile-cart-product-name"
              style={{
                fontWeight: '500',
                fontSize: '14px',
                color: '#0a0a0a',
                margin: '0 0 4px',
                textAlign: 'left'
              }}
            >
              {addedProduct?.name}
            </p>
            <p 
              id="mobile-cart-product-metal"
              style={{
                fontSize: '12px',
                color: '#888',
                margin: '0 0 4px',
                textAlign: 'left'
              }}
            >
              {addedProduct?.selectedMetal}
              {addedProduct?.selectedSize ? ` / Size ${addedProduct.selectedSize}` : ''}
            </p>
            <p 
              id="mobile-cart-product-price"
              style={{
                fontSize: '15px',
                fontWeight: '500',
                color: '#1a6b5c',
                margin: 0,
                textAlign: 'left'
              }}
            >
              ₹{addedProduct?.price?.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Buttons */}
        <div 
          id="mobile-cart-buttons-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            flexShrink: 0
          }}
        >
          <button
            id="mobile-cart-view-cart-btn"
            onClick={() => {
              onClose();
              navigate('/cart');
            }}
            style={{
              width: '100%',
              padding: '16px',
              background: '#1a6b5c',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              letterSpacing: '1px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            VIEW CART
          </button>

          <button
            id="mobile-cart-continue-shopping-btn"
            onClick={onClose}
            style={{
              width: '100%',
              padding: '16px',
              background: 'transparent',
              color: '#1a6b5c',
              border: '1px solid #1a6b5c',
              borderRadius: '8px',
              fontSize: '14px',
              letterSpacing: '1px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            CONTINUE SHOPPING
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
