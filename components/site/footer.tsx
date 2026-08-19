import Link from "next/link";
import { site, navLinks } from "@/lib/data/site";
import { courses } from "@/lib/data/courses";

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Refund Policy", href: "/refund-policy" },
];

export function Footer() {
  return (
    <footer className="bg-navy-deep text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <p className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold tracking-tight text-white">AXCVIA</span>
            <span className="size-2 rounded-full bg-teal-bright" aria-hidden />
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            {site.tagline}. Live online, instructor-led training with placement
            support that lasts until you&apos;re hired — from anywhere in India.
          </p>
          <p className="mt-4 text-sm">
            <a href={`mailto:${site.email}`} className="hover:text-white">{site.email}</a>
            <br />
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="hover:text-white">{site.phone}</a>
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Popular Courses</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {courses.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/courses/${c.slug}`} className="hover:text-white">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Institute</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">{l.label}</Link>
              </li>
            ))}
            <li><Link href="/trainers" className="hover:text-white">Trainers</Link></li>
            <li><Link href="/testimonials" className="hover:text-white">Testimonials</Link></li>
            <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Registered Office</h3>
          <p className="mt-4 text-sm leading-relaxed">{site.address}</p>
          <p className="mt-2 text-sm">{site.hours}</p>
          <div className="mt-4 flex gap-4 text-sm">
            <a href={site.social.linkedin} className="hover:text-white" rel="noopener noreferrer" target="_blank">LinkedIn</a>
            <a href={site.social.youtube} className="hover:text-white" rel="noopener noreferrer" target="_blank">YouTube</a>
            <a href={site.social.instagram} className="hover:text-white" rel="noopener noreferrer" target="_blank">Instagram</a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs sm:flex-row sm:px-6">
          <p>© {new Date().getFullYear()} Axcvia. All rights reserved.</p>
          <div className="flex gap-5">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white">{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
