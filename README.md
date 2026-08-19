# Axcvia — Programming Training Institute Website

Marketing & training website for Axcvia, built per the project Statement of Work.

**Stack:** Next.js 16 (App Router, TypeScript, Turbopack) · Tailwind CSS v4 · shadcn/ui (Radix) · Motion (Framer Motion) · MongoDB + Mongoose

## Getting started

```bash
npm install
cp .env.example .env.local   # add MONGODB_URI to persist leads
npm run dev                  # http://localhost:3000
```

`npm run build && npm start` for a production build.

## What's implemented

- **Public site (training-first):** Home, All Courses (filter/search — Java, MERN/Full Stack, React, C++, Python, AI & ML, Testing, DevOps, Mobile), Course Detail (curriculum accordion, trainer, reviews, JSON-LD), Online Courses (learning formats), Corporate Training, Placements (honest early-stage outcomes), Trainers, Testimonials, About, Contact, FAQ, legal pages, custom 404.
- **Admin dashboard (`/admin`):** password login (`ADMIN_PASSWORD`, dev default `axcvia-admin`), overview stats, course management (add/edit/delete/publish/feature), and a leads inbox with status tracking (new → contacted → converted/lost).
- **Dynamic courses:** the site runs on the static seed in `lib/data/courses.ts` until courses are added from the dashboard. Dashboard courses live in MongoDB and are merged over the seed by slug — saving a course with a seeded slug overrides it; public pages revalidate on every save.
- **Lead capture:** enquiry forms on Home, Course Detail, Corporate Training, and Contact post to `POST /api/leads` → MongoDB `leads` collection (console log in dev without a DB).
- **SEO:** per-page metadata + Open Graph, `sitemap.xml`, `robots.txt` (admin/api disallowed), Organization/Course/FAQ JSON-LD.
- **Design:** navy/teal/gold theme on shadcn/ui tokens; Framer Motion scroll reveals, animated counters, hero animation, testimonial carousel; mobile-first responsive.

## Structure

- `app/(site)/` — public pages; `app/admin/` — dashboard; `app/api/leads/` — lead capture
- `components/site/` + `components/admin/` — components; `components/ui/` — shadcn/ui primitives
- `lib/data/` — static seed content; `lib/services/courses.ts` — merged seed+DB course reads
- `lib/models/` — Mongoose schemas (courses, leads); `lib/admin/auth.ts` — admin session gate

## Deferred to later phases (per SOW)

Student auth & dashboard, cart/checkout/payments (P1), blog CMS (P1/P2), email notifications, multi-user admin roles (current gate is single-password; swap for Clerk/NextAuth when needed).
