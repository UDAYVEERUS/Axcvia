import type { Metadata } from "next";
import { BlogForm } from "@/components/admin/blog-form";

export const metadata: Metadata = { title: "Add Blog Post" };

export default async function NewBlogPage({ searchParams }: PageProps<"/admin/blog/new">) {
  const { error } = await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Add Blog Post</h1>
      <p className="text-sm text-muted-foreground">Appears on the website immediately after saving.</p>
      <div className="mt-6 rounded-xl border bg-card p-6">
        <BlogForm error={typeof error === "string" ? error : undefined} />
      </div>
    </div>
  );
}
