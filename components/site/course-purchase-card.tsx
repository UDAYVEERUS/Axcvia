"use client";

import Link from "next/link";
import { Award, CalendarDays, Clock, Heart, Infinity as InfinityIcon, Lock, PlayCircle, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AddToCartButtons } from "@/components/site/add-to-cart";
import { formatInr } from "@/components/site/course-card";
import { enrollFreeAction, toggleWishlistAction } from "@/app/student-actions";
import type { Course } from "@/lib/types";
import { formatMinutes } from "@/lib/video";
import { useStudent } from "@/components/site/use-student";

export function CoursePurchaseCard({ course, totalMinutes, lessonCount }: { course: Course; totalMinutes: number; lessonCount: number }) {
  const { student, enrolled, wishlisted } = useStudent(course.slug);
  const loggedIn = Boolean(student);
  const free = course.discountFee <= 0;
  return (
    <Card>
      <CardContent className="space-y-4">
        {enrolled ? (
          <>
            <Badge className="bg-teal/10 text-teal hover:bg-teal/10">You&apos;re enrolled</Badge>
            <Button asChild size="lg" className="w-full bg-teal text-white hover:bg-teal/90"><Link href={`/learn/${course.slug}`}><PlayCircle className="size-4" aria-hidden /> Continue learning</Link></Button>
          </>
        ) : free ? (
          <>
            <p><span className="text-3xl font-extrabold text-navy">Free</span></p>
            <form action={enrollFreeAction}>
              <input type="hidden" name="slug" value={course.slug} />
              <Button type="submit" size="lg" className="w-full bg-teal text-white hover:bg-teal/90">{loggedIn ? "Enroll free" : "Sign in & enroll free"}</Button>
            </form>
          </>
        ) : (
          <>
            <p>
              <span className="text-3xl font-extrabold text-navy">{formatInr(course.discountFee)}</span>{" "}
              {course.fee > course.discountFee && (<><span className="text-muted-foreground line-through">{formatInr(course.fee)}</span><Badge className="ml-2 bg-teal/10 text-teal hover:bg-teal/10">Save {formatInr(course.fee - course.discountFee)}</Badge></>)}
            </p>
            <p className="text-sm text-muted-foreground">EMI & installment options available · Next batch {course.nextBatch}</p>
            <AddToCartButtons line={{ kind: "course", slug: course.slug, title: course.title, price: course.discountFee, image: course.image }} />
            <Button asChild variant="ghost" size="sm" className="w-full text-muted-foreground"><Link href={`/courses/${course.slug}/enroll`}>Reserve a seat, pay after counselling call</Link></Button>
          </>
        )}
        <form action={toggleWishlistAction}>
          <input type="hidden" name="slug" value={course.slug} />
          <input type="hidden" name="back" value={`/courses/${course.slug}`} />
          <button type="submit" className="flex w-full items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-navy">
            <Heart className={`size-4 ${wishlisted ? "fill-destructive text-destructive" : ""}`} aria-hidden /> {wishlisted ? "Saved to wishlist" : "Add to wishlist"}
          </button>
        </form>
        <Separator />
        <ul className="space-y-2 text-sm text-muted-foreground">
          {lessonCount > 0 && <li className="flex items-center gap-2"><PlayCircle className="size-4 text-teal" aria-hidden /> {lessonCount} lessons{totalMinutes ? ` · ${formatMinutes(totalMinutes)}` : ""}</li>}
          <li className="flex items-center gap-2"><Clock className="size-4 text-teal" aria-hidden /> {course.duration}</li>
          <li className="flex items-center gap-2">
            {course.validityDays ? <CalendarDays className="size-4 text-teal" aria-hidden /> : <InfinityIcon className="size-4 text-teal" aria-hidden />}
            {course.validityDays ? `Enrollment validity: ${course.validityDays} days` : "Lifetime access to recordings"}
          </li>
          {course.certificate !== false && <li className="flex items-center gap-2"><Award className="size-4 text-teal" aria-hidden /> Certificate of completion</li>}
          <li className="flex items-center gap-2"><Users className="size-4 text-teal" aria-hidden /> Placement assistance until hired</li>
          {!enrolled && !free && <li className="flex items-center gap-2"><Lock className="size-4 text-teal" aria-hidden /> Secure checkout · UPI, cards, EMI</li>}
        </ul>
      </CardContent>
    </Card>
  );
}
