import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { TrainerForm } from "@/components/admin/trainer-form";
import { getTrainerBySlug } from "@/lib/services/trainers";
import { trainers as seed } from "@/lib/data/people";

export const metadata: Metadata = { title: "Edit Trainer" };

export default async function EditTrainerPage({ params, searchParams }: PageProps<"/admin/trainers/[slug]">) {
  const { slug } = await params;
  const { error } = await searchParams;
  const item = await getTrainerBySlug(slug);
  if (!item) notFound();
  const isSeed = seed.some((s) => s.slug === slug);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-navy">Edit Trainer</h1>
        {isSeed && (
          <Badge variant="outline" className="text-muted-foreground">
            Seeded entry — saving creates a database override
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground">/trainers · {slug}</p>
      <div className="mt-6 rounded-xl border bg-card p-6">
        <TrainerForm trainer={item} originalSlug={slug} error={typeof error === "string" ? error : undefined} />
      </div>
    </div>
  );
}
