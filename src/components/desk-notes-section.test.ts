import { describe, expect, it } from "vitest";
import { isNotesFeedStale } from "./desk-notes-section";

describe("isNotesFeedStale", () => {
  it("is stale when there is no newest note at all (covers the empty-feed case)", () => {
    expect(isNotesFeedStale(undefined, 45)).toBe(true);
  });

  it("is not stale when the newest note is fresh", () => {
    const oneDayAgo = new Date(Date.now() - 1 * 86_400_000);
    expect(isNotesFeedStale(oneDayAgo, 45)).toBe(false);
  });

  it("is stale when the newest note is well past the threshold", () => {
    const wayOld = new Date(Date.now() - 100 * 86_400_000);
    expect(isNotesFeedStale(wayOld, 45)).toBe(true);
  });

  it("treats a note exactly at the threshold as not stale (inclusive boundary)", () => {
    const exactlyAtThreshold = new Date(Date.now() - 45 * 86_400_000);
    expect(isNotesFeedStale(exactlyAtThreshold, 45)).toBe(false);
  });

  it("treats a note one day past the threshold as stale", () => {
    const justPastThreshold = new Date(Date.now() - 46 * 86_400_000);
    expect(isNotesFeedStale(justPastThreshold, 45)).toBe(true);
  });
});
