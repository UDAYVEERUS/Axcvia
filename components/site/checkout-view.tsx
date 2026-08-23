"use client";

import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreditCard, Loader2, PhoneCall, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/components/site/cart-provider";
import { formatInr } from "@/components/site/course-card";
import { createOrderAction, validateCouponAction } from "@/app/student-actions";

declare global {
  interface Window {
    Razorpay?: new (opts: Record<string, unknown>) => { open: () => void };
  }
}

export function CheckoutView({ studentName, razorpayEnabled, promo }: { studentName: string; razorpayEnabled: boolean; promo: { code: string; title: string } | null }) {
  const { lines, subtotal, ready } = useCart();
  const router = useRouter();
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState<{ code: string; discount: number; description: string } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [method, setMethod] = useState<"razorpay" | "pay-later">(razorpayEnabled ? "razorpay" : "pay-later");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const cartLines = lines.map((l) => ({ kind: l.kind, slug: l.slug }));
  const discount = applied?.discount ?? 0;
  const total = Math.max(0, subtotal - discount);

  async function applyCoupon() {
    setCouponError("");
    const res = await validateCouponAction({ lines: cartLines, couponCode: coupon });
    if (res.error) {
      setApplied(null);
      setCouponError(res.error);
    } else {
      setApplied({ code: coupon.toUpperCase(), discount: res.discount, description: res.description ?? "" });
    }
  }

  async function placeOrder() {
    setBusy(true);
    setError("");
    const res = await createOrderAction({ lines: cartLines, couponCode: applied?.code ?? "", method });
    if (res.error) {
      setError(res.error);
      setBusy(false);
      return;
    }
    if (!res.razorpay) {
      router.push(`/checkout/success?order=${res.orderId}`);
      return;
    }
    if (!window.Razorpay) {
      setError("Payment gateway failed to load. Please refresh and try again.");
      setBusy(false);
      return;
    }
    const rzp = new window.Razorpay({
      key: res.razorpay.keyId,
      amount: res.razorpay.amountPaise,
      currency: "INR",
      name: "Axcvia",
      description: lines.map((l) => l.title).join(", ").slice(0, 200),
      order_id: res.razorpay.razorpayOrderId,
      prefill: { name: res.razorpay.name, email: res.razorpay.email, contact: res.razorpay.phone },
      theme: { color: "#00a6a6" },
      modal: { ondismiss: () => setBusy(false) },
      handler: async (resp: Record<string, string>) => {
        const verify = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: res.orderId, ...resp }),
        });
        if (verify.ok) router.push(`/checkout/success?order=${res.orderId}`);
        else {
          setError("We couldn't verify the payment. If money was deducted, contact us with your payment ID.");
          setBusy(false);
        }
      },
    });
    rzp.open();
  }

  if (ready && lines.length === 0) {
    return (
      <section className="mx-auto max-w-2xl px-4 pb-20 pt-32 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-navy">Your cart is empty</h1>
        <Button asChild className="mt-4 bg-teal text-white hover:bg-teal/90"><Link href="/courses">Browse courses</Link></Button>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-5xl px-4 pb-20 pt-32 sm:px-6">
      {razorpayEnabled && <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />}
      <h1 className="text-3xl font-extrabold tracking-tight text-navy">Checkout</h1>
      <p className="mt-1 text-sm text-muted-foreground">Signed in as {studentName}</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-5">
            <h2 className="font-semibold text-navy">Order summary</h2>
            <ul className="mt-3 divide-y text-sm">
              {lines.map((l) => (
                <li key={`${l.kind}:${l.slug}`} className="flex justify-between py-2">
                  <span>{l.title}<span className="ml-2 text-xs uppercase tracking-wider text-muted-foreground">{l.kind}</span></span>
                  <span className="font-medium">{formatInr(l.price)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border bg-card p-5">
            <h2 className="flex items-center gap-2 font-semibold text-navy"><Tag className="size-4 text-teal" aria-hidden /> Coupon code</h2>
            {promo && !applied && (
              <p className="mt-1 text-xs text-muted-foreground">{promo.title} — use code <button type="button" className="font-mono font-semibold text-teal" onClick={() => setCoupon(promo.code)}>{promo.code}</button></p>
            )}
            <div className="mt-3 flex gap-2">
              <Input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="Enter code" aria-label="Coupon code" className="font-mono uppercase" />
              <Button type="button" variant="outline" onClick={applyCoupon} disabled={!coupon}>Apply</Button>
            </div>
            {couponError && <p className="mt-2 text-xs font-medium text-destructive">{couponError}</p>}
            {applied && <p className="mt-2 text-xs font-medium text-teal">{applied.code} applied — {applied.description || "discount"} (−{formatInr(applied.discount)})</p>}
          </div>

          <fieldset className="rounded-xl border bg-card p-5">
            <legend className="px-1 font-semibold text-navy">Payment method</legend>
            <div className="mt-2 space-y-2">
              {razorpayEnabled && (
                <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${method === "razorpay" ? "border-teal bg-teal/5" : ""}`}>
                  <input type="radio" name="method" checked={method === "razorpay"} onChange={() => setMethod("razorpay")} className="mt-1 accent-teal" />
                  <span>
                    <span className="flex items-center gap-2 font-medium text-navy"><CreditCard className="size-4" aria-hidden /> Pay online now</span>
                    <span className="block text-xs text-muted-foreground">UPI, cards, net banking, EMI via Razorpay. Instant access after payment.</span>
                  </span>
                </label>
              )}
              <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${method === "pay-later" ? "border-teal bg-teal/5" : ""}`}>
                <input type="radio" name="method" checked={method === "pay-later"} onChange={() => setMethod("pay-later")} className="mt-1 accent-teal" />
                <span>
                  <span className="flex items-center gap-2 font-medium text-navy"><PhoneCall className="size-4" aria-hidden /> Reserve now, pay after counselling call</span>
                  <span className="block text-xs text-muted-foreground">We call you within one business day with UPI / bank / installment options. Access unlocks on payment.</span>
                </span>
              </label>
            </div>
          </fieldset>
        </div>

        <aside className="h-fit rounded-xl border bg-card p-5 lg:sticky lg:top-24">
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatInr(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-teal"><span>Discount</span><span>− {formatInr(discount)}</span></div>}
            <div className="flex justify-between text-lg font-bold text-navy"><span>Total</span><span>{formatInr(total)}</span></div>
          </div>
          {error && <p role="alert" className="mt-3 text-xs font-medium text-destructive">{error}</p>}
          <Button size="lg" className="mt-4 w-full bg-teal text-white hover:bg-teal/90" disabled={busy || !ready} onClick={placeOrder}>
            {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
            {method === "razorpay" && total > 0 ? `Pay ${formatInr(total)}` : total === 0 ? "Enroll free" : "Place order"}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            By placing this order you agree to our <Link href="/terms-of-service" className="underline">terms</Link>, <Link href="/pricing-policy" className="underline">pricing</Link> and <Link href="/refund-policy" className="underline">refund</Link> policies.
          </p>
        </aside>
      </div>
    </section>
  );
}
