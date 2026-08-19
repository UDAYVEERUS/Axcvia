import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveCourseAction } from "@/app/admin/actions";
import { trainers } from "@/lib/data/people";
import { COURSE_CATEGORIES, type Course } from "@/lib/types";

function syllabusToText(course?: Course) {
  return (course?.syllabus ?? [])
    .map((m) => `${m.title} | ${m.topics.join(", ")}`)
    .join("\n");
}

export function CourseForm({
  course,
  originalSlug,
  error,
}: {
  course?: Course;
  originalSlug?: string;
  error?: string;
}) {
  const selectCls =
    "border-input h-9 w-full rounded-lg border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50";

  return (
    <form action={saveCourseAction} className="space-y-6">
      {originalSlug && <input type="hidden" name="originalSlug" value={originalSlug} />}

      {error === "missing" && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          Title and category are required.
        </p>
      )}
      {error === "duplicate" && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          A course with this slug already exists. Edit it instead, or choose a different slug.
        </p>
      )}
      {error === "nodb" && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          MongoDB is not connected — set MONGODB_URI before saving courses.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Course Title *</Label>
          <Input id="title" name="title" required defaultValue={course?.title} placeholder="e.g. Java Backend Development" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug</Label>
          <Input id="slug" name="slug" defaultValue={course?.slug} placeholder="auto-generated from title" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Input id="category" name="category" required list="category-options" defaultValue={course?.category} placeholder="e.g. Programming" />
          <datalist id="category-options">
            {COURSE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} />
            ))}
          </datalist>
        </div>
        <div className="space-y-2">
          <Label htmlFor="trainerSlug">Trainer</Label>
          <select id="trainerSlug" name="trainerSlug" defaultValue={course?.trainerSlug ?? ""} className={selectCls}>
            <option value="">— None —</option>
            {trainers.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tagline">Tagline</Label>
        <Input id="tagline" name="tagline" defaultValue={course?.tagline} placeholder="One-line pitch shown on cards" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={4} defaultValue={course?.description} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input id="duration" name="duration" defaultValue={course?.duration} placeholder="e.g. 4 months" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mode">Mode</Label>
          <select id="mode" name="mode" defaultValue={course?.mode ?? "hybrid"} className={selectCls}>
            <option value="hybrid">Classroom + Online</option>
            <option value="offline">Classroom only</option>
            <option value="online">Online only</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="level">Level</Label>
          <select id="level" name="level" defaultValue={course?.level ?? "Beginner"} className={selectCls}>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="fee">Fee (₹)</Label>
          <Input id="fee" name="fee" type="number" min="0" defaultValue={course?.fee} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountFee">Discounted Fee (₹)</Label>
          <Input id="discountFee" name="discountFee" type="number" min="0" defaultValue={course?.discountFee} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nextBatch">Next Batch</Label>
          <Input id="nextBatch" name="nextBatch" defaultValue={course?.nextBatch} placeholder="e.g. 1 October 2026" />
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Available Formats</legend>
        <div className="flex flex-wrap gap-5 text-sm">
          {(
            [
              ["classroom", "Classroom"],
              ["live-online", "Live Online"],
              ["self-paced", "Self-Paced"],
            ] as const
          ).map(([value, label]) => (
            <label key={value} className="flex items-center gap-2">
              <input
                type="checkbox"
                name="formats"
                value={value}
                defaultChecked={course?.formats.includes(value) ?? value === "classroom"}
                className="size-4 accent-teal"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <Label htmlFor="syllabus">Curriculum</Label>
        <Textarea
          id="syllabus"
          name="syllabus"
          rows={6}
          defaultValue={syllabusToText(course)}
          placeholder={"One module per line:\nModule Title | topic 1, topic 2, topic 3"}
        />
        <p className="text-xs text-muted-foreground">
          One module per line — module title, then a pipe (|), then comma-separated topics.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="prerequisites">Prerequisites (one per line)</Label>
          <Textarea id="prerequisites" name="prerequisites" rows={3} defaultValue={course?.prerequisites.join("\n")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="outcomes">Outcomes (one per line)</Label>
          <Textarea id="outcomes" name="outcomes" rows={3} defaultValue={course?.outcomes.join("\n")} />
        </div>
      </div>

      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="featured" defaultChecked={course?.featured} className="size-4 accent-teal" />
          Featured on home page
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isPublished" defaultChecked className="size-4 accent-teal" />
          Published (visible on website)
        </label>
      </div>

      <Button type="submit" size="lg" className="bg-teal text-white hover:bg-teal/90">
        Save Course
      </Button>
    </form>
  );
}
