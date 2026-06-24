/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ShoppingBag,
  ArrowRight,
  MapPin,
  Clock,
  Compass,
  Phone,
  ArrowLeft,
  Download,
  Filter,
  Check,
  CheckCircle2,
  Lock,
  Star,
  CornerDownRight,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { Product, CartItem, PromoCode, OrderDetails } from './types';
import { PRODUCTS as INITIAL_PRODUCTS } from './data';
import AdminPortal from './components/AdminPortal.tsx';
import AdminLogin from './components/AdminLogin.tsx';
import {
  getDbProducts,
  getDbCart,
  getDbWishlist,
  saveDbCartItem,
  removeDbCartItem,
  clearAllDbCart,
  saveDbWishlistItem,
  removeDbWishlistItem,
  addDbOrder,
  checkIsAdminEmail,
  supabase
} from './supabase';

// Component Imports
import { useAuth } from './context/AuthContext.tsx';
import { Routes, Route, useNavigate, BrowserRouter } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop.tsx';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import TrustStrip from './components/TrustStrip.tsx';
import ProductCard from './components/ProductCard.tsx';
import ProductPage from './components/ProductPage.tsx';
import CartDrawer from './components/CartDrawer.tsx';
import MobileCartSheet from './components/MobileCartSheet.tsx';
import CartPage from './components/CartPage.tsx';
import CheckoutFlow from './components/CheckoutFlow.tsx';
import CustomerAccount from './components/CustomerAccount.tsx';
import Testimonials from './components/Testimonials.tsx';
import Craftsmanship from './components/Craftsmanship.tsx';
import Contact from './components/Contact.tsx';
import Footer from './components/Footer.tsx';

