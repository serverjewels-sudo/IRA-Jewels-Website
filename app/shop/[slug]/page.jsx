'use client'

import { useEffect, useState, useRef } from 'react'
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
import { StoneShapeIcon } from '@/components/ui/StoneShapeIcons'

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
  const [isDiamondWeightOpen, setIsDiamondWeightOpen] = useState(false)
  
  // Selected options state
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColour, setSelectedColour] = useState(null)
  const [selectedKarat, setSelectedKarat] = useState(null)
  const [selectedShape, setSelectedShape] = useState(null)
  const [selectedDiamondWeight, setSelectedDiamondWeight] = useState(null)
  const [quantity, setQuantity] = useState(1)
  
  // Touch states for swipe
  const [touchStart, setTouchStart] = useState(null)
  const [touchEnd, setTouchEnd] = useState(null)
  const minSwipeDistance = 50


  // Engraving state
  const [hasEngraving, setHasEngraving] = useState("No")
  const [isEngravingOpen, setIsEngravingOpen] = useState(false)
  const [engravingFont, setEngravingFont] = useState("Garamond")
  const [engravingText, setEngravingText] = useState("")
  const [confirmedEngraving, setConfirmedEngraving] = useState(false)
  
  // Wishlist state
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [cartStatus, setCartStatus] = useState("ADD TO CART")
  const [reviewsStats, setReviewsStats] = useState({ count: 0, average: 0 })
  
  const sizeDropdownRef = useRef(null)
  const karatDropdownRef = useRef(null)
  const diamondWeightDropdownRef = useRef(null)
  const engravingDropdownRef = useRef(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(event.target)) {
        setIsSizeOpen(false)
      }
      if (karatDropdownRef.current && !karatDropdownRef.current.contains(event.target)) {
        setIsKaratOpen(false)
      }
      if (diamondWeightDropdownRef.current && !diamondWeightDropdownRef.current.contains(event.target)) {
        setIsDiamondWeightOpen(false)
      }
      if (engravingDropdownRef.current && !engravingDropdownRef.current.contains(event.target)) {
        setIsEngravingOpen(false)
        if (!confirmedEngraving) {
          setEngravingText("")
          setEngravingFont("Garamond")
          setHasEngraving("No")
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [confirmedEngraving])
  
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
            setSelectedSize(fallbackProduct.size_options?.[0] || null)
            const fallbackColour = fallbackProduct.colour_variants?.[0]?.colour || fallbackProduct.colour_options?.[0] || null;
            setSelectedColour(fallbackColour)
            if (fallbackProduct.colour_variants?.[0]?.shapes && fallbackProduct.colour_variants[0].shapes.length > 0) {
              setSelectedShape(fallbackProduct.colour_variants[0].shapes[0].shape_id)
            }
            setSelectedKarat(fallbackProduct.karat || null)
            if (fallbackProduct.diamond_weight_variants && fallbackProduct.diamond_weight_variants.length > 0) {
              setSelectedDiamondWeight(fallbackProduct.diamond_weight_variants[0].weight)
            }
          } else {
            setProduct(null)
          }
        } else {
          const mapped = mapSupabaseProduct(data)
          setProduct(mapped)
          setSelectedSize(mapped.size_options?.[0] || null)
          const mappedColour = mapped.colour_variants?.[0]?.colour || mapped.colour_options?.[0] || null;
          setSelectedColour(mappedColour)
          if (mapped.colour_variants?.[0]?.shapes && mapped.colour_variants[0].shapes.length > 0) {
            setSelectedShape(mapped.colour_variants[0].shapes[0].shape_id)
          }
          setSelectedKarat(mapped.karat || null)
          if (mapped.diamond_weight_variants && mapped.diamond_weight_variants.length > 0) {
            setSelectedDiamondWeight(mapped.diamond_weight_variants[0].weight)
          }
        }
      } catch (err) {
        console.error('[ProductDetail] Unexpected fetch error:', err)
        const fallbackProduct = sampleProducts.find(p => p.slug === slug)
        if (fallbackProduct) {
          setProduct(fallbackProduct)
          setSelectedSize(fallbackProduct.size_options?.[0] || null)
          const fallbackColour = fallbackProduct.colour_variants?.[0]?.colour || fallbackProduct.colour_options?.[0] || null;
          setSelectedColour(fallbackColour)
          if (fallbackProduct.colour_variants?.[0]?.shapes && fallbackProduct.colour_variants[0].shapes.length > 0) {
            setSelectedShape(fallbackProduct.colour_variants[0].shapes[0].shape_id)
          }
          setSelectedKarat(fallbackProduct.karat || null)
          if (fallbackProduct.diamond_weight_variants && fallbackProduct.diamond_weight_variants.length > 0) {
            setSelectedDiamondWeight(fallbackProduct.diamond_weight_variants[0].weight)
          }
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
      addToCart(product, selectedSize, selectedColour, selectedKarat, selectedShape, hasEngraving === "Yes", engravingFont, engravingText, selectedDiamondWeight)
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

  let overriddenDiamondAmount = product?.diamond_net_amount;
  if (product && selectedDiamondWeight && Array.isArray(product.diamond_weight_variants)) {
    const match = product.diamond_weight_variants.find(v => v.weight === selectedDiamondWeight);
    if (match) overriddenDiamondAmount = match.diamond_net_amount;
  }
  const overriddenProduct = product ? { ...product, karat: selectedKarat || product.karat, diamond_net_amount: overriddenDiamondAmount } : null;
  const priceResult = calculateProductPrice(overriddenProduct, rate999);
  const { hasLivePrice, priceVal: displayPriceVal, price: displayPrice } = priceResult;

  const isOnSale = product.comparePriceVal && product.comparePriceVal > displayPriceVal
  const discountPercent = isOnSale 
    ? Math.round(((product.comparePriceVal - displayPriceVal) / product.comparePriceVal) * 100) 
    : 0

  const activeVariant = product.colour_variants && product.colour_variants.length > 0
    ? product.colour_variants.find(v => v.colour === selectedColour) || product.colour_variants[0]
    : null;

  const activeShape = activeVariant && activeVariant.shapes && activeVariant.shapes.length > 0
    ? activeVariant.shapes.find(s => s.shape_id === selectedShape) || activeVariant.shapes[0]
    : null;

  const validImages = activeShape 
    ? (activeShape.images || []).filter(img => img && img.trim() !== "")
    : activeVariant 
      ? (activeVariant.images || []).filter(img => img && img.trim() !== "")
      : product.images ? product.images.filter(img => img && img.trim() !== "") : [];
  
  const mediaItems = validImages.map(img => ({ type: 'image', url: img }));
  
  const activeVideoUrl = activeShape ? activeShape.video_url : (activeVariant ? activeVariant.video_url : product.video_url);
  if (activeVideoUrl) {
    mediaItems.push({ type: 'video', url: activeVideoUrl });
  }

  const sortedKarats = product.available_karats 
    ? [...product.available_karats].sort((a, b) => (parseInt(a.replace(/\D/g, '')) || 0) - (parseInt(b.replace(/\D/g, '')) || 0))
    : [];

  // Touch handlers for image swipe
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    
    if (distance > minSwipeDistance) {
      // swipe left -> next image
      if (activeImageIndex < mediaItems.length - 1) {
        setActiveImageIndex(prev => prev + 1);
      }
    }
    if (distance < -minSwipeDistance) {
      // swipe right -> prev image
      if (activeImageIndex > 0) {
        setActiveImageIndex(prev => prev - 1);
      }
    }
  };

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
        <div className="max-w-[1280px] mx-auto px-6 py-6 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12">
            
            {/* Left Column: Image Gallery */}
            <div className="lg:col-span-6 flex flex-col">
              <div 
                className="w-full lg:max-w-[540px] aspect-square bg-white border border-[#F3F1EC] overflow-hidden relative group"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
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
            <div className="lg:col-span-6 flex flex-col min-w-0">
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
                <h1 className="font-serif text-3xl lg:text-4xl text-[#2E3135] font-light leading-tight mb-4 truncate lg:whitespace-normal">
                  {product.name}
                </h1>

                {/* Price Display */}
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="font-inter font-medium text-2xl lg:text-3xl text-[#2E3135]">
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

                {/* Product Selectors */}
                {((product.size_options?.length > 0) || product.karat || product.diamond_weight_variants?.length > 0 || product.colour_variants?.length > 0 || product.colour_options?.length > 0 || activeVariant?.shapes?.length > 0 || true) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 mb-8">
                    
                    {/* Size Selector Row - box and link as separate siblings */}
                    {product.size_options && product.size_options.length > 0 && (
                      <div className="flex items-center gap-4 order-5 sm:order-1">
                        <div ref={sizeDropdownRef} className="px-5 py-3 border border-[#E5E5E5] bg-[#FBFBFA] w-fit relative">
                          <button
                            onClick={() => setIsSizeOpen(!isSizeOpen)}
                            className="flex items-center gap-1.5 text-[11px] font-inter uppercase tracking-[1.5px] text-[#2E3135] hover:text-[#CDB38B] transition-colors py-1.5 focus:outline-none"
                          >
                            <span>SELECT SIZE: {selectedSize || "CHOOSE A SIZE"}</span>
                            <ChevronDown 
                              className={`w-3.5 h-3.5 text-[#CDB38B] transition-transform duration-200 ${isSizeOpen ? 'rotate-180' : ''}`} 
                            />
                          </button>
                          {isSizeOpen && (
                            <div className="absolute top-full left-0 mt-1 w-full min-w-full bg-[#FBFBFA] border border-[#E5E5E5] shadow-lg z-20 flex flex-col py-1.5">
                              {product.size_options.map((sz) => (
                                <button
                                  key={sz}
                                  onClick={() => {
                                    setSelectedSize(sz)
                                    setIsSizeOpen(false)
                                  }}
                                  className={`text-left text-[12px] font-inter transition-colors focus:outline-none px-5 py-1.5 ${
                                    selectedSize === sz
                                      ? "text-[#CDB38B] font-medium bg-gray-50"
                                      : "text-[#2E3135] hover:text-[#CDB38B] hover:bg-gray-50"
                                  }`}
                                >
                                  {sz}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <Link href="/size-guide" className="font-inter text-[11px] text-[#CDB38B] hover:underline uppercase tracking-wider">
                          Size Guide
                        </Link>
                      </div>
                    )}

                    {/* Diamond Weight Selector */}
                    {product.diamond_weight_variants && product.diamond_weight_variants.length > 0 && (
                      <div className="order-4 sm:order-2">
                        <span className="font-inter font-medium text-[11px] tracking-[1.5px] uppercase text-[#2E3135] mb-3 block">
                          Select Diamond Weight: {selectedDiamondWeight ? selectedDiamondWeight : ""}
                        </span>
                        <div className="flex flex-wrap gap-3">
                          {product.diamond_weight_variants.map((v) => (
                            <button
                              key={v.weight}
                              onClick={() => setSelectedDiamondWeight(v.weight)}
                              title={v.weight}
                              className={`min-w-[40px] h-10 px-2 rounded-full flex items-center justify-center font-inter text-[12px] transition-all duration-300 ${
                                selectedDiamondWeight === v.weight
                                  ? "bg-[#2E3135] text-white"
                                  : "bg-white border border-[#E5E5E5] text-[#2E3135] hover:border-[#CDB38B]"
                              }`}
                            >
                              {v.weight}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Karat Selector */}
                    {product.karat && (
                      <div ref={karatDropdownRef} className="px-5 py-3 border border-[#E5E5E5] bg-[#FBFBFA] w-fit h-fit relative order-2 sm:order-3">
                        {product.available_karats && product.available_karats.length > 1 ? (
                          <>
                            <div className="flex justify-between items-center">
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
                              <div className="absolute top-full left-0 mt-1 w-full min-w-full bg-[#FBFBFA] border border-[#E5E5E5] shadow-lg z-20 flex flex-col py-1.5">
                                {sortedKarats.map((krt) => (
                                  <button
                                    key={krt}
                                    onClick={() => {
                                      setSelectedKarat(krt)
                                      setIsKaratOpen(false)
                                    }}
                                    className={`text-left text-[12px] font-inter transition-colors focus:outline-none px-5 py-1.5 ${
                                      selectedKarat === krt
                                        ? "text-[#CDB38B] font-medium bg-gray-50"
                                        : "text-[#2E3135] hover:text-[#CDB38B] hover:bg-gray-50"
                                    }`}
                                  >
                                    {krt}
                                  </button>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <span className="font-inter font-medium text-[11px] tracking-[1.5px] uppercase text-[#2E3135] flex items-center h-[34px]">
                            KARAT: {product.karat}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Colour Selector */}
                    {((product.colour_variants && product.colour_variants.length > 0) || (product.colour_options && product.colour_options.length > 0)) && (
                      <div className="order-1 sm:order-4">
                        {product.colour_variants && product.colour_variants.length > 0 ? (
                          <>
                            <span className="font-inter font-medium text-[11px] tracking-[1.5px] uppercase text-[#2E3135] mb-3 block">
                              Select Tone: {selectedColour}
                            </span>
                            <div className="flex flex-wrap gap-3">
                              {product.colour_variants.map((variant) => (
                                <button
                                  key={variant.colour}
                                  onClick={() => {
                                    setSelectedColour(variant.colour)
                                    if (variant.shapes && variant.shapes.length > 0) {
                                      if (!variant.shapes.some(s => s.shape_id === selectedShape)) {
                                        setSelectedShape(variant.shapes[0].shape_id);
                                      }
                                    } else {
                                      setSelectedShape(null);
                                    }
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
                          </>
                        ) : (
                          <>
                            <span className="font-inter font-medium text-[11px] tracking-[1.5px] uppercase text-[#2E3135] mb-3 block">
                              Select Tone: {selectedColour}
                            </span>
                            <div className="flex flex-wrap items-center gap-3">
                              {product.colour_options.map((col) => {
                                const hex = product.colour_swatches?.[col];
                                if (hex) {
                                  return (
                                    <button
                                      key={col}
                                      onClick={() => setSelectedColour(col)}
                                      aria-label={`Select ${col}`}
                                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                                        selectedColour === col
                                          ? "ring-1 ring-offset-2 ring-[#2E3135]"
                                          : "ring-1 ring-offset-1 ring-transparent hover:ring-[#E5E5E5]"
                                      }`}
                                    >
                                      <span 
                                        className="w-full h-full rounded-full border border-black/10" 
                                        style={{ backgroundColor: hex }}
                                      />
                                    </button>
                                  );
                                } else {
                                  return (
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
                                  );
                                }
                              })}
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    {/* Engraving Section */}
                    <div ref={engravingDropdownRef} className="px-5 py-3 border border-[#E5E5E5] bg-[#FBFBFA] w-fit h-fit relative order-6 sm:order-5">
                      {/* Yes/No Toggle */}
                      <div className="flex items-center gap-6 py-1.5">
                        <label htmlFor="engravingCheckbox" className="cursor-pointer font-inter font-medium text-[11px] tracking-[1.5px] uppercase text-[#2E3135]">
                          Engraving
                        </label>
                        <input
                          type="checkbox"
                          id="engravingCheckbox"
                          checked={hasEngraving === "Yes"}
                          onChange={(e) => {
                            setHasEngraving(e.target.checked ? "Yes" : "No")
                            setIsEngravingOpen(e.target.checked)
                            if (!e.target.checked) {
                              setEngravingText("")
                              setEngravingFont("Garamond")
                              setConfirmedEngraving(false)
                            }
                          }}
                          className="accent-[#2E3135]"
                        />
                      </div>

                      {/* Engraving Details */}
                      {hasEngraving === "Yes" && isEngravingOpen && (
                        <div className="absolute top-full left-0 mt-1 w-80 bg-[#FBFBFA] border border-[#E5E5E5] shadow-lg z-20 flex flex-col p-4 space-y-4">
                          <div>
                            <label className="block font-inter font-medium text-[11px] tracking-wider uppercase text-[#2E3135] mb-2">
                              Select Font
                            </label>
                            <div className="relative">
                              <select 
                                value={engravingFont}
                                onChange={(e) => setEngravingFont(e.target.value)}
                                className="w-full h-11 border border-[#E5E5E5] bg-white rounded-none focus:outline-none focus:border-[#CDB38B] px-3 font-inter text-[13px] text-[#2E3135] appearance-none"
                              >
                                <option value="Garamond">Garamond</option>
                                <option value="Helvetica">Helvetica</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#2E3135]">
                                <ChevronDown className="w-4 h-4 text-[#888]" />
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between items-end mb-2">
                              <label className="block font-inter font-medium text-[11px] tracking-wider uppercase text-[#2E3135]">
                                Engraving Text
                              </label>
                              <span className={`font-inter text-[11px] ${engravingText.length >= 20 ? 'text-[#DC2626]' : 'text-[#888]'}`}>
                                {engravingText.length}/20
                              </span>
                            </div>
                            <input 
                              type="text"
                              value={engravingText}
                              onChange={(e) => {
                                if (e.target.value.length <= 20) {
                                  setEngravingText(e.target.value)
                                }
                              }}
                              placeholder="e.g. Always & Forever"
                              className="w-full h-11 border border-[#E5E5E5] bg-white rounded-none focus:outline-none focus:border-[#CDB38B] px-3 font-inter text-[14px] text-[#2E3135]"
                            />
                          </div>

                          {engravingText && (
                            <div className="mt-4 pt-4 border-t border-[#E5E5E5]/50 text-center">
                              <p className="font-inter text-[10px] uppercase tracking-wider text-[#888] mb-3">Preview</p>
                              <div 
                                className="text-[#2E3135] py-2 px-4 bg-white border border-[#E5E5E5] inline-block min-w-[200px]"
                                style={{ 
                                  fontFamily: engravingFont === "Garamond" ? "'Cormorant Garamond', serif" : "Helvetica, Arial, sans-serif",
                                  fontSize: engravingFont === "Garamond" ? "22px" : "18px",
                                  fontStyle: engravingFont === "Garamond" ? "italic" : "normal"
                                }}
                              >
                                {engravingText}
                              </div>
                              <p className="font-inter text-[10px] text-[#888] mt-2 mb-4">Text allowed up to 20 characters max</p>
                              <button
                                onClick={() => {
                                  setConfirmedEngraving(true)
                                  setIsEngravingOpen(false)
                                }}
                                className="w-full h-11 bg-[#2E3135] text-white font-inter font-medium text-[11px] tracking-[2px] uppercase hover:opacity-95 transition-opacity"
                              >
                                Confirm
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Shape Selector */}
                    {activeVariant && activeVariant.shapes && activeVariant.shapes.length > 0 && (
                      <div className="order-3 sm:order-6">
                        <span className="font-inter font-medium text-[11px] tracking-[1.5px] uppercase text-[#2E3135] mb-3 block">
                          Select Stone Shape: {selectedShape ? selectedShape.charAt(0).toUpperCase() + selectedShape.slice(1) : ""}
                        </span>
                        <div className="flex flex-wrap gap-3">
                          {activeVariant.shapes.map((shapeItem) => (
                            <button
                              key={shapeItem.shape_id}
                              onClick={() => {
                                setSelectedShape(shapeItem.shape_id)
                                setActiveImageIndex(0)
                              }}
                              title={shapeItem.shape_id.charAt(0).toUpperCase() + shapeItem.shape_id.slice(1)}
                              className={`w-10 h-10 flex items-center justify-center transition-colors duration-300 ${
                                selectedShape === shapeItem.shape_id
                                  ? "text-[#CDB38B]"
                                  : "text-[#2E3135] hover:text-[#CDB38B]"
                              }`}
                            >
                              <StoneShapeIcon 
                                shapeId={shapeItem.shape_id} 
                                className="w-9 h-9" 
                                strokeWidth={selectedShape === shapeItem.shape_id ? 0.9 : 0.6} 
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
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
                <div className="grid grid-cols-3 gap-4 border-t border-b border-[#2E3135]/10 py-3 mb-2 text-center bg-[#FBFBFA]">
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
                    <span className="text-[#2E3135] font-medium">IGI Certified</span>
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
