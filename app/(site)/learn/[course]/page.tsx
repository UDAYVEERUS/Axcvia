import { notFound, redirect } from "next/navigation";
import { courseLessons, getCourseBySlug } from "@/lib/services/courses";
import { getQuizzesForCourse } from "@/lib/services/lms";
import { requireStudent } from "@/lib/student/auth";
import { getAccess } from "@/lib/student/enrollments";

// Entry point: jump to the first incomplete lesson (or the first quiz for a
// mock-test series with no lessons).
export default async function LearnIndex({ params }: PageProps<"/learn/[course]">) {
  const { course: slug } = await params;
  const student = await requireStudent(`/learn/${slug}`);
  const course = await getCourseBySlug(slug);
  if (!course) notFound();
  const access = await getAccess(student.id, slug);
  if (!access) redirect(`/courses/${slug}?locked=1`);

  const lessons = courseLessons(course);
  const next = lessons.find((l) => !access.completedLessons.includes(l.id)) ?? lessons[0];
  if (next) redirect(`/learn/${slug}/${next.id}`);

  const quizzes = await getQuizzesForCourse(slug);
  if (quizzes[0]) redirect(`/learn/${slug}/quiz/${quizzes[0].slug}`);
  redirect(`/courses/${slug}?empty=1`);
}
