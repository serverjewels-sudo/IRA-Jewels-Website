"use client";

import { useState, useEffect, useRef, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { SlidersHorizontal, X, ChevronDown, RotateCcw } from "lucide-react";

import { supabase, mapSupabaseProduct } from "@/lib/supabase";
import { calculateProductPrice } from "@/lib/priceUtils";

export const dynamic = 'force-dynamic';


const categories = [
  "All", "Rings", "Necklaces", "Bangles", "Earrings", "Bracelets", 
  "Pendants", "Chains", "Mangalsutra", "Sets", "Anklets", "Nose Pins"
];

const metalTypes = ["All", "Gold", "White Gold", "Rose Gold", "Silver", "Platinum"];
const karats = ["All", "9K", "10K", "14K", "18K", "22K"];
const sortOptions = ["Featured", "Price Low to High", "Price High to Low", "Newest"];

// Skeleton card sub-component
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

function ShopInner() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  const metalParam = searchParams.get("metal");
  const karatParam = searchParams.get("karat");
  const collectionParam = searchParams.get("collection");

  const [products, setProducts] = useState([]);
  const [rate999, setRate999] = useState(null);
  const [dbLoading, setDbLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [priceRange, setPriceRange] = useState(200000);
  const [selectedMetal, setSelectedMetal] = useState("All");
  const [selectedKarat, setSelectedKarat] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const isFirstMount = useRef(true);

  // Sync category query parameter if it exists
  useEffect(() => {
    if (categoryParam) {
      const matched = categories.find(
        (c) => c.toLowerCase() === categoryParam.toLowerCase()
      );
      if (matched) {
        setSelectedCategory(matched);
      }
    }
  }, [categoryParam]);

  // Sync metal query parameter
  useEffect(() => {
    if (metalParam) {
      const matched = metalTypes.find(
        (m) => m.toLowerCase().replace(' ', '-') === metalParam.toLowerCase()
      );
      if (matched) setSelectedMetal(matched);
    }
  }, [metalParam]);

  // Sync karat query parameter
  useEffect(() => {
    if (karatParam) {
      const matched = karats.find(
        (k) => k.toLowerCase() === karatParam.toLowerCase()
      );
      if (matched) setSelectedKarat(matched);
    }
  }, [karatParam]);

  // Fetch collection ID if collection query parameter exists
  useEffect(() => {
    async function fetchCollectionId() {
      if (collectionParam) {
        const { data } = await supabase
          .from("collections")
          .select("id")
          .eq("slug", collectionParam)
          .maybeSingle();
        
        if (data) {
          setSelectedCollectionId(data.id);
        } else {
          setSelectedCollectionId(null);
        }
      } else {
        setSelectedCollectionId(null);
      }
    }
    fetchCollectionId();
  }, [collectionParam]);

  // Fetch products and gold rate from Supabase on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const productsPromise = supabase
          .from("products")
          .select("*")
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
          console.error("Error fetching products from Supabase:", productsRes.error);
        } else if (productsRes.data) {
          setProducts(productsRes.data.map(mapSupabaseProduct));
        }
      } catch (err) {
        console.error("Unexpected error loading products:", err);
      } finally {
        setDbLoading(false);
      }
    }
    fetchData();
  }, []);

  // Trigger loading skeleton state on filter/sorting changes
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    
    setFilterLoading(true);
    const timer = setTimeout(() => {
      setFilterLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedMetal, selectedKarat, sortBy, selectedCollectionId]);

  const isLoading = dbLoading || filterLoading;

  // Reset all filters back to default values
  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSelectedCollectionId(null);
    setPriceRange(200000);
    setSelectedMetal("All");
    setSelectedKarat("All");
    setSortBy("Featured");
  };

  // Filtered and sorted products memoized
  const filteredProducts = useMemo(() => {
    // Apply live pricing to products before filtering and sorting
    let result = products.map((p) => {
      const { priceVal, price, hasLivePrice } = calculateProductPrice(p, rate999);
      return {
        ...p,
        priceVal,
        price,
        hasLivePrice,
      };
    });

    // Filter by Collection
    if (selectedCollectionId) {
      result = result.filter(
        (p) => p.collection_ids && p.collection_ids.includes(selectedCollectionId)
      );
    }

    // Filter by Category
    if (selectedCategory !== "All") {
      result = result.filter(
        (p) => p.category && p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by Price Range
    result = result.filter((p) => p.priceVal <= priceRange);

    // Filter by Metal Type
    if (selectedMetal !== "All") {
      result = result.filter((p) => p.metalType === selectedMetal);
    }

    // Filter by Karat
    if (selectedKarat !== "All") {
      result = result.filter((p) => p.karat === selectedKarat);
    }

    // Sorting
    if (sortBy === "Price Low to High") {
      result.sort((a, b) => a.priceVal - b.priceVal);
    } else if (sortBy === "Price High to Low") {
      result.sort((a, b) => b.priceVal - a.priceVal);
    } else if (sortBy === "Newest") {
      result.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    } else {
      // "Featured": default order by ID (or DB id)
      result.sort((a, b) => a.id - b.id);
    }

    return result;
  }, [products, selectedCategory, priceRange, selectedMetal, selectedKarat, sortBy, rate999, selectedCollectionId]);

  // Content for filters to share between desktop sidebar and mobile drawer
  const renderFilters = () => (
    <>
      {/* Category Selection */}
      <div className="pb-6 border-b border-[#2E3135]/10">
        <h4 className="font-inter font-medium text-[13px] tracking-wider uppercase text-[#2E3135] mb-4">
          Categories
        </h4>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-[10px] tracking-wider uppercase font-inter transition-all duration-300 ${
                selectedCategory === cat
                  ? "bg-[#CDB38B] text-white font-medium"
                  : "bg-white text-[#2E3135] border border-[#E5E5E5]/60 hover:border-[#CDB38B] hover:text-[#CDB38B]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div className="py-6 border-b border-[#2E3135]/10">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-inter font-medium text-[13px] tracking-wider uppercase text-[#2E3135]">
            Price Range
          </h4>
          <span className="font-inter font-medium text-[13px] text-[#CDB38B]">
            ₹{priceRange.toLocaleString("en-IN")}
          </span>
        </div>
        <input
          type="range"
          min="5000"
          max="200000"
          step="5000"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full accent-[#CDB38B] bg-white border border-[#E5E5E5] h-1.5 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-[#888888] font-inter mt-2">
          <span>₹5,000</span>
          <span>₹2,00,000+</span>
        </div>
      </div>

      {/* Metal Type */}
      <div className="py-6 border-b border-[#2E3135]/10">
        <h4 className="font-inter font-medium text-[13px] tracking-wider uppercase text-[#2E3135] mb-4">
          Metal Type
        </h4>
        <div className="flex flex-wrap gap-2">
          {metalTypes.map((metal) => (
            <button
              key={metal}
              onClick={() => setSelectedMetal(metal)}
              className={`px-3 py-1.5 rounded-full text-[10px] tracking-wider uppercase font-inter transition-all duration-300 ${
                selectedMetal === metal
                  ? "bg-[#CDB38B] text-white font-medium"
                  : "bg-white text-[#2E3135] border border-[#E5E5E5]/60 hover:border-[#CDB38B] hover:text-[#CDB38B]"
              }`}
            >
              {metal}
            </button>
          ))}
        </div>
      </div>

      {/* Karats */}
      <div className="py-6 border-b border-[#2E3135]/10">
        <h4 className="font-inter font-medium text-[13px] tracking-wider uppercase text-[#2E3135] mb-4">
          Karat
        </h4>
        <div className="flex flex-wrap gap-2">
          {karats.map((k) => (
            <button
              key={k}
              onClick={() => setSelectedKarat(k)}
              className={`px-3.5 py-1.5 rounded-full text-[10px] tracking-wider uppercase font-inter transition-all duration-300 ${
                selectedKarat === k
                  ? "bg-[#CDB38B] text-white font-medium"
                  : "bg-white text-[#2E3135] border border-[#E5E5E5]/60 hover:border-[#CDB38B] hover:text-[#CDB38B]"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Sorting */}
      <div className="py-6">
        <h4 className="font-inter font-medium text-[13px] tracking-wider uppercase text-[#2E3135] mb-4">
          Sort By
        </h4>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-white border border-[#E5E5E5] text-[#2E3135] px-3.5 py-3 text-[11px] font-inter tracking-wider rounded-md focus:outline-none focus:border-[#CDB38B] appearance-none cursor-pointer pr-10 uppercase"
          >
            {sortOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-[#2E3135]">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#2E3135]">
      <Navbar />

      <main className="flex-grow py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-[1600px] min-[901px]:max-w-none mx-auto w-full">
        {/* Header Title Section */}
        <div className="flex flex-col items-center mb-12 md:mb-16 text-center">
          <h1 className="font-cormorant font-normal text-[40px] sm:text-[48px] text-[#2E3135] tracking-wide leading-tight mb-3">
            Our Collection
          </h1>
          <p className="font-inter font-light text-[15px] sm:text-[16px] text-[#888888] max-w-[480px]">
            Lab-grown diamonds, crafted for everyday luxury
          </p>
          <div className="w-12 h-[1px] bg-[#2E3135]/20 mt-5"></div>
        </div>

        <div className="flex flex-col min-[901px]:flex-row gap-10 items-start">
          
          {/* DESKTOP SIDEBAR FILTER */}
          <aside className="hidden min-[901px]:block flex-shrink-0 w-72 bg-[#F3F1EC] p-8 rounded-lg space-y-2 sticky top-24 max-h-[calc(100dvh-120px)] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6 pb-2 border-b border-[#2E3135]/10">
              <span className="font-inter font-medium text-[14px] uppercase tracking-wider text-[#2E3135]">Filters</span>
              {(selectedCategory !== "All" || selectedCollectionId !== null || priceRange !== 200000 || selectedMetal !== "All" || selectedKarat !== "All" || sortBy !== "Featured") && (
                <button
                  onClick={handleResetFilters}
                  className="font-inter text-[10px] text-[#888888] hover:text-[#CDB38B] transition-colors uppercase tracking-wider flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3 h-3" />
                  Clear All
                </button>
              )}
            </div>
            {renderFilters()}
          </aside>

          {/* PRODUCTS MAIN SECTION */}
          <section className="flex-1 flex flex-col min-w-0">
            
            {/* MOBILE FILTER TRIGGER BAR */}
            <div className="flex justify-between items-center mb-6 min-[901px]:hidden bg-[#F3F1EC]/40 p-4 rounded-md border border-[#F3F1EC]">
              <button
                onClick={() => setIsMobileDrawerOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#F3F1EC] text-[#2E3135] rounded-md font-inter font-medium text-[11px] tracking-wider uppercase border border-[#E5E5E5]/60 hover:bg-[#CDB38B]/10 hover:border-[#CDB38B] transition-colors"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.5]" />
                Filters & Sort
              </button>
              <span className="font-inter font-light text-[12px] text-[#888888]">
                {isLoading ? "..." : `${filteredProducts.length} ${filteredProducts.length === 1 ? 'Item' : 'Items'}`}
              </span>
            </div>

            {/* PRODUCT GRID OR SKELETON OR EMPTY STATE */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 min-[901px]:grid-cols-3 min-[1280px]:grid-cols-4 gap-x-6 gap-y-10">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 min-[901px]:grid-cols-3 min-[1280px]:grid-cols-4 gap-x-6 gap-y-10">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} rate_999={rate999} />
                ))}
              </div>
            ) : (
              /* NO PRODUCTS FOUND EMPTY STATE */
              <div className="flex flex-col items-center justify-center py-20 text-center px-4 bg-[#F9F9F9] rounded-lg border border-[#F3F1EC]">
                <div className="w-14 h-14 rounded-full bg-[#F3F1EC] flex items-center justify-center mb-6 text-[#CDB38B]">
                  <RotateCcw className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="font-cormorant font-normal text-[24px] sm:text-[28px] text-[#2E3135] mb-3">
                  No Pieces Found
                </h3>
                <p className="font-inter font-light text-[14px] text-[#888888] max-w-[340px] mb-8 leading-relaxed">
                  We could not find any jewelry matching your current filter choices. Adjust filters or reset them.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-3 bg-[#2E3135] text-white font-inter font-medium text-[11px] tracking-[1.5px] uppercase hover:bg-[#CDB38B] transition-colors duration-300"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />

      {/* MOBILE DRAWER DIALOG / SIDE SHEET */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex min-[901px]:hidden">
          {/* Backdrop blur overlay */}
          <div
            onClick={() => setIsMobileDrawerOpen(false)}
            className="fixed inset-0 bg-[#2E3135]/40 backdrop-blur-sm transition-opacity duration-300"
          ></div>

          {/* Drawer content panel */}
          <div className="fixed top-0 left-0 bottom-0 w-[85%] max-w-[360px] bg-white p-6 shadow-2xl flex flex-col justify-between z-50 animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-[#F3F1EC] mb-6">
              <span className="font-inter font-medium text-[14px] uppercase tracking-wider text-[#2E3135]">
                Filters & Sort
              </span>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="p-1 hover:text-[#CDB38B] transition-colors text-[#2E3135]"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Filters Content */}
            <div className="flex-grow overflow-y-auto pr-1 space-y-2">
              {renderFilters()}
            </div>

            {/* Sticky bottom CTA actions */}
            <div className="pt-4 border-t border-[#F3F1EC] mt-6 flex gap-4">
              <button
                onClick={() => {
                  handleResetFilters();
                  setIsMobileDrawerOpen(false);
                }}
                className="w-1/2 py-3 border border-[#2E3135] text-[#2E3135] font-inter font-medium text-[11px] tracking-wider uppercase hover:bg-[#F3F1EC] transition-colors text-center"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-1/2 py-3 bg-[#2E3135] text-white font-inter font-medium text-[11px] tracking-wider uppercase hover:bg-[#CDB38B] transition-colors text-center"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopInner />
    </Suspense>
  );
}
