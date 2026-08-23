"use client";

import { useEffect } from "react";
import { useCart } from "@/components/site/cart-provider";

export function ClearCart() {
  const { clear } = useCart();
  useEffect(() => clear(), [clear]);
  return null;
}
