import type { BlogPost } from "@/lib/types";
import { BLOG_CATEGORIES } from "@/lib/types";
import { blogPosts as staticPosts } from "@/lib/data/blog";
import { BlogPostModel } from "@/lib/models/blog-post";
import { loadMerged, strings } from "@/lib/services/content";
import { slugify } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function toBlogPost(doc: any): BlogPost {
  return {
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt ?? "",
    content: doc.content ?? "",
    category: doc.category ?? "Tutorials",
    tags: strings(doc.tags),
    authorSlug: doc.authorSlug ?? "",
    authorName: doc.authorName ?? "",
    coverImage: doc.coverImage ?? "",
    publishedAt: doc.publishedAt ? new Date(doc.publishedAt).toISOString() : new Date().toISOString(),
    readingMinutes: doc.readingMinutes ?? 5,
    relatedCourseSlugs: strings(doc.relatedCourseSlugs),
    featured: Boolean(doc.featured),
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await loadMerged(staticPosts, BlogPostModel, toBlogPost);
  return posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getPostBySlug(slug: string) {
  return (await getAllPosts()).find((p) => p.slug === slug);
}

export async function getBlogCategories(): Promise<string[]> {
  const posts = await getAllPosts();
  const known = BLOG_CATEGORIES.filter((c) => posts.some((p) => p.category === c));
  const extra = [...new Set(posts.map((p) => p.category))].filter(
    (c) => !(BLOG_CATEGORIES as readonly string[]).includes(c)
  );
  return [...known, ...extra];
}

export async function getPostsByCategorySlug(categorySlug: string) {
  const posts = await getAllPosts();
  const category = [...new Set(posts.map((p) => p.category))].find(
    (c) => slugify(c) === categorySlug
  );
  if (!category) return null;
  return { category, posts: posts.filter((p) => p.category === category) };
}

export async function getPostsByTag(tagSlug: string) {
  const posts = await getAllPosts();
  const tag = [...new Set(posts.flatMap((p) => p.tags))].find((t) => slugify(t) === tagSlug);
  if (!tag) return null;
  return { tag, posts: posts.filter((p) => p.tags.includes(tag)) };
}

export async function getRelatedPosts(slug: string, limit = 3) {
  const posts = await getAllPosts();
  const post = posts.find((p) => p.slug === slug);
  if (!post) return [];
  return posts
    .filter((p) => p.slug !== slug)
    .sort(
      (a, b) =>
        Number(b.category === post.category) +
        b.tags.filter((t) => post.tags.includes(t)).length -
        (Number(a.category === post.category) + a.tags.filter((t) => post.tags.includes(t)).length)
    )
    .slice(0, limit);
}

/** Posts that promote a given course — shown on the course detail page. */
export async function getPostsForCourse(courseSlug: string, limit = 3) {
  const posts = await getAllPosts();
  return posts.filter((p) => p.relatedCourseSlugs.includes(courseSlug)).slice(0, limit);
}
