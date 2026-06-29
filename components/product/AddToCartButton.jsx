"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { useCart } from "@/lib/CartContext";

export default function AddToCartButton({ product }) {
  const { addToCart } = useCart();

  const [selectedSize, setSelectedSize] = useState(product?.size_options?.[0] || null);
  const [selectedColour, setSelectedColour] = useState(product?.colour_options?.[0] || null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartStatus, setCartStatus] = useState("ADD TO CART");

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColour);
    setCartStatus("ADDED TO CART ✓");
    setTimeout(() => {
      setCartStatus("ADD TO CART");
    }, 2000);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <>
      {/* Size Selector (show if options exist) */}
      {product.size_options && product.size_options.length > 0 && (
        <div className="mb-6">
          <span className="font-inter font-medium text-[12px] tracking-[1.5px] uppercase text-[#2E3135] mb-3 block">
            Select Size
          </span>
          <div className="flex flex-wrap gap-2">
            {product.size_options.map((sz) => (
              <button
                key={sz}
                onClick={() => setSelectedSize(sz)}
                className={`px-4 py-2.5 rounded-full font-inter font-medium text-[13px] border transition-all duration-300 min-w-[50px] ${
                  selectedSize === sz
                    ? "bg-[#2E3135] border-[#2E3135] text-white"
                    : "bg-white border-[#2E3135] text-[#2E3135] hover:border-[#CDB38B] hover:text-[#CDB38B]"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colour Selector (show if options exist) */}
      {product.colour_options && product.colour_options.length > 0 && (
        <div className="mb-8">
          <span className="font-inter font-medium text-[12px] tracking-[1.5px] uppercase text-[#2E3135] mb-3 block">
            Select Colour
          </span>
          <div className="flex flex-wrap gap-2">
            {product.colour_options.map((col) => (
              <button
                key={col}
                onClick={() => setSelectedColour(col)}
                className={`px-4 py-2.5 rounded-full font-inter font-medium text-[13px] border transition-all duration-300 ${
                  selectedColour === col
                    ? "bg-[#2E3135] border-[#2E3135] text-white"
                    : "bg-white border-[#2E3135] text-[#2E3135] hover:border-[#CDB38B] hover:text-[#CDB38B]"
                }`}
              >
                {col}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Buttons stack */}
      <div className="space-y-3">
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={cartStatus.startsWith("ADDED")}
          className="w-full h-[52px] bg-[#2E3135] text-[#FFFFFF] font-inter font-medium text-[13px] tracking-[2px] uppercase transition-all duration-300 hover:opacity-90 active:scale-[0.99] flex items-center justify-center disabled:opacity-100"
        >
          {cartStatus}
        </button>

        {/* Add to Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="w-full h-[52px] bg-white border border-[#2E3135] text-[#2E3135] font-inter font-medium text-[13px] tracking-[2px] uppercase transition-all duration-300 hover:bg-[#F3F1EC]/30 active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <Heart
            className={`w-[16px] h-[16px] transition-colors duration-300 ${
              isWishlisted ? "fill-[#CDB38B] stroke-[#CDB38B]" : "stroke-[#2E3135] fill-none"
            }`}
          />
          {isWishlisted ? "WISHLISTED" : "ADD TO WISHLIST"}
        </button>
      </div>
    </>
  );
}