function AppContent() {
  const navigate = useNavigate();
  // Navigation Tabs: 'all', our 10 category slugs, 'craftsmanship', 'contact', 'account', 'admin'
  const [activeTab, setActiveTab] = useState<string>(() => {
    const denormalizedPath = window.location.pathname.toLowerCase().replace(/\/$/, "");
    if (denormalizedPath === '/admin') {
      const loggedIn = localStorage.getItem('luxeloom_admin_logged_in') === 'true';
      const loginTimeStr = localStorage.getItem('luxeloom_admin_logged_in_time');
      let isAdmin = false;
      if (loggedIn && loginTimeStr) {
        const loginTime = new Date(loginTimeStr).getTime();
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        if (Date.now() - loginTime < sevenDaysMs) {
          isAdmin = true;
        }
      }
      return isAdmin ? 'admin' : 'admin_login';
    }
    if (denormalizedPath === '/login') {
      return 'account';
    }
    return 'all';
  });
  const {
    user,
    isLoggedIn,
    customerName,
    loadingAuth,
    isAdminLoggedIn,
    logout,
    setIsAdminLoggedIn,
    setIsLoggedIn,
    setCustomerName,
    setLoadingAuth
  } = useAuth();

  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [checkoutMode, setCheckoutMode] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 5000);
  };
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Synchronize browser URL popstate navigation
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Sync state and URL based on current active paths
  useEffect(() => {
    const denormalizedPath = currentPath.toLowerCase().replace(/\/$/, "");

    if (denormalizedPath.startsWith('/product')) {
      return; // Skip syncing when presenting a product card detailed fullpage
    }

    if (denormalizedPath === '/admin') {
      if (loadingAuth) return; // Do NOT redirect or make routing decisions until auth is loaded

      if (isAdminLoggedIn) {
        if (activeTab !== 'admin') {
          setActiveTab('admin');
        }
      } else {
        if (activeTab !== 'admin_login') {
          setActiveTab('admin_login');
        }
      }
    } else if (denormalizedPath === '/login') {
      if (activeTab !== 'account') {
        setActiveTab('account');
      }
      setCheckoutMode(false);
    } else if (denormalizedPath === '/checkout') {
      setCheckoutMode(true);
    } else {
      if (activeTab === 'admin' || activeTab === 'admin_login' || activeTab === 'account') {
        setActiveTab('all');
      }
      if (currentPath !== '/checkout') {
        setCheckoutMode(false);
      }
    }
  }, [currentPath, isAdminLoggedIn, isLoggedIn, loadingAuth]);

  // Sync state updates back to address bar path values
  useEffect(() => {
    const windowPathClean = window.location.pathname.toLowerCase().replace(/\/$/, "");
    if (windowPathClean.startsWith('/product')) {
      return; // Skip syncing when presenting a product card detailed fullpage
    }
    if (activeTab === 'admin' || activeTab === 'admin_login') {
      if (windowPathClean !== '/admin') {
        window.history.pushState(null, '', '/admin');
        setCurrentPath('/admin');
      }
    } else if (activeTab === 'account') {
      if (windowPathClean !== '/login') {
        window.history.pushState(null, '', '/login');
        setCurrentPath('/login');
      }
    } else if (checkoutMode) {
      if (windowPathClean !== '/checkout') {
        window.history.pushState(null, '', '/checkout');
        setCurrentPath('/checkout');
      }
    } else {
      if (windowPathClean === '/admin' || windowPathClean === '/login' || windowPathClean === '/checkout') {
        window.history.pushState(null, '', '/');
        setCurrentPath('/');
      }
    }
  }, [activeTab, checkoutMode]);
  
  // Real-time products state sourced from Supabase
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [mobileCartOpen, setMobileCartOpen] = useState<boolean>(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<{
    id: string;
    name: string;
    image: string;
    selectedMetal: string;
    selectedSize?: string;
    price: number;
  } | null>(null);
  const [dbActive, setDbActive] = useState<boolean>(false);
  const [loadingDb, setLoadingDb] = useState<boolean>(true);

  // Shopping bag persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('luxeloom_vault_bag');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Wishlist state persistence
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('luxeloom_vault_wishlist');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Wishlist dynamic functions synchronizing with Supabase database as requested
  const addToWishlist = async (productId: string) => {
    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setActiveTab('account');
        return;
      }

      // Check if already in wishlist
      const { data: existing } = await supabase
        .from('wishlist')
        .select('id')
        .eq('product_id', productId)
        .eq('customer_id', session.user.id)
        .maybeSingle();

      if (existing) {
        // Already in wishlist
        // Remove it (toggle off)
        await supabase
          .from('wishlist')
          .delete()
          .eq('product_id', productId)
          .eq('customer_id', session.user.id);
        
        // Update local state
        setWishlist(prev => 
          prev.filter(item => item.id !== productId)
        );
        return;
      }

      // Add to Supabase wishlist table
      const { error } = await supabase
        .from('wishlist')
        .insert({
          product_id: productId,
          customer_id: session.user.id
        });

      if (error) {
        console.error('Wishlist error:', error);
        return;
      }

      // Update local state after successful Supabase save
      const productObj = products.find(p => p.id === productId) || INITIAL_PRODUCTS.find(p => p.id === productId);
      if (productObj) {
        setWishlist(prev => [...prev, productObj]);
      }

    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchWishlist = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) return;

      // Fetch from Supabase not from local state
      const { data, error } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('customer_id', session.user.id);

      if (error) {
        console.error('Fetch error:', error);
        return;
      }

      // Set wishlist as array of Product objects to preserve full LuxeLoom portfolio views
      const productIds = data?.map(item => item.product_id) || [];
      const mappedProducts = productIds
        .map(id => products.find(p => p.id === id) || INITIAL_PRODUCTS.find(p => p.id === id))
        .filter((p): p is Product => p !== undefined);

      setWishlist(mappedProducts);

    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Trigger fetchWishlist when user loads or logs in
  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  // Shared logout function to handle both header and customer profile logout without transition lags or blinking
  const handleLogout = async () => {
    try {
      await logout();
      setActiveTab('all');
      showToast('Session successfully terminated.');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Load products, cart, and wishlist on mount from Supabase
  useEffect(() => {
    const initDb = async () => {
      try {
        const res = await getDbProducts(true);
        if (res.dbActive) {
          setDbActive(true);
          if (res.products && res.products.length > 0) {
            setProducts(res.products);
          }
          const dbCart = await getDbCart();
          if (dbCart && dbCart.length > 0) {
            setCart(dbCart);
          }
          await fetchWishlist();
        }
      } catch (e) {
        console.warn('Initial Supabase setup missing tables or inactive:', e);
      } finally {
        setLoadingDb(false);
      }
    };
    initDb();
  }, []);

  // Sync Customer Cart and Wishlist over Auth state updates securely
  useEffect(() => {
    if (loadingAuth) return;
    const syncUserDbData = async () => {
      if (user) {
        const dbCart = await getDbCart();
        setCart(dbCart || []);
        await fetchWishlist();

        // Retrieve and handle pending checkout redirect
        const pendingRedirect = sessionStorage.getItem('returnAfterLogin');
        if (pendingRedirect) {
          sessionStorage.removeItem('returnAfterLogin');
          if (pendingRedirect === '/checkout') {
            setCheckoutMode(true);
            setActiveTab('all');
            window.history.pushState(null, '', '/checkout');
            setCurrentPath('/checkout');
          }
        }
      } else {
        // Clear customer states on logout
        setCart([]);
        setWishlist([]);
      }
    };
    if (dbActive) {
      syncUserDbData();
    }
  }, [user, loadingAuth, dbActive]);

  // Reload products/catalog on demands
  const handleRefreshCatalog = async () => {
    try {
      const res = await getDbProducts(true);
      setDbActive(res.dbActive);
      if (res.dbActive && res.products && res.products.length > 0) {
        setProducts(res.products);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Client session simulation
  // Moved to top for lexical routing scope stability

  // Category Faceted Filter options
  const [selectedMetalFilter, setSelectedMetalFilter] = useState<string>('all');
  const [selectedGemFilter, setSelectedGemFilter] = useState<string>('all');
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<string>('all');
  const [selectedOccasionFilter, setSelectedOccasionFilter] = useState<string>('all');

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderDetails | null>(null);

  // Sorting
  const [sortBy, setSortBy] = useState<string>('featured');

  // Sync state drawers with user localStorage
  useEffect(() => {
    localStorage.setItem('luxeloom_vault_bag', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('luxeloom_vault_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);



  // Wishlist Toggle controls
  const handleAddToWishlist = (product: Product) => {
    addToWishlist(product.id).catch(console.error);
  };

  const handleRemoveFromWishlist = (product: Product) => {
    addToWishlist(product.id).catch(console.error);
  };

  // Handle bag additions with option profiles
  const handleAddToCart = async (product: Product, options?: { metal: string; size?: string; engraving?: string }): Promise<boolean> => {
    // Before adding any product to cart, always check in_stock status
    if (dbActive) {
      try {
        const { data: dbProd, error } = await supabase
          .from('products')
          .select('in_stock')
          .eq('id', product.id)
          .single();

        if (error) {
          console.warn('Real-time checking stock error:', error);
        } else if (dbProd && !dbProd.in_stock) {
          alert('Sorry, this product is currently out of stock');
          return false;
        }
      } catch (err) {
        console.error('Failed to verify stock status on add to cart:', err);
      }
    } else {
      if (!product.inStock) {
        alert('Sorry, this product is currently out of stock');
        return false;
      }
    }

    const chosenMetal = options?.metal || product.options.metals[0];
    const chosenSize = options?.size || '';
    const chosenEngraving = options?.engraving || '';
    
    // Create unique key for option combinations
    const combinationId = `${product.id}-${chosenMetal.replace(/\s/g, '-')}-${chosenSize}`;

    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.id === combinationId);
      let updated: CartItem[];
      
      if (existingIdx > -1) {
        updated = [...prevCart];
        updated[existingIdx].quantity += 1;
        if (dbActive) {
          saveDbCartItem(updated[existingIdx]).catch(console.error);
        }
      } else {
        const newItem: CartItem = {
          id: combinationId,
          product,
          selectedMetal: chosenMetal,
          selectedSize: chosenSize || undefined,
          engraving: chosenEngraving || undefined,
          quantity: 1
        };
        updated = [...prevCart, newItem];
        if (dbActive) {
          saveDbCartItem(newItem).catch(console.error);
        }
      }
      return updated;
    });

    if (window.innerWidth < 768) {
      setLastAddedProduct({
        id: product.id,
        name: product.name,
        image: product.image,
        selectedMetal: chosenMetal,
        selectedSize: chosenSize || undefined,
        price: product.price
      });
      setMobileCartOpen(true);
    } else {
      setCartDrawerOpen(true);
    }

    return true;
  };

  // Direct layout helper addition
  const handleDirectAdd = async (product: Product) => {
    await handleAddToCart(product, {
      metal: product.options.metals[0],
      size: product.options.sizes?.[0] || undefined
    });
  };

  const handleUpdateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(cartItemId);
      return;
    }
    setCart((prevCart) => {
      const updated = prevCart.map((item) => (item.id === cartItemId ? { ...item, quantity } : item));
      if (dbActive) {
        const target = updated.find(item => item.id === cartItemId);
        if (target) {
          saveDbCartItem(target).catch(console.error);
        }
      }
      return updated;
    });
  };

  const handleRemoveItem = (cartItemId: string) => {
    setCart((prevCart) => {
      const updated = prevCart.filter((item) => item.id !== cartItemId);
      if (dbActive) {
        removeDbCartItem(cartItemId).catch(console.error);
      }
      return updated;
    });
  };

  // Complete checkout & reset state
  const handleOrderCompleted = (orderDetails: OrderDetails) => {
    setCompletedOrder(orderDetails);
    setCart([]); // Reset Cart bag
    setAppliedPromo(null);
    if (dbActive) {
      addDbOrder(orderDetails).then(() => {
        clearAllDbCart().catch(console.error);
      }).catch(console.error);
    }
  };

  const handleCloseReceipt = () => {
    setCompletedOrder(null);
    setCheckoutMode(false);
    setActiveTab('all');
  };

  // Filter products by active tab category, search, and the 4 new faceted limits
  const filteredProducts = products.filter((prod) => {
    // 1. Category validation
    const matchesCategory =
      activeTab === 'all' || activeTab === prod.categorySlug;

    // 2. Query search validation
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.materials.some((m) => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      prod.sku.toLowerCase().includes(searchQuery.toLowerCase());

    // 3. Faceted Metal validation (Gold, Platinum, Silver)
    let matchesMetal = true;
    if (selectedMetalFilter !== 'all') {
      const materialsStr = prod.materials.join(' ').toLowerCase();
      const nameStr = prod.name.toLowerCase();
      if (selectedMetalFilter === 'gold') {
        matchesMetal = materialsStr.includes('gold') || nameStr.includes('gold') || materialsStr.includes('kundan') || nameStr.includes('kundan');
      } else if (selectedMetalFilter === 'platinum') {
        matchesMetal = materialsStr.includes('platinum') || nameStr.includes('platinum');
      } else if (selectedMetalFilter === 'silver') {
        matchesMetal = materialsStr.includes('silver') || nameStr.includes('silver');
      }
    }

    // 4. Faceted Gemstone validation
    let matchesGem = true;
    if (selectedGemFilter !== 'all') {
      const nameAndMaterials = (prod.name + ' ' + prod.materials.join(' ')).toLowerCase();
      if (selectedGemFilter === 'diamond') {
        matchesGem = nameAndMaterials.includes('diamond') || nameAndMaterials.includes('solitaire');
      } else if (selectedGemFilter === 'emerald') {
        matchesGem = nameAndMaterials.includes('emerald');
      } else if (selectedGemFilter === 'sapphire') {
        matchesGem = nameAndMaterials.includes('sapphire');
      } else if (selectedGemFilter === 'ruby') {
        matchesGem = nameAndMaterials.includes('ruby');
      } else if (selectedGemFilter === 'pearl') {
        matchesGem = nameAndMaterials.includes('pearl');
      } else if (selectedGemFilter === 'kundan') {
        matchesGem = nameAndMaterials.includes('kundan') || nameAndMaterials.includes('polki');
      }
    }

    // 5. Faceted Price validation
    let matchesPrice = true;
    if (selectedPriceFilter !== 'all') {
      if (selectedPriceFilter === 'under-100k') {
        matchesPrice = prod.price < 100000;
      } else if (selectedPriceFilter === '100k-250k') {
        matchesPrice = prod.price >= 100000 && prod.price <= 250000;
      } else if (selectedPriceFilter === '250k-500k') {
        matchesPrice = prod.price > 250000 && prod.price <= 500000;
      } else if (selectedPriceFilter === 'above-500k') {
        matchesPrice = prod.price > 500000;
      }
    }

    // 6. Faceted Occasion validation
    let matchesOccasion = true;
    if (selectedOccasionFilter !== 'all') {
      const detailsStr = (prod.name + ' ' + prod.description).toLowerCase();
      if (selectedOccasionFilter === 'engagement') {
        matchesOccasion = prod.categorySlug === 'rings' || detailsStr.includes('solitaire') || detailsStr.includes('engagement') || detailsStr.includes('halo');
      } else if (selectedOccasionFilter === 'wedding') {
        matchesOccasion = prod.categorySlug === 'necklaces' || detailsStr.includes('wedding') || detailsStr.includes('bridal') || detailsStr.includes('kundan');
      } else if (selectedOccasionFilter === 'daily') {
        matchesOccasion = detailsStr.includes('daily') || detailsStr.includes('band') || detailsStr.includes('chain') || prod.categorySlug === 'nosepins' || prod.categorySlug === 'pendants';
      } else if (selectedOccasionFilter === 'party') {
        matchesOccasion = detailsStr.includes('cocktail') || detailsStr.includes('statement') || detailsStr.includes('gala') || detailsStr.includes('party') || prod.categorySlug === 'earrings';
      }
    }

    // 7. Verify inStock status for storefront
    const matchesInStock = prod.inStock;

    return matchesCategory && matchesSearch && matchesMetal && matchesGem && matchesPrice && matchesOccasion && matchesInStock;
  });

  // Sort filtered catalog items
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return a.bestseller === b.bestseller ? 0 : a.bestseller ? -1 : 1; // default 'featured'
  });

  // Clear all faceted filters helper
  const handleClearFacetedFilters = () => {
    setSelectedMetalFilter('all');
    setSelectedGemFilter('all');
    setSelectedPriceFilter('all');
    setSelectedOccasionFilter('all');
    setSearchQuery('');
  };

  // Check if activeTab is a boutique shop category view or 'all'
  const isShopTab = [
    'all', 'rings', 'earrings', 'pendants', 'necklaces', 'bangles', 'bracelets', 'nosepins'
  ].includes(activeTab);

  if (loadingAuth) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#ffffff'
      }}>
        <div style={{
          color: '#1a6b5c',
          fontSize: '24px',
          letterSpacing: '4px'
        }}>
          LUXELOOM
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0eb] text-[#0a0a0a] flex flex-col font-sans relative select-none">
      
      {/* Deluxe Sliding Action Toast Notifications banner */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 animate-scale-in max-w-sm bg-zinc-950 border border-[#1a6b5c] text-white shadow-2xl px-5 py-4 font-mono text-xs flex items-center space-x-3 rounded-xs pointer-events-auto">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="leading-relaxed">{toastMessage}</span>
        </div>
      )}

      {/* Premium Navigation Header */}
      {activeTab !== 'admin_login' && (
        <Header
          cart={cart}
          onOpenCart={() => setCartDrawerOpen(true)}
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setCheckoutMode(false);
            setActiveTab(tab);
            navigate('/');
            // scroll to boutique grid on select
            if (isShopTab) {
              setTimeout(() => {
                document.getElementById('boutique-catalog-anchor')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }
          }}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            setCheckoutMode(false);
            if (activeTab === 'craftsmanship' || activeTab === 'contact' || activeTab === 'account') {
              setActiveTab('all');
            }
            navigate('/');
            setTimeout(() => {
              document.getElementById('boutique-catalog-anchor')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
          isLoggedIn={isLoggedIn}
          isAdminLoggedIn={isAdminLoggedIn}
          onLogout={handleLogout}
          customerName={customerName}
        />
      )}

      {/* Main Container Workspace */}
      <main className="flex-grow pt-0 pb-16">
        <Routes>
          <Route
            path="/product/:id"
            element={
              <ProductPage
                products={products}
                onAddToCart={handleAddToCart}
                wishlist={wishlist}
                onAddToWishlist={handleAddToWishlist}
                onRemoveFromWishlist={handleRemoveFromWishlist}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                cart={cart}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                user={user}
                onProceedToCheckout={(promo) => {
                  setAppliedPromo(promo);
                  setCheckoutMode(true);
                  navigate('/checkout');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            }
          />
          <Route
            path="*"
            element={
              completedOrder ? (
          <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center space-y-8 animate-fade-in select-none text-[#0a0a0a]">
            
            {/* Confirmation details Header */}
            <div className="space-y-4">
              <span className="w-16 h-16 rounded-full bg-[#1a6b5c]/10 border border-[#1a6b5c] flex items-center justify-center text-[#1a6b5c] mx-auto mb-4 scale-110 animate-bounce">
                <CheckCircle2 size={32} />
              </span>
              <p className="text-[10px] uppercase font-mono tracking-[0.4em] text-[#1a6b5c] font-medium">TRANSACTION AUTHORIZED SECURELY</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#0a0a0a] tracking-wide">
                Your Order is Registered at the Atelier
              </h2>
              <p className="text-xs text-[#666] max-w-lg mx-auto font-light leading-relaxed">
                Thank you for choosing LuxeLoom Fine Jewels. A senior master jeweler will begin inspecting, hallmark-registering, and wrapping your selections inside our Mumbai vault boutique.
              </p>
            </div>

            {/* Receipt Summary block */}
            <div className="bg-white border border-[#1a6b5c]/20 rounded-sm p-6 text-left space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#1a6b5c]/15 pb-4 gap-4">
                <div>
                  <p className="text-[9px] uppercase font-mono text-[#666] font-medium">Boutique Reference ID</p>
                  <p className="text-sm font-semibold font-mono text-[#1a6b5c]">{completedOrder.orderNumber}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-mono text-[#666] font-medium">Authorized Date</p>
                  <p className="text-xs font-medium text-[#0a0a0a]">{completedOrder.date}</p>
                </div>
                <div>
                  <p className="text-[9px] uppercase font-mono text-[#666] font-medium">Security Shipping Status</p>
                  <p className="text-xs font-medium text-green-700 tracking-wider font-mono">FULLY INSURED SECURE OUT</p>
                </div>
              </div>

              {/* Items Table details */}
              <div className="space-y-4">
                <p className="text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c] mb-2 font-semibold">Registered Masterpieces</p>
                
                <div className="space-y-3 font-mono text-xs divide-y divide-[#1a6b5c]/10">
                  {completedOrder.items.map((item, i) => (
                    <div key={item.id} className={`flex justify-between items-start gap-4 ${i > 0 ? 'pt-3' : ''}`}>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#0a0a0a] font-serif">{item.product.name} (x{item.quantity})</p>
                        <p className="text-[9px] text-[#666] uppercase font-mono">Finish: {item.selectedMetal} {item.selectedSize ? `• Size: ${item.selectedSize} (IN)` : ''}</p>
                        {item.engraving && <p className="text-[9px] text-[#1a6b5c] italic ml-1 mt-0.5">Engraving: &ldquo;{item.engraving}&rdquo;</p>}
                      </div>
                      <span className="text-[#0a0a0a] text-xs flex-shrink-0 font-mono">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Details block */}
              <div className="border-t border-[#1a6b5c]/15 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6 text-[11px] font-sans">
                <div className="space-y-1 font-light">
                  <p className="font-semibold text-[#0a0a0a] font-serif">Delivery Profile Address</p>
                  <p className="text-xs text-[#666]">{completedOrder.customerInfo.firstName} {completedOrder.customerInfo.lastName}</p>
                  <p className="text-[#666]">{completedOrder.customerInfo.address}</p>
                  <p className="text-[#666]">{completedOrder.customerInfo.city}, {completedOrder.customerInfo.zipCode}</p>
                  <p className="text-[#666]">{completedOrder.customerInfo.country}</p>
                </div>
                <div className="space-y-1 font-light">
                  <p className="font-semibold text-[#0a0a0a] font-serif">Escrow Settlement</p>
                  <p className="text-[#666]">Authorized By: {completedOrder.paymentInfo.cardholderName}</p>
                  <p className="text-[#666]">Payment Reference: {completedOrder.paymentInfo.cardNumberMasked}</p>
                  {completedOrder.utrNumber && (
                    <p className="text-[#666] font-mono">UPI UTR ID: {completedOrder.utrNumber}</p>
                  )}
                  <p className="text-[#1a6b5c] font-medium font-mono text-xs pt-1">Settled Net: ₹{completedOrder.total.toLocaleString('en-IN')} INR</p>
                </div>
              </div>

            </div>

            <div className="flex flex-wrap justify-center gap-4 select-none">
              <button
                id="receipt-print-button"
                onClick={() => alert("Your official invoice certificate containing full high appraisal stamps and BIS 916 hallmarks has been compiled and dispatched to: " + completedOrder.customerInfo.email + ". Our security systems require secure PDF credentials to download.")}
                className="bg-transparent border border-[#1a6b5c] hover:bg-[#1a6b5c]/10 text-[#1a6b5c] text-xs uppercase tracking-[0.2em] font-light py-3.5 px-8 rounded-sm transition-colors duration-300 pointer-events-auto cursor-pointer"
              >
                Download Valuation Certs
              </button>
              <button
                id="receipt-home-button"
                onClick={handleCloseReceipt}
                className="bg-[#1a6b5c] hover:bg-[#1a6b5c]/85 text-white font-medium text-xs uppercase tracking-[0.2em] py-3.5 px-8 rounded-sm transition-all duration-300 shadow-xl pointer-events-auto cursor-pointer"
              >
                Return to E-Boutique
              </button>
            </div>
          </div>
        ) : checkoutMode ? (
          /* Render Checkout Process */
          <div className="pt-10">
            <CheckoutFlow
              cart={cart}
              appliedPromo={appliedPromo}
              onOrderCompleted={handleOrderCompleted}
              onCancel={() => setCheckoutMode(false)}
            />
          </div>
        ) : activeTab === 'account' ? (
          /* Render Customer Account System tab (New!) */
          <div className="pt-10 select-none">
            <CustomerAccount
              onClose={() => setActiveTab('all')}
              onAddToCart={handleDirectAdd}
              wishlist={wishlist}
              onAddToWishlist={handleAddToWishlist}
              onRemoveFromWishlist={handleRemoveFromWishlist}
              onLogout={handleLogout}
            />
          </div>
        ) : activeTab === 'admin_login' ? (
          /* Render Admin Login form */
          <div className="pt-0 select-none">
            <AdminLogin
              onLoginSuccess={(email) => {
                localStorage.setItem('luxeloom_admin_logged_in', 'true');
                localStorage.setItem('luxeloom_admin_logged_in_time', new Date().toISOString());
                setIsAdminLoggedIn(true);
                setActiveTab('admin');
                showToast(`Authorized administrative access granted for: ${email}`);
              }}
              onCancel={() => {
                setActiveTab('all');
              }}
            />
          </div>
        ) : activeTab === 'admin' ? (
          /* Render Admin Control Center tab */
          <div className="pt-10 select-none">
            <AdminPortal
              onClose={() => setActiveTab('all')}
              onRefreshCatalog={handleRefreshCatalog}
              localProducts={products}
              onSetProducts={setProducts}
              dbActive={dbActive}
              setDbActive={setDbActive}
              onLogoutAdmin={() => {
                localStorage.removeItem('luxeloom_admin_logged_in');
                localStorage.removeItem('luxeloom_admin_logged_in_time');
                setIsAdminLoggedIn(false);
                setActiveTab('admin_login');
                showToast('Atelier Admin session successfully terminated.');
              }}
            />
          </div>
        ) : (
          /* Render Homepage & Collections Showcase Views */
          <div className="space-y-16">
            
            {/* Show landing carousel & trust strips only on catalog views */}
            {isShopTab && (
              <>
                <Hero
                  onExplore={() => {
                    document.getElementById('boutique-catalog-anchor')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  onBespokeInquiry={() => {
                    setActiveTab('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
                
                {/* Horizontal trust ribbon below hero (FIX 6) */}
                <TrustStrip />
              </>
            )}

            {/* Shop Catalog Tab Frame */}
            {isShopTab && (
              <div id="boutique-catalog-anchor" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pt-6">
                
                {/* Catalog Title and Headline */}
                <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-[#1a6b5c]/15 pb-4 gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#1a6b5c] block font-semibold">Atelier Showcase</span>
                    <h2 className="font-serif text-2xl sm:text-3.5xl font-light tracking-normal text-[#0a0a0a] uppercase">
                      {activeTab === 'all' ? 'All Masterpieces' : activeTab.replace('-', ' ')}
                    </h2>
                  </div>

                  {/* Top quick Category stats */}
                  <div className="text-[#666] text-xs font-mono font-medium">
                    Showroom Count: <span className="text-[#1a6b5c] font-bold">{sortedProducts.length} Selections</span>
                  </div>
                </div>

                {/* ==================== CATEGORY FILTER TABS (STEP 4) ==================== */}
                <div className="border-b border-[#1a6b5c]/10 pb-2 overflow-x-auto scrollbar-none">
                  <div className="flex items-center space-x-1 sm:space-x-3 md:space-x-6 min-w-max text-[11px] sm:text-xs font-mono tracking-[0.2em] uppercase text-[#666] select-none py-1">
                    {[
                      { label: 'ALL', id: 'all' },
                      { label: 'RINGS', id: 'rings' },
                      { label: 'EARRINGS', id: 'earrings' },
                      { label: 'PENDANT', id: 'pendants' },
                      { label: 'NECKLACE', id: 'necklaces' },
                      { label: 'BANGLE', id: 'bangles' },
                      { label: 'BRACELET', id: 'bracelets' },
                      { label: 'NOSEPIN', id: 'nosepins' }
                    ].map((tab, idx) => (
                      <React.Fragment key={tab.id}>
                        {idx > 0 && <span className="text-[#1a6b5c]/25 select-none font-sans">|</span>}
                        <button
                          onClick={() => {
                            setActiveTab(tab.id);
                            // Clear faceted filters on tab change to make filtering intuitive
                            handleClearFacetedFilters();
                          }}
                          className={`hover:text-[#1a6b5c] transition-all duration-300 py-1.5 px-2 relative cursor-pointer ${
                            activeTab === tab.id
                              ? 'text-[#1a6b5c] font-bold after:absolute after:bottom-0 after:left-2 after:right-2 after:h-[2px] after:bg-[#1a6b5c]'
                              : 'opacity-75 hover:opacity-100'
                          }`}
                        >
                          {tab.label}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* ==================== ADVANCED FACETED FILTER STRIP (SECTION B) ==================== */}
                <div className="bg-white border border-[#1a6b5c]/15 p-4 sm:p-5 rounded-xs space-y-4 shadow-sm relative z-30 select-none">
                  <div className="flex items-center space-x-2 border-b border-[#1a6b5c]/10 pb-2.5">
                    <SlidersHorizontal size={14} className="text-[#1a6b5c]" />
                    <h3 className="text-[11px] uppercase tracking-wider font-bold text-zinc-900 font-mono">Faceted Catalog Filters</h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 text-xs font-mono">
                    {/* 1. Metal Type Dropdown */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block">Metal Type</label>
                      <select
                        value={selectedMetalFilter}
                        onChange={(e) => setSelectedMetalFilter(e.target.value)}
                        className="w-full bg-[#f5f0eb]/60 border border-neutral-200 hover:border-[#1a6b5c] text-xs p-2 rounded-xs select-none focus:outline-none"
                      >
                        <option value="all">All Metals</option>
                        <option value="gold">Yellow/Rose Gold</option>
                        <option value="platinum">Platinum</option>
                        <option value="silver">Sterling Silver</option>
                      </select>
                    </div>

                    {/* 2. Gemstone Dropdown */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block">Gemstone</label>
                      <select
                        value={selectedGemFilter}
                        onChange={(e) => setSelectedGemFilter(e.target.value)}
                        className="w-full bg-[#f5f0eb]/60 border border-neutral-200 hover:border-[#1a6b5c] text-xs p-2 rounded-xs select-none focus:outline-none"
                      >
                        <option value="all">All Gemstones</option>
                        <option value="diamond">Diamonds & Solitaires</option>
                        <option value="emerald">Colombian Emeralds</option>
                        <option value="sapphire">Ceylon Sapphires</option>
                        <option value="ruby">Marquise Rubies</option>
                        <option value="pearl">Natural Pearls</option>
                        <option value="kundan">Traditional Kundan/Polki</option>
                      </select>
                    </div>

                    {/* 3. Price Range Dropdown */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block">Price range</label>
                      <select
                        value={selectedPriceFilter}
                        onChange={(e) => setSelectedPriceFilter(e.target.value)}
                        className="w-full bg-[#f5f0eb]/60 border border-neutral-200 hover:border-[#1a6b5c] text-xs p-2 rounded-xs select-none focus:outline-none"
                      >
                        <option value="all">All Prices</option>
                        <option value="under-100k">Under ₹1,00,000</option>
                        <option value="100k-250k">₹1,00,000 - ₹2,50,000</option>
                        <option value="250k-500k">₹2,50,000 - ₹5,00,000</option>
                        <option value="above-500k">Above ₹5,00,000</option>
                      </select>
                    </div>

                    {/* 4. Occasion Dropdown */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block">Occasion</label>
                      <select
                        value={selectedOccasionFilter}
                        onChange={(e) => setSelectedOccasionFilter(e.target.value)}
                        className="w-full bg-[#f5f0eb]/60 border border-neutral-200 hover:border-[#1a6b5c] text-xs p-2 rounded-xs select-none focus:outline-none"
                      >
                        <option value="all">All Occasions</option>
                        <option value="engagement">Engagement & Solitaires</option>
                        <option value="wedding">Wedding & Bridal Grandeur</option>
                        <option value="daily">Modern & Daily Wear</option>
                        <option value="party">Cocktail & Gala Parties</option>
                      </select>
                    </div>

                    {/* 5. Sort Dropdown options */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block">Sort By</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full bg-white border border-[#1a6b5c] text-[#1a6b5c] text-xs p-2 rounded-xs select-none focus:outline-none font-bold"
                      >
                        <option value="featured">Featured Order</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="rating">Appraisal Rating</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Faceted tags display line */}
                  {(selectedMetalFilter !== 'all' || selectedGemFilter !== 'all' || selectedPriceFilter !== 'all' || selectedOccasionFilter !== 'all' || searchQuery) && (
                    <div className="pt-3 border-t border-[#1a6b5c]/10 flex flex-wrap justify-between items-center gap-3 text-[10px] font-mono select-none">
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-[#666] uppercase">Active limits:</span>
                        {selectedMetalFilter !== 'all' && (
                          <span className="bg-[#1a6b5c]/10 text-[#1a6b5c] px-2 py-0.5 rounded-sm">Metal: {selectedMetalFilter}</span>
                        )}
                        {selectedGemFilter !== 'all' && (
                          <span className="bg-[#1a6b5c]/10 text-[#1a6b5c] px-2 py-0.5 rounded-sm">Gem: {selectedGemFilter}</span>
                        )}
                        {selectedPriceFilter !== 'all' && (
                          <span className="bg-[#1a6b5c]/10 text-[#1a6b5c] px-2 py-0.5 rounded-sm">Price: {selectedPriceFilter}</span>
                        )}
                        {selectedOccasionFilter !== 'all' && (
                          <span className="bg-[#1a6b5c]/10 text-[#1a6b5c] px-2 py-0.5 rounded-sm">Occasion: {selectedOccasionFilter}</span>
                        )}
                      </div>
                      <button
                        onClick={handleClearFacetedFilters}
                        className="text-red-600 hover:text-red-700 font-bold underline cursor-pointer"
                      >
                        Clear All Filter Seals
                      </button>
                    </div>
                  )}
                </div>

                {/* Subtitle feedback search query */}
                {searchQuery && (
                  <div className="flex justify-between items-center text-xs text-[#666] font-mono bg-white p-3 border border-[#1a6b5c]/20 rounded-sm shadow-xs">
                    <span>Found {sortedProducts.length} masterpieces matching &ldquo;{searchQuery}&rdquo;</span>
                    <button
                      id="clear-search-pill"
                      onClick={() => setSearchQuery('')}
                      className="text-[#1a6b5c] hover:underline"
                    >
                      Clear Filter
                    </button>
                  </div>
                )}

                {/* Products Grid list */}
                {sortedProducts.length === 0 ? (
                  <div className="text-center py-20 bg-white border border-[#1a6b5c]/15 rounded-sm space-y-4 select-none">
                    <p className="font-serif text-lg text-[#0a0a0a] font-light">No jewelled items match selection.</p>
                    <p className="text-xs text-[#666]">Try modifying your catalog filters or clearing search keywords.</p>
                    <button
                      id="reset-filter-button"
                      onClick={handleClearFacetedFilters}
                      className="border border-[#1a6b5c] hover:bg-[#1a6b5c]/10 text-[#1a6b5c] text-xs uppercase tracking-widest py-2 px-5 pointer-events-auto cursor-pointer font-mono font-bold"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 justify-items-center w-full">
                    {sortedProducts.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onSelect={(p) => navigate(`/product/${p.id}`)}
                        onAddToCart={handleDirectAdd}
                        isWishlisted={wishlist.some((item) => item.id === prod.id)}
                        onToggleWishlist={(p) => {
                          if (wishlist.some((item) => item.id === p.id)) {
                            handleRemoveFromWishlist(p);
                          } else {
                            handleAddToWishlist(p);
                          }
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Testimonials module (FIX 3) at the bottom of homepage views */}
            {isShopTab && (
              <Testimonials />
            )}

            {/* 2. Craftsmanship page view */}
            {activeTab === 'craftsmanship' && (
              <div className="pt-8">
                <Craftsmanship />
              </div>
            )}

            {/* 3. Contact consultation page view */}
            {activeTab === 'contact' && (
              <div className="pt-8">
                <Contact />
              </div>
            )}

            </div>
          )}
        />
      </Routes>
    </main>

      {/* Footer Credentials */}
      {activeTab !== 'admin_login' && (
        <Footer setActiveTab={(tab) => {
          setCheckoutMode(false);
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} />
      )}



      {/* Persistent slide-over dynamic cart drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        user={user}
        onProceedToCheckout={(promo) => {
          setAppliedPromo(promo);
          setCheckoutMode(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Mobile-only bottom sheet on Add to Cart */}
      <MobileCartSheet
        isOpen={mobileCartOpen}
        onClose={() => setMobileCartOpen(false)}
        addedProduct={lastAddedProduct}
        onViewCart={() => {
          setMobileCartOpen(false);
          setCartDrawerOpen(true);
        }}
      />
    </div>
  );
}

export default function App() {
  const { loadingAuth } = useAuth();

  if (loadingAuth) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#ffffff'
      }}>
        <span style={{
          fontSize: '24px',
          letterSpacing: '6px',
          color: '#1a6b5c',
          fontFamily: 'serif'
        }}>
          LUXELOOM
        </span>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppContent />
    </BrowserRouter>
  );
}
