import { ImageResponse } from "next/og";
import { formatInr } from "@/components/site/course-card";
import { site } from "@/lib/data/site";
import { getCourseBySlug } from "@/lib/services/courses";

export const alt = "Course";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  const title = course?.title ?? site.name;
  const tagline = course?.tagline ?? site.tagline;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(135deg, #0b1d2e 0%, #102a43 60%, #00a6a6 160%)",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 36, fontWeight: 800 }}>
          AXCVIA <div style={{ width: 12, height: 12, borderRadius: 999, background: "#22d3ee" }} />
        </div>
        {course && (
          <div style={{ display: "flex", background: "#e8c15a", color: "#0b1d2e", fontSize: 24, fontWeight: 700, padding: "10px 22px", borderRadius: 999 }}>
            {course.category}
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ fontSize: title.length > 40 ? 54 : 66, fontWeight: 800, lineHeight: 1.08, letterSpacing: -1.5 }}>{title}</div>
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.8)", maxWidth: 960 }}>{tagline}</div>
      </div>
      {course && (
        <div style={{ display: "flex", gap: 36, fontSize: 26, color: "rgba(255,255,255,0.85)" }}>
          <span>⏱ {course.duration}</span>
          <span>🎓 {course.level}</span>
          <span style={{ color: "#22d3ee", fontWeight: 700 }}>{formatInr(course.discountFee)}</span>
        </div>
      )}
    </div>,
    size
  );
}
