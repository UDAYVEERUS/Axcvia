import type { Metadata } from "next";
import { BundleCard } from "@/components/site/bundle-card";
import { CtaBanner } from "@/components/site/cta-banner";
import { Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { getAllBundles } from "@/lib/services/lms";

export const metadata: Metadata = {
  title: "Course Bundles — Save on Combined Programs",
  description: "Bundle multiple Axcvia courses at one discounted price — complete career tracks with classes, mock tests and placement support included.",
};

export default async function BundlesPage() {
  const bundles = await getAllBundles();
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6">
        <SectionHeading as="h1" eyebrow="Bundles" title="Complete career tracks at one price" description="Combine classes and mock test series into a single purchase and save compared to buying separately." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bundles.map((b, i) => (<Reveal key={b.slug} delay={i * 0.06}><BundleCard bundle={b} /></Reveal>))}
        </div>
        {bundles.length === 0 && <p className="mt-12 text-center text-muted-foreground">Bundles coming soon.</p>}
      </section>
      <CtaBanner />
    </>
  );
}
