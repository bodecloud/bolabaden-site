import { BBS_CORPUS, type CorpusFileRecord } from "@/data/bbs-corpus/corpus-data";

export type { CorpusFileRecord };

export function allCorpusFiles(): CorpusFileRecord[] {
  return BBS_CORPUS;
}

function hostSeed(hostname: string): number {
  let h = 0;
  for (let i = 0; i < hostname.length; i++) {
    h = (Math.imul(31, h) + hostname.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** Deterministic file set per BBS host (rotates order; all corpus files appear). */
export function filesForHost(hostname: string): CorpusFileRecord[] {
  const all = BBS_CORPUS;
  if (!all.length) return [];
  if (all.length === 1) return all;
  const seed = hostSeed(hostname);
  const start = seed % all.length;
  return [...all.slice(start), ...all.slice(0, start)];
}

export function getFileByIndex(
  hostname: string,
  oneBasedIndex: number
): CorpusFileRecord | null {
  const files = filesForHost(hostname);
  const file = files[oneBasedIndex - 1];
  return file ?? null;
}

export function formatFileListing(hostname: string): string[] {
  const files = filesForHost(hostname);
  if (!files.length) {
    return ["No files in area."];
  }
  return [
    "Filename                          Bytes",
    "----------------------------------------",
    ...files.map(
      (f, i) =>
        `[${i + 1}] ${f.filename.padEnd(28).slice(0, 28)} ${String(f.bytes).padStart(6)}`
    ),
  ];
}

export function formatDownloadHeader(file: CorpusFileRecord): string[] {
  return [
    `Downloading ${file.filename} (${file.bytes} bytes, dev-only archive)`,
    `sha256: ${file.sha256.slice(0, 16)}…`,
    "---",
  ];
}
