import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, trim: true, uppercase: true },
    description: { type: String, trim: true, default: "" },
    percentOff: { type: Number, min: 0, max: 100, default: 0 },
    flatOff: { type: Number, min: 0, default: 0 },
    minAmount: { type: Number, min: 0, default: 0 },
    newStudentsOnly: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    expiresAt: { type: Date, default: null },
    uses: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const CouponModel = mongoose.models.Coupon ?? mongoose.model("Coupon", couponSchema);
