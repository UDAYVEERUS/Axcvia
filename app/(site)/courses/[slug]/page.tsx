import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  FileText,
  Lock,
  MapPin,
  PlayCircle,
  Unlock,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { CourseCard, StarRating, formatInr } from "@/components/site/course-card";
import { CoursePurchaseCard } from "@/components/site/course-purchase-card";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { Markdown } from "@/components/site/markdown";
import { BlogCard } from "@/components/site/blog-card";
import { SectionHeading } from "@/components/site/section-heading";
import { courses as staticCourses } from "@/lib/data/courses";
import { site } from "@/lib/data/site";
import { getPostsForCourse } from "@/lib/services/blog";
import { courseLessons, courseTotalMinutes, COURSE_TYPE_LABEL, getCourseBySlug, getCourseOptions, getRelated } from "@/lib/services/courses";
import { getQuizzesForCourse } from "@/lib/services/lms";
import { getTestimonialsForCourse } from "@/lib/services/testimonials";
import { getTrainerBySlug } from "@/lib/services/trainers";
import { slugify } from "@/lib/utils";
import { formatMinutes } from "@/lib/video";

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
  const fee = course.discountFee > 0 ? `Fee ${formatInr(course.discountFee)}` : course.type === "webinar" ? "Free" : "Fee on request";
  return {
    title: course.metaTitle || course.title,
    description:
      course.metaDescription ||
      [
        course.tagline,
        course.duration && `${course.duration}, ${course.level} level`,
        "Live online, small batches, placement support",
        fee,
        course.nextBatch && `Next batch: ${course.nextBatch}`,
      ]
        .filter(Boolean)
        .join(". ") + ".",
    alternates: { canonical: `/courses/${course.slug}` },
    openGraph: {
      type: "article",
      title: course.metaTitle || course.title,
      description: course.metaDescription || course.tagline,
      images: course.image ? [course.image] : undefined,
    },
  };
}

