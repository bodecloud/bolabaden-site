import { ImageResponse } from "next/og";
import { config } from "@/lib/config";
import {
  OG_DISCOVERY_ACCENT,
  OG_DISCOVERY_CONTENT_TYPE,
  OG_DISCOVERY_DOT,
  OG_DISCOVERY_PAGE_STYLE,
  OG_DISCOVERY_SIZE,
} from "@/lib/og-discovery-styles";

/**
 * OpenGraph image generator using Next.js ImageResponse.
 *
 * ⚠️  INLINE STYLES REQUIRED HERE
 * This file uses `ImageResponse` from next/og which does NOT support Tailwind CSS.
 * ImageResponse uses Satori (a headless browser implementation) and requires plain inline CSS.
 * This is a documented exception to the "no inline styles" rule.
 * See: https://nextjs.org/docs/app/api-reference/functions/image-response
 */

export const runtime = "edge";
export const size = OG_DISCOVERY_SIZE;
export const contentType = OG_DISCOVERY_CONTENT_TYPE;

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={OG_DISCOVERY_PAGE_STYLE}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div
          style={{
            width: "14px",
            height: "14px",
            borderRadius: "999px",
            background: OG_DISCOVERY_DOT,
          }}
        />
        <div style={{ fontSize: 26, opacity: 0.9 }}>{config.SITE_NAME}</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.05 }}>
          {config.OG_HOME_TITLE}
        </div>
        <div
          style={{ fontSize: 36, color: OG_DISCOVERY_ACCENT, fontWeight: 600 }}
        >
          {config.OG_HOME_SUBTITLE}
        </div>
        <div
          style={{
            fontSize: 28,
            opacity: 0.9,
            maxWidth: "1000px",
            lineHeight: 1.35,
          }}
        >
          {config.OG_HOME_DESCRIPTION}
        </div>
      </div>

      <div style={{ fontSize: 22, opacity: 0.8 }}>{config.SITE_DOMAIN}</div>
    </div>,
    {
      ...size,
    },
  );
}
