import { NextResponse } from "next/server";
import type { Lead } from "@/lib/types";
import { connectDb, isDbConfigured } from "@/lib/db";
import { LeadModel } from "@/lib/models/lead";

// Leads persist to MongoDB (SOW §3.3 `leads` collection) when MONGODB_URI is
// set — serverless filesystems are ephemeral, so production requires the
// database. Local development without a database logs the lead instead.
async function saveLead(lead: Lead) {
  if (isDbConfigured()) {
    await connectDb();
    await LeadModel.create(lead);
    return;
  }
  if (process.env.NODE_ENV !== "development") {
    throw new Error("MONGODB_URI must be configured in production");
  }
  console.info("[dev] lead received (set MONGODB_URI to persist):", lead);
}

const PHONE_RE = /^[+\d][\d\s()-]{7,17}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const courseInterest = String(body.courseInterest ?? "").trim().slice(0, 100);
  const message = String(body.message ?? "").trim().slice(0, 1000);
  const source = String(body.source ?? "website").trim().slice(0, 50);

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json({ error: "Please enter a valid phone number" }, { status: 400 });
  }
  if (email && !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
  }

  const lead: Lead = {
    name,
    phone,
    email,
    courseInterest,
    message,
    source,
    status: "new",
    createdAt: new Date().toISOString(),
  };

  try {
    await saveLead(lead);
  } catch (err) {
    console.error("Failed to save lead:", err);
    return NextResponse.json(
      { error: "Could not save your enquiry. Please call us instead." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
