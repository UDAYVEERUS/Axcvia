import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarDays, CheckCircle2, Layers } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AddToCartButtons } from "@/components/site/add-to-cart";
import { CourseCard, formatInr } from "@/components/site/course-card";
import { Markdown } from "@/components/site/markdown";
import { Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { bundles as seed } from "@/lib/data/lms";
import { getAllCourses } from "@/lib/services/courses";
import { getBundleBySlug } from "@/lib/services/lms";

export function generateStaticParams() {
  return seed.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/bundles/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const b = await getBundleBySlug(slug);
  return b ? { title: b.title, description: b.tagline } : {};
}

export default async function BundlePage({ params }: PageProps<"/bundles/[slug]">) {
  const { slug } = await params;
  const [bundle, courses] = await Promise.all([getBundleBySlug(slug), getAllCourses()]);
  if (!bundle) notFound();
  const included = bundle.courseSlugs.map((s) => courses.find((c) => c.slug === s)).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const separately = included.reduce((s, c) => s + c.discountFee, 0);

  return (
    <>
      <section className="relative overflow-hidden bg-navy pb-16 pt-32 text-white">
        {bundle.image && (<><Image src={bundle.image} alt="" fill priority sizes="100vw" className="object-cover opacity-25" aria-hidden /><div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy/60" aria-hidden /></>)}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <Badge className="bg-gold text-navy-deep hover:bg-gold"><Layers className="mr-1 size-3" aria-hidden /> Bundle · {included.length} courses</Badge>
            <h1 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">{bundle.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-white/75">{bundle.tagline}</p>
          </Reveal>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_380px]">
        <div className="min-w-0">
          <Reveal><h2 className="text-2xl font-bold text-navy">About this bundle</h2><div className="mt-4"><Markdown content={bundle.description} /></div></Reveal>
          <Reveal className="mt-10">
            <h2 className="text-2xl font-bold text-navy">What&apos;s included</h2>
            <div className="mt-4 grid gap-6 sm:grid-cols-2">{included.map((c) => <CourseCard key={c.slug} course={c} />)}</div>
          </Reveal>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <Reveal>
            <Card><CardContent className="space-y-4">
              <p><span className="text-3xl font-extrabold text-navy">{formatInr(bundle.discountPrice)}</span> <span className="text-muted-foreground line-through">{formatInr(bundle.price)}</span></p>
              <p className="text-sm text-teal">Save {formatInr(separately - bundle.discountPrice)} vs. buying separately ({formatInr(separately)})</p>
              <AddToCartButtons line={{ kind: "bundle", slug: bundle.slug, title: bundle.title, price: bundle.discountPrice, image: bundle.image }} />
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-teal" aria-hidden /> All {included.length} courses unlocked instantly</li>
                <li className="flex items-center gap-2"><CalendarDays className="size-4 text-teal" aria-hidden /> {bundle.validityDays ? `${bundle.validityDays} days access` : "Lifetime access"}</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-teal" aria-hidden /> Certificates for every course</li>
              </ul>
            </CardContent></Card>
          </Reveal>
        </aside>
      </div>
      <section className="bg-secondary/40 py-16"><div className="mx-auto max-w-7xl px-4 sm:px-6"><SectionHeading eyebrow="Still deciding?" title="Talk to a counsellor" description="We'll map your background to the right courses — free." /></div></section>
    </>
  );
}
