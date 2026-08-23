import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogListing } from "@/components/site/blog-listing";
import { CtaBanner } from "@/components/site/cta-banner";
import { blogPosts as staticPosts } from "@/lib/data/blog";
import { getBlogCategories, getPostsByCategorySlug } from "@/lib/services/blog";
import { slugify } from "@/lib/utils";

export function generateStaticParams() {
  return [...new Set(staticPosts.map((p) => slugify(p.category)))].map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/category/[category]">): Promise<Metadata> {
  const { category } = await params;
  const result = await getPostsByCategorySlug(category);
  if (!result) return {};
  return {
    title: `${result.category} — Axcvia Blog`,
    description: `${result.posts.length} articles in ${result.category} from Axcvia's trainers and placement team.`,
  };
}

export default async function BlogCategoryPage({ params }: PageProps<"/blog/category/[category]">) {
  const { category } = await params;
  const [result, categories] = await Promise.all([getPostsByCategorySlug(category), getBlogCategories()]);
  if (!result) notFound();
  return (
    <>
      <BlogListing
        posts={result.posts}
        categories={categories}
        activeCategory={result.category}
        eyebrow="Blog category"
        title={result.category}
        description={`${result.posts.length} article${result.posts.length === 1 ? "" : "s"} in ${result.category}.`}
      />
      <CtaBanner />
    </>
  );
}
