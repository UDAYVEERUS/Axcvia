// Build placeholder quiz shells and complete curriculum outlines for the
// Airship-imported courses, WITHOUT touching any gated/paid Airship content.
//
//   node scripts/build-shells.mjs --dry   # report only, write nothing
//   node scripts/build-shells.mjs         # write to MongoDB
//
// Phase A — Quiz shells:
//   For every quiz-type lesson already in a course's curriculum (scraped from
//   Airship's PUBLIC course sidebar), create a Quiz document with placeholder
//   questions and link the lesson to it via `quizSlug`. This reproduces
//   Airship's structure and per-series test counts (e.g. "A320 Systems — 58
//   tests", "DGCA Combined — 276") so the demo looks complete. Every question
//   is clearly a placeholder to replace in Admin → Quizzes.
//
// Phase B — Curriculum completion:
//   Pull the PUBLIC lesson list (wp/v2/lesson — titles only, 1,218 of them),
//   map each to its course by URL slug, and append any lesson title missing
//   from the scraped curriculum. No video URLs or gated content are fetched.

import fs from "node:fs";
import mongoose from "mongoose";

const DRY = process.argv.includes("--dry");
const SITE = "https://www.airshipaviation.com";
const PLACEHOLDER_Q = 5; // placeholder questions per quiz shell

// ---- env ----
const env = fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8") : "";
const uri = (process.env.MONGODB_URI || (env.match(/MONGODB_URI=(.+)/) || [])[1] || "").trim().replace(/^["']|["']$/g, "");
if (!uri && !DRY) {
  console.error("MONGODB_URI missing (set it in .env.local)");
  process.exit(1);
}

// ---- helpers ----
const norm = (s) => String(s).toLowerCase().replace(/&amp;/g, "&").replace(/[^a-z0-9]+/g, " ").trim();
const slugify = (s) =>
  String(s).toLowerCase().replace(/&amp;/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 90);

async function get(url, tries = 5) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(url, { headers: { "user-agent": "Mozilla/5.0" } });
      const t = await r.text();
      if (!r.ok) throw new Error("HTTP " + r.status);
      return t;
    } catch (e) {
      if (i === tries - 1) throw e;
      await new Promise((s) => setTimeout(s, 800 * (i + 1)));
    }
  }
}

function placeholderQuestions(title) {
  return Array.from({ length: PLACEHOLDER_Q }, (_, i) => ({
    text: `${title} — sample question ${i + 1} (placeholder — replace in Admin → Quizzes)`,
    options: ["Option A", "Option B", "Option C", "Option D"],
    correctIndex: 0,
    explanation: "Placeholder question. Add the real question, options and explanation in the admin.",
  }));
}

