/**
 * Replace every course and course category with axcvia-courses-seed.json.
 *
 *   node scripts/reseed-courses.mjs --dry   # validate + print the mapping, write nothing
 *   node scripts/reseed-courses.mjs         # delete all courses & categories, insert the seed
 *
 * Safe to re-run: the deletes and inserts run in one transaction, so every run
 * leaves exactly the seed in the database, and a failed run changes nothing.
 * The seed is fully validated before anything is deleted.
 */
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";
import { connectDb } from "../lib/db.ts";
import { CategoryModel } from "../lib/models/category.ts";
import { CourseModel } from "../lib/models/course.ts";

const args = new Set(process.argv.slice(2));
const DRY = args.has("--dry");
const SEED = path.resolve(process.cwd(), "axcvia-courses-seed.json");

// ---- env (lib/db.ts reads MONGODB_URI; only Next loads .env files itself) ---
for (const f of [".env.local", ".env"]) {
  const p = path.resolve(process.cwd(), f);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

// Same rules as lib/utils.ts slugify — the site derives category URLs from names.
const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

// ---- field mapping -----------------------------------------------------------
const CATEGORY_FIELDS = ["slug", "name", "description", "order", "isPublished"];

// Must be in the JSON: leaving them out would let the schema fill in a default
// that reads as a real claim on the site (certificate: true, formats: classroom…).
const REQUIRED = ["title", "slug", "category", "type", "mode", "level", "formats", "certificate", "fee", "discountFee"];

// May be omitted: stored as an explicit empty value — never the schema default
// (which for rating is a made-up 4.8).
const EMPTY = {
  tagline: "", description: "", image: "", duration: "", trainerSlug: "", nextBatch: "",
  tags: [], prerequisites: [], outcomes: [], syllabus: [], curriculum: [], materials: [],
  validityDays: 0, rating: 0, reviewCount: 0, learners: 0, featured: false, isPublished: true,
};
const COURSE_FIELDS = new Set([...REQUIRED, ...Object.keys(EMPTY)]);

// ---- validate ------------------------------------------------------------------
const seed = JSON.parse(fs.readFileSync(SEED, "utf8"));
const errors = [];

const categoryDocs = (seed.categories ?? []).map((c, i) => {
  const unknown = Object.keys(c).filter((k) => !CATEGORY_FIELDS.includes(k));
  if (unknown.length) errors.push(`category #${i}: no schema field for ${unknown.join(", ")}`);
  if (!c.slug || !c.name) errors.push(`category #${i}: slug and name are required`);
  else if (slugify(c.name) !== c.slug) errors.push(`category ${c.slug}: slugify("${c.name}") is "${slugify(c.name)}"`);
  return { ...c };
});
const categoryBySlug = new Map(categoryDocs.map((c) => [c.slug, c]));
if (categoryBySlug.size !== categoryDocs.length) errors.push("duplicate category slugs");

const seen = new Set();
const report = [];
const courseDocs = (seed.courses ?? []).map((c, i) => {
  const label = c.slug ?? `course #${i}`;
  const unknown = Object.keys(c).filter((k) => !COURSE_FIELDS.has(k));
  if (unknown.length) errors.push(`${label}: no schema field for ${unknown.join(", ")}`);
  const missing = REQUIRED.filter((k) => c[k] === undefined);
  if (missing.length) errors.push(`${label}: missing required ${missing.join(", ")}`);
  if (seen.has(c.slug)) errors.push(`${label}: duplicate slug`);
  seen.add(c.slug);
  const category = categoryBySlug.get(c.category);
  if (!category) errors.push(`${label}: unknown category "${c.category}"`);

  const doc = { ...EMPTY, ...c, category: category?.name ?? c.category, source: "axcvia-seed" };
  const invalid = new CourseModel(doc).validateSync();
  if (invalid) errors.push(`${label}: ${invalid.message}`);
  report.push({ slug: label, category: c.category, empty: Object.keys(EMPTY).filter((k) => c[k] === undefined) });
  return doc;
});

console.log(`Seed: ${categoryDocs.length} categories, ${courseDocs.length} courses`);
for (const cat of categoryDocs) {
  const n = courseDocs.filter((d) => d.category === cat.name).length;
  console.log(`  ${cat.slug.padEnd(22)} ${cat.name.padEnd(22)} ${n} course${n === 1 ? "" : "s"}`);
}
const emptyEverywhere = Object.keys(EMPTY).filter((k) => report.every((r) => r.empty.includes(k)));
console.log(`Fields not in the JSON for any course (stored empty): ${emptyEverywhere.join(", ") || "none"}`);
for (const r of report) {
  const extra = r.empty.filter((k) => !emptyEverywhere.includes(k));
  if (extra.length) console.log(`  ${r.slug}: also empty → ${extra.join(", ")}`);
}

if (errors.length) {
  console.error(`\n${errors.length} problem(s) — nothing written:\n  ${errors.join("\n  ")}`);
  process.exit(1);
}

// ---- write -------------------------------------------------------------------
await connectDb();
await Promise.all([CourseModel.init(), CategoryModel.init()]);
const [courseCount, categoryCount] = await Promise.all([CourseModel.countDocuments(), CategoryModel.countDocuments()]);
console.log(`\nDatabase now: ${courseCount} courses, ${categoryCount} categories`);

if (DRY) {
  console.log("Dry run — nothing written.");
} else {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await CourseModel.deleteMany({}, { session });
      await CategoryModel.deleteMany({}, { session });
      await CategoryModel.insertMany(categoryDocs, { session });
      await CourseModel.insertMany(courseDocs, { session });
    });
  } finally {
    await session.endSession();
  }
  console.log(`Replaced with ${categoryDocs.length} categories and ${courseDocs.length} courses.`);
}
await mongoose.disconnect();
