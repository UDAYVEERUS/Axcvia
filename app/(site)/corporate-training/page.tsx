import type { Metadata } from "next";
import Image from "next/image";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {
  BrainCircuit,
  Building2,
  ClipboardCheck,
  CloudCog,
  Code2,
  Coffee,
  Presentation,
  ShieldCheck,
  Target,
} from "lucide-react";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { LogoMarquee } from "@/components/site/logo-marquee";
import { Counter, Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { getCourseOptions } from "@/lib/services/courses";

export const metadata: Metadata = {
  title: "Corporate Training — Upskill Your Engineering Teams",
  description:
    "Customized corporate training in modern web development, Java, AI & ML, cloud, and QA — delivered live-online (with on-site workshops on request) by Axcvia's industry-expert trainers. Get a proposal in two business days.",
};

const corporateStats = [
  { label: "Corporate Batches Delivered", value: 12, suffix: "+" },
  { label: "Engineers Upskilled", value: 300, suffix: "+" },
  { label: "Avg. Training Rating", value: 4.8, suffix: "/5" },
  { label: "Cities Reached Online", value: 20, suffix: "+" },
];

const steps = [
  {
    icon: Target,
    title: "Needs Assessment",
    text: "We audit your team's current skills and define measurable learning outcomes with your engineering leads.",
    color: "from-teal to-teal-bright",
  },
  {
    icon: Presentation,
    title: "Custom Curriculum",
    text: "Courses tailored to your stack and codebase patterns — from a 2-day workshop to a 12-week program.",
    color: "from-navy to-teal",
  },
  {
    icon: Building2,
    title: "Flexible Delivery",
    text: "Live-online sessions scheduled around your sprint calendar — on-site workshops at your office available on request.",
    color: "from-gold-deep to-gold",
  },
  {
    icon: ClipboardCheck,
    title: "Assessment & Reporting",
    text: "Pre/post skill assessments, project evaluations, and completion reports for L&D stakeholders.",
    color: "from-navy-deep to-navy",
  },
];

const trainingTracks = [
  {
    icon: Code2,
    title: "Modern Web & Full Stack",
    topics: ["React & Next.js", "Node.js APIs", "TypeScript", "Testing & performance"],
  },
  {
    icon: Coffee,
    title: "Java & Enterprise Backend",
    topics: ["Spring Boot", "Microservices", "JPA & SQL tuning", "System design"],
  },
  {
    icon: BrainCircuit,
    title: "AI & Machine Learning",
    topics: ["LLM APIs & RAG", "AI agents", "Python for ML", "GenAI for engineers"],
  },
  {
    icon: CloudCog,
    title: "Cloud, DevOps & QA",
    topics: ["AWS & Kubernetes", "CI/CD pipelines", "Test automation", "Observability"],
  },
];

const corporateFaqs = [
  {
    question: "What is the minimum or maximum team size?",
    answer:
      "We train cohorts from 5 to 40 engineers per batch. Larger groups are split into parallel batches so every participant still gets hands-on attention and code reviews.",
  },
  {
    question: "Can the curriculum be customized to our tech stack?",
    answer:
      "Yes — that's the default, not an add-on. After the needs assessment we adapt examples, labs, and the capstone to your actual stack, coding standards, and even anonymized patterns from your codebase.",
  },
  {
    question: "Do you deliver online, on-site, or both?",
    answer:
      "We're online-first: live instructor-led sessions over video, scheduled around your sprint calendar. For larger engagements we can arrange on-site workshops at your office on request — many clients pair an on-site kickoff with weekly online sessions.",
  },
  {
    question: "How is pricing structured?",
    answer:
      "Per-batch pricing based on duration, depth, and delivery format — not per head, so you can add participants without surprise costs. You get a fixed, itemized quote with the proposal; there are no hidden charges.",
  },
  {
    question: "What happens after the training ends?",
    answer:
      "Every program includes 30 days of post-training support: a doubt-clearing channel with the trainer, session recordings, and a completion report with individual assessment scores for your L&D team.",
  },
  {
    question: "How quickly can a program start?",
    answer:
      "A scoped workshop can start within 2 weeks of sign-off. Fully customized multi-week programs typically start within 3–4 weeks, depending on curriculum depth and trainer scheduling.",
  },
];

export default async function CorporateTrainingPage() {
  const courseOptions = await getCourseOptions();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy pb-20 pt-32 text-white">
        <Image
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=70"
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
            <Badge className="bg-gold text-navy-deep hover:bg-gold">For Companies</Badge>
            <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">
              Corporate training that ships better software
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">
              Upskill your teams in modern web development, Java, AI & ML, cloud, and QA with
              customized programs delivered by engineers who&apos;ve done the work at scale.
            </p>
          </Reveal>
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
            {corporateStats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1}>
                {Number.isInteger(stat.value) ? (
                  <Counter
                    value={stat.value}
                    suffix={stat.suffix}
                    className="text-3xl font-extrabold text-gold sm:text-4xl"
                  />
                ) : (
                  <span className="text-3xl font-extrabold text-gold sm:text-4xl">
                    {stat.value}
                    {stat.suffix}
                  </span>
                )}
                <p className="mt-1 text-sm text-white/70">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="overflow-hidden border-b bg-card py-12">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground">
          Our network spans teams at
        </p>
        <Reveal className="mt-8">
          <LogoMarquee />
        </Reveal>
      </section>

      {/* How it works — steps */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="How It Works"
          title="From skills gap to shipped results"
        />
        <div className="relative mt-16 hidden lg:block">
          <div
            aria-hidden
            className="absolute left-[12%] right-[12%] top-8 border-t-2 border-dashed border-teal/40"
          />
          <div className="grid grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.12}>
                <div className="group flex flex-col items-center text-center">
                  <div className="relative">
                    <div
                      className={`flex size-16 items-center justify-center rounded-full bg-gradient-to-br ${step.color} shadow-lg ring-6 ring-background transition-transform duration-300 group-hover:scale-110`}
                    >
                      <step.icon className="size-7 text-white" aria-hidden />
                    </div>
                    <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full border-2 border-dashed border-teal bg-card text-xs font-bold text-teal">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mt-5 font-semibold text-navy">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <ol className="relative mt-12 space-y-10 border-l-2 border-dashed border-teal/40 pl-10 lg:hidden">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <li className="relative">
                <div
                  className={`absolute -left-[61px] flex size-12 items-center justify-center rounded-full bg-gradient-to-br ${step.color} shadow-md ring-4 ring-background`}
                >
                  <step.icon className="size-5 text-white" aria-hidden />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-teal">Step {i + 1}</p>
                <h3 className="mt-1 font-semibold text-navy">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Training tracks */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="What We Teach"
            title="Training tracks for engineering teams"
            description="Every track is delivered hands-on: your engineers write code in labs from day one, not watch slides."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trainingTracks.map((track, i) => (
              <Reveal key={track.title} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-teal shadow-sm transition-transform group-hover:scale-110">
                    <track.icon className="size-5.5 text-white" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-semibold text-navy">{track.title}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {track.topics.map((topic) => (
                      <li key={topic} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ShieldCheck className="size-3.5 shrink-0 text-teal" aria-hidden />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Proposal form */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Get a Proposal"
              title="Tell us about your team"
              description="Share your team size, tech stack, and goals. We'll respond with a tailored program outline and a fixed quote within two business days."
            />
            <ul className="mt-8 space-y-4">
              {[
                "Free needs-assessment call with a lead trainer",
                "Fixed per-batch pricing — no per-head surprises",
                "30 days of post-training support included",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 rounded-xl border bg-card p-4 text-sm font-medium text-foreground/85 shadow-sm">
                  <ShieldCheck className="mt-0.5 size-4.5 shrink-0 text-teal" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>
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

      {/* Corporate FAQ */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Corporate FAQ"
            title="What L&D teams usually ask"
          />
          <Reveal className="mt-10">
            <Accordion
              type="single"
              collapsible
              defaultValue={corporateFaqs[0].question}
              className="rounded-2xl border bg-card px-6 py-2 shadow-sm"
            >
              {corporateFaqs.map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger className="text-left font-semibold text-navy">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>
    </>
  );
}
