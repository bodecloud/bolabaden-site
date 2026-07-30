import { afterEach, describe, expect, it, vi } from "vitest";
import {
  buildConfiguredSections,
  envChromeMode,
  envCsv,
  envFlag,
  envJson,
  envNumber,
  envString,
  formatDate,
  getRelativeTime,
  type NormalizedSection,
} from "./config";

const ENV_KEY = "__TEST_ENV_VAR__";

afterEach(() => {
  delete process.env[ENV_KEY];
});

describe("envString", () => {
  it("returns the default when the var is unset", () => {
    expect(envString(ENV_KEY, "fallback")).toBe("fallback");
  });

  it("trims the value and returns it when set", () => {
    process.env[ENV_KEY] = "  hello  ";
    expect(envString(ENV_KEY, "fallback")).toBe("hello");
  });

  it("treats a whitespace-only value as unset (falls back)", () => {
    process.env[ENV_KEY] = "   ";
    expect(envString(ENV_KEY, "fallback")).toBe("fallback");
  });
});

describe("envNumber", () => {
  it("returns the default when the var is unset", () => {
    expect(envNumber(ENV_KEY, 42)).toBe(42);
  });

  it("parses a numeric value", () => {
    process.env[ENV_KEY] = "17";
    expect(envNumber(ENV_KEY, 42)).toBe(17);
  });

  it("falls back to the default for a non-numeric value", () => {
    process.env[ENV_KEY] = "not-a-number";
    expect(envNumber(ENV_KEY, 42)).toBe(42);
  });
});

describe("envCsv", () => {
  it("returns the defaults when the var is unset", () => {
    expect(envCsv(ENV_KEY, ["a", "b"])).toEqual(["a", "b"]);
  });

  it("splits on commas and trims each entry", () => {
    process.env[ENV_KEY] = "one, two ,three";
    expect(envCsv(ENV_KEY, [])).toEqual(["one", "two", "three"]);
  });

  it("filters out empty entries produced by trailing/double commas", () => {
    process.env[ENV_KEY] = "one,,two,";
    expect(envCsv(ENV_KEY, [])).toEqual(["one", "two"]);
  });

  it("falls back to defaults if every entry is empty", () => {
    process.env[ENV_KEY] = " , , ";
    expect(envCsv(ENV_KEY, ["fallback"])).toEqual(["fallback"]);
  });
});

describe("envJson", () => {
  it("returns the default when the var is unset", () => {
    expect(envJson(ENV_KEY, { a: 1 })).toEqual({ a: 1 });
  });

  it("returns the default on invalid JSON", () => {
    process.env[ENV_KEY] = "{not valid json";
    expect(envJson(ENV_KEY, { a: 1 })).toEqual({ a: 1 });
  });

  it("parses valid JSON matching the default's shape", () => {
    process.env[ENV_KEY] = '{"a": 2}';
    expect(envJson(ENV_KEY, { a: 1 })).toEqual({ a: 2 });
  });

  it("rejects a non-array override when the default is an array", () => {
    process.env[ENV_KEY] = '{"not": "an array"}';
    expect(envJson(ENV_KEY, [1, 2, 3])).toEqual([1, 2, 3]);
  });

  it("accepts an array override when the default is an array", () => {
    process.env[ENV_KEY] = "[4, 5]";
    expect(envJson(ENV_KEY, [1, 2, 3])).toEqual([4, 5]);
  });

  it("rejects a non-object override when the default is an object", () => {
    process.env[ENV_KEY] = "[1, 2]";
    expect(envJson(ENV_KEY, { a: 1 })).toEqual({ a: 1 });
  });
});

describe("envFlag", () => {
  it("defaults to true when unset and no default given", () => {
    expect(envFlag(ENV_KEY)).toBe(true);
  });

  it("honors an explicit default when unset", () => {
    expect(envFlag(ENV_KEY, false)).toBe(false);
  });

  it.each(["false", "0", "no", "off", "FALSE", "Off"])(
    "treats %s as false (case-insensitive)",
    (value) => {
      process.env[ENV_KEY] = value;
      expect(envFlag(ENV_KEY, true)).toBe(false);
    },
  );

  it.each(["true", "1", "yes", "on", "anything-else"])(
    "treats %s as true",
    (value) => {
      process.env[ENV_KEY] = value;
      expect(envFlag(ENV_KEY, false)).toBe(true);
    },
  );
});

describe("envChromeMode", () => {
  it("returns the default when unset", () => {
    expect(envChromeMode(ENV_KEY, "dual")).toBe("dual");
  });

  it("accepts discovery case-insensitively", () => {
    process.env[ENV_KEY] = "Discovery";
    expect(envChromeMode(ENV_KEY, "dual")).toBe("discovery");
  });

  it("falls back to the default for an unrecognized value", () => {
    process.env[ENV_KEY] = "bogus";
    expect(envChromeMode(ENV_KEY, "dual")).toBe("dual");
  });
});

