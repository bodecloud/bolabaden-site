import Link from "next/link";
import { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { DiscoveryPageHero } from "@/components/discovery-page-hero";
import { PageLayout } from "@/components/page-layout";
import { config } from "@/lib/config";
import { getFieldNotes } from "@/lib/field-notes";
import { buildPageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = buildPageMetadata({
  title: config.NOTES_PAGE_TITLE,
  description: config.NOTES_PAGE_DESCRIPTION,
  pathname: "/notes",
  imagePath: "/opengraph-image",
  type: "article",
});
export const dynamic = "force-dynamic";

export default async function NotesIndexPage() {
  const notes = await getFieldNotes();

  return (
    <PageLayout>
      <DiscoveryPageHero
        eyebrow={config.NOTES_INDEX_SECTION_TITLE}
        title={config.NOTES_PAGE_TITLE}
        description={config.NOTES_PAGE_DESCRIPTION}
        eyebrowTone="muted"
      />

      <div className="max-w-5xl mx-auto px-2 sm:px-4 lg:px-6 pb-16">
        {notes.length === 0 ? (
          <p className="text-zinc-500 text-sm">
            {config.NOTES_EMPTY_STATE_LABEL}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.slug}`}
                className="group flex flex-col justify-between p-5 rounded-lg border border-[#1f1f1f] hover:border-[#2f2f2f] bg-[#0f0f0f] hover:bg-[#141414] transition-all"
              >
                <div>
                  <p className="text-sm font-medium text-white mb-2">
                    {note.title}
                  </p>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {note.description}
                  </p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">
                    {formatDate(note.date)}
                  </span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-emerald-400 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
