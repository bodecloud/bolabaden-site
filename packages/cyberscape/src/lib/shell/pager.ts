import type { ShellResult } from "./engine";
import type { ShellSessionState } from "./types";

export const PAGE_SIZE = 12;

export interface PagerState {
  lines: string[];
  index: number;
  viewStart?: number;
}

export function beginPager(
  state: ShellSessionState,
  lines: string[],
): ShellResult {
  if (lines.length <= PAGE_SIZE) {
    state.pager = null;
    return { output: lines, state };
  }

  state.pager = {
    lines: lines.slice(),
    index: PAGE_SIZE,
    viewStart: 0,
  };

  return {
    output: lines.slice(0, PAGE_SIZE),
    state,
    pager: true,
  };
}

export function advancePager(state: ShellSessionState): ShellResult {
  return pageFrom(state, state.pager?.index ?? 0, PAGE_SIZE);
}

function pageFrom(
  state: ShellSessionState,
  start: number,
  span = PAGE_SIZE,
): ShellResult {
  const pager = state.pager;
  if (!pager) {
    return { output: ["No pager output pending."], state };
  }

  const clampedStart = Math.max(0, Math.min(start, Math.max(0, pager.lines.length - 1)));
  const end = Math.min(pager.lines.length, clampedStart + span);
  const output = pager.lines.slice(clampedStart, end);
  pager.viewStart = clampedStart;
  pager.index = end;

  const more = pager.index < pager.lines.length;
  state.pager = more ? pager : null;

  return {
    output,
    state,
    pager: more,
  };
}

export function runPagerCommand(
  state: ShellSessionState,
  command: string,
): ShellResult | null {
  const pager = state.pager;
  if (!pager) return { output: ["No pager output pending."], state };

  const raw = command.trim();
  const lower = raw.toLowerCase();
  const currentStart = pager.viewStart ?? Math.max(0, pager.index - PAGE_SIZE);

  if (raw === "__more__" || raw === " " || lower === "more" || raw === "") {
    return advancePager(state);
  }
  if (lower === "q" || lower === "quit") {
    state.pager = null;
    return { output: ["Pager canceled."], state };
  }
  if (raw === "b") {
    return pageFrom(state, Math.max(0, currentStart - PAGE_SIZE));
  }
  if (raw === "g") {
    return pageFrom(state, 0);
  }
  if (raw === "G") {
    return pageFrom(state, Math.max(0, pager.lines.length - PAGE_SIZE));
  }
  if (raw === "j") {
    return pageFrom(state, Math.min(pager.index, pager.lines.length - 1), 1);
  }
  if (raw === "k") {
    return pageFrom(state, Math.max(0, currentStart - 1), 1);
  }
  if (raw.startsWith("/") && raw.length > 1) {
    const needle = raw.slice(1).toLowerCase();
    const matchIndex = pager.lines.findIndex((line, index) =>
      index >= currentStart + 1 && line.toLowerCase().includes(needle)
    );
    if (matchIndex < 0) {
      return { output: [`Pattern not found: ${raw.slice(1)}`], state, pager: true };
    }
    return pageFrom(state, matchIndex);
  }
  if (raw === "?") {
    return {
      output: [
        "Pager commands: Space/Enter next, b back, g top, G bottom, j/k line, /text search, q quit.",
      ],
      state,
      pager: true,
    };
  }

  return null;
}
