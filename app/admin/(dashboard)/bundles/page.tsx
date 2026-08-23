import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminListHeader, PublishedBadge, SourceBadge } from "@/components/admin/admin-shell";
import { DeleteButton } from "@/components/admin/delete-button";
import { formatInr } from "@/components/site/course-card";
import { deleteBundleAction } from "@/app/admin/actions";
import { bundles as seed } from "@/lib/data/lms";
import { BundleModel } from "@/lib/models/bundle";
import { loadForAdmin } from "@/lib/services/content";
import { toBundle } from "@/lib/services/lms";

export const metadata: Metadata = { title: "Course Bundles" };

export default async function Page({ searchParams }: PageProps<"/admin/bundles">) {
  const flash = await searchParams;
  const { rows, dbReady } = await loadForAdmin(seed, BundleModel, toBundle);
  return (
    <div>
      <AdminListHeader title="Course Bundles" subtitle={`${rows.length} total`} addHref="/admin/bundles/new" addLabel="Add Bundle" flash={flash} dbReady={dbReady} seedNote="Showing seeded bundles. Connect MongoDB to create bundles from here." />
      <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Bundle</TableHead><TableHead>Courses</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead><TableHead>Source</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.slug}>
                <TableCell><p className="font-medium text-navy">{row.title}</p><p className="text-xs text-muted-foreground">/bundles/{row.slug}</p></TableCell>
                <TableCell className="text-sm">{row.courseSlugs.length}</TableCell>
                <TableCell>{formatInr(row.discountPrice)} <span className="text-xs text-muted-foreground line-through">{formatInr(row.price)}</span></TableCell>
                <TableCell><PublishedBadge isPublished={row.isPublished} /></TableCell>
                <TableCell><SourceBadge source={row.source} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm"><Link href={`/bundles/${row.slug}`} target="_blank">View</Link></Button>
                    <Button asChild variant="outline" size="sm"><Link href={`/admin/bundles/${row.slug}`}>{row.source === "seed" ? "Override" : "Edit"}</Link></Button>
                    {row.source === "database" && <DeleteButton slug={row.slug} label="bundle" action={deleteBundleAction} />}
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
