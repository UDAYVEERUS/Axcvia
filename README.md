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

- **Public site (training-first):** Home, All Courses (filter/search), Course Category pages (`/courses/category/[category]`), Course Detail (curriculum accordion, trainer, reviews, related blog posts, JSON-LD), Course Enrollment (`/courses/[slug]/enroll`), Online Courses (learning formats), Corporate Training, Placements, Trainers + Trainer Profiles (`/trainers/[slug]`), Testimonials, Blog (`/blog`, `/blog/[slug]`, `/blog/category/[category]`, `/blog/tag/[tag]`), About, Contact, FAQ, legal pages, custom 404.
- **Blog that sells courses:** every post can promote one or more courses — a "Recommended course" block with Enroll/Syllabus buttons appears after the article, plus a sticky featured-course card and enquiry form in the sidebar. Course pages show the posts written about them. Markdown content (headings, lists, quotes, code, tables, links, images) is rendered by `components/site/markdown.tsx` with no extra dependencies.
- **LMS (Tutor-LMS parity for the WordPress migration):**
  - **Student accounts** — register/login (`/register`, `/login`; scrypt-hashed passwords, HMAC-signed httpOnly session cookie, no extra deps), dashboard with My Courses + progress bars, Test Results, Certificates, Orders, Wishlist, Profile/password.
  - **Course content** — courses have a `type` (Classes / Mock Test Series / Webinar), sections of lessons (video: YouTube/Vimeo/MP4; document: Markdown + attachment; quiz), preview lessons, downloadable study materials, tags, enrollment validity (days), certificate toggle. Course player at `/learn/[course]/[lesson]` with sidebar, mark-complete, auto-issued **certificate of completion** (`/certificate/[id]`, printable, publicly verifiable).
  - **Quizzes / mock tests** — timed, shuffled, instant scoring with explanations, unlimited re-attempts, free-sample quizzes for any registered student, results history. Admin question builder + bulk paste import.
  - **Cart + checkout** — localStorage cart, coupons (percent/flat, min order, new-students-only, expiry), **Razorpay** online payment (signature-verified server-side) with a **pay-later / counsellor-call** fallback; orders auto-grant enrollments (bundles expand to every course).
  - **Bundles** (`/bundles/[slug]`), **CMS landing pages** at the site root (`/java-classes`, `/mock-tests`… — same URL shape as the WordPress category pages, with nav dropdown groups, hero, highlights, Markdown sections, course/bundle lists, FAQ schema), `/mock-tests`, `/webinars`, `/pricing-policy`.
  - **Marketing** — dashboard-editable promo banner + coupon, lead popup (delay configurable), announcement bar, mobile sticky Call/WhatsApp/Enroll/Account bar, video testimonials.
  - **Admin** — Quizzes, Bundles, Landing Pages, Orders (mark pay-later orders paid → unlocks courses), Students (manual enroll / revoke, attempts), Coupons, Settings (integration status for MongoDB/Razorpay/Cloudinary).
- **Course enrollment ("buy"):** `/courses/[slug]/enroll` shows the fee breakdown and a seat-reservation form → `POST /api/enrollments` → MongoDB `enrollments` collection (also mirrored into `leads`). Admins move each enrollment through pending → confirmed → paid → cancelled and see collected/pipeline totals. Payment itself is collected offline (UPI/bank/installments on the confirmation call) until a gateway is integrated.
- **Admin dashboard (`/admin`):** password login (`ADMIN_PASSWORD`, dev default `axcvia-admin`), overview stats, and full CRUD (add/edit/override/delete/publish) for **Courses, Blog posts, Trainers, Testimonials, Placements, and FAQs**, plus **Enrollments** and **Leads** inboxes with status tracking.
- **Dynamic content everywhere:** every content type runs on its static seed (`lib/data/*.ts`) until entries are added from the dashboard. Dashboard entries live in MongoDB and are merged over the seed by slug (`lib/services/content.ts`) — saving an entry with a seeded slug overrides it, saving it unpublished hides it, deleting the override restores the seed. Public pages revalidate on every save.
- **Public JSON API:** `GET /api/courses`, `/api/courses/[slug]`, `/api/blog`, `/api/blog/[slug]` (read-only, CDN-cached 5 min).
- **Lead capture:** enquiry forms on Home, Course Detail, Blog posts, Corporate Training, and Contact post to `POST /api/leads` → MongoDB `leads` collection (console log in dev without a DB).
- **SEO:** per-page metadata + Open Graph, dynamic `sitemap.xml` (courses, categories, blog posts, blog categories, trainers), `robots.txt` (admin/api disallowed), Organization/Course/FAQ/BlogPosting/Person JSON-LD.
- **Design:** navy/teal/gold theme on shadcn/ui tokens; Framer Motion scroll reveals, animated counters, hero animation, testimonial carousel; mobile-first responsive.

## Structure

- `app/(site)/` — public pages; `app/admin/` — dashboard (`actions.ts` holds all server actions); `app/api/` — leads, enrollments, public JSON API
- `components/site/` + `components/admin/` — components; `components/ui/` — shadcn/ui primitives
- `lib/data/` — static seed content (courses, blog, people); `lib/services/` — merged seed+DB reads per content type
- `lib/models/` — Mongoose schemas (courses, blog posts, trainers, testimonials, placements, faqs, enrollments, leads); `lib/admin/auth.ts` — admin session gate

## Deferred to later phases (per SOW)

Email notifications (order confirmations, password reset — currently handled by phone), Razorpay webhooks (the browser-verify route covers normal flows), push notifications, multi-user admin roles (current gate is single-password).
