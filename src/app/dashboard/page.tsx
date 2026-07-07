import { Metadata } from "next";
import { Dashboard } from "@/components/dashboard";
import { DiscoveryPageHero } from "@/components/discovery-page-hero";
import { EmbedsSection } from "@/components/embeds-section";
import { HashScroll } from "@/components/hash-scroll";
import { PageLayout } from "@/components/page-layout";
import { SectionErrorBoundary } from "@/components/section-error-boundary";
import { config } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: config.DASHBOARD_PAGE_TITLE,
  description: config.DASHBOARD_PAGE_DESCRIPTION,
  pathname: "/dashboard",
  imagePath: "/dashboard/opengraph-image",
});

export default function DashboardPage() {
  return (
    <PageLayout>
      <HashScroll />
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12 pb-16">
        <DiscoveryPageHero
          title={config.DASHBOARD_PAGE_TITLE}
          description={config.DASHBOARD_PAGE_DESCRIPTION}
          containerClassName="mb-10"
        />

        <SectionErrorBoundary fallbackTitle="Dashboard unavailable">
          <Dashboard showHeader={false} />
        </SectionErrorBoundary>

        {config.DASHBOARD_EMBEDS_ENABLED && (
          <div className="mt-16 border-t border-[#1f1f1f] pt-12">
            <SectionErrorBoundary
              fallbackTitle={config.HOME_EMBEDS_FALLBACK_TITLE}
            >
              <EmbedsSection mode="default" />
            </SectionErrorBoundary>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
