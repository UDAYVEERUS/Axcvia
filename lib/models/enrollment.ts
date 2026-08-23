import mongoose, { Schema } from "mongoose";

// `enrollments` collection. Created by checkout (paid orders), by the
// pay-later reservation form, by free webinar sign-ups, or manually by an
// admin. `userId` links it to a student account; status "paid"/"confirmed"
// grants access to the course player while `expiresAt` is in the future.
const enrollmentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    email: { type: String, trim: true, lowercase: true, maxlength: 100 },
    courseSlug: { type: String, required: true, trim: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "Student", index: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    bundleSlug: { type: String, trim: true, default: "" },
    expiresAt: { type: Date, default: null },
    completedLessons: { type: [String], default: [] },
    certificateIssuedAt: { type: Date, default: null },
    courseTitle: { type: String, trim: true, default: "" },
    format: { type: String, trim: true, default: "live-online" },
    amount: { type: Number, min: 0, default: 0 },
    message: { type: String, trim: true, maxlength: 1000, default: "" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "paid", "cancelled"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

export const EnrollmentModel =
  mongoose.models.Enrollment ?? mongoose.model("Enrollment", enrollmentSchema);
