import { describe, expect, it } from "vitest";
import { extractMarkdownHeadings } from "./markdown-headings";

describe("extractMarkdownHeadings", () => {
  it("extracts h2 headings by default, ignoring other levels", () => {
    const content = [
      "# Title",
      "",
      "## First Section",
      "",
      "### Nested",
      "",
      "## Second Section",
    ].join("\n");

    expect(extractMarkdownHeadings(content)).toEqual([
      { id: "first-section", label: "First Section" },
      { id: "second-section", label: "Second Section" },
    ]);
  });

  it("returns an empty array when no headings are in range", () => {
    expect(extractMarkdownHeadings("just some text\nno headings here")).toEqual([]);
  });

  it("respects minLevel/maxLevel overrides", () => {
    const content = ["# H1", "## H2", "### H3"].join("\n");
    expect(extractMarkdownHeadings(content, { minLevel: 1, maxLevel: 3 })).toEqual([
      { id: "h1", label: "H1" },
      { id: "h2", label: "H2" },
      { id: "h3", label: "H3" },
    ]);
  });

  it("de-duplicates repeated heading text with numeric suffixes, matching rehype-slug", () => {
    const content = ["## Overview", "## Overview", "## Overview"].join("\n");
    expect(extractMarkdownHeadings(content)).toEqual([
      { id: "overview", label: "Overview" },
      { id: "overview-1", label: "Overview" },
      { id: "overview-2", label: "Overview" },
    ]);
  });

  it("ignores trailing closing hashes (ATX-style ## Heading ##)", () => {
    expect(extractMarkdownHeadings("## Heading ##")).toEqual([
      { id: "heading", label: "Heading" },
    ]);
  });

  it("does not match heading-like text inside a fenced code block's ATX syntax", () => {
    // Known limitation: extractMarkdownHeadings is a line-regex scanner, not a
    // real markdown parser, so it has no fence awareness. This test documents
    // the current (imperfect) behavior rather than asserting an ideal one.
    const content = ["```", "## not a real heading", "```"].join("\n");
    expect(extractMarkdownHeadings(content)).toEqual([
      { id: "not-a-real-heading", label: "not a real heading" },
    ]);
  });
});
