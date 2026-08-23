import type { Metadata } from "next";
import Image from "next/image";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CtaBanner } from "@/components/site/cta-banner";
import { Reveal } from "@/components/site/motion";
import { SectionHeading } from "@/components/site/section-heading";
import { getAllTestimonials } from "@/lib/services/testimonials";
import { VideoTestimonial } from "@/components/site/video-testimonial";

export const metadata: Metadata = {
  title: "Student Testimonials & Reviews",
  description:
    "Read what Axcvia alumni say about their training experience and career transitions — from non-CS backgrounds to roles at Freshworks, Zoho, Razorpay, and more.",
};

export default async function TestimonialsPage() {
  const testimonials = await getAllTestimonials();
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-32 sm:px-6">
        <SectionHeading
          eyebrow="Student Stories"
          title="In their own words"
          description="Honest reviews from alumni across our courses — the wins, the effort it took, and where they are now."
        />
        <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6 [&>*]:break-inside-avoid">
          {testimonials.map((t, i) => (
            <Reveal key={t.slug} delay={i * 0.05}>
              <Card>
                <CardContent>
                  <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                    {Array.from({ length: t.rating }).map((_, star) => (
                      <Star key={star} className="size-4 fill-gold text-gold" aria-hidden />
                    ))}
                  </div>
                  <p className="mt-3 font-bold text-navy">{t.title}</p>
                  <blockquote className="mt-2 text-sm leading-relaxed text-foreground/85">
                    “{t.text}”
                  </blockquote>
                  {t.videoUrl && <VideoTestimonial url={t.videoUrl} name={t.studentName} />}
                  <div className="mt-4 flex items-center gap-3">
                    {t.avatar ? (
                      <Image
                        src={t.avatar}
                        alt={t.studentName}
                        width={40}
                        height={40}
                        className="size-10 shrink-0 rounded-full border-2 border-teal/30 object-cover"
                      />
                    ) : (
                      <div className="flex size-10 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                        {t.studentName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-navy">{t.studentName}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.role} at {t.company} · {t.courseTitle}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
