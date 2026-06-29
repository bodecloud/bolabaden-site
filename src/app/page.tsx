import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { DiscoveryPageHero } from "@/components/discovery-page-hero";
import { PageLayout } from "@/components/page-layout";
import { SectionErrorBoundary } from "@/components/section-error-boundary";
import { SideToc, type TocItem } from "@/components/side-toc";
import { EmbedsSection } from "@/components/embeds-section";
import { HomeHubSection } from "@/components/home-hub-section";
import { HomeFutureSection } from "@/components/home-future-section";
import {
  buildConfiguredSections,
  config,
  type HomeLayoutSectionId,
  type NormalizedSection,
} from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: config.HOME_PAGE_TITLE,
  description: config.HOME_PAGE_DESCRIPTION,
  pathname: "/",
  imagePath: "/opengraph-image",
  keywords: config.HOME_PAGE_KEYWORDS,
});

const VALID_HOME_SECTION_IDS: HomeLayoutSectionId[] = [
  "showcase",
  "embeds",
  "home-hub",
  "explore-lanes",
  "future-blocks",
];

const VALID_HOME_SECTION_ID_SET = new Set<HomeLayoutSectionId>(
  VALID_HOME_SECTION_IDS,
);

const HOME_LABEL_FALLBACKS: Record<HomeLayoutSectionId, string> = {
  showcase: "Showcase",
  embeds: "Live Services",
  "home-hub": "Hub",
  "explore-lanes": "Explore",
  "future-blocks": "Future",
};

function normalizeHomeSections(): NormalizedSection<HomeLayoutSectionId>[] {
  return buildConfiguredSections(
    config.HOME_LAYOUT_SECTIONS,
    VALID_HOME_SECTION_ID_SET,
    HOME_LABEL_FALLBACKS,
  );
}

function HomeShowcaseSection() {
  if (config.HOME_SHOWCASE_ITEMS.length === 0) return null;

  return (
    <section className="border-b border-[#1f1f1f]" id="showcase">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
        <div className="mb-8">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-2">
            {config.HOME_SHOWCASE_TITLE}
          </p>
          {config.HOME_SHOWCASE_SUBTITLE && (
            <p className="text-sm text-zinc-400 max-w-xl">
              {config.HOME_SHOWCASE_SUBTITLE}
            </p>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {config.HOME_SHOWCASE_ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href ?? "#"}
              target={item.href?.startsWith("/") ? undefined : "_blank"}
              rel={
                item.href?.startsWith("/") ? undefined : "noopener noreferrer"
              }
              className="group flex flex-col justify-between p-4 rounded-lg border border-[#1f1f1f] hover:border-[#2f2f2f] bg-[#0f0f0f] hover:bg-[#141414] transition-all"
            >
              <div>
                <p className="text-sm font-medium text-white">{item.title}</p>
                {item.description && (
                  <p className="mt-1 text-xs text-zinc-500 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
              <div className="mt-3 flex items-center justify-end">
                <ArrowUpRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-emerald-400 transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeExploreSection() {
  return (
    <section className="border-b border-[#1f1f1f]" id="explore-lanes">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-2">
          Explore
        </p>
        <h2 className="text-2xl font-semibold text-white mb-1">
          {config.HOME_EXPLORE_TITLE}
        </h2>
        <p className="text-sm text-zinc-400 mb-8 max-w-xl">
          {config.HOME_EXPLORE_SUBTITLE}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {config.HOME_EXPLORE_LANES.map((lane) => (
            <Link
              key={lane.title}
              href={lane.href}
              className="group flex items-center justify-between p-5 rounded-lg border border-[#1f1f1f] hover:border-[#2f2f2f] bg-[#0f0f0f] hover:bg-[#141414] transition-all"
            >
              <div>
                <p className="font-medium text-white">{lane.title}</p>
                <p className="mt-1 text-sm text-zinc-400">{lane.description}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-emerald-400 transition-colors shrink-0 ml-4" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function renderHomeSection(section: NormalizedSection<HomeLayoutSectionId>) {
  if (!section.enabled) return null;

  switch (section.id) {
    case "showcase":
      return <HomeShowcaseSection key={section.id} />;
    case "embeds":
      return (
        <SectionErrorBoundary
          key={section.id}
          fallbackTitle={config.HOME_EMBEDS_FALLBACK_TITLE}
        >
          <EmbedsSection
            mode={config.HOME_EMBEDS_MODE === "hero" ? "hero" : "default"}
          />
        </SectionErrorBoundary>
      );
    case "home-hub":
      return <HomeHubSection key={section.id} />;
    case "explore-lanes":
      return <HomeExploreSection key={section.id} />;
    case "future-blocks":
      return <HomeFutureSection key={section.id} />;
    default:
      return null;
  }
}

export default function HomePage() {
  const homeSections = normalizeHomeSections();
  const homeTocItems: TocItem[] = homeSections
    .filter((section) => section.enabled)
    .map((section) => ({ id: section.id, label: section.label }));

  return (
    <PageLayout>
      {homeTocItems.length > 1 && <SideToc items={homeTocItems} />}
      <DiscoveryPageHero
        title={config.SITE_NAME}
        description={config.SITE_META_DESCRIPTION}
        size="large"
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 bg-white text-black font-medium text-sm px-5 py-2.5 rounded-md hover:bg-zinc-100 transition-colors"
          >
            View projects
          </Link>
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 border border-[#2f2f2f] text-white font-medium text-sm px-5 py-2.5 rounded-md hover:border-[#444] transition-colors"
          >
            Read guides
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 border border-[#2f2f2f] text-zinc-300 font-medium text-sm px-5 py-2.5 rounded-md hover:border-[#444] hover:text-white transition-colors"
          >
            Full portfolio
          </Link>
        </div>
      </DiscoveryPageHero>

      {homeSections.map((section) => renderHomeSection(section))}
    </PageLayout>
  );
}
