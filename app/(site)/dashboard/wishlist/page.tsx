import type { Metadata } from "next";
import { CourseCard } from "@/components/site/course-card";
import { getAllCourses } from "@/lib/services/courses";
import { getCurrentStudent } from "@/lib/student/auth";

export const metadata: Metadata = { title: "Wishlist", robots: { index: false } };

export default async function WishlistPage() {
  const student = (await getCurrentStudent())!;
  const courses = (await getAllCourses()).filter((c) => student.wishlist.includes(c.slug));
  if (courses.length === 0) return <p className="rounded-xl border border-dashed bg-card p-10 text-center text-sm text-muted-foreground">Your wishlist is empty. Tap the heart on any course to save it here.</p>;
  return <div className="grid gap-6 sm:grid-cols-2">{courses.map((c) => <CourseCard key={c.slug} course={c} />)}</div>;
}
