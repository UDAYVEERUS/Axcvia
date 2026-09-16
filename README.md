# Axcvia — Programming Training Institute Website

Marketing & training website for Axcvia, built per the project Statement of Work.

**Stack:** Next.js 16 (App Router, TypeScript, Turbopack) · Tailwind CSS v4 · shadcn/ui (Radix) · Motion (Framer Motion) · MongoDB + Mongoose · Better Auth (Google OAuth)

## Getting started

```bash
npm install
cp .env.example .env.local   # add MONGODB_URI to persist leads
npm run dev                  # http://localhost:3000
```

`npm run build && npm start` for a production build.

## Authentication setup

Students and admins sign in with **Google** (OAuth 2.0 authorization code flow with PKCE + state, via [Better Auth](https://www.better-auth.com)). There are no passwords.

Set these environment variables:

| Variable | Value |
|---|---|
| `MONGODB_URI` | MongoDB connection string (users, sessions and OAuth accounts are stored in the `axcvia` database) |
| `BETTER_AUTH_SECRET` | Random 32+ byte secret, e.g. `openssl rand -base64 32`. Different per environment; never commit it. |
| `BETTER_AUTH_URL` | Site origin — `http://localhost:3000` locally, `https://www.axcvia.com` in production |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | From Google Cloud Console → APIs & Services → Credentials → **OAuth client ID (Web application)** |
| `ADMIN_EMAILS` | Comma-separated Google-verified emails that are made admins when they sign in (bootstraps the first admin) |

In the Google OAuth client, add these **Authorized redirect URIs**:

- `http://localhost:3000/api/auth/callback/google`
- `https://www.axcvia.com/api/auth/callback/google`

and these **Authorized JavaScript origins**: `http://localhost:3000`, `https://www.axcvia.com`. On the OAuth consent screen, request only the `openid`, `email` and `profile` scopes.

**Roles.** Every user has a `role` of `user` (student) or `admin`. The first admin is whoever signs in with an address listed in `ADMIN_EMAILS`; after that, admins promote or demote users from **Admin → Users → Manage**. (An address kept in `ADMIN_EMAILS` is re-promoted on every sign-in — remove it there first to demote that person.)

## What's implemented

- **Public site (training-first):** Home, All Courses (filter/search), Course Category pages (`/courses/category/[category]`), Course Detail (curriculum accordion, trainer, reviews, related blog posts, JSON-LD), Course Enrollment (`/courses/[slug]/enroll`), Online Courses (learning formats), Corporate Training, Placements, Trainers + Trainer Profiles (`/trainers/[slug]`), Testimonials, Blog (`/blog`, `/blog/[slug]`, `/blog/category/[category]`, `/blog/tag/[tag]`), About, Contact, FAQ, legal pages, custom 404.
- **Blog that sells courses:** every post can promote one or more courses — a "Recommended course" block with Enroll/Syllabus buttons appears after the article, plus a sticky featured-course card and enquiry form in the sidebar. Course pages show the posts written about them. Markdown content (headings, lists, quotes, code, tables, links, images) is rendered by `components/site/markdown.tsx` with no extra dependencies.
- **LMS (Tutor-LMS parity for the WordPress migration):**
  - **Student accounts** — "Continue with Google" at `/login` (the account is created on first sign-in; `/register` forwards there), database-backed revocable sessions, dashboard with My Courses + progress bars, Test Results, Certificates, Orders, Wishlist, Profile (name/phone, sign out of all devices).
  - **Course content** — courses have a `type` (Classes / Mock Test Series / Webinar), sections of lessons (video: YouTube/Vimeo/MP4; document: Markdown + attachment; quiz), preview lessons, downloadable study materials, tags, enrollment validity (days), certificate toggle. Course player at `/learn/[course]/[lesson]` with sidebar, mark-complete, auto-issued **certificate of completion** (`/certificate/[id]`, printable, publicly verifiable).
  - **Quizzes / mock tests** — timed, shuffled, instant scoring with explanations, unlimited re-attempts, free-sample quizzes for any signed-in student, results history. Admin question builder + bulk paste import.
  - **Cart + checkout** — localStorage cart, coupons (percent/flat, min order, new-students-only, expiry), **Razorpay** online payment (signature-verified server-side) with a **pay-later / counsellor-call** fallback; orders auto-grant enrollments (bundles expand to every course).
  - **Bundles** (`/bundles/[slug]`), **CMS landing pages** at the site root (`/java-classes`, `/mock-tests`… — same URL shape as the WordPress category pages, with nav dropdown groups, hero, highlights, Markdown sections, course/bundle lists, FAQ schema), `/mock-tests`, `/webinars`, `/pricing-policy`.
  - **Marketing** — dashboard-editable promo banner + coupon, lead popup (delay configurable), announcement bar, mobile sticky Call/WhatsApp/Enroll/Account bar, video testimonials.
  - **Admin** — Quizzes, Bundles, Landing Pages, Orders (mark pay-later orders paid → unlocks courses), Users (manual enroll / revoke, attempts, make/remove admin), Coupons, Settings (integration status for MongoDB/Razorpay/Cloudinary).
- **Course enrollment ("buy"):** `/courses/[slug]/enroll` shows the fee breakdown and a seat-reservation form → `POST /api/enrollments` → MongoDB `enrollments` collection (also mirrored into `leads`). Admins move each enrollment through pending → confirmed → paid → cancelled and see collected/pipeline totals. Payment itself is collected offline (UPI/bank/installments on the confirmation call) until a gateway is integrated.
- **Admin dashboard (`/admin`):** Google sign-in restricted to users with the `admin` role, overview stats, and full CRUD (add/edit/override/delete/publish) for **Courses, Blog posts, Trainers, Testimonials, Placements, and FAQs**, plus **Enrollments** and **Leads** inboxes with status tracking.
- **Dynamic content everywhere:** every content type runs on its static seed (`lib/data/*.ts`) until entries are added from the dashboard. Dashboard entries live in MongoDB and are merged over the seed by slug (`lib/services/content.ts`) — saving an entry with a seeded slug overrides it, saving it unpublished hides it, deleting the override restores the seed. Public pages revalidate on every save.
- **Public JSON API:** `GET /api/courses`, `/api/courses/[slug]`, `/api/blog`, `/api/blog/[slug]` (read-only, CDN-cached 5 min).
- **Lead capture:** enquiry forms on Home, Course Detail, Blog posts, Corporate Training, and Contact post to `POST /api/leads` → MongoDB `leads` collection (console log in dev without a DB).
- **SEO:** per-page metadata + Open Graph, dynamic `sitemap.xml` (courses, categories, blog posts, blog categories, trainers), `robots.txt` (admin/api disallowed), Organization/Course/FAQ/BlogPosting/Person JSON-LD.
- **Design:** Axcvia logo palette (royal navy + cyan, amber for ratings) on shadcn/ui tokens, Plus Jakarta Sans headings + Inter body; marketplace-style course cards, catalog filter sidebar / mobile filter sheet; mobile-first responsive.

## Security model

- **Authentication** — Google OAuth through Better Auth (`lib/auth.ts`, routes at `/api/auth/*`). Sessions are stored in MongoDB (`session` collection) and referenced by a signed, httpOnly, SameSite=Lax cookie (Secure in production). Sign-out revokes the session server-side; students can revoke all their sessions. Auth endpoints are rate limited.
- **Authorization is checked where the data is used, not only at the edge:**
  - `lib/admin/auth.ts` → `requireAdmin()` is called at the top of **every** admin page and **every** admin Server Action, and `isAdminAuthenticated()` guards `POST /api/admin/upload`. It re-reads the session from the database (cookie cache bypassed), so demotions and bans apply immediately.
  - `lib/student/auth.ts` → `requireStudent()` / `getCurrentStudent()` in every dashboard, learn and checkout page, every student Server Action, and the student API routes, with ownership checks on orders, quiz reviews and enrollments.
  - `proxy.ts` only redirects visitors without a session cookie away from `/dashboard`, `/learn`, `/checkout` and `/admin` — a fast first gate, never the sole check.
- **Other hardening** — redirect targets are restricted to same-site paths (`safeNext`), prices are always recomputed server-side at checkout, Razorpay signatures are verified server-side, and baseline security headers (`nosniff`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`, HSTS in production) are set in `next.config.ts`.

## Structure

- `app/(site)/` — public pages; `app/admin/` — dashboard (`actions.ts` holds all server actions); `app/api/` — auth, leads, enrollments, public JSON API
- `components/site/` + `components/admin/` — components; `components/ui/` — shadcn/ui primitives
- `lib/data/` — static seed content (courses, blog, people); `lib/services/` — merged seed+DB reads per content type
- `lib/models/` — Mongoose schemas (courses, categories, blog posts, trainers, testimonials, placements, faqs, enrollments, leads; `student.ts` maps the Better Auth `user` collection)
- `lib/auth.ts` — Better Auth config (Google provider, roles, sessions); `lib/auth-client.ts` — browser client; `lib/admin/auth.ts` / `lib/student/auth.ts` — authorization checks; `proxy.ts` — optimistic redirects

## Deferred to later phases (per SOW)

Email notifications (order confirmations), Razorpay webhooks (the browser-verify route covers normal flows), push notifications, finer-grained staff roles (e.g. counsellor access to leads only).
