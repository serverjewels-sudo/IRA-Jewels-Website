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

const categoryPrefixMap = {
  "rings": "RIN",
  "necklaces": "NEC",
  "bangles": "BNG",
  "earrings": "EAR",
  "bracelets": "BRA",
  "pendants": "PEN",
  "chains": "CHN",
  "mangalsutra": "MNG",
  "sets": "SET",
  "anklets": "ANK",
  "nose pins": "NSP"
};

function getSkuPrefix(categoryName) {
  if (!categoryName) return "GEN";
  const clean = categoryName.toLowerCase().trim();
  return categoryPrefixMap[clean] || "GEN";
}

function ImageUploadBox({ label, index, currentUrl, setImages, isRequired }) {
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImages((prev) => {
          const newImages = [...prev];
          newImages[index] = data.url;
          return newImages;
        });
      } else {
        const errData = await response.json();
        setErrorMsg(errData.error || "Upload failed");
        alert(errData.error || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setErrorMsg("Network error");
      alert("Network error");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (e) => {
    e.preventDefault();
    setImages((prev) => {
      const newImages = [...prev];
      newImages[index] = "";
      return newImages;
    });
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="font-inter text-[10px] font-semibold tracking-wider text-[#2E3135]/60 uppercase text-center min-h-[30px] flex items-center justify-center">
        {label} {isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      <div className="relative aspect-square border-2 border-dashed border-[#E5E5E5] rounded-md flex flex-col items-center justify-center bg-[#FBFBFA] overflow-hidden group hover:border-[#CDB38B] transition-colors">
        {uploading ? (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-5 h-5 border-2 border-[#CDB38B]/20 border-t-[#CDB38B] rounded-full animate-spin"></div>
            <span className="font-inter text-[10px] text-[#888] uppercase tracking-widest">Uploading...</span>
          </div>
        ) : currentUrl ? (
          <>
            <img src={currentUrl} alt={label} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <label className="cursor-pointer px-4 py-2 bg-white text-[#2E3135] font-inter text-[11px] uppercase tracking-wider font-semibold hover:bg-[#F3F1EC] transition-colors mb-2">
                Change
                <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} />
              </label>
              <button onClick={handleRemove} className="text-white font-inter text-[11px] uppercase tracking-wider hover:text-red-400 transition-colors">
                Remove
              </button>
            </div>
          </>
        ) : (
          <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-[#888] hover:text-[#CDB38B] transition-colors">
            <svg className="w-6 h-6 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
            <span className="font-inter text-[10px] uppercase tracking-widest">Select File</span>
            <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp" onChange={handleFileChange} />
          </label>
        )}
      </div>
    </div>
  );
}

export default function ProductForm({ productId }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!productId);
  const [errorMsg, setErrorMsg] = useState("");
  
  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("rings");
  const [sku, setSku] = useState("");
  const [styleNumber, setStyleNumber] = useState("");
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
  const [images, setImages] = useState(["", "", "", ""]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Helper to query and generate SKU
  const generateSkuForCategory = async (cat) => {
    try {
      const prefix = getSkuPrefix(cat);
      const { count, error } = await supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .ilike("sku", `${prefix}-%`);

      if (error) {
        console.error("Error fetching SKU count:", error);
        return `${prefix}-0001`;
      }

      const nextNum = (count || 0) + 1;
      const formattedNum = String(nextNum).padStart(4, "0");
      return `${prefix}-${formattedNum}`;
    } catch (err) {
      console.error("Error generating SKU:", err);
      const prefix = getSkuPrefix(cat);
      return `${prefix}-0001`;
    }
  };

  // Auto-generate SKU when category changes (only on Add Product mode)
  useEffect(() => {
    if (productId) return; // do NOT regenerate on edit page
    
    let isMounted = true;
    async function updateSku() {
      const generated = await generateSkuForCategory(category);
      if (isMounted) {
        setSku(generated);
      }
    }
    updateSku();
    return () => {
      isMounted = false;
    };
  }, [category, productId]);

  // New Gold Rate Pricing Fields State
  const [netGoldWeight, setNetGoldWeight] = useState("");
  const [diamondNetAmount, setDiamondNetAmount] = useState("0");
  const [makingNetAmount, setMakingNetAmount] = useState("0");
  const [otherNetAmount, setOtherNetAmount] = useState("0");
  const [gstPercentage, setGstPercentage] = useState("");

  // Reference rates fetched from DB
  const [rate999, setRate999] = useState(0);

  // Validation States
  const [validated, setValidated] = useState(false);

  // Fetch reference gold rates and default GST on load
  useEffect(() => {
    async function fetchGoldRates() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) return;

        const response = await fetch("/api/admin/gold-rate", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setRate999(data.rate_999 || 0);
          
          // Pre-fill GST% on load for ADD mode only
          if (!productId && data.gst_default !== undefined && data.gst_default !== null) {
            setGstPercentage(String(data.gst_default));
          }
        }
      } catch (err) {
        console.error("Error loading reference gold rates:", err);
      }
    }

    fetchGoldRates();
  }, [productId]);

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
          setSku(p.sku || "");
          setStyleNumber(p.style_number || "");
          setPrice(p.price !== undefined ? String(p.price) : "");
          setComparePrice(p.compare_price !== undefined && p.compare_price !== null ? String(p.compare_price) : "");
          setKarat(p.karat || "14K");
          setMetalType(p.metal_type || "");
          setStoneType(p.stone_type || "");
          setWeight(p.weight_grams !== undefined && p.weight_grams !== null ? String(p.weight_grams) : "");
          setStock(p.stock_quantity !== undefined ? String(p.stock_quantity) : "0");
          setDescription(p.description || "");
          
          // Load new fields
          setNetGoldWeight(p.net_gold_weight !== undefined && p.net_gold_weight !== null ? String(p.net_gold_weight) : "");
          setDiamondNetAmount(p.diamond_net_amount !== undefined && p.diamond_net_amount !== null ? String(p.diamond_net_amount) : "0");
          setMakingNetAmount(p.making_net_amount !== undefined && p.making_net_amount !== null ? String(p.making_net_amount) : "0");
          setOtherNetAmount(p.other_net_amount !== undefined && p.other_net_amount !== null ? String(p.other_net_amount) : "0");
          setGstPercentage(p.gst_percentage !== undefined && p.gst_percentage !== null ? String(p.gst_percentage) : "");
          
          if (Array.isArray(p.size_options)) {
            setSizesStr(p.size_options.join(", "));
          }
          if (Array.isArray(p.colour_options)) {
            setColoursStr(p.colour_options.join(", "));
          }
          if (Array.isArray(p.images)) {
            setImages([
              p.images[0] || "",
              p.images[1] || "",
              p.images[2] || "",
              p.images[3] || ""
            ]);
          } else {
            setImages(["", "", "", ""]);
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
    
    // Keep empty strings to preserve image positions
    const imagesPayload = images.map(img => img ? img.trim() : "");

    const payload = {
      name,
      category,
      sku,
      style_number: styleNumber || null,
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
      images: imagesPayload,
      is_featured: isFeatured,
      is_active: isActive,
      net_gold_weight: netGoldWeight ? parseFloat(netGoldWeight) : null,
      diamond_net_amount: diamondNetAmount ? parseFloat(diamondNetAmount) : 0,
      making_net_amount: makingNetAmount ? parseFloat(makingNetAmount) : 0,
      other_net_amount: otherNetAmount ? parseFloat(otherNetAmount) : 0,
      gst_percentage: gstPercentage ? parseFloat(gstPercentage) : null,
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
        
        // Handle SKU collision
        if (errData.error && (errData.error.toLowerCase().includes("sku") || errData.error.toLowerCase().includes("duplicate key"))) {
          if (!productId) {
            const freshSku = await generateSkuForCategory(category);
            setSku(freshSku);
            setErrorMsg("SKU collision detected. A new SKU has been generated. Please review and try saving again.");
          }
        }
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

  // Calculations for Live Preview
  const karatMultiplier = karat === "22K" ? 22 : karat === "18K" ? 18 : 14;
  const karatRate = rate999 ? (rate999 / 24) * karatMultiplier : 0;
  
  const weightVal = parseFloat(netGoldWeight) || 0;
  const goldAmount = weightVal * karatRate;
  
  const diamondVal = parseFloat(diamondNetAmount) || 0;
  const makingVal = parseFloat(makingNetAmount) || 0;
  const otherVal = parseFloat(otherNetAmount) || 0;
  const gstPctVal = parseFloat(gstPercentage) || 0;
  
  const subtotal = goldAmount + diamondVal + makingVal + otherVal;
  const gstAmount = subtotal * (gstPctVal / 100);
  const finalPrice = subtotal + gstAmount;

  return (
    <form onSubmit={handleSubmit} className="max-w-6xl space-y-6">
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md font-inter text-[13px]">
          {errorMsg}
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-[#2E3135]/5 p-8 space-y-6">
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

            {/* SKU (Auto-Generated) */}
            <div className="flex flex-col space-y-1.5">
              <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
                SKU (Auto-Generated)
              </label>
              <input
                type="text"
                readOnly
                value={sku}
                placeholder="Auto-generating..."
                className="w-full px-4 py-2.5 border border-[#E5E5E5] bg-[#FBFBFA] rounded-md font-inter text-[13px] text-gray-500 focus:outline-none cursor-not-allowed"
              />
            </div>

            {/* Style Number */}
            <div className="flex flex-col space-y-1.5">
              <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
                Style Number
              </label>
              <input
                type="text"
                value={styleNumber}
                onChange={(e) => setStyleNumber(e.target.value)}
                placeholder="e.g. your internal style/reference number"
                className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all"
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
                Price (Legacy/Manual) (₹) <span className="text-red-500">*</span>
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

            {/* Section Divider */}
            <div className="md:col-span-2 border-t border-[#2E3135]/10 pt-6">
              <h3 className="font-serif font-normal text-[18px] tracking-wide text-[#2E3135] uppercase mb-1">
                Gold Rate Pricing Settings
              </h3>
              <p className="font-inter text-[12px] text-[#888888] mb-4 font-light">
                Configure weights and individual component costs. The final calculated price is displayed in the live preview panel on the right.
              </p>
            </div>

            {/* Net Gold Weight (grams) */}
            <div className="flex flex-col space-y-1.5">
              <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
                Net Gold Weight (grams)
              </label>
              <input
                type="number"
                step="0.001"
                min="0"
                value={netGoldWeight}
                onChange={(e) => setNetGoldWeight(e.target.value)}
                placeholder="e.g. 5.25"
                className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all"
              />
            </div>

            {/* Diamond Net Amount */}
            <div className="flex flex-col space-y-1.5">
              <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
                Diamond Net Amount (₹)
              </label>
              <input
                type="number"
                min="0"
                value={diamondNetAmount}
                onChange={(e) => setDiamondNetAmount(e.target.value)}
                placeholder="e.g. 0"
                className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all"
              />
            </div>

            {/* Making Net Amount */}
            <div className="flex flex-col space-y-1.5">
              <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
                Making Net Amount (₹)
              </label>
              <input
                type="number"
                min="0"
                value={makingNetAmount}
                onChange={(e) => setMakingNetAmount(e.target.value)}
                placeholder="e.g. 0"
                className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all"
              />
            </div>

            {/* Other Net Amount */}
            <div className="flex flex-col space-y-1.5">
              <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
                Other Net Amount (₹)
              </label>
              <input
                type="number"
                min="0"
                value={otherNetAmount}
                onChange={(e) => setOtherNetAmount(e.target.value)}
                placeholder="e.g. 0"
                className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all"
              />
            </div>

            {/* GST % */}
            <div className="flex flex-col space-y-1.5">
              <label className="font-inter text-[11px] font-semibold tracking-wider text-[#2E3135]/60 uppercase">
                GST %
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={gstPercentage}
                onChange={(e) => setGstPercentage(e.target.value)}
                placeholder="e.g. 3"
                className="w-full px-4 py-2.5 border border-[#E5E5E5] rounded-md font-inter text-[13px] focus:outline-none focus:border-[#CDB38B] transition-all"
              />
            </div>

            {/* Section Divider for Attributes */}
            <div className="md:col-span-2 border-t border-[#2E3135]/10 pt-6">
              <h3 className="font-serif font-normal text-[18px] tracking-wide text-[#2E3135] uppercase mb-1">
                Product Attributes & Details
              </h3>
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

            {/* Product Images (4 Slots) */}
            <div className="md:col-span-2 border-t border-[#2E3135]/10 pt-6">
              <h3 className="font-serif font-normal text-[18px] tracking-wide text-[#2E3135] uppercase mb-1">
                Product Images
              </h3>
              <p className="font-inter text-[12px] text-[#888888] mb-4 font-light">
                Upload up to 4 images for this product. The main image is required.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ImageUploadBox 
                  label="Main Image (Front View)"
                  index={0}
                  currentUrl={images[0]}
                  setImages={setImages}
                  isRequired={true}
                />
                <ImageUploadBox 
                  label="Close-Up / Detail Shot"
                  index={1}
                  currentUrl={images[1]}
                  setImages={setImages}
                  isRequired={false}
                />
                <ImageUploadBox 
                  label="Side View"
                  index={2}
                  currentUrl={images[2]}
                  setImages={setImages}
                  isRequired={false}
                />
                <ImageUploadBox 
                  label="Worn / Lifestyle Shot"
                  index={3}
                  currentUrl={images[3]}
                  setImages={setImages}
                  isRequired={false}
                />
              </div>
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
        </div>

        {/* Right Column: Live Price Preview (Sticky) */}
        <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-[#2E3135]/5 p-6 space-y-6">
            <h3 className="font-serif font-normal text-[20px] tracking-wide text-[#2E3135] uppercase pb-3 border-b border-[#2E3135]/10">
              Live Price Preview
            </h3>
            
            <div className="space-y-4 font-inter text-[13px]">
              {/* Reference rates info */}
              <div className="flex justify-between items-center text-[#888888] font-light">
                <span>Ref Gold Rate (999):</span>
                <span className="font-medium text-[#2E3135]">
                  ₹{(rate999 || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/g
                </span>
              </div>

              <div className="flex justify-between items-center text-[#888888] font-light">
                <span>Ref Karat Rate ({karat}):</span>
                <span className="font-medium text-[#2E3135]">
                  ₹{karatRate.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/g
                </span>
              </div>
              
              <hr className="border-[#2E3135]/5" />

              {/* Gold Amount Breakdown */}
              <div className="flex justify-between items-center">
                <span className="text-[#2E3135]/70">Gold Amount:</span>
                <span className="font-medium text-[#2E3135]">
                  ₹{goldAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-[11px] text-[#888888] font-light -mt-2">
                ({weightVal} g × ₹{karatRate.toFixed(2)}/g)
              </div>

              {/* Diamond Amount */}
              <div className="flex justify-between items-center">
                <span className="text-[#2E3135]/70">Diamond Net Amount:</span>
                <span className="font-medium text-[#2E3135]">
                  ₹{diamondVal.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Making Amount */}
              <div className="flex justify-between items-center">
                <span className="text-[#2E3135]/70">Making Net Amount:</span>
                <span className="font-medium text-[#2E3135]">
                  ₹{makingVal.toLocaleString("en-IN")}
                </span>
              </div>

              {/* Other Amount */}
              <div className="flex justify-between items-center">
                <span className="text-[#2E3135]/70">Other Net Amount:</span>
                <span className="font-medium text-[#2E3135]">
                  ₹{otherVal.toLocaleString("en-IN")}
                </span>
              </div>

              <hr className="border-[#2E3135]/5" />

              {/* Subtotal */}
              <div className="flex justify-between items-center font-medium">
                <span className="text-[#2E3135]">Subtotal:</span>
                <span className="text-[#2E3135]">
                  ₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* GST Amount */}
              <div className="flex justify-between items-center text-[#888888] font-light">
                <span>GST Amount ({gstPctVal}%):</span>
                <span className="font-medium text-[#2E3135]">
                  ₹{gstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="border-t border-[#2E3135]/10 pt-4 mt-2">
                <div className="flex flex-col space-y-1">
                  <span className="font-serif text-[12px] font-normal text-[#2E3135]/60 uppercase tracking-wider">Final Calculated Price:</span>
                  <span className="font-serif text-[28px] font-semibold text-[#2E3135] leading-none">
                    ₹{finalPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <p className="text-[11px] text-[#888888] font-light mt-4 italic">
                  Note: This preview updates live and shows calculations for verification. Save the product to persist changes.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </form>
  );
}
