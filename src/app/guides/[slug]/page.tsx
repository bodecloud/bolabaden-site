import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageLayout } from "@/components/page-layout";
import { MarkdownContent } from "@/components/markdown-content";
import { GuideInlineToc } from "@/components/guide-inline-toc";
import { SideToc } from "@/components/side-toc";
import { config } from "@/lib/config";
import { getGuides } from "@/lib/guides";
import { extractMarkdownHeadings } from "@/lib/markdown-headings";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guides = await getGuides();
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return { title: config.GUIDE_NOT_FOUND_TITLE };
  return buildPageMetadata({
    title: guide.title,
    description: guide.description,
    pathname: `/guides/${guide.slug}`,
    imagePath: `/guides/${guide.slug}/opengraph-image`,
    type: "article",
    keywords: [guide.category, guide.difficulty, ...(guide.technologies || [])],
  });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guides = await getGuides();
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) return notFound();

  const guideIndex = guides.findIndex((g) => g.slug === slug);
  const previousGuide = guideIndex > 0 ? guides[guideIndex - 1] : null;
  const nextGuide =
    guideIndex >= 0 && guideIndex < guides.length - 1
      ? guides[guideIndex + 1]
      : null;

  const guideTocItems = extractMarkdownHeadings(guide.content);

  return (
    <PageLayout>
      {guideTocItems.length >= 3 && (
        <SideToc items={guideTocItems} hideMobileChrome />
      )}
      <div className="max-w-3xl mx-auto px-2 sm:px-4 lg:px-6 py-16">
        <div className="mb-8">
          <Link
            href="/guides"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {config.GUIDE_BACK_TO_INDEX_LABEL}
          </Link>
        </div>
        <div className="border-b border-[#1f1f1f] pb-8 mb-8">
          <h1 className="text-3xl font-semibold text-white tracking-tight mb-3">
            {guide.title}
          </h1>
          <p className="text-zinc-400 mb-4 leading-relaxed">
            {guide.description}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
              {guide.category}
            </span>
            <span className="text-zinc-700">·</span>
            <span className="text-xs text-zinc-500 capitalize">
              {guide.difficulty}
            </span>
            <span className="text-zinc-700">·</span>
            <span className="text-xs text-zinc-500">{guide.estimatedTime}</span>
          </div>
        </div>
        <GuideInlineToc items={guideTocItems} />
        <article className="max-w-none">
          <MarkdownContent content={guide.content} />
        </article>

        {(previousGuide || nextGuide) && (
          <nav
            aria-label="Guide navigation"
            className="mt-12 pt-8 border-t border-[#1f1f1f] grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {previousGuide ? (
              <Link
                href={`/guides/${previousGuide.slug}`}
                className="group flex flex-col gap-1 rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 hover:border-[#2f2f2f] transition-colors"
              >
                <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Previous
                </span>
                <span className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                  {previousGuide.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {nextGuide ? (
              <Link
                href={`/guides/${nextGuide.slug}`}
                className="group flex flex-col gap-1 rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 hover:border-[#2f2f2f] transition-colors sm:text-right sm:items-end"
              >
                <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                  Next
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                  {nextGuide.title}
                </span>
              </Link>
            ) : null}
          </nav>
        )}
      </div>
    </PageLayout>
  );
}
