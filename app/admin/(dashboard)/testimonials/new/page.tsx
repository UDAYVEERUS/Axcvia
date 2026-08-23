import type { Metadata } from "next";
import { TestimonialForm } from "@/components/admin/testimonial-form";

export const metadata: Metadata = { title: "Add Testimonial" };

export default async function NewTestimonialPage({ searchParams }: PageProps<"/admin/testimonials/new">) {
  const { error } = await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Add Testimonial</h1>
      <p className="text-sm text-muted-foreground">Appears on the website immediately after saving.</p>
      <div className="mt-6 rounded-xl border bg-card p-6">
        <TestimonialForm error={typeof error === "string" ? error : undefined} />
      </div>
    </div>
  );
}
