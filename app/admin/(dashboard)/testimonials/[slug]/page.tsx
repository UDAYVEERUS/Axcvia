import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { TestimonialForm } from "@/components/admin/testimonial-form";
import { getAllTestimonials } from "@/lib/services/testimonials";
import { testimonials as seed } from "@/lib/data/people";

export const metadata: Metadata = { title: "Edit Testimonial" };

export default async function EditTestimonialPage({ params, searchParams }: PageProps<"/admin/testimonials/[slug]">) {
  const { slug } = await params;
  const { error } = await searchParams;
  const item = (await getAllTestimonials()).find((i) => i.slug === slug);
  if (!item) notFound();
  const isSeed = seed.some((s) => s.slug === slug);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-navy">Edit Testimonial</h1>
        {isSeed && (
          <Badge variant="outline" className="text-muted-foreground">
            Seeded entry — saving creates a database override
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground">/testimonials · {slug}</p>
      <div className="mt-6 rounded-xl border bg-card p-6">
        <TestimonialForm item={item} originalSlug={slug} error={typeof error === "string" ? error : undefined} />
      </div>
    </div>
  );
}
