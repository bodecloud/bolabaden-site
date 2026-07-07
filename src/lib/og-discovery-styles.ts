/**
 * Shared OpenGraph styling for discovery-context routes.
 * ImageResponse requires inline CSS — these constants keep OG art consistent.
 */

export const OG_DISCOVERY_PAGE_STYLE = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "space-between" as const,
  background:
    "linear-gradient(135deg, hsl(0 0% 4%) 0%, hsl(0 0% 8%) 58%, hsl(160 84% 39% / 0.22) 100%)",
  color: "hsl(0 0% 97%)",
  padding: "62px",
  fontFamily: "Inter, system-ui, sans-serif",
};

export const OG_DISCOVERY_ACCENT = "hsl(160 76% 52%)";
export const OG_DISCOVERY_DOT = "hsl(160 84% 39%)";

export const OG_DISCOVERY_SIZE = { width: 1200, height: 630 };
export const OG_DISCOVERY_CONTENT_TYPE = "image/png";
