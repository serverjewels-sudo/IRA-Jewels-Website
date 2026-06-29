"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const categories = [
  "rings",
  "necklaces",
  "bangles",
  "earrings",
  "bracelets",
  "pendants",
  "chains",
  "mangalsutra",
  "sets",
  "anklets",
  "nose pins"
];

const karats = ["14K", "18K", "22K"];

export default function ProductForm({ productId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!productId);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("rings");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [karat, setKarat] = useState("14K");
  const [metalType, setMetalType] = useState("yellow gold");
  const [stoneType, setStoneType] = useState("lab diamond");
  const [weight, setWeight] = useState("");
  const [stock, setStock] = useState("0");
  const [description, setDescription] = useState("");
  const [sizesStr, setSizesStr] = useState("");
  const [coloursStr, setColoursStr] = useState("");
  const [imagesStr, setImagesStr] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Validation States
  const [validated, setValidated] = useState(false);

  // Fetch product data if editing
  useEffect(() => {
    if (!productId) return;

    async function loadProduct() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        const response = await fetch(`/api/admin/products?id=${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const p = await response.json();
          setName(p.name || "");
          setCategory(p.category || "rings");
          setPrice(p.price !== undefined ? String(p.price) : "");
          setComparePrice(p.compare_price !== undefined && p.compare_price !== null ? String(p.compare_price) : "");
          setKarat(p.karat || "14K");
          setMetalType(p.metal_type || "");
          setStoneType(p.stone_type || "");
          setWeight(p.weight_grams !== undefined && p.weight_grams !== null ? String(p.weight_grams) : "");
          setStock(p.stock_quantity !== undefined ? String(p.stock_quantity) : "0");
          setDescription(p.description || "");
          
          if (Array.isArray(p.size_options)) {
            setSizesStr(p.size_options.join(", "));
          }
          if (Array.isArray(p.colour_options)) {
            setColoursStr(p.colour_options.join(", "));
          }
          if (Array.isArray(p.images)) {
            setImagesStr(p.images.join(", "));
          }

          setIsFeatured(!!p.is_featured);
          setIsActive(p.is_active !== undefined ? !!p.is_active : true);
        } else {
          setErrorMsg("Could not load product details. It may have been deleted.");
        }
      } catch (err) {
        console.error("Error loading product:", err);
        setErrorMsg("An unexpected error occurred while fetching details.");
      } finally {
        setFetching(false);
      }
    }

    loadProduct();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidated(true);
    setErrorMsg("");

    // Required field validation
    if (!name || !category || !price) {
      return;
    }

    setLoading(true);

    // Prepare payload
    const sizes = sizesStr
      ? sizesStr.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
    const colours = coloursStr
      ? coloursStr.split(",").map((c) => c.trim()).filter(Boolean)
      : [];
    const images = imagesStr
      ? imagesStr.split(",").map((i) => i.trim()).filter(Boolean)
      : [];

    const payload = {
      name,
      category,
      price: parseFloat(price),
      compare_price: comparePrice ? parseFloat(comparePrice) : null,
      karat,
      metal_type: metalType,
      stone_type: stoneType,
      weight_grams: weight ? parseFloat(weight) : null,
      stock_quantity: parseInt(stock) || 0,
      description,
      size_options: sizes,
      colour_options: colours,
      images,
      is_featured: isFeatured,
      is_active: isActive,
    };

    if (productId) {
      payload.id = productId;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const url = "/api/admin/products";
      const method = productId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/admin/products");
      } else {
        const errData = await response.json();
        setErrorMsg(errData.error || "Failed to save product.");
      }
    } catch (err) {
      console.error("Error saving product:", err);
      setErrorMsg("Failed to connect to the database API.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-[#2E3135]/5 p-8 animate-pulse space-y-6">
        <div className="h-8 bg-[#F3F1EC] rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-12 bg-[#F3F1EC] rounded"></div>
          <div className="h-12 bg-[#F3F1EC] rounded"></div>
          <div className="h-12 bg-[#F3F1EC] rounded"></div>
          <div className="h-12 bg-[#F3F1EC] rounded"></div>
        </div>
        <div className="h-32 bg-[#F3F1EC] rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-[#2E3135]/5 p-8 max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {errorMsg && (
          <div className="text-red-600 text-[13px] font-inter py-3 px-4 bg-red-50 rounded border border-red-100">
            {errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="flex flex-col space-y-1.5 md:col-span-2">
            <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Solitaire Diamond Ring"
              className={`w-full px-4 py-2.5 border rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all ${
                validated && !name ? "border-red-400 focus:border-red-400" : "border-[#E5E5E5]"
              }`}
            />
          </div>

          {/* Category */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E5E5E5] bg-white rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all cursor-pointer capitalize"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Karat */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
              Karat
            </label>
            <select
              value={karat}
              onChange={(e) => setKarat(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#E5E5E5] bg-white rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all cursor-pointer"
            >
              {karats.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
              Price (₹) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 18500"
              className={`w-full px-4 py-2.5 border rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all ${
                validated && !price ? "border-red-400" : "border-[#E5E5E5]"
              }`}
            />
          </div>

          {/* Compare Price */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
              Compare Price (Original Crossed-out, ₹)
            </label>
            <input
              type="number"
              min="0"
              value={comparePrice}
              onChange={(e) => setComparePrice(e.target.value)}
              placeholder="e.g. 22000"
              className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all"
            />
          </div>

          {/* Metal Type */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
              Metal Type
            </label>
            <input
              type="text"
              value={metalType}
              onChange={(e) => setMetalType(e.target.value)}
              placeholder="e.g. white gold"
              className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all"
            />
          </div>

          {/* Stone Type */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
              Stone Type
            </label>
            <input
              type="text"
              value={stoneType}
              onChange={(e) => setStoneType(e.target.value)}
              placeholder="e.g. lab diamond"
              className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all"
            />
          </div>

          {/* Weight */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
              Weight in grams
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 2.3"
              className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all"
            />
          </div>

          {/* Stock */}
          <div className="flex flex-col space-y-1.5">
            <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
              Stock Quantity
            </label>
            <input
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="e.g. 50"
              className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all"
            />
          </div>

          {/* Size Options */}
          <div className="flex flex-col space-y-1.5 md:col-span-2">
            <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
              Size Options (comma separated)
            </label>
            <input
              type="text"
              value={sizesStr}
              onChange={(e) => setSizesStr(e.target.value)}
              placeholder="e.g. 5, 6, 7, 8"
              className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all"
            />
          </div>

          {/* Colour Options */}
          <div className="flex flex-col space-y-1.5 md:col-span-2">
            <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
              Colour Options (comma separated)
            </label>
            <input
              type="text"
              value={coloursStr}
              onChange={(e) => setColoursStr(e.target.value)}
              placeholder="e.g. White Gold, Yellow Gold, Rose Gold"
              className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all"
            />
          </div>

          {/* Image URLs */}
          <div className="flex flex-col space-y-1.5 md:col-span-2">
            <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
              Image URLs (comma separated)
            </label>
            <input
              type="text"
              value={imagesStr}
              onChange={(e) => setImagesStr(e.target.value)}
              placeholder="e.g. https://domain.com/img1.jpg, https://domain.com/img2.jpg"
              className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col space-y-1.5 md:col-span-2">
            <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
              Description
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the jewellery item..."
              className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all resize-none"
            />
          </div>

          {/* Toggles */}
          <div className="flex items-center space-x-6 md:col-span-2 py-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-[#E5E5E5] text-[#CDB38B] focus:ring-[#CDB38B] cursor-pointer"
              />
              <span className="font-inter text-[12px] font-semibold text-[#2E3135]/80 uppercase tracking-wide">
                Is Featured Product
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4.5 h-4.5 rounded border-[#E5E5E5] text-[#CDB38B] focus:ring-[#CDB38B] cursor-pointer"
              />
              <span className="font-inter text-[12px] font-semibold text-[#2E3135]/80 uppercase tracking-wide">
                Is Active (Visible in Shop)
              </span>
            </label>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center gap-4 pt-4 border-t border-[#2E3135]/10">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3.5 bg-[#2E3135] hover:bg-[#CDB38B] text-white font-inter text-[11px] font-semibold tracking-[1.5px] uppercase rounded transition-all duration-300 flex items-center justify-center min-w-[120px] disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              "Save Product"
            )}
          </button>
          
          <button
            type="button"
            onClick={() => router.push("/admin/products")}
            className="px-6 py-3.5 bg-white border border-[#2E3135] text-[#2E3135] hover:bg-[#F3F1EC] font-inter text-[11px] font-semibold tracking-[1.5px] uppercase rounded transition-all duration-300"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
