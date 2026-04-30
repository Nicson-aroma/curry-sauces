"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { productDetailsBySlug } from "../lib/meahs-data";

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

function toSafeMoney(value) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const storedItems = window.localStorage.getItem(STORAGE_KEY);
        setItems(normalizeItems(storedItems ? JSON.parse(storedItems) : []));
      } catch {
        setItems([]);
      } finally {
        setIsReady(true);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    try {
      if (isReady) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      }
    } catch {
      // Ignore persistence errors.
    }
  }, [isReady, items]);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timer = window.setTimeout(() => setToast(null), 2400);
    return () => window.clearTimeout(timer);
  }, [toast]);

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

    const product = productDetailsBySlug[slug];
    if (product) {
      setToast({
        title: `${product.name} added`,
        description: "Your basket has been updated.",
      });
    }
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
  const isValidBatch = itemCount === 6 || itemCount === 12;

  const detailedItems = useMemo(
    () =>
      items.map((item) => {
        const product = productDetailsBySlug[item.slug];
        const unitPrice = toSafeMoney(product?.priceValue);
        return {
          ...item,
          product,
          lineTotal: unitPrice * item.quantity,
        };
      }),
    [items]
  );

  const totalPrice = detailedItems.reduce((total, item) => total + toSafeMoney(item.lineTotal), 0);

  return (
    <CartContext.Provider
      value={{
        items,
        detailedItems,
        itemCount,
        totalPrice,
        isReady,
        isCartOpen,
        isValidBatch,
        toast,
        addItem,
        setItemQuantity,
        removeItem,
        clearCart,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
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
