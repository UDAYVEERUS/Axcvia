import mongoose, { Schema } from "mongoose";

// CMS-managed landing pages served at /{slug} — e.g. /java-classes,
// /mock-tests, /cadet-programme. Equivalent to WordPress category pages.
const landingPageSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    metaTitle: { type: String, trim: true, default: "" },
    metaDescription: { type: String, trim: true, default: "" },
    eyebrow: { type: String, trim: true, default: "" },
    heroTitle: { type: String, trim: true, default: "" },
    heroText: { type: String, default: "" },
    heroImage: { type: String, trim: true, default: "" },
    sections: { type: [{ heading: String, body: String }], default: [] },
    courseSlugs: { type: [String], default: [] },
    courseTag: { type: String, trim: true, default: "" },
    bundleSlugs: { type: [String], default: [] },
    faqs: { type: [{ question: String, answer: String }], default: [] },
    highlights: { type: [{ title: String, text: String }], default: [] },
    showInNav: { type: Boolean, default: false },
    navGroup: { type: String, trim: true, default: "" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const LandingPageModel =
  mongoose.models.LandingPage ?? mongoose.model("LandingPage", landingPageSchema);
