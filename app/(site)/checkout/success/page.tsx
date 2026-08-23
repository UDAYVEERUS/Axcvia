import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { connectDb, isDbConfigured } from "@/lib/db";
import { OrderModel } from "@/lib/models/order";
import { formatInr } from "@/components/site/course-card";
import { requireStudent } from "@/lib/student/auth";
import { ClearCart } from "@/components/site/clear-cart";

export const metadata: Metadata = { title: "Order Confirmed", robots: { index: false } };

export default async function CheckoutSuccessPage({ searchParams }: PageProps<"/checkout/success">) {
  const student = await requireStudent("/dashboard");
  const { order: orderId } = await searchParams;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let order: any = null;
  if (isDbConfigured() && typeof orderId === "string") {
    await connectDb();
    order = await OrderModel.findOne({ _id: orderId, userId: student.id }).lean().catch(() => null);
  }
  const paid = order?.status === "paid";
  return (
    <section className="mx-auto max-w-2xl px-4 pb-20 pt-32 text-center sm:px-6">
      <ClearCart />
      {paid ? <CheckCircle2 className="mx-auto size-14 text-teal" aria-hidden /> : <Clock className="mx-auto size-14 text-gold" aria-hidden />}
      <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-navy">{paid ? "Payment successful — you're enrolled!" : "Order received — seat reserved"}</h1>
      <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
        {paid
          ? "Your courses are unlocked. Head to your dashboard to start learning, attempt mock tests and download study material."
          : "A counsellor will call you within one business day to confirm your batch and share payment options (UPI / bank transfer / installments). Your courses unlock as soon as payment is confirmed."}
      </p>
      {order && (
        <div className="mx-auto mt-6 max-w-md rounded-xl border bg-card p-4 text-left text-sm">
          <p className="text-xs text-muted-foreground">Order #{String(order._id).slice(-8).toUpperCase()}</p>
          <ul className="mt-2 divide-y">
            {order.items.map((it: any) => (
              <li key={it.slug} className="flex justify-between py-1.5"><span>{it.title}</span><span>{formatInr(it.price)}</span></li>
            ))}
          </ul>
          {order.discount > 0 && <p className="mt-2 flex justify-between text-teal"><span>Discount ({order.couponCode})</span><span>− {formatInr(order.discount)}</span></p>}
          <p className="mt-1 flex justify-between font-bold text-navy"><span>Total</span><span>{formatInr(order.total)}</span></p>
        </div>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild size="lg" className="bg-teal text-white hover:bg-teal/90"><Link href="/dashboard">Go to my dashboard</Link></Button>
        <Button asChild size="lg" variant="outline"><Link href="/courses">Browse more courses</Link></Button>
      </div>
    </section>
  );
}
