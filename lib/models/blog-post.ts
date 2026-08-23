import mongoose, { Schema } from "mongoose";

// `blogposts` collection. Posts created in the admin dashboard live here; the
// public site merges them over the static seed by slug.
const blogPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    excerpt: { type: String, trim: true, maxlength: 400, default: "" },
    content: { type: String, default: "" },
    category: { type: String, trim: true, maxlength: 60, default: "Tutorials" },
    tags: { type: [String], default: [] },
    authorSlug: { type: String, trim: true, default: "" },
    authorName: { type: String, trim: true, default: "" },
    coverImage: { type: String, trim: true, default: "" },
    publishedAt: { type: Date, default: Date.now },
    readingMinutes: { type: Number, min: 1, default: 5 },
    relatedCourseSlugs: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const BlogPostModel =
  mongoose.models.BlogPost ?? mongoose.model("BlogPost", blogPostSchema);
