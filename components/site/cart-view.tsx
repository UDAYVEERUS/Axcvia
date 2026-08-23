"use client";

import Link from "next/link";
import { ArrowRight, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/site/cart-provider";
import { formatInr } from "@/components/site/course-card";

export function CartView() {
  const { lines, remove, subtotal, ready } = useCart();
  return (
    <section className="mx-auto max-w-4xl px-4 pb-20 pt-32 sm:px-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-navy">Your cart</h1>
      {!ready ? null : lines.length === 0 ? (
        <div className="mt-10 rounded-xl border border-dashed bg-card p-12 text-center">
          <ShoppingCart className="mx-auto size-10 text-muted-foreground" aria-hidden />
          <p className="mt-3 font-semibold text-navy">Currently empty: ₹0</p>
          <Button asChild className="mt-4 bg-teal text-white hover:bg-teal/90">
            <Link href="/courses">Continue shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <ul className="divide-y rounded-xl border bg-card">
            {lines.map((l) => (
              <li key={`${l.kind}:${l.slug}`} className="flex items-center gap-4 p-4">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal">{l.kind === "bundle" ? "Bundle" : "Course"}</p>
                  <Link href={l.kind === "bundle" ? `/bundles/${l.slug}` : `/courses/${l.slug}`} className="font-semibold text-navy hover:text-teal">{l.title}</Link>
                </div>
                <p className="font-bold text-navy">{formatInr(l.price)}</p>
                <button type="button" onClick={() => remove(l.kind, l.slug)} aria-label={`Remove ${l.title}`} className="rounded-md p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
          <aside className="h-fit rounded-xl border bg-card p-5">
            <div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>{formatInr(subtotal)}</span></div>
            <p className="mt-1 text-xs text-muted-foreground">Coupons and installment options on the next step.</p>
            <Button asChild size="lg" className="mt-4 w-full bg-teal text-white hover:bg-teal/90">
              <Link href="/checkout">Checkout <ArrowRight className="size-4" aria-hidden /></Link>
            </Button>
            <Button asChild variant="link" className="mt-1 w-full text-teal"><Link href="/courses">Continue shopping</Link></Button>
          </aside>
        </div>
      )}
    </section>
  );
}
