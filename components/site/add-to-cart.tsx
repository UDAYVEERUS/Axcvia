"use client";

import { useRouter } from "next/navigation";
import { Check, ShoppingCart, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, type CartLine } from "@/components/site/cart-provider";

export function AddToCartButtons({ line, size = "lg", buyNow = true, className }: { line: CartLine; size?: "sm" | "lg" | "default"; buyNow?: boolean; className?: string }) {
  const cart = useCart();
  const router = useRouter();
  const inCart = cart.has(line.kind, line.slug);
  return (
    <div className={className ?? "grid gap-2"}>
      {buyNow && (
        <Button
          size={size}
          className="bg-teal text-white hover:bg-teal/90"
          onClick={() => {
            cart.add(line);
            router.push("/checkout");
          }}
        >
          <Zap className="size-4" aria-hidden /> Buy now
        </Button>
      )}
      <Button
        size={size}
        variant={buyNow ? "outline" : "default"}
        className={buyNow ? "" : "bg-teal text-white hover:bg-teal/90"}
        onClick={() => (inCart ? router.push("/cart") : cart.add(line))}
      >
        {inCart ? <Check className="size-4" aria-hidden /> : <ShoppingCart className="size-4" aria-hidden />}
        {inCart ? "In cart — view" : "Add to cart"}
      </Button>
    </div>
  );
}
