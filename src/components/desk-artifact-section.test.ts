import { describe, expect, it } from "vitest";
import { pickDailyArtifact } from "./desk-artifact-section";
import type { DeskArtifact } from "@/lib/config";

const artifacts: DeskArtifact[] = [
  { id: "a", title: "A", note: "note a" },
  { id: "b", title: "B", note: "note b" },
  { id: "c", title: "C", note: "note c" },
];

describe("pickDailyArtifact", () => {
  it("returns undefined for an empty artifact list", () => {
    expect(pickDailyArtifact([], new Date())).toBeUndefined();
  });

  it("returns the single artifact when there is only one", () => {
    expect(pickDailyArtifact([artifacts[0]], new Date())).toEqual(artifacts[0]);
  });

  it("picks Jan 1st as day-of-year 1, landing on index 1 for a 3-item list", () => {
    // Jan 1 is day-of-year 1 (not 0) under this Date.UTC(y,0,0) epoch, so
    // 1 % 3 === 1 -> artifacts[1], not artifacts[0]. This pins the exact
    // off-by-one behavior rather than assuming an "intuitive" index 0.
    expect(pickDailyArtifact(artifacts, new Date(Date.UTC(2026, 0, 1)))).toEqual(
      artifacts[1],
    );
  });

  it("is deterministic for the same calendar day regardless of time-of-day", () => {
    const morning = new Date(Date.UTC(2026, 6, 15, 3, 0, 0));
    const night = new Date(Date.UTC(2026, 6, 15, 23, 59, 59));
    expect(pickDailyArtifact(artifacts, morning)).toEqual(
      pickDailyArtifact(artifacts, night),
    );
  });

  it("advances to a different artifact on the next calendar day (when list length doesn't divide evenly)", () => {
    const day1 = pickDailyArtifact(artifacts, new Date(Date.UTC(2026, 6, 15)));
    const day2 = pickDailyArtifact(artifacts, new Date(Date.UTC(2026, 6, 16)));
    expect(day1).not.toEqual(day2);
  });

  it("wraps around correctly across a year boundary", () => {
    // 2026 is not a leap year: day-of-year for Dec 31 is 365, so 365 % 3 === 2.
    const dec31 = pickDailyArtifact(artifacts, new Date(Date.UTC(2026, 11, 31)));
    expect(dec31).toEqual(artifacts[365 % 3]);
  });

  it("accounts for leap years when computing day-of-year", () => {
    // 2028 is a leap year: Mar 1 is day-of-year 61 (not 60).
    const mar1 = pickDailyArtifact(artifacts, new Date(Date.UTC(2028, 2, 1)));
    expect(mar1).toEqual(artifacts[61 % 3]);
  });
});
