import Link from "next/link";
import { ArrowRight, Clock, MapPin, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { HoverLift } from "@/components/site/motion";
import type { Course } from "@/lib/types";

const modeLabel: Record<Course["mode"], string> = {
  online: "Online",
  offline: "Classroom",
  hybrid: "Classroom + Online",
};

export function formatInr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export function CourseCard({ course }: { course: Course }) {
  return (
    <HoverLift className="h-full">
      <Card className="group flex h-full flex-col overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative h-32 bg-gradient-to-br from-navy via-navy to-teal/70 p-5">
          <Badge className="bg-gold text-navy-deep hover:bg-gold">{course.category}</Badge>
          {course.featured && (
            <Badge variant="outline" className="ml-2 border-white/40 text-white">
              Bestseller
            </Badge>
          )}
          <p className="mt-3 text-lg font-bold leading-snug text-white">{course.title}</p>
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
