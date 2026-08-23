import type { MetadataRoute } from "next";
import { site } from "@/lib/data/site";
import { getAllPosts } from "@/lib/services/blog";
import { getAllCourses } from "@/lib/services/courses";
import { getAllTrainers } from "@/lib/services/trainers";
import { getAllBundles, getAllLandingPages } from "@/lib/services/lms";
import { slugify } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [courses, posts, trainers, bundles, landing] = await Promise.all([
    getAllCourses(),
    getAllPosts(),
    getAllTrainers(),
    getAllBundles(),
    getAllLandingPages(),
  ]);

  const staticPages = [
    "",
    "/courses",
    "/online-courses",
    "/corporate-training",
    "/placements",
    "/trainers",
    "/testimonials",
    "/blog",
    "/mock-tests",
    "/webinars",
    "/bundles",
    "/pricing-policy",
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

  const categoryPages = [...new Set(courses.map((c) => slugify(c.category)))].map((cat) => ({
    url: `${site.url}/courses/category/${cat}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const blogPages = posts.map((p) => ({
    url: `${site.url}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const blogCategoryPages = [...new Set(posts.map((p) => slugify(p.category)))].map((cat) => ({
    url: `${site.url}/blog/category/${cat}`,
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  const trainerPages = trainers.map((t) => ({
    url: `${site.url}/trainers/${t.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const bundlePages = bundles.map((b) => ({ url: `${site.url}/bundles/${b.slug}`, changeFrequency: "weekly" as const, priority: 0.8 }));
  const landingPages = landing.map((p) => ({ url: `${site.url}/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.8 }));

  return [
    ...staticPages,
    ...bundlePages,
    ...landingPages,
    ...coursePages,
    ...categoryPages,
    ...blogPages,
    ...blogCategoryPages,
    ...trainerPages,
  ];
}
