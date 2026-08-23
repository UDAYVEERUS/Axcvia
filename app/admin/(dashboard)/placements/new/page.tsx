import type { Metadata } from "next";
import { PlacementForm } from "@/components/admin/placement-form";

export const metadata: Metadata = { title: "Add Placement" };

export default async function NewPlacementPage({ searchParams }: PageProps<"/admin/placements/new">) {
  const { error } = await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Add Placement</h1>
      <p className="text-sm text-muted-foreground">Appears on the website immediately after saving.</p>
      <div className="mt-6 rounded-xl border bg-card p-6">
        <PlacementForm error={typeof error === "string" ? error : undefined} />
      </div>
    </div>
  );
}
