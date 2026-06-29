import Link from "next/link";
import { Metadata } from "next";
import { DiscoveryPageHero } from "@/components/discovery-page-hero";
import { PageLayout } from "@/components/page-layout";
import {
  SearchQueryForm,
  StaticSearchFallback,
} from "@/components/search-page-client";
import { config } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";
import { fetchSearxResults } from "@/lib/searx";

export const metadata: Metadata = buildPageMetadata({
  title: config.SEARCH_PAGE_TITLE,
  description: config.SEARCH_PAGE_DESCRIPTION,
  pathname: "/search",
});

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const isStaticExport = config.STATIC_EXPORT;

  let results: Array<{ title: string; url: string; content?: string }> = [];
  let error: string | null = null;

  if (query && !isStaticExport) {
    const response = await fetchSearxResults(query);
    if (response.ok) {
      results = response.results;
    } else {
      error = response.error;
    }
  }

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-2 sm:px-4 lg:px-6 py-12 pb-16">
        <DiscoveryPageHero
          title={config.SEARCH_PAGE_TITLE}
          description={config.SEARCH_PAGE_DESCRIPTION}
          containerClassName="mb-8"
        />

        <SearchQueryForm initialQuery={query} />

        <div className="mt-8">
          {!query && (
            <p className="text-sm text-zinc-500">{config.SEARCH_PAGE_EMPTY_HINT}</p>
          )}

          {query && isStaticExport && <StaticSearchFallback query={query} />}

          {query && !isStaticExport && error && (
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
          )}

          {query && !isStaticExport && !error && results.length === 0 && (
            <p className="text-sm text-zinc-500">{config.SEARCH_PAGE_NO_RESULTS}</p>
          )}

          {query && !isStaticExport && !error && results.length > 0 && (
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
          )}
        </div>
      </div>
    </PageLayout>
  );
}
