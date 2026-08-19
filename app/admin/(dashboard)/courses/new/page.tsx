import type { Metadata } from "next";
import { CourseForm } from "@/components/admin/course-form";

export const metadata: Metadata = { title: "Add Course" };

export default async function NewCoursePage({
  searchParams,
}: PageProps<"/admin/courses/new">) {
  const { error } = await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Add Course</h1>
      <p className="text-sm text-muted-foreground">
        The course appears on the website immediately after saving.
      </p>
      <div className="mt-6 rounded-xl border bg-card p-6">
        <CourseForm error={typeof error === "string" ? error : undefined} />
      </div>
    </div>
  );
}
