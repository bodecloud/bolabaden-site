import type { SttyMode } from "@/lib/shell/types";

const TTY_WIDTH = 78;

function stripControl(line: string): string {
  return line
    .replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, "")
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "");
}

function isDecorationOnly(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed) return false;
  if (/^[~._=\-+*#|/\\<>()'\s]+$/.test(trimmed)) return true;
  const alnum = trimmed.match(/[a-z0-9]/gi)?.length ?? 0;
  return trimmed.length >= 12 && alnum / trimmed.length < 0.18;
}

function wrapLine(line: string, width = TTY_WIDTH): string[] {
  if (line.length <= width) return [line];

  const wrapped: string[] = [];
  let remaining = line;
  while (remaining.length > width) {
    const hard = remaining.slice(0, width + 1);
    const splitAt = hard.lastIndexOf(" ") > 16 ? hard.lastIndexOf(" ") : width;
    wrapped.push(remaining.slice(0, splitAt).trimEnd());
    remaining = remaining.slice(splitAt).trimStart();
  }
  wrapped.push(remaining);
  return wrapped;
}

export function shapeOutputForStty(mode: SttyMode, output: string[]): string[] {
  if (mode === "normal") return output;

  const plain = output.map(stripControl);
  if (mode === "tty") return plain.flatMap((line) => wrapLine(line));

  return plain
    .map((line) => line.replace(/\s{2,}/g, " ").trimEnd())
    .filter((line) => line && !isDecorationOnly(line));
}
