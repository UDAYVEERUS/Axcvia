"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { connectDb, isDbConfigured } from "@/lib/db";
import { EnrollmentModel } from "@/lib/models/enrollment";
import { OrderModel } from "@/lib/models/order";
import { QuizAttemptModel } from "@/lib/models/quiz-attempt";
import { StudentModel } from "@/lib/models/student";
import { createRazorpayOrder, isRazorpayConfigured } from "@/lib/payments/razorpay";
import { courseLessons, getCourseBySlug } from "@/lib/services/courses";
import { getQuizBySlug } from "@/lib/services/lms";
import {
  checkPassword,
  clearStudentSession,
  getCurrentStudent,
  hashPassword,
  requireStudent,
  setStudentSession,
} from "@/lib/student/auth";
import { getAccess, grantEnrollment } from "@/lib/student/enrollments";
import { applyCoupon, fulfilOrder, priceCart, reservePendingEnrollments, type CartLine } from "@/lib/student/orders";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const text = (fd: FormData, k: string) => String(fd.get(k) ?? "").trim();

function safeNext(next: string) {
  return next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

// ---------- auth ----------

export async function registerAction(formData: FormData) {
  const name = text(formData, "name").slice(0, 100);
  const email = text(formData, "email").toLowerCase().slice(0, 100);
  const phone = text(formData, "phone").slice(0, 20);
  const password = String(formData.get("password") ?? "");
  const next = safeNext(text(formData, "next"));
  const back = `/register?next=${encodeURIComponent(next)}`;

  if (!isDbConfigured()) redirect(`${back}&error=nodb`);
  if (!name || !EMAIL_RE.test(email)) redirect(`${back}&error=invalid`);
  if (password.length < 8) redirect(`${back}&error=password`);

  await connectDb();
  if (await StudentModel.exists({ email })) redirect(`${back}&error=exists`);
  const doc = await StudentModel.create({ name, email, phone, passwordHash: hashPassword(password) });
  await setStudentSession(String(doc._id));
  redirect(next);
}

export async function loginAction(formData: FormData) {
  const email = text(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(text(formData, "next"));
  const back = `/login?next=${encodeURIComponent(next)}`;
  if (!isDbConfigured()) redirect(`${back}&error=nodb`);
  await connectDb();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const doc: any = await StudentModel.findOne({ email }).lean();
  if (!doc || !checkPassword(password, doc.passwordHash)) redirect(`${back}&error=invalid`);
  await setStudentSession(String(doc._id));
  redirect(next);
}

export async function logoutStudentAction() {
  await clearStudentSession();
  redirect("/");
}

export async function updateProfileAction(formData: FormData) {
  const student = await requireStudent("/dashboard/profile");
  const name = text(formData, "name").slice(0, 100);
  const phone = text(formData, "phone").slice(0, 20);
  if (!name) redirect("/dashboard/profile?error=invalid");
  await connectDb();
  await StudentModel.findByIdAndUpdate(student.id, { name, phone });
  revalidatePath("/dashboard/profile");
  redirect("/dashboard/profile?saved=1");
}

export async function changePasswordAction(formData: FormData) {
  const student = await requireStudent("/dashboard/profile");
  const current = String(formData.get("current") ?? "");
  const password = String(formData.get("password") ?? "");
  if (password.length < 8) redirect("/dashboard/profile?error=password");
  await connectDb();
  const doc: any = await StudentModel.findById(student.id);
  if (!doc || !checkPassword(current, doc.passwordHash)) redirect("/dashboard/profile?error=current");
  doc.passwordHash = hashPassword(password);
  await doc.save();
  redirect("/dashboard/profile?saved=1");
}

// ---------- wishlist ----------

export async function toggleWishlistAction(formData: FormData) {
  const slug = text(formData, "slug");
  const back = text(formData, "back") || `/courses/${slug}`;
  const student = await getCurrentStudent();
  if (!student) redirect(`/login?next=${encodeURIComponent(back)}`);
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
  if (!course || course.discountFee > 0) redirect(`/courses/${slug}`);
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

  await connectDb();
  const doc: any = await EnrollmentModel.findById(access.id);
  if (!doc.completedLessons.includes(lessonId)) doc.completedLessons.push(lessonId);
  const all = courseLessons(course).map((l) => l.id);
  const done = all.every((id) => doc.completedLessons.includes(id));
  if (done && course.certificate !== false && !doc.certificateIssuedAt) doc.certificateIssuedAt = new Date();
  await doc.save();
  revalidatePath(`/learn/${courseSlug}`);
  revalidatePath("/dashboard");
  redirect(nextId ? `/learn/${courseSlug}/${nextId}` : `/learn/${courseSlug}`);
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
  const quiz = await getQuizBySlug(input.quizSlug);
  if (!quiz) return { error: "Quiz not found." };
  if (!quiz.isFreeSample) {
    const access = quiz.courseSlug ? await getAccess(student.id, quiz.courseSlug) : null;
    if (!access) return { error: "You are not enrolled in this test series." };
  }
  const order = input.order.filter((i) => Number.isInteger(i) && i >= 0 && i < quiz.questions.length);
  const total = quiz.questions.length;
  let score = 0;
  order.forEach((qIndex, i) => {
    if (input.answers[i] === quiz.questions[qIndex].correctIndex) score++;
  });
  const percent = total ? Math.round((score / total) * 100) : 0;
  const passed = percent >= quiz.passingPercent;
  await connectDb();
  const attempt = await QuizAttemptModel.create({
    userId: student.id,
    quizSlug: quiz.slug,
    quizTitle: quiz.title,
    courseSlug: quiz.courseSlug,
    answers: input.answers,
    order,
    score,
    total,
    percent,
    passed,
    timeTakenSeconds: input.timeTakenSeconds,
  });
  revalidatePath("/dashboard/results");
  return { attemptId: String(attempt._id), score, total, percent, passed, order, answers: input.answers };
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

  const items = await priceCart(input.lines);
  if (items.length === 0) return { orderId: "", total: 0, error: "Your cart is empty." };
  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const { coupon, discount, error } = await applyCoupon(input.couponCode, subtotal, student.id);
  if (error) return { orderId: "", total: 0, error };
  const total = Math.max(0, subtotal - discount);

  await connectDb();
  const order: any = await OrderModel.create({
    userId: student.id,
    items,
    subtotal,
    discount,
    couponCode: coupon?.code ?? "",
    total,
    status: "pending",
    paymentMethod: total === 0 ? "free" : input.method,
  });
  const orderId = String(order._id);

  if (total === 0) {
    await fulfilOrder(orderId, "free");
    return { orderId, total };
  }

  if (input.method === "razorpay" && isRazorpayConfigured()) {
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
      return { orderId, total, error: err instanceof Error ? err.message : "Payment initialisation failed" };
    }
  }

  await reservePendingEnrollments(orderId);
  return { orderId, total };
}

export async function validateCouponAction(input: { lines: CartLine[]; couponCode: string }) {
  const student = await getCurrentStudent();
  if (!student) return { discount: 0, error: "Sign in to apply a coupon." };
  const items = await priceCart(input.lines);
  const subtotal = items.reduce((s, i) => s + i.price, 0);
  const { coupon, discount, error } = await applyCoupon(input.couponCode, subtotal, student.id);
  return { discount, error, description: coupon?.description ?? "" };
}
