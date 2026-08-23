import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormErrors } from "@/components/admin/admin-shell";
import { savePlacementAction } from "@/app/admin/actions";
import type { PlacementStory } from "@/lib/types";

export function PlacementForm({ item, originalSlug, error }: { item?: PlacementStory; originalSlug?: string; error?: string }) {
  return (
    <form action={savePlacementAction} className="space-y-6">
      {originalSlug && <input type="hidden" name="originalSlug" value={originalSlug} />}
      <FormErrors error={error} required="Student name and company are" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="studentName">Student Name *</Label>
          <Input id="studentName" name="studentName" required defaultValue={item?.studentName} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={item?.slug} placeholder="auto-generated" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="background">Background</Label>
          <Input id="background" name="background" defaultValue={item?.background} placeholder="B.Com graduate" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="courseTitle">Course</Label>
          <Input id="courseTitle" name="courseTitle" defaultValue={item?.courseTitle} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <Input id="company" name="company" required defaultValue={item?.company} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input id="role" name="role" defaultValue={item?.role} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="packageLpa">Package (LPA)</Label>
          <Input id="packageLpa" name="packageLpa" type="number" step="0.1" min="0" defaultValue={item?.packageLpa} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input id="year" name="year" type="number" defaultValue={item?.year ?? new Date().getFullYear()} />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked className="size-4 accent-teal" />
        Published (visible on website)
      </label>
      <Button type="submit" size="lg" className="bg-teal text-white hover:bg-teal/90">Save Placement</Button>
    </form>
  );
}
