import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { formatInr } from "@/components/site/course-card";
import { connectDb, isDbConfigured } from "@/lib/db";
import { OrderModel } from "@/lib/models/order";
import { getCurrentStudent } from "@/lib/student/auth";

export const metadata: Metadata = { title: "Orders", robots: { index: false } };

const style: Record<string, string> = { paid: "bg-teal/10 text-teal", pending: "bg-gold/15 text-gold-deep", failed: "bg-destructive/10 text-destructive", cancelled: "bg-muted text-muted-foreground" };

export default async function OrdersPage() {
  const student = (await getCurrentStudent())!;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let orders: any[] = [];
  if (isDbConfigured()) {
    await connectDb();
    orders = await OrderModel.find({ userId: student.id }).sort({ createdAt: -1 }).lean();
  }
  if (orders.length === 0) return <p className="rounded-xl border border-dashed bg-card p-10 text-center text-sm text-muted-foreground">No orders yet.</p>;
  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={String(o._id)} className="rounded-xl border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">Order #{String(o._id).slice(-8).toUpperCase()} · {new Date(o.createdAt).toLocaleDateString("en-IN")}</p>
            <Badge className={`${style[o.status] ?? ""} hover:${style[o.status] ?? ""}`} variant="secondary">{o.status}</Badge>
          </div>
          <ul className="mt-3 divide-y text-sm">
            {o.items.map((it: any) => (<li key={it.slug} className="flex justify-between py-1.5"><span>{it.title}</span><span>{formatInr(it.price)}</span></li>))}
          </ul>
          {o.discount > 0 && <p className="mt-2 flex justify-between text-sm text-teal"><span>Coupon {o.couponCode}</span><span>− {formatInr(o.discount)}</span></p>}
          <p className="mt-1 flex justify-between font-bold text-navy"><span>Total</span><span>{formatInr(o.total)}</span></p>
          {o.status === "pending" && <p className="mt-2 text-xs text-muted-foreground">Awaiting payment — our counsellor will call you with UPI / bank transfer / installment options.</p>}
        </div>
      ))}
    </div>
  );
}
