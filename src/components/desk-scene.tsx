/**
 * Decorative command-desk scene: ambient HUD furniture behind the homepage
 * hero. Content here is generic scene dressing, not a hotspot "reveal" --
 * hotspots and their approved artifact content are wired in U3 as
 * accessible children of this same scene container, so individual
 * furniture pieces are aria-hidden rather than the whole container.
 */
export function DeskScene() {
  return (
    <div className="command-desk-scene">
      <div className="command-desk-scene__wall" aria-hidden="true" />
      <div className="command-desk-scene__grid" aria-hidden="true" />
      <div className="command-desk-scene__floor" aria-hidden="true" />

      <div className="command-desk-scene__scoreboard" aria-hidden="true">
        <span>Signal</span>
        <small>strength</small>
        <strong>Strong</strong>
      </div>

      <div className="command-desk-scene__manual" aria-hidden="true">
        <strong>Field manual</strong>
      </div>

      <div className="command-desk-scene__monitor" aria-hidden="true">
        <span className="command-desk-scene__cursor">&gt;</span>
        booting desk...
      </div>

      <div className="command-desk-scene__keyboard" aria-hidden="true" />

      <div className="command-desk-scene__workbench" aria-hidden="true">
        <span>TS</span>
        <span>CSS</span>
        <span>Node</span>
      </div>

      <div
        className="command-desk-scene__sticky command-desk-scene__sticky--one"
        aria-hidden="true"
      >
        fix later
      </div>
      <div
        className="command-desk-scene__sticky command-desk-scene__sticky--two"
        aria-hidden="true"
      >
        works now
      </div>

      <div className="command-desk-scene__avatar" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
