"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/shop/ProductCard";
import { supabase, mapSupabaseProduct } from "@/lib/supabase";

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="aspect-square w-full bg-[#F3F1EC] animate-pulse"></div>
      <div className="p-6 flex flex-col flex-grow space-y-4 pb-16">
        <div className="h-[10px] w-20 bg-[#F3F1EC] animate-pulse rounded"></div>
        <div className="h-5 w-5/6 bg-[#F3F1EC] animate-pulse rounded"></div>
        <div className="mt-auto space-y-2">
          <div className="h-[18px] w-24 bg-[#F3F1EC] animate-pulse rounded"></div>
          <div className="h-[14px] w-16 bg-[#F3F1EC] animate-pulse rounded"></div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [rate999, setRate999] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedAndRate() {
      try {
        const productsPromise = supabase
          .from("products")
          .select("*")
          .eq("is_featured", true)
          .eq("is_active", true)
          .limit(6);

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
          console.error("Error fetching featured products from Supabase:", productsRes.error);
        } else if (productsRes.data) {
          setProducts(productsRes.data.map(mapSupabaseProduct));
        }
      } catch (err) {
        console.error("Unexpected error fetching featured products:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchFeaturedAndRate();
  }, []);

  return (
    <section className="w-full bg-[#FFFFFF] py-20 px-6 sm:px-12 md:py-28 border-t border-[#F3F1EC]">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex flex-col items-center mb-16 text-center">
          <span className="font-inter font-medium text-[11px] tracking-[2.5px] uppercase text-[#CDB38B] mb-3">
            The Curated Collection
          </span>
          <h2 className="font-cormorant font-normal text-[32px] sm:text-[38px] md:text-[42px] text-[#2E3135] tracking-wide leading-tight max-w-[600px]">
            Everyday Fine Jewellery
          </h2>
          <div className="w-12 h-[1px] bg-[#2E3135]/20 my-5"></div>
          <p className="font-inter font-light text-[14px] sm:text-[15px] text-[#888888] max-w-[480px]">
            Ethically grown lab diamonds set in handcrafted gold. Premium designs created for modern elegance.
          </p>
        </div>

        {/* Product Grid or Skeletons or Empty State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} rate_999={rate999} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-[#2E3135]/10 rounded-lg bg-[#F9F9F9] px-4">
            <p className="font-inter font-light text-[14px] text-[#888888]">
              No featured jewelry pieces available at the moment.
            </p>
          </div>
        )}

        {/* View All Products Button */}
        <div className="flex justify-center mt-12 md:mt-16">
          <Link
            href="/shop"
            className="inline-block bg-white text-[#2E3135] border border-[#2E3135] font-inter font-medium text-[12px] uppercase tracking-[2px] px-8 py-4 transition-all duration-300 hover:bg-[#2E3135] hover:text-white"
          >
            VIEW ALL PRODUCTS
          </Link>
        </div>
        
      </div>
    </section>
  );
}
