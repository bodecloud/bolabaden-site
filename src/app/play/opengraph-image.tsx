import { ImageResponse } from "next/og";
import { config } from "@/lib/config";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function PlayOpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background:
          "linear-gradient(135deg, #0f3c83 0%, #235db2 48%, #2e6b3e 100%)",
        color: "#f8fafc",
        padding: "62px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div style={{ fontSize: 24, opacity: 0.9 }}>{config.SITE_NAME}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ fontSize: 66, fontWeight: 700 }}>
          {config.PLAY_PAGE_TITLE}
        </div>
        <div
          style={{
            fontSize: 34,
            color: "#dbeafe",
            fontWeight: 600,
            maxWidth: "1000px",
          }}
        >
          {config.PLAY_PAGE_DESCRIPTION}
        </div>
        <div style={{ fontSize: 26, opacity: 0.92, maxWidth: "1000px" }}>
          An XP-era desktop, a directory of old hosts, and a hidden vault
          waiting behind the right phrase.
        </div>
      </div>
      <div style={{ fontSize: 22, opacity: 0.8 }}>{`${config.SITE_DOMAIN}/play`}</div>
    </div>,
    size,
  );
}
