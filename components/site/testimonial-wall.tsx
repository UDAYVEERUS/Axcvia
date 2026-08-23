import Image from "next/image";
import { Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";
import { VideoTestimonial } from "@/components/site/video-testimonial";

function ReviewCard({ t }: { t: Testimonial }) {
  return (
    <figure className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn( 
              "size-4",
              i < t.rating ? "fill-gold text-gold" : "fill-muted text-muted"
            )}
            aria-hidden
          />
        ))}
      </div> 
      <p className="mt-3 font-bold text-navy">{t.title}</p>
      <blockquote className="mt-2 text-sm leading-relaxed text-muted-foreground">
        “{t.text}”
      </blockquote>
      {t.videoUrl && <VideoTestimonial url={t.videoUrl} name={t.studentName} />}
      <Separator className="my-4" />
      <figcaption className="flex items-center gap-3">
        {t.avatar ? (
          <Image
            src={t.avatar}
            alt={t.studentName}
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-full border-2 border-teal/30 object-cover"
          />
        ) : (
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
            {t.studentName.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold text-navy">{t.studentName}</p>
          <p className="text-xs text-muted-foreground">
            {t.role} at {t.company}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

function MarqueeColumn({
  items,
  duration,
  className,
}: {
  items: Testimonial[];
  duration: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-[540px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]",
        className
      )}
    >
      <div
        className="flex flex-col gap-6 group-hover:[animation-play-state:paused] motion-reduce:[animation:none]"
        style={{ animation: `marquee-y ${duration} linear infinite` }}
      >
        {[false, true].map((hidden) => (
          <div key={String(hidden)} className="flex flex-col gap-6 pb-6" aria-hidden={hidden}>
            {items.map((t) => (
              <ReviewCard key={t.studentName} t={t} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function TestimonialWall({ testimonials }: { testimonials: Testimonial[] }) {
  // Round-robin the reviews into three columns that scroll at different speeds.
  const columns: Testimonial[][] = [[], [], []];
  testimonials.forEach((t, i) => columns[i % 3].push(t));

  return (
    <div className="group grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <MarqueeColumn items={columns[0]} duration="30s" />
      <MarqueeColumn items={columns[1]} duration="40s" className="hidden md:block" />
      <MarqueeColumn items={columns[2]} duration="34s" className="hidden lg:block" />
    </div>
  );
}
