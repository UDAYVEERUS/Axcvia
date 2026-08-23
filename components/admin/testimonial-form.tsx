import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/image-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormErrors, selectCls } from "@/components/admin/admin-shell";
import { saveTestimonialAction } from "@/app/admin/actions";
import { getCourseOptions } from "@/lib/services/courses";
import type { Testimonial } from "@/lib/types";

export async function TestimonialForm({ item, originalSlug, error }: { item?: Testimonial; originalSlug?: string; error?: string }) {
  const courses = await getCourseOptions();
  return (
    <form action={saveTestimonialAction} className="space-y-6">
      {originalSlug && <input type="hidden" name="originalSlug" value={originalSlug} />}
      <FormErrors error={error} required="Student name and review text are" />
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
          <Label htmlFor="role">Current Role</Label>
          <Input id="role" name="role" defaultValue={item?.role} placeholder="Software Engineer" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" defaultValue={item?.company} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="courseSlug">Course</Label>
          <select id="courseSlug" name="courseSlug" defaultValue={item?.courseSlug ?? ""} className={selectCls}>
            <option value="">— None —</option>
            {courses.map((c) => <option key={c.slug} value={c.slug}>{c.title}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="courseTitle">Course title (as displayed)</Label>
          <Input id="courseTitle" name="courseTitle" defaultValue={item?.courseTitle} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="rating">Rating (1–5)</Label>
          <Input id="rating" name="rating" type="number" min="1" max="5" defaultValue={item?.rating ?? 5} />
        </div>
      </div>
      <ImageUpload name="avatar" label="Student Photo" folder="testimonials" shape="square" defaultValue={item?.avatar} hint="Optional — falls back to initials." />
      <div className="space-y-2">
        <Label htmlFor="videoUrl">Video review URL (YouTube / Vimeo / MP4, optional)</Label>
        <Input id="videoUrl" name="videoUrl" type="url" defaultValue={item?.videoUrl} placeholder="https://youtu.be/…" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Review headline</Label>
        <Input id="title" name="title" defaultValue={item?.title} placeholder="Small batch, big difference" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="text">Review *</Label>
        <Textarea id="text" name="text" rows={4} required defaultValue={item?.text} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked className="size-4 accent-teal" />
        Published (visible on website)
      </label>
      <Button type="submit" size="lg" className="bg-teal text-white hover:bg-teal/90">Save Testimonial</Button>
    </form>
  );
}
