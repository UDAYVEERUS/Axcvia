"use client";

import { useState } from "react";
import { PlayCircle, X } from "lucide-react";
import { toEmbed } from "@/lib/video";

// "Play" button that opens the student's video review in a lightbox.
export function VideoTestimonial({ url, name }: { url: string; name: string }) {
  const [open, setOpen] = useState(false);
  const e = toEmbed(url);
  if (e.kind === "none") return null;
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-teal hover:underline">
        <PlayCircle className="size-4" aria-hidden /> Watch {name.split(" ")[0]}&apos;s video review
      </button>
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4" role="dialog" aria-modal="true" aria-label={`Video review by ${name}`} onClick={() => setOpen(false)}>
          <div className="relative w-full max-w-3xl" onClick={(ev) => ev.stopPropagation()}>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close" className="absolute -top-10 right-0 text-white"><X className="size-6" /></button>
            {e.kind === "video" ? (
              <video src={e.src} controls autoPlay className="aspect-video w-full rounded-xl" />
            ) : (
              <iframe src={`${e.src}${e.src.includes("?") ? "&" : "?"}autoplay=1`} title={`Video review by ${name}`} allow="autoplay; encrypted-media; fullscreen" allowFullScreen className="aspect-video w-full rounded-xl" />
            )}
          </div>
        </div>
      )}
    </>
  );
}