describe("getRelativeTime", () => {
  it("returns 'unknown' for null/undefined/invalid dates", () => {
    expect(getRelativeTime(null)).toBe("unknown");
    expect(getRelativeTime(undefined)).toBe("unknown");
    expect(getRelativeTime("not-a-date")).toBe("unknown");
  });

  it("returns 'today' for the current moment", () => {
    expect(getRelativeTime(new Date())).toBe("today");
  });

  it("returns 'yesterday' for exactly one day ago", () => {
    const oneDayAgo = new Date(Date.now() - 25 * 60 * 60 * 1000);
    expect(getRelativeTime(oneDayAgo)).toBe("yesterday");
  });

  it("returns '<n> days ago' under a week", () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(getRelativeTime(threeDaysAgo)).toBe("3 days ago");
  });

  it("returns '<n> weeks ago' under a month", () => {
    const twoWeeksAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
    expect(getRelativeTime(twoWeeksAgo)).toBe("2 weeks ago");
  });

  it("returns '<n> months ago' under a year", () => {
    const threeMonthsAgo = new Date(Date.now() - 95 * 24 * 60 * 60 * 1000);
    expect(getRelativeTime(threeMonthsAgo)).toBe("3 months ago");
  });

  it("returns singular '1 year ago' vs plural '<n> years ago'", () => {
    const oneYearAgo = new Date(Date.now() - 366 * 24 * 60 * 60 * 1000);
    const twoYearsAgo = new Date(Date.now() - 731 * 24 * 60 * 60 * 1000);
    expect(getRelativeTime(oneYearAgo)).toBe("1 year ago");
    expect(getRelativeTime(twoYearsAgo)).toBe("2 years ago");
  });

  it("accepts an ISO string equivalently to a Date object", () => {
    const date = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(getRelativeTime(date.toISOString())).toBe(getRelativeTime(date));
  });
});

describe("formatDate", () => {
  it("returns 'unknown' for null/undefined/invalid dates", () => {
    expect(formatDate(null)).toBe("unknown");
    expect(formatDate("not-a-date")).toBe("unknown");
  });

  it("formats 'iso' as a full ISO string", () => {
    const date = new Date(Date.UTC(2026, 0, 15, 12, 0, 0));
    expect(formatDate(date, "iso")).toBe(date.toISOString());
  });

  it("formats 'short' as an abbreviated US date", () => {
    expect(formatDate(new Date(2026, 0, 15), "short")).toBe("Jan 15, 2026");
  });

  it("formats 'long' with a full month name and time", () => {
    const formatted = formatDate(new Date(2026, 0, 15, 9, 30), "long");
    expect(formatted).toContain("January 15, 2026");
  });

  it("accepts an ISO string as input, not just a Date object", () => {
    expect(formatDate("2026-01-15T00:00:00.000Z", "iso")).toBe(
      "2026-01-15T00:00:00.000Z",
    );
  });
});

describe("buildConfiguredSections", () => {
  type Id = "a" | "b" | "c";
  const validIds = new Set<Id>(["a", "b", "c"]);
  const labelFallbacks: Record<Id, string> = { a: "A", b: "B", c: "C" };

  it("filters out unknown ids and sorts by order", () => {
    const result = buildConfiguredSections(
      [
        { id: "b", enabled: true, order: 2 },
        { id: "unknown-id", enabled: true, order: 1 },
        { id: "a", enabled: true, order: 1 },
      ],
      validIds,
      labelFallbacks,
    );
    expect(result.map((s) => s.id)).toEqual(["a", "b"]);
  });

  it("falls back to the label when config doesn't provide one", () => {
    const result = buildConfiguredSections(
      [{ id: "a", enabled: true, order: 1 }],
      validIds,
      labelFallbacks,
    );
    expect(result[0].label).toBe("A");
  });

  it("uses an explicit label from config over the fallback", () => {
    const result = buildConfiguredSections(
      [{ id: "a", label: "Custom", enabled: true, order: 1 }],
      validIds,
      labelFallbacks,
    );
    expect(result[0].label).toBe("Custom");
  });

  it("returns every valid id with fallback labels when layoutConfig is empty and no legacyFallback given", () => {
    const result = buildConfiguredSections([], validIds, labelFallbacks);
    expect(result.map((s) => s.id).sort()).toEqual(["a", "b", "c"]);
    expect(result.every((s) => s.enabled)).toBe(true);
  });

  it("uses the provided legacyFallback when layoutConfig is empty", () => {
    const legacyFallback = vi.fn(
      (ids: Id[]): NormalizedSection<Id>[] =>
        ids.map((id, i) => ({ id, label: `legacy-${id}`, enabled: false, order: i })),
    );
    const result = buildConfiguredSections(
      [],
      validIds,
      labelFallbacks,
      legacyFallback,
    );
    expect(legacyFallback).toHaveBeenCalledOnce();
    expect(result.every((s) => s.label.startsWith("legacy-"))).toBe(true);
  });

  it("treats a missing/non-finite order as sorting last (999)", () => {
    const result = buildConfiguredSections(
      [
        { id: "a", enabled: true }, // no order
        { id: "b", enabled: true, order: 1 },
      ],
      validIds,
      labelFallbacks,
    );
    expect(result.map((s) => s.id)).toEqual(["b", "a"]);
  });
});
