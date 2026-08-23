import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseCatalog } from "@/components/site/course-catalog";
import { CtaBanner } from "@/components/site/cta-banner";
import { SectionHeading } from "@/components/site/section-heading";
import { getCoursesByTag } from "@/lib/services/courses";

export async function generateMetadata({ params }: PageProps<"/courses/tag/[tag]">): Promise<Metadata> {
  const { tag } = await params;
  const r = await getCoursesByTag(tag);
  return r ? { title: `${r.tag} Courses`, description: `${r.courses.length} courses tagged ${r.tag} at Axcvia.` } : {};
}

export default async function CourseTagPage({ params }: PageProps<"/courses/tag/[tag]">) {
  const { tag } = await params;
  const r = await getCoursesByTag(tag);
  if (!r) notFound();
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-32 sm:px-6"><SectionHeading as="h1" eyebrow="Tagged" title={`#${r.tag}`} description={`${r.courses.length} course${r.courses.length === 1 ? "" : "s"}`} /></section>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6"><CourseCatalog courses={r.courses} /></section>
      <CtaBanner />
    </>
  );
}
