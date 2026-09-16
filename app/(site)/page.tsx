import Link from "next/link";
import {
  ArrowRight,
  Award,
  Braces,
  BrainCircuit,
  Briefcase,
  Bug,
  ClipboardCheck,
  CloudCog,
  Globe,
  Laptop,
  Layers,
  PlayCircle,
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
import { getAllFaqs } from "@/lib/services/faqs";
import { getAllTestimonials } from "@/lib/services/testimonials";
import { getAllTrainers } from "@/lib/services/trainers";
import { getAllBundles, getSettings } from "@/lib/services/lms";
import { PromoBanner } from "@/components/site/promo-banner";
import { BundleCard } from "@/components/site/bundle-card";
import { stats } from "@/lib/data/site";
import type { Course } from "@/lib/types";
import { slugify } from "@/lib/utils";

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
    color: "from-teal to-navy",
  },
  {
    icon: Users,
    title: "Interview Preparation",
    text: "Mock interviews, resume clinics, and DSA practice with brutal-but-useful feedback until you're ready.",
    color: "from-navy to-teal-bright",
  },
  {
    icon: Briefcase,
    title: "Get Placed & Beyond",
    text: "Referrals through our hiring network, plus lifetime access to recordings and the alumni community.",
    color: "from-navy-deep to-navy",
  },
];

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Web Development": Globe,
  "Programming Languages": Braces,
  "Data & AI": BrainCircuit,
  Testing: Bug,
  "Cloud & DevOps": CloudCog,
  "Placement Prep": Briefcase,
  "Mock Tests": ClipboardCheck,
  Webinars: PlayCircle,
};

const formats = [
  { href: "/courses", title: "Live Classes", text: "Live + recorded sessions, study material and projects.", icon: Laptop },
  { href: "/mock-tests", title: "Mock Tests", text: "Timed tests with instant results and explanations.", icon: ClipboardCheck },
  { href: "/webinars", title: "Webinars", text: "Free expert sessions — register with a student account.", icon: PlayCircle },
];

