import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flash } from "@/components/admin/admin-shell";
import { generateCoursesAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/admin/auth";
import { COURSE_BLUEPRINTS } from "@/lib/seo/course-blueprints";
import { getAllCourses } from "@/lib/services/courses";

export const metadata: Metadata = { title: "Generate courses" };

export default async function GenerateCoursesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requireAdmin();
  const { error } = await searchParams;
  const existing = new Set((await getAllCourses()).map((c) => c.slug));
  const available = COURSE_BLUEPRINTS.filter((b) => !existing.has(b.slug));

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="-ml-2 mb-3 text-muted-foreground">
        <Link href="/admin/courses"><ArrowLeft className="size-4" aria-hidden /> Back to courses</Link>
      </Button>
      <h1 className="flex items-center gap-2 text-2xl font-bold text-navy">
        <Sparkles className="size-5 text-teal" aria-hidden /> Generate course pages
      </h1>
      <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
        Each option below creates a complete, search-optimised course page: description, module-by-module curriculum,
        outcomes, prerequisites, tags, FAQs (published as FAQ structured data) and meta title/description. Topics are chosen
        for Indian hiring demand and for categories your catalog doesn&apos;t cover yet.
      </p>
      <p className="mt-3 max-w-3xl rounded-lg border border-teal/30 bg-teal/5 p-3 text-sm text-teal">
        Fee, next batch and trainer are left blank on purpose — the page shows &ldquo;Fee on request&rdquo; with a callback form
        until you fill them in. Nothing is overwritten: a topic you already have is hidden from this list.
      </p>

      {error === "nodb" && <Flash tone="error">MongoDB is not connected — set MONGODB_URI first.</Flash>}
      {error === "empty" && <Flash tone="error">Select at least one course to generate.</Flash>}

      {available.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed bg-card p-8 text-center text-sm text-muted-foreground">
          Every blueprint has already been created. Add more topics in <code className="font-mono">lib/seo/course-blueprints.ts</code>.
        </p>
      ) : (
        <form action={generateCoursesAction} className="mt-6 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {available.map((bp) => (
              <label
                key={bp.slug}
                className="flex cursor-pointer gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-teal/40 has-checked:border-teal has-checked:bg-teal/5"
              >
                <input type="checkbox" name="slugs" value={bp.slug} defaultChecked className="mt-1 size-4 shrink-0 accent-teal" />
                <span className="min-w-0">
                  <span className="block font-semibold text-navy">{bp.title}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">{bp.tagline}</span>
                  <span className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge variant="secondary">{bp.category}</Badge>
                    <Badge variant="outline">{bp.level}</Badge>
                    <Badge variant="outline">{bp.duration}</Badge>
                  </span>
                  <span className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><CheckCircle2 className="size-3 text-teal" aria-hidden /> {bp.syllabus.length} modules</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="size-3 text-teal" aria-hidden /> {bp.faqs.length} FAQs</span>
                    <span className="flex items-center gap-1"><CheckCircle2 className="size-3 text-teal" aria-hidden /> {bp.tags.length} tags</span>
                  </span>
                  <span className="mt-2 block truncate font-mono text-[11px] text-muted-foreground">/courses/{bp.slug}</span>
                </span>
              </label>
            ))}
          </div>
          <Button type="submit" size="lg" className="bg-teal text-white hover:bg-teal/90">
            <Sparkles className="size-4" aria-hidden /> Generate selected courses
          </Button>
        </form>
      )}
    </div>
  );
}
