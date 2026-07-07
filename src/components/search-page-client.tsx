"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { config } from "@/lib/config";

export function SearchQueryForm({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

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
