import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/site/course-card";
import { CtaBanner } from "@/components/site/cta-banner";
import { Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { getCoursesByType } from "@/lib/services/courses";
import { getAllQuizzes } from "@/lib/services/lms";

export const metadata: Metadata = {
  title: "Mock Test Series — Timed Tests with Instant Results",
  description: "Practice with Axcvia's timed online mock tests. Unlimited attempts, instant scores and explanations, progress tracking in your dashboard. Start with a free sample.",
};

export default async function MockTestsPage() {
  const [series, quizzes] = await Promise.all([getCoursesByType("mock-test"), getAllQuizzes()]);
  const samples = quizzes.filter((q) => q.isFreeSample);
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6">
        <SectionHeading as="h1" eyebrow="Practice" title="Mock test series" description="Exam-style timed tests with instant results and explanations. Unlimited attempts during your validity period." />
        {samples.length > 0 && (
          <Reveal className="mt-10 rounded-2xl border-2 border-dashed border-teal/40 bg-teal/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-teal">Try it free</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {samples.map((q) => (
                <div key={q.slug} className="flex items-center gap-3 rounded-xl border bg-card p-4">
                  <ClipboardCheck className="size-8 shrink-0 text-teal" aria-hidden />
                  <div className="min-w-0 flex-1"><p className="font-semibold text-navy">{q.title}</p><p className="text-xs text-muted-foreground">{q.questions.length} questions · {q.durationMinutes} min</p></div>
                  <Button asChild size="sm" className="bg-teal text-white hover:bg-teal/90"><Link href={`/learn/${q.courseSlug || "sample"}/quiz/${q.slug}`}>Start</Link></Button>
                </div>
              ))}
            </div>
          </Reveal>
        )}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {series.map((c, i) => (<Reveal key={c.slug} delay={i * 0.05}><CourseCard course={c} /></Reveal>))}
        </div>
        {series.length === 0 && <p className="mt-12 text-center text-muted-foreground">Mock test series are added from the dashboard (Courses → type “Mock Test Series”).</p>}
      </section>
      <CtaBanner />
    </>
  );
}
