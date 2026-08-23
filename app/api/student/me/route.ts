import { NextResponse } from "next/server";
import { getCurrentStudent } from "@/lib/student/auth";
import { getAccess } from "@/lib/student/enrollments";

// Lightweight session probe for client components (navbar, purchase card),
// so public pages can stay statically prerendered.
export async function GET(request: Request) {
  const student = await getCurrentStudent();
  const course = new URL(request.url).searchParams.get("course");
  if (!student) return NextResponse.json({ student: null, enrolled: false, wishlisted: false }, { headers: { "Cache-Control": "no-store" } });
  const enrolled = course ? Boolean(await getAccess(student.id, course)) : false;
  return NextResponse.json(
    { student: { name: student.name }, enrolled, wishlisted: course ? student.wishlist.includes(course) : false },
    { headers: { "Cache-Control": "no-store" } }
  );
}
