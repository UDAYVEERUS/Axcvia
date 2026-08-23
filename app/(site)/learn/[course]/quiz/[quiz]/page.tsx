import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { LearnSidebar } from "@/components/site/learn-sidebar";
import { QuizRunner } from "@/components/site/quiz-runner";
import { connectDb, isDbConfigured } from "@/lib/db";
import { QuizAttemptModel } from "@/lib/models/quiz-attempt";
import { getCourseBySlug } from "@/lib/services/courses";
import { getQuizBySlug, getQuizzesForCourse } from "@/lib/services/lms";
import { requireStudent } from "@/lib/student/auth";
import { getAccess } from "@/lib/student/enrollments";

export const metadata: Metadata = { robots: { index: false } };

export default async function QuizPage({ params, searchParams }: PageProps<"/learn/[course]/quiz/[quiz]">) {
  const { course: slug, quiz: quizSlug } = await params;
  const { attempt: attemptId } = await searchParams;
  const student = await requireStudent(`/learn/${slug}/quiz/${quizSlug}`);
  const [course, quiz] = await Promise.all([getCourseBySlug(slug), getQuizBySlug(quizSlug)]);
  if (!quiz) notFound();

  const access = course ? await getAccess(student.id, slug) : null;
  if (!access && !quiz.isFreeSample) redirect(`/courses/${slug}?locked=1`);

  const quizzes = course ? await getQuizzesForCourse(slug) : [];

  // Reviewing a past attempt?
  let review = null;
  if (typeof attemptId === "string" && isDbConfigured()) {
    await connectDb();
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const a: any = await QuizAttemptModel.findOne({ _id: attemptId, userId: student.id, quizSlug }).lean().catch(() => null);
    if (a) {
      review = {
        questions: quiz.questions,
        result: { attemptId: String(a._id), score: a.score, total: a.total, percent: a.percent, passed: a.passed, order: a.order, answers: a.answers },
      };
    }
  }

  const publicQuestions = quiz.questions.map((q) => ({ text: q.text, options: q.options }));
  const runner = (
    <QuizRunner
      quiz={{ slug: quiz.slug, title: quiz.title, description: quiz.description, durationMinutes: quiz.durationMinutes, passingPercent: quiz.passingPercent, shuffle: quiz.shuffle }}
      questions={publicQuestions}
      courseSlug={course?.slug ?? ""}
      review={review}
    />
  );

  if (!course) return <div className="mx-auto max-w-3xl px-4 pb-20 pt-28 sm:px-6">{runner}</div>;
  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 pb-20 pt-24 sm:px-6 lg:grid-cols-[320px_1fr]">
      <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]"><LearnSidebar course={course} quizzes={quizzes} completed={access?.completedLessons ?? []} activeId={`quiz:${quiz.slug}`} /></div>
      <div className="min-w-0">{runner}</div>
    </div>
  );
}
