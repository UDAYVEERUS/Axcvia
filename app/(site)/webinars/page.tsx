import type { Metadata } from "next";
import { CourseCatalog } from "@/components/site/course-catalog";
import { CtaBanner } from "@/components/site/cta-banner";
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
        {webinars.length > 0 && (
          <div className="mt-12">
            <CourseCatalog courses={webinars} fixedType="webinar" />
          </div>
        )}
        {webinars.length === 0 && <p className="mt-12 text-center text-muted-foreground">No webinars scheduled yet — add one from the dashboard (Courses → type “Webinar”).</p>}
      </section>
      <CtaBanner />
    </>
  );
}
