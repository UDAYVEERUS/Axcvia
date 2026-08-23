import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { BlogForm } from "@/components/admin/blog-form";
import { getPostBySlug } from "@/lib/services/blog";
import { blogPosts as seed } from "@/lib/data/blog";

export const metadata: Metadata = { title: "Edit Blog Post" };

export default async function EditBlogPage({ params, searchParams }: PageProps<"/admin/blog/[slug]">) {
  const { slug } = await params;
  const { error } = await searchParams;
  const item = await getPostBySlug(slug);
  if (!item) notFound();
  const isSeed = seed.some((s) => s.slug === slug);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-navy">Edit Blog Post</h1>
        {isSeed && (
          <Badge variant="outline" className="text-muted-foreground">
            Seeded entry — saving creates a database override
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground">/blog · {slug}</p>
      <div className="mt-6 rounded-xl border bg-card p-6">
        <BlogForm post={item} originalSlug={slug} error={typeof error === "string" ? error : undefined} />
      </div>
    </div>
  );
}
