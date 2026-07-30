"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { config } from "@/lib/config";

type SearxResult = { title: string; url: string; content?: string };

type SearxResultsResponse = {
  results: SearxResult[];
  error?: string;
};

export function SearchQueryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-3 py-2"
      aria-label={config.SEARCH_PAGE_FORM_ARIA}
    >
      <Search className="h-4 w-4 text-zinc-500 shrink-0" aria-hidden="true" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={config.NAV_SEARCH_INPUT_PLACEHOLDER}
        className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
        aria-label={config.NAV_SEARCH_INPUT_ARIA}
      />
      <button
        type="submit"
        className="text-xs text-zinc-400 hover:text-white transition-colors px-2"
      >
        {config.NAV_SEARCH_BUTTON_LABEL}
      </button>
    </form>
  );
}

export function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";
  const isStaticExport = config.STATIC_EXPORT;

  const [results, setResults] = useState<SearxResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || isStaticExport) {
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/searx/results?q=${encodeURIComponent(query)}`)
      .then((res) => res.json() as Promise<SearxResultsResponse>)
      .then((data) => {
        if (cancelled) return;
        if (data.error) {
          setError(data.error);
          setResults([]);
        } else {
          setResults(data.results ?? []);
        }
      })
      .catch(() => {
        if (!cancelled) setError(config.SEARCH_PAGE_NO_RESULTS);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query, isStaticExport]);

  if (!query) {
    return (
      <p className="text-sm text-zinc-500">{config.SEARCH_PAGE_EMPTY_HINT}</p>
    );
  }

  if (isStaticExport) {
    return <StaticSearchFallback query={query} />;
  }

  if (loading) {
    return <p className="text-sm text-zinc-500">{config.SEARCH_PAGE_EMPTY_HINT}</p>;
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-900/40 bg-red-950/20 p-4 text-sm text-red-200">
        <p className="mb-3">{error}</p>
        <Link
          href={config.getSearxngSearchUrl(query)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          {config.SEARCH_PAGE_OPEN_EXTERNAL_LABEL}
        </Link>
      </div>
    );
  }

  if (results.length === 0) {
    return <p className="text-sm text-zinc-500">{config.SEARCH_PAGE_NO_RESULTS}</p>;
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <p className="text-sm text-zinc-400">
          {config.SEARCH_PAGE_RESULTS_HEADING.replace("{query}", query)}
        </p>
        <Link
          href={config.getSearxngSearchUrl(query)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          {config.SEARCH_PAGE_OPEN_EXTERNAL_LABEL}
        </Link>
      </div>
      <ul className="space-y-4">
        {results.map((result) => (
          <li
            key={result.url}
            className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4"
          >
            <a
              href={result.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              {result.title}
            </a>
            <p className="mt-1 text-xs text-zinc-500 break-all">{result.url}</p>
            {result.content && (
              <p className="mt-2 text-sm text-zinc-400 line-clamp-3">
                {result.content}
              </p>
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export function StaticSearchFallback({ query }: { query: string }) {
  const externalUrl = query
    ? config.getSearxngSearchUrl(query)
    : config.getSearxngSearchUrl("");

  return (
    <div className="rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] p-6 text-sm text-zinc-400">
      <p className="mb-4">{config.SEARCH_PAGE_STATIC_MESSAGE}</p>
      <Link
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition-colors"
      >
        {config.SEARCH_PAGE_OPEN_EXTERNAL_LABEL}
      </Link>
    </div>
  );
}
