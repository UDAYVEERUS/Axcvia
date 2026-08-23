import "server-only";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Student } from "@/lib/types";
import { connectDb, isDbConfigured } from "@/lib/db";
import { StudentModel } from "@/lib/models/student";

export const STUDENT_COOKIE = "axcvia_student_session";
const SESSION_DAYS = 30;

function secret() {
  return (
    process.env.AUTH_SECRET ??
    process.env.ADMIN_PASSWORD ??
    (process.env.NODE_ENV === "development" ? "axcvia-dev-secret" : "")
  );
}

// ---------- passwords ----------

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function checkPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return candidate.length === expected.length && timingSafeEqual(candidate, expected);
}

// ---------- sessions ----------

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createSessionToken(userId: string) {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `${userId}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

function parseSessionToken(token: string | undefined): string | null {
  if (!token || !secret()) return null;
  const [userId, exp, sig] = token.split(".");
  if (!userId || !exp || !sig) return null;
  if (Number(exp) < Date.now()) return null;
  const expected = sign(`${userId}.${exp}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return userId;
}

type CookieStore = Awaited<ReturnType<typeof cookies>>;

export async function setStudentSession(userId: string, store?: CookieStore) {
  store ??= await cookies();
  store.set(STUDENT_COOKIE, createSessionToken(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function clearStudentSession() {
  const store = await cookies();
  store.delete(STUDENT_COOKIE);
}

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

/** The logged-in student, or null. Never throws. */
export async function getCurrentStudent(): Promise<Student | null> {
  const store = await cookies();
  const userId = parseSessionToken(store.get(STUDENT_COOKIE)?.value);
  if (!userId || !isDbConfigured()) return null;
  try {
    await connectDb();
    const doc = await StudentModel.findById(userId).lean();
    return doc ? toStudent(doc) : null;
  } catch {
    return null;
  }
}

export async function requireStudent(next?: string): Promise<Student> {
  const student = await getCurrentStudent();
  if (!student) redirect(`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`);
  return student;
}