export default async function HomePage() {
  const [courses, testimonials, trainers, faqs, settings, bundles] = await Promise.all([
    getAllCourses(),
    getAllTestimonials(),
    getAllTrainers(),
    getAllFaqs(),
    getSettings(),
    getAllBundles(),
  ]);
  const featuredBundles = bundles.filter((b) => b.featured).slice(0, 3);
  // Admin-flagged featured courses; otherwise the most popular paid ones so the section never sits empty.
  const flagged = courses.filter((c) => c.featured);
  const featured = (flagged.length
    ? flagged
    : courses.filter((c) => c.type !== "webinar").toSorted((a, b) => b.learners - a.learners || b.discountFee - a.discountFee)
  ).slice(0, 8);

  // Category tiles: classes by category; mock tests and webinars as their own tiles.
  const groups = new Map<string, { category: string; href: string; courses: Course[] }>();
  for (const c of courses) {
    const [category, href] =
      c.type === "mock-test" ? ["Mock Tests", "/mock-tests"]
      : c.type === "webinar" ? ["Webinars", "/webinars"]
      : [c.category, `/courses/category/${slugify(c.category)}`];
    if (!groups.has(category)) groups.set(category, { category, href, courses: [] });
    groups.get(category)!.courses.push(c);
  }
  const categoryGroups = [...groups.values()];
  const heroCategories = categoryGroups
    .filter((g) => g.href.startsWith("/courses/category/"))
    .slice(0, 5)
    .map((g) => ({ name: g.category, href: g.href }));

  return (
    <>
      <Hero categories={heroCategories} />

      {/* Stats */}
      <section className="bg-navy">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:divide-x lg:divide-white/10">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <Counter value={stat.value} suffix={stat.suffix} className="font-heading text-3xl font-extrabold text-white sm:text-4xl" />
              <p className="mt-1 text-sm text-white/70">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hiring network strip */}
      <section className="overflow-hidden border-b py-10">
        <p className="px-4 text-center text-sm font-medium text-muted-foreground">
          Our first batches are landing roles at companies like these
        </p>
        <div className="mt-6">
          <LogoMarquee />
        </div>
        <p className="mt-5 text-center">
          <Link href="/placements" className="inline-flex items-center gap-1 text-sm font-semibold text-teal hover:underline">
            See placement stories <ArrowRight className="size-4" aria-hidden />
          </Link>
        </p>
      </section>

      <PromoBanner settings={settings} />

      {/* Featured courses */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            align="left"
            eyebrow="Featured courses"
            title="Our most popular programs"
            description="Live, project-based programs built around what tech companies actually hire for."
          />
          <Link href="/courses" className="hidden items-center gap-1 text-sm font-semibold text-teal hover:underline sm:inline-flex">
            View all courses <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((course, i) => (
            <Reveal key={course.slug} delay={i * 0.05} className="h-full">
              <CourseCard course={course} />
            </Reveal>
          ))}
        </div>
        <Button asChild variant="outline" size="lg" className="mt-8 w-full sm:hidden">
          <Link href="/courses">
            View all courses <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </section>

      {/* Browse by category — internal-link rich for SEO */}
      <section className="bg-secondary/60 py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            align="left"
            eyebrow="Explore by category"
            title="Find the right track for your goal"
            description="Web development, programming languages, data & AI, testing and cloud — every program is live, project-based and placement-focused."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryGroups.map((group, i) => {
              const Icon = categoryIcons[group.category] ?? Layers;
              return (
                <Reveal key={group.category} delay={i * 0.04} className="h-full">
                  <div className="group flex h-full flex-col rounded-xl border bg-card p-5 transition-all hover:border-teal/30 hover:shadow-lg">
                    <Link href={group.href} className="flex items-center gap-3.5">
                      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-navy to-teal text-white">
                        <Icon className="size-5" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block font-heading font-bold text-navy group-hover:text-teal">{group.category}</span>
                        <span className="block text-xs text-muted-foreground">
                          {group.courses.length} course{group.courses.length === 1 ? "" : "s"}
                        </span>
                      </span>
                      <ArrowRight className="ml-auto size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-teal" aria-hidden />
                    </Link>
                    <ul className="mt-4 space-y-1.5 border-t pt-4">
                      {group.courses.slice(0, 3).map((course) => (
                        <li key={course.slug}>
                          <Link href={`/courses/${course.slug}`} className="block truncate text-sm text-muted-foreground transition-colors hover:text-teal">
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

      {/* Learning formats */}
      <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6 sm:pt-20">
        <div className="grid gap-4 sm:grid-cols-3">
          {formats.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              className="group flex items-start gap-4 rounded-xl border bg-card p-5 transition-all hover:border-teal/30 hover:shadow-md"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-teal/10 text-teal">
                <f.icon className="size-5" aria-hidden />
              </span>
              <span>
                <span className="flex items-center gap-1 font-heading font-bold text-navy group-hover:text-teal">
                  {f.title} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </span>
                <span className="mt-1 block text-sm text-muted-foreground">{f.text}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Why choose us — journey steps */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Why Axcvia"
            title="Your journey from beginner to hired"
            description="We're a startup ourselves — lean, honest, and measured on one thing: how many of our students start real tech careers."
          />

          {/* Desktop: horizontal steps with dotted connector */}
          <div className="relative mt-14 hidden lg:block">
            <div aria-hidden className="absolute left-[10%] right-[10%] top-8 border-t-2 border-dashed border-teal/30" />
            <div className="grid grid-cols-5 gap-6">
              {journeySteps.map((step, i) => (
                <Reveal key={step.title} delay={i * 0.1} className="relative">
                  <div className="group flex flex-col items-center text-center">
                    <div className="relative">
                      <div className={`flex size-16 items-center justify-center rounded-full bg-linear-to-br ${step.color} shadow-lg ring-6 ring-background transition-transform duration-300 group-hover:scale-110`}>
                        <step.icon className="size-7 text-white" aria-hidden />
                      </div>
                      <span className="absolute -right-1 -top-1 flex size-6 items-center justify-center rounded-full border-2 border-teal bg-card text-xs font-bold text-teal">
                        {i + 1}
                      </span>
                    </div>
                    <h3 className="mt-5 font-bold text-navy">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Mobile/tablet: vertical steps with dotted rail */}
          <ol className="relative mt-10 space-y-9 border-l-2 border-dashed border-teal/30 pl-10 lg:hidden">
            {journeySteps.map((step, i) => (
              <li key={step.title} className="relative">
                <div className={`absolute -left-15.25 flex size-12 items-center justify-center rounded-full bg-linear-to-br ${step.color} shadow-md ring-4 ring-background`}>
                  <step.icon className="size-5 text-white" aria-hidden />
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-teal">Step {i + 1}</p>
                <h3 className="mt-1 font-bold text-navy">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {featuredBundles.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 sm:pb-20">
          <SectionHeading align="left" eyebrow="Save more" title="Course bundles" description="Complete career tracks at one discounted price." />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredBundles.map((b) => (<BundleCard key={b.slug} bundle={b} />))}
          </div>
        </section>
      )}

      {/* Testimonials — auto-scrolling review wall */}
      {testimonials.length > 0 && (
        <section className="bg-secondary/60 py-14 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading
              eyebrow="Student stories"
              title="What our alumni say"
              description="Real reviews from our first batches — hover to pause and read."
            />
            <div className="mt-10">
              <TestimonialWall testimonials={testimonials} />
            </div>
          </div>
        </section>
      )}

      {/* Trainers preview */}
      {trainers.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading
              align="left"
              eyebrow="Faculty"
              title="Learn from practitioners"
              description="Our trainers have shipped production software at scale — and they teach the way real teams work."
            />
            <Link href="/trainers" className="inline-flex items-center gap-1 text-sm font-semibold text-teal hover:underline">
              Meet all trainers <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trainers.slice(0, 3).map((trainer, i) => (
              <Reveal key={trainer.slug} delay={i * 0.06} className="h-full">
                <Link href={`/trainers/${trainer.slug}`} className="group flex h-full flex-col rounded-xl border bg-card p-6 transition-all hover:border-teal/30 hover:shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-navy to-teal text-lg font-bold text-white">
                      {trainer.name.split(" ").map((w) => w[0]).join("")}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-navy group-hover:text-teal">{trainer.name}</h3>
                      <p className="text-sm text-teal">{trainer.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-muted-foreground">{trainer.bio}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <CtaBanner />

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-24">
          <div className="grid items-start gap-10 lg:grid-cols-[2fr_3fr]">
            <div>
              <SectionHeading
                align="left"
                eyebrow="FAQ"
                title="Questions? We've got answers"
                description="Everything students usually ask before joining — batches, backgrounds, fees, and placements."
              />
              <div className="mt-8 rounded-2xl bg-linear-to-br from-navy to-navy-deep p-6 text-white">
                <p className="font-heading font-bold">Still not sure?</p>
                <p className="mt-1 text-sm text-white/70">Talk to a counsellor or sit in on a free demo class — no commitment.</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Button asChild className="bg-teal-bright text-navy-deep hover:bg-teal-bright/90">
                    <Link href="/contact">Book Free Demo</Link>
                  </Button>
                  <Button asChild variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white">
                    <Link href="/faq">
                      All FAQs <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
            <Accordion type="single" collapsible defaultValue={faqs[0].question} className="rounded-xl border bg-card px-5 py-1 sm:px-6">
              {faqs.slice(0, 6).map((faq) => (
                <AccordionItem key={faq.question} value={faq.question}>
                  <AccordionTrigger className="text-left text-[0.95rem] font-semibold text-navy">{faq.question}</AccordionTrigger>
                  <AccordionContent className="leading-relaxed text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}
    </>
  );
}
