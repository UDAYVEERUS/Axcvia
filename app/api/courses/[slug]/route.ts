import { NextResponse } from "next/server";
import { getCourseBySlug } from "@/lib/services/courses";

export async function GET(_request: Request, ctx: RouteContext<"/api/courses/[slug]">) {
  const { slug } = await ctx.params;
  const course = await getCourseBySlug(slug);
  if (!course) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(course, {
    headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" },
  });
}
