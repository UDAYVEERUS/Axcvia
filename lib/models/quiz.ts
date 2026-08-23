import mongoose, { Schema } from "mongoose";

const questionSchema = new Schema(
  {
    text: { type: String, required: true },
    options: { type: [String], default: [] },
    correctIndex: { type: Number, min: 0, default: 0 },
    explanation: { type: String, default: "" },
  },
  { _id: false }
);

const quizSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    title: { type: String, required: true, trim: true, maxlength: 160 },
    description: { type: String, default: "" },
    courseSlug: { type: String, trim: true, default: "", index: true },
    durationMinutes: { type: Number, min: 0, default: 30 },
    passingPercent: { type: Number, min: 0, max: 100, default: 60 },
    isFreeSample: { type: Boolean, default: false },
    shuffle: { type: Boolean, default: true },
    questions: { type: [questionSchema], default: [] },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const QuizModel = mongoose.models.Quiz ?? mongoose.model("Quiz", quizSchema);
