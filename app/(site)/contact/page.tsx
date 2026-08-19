import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { getCourseBySlug, getCourseOptions } from "@/lib/services/courses";
import { site } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Contact Us — Enquiries, Demos & Counselling",
  description:
    "Reach Axcvia by phone, WhatsApp, email, or the enquiry form. Book a free demo class or career counselling session — we respond within one business day.",
};

export default async function ContactPage({ searchParams }: PageProps<"/contact">) {
  const { course } = await searchParams;
  const courseSlug = typeof course === "string" ? course : undefined;
  const defaultCourse =
    courseSlug && (await getCourseBySlug(courseSlug)) ? courseSlug : undefined;
  const courseOptions = await getCourseOptions();

  const contactItems = [
    {
      icon: Phone,
      label: "Call us",
      value: site.phone,
      href: `tel:${site.phone.replace(/\s/g, "")}`,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Chat with a counsellor",
      href: `https://wa.me/${site.whatsapp}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: site.email,
      href: `mailto:${site.email}`,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6">
      <SectionHeading
        eyebrow="Contact"
        title="Talk to us"
        description="Book a free demo, ask about batches and fees, or just get honest career advice."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="space-y-4">
            {contactItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm transition-colors hover:border-teal/50"
              >
                <div className="flex size-11 items-center justify-center rounded-lg bg-teal/10">
                  <item.icon className="size-5 text-teal" aria-hidden />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-semibold text-navy">{item.value}</p>
                </div>
              </a>
            ))}
            <div className="rounded-xl border bg-card p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-teal/10">
                  <MapPin className="size-5 text-teal" aria-hidden />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Registered office</p>
                  <p className="font-semibold text-navy">{site.address}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="size-4" aria-hidden /> {site.hours}
                  </p>
                </div>
              </div>
              <iframe
                title="Axcvia registered office location"
                src="https://www.google.com/maps?q=Ratanpur,+Panki,+Kanpur&output=embed"
                className="mt-4 h-56 w-full rounded-lg border"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <EnquiryForm
            source="contact"
            courseOptions={courseOptions}
            defaultCourse={defaultCourse}
            heading="Send us an enquiry"
          />
        </Reveal>
      </div>
    </section>
  );
}
