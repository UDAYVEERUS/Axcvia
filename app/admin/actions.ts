"use server";

import type { Model } from "mongoose";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, requireAdmin, sessionToken, verifyPassword } from "@/lib/admin/auth";
import { connectDb, isDbConfigured } from "@/lib/db";
import { BlogPostModel } from "@/lib/models/blog-post";
import { BundleModel } from "@/lib/models/bundle";
import { CouponModel } from "@/lib/models/coupon";
import { LandingPageModel } from "@/lib/models/landing-page";
import { OrderModel } from "@/lib/models/order";
import { QuizModel } from "@/lib/models/quiz";
import { SettingsModel } from "@/lib/models/settings";
import { StudentModel } from "@/lib/models/student";
import { getCourseBySlug } from "@/lib/services/courses";
import { grantEnrollment } from "@/lib/student/enrollments";
import { fulfilOrder } from "@/lib/student/orders";
import { CourseModel } from "@/lib/models/course";
import { EnrollmentModel } from "@/lib/models/enrollment";
import { FaqModel } from "@/lib/models/faq";
import { LeadModel } from "@/lib/models/lead";
import { PlacementModel } from "@/lib/models/placement";
import { TestimonialModel } from "@/lib/models/testimonial";
import { TrainerModel } from "@/lib/models/trainer";
import { slugify } from "@/lib/utils";

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

/* eslint-disable @typescript-eslint/no-explicit-any */
// ---------- courses ----------

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
    type: ["classes", "mock-test", "webinar"].includes(String(formData.get("type"))) ? String(formData.get("type")) : "classes",
    tags: String(formData.get("tags") ?? "").split(",").map((t) => t.trim()).filter(Boolean),
    validityDays: Number(formData.get("validityDays") ?? 0) || 0,
    certificate: formData.get("certificate") === "on",
    curriculum: parseCurriculum(formData.get("curriculum")),
    materials: lines(formData.get("materials")).map((l) => {
      const [label, ...rest] = l.split("|");
      return { label: label.trim(), url: rest.join("|").trim() };
    }).filter((m) => m.label && m.url),
  };
}

function parseCurriculum(value: FormDataEntryValue | null) {
  try {
    const parsed = JSON.parse(String(value ?? "[]"));
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((s: any) => ({
        title: String(s.title ?? "").trim(),
        lessons: (Array.isArray(s.lessons) ? s.lessons : [])
          .map((l: any) => ({
            id: String(l.id ?? "").trim() || `l-${Math.random().toString(36).slice(2, 10)}`,
            title: String(l.title ?? "").trim(),
            type: ["video", "document", "quiz"].includes(l.type) ? l.type : "video",
            videoUrl: String(l.videoUrl ?? "").trim(),
            durationMinutes: Number(l.durationMinutes ?? 0) || 0,
            content: String(l.content ?? ""),
            attachmentUrl: String(l.attachmentUrl ?? "").trim(),
            attachmentLabel: String(l.attachmentLabel ?? "").trim(),
            quizSlug: String(l.quizSlug ?? "").trim(),
            isPreview: Boolean(l.isPreview),
          }))
          .filter((l: any) => l.title),
      }))
      .filter((s: any) => s.title || s.lessons.length);
  } catch {
    return [];
  }
}

