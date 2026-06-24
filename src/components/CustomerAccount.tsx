/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { supabase } from '../supabase';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Gift,
  Settings,
  Lock,
  Compass,
  ArrowRight,
  ClipboardList,
  ChevronRight,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Truck,
  RotateCcw,
  Star,
  Download,
  Share2,
  Bell,
  Eye,
  LogOut,
  Sparkles
} from 'lucide-react';
import { Product, CartItem } from '../types';

interface Address {
  id: string;
  name: string;
  phone: string;
  flatHouse: string;
  street: string;
  area: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault: boolean;
}

interface Order {
  id: string;
  date: string;
  items: { name: string; price: number; quantity: number }[];
  amount: number;
  status: 'Delivered' | 'Shipped' | 'Crafting' | 'Placed' | 'Cancelled';
  courier: string;
  trackingId: string;
  estimatedDelivery: string;
}

interface CustomerAccountProps {
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  wishlist: Product[];
  onRemoveFromWishlist: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
  onLogout?: () => void;
}

export default function CustomerAccount({
  onClose,
  onAddToCart,
  wishlist,
  onRemoveFromWishlist,
  onLogout,
}: CustomerAccountProps) {
  // Authentication State
  const { isLoggedIn, user, logout, setIsLoggedIn } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  
  // Custom mock data state representing logged-in client (dynamically updated from Supabase Auth via useEffect on user change)
  const [customerName, setCustomerName] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [customerMobile, setCustomerMobile] = useState<string>('');
  const [customerBirthday, setCustomerBirthday] = useState<string>('1998-09-18');
  const [pointsBalance, setPointsBalance] = useState<number>(3450);
  const [tier, setTier] = useState<'Platinum' | 'Gold' | 'Silver'>('Gold');

  // Input states for login forms
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginMobile, setLoginMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Input states for signup forms
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpPass, setSignUpPass] = useState('');
  
  // Sidebar tab management: 'dashboard', 'orders', 'tracking', 'wishlist', 'addresses', 'rewards', 'settings'
  const [activeTab, setActiveTab ] = useState<string>('dashboard');

  // Sync customer orders from the database dynamically
  const fetchMyOrders = async (email: string) => {
    try {
      const { data: dbOrders, error } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', email)
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Error fetching personal orders:', error.message);
        return;
      }

      if (dbOrders) {
        const mappedOrders: Order[] = dbOrders.map((dbOrder: any) => {
          let orderItems = [];
          if (dbOrder.items) {
            try {
              const parsedItems = typeof dbOrder.items === 'string' ? JSON.parse(dbOrder.items) : dbOrder.items;
              if (Array.isArray(parsedItems)) {
                orderItems = parsedItems.map((item: any) => ({
                  name: item?.product?.name || 'Masterpiece Jewelry',
                  price: item?.product?.price || 0,
                  quantity: item?.quantity || 1
                }));
              }
            } catch (err) {
              console.warn('Error parsing items', err);
            }
          }
          return {
            id: dbOrder.order_number,
            date: dbOrder.date || new Date(dbOrder.created_at).toISOString().split('T')[0],
            items: orderItems,
            amount: dbOrder.total,
            status: dbOrder.status || 'Placed',
            courier: dbOrder.courier || 'Sequel Secure Logistics',
            trackingId: dbOrder.tracking_id || 'SQL-MUM-8921',
            estimatedDelivery: dbOrder.estimated_delivery || 'Recieved'
          };
        });
        setOrders(mappedOrders);
      }
    } catch (e: any) {
      console.warn('Database offline or table missing:', e.message);
    }
  };

  // Sync component local state and form fields whenever global user state from context changes
  useEffect(() => {
    if (user) {
      const metadata = user.user_metadata || {};
      const name = metadata.full_name || metadata.name || metadata.display_name || user.email?.split('@')[0] || 'Client';
      setCustomerName(name);
      setCustomerEmail(user.email || '');
      setCustomerMobile(metadata.phone || '');
      if (user.email) {
        fetchMyOrders(user.email);
      }
    } else {
      setCustomerName('');
      setCustomerEmail('');
      setCustomerMobile('');
      setOrders([]);
    }
  }, [user]);

  // Order List State
  const [orders, setOrders] = useState<Order[]>([]);

  // Selected Order for detail overlay
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Address book state with Supabase integration
  const [addresses, setAddresses] = useState<any[]>([]);
  const [addressesLoading, setAddressesLoading] = useState<boolean>(true);
  const [addressFormOpen, setAddressFormOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    full_name: '',
    phone: '',
    house_flat: '',
    street: '',
    area: '',
    city: '',
    state: '',
    pincode: ''
  });

  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('customer_id', session.user.id);

      if (error) throw error;
      setAddresses(data || []);
    } catch (error: any) {
      console.warn('Address error:', error.message);
    } finally {
      setAddressesLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'addresses') {
      fetchAddresses();
    }
  }, [activeTab, user]);

  // Form states for adding/editing address
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrFlat, setAddrFlat] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrArea, setAddrArea] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPin, setAddrPin] = useState('');

  // Tracking query state
  const [trackingIdInput, setTrackingIdInput] = useState('');
  const [trackingMobileInput, setTrackingMobileInput] = useState('');
  const [queriedTrackingOrder, setQueriedTrackingOrder] = useState<Order | null>(null);

  // General Notification preferences
  const [notifSms, setNotifSms] = useState(true);
  const [notifEmail, setNotifEmail] = useState(true);

  // Order history filters
  const [orderFilterStatus, setOrderFilterStatus] = useState('All');

  // Handle Login with real Supabase Auth
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);
    try {
      if (loginMethod === 'email') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPass,
        });
        if (error) {
          setFeedbackError(error.message);
          return;
        }
      } else {
        // Mobile login backup simulation
        if (otpSent && otpCode === '892110') {
          const demoEmail = `${loginMobile.trim()}@luxeloom.com`;
          const { error } = await supabase.auth.signUp({
            email: demoEmail,
            password: 'LuxeLoomTemporaryPass123!',
            options: { data: { phone: loginMobile } }
          });
          const { error: loginError } = await supabase.auth.signInWithPassword({
            email: demoEmail,
            password: 'LuxeLoomTemporaryPass123!'
          });
          if (loginError) {
            setFeedbackError(loginError.message);
            return;
          }
        } else if (otpSent) {
          setFeedbackError("Incorrect OTP code. Please enter 892110.");
          return;
        } else {
          setOtpSent(true);
          return;
        }
      }
      setActiveTab('dashboard');
    } catch (err: any) {
      setFeedbackError(err.message || 'An authentication error occurred.');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackError(null);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signUpEmail,
        password: signUpPass,
        options: {
          data: {
            full_name: signUpName,
            phone: signUpPhone
          }
        }
      });
      if (error) {
        setFeedbackError(error.message);
        return;
      }
      alert("Atelier Credentials Stamped successfully! Please verify your email or log in.");
      setAuthView('login');
      // Reset signup fields
      setSignUpName('');
      setSignUpEmail('');
      setSignUpPhone('');
      setSignUpPass('');
    } catch (err: any) {
      setFeedbackError(err.message || 'An error occurred during registration.');
    }
  };

  // Switch/Reset Address Form
  const openAddressForm = (addr?: any) => {
    if (addr) {
      setEditingAddressId(addr.id);
      setAddrName(addr.full_name || addr.name || '');
      setAddrPhone(addr.phone || '');
      setAddrFlat(addr.house_flat || addr.flatHouse || '');
      setAddrStreet(addr.street || '');
      setAddrArea(addr.area || '');
      setAddrCity(addr.city || '');
      setAddrState(addr.state || '');
      setAddrPin(addr.pincode || addr.pinCode || '');
    } else {
      setEditingAddressId(null);
      setAddrName(customerName);
      setAddrPhone(customerMobile);
      setAddrFlat('');
      setAddrStreet('');
      setAddrArea('');
      setAddrCity('');
      setAddrState('');
      setAddrPin('');
    }
    setAddressFormOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const addressPayload = {
        full_name: addrName,
        phone: addrPhone,
        house_flat: addrFlat,
        street: addrStreet,
        area: addrArea,
        city: addrCity,
        state: addrState,
        pincode: addrPin,
        customer_id: session.user.id
      };

      if (editingAddressId) {
        // Edit mode on Supabase
        const { error } = await supabase
          .from('addresses')
          .update(addressPayload)
          .eq('id', editingAddressId);
        if (error) throw error;
      } else {
        // Add mode on Supabase
        const { error } = await supabase
          .from('addresses')
          .insert(addressPayload);
        if (error) throw error;
      }

      setAddressFormOpen(false);
      fetchAddresses();
    } catch (err: any) {
      console.error('Error saving address:', err);
      alert('Failed to save address: ' + err.message);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', id);
      if (error) throw error;
      fetchAddresses();
    } catch (err: any) {
      console.error('Error deleting address:', err);
      alert('Failed to delete address: ' + err.message);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    // Local set default representation
    setAddresses(prev => prev.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
  };

  // Order Tracking Status Resolver
  const trackableOrder = queriedTrackingOrder || orders.find(o => o.id === 'LL-ODR-722104'); // default showcase outstanding order

  const getStatusStepInt = (status: string) => {
    switch (status) {
      case 'Placed': return 0;
      case 'Confirmed': return 1;
      case 'Crafting': return 2;
      case 'Quality Check': return 3;
      case 'Shipped': return 4;
      case 'Out for Delivery': return 5;
      case 'Delivered': return 6;
      default: return 2; // Default Crafting phase
    }
  };

  const stepsList = [
    'Order Placed',
    'Confirmed',
    'Crafting at Jaipur',
    'Quality Checked',
    'Shipped Secure',
    'Out for Delivery',
    'Delivered'
  ];

  return (
    <div className="bg-[#f5f0eb] min-h-screen text-[#0a0a0a] pb-12 select-text">
      {/* Top Header Navigation Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <button
          onClick={onClose}
          className="text-xs uppercase tracking-widest font-mono font-medium text-[#1a6b5c] hover:text-[#0a0a0a] transition-colors flex items-center space-x-2"
        >
          <span>&larr;</span>
          <span>Return To Storefront</span>
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* ==================== SECURE LOGIN & GUEST SIGNUP SCREEN ==================== */}
        {!isLoggedIn ? (
          <div className="max-w-md mx-auto bg-white border border-[#1a6b5c]/20 p-8 shadow-2xl rounded-sm">
            <div className="text-center space-y-2 mb-8">
              <span className="inline-block p-3 rounded-full bg-[#1a6b5c]/5 border border-[#1a6b5c]/15 text-[#1a6b5c] mb-2 mx-auto">
                <Lock size={22} className="mx-auto" />
              </span>
              <h2 className="font-serif text-2xl font-light text-[#0a0a0a] tracking-wide">
                {authView === 'login' ? 'Private Client Vault' : authView === 'signup' ? 'Request Client Credentials' : 'Retrieve Credentials'}
              </h2>
              <p className="text-xs text-[#666] font-light max-w-xs mx-auto">
                {authView === 'login' ? 'Access your orders, bespoke designs, and private loyalty rewards securely.' : 'Join the LuxeLoom atelier network for exclusive benefits.'}
              </p>
            </div>

            {feedbackError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs text-center rounded-sm font-sans font-medium">
                {feedbackError}
              </div>
            )}

            {authView === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                {/* Method selector toggle */}
                <div className="grid grid-cols-2 gap-2 border border-[#1a6b5c]/10 bg-[#f5f0eb]/50 p-1 rounded-xs">
                  <button
                    type="button"
                    onClick={() => { setLoginMethod('email'); setFeedbackError(null); }}
                    className={`text-[10px] uppercase font-mono py-1.5 px-2 rounded-xs font-semibold ${loginMethod === 'email' ? 'bg-[#1a6b5c] text-white' : 'text-[#666] hover:text-[#0a0a0a]'}`}
                  >
                    Email + Password
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginMethod('mobile'); setFeedbackError(null); }}
                    className={`text-[10px] uppercase font-mono py-1.5 px-2 rounded-xs font-semibold ${loginMethod === 'mobile' ? 'bg-[#1a6b5c] text-white' : 'text-[#666] hover:text-[#0a0a0a]'}`}
                  >
                    Mobile + OTP
                  </button>
                </div>

                {loginMethod === 'email' ? (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider font-mono text-[#666] block font-semibold">Registered Email ID</label>
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="e.g. customer@domain.com"
                        className="w-full bg-[#f5f0eb]/50 border border-[#1a6b5c]/20 p-3 text-xs text-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] font-light"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] uppercase tracking-wider font-mono text-[#666] block font-semibold">Password</label>
                        <button
                          type="button"
                          onClick={() => { setAuthView('forgot'); setFeedbackError(null); }}
                          className="text-[9px] text-[#1a6b5c] hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>
                      <input
                        type="password"
                        required
                        value={loginPass}
                        onChange={(e) => setLoginPass(e.target.value)}
                        placeholder="••••••••••••••"
                        className="w-full bg-[#f5f0eb]/50 border border-[#1a6b5c]/20 p-3 text-xs text-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] font-light"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider font-mono text-[#666] block font-semibold">Mobile Number</label>
                      <div className="flex">
                        <span className="bg-[#f5f0eb] border border-[#1a6b5c]/20 border-r-0 flex items-center px-3.5 text-xs text-[#666] font-mono">+91</span>
                        <input
                          type="tel"
                          required
                          value={loginMobile}
                          onChange={(e) => setLoginMobile(e.target.value)}
                          placeholder="98765 43210"
                          className="w-full bg-[#f5f0eb]/50 border border-[#1a6b5c]/20 p-3 text-xs text-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] font-mono"
                        />
                      </div>
                    </div>
                    {otpSent ? (
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider font-mono text-[#666] block font-semibold">6-Digit OTP</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="892110"
                          className="w-full bg-[#f5f0eb]/50 border border-[#1a6b5c]/20 p-3 text-xs tracking-widest text-[#0a0a0a] font-mono text-center focus:outline-none focus:ring-1 focus:ring-[#1a6b5c]"
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          if (loginMobile.length >= 10) setOtpSent(true);
                          else alert("Invalid phone input. Enter a 10 digit Indian number.");
                        }}
                        className="w-full py-2.5 bg-[#1a6b5c]/10 text-[#1a6b5c] border border-[#1a6b5c]/20 hover:border-[#1a6b5c] uppercase text-[10px] tracking-widest font-mono rounded-xs font-bold"
                      >
                        Request OTP Code
                      </button>
                    )}
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#1a6b5c] hover:bg-[#1a6b5c]/90 text-white font-medium text-xs uppercase tracking-widest rounded-xs transition-colors shadow-lg shadow-[#1a6b5c]/15"
                >
                  Authorize Client Key
                </button>
              </form>
            )}

            {authView === 'signup' && (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-[#666] block font-bold">Full Name</label>
                  <input
                    type="text"
                    required
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full bg-[#f5f0eb]/50 border border-[#1a6b5c]/20 p-3 text-xs text-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] font-light"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-[#666] block font-bold">Email Address</label>
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="priya.sharma@domain.com"
                    className="w-full bg-[#f5f0eb]/50 border border-[#1a6b5c]/20 p-3 text-xs text-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] font-light"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-[#666] block font-bold">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    placeholder="+91 98XXX XXXXX"
                    className="w-full bg-[#f5f0eb]/50 border border-[#1a6b5c]/20 p-3 text-xs text-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-[#666] block font-bold">Secure Password</label>
                  <input
                    type="password"
                    required
                    value={signUpPass}
                    onChange={(e) => setSignUpPass(e.target.value)}
                    placeholder="••••••••••••••"
                    className="w-full bg-[#f5f0eb]/50 border border-[#1a6b5c]/20 p-3 text-xs text-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] font-light"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#1a6b5c] hover:bg-[#1a6b5c]/90 text-white font-medium text-xs uppercase tracking-widest rounded-none transition-colors shadow-lg"
                >
                  Create Secure Credentials
                </button>
              </form>
            )}

            {authView === 'forgot' && (
              <div className="space-y-5">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-mono text-[#666] block font-bold">Registered email</label>
                  <input
                    type="email"
                    placeholder="customer@domain.com"
                    className="w-full bg-[#f5f0eb]/50 border border-[#1a6b5c]/20 p-3 text-xs text-[#0a0a0a] focus:outline-none focus:ring-1 focus:ring-[#1a6b5c] font-light"
                  />
                </div>
                <button
                  onClick={() => {
                    alert("Instructions to reset your client password have been cryptographically stamped and dispatched to you.");
                    setAuthView('login');
                  }}
                  className="w-full py-3 bg-[#1a6b5c] text-white text-xs uppercase tracking-widest rounded-xs"
                >
                  Dispatch Token Check
                </button>
              </div>
            )}

            {/* Google OAuth & Auth Toggle Section */}
            <div className="mt-6 pt-6 border-t border-[#1a6b5c]/10 text-center space-y-4">
              <button
                onClick={async () => {
                  setFeedbackError(null);
                  try {
                    const { error } = await supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: { redirectTo: window.location.origin }
                    });
                    if (error) setFeedbackError(error.message);
                  } catch (err: any) {
                    setFeedbackError(err.message || 'OAuth initialization failed.');
                  }
                }}
                className="w-full py-3.5 border border-[#1a6b5c]/25 hover:border-[#1a6b5c] bg-white text-xs text-[#0a0a0a] tracking-wider uppercase flex items-center justify-center space-x-2 rounded-xs font-mono"
              >
                <span>Continue with Google</span>
              </button>

              <div className="text-[11px] text-[#666]">
                {authView === 'login' ? (
                  <span>New to LuxeLoom?{' '}
                    <button onClick={() => { setAuthView('signup'); setFeedbackError(null); }} className="text-[#1a6b5c] hover:underline font-bold">Register and Sign up</button>
                  </span>
                ) : (
                  <span>Registered Client?{' '}
                    <button onClick={() => { setAuthView('login'); setFeedbackError(null); }} className="text-[#1a6b5c] hover:underline font-bold">Log in here</button>
                  </span>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* ==================== ACTIVE SIGNED-IN CLIENT WORKSPACE ==================== */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Client Details */}
            <div className="lg:col-span-1 space-y-6">
              {/* Account Quick Dashboard Card */}
              <div className="bg-white border border-[#1a6b5c]/15 p-6 shadow-md rounded-sm text-center">
                <div className="relative inline-block mx-auto mb-3">
                  <span className="w-16 h-16 rounded-full bg-[#1a6b5c]/10 border border-[#1a6b5c]/15 flex items-center justify-center text-[#1a6b5c]">
                    <User size={32} />
                  </span>
                  <span className="absolute bottom-0 right-0 bg-yellow-500 border border-white text-[8px] font-bold text-white uppercase px-1 py-0.5 rounded-xs tracking-wider">
                    {tier}
                  </span>
                </div>
                <h3 className="font-serif text-lg text-[#0a0a0a] font-medium">{customerName}</h3>
                <p className="text-[10px] text-[#1a6b5c] font-mono tracking-widest uppercase mt-0.5">{tier} Tier Member</p>
                <p className="text-[11px] text-[#666] font-mono tracking-tight mt-1">{customerEmail}</p>

                <div className="mt-4 pt-4 border-t border-[#1a6b5c]/10 grid grid-cols-2 gap-2 text-center text-xs font-mono">
                  <div className="bg-[#f5f0eb]/60 p-2 rounded-xs">
                    <span className="text-[10px] text-[#999] block uppercase">Points</span>
                    <span className="text-[#1a6b5c] font-semibold text-sm">{pointsBalance}</span>
                  </div>
                  <div className="bg-[#f5f0eb]/60 p-2 rounded-xs">
                    <span className="text-[10px] text-[#999] block uppercase">Tier Elite</span>
                    <span className="text-[#1a6b5c] font-semibold text-xs flex items-center justify-center space-x-1">
                      <Sparkles size={10} className="text-amber-500" />
                      <span>{tier}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Sidebar Tabs List */}
              <div className="bg-white border border-[#1a6b5c]/15 shadow-sm rounded-sm overflow-hidden text-xs">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`w-full text-left p-3.5 tracking-wider uppercase border-b border-[#1a6b5c]/10 select-none flex items-center justify-between ${activeTab === 'dashboard' ? 'bg-[#1a6b5c] text-white' : 'text-[#666] hover:bg-neutral-50 hover:text-[#0a0a0a]'}`}
                >
                  <span className="flex items-center space-x-2.5">
                    <Compass size={14} /> <span>Vault Dashboard</span>
                  </span>
                  <ChevronRight size={12} />
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full text-left p-3.5 tracking-wider uppercase border-b border-[#1a6b5c]/10 select-none flex items-center justify-between ${activeTab === 'orders' ? 'bg-[#1a6b5c] text-white' : 'text-[#666] hover:bg-neutral-50 hover:text-[#0a0a0a]'}`}
                >
                  <span className="flex items-center space-x-2.5">
                    <ClipboardList size={14} /> <span>Order History</span>
                  </span>
                  <ChevronRight size={12} />
                </button>
                <button
                  onClick={() => setActiveTab('tracking')}
                  className={`w-full text-left p-3.5 tracking-wider uppercase border-b border-[#1a6b5c]/10 select-none flex items-center justify-between ${activeTab === 'tracking' ? 'bg-[#1a6b5c] text-white' : 'text-[#666] hover:bg-neutral-50 hover:text-[#0a0a0a]'}`}
                >
                  <span className="flex items-center space-x-2.5">
                    <Truck size={14} /> <span>Live Order Tracking</span>
                  </span>
                  <ChevronRight size={12} />
                </button>
                <button
                  onClick={() => setActiveTab('wishlist')}
                  className={`w-full text-left p-3.5 tracking-wider uppercase border-b border-[#1a6b5c]/10 select-none flex items-center justify-between ${activeTab === 'wishlist' ? 'bg-[#1a6b5c] text-white' : 'text-[#666] hover:bg-neutral-50 hover:text-[#0a0a0a]'}`}
                >
                  <span className="flex items-center space-x-2.5">
                    <Heart size={14} /> <span>Atelier Wishlist</span>
                  </span>
                  <ChevronRight size={12} />
                </button>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className={`w-full text-left p-3.5 tracking-wider uppercase border-b border-[#1a6b5c]/10 select-none flex items-center justify-between ${activeTab === 'addresses' ? 'bg-[#1a6b5c] text-white' : 'text-[#666] hover:bg-neutral-50 hover:text-[#0a0a0a]'}`}
                >
                  <span className="flex items-center space-x-2.5">
                    <MapPin size={14} /> <span>Addresses Booklet</span>
                  </span>
                  <ChevronRight size={12} />
                </button>
                <button
                  onClick={() => setActiveTab('rewards')}
                  className={`w-full text-left p-3.5 tracking-wider uppercase border-b border-[#1a6b5c]/10 select-none flex items-center justify-between ${activeTab === 'rewards' ? 'bg-[#1a6b5c] text-white' : 'text-[#666] hover:bg-neutral-50 hover:text-[#0a0a0a]'}`}
                >
                  <span className="flex items-center space-x-2.5">
                    <Gift size={14} /> <span>Rewards & Loyalty</span>
                  </span>
                  <ChevronRight size={12} />
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full text-left p-3.5 tracking-wider uppercase select-none flex items-center justify-between ${activeTab === 'settings' ? 'bg-[#1a6b5c] text-white' : 'text-[#666] hover:bg-neutral-50 hover:text-[#0a0a0a]'}`}
                >
                  <span className="flex items-center space-x-2.5">
                    <Settings size={14} /> <span>Profile Settings</span>
                  </span>
                  <ChevronRight size={12} />
                </button>
              </div>

              {/* Log Out Button */}
              <button
                onClick={async () => {
                  try {
                    if (onLogout) {
                      onLogout();
                    } else {
                      await logout();
                    }
                  } catch (err) {
                    console.error('Error signing out:', err);
                  }
                }}
                className="w-full py-3 bg-red-100 hover:bg-red-200 text-red-700 text-xs font-mono font-medium tracking-widest uppercase rounded-sm flex items-center justify-center space-x-2 border border-red-200"
              >
                <LogOut size={14} />
                <span>Disconnect Client Session</span>
              </button>
            </div>

            {/* Dashboard Workspace Tab Content */}
            <div className="lg:col-span-3 bg-white border border-[#1a6b5c]/15 p-6 sm:p-8 shadow-sm rounded-sm">
              {/* ==================== 1. DASHBOARD PAGE ==================== */}
              {activeTab === 'dashboard' && (
                <div className="space-y-8 animate-fade-in text-[#0a0a0a]">
                  <div className="border-b border-neutral-100 pb-4">
                    <span className="text-[10px] text-[#1a6b5c] uppercase tracking-wide font-mono">LuxeLoom Club</span>
                    <h2 className="font-serif text-3xl font-light text-[#0a0a0a] tracking-normal">Welcome, {customerName}</h2>
                    <p className="text-xs text-[#666] font-light mt-1">Enjoy certified priority access over limited atelier jewelry allocations across Indian high boutiques.</p>
                  </div>

                  {/* Core Stats Bento Block */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-[#f5f0eb]/50 border border-[#1a6b5c]/10 p-5 rounded-xs space-y-2">
                      <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1a6b5c] border border-[#1a6b5c]/10">
                        <ShoppingBag size={18} />
                      </span>
                      <p className="text-[10px] text-[#666] font-mono uppercase tracking-wider">Total Active Orders</p>
                      <p className="text-2xl font-serif text-[#000]">{orders.length}</p>
                    </div>

                    <div className="bg-[#f5f0eb]/50 border border-[#1a6b5c]/10 p-5 rounded-xs space-y-2">
                      <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#1a6b5c] border border-[#1a6b5c]/10">
                        <Heart size={18} className="text-[#1a6b5c]" fill="currentColor" />
                      </span>
                      <p className="text-[10px] text-[#666] font-mono uppercase tracking-wider">Personal Wishlist Items</p>
                      <p className="text-2xl font-serif text-[#000]">{wishlist.length}</p>
                    </div>

                    <div className="bg-[#f5f0eb]/50 border border-[#1a6b5c]/10 p-5 rounded-xs space-y-2">
                      <span className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-amber-500 border border-[#1a6b5c]/10">
                        <Sparkles size={18} />
                      </span>
                      <p className="text-[10px] text-[#666] font-mono uppercase tracking-wider">LuxeLoom Rewards Points</p>
                      <p className="text-2xl font-serif text-[#000]">{pointsBalance} pts</p>
                    </div>
                  </div>

                  {/* Recent Orders Overview */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-serif text-lg font-medium text-[#0a0a0a]">Atelier Orders History Preview</h4>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-xs text-[#1a6b5c] hover:underline font-bold"
                      >
                        View All History
                      </button>
                    </div>

                    <div className="divide-y divide-[#1a6b5c]/10 border border-[#1a6b5c]/10 p-4 rounded-xs space-y-4 max-h-96 overflow-y-auto">
                      {orders && orders.length > 0 ? (
                        orders.slice(0, 3).map((item) => (
                          <div key={item.id} className="pt-3 first:pt-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                            <div>
                              <span className="text-[10px] font-mono text-zinc-400 block">{item.date}</span>
                              <span className="font-semibold text-zinc-900 block font-serif text-sm">{item.items?.[0]?.name || 'Heirloom Masterpiece'} {item.items && item.items.length > 1 ? `+ ${item.items.length - 1} other items` : ''}</span>
                              <span className="text-[10px] text-[#666] block font-mono">Reference: {item.id}</span>
                            </div>
                            <div className="flex flex-col sm:items-end gap-1.5 font-mono text-[11px] w-full sm:w-auto">
                              <span className="text-[#1a6b5c] font-semibold">₹{item.amount?.toLocaleString('en-IN')}</span>
                              <div className="flex gap-2">
                                <span className={`px-2 py-0.5 rounded-xs text-[9px] uppercase tracking-widest font-bold ${item.status === 'Delivered' ? 'bg-green-100 text-green-700' : item.status === 'Crafting' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                  {item.status}
                                </span>
                                <button
                                  onClick={() => {
                                    setSelectedOrder(item);
                                    setActiveTab('orders');
                                  }}
                                  className="text-[#1a6b5c] hover:underline font-bold"
                                >
                                  Detail View
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-neutral-400 text-xs">No active order history.</div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== 2. ORDER HISTORY PAGE ==================== */}
              {activeTab === 'orders' && (
                <div className="space-y-6 animate-fade-in text-[#0a0a0a]">
                  <div className="border-b border-neutral-100 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                      <span className="text-[10px] text-[#1a6b5c] uppercase tracking-wide font-mono">Masterpiece Acquisitions</span>
                      <h2 className="font-serif text-3xl font-light text-[#0a0a0a] tracking-normal">Registered Client orders</h2>
                    </div>

                    {/* Filter controls */}
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-[#666] font-mono">Filter State:</span>
                      <select
                        value={orderFilterStatus}
                        onChange={(e) => setOrderFilterStatus(e.target.value)}
                        className="border border-[#1a6b5c]/20 rounded-xs bg-white text-xs p-1.5"
                      >
                        <option value="All">All statuses</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Crafting">Crafting</option>
                        <option value="Shipped">Shipped</option>
                      </select>
                    </div>
                  </div>

                  {/* Orders Detail Overlay / History Table */}
                  {selectedOrder ? (
                    <div className="bg-[#f5f0eb]/40 border border-[#1a6b5c]/10 p-6 rounded-sm space-y-6">
                      <div className="flex justify-between items-center border-b border-[#1a6b5c]/15 pb-4">
                        <div>
                          <p className="text-[10px] font-mono text-[#666] uppercase">Boutique Acquisition Ref ID</p>
                          <h4 className="font-mono text-sm font-bold text-[#1a6b5c]">{selectedOrder.id}</h4>
                        </div>
                        <button
                          onClick={() => setSelectedOrder(null)}
                          className="text-xs text-[#1a6b5c] hover:underline font-bold font-mono"
                        >
                          &larr; Back to List
                        </button>
                      </div>

                      {/* Items details */}
                      <div className="space-y-4">
                        <p className="text-[10px] uppercase font-mono tracking-widest text-[#0a0a0a] font-bold">Heirloom items</p>
                        <div className="space-y-3 font-mono text-xs">
                          {selectedOrder.items && selectedOrder.items.length > 0 ? (
                            selectedOrder.items.map((item: any, i: number) => (
                              <div key={i} className="flex justify-between items-center border-b border-dashed border-[#1a6b5c]/10 pb-2">
                                <div>
                                  <p className="font-semibold text-[#0a0a0a] font-serif text-sm">{item?.name || 'Masterpiece Jewelry'}</p>
                                  <p className="text-[10px] text-[#666] mt-0.5">Quantity: {item?.quantity || 1} • Certified Hallmark Set</p>
                                </div>
                                <span className="text-[#1a6b5c] font-semibold text-sm">₹{item?.price?.toLocaleString('en-IN') || 0}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-neutral-400">No items registered for this order reference.</p>
                          )}
                        </div>
                      </div>

                      {/* Shipment Detail */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[11px] font-mono text-[#666] border-t border-[#1a6b5c]/10 pt-4">
                        <div className="space-y-1">
                          <p className="text-[10px] text-[#0a0a0a] font-bold uppercase tracking-wider">Shipping Transport</p>
                          <p>Courier: {selectedOrder.courier || 'Sequel Secure Logistics'}</p>
                          <p>Tracking ID: {selectedOrder.trackingId || 'SQL-MUM-8921'}</p>
                          <p>Estimated Arrival: {selectedOrder.estimatedDelivery || 'Recieved'}</p>
                        </div>
                        <div className="space-y-1 sm:text-right">
                          <p className="text-[10px] text-[#0a0a0a] font-bold uppercase tracking-wider">Total Value Inclusive 3% GST</p>
                          <p className="text-[#1a6b5c] text-sm font-semibold pt-1">₹{selectedOrder.amount?.toLocaleString('en-IN')}</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-3 pt-4 border-t border-[#1a6b5c]/10">
                        <button
                          onClick={() => alert(`Your formal registered tax invoice containing serial hallmarks and GST registers for ${selectedOrder.id} has been generated and queued for PDF print services.`)}
                          className="bg-[#1a6b5c] text-white py-2 px-4 rounded-xs text-[10px] font-mono uppercase tracking-wider flex items-center space-x-1.5"
                        >
                          <Download size={12} />
                          <span>Download GST Invoice</span>
                        </button>
                        <button
                          onClick={() => {
                            alert("Masterpiece specifications transferred to your vault cart. Initiating checkout profiles...");
                            onClose();
                          }}
                          className="border border-[#1a6b5c]/30 hover:border-[#1a6b5c] text-[#1a6b5c] py-2 px-4 rounded-xs text-[10px] font-mono uppercase tracking-wider"
                        >
                          Re-Order Gem
                        </button>
                        <button
                          onClick={() => alert(`A return request for ${selectedOrder.id} has been raised in our system. A senior valuation logistics manager will contact you within 24 hours to secure standard pickup profiles.`)}
                          className="border border-red-200 text-red-600 hover:bg-red-50 py-2 px-4 rounded-xs text-[10px] font-mono uppercase tracking-wider"
                        >
                          Raise Exchange / Return
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Order List */
                    <div className="border border-[#1a6b5c]/10 rounded-xs overflow-hidden">
                      {orders && orders.length > 0 ? (
                        <>
                          <table className="w-full text-left text-xs text-[#0a0a0a] font-mono hidden sm:table">
                            <thead className="bg-[#f5f0eb]/50 border-b border-[#1a6b5c]/10 text-[#666] text-[10px] uppercase tracking-wider">
                              <tr>
                                <th className="p-4">Acquisition ID</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Acquired jewel items</th>
                                <th className="p-4">Total Amount</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1a6b5c]/10 bg-white">
                              {orders
                                .filter(o => orderFilterStatus === 'All' || o.status === orderFilterStatus)
                                .map((order) => (
                                  <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                                    <td className="p-4 font-bold text-[#1a6b5c]">{order.id}</td>
                                    <td className="p-4 text-[#666]">{order.date}</td>
                                    <td className="p-4 max-w-xs truncate font-serif">{order.items?.[0]?.name || 'Heirloom Masterpiece'} {order.items && order.items.length > 1 ? `+ ${order.items.length - 1} more` : ''}</td>
                                    <td className="p-4 font-semibold text-zinc-900">₹{order.amount?.toLocaleString('en-IN')}</td>
                                    <td className="p-4">
                                      <span className={`px-2 py-0.5 rounded-xs text-[9px] uppercase tracking-widest font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status === 'Crafting' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {order.status}
                                      </span>
                                    </td>
                                    <td className="p-4 text-right">
                                      <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="p-1.5 border border-[#1a6b5c]/15 text-[#1a6b5c] text-[10px] tracking-wider uppercase rounded-xs font-bold"
                                      >
                                        Inspect
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>

                          {/* Mobile Card representation */}
                          <div className="sm:hidden divide-y divide-[#1a6b5c]/10 bg-white">
                            {orders
                              .filter(o => orderFilterStatus === 'All' || o.status === orderFilterStatus)
                              .map((order) => (
                                <div key={order.id} className="p-4 space-y-4">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-[#1a6b5c]">{order.id}</span>
                                    <span className="text-[#666]">{order.date}</span>
                                  </div>
                                  <p className="font-serif font-medium text-xs text-[#0a0a0a]">
                                    {order.items?.[0]?.name || 'Heirloom Masterpiece'} {order.items && order.items.length > 1 ? `+ ${order.items.length - 1} more` : ''}
                                  </p>
                                  <div className="flex justify-between items-center font-mono">
                                    <span className="text-sm font-bold text-zinc-900">₹{order.amount?.toLocaleString('en-IN')}</span>
                                    <span className={`px-2 py-0.5 rounded-xs text-[9px] uppercase tracking-widest font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status === 'Crafting' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                                      {order.status}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => setSelectedOrder(order)}
                                    className="w-full text-center py-2 border border-[#1a6b5c]/15 text-[#1a6b5c] uppercase tracking-wider text-[10px] font-mono font-bold"
                                  >
                                    View Order details
                                  </button>
                                </div>
                              ))}
                          </div>
                        </>
                      ) : (
                        <div className="p-12 text-center text-xs text-neutral-400 font-mono">
                          <p className="text-3xl mb-2">📦</p>
                          <p className="font-semibold text-sm mb-1 text-zinc-800">No Orders Registered Yet</p>
                          <p className="mb-4">Your order transaction logs will appear here upon boutique checkout.</p>
                          <button
                            onClick={onClose}
                            className="bg-[#1a6b5c] text-white py-2 px-5 uppercase text-[10px] tracking-wider rounded-xs font-bold"
                          >
                            Explore Masterpieces
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ==================== 3. ORDER TRACKING PAGE ==================== */}
              {activeTab === 'tracking' && (
                <div className="space-y-8 animate-fade-in text-[#0a0a0a]">
                  <div className="border-b border-neutral-100 pb-4">
                    <span className="text-[10px] text-[#1a6b5c] uppercase tracking-wide font-mono">Secured GPS Transit Networks</span>
                    <h2 className="font-serif text-3xl font-light text-[#0a0a0a] tracking-normal">Armored Transit Tracker</h2>
                    <p className="text-xs text-[#666] font-light mt-1">Insured nationwide priority transit managed by Sequel Secure Logistics.</p>
                  </div>

                  {/* Order Lookup Tracker Inputs Form */}
                  <div className="bg-[#f5f0eb]/50 border border-[#1a6b5c]/10 p-5 rounded-xs grid grid-cols-1 sm:grid-cols-2 gap-4 items-end text-xs">
                    <div className="space-y-1 font-mono">
                      <label className="text-[10px] uppercase text-[#666] block font-bold">Acquisition Ref Reference Code</label>
                      <input
                        type="text"
                        placeholder="e.g. LL-ODR-722104"
                        value={trackingIdInput}
                        onChange={(e) => setTrackingIdInput(e.target.value)}
                        className="w-full bg-white border border-[#1a6b5c]/10 p-2.5 rounded-xs"
                      />
                    </div>
                    <div className="space-y-1 font-mono">
                      <label className="text-[10px] uppercase text-[#666] block font-bold">Mobile Registered Number</label>
                      <input
                        type="tell"
                        placeholder="e.g. +91 98123 45678"
                        value={trackingMobileInput}
                        onChange={(e) => setTrackingMobileInput(e.target.value)}
                        className="w-full bg-white border border-[#1a6b5c]/10 p-2.5 rounded-xs"
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2 pt-2">
                      <button
                        onClick={() => {
                          const matched = orders.find(o => o.id.toLowerCase() === trackingIdInput.trim().toLowerCase());
                          if (matched) {
                            setQueriedTrackingOrder(matched);
                          } else {
                            alert("Reference details matched with dummy server datasets. Showcasing outstanding active order below...");
                            setQueriedTrackingOrder(orders[1]); // fallback active crafting order
                          }
                        }}
                        className="w-full py-2.5 bg-[#1a6b5c] hover:bg-[#1a6b5c]/95 text-white font-mono uppercase font-bold tracking-widest text-[10px] rounded-xs"
                      >
                        Ping Armored Transit System
                      </button>
                    </div>
                  </div>

                  {/* Active Armored transit display tracking details */}
                  {trackableOrder && (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-[#1a6b5c]/10 bg-neutral-50 rounded-xs text-xs font-mono">
                        <div>
                          <p className="text-[9px] text-zinc-400 uppercase">Acquisition reference</p>
                          <p className="font-bold text-[#1a6b5c] text-sm">{trackableOrder.id}</p>
                        </div>
                        <div className="mt-3 sm:mt-0">
                          <p className="text-[9px] text-zinc-400 uppercase">Armored Dispatch Courier</p>
                          <p className="font-medium text-zinc-900">{trackableOrder.courier}</p>
                        </div>
                        <div className="mt-3 sm:mt-0">
                          <p className="text-[9px] text-zinc-400 uppercase">Estimated Handover Delivery</p>
                          <p className="font-semibold text-zinc-900">{trackableOrder.estimatedDelivery}</p>
                        </div>
                      </div>

                      {/* Timeline flow progress bar steps */}
                      <div className="space-y-4 pt-4">
                        <p className="text-[10px] uppercase font-mono text-[#0a0a0a] tracking-widest font-bold">Security Transit Milestones</p>
                        
                        {/* Visual Step Progress Timeline bar */}
                        <div className="relative pl-6 sm:pl-0 sm:pt-10 flex flex-col sm:flex-row sm:justify-between items-start sm:items-center">
                          {/* Sled line connector */}
                          <div className="absolute left-2 top-0 bottom-0 sm:left-0 sm:right-0 sm:top-2 sm:h-0.5 bg-neutral-100 z-0 hidden sm:block pointer-events-none" />
                          <div
                            className="absolute left-2 top-0 bottom-0 sm:left-0 sm:top-2 sm:h-0.5 bg-[#1a6b5c] z-0 hidden sm:block pointer-events-none"
                            style={{ width: `${(getStatusStepInt(trackableOrder.status) / 6) * 100}%` }}
                          />

                          {stepsList.map((step, idx) => {
                            const isPast = idx <= getStatusStepInt(trackableOrder.status);
                            const isCurrent = idx === getStatusStepInt(trackableOrder.status);
                            return (
                              <div key={idx} className="relative z-10 flex sm:flex-col items-center sm:text-center text-xs pb-6 sm:pb-0 font-mono flex-1 w-full sm:w-auto">
                                {/* Bullet indicator badge */}
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border font-sans mr-4 sm:mr-0 sm:mb-2 transition-all ${
                                  isCurrent ? 'bg-[#1a6b5c] text-white border-[#1a6b5c] scale-125 shadow-md shadow-[#1a6b5c]/35' :
                                  isPast ? 'bg-[#1a6b5c]/10 text-[#1a6b5c] border-[#1a6b5c]' :
                                  'bg-white text-zinc-300 border-zinc-200'
                                }`}>
                                  {isPast ? '✓' : idx + 1}
                                </span>
                                <div className="text-left sm:text-center pl-2 sm:pl-0 sm:px-1.5">
                                  <p className={`font-semibold sm:text-[10px] uppercase tracking-wider ${isCurrent ? 'text-[#1a6b5c] scale-105' : isPast ? 'text-zinc-800' : 'text-zinc-400'}`}>{step}</p>
                                  <p className="text-[8px] text-zinc-400 mt-0.5">{isPast ? 'Verified Pass' : 'Atelier Queue'}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Map Tracking Widget Container Placeholder */}
                      <div className="border border-[#1a6b5c]/10 rounded-sm overflow-hidden bg-[#f5f0eb]/30 flex flex-col items-center justify-center py-16 text-center text-[#666] select-none relative">
                        <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-15" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800')" }} />
                        <div className="relative z-10 space-y-3 p-4 max-w-sm">
                          <span className="inline-block p-4 rounded-full bg-white border border-[#1a6b5c]/10 text-[#1a6b5c]">
                            <Compass size={24} className="animate-spin-slow" />
                          </span>
                          <h5 className="font-serif text-[#0a0a0a] text-sm">Secure Satellite GPS Network Active</h5>
                          <p className="text-[11px] font-light leading-relaxed">
                            BVC Armored GPS networks are locked. Transiting between our Rajasthan casting ateliers and Delhi secure warehouse distributions. Map tracking feeds activate 1 hour before scheduled customer window delivery.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ==================== 4. WISHLIST PAGE ==================== */}
              {activeTab === 'wishlist' && (
                <div className="space-y-6 animate-fade-in text-[#0a0a0a]">
                  <div className="border-b border-neutral-100 pb-4 flex justify-between items-end">
                    <div>
                      <span className="text-[10px] text-[#1a6b5c] uppercase tracking-wide font-mono">My personal curation</span>
                      <h2 className="font-serif text-3xl font-light text-[#0a0a0a] tracking-normal">Atelier Wishlist Vault</h2>
                    </div>
                    <button
                      onClick={() => {
                        const link = window.location.href;
                        navigator.clipboard.writeText(link);
                        alert("Your private LuxeLoom wishlist referral key has been encrypted and copied to clipboard!");
                      }}
                      className="text-xs text-[#1a6b5c] hover:underline flex items-center space-x-1.5 font-bold"
                    >
                      <Share2 size={12} />
                      <span>Share Curated Link</span>
                    </button>
                  </div>

                  {!wishlist || wishlist.length === 0 ? (
                    <div className="text-center py-16 bg-neutral-50/50 border border-[#1a6b5c]/10 rounded-xs space-y-4">
                      <Heart size={32} className="text-zinc-300 mx-auto" />
                      <p className="font-serif text-sm">Your private selection portfolio is empty.</p>
                      <button
                        onClick={onClose}
                        className="py-2.5 px-6 border border-[#1a6b5c] text-[#1a6b5c] text-[10px] tracking-widest uppercase font-mono rounded-xs"
                      >
                        Explore Showroom Masterpieces
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {wishlist.map((prod) => {
                        if (!prod) return null;
                        return (
                          <div key={prod.id} className="border border-[#1a6b5c]/10 bg-white rounded-xs overflow-hidden flex flex-col justify-between">
                            <div className="aspect-[4/3] bg-neutral-100 overflow-hidden relative">
                              <img src={prod.image || ''} alt={prod.name || 'Fine Jewellery'} className="object-cover w-full h-full" referrerPolicy="no-referrer" />
                              <button
                                onClick={() => onRemoveFromWishlist && onRemoveFromWishlist(prod)}
                                className="absolute top-2.5 right-2.5 bg-white/90 p-1.5 rounded-full text-red-500 border border-neutral-100 shadow-sm"
                                title="Delete from list"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                            <div className="p-4 space-y-2">
                              <span className="text-[9px] uppercase font-mono text-zinc-400 block">{prod.category || 'Jewelry'}</span>
                              <h4 className="font-serif text-[#0a0a0a] text-sm font-semibold">{prod.name || 'Masterpiece'}</h4>
                              <p className="text-xs font-mono font-bold text-[#1a6b5c]">₹{prod.price ? prod.price.toLocaleString('en-IN') : 'Price on Request'}</p>

                              {/* Price notification threshold toggle */}
                              <div className="pt-2 border-t border-[#1a6b5c]/10 flex items-center justify-between">
                                <span className="text-[9px] font-mono text-zinc-500 uppercase flex items-center space-x-1">
                                  <Bell size={10} className="text-[#1a6b5c]" />
                                  <span>Notify on price drops</span>
                                </span>
                                <input type="checkbox" defaultChecked className="rounded-xs border-neutral-300 text-[#1a6b5c] focus:ring-[#1a6b5c]" />
                              </div>

                              <button
                                onClick={() => {
                                  if (onAddToCart) {
                                    onAddToCart(prod);
                                    alert(`${prod.name || 'Masterpiece'} successfully transferred to your main vault bag!`);
                                  }
                                }}
                                className="w-full py-2.5 text-center bg-[#1a6b5c] text-white text-[10px] font-mono uppercase tracking-widest font-bold mt-4"
                              >
                                Move to Bag
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ==================== 5. ADDRESS BOOK PAGE ==================== */}
              {addresses && activeTab === 'addresses' && (
                <div className="space-y-6 animate-fade-in text-[#0a0a0a]">
                  <div className="border-b border-neutral-100 pb-4 flex justify-between items-end">
                    <div>
                      <span className="text-[10px] text-[#1a6b5c] uppercase tracking-wide font-mono">My dispatch registry</span>
                      <h2 className="font-serif text-3xl font-light text-[#0a0a0a] tracking-normal">Armored Address book</h2>
                    </div>
                    <button
                      onClick={() => openAddressForm()}
                      className="text-xs bg-[#1a6b5c] text-white py-2 px-3 tracking-wider uppercase font-semibold flex items-center space-x-1 hover:bg-[#1a6b5c]/90 rounded-xs"
                    >
                      <Plus size={12} />
                      <span>New Address</span>
                    </button>
                  </div>

                  {/* Form toggle */}
                  {addressFormOpen && (
                    <form onSubmit={handleSaveAddress} className="bg-[#f5f0eb]/40 border border-[#1a6b5c]/15 p-5 sm:p-6 rounded-xs grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono p-4">
                      <div className="col-span-2 border-b border-[#1a6b5c]/10 pb-2">
                        <h4 className="text-[11px] uppercase font-bold text-[#1a6b5c] font-serif">{editingAddressId ? 'Modify Address reference' : 'Add new address credentials'}</h4>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-zinc-500">Reciever Full Name</label>
                        <input required type="text" value={addrName} onChange={(e) => setAddrName(e.target.value)} className="w-full bg-white p-2 border border-neutral-200" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-zinc-500">Contact Telephone</label>
                        <input required type="text" value={addrPhone} onChange={(e) => setAddrPhone(e.target.value)} className="w-full bg-white p-2 border border-neutral-200" />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] uppercase text-zinc-500">Flat, House No, Block No</label>
                        <input required type="text" value={addrFlat} onChange={(e) => setAddrFlat(e.target.value)} className="w-full bg-white p-2 border border-neutral-200" />
                      </div>
                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] uppercase text-zinc-500">Street Road Name</label>
                        <input required type="text" value={addrStreet} onChange={(e) => setAddrStreet(e.target.value)} className="w-full bg-white p-2 border border-neutral-200" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-zinc-500">Locality Post Area</label>
                        <input required type="text" value={addrArea} onChange={(e) => setAddrArea(e.target.value)} className="w-full bg-white p-2 border border-neutral-200" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-zinc-500">City / District</label>
                        <input required type="text" value={addrCity} onChange={(e) => setAddrCity(e.target.value)} className="w-full bg-white p-2 border border-neutral-200" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-zinc-500">State Territory</label>
                        <input required type="text" value={addrState} onChange={(e) => setAddrState(e.target.value)} className="w-full bg-white p-2 border border-neutral-200" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-zinc-500">Pincode (6 digits)</label>
                        <input required type="text" maxLength={6} value={addrPin} onChange={(e) => setAddrPin(e.target.value)} className="w-full bg-white p-2 border border-neutral-200 font-mono" />
                      </div>

                      <div className="col-span-2 pt-4 flex gap-2">
                        <button type="submit" className="bg-[#1a6b5c] text-white px-4 py-2 uppercase font-bold text-[10px] rounded-xs">Save Address Entry</button>
                        <button type="button" onClick={() => setAddressFormOpen(false)} className="border border-neutral-200 px-4 py-2 uppercase text-[10px] rounded-xs">Cancel</button>
                      </div>
                    </form>
                  )}

                  {/* List Addresses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {!addresses || addresses.length === 0 ? (
                      <div className="text-center py-12 bg-neutral-50/50 border border-[#1a6b5c]/10 rounded-xs space-y-4 col-span-2">
                        <Compass size={32} className="text-zinc-300 mx-auto" />
                        <p className="font-serif text-sm">No registered delivery addresses found.</p>
                      </div>
                    ) : (
                      addresses.map((addr) => {
                        if (!addr) return null;
                        return (
                          <div key={addr.id} className={`border p-5 rounded-xs space-y-3 relative flex flex-col justify-between ${addr.isDefault ? 'border-[#1a6b5c] bg-[#1a6b5c]/5' : 'border-neutral-200 hover:border-neutral-300'}`}>
                            {addr.isDefault && (
                              <span className="absolute top-3 right-3 bg-[#1a6b5c] text-white text-[8px] tracking-wider uppercase font-bold px-1.5 py-0.5 rounded-xs font-mono">
                                Default Address
                              </span>
                            )}
                            <div className="space-y-1.5 text-xs text-[#666]">
                              <p className="font-bold text-zinc-900 font-serif text-sm">{addr.name || 'Recipient'}</p>
                              <p>{addr.flatHouse || ''}, {addr.street || ''}</p>
                              <p>{addr.area || ''}, {addr.city || ''}</p>
                              <p>{addr.state || ''} — {addr.pinCode || ''}</p>
                              <p className="text-[#0a0a0a] font-mono mt-1 pt-1 border-t border-dashed border-[#1a6b5c]/10">Tel: {addr.phone || 'N/A'}</p>
                            </div>

                            <div className="flex gap-2 pt-2 border-t border-[#1a6b5c]/10 text-[9px] font-mono uppercase font-bold">
                              <button onClick={() => openAddressForm(addr)} className="text-[#1a6b5c] hover:underline flex items-center space-x-1">
                                <Edit2 size={11} /> <span>Edit Entry</span>
                              </button>
                              <button onClick={() => handleDeleteAddress(addr.id)} className="text-red-600 hover:underline flex items-center space-x-1">
                                <Trash2 size={11} /> <span>Delete</span>
                              </button>
                              {!addr.isDefault && (
                                <button onClick={() => handleSetDefaultAddress(addr.id)} className="text-zinc-600 hover:underline">
                                  Set Default
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* ==================== 6. REWARDS & LOYALTY ==================== */}
              {activeTab === 'rewards' && (
                <div className="space-y-8 animate-fade-in text-[#0a0a0a]">
                  <div className="border-b border-neutral-100 pb-4">
                    <span className="text-[10px] text-[#1a6b5c] uppercase tracking-wide font-mono">LuxeLoom Elite Network</span>
                    <h2 className="font-serif text-3xl font-light text-[#0a0a0a] tracking-normal">Rewards & Loyalty Club</h2>
                    <p className="text-xs text-[#666] font-light mt-1">Unlock bespoke services and high gift values mapped to your custom tier status.</p>
                  </div>

                  {/* Loyalty Points display card */}
                  <div className="bg-[#1a6b5c] text-white p-6 rounded-sm relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 shadow-xl">
                    <div className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-15" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=800')" }} />
                    <div className="relative z-10 space-y-1">
                      <span className="text-[9px] uppercase tracking-widest font-mono text-[#E5D3B3] font-bold">Points Statement</span>
                      <h4 className="font-serif text-2xl font-light">Your Priority Club Balance</h4>
                      <p className="text-[11px] text-[#f5f0eb]/70">Redeem points on custom gems modifications, priority shipping or high events bookings.</p>
                    </div>
                    <div className="relative z-10 text-right sm:text-right font-mono self-stretch flex sm:flex-col justify-between sm:justify-center items-end">
                      <p className="text-3xl text-[#E5D3B3] font-semibold">{pointsBalance}</p>
                      <p className="text-[9px] uppercase tracking-widest text-[#f5f0eb] mt-1 font-bold">Points Ready</p>
                    </div>
                  </div>

                  {/* Tier status breakdown */}
                  <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono">
                    <div className="border border-neutral-200 p-4 rounded-xs space-y-1">
                      <p className="font-bold uppercase tracking-wider text-zinc-400">Silver</p>
                      <p className="text-[10px] text-zinc-500">Entry Level</p>
                      <p className="text-[#1a6b5c] font-semibold pt-1">0 - 1k pts</p>
                    </div>
                    <div className="border border-[#1a6b5c] bg-[#1a6b5c]/10 p-4 rounded-xs space-y-1 relative">
                      <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 bg-[#1a6b5c] text-white text-[7px] font-bold uppercase py-0.5 px-1 rounded-xs">Active Tier</span>
                      <p className="font-bold uppercase tracking-wider text-amber-600">Gold</p>
                      <p className="text-[10px] text-zinc-500">Elite Level</p>
                      <p className="text-[#1a6b5c] font-semibold pt-1">1k - 5k pts</p>
                    </div>
                    <div className="border border-neutral-200 p-4 rounded-xs space-y-1">
                      <p className="font-bold uppercase tracking-wider text-purple-700">Platinum</p>
                      <p className="text-[10px] text-zinc-500">Royal Level</p>
                      <p className="text-[#1a6b5c] font-semibold pt-1">5k+ pts</p>
                    </div>
                  </div>

                  {/* Generating Referral Codes */}
                  <div className="bg-neutral-50 border border-[#1a6b5c]/10 p-5 rounded-xs space-y-3 font-mono text-xs">
                    <h5 className="font-serif font-bold text-zinc-900 text-sm">Refer a Friend, Earn ₹15,000 Points Each</h5>
                    <p className="text-[11px] text-[#666] leading-relaxed font-sans">
                      Share the LuxeLoom experience with your circle. When your referred partner places their first solitaire order, we deposit 1,500 priority club points directly into both portfolios.
                    </p>
                    <div className="flex gap-2 pt-2">
                      <span className="bg-[#f5f0eb] border border-dashed border-[#1a6b5c]/20 p-2 text-center text-xs font-bold font-mono tracking-widest text-[#1a6b5c] flex-grow rounded-xs uppercase">
                        LUXELOOM-ANANYA-7221
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("LUXELOOM-ANANYA-7221");
                          alert("Referral code copied successfully! Stamped points will map instantly on partner checkout completion.");
                        }}
                        className="bg-[#1a6b5c] text-white py-2 px-4 uppercase text-[10px] tracking-wider rounded-xs font-bold"
                      >
                        Copy code
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ==================== 7. PROFILE SETTINGS PAGE ==================== */}
              {activeTab === 'settings' && (
                <div className="space-y-8 animate-fade-in text-[#0a0a0a]">
                  <div className="border-b border-neutral-100 pb-4">
                    <span className="text-[10px] text-[#1a6b5c] uppercase tracking-wide font-mono">Secured credentials</span>
                    <h2 className="font-serif text-3xl font-light text-[#0a0a0a] tracking-normal">Profile settings</h2>
                    <p className="text-xs text-[#666] font-light mt-1">Configure your login passwords, notification priorities and anniversaries settings.</p>
                  </div>

                  <form onSubmit={(e) => { e.preventDefault(); alert("Profile adjustments successfully authorized in server logs!"); }} className="space-y-4 text-xs font-mono">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-zinc-500">Customer Full name</label>
                        <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full bg-[#f5f0eb]/20 p-2.5 border" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-zinc-500">Registered Email ID</label>
                        <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="w-full bg-[#f5f0eb]/20 p-2.5 border" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-zinc-500">Contact Telephone</label>
                        <input type="text" value={customerMobile} onChange={(e) => setCustomerMobile(e.target.value)} className="w-full bg-[#f5f0eb]/20 p-2.5 border" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase text-zinc-500">Birthdate (Gift reminder!)</label>
                        <input type="date" value={customerBirthday} onChange={(e) => setCustomerBirthday(e.target.value)} className="w-full bg-[#f5f0eb]/20 p-2.5 border" />
                      </div>
                    </div>

                    {/* Change Password */}
                    <div className="border-t border-neutral-100 pt-6 space-y-4">
                      <h4 className="text-[11px] uppercase text-[#1a6b5c] font-bold">Replace Password settings</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-zinc-500">Old Password</label>
                          <input type="password" placeholder="••••••••••••" className="w-full bg-[#f5f0eb]/20 p-2.5 border" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-zinc-500">New Password</label>
                          <input type="password" placeholder="••••••••••••" className="w-full bg-[#f5f0eb]/20 p-2.5 border" />
                        </div>
                      </div>
                    </div>

                    {/* Notification Preferences */}
                    <div className="border-t border-neutral-100 pt-6 space-y-4">
                      <h4 className="text-[11px] uppercase text-[#1a6b5c] font-bold">Priority notifications</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" checked={notifSms} onChange={(e) => setNotifSms(e.target.checked)} className="rounded text-[#1a6b5c] focus:ring-[#1a6b5c]" />
                          <span className="text-[11px] text-[#666]">Send secure SMS tracking coordinates to {customerMobile}</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" checked={notifEmail} onChange={(e) => setNotifEmail(e.target.checked)} className="rounded text-[#1a6b5c] focus:ring-[#1a6b5c]" />
                          <span className="text-[11px] text-[#666]">Send appraisal, PDF invoices, and luxury pre-launch sheets to {customerEmail}</span>
                        </label>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-neutral-154 flex flex-col sm:flex-row justify-between gap-4 items-center">
                      <button
                        type="submit"
                        className="bg-[#1a6b5c] text-white py-2.5 px-6 uppercase text-[10px] tracking-wider rounded-xs font-bold"
                      >
                        Authorize Profile Updates
                      </button>
                      
                      <button
                        type="button"
                        onClick={() => {
                          const confirmDelete = window.confirm("Are you entirely sure you want to permanently erase your registered LuxeLoom profile? All active points balance and historical orders logs inside our satellite servers will be lost.");
                          if (confirmDelete) {
                            setIsLoggedIn(false);
                            alert("Client credentials flagged for complete removal. Logging out...");
                          }
                        }}
                        className="text-red-600 hover:text-red-700 font-bold hover:underline py-1.5 px-3 rounded-xs text-[10px]"
                      >
                        Delete My Account Profile
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
