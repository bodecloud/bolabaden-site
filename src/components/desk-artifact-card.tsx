"use client";

import { useEffect, useRef } from "react";
import { config, type DeskArtifact } from "@/lib/config";

interface DeskArtifactCardProps {
  artifact: DeskArtifact;
  cardId: string;
  onClose: () => void;
}

export function DeskArtifactCard({
  artifact,
  cardId,
  onClose,
}: DeskArtifactCardProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Move focus into the card whenever the revealed artifact changes --
  // covers both "open" (activeArtifact goes from undefined to set) and
  // "replace" (a different hotspot's artifact swaps in while open).
  useEffect(() => {
    closeRef.current?.focus();
  }, [artifact.id]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      id={cardId}
      className="command-desk-active-card"
      role="dialog"
      aria-label={artifact.title}
    >
      <button
        type="button"
        ref={closeRef}
        onClick={onClose}
        aria-label="Close"
        className="command-desk-active-card__close"
      >
        &times;
      </button>
      <span>{config.HOME_DESK_ARTIFACT_TITLE}</span>
      <h2>{artifact.title}</h2>
      <p>{artifact.note}</p>
    </div>
  );
}
