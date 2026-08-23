import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AdminListHeader, PublishedBadge, SourceBadge } from "@/components/admin/admin-shell";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteBlogPostAction } from "@/app/admin/actions";
import { blogPosts as seed } from "@/lib/data/blog";
import { BlogPostModel } from "@/lib/models/blog-post";
import { toBlogPost } from "@/lib/services/blog";
import { loadForAdmin } from "@/lib/services/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Blog" };

export default async function AdminBlogPage({ searchParams }: PageProps<"/admin/blog">) {
  const flash = await searchParams;
  const { rows, dbReady } = await loadForAdmin(seed, BlogPostModel, toBlogPost);
  rows.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <div>
      <AdminListHeader
        title="Blog"
        subtitle={`${rows.length} posts`}
        addHref="/admin/blog/new"
        addLabel="Write Post"
        flash={flash}
        dbReady={dbReady}
        seedNote="Showing the seeded posts. Connect MongoDB to write and edit posts from here."
      />
      <div className="mt-6 overflow-x-auto rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Post</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Published</TableHead>
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
                  <p className="text-xs text-muted-foreground">/blog/{row.slug} · {row.authorName}</p>
                </TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell className="whitespace-nowrap">{formatDate(row.publishedAt)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {row.featured && <Badge className="bg-gold/15 text-gold-deep hover:bg-gold/15">Featured</Badge>}
                    <PublishedBadge isPublished={row.isPublished} />
                  </div>
                </TableCell>
                <TableCell><SourceBadge source={row.source} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm"><Link href={`/blog/${row.slug}`} target="_blank">View</Link></Button>
                    <Button asChild variant="outline" size="sm"><Link href={`/admin/blog/${row.slug}`}>{row.source === "seed" ? "Override" : "Edit"}</Link></Button>
                    {row.source === "database" && <DeleteButton slug={row.slug} label="post" action={deleteBlogPostAction} />}
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
