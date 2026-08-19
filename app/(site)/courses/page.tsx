import type { Metadata } from "next";
import { CourseCatalog } from "@/components/site/course-catalog";
import { CtaBanner } from "@/components/site/cta-banner";
import { SectionHeading } from "@/components/site/section-heading";
import { getAllCourses, getCategories } from "@/lib/services/courses";

export const metadata: Metadata = {
  title: "All Courses — Programming, Data Science, Testing & Cloud",
  description:
    "Browse Axcvia's job-oriented courses in Full Stack Development, Data Science, Java, Software Testing, Mobile Development, and DevOps. Classroom & online batches with placement support.",
};

export default async function CoursesPage() {
  const [courses, courseCategories] = await Promise.all([getAllCourses(), getCategories()]);
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6">
        <SectionHeading
          eyebrow="Course Catalog"
          title="Find your career track"
          description="Every program includes live projects, expert trainers, certification, and placement assistance."
        />
        <div className="mt-12">
          <CourseCatalog courses={courses} categories={courseCategories} />
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
