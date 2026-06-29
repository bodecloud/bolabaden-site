import { config } from "@/lib/config";
import type { ReleaseFeedItem } from "@/lib/github-releases";

interface HomeFutureSectionProps {
  releases?: ReleaseFeedItem[];
}

function formatReleaseDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function HomeFutureSection({ releases = [] }: HomeFutureSectionProps) {
  const placeholders = config.HOME_FUTURE_PLACEHOLDERS;
  const hasReleases = releases.length > 0;
  const hasPlaceholders = placeholders.length > 0;

  if (!hasReleases && !hasPlaceholders) return null;

  return (
    <section className="border-b border-[#1f1f1f]" id="future-blocks">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="text-[10px] font-semibold text-emerald-500/80 border border-emerald-500/20 rounded px-2 py-0.5">
            {config.HOME_FUTURE_BADGE}
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-white mb-1">
          {config.HOME_FUTURE_TITLE}
        </h2>
        <p className="text-sm text-zinc-400 mb-8 max-w-2xl">
          {config.HOME_FUTURE_SUBTITLE}
        </p>

        {hasReleases && (
          <div className="mb-6">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 mb-3">
              Recent releases
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {releases.map((release) => (
                <li
                  key={release.url}
                  className="rounded-lg border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3"
                >
                  <a
                    href={release.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    {release.title}
                  </a>
                  <p className="mt-1 text-xs text-zinc-500">
                    {release.repo}
                    {release.publishedAt
                      ? ` · ${formatReleaseDate(release.publishedAt)}`
                      : ""}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasPlaceholders && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {placeholders.map((label) => (
              <li
                key={label}
                className="rounded-lg border border-dashed border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3 text-sm text-zinc-500"
              >
                {label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
