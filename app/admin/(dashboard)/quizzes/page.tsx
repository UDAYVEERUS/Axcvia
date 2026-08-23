import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminListHeader, PublishedBadge, SourceBadge } from "@/components/admin/admin-shell";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteQuizAction } from "@/app/admin/actions";
import { quizzes as seed } from "@/lib/data/lms";
import { QuizModel } from "@/lib/models/quiz";
import { loadForAdmin } from "@/lib/services/content";
import { toQuiz } from "@/lib/services/lms";

export const metadata: Metadata = { title: "Quizzes & Mock Tests" };

export default async function Page({ searchParams }: PageProps<"/admin/quizzes">) {
  const flash = await searchParams;
  const { rows, dbReady } = await loadForAdmin(seed, QuizModel, toQuiz);
  return (
    <div>
      <AdminListHeader title="Quizzes & Mock Tests" subtitle={`${rows.length} total`} addHref="/admin/quizzes/new" addLabel="Add Quiz" flash={flash} dbReady={dbReady} seedNote="Showing seeded quizzes. Connect MongoDB to create mock tests from here." />
      <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Quiz</TableHead><TableHead>Course</TableHead><TableHead>Questions</TableHead><TableHead>Status</TableHead><TableHead>Source</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.slug}>
                <TableCell><p className="font-medium text-navy">{row.title}</p><p className="text-xs text-muted-foreground">{row.slug}{row.isFreeSample && " · free sample"}</p></TableCell>
                <TableCell className="text-sm">{row.courseSlug || "—"}</TableCell>
                <TableCell>{row.questions.length} · {row.durationMinutes} min · pass {row.passingPercent}%</TableCell>
                <TableCell><PublishedBadge isPublished={row.isPublished} /></TableCell>
                <TableCell><SourceBadge source={row.source} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="outline" size="sm"><Link href={`/admin/quizzes/${row.slug}`}>{row.source === "seed" ? "Override" : "Edit"}</Link></Button>
                    {row.source === "database" && <DeleteButton slug={row.slug} label="quiz" action={deleteQuizAction} />}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
