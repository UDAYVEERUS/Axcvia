import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearnSidebar } from "@/components/site/learn-sidebar";
import { LessonPlayer } from "@/components/site/lesson-player";
import { Markdown } from "@/components/site/markdown";
import { completeLessonAction } from "@/app/student-actions";
import { courseLessons, getCourseBySlug } from "@/lib/services/courses";
import { getQuizzesForCourse } from "@/lib/services/lms";
import { requireStudent } from "@/lib/student/auth";
import { getAccess } from "@/lib/student/enrollments";

export const metadata: Metadata = { robots: { index: false } };

export default async function LessonPage({ params }: PageProps<"/learn/[course]/[lesson]">) {
  const { course: slug, lesson: lessonId } = await params;
  const student = await requireStudent(`/learn/${slug}/${lessonId}`);
  const course = await getCourseBySlug(slug);
  if (!course) notFound();
  const lessons = courseLessons(course);
  const index = lessons.findIndex((l) => l.id === lessonId);
  if (index === -1) notFound();
  const lesson = lessons[index];

  const access = await getAccess(student.id, slug);
  if (!access && !lesson.isPreview) redirect(`/courses/${slug}?locked=1`);
  if (lesson.type === "quiz" && lesson.quizSlug) redirect(`/learn/${slug}/quiz/${lesson.quizSlug}`);

  const quizzes = await getQuizzesForCourse(slug);
  const completed = access?.completedLessons ?? [];
  const prev = lessons[index - 1];
  const next = lessons[index + 1];
  const isDone = completed.includes(lesson.id);

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-20 pt-24 sm:px-6 lg:grid-cols-[320px_1fr]">
      <div className="lg:h-[calc(100vh-8rem)] lg:sticky lg:top-24"><LearnSidebar course={course} quizzes={quizzes} completed={completed} activeId={lesson.id} /></div>
      <div className="min-w-0">
        {lesson.type === "video" && lesson.videoUrl && <LessonPlayer url={lesson.videoUrl} title={lesson.title} />}
        <h1 className="mt-5 text-2xl font-bold text-navy">{lesson.title}</h1>
        {lesson.content && <div className="mt-4"><Markdown content={lesson.content} /></div>}
        {lesson.attachmentUrl && (
          <Button asChild variant="outline" className="mt-5">
            <a href={lesson.attachmentUrl} target="_blank" rel="noopener noreferrer"><Download className="size-4" aria-hidden /> {lesson.attachmentLabel || "Download attachment"}</a>
          </Button>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t pt-5">
          {prev ? <Button asChild variant="ghost"><Link href={`/learn/${slug}/${prev.id}`}><ArrowLeft className="size-4" aria-hidden /> Previous</Link></Button> : <span />}
          {access ? (
            <form action={completeLessonAction} className="flex gap-2">
              <input type="hidden" name="courseSlug" value={slug} />
              <input type="hidden" name="lessonId" value={lesson.id} />
              <input type="hidden" name="nextId" value={next?.id ?? ""} />
              <Button type="submit" className="bg-teal text-white hover:bg-teal/90">
                <CheckCircle2 className="size-4" aria-hidden /> {isDone ? (next ? "Next lesson" : "Completed") : next ? "Mark complete & next" : "Mark complete"}
                {next && <ArrowRight className="size-4" aria-hidden />}
              </Button>
            </form>
          ) : (
            <Button asChild className="bg-teal text-white hover:bg-teal/90"><Link href={`/courses/${slug}`}>Enroll to continue</Link></Button>
          )}
        </div>
      </div>
    </div>
  );
}
