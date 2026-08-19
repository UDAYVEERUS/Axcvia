import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  CalendarDays,
  CheckCircle2,
  Clock,
  Download,
  GraduationCap,
  MapPin,
  Star,
  Users,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CourseCard, formatInr } from "@/components/site/course-card";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { courses as staticCourses } from "@/lib/data/courses";
import { getCourseBySlug, getCourseOptions, getRelated } from "@/lib/services/courses";
import { getTrainer, testimonials } from "@/lib/data/people";
import { site } from "@/lib/data/site";

// Seeded courses are prerendered; dashboard-added courses render on demand.
export function generateStaticParams() {
  return staticCourses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/courses/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return {};
  return {
    title: course.title,
    description: `${course.tagline}. ${course.duration}, ${course.level} level. Fee ${formatInr(course.discountFee)}. Next batch: ${course.nextBatch}.`,
  };
}

const modeLabel = { online: "Online", offline: "Classroom", hybrid: "Classroom + Online" };

export default async function CourseDetailPage({ params }: PageProps<"/courses/[slug]">) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const trainer = getTrainer(course.trainerSlug);
  const [related, courseOptions] = await Promise.all([getRelated(slug), getCourseOptions()]);
  const courseTestimonials = testimonials.filter((t) => t.courseSlug === slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.tagline,
    provider: { "@type": "Organization", name: site.name, sameAs: site.url },
    offers: {
      "@type": "Offer",
      price: course.discountFee,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: course.rating,
      reviewCount: course.reviewCount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Course hero */}
      <section className="bg-navy pb-16 pt-32 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-gold text-navy-deep hover:bg-gold">{course.category}</Badge>
              <Badge variant="outline" className="border-white/30 text-white">
                {course.level}
              </Badge>
              {course.featured && (
                <Badge variant="outline" className="border-white/30 text-white">Bestseller</Badge>
              )}
            </div>
            <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">
              {course.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/75">{course.tagline}</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/80">
              <span className="flex items-center gap-1.5">
                <Clock className="size-4 text-teal-bright" aria-hidden /> {course.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 text-teal-bright" aria-hidden /> {modeLabel[course.mode]}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="size-4 text-teal-bright" aria-hidden />{" "}
                {course.learners.toLocaleString("en-IN")}+ learners
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="size-4 fill-gold text-gold" aria-hidden /> {course.rating} (
                {course.reviewCount.toLocaleString("en-IN")} reviews)
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4 text-teal-bright" aria-hidden /> Next batch:{" "}
                {course.nextBatch}
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <Reveal>
            <h2 className="text-2xl font-bold text-navy">About this course</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">{course.description}</p>
          </Reveal>

          <Reveal className="mt-10">
            <h2 className="text-2xl font-bold text-navy">What you&apos;ll achieve</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {course.outcomes.map((o) => (
                <li key={o} className="flex items-start gap-2.5 text-sm text-foreground/85">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden />
                  {o}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="mt-10">
            <h2 className="text-2xl font-bold text-navy">Curriculum</h2>
            <Accordion type="single" collapsible className="mt-4" defaultValue="module-0">
              {course.syllabus.map((mod, i) => (
                <AccordionItem key={mod.title} value={`module-${i}`}>
                  <AccordionTrigger className="text-left font-semibold">
                    Module {i + 1}: {mod.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2">
                      {mod.topics.map((topic) => (
                        <li key={topic} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <GraduationCap className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>

          <Reveal className="mt-10">
            <h2 className="text-2xl font-bold text-navy">Prerequisites</h2>
            <ul className="mt-4 space-y-2">
              {course.prerequisites.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>

          {trainer && (
            <Reveal className="mt-10">
              <h2 className="text-2xl font-bold text-navy">Your trainer</h2>
              <Card className="mt-4">
                <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-navy text-lg font-bold text-white">
                    {trainer.name.split(" ").map((w) => w[0]).join("")}
                  </div>
                  <div>
                    <p className="font-semibold text-navy">{trainer.name}</p>
                    <p className="text-sm text-teal">{trainer.role}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{trainer.bio}</p>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {trainer.expertise.map((skill) => (
                        <Badge key={skill} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          )}

          {courseTestimonials.length > 0 && (
            <Reveal className="mt-10">
              <h2 className="text-2xl font-bold text-navy">Student reviews</h2>
              <div className="mt-4 space-y-4">
                {courseTestimonials.map((t) => (
                  <Card key={t.studentName}>
                    <CardContent>
                      <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="size-4 fill-gold text-gold" aria-hidden />
                        ))}
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-foreground/85">“{t.text}”</p>
                      <p className="mt-3 text-sm font-semibold text-navy">
                        {t.studentName}
                        <span className="font-normal text-muted-foreground"> — {t.role} at {t.company}</span>
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </Reveal>
          )}
        </div>

        {/* Sticky sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Reveal>
            <Card>
              <CardContent className="space-y-4">
                <p>
                  <span className="text-3xl font-extrabold text-navy">{formatInr(course.discountFee)}</span>{" "}
                  <span className="text-muted-foreground line-through">{formatInr(course.fee)}</span>
                  <Badge className="ml-2 bg-teal/10 text-teal hover:bg-teal/10">
                    Save {formatInr(course.fee - course.discountFee)}
                  </Badge>
                </p>
                <p className="text-sm text-muted-foreground">
                  EMI & installment options available · Next batch {course.nextBatch}
                </p>
                <div className="grid gap-2">
                  <Button asChild size="lg" className="bg-teal text-white hover:bg-teal/90">
                    <Link href={`/contact?course=${course.slug}`}>Enroll / Enquire Now</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href={`/contact?course=${course.slug}`}>
                      <Download className="size-4" aria-hidden /> Download Syllabus (PDF)
                    </Link>
                  </Button>
                </div>
                <Separator />
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Award className="size-4 text-teal" aria-hidden /> Completion certificate
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="size-4 text-teal" aria-hidden /> Placement assistance until hired
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="size-4 text-teal" aria-hidden /> Lifetime access to recordings
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Reveal>
          <Reveal delay={0.1}>
            <EnquiryForm
              source={`course:${course.slug}`}
              courseOptions={courseOptions}
              defaultCourse={course.slug}
              heading="Have questions? Get a callback"
            />
          </Reveal>
        </aside>
      </div>

      {/* Related courses */}
      {related.length > 0 && (
        <section className="bg-secondary/40 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading eyebrow="Keep Exploring" title="Related courses" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((c) => (
                <CourseCard key={c.slug} course={c} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
