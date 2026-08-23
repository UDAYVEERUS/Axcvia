import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/image-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormErrors, selectCls } from "@/components/admin/admin-shell";
import { saveBlogPostAction } from "@/app/admin/actions";
import { getCourseOptions } from "@/lib/services/courses";
import { getAllTrainers } from "@/lib/services/trainers";
import { BLOG_CATEGORIES, type BlogPost } from "@/lib/types";

export async function BlogForm({
  post,
  originalSlug,
  error,
}: {
  post?: BlogPost;
  originalSlug?: string;
  error?: string;
}) {
  const [trainers, courses] = await Promise.all([getAllTrainers(), getCourseOptions()]);
  const publishedDate = (post?.publishedAt ?? new Date().toISOString()).slice(0, 10);

  return (
    <form action={saveBlogPostAction} className="space-y-6">
      {originalSlug && <input type="hidden" name="originalSlug" value={originalSlug} />}
      <FormErrors error={error} required="Title is" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" name="title" required defaultValue={post?.title} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug</Label>
          <Input id="slug" name="slug" defaultValue={post?.slug} placeholder="auto-generated from title" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input id="category" name="category" list="blog-category-options" defaultValue={post?.category ?? "Tutorials"} />
          <datalist id="blog-category-options">
            {BLOG_CATEGORIES.map((c) => <option key={c} value={c} />)}
          </datalist>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input id="tags" name="tags" defaultValue={post?.tags.join(", ")} placeholder="React, Interview Prep" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="authorSlug">Author (trainer)</Label>
          <select id="authorSlug" name="authorSlug" defaultValue={post?.authorSlug ?? ""} className={selectCls}>
            <option value="">— Custom author —</option>
            {trainers.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="authorName">Author name (if not a trainer)</Label>
          <Input id="authorName" name="authorName" defaultValue={post?.authorName} placeholder="Axcvia Team" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="publishedAt">Publish date</Label>
          <Input id="publishedAt" name="publishedAt" type="date" defaultValue={publishedDate} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="readingMinutes">Reading time (minutes)</Label>
          <Input id="readingMinutes" name="readingMinutes" type="number" min="1" defaultValue={post?.readingMinutes ?? 5} />
        </div>
      </div>

      <ImageUpload
        name="coverImage"
        label="Cover Image"
        folder="blog"
        defaultValue={post?.coverImage}
        hint="Recommended 1600×900. Upload a JPG/PNG or paste a URL."
      />

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt} placeholder="One or two sentences shown on cards and in search results" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content (Markdown)</Label>
        <Textarea id="content" name="content" rows={18} defaultValue={post?.content} className="font-mono text-sm" />
        <p className="text-xs text-muted-foreground">
          Supports # headings, paragraphs, - bullet and 1. numbered lists, &gt; quotes, ``` code blocks, | tables |,
          **bold**, *italic*, `code`, [links](/courses) and ![images](url).
        </p>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Courses to promote in this post</legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <label key={c.slug} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="relatedCourseSlugs"
                value={c.slug}
                defaultChecked={post?.relatedCourseSlugs.includes(c.slug)}
                className="size-4 accent-teal"
              />
              {c.title}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="featured" defaultChecked={post?.featured} className="size-4 accent-teal" />
          Featured
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isPublished" defaultChecked className="size-4 accent-teal" />
          Published (visible on website)
        </label>
      </div>

      <Button type="submit" size="lg" className="bg-teal text-white hover:bg-teal/90">Save Post</Button>
    </form>
  );
}
