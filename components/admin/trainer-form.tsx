import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/admin/image-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FormErrors } from "@/components/admin/admin-shell";
import { saveTrainerAction } from "@/app/admin/actions";
import type { Trainer } from "@/lib/types";

export function TrainerForm({ trainer, originalSlug, error }: { trainer?: Trainer; originalSlug?: string; error?: string }) {
  return (
    <form action={saveTrainerAction} className="space-y-6">
      {originalSlug && <input type="hidden" name="originalSlug" value={originalSlug} />}
      <FormErrors error={error} required="Name is" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" name="name" required defaultValue={trainer?.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug</Label>
          <Input id="slug" name="slug" defaultValue={trainer?.slug} placeholder="auto-generated from name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role / Title</Label>
          <Input id="role" name="role" defaultValue={trainer?.role} placeholder="Lead Trainer — Java & Spring" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experienceYears">Years of experience</Label>
          <Input id="experienceYears" name="experienceYears" type="number" min="0" defaultValue={trainer?.experienceYears} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn URL</Label>
          <Input id="linkedin" name="linkedin" type="url" defaultValue={trainer?.linkedin} />
        </div>
      </div>
      <ImageUpload name="photo" label="Photo" folder="trainers" shape="square" defaultValue={trainer?.photo} hint="Square portrait works best." />
      <div className="space-y-2">
        <Label htmlFor="expertise">Expertise (comma-separated)</Label>
        <Input id="expertise" name="expertise" defaultValue={trainer?.expertise.join(", ")} placeholder="React, Node.js, System Design" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" name="bio" rows={4} defaultValue={trainer?.bio} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked className="size-4 accent-teal" />
        Published (visible on website)
      </label>
      <Button type="submit" size="lg" className="bg-teal text-white hover:bg-teal/90">Save Trainer</Button>
    </form>
  );
}
