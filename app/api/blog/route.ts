import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/services/blog";

// Public, read-only blog feed. Full content is omitted from the list; fetch
// /api/blog/[slug] for a single post.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const tag = searchParams.get("tag");
  const posts = (await getAllPosts())
    .filter((p) => (!category || p.category === category) && (!tag || p.tags.includes(tag)))
    .map((p) => {
      const { content, ...rest } = p;
      void content;
      return rest;
    });
  return NextResponse.json(
    { count: posts.length, posts },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}
