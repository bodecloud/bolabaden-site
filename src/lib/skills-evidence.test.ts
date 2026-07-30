import { describe, expect, it } from "vitest";
import {
  applyEvidenceSignals,
  collectSignalsByLanguage,
  evidenceConfidenceScore,
  evidenceRepositoryCoverage,
  evidenceSourceDiversity,
  evidenceTokenDiversity,
  extractLanguagesFromSignals,
  initializeLanguageEvidenceAggregate,
  mergeCategoryFromEvidence,
  normalizeEvidencePolicy,
  scorePenaltyFromContextSignals,
  summarizeEvidenceHighlights,
  type SkillEvidenceSignal,
} from "./skills-evidence";

function signal(overrides: Partial<SkillEvidenceSignal>): SkillEvidenceSignal {
  return {
    language: "TypeScript",
    category: "frontend",
    source: "primary-language",
    score: 1,
    confidence: 1,
    detail: "test signal",
    ...overrides,
  };
}

describe("evidenceSourceDiversity", () => {
  it("returns 0 when no eligible source has any hits", () => {
    const counts = initializeLanguageEvidenceAggregate("Go").sourceCounts;
    expect(evidenceSourceDiversity(counts)).toBe(0);
  });

  it("ignores reserved (repo-flags, negative-context) sources in the denominator", () => {
    const counts = initializeLanguageEvidenceAggregate("Go").sourceCounts;
    counts["repo-flags"] = 5;
    counts["negative-context"] = 5;
    expect(evidenceSourceDiversity(counts)).toBe(0);
  });

  it("returns 1 when every eligible source has at least one hit", () => {
    const counts = initializeLanguageEvidenceAggregate("Go").sourceCounts;
    for (const key of Object.keys(counts) as (keyof typeof counts)[]) {
      counts[key] = 1;
    }
    expect(evidenceSourceDiversity(counts)).toBe(1);
  });
});

describe("evidenceRepositoryCoverage", () => {
  it("returns 0 when there are no total repos", () => {
    expect(evidenceRepositoryCoverage(3, 0)).toBe(0);
  });

  it("returns the hit ratio clamped to [0, 1]", () => {
    expect(evidenceRepositoryCoverage(5, 10)).toBe(0.5);
    expect(evidenceRepositoryCoverage(10, 10)).toBe(1);
    expect(evidenceRepositoryCoverage(20, 10)).toBe(1);
  });
});

describe("evidenceTokenDiversity", () => {
  it("returns 0 for zero tokens", () => {
    expect(evidenceTokenDiversity(0)).toBe(0);
  });

  it("increases monotonically with token count and stays within [0, 1]", () => {
    const low = evidenceTokenDiversity(1);
    const mid = evidenceTokenDiversity(10);
    const high = evidenceTokenDiversity(1000);
    expect(low).toBeGreaterThan(0);
    expect(mid).toBeGreaterThan(low);
    expect(high).toBeGreaterThanOrEqual(mid);
    expect(high).toBeLessThanOrEqual(1);
  });
});

