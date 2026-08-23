import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarDays, Clock, ExternalLink, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BlogCard } from "@/components/site/blog-card";
import { CourseCard, formatInr } from "@/components/site/course-card";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { Markdown } from "@/components/site/markdown";
import { Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { blogPosts as staticPosts } from "@/lib/data/blog";
import { site } from "@/lib/data/site";
import { getPostBySlug, getRelatedPosts } from "@/lib/services/blog";
import { getAllCourses, getCourseOptions } from "@/lib/services/courses";
import { getTrainerBySlug } from "@/lib/services/trainers";
import { formatDate, slugify } from "@/lib/utils";

// Seeded posts are prerendered; dashboard-added posts render on demand.
export function generateStaticParams() {
  return staticPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [author, related, allCourses, courseOptions] = await Promise.all([
    getTrainerBySlug(post.authorSlug),
    getRelatedPosts(slug),
    getAllCourses(),
    getCourseOptions(),
  ]);
  const promotedCourses = post.relatedCourseSlugs
    .map((s) => allCourses.find((c) => c.slug === s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  const primaryCourse = promotedCourses[0];
  const authorName = author?.name ?? post.authorName;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage || undefined,
    datePublished: post.publishedAt,
    author: { "@type": "Person", name: authorName },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
    keywords: post.tags.join(", "),
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${site.url}/blog` },
      { "@type": "ListItem", position: 3, name: post.category, item: `${site.url}/blog/category/${slugify(post.category)}` },
      { "@type": "ListItem", position: 4, name: post.title, item: `${site.url}/blog/${post.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonLd, breadcrumbLd]) }} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy pb-16 pt-32 text-white">
        {post.coverImage && (
          <>
            <Image src={post.coverImage} alt="" fill priority sizes="100vw" className="object-cover opacity-25" aria-hidden />
            <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy/60" aria-hidden />
          </>
        )}
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6">
          <Reveal>
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
              <ArrowLeft className="size-4" aria-hidden /> All articles
            </Link>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link href={`/blog/category/${slugify(post.category)}`}>
                <Badge className="bg-gold text-navy-deep hover:bg-gold">{post.category}</Badge>
              </Link>
              {post.tags.map((tag) => (
                <Link key={tag} href={`/blog/tag/${slugify(tag)}`}>
                  <Badge variant="outline" className="border-white/30 text-white hover:bg-white/10">{tag}</Badge>
                </Link>
              ))}
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-5xl">{post.title}</h1>
            <p className="mt-4 text-lg text-white/75">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/80">
              <span className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-full bg-teal text-xs font-bold text-white">
                  {authorName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </span>
                {authorName}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-4 text-teal-bright" aria-hidden /> {formatDate(post.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4 text-teal-bright" aria-hidden /> {post.readingMinutes} min read
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_360px]">
        <article className="min-w-0 max-w-3xl">
          <Reveal>
            <Markdown content={post.content} />
          </Reveal>

          {/* Course promotion */}
          {promotedCourses.length > 0 && (
            <Reveal className="mt-12">
              <div className="rounded-2xl border-2 border-teal/30 bg-teal/5 p-6 sm:p-8">
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-teal">
                  <Sparkles className="size-4" aria-hidden /> Learn this properly
                </p>
                <h2 className="mt-2 text-2xl font-bold text-navy">
                  {promotedCourses.length === 1 ? "Recommended course" : "Courses that teach this"}
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {promotedCourses.map((course) => (
                    <Card key={course.slug} className="h-full">
                      <CardContent className="flex h-full flex-col">
                        <Badge variant="secondary" className="w-fit">{course.category}</Badge>
                        <h3 className="mt-2 font-bold text-navy">{course.title}</h3>
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{course.tagline}</p>
                        <p className="mt-3 text-sm">
                          <span className="text-xl font-extrabold text-navy">{formatInr(course.discountFee)}</span>{" "}
                          <span className="text-muted-foreground line-through">{formatInr(course.fee)}</span>
                          <span className="ml-2 text-muted-foreground">· {course.duration}</span>
                        </p>
                        <div className="mt-auto grid gap-2 pt-4 sm:grid-cols-2">
                          <Button asChild className="bg-teal text-white hover:bg-teal/90">
                            <Link href={`/courses/${course.slug}/enroll`}>Enroll now</Link>
                          </Button>
                          <Button asChild variant="outline">
                            <Link href={`/courses/${course.slug}`}>View syllabus</Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* Author */}
          <Reveal className="mt-12">
            <Card>
              <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-navy text-lg font-bold text-white">
                  {authorName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-teal">Written by</p>
                  <p className="font-semibold text-navy">
                    {author ? (
                      <Link href={`/trainers/${author.slug}`} className="hover:text-teal">{author.name}</Link>
                    ) : (
                      authorName
                    )}
                  </p>
                  {author && (
                    <>
                      <p className="text-sm text-teal">{author.role}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{author.bio}</p>
                      {author.linkedin && (
                        <a href={author.linkedin} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-teal hover:underline">
                          <ExternalLink className="size-3.5" aria-hidden /> LinkedIn
                        </a>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </article>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          {primaryCourse && (
            <Reveal>
              <Card className="border-gold/40 bg-gradient-to-b from-gold/10 to-transparent">
                <CardContent>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gold-deep">Featured course</p>
                  <h3 className="mt-1 text-lg font-bold text-navy">{primaryCourse.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {primaryCourse.duration} · Next batch {primaryCourse.nextBatch}
                  </p>
                  <p className="mt-3">
                    <span className="text-2xl font-extrabold text-navy">{formatInr(primaryCourse.discountFee)}</span>{" "}
                    <span className="text-sm text-muted-foreground line-through">{formatInr(primaryCourse.fee)}</span>
                  </p>
                  <Button asChild className="mt-4 w-full bg-teal text-white hover:bg-teal/90">
                    <Link href={`/courses/${primaryCourse.slug}/enroll`}>
                      Enroll now <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </Reveal>
          )}
          <Reveal delay={0.1}>
            <EnquiryForm
              source={`blog:${post.slug}`}
              courseOptions={courseOptions}
              defaultCourse={primaryCourse?.slug}
              heading="Questions? Get a callback"
            />
          </Reveal>
        </aside>
      </div>

      {promotedCourses.length > 1 && (
        <section className="bg-secondary/40 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading eyebrow="Start learning" title="Courses mentioned in this article" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {promotedCourses.slice(0, 3).map((c) => (
                <CourseCard key={c.slug} course={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading eyebrow="Keep Reading" title="Related articles" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
