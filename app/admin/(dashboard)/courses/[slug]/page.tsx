import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { CourseForm } from "@/components/admin/course-form";
import { getCourseBySlug } from "@/lib/services/courses";
import { courses as staticCourses } from "@/lib/data/courses";

export const metadata: Metadata = { title: "Edit Course" };

export default async function EditCoursePage({
  params,
  searchParams,
}: PageProps<"/admin/courses/[slug]">) {
  const { slug } = await params;
  const { error } = await searchParams;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  const isSeed = staticCourses.some((c) => c.slug === slug);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-navy">Edit Course</h1>
        {isSeed && (
          <Badge variant="outline" className="text-muted-foreground">
            Seeded course — saving creates a database override
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground">/courses/{slug}</p>
      <div className="mt-6 rounded-xl border bg-card p-6">
        <CourseForm
          course={course}
          originalSlug={slug}
          error={typeof error === "string" ? error : undefined}
        />
      </div>
    </div>
  );
}