describe("initializeLanguageEvidenceAggregate + applyEvidenceSignals", () => {
  it("only accumulates signals matching the aggregate's language", () => {
    const aggregate = initializeLanguageEvidenceAggregate("TypeScript");
    applyEvidenceSignals(aggregate, "owner/repo", [
      signal({ language: "TypeScript", score: 2, confidence: 0.9, token: "ts" }),
      signal({ language: "Python", score: 5, confidence: 0.9 }),
    ]);

    expect(aggregate.scoreSum).toBe(2);
    expect(aggregate.sourceCounts["primary-language"]).toBe(1);
    expect(aggregate.uniqueTokens.has("ts")).toBe(true);
    expect(aggregate.repositories.has("owner/repo")).toBe(true);
  });

  it("feeds into evidenceConfidenceScore as a bounded [0, 1] value", () => {
    const aggregate = initializeLanguageEvidenceAggregate("TypeScript");
    applyEvidenceSignals(aggregate, "owner/repo", [
      signal({ language: "TypeScript", score: 3, confidence: 0.9, token: "ts" }),
      signal({
        language: "TypeScript",
        source: "topics",
        score: 2,
        confidence: 0.8,
        token: "react",
      }),
    ]);

    const score = evidenceConfidenceScore(aggregate, 10);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  it("returns 0 confidence for an aggregate with no signals applied", () => {
    const aggregate = initializeLanguageEvidenceAggregate("TypeScript");
    expect(evidenceConfidenceScore(aggregate, 10)).toBe(0);
  });
});

describe("summarizeEvidenceHighlights", () => {
  it("trims and caps at maxItems, slicing before filtering empties", () => {
    const highlights = new Set(["first", "second", "third"]);
    expect(summarizeEvidenceHighlights(highlights, 2)).toEqual([
      "first",
      "second",
    ]);
  });

  it("trims whitespace from surviving entries", () => {
    expect(summarizeEvidenceHighlights(new Set([" padded "]), 5)).toEqual([
      "padded",
    ]);
  });

  it("drops an entry that is empty after trimming, even within the slice window", () => {
    const highlights = new Set([" first ", "", "second"]);
    expect(summarizeEvidenceHighlights(highlights, 2)).toEqual(["first"]);
  });

  it("always returns at least one item even when maxItems is 0", () => {
    const highlights = new Set(["only"]);
    expect(summarizeEvidenceHighlights(highlights, 0)).toEqual(["only"]);
  });
});

describe("mergeCategoryFromEvidence", () => {
  it("adopts the evidence category once confidence clears the threshold", () => {
    expect(mergeCategoryFromEvidence("backend", "frontend", 0.62)).toBe(
      "frontend",
    );
    expect(mergeCategoryFromEvidence("backend", "frontend", 0.9)).toBe(
      "frontend",
    );
  });

  it("keeps the current category below the confidence threshold", () => {
    expect(mergeCategoryFromEvidence("backend", "frontend", 0.61)).toBe(
      "backend",
    );
    expect(mergeCategoryFromEvidence("backend", "frontend", 0)).toBe(
      "backend",
    );
  });
});

describe("normalizeEvidencePolicy", () => {
  it("fills in every field with a sane default when given undefined", () => {
    const policy = normalizeEvidencePolicy(undefined);
    expect(policy.includeTopicSignals).toBe(true);
    expect(policy.includeTextSignals).toBe(false);
    expect(policy.minimumSignalScore).toBe(0.06);
    expect(policy.maxSignalsPerRepo).toBe(40);
    expect(policy.tokenMinLength).toBe(2);
  });

  it("clamps out-of-range weights and counts into their valid bounds", () => {
    const policy = normalizeEvidencePolicy({
      minimumSignalScore: 5,
      topicSignalWeight: 10,
      textSignalWeight: -1,
      maxSignalsPerRepo: 500,
      maxTopicSignals: -5,
      tokenMinLength: 100,
    });
    expect(policy.minimumSignalScore).toBe(1);
    expect(policy.topicSignalWeight).toBe(2.2);
    expect(policy.textSignalWeight).toBe(0.2);
    expect(policy.maxSignalsPerRepo).toBe(100);
    expect(policy.maxTopicSignals).toBe(1);
    expect(policy.tokenMinLength).toBe(16);
  });

  it("preserves explicitly provided in-range values", () => {
    const policy = normalizeEvidencePolicy({
      includeTextSignals: true,
      maxSignalsPerRepo: 20,
    });
    expect(policy.includeTextSignals).toBe(true);
    expect(policy.maxSignalsPerRepo).toBe(20);
  });
});

describe("scorePenaltyFromContextSignals", () => {
  it("returns 0 when there are no context signals", () => {
    expect(scorePenaltyFromContextSignals([])).toBe(0);
  });

  it("accumulates penalty per matching repo-flags/negative-context tag", () => {
    const penalty = scorePenaltyFromContextSignals([
      signal({ language: "ForkedRepository", source: "repo-flags" }),
      signal({ language: "InactiveRepository", source: "negative-context" }),
    ]);
    expect(penalty).toBeCloseTo(0.015 + 0.025, 5);
  });

  it("clamps the total penalty at 0.24", () => {
    const manySignals = Array.from({ length: 50 }, () =>
      signal({ language: "LegacyRepository", source: "repo-flags" }),
    );
    expect(scorePenaltyFromContextSignals(manySignals)).toBe(0.24);
  });

  it("ignores signals from ordinary sources even with a matching tag name", () => {
    const penalty = scorePenaltyFromContextSignals([
      signal({ language: "ForkedRepository", source: "topics" }),
    ]);
    expect(penalty).toBe(0);
  });
});

describe("extractLanguagesFromSignals", () => {
  it("excludes repo-flags and negative-context signals", () => {
    const languages = extractLanguagesFromSignals([
      signal({ language: "TypeScript" }),
      signal({ language: "ForkedRepository", source: "repo-flags" }),
      signal({ language: "InactiveRepository", source: "negative-context" }),
    ]);
    expect(languages).toEqual(new Set(["TypeScript"]));
  });
});

describe("collectSignalsByLanguage", () => {
  it("groups real-language signals and drops context-only ones", () => {
    const grouped = collectSignalsByLanguage([
      signal({ language: "TypeScript", score: 1 }),
      signal({ language: "TypeScript", score: 2 }),
      signal({ language: "Python", score: 3 }),
      signal({ language: "ForkedRepository", source: "repo-flags" }),
    ]);

    expect(grouped.get("TypeScript")).toHaveLength(2);
    expect(grouped.get("Python")).toHaveLength(1);
    expect(grouped.has("ForkedRepository")).toBe(false);
  });
});
