import Link from "next/link";
import { ArrowRight, Award, Briefcase, GraduationCap, Laptop, LifeBuoy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/site/hero";
import { CourseCard } from "@/components/site/course-card";
import { CtaBanner } from "@/components/site/cta-banner";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { Counter, Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { TestimonialCarousel } from "@/components/site/testimonial-carousel";
import { getAllCourses } from "@/lib/services/courses";
import { testimonials, trainers } from "@/lib/data/people";
import { hiringPartners, stats } from "@/lib/data/site";

const whyChooseUs = [
  {
    icon: GraduationCap,
    title: "Industry-Expert Trainers",
    text: "Learn from engineers with 9–14 years at companies like Flipkart, Oracle, and Infosys — not career tutors.",
  },
  {
    icon: Laptop,
    title: "Project-First Curriculum",
    text: "Every course is built around real capstone projects you can show in interviews, not slide decks.",
  },
  {
    icon: Briefcase,
    title: "Career Support From Day One",
    text: "Mock interviews, resume clinics, and referrals through our growing hiring network — support that doesn't stop at course completion.",
  },
  {
    icon: Users,
    title: "Small Batches",
    text: "Capped batch sizes mean personal attention, daily doubt-clearing, and code reviews for everyone.",
  },
  {
    icon: Award,
    title: "Recognized Certification",
    text: "Certificates backed by capstone evaluation that hiring partners actually recognize.",
  },
  {
    icon: LifeBuoy,
    title: "Lifetime Support",
    text: "Recorded sessions, alumni community, and career guidance long after your course ends.",
  },
];

export default async function HomePage() {
  const courses = await getAllCourses();
  const featured = courses.filter((c) => c.featured).slice(0, 4);
  const courseOptions = courses.map((c) => ({ title: c.title, slug: c.slug }));

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

      {/* Why choose us */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Why Axcvia"
            title="Training built around outcomes"
            description="We're a startup ourselves — lean, honest, and measured on one thing: how many of our students start real tech careers."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06}>
                <div className="h-full rounded-xl border bg-card p-6 shadow-sm">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-teal/10">
                    <item.icon className="size-5 text-teal" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-semibold text-navy">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Hiring partners */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Career Outcomes"
          title="Where our students are heading"
          description="We're a young institute with a growing hiring network — and our first batches are already landing roles at companies like these."
        />
        <Reveal className="mt-10 flex flex-wrap justify-center gap-3">
          {hiringPartners.map((partner) => (
            <span
              key={partner}
              className="rounded-full border bg-card px-5 py-2 text-sm font-semibold text-foreground/70"
            >
              {partner}
            </span>
          ))}
        </Reveal>
        <Reveal className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="/placements">
              See Placement Stories <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </Reveal>
      </section>

      {/* Testimonials */}
      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Student Stories"
            title="What our alumni say"
          />
          <div className="mt-12">
            <TestimonialCarousel testimonials={testimonials} />
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

      {/* Enquiry */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              align="left"
              eyebrow="Get Started"
              title="Take the first step today"
              description="Share your details and a counsellor will call you back with course recommendations, batch dates, and fee options — no pressure, no spam."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <EnquiryForm source="home" courseOptions={courseOptions} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
