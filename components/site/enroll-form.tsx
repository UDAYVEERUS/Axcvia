"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatInr } from "@/components/site/course-card";

const formatLabel: Record<string, string> = {
  classroom: "Classroom",
  "live-online": "Live Online",
  "self-paced": "Self-Paced",
};

export function EnrollForm({
  courseSlug,
  courseTitle,
  formats,
  amount,
}: {
  courseSlug: string;
  courseTitle: string;
  formats: string[];
  amount: number;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [format, setFormat] = useState(formats.includes("live-online") ? "live-online" : formats[0] ?? "live-online");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
      courseSlug,
      format,
    };
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Something went wrong");
      setStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-8 text-center shadow-sm">
        <CheckCircle2 className="size-12 text-teal" aria-hidden />
        <p className="text-xl font-bold text-navy">Your seat is reserved!</p>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          We&apos;ve received your enrollment for <strong>{courseTitle}</strong>. A counsellor will
          call you within one business day to confirm your batch and share secure payment options
          (UPI, bank transfer, or interest-free installments).
        </p>
        <Button asChild variant="outline" className="mt-2">
          <Link href="/courses">Browse more courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border bg-card p-6 shadow-sm sm:p-8" aria-label="Enrollment form">
      <div>
        <p className="text-lg font-semibold text-navy">Reserve your seat</p>
        <p className="text-sm text-muted-foreground">
          No payment required now — confirm your batch first, pay after the counselling call.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="enroll-name">Full Name *</Label>
          <Input id="enroll-name" name="name" required placeholder="Your name" autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="enroll-phone">Phone *</Label>
          <Input id="enroll-phone" name="phone" type="tel" required placeholder="+91 XXXXX XXXXX" autoComplete="tel" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="enroll-email">Email *</Label>
        <Input id="enroll-email" name="email" type="email" required placeholder="you@example.com" autoComplete="email" />
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Learning format</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {formats.map((f) => (
            <label
              key={f}
              className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2.5 text-sm ${format === f ? "border-teal bg-teal/5 font-semibold text-navy" : "hover:bg-accent"}`}
            >
              <input type="radio" name="format" value={f} checked={format === f} onChange={() => setFormat(f)} className="accent-teal" />
              {formatLabel[f] ?? f}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="space-y-2">
        <Label htmlFor="enroll-message">Anything we should know? (optional)</Label>
        <Textarea id="enroll-message" name="message" rows={3} placeholder="Preferred batch timing, background, installment needs…" />
      </div>
      {status === "error" && <p role="alert" className="text-sm font-medium text-destructive">{error}</p>}
      <Button type="submit" size="lg" disabled={status === "submitting"} className="w-full bg-teal text-white hover:bg-teal/90">
        {status === "submitting" && <Loader2 className="size-4 animate-spin" aria-hidden />}
        Reserve seat · {formatInr(amount)}
      </Button>
      <p className="text-xs text-muted-foreground">
        By enrolling you agree to our <Link href="/terms-of-service" className="underline">terms</Link> and{" "}
        <Link href="/refund-policy" className="underline">refund policy</Link>.
      </p>
    </form>
  );
}
