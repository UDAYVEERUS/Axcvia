import type { Metadata } from "next";
import { FaqForm } from "@/components/admin/faq-form";

export const metadata: Metadata = { title: "Add FAQ" };

export default async function NewFaqPage({ searchParams }: PageProps<"/admin/faqs/new">) {
  const { error } = await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Add FAQ</h1>
      <p className="text-sm text-muted-foreground">Appears on the website immediately after saving.</p>
      <div className="mt-6 rounded-xl border bg-card p-6">
        <FaqForm error={typeof error === "string" ? error : undefined} />
      </div>
    </div>
  );
}
