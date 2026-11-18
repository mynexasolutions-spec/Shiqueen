"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  plating: string;
  quantity: number;
  giftWrap?: boolean;
  giftMessage?: string;
}

interface CartContextValue {
  items: CartItem[];
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }, openCart?: boolean) => void;
  removeItem: (id: string, plating: string, giftWrap?: boolean) => void;
  updateQuantity: (id: string, plating: string, quantity: number, giftWrap?: boolean) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  totalOriginalPrice: number;
  giftWrapTotal: number;
  grandTotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "shiqueen_cart_v1";
export const GIFT_WRAP_PRICE = 50;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // ignore storage errors
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore storage errors
    }
  }, [items, hydrated]);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addItem: CartContextValue["addItem"] = (newItem, openCart = true) => {
    const qty = newItem.quantity ?? 1;
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.id === newItem.id &&
          i.plating === newItem.plating &&
          Boolean(i.giftWrap) === Boolean(newItem.giftWrap)
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
          giftMessage: newItem.giftMessage || updated[existingIndex].giftMessage,
        };
        return updated;
      }
      return [
        ...prev,
        {
          ...newItem,
          quantity: qty,
        },
      ];
    });
    if (openCart) {
      setIsDrawerOpen(true);
    }
  };

  const removeItem: CartContextValue["removeItem"] = (id, plating, giftWrap) => {
    setItems((prev) =>
      prev.filter(
        (i) =>
          !(
            i.id === id &&
            i.plating === plating &&
            Boolean(i.giftWrap) === Boolean(giftWrap)
          )
      )
    );
  };

  const updateQuantity: CartContextValue["updateQuantity"] = (
    id,
    plating,
    quantity,
    giftWrap
  ) => {
    if (quantity <= 0) {
      removeItem(id, plating, giftWrap);
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.id === id &&
        i.plating === plating &&
        Boolean(i.giftWrap) === Boolean(giftWrap)
          ? { ...i, quantity }
          : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalOriginalPrice = items.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  );
  const giftWrapTotal = items.reduce(
    (sum, item) => sum + (item.giftWrap ? GIFT_WRAP_PRICE * item.quantity : 0),
    0
  );
  const grandTotal = subtotal + giftWrapTotal;

  return (
    <CartContext.Provider
      value={{
        items,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        totalOriginalPrice,
        giftWrapTotal,
        grandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
