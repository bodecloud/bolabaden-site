import { describe, expect, it } from "vitest";
import { calculateLanguagePercentages } from "./enhanced-project-card";

describe("calculateLanguagePercentages", () => {
  it("returns an empty array for an empty languages object", () => {
    expect(calculateLanguagePercentages({})).toEqual([]);
  });

  it("computes percentages relative to the total bytes across all languages", () => {
    const result = calculateLanguagePercentages({
      TypeScript: 300,
      CSS: 100,
    });
    expect(result).toEqual([
      { name: "TypeScript", bytes: 300, percentage: 75 },
      { name: "CSS", bytes: 100, percentage: 25 },
    ]);
  });

  it("sorts results by byte count descending, not by input order", () => {
    const result = calculateLanguagePercentages({
      CSS: 10,
      TypeScript: 900,
      HTML: 90,
    });
    expect(result.map((r) => r.name)).toEqual(["TypeScript", "HTML", "CSS"]);
  });

  it("gives a single language 100%", () => {
    expect(calculateLanguagePercentages({ Python: 42 })).toEqual([
      { name: "Python", bytes: 42, percentage: 100 },
    ]);
  });

  it("does not divide by zero when every language has 0 bytes", () => {
    const result = calculateLanguagePercentages({ Empty: 0 });
    expect(result).toEqual([{ name: "Empty", bytes: 0, percentage: 0 }]);
  });
});
