"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Search } from "lucide-react";
import useDebounce from "@/lib/useDebounce";
import { supabase, mapSupabaseProduct } from "@/lib/supabase";
import { calculateProductPrice } from "@/lib/priceUtils";
import { CATEGORIES } from "@/lib/constants";

export default function SearchOverlay({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 350);
  const [results, setResults] = useState([]);
  const [categoryMatches, setCategoryMatches] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [goldRate, setGoldRate] = useState(null);

  // Fetch gold rate on mount
  useEffect(() => {
    async function fetchGoldRate() {
      const { data } = await supabase
        .from("gold_rates")
        .select("rate_999")
        .eq("id", 1)
        .maybeSingle();
      if (data) {
        setGoldRate(data.rate_999);
      }
    }
    fetchGoldRate();
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset state when opened/closed
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm("");
      setResults([]);
      setCategoryMatches([]);
      setIsSearching(false);
    }
  }, [isOpen]);

  // Prevent background scrolling when open
  // This is in addition to whatever Navbar might do, to ensure search is safe
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    // We don't blindly unset it to "", as mobile menu might be open, but typically they are exclusive.
    // Navbar will handle its own, so setting to hidden and reverting should be safe enough here.
    return () => {
      if (isOpen) {
         document.body.style.overflow = "";
      }
    };
  }, [isOpen]);

  // Perform live search
  useEffect(() => {
    async function performSearch() {
      if (!debouncedSearchTerm.trim()) {
        setResults([]);
        setCategoryMatches([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      
      const lowerSearch = debouncedSearchTerm.toLowerCase();
      const matchedCats = CATEGORIES.filter(c => 
        c.name.toLowerCase().includes(lowerSearch) || 
        c.slug.toLowerCase().includes(lowerSearch)
      );
      setCategoryMatches(matchedCats);

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("is_active", true)
        .ilike("name", `%${debouncedSearchTerm}%`)
        .limit(8);

      if (error) {
        console.error("Error searching products:", error);
        setResults([]);
      } else if (data) {
        const mappedResults = data.map(mapSupabaseProduct).map(p => ({
          ...p,
          livePrice: calculateProductPrice(p, goldRate).price
        }));
        setResults(mappedResults);
      }
      setIsSearching(false);
    }

    performSearch();
  }, [debouncedSearchTerm, goldRate]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-[100] bg-[#2E3135]/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Search Panel */}
      <div className="fixed top-0 left-0 w-full z-[101] flex justify-center pt-10 px-4 sm:px-6 pointer-events-none">
        <div className="bg-white w-full max-w-3xl rounded-sm shadow-2xl p-6 pointer-events-auto max-h-[85vh] flex flex-col border border-[#F3F1EC]">
          
          {/* Header & Input */}
          <div className="flex items-center border-b border-[#F3F1EC] pb-4 mb-4">
            <Search className="w-5 h-5 text-[#2E3135]/40 mr-3 shrink-0" />
            <input 
              type="text"
              autoFocus
              placeholder="Search for jewellery..."
              className="flex-1 text-lg md:text-xl text-[#2E3135] bg-transparent outline-none placeholder:text-[#2E3135]/30 font-medium font-sans"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              onClick={onClose}
              className="p-2 ml-2 text-[#2E3135]/50 hover:text-[#2E3135] transition-colors duration-200"
              aria-label="Close search"
            >
              <X className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>

          {/* Results Area */}
          <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
            {isSearching && (
              <div className="py-12 flex justify-center items-center">
                <div className="w-5 h-5 border-2 border-[#CDB38B]/30 border-t-[#CDB38B] rounded-full animate-spin"></div>
              </div>
            )}

            {!isSearching && searchTerm.trim() && results.length === 0 && categoryMatches.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-sm font-medium text-[#2E3135]">No products found</p>
                <p className="text-xs text-[#2E3135]/50 mt-1">Try checking for spelling errors or using different keywords.</p>
              </div>
            )}

            {!isSearching && (categoryMatches.length > 0 || results.length > 0) && (
              <div className="space-y-6">
                
                {categoryMatches.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-semibold tracking-widest text-[#2E3135]/40 uppercase mb-3">Categories</h3>
                    {categoryMatches.map((category) => (
                      <Link 
                        key={category.slug} 
                        href={`/shop?category=${category.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-4 p-2 -mx-2 rounded hover:bg-[#F9F8F6] transition-colors group"
                      >
                        <div className="w-[50px] h-[50px] bg-[#F3F1EC] shrink-0 overflow-hidden flex items-center justify-center">
                          {category.image ? (
                            <img 
                              src={category.image} 
                              alt={category.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                            />
                          ) : (
                            <Search className="w-5 h-5 text-[#2E3135]/40" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] font-medium text-[#2E3135] truncate">{category.name}</h4>
                          <p className="text-[11px] text-[#2E3135]/60 mt-0.5">Shop all {category.name.toLowerCase()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {results.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-[10px] font-semibold tracking-widest text-[#2E3135]/40 uppercase mb-3">Products</h3>
                    {results.map((product) => (
                      <Link 
                        key={product.id} 
                        href={`/shop/${product.slug}`}
                        onClick={onClose}
                        className="flex items-center gap-4 p-2 -mx-2 rounded hover:bg-[#F9F8F6] transition-colors group"
                      >
                        <div className="w-[50px] h-[50px] bg-[#F3F1EC] shrink-0 overflow-hidden">
                          {product.image && (
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-[13px] font-medium text-[#2E3135] truncate">{product.name}</h4>
                          <p className="text-[11px] text-[#2E3135]/60 mt-0.5 capitalize">{product.category}</p>
                        </div>
                        <div className="text-[13px] font-medium text-[#2E3135] whitespace-nowrap">
                          {product.livePrice}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </>
  );
}
