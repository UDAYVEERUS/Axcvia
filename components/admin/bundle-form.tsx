import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormErrors } from "@/components/admin/admin-shell";
import { ImageUpload } from "@/components/admin/image-upload";
import { saveBundleAction } from "@/app/admin/actions";
import { getCourseOptions } from "@/lib/services/courses";
import type { Bundle } from "@/lib/types";

export async function BundleForm({ item, originalSlug, error }: { item?: Bundle; originalSlug?: string; error?: string }) {
  const courses = await getCourseOptions();
  return (
    <form action={saveBundleAction} className="space-y-6">
      {originalSlug && <input type="hidden" name="originalSlug" value={originalSlug} />}
      <FormErrors error={error} required="Title is" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="title">Bundle title *</Label><Input id="title" name="title" required defaultValue={item?.title} /></div>
        <div className="space-y-2"><Label htmlFor="slug">Slug</Label><Input id="slug" name="slug" defaultValue={item?.slug} placeholder="auto-generated" /></div>
        <div className="space-y-2"><Label htmlFor="price">List price (₹)</Label><Input id="price" name="price" type="number" min="0" defaultValue={item?.price} /></div>
        <div className="space-y-2"><Label htmlFor="discountPrice">Selling price (₹)</Label><Input id="discountPrice" name="discountPrice" type="number" min="0" defaultValue={item?.discountPrice} /></div>
        <div className="space-y-2"><Label htmlFor="validityDays">Validity (days, 0 = lifetime)</Label><Input id="validityDays" name="validityDays" type="number" min="0" defaultValue={item?.validityDays ?? 0} /></div>
      </div>
      <div className="space-y-2"><Label htmlFor="tagline">Tagline</Label><Input id="tagline" name="tagline" defaultValue={item?.tagline} /></div>
      <ImageUpload name="image" label="Cover image" folder="courses" defaultValue={item?.image} />
      <div className="space-y-2"><Label htmlFor="description">Description (Markdown)</Label><Textarea id="description" name="description" rows={5} defaultValue={item?.description} /></div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Courses in this bundle</legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (<label key={c.slug} className="flex items-center gap-2 text-sm"><input type="checkbox" name="courseSlugs" value={c.slug} defaultChecked={item?.courseSlugs.includes(c.slug)} className="size-4 accent-teal" /> {c.title}</label>))}
        </div>
      </fieldset>
      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={item?.featured} className="size-4 accent-teal" /> Featured</label>
        <label className="flex items-center gap-2"><input type="checkbox" name="isPublished" defaultChecked className="size-4 accent-teal" /> Published</label>
      </div>
      <Button type="submit" size="lg" className="bg-teal text-white hover:bg-teal/90">Save Bundle</Button>
    </form>
  );
}
