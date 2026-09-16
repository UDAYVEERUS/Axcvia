import mongoose, { Schema } from "mongoose";

// Students are Better Auth users — this model reads the shared `user`
// collection and writes only the profile fields the app owns (name, phone,
// wishlist). Identity fields (email, emailVerified, role, banned) and the
// `session` / `account` collections belong to Better Auth: change them only
// through `auth.api` (see lib/auth.ts), never here.
const studentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, trim: true, lowercase: true },
    emailVerified: { type: Boolean },
    image: { type: String },
    phone: { type: String, trim: true, default: "" },
    wishlist: { type: [String], default: [] },
    role: { type: String },
    banned: { type: Boolean },
  },
  { timestamps: true, collection: "user" }
);

export const StudentModel = mongoose.models.Student ?? mongoose.model("Student", studentSchema);
