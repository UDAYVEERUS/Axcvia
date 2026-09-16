import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { Course } from "@/lib/types";

const modeLabel: Record<Course["mode"], string> = {
  online: "Live Online",
  offline: "Classroom",
  hybrid: "Hybrid",
};

export function formatInr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

/** Five stars, filled to the nearest whole rating. */
export function StarRating({ rating, className = "size-3.5" }: { rating: number; className?: string }) {
  return (
    <span className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${className} ${i < Math.round(rating) ? "fill-gold text-gold" : "fill-muted text-muted-foreground/30"}`}
          aria-hidden
        />
      ))}
    </span>
  );
}

// Marketplace-style card (Udemy / Coursera): the whole card is one link.
export function CourseCard({ course }: { course: Course }) {
  // Only webinars are genuinely free; a paid course with no fee set yet is "on request".
  const free = course.discountFee <= 0 && course.type === "webinar";
  const priceLabel = course.discountFee > 0 ? formatInr(course.discountFee) : free ? "Free" : "Fee on request";
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-teal/30 hover:shadow-lg focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal/40"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        {course.image ? (
          <Image
            src={course.image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 bg-linear-to-br from-navy via-navy to-teal" aria-hidden />
        )}
        {course.type === "mock-test" && (
          <span className="absolute left-3 top-3 rounded-md bg-navy/90 px-2 py-1 text-[11px] font-semibold text-white">Mock Test Series</span>
        )}
        {course.type === "webinar" && (
          <span className="absolute left-3 top-3 rounded-md bg-teal px-2 py-1 text-[11px] font-semibold text-white">Free Webinar</span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-bold uppercase tracking-wider text-teal">{course.category}</p>
        <h3 className="mt-1 line-clamp-2 text-[1.02rem] font-bold leading-snug text-navy transition-colors group-hover:text-teal">
          {course.title}
        </h3>
        {course.tagline && <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{course.tagline}</p>}

        {course.reviewCount > 0 && (
          <div className="mt-2 flex items-center gap-1.5 text-sm">
            <span className="font-bold text-gold-deep">{course.rating.toFixed(1)}</span>
            <StarRating rating={course.rating} />
            <span className="text-xs text-muted-foreground">({course.reviewCount.toLocaleString("en-IN")})</span>
          </div>
        )}

        <p className="mt-2 flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground">
          {[course.duration, course.level, modeLabel[course.mode]].filter(Boolean).map((part, i) => (
            <span key={part} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden>·</span>}
              {part}
            </span>
          ))}
        </p>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-4">
          <p className="flex items-baseline gap-2">
            <span className={`font-extrabold text-navy ${course.discountFee > 0 || free ? "text-lg" : "text-base"}`}>{priceLabel}</span>
            {course.fee > course.discountFee && (
              <span className="text-sm text-muted-foreground line-through">{formatInr(course.fee)}</span>
            )}
          </p>
          {course.featured && (
            <span className="rounded-md bg-gold/20 px-2 py-0.5 text-[11px] font-bold text-gold-deep">Featured</span>
          )}
        </div>
      </div>
    </Link>
  );
}
