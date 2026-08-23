import mongoose, { Schema } from "mongoose";

const studentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    phone: { type: String, trim: true, default: "" },
    passwordHash: { type: String, required: true },
    wishlist: { type: [String], default: [] },
    resetToken: { type: String, default: "" },
    resetExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

export const StudentModel = mongoose.models.Student ?? mongoose.model("Student", studentSchema);