// ---- fetch public lessons (titles only) ----
async function fetchPublicLessons() {
  const per = 100;
  let page = 1;
  const all = [];
  while (true) {
    const arr = JSON.parse(await get(`${SITE}/wp-json/wp/v2/lesson?per_page=${per}&page=${page}&_fields=id,title,link,menu_order`));
    if (!arr.length) break;
    all.push(...arr);
    if (arr.length < per) break;
    page++;
  }
  const bySlug = {};
  for (const l of all) {
    const m = (l.link || "").match(/\/courses\/([^/]+)\/lesson\//);
    if (!m) continue;
    (bySlug[m[1]] ??= []).push({
      title: ((l.title && l.title.rendered) || "").trim(),
      order: l.menu_order ?? 0,
    });
  }
  return { total: all.length, bySlug };
}

// ---- main ----
console.log(`build-shells ${DRY ? "(dry run)" : ""}`);
console.log("Fetching public lesson titles…");
const { total: lessonTotal, bySlug: publicLessons } = await fetchPublicLessons();
console.log(`  ${lessonTotal} public lessons across ${Object.keys(publicLessons).length} courses`);

if (!DRY) await mongoose.connect(uri, { dbName: "axcvia", serverSelectionTimeoutMS: 15000 });

// loose models on the real collections (bypass strict schema, like import-airship.mjs)
const Course = DRY ? null : (mongoose.models.Course ?? mongoose.model("Course", new mongoose.Schema({}, { strict: false, collection: "courses", timestamps: true })));
const Quiz = DRY ? null : (mongoose.models.Quiz ?? mongoose.model("Quiz", new mongoose.Schema({}, { strict: false, collection: "quizzes", timestamps: true })));

// pull airship courses (from DB when writing; for dry run we still need them, so require DB)
let courses = [];
if (uri) {
  if (DRY) await mongoose.connect(uri, { dbName: "axcvia", serverSelectionTimeoutMS: 15000 });
  const C = mongoose.connection.collection("courses");
  courses = await C.find({ source: "airship" }).project({ slug: 1, title: 1, type: 1, curriculum: 1 }).toArray();
}
console.log(`  ${courses.length} airship courses loaded`);

const quizOps = [];
const courseOps = [];
const usedQuizSlugs = new Set();
let quizShells = 0,
  lessonsAppended = 0,
  coursesTouched = 0;
const perSeries = [];

for (const c of courses) {
  let changed = false;
  const curriculum = (c.curriculum || []).map((s) => ({ title: s.title, lessons: [...(s.lessons || [])] }));

  // Phase A: quiz shells for every quiz lesson
  let seriesQuizzes = 0;
  for (const section of curriculum) {
    for (const lesson of section.lessons) {
      if (lesson.type !== "quiz") continue;
      let qslug = slugify(`${c.slug}-${lesson.id || lesson.title}`);
      let n = 2;
      while (usedQuizSlugs.has(qslug)) qslug = `${slugify(`${c.slug}-${lesson.id || lesson.title}`)}-${n++}`;
      usedQuizSlugs.add(qslug);

      const title = (lesson.title || "Mock Test").slice(0, 160);
      const quizDoc = {
        slug: qslug,
        title,
        description: `Placeholder mock test for "${c.title}". Replace the questions in Admin → Quizzes.`,
        courseSlug: c.slug,
        durationMinutes: 20,
        passingPercent: 60,
        isFreeSample: Boolean(lesson.isPreview),
        shuffle: true,
        questions: placeholderQuestions(title),
        isPublished: true,
        source: "airship-shell",
      };
      quizOps.push({
        updateOne: {
          filter: { slug: qslug },
          // never clobber real questions added later in admin
          update: {
            $set: {
              title: quizDoc.title,
              courseSlug: quizDoc.courseSlug,
              isFreeSample: quizDoc.isFreeSample,
              source: quizDoc.source,
            },
            $setOnInsert: {
              slug: quizDoc.slug,
              description: quizDoc.description,
              durationMinutes: quizDoc.durationMinutes,
              passingPercent: quizDoc.passingPercent,
              shuffle: quizDoc.shuffle,
              questions: quizDoc.questions,
              isPublished: quizDoc.isPublished,
            },
          },
          upsert: true,
        },
      });
      quizShells++;
      seriesQuizzes++;
      if (lesson.quizSlug !== qslug) {
        lesson.quizSlug = qslug;
        changed = true;
      }
    }
  }
  if (seriesQuizzes) perSeries.push({ slug: c.slug, type: c.type, tests: seriesQuizzes });

  // Phase B: append missing public lesson titles
  const present = new Set(curriculum.flatMap((s) => s.lessons).map((l) => norm(l.title)));
  const apiLessons = (publicLessons[c.slug] || []).slice().sort((a, b) => a.order - b.order);
  const missing = apiLessons.filter((l) => l.title && !present.has(norm(l.title)));
  if (missing.length) {
    const seen = new Set([...curriculum.flatMap((s) => s.lessons).map((l) => l.id)]);
    const extra = missing.map((l) => {
      let id = slugify(l.title).slice(0, 60) || "lesson";
      let n = 2;
      while (seen.has(id)) id = `${slugify(l.title).slice(0, 58)}-${n++}`;
      seen.add(id);
      return { id, title: l.title, type: "video", durationMinutes: 0, isPreview: false, quizSlug: "" };
    });
    // reuse an existing "More Lessons" section if the script ran before
    let extraSection = curriculum.find((s) => s.title === "More Lessons");
    if (extraSection) extraSection.lessons.push(...extra);
    else curriculum.push({ title: "More Lessons", lessons: extra });
    lessonsAppended += extra.length;
    changed = true;
  }

  if (changed) {
    coursesTouched++;
    courseOps.push({ updateOne: { filter: { slug: c.slug }, update: { $set: { curriculum } } } });
  }
}

perSeries.sort((a, b) => b.tests - a.tests);
console.log(`\nPhase A — quiz shells: ${quizShells} across ${perSeries.length} courses`);
for (const p of perSeries.slice(0, 12)) console.log(`   ${String(p.tests).padStart(4)} tests  [${p.type}] ${p.slug}`);
console.log(`Phase B — curriculum: ${lessonsAppended} public lesson titles appended`);
console.log(`Courses updated: ${coursesTouched}`);

if (DRY) {
  console.log("\nDry run — nothing written.");
  await mongoose.disconnect().catch(() => {});
  process.exit(0);
}

console.log("\nWriting…");
for (let i = 0; i < quizOps.length; i += 500) {
  await Quiz.bulkWrite(quizOps.slice(i, i + 500), { ordered: false });
  process.stdout.write(`  quizzes ${Math.min(i + 500, quizOps.length)}/${quizOps.length}\r`);
}
console.log("");
if (courseOps.length) await Course.bulkWrite(courseOps, { ordered: false });
console.log(`Done: ${quizShells} quiz shells, ${lessonsAppended} lessons appended, ${coursesTouched} courses updated.`);
await mongoose.disconnect();
