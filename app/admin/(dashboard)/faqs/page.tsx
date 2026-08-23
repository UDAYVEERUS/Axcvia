import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminListHeader, PublishedBadge, SourceBadge } from "@/components/admin/admin-shell";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteFaqAction } from "@/app/admin/actions";
import { faqs as seed } from "@/lib/data/people";
import { FaqModel } from "@/lib/models/faq";
import { loadForAdmin } from "@/lib/services/content";
import { toFaq } from "@/lib/services/faqs";

export const metadata: Metadata = { title: "FAQs" };

export default async function AdminFaqsPage({ searchParams }: PageProps<"/admin/faqs">) {
  const flash = await searchParams;
  const { rows, dbReady } = await loadForAdmin(seed, FaqModel, toFaq);

  return (
    <div>
      <AdminListHeader
        title="FAQs"
        subtitle={`${rows.length} questions`}
        addHref="/admin/faqs/new"
        addLabel="Add FAQ"
        flash={flash}
        dbReady={dbReady}
        seedNote="Showing the seeded FAQs. Connect MongoDB to add and edit questions from here."
      />
      <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.slug}>
                <TableCell>
                  <p className="font-medium text-navy">{row.question}</p>
                  <p className="line-clamp-1 max-w-xl text-xs text-muted-foreground">{row.answer}</p>
                </TableCell>
                <TableCell><Badge variant="secondary">{row.category}</Badge></TableCell>
                <TableCell><PublishedBadge isPublished={row.isPublished} /></TableCell>
                <TableCell><SourceBadge source={row.source} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="outline" size="sm"><Link href={`/admin/faqs/${row.slug}`}>{row.source === "seed" ? "Override" : "Edit"}</Link></Button>
                    {row.source === "database" && <DeleteButton slug={row.slug} label="FAQ" action={deleteFaqAction} />}
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
