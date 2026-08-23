import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Flash, selectCls } from "@/components/admin/admin-shell";
import { manualEnrollAction, revokeEnrollmentAction } from "@/app/admin/actions";
import { connectDb, isDbConfigured } from "@/lib/db";
import { QuizAttemptModel } from "@/lib/models/quiz-attempt";
import { StudentModel } from "@/lib/models/student";
import { getCourseOptions } from "@/lib/services/courses";
import { getStudentEnrollments, isActive } from "@/lib/student/enrollments";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Student" };

export default async function StudentPage({ params, searchParams }: PageProps<"/admin/students/[id]">) {
  const { id } = await params;
  const { saved, error } = await searchParams;
  if (!isDbConfigured()) notFound();
  await connectDb();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const s: any = await StudentModel.findById(id).lean().catch(() => null);
  if (!s) notFound();
  const [enrollments, courses, attempts] = await Promise.all([
    getStudentEnrollments(id),
    getCourseOptions(),
    QuizAttemptModel.find({ userId: id }).sort({ createdAt: -1 }).limit(50).lean() as Promise<any[]>,
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">{s.name}</h1>
      <p className="text-sm text-muted-foreground">{s.email} · {s.phone || "no phone"} · joined {formatDate(new Date(s.createdAt).toISOString())}</p>
      {saved && <Flash tone="ok">Saved.</Flash>}
      {error === "missing" && <Flash tone="error">Pick a course.</Flash>}

      <form action={manualEnrollAction} className="mt-6 grid gap-4 rounded-xl border bg-card p-5 sm:grid-cols-[1fr_160px_auto]">
        <input type="hidden" name="userId" value={id} />
        <div className="space-y-2">
          <Label htmlFor="courseSlug">Enroll manually (offline payment / complimentary)</Label>
          <select id="courseSlug" name="courseSlug" required className={selectCls}>
            <option value="">— Select course —</option>
            {courses.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
          </select>
        </div>
        <div className="space-y-2"><Label htmlFor="validityDays">Validity days (0 = course default)</Label><Input id="validityDays" name="validityDays" type="number" min="0" defaultValue={0} /></div>
        <div className="flex items-end"><Button type="submit" className="bg-teal text-white hover:bg-teal/90">Grant access</Button></div>
      </form>

      <h2 className="mt-8 font-semibold text-navy">Enrollments</h2>
      <div className="mt-2 overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Course</TableHead><TableHead>Status</TableHead><TableHead>Progress</TableHead><TableHead>Expires</TableHead><TableHead /></TableRow></TableHeader>
          <TableBody>
            {enrollments.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="font-medium text-navy">{e.courseTitle}</TableCell>
                <TableCell><Badge variant="secondary" className={isActive(e) ? "bg-teal/10 text-teal" : "text-muted-foreground"}>{isActive(e) ? "active" : e.status}</Badge></TableCell>
                <TableCell className="text-sm">{e.completedLessons.length} lessons{e.certificateIssuedAt && " · certified"}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{e.expiresAt ? formatDate(e.expiresAt) : "lifetime"}</TableCell>
                <TableCell className="text-right">
                  {isActive(e) && (
                    <form action={revokeEnrollmentAction}><input type="hidden" name="id" value={e.id} /><input type="hidden" name="userId" value={id} /><Button type="submit" variant="ghost" size="sm" className="text-destructive">Revoke</Button></form>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {enrollments.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-sm text-muted-foreground">No enrollments.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      {attempts.length > 0 && (
        <>
          <h2 className="mt-8 font-semibold text-navy">Recent test attempts</h2>
          <div className="mt-2 overflow-x-auto rounded-xl border bg-card">
            <Table>
              <TableHeader><TableRow><TableHead>Test</TableHead><TableHead>Score</TableHead><TableHead>Result</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
              <TableBody>
                {attempts.map((a) => (
                  <TableRow key={String(a._id)}><TableCell>{a.quizTitle}</TableCell><TableCell>{a.score}/{a.total} ({a.percent}%)</TableCell><TableCell>{a.passed ? "Pass" : "Fail"}</TableCell><TableCell className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString("en-IN")}</TableCell></TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  );
}
