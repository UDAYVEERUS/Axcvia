import type { Metadata } from "next";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminListHeader, PublishedBadge, SourceBadge } from "@/components/admin/admin-shell";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteTestimonialAction } from "@/app/admin/actions";
import { testimonials as seed } from "@/lib/data/people";
import { TestimonialModel } from "@/lib/models/testimonial";
import { loadForAdmin } from "@/lib/services/content";
import { toTestimonial } from "@/lib/services/testimonials";

export const metadata: Metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage({ searchParams }: PageProps<"/admin/testimonials">) {
  const flash = await searchParams;
  const { rows, dbReady } = await loadForAdmin(seed, TestimonialModel, toTestimonial);

  return (
    <div>
      <AdminListHeader
        title="Testimonials"
        subtitle={`${rows.length} student reviews`}
        addHref="/admin/testimonials/new"
        addLabel="Add Testimonial"
        flash={flash}
        dbReady={dbReady}
        seedNote="Showing the seeded reviews. Connect MongoDB to add and edit testimonials from here."
      />
      <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Rating</TableHead>
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
                  <p className="text-xs text-muted-foreground">{row.role} at {row.company}</p>
                </TableCell>
                <TableCell className="text-sm">{row.courseTitle}</TableCell>
                <TableCell>
                  <span className="flex items-center gap-1 text-sm">
                    <Star className="size-3.5 fill-gold text-gold" aria-hidden /> {row.rating}
                  </span>
                </TableCell>
                <TableCell><PublishedBadge isPublished={row.isPublished} /></TableCell>
                <TableCell><SourceBadge source={row.source} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="outline" size="sm"><Link href={`/admin/testimonials/${row.slug}`}>{row.source === "seed" ? "Override" : "Edit"}</Link></Button>
                    {row.source === "database" && <DeleteButton slug={row.slug} label="testimonial" action={deleteTestimonialAction} />}
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
