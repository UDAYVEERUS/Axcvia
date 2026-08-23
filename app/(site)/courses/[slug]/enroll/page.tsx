import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Award, CalendarDays, CheckCircle2, Clock, ShieldCheck, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatInr } from "@/components/site/course-card";
import { EnrollForm } from "@/components/site/enroll-form";
import { Reveal } from "@/components/site/motion";
import { courses as staticCourses } from "@/lib/data/courses";
import { getCourseBySlug } from "@/lib/services/courses";

export function generateStaticParams() {
  return staticCourses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/courses/[slug]/enroll">): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) return {};
  return {
    title: `Enroll in ${course.title}`,
    description: `Reserve your seat in ${course.title}. ${course.duration}, next batch ${course.nextBatch}. Fee ${formatInr(course.discountFee)} with installment options.`,
    robots: { index: false, follow: true },
  };
}

export default async function EnrollPage({ params }: PageProps<"/courses/[slug]/enroll">) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 pt-28 sm:px-6">
      <Link href={`/courses/${course.slug}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy">
        <ArrowLeft className="size-4" aria-hidden /> Back to course
      </Link>
      <Reveal>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">Enroll in {course.title}</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">{course.tagline}</p>
      </Reveal>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_400px]">
        <Reveal>
          <EnrollForm
            courseSlug={course.slug}
            courseTitle={course.title}
            formats={course.formats}
            amount={course.discountFee}
          />
        </Reveal>

        <Reveal delay={0.1} className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <Card>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-gold text-navy-deep hover:bg-gold">{course.category}</Badge>
                <Badge variant="outline">{course.level}</Badge>
              </div>
              <p className="text-lg font-bold text-navy">{course.title}</p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Clock className="size-4 text-teal" aria-hidden /> {course.duration}</li>
                <li className="flex items-center gap-2"><CalendarDays className="size-4 text-teal" aria-hidden /> Next batch: {course.nextBatch}</li>
                <li className="flex items-center gap-2"><Users className="size-4 text-teal" aria-hidden /> Max 15 students per batch</li>
              </ul>
              <Separator />
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Course fee</span>
                  <span className="line-through">{formatInr(course.fee)}</span>
                </div>
                <div className="flex justify-between text-teal">
                  <span>Early-bird discount</span>
                  <span>− {formatInr(course.fee - course.discountFee)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-navy">
                  <span>Total</span>
                  <span>{formatInr(course.discountFee)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Or from {formatInr(Math.ceil(course.discountFee / 3))}/month over 3 interest-free installments.
                </p>
              </div>
              <Separator />
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Award className="size-4 text-teal" aria-hidden /> Completion certificate</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="size-4 text-teal" aria-hidden /> Placement assistance until hired</li>
                <li className="flex items-center gap-2"><ShieldCheck className="size-4 text-teal" aria-hidden /> 7-day refund guarantee</li>
              </ul>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
