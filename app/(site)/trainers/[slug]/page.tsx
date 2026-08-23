import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Award, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BlogCard } from "@/components/site/blog-card";
import { CourseCard } from "@/components/site/course-card";
import { CtaBanner } from "@/components/site/cta-banner";
import { Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { trainers as staticTrainers } from "@/lib/data/people";
import { site } from "@/lib/data/site";
import { getAllPosts } from "@/lib/services/blog";
import { getAllCourses } from "@/lib/services/courses";
import { getTrainerBySlug } from "@/lib/services/trainers";

export function generateStaticParams() {
  return staticTrainers.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/trainers/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const trainer = await getTrainerBySlug(slug);
  if (!trainer) return {};
  return {
    title: `${trainer.name} — ${trainer.role}`,
    description: trainer.bio,
  };
}

export default async function TrainerPage({ params }: PageProps<"/trainers/[slug]">) {
  const { slug } = await params;
  const trainer = await getTrainerBySlug(slug);
  if (!trainer) notFound();

  const [courses, posts] = await Promise.all([getAllCourses(), getAllPosts()]);
  const teaches = courses.filter((c) => c.trainerSlug === trainer.slug);
  const writes = posts.filter((p) => p.authorSlug === trainer.slug).slice(0, 3);
  const initials = trainer.name.split(" ").map((w) => w[0]).join("").slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: trainer.name,
    jobTitle: trainer.role,
    description: trainer.bio,
    worksFor: { "@type": "Organization", name: site.name, url: site.url },
    sameAs: trainer.linkedin ? [trainer.linkedin] : undefined,
    knowsAbout: trainer.expertise,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="bg-navy pb-16 pt-32 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <Link href="/trainers" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
              <ArrowLeft className="size-4" aria-hidden /> All trainers
            </Link>
            <div className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="flex size-24 shrink-0 items-center justify-center rounded-full bg-teal text-3xl font-bold text-white">
                {initials}
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{trainer.name}</h1>
                <p className="mt-1 text-lg text-teal-bright">{trainer.role}</p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-white/75">
                  <Award className="size-4 text-gold" aria-hidden /> {trainer.experienceYears} years of industry experience
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_340px]">
        <Reveal>
          <h2 className="text-2xl font-bold text-navy">About {trainer.name.split(" ")[0]}</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{trainer.bio}</p>
          <h3 className="mt-8 text-lg font-semibold text-navy">Expertise</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {trainer.expertise.map((skill) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
          {trainer.linkedin && (
            <a href={trainer.linkedin} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:underline">
              <ExternalLink className="size-4" aria-hidden /> LinkedIn profile
            </a>
          )}
        </Reveal>
        <Reveal delay={0.1}>
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="font-semibold text-navy">Learn from {trainer.name.split(" ")[0]}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Book a free demo class and sit in on a live session before you enroll.
            </p>
            <Link href="/contact" className="mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg bg-teal px-4 text-sm font-medium text-white hover:bg-teal/90">
              Book a Free Demo
            </Link>
          </div>
        </Reveal>
      </section>

      {teaches.length > 0 && (
        <section className="bg-secondary/40 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading eyebrow="Courses" title={`Courses taught by ${trainer.name.split(" ")[0]}`} />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {teaches.map((c) => (
                <CourseCard key={c.slug} course={c} />
              ))}
            </div>
          </div>
        </section>
      )}

      {writes.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading eyebrow="From the blog" title={`Articles by ${trainer.name.split(" ")[0]}`} />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {writes.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBanner />
    </>
  );
}
