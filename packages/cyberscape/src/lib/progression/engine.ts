import type { ShellSessionState } from "@/lib/shell/types";
import { getHost } from "@/lib/net/hosts";
import { dialCarrierPreview, dialLineProfilesForHost, dialupNumberForHost, dialupSpeedForHost } from "@/lib/net/dialing";
import { db } from "@/lib/db";
import { hostState, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export function grantStarterBadges(): string[] {
  return ["newuser"];
}

export function progressionForBadges(badges: string[]): { diskQuota: number; systemLevel: number } {
  const unique = new Set(badges);
  const diskQuota = 64 + unique.size * 32;
  let systemLevel = 1;
  if (unique.has("wardialer")) systemLevel = Math.max(systemLevel, 2);
  if (unique.has("hacker")) systemLevel = Math.max(systemLevel, 3);
  if (unique.has("rootkit")) systemLevel = Math.max(systemLevel, 4);
  if (unique.has("solver")) systemLevel = Math.max(systemLevel, 5);
  return { diskQuota, systemLevel };
}

export function syncUserProgress(state: ShellSessionState): void {
  if (!state.userId) return;
  const badges = Array.from(new Set(state.badges));
  const progress = progressionForBadges(badges);
  db.update(users)
    .set({
      badges,
      diskQuota: progress.diskQuota,
      systemLevel: progress.systemLevel,
      homeHost: state.homeHost,
    })
    .where(eq(users.id, state.userId))
    .run();
}

export function unlockBadge(state: ShellSessionState, badge: string): boolean {
  if (state.badges.includes(badge)) return false;
  state.badges.push(badge);
  syncUserProgress(state);
  return true;
}

export function badgeSummary(badges: string[]): string[] {
  if (!badges.length) return ["No badges yet."];
  const progress = progressionForBadges(badges);
  return [
    ...badges.map((b) => `  [${b}]`),
    `Disk quota: ${progress.diskQuota}KB`,
    `System level: ${progress.systemLevel}`,
  ];
}

export function wardial(fromHost: string, state: ShellSessionState): string[] {
  const host = getHost(fromHost);
  if (!host) return ["Unknown host."];
  const lines = ["Scanning...", "", "Host                 Number       Speed    Carrier       Organization                   Details"];
  for (const n of host.neighbors.slice(0, 5)) {
    const h = getHost(n);
    const linesFound = dialLineProfilesForHost(n).length;
    const details = h?.bbs_config
      ? `BBS ${h.bbs_config.name}; ${h.bbs_config.tagline}`
      : h?.ports.includes(70)
        ? "Gopher line"
        : h?.ports.includes(21)
          ? "FTP line"
          : h?.ports.includes(79)
            ? "Finger line"
          : "modem data line";
    lines.push(`${n.padEnd(20)} ${dialupNumberForHost(n).padEnd(12)} ${dialupSpeedForHost(n).padEnd(8)} ${dialCarrierPreview(n).padEnd(13)} ${(h?.org.slice(0, 30) ?? "").padEnd(30)} ${details}; ${linesFound} line(s)`);
  }
  if (unlockBadge(state, "wardialer")) {
    lines.push("", "Badge unlocked: wardialer");
  }
  return lines;
}

export function attemptPorthack(state: ShellSessionState, target: string): string[] {
  unlockBadge(state, "hacker");
  const from = state.remoteStack.at(-1)?.host ?? state.homeHost;
  const src = getHost(from);
  const dst = getHost(target);
  if (!dst) return [`Unknown host: ${target}`];
  if (!src?.neighbors.includes(dst.hostname)) {
    return [`${target} is not adjacent to ${from}.`];
  }
  if (!src.files?.["porthack.exe"]) {
    return ["porthack.exe not found on this host."];
  }
  if (!state.userId) return ["Must be logged in."];

  state.pendingPorthack = { from, target: dst.hostname };
  return [
    "Buffer overflow detected.",
    "CAPTCHA: type YES to continue",
    "Type YES to continue or NO to abort.",
    `Challenge target: ${dst.hostname}.`,
  ];
}

export function confirmPorthack(state: ShellSessionState, response: string): string[] {
  const pending = state.pendingPorthack;
  if (!pending) return ["No pending porthack challenge."];
  const normalized = response.trim().toLowerCase();
  if (!normalized || ["no", "n", "cancel", "abort"].includes(normalized)) {
    state.pendingPorthack = null;
    return ["CAPTCHA aborted.", "Login not created."];
  }
  if (normalized !== "yes") {
    return ["CAPTCHA requires YES to continue, or NO to abort."];
  }

  const src = getHost(pending.from);
  const dst = getHost(pending.target);
  if (!src || !dst) {
    state.pendingPorthack = null;
    return ["Porthack target disappeared."];
  }
  if (!state.userId) {
    state.pendingPorthack = null;
    return ["Must be logged in."];
  }

  const row = db.select().from(hostState).where(eq(hostState.hostname, dst.hostname)).get();
  const logins = (row?.loginUserIds as number[]) ?? [];
  if (!logins.includes(state.userId)) {
    logins.push(state.userId);
    if (row) {
      db.update(hostState).set({ loginUserIds: logins }).where(eq(hostState.hostname, dst.hostname)).run();
    } else {
      db.insert(hostState).values({ hostname: dst.hostname, loginUserIds: logins }).run();
    }
  }
  state.loginHosts = Array.from(new Set([...state.loginHosts, dst.hostname]));
  state.pendingPorthack = null;
  return [
    "CAPTCHA accepted.",
    `Login created on ${dst.hostname}.`,
  ];
}

export function supportKitForHost(host: { os_type: string }): string {
  const os = host.os_type.toLowerCase();
  if (os.includes("vax") || os.includes("vms")) return "VAXKIT.EXE";
  if (os.includes("cpm") || os.includes("cp/m")) return "CPMKIT.EXE";
  return "UNIXKIT.EXE";
}

function hasDownloadedFile(state: ShellSessionState, pattern: RegExp): boolean {
  return Object.keys(state.downloads ?? {}).some((name) => pattern.test(name));
}

export function attemptRootkit(state: ShellSessionState, target: string): string[] {
  const host = getHost(target);
  if (!host) return [`Unknown host: ${target}`];
  if (!state.userId) return ["Must be logged in."];
  const hasPayload = hasDownloadedFile(state, /(^|\/)ROOTKIT\.EXE$/i);
  if (!hasPayload) {
    return [
      "rootkit.exe not loaded.",
      "Download a kit from a BBS or file service before attempting root.",
    ];
  }
  const supportKit = supportKitForHost(host);
  const hasSupportKit = hasDownloadedFile(state, new RegExp(`(^|/)${supportKit.replace(".", "\\.")}$`, "i"));
  if (!hasSupportKit) {
    return [
      `${supportKit.toLowerCase()} not loaded for ${host.os_type}.`,
      `Download ${supportKit} from a BBS file area before running ROOTKIT.EXE against ${host.hostname}.`,
    ];
  }

  unlockBadge(state, "rootkit");

  const row = db.select().from(hostState).where(eq(hostState.hostname, host.hostname)).get();
  const prior = row?.rootUserId;
  const logins = Array.from(new Set([...(row?.loginUserIds as number[] ?? []), state.userId]));
  if (row) {
    db.update(hostState)
      .set({ rootUserId: state.userId, loginUserIds: logins })
      .where(eq(hostState.hostname, host.hostname))
      .run();
  } else {
    db.insert(hostState).values({ hostname: host.hostname, rootUserId: state.userId, loginUserIds: [state.userId] }).run();
  }
  state.loginHosts = Array.from(new Set([...state.loginHosts, host.hostname]));
  state.rootHosts = Array.from(new Set([...state.rootHosts.filter((h) => h !== host.hostname), host.hostname]));
  if (prior && prior !== state.userId) {
    return [`Root on ${host.hostname} seized from prior operator.`];
  }
  return [`Root granted on ${host.hostname}.`];
}
