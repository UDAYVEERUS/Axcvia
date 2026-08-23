import type { Metadata } from "next";
import { CheckoutView } from "@/components/site/checkout-view";
import { isRazorpayConfigured } from "@/lib/payments/razorpay";
import { getSettings } from "@/lib/services/lms";
import { requireStudent } from "@/lib/student/auth";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const [student, settings] = await Promise.all([requireStudent("/checkout"), getSettings()]);
  return (
    <CheckoutView
      studentName={student.name}
      razorpayEnabled={isRazorpayConfigured()}
      promo={settings.promoEnabled ? { code: settings.promoCode, title: settings.promoTitle } : null}
    />
  );
}
