import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogListing } from "@/components/site/blog-listing";
import { CtaBanner } from "@/components/site/cta-banner";
import { blogPosts as staticPosts } from "@/lib/data/blog";
import { getBlogCategories, getPostsByTag } from "@/lib/services/blog";
import { slugify } from "@/lib/utils";

export function generateStaticParams() {
  return [...new Set(staticPosts.flatMap((p) => p.tags.map(slugify)))].map((tag) => ({ tag }));
}

export async function generateMetadata({ params }: PageProps<"/blog/tag/[tag]">): Promise<Metadata> {
  const { tag } = await params;
  const result = await getPostsByTag(tag);
  if (!result) return {};
  return {
    title: `#${result.tag} — Axcvia Blog`,
    description: `Articles tagged ${result.tag} on the Axcvia blog.`,
  };
}

export default async function BlogTagPage({ params }: PageProps<"/blog/tag/[tag]">) {
  const { tag } = await params;
  const [result, categories] = await Promise.all([getPostsByTag(tag), getBlogCategories()]);
  if (!result) notFound();
  return (
    <>
      <BlogListing
        posts={result.posts}
        categories={categories}
        eyebrow="Tagged"
        title={`#${result.tag}`}
        description={`${result.posts.length} article${result.posts.length === 1 ? "" : "s"} tagged ${result.tag}.`}
      />
      <CtaBanner />
    </>
  );
}