/** "4 months" → P4M, "40 hours" → PT40H. Only whole units; anything else is skipped. */
function isoDuration(value: string): string | undefined {
  const m = /^\s*(\d+)\s*(month|week|day|hour)s?\s*$/i.exec(value);
  if (!m) return undefined;
  const n = m[1];
  const unit = m[2].toLowerCase();
  return unit === "month" ? `P${n}M` : unit === "week" ? `P${n}W` : unit === "day" ? `P${n}D` : `PT${n}H`;
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
  const topicCount = course.syllabus.reduce((n, m) => n + m.topics.length, 0);
  const lessonIcon = { video: PlayCircle, document: FileText, quiz: ClipboardList };

  const courseUrl = `${site.url}/courses/${course.slug}`;
  const startDate = course.nextBatch && !Number.isNaN(Date.parse(course.nextBatch))
    ? new Date(course.nextBatch).toISOString().slice(0, 10)
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.metaDescription || course.tagline || course.description.slice(0, 300),
    url: courseUrl,
    inLanguage: "en-IN",
    educationalLevel: course.level,
    ...(course.outcomes.length > 0 && { teaches: course.outcomes }),
    ...(course.prerequisites.length > 0 && { coursePrerequisites: course.prerequisites }),
    ...(course.image && { image: course.image }),
    ...(course.updatedAt && { dateModified: course.updatedAt }),
    provider: { "@type": "EducationalOrganization", name: site.name, url: site.url, sameAs: site.url },
    offers: {
      "@type": "Offer",
      category: course.discountFee > 0 ? "Paid" : "Free",
      price: course.discountFee,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      url: courseUrl,
    },
    hasCourseInstance: [
      {
        "@type": "CourseInstance",
        courseMode: course.mode === "offline" ? "Onsite" : course.mode === "hybrid" ? "Blended" : "Online",
        ...(isoDuration(course.duration) && { courseWorkload: isoDuration(course.duration) }),
        ...(startDate && { startDate }),
        ...(course.mode === "online"
          ? { location: { "@type": "VirtualLocation", url: courseUrl } }
          : { location: { "@type": "Place", name: site.name, address: site.address } }),
        ...(trainer && { instructor: { "@type": "Person", name: trainer.name, jobTitle: trainer.role } }),
      },
    ],
    // Only publish a rating backed by real reviews.
    ...(course.reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: course.rating,
        reviewCount: course.reviewCount,
      },
    }),
  };

  // FAQ answers are what Google and AI answer engines quote most often.
  const faqLd = (course.faqs ?? []).length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: course.faqs!.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

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

  const facts = [
    { icon: BarChart3, label: `${course.level} level` },
    course.duration && { icon: Clock, label: course.duration },
    { icon: MapPin, label: modeLabel[course.mode] },
    course.nextBatch && { icon: CalendarDays, label: `Next batch: ${course.nextBatch}` },
    course.certificate !== false && { icon: Award, label: "Certificate of completion" },
  ].filter(Boolean) as { icon: typeof Clock; label: string }[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbLd, ...(faqLd ? [faqLd] : [])]) }}
      />

      {/* Title band */}
      <section className="bg-navy-deep pb-10 pt-24 text-white sm:pt-28 lg:min-h-88 lg:pb-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-3xl lg:max-w-[calc(100%-25rem)]">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-teal-bright">
              <Link href="/courses" className="hover:underline">Courses</Link>
              <ChevronRight className="size-3.5 text-white/40" aria-hidden />
              <Link href={`/courses/category/${slugify(course.category)}`} className="hover:underline">{course.category}</Link>
            </nav>
            <h1 className="mt-3 text-[1.85rem] font-extrabold leading-tight sm:text-4xl">{course.title}</h1>
            {course.tagline && <p className="mt-3 text-base leading-relaxed text-white/80 sm:text-lg">{course.tagline}</p>}

            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              {course.featured && <span className="rounded-md bg-gold px-2 py-0.5 text-xs font-bold text-navy-deep">Featured</span>}
              {course.type && course.type !== "classes" && (
                <span className="rounded-md border border-teal-bright/50 px-2 py-0.5 text-xs font-semibold text-teal-bright">{COURSE_TYPE_LABEL[course.type]}</span>
              )}
              {course.reviewCount > 0 && (
                <span className="flex items-center gap-1.5">
                  <span className="font-bold text-gold">{course.rating.toFixed(1)}</span>
                  <StarRating rating={course.rating} />
                  <span className="text-white/70">({course.reviewCount.toLocaleString("en-IN")} reviews)</span>
                </span>
              )}
              {course.learners > 0 && <span className="text-white/80">{course.learners.toLocaleString("en-IN")}+ learners</span>}
            </div>

            {trainer && (
              <p className="mt-3 text-sm text-white/80">
                Taught by{" "}
                <Link href={`/trainers/${trainer.slug}`} className="font-semibold text-teal-bright underline-offset-2 hover:underline">
                  {trainer.name}
                </Link>
              </p>
            )}

            <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/85">
              {facts.map((f) => (
                <li key={f.label} className="flex items-center gap-1.5">
                  <f.icon className="size-4 text-teal-bright" aria-hidden /> {f.label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12 lg:py-12">
        {/* Mobile: price and CTA straight after the title */}
        <div className="lg:hidden">
          <CoursePurchaseCard course={course} totalMinutes={totalMinutes} lessonCount={lessons.length} />
        </div>

        <div className="min-w-0 space-y-12">
          {/* Answer-first summary: the facts a search or AI answer needs in one block. */}
          <section aria-labelledby="at-a-glance" className="rounded-xl border bg-secondary/40 p-5 sm:p-6">
            <h2 id="at-a-glance" className="text-xl font-extrabold text-navy sm:text-2xl">
              {course.title} at a glance
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-foreground/85">
              {course.title} is a {course.duration ? `${course.duration}, ` : ""}
              {course.level.toLowerCase()}-level {modeLabel[course.mode].toLowerCase()} program from {site.name}
              {course.prerequisites.length > 0 ? `, open to learners with ${course.prerequisites[0].toLowerCase()}` : ""}
              {course.certificate !== false ? ", ending with a capstone project and a certificate of completion" : ""}.
            </p>
            <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              {[
                ["Duration", course.duration],
                ["Level", course.level],
                ["Mode", modeLabel[course.mode]],
                ["Fee", course.discountFee > 0 ? formatInr(course.discountFee) : course.type === "webinar" ? "Free" : "On request"],
                ["Certificate", course.certificate !== false ? "Yes, on completion" : "Not included"],
                ["Next batch", course.nextBatch],
                ["Projects", course.syllabus.length > 0 ? `${course.syllabus.length} modules` : ""],
                ["Placement support", "Included until you're hired"],
              ]
                .filter(([, value]) => Boolean(value))
                .map(([label, value]) => (
                  <div key={label as string} className="flex justify-between gap-4 border-b border-border/60 pb-2">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="text-right font-semibold text-navy">{value}</dd>
                  </div>
                ))}
            </dl>
          </section>

          {course.outcomes.length > 0 && (
            <section className="rounded-xl border bg-card p-5 sm:p-7">
              <h2 className="text-xl font-extrabold text-navy sm:text-2xl">What you&apos;ll learn</h2>
              <ul className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                {course.outcomes.map((o) => (
                  <li key={o} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/85">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden />
                    {o}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h2 className="text-xl font-extrabold text-navy sm:text-2xl">Course content</h2>
            {sections.length > 0 ? (
              <>
                <p className="mt-1 text-sm text-muted-foreground">
                  {sections.length} sections · {lessons.length} lessons{totalMinutes ? ` · ${formatMinutes(totalMinutes)} total` : ""}
                  {!access && " · preview lessons are free to watch"}
                </p>
                <Accordion type="single" collapsible className="mt-4 overflow-hidden rounded-xl border" defaultValue="section-0">
                  {sections.map((sec, i) => (
                    <AccordionItem key={sec.title + i} value={`section-${i}`} className="border-b last:border-b-0">
                      <AccordionTrigger className="rounded-none bg-secondary/60 px-4 py-3.5 text-left font-semibold text-navy hover:no-underline">
                        <span>{sec.title}<span className="ml-2 text-xs font-normal text-muted-foreground">{sec.lessons.length} lessons</span></span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4">
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
            ) : course.syllabus.length > 0 ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {course.syllabus.length} modules · {topicCount} topics{course.duration ? ` · ${course.duration}` : ""}
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Lesson recordings and materials are added to your dashboard as the batch progresses.</p>
            )}

            {course.syllabus.length > 0 && (
              <Accordion
                type="multiple"
                defaultValue={sections.length > 0 ? [] : ["module-0"]}
                className="mt-4 overflow-hidden rounded-xl border"
              >
                {course.syllabus.map((mod, i) => (
                  <AccordionItem key={mod.title + i} value={`module-${i}`} className="border-b last:border-b-0">
                    <AccordionTrigger className="rounded-none bg-secondary/60 px-4 py-3.5 text-left font-semibold text-navy hover:no-underline">
                      <span>
                        Module {i + 1}: {mod.title}
                        <span className="ml-2 text-xs font-normal text-muted-foreground">{mod.topics.length} topics</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-4">
                      <ul className="space-y-2 py-2">
                        {mod.topics.map((t) => (
                          <li key={t} className="flex items-start gap-2.5 text-sm text-foreground/85">
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal/70" aria-hidden />
                            {t}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
            {sections.length === 0 && course.syllabus.length > 0 && (
              <p className="mt-3 text-sm text-muted-foreground">Lesson recordings and materials are added to your dashboard as the batch progresses.</p>
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

            {(course.materials ?? []).length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold text-navy">Study materials</h3>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {course.materials!.map((m) => (
                    <li key={m.url} className="flex items-center gap-2"><FileText className="size-4 text-teal" aria-hidden />{access ? <a href={m.url} target="_blank" rel="noopener noreferrer" className="font-medium text-navy hover:text-teal">{m.label}</a> : <span className="text-foreground/85">{m.label}</span>}{!access && <Lock className="size-3.5 text-muted-foreground" aria-hidden />}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {course.prerequisites.length > 0 && (
            <section>
              <h2 className="text-xl font-extrabold text-navy sm:text-2xl">Requirements</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/85 marker:text-teal">
                {course.prerequisites.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </section>
          )}

          {course.description && (
            <section>
              <h2 className="text-xl font-extrabold text-navy sm:text-2xl">Description</h2>
              <div className="mt-4 leading-relaxed text-foreground/80">
                <Markdown content={course.description} />
              </div>
              {(course.tags ?? []).length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {course.tags!.map((t) => (<Link key={t} href={`/courses/tag/${slugify(t)}`}><Badge variant="secondary" className="hover:bg-teal/10 hover:text-teal">{t}</Badge></Link>))}
                </div>
              )}
            </section>
          )}

          {trainer && (
            <section>
              <h2 className="text-xl font-extrabold text-navy sm:text-2xl">Your instructor</h2>
              <div className="mt-4 flex flex-col gap-4 rounded-xl border bg-card p-5 sm:flex-row sm:items-start sm:p-6">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-navy to-teal text-lg font-bold text-white">
                  {trainer.name.split(" ").map((w) => w[0]).join("")}
                </div>
                <div className="min-w-0">
                  <Link href={`/trainers/${trainer.slug}`} className="font-heading text-lg font-bold text-navy hover:text-teal">{trainer.name}</Link>
                  <p className="text-sm font-medium text-teal">{trainer.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{trainer.bio}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {trainer.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {courseTestimonials.length > 0 && (
            <section>
              <h2 className="text-xl font-extrabold text-navy sm:text-2xl">Student reviews</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {courseTestimonials.map((t) => (
                  <figure key={t.slug} className="rounded-xl border bg-card p-5">
                    <StarRating rating={t.rating} className="size-4" />
                    <blockquote className="mt-3 text-sm leading-relaxed text-foreground/85">“{t.text}”</blockquote>
                    <figcaption className="mt-3 text-sm font-semibold text-navy">
                      {t.studentName}
                      <span className="font-normal text-muted-foreground"> — {t.role} at {t.company}</span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </section>
          )}

          {(course.faqs ?? []).length > 0 && (
            <section>
              <h2 className="text-xl font-extrabold text-navy sm:text-2xl">Frequently asked questions</h2>
              <Accordion type="single" collapsible className="mt-4 overflow-hidden rounded-xl border" defaultValue="faq-0">
                {course.faqs!.map((faq, i) => (
                  <AccordionItem key={faq.question} value={`faq-${i}`} className="border-b last:border-b-0">
                    <AccordionTrigger className="rounded-none px-4 py-3.5 text-left font-semibold text-navy hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="px-4 text-sm leading-relaxed text-foreground/85">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          )}

          <div className="lg:hidden">
            <EnquiryForm
              source={`course:${course.slug}`}
              idPrefix="course-enquiry-mobile"
              courseOptions={courseOptions}
              defaultCourse={course.slug}
              heading="Have questions? Get a callback"
            />
          </div>
        </div>

        {/* Desktop: preview card overlapping the title band, sticky while scrolling */}
        <aside className="hidden lg:-mt-64 lg:block">
          <div className="sticky top-20 space-y-6">
            <CoursePurchaseCard course={course} totalMinutes={totalMinutes} lessonCount={lessons.length} showImage />
            <EnquiryForm
              source={`course:${course.slug}`}
              courseOptions={courseOptions}
              defaultCourse={course.slug}
              heading="Have questions? Get a callback"
            />
          </div>
        </aside>
      </div>

      {/* Blog posts about this course */}
      {coursePosts.length > 0 && (
        <section className="py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading align="left" eyebrow="From the blog" title="Read before you enroll" />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {coursePosts.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related courses */}
      {related.length > 0 && (
        <section className="bg-secondary/60 py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading align="left" eyebrow="Keep exploring" title="Related courses" />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
