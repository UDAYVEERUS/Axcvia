import type { Metadata } from "next";
import { Clock, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CtaBanner } from "@/components/site/cta-banner";
import { Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { centers } from "@/lib/data/people";

export const metadata: Metadata = {
  title: "Training Centers — Bengaluru & Hyderabad",
  description:
    "Visit Axcvia's classroom training centers in BTM Layout and Rajajinagar (Bengaluru) and Ameerpet (Hyderabad). Walk-in counselling available Mon–Sat.",
};

export default function CentersPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6">
        <SectionHeading
          eyebrow="Offline Centers"
          title="Learn in person at our campuses"
          description="Modern classrooms, lab access, and in-person mentorship. Walk in any day for free counselling."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {centers.map((center, i) => (
            <Reveal key={center.name} delay={i * 0.08}>
              <Card className="h-full">
                <CardHeader>
                  <p className="text-sm font-semibold uppercase tracking-wider text-teal">
                    {center.city}
                  </p>
                  <CardTitle className="text-navy">{center.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden />
                    {center.address}
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Phone className="size-4 shrink-0 text-teal" aria-hidden />
                    <a href={`tel:${center.phone.replace(/\s/g, "")}`} className="hover:text-foreground">
                      {center.phone}
                    </a>
                  </p>
                  <p className="flex items-center gap-2.5">
                    <Clock className="size-4 shrink-0 text-teal" aria-hidden />
                    {center.hours}
                  </p>
                  <Button asChild variant="outline" className="mt-2 w-full">
                    <a href={center.mapUrl} target="_blank" rel="noopener noreferrer">
                      Get Directions
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBanner
        title="Can't visit a center?"
        description="All our courses are also available as live-online batches with the same trainers and placement support."
        buttonLabel="Explore Online Courses"
        href="/online-courses"
      />
    </>
  );
}
