import type { Metadata } from "next";
import { BundleForm } from "@/components/admin/bundle-form";

export const metadata: Metadata = { title: "Add Bundle" };

export default async function Page({ searchParams }: PageProps<"/admin/bundles/new">) {
  const { error } = await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Add Bundle</h1>
      <div className="mt-6 rounded-xl border bg-card p-6">
        <BundleForm error={typeof error === "string" ? error : undefined} />
      </div>
    </div>
  );
}
