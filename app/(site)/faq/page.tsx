import type { Metadata } from "next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CtaBanner } from "@/components/site/cta-banner";
import { Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { faqs } from "@/lib/data/people";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about Axcvia's courses, formats, fees, installments, placements, and refund policy.",
};

const categories = ["General", "Courses", "Payments", "Placements"] as const;

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="mx-auto max-w-4xl px-4 pb-16 pt-32 sm:px-6">
        <SectionHeading
          eyebrow="Help Center"
          title="Frequently asked questions"
          description={`Can't find what you're looking for? Call us at ${site.phone} or use the contact form.`}
        />
        <div className="mt-12 space-y-10">
          {categories.map((cat) => {
            const items = faqs.filter((f) => f.category === cat);
            if (items.length === 0) return null;
            return (
              <Reveal key={cat}>
                <h2 className="text-lg font-bold text-navy">{cat}</h2>
                <Accordion type="single" collapsible className="mt-2">
                  {items.map((f) => (
                    <AccordionItem key={f.question} value={f.question}>
                      <AccordionTrigger className="text-left">{f.question}</AccordionTrigger>
                      <AccordionContent className="leading-relaxed text-muted-foreground">
                        {f.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Reveal>
            );
          })}
        </div>
      </section>
      <CtaBanner
        title="Still have questions?"
        description="Our counsellors answer every enquiry personally — usually within a few hours on business days."
        buttonLabel="Contact Us"
      />
    </>
  );
}
