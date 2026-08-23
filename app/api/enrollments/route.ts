import { NextResponse } from "next/server";
import type { Enrollment } from "@/lib/types";
import { connectDb, isDbConfigured } from "@/lib/db";
import { EnrollmentModel } from "@/lib/models/enrollment";
import { LeadModel } from "@/lib/models/lead";
import { getCourseBySlug } from "@/lib/services/courses";

const PHONE_RE = /^[+\d][\d\s()-]{7,17}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Enrollment requests from /courses/[slug]/enroll. Each one is also mirrored
// into the leads inbox so counsellors see it in their existing workflow.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim().slice(0, 100);
  const phone = String(body.phone ?? "").trim().slice(0, 20);
  const email = String(body.email ?? "").trim().slice(0, 100);
  const message = String(body.message ?? "").trim().slice(0, 1000);
  const format = String(body.format ?? "live-online").trim().slice(0, 30);
  const courseSlug = String(body.courseSlug ?? "").trim().slice(0, 120);

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json({ error: "Please enter a valid phone number" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
  }
  const course = await getCourseBySlug(courseSlug);
  if (!course) return NextResponse.json({ error: "Unknown course" }, { status: 400 });

  const enrollment: Enrollment = {
    name,
    phone,
    email,
    courseSlug: course.slug,
    courseTitle: course.title,
    format,
    amount: course.discountFee,
    message,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  try {
    if (isDbConfigured()) {
      await connectDb();
      await EnrollmentModel.create(enrollment);
      await LeadModel.create({
        name,
        phone,
        email,
        courseInterest: course.slug,
        message: `[Enrollment · ${format}] ${message}`.trim(),
        source: `enroll:${course.slug}`,
        status: "new",
      });
    } else if (process.env.NODE_ENV === "development") {
      console.info("[dev] enrollment received (set MONGODB_URI to persist):", enrollment);
    } else {
      throw new Error("MONGODB_URI must be configured in production");
    }
  } catch (err) {
    console.error("Failed to save enrollment:", err);
    return NextResponse.json(
      { error: "Could not complete your enrollment. Please call us instead." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
