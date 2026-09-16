import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Student } from "@/lib/types";
import { auth } from "@/lib/auth";
import { connectDb, isDbConfigured } from "@/lib/db";
import { StudentModel } from "@/lib/models/student";

/** Only same-site relative paths — never `//evil.com` or `/\evil.com`. */
export function safeNext(next: unknown, fallback = "/dashboard") {
  return typeof next === "string" && /^\/(?![/\\])/.test(next) ? next : fallback;
}

/** The verified Better Auth session for this request (memoised per render), or null. */
export const getSession = cache(async () => {
  if (!isDbConfigured()) return null;
  try {
    return await auth.api.getSession({ headers: await headers() });
  } catch (err) {
    console.error("[auth] getSession failed:", err);
    return null;
  }
});

/* eslint-disable @typescript-eslint/no-explicit-any */
export function toStudent(doc: any): Student {
  return {
    id: String(doc._id),
    name: doc.name ?? "",
    email: doc.email ?? "",
    phone: doc.phone ?? "",
    wishlist: doc.wishlist ?? [],
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : "",
  };
}

/**
 * The signed-in student, as a minimal DTO with fresh profile data (wishlist,
 * phone) from the DB, or null. Never throws. Use this in every page, Server
 * Action and Route Handler that touches student data — don't rely on a
 * layout having checked.
 */
export const getCurrentStudent = cache(async (): Promise<Student | null> => {
  const session = await getSession();
  if (!session) return null;
  try {
    await connectDb();
    const doc: any = await StudentModel.findById(session.user.id).lean();
    return doc && !doc.banned ? toStudent(doc) : null;
  } catch {
    return null;
  }
});

export async function requireStudent(next?: string): Promise<Student> {
  const student = await getCurrentStudent();
  if (!student) redirect(`/login?next=${encodeURIComponent(safeNext(next))}`);
  return student;
}
