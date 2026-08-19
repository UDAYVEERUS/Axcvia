import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The terms governing your use of the Axcvia website and training services.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="19 August 2026"
      sections={[
        {
          heading: "Acceptance of terms",
          body: [
            "By using the Axcvia website, submitting an enquiry, or enrolling in a course, you agree to these terms. If you do not agree, please do not use our services.",
          ],
        },
        {
          heading: "Enrollment & course delivery",
          body: [
            "Enrollment is confirmed on receipt of the applicable fee or first installment. Batch start dates, timings, and trainers are communicated in advance; Axcvia may reschedule sessions with reasonable notice. Curriculum content is periodically updated to stay industry-relevant.",
          ],
        },
        {
          heading: "Fees & payments",
          body: [
            "Fees are as listed on the course page or in a written quote at the time of enrollment. Installment schedules, once agreed, must be honored for continued course access. Late installments may suspend access to classes and materials until cleared.",
          ],
        },
        {
          heading: "Placement assistance",
          body: [
            "Placement assistance includes resume preparation, mock interviews, and scheduling interviews with hiring partners for students who complete the course and internal assessments. Axcvia facilitates opportunities but does not guarantee employment or any specific salary.",
          ],
        },
        {
          heading: "Intellectual property & conduct",
          body: [
            "Course materials, recordings, and assignments are for enrolled students' personal use only and may not be redistributed or resold. Students are expected to maintain respectful conduct toward trainers, staff, and peers; violation may result in removal without refund.",
          ],
        },
        {
          heading: "Limitation of liability & contact",
          body: [
            `Axcvia's liability for any claim is limited to the fees paid for the relevant course. For questions about these terms, contact ${site.email}.`,
          ],
        },
      ]}
    />
  );
}
