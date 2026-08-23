import type { Testimonial } from "@/lib/types";
import { testimonials as staticTestimonials } from "@/lib/data/people";
import { TestimonialModel } from "@/lib/models/testimonial";
import { loadMerged } from "@/lib/services/content";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function toTestimonial(doc: any): Testimonial {
  return {
    slug: doc.slug,
    studentName: doc.studentName,
    courseSlug: doc.courseSlug ?? "",
    courseTitle: doc.courseTitle ?? "",
    role: doc.role ?? "",
    company: doc.company ?? "",
    rating: doc.rating ?? 5,
    title: doc.title ?? "",
    text: doc.text ?? "",
    avatar: doc.avatar ?? "",
    videoUrl: doc.videoUrl ?? "",
  };
}

export function getAllTestimonials() {
  return loadMerged(staticTestimonials, TestimonialModel, toTestimonial);
}

export async function getTestimonialsForCourse(courseSlug: string) {
  return (await getAllTestimonials()).filter((t) => t.courseSlug === courseSlug);
}
