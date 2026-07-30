import { describe, expect, it } from "vitest";
import { config } from "@/lib/config";
import { buildPageMetadata, serializeJsonLd } from "./seo";

describe("buildPageMetadata", () => {
  it("builds a canonical URL from the site URL + pathname", () => {
    const meta = buildPageMetadata({
      title: "Guides",
      description: "Read the guides",
      pathname: "/guides",
    });
    expect(meta.alternates?.canonical).toBe(`${config.SITE_URL}/guides`);
  });

  it("treats the root pathname as the bare site URL, no trailing slash", () => {
    const meta = buildPageMetadata({
      title: "Home",
      description: "Home page",
      pathname: "/",
    });
    expect(meta.alternates?.canonical).toBe(config.SITE_URL);
  });

  it("defaults the OG image path to <pathname>/opengraph-image when not given", () => {
    const meta = buildPageMetadata({
      title: "Projects",
      description: "See projects",
      pathname: "/projects",
    });
    const images = meta.openGraph?.images as Array<{ url: string }>;
    expect(images[0].url).toBe(`${config.SITE_URL}/projects/opengraph-image`);
  });

  it("uses an explicit imagePath when provided, resolved against the site URL", () => {
    const meta = buildPageMetadata({
      title: "Guide",
      description: "A guide",
      pathname: "/guides/some-slug",
      imagePath: "/guides/some-slug/opengraph-image",
    });
    const images = meta.openGraph?.images as Array<{ url: string }>;
    expect(images[0].url).toBe(
      `${config.SITE_URL}/guides/some-slug/opengraph-image`,
    );
  });

  it("defaults type to website and omits keywords when not given", () => {
    const meta = buildPageMetadata({
      title: "T",
      description: "D",
      pathname: "/x",
    });
    expect((meta.openGraph as { type?: string } | undefined)?.type).toBe(
      "website",
    );
    expect(meta.keywords).toBeUndefined();
  });

  it("passes through an explicit type and keywords", () => {
    const meta = buildPageMetadata({
      title: "T",
      description: "D",
      pathname: "/guides/x",
      type: "article",
      keywords: ["kotor", "modding"],
    });
    expect((meta.openGraph as { type?: string } | undefined)?.type).toBe(
      "article",
    );
    expect(meta.keywords).toEqual(["kotor", "modding"]);
  });

  it("mirrors title/description/image into the Twitter card", () => {
    const meta = buildPageMetadata({
      title: "T",
      description: "D",
      pathname: "/x",
    });
    expect(meta.twitter).toMatchObject({
      card: "summary_large_image",
      title: "T",
      description: "D",
    });
  });
});

describe("serializeJsonLd", () => {
  it("produces valid JSON for a normal object", () => {
    const value = { "@type": "WebSite", name: "Example" };
    expect(JSON.parse(serializeJsonLd(value))).toEqual(value);
  });

  it("escapes </script> so it can't prematurely close the surrounding script tag", () => {
    const malicious = { name: '</script><script>alert(1)</script>' };
    const serialized = serializeJsonLd(malicious);
    expect(serialized).not.toContain("</script>");
    expect(serialized).not.toContain("<script>");
    // still round-trips to the original value once parsed
    expect(JSON.parse(serialized)).toEqual(malicious);
  });

  it("escapes a bare & to prevent HTML entity reinterpretation", () => {
    const serialized = serializeJsonLd({ name: "Tom & Jerry" });
    expect(serialized).not.toContain("&");
    expect(JSON.parse(serialized)).toEqual({ name: "Tom & Jerry" });
  });

  it("escapes <!-- to prevent HTML comment injection inside the script tag", () => {
    const serialized = serializeJsonLd({ name: "<!--" });
    expect(serialized).not.toContain("<!--");
    expect(JSON.parse(serialized)).toEqual({ name: "<!--" });
  });
});
