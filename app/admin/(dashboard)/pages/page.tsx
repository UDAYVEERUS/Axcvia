import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminListHeader, PublishedBadge, SourceBadge } from "@/components/admin/admin-shell";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteLandingPageAction } from "@/app/admin/actions";
import { landingPages as seed } from "@/lib/data/lms";
import { LandingPageModel } from "@/lib/models/landing-page";
import { loadForAdmin } from "@/lib/services/content";
import { toLandingPage } from "@/lib/services/lms";

export const metadata: Metadata = { title: "Landing Pages" };

export default async function Page({ searchParams }: PageProps<"/admin/pages">) {
  const flash = await searchParams;
  const { rows, dbReady } = await loadForAdmin(seed, LandingPageModel, toLandingPage);
  return (
    <div>
      <AdminListHeader title="Landing Pages" subtitle={`${rows.length} total`} addHref="/admin/pages/new" addLabel="Add Page" flash={flash} dbReady={dbReady} seedNote="Showing seeded landing pages. Connect MongoDB to create pages (e.g. /a320-classes) from here." />
      <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader><TableRow><TableHead>Page</TableHead><TableHead>Nav</TableHead><TableHead>Content</TableHead><TableHead>Status</TableHead><TableHead>Source</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.slug}>
                <TableCell><p className="font-medium text-navy">{row.title}</p><p className="text-xs text-muted-foreground">/{row.slug}</p></TableCell>
                <TableCell className="text-sm">{row.showInNav ? `${row.navGroup || "More"} menu` : "—"}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{row.sections.length} sections · {row.courseSlugs.length || (row.courseTag ? "tag" : 0)} courses · {row.faqs.length} FAQs</TableCell>
                <TableCell><PublishedBadge isPublished={row.isPublished} /></TableCell>
                <TableCell><SourceBadge source={row.source} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm"><Link href={`/${row.slug}`} target="_blank">View</Link></Button>
                    <Button asChild variant="outline" size="sm"><Link href={`/admin/pages/${row.slug}`}>{row.source === "seed" ? "Override" : "Edit"}</Link></Button>
                    {row.source === "database" && <DeleteButton slug={row.slug} label="page" action={deleteLandingPageAction} />}
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
