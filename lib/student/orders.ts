import "server-only";
import type { Coupon, OrderItem } from "@/lib/types";
import { connectDb } from "@/lib/db";
import { EnrollmentModel } from "@/lib/models/enrollment";
import { OrderModel } from "@/lib/models/order";
import { CouponModel } from "@/lib/models/coupon";
import { getAllBundles, findCoupon } from "@/lib/services/lms";
import { getAllCourses } from "@/lib/services/courses";
import { grantEnrollment } from "@/lib/student/enrollments";
import { StudentModel } from "@/lib/models/student";

export interface CartLine {
  kind: "course" | "bundle";
  slug: string;
}

/** Resolve cart lines to priced items using live DB prices (never trust the client). */
export async function priceCart(lines: CartLine[]): Promise<OrderItem[]> {
  const [courses, bundles] = await Promise.all([getAllCourses(), getAllBundles()]);
  const items: OrderItem[] = [];
  const seen = new Set<string>();
  for (const line of lines) {
    const key = `${line.kind}:${line.slug}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (line.kind === "course") {
      const c = courses.find((x) => x.slug === line.slug);
      if (c) items.push({ kind: "course", slug: c.slug, title: c.title, price: c.discountFee, validityDays: c.validityDays ?? 0 });
    } else {
      const b = bundles.find((x) => x.slug === line.slug);
      if (b) items.push({ kind: "bundle", slug: b.slug, title: b.title, price: b.discountPrice, validityDays: b.validityDays });
    }
  }
  return items;
}

export async function applyCoupon(code: string, subtotal: number, userId: string): Promise<{ coupon: Coupon | null; discount: number; error?: string }> {
  if (!code) return { coupon: null, discount: 0 };
  const coupon = await findCoupon(code);
  if (!coupon) return { coupon: null, discount: 0, error: "That coupon code is invalid or has expired." };
  if (subtotal < coupon.minAmount) return { coupon: null, discount: 0, error: `This coupon needs a minimum order of ₹${coupon.minAmount.toLocaleString("en-IN")}.` };
  if (coupon.newStudentsOnly) {
    await connectDb();
    const paidBefore = await OrderModel.exists({ userId, status: "paid" });
    if (paidBefore) return { coupon: null, discount: 0, error: "This coupon is only valid for your first purchase." };
  }
  let discount = Math.round((subtotal * coupon.percentOff) / 100) + coupon.flatOff;
  discount = Math.min(discount, subtotal);
  return { coupon, discount };
}

/** Mark an order paid and grant every enrollment it contains. Idempotent. */
export async function fulfilOrder(orderId: string, method: "razorpay" | "manual" | "free", paymentId = "") {
  await connectDb();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const order: any = await OrderModel.findById(orderId);
  if (!order) throw new Error("Order not found");
  if (order.status === "paid") return order;
  const student: any = await StudentModel.findById(order.userId).lean();
  if (!student) throw new Error("Student not found");

  const [courses, bundles] = await Promise.all([getAllCourses(), getAllBundles()]);
  for (const item of order.items as OrderItem[]) {
    if (item.kind === "course") {
      const c = courses.find((x) => x.slug === item.slug);
      await grantEnrollment({
        userId: String(student._id), name: student.name, email: student.email, phone: student.phone,
        courseSlug: item.slug, courseTitle: c?.title ?? item.title, validityDays: item.validityDays,
        amount: item.price, status: "paid", orderId: String(order._id), source: method,
      });
    } else {
      const b = bundles.find((x) => x.slug === item.slug);
      for (const slug of b?.courseSlugs ?? []) {
        const c = courses.find((x) => x.slug === slug);
        if (!c) continue;
        await grantEnrollment({
          userId: String(student._id), name: student.name, email: student.email, phone: student.phone,
          courseSlug: c.slug, courseTitle: c.title, validityDays: item.validityDays || (c.validityDays ?? 0),
          amount: 0, status: "paid", orderId: String(order._id), bundleSlug: b?.slug, source: method,
        });
      }
    }
  }
  order.status = "paid";
  order.paymentMethod = method;
  order.paidAt = new Date();
  if (paymentId) order.razorpayPaymentId = paymentId;
  await order.save();
  if (order.couponCode) await CouponModel.updateOne({ code: order.couponCode }, { $inc: { uses: 1 } });
  return order;
}

/** Pending enrollments for a pay-later order (so the admin sees them in the pipeline). */
export async function reservePendingEnrollments(orderId: string) {
  await connectDb();
  const order: any = await OrderModel.findById(orderId);
  const student: any = await StudentModel.findById(order.userId).lean();
  const [courses, bundles] = await Promise.all([getAllCourses(), getAllBundles()]);
  const slugs: { slug: string; bundle?: string; validity: number; amount: number }[] = [];
  for (const item of order.items as OrderItem[]) {
    if (item.kind === "course") slugs.push({ slug: item.slug, validity: item.validityDays, amount: item.price });
    else for (const s of bundles.find((b) => b.slug === item.slug)?.courseSlugs ?? []) slugs.push({ slug: s, bundle: item.slug, validity: item.validityDays, amount: 0 });
  }
  for (const s of slugs) {
    const c = courses.find((x) => x.slug === s.slug);
    if (!c) continue;
    const exists = await EnrollmentModel.findOne({ userId: student._id, courseSlug: c.slug, status: { $in: ["paid", "confirmed"] } });
    if (exists) continue;
    await grantEnrollment({
      userId: String(student._id), name: student.name, email: student.email, phone: student.phone,
      courseSlug: c.slug, courseTitle: c.title, validityDays: s.validity, amount: s.amount,
      status: "pending", orderId: String(order._id), bundleSlug: s.bundle, source: "pay-later",
    });
  }
}
