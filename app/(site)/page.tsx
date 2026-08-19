import Link from "next/link";
import {
  ArrowRight,
  Award,
  BarChart3,
  Braces,
  BrainCircuit,
  Briefcase,
  Bug,
  CloudCog,
  Coffee,
  Globe,
  Laptop,
  Layers,
  PlayCircle,
  Smartphone,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Hero } from "@/components/site/hero";
import { CourseCard } from "@/components/site/course-card";
import { CtaBanner } from "@/components/site/cta-banner";
import { LogoMarquee } from "@/components/site/logo-marquee";
import { Counter, Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { TestimonialWall } from "@/components/site/testimonial-wall";
import { getAllCourses } from "@/lib/services/courses";
import { faqs, testimonials, trainers } from "@/lib/data/people";
import { stats } from "@/lib/data/site";

const journeySteps = [
  {
    icon: PlayCircle,
    title: "Free Demo & Counselling",
    text: "Sit in on a real class, then get a personal learning-path plan mapped to your background and goals.",
    color: "from-teal to-teal-bright",
  },
  {
    icon: Laptop,
    title: "Learn by Building",
    text: "Mentor-led batches capped at 15 — daily doubt-clearing, code reviews, and real projects from week one.",
    color: "from-navy to-teal",
  },
  {
    icon: Award,
    title: "Capstone & Certificate",
    text: "Ship a portfolio-grade capstone, get it evaluated by your trainer, and earn your Axcvia certificate.",
    color: "from-gold-deep to-gold",
  },
  {
    icon: Users,
    title: "Interview Preparation",
    text: "Mock interviews, resume clinics, and DSA practice with brutal-but-useful feedback until you're ready.",
    color: "from-teal to-navy",
  },
  {
    icon: Briefcase,
    title: "Get Placed & Beyond",
    text: "Referrals through our hiring network, plus lifetime access to recordings and the alumni community.",
    color: "from-navy-deep to-navy",
  },
];

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Programming: Braces,
  "Full Stack": Layers,
  "Web Development": Globe,
  Java: Coffee,
  "AI & Machine Learning": BrainCircuit,
  "Data Science": BarChart3,
  "Testing / QA": Bug,
  "Mobile Development": Smartphone,
  "DevOps & Cloud": CloudCog,
};

