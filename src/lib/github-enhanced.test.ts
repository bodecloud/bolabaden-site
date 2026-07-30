import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  calculateRecentCommits,
  parseGitHubUrl,
  transformCommitActivityToGraph,
  type GitHubCommitActivity,
} from "./github-enhanced";

describe("parseGitHubUrl", () => {
  it("extracts owner and repo from a standard GitHub URL", () => {
    expect(parseGitHubUrl("https://github.com/bodecloud/bolabaden-site")).toEqual({
      owner: "bodecloud",
      repo: "bolabaden-site",
    });
  });

  it("ignores extra path segments beyond owner/repo", () => {
    expect(
      parseGitHubUrl("https://github.com/bodecloud/bolabaden-site/tree/master"),
    ).toEqual({ owner: "bodecloud", repo: "bolabaden-site" });
  });

  it("returns null for a non-GitHub hostname", () => {
    expect(parseGitHubUrl("https://gitlab.com/bodecloud/bolabaden-site")).toBeNull();
  });

  it("returns null when the URL has fewer than two path segments", () => {
    expect(parseGitHubUrl("https://github.com/bodecloud")).toBeNull();
  });

  it("returns null for a malformed URL instead of throwing", () => {
    expect(parseGitHubUrl("not a url")).toBeNull();
  });
});

describe("transformCommitActivityToGraph", () => {
  it("returns an empty array for non-array input", () => {
    expect(
      transformCommitActivityToGraph(
        null as unknown as GitHubCommitActivity[],
      ),
    ).toEqual([]);
  });

  it("maps each week's unix timestamp to an ISO date and carries the total", () => {
    const activity: GitHubCommitActivity[] = [
      { week: 1_700_000_000, total: 5, days: [1, 1, 1, 1, 1, 0, 0] },
    ];
    const result = transformCommitActivityToGraph(activity);
    expect(result).toEqual([
      { date: new Date(1_700_000_000 * 1000).toISOString().split("T")[0], count: 5 },
    ]);
  });

  it("preserves the input order across multiple weeks", () => {
    const activity: GitHubCommitActivity[] = [
      { week: 1_700_000_000, total: 3, days: [] },
      { week: 1_700_604_800, total: 7, days: [] },
    ];
    const result = transformCommitActivityToGraph(activity);
    expect(result.map((entry) => entry.count)).toEqual([3, 7]);
  });
});

describe("calculateRecentCommits", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-30T00:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns 0 for non-array input", () => {
    expect(
      calculateRecentCommits(null as unknown as GitHubCommitActivity[]),
    ).toBe(0);
  });

  it("sums totals only for weeks within the last 31 days", () => {
    const now = Date.now();
    const activity: GitHubCommitActivity[] = [
      { week: Math.floor((now - 5 * 86_400_000) / 1000), total: 4, days: [] },
      {
        week: Math.floor((now - 60 * 86_400_000) / 1000),
        total: 100,
        days: [],
      },
    ];
    expect(calculateRecentCommits(activity)).toBe(4);
  });

  it("includes a week exactly at the 31-day boundary", () => {
    const now = Date.now();
    const activity: GitHubCommitActivity[] = [
      { week: Math.floor((now - 31 * 86_400_000) / 1000), total: 9, days: [] },
    ];
    expect(calculateRecentCommits(activity)).toBe(9);
  });

  it("excludes a week just past the 31-day boundary", () => {
    const now = Date.now();
    const activity: GitHubCommitActivity[] = [
      {
        week: Math.floor((now - 32 * 86_400_000) / 1000),
        total: 9,
        days: [],
      },
    ];
    expect(calculateRecentCommits(activity)).toBe(0);
  });

  it("returns 0 for an empty activity array", () => {
    expect(calculateRecentCommits([])).toBe(0);
  });
});
