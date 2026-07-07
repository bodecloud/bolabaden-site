import { createHash } from "node:crypto";

export type DialOutcome = "connect" | "busy" | "no-carrier";
export interface DialLineProfile {
  number: string;
  speed: string;
  outcome: DialOutcome;
  label: string;
}

function syntheticHex(seed: string, count: number): string {
  return createHash("md5").update(seed).digest("hex").slice(0, count);
}

export function dialupNumberForHost(hostname: string): string {
  const hash = syntheticHex(hostname, 7);
  return `555-${parseInt(hash.slice(0, 3), 16).toString().padStart(3, "0").slice(-3)}-${parseInt(hash.slice(3, 7), 16).toString().padStart(4, "0").slice(-4)}`;
}

export function dialupSpeedForHost(hostname: string): string {
  const speeds = ["14.4k", "28.8k", "33.6k", "56k", "ISDN"];
  return speeds[parseInt(syntheticHex(hostname, 2), 16) % speeds.length]!;
}

export function dialOutcomeForHost(hostname: string): DialOutcome {
  const normalized = hostname.toLowerCase();
  if (normalized === "qotd") return "busy";
  if (normalized === "zcode") return "no-carrier";
  return "connect";
}

function alternateNumberForHost(hostname: string, index: number): string {
  const hash = syntheticHex(`${hostname}:${index}`, 7);
  return `555-${parseInt(hash.slice(0, 3), 16).toString().padStart(3, "0").slice(-3)}-${parseInt(hash.slice(3, 7), 16).toString().padStart(4, "0").slice(-4)}`;
}

export function dialLineProfilesForHost(hostname: string): DialLineProfile[] {
  const primaryOutcome = dialOutcomeForHost(hostname);
  const primary: DialLineProfile = {
    number: dialupNumberForHost(hostname),
    speed: dialupSpeedForHost(hostname),
    outcome: primaryOutcome,
    label: "primary",
  };
  const normalized = hostname.toLowerCase();

  if (normalized === "bbs") {
    return [
      { ...primary, outcome: "busy" },
      {
        number: alternateNumberForHost(hostname, 2),
        speed: "33.6k",
        outcome: "connect",
        label: "line-hunt-2",
      },
      {
        number: alternateNumberForHost(hostname, 3),
        speed: "56k",
        outcome: "connect",
        label: "line-hunt-3",
      },
    ];
  }

  if (normalized === "qotd") {
    return [
      primary,
      {
        number: alternateNumberForHost(hostname, 2),
        speed: "14.4k",
        outcome: "connect",
        label: "answer line",
      },
    ];
  }

  if (normalized === "zcode") {
    return [
      primary,
      {
        number: alternateNumberForHost(hostname, 2),
        speed: "28.8k",
        outcome: "connect",
        label: "secondary line",
      },
    ];
  }

  return [primary];
}

export function dialCarrierPreview(hostname: string): string {
  const outcome = dialOutcomeForHost(hostname);
  if (outcome === "busy") return "busy";
  if (outcome === "no-carrier") return "no carrier";
  return `carrier ${dialupSpeedForHost(hostname)}`;
}
