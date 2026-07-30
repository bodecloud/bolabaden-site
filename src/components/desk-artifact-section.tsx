import { config, type DeskArtifact } from "@/lib/config";

function pickDailyArtifact(
  artifacts: DeskArtifact[],
  date: Date,
): DeskArtifact | undefined {
  if (artifacts.length === 0) return undefined;
  const dayOfYear = Math.floor(
    (Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) -
      Date.UTC(date.getUTCFullYear(), 0, 0)) /
      86_400_000,
  );
  return artifacts[dayOfYear % artifacts.length];
}

export function DeskArtifactSection({ now = new Date() }: { now?: Date }) {
  const artifact = pickDailyArtifact(config.HOME_DESK_ARTIFACTS, now);
  if (!artifact) return null;

  return (
    <section className="border-b border-[#1f1f1f]" id="desk-artifact">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
        <p className="text-xs font-semibold text-amber-500/80 uppercase tracking-[0.2em] mb-2">
          {config.HOME_DESK_ARTIFACT_TITLE}
        </p>
        <p className="text-sm text-zinc-500 mb-6 max-w-xl">
          {config.HOME_DESK_ARTIFACT_SUBTITLE}
        </p>
        <div className="rounded-lg border border-dashed border-amber-500/20 bg-[#0f0f0f] px-5 py-4 max-w-xl">
          <p className="text-sm font-medium text-white">{artifact.title}</p>
          <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
            {artifact.note}
          </p>
        </div>
      </div>
    </section>
  );
}
