import type { Course } from "@/lib/types";
import { COURSE_CATEGORIES } from "@/lib/types";
import { courses as staticCourses } from "@/lib/data/courses";
import { connectDb, isDbConfigured } from "@/lib/db";
import { CourseModel } from "@/lib/models/course";

// The public site runs on the static seed until courses are added from the
// admin dashboard. DB courses are merged over the seed by slug, so editing a
// seeded slug in the dashboard overrides it. Any DB failure falls back to the
// seed so the site never breaks.

/* eslint-disable @typescript-eslint/no-explicit-any */
function toCourse(doc: any): Course {
  return {
    title: doc.title,
    slug: doc.slug,
    category: doc.category,
    tagline: doc.tagline ?? "",
    description: doc.description ?? "",
    syllabus: (doc.syllabus ?? []).map((m: any) => ({
      title: m.title,
      topics: m.topics ?? [],
    })),
    duration: doc.duration ?? "",
    mode: doc.mode ?? "hybrid",
    level: doc.level ?? "Beginner",
    fee: doc.fee ?? 0,
    discountFee: doc.discountFee ?? 0,
    trainerSlug: doc.trainerSlug ?? "",
    prerequisites: doc.prerequisites ?? [],
    outcomes: doc.outcomes ?? [],
    formats: (doc.formats ?? []) as Course["formats"],
    rating: doc.rating ?? 4.8,
    reviewCount: doc.reviewCount ?? 0,
    learners: doc.learners ?? 0,
    featured: doc.featured ?? false,
    nextBatch: doc.nextBatch ?? "",
    image: doc.image ?? "",
  };
}

async function getDbCourses(): Promise<Course[]> {
  if (!isDbConfigured()) return [];
  try {
    await connectDb();
    const docs = await CourseModel.find({ isPublished: { $ne: false } })
      .sort({ createdAt: -1 })
      .lean();
    return docs.map(toCourse);
  } catch (err) {
    console.error("Failed to load courses from DB, using static seed:", err);
    return [];
  }
}

export async function getAllCourses(): Promise<Course[]> {
  const dbCourses = await getDbCourses();
  if (dbCourses.length === 0) return staticCourses;
  const bySlug = new Map(staticCourses.map((c) => [c.slug, c]));
  for (const c of dbCourses) bySlug.set(c.slug, c);
  return [...bySlug.values()];
}

export async function getCourseBySlug(slug: string): Promise<Course | undefined> {
  const all = await getAllCourses();
  return all.find((c) => c.slug === slug);
}

export async function getCategories(): Promise<string[]> {
  const all = await getAllCourses();
  const known = COURSE_CATEGORIES.filter((cat) => all.some((c) => c.category === cat));
  const extra = [...new Set(all.map((c) => c.category))].filter(
    (cat) => !COURSE_CATEGORIES.includes(cat as (typeof COURSE_CATEGORIES)[number])
  );
  return [...known, ...extra];
}

export async function getRelated(slug: string, limit = 3): Promise<Course[]> {
  const all = await getAllCourses();
  const course = all.find((c) => c.slug === slug);
  if (!course) return [];
  return all
    .filter((c) => c.slug !== slug)
    .sort((a, b) => Number(b.category === course.category) - Number(a.category === course.category))
    .slice(0, limit);
}

export async function getCourseOptions() {
  const all = await getAllCourses();
  return all.map((c) => ({ title: c.title, slug: c.slug }));
}
