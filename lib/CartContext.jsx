"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

  // Load cart from localStorage once on mount (client-side only to avoid hydration mismatch)
  useEffect(() => {
    const storedCart = localStorage.getItem("ira_jewels_cart");
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (error) {
        console.error("Failed to parse cart data from localStorage:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever items change, after the initial load has completed
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("ira_jewels_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  // Add to cart function
  const addToCart = (product, selectedSize = null, selectedColour = null) => {
    setItems((prevItems) => {
      // Construct a unique composite key for item variation
      const cartItemId = `${product.id}-${selectedSize || "default"}-${selectedColour || "default"}`;
      
      const existingIndex = prevItems.findIndex((item) => item.productId === cartItemId);

      if (existingIndex > -1) {
        // If product already in cart with same size/color, increment quantity
        const updatedItems = [...prevItems];
        updatedItems[existingIndex] = {
          ...updatedItems[existingIndex],
          quantity: updatedItems[existingIndex].quantity + 1,
        };
        return updatedItems;
      } else {
        // Otherwise, add a new item to cart
        const priceVal = product.priceVal || parseInt(product.price.replace(/[^\d]/g, ""), 10);
        const image = product.images?.[0] || product.image;

        return [
          ...prevItems,
          {
            productId: cartItemId,
            id: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            priceVal: priceVal,
            image: image,
            selectedSize: selectedSize,
            selectedColour: selectedColour,
            quantity: 1,
          },
        ];
      }
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
  const totalPrice = items.reduce((sum, item) => sum + item.priceVal * item.quantity, 0);

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
