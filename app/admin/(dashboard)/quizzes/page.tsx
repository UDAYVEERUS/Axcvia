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

const PER_PAGE = 50;

export default async function Page({ searchParams }: PageProps<"/admin/quizzes">) {
  const flash = await searchParams;
  const { rows, dbReady } = await loadForAdmin(seed, QuizModel, toQuiz);

  const q = (typeof flash.q === "string" ? flash.q : "").trim().toLowerCase();
  const filtered = q
    ? rows.filter((r) => `${r.title} ${r.slug} ${r.courseSlug}`.toLowerCase().includes(q))
    : rows;
  const page = Math.max(1, Number(typeof flash.page === "string" ? flash.page : 1) || 1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const paged = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);
  const qs = (p: number) => `?${new URLSearchParams({ ...(q ? { q } : {}), page: String(p) })}`;

  return (
    <div>
      <AdminListHeader title="Quizzes & Mock Tests" subtitle={`${rows.length} total`} addHref="/admin/quizzes/new" addLabel="Add Quiz" flash={flash} dbReady={dbReady} seedNote="Showing seeded quizzes. Connect MongoDB to create mock tests from here." />
      <form className="mt-4 flex gap-2" action="/admin/quizzes" method="get">
        <input name="q" defaultValue={q} placeholder="Search by title, slug or course…" className="w-full max-w-md rounded-lg border bg-background px-3 py-2 text-sm" />
        <Button type="submit" variant="outline" size="sm">Search</Button>
        {q && <Button asChild variant="ghost" size="sm"><Link href="/admin/quizzes">Clear</Link></Button>}
      </form>
      {q && <p className="mt-2 text-sm text-muted-foreground">{filtered.length} match{filtered.length === 1 ? "" : "es"} for “{q}”</p>}
      <div className="mt-4 overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Quiz</TableHead><TableHead>Course</TableHead><TableHead>Questions</TableHead><TableHead>Status</TableHead><TableHead>Source</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {paged.map((row) => (
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
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Page {current} of {totalPages}</span>
          <div className="flex gap-2">
            {current > 1 && <Button asChild variant="outline" size="sm"><Link href={qs(current - 1)}>Previous</Link></Button>}
            {current < totalPages && <Button asChild variant="outline" size="sm"><Link href={qs(current + 1)}>Next</Link></Button>}
          </div>
        </div>
      )}
    </div>
  );
}
