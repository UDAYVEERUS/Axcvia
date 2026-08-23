import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { connectDb, isDbConfigured } from "@/lib/db";
import { QuizAttemptModel } from "@/lib/models/quiz-attempt";
import { getCurrentStudent } from "@/lib/student/auth";

export const metadata: Metadata = { title: "Test Results", robots: { index: false } };

export default async function ResultsPage() {
  const student = (await getCurrentStudent())!;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let attempts: any[] = [];
  if (isDbConfigured()) {
    await connectDb();
    attempts = await QuizAttemptModel.find({ userId: student.id }).sort({ createdAt: -1 }).limit(100).lean();
  }
  if (attempts.length === 0) {
    return <p className="rounded-xl border border-dashed bg-card p-10 text-center text-sm text-muted-foreground">No test attempts yet. Results appear here the moment you submit a mock test.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <Table>
        <TableHeader><TableRow><TableHead>Test</TableHead><TableHead>Score</TableHead><TableHead>Result</TableHead><TableHead>Date</TableHead><TableHead /></TableRow></TableHeader>
        <TableBody>
          {attempts.map((a) => (
            <TableRow key={String(a._id)}>
              <TableCell className="font-medium text-navy">{a.quizTitle}</TableCell>
              <TableCell>{a.score}/{a.total} · {a.percent}%</TableCell>
              <TableCell><Badge className={a.passed ? "bg-teal/10 text-teal hover:bg-teal/10" : "bg-destructive/10 text-destructive hover:bg-destructive/10"}>{a.passed ? "Passed" : "Failed"}</Badge></TableCell>
              <TableCell className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString("en-IN")}</TableCell>
              <TableCell className="text-right"><Link href={`/learn/${a.courseSlug}/quiz/${a.quizSlug}?attempt=${a._id}`} className="text-sm font-medium text-teal hover:underline">Review</Link></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
