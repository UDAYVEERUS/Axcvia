import type { Bundle, Coupon, LandingPage, Quiz, SiteSettings } from "@/lib/types";
import { bundles as seedBundles, coupons as seedCoupons, landingPages as seedPages, quizzes as seedQuizzes } from "@/lib/data/lms";
import { connectDb, isDbConfigured } from "@/lib/db";
import { BundleModel } from "@/lib/models/bundle";
import { CouponModel } from "@/lib/models/coupon";
import { LandingPageModel } from "@/lib/models/landing-page";
import { QuizModel } from "@/lib/models/quiz";
import { SettingsModel } from "@/lib/models/settings";
import { loadMerged, strings } from "@/lib/services/content";

/* eslint-disable @typescript-eslint/no-explicit-any */

// ---------- quizzes ----------

export function toQuiz(doc: any): Quiz {
  return {
    slug: doc.slug,
    title: doc.title,
    description: doc.description ?? "",
    courseSlug: doc.courseSlug ?? "",
    durationMinutes: doc.durationMinutes ?? 30,
    passingPercent: doc.passingPercent ?? 60,
    isFreeSample: Boolean(doc.isFreeSample),
    shuffle: doc.shuffle !== false,
    questions: (doc.questions ?? []).map((q: any) => ({
      text: q.text,
      options: strings(q.options),
      correctIndex: q.correctIndex ?? 0,
      explanation: q.explanation ?? "",
    })),
  };
}

export function getAllQuizzes() {
  return loadMerged(seedQuizzes, QuizModel, toQuiz);
}

export async function getQuizBySlug(slug: string) {
  return (await getAllQuizzes()).find((q) => q.slug === slug);
}

export async function getQuizzesForCourse(courseSlug: string) {
  return (await getAllQuizzes()).filter((q) => q.courseSlug === courseSlug);
}

// ---------- bundles ----------

export function toBundle(doc: any): Bundle {
  return {
    slug: doc.slug,
    title: doc.title,
    tagline: doc.tagline ?? "",
    description: doc.description ?? "",
    courseSlugs: strings(doc.courseSlugs),
    price: doc.price ?? 0,
    discountPrice: doc.discountPrice ?? 0,
    image: doc.image ?? "",
    validityDays: doc.validityDays ?? 0,
    featured: Boolean(doc.featured),
  };
}

export function getAllBundles() {
  return loadMerged(seedBundles, BundleModel, toBundle);
}

export async function getBundleBySlug(slug: string) {
  return (await getAllBundles()).find((b) => b.slug === slug);
}

// ---------- landing pages ----------

export function toLandingPage(doc: any): LandingPage {
  return {
    slug: doc.slug,
    title: doc.title,
    metaTitle: doc.metaTitle ?? "",
    metaDescription: doc.metaDescription ?? "",
    eyebrow: doc.eyebrow ?? "",
    heroTitle: doc.heroTitle ?? "",
    heroText: doc.heroText ?? "",
    heroImage: doc.heroImage ?? "",
    sections: (doc.sections ?? []).map((s: any) => ({ heading: s.heading ?? "", body: s.body ?? "" })),
    courseSlugs: strings(doc.courseSlugs),
    courseTag: doc.courseTag ?? "",
    bundleSlugs: strings(doc.bundleSlugs),
    faqs: (doc.faqs ?? []).map((f: any) => ({ question: f.question ?? "", answer: f.answer ?? "" })),
    highlights: (doc.highlights ?? []).map((h: any) => ({ title: h.title ?? "", text: h.text ?? "" })),
    showInNav: Boolean(doc.showInNav),
    navGroup: doc.navGroup ?? "",
  };
}

export function getAllLandingPages() {
  return loadMerged(seedPages, LandingPageModel, toLandingPage);
}

export async function getLandingPageBySlug(slug: string) {
  return (await getAllLandingPages()).find((p) => p.slug === slug);
}

/** Nav groups derived from landing pages flagged showInNav (e.g. "Classes" → [...]). */
export async function getLandingNav() {
  const pages = (await getAllLandingPages()).filter((p) => p.showInNav);
  const groups = new Map<string, { label: string; href: string }[]>();
  for (const p of pages) {
    const g = p.navGroup || "More";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push({ label: p.title, href: `/${p.slug}` });
  }
  return [...groups.entries()].map(([label, items]) => ({ label, items }));
}

// ---------- coupons ----------

export function toCoupon(doc: any): Coupon {
  return {
    code: doc.code,
    description: doc.description ?? "",
    percentOff: doc.percentOff ?? 0,
    flatOff: doc.flatOff ?? 0,
    minAmount: doc.minAmount ?? 0,
    newStudentsOnly: Boolean(doc.newStudentsOnly),
    active: doc.active !== false,
    expiresAt: doc.expiresAt ? new Date(doc.expiresAt).toISOString() : "",
  };
}

export async function getAllCoupons(): Promise<Coupon[]> {
  // Coupons are keyed by code; reuse the slug-based loader via a shim.
  const seed = seedCoupons.map((c) => ({ ...c, slug: c.code }));
  const merged = await loadMerged(seed, CouponModel, (d) => ({ ...toCoupon(d), slug: d.code }));
  return merged.map(({ slug: _slug, ...c }) => {
    void _slug;
    return c;
  });
}

export async function findCoupon(code: string) {
  const c = (await getAllCoupons()).find((x) => x.code === code.trim().toUpperCase());
  if (!c || !c.active) return null;
  if (c.expiresAt && new Date(c.expiresAt) < new Date()) return null;
  return c;
}

// ---------- settings ----------

const defaultSettings: SiteSettings = {
  promoEnabled: true,
  promoTitle: "10% Flat Discount for New Students",
  promoText:
    "Get a 10% flat discount on your first course. Use the code at checkout — valid for new students only.",
  promoCode: "WELCOME10",
  popupEnabled: true,
  popupDelaySeconds: 10,
  announcement: "",
  razorpayEnabled: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
};

export async function getSettings(): Promise<SiteSettings> {
  if (!isDbConfigured()) return defaultSettings;
  try {
    await connectDb();
    const doc: any = await SettingsModel.findOne({ key: "site" }).lean();
    if (!doc) return defaultSettings;
    return {
      ...defaultSettings,
      promoEnabled: doc.promoEnabled !== false,
      promoTitle: doc.promoTitle ?? defaultSettings.promoTitle,
      promoText: doc.promoText ?? defaultSettings.promoText,
      promoCode: doc.promoCode ?? defaultSettings.promoCode,
      popupEnabled: doc.popupEnabled !== false,
      popupDelaySeconds: doc.popupDelaySeconds ?? 10,
      announcement: doc.announcement ?? "",
    };
  } catch {
    return defaultSettings;
  }
}
