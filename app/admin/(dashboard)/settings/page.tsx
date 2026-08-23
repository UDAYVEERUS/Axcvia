import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Flash } from "@/components/admin/admin-shell";
import { saveSettingsAction } from "@/app/admin/actions";
import { isCloudinaryConfigured } from "@/lib/cloudinary";
import { isDbConfigured } from "@/lib/db";
import { isRazorpayConfigured } from "@/lib/payments/razorpay";
import { getSettings } from "@/lib/services/lms";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage({ searchParams }: PageProps<"/admin/settings">) {
  const { saved, error } = await searchParams;
  const s = await getSettings();
  const integrations = [
    ["MongoDB", isDbConfigured(), "MONGODB_URI"],
    ["Razorpay payments", isRazorpayConfigured(), "RAZORPAY_KEY_ID + RAZORPAY_KEY_SECRET"],
    ["Cloudinary uploads", isCloudinaryConfigured(), "CLOUDINARY_*"],
  ] as const;
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Site settings</h1>
      {saved && <Flash tone="ok">Settings saved.</Flash>}
      {error === "nodb" && <Flash tone="error">MongoDB is not connected.</Flash>}

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        {integrations.map(([name, ok, env]) => (
          <div key={name} className="rounded-xl border bg-card p-4"><p className="font-semibold text-navy">{name}</p><p className={`mt-1 text-sm ${ok ? "text-teal" : "text-destructive"}`}>{ok ? "Connected" : "Not configured"}</p><p className="mt-1 font-mono text-[11px] text-muted-foreground">{env}</p></div>
        ))}
      </div>

      <form action={saveSettingsAction} className="mt-6 space-y-6 rounded-xl border bg-card p-6">
        <div>
          <h2 className="font-semibold text-navy">Promo banner</h2>
          <p className="text-xs text-muted-foreground">Shown on the home page and referenced at checkout.</p>
        </div>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="promoEnabled" defaultChecked={s.promoEnabled} className="size-4 accent-teal" /> Enabled</label>
        <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
          <div className="space-y-2"><Label htmlFor="promoTitle">Title</Label><Input id="promoTitle" name="promoTitle" defaultValue={s.promoTitle} /></div>
          <div className="space-y-2"><Label htmlFor="promoCode">Coupon code</Label><Input id="promoCode" name="promoCode" defaultValue={s.promoCode} className="font-mono uppercase" /></div>
        </div>
        <div className="space-y-2"><Label htmlFor="promoText">Text</Label><Textarea id="promoText" name="promoText" rows={2} defaultValue={s.promoText} /></div>

        <div><h2 className="font-semibold text-navy">Lead popup</h2><p className="text-xs text-muted-foreground">“Submit your details” form that appears once per visit.</p></div>
        <div className="flex flex-wrap items-end gap-6">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="popupEnabled" defaultChecked={s.popupEnabled} className="size-4 accent-teal" /> Enabled</label>
          <div className="space-y-2"><Label htmlFor="popupDelaySeconds">Delay (seconds)</Label><Input id="popupDelaySeconds" name="popupDelaySeconds" type="number" min="3" defaultValue={s.popupDelaySeconds} className="w-28" /></div>
        </div>

        <div><h2 className="font-semibold text-navy">Announcement bar</h2><p className="text-xs text-muted-foreground">Optional one-line message at the top of every page. Leave empty to hide.</p></div>
        <Input name="announcement" defaultValue={s.announcement} placeholder="New batch starts 1 October — 10% off for early birds" />

        <Button type="submit" size="lg" className="bg-teal text-white hover:bg-teal/90">Save settings</Button>
      </form>
    </div>
  );
}
