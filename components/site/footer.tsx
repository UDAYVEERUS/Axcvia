import Image from "next/image";
import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { site, navLinks, moreLinks } from "@/lib/data/site";
import { getAllCourses } from "@/lib/services/courses";
import { slugify } from "@/lib/utils";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Refund Policy", href: "/refund-policy" },
  { label: "Pricing Policy", href: "/pricing-policy" },
];

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="font-heading text-sm font-bold text-white">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="transition-colors hover:text-teal-bright">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function Footer() {
  const courses = await getAllCourses();
  const categories = [...new Set(courses.filter((c) => (c.type ?? "classes") === "classes").map((c) => c.category))];
  const institute = [
    ...navLinks,
    ...moreLinks,
    { label: "Testimonials", href: "/testimonials" },
    { label: "Mock Tests", href: "/mock-tests" },
    { label: "Student Login", href: "/dashboard" },
  ].filter((l, i, all) => all.findIndex((x) => x.href === l.href) === i);

  return (
    <footer className="bg-navy-deep text-white/70">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.5fr_1fr_1.2fr_1fr]">
        <div>
          <Link href="/" className="inline-block rounded-xl bg-white p-2" aria-label="Axcvia home">
            <Image src="/logo.png" alt="Axcvia — Learn. Build. Succeed." width={608} height={410} className="h-14 w-auto" />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            {site.tagline}. Live online, instructor-led training with placement support that lasts until you&apos;re hired — from anywhere in India.
          </p>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2.5 hover:text-teal-bright">
                <Mail className="size-4 shrink-0 text-teal-bright" aria-hidden /> {site.email}
              </a>
            </li>
            <li>
              <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="flex items-center gap-2.5 hover:text-teal-bright">
                <Phone className="size-4 shrink-0 text-teal-bright" aria-hidden /> {site.phone}
              </a>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-teal-bright" aria-hidden /> {site.address}
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="size-4 shrink-0 text-teal-bright" aria-hidden /> {site.hours}
            </li>
          </ul>
        </div>

        {categories.length > 0 && (
          <FooterColumn title="Categories" links={categories.map((c) => ({ label: c, href: `/courses/category/${slugify(c)}` }))} />
        )}
        <FooterColumn title="Popular Courses" links={courses.slice(0, 6).map((c) => ({ label: c.title, href: `/courses/${c.slug}` }))} />
        <FooterColumn title="Institute" links={institute} />
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-xs sm:px-6 lg:flex-row">
          <p>© {new Date().getFullYear()} Axcvia. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-teal-bright">{l.label}</Link>
            ))}
          </div>
          <div className="flex gap-5">
            <a href={site.social.linkedin} className="hover:text-teal-bright" rel="noopener noreferrer" target="_blank">LinkedIn</a>
            <a href={site.social.youtube} className="hover:text-teal-bright" rel="noopener noreferrer" target="_blank">YouTube</a>
            <a href={site.social.instagram} className="hover:text-teal-bright" rel="noopener noreferrer" target="_blank">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
