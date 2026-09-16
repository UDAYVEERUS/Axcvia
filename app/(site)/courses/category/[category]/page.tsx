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
      <section className="border-b bg-secondary/60 pb-8 pt-24 sm:pb-10 sm:pt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <Link href="/courses" className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-teal">
              <ArrowLeft className="size-4" aria-hidden /> All courses
            </Link>
            <h1 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">{result.category} courses</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              {result.courses.length} course{result.courses.length === 1 ? "" : "s"} in {result.category} — live online, small batches, placement support.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link key={cat} href={`/courses/category/${slugify(cat)}`}>
                  <Badge
                    variant="outline"
                    className={cat === result.category ? "h-7 border-navy bg-navy px-3 text-white" : "h-7 bg-background px-3 text-foreground/80 hover:border-teal/40 hover:text-teal"}
                  >
                    {cat}
                  </Badge>
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <CourseCatalog courses={result.courses} />
      </section>
      <CtaBanner />
    </>
  );
}
