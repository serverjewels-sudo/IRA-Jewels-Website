/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  key?: any;
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export default function ProductCard({
  product,
  onSelect,
  onAddToCart,
  isWishlisted,
  onToggleWishlist
}: ProductCardProps) {
  const [imgFailed, setImgFailed] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  // Helper to get EXACT badge text from step 3 table
  const getBadgeText = (prod: Product) => {
    switch (prod.id) {
      case 'ananya-solitaire-diamond-ring':
        return 'BESTSELLER';
      case 'meera-ruby-cocktail-ring':
        return 'NEW ARRIVAL';
      case 'sona-gold-jhumka-drops':
        return 'BESTSELLER';
      case 'tara-diamond-chandbali':
        return 'LIMITED EDITION';
      case 'pari-diamond-solitaire-pendant':
        return 'NEW ARRIVAL';
      case 'noor-emerald-drop-pendant':
        return 'BESTSELLER';
      case 'rani-plain-gold-haar':
        return 'HALLMARK CERTIFIED';
      case 'devika-simple-gold-chain':
        return 'BESTSELLER';
      case 'puja-22k-gold-bangle-set':
        return 'HALLMARK CERTIFIED';
      case 'suvarni-diamond-bangle-pair':
        return 'LIMITED EDITION';
      case 'shakti-diamond-tennis-bracelet':
        return 'BESTSELLER';
      case 'amara-sapphire-gold-bracelet':
        return 'NEW ARRIVAL';
      case 'bindiya-diamond-nosepin':
        return 'BESTSELLER';
      case 'aarti-pearl-nath-nosepin':
        return 'NEW ARRIVAL';
      default:
        return 'HALLMARK CERTIFIED';
    }
  };

  const badgeText = getBadgeText(product);

  // Helper to determine exact badge coloring rules
  const getBadgeClass = (text: string) => {
    switch (text) {
      case 'BESTSELLER':
        return 'bg-[#0a0a0a] text-white font-mono border border-zinc-900';
      case 'NEW ARRIVAL':
        return 'bg-[#1a6b5c] text-white font-mono border border-[#1a6b5c]';
      case 'LIMITED EDITION':
        return 'bg-[#d4af37] text-white font-mono border border-[#d4af37]';
      case 'HALLMARK CERTIFIED':
        return 'bg-[#1a6b5c]/10 text-[#1a6b5c] font-sans font-semibold border border-[#1a6b5c]/25';
      default:
        return 'bg-zinc-800 text-white font-mono';
    }
  };

  const badgeClass = getBadgeClass(badgeText);

  return (
    <div 
      id={`product-card-${product.id}`}
      className="product-card group relative flex flex-col bg-white border border-neutral-100 hover:border-[#1a6b5c]/35 rounded-lg overflow-hidden transition-all duration-500 hover:shadow-xl w-full text-[#0a0a0a] h-full"
    >
      <div 
        className="product-image-wrapper relative overflow-hidden aspect-square h-auto cursor-pointer"
        onClick={() => onSelect(product)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ height: '320px' }} // Fallback if css load is delayed
      >
        <img 
          src={isHovered && product.images && product.images.length > 1 && product.images[1] ? product.images[1] : product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-all duration-500 transform group-hover:scale-105"
          style={{
            transition: 'opacity 0.4s ease, transform 0.5s ease'
          }}
          onError={(e) => {
            setImgFailed(true);
            const target = e.currentTarget;
            target.style.background = '#1a6b5c'; 
            target.src = '';
          }}
        />
        <span className={`product-badge absolute top-3 left-3 z-10 text-[9px] uppercase tracking-widest px-2.5 py-1.5 rounded-sm shadow-sm select-none pointer-events-none ${badgeClass}`}>
          {badgeText}
        </span>
      </div>

      <div className="product-info p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white text-left">
        <div className="space-y-1.5">
          <span className="product-category text-[10px] text-neutral-400 font-mono tracking-widest uppercase block select-none">
            {product.category}
          </span>
          <h3 
            className="product-name font-serif text-sm sm:text-base font-semibold text-[#0a0a0a] group-hover:text-[#1a6b5c] transition-colors duration-300 line-clamp-1 cursor-pointer font-medium"
            onClick={() => onSelect(product)}
          >
            {product.name}
          </h3>
          <div className="product-rating text-[#1a6b5c] select-none text-[10px] sm:text-xs tracking-wider flex items-center space-x-1 font-sans">
            <span>★★★★★</span>
            <span className="text-neutral-400 font-mono text-[9px]">({product.reviewsCount})</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-[#1a6b5c]/10">
          <div className="product-price text-base sm:text-lg font-bold text-[#1a6b5c] font-mono flex items-baseline justify-between">
            <span>₹{product.price.toLocaleString('en-IN')}</span>
            <small className="text-[10px] text-neutral-400 font-sans font-light select-none">
              Incl. 3% GST
            </small>
          </div>

          <div className="product-actions grid grid-cols-2 gap-2.5 mt-4 select-none">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleWishlist(product);
              }}
              className={`btn-wishlist px-3 py-2.5 rounded text-[11px] font-mono tracking-wider uppercase border transition-all duration-300 pointer-events-auto cursor-pointer ${
                isWishlisted
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100/70'
                  : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              {isWishlisted ? '❤️ Wish' : '♡ Wishlist'}
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="btn-cart bg-[#1a6b5c] text-white border border-[#1a6b5c] hover:bg-[#1a6b5c]/90 px-3 py-2.5 rounded text-[11px] font-mono tracking-wider uppercase font-semibold transition-all duration-300 shadow-xs hover:shadow-md pointer-events-auto cursor-pointer"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
