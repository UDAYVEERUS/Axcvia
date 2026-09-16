"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectDb, isDbConfigured } from "@/lib/db";
import { EnrollmentModel } from "@/lib/models/enrollment";
import { OrderModel } from "@/lib/models/order";
import { QuizAttemptModel } from "@/lib/models/quiz-attempt";
import { StudentModel } from "@/lib/models/student";
import { createRazorpayOrder, isRazorpayConfigured } from "@/lib/payments/razorpay";
import { courseLessons, getCourseBySlug } from "@/lib/services/courses";
import { getQuizBySlug } from "@/lib/services/lms";
import { getCurrentStudent, requireStudent, safeNext } from "@/lib/student/auth";
import { getAccess, grantEnrollment } from "@/lib/student/enrollments";
import { applyCoupon, fulfilOrder, priceCart, reservePendingEnrollments, type CartLine } from "@/lib/student/orders";

// Every action below re-verifies the caller: Server Actions are reachable by
// direct POST, so a page or layout having checked is not enough.

const text = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

// ---------- auth ----------
// Sign-in is Google OAuth through Better Auth (/api/auth/*). There are no passwords.

export async function logoutStudentAction() {
  await auth.api.signOut({ headers: await headers() }).catch(() => null);
  redirect("/");
}

/** Revokes every session for this account (all devices), including this one. */
export async function signOutEverywhereAction() {
  await requireStudent("/dashboard/profile");
  await auth.api.revokeSessions({ headers: await headers() });
  redirect("/login");
}

export async function updateProfileAction(formData: FormData) {
  const student = await requireStudent("/dashboard/profile");
  const name = text(formData, "name").slice(0, 100);
  const phone = text(formData, "phone").slice(0, 20);
  if (!name) redirect("/dashboard/profile?error=invalid");
  await connectDb();
  await StudentModel.findByIdAndUpdate(student.id, { name, phone });
  revalidatePath("/dashboard", "layout");
  redirect("/dashboard/profile?saved=1");
}

// ---------- wishlist ----------

export async function toggleWishlistAction(formData: FormData) {
  const slug = text(formData, "slug");
  const back = safeNext(text(formData, "back"), `/courses/${slug}`);
  const student = await getCurrentStudent();
  if (!student) redirect(`/login?next=${encodeURIComponent(back)}`);
  const course = await getCourseBySlug(slug);
  if (!course) redirect(back);
  await connectDb();
  const has = student.wishlist.includes(slug);
  await StudentModel.findByIdAndUpdate(student.id, has ? { $pull: { wishlist: slug } } : { $addToSet: { wishlist: slug } });
  revalidatePath(back);
  revalidatePath("/dashboard/wishlist");
  redirect(back);
}

// ---------- free enrollment (webinars / ₹0 courses) ----------

export async function enrollFreeAction(formData: FormData) {
  const slug = text(formData, "slug");
  const student = await getCurrentStudent();
  if (!student) redirect(`/login?next=${encodeURIComponent(`/courses/${slug}`)}`);
  const course = await getCourseBySlug(slug);
  // Free enrollment is for webinars only — a paid course whose fee isn't set yet
  // must never be claimable for ₹0.
  if (!course || course.discountFee > 0 || course.type !== "webinar") redirect(`/courses/${slug}`);
  await grantEnrollment({
    userId: student.id, name: student.name, email: student.email, phone: student.phone,
    courseSlug: course.slug, courseTitle: course.title, validityDays: course.validityDays ?? 0,
    amount: 0, status: "paid", source: "free",
  });
  revalidatePath("/dashboard");
  redirect(`/learn/${slug}`);
}

// ---------- lesson progress ----------

export async function completeLessonAction(formData: FormData) {
  const courseSlug = text(formData, "courseSlug");
  const lessonId = text(formData, "lessonId");
  const nextId = text(formData, "nextId");
  const student = await requireStudent(`/learn/${courseSlug}`);
  const [course, access] = await Promise.all([getCourseBySlug(courseSlug), getAccess(student.id, courseSlug)]);
  if (!course || !access) redirect(`/courses/${courseSlug}`);

  const lessonIds = courseLessons(course).map((l) => l.id);
  if (!lessonIds.includes(lessonId)) redirect(`/learn/${courseSlug}`);

  await connectDb();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const doc: any = await EnrollmentModel.findById(access.id);
  if (!doc.completedLessons.includes(lessonId)) doc.completedLessons.push(lessonId);
  const done = lessonIds.every((id) => doc.completedLessons.includes(id));
  if (done && course.certificate !== false && !doc.certificateIssuedAt) doc.certificateIssuedAt = new Date();
  await doc.save();
  revalidatePath(`/learn/${courseSlug}`);
  revalidatePath("/dashboard");
  redirect(nextId && lessonIds.includes(nextId) ? `/learn/${courseSlug}/${nextId}` : `/learn/${courseSlug}`);
}

