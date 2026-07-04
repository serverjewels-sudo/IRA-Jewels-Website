"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { supabase, mapSupabaseProduct } from "@/lib/supabase";
import { calculateProductPrice } from "@/lib/priceUtils";

export const dynamic = 'force-dynamic';

export default function OffersPage() {
  const [products, setProducts] = useState([]);
  const [rate999, setRate999] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    document.title = "Limited Time Offers | TATVAAN";

    async function fetchOffersAndRate() {
      try {
        const productsPromise = supabase
          .from('products')
          .select('*')
          .not('compare_price', 'is', null)
          .eq('is_active', true)
          .order('created_at', { ascending: false });

        const ratePromise = supabase
          .from("gold_rates")
          .select("rate_999")
          .eq("id", 1)
          .maybeSingle();

        const [productsRes, rateRes] = await Promise.all([productsPromise, ratePromise]);

        let fetchedRate = null;
        if (rateRes.error) {
          console.error("Error fetching gold rate:", rateRes.error);
        } else if (rateRes.data) {
          fetchedRate = rateRes.data.rate_999;
          setRate999(fetchedRate);
        }

        if (productsRes.error) {
          console.error("Error fetching offers from Supabase:", productsRes.error);
        } else if (productsRes.data) {
          const mapped = productsRes.data.map(mapSupabaseProduct);
          // Filter products based on live price calculation compared to comparePriceVal
          const saleProducts = mapped.filter((p) => {
            const { priceVal } = calculateProductPrice(p, fetchedRate);
            return p.comparePriceVal && p.comparePriceVal > priceVal;
          });
          setProducts(saleProducts);
        }
      } catch (err) {
        console.error("Unexpected error fetching offers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchOffersAndRate();
  }, []);

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setIsSubscribed(true);
    setEmail("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-grow">
        {/* Page Hero Banner */}
        <section className="w-full bg-[#2E3135] py-[80px] sm:py-[100px] text-center px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-cormorant italic text-[48px] sm:text-[56px] text-white leading-tight font-normal">
              Limited Time Offers
            </h1>
            <p className="font-inter text-[14px] sm:text-[16px] text-[#CDB38B] tracking-[0.05em] mt-4 font-normal">
              Handpicked pieces at special prices. While stocks last.
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="bg-white py-16 px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <>
                <h2 className="font-cormorant text-[32px] sm:text-[36px] text-[#2E3135] font-normal mb-8">
                  On Sale Now
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              </>
            ) : products.length > 0 ? (
              <>
                <h2 className="font-cormorant text-[32px] sm:text-[36px] text-[#2E3135] font-normal mb-8">
                  On Sale Now
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} rate_999={rate999} />
                  ))}
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-md mx-auto">
                <h2 className="font-cormorant text-[28px] text-[#2E3135] font-normal mb-2">
                  New offers coming soon.
                </h2>
                <p className="font-inter text-[15px] text-[#888888] mb-6">
                  Sign up to be the first to know.
                </p>
                {isSubscribed ? (
                  <div className="p-4 bg-[#F3F1EC] text-[#2E3135] font-inter text-[14px] w-full text-center border-t-[3px] border-[#CDB38B]">
                    Thank you! We&apos;ll keep you updated.
                  </div>
                ) : (
                  <form onSubmit={handleNotifySubmit} className="flex flex-col sm:flex-row gap-3 w-full">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="flex-grow px-4 py-3 border border-[#E5E5E5] focus:outline-none focus:border-[#CDB38B] font-inter text-[14px] bg-white text-[#2E3135]"
                    />
                    <button
                      type="submit"
                      className="px-6 py-3 bg-[#2E3135] text-[#FFFFFF] font-inter font-medium text-[12px] tracking-[1.5px] uppercase hover:bg-[#CDB38B] transition-colors duration-300 whitespace-nowrap"
                    >
                      NOTIFY ME
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

// Skeleton card sub-component
function SkeletonCard() {
  return (
    <div className="bg-[#FFFFFF] flex flex-col border-t-[3px] border-t-transparent overflow-hidden h-full animate-pulse">
      <div className="aspect-square w-full bg-[#F3F1EC]"></div>
      <div className="p-6 flex flex-col flex-grow space-y-4 pb-16">
        <div className="h-[10px] w-20 bg-[#F3F1EC] rounded"></div>
        <div className="h-5 w-5/6 bg-[#F3F1EC] rounded"></div>
        <div className="mt-auto space-y-2">
          <div className="h-[18px] w-24 bg-[#F3F1EC] rounded"></div>
          <div className="h-[14px] w-16 bg-[#F3F1EC] rounded"></div>
        </div>
      </div>
    </div>
  );
}
