/**
 * Shared SearXNG URL helpers for redirect and JSON proxy routes.
 */

const CHECK_TIMEOUT_MS = 3000;

export function normalizeSearchPath(path: string): string {
  if (!path) return "/search";
  return path.startsWith("/") ? path : `/${path}`;
}

export function buildSearxSearchUrl(
  baseUrl: string,
  searchPath: string,
  query: string,
  format?: "json",
): string {
  const url = new URL(baseUrl.replace(/\/+$/, ""));
  url.pathname = normalizeSearchPath(searchPath);
  url.search = "";
  url.searchParams.set("q", query);
  if (format === "json") {
    url.searchParams.set("format", "json");
  }
  return url.toString();
}

export async function isHealthySearchTarget(url: string): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), CHECK_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "manual",
      cache: "no-store",
      signal: controller.signal,
      headers: {
        "User-Agent": "bolabaden-site/healthcheck",
      },
    });

    return response.status >= 200 && response.status < 400;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export type SearxResult = {
  title: string;
  url: string;
  content?: string;
};

export type SearxJsonResponse = {
  results?: Array<{
    title?: string;
    url?: string;
    content?: string;
  }>;
};

export function normalizeSearxResults(payload: SearxJsonResponse): SearxResult[] {
  if (!Array.isArray(payload.results)) return [];

  return payload.results
    .filter(
      (item): item is { title: string; url: string; content?: string } =>
        typeof item.title === "string" &&
        item.title.length > 0 &&
        typeof item.url === "string" &&
        item.url.length > 0,
    )
    .map((item) => ({
      title: item.title,
      url: item.url,
      content: item.content,
    }));
}

export type SearxFetchResult =
  | { ok: true; results: SearxResult[]; source: "primary" | "fallback" }
  | { ok: false; error: string };

export async function fetchSearxResults(query: string): Promise<SearxFetchResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { ok: false, error: "Missing search query" };
  }

  const { config } = await import("@/lib/config");

  const primaryUrl = buildSearxSearchUrl(
    config.SEARXNG_URL,
    config.SEARXNG_SEARCH_PATH,
    trimmed,
    "json",
  );

  const fallbackUrl = buildSearxSearchUrl(
    config.SEARXNG_PUBLIC_URL,
    config.SEARXNG_SEARCH_PATH,
    trimmed,
    "json",
  );

  async function tryFetch(url: string): Promise<SearxResult[] | null> {
    try {
      const response = await fetch(url, {
        cache: "no-store",
        headers: {
          Accept: "application/json",
          "User-Agent": "bolabaden-site/searx-proxy",
        },
      });

      if (!response.ok) return null;

      const payload = (await response.json()) as SearxJsonResponse;
      return normalizeSearxResults(payload);
    } catch {
      return null;
    }
  }

  const useFallback =
    config.SEARXNG_FALLBACK_ENABLED &&
    config.SEARXNG_URL !== config.SEARXNG_PUBLIC_URL;

  if (!useFallback) {
    const results = await tryFetch(primaryUrl);
    if (results) {
      return { ok: true, results, source: "primary" };
    }
    return { ok: false, error: "Search service unavailable" };
  }

  const healthy = await isHealthySearchTarget(
    buildSearxSearchUrl(
      config.SEARXNG_URL,
      config.SEARXNG_SEARCH_PATH,
      trimmed,
    ),
  );

  const preferredUrl = healthy ? primaryUrl : fallbackUrl;
  const source = healthy ? "primary" : "fallback";
  const results = await tryFetch(preferredUrl);

  if (results) {
    return { ok: true, results, source };
  }

  const alternateUrl = healthy ? fallbackUrl : primaryUrl;
  const alternateResults = await tryFetch(alternateUrl);
  if (alternateResults) {
    return {
      ok: true,
      results: alternateResults,
      source: healthy ? "fallback" : "primary",
    };
  }

  return { ok: false, error: "Search service unavailable" };
}
