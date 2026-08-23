import type { Metadata } from "next";
import { CourseCard } from "@/components/site/course-card";
import { CtaBanner } from "@/components/site/cta-banner";
import { Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { getCoursesByType } from "@/lib/services/courses";

export const metadata: Metadata = {
  title: "Free Webinars — Career Guidance & Expert Sessions",
  description: "Free recorded and live webinars from Axcvia trainers on career paths, hiring trends and interview preparation. Register with a free student account.",
};

export default async function WebinarsPage() {
  const webinars = await getCoursesByType("webinar");
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6">
        <SectionHeading as="h1" eyebrow="Free" title="Webinars" description="Expert sessions on careers, hiring and interview preparation. Free with a student account — recordings stay in your dashboard." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {webinars.map((c, i) => (<Reveal key={c.slug} delay={i * 0.05}><CourseCard course={c} /></Reveal>))}
        </div>
        {webinars.length === 0 && <p className="mt-12 text-center text-muted-foreground">No webinars scheduled yet — add one from the dashboard (Courses → type “Webinar”).</p>}
      </section>
      <CtaBanner />
    </>
  );
}
