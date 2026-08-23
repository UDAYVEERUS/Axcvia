import mongoose, { Schema } from "mongoose";

const testimonialSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    studentName: { type: String, required: true, trim: true, maxlength: 100 },
    courseSlug: { type: String, trim: true, default: "" },
    courseTitle: { type: String, trim: true, default: "" },
    role: { type: String, trim: true, default: "" },
    company: { type: String, trim: true, default: "" },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    title: { type: String, trim: true, maxlength: 120, default: "" },
    text: { type: String, trim: true, maxlength: 2000, default: "" },
    avatar: { type: String, trim: true, default: "" },
    videoUrl: { type: String, trim: true, default: "" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const TestimonialModel =
  mongoose.models.Testimonial ?? mongoose.model("Testimonial", testimonialSchema);
