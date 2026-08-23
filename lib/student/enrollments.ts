import "server-only";
import type { StudentEnrollment } from "@/lib/types";
import { connectDb, isDbConfigured } from "@/lib/db";
import { EnrollmentModel } from "@/lib/models/enrollment";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function toStudentEnrollment(doc: any): StudentEnrollment {
  return {
    id: String(doc._id),
    courseSlug: doc.courseSlug,
    courseTitle: doc.courseTitle ?? doc.courseSlug,
    status: doc.status ?? "pending",
    expiresAt: doc.expiresAt ? new Date(doc.expiresAt).toISOString() : null,
    completedLessons: doc.completedLessons ?? [],
    certificateIssuedAt: doc.certificateIssuedAt ? new Date(doc.certificateIssuedAt).toISOString() : null,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
  };
}

export function isActive(e: StudentEnrollment) {
  if (e.status !== "paid" && e.status !== "confirmed") return false;
  if (e.expiresAt && new Date(e.expiresAt) < new Date()) return false;
  return true;
}

export async function getStudentEnrollments(userId: string): Promise<StudentEnrollment[]> {
  if (!isDbConfigured()) return [];
  try {
    await connectDb();
    const docs = await EnrollmentModel.find({ userId }).sort({ createdAt: -1 }).lean();
    return docs.map(toStudentEnrollment);
  } catch {
    return [];
  }
}

/** Active enrollment for a course, or null. */
export async function getAccess(userId: string, courseSlug: string) {
  const all = await getStudentEnrollments(userId);
  return all.find((e) => e.courseSlug === courseSlug && isActive(e)) ?? null;
}

export function expiryFor(validityDays: number): Date | null {
  if (!validityDays || validityDays <= 0) return null;
  return new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000);
}

/** Create (or reactivate) an enrollment for a student. Idempotent per course. */
export async function grantEnrollment(opts: {
  userId: string;
  name: string;
  email: string;
  phone: string;
  courseSlug: string;
  courseTitle: string;
  validityDays: number;
  amount: number;
  status: "paid" | "confirmed" | "pending";
  orderId?: string;
  bundleSlug?: string;
  source: string;
}) {
  await connectDb();
  const expiresAt = expiryFor(opts.validityDays);
  const existing: any = await EnrollmentModel.findOne({ userId: opts.userId, courseSlug: opts.courseSlug });
  if (existing) {
    existing.status = opts.status;
    existing.expiresAt = expiresAt;
    if (opts.orderId) existing.orderId = opts.orderId;
    if (opts.bundleSlug) existing.bundleSlug = opts.bundleSlug;
    await existing.save();
    return existing;
  }
  return EnrollmentModel.create({
    name: opts.name,
    phone: opts.phone,
    email: opts.email,
    courseSlug: opts.courseSlug,
    courseTitle: opts.courseTitle,
    format: opts.source,
    amount: opts.amount,
    message: "",
    status: opts.status,
    userId: opts.userId,
    orderId: opts.orderId,
    bundleSlug: opts.bundleSlug ?? "",
    expiresAt,
  });
}
