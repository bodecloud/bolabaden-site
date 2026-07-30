import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageLayout } from "@/components/page-layout";
import { MarkdownContent } from "@/components/markdown-content";
import { config } from "@/lib/config";
import { getFieldNotes } from "@/lib/field-notes";
import { buildPageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const notes = await getFieldNotes();
  return notes.map((note) => ({ slug: note.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const notes = await getFieldNotes();
  const note = notes.find((n) => n.slug === slug);
  if (!note) return { title: config.NOTE_NOT_FOUND_TITLE };
  return buildPageMetadata({
    title: note.title,
    description: note.description,
    pathname: `/notes/${note.slug}`,
    imagePath: "/opengraph-image",
    type: "article",
  });
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const notes = await getFieldNotes();
  const note = notes.find((n) => n.slug === slug);
  if (!note) return notFound();

  const noteIndex = notes.findIndex((n) => n.slug === slug);
  const previousNote = noteIndex > 0 ? notes[noteIndex - 1] : null;
  const nextNote =
    noteIndex >= 0 && noteIndex < notes.length - 1
      ? notes[noteIndex + 1]
      : null;

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto px-2 sm:px-4 lg:px-6 py-16">
        <div className="mb-8">
          <Link
            href="/notes"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {config.NOTE_BACK_TO_INDEX_LABEL}
          </Link>
        </div>
        <div className="border-b border-[#1f1f1f] pb-8 mb-8">
          <h1 className="text-3xl font-semibold text-white tracking-tight mb-3">
            {note.title}
          </h1>
          <p className="text-zinc-400 mb-4 leading-relaxed">
            {note.description}
          </p>
          <span className="text-xs text-zinc-500">
            {formatDate(note.date)}
          </span>
        </div>
        <article className="max-w-none">
          <MarkdownContent content={note.content} />
        </article>

        {(previousNote || nextNote) && (
          <nav
            aria-label="Note navigation"
            className="mt-12 pt-8 border-t border-[#1f1f1f] grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            {previousNote ? (
              <Link
                href={`/notes/${previousNote.slug}`}
                className="group flex flex-col gap-1 rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 hover:border-[#2f2f2f] transition-colors"
              >
                <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Previous
                </span>
                <span className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                  {previousNote.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {nextNote ? (
              <Link
                href={`/notes/${nextNote.slug}`}
                className="group flex flex-col gap-1 rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4 hover:border-[#2f2f2f] transition-colors sm:text-right sm:items-end"
              >
                <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500">
                  Next
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm font-medium text-white group-hover:text-emerald-400 transition-colors">
                  {nextNote.title}
                </span>
              </Link>
            ) : null}
          </nav>
        )}
      </div>
    </PageLayout>
  );
}
