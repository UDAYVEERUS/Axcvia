import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatInr } from "@/components/site/course-card";
import { updateEnrollmentStatusAction } from "@/app/admin/actions";
import { connectDb, isDbConfigured } from "@/lib/db";
import { EnrollmentModel } from "@/lib/models/enrollment";

export const metadata: Metadata = { title: "Enrollments" };

interface Row {
  id: string;
  name: string;
  phone: string;
  email: string;
  courseTitle: string;
  courseSlug: string;
  format: string;
  amount: number;
  message: string;
  status: string;
  createdAt: string;
}

const statusStyle: Record<string, string> = {
  pending: "bg-gold/15 text-gold-deep",
  confirmed: "bg-teal/10 text-teal",
  paid: "bg-teal/20 text-teal",
  cancelled: "bg-muted text-muted-foreground",
};

async function getRows(): Promise<{ rows: Row[]; dbReady: boolean }> {
  if (!isDbConfigured()) return { rows: [], dbReady: false };
  try {
    await connectDb();
    const docs = await EnrollmentModel.find().sort({ createdAt: -1 }).limit(300).lean();
    return {
      dbReady: true,
      /* eslint-disable @typescript-eslint/no-explicit-any */
      rows: docs.map((d: any) => ({
        id: String(d._id),
        name: d.name ?? "",
        phone: d.phone ?? "",
        email: d.email ?? "",
        courseTitle: d.courseTitle ?? d.courseSlug ?? "",
        courseSlug: d.courseSlug ?? "",
        format: d.format ?? "",
        amount: d.amount ?? 0,
        message: d.message ?? "",
        status: d.status ?? "pending",
        createdAt: d.createdAt ? new Date(d.createdAt).toLocaleString("en-IN") : "",
      })),
    };
  } catch {
    return { rows: [], dbReady: false };
  }
}

export default async function AdminEnrollmentsPage() {
  const { rows, dbReady } = await getRows();
  const revenue = rows.filter((r) => r.status === "paid").reduce((sum, r) => sum + r.amount, 0);
  const pipeline = rows.filter((r) => r.status === "pending" || r.status === "confirmed").reduce((sum, r) => sum + r.amount, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Enrollments</h1>
      <p className="text-sm text-muted-foreground">
        Seat reservations from course enroll pages. Move each one through pending → confirmed → paid.
      </p>

      {dbReady && rows.length > 0 && (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat label="Total enrollments" value={String(rows.length)} />
          <Stat label="Collected (paid)" value={formatInr(revenue)} />
          <Stat label="In pipeline" value={formatInr(pipeline)} />
        </div>
      )}

      {!dbReady ? (
        <p className="mt-6 rounded-lg border bg-card p-4 text-sm text-muted-foreground">
          Connect MongoDB (set MONGODB_URI) to start collecting enrollments here. In local
          development without a database, submitted enrollments are logged to the server console.
        </p>
      ) : rows.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
          No enrollments yet. Seat reservations from /courses/…/enroll will appear here.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Note</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <p className="font-medium text-navy">{row.name}</p>
                    <p className="text-xs text-muted-foreground">
                      <a href={`tel:${row.phone}`} className="hover:underline">{row.phone}</a>
                      {row.email && <> · <a href={`mailto:${row.email}`} className="hover:underline">{row.email}</a></>}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{row.courseTitle}</p>
                    <p className="text-xs text-muted-foreground">{row.format}</p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium">{formatInr(row.amount)}</TableCell>
                  <TableCell className="max-w-56">
                    <p className="truncate text-sm text-muted-foreground" title={row.message}>{row.message || "—"}</p>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{row.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={statusStyle[row.status] ?? ""} variant="secondary">{row.status}</Badge>
                      <form action={updateEnrollmentStatusAction} className="flex items-center gap-1">
                        <input type="hidden" name="id" value={row.id} />
                        <select
                          name="status"
                          defaultValue={row.status}
                          className="border-input h-7 rounded-md border bg-transparent px-1.5 text-xs outline-none"
                          aria-label={`Update status for ${row.name}`}
                        >
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="paid">paid</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                        <Button type="submit" variant="outline" size="xs">Set</Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-navy">{value}</p>
    </div>
  );
}
