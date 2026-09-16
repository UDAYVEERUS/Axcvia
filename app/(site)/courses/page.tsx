import type { Metadata } from "next";
import Link from "next/link";
import { Award, ChevronRight, CreditCard, MonitorPlay, Users } from "lucide-react";
import { CourseCatalog } from "@/components/site/course-catalog";
import { CtaBanner } from "@/components/site/cta-banner";
import { site } from "@/lib/data/site";
import { getAllCourses } from "@/lib/services/courses";

export const metadata: Metadata = {
  title: "All Programming Courses, Mock Tests & Webinars",
  description:
    "Browse Axcvia's programming courses — web development, programming languages, data & AI, software testing, and cloud & DevOps. Live online classes, real projects and placement support.",
};

const highlights = [
  { icon: MonitorPlay, label: "100% live online" },
  { icon: Users, label: "Batches of 15" },
  { icon: Award, label: "Capstone projects" },
  { icon: CreditCard, label: "EMI available" },
];

export default async function CoursesPage() {
  const courses = await getAllCourses();
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Programming courses at Axcvia",
      description: metadata.description,
      url: `${site.url}/courses`,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: courses.length,
        itemListElement: courses.slice(0, 50).map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.title,
          url: `${site.url}/courses/${c.slug}`,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site.url },
        { "@type": "ListItem", position: 2, name: "Courses", item: `${site.url}/courses` },
      ],
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="border-b bg-secondary/60 pb-8 pt-24 sm:pb-10 sm:pt-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-teal">Home</Link>
            <ChevronRight className="size-3.5" aria-hidden />
            <span className="font-medium text-navy">Courses</span>
          </nav>
          <h1 className="mt-3 text-3xl font-extrabold text-navy sm:text-4xl">Find your career track</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Live projects, expert trainers and placement assistance in every program.
          </p>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-foreground/80">
            {highlights.map((h) => (
              <li key={h.label} className="flex items-center gap-1.5">
                <h.icon className="size-4 text-teal" aria-hidden /> {h.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <CourseCatalog courses={courses} />
      </section>
      <CtaBanner />
    </>
  );
}
