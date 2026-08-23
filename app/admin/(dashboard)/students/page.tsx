import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { connectDb, isDbConfigured } from "@/lib/db";
import { EnrollmentModel } from "@/lib/models/enrollment";
import { StudentModel } from "@/lib/models/student";

export const metadata: Metadata = { title: "Students" };

export default async function StudentsPage() {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let students: any[] = [];
  const counts = new Map<string, number>();
  let dbReady = false;
  if (isDbConfigured()) {
    try {
      await connectDb();
      students = await StudentModel.find().sort({ createdAt: -1 }).limit(500).lean();
      const agg: any[] = await EnrollmentModel.aggregate([{ $match: { userId: { $ne: null }, status: { $in: ["paid", "confirmed"] } } }, { $group: { _id: "$userId", n: { $sum: 1 } } }]);
      for (const a of agg) counts.set(String(a._id), a.n);
      dbReady = true;
    } catch {}
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Students</h1>
      <p className="text-sm text-muted-foreground">{students.length} registered accounts. Open a student to enroll them manually (offline payments) or revoke access.</p>
      {!dbReady ? (
        <p className="mt-6 rounded-lg border bg-card p-4 text-sm text-muted-foreground">Connect MongoDB to see students.</p>
      ) : students.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">No student accounts yet. Students register at /register.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Phone</TableHead><TableHead>Active courses</TableHead><TableHead>Joined</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow key={String(s._id)}>
                  <TableCell><p className="font-medium text-navy">{s.name}</p><p className="text-xs text-muted-foreground">{s.email}</p></TableCell>
                  <TableCell className="text-sm">{s.phone || "—"}</TableCell>
                  <TableCell>{counts.get(String(s._id)) ?? 0}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleDateString("en-IN")}</TableCell>
                  <TableCell className="text-right"><Button asChild variant="outline" size="sm"><Link href={`/admin/students/${s._id}`}>Manage</Link></Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
