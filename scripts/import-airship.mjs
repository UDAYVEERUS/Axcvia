/**
 * Import every Tutor LMS course / mock-test series / webinar from
 * airshipaviation.com into the Axcvia `courses` collection.
 *
 *   node scripts/import-airship.mjs            # import / update all
 *   node scripts/import-airship.mjs --hide-seed # also unpublish the static demo courses
 *   node scripts/import-airship.mjs --dry       # print what would be written
 *
 * Mapping: WP top-level course-category → `type`
 *   Courses → "classes", Mock Test Series → "mock-test", Webinars → "webinar"
 * Sub-category (A320, CPL, ATPL…) → `category`. Course tags → `tags`.
 * Price, duration, validity, level and curriculum are scraped from the single
 * course page because Tutor does not expose them over REST.
 */
import fs from "node:fs";
import path from "node:path";
import mongoose from "mongoose";

const SITE = "https://www.airshipaviation.com";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36";
const args = new Set(process.argv.slice(2));
const DRY = args.has("--dry");

// ---- env -------------------------------------------------------------------
for (const f of [".env.local", ".env"]) {
  const p = path.resolve(process.cwd(), f);
  if (!fs.existsSync(p)) continue;
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const uri = process.env.MONGODB_URI;
if (!uri && !DRY) {
  console.error("MONGODB_URI missing (set it in .env.local)");
  process.exit(1);
}

// ---- helpers ---------------------------------------------------------------
/** fetch → { text, json, headers } with retries (the WP host is behind a flaky Cloudflare edge). */
const get = async (url, attempt = 1) => {
  try {
    const res = await fetch(url, { headers: { "user-agent": UA } });
    if (!res.ok) throw new Error(String(res.status));
    const body = await res.text();
    return { headers: res.headers, text: async () => body, json: async () => JSON.parse(body) };
  } catch (e) {
    if (attempt < 5) { await new Promise((r) => setTimeout(r, 2000 * attempt)); return get(url, attempt + 1); }
    throw new Error(`${e.message} ${url}`);
  }
};
const entities = { amp: "&", lt: "<", gt: ">", quot: '"', "#039": "'", "#8217": "’", "#8216": "‘", "#8211": "–", "#8212": "—", "#038": "&", nbsp: " ", "#8377": "₹", "#8230": "…", "#8220": "“", "#8221": "”" };
const decode = (s = "") =>
  s.replace(/&(#?\w+);/g, (m, k) => entities[k] ?? (k.startsWith("#") ? String.fromCodePoint(Number(k.slice(1))) : m));
const text = (html = "") => decode(html.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Very small HTML → Markdown for course descriptions. */
function toMarkdown(html = "") {
  let s = html.replace(/\r/g, "");
  s = s.replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "");
  s = s.replace(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi, (_, l, t) => `\n\n${"#".repeat(Math.min(Number(l) + 1, 6))} ${text(t)}\n\n`);
  s = s.replace(/<(strong|b)>([\s\S]*?)<\/\1>/gi, (_, __, t) => `**${text(t)}**`);
  s = s.replace(/<(em|i)>([\s\S]*?)<\/\1>/gi, (_, __, t) => `*${text(t)}*`);
  s = s.replace(/<a [^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, h, t) => `[${text(t)}](${h})`);
  s = s.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `\n- ${text(t)}`);
  s = s.replace(/<\/(ul|ol|p|div|table|tr)>/gi, "\n\n");
  s = s.replace(/<br\s*\/?>/gi, "\n");
  s = s.replace(/<[^>]+>/g, "");
  return decode(s).replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function parseSingle(html) {
  const out = { fee: 0, discountFee: 0, duration: "", validityDays: 0, level: "Beginner", curriculum: [], learners: 0 };
  const side = html.slice(html.indexOf("tutor-single-course-sidebar"));
  const prices = [...side.matchAll(/(\d[\d,]*\.?\d*)<\/bdi>/g)].map((m) => Math.round(Number(m[1].replace(/,/g, ""))));
  if (/regular-price|<del/.test(side.slice(0, 3000)) && prices.length >= 2) {
    out.fee = Math.max(prices[0], prices[1]);
    out.discountFee = Math.min(prices[0], prices[1]);
  } else if (prices.length) {
    out.fee = out.discountFee = prices[0];
  }
  const dur = text(side).match(/Duration\s+([\d.]+\s*(?:hours?|minutes?|mins?|days?))/i);
  if (dur) out.duration = dur[1];
  const val = text(side).match(/validity:\s*(\d+)\s*days?/i);
  if (val) out.validityDays = Number(val[1]);
  const lvl = text(html).match(/\b(All Levels|Beginner|Intermediate|Advanced|Expert)\b/);
  if (lvl) out.level = { "All Levels": "Beginner", Expert: "Advanced" }[lvl[1]] ?? lvl[1];
  const enrolled = text(html).match(/(\d[\d,]*)\s+Students/);
  if (enrolled) out.learners = Number(enrolled[1].replace(/,/g, ""));

  const accStart = html.indexOf('class="tutor-accordion"');
  if (accStart > -1) {
    const acc = html.slice(accStart, html.indexOf("</form>", accStart) > -1 ? undefined : undefined);
    const items = acc.split(/<div class="tutor-accordion-item"/).slice(1);
    for (const it of items) {
      const title = text(it.match(/tutor-accordion-item-header[^>]*>([\s\S]*?)<\/h4>/)?.[1] ?? "Section");
      const lessons = [...it.matchAll(/<li class="tutor-course-content-list-item">([\s\S]*?)<\/li>/g)].map((m) => {
        const li = m[1];
        const lt = text(li.match(/list-item-title">([\s\S]*?)<\/h5>/)?.[1] ?? "");
        const type = /question-mark|quiz/i.test(li) ? "quiz" : /youtube|play|video/i.test(li) ? "video" : "document";
        const d = li.match(/item-duration[^>]*>\s*([\d:]+)/);
        let durationMinutes = 0;
        if (d) {
          const parts = d[1].split(":").map(Number);
          durationMinutes = parts.length === 3 ? parts[0] * 60 + parts[1] : parts[0];
        }
        return { id: slugify(lt).slice(0, 60) || `lesson-${Math.random().toString(36).slice(2, 8)}`, title: lt, type, durationMinutes, isPreview: !/icon-lock/.test(li) };
      }).filter((l) => l.title);
      if (title && lessons.length) out.curriculum.push({ title, lessons });
    }
    // de-dupe lesson ids within the course
    const seen = new Set();
    for (const s of out.curriculum) for (const l of s.lessons) { let id = l.id, n = 2; while (seen.has(id)) id = `${l.id}-${n++}`; seen.add(id); l.id = id; }
  }
  return out;
}

// ---- main ------------------------------------------------------------------
const cats = await (await get(`${SITE}/wp-json/wp/v2/course-category?per_page=100&_fields=id,name,slug,parent`)).json();
const byId = Object.fromEntries(cats.map((c) => [c.id, c]));
const TYPE_BY_ROOT = { courses: "classes", "mock-test-series": "mock-test", webinars: "webinar" };
const rootOf = (id) => { let c = byId[id]; while (c?.parent) c = byId[c.parent]; return c; };

const tags = await (await get(`${SITE}/wp-json/wp/v2/course-tag?per_page=100&_fields=id,name`)).json();
const tagName = Object.fromEntries(tags.map((t) => [t.id, decode(t.name)]));

const list = [];
for (let page = 1; ; page++) {
  const res = await get(`${SITE}/wp-json/wp/v2/courses?per_page=50&page=${page}&_embed=wp:featuredmedia&status=publish`);
  list.push(...(await res.json()));
  if (page >= Number(res.headers.get("x-wp-totalpages") ?? 1)) break;
}
console.log(`Found ${list.length} items on ${SITE}`);

const docs = [];
const CONCURRENCY = 8;
async function build(c) {
  const catIds = c["course-category"] ?? [];
  const roots = catIds.map(rootOf).filter(Boolean);
  const root = roots.find((r) => TYPE_BY_ROOT[r.slug]) ?? roots[0];
  const sub = catIds.map((id) => byId[id]).find((x) => x && x.parent);
  const rawTitle = decode(c.title.rendered);
  let type = TYPE_BY_ROOT[root?.slug];
  let category = decode(sub?.name ?? "");
  if (!type) {
    // Uncategorised on WordPress — infer from the title.
    type = /webinar|decoding|analyzing/i.test(rawTitle) ? "webinar" : /mock test|quiz|practice test/i.test(rawTitle) ? "mock-test" : "classes";
  }
  if (!category) category = type === "webinar" ? "Webinars" : /free/i.test(rawTitle) ? "Free Practice" : "General";
  if (type === "webinar") category = "Webinars";
  let single = {};
  try { single = parseSingle(await (await get(c.link)).text()); } catch (e) { console.warn("  ! single page failed", c.slug, e.message); }
  const title = decode(c.title.rendered).replace(/\s+/g, " ").trim();
  const image = c._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? "";
  const quizCount = (single.curriculum ?? []).flatMap((s) => s.lessons).filter((l) => l.type === "quiz").length;
  const doc = {
    title: title.slice(0, 120),
    slug: c.slug,
    type,
    category,
    tags: (c["course-tag"] ?? []).map((id) => tagName[id]).filter(Boolean),
    tagline: text(c.excerpt?.rendered ?? "").slice(0, 200),
    description: toMarkdown(c.content?.rendered ?? "").slice(0, 5000),
    image,
    duration: single.duration || (type === "webinar" ? "Live session" : ""),
    validityDays: single.validityDays ?? 0,
    level: single.level ?? "Beginner",
    fee: single.fee ?? 0,
    discountFee: single.discountFee ?? 0,
    learners: single.learners ?? 0,
    curriculum: single.curriculum ?? [],
    syllabus: (single.curriculum ?? []).map((s) => ({ title: s.title, topics: s.lessons.map((l) => l.title) })),
    mode: "online",
    formats: type === "webinar" ? ["live-online"] : ["live-online", "self-paced"],
    certificate: type !== "webinar",
    featured: false,
    rating: 4.8,
    reviewCount: 0,
    prerequisites: [],
    outcomes: [],
    nextBatch: "",
    trainerSlug: "",
    isPublished: c.status === "publish",
    source: "airship",
    sourceUrl: c.link,
    sourceId: c.id,
    sourceDate: new Date(c.date_gmt + "Z"),
  };
  console.log(`  ${type.padEnd(9)} ${category.padEnd(16)} ₹${doc.discountFee}${doc.fee !== doc.discountFee ? ` (was ₹${doc.fee})` : ""}  ${quizCount ? quizCount + " quizzes " : ""}${doc.duration ? doc.duration + " " : ""}| ${title}`);
  return doc;
}
let cursor = 0;
await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
  while (cursor < list.length) docs.push(await build(list[cursor++]));
}));

if (DRY) { fs.writeFileSync("airship-import.json", JSON.stringify(docs, null, 2)); console.log("dry run → airship-import.json"); process.exit(0); }

await mongoose.connect(uri, { dbName: "axcvia" });
const Course = mongoose.models.Course ?? mongoose.model("Course", new mongoose.Schema({}, { strict: false, collection: "courses", timestamps: true }));
let n = 0;
for (const d of docs) {
  await Course.updateOne({ slug: d.slug }, { $set: d }, { upsert: true });
  n++;
}
console.log(`Upserted ${n} courses`);

if (args.has("--hide-seed")) {
  const { courses } = await import("../lib/data/courses.ts").catch(() => ({ courses: null }));
  const seedSlugs = courses
    ? courses.map((c) => c.slug)
    : [...fs.readFileSync(path.resolve("lib/data/courses.ts"), "utf8").matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  for (const slug of seedSlugs) {
    const exists = await Course.findOne({ slug, source: "airship" }).lean();
    if (exists) continue;
    await Course.updateOne({ slug }, { $set: { isPublished: false }, $setOnInsert: { slug, title: slug, category: "Demo", source: "seed-hidden" } }, { upsert: true });
  }
  console.log(`Hid ${seedSlugs.length} demo seed courses (re-publish them from /admin/courses if needed)`);
  // Demo landing pages / bundle / sample quiz that ship with the starter seed.
  const lms = fs.readFileSync(path.resolve("lib/data/lms.ts"), "utf8");
  const slugsIn = (from, to) => [...lms.slice(lms.indexOf(from), to ? lms.indexOf(to) : undefined).matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
  const seedSets = [
    ["landingpages", slugsIn("export const landingPages")],
    ["bundles", slugsIn("export const bundles", "export const landingPages")],
    ["quizzes", slugsIn("export const quizzes", "export const bundles")],
  ];
  for (const [collection, slugs] of seedSets) {
    const M = mongoose.model(`Hide_${collection}`, new mongoose.Schema({}, { strict: false, collection }));
    for (const slug of slugs) {
      if (await M.findOne({ slug, source: "airship" }).lean()) continue;
      await M.updateOne({ slug }, { $set: { isPublished: false }, $setOnInsert: { slug, title: slug, source: "seed-hidden" } }, { upsert: true });
    }
    console.log(`Hid ${slugs.length} demo ${collection}`);
  }
}
await mongoose.disconnect();
