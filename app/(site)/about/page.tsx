import type { Metadata } from "next";
import { Compass, Eye, Heart } from "lucide-react";
import { CtaBanner } from "@/components/site/cta-banner";
import { Counter, Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { stats } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "About Us — Our Mission, Story & Milestones",
  description:
    "Axcvia was founded to close the gap between college education and industry-ready engineering skills. Learn about our mission, values, and journey.",
};

const values = [
  {
    icon: Compass,
    title: "Mission",
    text: "Make industry-grade software skills accessible to anyone with the drive to learn — regardless of degree, background, or city.",
  },
  {
    icon: Eye,
    title: "Vision",
    text: "To be India's most outcome-accountable training institute, where every rupee of fee maps to a measurable career result.",
  },
  {
    icon: Heart,
    title: "Values",
    text: "Teach honestly, keep batches small, measure placements not enrollments, and support students long after the course ends.",
  },
];

const milestones = [
  { year: "2025", event: "Axcvia founded in Bengaluru by working engineers, starting with a single Java classroom batch of 12 students." },
  { year: "Early 2026", event: "Launched Full Stack (MERN), C++ & DSA, and Testing tracks; added live-online batches for students outside Bengaluru." },
  { year: "Mid 2026", event: "First students placed at companies like Freshworks, Zoho, and Infosys; hiring network crossed 25 companies." },
  { year: "Today", event: "10+ programming courses including AI & Machine Learning, 350+ students trained, and growing every batch." },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-navy pb-16 pt-32 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-bright">About Axcvia</p>
            <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">
              We exist to close the industry-readiness gap
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">
              Colleges teach theory. Companies need shipped software. Axcvia is a young institute
              built by working engineers to bridge that gap — rigorous, project-first programming
              training in small batches, with honest career support.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.08}>
              <div className="h-full rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex size-11 items-center justify-center rounded-lg bg-teal/10">
                  <v.icon className="size-5 text-teal" aria-hidden />
                </div>
                <h2 className="mt-4 font-semibold text-navy">{v.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Our Journey" title="Milestones" />
          <div className="mx-auto mt-12 max-w-2xl">
            <ol className="relative space-y-8 border-l-2 border-teal/30 pl-8">
              {milestones.map((m, i) => (
                <Reveal key={m.year} delay={i * 0.05}>
                  <li className="relative">
                    <span
                      className="absolute -left-[41px] top-1 size-4 rounded-full border-4 border-background bg-teal"
                      aria-hidden
                    />
                    <p className="text-sm font-bold uppercase tracking-wider text-teal">{m.year}</p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/85">{m.event}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-y bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1} className="text-center">
              <Counter
                value={stat.value}
                suffix={stat.suffix}
                className="text-3xl font-extrabold text-navy sm:text-4xl"
              />
              <p className="mt-1 text-sm font-medium text-muted-foreground">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaBanner
        title="Come see how we teach"
        description="Visit a center or join a free online demo class — we'd rather show you than tell you."
        buttonLabel="Book a Free Demo"
      />
    </>
  );
}
