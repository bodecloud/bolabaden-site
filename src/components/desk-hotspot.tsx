"use client";

import { cn } from "@/lib/utils";

type HotspotColor = "blue" | "green" | "amber" | "red";

interface DeskHotspotProps {
  label: string;
  color: HotspotColor;
  positionClassName: string;
  isActive: boolean;
  cardId: string;
  onActivate: () => void;
  triggerRef: (el: HTMLButtonElement | null) => void;
}

export function DeskHotspot({
  label,
  color,
  positionClassName,
  isActive,
  cardId,
  onActivate,
  triggerRef,
}: DeskHotspotProps) {
  return (
    <button
      type="button"
      ref={triggerRef}
      onClick={onActivate}
      aria-expanded={isActive}
      aria-controls={isActive ? cardId : undefined}
      aria-label={label}
      className={cn(
        "command-desk-hotspot",
        `command-desk-hotspot--${color}`,
        positionClassName,
        isActive && "command-desk-hotspot--active",
      )}
    >
      <span className="command-desk-hotspot__orb" aria-hidden="true" />
      <span className="command-desk-hotspot__label" aria-hidden="true">
        {label}
      </span>
    </button>
  );
}
