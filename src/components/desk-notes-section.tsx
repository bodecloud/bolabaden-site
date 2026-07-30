import Link from "next/link";
import { config } from "@/lib/config";
import { getFieldNotes } from "@/lib/field-notes";
import { formatDate } from "@/lib/utils";

/**
 * True when the newest note is older than the threshold (or there is no
 * newest note at all) -- the boundary itself is not stale, so a note
 * published exactly `thresholdDays` ago still counts as fresh.
 */
export function isNotesFeedStale(
  newestNoteDate: Date | undefined,
  thresholdDays: number,
): boolean {
  if (!newestNoteDate) return true;
  const diffDays = (Date.now() - newestNoteDate.getTime()) / 86_400_000;
  return diffDays > thresholdDays;
}

export async function DeskNotesSection() {
  const notes = await getFieldNotes();
  const stale = isNotesFeedStale(
    notes[0]?.date,
    config.HOME_NOTES_STALE_THRESHOLD_DAYS,
  );

  return (
    <section
      className="border-b border-[rgba(102,217,255,0.14)]"
      id="field-notes"
    >
      <div className="command-desk-section max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
        <div className="command-desk-section-heading mb-6">
          <p className="command-desk-kicker">{config.HOME_NOTES_TITLE}</p>
          <p>{config.HOME_NOTES_SUBTITLE}</p>
        </div>

        {stale ? (
          <div className="command-desk-artifact max-w-xl">
            <p>{config.HOME_NOTES_RESTING_LABEL}</p>
          </div>
        ) : (
          <div className="command-desk-notes-list">
            {notes.slice(0, config.HOME_NOTES_MAX_ITEMS).map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.slug}`}
                className="command-desk-notes-list__row"
              >
                <span className="command-desk-notes-list__title">
                  {note.title}
                </span>
                <span className="command-desk-notes-list__date">
                  {formatDate(note.date)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
