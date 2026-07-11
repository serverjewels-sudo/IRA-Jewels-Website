'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Heart, ShoppingBag, Truck, ShieldCheck, RefreshCw, Star, ChevronRight, ChevronDown, Minus, Plus } from 'lucide-react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useCart } from '@/lib/CartContext'
import { supabase, mapSupabaseProduct } from '@/lib/supabase'
import { sampleProducts } from '@/lib/products'
import ReviewSection from '@/components/product/ReviewSection'
import { calculateProductPrice } from '@/lib/priceUtils'

export default function ProductDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [rate999, setRate999] = useState(null)
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false)
  const [isSizeOpen, setIsSizeOpen] = useState(false)
  const [isKaratOpen, setIsKaratOpen] = useState(false)
  
  // Selected options state
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColour, setSelectedColour] = useState(null)
  const [selectedKarat, setSelectedKarat] = useState(null)
  const [quantity, setQuantity] = useState(1)
  
  // Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [cartStatus, setCartStatus] = useState("ADD TO CART")
  const [reviewsStats, setReviewsStats] = useState({ count: 0, average: 0 })
  
  // Fetch product from Supabase (or local fallback)
  useEffect(() => {
    if (!slug) return

    async function fetchProductAndGoldRate() {
      try {
        setLoading(true)

        // Fetch gold rate
        const ratePromise = supabase
          .from("gold_rates")
          .select("rate_999")
          .eq("id", 1)
          .maybeSingle();

        // Fetch product
        const productPromise = supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .single()

        const [productRes, rateRes] = await Promise.all([productPromise, ratePromise]);

        if (rateRes.error) {
          console.error("Error fetching gold rate:", rateRes.error);
        } else if (rateRes.data) {
          setRate999(rateRes.data.rate_999);
        }

        const { data, error } = productRes;
        
        if (error || !data) {
          console.log('[ProductDetail] Supabase fetch error or no data. Checking fallback sample products...')
          const fallbackProduct = sampleProducts.find(p => p.slug === slug)
          if (fallbackProduct) {
            setProduct(fallbackProduct)
            // Pre-select first options if available
            setSelectedSize(fallbackProduct.size_options?.[0] || null)
            setSelectedColour(fallbackProduct.colour_variants?.[0]?.colour || fallbackProduct.colour_options?.[0] || null)
            setSelectedKarat(fallbackProduct.karat || null)
          } else {
            setProduct(null)
          }
        } else {
          const mapped = mapSupabaseProduct(data)
          setProduct(mapped)
          // Pre-select first options if available
          setSelectedSize(mapped.size_options?.[0] || null)
          setSelectedColour(mapped.colour_variants?.[0]?.colour || mapped.colour_options?.[0] || null)
          setSelectedKarat(mapped.karat || null)
        }
      } catch (err) {
        console.error('[ProductDetail] Unexpected fetch error:', err)
        // Fallback check
        const fallbackProduct = sampleProducts.find(p => p.slug === slug)
        if (fallbackProduct) {
          setProduct(fallbackProduct)
          setSelectedSize(fallbackProduct.size_options?.[0] || null)
          setSelectedColour(fallbackProduct.colour_variants?.[0]?.colour || fallbackProduct.colour_options?.[0] || null)
          setSelectedKarat(fallbackProduct.karat || null)
        } else {
          setProduct(null)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchProductAndGoldRate()
  }, [slug])

  // Fetch reviews count and average rating
  useEffect(() => {
    if (!product?.id) return

    async function fetchReviewStats() {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('rating')
          .eq('product_id', product.id)
          .eq('is_approved', true)
        
        if (!error && data) {
          const count = data.length
          const average = count > 0 
            ? data.reduce((sum, r) => sum + r.rating, 0) / count 
            : 0
          setReviewsStats({ count, average })
        }
      } catch (err) {
        console.error('[ProductDetail] fetch stats error:', err)
      }
    }

    fetchReviewStats()
  }, [product?.id])

  // Sync wishlist status
  useEffect(() => {
    if (!product) return

    const checkWishlist = () => {
      try {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem("ira-wishlist")
          if (stored) {
            const list = JSON.parse(stored)
            if (Array.isArray(list)) {
              setIsWishlisted(list.some(id => String(id) === String(product.id)))
              return
            }
          }
        }
        setIsWishlisted(false)
      } catch (err) {
        console.error("Error reading wishlist:", err)
        setIsWishlisted(false)
      }
    }

    checkWishlist()

    if (typeof window !== 'undefined') {
      window.addEventListener("wishlist-updated", checkWishlist)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener("wishlist-updated", checkWishlist)
      }
    }
  }, [product])

  // Dynamic SEO Page Title
  useEffect(() => {
    if (product && typeof window !== 'undefined') {
      document.title = `${product.name} | TATVAAN`
    }
  }, [product])

  // Quantity helpers
  const increaseQty = () => setQuantity(prev => prev + 1)
  const decreaseQty = () => setQuantity(prev => prev > 1 ? prev - 1 : 1)

  // Add to Wishlist toggle
  const toggleWishlist = () => {
    if (!product) return

    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem("ira-wishlist")
        let list = stored ? JSON.parse(stored) : []
        if (!Array.isArray(list)) list = []

        const productIdStr = String(product.id)
        const isCurrentlyWishlisted = list.some(id => String(id) === productIdStr)

        if (isCurrentlyWishlisted) {
          list = list.filter(id => String(id) !== productIdStr)
        } else {
          list.push(product.id)
        }

        localStorage.setItem("ira-wishlist", JSON.stringify(list))
        setIsWishlisted(!isCurrentlyWishlisted)

        // Dispatch custom event to notify components
        window.dispatchEvent(new Event("wishlist-updated"))
      }
    } catch (err) {
      console.error("Error saving wishlist:", err)
    }
  }

  // Add to Cart handler
  const handleAddToCart = () => {
    if (!product) return

    // Call addToCart multiple times if quantity > 1
    for (let i = 0; i < quantity; i++) {
      addToCart(product, selectedSize, selectedColour, selectedKarat)
    }

    setCartStatus("ADDED TO CART ✓")
    setTimeout(() => {
      setCartStatus("ADD TO CART")
    }, 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-[#2E3135]">
        <Navbar />
        <div className="flex-grow flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-2 border-[#CDB38B]/20 border-t-[#CDB38B] rounded-full animate-spin"></div>
            <p className="font-inter text-xs tracking-[2px] text-[#888] uppercase">Loading Masterpiece...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-[#2E3135]">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <h1 className="font-serif text-4xl mb-4 text-[#2E3135]">Masterpiece Not Found</h1>
          <p className="text-gray-500 mb-8 max-w-md text-sm leading-relaxed">
            The jewelry piece you are looking for might have been moved or is currently out of stock.
          </p>
          <Link 
            href="/shop" 
            className="px-8 py-3.5 bg-[#2E3135] text-white font-inter text-[11px] tracking-[2px] uppercase transition-opacity duration-300 hover:opacity-90"
          >
            Back to Collection
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const overriddenProduct = product ? { ...product, karat: selectedKarat || product.karat } : null;
  const priceResult = calculateProductPrice(overriddenProduct, rate999);
  const { hasLivePrice, priceVal: displayPriceVal, price: displayPrice } = priceResult;

  const isOnSale = product.comparePriceVal && product.comparePriceVal > displayPriceVal
  const discountPercent = isOnSale 
    ? Math.round(((product.comparePriceVal - displayPriceVal) / product.comparePriceVal) * 100) 
    : 0

  const activeVariant = product.colour_variants && product.colour_variants.length > 0
    ? product.colour_variants.find(v => v.colour === selectedColour) || product.colour_variants[0]
    : null;

  const validImages = activeVariant 
    ? (activeVariant.images || []).filter(img => img && img.trim() !== "")
    : product.images ? product.images.filter(img => img && img.trim() !== "") : [];
  
  const mediaItems = validImages.map(img => ({ type: 'image', url: img }));
  
  const activeVideoUrl = activeVariant ? activeVariant.video_url : product.video_url;
  if (activeVideoUrl) {
    mediaItems.push({ type: 'video', url: activeVideoUrl });
  }

  const sortedKarats = product.available_karats 
    ? [...product.available_karats].sort((a, b) => (parseInt(a.replace(/\D/g, '')) || 0) - (parseInt(b.replace(/\D/g, '')) || 0))
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#2E3135]">
      <Navbar />
      
      <main className="flex-grow">
        {/* Breadcrumbs */}
        <div className="bg-[#FBFBFA] border-b border-[#F3F1EC]">
          <div className="max-w-[1280px] mx-auto px-6 py-4 flex items-center gap-2 font-inter text-[11px] text-[#888] tracking-wider uppercase">
            <Link href="/" className="hover:text-[#CDB38B] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3 text-[#E5E5E5]" />
            <Link href="/shop" className="hover:text-[#CDB38B] transition-colors">Shop</Link>
            <ChevronRight className="w-3 h-3 text-[#E5E5E5]" />
            <span className="text-[#2E3135] truncate max-w-[200px]">{product.name}</span>
          </div>
        </div>

        {/* Product Details Section */}
        <div className="max-w-[1280px] mx-auto px-6 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12">
            
            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="w-full lg:max-w-[540px] aspect-square bg-white border border-[#F3F1EC] overflow-hidden relative group">
                {isOnSale && (
                  <span className="absolute top-4 left-4 z-10 bg-[#CDB38B] text-white font-inter font-semibold text-[10px] tracking-wider uppercase px-3 py-1.5 shadow-sm">
                    {discountPercent}% OFF
                  </span>
                )}
                {mediaItems.length > 0 ? (
                  mediaItems[activeImageIndex]?.type === 'video' ? (
                    <video
                      src={mediaItems[activeImageIndex].url}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <img
                      src={mediaItems[activeImageIndex]?.url || mediaItems[0].url}
                      alt={`${product.name} main view`}
                      className="w-full h-full object-contain transition-all duration-700 ease-out group-hover:scale-105"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#F3F1EC]">
                    <span className="text-[#888] font-inter text-[11px] tracking-wider">NO IMAGE AVAILABLE</span>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {mediaItems.length > 1 && (
                <div className="flex gap-4 mt-4 overflow-x-auto pb-2 scrollbar-thin">
                  {mediaItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-20 h-20 flex-shrink-0 relative overflow-hidden bg-white cursor-pointer transition-all duration-300 ${
                        activeImageIndex === idx
                          ? "border-2 border-[#CDB38B] opacity-100"
                          : "border border-[#F3F1EC] hover:border-[#CDB38B]/50 opacity-70 hover:opacity-100"
                      }`}
                      aria-label={`View detail item ${idx + 1}`}
                    >
                      {item.type === 'video' ? (
                        <div className="w-full h-full relative group-hover:opacity-90 transition-opacity">
                          <video
                            src={item.url}
                            preload="metadata"
                            muted
                            playsInline
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                            <svg className="w-8 h-8 text-[#CDB38B]" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={item.url}
                          alt={`${product.name} thumbnail ${idx + 1}`}
                          className="w-full h-full object-contain"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Product Info & Actions */}
            <div className="lg:col-span-6 flex flex-col">
              <div>
                {/* Category & Rating */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[#CDB38B] font-inter font-medium text-[11px] tracking-[2.5px] uppercase">
                    {product.category || 'Fine Jewellery'}
                  </span>
                  {reviewsStats.count > 0 && (
                    <div className="flex items-center gap-1">
                      <div className="flex text-[#CDB38B]">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${
                              i < Math.round(reviewsStats.average) 
                                ? 'fill-current stroke-current' 
                                : 'fill-none stroke-current'
                            }`} 
                          />
                        ))}
                      </div>
                      <span className="text-gray-400 font-inter text-[11px] ml-1">
                        ({reviewsStats.count} Review{reviewsStats.count !== 1 ? 's' : ''})
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Name */}
                <h1 className="font-serif text-3xl lg:text-4xl text-[#2E3135] font-light leading-tight mb-4">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="font-serif text-2xl lg:text-3xl text-[#2E3135]">
                    {displayPrice}
                  </span>
                  {isOnSale && (
                    <span className="font-inter text-md text-gray-400 line-through">
                      {product.compare_price}
                    </span>
                  )}
                </div>

                {/* Price Breakdown Collapsible */}
                {hasLivePrice && (
                  <div className="mb-4">
                    <button
                      onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
                      className="flex items-center gap-1.5 text-[11px] font-inter uppercase tracking-[1.5px] text-[#2E3135] hover:text-[#CDB38B] transition-colors py-1.5 focus:outline-none"
                    >
                      <span>Price Breakdown</span>
                      <ChevronDown 
                        className={`w-3.5 h-3.5 text-[#CDB38B] transition-transform duration-200 ${isBreakdownOpen ? 'rotate-180' : ''}`} 
                      />
                    </button>
                    
                    {isBreakdownOpen && (
                      <div className="mt-2 border border-[#E5E5E5] bg-[#FBFBFA] p-4 text-[12px] font-inter text-[#2E3135] space-y-2.5 max-w-md">
                        {/* Gold item */}
                        <div className="flex justify-between items-center">
                          <span className="text-[#888888]">
                            Gold ({product.net_gold_weight}g × {product.karat || '14K'} Rate ₹{Math.round(priceResult.karatRate).toLocaleString("en-IN")}/g)
                          </span>
                          <span className="font-medium">₹{Math.round(priceResult.goldAmount).toLocaleString("en-IN")}</span>
                        </div>
                        
                        {/* Diamond item */}
                        <div className="flex justify-between items-center">
                          <span className="text-[#888888]">Diamond</span>
                          <span className="font-medium">₹{Math.round(priceResult.diamondAmount).toLocaleString("en-IN")}</span>
                        </div>
                        
                        {/* Making item */}
                        <div className="flex justify-between items-center">
                          <span className="text-[#888888]">Making</span>
                          <span className="font-medium">₹{Math.round(priceResult.makingAmount).toLocaleString("en-IN")}</span>
                        </div>
                        
                        {/* Other item (only if > 0) */}
                        {priceResult.otherAmount > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-[#888888]">Other</span>
                            <span className="font-medium">₹{Math.round(priceResult.otherAmount).toLocaleString("en-IN")}</span>
                          </div>
                        )}
                        
                        {/* Subtotal */}
                        <div className="flex justify-between items-center pt-1.5 border-t border-[#E5E5E5]/50">
                          <span className="text-[#2E3135] font-medium">Subtotal</span>
                          <span className="font-medium">₹{Math.round(priceResult.subtotal).toLocaleString("en-IN")}</span>
                        </div>
                        
                        {/* GST */}
                        <div className="flex justify-between items-center">
                          <span className="text-[#888888]">GST ({parseFloat(product.gst_percentage || 0)}%)</span>
                          <span className="font-medium">₹{Math.round(priceResult.gstAmount).toLocaleString("en-IN")}</span>
                        </div>
                        
                        {/* Thin divider before Total */}
                        <div className="w-full h-[1px] bg-[#E5E5E5]/80 my-1" />
                        
                        {/* Total */}
                        <div className="flex justify-between items-center font-bold text-[13.5px] text-[#2E3135] pt-0.5">
                          <span>Total</span>
                          <span>{displayPrice}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Stock Messaging */}
                {(product.stock_quantity ?? product.stock ?? 0) === 0 ? (
                  <div className="mb-6 font-inter font-medium text-[13px] text-[#DC2626]">
                    Out of Stock
                  </div>
                ) : (product.stock_quantity ?? product.stock ?? 0) >= 1 && (product.stock_quantity ?? product.stock ?? 0) <= 5 ? (
                  <div className="mb-6 font-inter font-medium text-[13px] text-[#D97706]">
                    Only {product.stock_quantity ?? product.stock ?? 0} left in stock — order soon
                  </div>
                ) : (
                  <div className="mb-6"></div>
                )}

                <div className="w-full h-[1px] bg-[#2E3135]/10 my-6" />

                {/* Description */}
                <p className="text-gray-600 font-inter text-[14px] leading-relaxed mb-8">
                  {product.description || "Indulge in absolute luxury. Meticulously handcrafted by master artisans, this piece features premium conflict-free lab-grown diamonds, delivering brilliance and ethical sophistication for everyday elegance."}
                </p>

                {/* Size Selector */}
                {product.size_options && product.size_options.length > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <button
                        onClick={() => setIsSizeOpen(!isSizeOpen)}
                        className="flex items-center gap-1.5 text-[11px] font-inter uppercase tracking-[1.5px] text-[#2E3135] hover:text-[#CDB38B] transition-colors py-1.5 focus:outline-none"
                      >
                        <span>SELECT SIZE: {selectedSize || "CHOOSE A SIZE"}</span>
                        <ChevronDown 
                          className={`w-3.5 h-3.5 text-[#CDB38B] transition-transform duration-200 ${isSizeOpen ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      <Link href="/size-guide" className="font-inter text-[11px] text-[#CDB38B] hover:underline uppercase tracking-wider">
                        Size Guide
                      </Link>
                    </div>
                    {isSizeOpen && (
                      <div className="flex flex-col gap-2 mt-1">
                        {product.size_options.map((sz) => (
                          <button
                            key={sz}
                            onClick={() => {
                              setSelectedSize(sz)
                              setIsSizeOpen(false)
                            }}
                            className={`text-left text-[12px] font-inter transition-colors focus:outline-none ${
                              selectedSize === sz
                                ? "text-[#CDB38B] font-medium"
                                : "text-[#2E3135] hover:text-[#CDB38B]"
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Karat Selector */}
                {product.available_karats && product.available_karats.length > 1 ? (
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-3">
                      <button
                        onClick={() => setIsKaratOpen(!isKaratOpen)}
                        className="flex items-center gap-1.5 text-[11px] font-inter uppercase tracking-[1.5px] text-[#2E3135] hover:text-[#CDB38B] transition-colors py-1.5 focus:outline-none"
                      >
                        <span>SELECT KARAT: {selectedKarat || product.karat || "CHOOSE A KARAT"}</span>
                        <ChevronDown 
                          className={`w-3.5 h-3.5 text-[#CDB38B] transition-transform duration-200 ${isKaratOpen ? 'rotate-180' : ''}`} 
                        />
                      </button>
                    </div>
                    {isKaratOpen && (
                      <div className="flex flex-col gap-2 mt-1">
                        {sortedKarats.map((krt) => (
                          <button
                            key={krt}
                            onClick={() => {
                              setSelectedKarat(krt)
                              setIsKaratOpen(false)
                            }}
                            className={`text-left text-[12px] font-inter transition-colors focus:outline-none ${
                              selectedKarat === krt
                                ? "text-[#CDB38B] font-medium"
                                : "text-[#2E3135] hover:text-[#CDB38B]"
                            }`}
                          >
                            {krt}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mb-6">
                    <span className="font-inter font-medium text-[11px] tracking-[1.5px] uppercase text-[#2E3135]">
                      KARAT: {product.karat}
                    </span>
                  </div>
                )}

                {/* Colour Selector */}
                {(product.colour_variants && product.colour_variants.length > 0) ? (
                  <div className="mb-8">
                    <span className="font-inter font-medium text-[11px] tracking-[1.5px] uppercase text-[#2E3135] mb-3 block">
                      Select Tone: {selectedColour}
                    </span>
                    <div className="flex flex-wrap gap-3">
                      {product.colour_variants.map((variant) => (
                        <button
                          key={variant.colour}
                          onClick={() => {
                            setSelectedColour(variant.colour)
                            setActiveImageIndex(0)
                          }}
                          aria-label={`Select ${variant.colour}`}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                            selectedColour === variant.colour
                              ? "ring-1 ring-offset-2 ring-[#2E3135]"
                              : "ring-1 ring-offset-1 ring-transparent hover:ring-[#E5E5E5]"
                          }`}
                        >
                          <span 
                            className="w-full h-full rounded-full border border-black/10" 
                            style={{ backgroundColor: variant.swatch_hex || '#e5e5e5' }}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  product.colour_options && product.colour_options.length > 0 && (
                    <div className="mb-8">
                      <span className="font-inter font-medium text-[11px] tracking-[1.5px] uppercase text-[#2E3135] mb-3 block">
                        Select Tone
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {product.colour_options.map((col) => (
                          <button
                            key={col}
                            onClick={() => setSelectedColour(col)}
                            className={`px-4 py-2.5 rounded-full font-inter font-medium text-[12px] border transition-all duration-300 ${
                              selectedColour === col
                                ? "bg-[#2E3135] border-[#2E3135] text-white"
                                : "bg-white border-[#E5E5E5] text-[#2E3135] hover:border-[#CDB38B]"
                            }`}
                          >
                            {col}
                          </button>
                        ))}
                      </div>
                    </div>
                  )
                )}

                {/* Quantity & Actions Stack */}
                <div className="flex gap-4 mb-8">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-[#E5E5E5] h-[52px]">
                    <button 
                      onClick={decreaseQty} 
                      className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5 text-[#2E3135]" />
                    </button>
                    <span className="w-10 text-center font-inter text-sm font-medium">
                      {quantity}
                    </span>
                    <button 
                      onClick={increaseQty} 
                      className="w-12 h-full flex items-center justify-center hover:bg-gray-50 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#2E3135]" />
                    </button>
                  </div>

                  {/* Add to Cart */}
                  <button
                    onClick={handleAddToCart}
                    disabled={cartStatus.startsWith("ADDED") || (product.stock_quantity ?? product.stock ?? 0) === 0}
                    className={`flex-grow h-[52px] font-inter font-medium text-[12px] tracking-[2px] uppercase transition-all duration-300 flex items-center justify-center gap-2 ${
                      (product.stock_quantity ?? product.stock ?? 0) === 0
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : "bg-[#2E3135] text-white hover:opacity-95 active:scale-[0.99] disabled:opacity-100"
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {(product.stock_quantity ?? product.stock ?? 0) === 0 ? "Out of Stock" : cartStatus}
                  </button>

                  {/* Wishlist Button */}
                  <button
                    onClick={toggleWishlist}
                    className={`w-[52px] h-[52px] border flex items-center justify-center transition-all duration-300 ${
                      isWishlisted
                        ? "bg-[#CDB38B] border-[#CDB38B] hover:bg-[#CDB38B]/90"
                        : "bg-white border-[#E5E5E5] hover:bg-[#FBFBFA]"
                    }`}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart
                      className={`w-5 h-5 transition-colors duration-300 ${
                        isWishlisted ? "fill-[#2E3135] stroke-[#2E3135]" : "stroke-[#2E3135] fill-none"
                      }`}
                    />
                  </button>
                </div>

                {/* Trust Services Badges */}
                <div className="grid grid-cols-3 gap-4 border-t border-b border-[#2E3135]/10 py-6 mb-2 text-center bg-[#FBFBFA]">
                  <div className="flex flex-col items-center p-2">
                    <Truck className="w-5 h-5 text-[#CDB38B] mb-2" />
                    <span className="font-inter font-medium text-[10px] tracking-wider uppercase text-[#2E3135]">Free Insured Shipping</span>
                  </div>
                  <div className="flex flex-col items-center p-2">
                    <ShieldCheck className="w-5 h-5 text-[#CDB38B] mb-2" />
                    <span className="font-inter font-medium text-[10px] tracking-wider uppercase text-[#2E3135]">100% Certified</span>
                  </div>
                  <div className="flex flex-col items-center p-2">
                    <RefreshCw className="w-5 h-5 text-[#CDB38B] mb-2" />
                    <span className="font-inter font-medium text-[10px] tracking-wider uppercase text-[#2E3135]">Easy 30-Day Returns</span>
                  </div>
                </div>
              </div>

              {/* Specifications Table */}
              <div className="mt-6">
                <h3 className="font-inter font-medium text-[12px] tracking-[1.5px] uppercase text-[#2E3135] mb-4">
                  Specifications
                </h3>
                <div className="border border-[#E5E5E5] text-xs font-inter divide-y divide-[#E5E5E5]">
                  {(selectedColour || product.metalType || product.metal) && (
                    <div className="grid grid-cols-2 p-3">
                      <span className="text-[#888] uppercase tracking-wider">Metal & Color</span>
                      <span className="text-[#2E3135] font-medium">{selectedColour || product.metalType || product.metal}</span>
                    </div>
                  )}
                  {(selectedKarat || product.karat) && (
                    <div className="grid grid-cols-2 p-3">
                      <span className="text-[#888] uppercase tracking-wider">Purity</span>
                      <span className="text-[#2E3135] font-medium">{selectedKarat || product.karat}</span>
                    </div>
                  )}
                  {product.weight && (
                    <div className="grid grid-cols-2 p-3">
                      <span className="text-[#888] uppercase tracking-wider">Total Weight</span>
                      <span className="text-[#2E3135] font-medium">{product.weight}</span>
                    </div>
                  )}
                  {product.stoneType && (
                    <div className="grid grid-cols-2 p-3">
                      <span className="text-[#888] uppercase tracking-wider">Stone Details</span>
                      <span className="text-[#2E3135] font-medium">{product.stoneType}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 p-3">
                    <span className="text-[#888] uppercase tracking-wider">Certificate</span>
                    <span className="text-[#2E3135] font-medium">IGL / SGL Certified</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
        {product && <ReviewSection productId={product.id} />}
      </main>

      <Footer />
    </div>
  )
}
