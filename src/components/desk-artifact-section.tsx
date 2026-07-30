import { config, type DeskArtifact } from "@/lib/config";

export function pickDailyArtifact(
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
    <section
      className="border-b border-[rgba(102,217,255,0.14)]"
      id="desk-artifact"
    >
      <div className="command-desk-section max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
        <div className="command-desk-section-heading mb-6">
          <p className="command-desk-kicker">
            {config.HOME_DESK_ARTIFACT_TITLE}
          </p>
          <p>{config.HOME_DESK_ARTIFACT_SUBTITLE}</p>
        </div>
        <div className="command-desk-artifact max-w-xl">
          <span>{artifact.approvedBy}</span>
          <strong>{artifact.title}</strong>
          <p>{artifact.note}</p>
        </div>
      </div>
    </section>
  );
}
