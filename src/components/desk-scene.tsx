"use client";

import { useId, useRef, useState } from "react";
import { config } from "@/lib/config";
import { DeskHotspot } from "@/components/desk-hotspot";
import { DeskArtifactCard } from "@/components/desk-artifact-card";

type HotspotColor = "blue" | "green" | "amber" | "red";

interface HotspotDef {
  artifactId: string;
  label: string;
  color: HotspotColor;
  positionClassName: string;
}

// Each hotspot reveals one of the existing HOME_DESK_ARTIFACTS entries
// (the same public-safe, approved content already shown on the rotating
// desk-artifact section), thematically placed near the scene furniture
// it relates to.
const HOTSPOTS: HotspotDef[] = [
  {
    artifactId: "artifact-scoreboard",
    label: "Old scoreboard",
    color: "blue",
    positionClassName: "command-desk-hotspot--pos-scoreboard",
  },
  {
    artifactId: "artifact-toolset",
    label: "Toolset thread",
    color: "amber",
    positionClassName: "command-desk-hotspot--pos-manual",
  },
  {
    artifactId: "artifact-glitch",
    label: "Unreported glitch",
    color: "green",
    positionClassName: "command-desk-hotspot--pos-monitor",
  },
  {
    artifactId: "artifact-rcon",
    label: "Server command",
    color: "red",
    positionClassName: "command-desk-hotspot--pos-workbench",
  },
  {
    artifactId: "artifact-debug-log",
    label: "Debug log",
    color: "green",
    positionClassName: "command-desk-hotspot--pos-sticky",
  },
];

/**
 * Decorative command-desk scene: ambient HUD furniture plus interactive
 * hotspots behind the homepage hero. Furniture pieces are individually
 * aria-hidden (not the whole container), since hotspots are accessible
 * children of this same scene.
 */
export function DeskScene() {
  const cardId = useId();
  const [activeId, setActiveId] = useState<string | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const activeArtifact = activeId
    ? config.HOME_DESK_ARTIFACTS.find((artifact) => artifact.id === activeId)
    : undefined;

  function handleActivate(artifactId: string) {
    // Toggle when re-activating the same hotspot; replace (not stack)
    // when a different hotspot is activated while a card is open.
    setActiveId((current) => (current === artifactId ? null : artifactId));
  }

  function handleClose() {
    const previousId = activeId;
    setActiveId(null);
    if (previousId) {
      triggerRefs.current[previousId]?.focus();
    }
  }

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

      {HOTSPOTS.map((hotspot) => (
        <DeskHotspot
          key={hotspot.artifactId}
          label={hotspot.label}
          color={hotspot.color}
          positionClassName={hotspot.positionClassName}
          isActive={activeId === hotspot.artifactId}
          cardId={cardId}
          onActivate={() => handleActivate(hotspot.artifactId)}
          triggerRef={(el) => {
            triggerRefs.current[hotspot.artifactId] = el;
          }}
        />
      ))}

      {activeArtifact && (
        <DeskArtifactCard
          artifact={activeArtifact}
          cardId={cardId}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
