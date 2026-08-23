import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatInr } from "@/components/site/course-card";
import { updateOrderStatusAction } from "@/app/admin/actions";
import { connectDb, isDbConfigured } from "@/lib/db";
import { OrderModel } from "@/lib/models/order";

export const metadata: Metadata = { title: "Orders" };

const style: Record<string, string> = { paid: "bg-teal/10 text-teal", pending: "bg-gold/15 text-gold-deep", failed: "bg-destructive/10 text-destructive", cancelled: "bg-muted text-muted-foreground" };

export default async function OrdersPage() {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let orders: any[] = [];
  let dbReady = false;
  if (isDbConfigured()) {
    try {
      await connectDb();
      orders = await OrderModel.find().sort({ createdAt: -1 }).limit(300).populate("userId", "name email phone").lean();
      dbReady = true;
    } catch {}
  }
  const revenue = orders.filter((o) => o.status === "paid").reduce((s, o) => s + o.total, 0);
  const pending = orders.filter((o) => o.status === "pending").reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Orders</h1>
      <p className="text-sm text-muted-foreground">Every checkout — online (Razorpay) and pay-later. Mark a pay-later order as <strong>paid</strong> once money arrives to unlock the student&apos;s courses.</p>
      {dbReady && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[["Orders", String(orders.length)], ["Revenue (paid)", formatInr(revenue)], ["Awaiting payment", formatInr(pending)]].map(([l, v]) => (
            <div key={l} className="rounded-xl border bg-card p-4"><p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{l}</p><p className="mt-1 text-2xl font-extrabold text-navy">{v}</p></div>
          ))}
        </div>
      )}
      {!dbReady ? (
        <p className="mt-6 rounded-lg border bg-card p-4 text-sm text-muted-foreground">Connect MongoDB to see orders.</p>
      ) : orders.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">No orders yet.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>Order</TableHead><TableHead>Student</TableHead><TableHead>Items</TableHead><TableHead>Total</TableHead><TableHead>Method</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={String(o._id)}>
                  <TableCell><p className="font-mono text-xs">#{String(o._id).slice(-8).toUpperCase()}</p><p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleString("en-IN")}</p></TableCell>
                  <TableCell>{o.userId ? <Link href={`/admin/students/${o.userId._id}`} className="font-medium text-navy hover:text-teal">{o.userId.name}</Link> : "—"}<p className="text-xs text-muted-foreground">{o.userId?.phone} {o.userId?.email}</p></TableCell>
                  <TableCell className="max-w-64 text-sm">{o.items.map((i: any) => i.title).join(", ")}</TableCell>
                  <TableCell className="whitespace-nowrap font-medium">{formatInr(o.total)}{o.discount > 0 && <span className="block text-xs text-teal">−{formatInr(o.discount)} {o.couponCode}</span>}</TableCell>
                  <TableCell className="text-xs">{o.paymentMethod}{o.razorpayPaymentId && <span className="block font-mono text-muted-foreground">{o.razorpayPaymentId}</span>}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={style[o.status] ?? ""} variant="secondary">{o.status}</Badge>
                      <form action={updateOrderStatusAction} className="flex items-center gap-1">
                        <input type="hidden" name="id" value={String(o._id)} />
                        <select name="status" defaultValue={o.status} className="border-input h-7 rounded-md border bg-transparent px-1.5 text-xs outline-none" aria-label="Update order status">
                          <option value="pending">pending</option><option value="paid">paid</option><option value="failed">failed</option><option value="cancelled">cancelled</option>
                        </select>
                        <Button type="submit" variant="outline" size="xs">Set</Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
