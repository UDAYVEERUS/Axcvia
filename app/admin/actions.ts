"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, requireAdmin, sessionToken, verifyPassword } from "@/lib/admin/auth";
import { connectDb, isDbConfigured } from "@/lib/db";
import { CourseModel } from "@/lib/models/course";
import { LeadModel } from "@/lib/models/lead";

// ---------- auth ----------

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    redirect("/admin/login?error=1");
  }
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, sessionToken()!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  redirect("/admin");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

// ---------- courses ----------

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

function lines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

// Each syllabus line: "Module Title | topic, topic, topic"
function parseSyllabus(value: FormDataEntryValue | null) {
  return lines(value).map((line) => {
    const [title, topics = ""] = line.split("|");
    return {
      title: title.trim(),
      topics: topics
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
  });
}

function parseCourseForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const slug = slugify(String(formData.get("slug") ?? "") || title);
  return {
    title,
    slug,
    category: String(formData.get("category") ?? "").trim(),
    tagline: String(formData.get("tagline") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    duration: String(formData.get("duration") ?? "").trim(),
    mode: String(formData.get("mode") ?? "hybrid"),
    level: String(formData.get("level") ?? "Beginner"),
    fee: Number(formData.get("fee") ?? 0) || 0,
    discountFee: Number(formData.get("discountFee") ?? 0) || 0,
    trainerSlug: String(formData.get("trainerSlug") ?? "").trim(),
    nextBatch: String(formData.get("nextBatch") ?? "").trim(),
    image: String(formData.get("image") ?? "").trim(),
    formats: formData.getAll("formats").map(String),
    featured: formData.get("featured") === "on",
    isPublished: formData.get("isPublished") === "on",
    prerequisites: lines(formData.get("prerequisites")),
    outcomes: lines(formData.get("outcomes")),
    syllabus: parseSyllabus(formData.get("syllabus")),
  };
}

function revalidateCoursePages(slug: string) {
  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath(`/courses/${slug}`);
  revalidatePath("/online-courses");
  revalidatePath("/admin/courses");
}

export async function saveCourseAction(formData: FormData) {
  await requireAdmin();
  if (!isDbConfigured()) {
    redirect("/admin/courses?error=nodb");
  }
  const data = parseCourseForm(formData);
  const originalSlug = String(formData.get("originalSlug") ?? "");
  if (!data.title || !data.category) {
    redirect(
      originalSlug
        ? `/admin/courses/${originalSlug}?error=missing`
        : "/admin/courses/new?error=missing"
    );
  }

  await connectDb();
  if (originalSlug) {
    await CourseModel.findOneAndUpdate({ slug: originalSlug }, data, { upsert: true });
    if (originalSlug !== data.slug) revalidatePath(`/courses/${originalSlug}`);
  } else {
    const exists = await CourseModel.exists({ slug: data.slug });
    if (exists) redirect("/admin/courses/new?error=duplicate");
    await CourseModel.create(data);
  }
  revalidateCoursePages(data.slug);
  redirect("/admin/courses?saved=1");
}

export async function deleteCourseAction(formData: FormData) {
  await requireAdmin();
  if (!isDbConfigured()) redirect("/admin/courses?error=nodb");
  const slug = String(formData.get("slug") ?? "");
  await connectDb();
  await CourseModel.deleteOne({ slug });
  revalidateCoursePages(slug);
  redirect("/admin/courses?deleted=1");
}

// ---------- leads ----------

export async function updateLeadStatusAction(formData: FormData) {
  await requireAdmin();
  if (!isDbConfigured()) redirect("/admin/leads?error=nodb");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "new");
  if (!["new", "contacted", "converted", "lost"].includes(status)) return;
  await connectDb();
  await LeadModel.findByIdAndUpdate(id, { status });
  revalidatePath("/admin/leads");
  redirect("/admin/leads");
}
