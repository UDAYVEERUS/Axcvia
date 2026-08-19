import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateLeadStatusAction } from "@/app/admin/actions";
import { connectDb, isDbConfigured } from "@/lib/db";
import { LeadModel } from "@/lib/models/lead";

export const metadata: Metadata = { title: "Leads" };

interface LeadRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  courseInterest: string;
  message: string;
  source: string;
  status: string;
  createdAt: string;
}

const statusStyle: Record<string, string> = {
  new: "bg-gold/15 text-gold-deep",
  contacted: "bg-teal/10 text-teal",
  converted: "bg-teal/20 text-teal",
  lost: "bg-muted text-muted-foreground",
};

async function getLeads(): Promise<{ leads: LeadRow[]; dbReady: boolean }> {
  if (!isDbConfigured()) return { leads: [], dbReady: false };
  try {
    await connectDb();
    const docs = await LeadModel.find().sort({ createdAt: -1 }).limit(200).lean();
    return {
      dbReady: true,
      /* eslint-disable @typescript-eslint/no-explicit-any */
      leads: docs.map((d: any) => ({
        id: String(d._id),
        name: d.name ?? "",
        phone: d.phone ?? "",
        email: d.email ?? "",
        courseInterest: d.courseInterest ?? "",
        message: d.message ?? "",
        source: d.source ?? "",
        status: d.status ?? "new",
        createdAt: d.createdAt ? new Date(d.createdAt).toLocaleString("en-IN") : "",
      })),
    };
  } catch {
    return { leads: [], dbReady: false };
  }
}

export default async function AdminLeadsPage() {
  const { leads, dbReady } = await getLeads();

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Leads & Enquiries</h1>
      <p className="text-sm text-muted-foreground">
        Enquiries from all website forms, newest first.
      </p>

      {!dbReady ? (
        <p className="mt-6 rounded-lg border bg-card p-4 text-sm text-muted-foreground">
          Connect MongoDB (set MONGODB_URI) to start collecting enquiries here. In local
          development without a database, submitted leads are logged to the server console.
        </p>
      ) : leads.length === 0 ? (
        <p className="mt-6 rounded-lg border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
          No enquiries yet. Leads from the website forms will appear here.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Contact</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Received</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell>
                    <p className="font-medium text-navy">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">
                      <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                      {lead.email && (
                        <>
                          {" · "}
                          <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                        </>
                      )}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{lead.courseInterest || "—"}</p>
                    <p className="text-xs text-muted-foreground">via {lead.source}</p>
                  </TableCell>
                  <TableCell className="max-w-56">
                    <p className="truncate text-sm text-muted-foreground" title={lead.message}>
                      {lead.message || "—"}
                    </p>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{lead.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge className={statusStyle[lead.status] ?? ""} variant="secondary">
                        {lead.status}
                      </Badge>
                      <form action={updateLeadStatusAction} className="flex items-center gap-1">
                        <input type="hidden" name="id" value={lead.id} />
                        <select
                          name="status"
                          defaultValue={lead.status}
                          className="border-input h-7 rounded-md border bg-transparent px-1.5 text-xs outline-none"
                          aria-label={`Update status for ${lead.name}`}
                        >
                          <option value="new">new</option>
                          <option value="contacted">contacted</option>
                          <option value="converted">converted</option>
                          <option value="lost">lost</option>
                        </select>
                        <Button type="submit" variant="outline" size="xs">
                          Set
                        </Button>
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
