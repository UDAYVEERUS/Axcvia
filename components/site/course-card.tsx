import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { HoverLift } from "@/components/site/motion";
import type { Course } from "@/lib/types";

const modeLabel: Record<Course["mode"], string> = {
  online: "Live Online",
  offline: "Classroom",
  hybrid: "Hybrid",
};

export function formatInr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export function CourseCard({ course }: { course: Course }) {
  return (
    <HoverLift className="h-full">
      <Card className="group flex h-full flex-col overflow-hidden pt-0 transition-shadow hover:shadow-xl">
        <div className="relative h-44 overflow-hidden">
          {course.image ? (
            <Image
              src={course.image}
              alt={course.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-teal/70" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/40 to-navy-deep/10" />
          <div className="absolute inset-x-0 top-0 flex flex-wrap gap-2 p-4">
            <Badge className="bg-gold text-navy-deep shadow-sm hover:bg-gold">{course.category}</Badge>
            {course.featured && (
              <Badge className="border border-white/30 bg-white/15 text-white backdrop-blur-sm hover:bg-white/15">
                ⭐ Bestseller
              </Badge>
            )}
          </div>
          <p className="absolute inset-x-0 bottom-0 p-4 text-lg font-bold leading-snug text-white drop-shadow">
            {course.title}
          </p>
        </div>
        <CardHeader className="pb-0">
          <p className="text-sm text-muted-foreground">{course.tagline}</p>
        </CardHeader>
        <CardContent className="flex-1 pt-4">
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 text-teal" aria-hidden /> {course.duration}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4 text-teal" aria-hidden /> {modeLabel[course.mode]}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="size-4 text-teal" aria-hidden />{" "}
              {course.learners.toLocaleString("en-IN")}+ learners
            </span>
            <span className="flex items-center gap-1.5">
              <Star className="size-4 fill-gold text-gold" aria-hidden /> {course.rating} (
              {course.reviewCount.toLocaleString("en-IN")})
            </span>
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t pt-4">
          <p>
            <span className="text-lg font-bold text-navy">{formatInr(course.discountFee)}</span>{" "}
            <span className="text-sm text-muted-foreground line-through">{formatInr(course.fee)}</span>
          </p>
          <Link
            href={`/courses/${course.slug}`}
            className="flex items-center gap-1 text-sm font-semibold text-teal transition-transform group-hover:translate-x-0.5"
          >
            View Details <ArrowRight className="size-4" aria-hidden />
          </Link>
        </CardFooter>
      </Card>
    </HoverLift>
  );
}
