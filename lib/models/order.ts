import mongoose, { Schema } from "mongoose";

const orderItemSchema = new Schema(
  {
    kind: { type: String, enum: ["course", "bundle"], required: true },
    slug: { type: String, required: true },
    title: { type: String, default: "" },
    price: { type: Number, default: 0 },
    validityDays: { type: Number, default: 0 },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Student", required: true, index: true },
    items: { type: [orderItemSchema], default: [] },
    subtotal: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String, default: "" },
    total: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["pending", "paid", "failed", "cancelled"],
      default: "pending",
      index: true,
    },
    paymentMethod: { type: String, enum: ["razorpay", "pay-later", "manual", "free"], default: "pay-later" },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    paidAt: { type: Date, default: null },
    note: { type: String, default: "" },
  },
  { timestamps: true }
);

export const OrderModel = mongoose.models.Order ?? mongoose.model("Order", orderSchema);
