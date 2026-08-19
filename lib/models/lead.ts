import mongoose, { Schema } from "mongoose";

// SOW §3.3 `leads` collection.
const leadSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    email: { type: String, trim: true, lowercase: true, maxlength: 100 },
    courseInterest: { type: String, trim: true, maxlength: 100 },
    message: { type: String, trim: true, maxlength: 1000 },
    source: { type: String, trim: true, maxlength: 50, default: "website" },
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "lost"],
      default: "new",
      index: true,
    },
    notes: { type: String, maxlength: 2000 },
  },
  { timestamps: true }
);

export const LeadModel = mongoose.models.Lead ?? mongoose.model("Lead", leadSchema);
