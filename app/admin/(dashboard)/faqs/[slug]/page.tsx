import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { FaqForm } from "@/components/admin/faq-form";
import { getAllFaqs } from "@/lib/services/faqs";
import { faqs as seed } from "@/lib/data/people";

export const metadata: Metadata = { title: "Edit FAQ" };

export default async function EditFaqPage({ params, searchParams }: PageProps<"/admin/faqs/[slug]">) {
  const { slug } = await params;
  const { error } = await searchParams;
  const item = (await getAllFaqs()).find((i) => i.slug === slug);
  if (!item) notFound();
  const isSeed = seed.some((s) => s.slug === slug);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-navy">Edit FAQ</h1>
        {isSeed && (
          <Badge variant="outline" className="text-muted-foreground">
            Seeded entry — saving creates a database override
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground">/faq · {slug}</p>
      <div className="mt-6 rounded-xl border bg-card p-6">
        <FaqForm item={item} originalSlug={slug} error={typeof error === "string" ? error : undefined} />
      </div>
    </div>
  );
}
