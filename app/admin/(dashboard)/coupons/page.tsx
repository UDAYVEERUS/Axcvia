import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Flash } from "@/components/admin/admin-shell";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteCouponAction, saveCouponAction } from "@/app/admin/actions";
import { connectDb, isDbConfigured } from "@/lib/db";
import { CouponModel } from "@/lib/models/coupon";
import { coupons as seed } from "@/lib/data/lms";
import { toCoupon } from "@/lib/services/lms";

export const metadata: Metadata = { title: "Coupons" };

export default async function CouponsPage({ searchParams }: PageProps<"/admin/coupons">) {
  const { saved, deleted, error } = await searchParams;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  type Row = (typeof seed)[number] & { uses: number; source: "seed" | "database" };
  let rows: Row[] = seed.map((c) => ({ ...c, uses: 0, source: "seed" }));
  let dbReady = false;
  if (isDbConfigured()) {
    try {
      await connectDb();
      const docs: any[] = await CouponModel.find().sort({ createdAt: -1 }).lean();
      const byCode = new Map<string, Row>(rows.map((r) => [r.code, r]));
      for (const d of docs) byCode.set(d.code, { ...toCoupon(d), uses: d.uses ?? 0, source: "database" });
      rows = [...byCode.values()];
      dbReady = true;
    } catch {}
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Coupons</h1>
      <p className="text-sm text-muted-foreground">Discount codes students apply at checkout.</p>
      {saved && <Flash tone="ok">Coupon saved.</Flash>}
      {deleted && <Flash tone="ok">Coupon deleted.</Flash>}
      {error === "nodb" && <Flash tone="error">MongoDB is not connected.</Flash>}
      {!dbReady && !error && <Flash tone="muted">Showing the seeded WELCOME10 coupon. Connect MongoDB to manage coupons.</Flash>}

      <form action={saveCouponAction} className="mt-6 grid gap-4 rounded-xl border bg-card p-5 sm:grid-cols-3 lg:grid-cols-6">
        <div className="space-y-2"><Label htmlFor="code">Code *</Label><Input id="code" name="code" required className="font-mono uppercase" placeholder="WELCOME10" /></div>
        <div className="space-y-2 sm:col-span-2"><Label htmlFor="description">Description</Label><Input id="description" name="description" placeholder="10% off for new students" /></div>
        <div className="space-y-2"><Label htmlFor="percentOff">% off</Label><Input id="percentOff" name="percentOff" type="number" min="0" max="100" defaultValue={0} /></div>
        <div className="space-y-2"><Label htmlFor="flatOff">₹ off</Label><Input id="flatOff" name="flatOff" type="number" min="0" defaultValue={0} /></div>
        <div className="space-y-2"><Label htmlFor="minAmount">Min order ₹</Label><Input id="minAmount" name="minAmount" type="number" min="0" defaultValue={0} /></div>
        <div className="space-y-2"><Label htmlFor="expiresAt">Expires</Label><Input id="expiresAt" name="expiresAt" type="date" /></div>
        <div className="flex flex-wrap items-end gap-4 text-sm sm:col-span-3 lg:col-span-4">
          <label className="flex items-center gap-2"><input type="checkbox" name="newStudentsOnly" className="size-4 accent-teal" /> New students only</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked className="size-4 accent-teal" /> Active</label>
        </div>
        <div className="flex items-end"><Button type="submit" className="w-full bg-teal text-white hover:bg-teal/90">Save coupon</Button></div>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Discount</TableHead><TableHead>Rules</TableHead><TableHead>Uses</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((c) => (
              <TableRow key={c.code}>
                <TableCell><p className="font-mono font-semibold text-navy">{c.code}</p><p className="text-xs text-muted-foreground">{c.description}</p></TableCell>
                <TableCell>{c.percentOff ? `${c.percentOff}%` : ""}{c.percentOff && c.flatOff ? " + " : ""}{c.flatOff ? `₹${c.flatOff}` : ""}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{c.newStudentsOnly && "New students · "}{c.minAmount ? `min ₹${c.minAmount} · ` : ""}{c.expiresAt ? `until ${new Date(c.expiresAt).toLocaleDateString("en-IN")}` : "no expiry"}</TableCell>
                <TableCell>{c.uses}</TableCell>
                <TableCell><Badge variant="secondary" className={c.active ? "bg-teal/10 text-teal" : "text-muted-foreground"}>{c.active ? "Active" : "Inactive"}</Badge></TableCell>
                <TableCell className="text-right">{c.source === "database" && <DeleteButton slug={c.code} label="coupon" action={deleteCouponAction} />}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">Saving a code that already exists updates it.</p>
    </div>
  );
}
