"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { supabase, mapSupabaseProduct } from "@/lib/supabase";
import { Heart } from "lucide-react";

// Skeleton card for loading state
function SkeletonCard() {
  return (
    <div className="bg-[#FFFFFF] flex flex-col border-t-[3px] border-t-transparent overflow-hidden h-full">
      {/* 1:1 aspect ratio block */}
      <div className="aspect-square w-full bg-[#F3F1EC] animate-pulse"></div>
      <div className="p-6 flex flex-col flex-grow space-y-4 pb-16">
        {/* Category */}
        <div className="h-[10px] w-20 bg-[#F3F1EC] animate-pulse rounded"></div>
        {/* Title */}
        <div className="h-5 w-5/6 bg-[#F3F1EC] animate-pulse rounded"></div>
        {/* Price & Metal */}
        <div className="mt-auto space-y-2">
          <div className="h-[18px] w-24 bg-[#F3F1EC] animate-pulse rounded"></div>
          <div className="h-[14px] w-16 bg-[#F3F1EC] animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [rate999, setRate999] = useState(null);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Set SEO metadata and load wishlist on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = "My Wishlist | IRA Jewels";
    }

    const loadWishlist = async () => {
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem("ira-wishlist") : null;
        const ids = stored ? JSON.parse(stored) : [];
        setWishlistIds(ids);

        if (ids.length > 0) {
          // Convert to numbers if IDs are integers
          const numericIds = ids.map((id) => Number(id)).filter((id) => !isNaN(id));
          const queryIds = numericIds.length > 0 ? numericIds : ids;

          const productsPromise = supabase
            .from("products")
            .select("*")
            .in("id", queryIds)
            .eq("is_active", true);

          const ratePromise = supabase
            .from("gold_rates")
            .select("rate_999")
            .eq("id", 1)
            .maybeSingle();

          const [productsRes, rateRes] = await Promise.all([productsPromise, ratePromise]);

          if (rateRes.error) {
            console.error("Error fetching gold rate:", rateRes.error);
          } else if (rateRes.data) {
            setRate999(rateRes.data.rate_999);
          }

          if (productsRes.error) {
            console.error("Error loading products from Supabase:", productsRes.error);
          } else if (productsRes.data) {
            // Map products to the frontend format
            setProducts(productsRes.data.map(mapSupabaseProduct));
          }
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Unexpected error loading wishlist:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, []);

  // Listen to custom "wishlist-updated" window event for real-time reactivity
  useEffect(() => {
    const handleWishlistUpdate = () => {
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem("ira-wishlist") : null;
        const ids = stored ? JSON.parse(stored) : [];
        const stringIds = ids.map(String);

        setWishlistIds(ids);
        // Filter out any products that were removed
        setProducts((prevProducts) =>
          prevProducts.filter((p) => stringIds.includes(String(p.id)))
        );
      } catch (err) {
        console.error("Error syncing wishlist on update:", err);
      }
    };

    window.addEventListener("wishlist-updated", handleWishlistUpdate);
    return () => {
      window.removeEventListener("wishlist-updated", handleWishlistUpdate);
    };
  }, []);

  // Handle manual removal of item from wishlist
  const handleRemoveFromWishlist = (productId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem("ira-wishlist");
        let list = stored ? JSON.parse(stored) : [];
        if (Array.isArray(list)) {
          const productIdStr = String(productId);
          list = list.filter((id) => String(id) !== productIdStr);
          localStorage.setItem("ira-wishlist", JSON.stringify(list));

          // Dispatch update event
          window.dispatchEvent(new Event("wishlist-updated"));
        }
      }
    } catch (err) {
      console.error("Error removing item from wishlist:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#2E3135]">
      <Navbar />

      <main className="flex-grow">
        {/* PAGE HEADER */}
        <section className="w-full bg-[#2E3135] py-[80px] text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-cormorant italic text-[52px] text-white leading-tight font-normal">
              My Wishlist
            </h1>
            <p className="font-inter text-[15px] text-[#CDB38B] tracking-[0.05em] mt-2 font-light">
              Pieces you love, saved for later
            </p>
          </div>
        </section>

        {/* PAGE CONTENT */}
        <section className="bg-white py-[60px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1200px] mx-auto w-full">
            {isLoading ? (
              /* STATE 3 - Loading State */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : products.length > 0 ? (
              /* STATE 1 - Has Wishlist Items */
              <div>
                <span className="font-inter text-[14px] text-[#888888] mb-6 block">
                  {products.length} {products.length === 1 ? "piece" : "pieces"} saved
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
                  {products.map((product) => (
                    <div key={product.id} className="flex flex-col">
                      <div className="flex-grow">
                        <ProductCard product={product} rate_999={rate999} />
                      </div>
                      <button
                        onClick={(e) => handleRemoveFromWishlist(product.id, e)}
                        className="mt-4 font-inter text-[13px] text-[#CDB38B] hover:text-[#2E3135] transition-colors duration-300 uppercase tracking-widest text-center"
                      >
                        REMOVE FROM WISHLIST
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-16 text-center">
                  <Link
                    href="/shop"
                    className="inline-block bg-[#2E3135] text-white hover:bg-[#CDB38B] font-inter font-medium text-[13px] tracking-[2px] px-8 py-4 transition-all duration-300 rounded-[2px]"
                  >
                    CONTINUE SHOPPING
                  </Link>
                </div>
              </div>
            ) : (
              /* STATE 2 - Empty Wishlist */
              <div className="max-w-[500px] mx-auto text-center flex flex-col items-center py-10 px-6">
                <div className="mb-6 flex items-center justify-center p-4 border border-[#CDB38B]/20 rounded-full bg-[#F3F1EC]/25">
                  <Heart className="w-16 h-16 text-[#CDB38B] stroke-[1]" />
                </div>
                <h2 className="font-cormorant text-[28px] text-[#2E3135] font-normal mb-3">
                  Your wishlist is empty
                </h2>
                <p className="font-inter text-[15px] text-[#555555] font-light mb-8 max-w-[340px]">
                  Start browsing and save the pieces you love.
                </p>
                <Link
                  href="/shop"
                  className="inline-block bg-[#2E3135] text-white hover:bg-[#CDB38B] font-inter font-medium text-[12px] tracking-[1.5px] uppercase transition-colors duration-300 hover:text-white px-8 py-4 rounded-[2px] text-center"
                >
                  BROWSE OUR COLLECTION
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
