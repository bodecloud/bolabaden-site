import { config } from "@/lib/config";

export function ArchiveBoundarySection() {
  if (config.HOME_ARCHIVE_CARDS.length === 0) return null;

  return (
    <section className="border-b border-[#1f1f1f]" id="archive-boundary">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-2">
          archive boundary
        </p>
        <h2 className="text-2xl font-semibold text-white mb-3 max-w-2xl">
          {config.HOME_ARCHIVE_TITLE}
        </h2>
        <p className="text-sm text-zinc-400 mb-8 max-w-2xl leading-relaxed">
          {config.HOME_ARCHIVE_SUBTITLE}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {config.HOME_ARCHIVE_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] p-4"
            >
              <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wide">
                {card.tag}
              </span>
              <h3 className="mt-2 font-medium text-white">{card.title}</h3>
              <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
