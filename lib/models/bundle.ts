import mongoose, { Schema } from "mongoose";

const bundleSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    tagline: { type: String, trim: true, default: "" },
    description: { type: String, default: "" },
    courseSlugs: { type: [String], default: [] },
    price: { type: Number, min: 0, default: 0 },
    discountPrice: { type: Number, min: 0, default: 0 },
    image: { type: String, trim: true, default: "" },
    validityDays: { type: Number, min: 0, default: 0 },
    featured: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const BundleModel = mongoose.models.Bundle ?? mongoose.model("Bundle", bundleSchema);
