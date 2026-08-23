import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { OrderModel } from "@/lib/models/order";
import { verifyRazorpaySignature } from "@/lib/payments/razorpay";
import { getCurrentStudent } from "@/lib/student/auth";
import { fulfilOrder } from "@/lib/student/orders";

// Called by the browser after Razorpay checkout succeeds. Verifies the
// payment signature server-side before granting access.
export async function POST(request: Request) {
  const student = await getCurrentStudent();
  if (!student) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json().catch(() => ({}))) as Record<string, string>;
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;
  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }
  await connectDb();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const order: any = await OrderModel.findById(orderId).lean();
  if (!order || String(order.userId) !== student.id || order.razorpayOrderId !== razorpay_order_id) {
    return NextResponse.json({ error: "Order mismatch" }, { status: 400 });
  }
  if (!verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    await OrderModel.findByIdAndUpdate(orderId, { status: "failed" });
    return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
  }
  await fulfilOrder(orderId, "razorpay", razorpay_payment_id);
  return NextResponse.json({ ok: true });
}
