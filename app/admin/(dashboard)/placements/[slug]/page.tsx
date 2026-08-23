import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { PlacementForm } from "@/components/admin/placement-form";
import { getAllPlacements } from "@/lib/services/placements";
import { placementStories as seed } from "@/lib/data/people";

export const metadata: Metadata = { title: "Edit Placement" };

export default async function EditPlacementPage({ params, searchParams }: PageProps<"/admin/placements/[slug]">) {
  const { slug } = await params;
  const { error } = await searchParams;
  const item = (await getAllPlacements()).find((i) => i.slug === slug);
  if (!item) notFound();
  const isSeed = seed.some((s) => s.slug === slug);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-navy">Edit Placement</h1>
        {isSeed && (
          <Badge variant="outline" className="text-muted-foreground">
            Seeded entry — saving creates a database override
          </Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground">/placements · {slug}</p>
      <div className="mt-6 rounded-xl border bg-card p-6">
        <PlacementForm item={item} originalSlug={slug} error={typeof error === "string" ? error : undefined} />
      </div>
    </div>
  );
}
