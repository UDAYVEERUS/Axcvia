"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export interface CartLine {
  kind: "course" | "bundle";
  slug: string;
  title: string;
  price: number;
  image?: string;
}

interface CartContextValue {
  lines: CartLine[];
  add: (line: CartLine) => void;
  remove: (kind: CartLine["kind"], slug: string) => void;
  clear: () => void;
  has: (kind: CartLine["kind"], slug: string) => boolean;
  subtotal: number;
  ready: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);
const KEY = "axcvia-cart-v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  // Hydrate from localStorage after mount (deferred so hydration markup matches the server).
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) setLines(JSON.parse(raw));
      } catch {}
      setReady(true);
    }, 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const add = useCallback((line: CartLine) => {
    setLines((prev) => (prev.some((l) => l.kind === line.kind && l.slug === line.slug) ? prev : [...prev, line]));
  }, []);
  const remove = useCallback((kind: CartLine["kind"], slug: string) => {
    setLines((prev) => prev.filter((l) => !(l.kind === kind && l.slug === slug)));
  }, []);
  const clear = useCallback(() => setLines([]), []);
  const has = useCallback((kind: CartLine["kind"], slug: string) => lines.some((l) => l.kind === kind && l.slug === slug), [lines]);
  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.price, 0), [lines]);

  const value = useMemo(() => ({ lines, add, remove, clear, has, subtotal, ready }), [lines, add, remove, clear, has, subtotal, ready]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
