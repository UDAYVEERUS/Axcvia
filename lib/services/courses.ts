import type { Course } from "@/lib/types";
import { COURSE_CATEGORIES } from "@/lib/types";
import { courses as staticCourses } from "@/lib/data/courses";
import { CourseModel } from "@/lib/models/course";
import { loadMerged } from "@/lib/services/content";
import { slugify } from "@/lib/utils";

// See lib/services/content.ts for how seed and database courses are merged.

/* eslint-disable @typescript-eslint/no-explicit-any */
export function toCourse(doc: any): Course {
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
    type: doc.type ?? "classes",
    tags: doc.tags ?? [],
    validityDays: doc.validityDays ?? 0,
    certificate: doc.certificate ?? true,
    curriculum: (doc.curriculum ?? []).map((s: any) => ({
      title: s.title,
      lessons: (s.lessons ?? []).map((l: any) => ({
        id: l.id,
        title: l.title,
        type: l.type ?? "video",
        videoUrl: l.videoUrl ?? "",
        durationMinutes: l.durationMinutes ?? 0,
        content: l.content ?? "",
        attachmentUrl: l.attachmentUrl ?? "",
        attachmentLabel: l.attachmentLabel ?? "",
        quizSlug: l.quizSlug ?? "",
        isPreview: Boolean(l.isPreview),
      })),
    })),
    materials: (doc.materials ?? []).map((m: any) => ({ label: m.label ?? "", url: m.url ?? "" })),
  };
}

/** Lessons flattened in order, for progress and navigation. */
export function courseLessons(course: Course) {
  return (course.curriculum ?? []).flatMap((s) => s.lessons);
}

export function courseTotalMinutes(course: Course) {
  return courseLessons(course).reduce((sum, l) => sum + (l.durationMinutes ?? 0), 0);
}

export const COURSE_TYPE_LABEL: Record<NonNullable<Course["type"]>, string> = {
  classes: "Classes",
  "mock-test": "Mock Test Series",
  webinar: "Webinar",
};

export async function getAllCourses(): Promise<Course[]> {
  return loadMerged(staticCourses, CourseModel, toCourse);
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

/** Resolve a URL-safe category slug (e.g. "ai-machine-learning") back to its courses. */
export async function getCoursesByCategorySlug(categorySlug: string) {
  const all = await getAllCourses();
  const category = [...new Set(all.map((c) => c.category))].find(
    (c) => slugify(c) === categorySlug
  );
  if (!category) return null;
  return { category, courses: all.filter((c) => c.category === category) };
}

export async function getCoursesByType(type: NonNullable<Course["type"]>) {
  return (await getAllCourses()).filter((c) => (c.type ?? "classes") === type);
}

export async function getCoursesByTag(tagSlug: string) {
  const all = await getAllCourses();
  const tag = [...new Set(all.flatMap((c) => c.tags ?? []))].find((t) => slugify(t) === tagSlug);
  if (!tag) return null;
  return { tag, courses: all.filter((c) => (c.tags ?? []).includes(tag)) };
}
