import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Pricing Policy",
  description: "How Axcvia prices its courses, bundles and mock test series — fees, taxes, payment terms, validity and price changes.",
};

export default function PricingPolicyPage() {
  return (
    <LegalPage
      title="Pricing Policy"
      updated="23 August 2026"
      sections={[
        { heading: "Fees and charges", body: [
          `All course, bundle and mock-test-series fees are listed on ${site.url} in Indian Rupees (₹). Unless stated otherwise on the course page, listed prices are inclusive of applicable GST.`,
          "Fees cover instruction, recordings, study material and mock tests included in the course. Any optional extras (third-party certification exam fees, hardware) are communicated before enrollment.",
        ]},
        { heading: "Payment terms", body: [
          "Full payment, or the first installment of an approved installment plan, is required to activate course access.",
          "Online payments are processed securely by Razorpay (UPI, cards, net banking, EMI). Offline payments via bank transfer or UPI are confirmed by our team within one business day.",
          "Discount coupons must be applied at checkout and cannot be applied retrospectively. New-student coupons are valid only on your first purchase.",
        ]},
        { heading: "Enrollment validity", body: [
          "Each course shows its access validity (for example 90 days or lifetime). Access to recordings, materials and mock tests ends when the validity period expires. Renewal is available at the prevailing price.",
        ]},
        { heading: "Price changes", body: [
          `${site.name} may revise fees at any time. Changes apply to new enrollments only — a fee already paid is never increased.`,
          "Promotional prices are valid for the period stated and may be withdrawn without notice.",
        ]},
        { heading: "Course cancellation by Axcvia", body: [
          "If we cancel a batch or course, you will be offered a transfer to an equivalent course or a full refund of the fee paid.",
        ]},
        { heading: "Refunds", body: [
          "Refunds are governed by our Refund Policy. Please review it before enrolling.",
        ]},
        { heading: "Contact", body: [`Questions about pricing? Email ${site.email} or call ${site.phone}.`] },
      ]}
    />
  );
}
