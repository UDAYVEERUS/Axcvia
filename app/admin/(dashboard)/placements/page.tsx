import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminListHeader, PublishedBadge, SourceBadge } from "@/components/admin/admin-shell";
import { DeleteButton } from "@/components/admin/delete-button";
import { deletePlacementAction } from "@/app/admin/actions";
import { placementStories as seed } from "@/lib/data/people";
import { PlacementModel } from "@/lib/models/placement";
import { loadForAdmin } from "@/lib/services/content";
import { toPlacement } from "@/lib/services/placements";

export const metadata: Metadata = { title: "Placements" };

export default async function AdminPlacementsPage({ searchParams }: PageProps<"/admin/placements">) {
  const flash = await searchParams;
  const { rows, dbReady } = await loadForAdmin(seed, PlacementModel, toPlacement);

  return (
    <div>
      <AdminListHeader
        title="Placements"
        subtitle={`${rows.length} success stories`}
        addHref="/admin/placements/new"
        addLabel="Add Placement"
        flash={flash}
        dbReady={dbReady}
        seedNote="Showing the seeded placement stories. Connect MongoDB to add and edit them from here."
      />
      <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Placed at</TableHead>
              <TableHead>Package</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.slug}>
                <TableCell>
                  <p className="font-medium text-navy">{row.studentName}</p>
                  <p className="text-xs text-muted-foreground">{row.background} · {row.courseTitle}</p>
                </TableCell>
                <TableCell className="text-sm">{row.role} @ {row.company}</TableCell>
                <TableCell>₹{row.packageLpa} LPA</TableCell>
                <TableCell>{row.year}</TableCell>
                <TableCell><PublishedBadge isPublished={row.isPublished} /></TableCell>
                <TableCell><SourceBadge source={row.source} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="outline" size="sm"><Link href={`/admin/placements/${row.slug}`}>{row.source === "seed" ? "Override" : "Edit"}</Link></Button>
                    {row.source === "database" && <DeleteButton slug={row.slug} label="placement" action={deletePlacementAction} />}
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
