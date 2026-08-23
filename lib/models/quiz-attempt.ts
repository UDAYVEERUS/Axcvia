import mongoose, { Schema } from "mongoose";

const quizAttemptSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    quizSlug: { type: String, required: true, index: true },
    quizTitle: { type: String, default: "" },
    courseSlug: { type: String, default: "" },
    answers: { type: [Number], default: [] },
    /** Question order used for this attempt (indexes into quiz.questions). */
    order: { type: [Number], default: [] },
    score: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    percent: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    timeTakenSeconds: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const QuizAttemptModel =
  mongoose.models.QuizAttempt ?? mongoose.model("QuizAttempt", quizAttemptSchema);
