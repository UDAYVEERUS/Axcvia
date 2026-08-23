"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { EnquiryForm } from "@/components/site/enquiry-form";

// "Submit your details" popup, shown once per browser session after a delay.
export function LeadPopup({ delaySeconds, courseOptions }: { delaySeconds: number; courseOptions: { title: string; slug: string }[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("axcvia-popup-shown")) return;
    } catch {}
    const t = setTimeout(() => {
      setOpen(true);
      try {
        sessionStorage.setItem("axcvia-popup-shown", "1");
      } catch {}
    }, Math.max(3, delaySeconds) * 1000);
    return () => clearTimeout(t);
  }, [delaySeconds]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-4 sm:items-center" role="dialog" aria-modal="true" aria-label="Get in touch">
      <div className="relative w-full max-w-md">
        <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute -top-3 -right-3 z-10 rounded-full bg-navy p-1.5 text-white shadow">
          <X className="size-4" />
        </button>
        <EnquiryForm source="popup" courseOptions={courseOptions} heading="Submit your details — we'll call you back" buttonLabel="Get a callback" />
      </div>
    </div>
  );
}