export default async function HomePage() {
  const courses = await getAllCourses();
  const featured = courses.filter((c) => c.featured).slice(0, 8);
  const categoryGroups = [...new Set(courses.map((c) => c.category))].map((category) => ({
    category,
    courses: courses.filter((c) => c.category === category),
  }));

  return (
    <>
      <Hero />

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

      {/* Featured courses */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Featured Courses"
          title="Programs that get you hired"
          description="Job-oriented tracks with live projects, expert mentorship, and dedicated placement support."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((course, i) => (
            <Reveal key={course.slug} delay={i * 0.08}>
              <CourseCard course={course} />
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/courses">
              View All Courses <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </Reveal>
      </section>

      {/* Browse by category — internal-link rich for SEO */}
      <section className="border-y bg-card py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Explore by Category"
            title="Programming courses for every career path"
            description="From your first line of code to advanced AI engineering — pick the track that matches where you want to go."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categoryGroups.map((group, i) => {
              const Icon = categoryIcons[group.category] ?? Braces;
              return (
                <Reveal key={group.category} delay={i * 0.05}>
                  <div className="group h-full rounded-2xl border bg-background p-6 transition-all hover:-translate-y-1 hover:border-teal/40 hover:shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-navy to-teal transition-transform group-hover:scale-110">
                        <Icon className="size-5 text-white" aria-hidden />
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy">{group.category}</h3>
                        <p className="text-xs text-muted-foreground">
                          {group.courses.length} course{group.courses.length > 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <ul className="mt-4 space-y-2">
                      {group.courses.slice(0, 3).map((course) => (
                        <li key={course.slug}>
                          <Link
                            href={`/courses/${course.slug}`}
                            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-teal"
                          >
                            <ArrowRight className="size-3.5 shrink-0 text-teal/60" aria-hidden />
                            {course.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why choose us — journey steps */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Why Choose Us"
            title="Your journey from beginner to hired"
            description="We're a startup ourselves — lean, honest, and measured on one thing: how many of our students start real tech careers. Here's how we get you there, step by step."
          />

          {/* Desktop: horizontal steps with dotted connector */}
          <div className="relative mt-16 hidden lg:block">
            <div
              aria-hidden
              className="absolute left-[10%] right-[10%] top-8 border-t-2 border-dashed border-teal/40"
            />
            <div className="grid grid-cols-5 gap-6">
              {journeySteps.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.12} className="relative">
                  <div className="group flex flex-col items-center text-center">
                    <div className="relative">
                      <div
                        className={`flex size-16 items-center justify-center rounded-full bg-gradient-to-br ${step.color} shadow-lg ring-6 ring-secondary/80 transition-transform duration-300 group-hover:scale-110`}
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

          {/* Mobile/tablet: vertical steps with dotted rail */}
          <ol className="relative mt-12 space-y-10 border-l-2 border-dashed border-teal/40 pl-10 lg:hidden">
            {journeySteps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08}>
                <li className="relative">
                  <div
                    className={`absolute -left-[61px] flex size-12 items-center justify-center rounded-full bg-gradient-to-br ${step.color} shadow-md ring-4 ring-secondary/80`}
                  >
                    <step.icon className="size-5 text-white" aria-hidden />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-widest text-teal">
                    Step {i + 1}
                  </p>
                  <h3 className="mt-1 font-semibold text-navy">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Hiring network — full-width logo marquee */}
      <section className="overflow-hidden py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Career Outcomes"
            title="Where our students are heading"
            description="We're a young institute with a growing hiring network — and our first batches are already landing roles at companies like these."
          />
        </div>
        <Reveal className="mt-12">
          <LogoMarquee />
        </Reveal>
        <Reveal className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="/placements">
              See Placement Stories <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </Reveal>
      </section>

      {/* Testimonials — auto-scrolling review wall */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Student Stories"
            title="What our alumni say"
            description="Real reviews from our first batches — hover to pause and read."
          />
          <div className="mt-12">
            <TestimonialWall testimonials={testimonials} />
          </div>
        </div>
      </section>

      {/* Trainers preview */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Faculty"
          title="Learn from practitioners"
          description="Our trainers have shipped production software at scale — and they teach the way real teams work."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trainers.slice(0, 3).map((trainer, i) => (
            <Reveal key={trainer.slug} delay={i * 0.08}>
              <div className="h-full rounded-xl border bg-card p-6 text-center shadow-sm">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-navy text-lg font-bold text-white">
                  {trainer.name.split(" ").map((w) => w[0]).join("")}
                </div>
                <h3 className="mt-4 font-semibold text-navy">{trainer.name}</h3>
                <p className="text-sm text-teal">{trainer.role}</p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{trainer.bio}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="/trainers">
              Meet All Trainers <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </Reveal>
      </section>

      <CtaBanner />

      {/* FAQ */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
        <div className="grid items-start gap-10 lg:grid-cols-[2fr_3fr]">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="FAQ"
              title="Questions? We've got answers"
              description="Everything students usually ask before joining — batches, backgrounds, fees, and placements."
            />
            <div className="mt-8 rounded-2xl border bg-gradient-to-br from-navy to-navy-deep p-6 text-white">
              <p className="font-semibold">Still not sure?</p>
              <p className="mt-1 text-sm text-white/70">
                Talk to a counsellor or sit in on a free demo class — no commitment.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Button asChild className="bg-gold text-navy-deep hover:bg-gold/90">
                  <Link href="/contact">Book Free Demo</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/faq">
                    All FAQs <ArrowRight className="size-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Accordion
              type="single"
              collapsible
              defaultValue={faqs[0].question}
              className="rounded-2xl border bg-card px-6 py-2 shadow-sm"
            >
              {faqs.slice(0, 6).map((faq) => (
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
