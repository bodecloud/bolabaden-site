import { describe, expect, it } from "vitest";
import { enrichProject, shouldIncludeProject } from "./project-mapper";
import { config } from "./config";
import type { Project } from "./types";
import type { EnhancedGitHubRepo } from "./github-enhanced";

function makeProject(overrides: Partial<Project> = {}): Project {
  return {
    id: "some-unmapped-repo",
    title: "Some Repo",
    description: "A repo",
    technologies: [],
    category: "other",
    status: "active",
    featured: false,
    createdAt: new Date("2026-01-01"),
    updatedAt: new Date("2026-01-01"),
    ...overrides,
  };
}

function makeRepo(overrides: Partial<EnhancedGitHubRepo> = {}): EnhancedGitHubRepo {
  return {
    name: "repo",
    full_name: "owner/repo",
    description: "A repo",
    html_url: "https://github.com/owner/repo",
    homepage: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    pushed_at: "2026-01-01T00:00:00Z",
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

describe("enrichProject", () => {
  it("returns the project unchanged when it has no metadata entry", () => {
    const project = makeProject({ id: "not-in-the-map" });
    expect(enrichProject(project)).toEqual(project);
  });

  it("applies a custom title and liveUrl for a known project", () => {
    const project = makeProject({ id: "bolabaden-site", title: "original" });
    const enriched = enrichProject(project);
    expect(enriched.title).toBe("Bolabaden NextJS Website");
    expect(enriched.liveUrl).toBe(config.SITE_URL);
  });

  it("sets featured=true from metadata even when the source project says false", () => {
    const project = makeProject({ id: "cloudcradle", featured: false });
    expect(enrichProject(project).featured).toBe(true);
  });

  it("respects an explicit featured=false override (llm_fallbacks)", () => {
    const project = makeProject({ id: "llm_fallbacks", featured: true });
    expect(enrichProject(project).featured).toBe(false);
  });

  it("falls back to the project's own featured flag when metadata omits it", () => {
    // bolabaden-infra's metadata sets featured but no customDescription --
    // description should pass through from the source project untouched.
    const project = makeProject({
      id: "bolabaden-infra",
      description: "original description",
    });
    expect(enrichProject(project).description).toBe("original description");
  });

  it("does not mutate the input project", () => {
    const project = makeProject({ id: "cloudcradle" });
    const snapshot = { ...project };
    enrichProject(project);
    expect(project).toEqual(snapshot);
  });
});

describe("shouldIncludeProject", () => {
  it("excludes disabled repos regardless of other options", () => {
    expect(shouldIncludeProject(makeRepo({ disabled: true }))).toBe(false);
  });

  it("excludes archived repos by default", () => {
    expect(shouldIncludeProject(makeRepo({ archived: true }))).toBe(false);
  });

  it("includes archived repos when includeArchived=true", () => {
    expect(
      shouldIncludeProject(makeRepo({ archived: true }), {
        includeArchived: true,
      }),
    ).toBe(true);
  });

  it("excludes forks by default", () => {
    expect(shouldIncludeProject(makeRepo({ fork: true }))).toBe(false);
  });

  it("includes forks when includeForks=true", () => {
    expect(
      shouldIncludeProject(makeRepo({ fork: true }), { includeForks: true }),
    ).toBe(true);
  });

  it("excludes repos below minStars", () => {
    expect(
      shouldIncludeProject(makeRepo({ stargazers_count: 2 }), { minStars: 5 }),
    ).toBe(false);
  });

  it("includes repos meeting minStars exactly (inclusive boundary)", () => {
    expect(
      shouldIncludeProject(makeRepo({ stargazers_count: 5 }), { minStars: 5 }),
    ).toBe(true);
  });

  it("excludes repos with no description and zero stars (likely low-quality/empty)", () => {
    expect(
      shouldIncludeProject(
        makeRepo({ description: null, stargazers_count: 0 }),
      ),
    ).toBe(false);
  });

  it("includes a no-description repo if it has at least one star", () => {
    expect(
      shouldIncludeProject(
        makeRepo({ description: null, stargazers_count: 1 }),
      ),
    ).toBe(true);
  });

  it("includes a normal, described, non-fork, non-archived, non-disabled repo", () => {
    expect(shouldIncludeProject(makeRepo())).toBe(true);
  });
});
