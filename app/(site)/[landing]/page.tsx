import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BundleCard } from "@/components/site/bundle-card";
import { CourseCard } from "@/components/site/course-card";
import { CtaBanner } from "@/components/site/cta-banner";
import { EnquiryForm } from "@/components/site/enquiry-form";
import { Markdown } from "@/components/site/markdown";
import { Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { landingPages as seed } from "@/lib/data/lms";
import { getAllCourses, getCourseOptions } from "@/lib/services/courses";
import { getAllBundles, getLandingPageBySlug } from "@/lib/services/lms";

// CMS landing pages at the site root — /java-classes, /mock-tests, /cadet-programme…
// Mirrors WordPress category pages so old URLs keep working after migration.
export function generateStaticParams() {
  return seed.map((p) => ({ landing: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[landing]">): Promise<Metadata> {
  const { landing } = await params;
  const page = await getLandingPageBySlug(landing);
  if (!page) return {};
  return { title: page.metaTitle || page.title, description: page.metaDescription || page.heroText.slice(0, 160) };
}

export default async function LandingPage({ params }: PageProps<"/[landing]">) {
  const { landing } = await params;
  const page = await getLandingPageBySlug(landing);
  if (!page) notFound();
  const [courses, bundles, courseOptions] = await Promise.all([getAllCourses(), getAllBundles(), getCourseOptions()]);
  const listed = page.courseSlugs.length
    ? page.courseSlugs.map((s) => courses.find((c) => c.slug === s)).filter((c): c is NonNullable<typeof c> => Boolean(c))
    : page.courseTag
      ? courses.filter((c) => (c.tags ?? []).includes(page.courseTag) || c.category === page.courseTag)
      : [];
  const listedBundles = page.bundleSlugs.map((s) => bundles.find((b) => b.slug === s)).filter((b): b is NonNullable<typeof b> => Boolean(b));
  const faqLd = page.faqs.length
    ? { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: page.faqs.map((f) => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }
    : null;

  return (
    <>
      {faqLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />}
      <section className="relative overflow-hidden bg-navy pb-16 pt-32 text-white">
        {page.heroImage && (<><Image src={page.heroImage} alt="" fill priority sizes="100vw" className="object-cover opacity-20" aria-hidden /><div className="absolute inset-0 bg-gradient-to-b from-navy-deep/80 to-navy" aria-hidden /></>)}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            {page.eyebrow && <Badge className="bg-gold text-navy-deep hover:bg-gold">{page.eyebrow}</Badge>}
            <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">{page.heroTitle || page.title}</h1>
            <p className="mt-5 max-w-3xl text-lg text-white/75">{page.heroText}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold text-navy-deep hover:bg-gold/90"><a href="#courses">Enroll today</a></Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/10"><Link href="/contact">Book a free demo</Link></Button>
            </div>
          </Reveal>
        </div>
      </section>

      {page.highlights.length > 0 && (
        <section className="mx-auto -mt-8 max-w-7xl px-4 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {page.highlights.map((h) => (
              <Reveal key={h.title}><div className="rounded-xl border bg-card p-5 shadow-sm"><p className="text-2xl font-extrabold text-navy">{h.title}</p><p className="mt-1 text-sm text-muted-foreground">{h.text}</p></div></Reveal>
            ))}
          </div>
        </section>
      )}

      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 space-y-10">
          {page.sections.map((s) => (
            <Reveal key={s.heading}><h2 className="text-2xl font-bold text-navy">{s.heading}</h2><div className="mt-4"><Markdown content={s.body} /></div></Reveal>
          ))}
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start"><Reveal><EnquiryForm source={`landing:${page.slug}`} courseOptions={courseOptions} heading="Get a callback" /></Reveal></aside>
      </div>

      {listed.length > 0 && (
        <section id="courses" className="bg-secondary/40 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <SectionHeading eyebrow="Courses" title={`${page.title} courses`} />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{listed.map((c) => <CourseCard key={c.slug} course={c} />)}</div>
          </div>
        </section>
      )}
      {listedBundles.length > 0 && (
        <section className="py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="Save more" title="Bundles" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{listedBundles.map((b) => <BundleCard key={b.slug} bundle={b} />)}</div>
        </div></section>
      )}
      {page.faqs.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <SectionHeading eyebrow="FAQ" title="Queries we get from students" />
          <Accordion type="single" collapsible className="mt-8">
            {page.faqs.map((f, i) => (<AccordionItem key={i} value={`f-${i}`}><AccordionTrigger className="text-left font-semibold">{f.question}</AccordionTrigger><AccordionContent className="text-muted-foreground">{f.answer}</AccordionContent></AccordionItem>))}
          </Accordion>
        </section>
      )}
      <CtaBanner />
    </>
  );
}
