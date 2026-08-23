import mongoose, { Schema } from "mongoose";

const placementSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    studentName: { type: String, required: true, trim: true, maxlength: 100 },
    background: { type: String, trim: true, default: "" },
    company: { type: String, trim: true, default: "" },
    role: { type: String, trim: true, default: "" },
    packageLpa: { type: Number, min: 0, default: 0 },
    year: { type: Number, default: () => new Date().getFullYear() },
    courseTitle: { type: String, trim: true, default: "" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const PlacementModel =
  mongoose.models.Placement ?? mongoose.model("Placement", placementSchema);
