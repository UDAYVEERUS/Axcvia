import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormErrors } from "@/components/admin/admin-shell";
import { saveFaqAction } from "@/app/admin/actions";
import type { Faq } from "@/lib/types";

export function FaqForm({ item, originalSlug, error }: { item?: Faq; originalSlug?: string; error?: string }) {
  return (
    <form action={saveFaqAction} className="space-y-6">
      {originalSlug && <input type="hidden" name="originalSlug" value={originalSlug} />}
      <FormErrors error={error} required="Question and answer are" />
      <div className="space-y-2">
        <Label htmlFor="question">Question *</Label>
        <Input id="question" name="question" required defaultValue={item?.question} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" list="faq-category-options" defaultValue={item?.category ?? "General"} />
          <datalist id="faq-category-options">
            {["General", "Courses", "Placements", "Payments"].map((c) => <option key={c} value={c} />)}
          </datalist>
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={item?.slug} placeholder="auto-generated" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="answer">Answer *</Label>
        <Textarea id="answer" name="answer" rows={4} required defaultValue={item?.answer} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked className="size-4 accent-teal" />
        Published (visible on website)
      </label>
      <Button type="submit" size="lg" className="bg-teal text-white hover:bg-teal/90">Save FAQ</Button>
    </form>
  );
}
