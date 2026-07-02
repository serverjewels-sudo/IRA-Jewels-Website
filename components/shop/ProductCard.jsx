"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { supabase } from '@/lib/supabase'

export default function ProductCard({ product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const router = useRouter();
  const { addToCart } = useCart();

  const [rating, setRating] = useState({ avg: 0, count: 0 })

  useEffect(() => {
    if (!product?.id) return
    async function fetchRating() {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('rating')
          .eq('product_id', product.id)
          .eq('is_approved', true)
        if (!error && data && data.length > 0) {
          const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length
          setRating({ avg: avg.toFixed(1), count: data.length })
        }
      } catch (err) {
        console.error('[ProductCard] rating fetch error:', err)
      }
    }
    fetchRating()
  }, [product?.id])

  const isOnSale = product?.comparePriceVal && product?.comparePriceVal > product?.priceVal;
  const isOutOfStock = (product?.stock_quantity ?? product?.stock ?? 0) === 0;

  useEffect(() => {
    if (!product) return;

    const checkWishlist = () => {
      try {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem("ira-wishlist");
          if (stored) {
            const list = JSON.parse(stored);
            if (Array.isArray(list)) {
              setIsWishlisted(list.some((id) => String(id) === String(product.id)));
              return;
            }
          }
        }
        setIsWishlisted(false);
      } catch (err) {
        console.error("Error reading wishlist from localStorage:", err);
        setIsWishlisted(false);
      }
    };

    checkWishlist();

    if (typeof window !== 'undefined') {
      window.addEventListener("wishlist-updated", checkWishlist);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener("wishlist-updated", checkWishlist);
      }
    };
  }, [product]);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product) return;

    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem("ira-wishlist");
        let list = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(list)) list = [];

        const productIdStr = String(product.id);
        const isCurrentlyWishlisted = list.some((id) => String(id) === productIdStr);

        if (isCurrentlyWishlisted) {
          list = list.filter((id) => String(id) !== productIdStr);
        } else {
          list.push(product.id);
        }

        localStorage.setItem("ira-wishlist", JSON.stringify(list));
        setIsWishlisted(!isCurrentlyWishlisted);

        // Dispatch custom event to notify all listeners
        window.dispatchEvent(new Event("wishlist-updated"));
      }
    } catch (err) {
      console.error("Error saving wishlist to localStorage:", err);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.size_options?.[0] || null;
    const defaultColour = product.colour_options?.[0] || null;
    addToCart(product, defaultSize, defaultColour);
  };

  const handleCardClick = (e) => {
    // Navigate to product page
    router.push(`/shop/${product.slug}`);
  };

  if (!product) return null;

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-[#FFFFFF] relative flex flex-col transition-all duration-300 border-t-[3px] border-t-transparent hover:border-t-[#CDB38B] hover:shadow-[0_15px_35px_rgba(0,0,0,0.06)] overflow-hidden h-full cursor-pointer"
    >
      
      {/* Image Container (1:1 square ratio) */}
      <div className="aspect-square w-full overflow-hidden relative bg-[#F9F9F9]">
        
        {/* Badges (Top left corner of image) */}
        {isOutOfStock ? (
          <div className="absolute top-4 left-4 z-10 bg-[#2E3135] text-[#FFFFFF] px-2.5 py-1 text-[10px] font-inter font-medium tracking-[1.5px] uppercase">
            OUT OF STOCK
          </div>
        ) : isOnSale ? (
          <div className="absolute top-4 left-4 z-10 bg-[#2E3135] text-[#FFFFFF] px-2.5 py-1 text-[10px] font-inter font-medium tracking-[1.5px] uppercase">
            SALE
          </div>
        ) : null}

        {/* Wishlist Heart Icon (Top right corner of image) */}
        <button
          onClick={toggleWishlist}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 backdrop-blur-sm shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 hover:bg-white"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-[18px] h-[18px] transition-colors duration-300 ${
              isWishlisted
                ? "fill-[#CDB38B] stroke-[#CDB38B]"
                : "stroke-[#2E3135] fill-none"
            }`}
          />
        </button>

        {/* Product Image with Hover Zoom */}
        <Link href={`/shop/${product.slug}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-[400ms] ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Product Details Container */}
      <div className="p-6 flex flex-col flex-grow relative pb-16">
        {/* Category Tag */}
        <span className="font-inter font-medium text-[10px] tracking-[1.5px] uppercase text-[#CDB38B] mb-2 block">
          {product.category}
        </span>

        {/* Product Name */}
        <h3 className="font-cormorant font-normal text-[19px] text-[#2E3135] leading-snug mb-3 hover:text-[#CDB38B] transition-colors duration-300">
          <Link href={`/shop/${product.slug}`}>
            {product.name}
          </Link>
        </h3>

        {rating.count > 0 && (
          <div style={{display:'flex', alignItems:'center', gap:'4px', marginBottom:'6px'}}>
            <span style={{color:'#CDB38B', fontSize:'12px', letterSpacing:'1px'}}>
              {'★'.repeat(Math.round(rating.avg))}{'☆'.repeat(5 - Math.round(rating.avg))}
            </span>
            <span style={{fontSize:'11px', color:'#888'}}>({rating.count})</span>
          </div>
        )}

        {/* Price & Metal type */}
        <div className="mt-auto space-y-1">
          {isOnSale ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-inter font-medium text-[16px] text-[#2E3135]">
                  {product.price}
                </span>
                <span className="font-inter line-through text-[14px] text-[#888888]">
                  {product.compare_price}
                </span>
              </div>
              <p className="font-inter font-normal text-[13px] text-[#CDB38B]">
                You save ₹{(product.comparePriceVal - product.priceVal).toLocaleString("en-IN")}
              </p>
            </div>
          ) : (
            <p className="font-inter font-medium text-[16px] text-[#2E3135]">
              {product.price}
            </p>
          )}
          <p className="font-inter font-light text-[13px] text-[#888888]">
            {product.metal}
          </p>
        </div>

        {/* "Add to Cart" button (full width of card, slides in on hover) */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden transition-all duration-300 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 h-[48px]">
          <button
            onClick={isOutOfStock ? (e) => { e.preventDefault(); e.stopPropagation(); } : handleAddToCart}
            disabled={isOutOfStock}
            className={`w-full h-full font-inter font-medium text-[12px] tracking-[1.5px] uppercase transition-colors duration-300 ${
              isOutOfStock
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-[#2E3135] text-[#FFFFFF] hover:bg-[#CDB38B]"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
