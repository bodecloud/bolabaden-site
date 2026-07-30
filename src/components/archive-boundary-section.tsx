import { config } from "@/lib/config";

export function ArchiveBoundarySection() {
  if (config.HOME_ARCHIVE_CARDS.length === 0) return null;

  return (
    <section
      className="border-b border-[rgba(102,217,255,0.14)]"
      id="archive-boundary"
    >
      <div className="command-desk-section max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
        <div className="command-desk-section-heading mb-8">
          <p className="command-desk-kicker">archive boundary</p>
          <h2>{config.HOME_ARCHIVE_TITLE}</h2>
          <p>{config.HOME_ARCHIVE_SUBTITLE}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {config.HOME_ARCHIVE_CARDS.map((card) => (
            <div key={card.title} className="command-desk-artifact">
              <span>{card.tag}</span>
              <strong>{card.title}</strong>
              <p>{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
