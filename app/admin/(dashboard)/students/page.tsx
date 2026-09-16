import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { requireAdmin } from "@/lib/admin/auth";
import { connectDb, isDbConfigured } from "@/lib/db";
import { EnrollmentModel } from "@/lib/models/enrollment";
import { StudentModel } from "@/lib/models/student";

export const metadata: Metadata = { title: "Users" };

export default async function StudentsPage() {
  await requireAdmin();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  let students: any[] = [];
  const counts = new Map<string, number>();
  let dbReady = false;
  if (isDbConfigured()) {
    try {
      await connectDb();
      students = await StudentModel.find().select("name email phone role banned createdAt").sort({ createdAt: -1 }).limit(500).lean();
      const agg: any[] = await EnrollmentModel.aggregate([{ $match: { userId: { $ne: null }, status: { $in: ["paid", "confirmed"] } } }, { $group: { _id: "$userId", n: { $sum: 1 } } }]);
      for (const a of agg) counts.set(String(a._id), a.n);
      dbReady = true;
    } catch {}
  }
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Users</h1>
      <p className="text-sm text-muted-foreground">{students.length} accounts. Open a user to enroll them manually (offline payments), revoke access, or change their role.</p>
      {!dbReady ? (
        <p className="mt-6 rounded-lg border bg-card p-4 text-sm text-muted-foreground">Connect MongoDB to see users.</p>
      ) : students.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">No accounts yet. An account is created the first time someone signs in with Google.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Phone</TableHead><TableHead>Active courses</TableHead><TableHead>Joined</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {students.map((s) => (
                <TableRow key={String(s._id)}>
                  <TableCell><p className="font-medium text-navy">{s.name}</p><p className="text-xs text-muted-foreground">{s.email}</p></TableCell>
                  <TableCell>
                    {s.role === "admin" ? <Badge className="bg-navy text-white">Admin</Badge> : <Badge variant="secondary">Student</Badge>}
                    {s.banned && <Badge variant="destructive" className="ml-1">Banned</Badge>}
                  </TableCell>
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
