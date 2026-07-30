import { describe, expect, it } from "vitest";
import {
  explainLanguageCategory,
  getLanguageAliasMap,
  getLanguageCategoryHints,
  getSupportedTaxonomyLanguages,
  inferLanguageCategoryExpert,
} from "./skills-language-taxonomy";

describe("inferLanguageCategoryExpert", () => {
  it("classifies languages with a single dominant profile weight unambiguously", () => {
    expect(inferLanguageCategoryExpert("SQL").category).toBe("database");
    expect(inferLanguageCategoryExpert("Dockerfile").category).toBe("devops");
    expect(inferLanguageCategoryExpert("Go").category).toBe("backend");
    expect(inferLanguageCategoryExpert("TypeScript").category).toBe(
      "frontend",
    );
  });

  it("resolves known aliases to the same category as the canonical name", () => {
    expect(inferLanguageCategoryExpert("golang").category).toBe(
      inferLanguageCategoryExpert("Go").category,
    );
    expect(inferLanguageCategoryExpert("postgres").category).toBe(
      inferLanguageCategoryExpert("PostgreSQL").category,
    );
    expect(inferLanguageCategoryExpert("ts").normalizedLanguage).toBe(
      "TypeScript",
    );
  });

  it("is case-insensitive when canonicalizing a known language", () => {
    expect(inferLanguageCategoryExpert("sql").normalizedLanguage).toBe("SQL");
    expect(inferLanguageCategoryExpert("SQL").normalizedLanguage).toBe("SQL");
  });

  it("falls back to backend with low confidence for an unrecognized language", () => {
    const result = inferLanguageCategoryExpert("TotallyMadeUpLanguageXyz");
    expect(result.category).toBe("backend");
    expect(result.confidence).toBeGreaterThanOrEqual(0.2);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it("returns a breakdown covering every category, sorted by score descending", () => {
    const { breakdown } = inferLanguageCategoryExpert("Python");
    expect(breakdown).toHaveLength(6);
    for (let i = 1; i < breakdown.length; i++) {
      expect(breakdown[i - 1].score).toBeGreaterThanOrEqual(
        breakdown[i].score,
      );
    }
  });

  it("keeps confidence within [0, 1] for a known language", () => {
    const { confidence } = inferLanguageCategoryExpert("Go");
    expect(confidence).toBeGreaterThanOrEqual(0);
    expect(confidence).toBeLessThanOrEqual(1);
  });

  it("returns a cached, identical result object for repeated calls", () => {
    const first = inferLanguageCategoryExpert("Rust");
    const second = inferLanguageCategoryExpert("Rust");
    expect(second).toBe(first);
  });
});

describe("getSupportedTaxonomyLanguages", () => {
  it("returns a non-empty, alphabetically sorted list including known languages", () => {
    const languages = getSupportedTaxonomyLanguages();
    expect(languages).toContain("TypeScript");
    expect(languages).toContain("SQL");
    const sorted = [...languages].sort((a, b) => a.localeCompare(b));
    expect(languages).toEqual(sorted);
  });
});

describe("getLanguageAliasMap", () => {
  it("maps normalized aliases back to their canonical language name", () => {
    const aliasMap = getLanguageAliasMap();
    expect(aliasMap["golang"]).toBe("Go");
    expect(aliasMap["ts"]).toBe("TypeScript");
  });
});

describe("getLanguageCategoryHints", () => {
  it("includes every supported language, each mapped to a category", () => {
    const hints = getLanguageCategoryHints();
    const languages = getSupportedTaxonomyLanguages();
    for (const language of languages) {
      expect(hints[language]).toBeDefined();
    }
  });
});

describe("explainLanguageCategory", () => {
  it("returns a human-readable explanation with the language and winning category", () => {
    const lines = explainLanguageCategory("Dockerfile");
    expect(lines[0]).toBe("language=Dockerfile");
    expect(lines[1]).toContain("winner=devops");
  });
});
