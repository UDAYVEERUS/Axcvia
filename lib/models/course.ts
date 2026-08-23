import mongoose, { Schema } from "mongoose";

// SOW §3.3 `courses` collection. Courses created in the admin dashboard live
// here; the public site merges them over the static seed data by slug.
const syllabusModuleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    topics: { type: [String], default: [] },
  },
  { _id: false }
);

const lessonSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ["video", "document", "quiz"], default: "video" },
    videoUrl: { type: String, trim: true, default: "" },
    durationMinutes: { type: Number, min: 0, default: 0 },
    content: { type: String, default: "" },
    attachmentUrl: { type: String, trim: true, default: "" },
    attachmentLabel: { type: String, trim: true, default: "" },
    quizSlug: { type: String, trim: true, default: "" },
    isPreview: { type: Boolean, default: false },
  },
  { _id: false }
);

const sectionSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    lessons: { type: [lessonSchema], default: [] },
  },
  { _id: false }
);

const courseSchema = new Schema(
  {
    type: { type: String, enum: ["classes", "mock-test", "webinar"], default: "classes" },
    tags: { type: [String], default: [] },
    validityDays: { type: Number, min: 0, default: 0 },
    certificate: { type: Boolean, default: true },
    curriculum: { type: [sectionSchema], default: [] },
    materials: { type: [{ label: String, url: String }], default: [] },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    category: { type: String, required: true, trim: true, maxlength: 60 },
    tagline: { type: String, trim: true, maxlength: 200, default: "" },
    description: { type: String, trim: true, maxlength: 5000, default: "" },
    syllabus: { type: [syllabusModuleSchema], default: [] },
    duration: { type: String, trim: true, default: "" },
    mode: { type: String, enum: ["online", "offline", "hybrid"], default: "hybrid" },
    level: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], default: "Beginner" },
    fee: { type: Number, min: 0, default: 0 },
    discountFee: { type: Number, min: 0, default: 0 },
    trainerSlug: { type: String, trim: true, default: "" },
    prerequisites: { type: [String], default: [] },
    outcomes: { type: [String], default: [] },
    formats: { type: [String], default: ["classroom"] },
    rating: { type: Number, min: 0, max: 5, default: 4.8 },
    reviewCount: { type: Number, min: 0, default: 0 },
    learners: { type: Number, min: 0, default: 0 },
    featured: { type: Boolean, default: false },
    nextBatch: { type: String, trim: true, default: "" },
    image: { type: String, trim: true, default: "" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CourseModel = mongoose.models.Course ?? mongoose.model("Course", courseSchema);
