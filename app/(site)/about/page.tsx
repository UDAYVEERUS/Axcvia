import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Code2,
  Compass,
  Eye,
  GitPullRequest,
  Heart,
  Rocket,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CtaBanner } from "@/components/site/cta-banner";
import { Counter, Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { trainers } from "@/lib/data/people";
import { stats } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "About Us — Our Mission, Story & Team",
  description:
    "Axcvia is a programming training institute founded by working engineers in Kanpur. Learn about our mission, how we teach, our journey so far, and the team behind it.",
};

const values = [
  {
    icon: Compass,
    title: "Mission",
    text: "Make industry-grade software skills accessible to anyone with the drive to learn — regardless of degree, background, or city.",
    color: "from-teal to-teal-bright",
  },
  {
    icon: Eye,
    title: "Vision",
    text: "To be India's most outcome-accountable training institute, where every rupee of fee maps to a measurable career result.",
    color: "from-navy to-teal",
  },
  {
    icon: Heart,
    title: "Values",
    text: "Teach honestly, keep batches small, measure placements not enrollments, and support students long after the course ends.",
    color: "from-gold-deep to-gold",
  },
];

const teachingPrinciples = [
  {
    icon: Code2,
    title: "Code From Day One",
    text: "No week-long theory marathons — you write and ship code in the very first session.",
  },
  {
    icon: Users,
    title: "Batches of 15, Max",
    text: "Small enough that your trainer knows your name, your code, and your weak spots.",
  },
  {
    icon: GitPullRequest,
    title: "Real Code Reviews",
    text: "Every project gets line-by-line review — the same feedback loop real engineering teams use.",
  },
  {
    icon: Rocket,
    title: "Career Support Built In",
    text: "Mock interviews, resume clinics, and hiring-network referrals are part of the course, not an upsell.",
  },
];

const milestones = [
  {
    year: "2025",
    title: "Founded in Kanpur",
    text: "Started by working engineers with a single live-online Java batch of 12 students.",
  },
  {
    year: "Early 2026",
    title: "New tracks, more batches",
    text: "Launched Full Stack (MERN), C++ & DSA, and Testing tracks; grew to parallel weekday and weekend live-online batches.",
  },
  {
    year: "Mid 2026",
    title: "First placements",
    text: "First students placed at companies like Freshworks, Zoho, and Infosys; hiring network crossed 25 companies.",
  },
  {
    year: "Today",
    title: "Growing every batch",
    text: "14+ programming courses including AI & Machine Learning, 350+ students trained across India — fully online, with classroom centers on the roadmap.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy pb-20 pt-32 text-white">
        <Image
          src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=70"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-20"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/80 to-navy" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6">
          <Reveal>
            <Badge className="bg-gold text-navy-deep hover:bg-gold">Our Story</Badge>
            <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">
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

      {/* Story — collage + text */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border-4 border-card shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=1200&q=75"
                  alt="The Axcvia team collaborating"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-navy/35 to-transparent" />
              </div>
              <div className="absolute -bottom-8 -right-3 hidden w-44 overflow-hidden rounded-2xl border-4 border-card shadow-xl sm:block md:-right-8">
                <div className="relative aspect-square">
                  <Image
                    src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=400&q=70"
                    alt="A student coding during class"
                    fill
                    sizes="176px"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="absolute -left-3 -top-5 flex items-center gap-2.5 rounded-xl border bg-card/95 px-4 py-3 shadow-lg backdrop-blur sm:-left-6">
                <div className="flex size-9 items-center justify-center rounded-lg bg-teal/10">
                  <Code2 className="size-4.5 text-teal" aria-hidden />
                </div>
                <div>
                  <p className="text-sm font-bold text-navy">Built by Engineers</p>
                  <p className="text-xs text-muted-foreground">Who still write code</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">Who We Are</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-navy">
              Built by engineers, run like a product team
            </h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Axcvia started in 2025 with one uncomfortable observation: most training institutes
              optimize for enrollments, not outcomes. We decided to run ours the way startups run
              products — small, honest, and iterating fast on the only metric that matters: how
              many students start real tech careers.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Every trainer still writes production code",
                "Curriculum updated every batch, not every year",
                "Projects reviewed personally, line by line",
                "Placement support that lasts until you're hired",
              ].map((point) => (
                <li key={point} className="flex items-start gap-2.5 text-sm font-medium text-foreground/85">
                  <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-teal" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="What Drives Us" title="Mission, vision & values" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.08}>
                <div className="group relative h-full overflow-hidden rounded-2xl border bg-card p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div
                    aria-hidden
                    className={`absolute -right-10 -top-10 size-28 rounded-full bg-gradient-to-br ${v.color} opacity-10 transition-transform duration-500 group-hover:scale-150`}
                  />
                  <div
                    className={`flex size-13 items-center justify-center rounded-2xl bg-gradient-to-br ${v.color} shadow-md transition-transform group-hover:scale-110`}
                  >
                    <v.icon className="size-6 text-white" aria-hidden />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-navy">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How we teach — dark band */}
      <section className="relative overflow-hidden bg-navy py-20 text-white">
        <div
          aria-hidden
          className="absolute -left-24 top-0 size-72 rounded-full bg-teal/15 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 -right-16 size-72 rounded-full bg-gold/15 blur-3xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-bright">
              How We Teach
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              The classroom works like a real dev team
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teachingPrinciples.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur transition-colors hover:bg-white/10">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-teal/20">
                    <p.icon className="size-5 text-teal-bright" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{p.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones — alternating dotted timeline */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="Our Journey" title="Small institute, fast trajectory" />
        <div className="relative mt-16">
          {/* Center rail on desktop, left rail on mobile */}
          <div
            aria-hidden
            className="absolute bottom-4 left-5 top-4 border-l-2 border-dashed border-teal/40 md:left-1/2 md:-translate-x-px"
          />
          <div className="space-y-12">
            {milestones.map((m, i) => (
              <Reveal key={m.year} delay={i * 0.08}>
                <div
                  className={`relative flex items-start gap-6 pl-14 md:w-1/2 md:pl-0 ${
                    i % 2 === 0
                      ? "md:pr-14 md:text-right"
                      : "md:ml-auto md:flex-row-reverse md:pl-14"
                  }`}
                >
                  <div
                    className={`absolute left-0 top-0 md:left-auto ${
                      i % 2 === 0 ? "md:-right-5" : "md:-left-5"
                    }`}
                  >
                    <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-navy to-teal shadow-md ring-4 ring-background">
                      <span className="size-2.5 rounded-full bg-gold" aria-hidden />
                    </div>
                  </div>
                  <div
                    className={`w-full rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md`}
                  >
                    <Badge className="bg-teal/10 text-teal hover:bg-teal/10">{m.year}</Badge>
                    <h3 className="mt-3 font-bold text-navy">{m.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{m.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team preview */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="The Team"
            title="The people behind Axcvia"
            description="Engineers, data scientists, and career coaches — every one of them still practicing what they teach."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {trainers.map((t, i) => (
              <Reveal key={t.slug} delay={i * 0.06}>
                <div className="group h-full rounded-2xl border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-navy to-teal text-lg font-bold text-white ring-4 ring-teal/15 transition-transform group-hover:scale-105">
                    {t.name.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <h3 className="mt-4 font-semibold text-navy">{t.name}</h3>
                  <p className="text-sm text-teal">{t.role}</p>
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {t.expertise.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10 text-center">
            <Button asChild variant="outline">
              <Link href="/trainers">
                Meet the Full Faculty <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* Stats */}
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
