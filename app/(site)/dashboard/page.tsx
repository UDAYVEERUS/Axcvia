import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Lock, PlayCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { courseLessons, getAllCourses } from "@/lib/services/courses";
import { getCurrentStudent } from "@/lib/student/auth";
import { getStudentEnrollments, isActive } from "@/lib/student/enrollments";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "My Courses", robots: { index: false } };

export default async function DashboardHome() {
  const student = (await getCurrentStudent())!;
  const [enrollments, courses] = await Promise.all([getStudentEnrollments(student.id), getAllCourses()]);

  if (enrollments.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-card p-10 text-center">
        <p className="font-semibold text-navy">You haven&apos;t enrolled in any course yet.</p>
        <p className="mt-1 text-sm text-muted-foreground">Start with a free sample test or browse the catalog.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <Button asChild className="bg-teal text-white hover:bg-teal/90"><Link href="/courses">Browse courses</Link></Button>
          <Button asChild variant="outline"><Link href="/mock-tests">Free sample test</Link></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {enrollments.map((e) => {
        const course = courses.find((c) => c.slug === e.courseSlug);
        const lessons = course ? courseLessons(course) : [];
        const done = lessons.filter((l) => e.completedLessons.includes(l.id)).length;
        const pct = lessons.length ? Math.round((done / lessons.length) * 100) : 0;
        const active = isActive(e);
        return (
          <div key={e.id} className="flex flex-col rounded-xl border bg-card p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal">{course?.type === "mock-test" ? "Mock test series" : course?.type === "webinar" ? "Webinar" : "Classes"}</p>
                <h2 className="mt-1 font-bold text-navy">{e.courseTitle}</h2>
              </div>
              {active ? (
                <Badge className="bg-teal/10 text-teal hover:bg-teal/10">Active</Badge>
              ) : (
                <Badge variant="secondary" className="text-muted-foreground">{e.status === "pending" ? "Awaiting payment" : e.status === "cancelled" ? "Cancelled" : "Expired"}</Badge>
              )}
            </div>
            {lessons.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-xs text-muted-foreground"><span>{done}/{lessons.length} lessons</span><span>{pct}%</span></div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-secondary"><div className="h-full rounded-full bg-teal" style={{ width: `${pct}%` }} /></div>
              </div>
            )}
            <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="size-3.5" aria-hidden />
              {e.expiresAt ? `Access until ${formatDate(e.expiresAt)}` : "Lifetime access"}
            </p>
            <div className="mt-auto pt-4">
              {active ? (
                <Button asChild className="w-full bg-teal text-white hover:bg-teal/90">
                  <Link href={`/learn/${e.courseSlug}`}><PlayCircle className="size-4" aria-hidden /> {done > 0 ? "Continue learning" : "Start learning"}</Link>
                </Button>
              ) : e.status === "pending" ? (
                <p className="rounded-lg bg-gold/10 p-2 text-xs text-gold-deep"><Lock className="mr-1 inline size-3" aria-hidden /> Unlocks once payment is confirmed. Our counsellor will call you.</p>
              ) : (
                <Button asChild variant="outline" className="w-full"><Link href={`/courses/${e.courseSlug}`}>Renew access <ArrowRight className="size-4" aria-hidden /></Link></Button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
