import { NextResponse } from "next/server";
import { getAllCourses } from "@/lib/services/courses";

// Public, read-only course catalog (for partners / a future mobile app).
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const courses = await getAllCourses();
  const list = category ? courses.filter((c) => c.category === category) : courses;
  return NextResponse.json(
    { count: list.length, courses: list },
    { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
  );
}
