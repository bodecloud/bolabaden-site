import { describe, expect, it } from "vitest";
import {
  buildSearxSearchUrl,
  normalizeSearchPath,
  normalizeSearxResults,
} from "./searx";

describe("normalizeSearchPath", () => {
  it("defaults to /search when given an empty path", () => {
    expect(normalizeSearchPath("")).toBe("/search");
  });

  it("prefixes a leading slash when missing", () => {
    expect(normalizeSearchPath("search")).toBe("/search");
  });

  it("leaves an already-absolute path untouched", () => {
    expect(normalizeSearchPath("/api/search")).toBe("/api/search");
  });
});

describe("buildSearxSearchUrl", () => {
  it("builds a URL with the query parameter set", () => {
    expect(buildSearxSearchUrl("https://searx.example", "/search", "kotor")).toBe(
      "https://searx.example/search?q=kotor",
    );
  });

  it("strips trailing slashes from the base URL", () => {
    expect(
      buildSearxSearchUrl("https://searx.example/", "/search", "kotor"),
    ).toBe("https://searx.example/search?q=kotor");
  });

  it("normalizes a search path missing its leading slash", () => {
    expect(buildSearxSearchUrl("https://searx.example", "search", "q")).toBe(
      "https://searx.example/search?q=q",
    );
  });

  it("adds format=json only when requested", () => {
    const withFormat = buildSearxSearchUrl(
      "https://searx.example",
      "/search",
      "q",
      "json",
    );
    const withoutFormat = buildSearxSearchUrl(
      "https://searx.example",
      "/search",
      "q",
    );
    expect(withFormat).toContain("format=json");
    expect(withoutFormat).not.toContain("format");
  });

  it("discards any pre-existing query string on the base URL", () => {
    expect(
      buildSearxSearchUrl(
        "https://searx.example?stale=1",
        "/search",
        "kotor",
      ),
    ).toBe("https://searx.example/search?q=kotor");
  });

  it("URL-encodes special characters in the query", () => {
    expect(
      buildSearxSearchUrl("https://searx.example", "/search", "a b&c"),
    ).toBe("https://searx.example/search?q=a+b%26c");
  });
});

describe("normalizeSearxResults", () => {
  it("returns an empty array when results is missing or not an array", () => {
    expect(normalizeSearxResults({})).toEqual([]);
    expect(
      normalizeSearxResults({ results: "not-an-array" } as never),
    ).toEqual([]);
  });

  it("keeps only results with a non-empty title and url", () => {
    const normalized = normalizeSearxResults({
      results: [
        { title: "Good", url: "https://example.com/a", content: "c" },
        { title: "", url: "https://example.com/b" },
        { title: "No URL" },
        { url: "https://example.com/d" },
        { title: "No content field", url: "https://example.com/e" },
      ],
    });
    expect(normalized).toEqual([
      { title: "Good", url: "https://example.com/a", content: "c" },
      { title: "No content field", url: "https://example.com/e", content: undefined },
    ]);
  });
});
