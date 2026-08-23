import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { QuizForm } from "@/components/admin/quiz-form";
import { getQuizBySlug } from "@/lib/services/lms";
import { quizzes as seed } from "@/lib/data/lms";

export const metadata: Metadata = { title: "Edit Quiz" };

export default async function Page({ params, searchParams }: PageProps<"/admin/quizzes/[slug]">) {
  const { slug } = await params;
  const { error } = await searchParams;
  const item = await getQuizBySlug(slug);
  if (!item) notFound();
  const isSeed = seed.some((s) => s.slug === slug);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-navy">Edit Quiz</h1>
        {isSeed && <Badge variant="outline" className="text-muted-foreground">Seeded entry — saving creates a database override</Badge>}
      </div>
      <p className="text-sm text-muted-foreground">/learn/…/quiz{slug}</p>
      <div className="mt-6 rounded-xl border bg-card p-6">
        <QuizForm item={item} originalSlug={slug} error={typeof error === "string" ? error : undefined} />
      </div>
    </div>
  );
}
