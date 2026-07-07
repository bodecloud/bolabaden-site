import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getGuides } from "@/lib/guides";
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

export const runtime = "nodejs";
export const size = OG_DISCOVERY_SIZE;
export const contentType = OG_DISCOVERY_CONTENT_TYPE;

export default async function GuideOpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guides = await getGuides();
  const guide = guides.find((g) => g.slug === slug);

  if (!guide) return notFound();

  return new ImageResponse(
    <div style={{ ...OG_DISCOVERY_PAGE_STYLE, padding: "58px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            width: "12px",
            height: "12px",
            borderRadius: "999px",
            background: OG_DISCOVERY_DOT,
          }}
        />
        <div style={{ fontSize: 24, opacity: 0.9 }}>
          {config.SITE_NAME} • Guide
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div
          style={{
            fontSize: 54,
            fontWeight: 700,
            lineHeight: 1.08,
            maxWidth: "1080px",
          }}
        >
          {guide.title}
        </div>
        <div
          style={{
            fontSize: 26,
            opacity: 0.9,
            maxWidth: "1080px",
            lineHeight: 1.35,
          }}
        >
          {guide.description}
        </div>
      </div>

      <div
        style={{ display: "flex", gap: "10px", fontSize: 22, opacity: 0.85, color: OG_DISCOVERY_ACCENT }}
      >
        <span>{guide.category}</span>
        <span>•</span>
        <span>{guide.difficulty}</span>
        <span>•</span>
        <span>{guide.estimatedTime}</span>
      </div>
    </div>,
    {
      ...size,
    },
  );
}
