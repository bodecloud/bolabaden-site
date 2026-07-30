import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fmt, reltime } from "./github-stats-section";

describe("fmt", () => {
  it("returns small numbers as-is", () => {
    expect(fmt(0)).toBe("0");
    expect(fmt(42)).toBe("42");
    expect(fmt(999)).toBe("999");
  });

  it("abbreviates thousands with a k suffix", () => {
    expect(fmt(1_000)).toBe("1.0k");
    expect(fmt(1_500)).toBe("1.5k");
    expect(fmt(999_999)).toBe("1000.0k");
  });

  it("abbreviates millions with an M suffix", () => {
    expect(fmt(1_000_000)).toBe("1.0M");
    expect(fmt(2_340_000)).toBe("2.3M");
  });

  it("treats the 1,000 and 1,000,000 boundaries as inclusive", () => {
    expect(fmt(1_000)).toBe("1.0k");
    expect(fmt(1_000_000)).toBe("1.0M");
  });
});

describe("reltime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-30T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 'unknown' for null, undefined, or an invalid date string", () => {
    expect(reltime(null)).toBe("unknown");
    expect(reltime(undefined)).toBe("unknown");
    expect(reltime("not-a-date")).toBe("unknown");
  });

  it("returns 'today' for the current day", () => {
    expect(reltime("2026-07-30T06:00:00Z")).toBe("today");
  });

  it("returns 'yesterday' for exactly one day ago", () => {
    expect(reltime("2026-07-29T12:00:00Z")).toBe("yesterday");
  });

  it("returns 'Nd ago' for 2-29 days", () => {
    expect(reltime("2026-07-28T12:00:00Z")).toBe("2d ago");
    expect(reltime("2026-07-01T12:00:00Z")).toBe("29d ago");
  });

  it("returns 'Nmo ago' for 30-364 days, floored to whole months", () => {
    expect(reltime("2026-06-30T12:00:00Z")).toBe("1mo ago");
    expect(reltime("2025-08-24T12:00:00Z")).toBe("11mo ago");
  });

  it("returns 'Ny ago' for 365+ days, floored to whole years", () => {
    expect(reltime("2025-07-30T12:00:00Z")).toBe("1y ago");
    expect(reltime("2020-07-30T12:00:00Z")).toBe("6y ago");
  });
});
