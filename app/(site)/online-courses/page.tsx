import type { Metadata } from "next";
import Image from "next/image";
import { Monitor, PlaySquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CourseCard } from "@/components/site/course-card";
import { CtaBanner } from "@/components/site/cta-banner";
import { Reveal } from "@/components/site/motion";
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
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy pb-16 pt-32 text-white">
        <Image
          src="https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1600&q=70"
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
            <Badge className="bg-gold text-navy-deep hover:bg-gold">Learn From Anywhere</Badge>
            <h1 className="mx-auto mt-4 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">
              Pick the learning format that fits your life
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">
              Live instructor-led classes over video with real-time doubt clearing, or self-paced
              recorded programs you complete on your own schedule.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                "🖥️ Live evening & weekend batches",
                "🎬 Recordings of every session",
                "💬 Real-time doubt clearing",
                "🇮🇳 Join from anywhere in India",
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

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <Reveal className="mt-14">
          <h2 className="flex items-center gap-2 text-2xl font-bold text-navy">
            <Monitor className="size-6 text-teal" aria-hidden /> Live Online Batches
          </h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Scheduled evening and weekend batches taught live — identical curriculum and placement
            support in every batch, wherever you join from.
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
