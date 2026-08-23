import mongoose, { Schema } from "mongoose";

const faqSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    question: { type: String, required: true, trim: true, maxlength: 300 },
    answer: { type: String, trim: true, maxlength: 3000, default: "" },
    category: { type: String, trim: true, default: "General" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const FaqModel = mongoose.models.Faq ?? mongoose.model("Faq", faqSchema);
