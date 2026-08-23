import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CourseCatalog } from "@/components/site/course-catalog";
import { CtaBanner } from "@/components/site/cta-banner";
import { Reveal } from "@/components/site/motion";
import { courses as staticCourses } from "@/lib/data/courses";
import { getCategories, getCoursesByCategorySlug } from "@/lib/services/courses";
import { slugify } from "@/lib/utils";

export function generateStaticParams() {
  return [...new Set(staticCourses.map((c) => slugify(c.category)))].map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: PageProps<"/courses/category/[category]">): Promise<Metadata> {
  const { category } = await params;
  const result = await getCoursesByCategorySlug(category);
  if (!result) return {};
  return {
    title: `${result.category} Courses — Live Online Training`,
    description: `${result.courses.length} job-oriented ${result.category} course${result.courses.length === 1 ? "" : "s"} at Axcvia with live instructor-led batches, real projects, and placement support.`,
  };
}

export default async function CourseCategoryPage({ params }: PageProps<"/courses/category/[category]">) {
  const { category } = await params;
  const [result, categories] = await Promise.all([getCoursesByCategorySlug(category), getCategories()]);
  if (!result) notFound();

  return (
    <>
      <section className="bg-navy pb-14 pt-32 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm text-white/70 hover:text-white">
              <ArrowLeft className="size-4" aria-hidden /> All courses
            </Link>
            <Badge className="mt-5 block w-fit bg-gold text-navy-deep hover:bg-gold">Category</Badge>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">{result.category} courses</h1>
            <p className="mt-4 max-w-2xl text-lg text-white/75">
              {result.courses.length} course{result.courses.length === 1 ? "" : "s"} in {result.category} — live online, small batches, placement support.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link key={cat} href={`/courses/category/${slugify(cat)}`}>
                  <Badge
                    variant="outline"
                    className={cat === result.category ? "border-gold bg-gold text-navy-deep" : "border-white/30 text-white hover:bg-white/10"}
                  >
                    {cat}
                  </Badge>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <CourseCatalog courses={result.courses} />
      </section>
      <CtaBanner />
    </>
  );
}
