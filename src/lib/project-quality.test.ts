import { describe, expect, it } from "vitest";
import {
  scoreProjectQuality,
  scoreRepositoryQuality,
  selectFeaturedProjectIds,
} from "./project-quality";
import type { EnhancedGitHubRepo } from "./github-enhanced";
import type { Project } from "./types";

function makeRepo(overrides: Partial<EnhancedGitHubRepo> = {}): EnhancedGitHubRepo {
  return {
    name: "repo",
    full_name: "owner/repo",
    description: "A repo",
    html_url: "https://github.com/owner/repo",
    homepage: null,
    created_at: "2020-01-01T00:00:00Z",
    updated_at: new Date().toISOString(),
    pushed_at: new Date().toISOString(),
    stargazers_count: 0,
    watchers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    size: 100,
    language: "TypeScript",
    topics: [],
    license: null,
    archived: false,
    disabled: false,
    private: false,
    fork: false,
    has_issues: true,
    has_projects: true,
    has_downloads: true,
    has_wiki: true,
    has_pages: false,
    ...overrides,
  };
}

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "p",
    title: "P",
    description: "A project",
    technologies: [],
    category: "other",
    status: "active",
    featured: false,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe("scoreRepositoryQuality", () => {
  it("returns a score between 0 and 100 for a minimal, low-signal repo", () => {
    const result = scoreRepositoryQuality(
      makeRepo({ description: null, language: null, license: null }),
    );
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(100);
  });

  it("scores a popular, well-documented, recently active repo higher than a sparse one", () => {
    const strong = scoreRepositoryQuality(
      makeRepo({
        stargazers_count: 500,
        forks_count: 100,
        watchers_count: 200,
        description: "Great repo",
        homepage: "https://example.com",
        license: { name: "MIT", spdx_id: "MIT" },
        topics: ["a", "b", "c", "d"],
      }),
    );
    const weak = scoreRepositoryQuality(
      makeRepo({
        stargazers_count: 0,
        forks_count: 0,
        watchers_count: 0,
        description: null,
        homepage: null,
        license: null,
        topics: [],
      }),
    );
    expect(strong.score).toBeGreaterThan(weak.score);
  });

  it("penalizes archived/disabled/fork repos via the stability factor", () => {
    const normal = scoreRepositoryQuality(makeRepo());
    const troubled = scoreRepositoryQuality(
      makeRepo({ archived: true, disabled: true, fork: true }),
    );
    expect(troubled.score).toBeLessThan(normal.score);
  });

  it("includes every declared factor key exactly once", () => {
    const result = scoreRepositoryQuality(makeRepo());
    const keys = result.factors.map((f) => f.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(keys).toContain("stars");
    expect(keys).toContain("stability");
  });
});

describe("scoreProjectQuality", () => {
  it("discounts the score by 25% when no live GitHub stats are available", () => {
    const project = makeProject({
      description: "d",
      technologies: ["ts"],
      githubUrl: "https://github.com/x/y",
      liveUrl: "https://example.com",
    });
    const withoutStats = scoreProjectQuality(project, null);
    const withoutStatsAgain = scoreProjectQuality(project, undefined);
    expect(withoutStats.score).toBe(withoutStatsAgain.score);
    expect(withoutStats.score).toBeGreaterThanOrEqual(0);
    expect(withoutStats.score).toBeLessThanOrEqual(100);
  });

  it("scores higher with rich stats than with no stats, all else equal", () => {
    const project = makeProject();
    const withoutStats = scoreProjectQuality(project, null);
    const withStats = scoreProjectQuality(project, {
      updatedAt: new Date(),
      createdAt: new Date("2020-01-01"),
      lastPush: new Date(),
      stars: 300,
      forks: 50,
      openIssues: 2,
      size: 5000,
      primaryLanguage: "TypeScript",
      languages: { TypeScript: 1000, CSS: 200 },
      topics: ["web", "typescript"],
      commitActivity: [],
      totalCommits: 800,
      recentCommitsCount: 40,
      contributorCount: 5,
      topContributors: [],
      license: "MIT",
      isArchived: false,
      isFork: false,
      hasIssues: true,
    });
    expect(withStats.score).toBeGreaterThan(withoutStats.score);
  });
});

describe("selectFeaturedProjectIds", () => {
  it("returns an empty array for no input projects", () => {
    expect(selectFeaturedProjectIds([])).toEqual([]);
  });

  it("excludes archived projects entirely, even if high-scoring", () => {
    const ids = selectFeaturedProjectIds([
      { id: "archived-high", score: 95, archived: true },
      { id: "active-low", score: 60 },
    ]);
    expect(ids).not.toContain("archived-high");
    expect(ids).toContain("active-low");
  });

  it("selects only projects at or above minScore, sorted by score descending", () => {
    const ids = selectFeaturedProjectIds(
      [
        { id: "low", score: 40 },
        { id: "mid", score: 65 },
        { id: "high", score: 90 },
      ],
      { minScore: 60 },
    );
    expect(ids).toEqual(["high", "mid"]);
  });

  it("falls back to featuring the single best project when nothing meets minScore", () => {
    const ids = selectFeaturedProjectIds(
      [
        { id: "a", score: 10 },
        { id: "b", score: 30 },
        { id: "c", score: 20 },
      ],
      { minScore: 60 },
    );
    expect(ids).toEqual(["b"]);
  });

  it("caps selection at maxFeatured even when more projects clear minScore", () => {
    const projects = Array.from({ length: 10 }, (_, i) => ({
      id: `p${i}`,
      score: 100 - i, // p0..p9 descending
    }));
    const ids = selectFeaturedProjectIds(projects, {
      minScore: 0,
      maxFeatured: 3,
      maxRatio: 1, // don't let the ratio cap bind for this test
    });
    expect(ids).toEqual(["p0", "p1", "p2"]);
  });

  it("caps selection at the maxRatio-derived limit when it is stricter than maxFeatured", () => {
    // 10 projects, maxRatio 0.2 -> ratioCap = ceil(10*0.2) = 2, even though
    // maxFeatured allows up to 6.
    const projects = Array.from({ length: 10 }, (_, i) => ({
      id: `p${i}`,
      score: 100 - i,
    }));
    const ids = selectFeaturedProjectIds(projects, {
      minScore: 0,
      maxFeatured: 6,
      maxRatio: 0.2,
    });
    expect(ids).toEqual(["p0", "p1"]);
  });

  it("always allows at least one selection even when maxRatio would round down to zero", () => {
    const ids = selectFeaturedProjectIds(
      [
        { id: "only", score: 80 },
        { id: "second", score: 10 },
      ],
      { minScore: 0, maxRatio: 0.01, maxFeatured: 6 },
    );
    expect(ids.length).toBeGreaterThanOrEqual(1);
    expect(ids[0]).toBe("only");
  });
});
