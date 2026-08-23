import { ImageResponse } from "next/og";
import { site } from "@/lib/data/site";

export const alt = `${site.name} — ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
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
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 40, fontWeight: 800, letterSpacing: -1 }}>
        AXCVIA
        <div style={{ width: 12, height: 12, borderRadius: 999, background: "#22d3ee" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
          Learn. Build. Succeed.
        </div>
        <div style={{ fontSize: 30, color: "rgba(255,255,255,0.8)", maxWidth: 900 }}>
          Live online programming training in Java, Full Stack, Python, AI & ML, Testing and Cloud —
          small batches, real projects, placement support.
        </div>
      </div>
      <div style={{ display: "flex", fontSize: 26, color: "#22d3ee" }}>{site.url.replace("https://", "")}</div>
    </div>,
    size
  );
}
