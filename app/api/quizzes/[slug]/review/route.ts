import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { QuizAttemptModel } from "@/lib/models/quiz-attempt";
import { getQuizBySlug } from "@/lib/services/lms";
import { getCurrentStudent } from "@/lib/student/auth";

// Returns questions WITH answers — only to the student who owns the attempt.
export async function GET(request: Request, ctx: RouteContext<"/api/quizzes/[slug]/review">) {
  const student = await getCurrentStudent();
  if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = await ctx.params;
  const attemptId = new URL(request.url).searchParams.get("attempt");
  await connectDb();
  const attempt = await QuizAttemptModel.findOne({ _id: attemptId, userId: student.id, quizSlug: slug }).lean();
  if (!attempt) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const quiz = await getQuizBySlug(slug);
  if (!quiz) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ questions: quiz.questions });
}
