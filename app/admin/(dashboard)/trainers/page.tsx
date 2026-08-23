import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminListHeader, PublishedBadge, SourceBadge } from "@/components/admin/admin-shell";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteTrainerAction } from "@/app/admin/actions";
import { trainers as seed } from "@/lib/data/people";
import { TrainerModel } from "@/lib/models/trainer";
import { loadForAdmin } from "@/lib/services/content";
import { toTrainer } from "@/lib/services/trainers";

export const metadata: Metadata = { title: "Trainers" };

export default async function AdminTrainersPage({ searchParams }: PageProps<"/admin/trainers">) {
  const flash = await searchParams;
  const { rows, dbReady } = await loadForAdmin(seed, TrainerModel, toTrainer);

  return (
    <div>
      <AdminListHeader
        title="Trainers"
        subtitle={`${rows.length} trainers`}
        addHref="/admin/trainers/new"
        addLabel="Add Trainer"
        flash={flash}
        dbReady={dbReady}
        seedNote="Showing the seeded faculty. Connect MongoDB to add and edit trainers from here."
      />
      <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trainer</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Expertise</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.slug}>
                <TableCell>
                  <p className="font-medium text-navy">{row.name}</p>
                  <p className="text-xs text-muted-foreground">{row.role}</p>
                </TableCell>
                <TableCell>{row.experienceYears} yrs</TableCell>
                <TableCell className="max-w-60 truncate text-sm text-muted-foreground">{row.expertise.join(", ")}</TableCell>
                <TableCell><PublishedBadge isPublished={row.isPublished} /></TableCell>
                <TableCell><SourceBadge source={row.source} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm"><Link href={`/trainers/${row.slug}`} target="_blank">View</Link></Button>
                    <Button asChild variant="outline" size="sm"><Link href={`/admin/trainers/${row.slug}`}>{row.source === "seed" ? "Override" : "Edit"}</Link></Button>
                    {row.source === "database" && <DeleteButton slug={row.slug} label="trainer" action={deleteTrainerAction} />}
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
