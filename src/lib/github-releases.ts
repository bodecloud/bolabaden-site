/**
 * GitHub releases feed for home "Future Spaces" section.
 */

import { config } from "@/lib/config";
import { fetchUserRepos } from "@/lib/github-enhanced";

export type ReleaseFeedItem = {
  title: string;
  publishedAt: string;
  url: string;
  repo: string;
};

const MAX_REPOS_PER_USER = 5;
const MAX_RELEASES = 5;

interface GitHubRelease {
  name: string | null;
  tag_name: string;
  published_at: string | null;
  html_url: string;
  draft?: boolean;
  prerelease?: boolean;
}

function githubHeaders(): HeadersInit {
  const headers: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function fetchRepoReleases(
  owner: string,
  repo: string,
): Promise<ReleaseFeedItem[]> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/releases?per_page=3`,
      {
        headers: githubHeaders(),
        next: { revalidate: 300 },
      },
    );

    if (!response.ok) return [];

    const data = (await response.json()) as GitHubRelease[];
    if (!Array.isArray(data)) return [];

    return data
      .filter((release) => !release.draft)
      .map((release) => ({
        title: release.name?.trim() || release.tag_name,
        publishedAt: release.published_at ?? new Date(0).toISOString(),
        url: release.html_url,
        repo: `${owner}/${repo}`,
      }));
  } catch {
    return [];
  }
}

/**
 * Fetch recent releases across configured GitHub usernames (top updated repos each).
 */
export async function fetchRecentReleases(): Promise<ReleaseFeedItem[]> {
  if (!process.env.GITHUB_TOKEN) {
    return [];
  }

  const allReleases: ReleaseFeedItem[] = [];

  for (const username of config.GITHUB_USERNAMES) {
    const repos = await fetchUserRepos(username);
    const candidates = repos
      .filter((repo) => !repo.archived && !repo.private && !repo.fork)
      .slice(0, MAX_REPOS_PER_USER);

    const releaseBatches = await Promise.all(
      candidates.map((repo) => {
        const [owner, name] = repo.full_name.split("/");
        return fetchRepoReleases(owner, name);
      }),
    );

    allReleases.push(...releaseBatches.flat());
  }

  return allReleases
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    )
    .slice(0, MAX_RELEASES);
}
