import type { Metadata } from "next";
import { Building2, ClipboardCheck, Presentation, Target } from "lucide-react";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { getCourseOptions } from "@/lib/services/courses";
import { hiringPartners } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Corporate Training — Upskill Your Engineering Teams",
  description:
    "Customized corporate training programs in modern web development, data science, cloud, and QA — delivered on-site or online by Axcvia's industry-expert trainers.",
};

const steps = [
  {
    icon: Target,
    title: "Needs Assessment",
    text: "We audit your team's current skills and define measurable learning outcomes with your engineering leads.",
  },
  {
    icon: Presentation,
    title: "Custom Curriculum",
    text: "Courses tailored to your stack and codebase patterns — from a 2-day workshop to a 12-week program.",
  },
  {
    icon: Building2,
    title: "Flexible Delivery",
    text: "On-site at your office, at our centers, or live-online — scheduled around your sprint calendar.",
  },
  {
    icon: ClipboardCheck,
    title: "Assessment & Reporting",
    text: "Pre/post skill assessments, project evaluations, and completion reports for L&D stakeholders.",
  },
];

export default async function CorporateTrainingPage() {
  const courseOptions = await getCourseOptions();

  return (
    <>
      <section className="bg-navy pb-16 pt-32 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-bright">
              For Companies
            </p>
            <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">
              Corporate training that ships better software
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">
              Upskill your teams in modern web development, data science, cloud, and QA with
              customized programs delivered by engineers who&apos;ve done the work at scale.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="How It Works"
          title="From skills gap to shipped results"
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <div className="h-full rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex size-11 items-center justify-center rounded-lg bg-teal/10">
                  <step.icon className="size-5 text-teal" aria-hidden />
                </div>
                <p className="mt-4 text-sm font-semibold uppercase tracking-wider text-teal">
                  Step {i + 1}
                </p>
                <h3 className="mt-1 font-semibold text-navy">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Trusted By"
            title="Teams we've trained and hired for"
          />
          <Reveal className="mt-8 flex flex-wrap justify-center gap-3">
            {hiringPartners.slice(0, 12).map((partner) => (
              <span
                key={partner}
                className="rounded-full border bg-card px-5 py-2 text-sm font-semibold text-foreground/70"
              >
                {partner}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Get a Proposal"
              title="Tell us about your team"
              description="Share your team size, tech stack, and goals. We'll respond with a tailored program outline and quote within two business days."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <EnquiryForm
              source="corporate-training"
              courseOptions={courseOptions}
              heading="Request a Corporate Training Proposal"
              buttonLabel="Request Proposal"
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
