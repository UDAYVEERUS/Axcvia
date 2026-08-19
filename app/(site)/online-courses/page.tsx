import type { Metadata } from "next";
import { Monitor, PlaySquare } from "lucide-react";
import { CourseCard } from "@/components/site/course-card";
import { CtaBanner } from "@/components/site/cta-banner";
import { Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { getAllCourses } from "@/lib/services/courses";

export const metadata: Metadata = {
  title: "Online Courses — Live Instructor-Led & Self-Paced",
  description:
    "Learn from anywhere with Axcvia's live-online instructor-led batches and self-paced recorded courses. Same trainers, same projects, same placement support.",
};

export default async function OnlineCoursesPage() {
  const courses = await getAllCourses();
  const liveOnline = courses.filter((c) => c.formats.includes("live-online"));
  const selfPaced = courses.filter((c) => c.formats.includes("self-paced"));

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6">
        <SectionHeading
          eyebrow="Learn From Anywhere"
          title="Online courses"
          description="Live instructor-led classes over video with real-time doubt clearing, or self-paced recorded programs you complete on your own schedule."
        />

        <Reveal className="mt-14">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-navy">
            <Monitor className="size-6 text-teal" aria-hidden /> Live Online Batches
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Scheduled evening and weekend batches taught live — identical curriculum and placement
            support as our classroom programs.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {liveOnline.map((c) => (
            <CourseCard key={c.slug} course={c} />
          ))}
        </div>

        <Reveal className="mt-16">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-navy">
            <PlaySquare className="size-6 text-teal" aria-hidden /> Self-Paced Programs
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Recorded course content with weekly doubt-clearing sessions and project reviews. Online
            purchase & instant access are coming soon — enquire to get early access.
          </p>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {selfPaced.map((c) => (
            <CourseCard key={c.slug} course={c} />
          ))}
        </div>
      </section>
      <CtaBanner
        title="Want to try before you enroll?"
        description="Attend one full live-online session for free and experience the teaching style yourself."
        buttonLabel="Book a Free Demo"
      />
    </>
  );
}
