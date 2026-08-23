import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormErrors } from "@/components/admin/admin-shell";
import { ImageUpload } from "@/components/admin/image-upload";
import { saveLandingPageAction } from "@/app/admin/actions";
import { getCourseOptions } from "@/lib/services/courses";
import { getAllBundles } from "@/lib/services/lms";
import type { LandingPage } from "@/lib/types";

export async function LandingPageForm({ item, originalSlug, error }: { item?: LandingPage; originalSlug?: string; error?: string }) {
  const [courses, bundles] = await Promise.all([getCourseOptions(), getAllBundles()]);
  return (
    <form action={saveLandingPageAction} className="space-y-6">
      {originalSlug && <input type="hidden" name="originalSlug" value={originalSlug} />}
      <FormErrors error={error} required="Title is" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="title">Page title * (shown in nav)</Label><Input id="title" name="title" required defaultValue={item?.title} placeholder="A320 Classes" /></div>
        <div className="space-y-2"><Label htmlFor="slug">URL slug (page lives at /slug)</Label><Input id="slug" name="slug" defaultValue={item?.slug} placeholder="a320-classes" /></div>
        <div className="space-y-2"><Label htmlFor="navGroup">Nav menu group</Label><Input id="navGroup" name="navGroup" defaultValue={item?.navGroup} placeholder="Classes / Mock Tests / Programmes" /></div>
        <div className="flex items-end pb-2"><label className="flex items-center gap-2 text-sm"><input type="checkbox" name="showInNav" defaultChecked={item?.showInNav} className="size-4 accent-teal" /> Show in main navigation</label></div>
      </div>
      <div className="grid gap-4 rounded-xl border bg-secondary/30 p-4 sm:grid-cols-2">
        <p className="text-sm font-semibold text-navy sm:col-span-2">SEO</p>
        <div className="space-y-2"><Label htmlFor="metaTitle">Meta title</Label><Input id="metaTitle" name="metaTitle" defaultValue={item?.metaTitle} /></div>
        <div className="space-y-2"><Label htmlFor="metaDescription">Meta description</Label><Input id="metaDescription" name="metaDescription" defaultValue={item?.metaDescription} maxLength={170} /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2"><Label htmlFor="eyebrow">Hero eyebrow</Label><Input id="eyebrow" name="eyebrow" defaultValue={item?.eyebrow} placeholder="Airline Preparation" /></div>
        <div className="space-y-2"><Label htmlFor="heroTitle">Hero title</Label><Input id="heroTitle" name="heroTitle" defaultValue={item?.heroTitle} /></div>
      </div>
      <div className="space-y-2"><Label htmlFor="heroText">Hero text</Label><Textarea id="heroText" name="heroText" rows={3} defaultValue={item?.heroText} /></div>
      <ImageUpload name="heroImage" label="Hero background image" folder="blog" defaultValue={item?.heroImage} />
      <div className="space-y-2">
        <Label htmlFor="highlights">Highlights (one per line: Title | text)</Label>
        <Textarea id="highlights" name="highlights" rows={3} defaultValue={item?.highlights.map((h) => `${h.title} | ${h.text}`).join("\n")} placeholder={"17+ Years | Expert tutors\n96% | Success rate"} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="sections">Content sections (Markdown — start each section with “## Heading”)</Label>
        <Textarea id="sections" name="sections" rows={12} defaultValue={item?.sections.map((s) => `## ${s.heading}\n${s.body}`).join("\n\n")} className="font-mono text-sm" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Courses to list</legend>
          <div className="max-h-56 space-y-1 overflow-y-auto rounded-lg border p-2">
            {courses.map((c) => (<label key={c.slug} className="flex items-center gap-2 text-sm"><input type="checkbox" name="courseSlugs" value={c.slug} defaultChecked={item?.courseSlugs.includes(c.slug)} className="size-4 accent-teal" /> {c.title}</label>))}
          </div>
          <Input name="courseTag" defaultValue={item?.courseTag} placeholder="…or list every course with this tag / category" />
        </fieldset>
        <fieldset className="space-y-2">
          <legend className="text-sm font-medium">Bundles to list</legend>
          <div className="space-y-1 rounded-lg border p-2">
            {bundles.map((b) => (<label key={b.slug} className="flex items-center gap-2 text-sm"><input type="checkbox" name="bundleSlugs" value={b.slug} defaultChecked={item?.bundleSlugs.includes(b.slug)} className="size-4 accent-teal" /> {b.title}</label>))}
            {bundles.length === 0 && <p className="text-xs text-muted-foreground">No bundles yet.</p>}
          </div>
        </fieldset>
      </div>
      <div className="space-y-2">
        <Label htmlFor="faqs">FAQs (one per line: Question | Answer)</Label>
        <Textarea id="faqs" name="faqs" rows={5} defaultValue={item?.faqs.map((f) => `${f.question} | ${f.answer}`).join("\n")} />
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="isPublished" defaultChecked className="size-4 accent-teal" /> Published</label>
      <Button type="submit" size="lg" className="bg-teal text-white hover:bg-teal/90">Save Page</Button>
    </form>
  );
}
