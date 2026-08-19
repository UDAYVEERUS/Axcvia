"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EnquiryForm({
  source,
  courseOptions,
  defaultCourse,
  heading = "Get a Free Career Consultation",
  buttonLabel = "Request Callback",
}: {
  source: string;
  courseOptions: { title: string; slug: string }[];
  defaultCourse?: string;
  heading?: string;
  buttonLabel?: string;
}) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [courseInterest, setCourseInterest] = useState(defaultCourse ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      courseInterest,
      message: String(data.get("message") ?? "").trim(),
      source,
    };
    if (!payload.name || !payload.phone) {
      setError("Please fill in your name and phone number.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Something went wrong");
      setStatus("success");
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border bg-card p-8 text-center shadow-sm">
        <CheckCircle2 className="size-10 text-teal" aria-hidden />
        <p className="text-lg font-semibold text-navy">Thank you! We&apos;ve received your enquiry.</p>
        <p className="text-sm text-muted-foreground">
          Our counsellor will call you within one business day.
        </p>
        <Button variant="outline" onClick={() => setStatus("idle")}>
          Submit another enquiry
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border bg-card p-6 shadow-sm sm:p-8"
      aria-label={heading}
    >
      <p className="text-lg font-semibold text-navy">{heading}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={`${source}-name`}>Full Name *</Label>
          <Input id={`${source}-name`} name="name" required placeholder="Your name" autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${source}-phone`}>Phone *</Label>
          <Input
            id={`${source}-phone`}
            name="phone"
            type="tel"
            required
            placeholder="+91 XXXXX XXXXX"
            autoComplete="tel"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${source}-email`}>Email</Label>
        <Input id={`${source}-email`} name="email" type="email" placeholder="you@example.com" autoComplete="email" />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${source}-course`}>Course of Interest</Label>
        <Select value={courseInterest} onValueChange={setCourseInterest}>
          <SelectTrigger id={`${source}-course`} className="w-full">
            <SelectValue placeholder="Select a course" />
          </SelectTrigger>
          <SelectContent>
            {courseOptions.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.title}
              </SelectItem>
            ))}
            <SelectItem value="not-sure">Not sure yet — need guidance</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${source}-message`}>Message (optional)</Label>
        <Textarea id={`${source}-message`} name="message" placeholder="Tell us about your background or goals" rows={3} />
      </div>
      {status === "error" && (
        <p role="alert" className="text-sm font-medium text-destructive">{error}</p>
      )}
      <Button
        type="submit"
        disabled={status === "submitting"}
        className="w-full bg-teal text-white hover:bg-teal/90"
      >
        {status === "submitting" && <Loader2 className="size-4 animate-spin" aria-hidden />}
        {buttonLabel}
      </Button>
      <p className="text-xs text-muted-foreground">
        By submitting, you agree to our privacy policy. We never spam.
      </p>
    </form>
  );
}
