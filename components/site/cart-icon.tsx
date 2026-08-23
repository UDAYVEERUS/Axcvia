"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/site/cart-provider";

export function CartIcon() {
  const { lines, ready } = useCart();
  return (
    <Link href="/cart" aria-label={`Cart, ${lines.length} items`} className="relative rounded-md p-2 text-foreground/80 hover:bg-accent">
      <ShoppingCart className="size-5" aria-hidden />
      {ready && lines.length > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-teal text-[10px] font-bold text-white">
          {lines.length}
        </span>
      )}
    </Link>
  );
}
