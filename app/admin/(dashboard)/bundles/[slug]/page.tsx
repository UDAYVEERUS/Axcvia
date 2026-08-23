import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { BundleForm } from "@/components/admin/bundle-form";
import { getBundleBySlug } from "@/lib/services/lms";
import { bundles as seed } from "@/lib/data/lms";

export const metadata: Metadata = { title: "Edit Bundle" };

export default async function Page({ params, searchParams }: PageProps<"/admin/bundles/[slug]">) {
  const { slug } = await params;
  const { error } = await searchParams;
  const item = await getBundleBySlug(slug);
  if (!item) notFound();
  const isSeed = seed.some((s) => s.slug === slug);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold text-navy">Edit Bundle</h1>
        {isSeed && <Badge variant="outline" className="text-muted-foreground">Seeded entry — saving creates a database override</Badge>}
      </div>
      <p className="text-sm text-muted-foreground">/bundles{slug}</p>
      <div className="mt-6 rounded-xl border bg-card p-6">
        <BundleForm item={item} originalSlug={slug} error={typeof error === "string" ? error : undefined} />
      </div>
    </div>
  );
}
