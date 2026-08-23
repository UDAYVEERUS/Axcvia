import type { Metadata } from "next";
import { LandingPageForm } from "@/components/admin/landing-page-form";

export const metadata: Metadata = { title: "Add Landing Page" };

export default async function Page({ searchParams }: PageProps<"/admin/pages/new">) {
  const { error } = await searchParams;
  return (
    <div>
      <h1 className="text-2xl font-bold text-navy">Add Landing Page</h1>
      <div className="mt-6 rounded-xl border bg-card p-6">
        <LandingPageForm error={typeof error === "string" ? error : undefined} />
      </div>
    </div>
  );
}
