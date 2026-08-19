import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
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
import { DeleteCourseButton } from "@/components/admin/delete-course-button";
import { formatInr } from "@/components/site/course-card";
import { courses as staticCourses } from "@/lib/data/courses";
import { connectDb, isDbConfigured } from "@/lib/db";
import { CourseModel } from "@/lib/models/course";

export const metadata: Metadata = { title: "Courses" };

interface Row {
  title: string;
  slug: string;
  category: string;
  discountFee: number;
  featured: boolean;
  isPublished: boolean;
  source: "seed" | "database";
}

async function getRows(): Promise<{ rows: Row[]; dbReady: boolean }> {
  const seedRows: Row[] = staticCourses.map((c) => ({
    title: c.title,
    slug: c.slug,
    category: c.category,
    discountFee: c.discountFee,
    featured: c.featured,
    isPublished: true,
    source: "seed",
  }));
  if (!isDbConfigured()) return { rows: seedRows, dbReady: false };
  try {
    await connectDb();
    const docs = await CourseModel.find().sort({ createdAt: -1 }).lean();
    const bySlug = new Map(seedRows.map((r) => [r.slug, r]));
    for (const doc of docs) {
      bySlug.set(doc.slug as string, {
        title: doc.title as string,
        slug: doc.slug as string,
        category: doc.category as string,
        discountFee: (doc.discountFee as number) ?? 0,
        featured: Boolean(doc.featured),
        isPublished: doc.isPublished !== false,
        source: "database",
      });
    }
    return { rows: [...bySlug.values()], dbReady: true };
  } catch {
    return { rows: seedRows, dbReady: false };
  }
}

export default async function AdminCoursesPage({ searchParams }: PageProps<"/admin/courses">) {
  const { error, saved, deleted } = await searchParams;
  const { rows, dbReady } = await getRows();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-navy">Courses</h1>
          <p className="text-sm text-muted-foreground">
            {rows.length} courses live on the website
          </p>
        </div>
        <Button asChild className="bg-teal text-white hover:bg-teal/90">
          <Link href="/admin/courses/new">
            <Plus className="size-4" aria-hidden /> Add Course
          </Link>
        </Button>
      </div>

      {saved && (
        <p className="mt-4 rounded-lg border border-teal/30 bg-teal/5 p-3 text-sm text-teal">
          Course saved. Public pages have been refreshed.
        </p>
      )}
      {deleted && (
        <p className="mt-4 rounded-lg border border-teal/30 bg-teal/5 p-3 text-sm text-teal">
          Course deleted.
        </p>
      )}
      {error === "nodb" && (
        <p className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          MongoDB is not connected — courses can&apos;t be saved yet. Set MONGODB_URI in your
          environment first.
        </p>
      )}
      {!dbReady && !error && (
        <p className="mt-4 rounded-lg border bg-card p-3 text-sm text-muted-foreground">
          Showing the static seed catalog. Connect MongoDB to add and edit courses from here —
          seeded courses can be overridden by saving a course with the same slug.
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Course</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Fee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Source</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.slug}>
                <TableCell>
                  <p className="font-medium text-navy">{row.title}</p>
                  <p className="text-xs text-muted-foreground">/courses/{row.slug}</p>
                </TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{formatInr(row.discountFee)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {row.featured && (
                      <Badge className="bg-gold/15 text-gold-deep hover:bg-gold/15">Featured</Badge>
                    )}
                    <Badge
                      variant="secondary"
                      className={row.isPublished ? "bg-teal/10 text-teal" : "text-muted-foreground"}
                    >
                      {row.isPublished ? "Published" : "Hidden"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-muted-foreground">
                    {row.source === "seed" ? "Static seed" : "Dashboard"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/courses/${row.slug}`} target="_blank">
                        View
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/courses/${row.slug}`}>
                        {row.source === "seed" ? "Override" : "Edit"}
                      </Link>
                    </Button>
                    {row.source === "database" && <DeleteCourseButton slug={row.slug} />}
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
