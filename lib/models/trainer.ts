import mongoose, { Schema } from "mongoose";

const trainerSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    role: { type: String, trim: true, maxlength: 120, default: "" },
    bio: { type: String, trim: true, maxlength: 2000, default: "" },
    expertise: { type: [String], default: [] },
    experienceYears: { type: Number, min: 0, default: 0 },
    linkedin: { type: String, trim: true, default: "" },
    photo: { type: String, trim: true, default: "" },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const TrainerModel = mongoose.models.Trainer ?? mongoose.model("Trainer", trainerSchema);
