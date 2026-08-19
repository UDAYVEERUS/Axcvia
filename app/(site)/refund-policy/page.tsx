import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Axcvia's cancellation and refund policy for classroom, online, and self-paced courses.",
};

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund Policy"
      updated="19 August 2026"
      sections={[
        {
          heading: "Instructor-led courses (classroom & live-online)",
          body: [
            "You may cancel within 7 calendar days of your batch start date for a full refund minus a ₹2,000 processing fee, provided less than 20% of scheduled sessions have been delivered.",
            "After 7 days or once 20% of the course has been delivered, fees are non-refundable, but you may transfer your enrollment to a later batch of the same course once, free of charge, or transfer it to another person.",
          ],
        },
        {
          heading: "Self-paced courses",
          body: [
            "Self-paced purchases are refundable within 48 hours of purchase if less than 10% of the content has been accessed. After that window, purchases are non-refundable.",
          ],
        },
        {
          heading: "Batch cancellation by Axcvia",
          body: [
            "If Axcvia cancels a batch (for example, due to insufficient enrollment), you may choose a full refund — including any processing fee — or a free transfer to another batch or course of equal value.",
          ],
        },
        {
          heading: "How to request a refund",
          body: [
            `Email ${site.email} from your registered email address with your enrollment details. Approved refunds are processed to the original payment method within 7–10 business days.`,
          ],
        },
      ]}
    />
  );
}
