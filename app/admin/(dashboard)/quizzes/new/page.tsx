import type { Metadata } from "next";
import { QuizForm } from "@/components/admin/quiz-form";
import { requireAdmin } from "@/lib/admin/auth";

export const metadata: Metadata = { title: "Add Quiz" };

export default async function Page({ searchParams }: PageProps<"/admin/quizzes/new">) {
  await requireAdmin();
  const { error } = await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Add Quiz</h1>
      <div className="mt-6 rounded-xl border bg-card p-6">
        <QuizForm error={typeof error === "string" ? error : undefined} />
      </div>
    </div>
  );
}
