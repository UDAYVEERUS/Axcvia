"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/lib/types";

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 5000);
    return () => clearInterval(id);
  }, [paused, testimonials.length]);

  const t = testimonials[index];

  return (
    <div
      className="relative mx-auto max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.figure
          key={index}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.35 }}
          className="rounded-2xl border bg-card p-8 shadow-sm sm:p-10"
        >
          <Quote className="size-8 text-teal/40" aria-hidden />
          <blockquote className="mt-4 text-lg leading-relaxed text-foreground">
            “{t.text}”
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
              {t.studentName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="font-semibold text-navy">{t.studentName}</p>
              <p className="text-sm text-muted-foreground">
                {t.role} at {t.company} · {t.courseTitle}
              </p>
            </div>
            <div className="ml-auto flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="size-4 fill-gold text-gold" aria-hidden />
              ))}
            </div>
          </figcaption>
        </motion.figure>
      </AnimatePresence>

      <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Testimonials">
        {testimonials.map((item, i) => (
          <button
            key={item.studentName}
            role="tab"
            aria-selected={i === index}
            aria-label={`Testimonial from ${item.studentName}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-6 bg-teal" : "w-2 bg-border hover:bg-teal/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
