import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
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
import { Card, CardContent } from "@/components/ui/card";
import { CourseCard, formatInr } from "@/components/site/course-card";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { courses as staticCourses } from "@/lib/data/courses";
import { courseLessons, courseTotalMinutes, COURSE_TYPE_LABEL, getCourseBySlug, getCourseOptions, getRelated } from "@/lib/services/courses";
import { getQuizzesForCourse } from "@/lib/services/lms";
import { CoursePurchaseCard } from "@/components/site/course-purchase-card";
import { formatMinutes } from "@/lib/video";
import { ClipboardList, FileText, Lock, PlayCircle, Unlock } from "lucide-react";
import { getPostsForCourse } from "@/lib/services/blog";
import { getTestimonialsForCourse } from "@/lib/services/testimonials";
import { getTrainerBySlug } from "@/lib/services/trainers";
import { BlogCard } from "@/components/site/blog-card";
import { site } from "@/lib/data/site";
import { slugify } from "@/lib/utils";

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

const modeLabel = { online: "Live Online", offline: "Classroom", hybrid: "Hybrid" };

export default async function CourseDetailPage({ params }: PageProps<"/courses/[slug]">) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const [trainer, related, courseOptions, courseTestimonials, coursePosts, quizzes] = await Promise.all([
    getTrainerBySlug(course.trainerSlug),
    getRelated(slug),
    getCourseOptions(),
    getTestimonialsForCourse(slug),
    getPostsForCourse(slug),
    getQuizzesForCourse(slug),
  ]);
  // Enrollment state is resolved client-side (purchase card) so this page stays static.
  const access = null;
  const lessons = courseLessons(course);
  const totalMinutes = courseTotalMinutes(course);
  const sections = course.curriculum ?? [];
  const lessonIcon = { video: PlayCircle, document: FileText, quiz: ClipboardList };

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

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Courses", item: `${site.url}/courses` },
      { "@type": "ListItem", position: 3, name: course.category, item: `${site.url}/courses/category/${slugify(course.category)}` },
      { "@type": "ListItem", position: 4, name: course.title, item: `${site.url}/courses/${course.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbLd]) }}
      />

      {/* Course hero */}
      <section className="relative overflow-hidden bg-navy pb-16 pt-32 text-white">
        {course.image && (
          <>
            <Image
              src={course.image}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-25"
              aria-hidden
            />
            <div
              className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy/60"
              aria-hidden
            />
          </>
        )}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <div className="flex flex-wrap items-center gap-2">
              <Link href={`/courses/category/${slugify(course.category)}`}>
                <Badge className="bg-gold text-navy-deep hover:bg-gold">{course.category}</Badge>
              </Link>
              <Badge variant="outline" className="border-white/30 text-white">
                {course.level}
              </Badge>
              {course.featured && (
                <Badge variant="outline" className="border-white/30 text-white">Bestseller</Badge>
              )}
              {course.type && course.type !== "classes" && (
                <Badge variant="outline" className="border-teal-bright/60 text-teal-bright">{COURSE_TYPE_LABEL[course.type]}</Badge>
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
            {(course.tags ?? []).length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {course.tags!.map((t) => (<Link key={t} href={`/courses/tag/${slugify(t)}`}><Badge variant="secondary" className="hover:bg-teal/10 hover:text-teal">{t}</Badge></Link>))}
              </div>
            )}
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
            <h2 className="text-2xl font-bold text-navy">Course content</h2>
            {sections.length > 0 ? (
              <>
                <p className="mt-1 text-sm text-muted-foreground">
                  {sections.length} sections · {lessons.length} lessons{totalMinutes ? ` · ${formatMinutes(totalMinutes)} total` : ""}
                  {!access && " · preview lessons are free to watch"}
                </p>
                <Accordion type="single" collapsible className="mt-4" defaultValue="section-0">
                  {sections.map((sec, i) => (
                    <AccordionItem key={sec.title + i} value={`section-${i}`}>
                      <AccordionTrigger className="text-left font-semibold">
                        <span>{sec.title}<span className="ml-2 text-xs font-normal text-muted-foreground">{sec.lessons.length} lessons</span></span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="divide-y">
                          {sec.lessons.map((l) => {
                            const Icon = lessonIcon[l.type];
                            const open = Boolean(access) || l.isPreview;
                            const href = l.type === "quiz" && l.quizSlug ? `/learn/${course.slug}/quiz/${l.quizSlug}` : `/learn/${course.slug}/${l.id}`;
                            return (
                              <li key={l.id} className="flex items-center gap-3 py-2.5 text-sm">
                                <Icon className="size-4 shrink-0 text-teal" aria-hidden />
                                {open ? <Link href={href} className="min-w-0 flex-1 truncate font-medium text-navy hover:text-teal">{l.title}</Link> : <span className="min-w-0 flex-1 truncate text-foreground/85">{l.title}</span>}
                                {l.isPreview && !access && <Badge variant="secondary" className="bg-teal/10 text-teal">Preview</Badge>}
                                {l.durationMinutes ? <span className="text-xs text-muted-foreground">{formatMinutes(l.durationMinutes)}</span> : null}
                                {open ? <Unlock className="size-3.5 text-teal" aria-hidden /> : <Lock className="size-3.5 text-muted-foreground" aria-hidden />}
                              </li>
                            );
                          })}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Lesson recordings and materials are added to your dashboard as the batch progresses.</p>
            )}

            {quizzes.length > 0 && (
              <div className="mt-6 rounded-xl border bg-card p-4">
                <p className="font-semibold text-navy"><ClipboardList className="mr-1.5 inline size-4 text-teal" aria-hidden /> {quizzes.length} mock test{quizzes.length > 1 ? "s" : ""} included</p>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {quizzes.map((q) => (
                    <li key={q.slug} className="flex items-center justify-between gap-2">
                      <span className="text-foreground/85">{q.title} <span className="text-xs text-muted-foreground">· {q.questions.length} Q · {q.durationMinutes} min</span></span>
                      {q.isFreeSample || access ? (
                        <Link href={`/learn/${course.slug}/quiz/${q.slug}`} className="shrink-0 text-xs font-semibold text-teal hover:underline">{q.isFreeSample && !access ? "Try free" : "Attempt"}</Link>
                      ) : <Lock className="size-3.5 shrink-0 text-muted-foreground" aria-hidden />}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {course.syllabus.length > 0 && (
              <details className="mt-6 rounded-xl border bg-card p-4">
                <summary className="cursor-pointer font-semibold text-navy">Detailed syllabus ({course.syllabus.length} modules)</summary>
                <div className="mt-3 space-y-3">
                  {course.syllabus.map((mod, i) => (
                    <div key={mod.title}>
                      <p className="text-sm font-semibold text-navy">Module {i + 1}: {mod.title}</p>
                      <ul className="mt-1 flex flex-wrap gap-1.5">{mod.topics.map((t) => <Badge key={t} variant="secondary">{t}</Badge>)}</ul>
                    </div>
                  ))}
                </div>
              </details>
            )}

            {(course.materials ?? []).length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-navy">Study materials</h3>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {course.materials!.map((m) => (
                    <li key={m.url} className="flex items-center gap-2"><FileText className="size-4 text-teal" aria-hidden />{access ? <a href={m.url} target="_blank" rel="noopener noreferrer" className="font-medium text-navy hover:text-teal">{m.label}</a> : <span className="text-foreground/85">{m.label}</span>}{!access && <Lock className="size-3.5 text-muted-foreground" aria-hidden />}</li>
                  ))}
                </ul>
              </div>
            )}
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
                    <p className="font-semibold text-navy">
                      <Link href={`/trainers/${trainer.slug}`} className="hover:text-teal">{trainer.name}</Link>
                    </p>
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
                  <Card key={t.slug}>
                    <CardContent>
                      <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="size-4 fill-gold text-gold" aria-hidden />
                        ))}
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-foreground/85">“{t.text}”</p>
                      <div className="mt-3 flex items-center gap-2.5">
                        {t.avatar && (
                          <Image
                            src={t.avatar}
                            alt={t.studentName}
                            width={32}
                            height={32}
                            className="size-8 rounded-full border-2 border-teal/30 object-cover"
                          />
                        )}
                        <p className="text-sm font-semibold text-navy">
                          {t.studentName}
                          <span className="font-normal text-muted-foreground"> — {t.role} at {t.company}</span>
                        </p>
                      </div>
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
            <CoursePurchaseCard course={course} totalMinutes={totalMinutes} lessonCount={lessons.length} />
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

      {/* Blog posts about this course */}
      {coursePosts.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading eyebrow="From the blog" title="Read before you enroll" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {coursePosts.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

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
