import { Suspense } from "react";
import { Metadata } from "next";
import { DiscoveryPageHero } from "@/components/discovery-page-hero";
import { PageLayout } from "@/components/page-layout";
import { SearchQueryForm, SearchResults } from "@/components/search-page-client";
import { config } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: config.SEARCH_PAGE_TITLE,
  description: config.SEARCH_PAGE_DESCRIPTION,
  pathname: "/search",
});

export default function SearchPage() {
  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-2 sm:px-4 lg:px-6 py-12 pb-16">
        <DiscoveryPageHero
          title={config.SEARCH_PAGE_TITLE}
          description={config.SEARCH_PAGE_DESCRIPTION}
          containerClassName="mb-8"
        />

        <Suspense
          fallback={
            <div className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] bg-[#0f0f0f] px-3 py-2 h-11" />
          }
        >
          <SearchQueryForm />
        </Suspense>

        <div className="mt-8">
          <Suspense
            fallback={
              <p className="text-sm text-zinc-500">
                {config.SEARCH_PAGE_EMPTY_HINT}
              </p>
            }
          >
            <SearchResults />
          </Suspense>
        </div>
      </div>
    </PageLayout>
  );
}
