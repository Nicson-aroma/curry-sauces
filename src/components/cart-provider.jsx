"use client";

import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "meahs-cart";
const CartContext = createContext(null);

function normalizeItems(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .map((item) => ({
      slug: item?.slug,
      quantity: Number.parseInt(item?.quantity, 10) || 0,
    }))
    .filter((item) => typeof item.slug === "string" && item.quantity > 0);
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const storedItems = window.localStorage.getItem(STORAGE_KEY);
      setItems(normalizeItems(storedItems ? JSON.parse(storedItems) : []));
    } catch {
      setItems([]);
    } finally {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [isReady, items]);

  function addItem(slug, quantity = 1) {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.slug === slug);

      if (!existingItem) {
        return [...currentItems, { slug, quantity }];
      }

      return currentItems.map((item) =>
        item.slug === slug
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    });
  }

  function setItemQuantity(slug, quantity) {
    if (quantity <= 0) {
      setItems((currentItems) => currentItems.filter((item) => item.slug !== slug));
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.slug === slug ? { ...item, quantity } : item
      )
    );
  }

  function removeItem(slug) {
    setItems((currentItems) => currentItems.filter((item) => item.slug !== slug));
  }

  function clearCart() {
    setItems([]);
  }

  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        isReady,
        addItem,
        setItemQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider.");
  }

  return context;
}
