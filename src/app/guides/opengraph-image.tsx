/**
 * OpenGraph image for /guides page (discovery context).
 *
 * CONTEXT: Discovery/Reference
 * Technical Playbooks page preview with reference-focused messaging.
 * Shows guides as learning/reference resources for main site discovery.
 */

import { ImageResponse } from "next/og";
import { config } from "@/lib/config";
import {
  OG_DISCOVERY_ACCENT,
  OG_DISCOVERY_CONTENT_TYPE,
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

export default function GuidesOpenGraphImage() {
  return new ImageResponse(
    <div style={OG_DISCOVERY_PAGE_STYLE}>
      <div style={{ fontSize: 24, opacity: 0.9 }}>{config.SITE_NAME}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <div style={{ fontSize: 62, fontWeight: 700 }}>
          {config.OG_GUIDES_TITLE}
        </div>
        <div
          style={{ fontSize: 34, color: OG_DISCOVERY_ACCENT, fontWeight: 600 }}
        >
          {config.OG_GUIDES_SUBTITLE}
        </div>
        <div style={{ fontSize: 26, opacity: 0.92, maxWidth: "1000px" }}>
          {config.OG_GUIDES_DESCRIPTION}
        </div>
      </div>
      <div
        style={{ fontSize: 22, opacity: 0.8 }}
      >{`${config.SITE_DOMAIN}/guides`}</div>
    </div>,
    size,
  );
}
