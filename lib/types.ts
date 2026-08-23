// Kept open-ended so admin-created courses can introduce new categories.
export type CourseCategory = string;

export const COURSE_CATEGORIES = [
  "Programming",
  "Full Stack",
  "Web Development",
  "Java",
  "AI & Machine Learning",
  "Data Science",
  "Testing / QA",
  "Mobile Development",
  "DevOps & Cloud",
] as const;

export type CourseMode = "online" | "offline" | "hybrid";

export interface SyllabusModule {
  title: string;
  topics: string[];
}

export type CourseType = "classes" | "mock-test" | "webinar";

export type LessonType = "video" | "document" | "quiz";

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  /** YouTube / Vimeo / direct video URL. */
  videoUrl?: string;
  durationMinutes?: number;
  /** Markdown body shown under the video or as the document itself. */
  content?: string;
  attachmentUrl?: string;
  attachmentLabel?: string;
  /** For quiz lessons. */
  quizSlug?: string;
  /** Viewable without enrolling. */
  isPreview?: boolean;
}

export interface CurriculumSection {
  title: string;
  lessons: Lesson[];
}

export interface Material {
  label: string;
  url: string;
}

export interface Course {
  /** classes = recorded/live lessons, mock-test = quiz series, webinar = free single session. */
  type?: CourseType;
  tags?: string[];
  /** Days of access after enrollment; 0 = lifetime. */
  validityDays?: number;
  certificate?: boolean;
  /** Learnable content — sections of lessons (video / document / quiz). */
  curriculum?: CurriculumSection[];
  /** Downloadable study materials. */
  materials?: Material[];
  title: string;
  slug: string;
  category: CourseCategory;
  tagline: string;
  description: string;
  syllabus: SyllabusModule[];
  duration: string;
  mode: CourseMode;
  level: "Beginner" | "Intermediate" | "Advanced";
  fee: number;
  discountFee: number;
  trainerSlug: string;
  prerequisites: string[];
  outcomes: string[];
  formats: ("classroom" | "live-online" | "self-paced")[];
  rating: number;
  reviewCount: number;
  learners: number;
  featured: boolean;
  nextBatch: string;
  /** Cover image URL (Unsplash or uploaded); empty string falls back to a gradient. */
  image: string;
}

export interface Trainer {
  name: string;
  slug: string;
  /** Portrait photo URL; empty string falls back to initials. */
  photo?: string;
  role: string;
  bio: string;
  expertise: string[];
  experienceYears: number;
  linkedin: string;
}

export interface Center {
  name: string;
  city: string;
  address: string;
  phone: string;
  hours: string;
  mapUrl: string;
  image: string;
}

export interface Testimonial {
  /** Stable key used to merge dashboard edits over the seed. */
  slug: string;
  studentName: string;
  courseSlug: string;
  courseTitle: string;
  role: string;
  company: string;
  rating: number;
  /** Short review headline shown above the quote. */
  title: string;
  text: string;
  /** Portrait photo URL; empty string falls back to initials. */
  avatar: string;
  /** Optional YouTube/Vimeo URL for a video testimonial. */
  videoUrl?: string;
}

export interface PlacementStory {
  slug: string;
  studentName: string;
  background: string;
  company: string;
  role: string;
  packageLpa: number;
  year: number;
  courseTitle: string;
}

export interface Faq {
  slug: string;
  question: string;
  answer: string;
  category: "General" | "Courses" | "Payments" | "Placements";
}

export interface Lead {
  name: string;
  phone: string;
  email: string;
  courseInterest?: string;
  message?: string;
  source: string;
  status: "new";
  createdAt: string;
}

export const BLOG_CATEGORIES = [
  "Career Guides",
  "Tutorials",
  "Interview Prep",
  "Industry Insights",
  "Student Stories",
  "Axcvia News",
] as const;

export interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  /** Markdown body — see components/site/markdown.tsx for supported syntax. */
  content: string;
  category: string;
  tags: string[];
  /** Trainer slug; falls back to authorName when no trainer matches. */
  authorSlug: string;
  authorName: string;
  coverImage: string;
  /** ISO date string. */
  publishedAt: string;
  readingMinutes: number;
  /** Courses promoted at the end of the post. */
  relatedCourseSlugs: string[];
  featured: boolean;
}

export type EnrollmentStatus = "pending" | "confirmed" | "paid" | "cancelled";

export interface Enrollment {
  name: string;
  phone: string;
  email: string;
  courseSlug: string;
  courseTitle: string;
  format: string;
  amount: number;
  message: string;
  status: EnrollmentStatus;
  createdAt: string;
}

// ---------- LMS ----------

export interface QuizQuestion {
  text: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface Quiz {
  slug: string;
  title: string;
  description: string;
  courseSlug: string;
  durationMinutes: number;
  passingPercent: number;
  /** Free sample — any logged-in student can attempt without enrolling. */
  isFreeSample: boolean;
  /** Randomise question order per attempt. */
  shuffle: boolean;
  questions: QuizQuestion[];
}

export interface Bundle {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  courseSlugs: string[];
  price: number;
  discountPrice: number;
  image: string;
  validityDays: number;
  featured: boolean;
}

export interface LandingSection {
  heading: string;
  body: string;
}

export interface LandingPage {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  heroTitle: string;
  heroText: string;
  heroImage: string;
  sections: LandingSection[];
  /** Courses to list — explicit slugs, or all courses carrying this tag. */
  courseSlugs: string[];
  courseTag: string;
  bundleSlugs: string[];
  faqs: { question: string; answer: string }[];
  highlights: { title: string; text: string }[];
  showInNav: boolean;
  navGroup: string;
}

export interface Coupon {
  code: string;
  percentOff: number;
  flatOff: number;
  minAmount: number;
  newStudentsOnly: boolean;
  active: boolean;
  expiresAt: string;
  description: string;
}

export interface SiteSettings {
  promoEnabled: boolean;
  promoTitle: string;
  promoText: string;
  promoCode: string;
  popupEnabled: boolean;
  popupDelaySeconds: number;
  announcement: string;
  razorpayEnabled: boolean;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  wishlist: string[];
  createdAt: string;
}

export type OrderStatus = "pending" | "paid" | "failed" | "cancelled";

export interface OrderItem {
  kind: "course" | "bundle";
  slug: string;
  title: string;
  price: number;
  validityDays: number;
}

export interface StudentEnrollment {
  id: string;
  courseSlug: string;
  courseTitle: string;
  status: EnrollmentStatus;
  expiresAt: string | null;
  completedLessons: string[];
  certificateIssuedAt: string | null;
  createdAt: string;
}
