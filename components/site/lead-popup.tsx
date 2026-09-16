"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BadgePercent, Check, Copy, X } from "lucide-react";
import { EnquiryForm } from "@/components/site/enquiry-form";

// Don't interrupt people who are already learning, paying or signing in.
const SKIP_PREFIXES = ["/checkout", "/cart", "/learn", "/dashboard", "/login", "/register"];

/**
 * Entrance offer popup: the discount from Admin → Settings, plus a short
 * callback form. Shown once per browser session after the configured delay.
 */
export function LeadPopup({
  delaySeconds,
  courseOptions,
  promoTitle,
  promoText,
  promoCode,
}: {
  delaySeconds: number;
  courseOptions: { title: string; slug: string }[];
  promoTitle: string;
  promoText: string;
  promoCode: string;
}) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const pathname = usePathname();
  const closeRef = useRef<HTMLButtonElement>(null);
  const skip = SKIP_PREFIXES.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (skip) return;
    try {
      if (sessionStorage.getItem("axcvia-popup-shown")) return;
    } catch {}
    const t = setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem("axcvia-popup-shown", "1");
      } catch {}
    }, Math.max(2, delaySeconds) * 1000);
    return () => clearTimeout(t);
  }, [delaySeconds, skip]);

  // Escape to close, and don't let the page scroll behind the dialog.
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(promoCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked (http, permissions) — the code is visible anyway.
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-60 flex items-end justify-center bg-navy-deep/70 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="offer-popup-title"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-card shadow-2xl sm:rounded-2xl">
        <button
          ref={closeRef}
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close offer"
          className="absolute right-3 top-3 z-10 rounded-full bg-navy/10 p-2 text-navy shadow-sm backdrop-blur transition-colors hover:bg-navy/20 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-teal/40"
        >
          <X className="size-4" />
        </button>

        <div className="grid sm:grid-cols-[1.05fr_1fr]">
          {/* Offer side */}
          <div className="relative overflow-hidden bg-linear-to-br from-navy via-navy to-teal p-6 text-white sm:p-8">
            <div aria-hidden className="absolute -right-16 -top-16 size-48 rounded-full bg-teal-bright/20 blur-2xl" />
            <div className="relative">
              <p className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                <BadgePercent className="size-3.5" aria-hidden /> Limited offer
              </p>
              <p className="mt-4 font-heading text-5xl font-extrabold leading-none sm:text-6xl">
                10<span className="text-teal-bright">%</span>
                <span className="ml-2 align-middle text-xl font-bold uppercase tracking-wide">off</span>
              </p>
              <h2 id="offer-popup-title" className="mt-3 text-xl font-extrabold leading-snug sm:text-2xl">
                {promoTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/80">{promoText}</p>

              {promoCode && (
                <div className="mt-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/60">Your coupon code</p>
                  <button
                    type="button"
                    onClick={copyCode}
                    className="mt-2 flex w-full items-center justify-between gap-3 rounded-xl border-2 border-dashed border-white/40 bg-white/10 px-4 py-3 text-left transition-colors hover:bg-white/20"
                  >
                    <span className="font-mono text-lg font-bold tracking-widest">{promoCode}</span>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-teal-bright">
                      {copied ? <><Check className="size-4" aria-hidden /> Copied</> : <><Copy className="size-4" aria-hidden /> Copy</>}
                    </span>
                  </button>
                  <p className="mt-2 text-xs text-white/60">Apply it at checkout on your first course.</p>
                </div>
              )}

              <ul className="mt-5 space-y-1.5 text-sm text-white/80">
                {["Live online classes, batches of 15", "Recordings + study material included", "Placement support until you're hired"].map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-teal-bright" aria-hidden /> {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Lead form side */}
          <div className="p-5 sm:p-6">
            <EnquiryForm
              source="popup-offer"
              idPrefix="offer-popup"
              courseOptions={courseOptions}
              compact
              heading="Claim your discount"
              subheading="Leave your number — a counsellor will call you with batch dates and the discounted fee."
              buttonLabel="Claim 10% off"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-navy"
            >
              No thanks, I&apos;ll browse first
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
