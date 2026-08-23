import type { Metadata } from "next";
import { TrainerForm } from "@/components/admin/trainer-form";

export const metadata: Metadata = { title: "Add Trainer" };

export default async function NewTrainerPage({ searchParams }: PageProps<"/admin/trainers/new">) {
  const { error } = await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Add Trainer</h1>
      <p className="text-sm text-muted-foreground">Appears on the website immediately after saving.</p>
      <div className="mt-6 rounded-xl border bg-card p-6">
        <TrainerForm error={typeof error === "string" ? error : undefined} />
      </div>
    </div>
  );
}
