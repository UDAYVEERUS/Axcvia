"use client";

import Image from "next/image";
import Link from "next/link";
import { Award, CalendarDays, Clock, Heart, Infinity as InfinityIcon, Lock, PlayCircle, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToCartButtons } from "@/components/site/add-to-cart";
import { formatInr } from "@/components/site/course-card";
import { enrollFreeAction, toggleWishlistAction } from "@/app/student-actions";
import type { Course } from "@/lib/types";
import { formatMinutes } from "@/lib/video";
import { useStudent } from "@/components/site/use-student";

export function CoursePurchaseCard({
  course,
  totalMinutes,
  lessonCount,
  showImage = false,
}: {
  course: Course;
  totalMinutes: number;
  lessonCount: number;
  /** Show the course cover on top of the card (marketplace-style preview). */
  showImage?: boolean;
}) {
  const { student, enrolled, wishlisted } = useStudent(course.slug);
  const loggedIn = Boolean(student);
  // Only webinars enroll free; a paid course with no fee yet asks for a callback.
  const free = course.discountFee <= 0 && course.type === "webinar";
  const feeOnRequest = course.discountFee <= 0 && !free;
  const percentOff = course.fee > course.discountFee && course.fee > 0 ? Math.round(((course.fee - course.discountFee) / course.fee) * 100) : 0;

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-xl shadow-navy/10">
      {showImage && course.image && (
        <div className="relative aspect-video bg-muted">
          <Image src={course.image} alt="" fill sizes="(max-width: 1024px) 100vw, 352px" className="object-cover" />
        </div>
      )}
      <div className="space-y-4 p-5">
        {enrolled ? (
          <>
            <p className="inline-flex rounded-md bg-teal/10 px-2.5 py-1 text-sm font-semibold text-teal">You&apos;re enrolled</p>
            <Button asChild size="lg" className="w-full bg-teal text-white hover:bg-teal/90">
              <Link href={`/learn/${course.slug}`}><PlayCircle className="size-4" aria-hidden /> Continue learning</Link>
            </Button>
          </>
        ) : free ? (
          <>
            <p className="font-heading text-3xl font-extrabold text-navy">Free</p>
            <form action={enrollFreeAction}>
              <input type="hidden" name="slug" value={course.slug} />
              <Button type="submit" size="lg" className="w-full bg-teal text-white hover:bg-teal/90">{loggedIn ? "Enroll free" : "Sign in & enroll free"}</Button>
            </form>
          </>
        ) : feeOnRequest ? (
          <>
            <div>
              <p className="font-heading text-2xl font-extrabold text-navy">Fee on request</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tell us your background and a counsellor will share the fee, batch dates and EMI options.
              </p>
            </div>
            <Button asChild size="lg" className="w-full bg-teal text-white hover:bg-teal/90">
              <Link href={`/courses/${course.slug}/enroll`}>Get fee &amp; batch details</Link>
            </Button>
          </>
        ) : (
          <>
            <div>
              <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className="font-heading text-3xl font-extrabold text-navy">{formatInr(course.discountFee)}</span>
                {percentOff > 0 && (
                  <>
                    <span className="text-muted-foreground line-through">{formatInr(course.fee)}</span>
                    <span className="text-sm font-bold text-teal">{percentOff}% off</span>
                  </>
                )}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                EMI & installment options available{course.nextBatch ? ` · Next batch ${course.nextBatch}` : ""}
              </p>
            </div>
            <AddToCartButtons line={{ kind: "course", slug: course.slug, title: course.title, price: course.discountFee, image: course.image }} />
            <Button asChild variant="ghost" size="sm" className="w-full whitespace-normal text-muted-foreground">
              <Link href={`/courses/${course.slug}/enroll`}>Reserve a seat, pay after counselling call</Link>
            </Button>
          </>
        )}
        <form action={toggleWishlistAction}>
          <input type="hidden" name="slug" value={course.slug} />
          <input type="hidden" name="back" value={`/courses/${course.slug}`} />
          <button type="submit" className="flex w-full items-center justify-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-navy">
            <Heart className={`size-4 ${wishlisted ? "fill-destructive text-destructive" : ""}`} aria-hidden /> {wishlisted ? "Saved to wishlist" : "Add to wishlist"}
          </button>
        </form>
        <div className="border-t pt-4">
          <p className="text-sm font-bold text-navy">This course includes:</p>
          <ul className="mt-3 space-y-2.5 text-sm text-foreground/80">
            {lessonCount > 0 && <li className="flex items-center gap-2.5"><PlayCircle className="size-4 shrink-0 text-teal" aria-hidden /> {lessonCount} lessons{totalMinutes ? ` · ${formatMinutes(totalMinutes)}` : ""}</li>}
            {course.duration && <li className="flex items-center gap-2.5"><Clock className="size-4 shrink-0 text-teal" aria-hidden /> {course.duration} program</li>}
            <li className="flex items-center gap-2.5">
              {course.validityDays ? <CalendarDays className="size-4 shrink-0 text-teal" aria-hidden /> : <InfinityIcon className="size-4 shrink-0 text-teal" aria-hidden />}
              {course.validityDays ? `Enrollment validity: ${course.validityDays} days` : "Lifetime access to recordings"}
            </li>
            {course.certificate !== false && <li className="flex items-center gap-2.5"><Award className="size-4 shrink-0 text-teal" aria-hidden /> Certificate of completion</li>}
            <li className="flex items-center gap-2.5"><Users className="size-4 shrink-0 text-teal" aria-hidden /> Placement assistance until hired</li>
            {!enrolled && !free && <li className="flex items-center gap-2.5"><Lock className="size-4 shrink-0 text-teal" aria-hidden /> Secure checkout · UPI, cards, EMI</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
