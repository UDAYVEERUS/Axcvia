import { toEmbed } from "@/lib/video";

export function LessonPlayer({ url, title }: { url: string; title: string }) {
  const e = toEmbed(url);
  if (e.kind === "none") return null;
  return (
    <div className="overflow-hidden rounded-xl border bg-black">
      {e.kind === "video" ? (
        <video src={e.src} controls controlsList="nodownload" className="aspect-video w-full" title={title} />
      ) : (
        <iframe src={e.src} title={title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen className="aspect-video w-full" />
      )}
    </div>
  );
}
