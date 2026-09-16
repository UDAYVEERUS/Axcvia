import mongoose, { Schema } from "mongoose";

// Course categories. Course.category stores the category *name*; `slug` must
// equal slugify(name) so /courses/category/[slug] URLs resolve (enforced by
// scripts/reseed-courses.mjs).
const categorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, trim: true, maxlength: 500, default: "" },
    order: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CategoryModel = mongoose.models.Category ?? mongoose.model("Category", categorySchema);
