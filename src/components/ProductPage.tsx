/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingBag, Heart, BadgeCheck } from 'lucide-react';
import { Product } from '../types';
import { METALS } from '../data';
import ProductCard from './ProductCard';

interface ProductPageProps {
  products: Product[];
  onAddToCart: (product: Product, options?: { metal: string; size?: string; engraving?: string }) => Promise<boolean> | any;
  wishlist: Product[];
  onAddToWishlist: (product: Product) => void;
  onRemoveFromWishlist: (product: Product) => void;
}

export default function ProductPage({
  products,
  onAddToCart,
  wishlist,
  onAddToWishlist,
  onRemoveFromWishlist
}: ProductPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const product = products.find((p) => p.id === id);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  // If loading or not found
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="font-serif text-2xl font-light text-[#0a0a0a]">Masterpiece Not Found</h2>
        <p className="text-xs text-neutral-500 font-mono">Reference reference ID: {id}</p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 bg-[#1a6b5c] text-white py-3 px-6 text-xs uppercase tracking-widest font-mono rounded-sm cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Return to Boutique</span>
        </button>
      </div>
    );
  }

  const [selectedMetal, setSelectedMetal] = useState(product.options.metals[0]);
  const [selectedSize, setSelectedSize] = useState(product.options.sizes?.[0] || '');
  const [selectedImage, setSelectedImage] = useState(product.image);
  const [engravingText, setEngravingText] = useState('');
  const [activeAccordion, setActiveAccordion] = useState<'materials' | 'crafting' | 'care'>('materials');
  const [successAnimation, setSuccessAnimation] = useState(false);

  // Sync selected image if the product changed
  useEffect(() => {
    setSelectedMetal(product.options.metals[0]);
    setSelectedSize(product.options.sizes?.[0] || '');
    setSelectedImage(product.image);
    setEngravingText('');
  }, [product]);

  const metalDetails = product.options.metals.map((mName) => {
    const found = METALS.find((m) => m.name === mName);
    return {
      name: mName,
      colorClass: found ? found.colorClass : 'bg-[#EAEAEA]'
    };
  });

  const handleAddToBag = async () => {
    const success = await onAddToCart(product, {
      metal: selectedMetal,
      size: selectedSize || undefined,
      engraving: engravingText.trim() || undefined
    });
    if (success !== false) {
      setSuccessAnimation(true);
      setTimeout(() => {
        setSuccessAnimation(false);
      }, 1200);
    }
  };

  const isWish = wishlist.some((item) => item.id === product.id);

  // Related products from same category & distinct ID
  const relatedProducts = products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-12 select-none text-[#0a0a0a] pb-24 md:pb-12">
      
      {/* Dynamic Animated Success Stamp */}
      {successAnimation && (
        <div className="fixed inset-0 bg-[#f5f0eb]/95 z-50 flex flex-col items-center justify-center space-y-4 animate-fade-in">
          <span className="w-16 h-16 rounded-full bg-[#1a6b5c] flex items-center justify-center text-white shadow-xl">
            <BadgeCheck size={36} />
          </span>
          <p className="font-serif text-[#1a6b5c] text-xl font-medium uppercase tracking-[0.15em]">
            Placed in Vault Bag
          </p>
          <p className="text-xs text-[#666]">Your selection is prepared with security.</p>
        </div>
      )}

      {/* Back button */}
      <div>
        <button
          onClick={() => {
            if (window.history.length > 2) {
              navigate(-1);
            } else {
              navigate('/');
            }
          }}
          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-mono tracking-[0.25em] text-[#1a6b5c] uppercase hover:underline hover:opacity-80 transition-all pointer-events-auto cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span className="hidden md:inline">Back to Collections</span>
          <span className="md:hidden">Back</span>
        </button>
      </div>

      {/* Main split grid: Left 55% image side, Right details side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Part: Images gallery (55% or lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Image */}
          <div 
            className="w-full overflow-hidden bg-[#f5f0eb] border border-[#1a6b5c]/10 relative shadow-xs" 
            style={{
              borderRadius: '12px',
            }}
          >
            <img
              src={selectedImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full object-cover main-image-height"
              style={{
                transition: 'opacity 0.3s ease',
              }}
            />
            {product.bestseller && (
              <span className="absolute top-4 left-4 bg-[#0a0a0a] text-white text-[9px] font-mono font-bold uppercase tracking-widest px-3 py-1">
                Atelier Bestseller
              </span>
            )}
          </div>

          {/* Thumbnail Carousel Row */}
          {product.images && product.images.length > 0 && (
            <div className="thumbnail-container md:grid md:grid-cols-2 md:gap-3 md:w-44 md:mt-3">
              {product.images.slice(0, 4).map((imgUrl, index) => {
                const isSelected = selectedImage === imgUrl;
                return (
                  <div
                    key={index}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={`thumbnail-item ${isSelected ? 'border-active' : ''}`}
                  >
                    <img src={imgUrl} alt={`View ${index + 1}`} referrerPolicy="no-referrer" />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Part: Selectors & Actions (45% or lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <div>
            {/* Category */}
            <p className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#999] mb-1">
              HAUTE JOAILLERIE • {product.category}
            </p>
            
            {/* Title */}
            <h2 className="font-serif text-2xl md:text-3.5xl font-light text-[#0a0a0a] tracking-wide mb-2 leading-tight">
              {product.name}
            </h2>

            {/* Reviews Grade */}
            <div className="flex items-center space-x-2 select-none">
              <div className="flex text-[#1a6b5c]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                    className={i < Math.floor(product.rating) ? 'text-[#1a6b5c]' : 'text-zinc-200'}
                  />
                ))}
              </div>
              <span className="text-[10px] text-[#999] font-mono">({product.rating.toFixed(2)} based on {product.reviewsCount} reviews)</span>
            </div>
          </div>

          {/* Price Valuation */}
          <div className="border-t border-b border-[#1a6b5c]/20 py-3.5 flex justify-between items-center bg-[#f5f0eb]/50 px-4 rounded-xs select-none">
            <span className="text-[#666] text-xs font-mono">Estimated Valuation</span>
            <div className="text-right flex flex-col items-end">
              <span className="font-mono text-xl font-bold text-[#1a6b5c] tracking-wider">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-[#999] font-sans tracking-tight block mt-0.5">
                Inclusive of 3% GST
              </span>
            </div>
          </div>

          {/* Editorial Description */}
          <p className="text-[#333] text-xs sm:text-sm font-light leading-relaxed tracking-wide">
            {product.description}
          </p>

          {/* Custom metal elements */}
          <div className="space-y-5">
            <div>
              <span className="block text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-2.5 font-semibold">
                Select Precious Metal Finish
              </span>
              <div className="flex flex-wrap gap-2.5">
                {metalDetails.map((metalObj) => (
                  <button
                    key={metalObj.name}
                    onClick={() => setSelectedMetal(metalObj.name)}
                    className={`flex items-center space-x-2 border rounded-sm px-3 py-1.5 transition-all duration-300 pointer-events-auto cursor-pointer ${
                      selectedMetal === metalObj.name
                        ? 'border-[#1a6b5c] bg-[#1a6b5c]/5 text-[#1a6b5c] font-medium'
                        : 'border-[#1a6b5c]/20 hover:border-[#1a6b5c] text-[#666] hover:text-[#0a0a0a]'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full border border-black/20 ${metalObj.colorClass}`} />
                    <span className="text-[10px] sm:text-[11px] font-mono tracking-wider">{metalObj.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ring sizing controls if category === Rings */}
            {product.options.sizes && (
              <div>
                <div className="flex justify-between text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-2.5 font-semibold">
                  <span>Select Ring Size (Indian Standard)</span>
                  <button
                    onClick={(e) => { e.preventDefault(); alert("LuxeLoom sizing matches standard Indian Ring Scales. We ship a complimentary ring sizer on request to guarantee perfect precision."); }}
                    className="text-[#999] hover:text-[#1a6b5c] underline font-normal cursor-pointer"
                  >
                    Atelier Sizing Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 select-none">
                  {product.options.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`w-10 h-10 border rounded-xs flex items-center justify-center transition-all duration-300 text-xs font-mono pointer-events-auto cursor-pointer ${
                        selectedSize === sz
                          ? 'border-[#1a6b5c] bg-[#1a6b5c]/5 text-[#1a6b5c] font-bold'
                          : 'border-[#1a6b5c]/20 hover:border-[#1a6b5c] text-[#666]'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Custom Engraving */}
            <div>
              <label className="block text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-1.5 flex items-center justify-between font-semibold">
                <span>Custom Hand Engraving (Complementary)</span>
                <span className="text-[9px] text-[#999] lowercase font-mono">({30 - engravingText.length} caps left)</span>
              </label>
              <input
                type="text"
                maxLength={30}
                value={engravingText}
                onChange={(e) => setEngravingText(e.target.value.toUpperCase())}
                placeholder="e.g., ABHISHEK & MEERA FOREVER"
                className="w-full bg-[#f5f0eb] border border-[#1a6b5c]/20 py-2.5 px-3 text-xs uppercase font-mono text-[#0a0a0a] placeholder-gray-400 focus:outline-none focus:border-[#1a6b5c] rounded-sm"
              />
            </div>
          </div>

          {/* Place in Bag CTA - Desktop layout buttons */}
          <div className="hidden md:grid grid-cols-2 gap-3 pt-2 select-none">
            {product.inStock ? (
              <button
                onClick={handleAddToBag}
                className="bg-[#1a6b5c] hover:bg-[#1a6b5c]/85 text-white font-medium text-xs uppercase tracking-[0.2em] py-4 rounded-sm transition-colors duration-300 flex items-center justify-center space-x-2.5 pointer-events-auto cursor-pointer"
              >
                <ShoppingBag size={14} />
                <span>Add to Cart</span>
              </button>
            ) : (
              <button
                disabled
                className="bg-neutral-200 text-neutral-400 border border-neutral-300 font-medium text-xs uppercase tracking-[0.2em] py-4 rounded-sm flex items-center justify-center space-x-2.5 cursor-not-allowed"
              >
                <ShoppingBag size={14} />
                <span>Out of Stock</span>
              </button>
            )}

            <button
              onClick={() => isWish ? onRemoveFromWishlist(product) : onAddToWishlist(product)}
              className={`px-3 py-4 rounded text-xs font-mono tracking-wider uppercase border transition-all duration-300 pointer-events-auto cursor-pointer flex items-center justify-center space-x-1.5 ${
                isWish
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100/70'
                  : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <Heart size={14} fill={isWish ? 'currentColor' : 'none'} className={isWish ? 'text-red-500' : ''} />
              <span>{isWish ? 'Wishlisted' : 'Add to Wishlist'}</span>
            </button>
          </div>

          {/* Out of Stock warning text if not inStock */}
          {!product.inStock && (
            <p className="text-red-600 text-xs font-mono font-medium text-center md:text-left">
              This item is currently out of stock
            </p>
          )}
        </div>

      </div>

      {/* Embedded Style for Heights, Mobile scroll row and Desktop 2x2 grids */}
      <style>{`
        .main-image-height {
          height: 350px !important;
        }
        @media (min-width: 1024px) {
          .main-image-height {
            height: 500px !important;
          }
        }
        @media (max-width: 768px) {
          .thumbnail-container {
            display: flex !important;
            flex-direction: row !important;
            overflow-x: auto !important;
            gap: 8px !important;
            padding-bottom: 8px !important;
            scrollbar-width: none !important;
            -webkit-overflow-scrolling: touch !important;
          }
          .thumbnail-container::-webkit-scrollbar {
            display: none;
          }
          .thumbnail-item {
            min-width: 70px !important;
            width: 70px !important;
            height: 70px !important;
            flex-shrink: 0 !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            overflow: hidden;
            border: 2px solid transparent;
          }
          .thumbnail-item.border-active {
            border: 2px solid #1a6b5c !important;
          }
          .thumbnail-item img {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }
        }
        @media (min-width: 769px) {
          .thumbnail-item {
            width: 100%;
            aspect-ratio: 1;
            border-radius: 8px;
            overflow: hidden;
            cursor: pointer;
            border: 2px solid transparent;
            transition: border 0.2s ease;
          }
          .thumbnail-item.border-active {
            border: 2px solid #1a6b5c;
          }
          .thumbnail-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      `}</style>

      {/* Product Details Tabs section */}
      <div className="border-t border-[#1a6b5c]/20 pt-8 mt-12 select-none text-[#0a0a0a]">
        <h3 className="font-serif text-lg font-light tracking-wide text-center uppercase mb-4 text-[#1a6b5c]">
          Atelier Specifications & Custody
        </h3>
        <div className="flex justify-center border-b border-[#1a6b5c]/10 pb-3 mb-6 gap-6 sm:gap-12 md:gap-16 text-xs sm:text-sm font-mono tracking-[0.15em] uppercase">
          {[
            { id: 'materials' as const, label: 'Materials' },
            { id: 'crafting' as const, label: 'Crafting Specs' },
            { id: 'care' as const, label: 'Care' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveAccordion(tab.id)}
              className={`pb-1 px-1 transition-all pointer-events-auto cursor-pointer ${
                activeAccordion === tab.id
                  ? 'border-b-2 border-[#1a6b5c] text-[#1a6b5c] font-semibold'
                  : 'text-[#666] hover:text-[#1a6b5c]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="max-w-3xl mx-auto bg-white border border-[#1a6b5c]/15 rounded-sm p-6 text-sm font-light leading-relaxed text-[#333]">
          {activeAccordion === 'materials' && (
            <div className="animate-fade-in space-y-3">
              <p className="font-serif font-medium text-[#1a6b5c] uppercase text-xs tracking-wider">Atelier Materials</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#0a0a0a]">
                {product.materials?.map((mat, i) => (
                  <li key={i}>{mat}</li>
                ))}
              </ul>
            </div>
          )}
          {activeAccordion === 'crafting' && (
            <div className="animate-fade-in space-y-3">
              <p className="font-serif font-medium text-[#1a6b5c] uppercase text-xs tracking-wider">Bespoke Crafting Specs</p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-[#0a0a0a]">
                {product.details?.map((det, i) => (
                  <li key={i}>{det}</li>
                ))}
              </ul>
            </div>
          )}
          {activeAccordion === 'care' && (
            <div className="animate-fade-in space-y-3">
              <p className="font-serif font-medium text-[#1a6b5c] uppercase text-xs tracking-wider">Preservation and Care</p>
              <p className="text-xs sm:text-sm text-[#333] leading-relaxed">
                {product.care}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Products section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-[#1a6b5c]/10 pt-12 text-[#0a0a0a]">
          <div className="text-center md:text-left mb-6">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c] block font-semibold mb-1">
              Atelier Pairings
            </span>
            <h3 className="font-serif text-2xl font-light text-[#0a0a0a]">
              Related Masterpieces
            </h3>
          </div>

          {/* Grid on desktop */}
          <div className="hidden md:grid md:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={(selected) => {
                  navigate(`/product/${selected.id}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onAddToCart={(selected) => {
                  onAddToCart(selected, {
                    metal: selected.options.metals[0],
                    size: selected.options.sizes?.[0]
                  });
                }}
                isWishlisted={wishlist.some(item => item.id === p.id)}
                onToggleWishlist={(selected) => {
                  const isWish = wishlist.some(item => item.id === selected.id);
                  if (isWish) {
                    onRemoveFromWishlist(selected);
                  } else {
                    onAddToWishlist(selected);
                  }
                }}
              />
            ))}
          </div>

          {/* Mobile scroll row */}
          <div className="md:hidden flex overflow-x-auto gap-4 pb-4 scrollbar-none snap-x snap-mandatory">
            {relatedProducts.map((p) => (
              <div key={p.id} className="min-w-[280px] w-[280px] shrink-0 snap-align-start">
                <ProductCard
                  product={p}
                  onSelect={(selected) => {
                    navigate(`/product/${selected.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onAddToCart={(selected) => {
                    onAddToCart(selected, {
                      metal: selected.options.metals[0],
                      size: selected.options.sizes?.[0]
                    });
                  }}
                  isWishlisted={wishlist.some(item => item.id === p.id)}
                  onToggleWishlist={(selected) => {
                    const isWish = wishlist.some(item => item.id === selected.id);
                    if (isWish) {
                      onRemoveFromWishlist(selected);
                    } else {
                      onAddToWishlist(selected);
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Add to Cart Strip */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#1a6b5c]/10 p-3 md:hidden shadow-lg flex items-center justify-between">
        {product.inStock ? (
          <button
            onClick={handleAddToBag}
            className="w-full bg-[#1a6b5c] hover:bg-[#1a6b5c]/85 text-white font-medium text-sm uppercase tracking-[0.2em] py-3.5 rounded-sm transition-colors duration-300 flex items-center justify-center space-x-2.5 pointer-events-auto cursor-pointer"
          >
            <ShoppingBag size={15} />
            <span>Add to Cart — ₹{product.price.toLocaleString('en-IN')}</span>
          </button>
        ) : (
          <button
            disabled
            className="w-full bg-neutral-200 text-neutral-400 border border-neutral-300 font-medium text-xs uppercase tracking-[0.2em] py-3.5 rounded-sm flex items-center justify-center space-x-2.5 cursor-not-allowed"
          >
            <ShoppingBag size={15} />
            <span>Out of Stock</span>
          </button>
        )}
      </div>

    </div>
  );
}
