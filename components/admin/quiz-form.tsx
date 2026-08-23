import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormErrors, selectCls } from "@/components/admin/admin-shell";
import { QuizBuilder } from "@/components/admin/quiz-builder";
import { saveQuizAction } from "@/app/admin/actions";
import { getCourseOptions } from "@/lib/services/courses";
import type { Quiz } from "@/lib/types";

export async function QuizForm({ item, originalSlug, error }: { item?: Quiz; originalSlug?: string; error?: string }) {
  const courses = await getCourseOptions();
  return (
    <form action={saveQuizAction} className="space-y-6">
      {originalSlug && <input type="hidden" name="originalSlug" value={originalSlug} />}
      <FormErrors error={error} required="Title is" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="title">Quiz title *</Label><Input id="title" name="title" required defaultValue={item?.title} placeholder="Java Mock Test 1" /></div>
        <div className="space-y-2"><Label htmlFor="slug">Slug</Label><Input id="slug" name="slug" defaultValue={item?.slug} placeholder="auto-generated" /></div>
        <div className="space-y-2">
          <Label htmlFor="courseSlug">Belongs to course / test series</Label>
          <select id="courseSlug" name="courseSlug" defaultValue={item?.courseSlug ?? ""} className={selectCls}>
            <option value="">— None (standalone) —</option>
            {courses.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2"><Label htmlFor="durationMinutes">Time limit (min, 0 = none)</Label><Input id="durationMinutes" name="durationMinutes" type="number" min="0" defaultValue={item?.durationMinutes ?? 30} /></div>
          <div className="space-y-2"><Label htmlFor="passingPercent">Pass mark (%)</Label><Input id="passingPercent" name="passingPercent" type="number" min="0" max="100" defaultValue={item?.passingPercent ?? 60} /></div>
        </div>
      </div>
      <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" rows={2} defaultValue={item?.description} /></div>
      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" name="isFreeSample" defaultChecked={item?.isFreeSample} className="size-4 accent-teal" /> Free sample (any registered student can attempt)</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="shuffle" defaultChecked={item?.shuffle ?? true} className="size-4 accent-teal" /> Shuffle question order</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="isPublished" defaultChecked className="size-4 accent-teal" /> Published</label>
      </div>
      <div className="space-y-2"><Label>Questions</Label><QuizBuilder name="questions" initial={item?.questions ?? []} /></div>
      <Button type="submit" size="lg" className="bg-teal text-white hover:bg-teal/90">Save Quiz</Button>
    </form>
  );
}