// ---------- quizzes ----------

export interface QuizResult {
  attemptId: string;
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  order: number[];
  answers: number[];
}

export async function submitQuizAction(input: {
  quizSlug: string;
  order: number[];
  answers: number[];
  timeTakenSeconds: number;
}): Promise<QuizResult | { error: string }> {
  const student = await getCurrentStudent();
  if (!student) return { error: "Please sign in to submit the test." };
  const quiz = await getQuizBySlug(String(input?.quizSlug ?? ""));
  if (!quiz) return { error: "Quiz not found." };
  if (!quiz.isFreeSample) {
    const access = quiz.courseSlug ? await getAccess(student.id, quiz.courseSlug) : null;
    if (!access) return { error: "You are not enrolled in this test series." };
  }
  const rawOrder = Array.isArray(input.order) ? input.order : [];
  const rawAnswers = Array.isArray(input.answers) ? input.answers : [];
  const order = [...new Set(rawOrder.filter((i) => Number.isInteger(i) && i >= 0 && i < quiz.questions.length))];
  const answers = order.map((_, i) => (Number.isInteger(rawAnswers[i]) ? rawAnswers[i] : -1));
  const total = quiz.questions.length;
  let score = 0;
  order.forEach((qIndex, i) => {
    if (answers[i] === quiz.questions[qIndex].correctIndex) score++;
  });
  const percent = total ? Math.round((score / total) * 100) : 0;
  const passed = percent >= quiz.passingPercent;
  const timeTakenSeconds = Math.max(0, Math.min(Number(input.timeTakenSeconds) || 0, 24 * 60 * 60));
  await connectDb();
  const attempt = await QuizAttemptModel.create({
    userId: student.id,
    quizSlug: quiz.slug,
    quizTitle: quiz.title,
    courseSlug: quiz.courseSlug,
    answers,
    order,
    score,
    total,
    percent,
    passed,
    timeTakenSeconds,
  });
  revalidatePath("/dashboard/results");
  return { attemptId: String(attempt._id), score, total, percent, passed, order, answers };
}

// ---------- checkout ----------

export interface CheckoutResult {
  orderId: string;
  total: number;
  razorpay?: { keyId: string; razorpayOrderId: string; amountPaise: number; name: string; email: string; phone: string };
  error?: string;
}

export async function createOrderAction(input: { lines: CartLine[]; couponCode: string; method: "razorpay" | "pay-later" }): Promise<CheckoutResult> {
  const student = await getCurrentStudent();
  if (!student) return { orderId: "", total: 0, error: "Please sign in to continue." };
  if (!isDbConfigured()) return { orderId: "", total: 0, error: "Checkout is not available yet — database not connected." };

  // Prices always come from the server catalog, never from the client cart.
  const items = await priceCart(Array.isArray(input?.lines) ? input.lines : []);
  if (items.length === 0) return { orderId: "", total: 0, error: "Your cart is empty." };
  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const { coupon, discount, error } = await applyCoupon(String(input.couponCode ?? ""), subtotal, student.id);
  if (error) return { orderId: "", total: 0, error };
  const total = Math.max(0, subtotal - discount);
  const method = input.method === "razorpay" ? "razorpay" : "pay-later";

  await connectDb();
  const order: any = await OrderModel.create({
    userId: student.id,
    items,
    subtotal,
    discount,
    couponCode: coupon?.code ?? "",
    total,
    status: "pending",
    paymentMethod: total === 0 ? "free" : method,
  });
  const orderId = String(order._id);

  if (total === 0) {
    await fulfilOrder(orderId, "free");
    return { orderId, total };
  }

  if (method === "razorpay" && isRazorpayConfigured()) {
    try {
      const razorpayOrderId = await createRazorpayOrder(total, orderId);
      order.razorpayOrderId = razorpayOrderId;
      await order.save();
      return {
        orderId,
        total,
        razorpay: {
          keyId: process.env.RAZORPAY_KEY_ID!,
          razorpayOrderId,
          amountPaise: Math.round(total * 100),
          name: student.name,
          email: student.email,
          phone: student.phone,
        },
      };
    } catch (err) {
      console.error("[checkout] Razorpay order failed:", err);
      return { orderId, total, error: "Payment initialisation failed. Please try again or choose pay later." };
    }
  }

  await reservePendingEnrollments(orderId);
  return { orderId, total };
}

export async function validateCouponAction(input: { lines: CartLine[]; couponCode: string }) {
  const student = await getCurrentStudent();
  if (!student) return { discount: 0, error: "Sign in to apply a coupon." };
  const items = await priceCart(Array.isArray(input?.lines) ? input.lines : []);
  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const { coupon, discount, error } = await applyCoupon(String(input.couponCode ?? ""), subtotal, student.id);
  return { discount, error, description: coupon?.description ?? "" };
}
