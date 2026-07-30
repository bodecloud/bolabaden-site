import { describe, expect, it } from "vitest";
import {
  normalizeSlug,
  normalizeTitleFromFilename,
  parseFrontmatter,
  parseInlineList,
  stripQuotes,
  toDifficulty,
  toValidDate,
} from "./guides";

describe("normalizeSlug", () => {
  it("lowercases and strips the extension", () => {
    expect(normalizeSlug("My-Guide.md")).toBe("my-guide");
  });

  it("collapses non-alphanumeric runs into a single hyphen", () => {
    expect(normalizeSlug("weird__file  name!!.md")).toBe("weird-file-name");
  });

  it("trims leading/trailing hyphens produced by leading/trailing punctuation", () => {
    expect(normalizeSlug("--leading-and-trailing--.md")).toBe(
      "leading-and-trailing",
    );
  });
});

describe("normalizeTitleFromFilename", () => {
  it("title-cases hyphen/underscore-separated words", () => {
    expect(normalizeTitleFromFilename("infrastructure-growing-pains.md")).toBe(
      "Infrastructure Growing Pains",
    );
  });

  it("uppercases known acronyms via the replacement table", () => {
    expect(normalizeTitleFromFilename("vs-code-ai-workflow-guide.md")).toBe(
      "VS Code AI Workflow Guide",
    );
  });

  it("matches acronyms case-insensitively regardless of filename casing", () => {
    expect(normalizeTitleFromFilename("HTTP-and-HTTPS-basics.md")).toBe(
      "HTTP And HTTPS Basics",
    );
  });

  it("collapses repeated separators and trims whitespace", () => {
    expect(normalizeTitleFromFilename("a__b---c.md")).toBe("A B C");
  });
});

describe("stripQuotes", () => {
  it("strips matching double quotes", () => {
    expect(stripQuotes('"hello world"')).toBe("hello world");
  });

  it("strips matching single quotes", () => {
    expect(stripQuotes("'hello world'")).toBe("hello world");
  });

  it("leaves unquoted text untouched (after trimming)", () => {
    expect(stripQuotes("  hello world  ")).toBe("hello world");
  });

  it("leaves mismatched quote pairs untouched", () => {
    expect(stripQuotes("\"mismatched'")).toBe("\"mismatched'");
  });
});

describe("parseInlineList", () => {
  it("parses a bracketed, comma-separated inline list", () => {
    expect(parseInlineList("[Node.js 18+, Docker, Git]")).toEqual([
      "Node.js 18+",
      "Docker",
      "Git",
    ]);
  });

  it("strips quotes from each list item", () => {
    expect(parseInlineList('["a", \'b\', c]')).toEqual(["a", "b", "c"]);
  });

  it("returns an empty array for a value that isn't bracketed", () => {
    expect(parseInlineList("not a list")).toEqual([]);
  });

  it("drops empty items produced by trailing commas", () => {
    expect(parseInlineList("[a, b,]")).toEqual(["a", "b"]);
  });
});

describe("parseFrontmatter", () => {
  it("returns empty frontmatter and the raw trimmed content when there is no --- block", () => {
    const result = parseFrontmatter("# Just a heading\n\nSome text.");
    expect(result.frontmatter).toEqual({});
    expect(result.content).toBe("# Just a heading\n\nSome text.");
  });

  it("parses scalar fields (quoted and unquoted)", () => {
    const md = [
      "---",
      "description: A guide about things",
      'category: "development"',
      "difficulty: intermediate",
      "estimatedTime: 30-60 minutes",
      "---",
      "",
      "# Body",
    ].join("\n");
    const { frontmatter, content } = parseFrontmatter(md);
    expect(frontmatter).toEqual({
      description: "A guide about things",
      category: "development",
      difficulty: "intermediate",
      estimatedTime: "30-60 minutes",
    });
    expect(content).toBe("# Body");
  });

  it("parses an inline bracketed list value for prerequisites/technologies", () => {
    const md = [
      "---",
      "technologies: [TypeScript, Next.js]",
      "---",
      "Body",
    ].join("\n");
    expect(parseFrontmatter(md).frontmatter.technologies).toEqual([
      "TypeScript",
      "Next.js",
    ]);
  });

  it("parses a YAML-style multiline list (key: then - items)", () => {
    const md = [
      "---",
      "prerequisites:",
      "  - Node.js 18+",
      "  - A headed browser",
      "---",
      "Body",
    ].join("\n");
    expect(parseFrontmatter(md).frontmatter.prerequisites).toEqual([
      "Node.js 18+",
      "A headed browser",
    ]);
  });

  it("stops appending to a multiline list once a new key starts", () => {
    const md = [
      "---",
      "prerequisites:",
      "  - Node.js 18+",
      "category: development",
      "---",
      "Body",
    ].join("\n");
    const { frontmatter } = parseFrontmatter(md);
    expect(frontmatter.prerequisites).toEqual(["Node.js 18+"]);
    expect(frontmatter.category).toBe("development");
  });

  it("treats a frontmatter block with no closing --- as absent (falls back to raw content)", () => {
    const md = "---\ndescription: unterminated\n\n# Heading";
    const { frontmatter, content } = parseFrontmatter(md);
    expect(frontmatter).toEqual({});
    expect(content).toBe(md.trim());
  });
});

describe("toDifficulty", () => {
  it("passes through valid difficulty values", () => {
    expect(toDifficulty("beginner")).toBe("beginner");
    expect(toDifficulty("Advanced")).toBe("advanced");
  });

  it("defaults to intermediate for missing or unrecognized values", () => {
    expect(toDifficulty(undefined)).toBe("intermediate");
    expect(toDifficulty("")).toBe("intermediate");
    expect(toDifficulty("expert")).toBe("intermediate");
  });
});

describe("toValidDate", () => {
  it("passes through a valid date", () => {
    const date = new Date("2026-01-01");
    expect(toValidDate(date)).toBe(date);
  });

  it("falls back to the current date for an invalid Date object", () => {
    const invalid = new Date("not-a-real-date");
    const result = toValidDate(invalid);
    expect(isNaN(result.getTime())).toBe(false);
  });
});
