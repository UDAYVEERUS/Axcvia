import type { Metadata } from "next";
import Image from "next/image";
import { Briefcase, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CtaBanner } from "@/components/site/cta-banner";
import { LogoMarquee } from "@/components/site/logo-marquee";
import { Counter, Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { getAllPlacements } from "@/lib/services/placements";
import { stats } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Placements — Early Outcomes We're Proud Of",
  description:
    "Axcvia is a young training institute, and our first batches are already landing roles at Freshworks, Zoho, Infosys, and more. Read real early success stories.",
};


export default async function PlacementsPage() {
  const placementStories = await getAllPlacements();
  const highest = Math.max(0, ...placementStories.map((s) => s.packageLpa));
  const placementStats = [...stats, { label: "Highest Package (LPA)", value: highest, suffix: " LPA" }];
  return (
    <>
      <section className="relative overflow-hidden bg-navy pb-16 pt-32 text-white">
        <Image
          src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=70"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-20"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/80 to-navy" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-teal-bright">
              Placement Outcomes
            </p>
            <h1 className="mx-auto mt-3 max-w-3xl text-3xl font-extrabold tracking-tight sm:text-5xl">
              Early outcomes we&apos;re proud of
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg text-white/75">
              We&apos;re a young institute — every placement below is a real student from our first
              batches, and we intend to keep this page growing.
            </p>
          </Reveal>
          <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
            {placementStats.slice(0, 4).map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.1}>
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="text-3xl font-extrabold text-gold sm:text-4xl"
                />
                <p className="mt-1 text-sm text-white/70">{stat.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <SectionHeading
          eyebrow="Success Stories"
          title="Real students, real offers"
          description="Career switchers, non-CS graduates, and working professionals from our first batches."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {placementStories.map((story, i) => (
            <Reveal key={story.studentName} delay={i * 0.06}>
              <Card className="h-full">
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                      {story.studentName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-navy">{story.studentName}</p>
                      <p className="text-xs text-muted-foreground">{story.background}</p>
                    </div>
                    <Badge className="ml-auto bg-gold text-navy-deep hover:bg-gold">
                      ₹{story.packageLpa} LPA
                    </Badge>
                  </div>
                  <div className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <Briefcase className="size-4 text-teal" aria-hidden />
                      {story.role} at <span className="font-medium text-foreground">{story.company}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <TrendingUp className="size-4 text-teal" aria-hidden />
                      {story.courseTitle} · Placed {story.year}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="overflow-hidden bg-secondary/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="Hiring Network"
            title="Our growing hiring network"
            description="Companies where our students have interviewed or been placed — a list we're actively expanding."
          />
        </div>
        <Reveal className="mt-10">
          <LogoMarquee />
        </Reveal>
      </section>

      <CtaBanner
        title="Want outcomes like these?"
        description="Book a free counselling session and we'll map a realistic path from your current background to your first tech offer."
      />
    </>
  );
}
