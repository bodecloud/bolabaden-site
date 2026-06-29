import { Metadata } from "next";
import { ContactSection } from "@/components/contact-section";
import { DiscoveryPageHero } from "@/components/discovery-page-hero";
import { PageLayout } from "@/components/page-layout";
import { config } from "@/lib/config";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: config.CONTACT_PAGE_TITLE,
  description: config.CONTACT_PAGE_DESCRIPTION,
  pathname: "/contact",
  imagePath: "/contact/opengraph-image",
});

export default function ContactPage() {
  return (
    <PageLayout>
      <DiscoveryPageHero
        eyebrow={config.CONTACT_PAGE_TITLE}
        title={config.CONTACT_HERO_TITLE}
        description="Email is the best way to reach me. I typically respond within 24 hours."
        eyebrowTone="muted"
      />
      <ContactSection showIntro={false} />
    </PageLayout>
  );
}
