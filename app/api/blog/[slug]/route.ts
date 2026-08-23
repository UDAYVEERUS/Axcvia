import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/services/blog";

export async function GET(_request: Request, ctx: RouteContext<"/api/blog/[slug]">) {
  const { slug } = await ctx.params;
  const post = await getPostBySlug(slug);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
