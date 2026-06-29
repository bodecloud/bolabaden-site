import { Metadata } from "next";
import { DiscoveryPageHero } from "@/components/discovery-page-hero";
import { PageLayout } from "@/components/page-layout";
import { ProjectsSection } from "@/components/projects-section";
import { config } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: config.PROJECTS_PAGE_TITLE,
  description: config.PROJECTS_PAGE_DESCRIPTION,
  pathname: "/projects",
  imagePath: "/projects/opengraph-image",
  type: "article",
});

export default function ProjectsPage() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12 pb-16">
        <DiscoveryPageHero
          title={config.PROJECTS_PAGE_TITLE}
          description={config.PROJECTS_PAGE_DESCRIPTION}
          containerClassName="mb-10"
        />
        <ProjectsSection showHeader={false} />
      </div>
    </PageLayout>
  );
}
