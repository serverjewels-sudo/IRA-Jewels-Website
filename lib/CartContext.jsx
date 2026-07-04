"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";
import { calculateProductPrice } from "./priceUtils";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [goldRate, setGoldRate] = useState(null);
  const fetchPromiseRef = useRef(null);
  const lastFetchTimeRef = useRef(0);

  // Helper to fetch latest gold rate with caching and promise-sharing to avoid concurrent duplicate requests
  const fetchLatestRate = async () => {
    const now = Date.now();
    if (goldRate && now - lastFetchTimeRef.current < 5000) {
      return goldRate;
    }
    if (fetchPromiseRef.current) {
      return fetchPromiseRef.current;
    }

    fetchPromiseRef.current = (async () => {
      try {
        const { data, error } = await supabase
          .from("gold_rates")
          .select("rate_999")
          .eq("id", 1)
          .maybeSingle();
        if (!error && data) {
          const rate = data.rate_999;
          setGoldRate(rate);
          lastFetchTimeRef.current = Date.now();
          return rate;
        }
      } catch (err) {
        console.error("Failed to fetch gold rate in CartProvider:", err);
      } finally {
        fetchPromiseRef.current = null;
      }
      return goldRate;
    })();

    return fetchPromiseRef.current;
  };

  // Load cart from localStorage once on mount (client-side only to avoid hydration mismatch)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem("ira_jewels_cart");
      if (storedCart) {
        try {
          setItems(JSON.parse(storedCart));
        } catch (error) {
          console.error("Failed to parse cart data from localStorage:", error);
        }
      }
    }
    setIsLoaded(true);
    fetchLatestRate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save cart to localStorage whenever items change, after the initial load has completed
  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      localStorage.setItem("ira_jewels_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  // Add to cart function
  const addToCart = (product, selectedSize = null, selectedColour = null) => {
    // Construct a unique composite key for item variation
    const cartItemId = `${product.id}-${selectedSize || "default"}-${selectedColour || "default"}`;
    
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.productId === cartItemId);
      if (existingIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + 1,
        };
        return updatedItems;
      }

      const image = product.images?.[0] || product.image;
      return [
        ...prevItems,
        {
          productId: cartItemId,
          id: product.id,
          slug: product.slug,
          name: product.name,
          image: image,
          selectedSize: selectedSize,
          selectedColour: selectedColour,
          quantity: 1,
          
          // Raw pricing component fields:
          net_gold_weight: product.net_gold_weight,
          diamond_net_amount: product.diamond_net_amount,
          making_net_amount: product.making_net_amount,
          other_net_amount: product.other_net_amount,
          gst_percentage: product.gst_percentage,
          karat: product.karat,
          
          // Legacy / fallback fields:
          price: product.price,
          priceVal: product.priceVal,
        },
      ];
    });
  };

  // Remove from cart
  const removeFromCart = (productId) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
  };

  // Update quantity (newQty must be >= 1)
  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) return;
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // Clear all items in the cart
  const clearCart = () => {
    setItems([]);
  };

  // Derive total quantity and total price
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => {
    const calculated = calculateProductPrice(item, goldRate);
    return sum + calculated.priceVal * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        totalPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
