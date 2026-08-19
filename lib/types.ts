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

export interface Course {
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
}

export interface Trainer {
  name: string;
  slug: string;
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
}

export interface Testimonial {
  studentName: string;
  courseSlug: string;
  courseTitle: string;
  role: string;
  company: string;
  rating: number;
  text: string;
}

export interface PlacementStory {
  studentName: string;
  background: string;
  company: string;
  role: string;
  packageLpa: number;
  year: number;
  courseTitle: string;
}

export interface Faq {
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
