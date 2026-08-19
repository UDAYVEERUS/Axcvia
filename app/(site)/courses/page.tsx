import type { Metadata } from "next";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CourseCatalog } from "@/components/site/course-catalog";
import { CtaBanner } from "@/components/site/cta-banner";
import { Reveal } from "@/components/site/motion";
import { getAllCourses, getCategories } from "@/lib/services/courses";

export const metadata: Metadata = {
  title: "All Courses — Programming, Data Science, Testing & Cloud",
  description:
    "Browse Axcvia's job-oriented courses in Full Stack Development, Data Science, Java, Software Testing, Mobile Development, and DevOps. Live online batches with placement support, joinable from anywhere in India.",
};

export default async function CoursesPage() {
  const [courses, courseCategories] = await Promise.all([getAllCourses(), getCategories()]);
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy pb-16 pt-32 text-white">
        <Image
          src="https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=70"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-20"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/80 to-navy" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6">
          <Reveal>
            <Badge className="bg-gold text-navy-deep hover:bg-gold">Course Catalog</Badge>
            <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">
              Find your career track
            </h1>
            <p className="mx-auto mt-5 max-w-3xl text-lg text-white/75">
              Live projects, expert trainers, certification & placement assistance in every program.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                "🎓 Certificate included",
                "🖥️ 100% live online",
                "👥 Batches of 15",
                "💳 EMI available",
                "🤝 Placement support",
              ].map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white/85 backdrop-blur-sm"
                >
                  {chip}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Catalog */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <CourseCatalog courses={courses} categories={courseCategories} />
      </section>
      <CtaBanner />
    </>
  );
}
