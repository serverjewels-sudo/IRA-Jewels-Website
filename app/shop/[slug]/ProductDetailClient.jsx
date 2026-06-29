"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase, mapSupabaseProduct } from "@/lib/supabase";
import { useCart } from "@/lib/CartContext";

export default function ProductDetailClient({ slug }) {
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColour, setSelectedColour] = useState(null);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartStatus, setCartStatus] = useState("ADD TO CART");

  useEffect(() => {
    async function loadProduct() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("slug", slug)
          .single();

        if (error) {
          console.error("Error loading product from Supabase:", error);
        } else if (data) {
          const mapped = mapSupabaseProduct(data);
          setProduct(mapped);
          setSelectedSize(mapped.size_options?.[0] || null);
          setSelectedColour(mapped.colour_options?.[0] || null);
        }
      } catch (err) {
        console.error("Unexpected error loading product:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center py-20 px-4 text-center">
          <div className="w-10 h-10 border-t-2 border-[#CDB38B] rounded-full animate-spin"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center py-20 px-4 text-center">
          <h2 className="font-cormorant font-normal text-[36px] text-[#2E3135] mb-4">
            Product not found
          </h2>
          <p className="font-inter font-light text-[15px] text-[#888888] mb-8 max-w-sm">
            We couldn&apos;t find the jewelry piece you are looking for. It may have been removed or the link is incorrect.
          </p>
          <Link
            href="/shop"
            className="px-8 py-3 bg-[#2E3135] text-white font-inter font-medium text-[12px] tracking-[1.5px] uppercase hover:bg-[#CDB38B] transition-colors duration-300"
          >
            Back to Shop
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

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
    <div className="min-h-screen flex flex-col bg-white text-[#2E3135]">
      <Navbar />

      <main className="flex-grow py-8 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Breadcrumb at top of page */}
        <nav className="flex items-center space-x-2 font-inter text-[13px] text-[#888888] mb-8 md:mb-12">
          <Link href="/" className="hover:text-[#CDB38B] transition-colors duration-300">
            Home
          </Link>
          <span className="text-[#888888]/40">&gt;</span>
          <Link href="/shop" className="hover:text-[#CDB38B] transition-colors duration-300">
            Shop
          </Link>
          <span className="text-[#888888]/40">&gt;</span>
          <span className="text-[#2E3135] font-light truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Page Layout: Desktop side-by-side 55%/45%, Mobile single column */}
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* LEFT COLUMN: Image Gallery (55% width on desktop) */}
          <div className="w-full lg:w-[55%] flex flex-col">
            {/* Main large image */}
            <div className="aspect-square w-full bg-white border border-[#F3F1EC] overflow-hidden relative">
              <img
                src={product.images[activeImageIndex]}
                alt={`${product.name} main view`}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>

            {/* Row of 4 thumbnails */}
            <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 flex-shrink-0 relative overflow-hidden bg-white cursor-pointer transition-all duration-300 ${
                    activeImageIndex === idx
                      ? "border-2 border-[#CDB38B]"
                      : "border border-[#F3F1EC] hover:border-[#CDB38B]/50"
                  }`}
                  aria-label={`View detail image ${idx + 1}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: Product Information (45% width on desktop) */}
          <div className="w-full lg:w-[45%] flex flex-col">
            {/* 1. Category tag */}
            <span className="font-inter font-medium text-[11px] tracking-[1.5px] uppercase text-[#CDB38B] mb-2 block">
              {product.category}
            </span>

            {/* 2. Product name */}
            <h1 className="font-cormorant font-normal text-[36px] sm:text-[40px] text-[#2E3135] leading-tight mb-4">
              {product.name}
            </h1>

            {/* 3. Price */}
            <div className="flex items-baseline mb-6">
              <span className="font-inter font-medium text-[22px] text-[#2E3135]">
                {product.price}
              </span>
              {product.compare_price && (
                <span className="font-inter font-light text-[16px] text-[#999999] line-through ml-3">
                  {product.compare_price}
                </span>
              )}
            </div>

            {/* 4. Thin divider line */}
            <div className="w-10 h-[1px] bg-[#CDB38B] my-4"></div>

            {/* 5. Details row */}
            <p className="font-inter font-light text-[14px] text-[#666666] mb-8">
              {product.karat} {product.metalType} &nbsp;•&nbsp; {product.weight} &nbsp;•&nbsp; {product.stoneType}
            </p>

            {/* 6. Size Selector (show if options exist) */}
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

            {/* 7. Colour Selector (show if options exist) */}
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
              {/* 8. Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                disabled={cartStatus.startsWith("ADDED")}
                className="w-full h-[52px] bg-[#2E3135] text-[#FFFFFF] font-inter font-medium text-[13px] tracking-[2px] uppercase transition-all duration-300 hover:opacity-90 active:scale-[0.99] flex items-center justify-center disabled:opacity-100"
              >
                {cartStatus}
              </button>

              {/* 9. Add to Wishlist Button */}
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

            {/* 10. Description Section */}
            <div className="mt-8 pt-8 border-t border-[#F3F1EC]">
              <span className="font-inter font-medium text-[12px] tracking-[1.5px] uppercase text-[#2E3135] mb-3 block">
                Description
              </span>
              <p className="font-inter font-normal text-[15px] leading-[1.8] text-[#2E3135]">
                {product.description}
              </p>
            </div>

            {/* 11. Certification Line */}
            <div className="mt-8 pt-6 border-t border-[#F3F1EC]">
              <p className="font-inter font-light text-[13px] text-[#888888] leading-relaxed">
                ✦ Certified lab-grown diamond &nbsp;•&nbsp; Free delivery across India &nbsp;•&nbsp; Hallmarked
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