function revalidateCoursePages(slug: string) {
  revalidatePath("/");
  revalidatePath("/courses");
  revalidatePath("/courses/category/[category]", "page");
  revalidatePath(`/courses/${slug}`);
  revalidatePath(`/courses/${slug}/enroll`);
  revalidatePath("/online-courses");
  revalidatePath("/trainers/[slug]", "page");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/sitemap.xml");
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

// ---------- generic content (blog, trainers, testimonials, placements, faqs) ----------

type ContentType = "blog" | "trainers" | "testimonials" | "placements" | "faqs" | "quizzes" | "bundles" | "pages";

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const num = (fd: FormData, key: string) => Number(fd.get(key) ?? 0) || 0;
const csv = (fd: FormData, key: string) =>
  text(fd, key)
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

interface ContentConfig {
  model: Model<any>;
  adminPath: string;
  /** Returns the parsed document, or a string error code. */
  parse: (fd: FormData) => Record<string, unknown> | string;
  /** Public paths to refresh after a change. */
  revalidate: (slug: string) => void;
}

function parseJsonArray(value: FormDataEntryValue | null) {
  try {
    const v = JSON.parse(String(value ?? "[]"));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

/** "Heading | body" or "Question | Answer" lines. */
function pairs(fd: FormData, key: string, a: string, b: string) {
  return lines(fd.get(key)).map((l) => {
    const [x, ...rest] = l.split("|");
    return { [a]: x.trim(), [b]: rest.join("|").trim() };
  }).filter((o) => o[a]);
}

/** Landing page sections: "## Heading" starts a section; following lines are its Markdown body. */
function parseSections(value: FormDataEntryValue | null) {
  const out: { heading: string; body: string }[] = [];
  for (const raw of String(value ?? "").replace(/\r\n/g, "\n").split("\n")) {
    const m = /^##\s+(.*)$/.exec(raw);
    if (m) out.push({ heading: m[1].trim(), body: "" });
    else if (out.length) out[out.length - 1].body += (out[out.length - 1].body ? "\n" : "") + raw;
  }
  return out.map((s) => ({ ...s, body: s.body.trim() })).filter((s) => s.heading);
}

const CONTENT: Record<ContentType, ContentConfig> = {
  quizzes: {
    model: QuizModel,
    adminPath: "/admin/quizzes",
    parse: (fd) => {
      const title = text(fd, "title");
      if (!title) return "missing";
      const questions = parseJsonArray(fd.get("questions"))
        .map((q: any) => ({
          text: String(q.text ?? "").trim(),
          options: (Array.isArray(q.options) ? q.options : []).map((o: any) => String(o).trim()),
          correctIndex: Number(q.correctIndex ?? 0) || 0,
          explanation: String(q.explanation ?? "").trim(),
        }))
        .filter((q: any) => q.text && q.options.length >= 2);
      return {
        title,
        slug: slugify(text(fd, "slug") || title),
        description: text(fd, "description"),
        courseSlug: text(fd, "courseSlug"),
        durationMinutes: num(fd, "durationMinutes"),
        passingPercent: Math.min(100, Math.max(0, num(fd, "passingPercent") || 60)),
        isFreeSample: fd.get("isFreeSample") === "on",
        shuffle: fd.get("shuffle") === "on",
        questions,
        isPublished: fd.get("isPublished") === "on",
      };
    },
    revalidate: () => {
      revalidatePath("/mock-tests");
      revalidatePath("/courses/[slug]", "page");
      revalidatePath("/learn/[course]", "layout");
    },
  },
  bundles: {
    model: BundleModel,
    adminPath: "/admin/bundles",
    parse: (fd) => {
      const title = text(fd, "title");
      if (!title) return "missing";
      return {
        title,
        slug: slugify(text(fd, "slug") || title),
        tagline: text(fd, "tagline"),
        description: String(fd.get("description") ?? ""),
        courseSlugs: fd.getAll("courseSlugs").map(String),
        price: num(fd, "price"),
        discountPrice: num(fd, "discountPrice"),
        image: text(fd, "image"),
        validityDays: num(fd, "validityDays"),
        featured: fd.get("featured") === "on",
        isPublished: fd.get("isPublished") === "on",
      };
    },
    revalidate: (slug) => {
      revalidatePath("/bundles");
      revalidatePath(`/bundles/${slug}`);
      revalidatePath("/[landing]", "page");
    },
  },
  pages: {
    model: LandingPageModel,
    adminPath: "/admin/pages",
    parse: (fd) => {
      const title = text(fd, "title");
      if (!title) return "missing";
      return {
        title,
        slug: slugify(text(fd, "slug") || title),
        metaTitle: text(fd, "metaTitle"),
        metaDescription: text(fd, "metaDescription"),
        eyebrow: text(fd, "eyebrow"),
        heroTitle: text(fd, "heroTitle"),
        heroText: text(fd, "heroText"),
        heroImage: text(fd, "heroImage"),
        sections: parseSections(fd.get("sections")),
        courseSlugs: fd.getAll("courseSlugs").map(String),
        courseTag: text(fd, "courseTag"),
        bundleSlugs: fd.getAll("bundleSlugs").map(String),
        faqs: pairs(fd, "faqs", "question", "answer"),
        highlights: pairs(fd, "highlights", "title", "text"),
        showInNav: fd.get("showInNav") === "on",
        navGroup: text(fd, "navGroup"),
        isPublished: fd.get("isPublished") === "on",
      };
    },
    revalidate: (slug) => {
      revalidatePath(`/${slug}`);
      revalidatePath("/", "layout");
    },
  },
  blog: {
    model: BlogPostModel,
    adminPath: "/admin/blog",
    parse: (fd) => {
      const title = text(fd, "title");
      if (!title) return "missing";
      const publishedAt = text(fd, "publishedAt");
      return {
        title,
        slug: slugify(text(fd, "slug") || title),
        excerpt: text(fd, "excerpt"),
        content: String(fd.get("content") ?? ""),
        category: text(fd, "category") || "Tutorials",
        tags: csv(fd, "tags"),
        authorSlug: text(fd, "authorSlug"),
        authorName: text(fd, "authorName"),
        coverImage: text(fd, "coverImage"),
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
        readingMinutes: Math.max(1, num(fd, "readingMinutes") || 5),
        relatedCourseSlugs: fd.getAll("relatedCourseSlugs").map(String),
        featured: fd.get("featured") === "on",
        isPublished: fd.get("isPublished") === "on",
      };
    },
    revalidate: (slug) => {
      revalidatePath("/blog");
      revalidatePath(`/blog/${slug}`);
      revalidatePath("/blog/category/[category]", "page");
      revalidatePath("/blog/tag/[tag]", "page");
      revalidatePath("/courses/[slug]", "page");
      revalidatePath("/trainers/[slug]", "page");
    },
  },
  trainers: {
    model: TrainerModel,
    adminPath: "/admin/trainers",
    parse: (fd) => {
      const name = text(fd, "name");
      if (!name) return "missing";
      return {
        name,
        slug: slugify(text(fd, "slug") || name),
        role: text(fd, "role"),
        bio: text(fd, "bio"),
        expertise: csv(fd, "expertise"),
        experienceYears: num(fd, "experienceYears"),
        linkedin: text(fd, "linkedin"),
        photo: text(fd, "photo"),
        isPublished: fd.get("isPublished") === "on",
      };
    },
    revalidate: (slug) => {
      revalidatePath("/");
      revalidatePath("/about");
      revalidatePath("/trainers");
      revalidatePath(`/trainers/${slug}`);
      revalidatePath("/courses/[slug]", "page");
      revalidatePath("/blog/[slug]", "page");
    },
  },
  testimonials: {
    model: TestimonialModel,
    adminPath: "/admin/testimonials",
    parse: (fd) => {
      const studentName = text(fd, "studentName");
      const body = text(fd, "text");
      if (!studentName || !body) return "missing";
      return {
        slug: slugify(text(fd, "slug") || `${studentName}-${text(fd, "company")}`),
        studentName,
        courseSlug: text(fd, "courseSlug"),
        courseTitle: text(fd, "courseTitle"),
        role: text(fd, "role"),
        company: text(fd, "company"),
        rating: Math.min(5, Math.max(1, num(fd, "rating") || 5)),
        title: text(fd, "title"),
        text: body,
        avatar: text(fd, "avatar"),
        videoUrl: text(fd, "videoUrl"),
        isPublished: fd.get("isPublished") === "on",
      };
    },
    revalidate: () => {
      revalidatePath("/");
      revalidatePath("/testimonials");
      revalidatePath("/courses/[slug]", "page");
    },
  },
  placements: {
    model: PlacementModel,
    adminPath: "/admin/placements",
    parse: (fd) => {
      const studentName = text(fd, "studentName");
      const company = text(fd, "company");
      if (!studentName || !company) return "missing";
      return {
        slug: slugify(text(fd, "slug") || `${studentName}-${company}`),
        studentName,
        background: text(fd, "background"),
        company,
        role: text(fd, "role"),
        packageLpa: num(fd, "packageLpa"),
        year: num(fd, "year") || new Date().getFullYear(),
        courseTitle: text(fd, "courseTitle"),
        isPublished: fd.get("isPublished") === "on",
      };
    },
    revalidate: () => {
      revalidatePath("/placements");
    },
  },
  faqs: {
    model: FaqModel,
    adminPath: "/admin/faqs",
    parse: (fd) => {
      const question = text(fd, "question");
      const answer = text(fd, "answer");
      if (!question || !answer) return "missing";
      return {
        slug: slugify(text(fd, "slug") || question),
        question,
        answer,
        category: text(fd, "category") || "General",
        isPublished: fd.get("isPublished") === "on",
      };
    },
    revalidate: () => {
      revalidatePath("/");
      revalidatePath("/faq");
    },
  },
};

async function saveContent(type: ContentType, formData: FormData) {
  await requireAdmin();
  const cfg = CONTENT[type];
  if (!isDbConfigured()) redirect(`${cfg.adminPath}?error=nodb`);
  const originalSlug = String(formData.get("originalSlug") ?? "");
  const data = cfg.parse(formData);
  if (typeof data === "string") {
    redirect(originalSlug ? `${cfg.adminPath}/${originalSlug}?error=${data}` : `${cfg.adminPath}/new?error=${data}`);
  }
  const slug = data.slug as string;

  await connectDb();
  if (originalSlug) {
    await cfg.model.findOneAndUpdate({ slug: originalSlug }, data, { upsert: true });
    if (originalSlug !== slug) cfg.revalidate(originalSlug);
  } else {
    if (await cfg.model.exists({ slug })) redirect(`${cfg.adminPath}/new?error=duplicate`);
    await cfg.model.create(data);
  }
  cfg.revalidate(slug);
  revalidatePath("/sitemap.xml");
  revalidatePath(cfg.adminPath);
  redirect(`${cfg.adminPath}?saved=1`);
}

async function deleteContent(type: ContentType, formData: FormData) {
  await requireAdmin();
  const cfg = CONTENT[type];
  if (!isDbConfigured()) redirect(`${cfg.adminPath}?error=nodb`);
  const slug = String(formData.get("slug") ?? "");
  await connectDb();
  await cfg.model.deleteOne({ slug });
  cfg.revalidate(slug);
  revalidatePath("/sitemap.xml");
  revalidatePath(cfg.adminPath);
  redirect(`${cfg.adminPath}?deleted=1`);
}

// "use server" modules may only export async functions.
export async function saveBlogPostAction(fd: FormData) { await saveContent("blog", fd); }
export async function deleteBlogPostAction(fd: FormData) { await deleteContent("blog", fd); }
export async function saveTrainerAction(fd: FormData) { await saveContent("trainers", fd); }
export async function deleteTrainerAction(fd: FormData) { await deleteContent("trainers", fd); }
export async function saveTestimonialAction(fd: FormData) { await saveContent("testimonials", fd); }
export async function deleteTestimonialAction(fd: FormData) { await deleteContent("testimonials", fd); }
export async function savePlacementAction(fd: FormData) { await saveContent("placements", fd); }
export async function deletePlacementAction(fd: FormData) { await deleteContent("placements", fd); }
export async function saveFaqAction(fd: FormData) { await saveContent("faqs", fd); }
export async function deleteFaqAction(fd: FormData) { await deleteContent("faqs", fd); }

export async function saveQuizAction(fd: FormData) { await saveContent("quizzes", fd); }
export async function deleteQuizAction(fd: FormData) { await deleteContent("quizzes", fd); }
export async function saveBundleAction(fd: FormData) { await saveContent("bundles", fd); }
export async function deleteBundleAction(fd: FormData) { await deleteContent("bundles", fd); }
export async function saveLandingPageAction(fd: FormData) { await saveContent("pages", fd); }
export async function deleteLandingPageAction(fd: FormData) { await deleteContent("pages", fd); }

// ---------- coupons ----------

export async function saveCouponAction(formData: FormData) {
  await requireAdmin();
  if (!isDbConfigured()) redirect("/admin/coupons?error=nodb");
  const code = text(formData, "code").toUpperCase().replace(/[^A-Z0-9-]/g, "");
  if (!code) redirect("/admin/coupons?error=missing");
  const expires = text(formData, "expiresAt");
  await connectDb();
  await CouponModel.findOneAndUpdate(
    { code },
    {
      code,
      description: text(formData, "description"),
      percentOff: Math.min(100, num(formData, "percentOff")),
      flatOff: num(formData, "flatOff"),
      minAmount: num(formData, "minAmount"),
      newStudentsOnly: formData.get("newStudentsOnly") === "on",
      active: formData.get("active") === "on",
      expiresAt: expires ? new Date(expires) : null,
    },
    { upsert: true }
  );
  revalidatePath("/admin/coupons");
  redirect("/admin/coupons?saved=1");
}

export async function deleteCouponAction(formData: FormData) {
  await requireAdmin();
  if (!isDbConfigured()) redirect("/admin/coupons?error=nodb");
  await connectDb();
  await CouponModel.deleteOne({ code: text(formData, "slug").toUpperCase() });
  revalidatePath("/admin/coupons");
  redirect("/admin/coupons?deleted=1");
}

// ---------- orders ----------

export async function updateOrderStatusAction(formData: FormData) {
  await requireAdmin();
  if (!isDbConfigured()) redirect("/admin/orders?error=nodb");
  const id = text(formData, "id");
  const status = text(formData, "status");
  await connectDb();
  if (status === "paid") {
    await fulfilOrder(id, "manual");
  } else if (["pending", "failed", "cancelled"].includes(status)) {
    await OrderModel.findByIdAndUpdate(id, { status });
    if (status === "cancelled") await EnrollmentModel.updateMany({ orderId: id, status: "pending" }, { status: "cancelled" });
  }
  revalidatePath("/admin/orders");
  revalidatePath("/admin/enrollments");
  redirect("/admin/orders");
}

// ---------- students ----------

export async function manualEnrollAction(formData: FormData) {
  await requireAdmin();
  if (!isDbConfigured()) redirect("/admin/students?error=nodb");
  const userId = text(formData, "userId");
  const courseSlug = text(formData, "courseSlug");
  const validityDays = num(formData, "validityDays");
  await connectDb();
  const [student, course] = await Promise.all([StudentModel.findById(userId).lean() as Promise<any>, getCourseBySlug(courseSlug)]);
  if (!student || !course) redirect(`/admin/students/${userId}?error=missing`);
  await grantEnrollment({
    userId, name: student.name, email: student.email, phone: student.phone,
    courseSlug: course.slug, courseTitle: course.title,
    validityDays: validityDays || course.validityDays || 0,
    amount: course.discountFee, status: "paid", source: "manual",
  });
  revalidatePath(`/admin/students/${userId}`);
  revalidatePath("/admin/enrollments");
  redirect(`/admin/students/${userId}?saved=1`);
}

export async function revokeEnrollmentAction(formData: FormData) {
  await requireAdmin();
  if (!isDbConfigured()) redirect("/admin/students?error=nodb");
  const id = text(formData, "id");
  const userId = text(formData, "userId");
  await connectDb();
  await EnrollmentModel.findByIdAndUpdate(id, { status: "cancelled" });
  revalidatePath(`/admin/students/${userId}`);
  redirect(`/admin/students/${userId}?saved=1`);
}

// ---------- settings ----------

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  if (!isDbConfigured()) redirect("/admin/settings?error=nodb");
  await connectDb();
  await SettingsModel.findOneAndUpdate(
    { key: "site" },
    {
      key: "site",
      promoEnabled: formData.get("promoEnabled") === "on",
      promoTitle: text(formData, "promoTitle"),
      promoText: text(formData, "promoText"),
      promoCode: text(formData, "promoCode").toUpperCase(),
      popupEnabled: formData.get("popupEnabled") === "on",
      popupDelaySeconds: Math.max(3, num(formData, "popupDelaySeconds") || 10),
      announcement: text(formData, "announcement"),
    },
    { upsert: true }
  );
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}

// ---------- enrollments ----------

export async function updateEnrollmentStatusAction(formData: FormData) {
  await requireAdmin();
  if (!isDbConfigured()) redirect("/admin/enrollments?error=nodb");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "pending");
  if (!["pending", "confirmed", "paid", "cancelled"].includes(status)) return;
  await connectDb();
  await EnrollmentModel.findByIdAndUpdate(id, { status });
  revalidatePath("/admin/enrollments");
  redirect("/admin/enrollments");
}
