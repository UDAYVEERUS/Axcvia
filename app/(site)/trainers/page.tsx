import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CtaBanner } from "@/components/site/cta-banner";
import { Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { trainers } from "@/lib/data/people";

export const metadata: Metadata = {
  title: "Trainers & Faculty — Learn From Industry Practitioners",
  description:
    "Meet Axcvia's trainers: engineers and data scientists with 9–14 years of industry experience at Flipkart, Oracle, Infosys, and high-growth startups.",
};

export default function TrainersPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6">
        <SectionHeading
          eyebrow="Faculty"
          title="Trainers who've done the work"
          description="No career tutors. Every Axcvia trainer has shipped production software, led teams, or run hiring loops at real companies."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trainers.map((trainer, i) => (
            <Reveal key={trainer.slug} delay={i * 0.06}>
              <Card className="h-full">
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="flex size-16 items-center justify-center rounded-full bg-navy text-lg font-bold text-white">
                      {trainer.name.split(" ").map((w) => w[0]).join("")}
                    </div>
                    <div>
                      <h2 className="font-semibold text-navy">{trainer.name}</h2>
                      <p className="text-sm text-teal">{trainer.role}</p>
                      <p className="text-xs text-muted-foreground">
                        {trainer.experienceYears} years of experience
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{trainer.bio}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {trainer.expertise.map((skill) => (
                      <Badge key={skill} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                  <a
                    href={trainer.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-teal hover:underline"
                  >
                    <ExternalLink className="size-4" aria-hidden /> LinkedIn profile
                  </a>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBanner
        title="Experience a class before you decide"
        description="Attend a free demo session with the actual trainer of your chosen course."
        buttonLabel="Book a Free Demo"
      />
    </>
  );
}
