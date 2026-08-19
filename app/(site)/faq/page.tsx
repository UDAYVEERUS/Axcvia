import type { Metadata } from "next";
import Link from "next/link";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaqExplorer } from "@/components/site/faq-explorer";
import { Reveal } from "@/components/site/motion";
import { faqs } from "@/lib/data/people";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about Axcvia's live-online courses, formats, fees, installments, placements, and refund policy — searchable by topic.",
};

const contactChannels = [
  {
    icon: Phone,
    label: "Call us",
    value: site.phone,
    hint: site.hours,
    href: `tel:${site.phone.replace(/\s/g, "")}`,
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Chat with a counsellor",
    hint: "Fastest replies",
    href: `https://wa.me/${site.whatsapp}`,
  },
  {
    icon: Mail,
    label: "Email",
    value: site.email,
    hint: "Replies within a business day",
    href: `mailto:${site.email}`,
  },
];

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

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-secondary/70 via-background to-background pb-4 pt-32">
        <div
          aria-hidden
          className="absolute -left-24 top-10 size-72 rounded-full bg-teal/10 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -right-24 top-24 size-72 rounded-full bg-gold/10 blur-3xl"
        />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <Reveal>
            <Badge className="bg-teal/10 text-teal hover:bg-teal/10">Help Center</Badge>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-navy sm:text-5xl">
              How can we help?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              Search our most-asked questions about courses, fees, formats, and placements — or
              filter by topic below.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Explorer */}
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6">
        <Reveal>
          <FaqExplorer faqs={faqs} />
        </Reveal>
      </section>

      {/* Still stuck — contact channels */}
      <section className="border-t bg-secondary/40 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <Reveal className="text-center">
            <h2 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              Still have a question?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Our counsellors answer every enquiry personally — pick whichever channel suits you.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {contactChannels.map((channel, i) => (
              <Reveal key={channel.label} delay={i * 0.08}>
                <a
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="group flex h-full flex-col items-center rounded-2xl border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-teal/40 hover:shadow-lg"
                >
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-teal transition-transform group-hover:scale-110">
                    <channel.icon className="size-5 text-white" aria-hidden />
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">{channel.label}</p>
                  <p className="font-semibold text-navy">{channel.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{channel.hint}</p>
                </a>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <Button asChild size="lg" className="bg-teal text-white hover:bg-teal/90">
              <Link href="/contact">Book a Free Demo Class</Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
