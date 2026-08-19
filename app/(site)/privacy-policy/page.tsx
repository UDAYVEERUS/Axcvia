import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Axcvia collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="19 August 2026"
      sections={[
        {
          heading: "Information we collect",
          body: [
            "When you submit an enquiry, register for a demo, or enroll in a course, we collect your name, phone number, email address, and the course you are interested in. If you create a student account, we additionally store your login credentials (passwords are hashed, never stored in plain text) and your enrollment and payment history.",
            "We also collect standard analytics data — pages visited, device type, and referral source — via Google Analytics to improve the website.",
          ],
        },
        {
          heading: "How we use your information",
          body: [
            "We use your contact details to respond to enquiries, schedule demo classes, share batch and fee information, and provide enrolled students with course materials and certificates. We may send occasional course updates by email or WhatsApp; you can opt out at any time.",
            "We never sell your personal data to third parties.",
          ],
        },
        {
          heading: "Data sharing",
          body: [
            "With your consent, we share relevant profile details (name, course completed, project portfolio) with hiring partners as part of placement assistance. Payment processing is handled by our payment gateway partners (Razorpay/Stripe); we do not store your card details.",
          ],
        },
        {
          heading: "Data security & retention",
          body: [
            "All traffic is encrypted over HTTPS. Access to lead and student data is restricted to authorized staff. Enquiry data is retained for up to 24 months; student records are retained as required for certification and legal compliance.",
          ],
        },
        {
          heading: "Your rights & contact",
          body: [
            `You may request access to, correction of, or deletion of your personal data at any time by writing to ${site.email}. We respond to all requests within 30 days.`,
          ],
        },
      ]}
    />
  );
}
