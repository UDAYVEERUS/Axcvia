import type { MetadataRoute } from "next";
import { courses } from "@/lib/data/courses";
import { site } from "@/lib/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/courses",
    "/online-courses",
    "/centers",
    "/corporate-training",
    "/placements",
    "/trainers",
    "/testimonials",
    "/about",
    "/contact",
    "/faq",
    "/privacy-policy",
    "/terms-of-service",
    "/refund-policy",
  ].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const coursePages = courses.map((c) => ({
    url: `${site.url}/courses/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticPages, ...coursePages];
}
