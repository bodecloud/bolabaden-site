import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { userFiles } from "@/lib/db/schema";
import type { ShellSessionState } from "@/lib/shell/types";

function normalizeDownloadPath(state: ShellSessionState, filename: string): string | null {
  const cleaned = filename.trim();
  if (!cleaned) return null;
  const base = `/home/${state.username ?? "guest"}`;
  const path = cleaned.startsWith("/") ? cleaned : `${base}/${cleaned}`;
  const parts = path.split("/").filter(Boolean);
  const normalized: string[] = [];
  for (const part of parts) {
    if (part === ".") continue;
    if (part === "..") normalized.pop();
    else normalized.push(part);
  }
  const result = `/${normalized.join("/")}`;
  return result === "/" ? null : result;
}

export function persistDownloadedFile(
  state: ShellSessionState,
  filename: string,
  body: string,
): string | null {
  state.downloads[filename] = body;

  const path = normalizeDownloadPath(state, filename);
  if (!state.userId || !path) return null;

  db.delete(userFiles)
    .where(and(eq(userFiles.userId, state.userId), eq(userFiles.path, path)))
    .run();
  db.insert(userFiles).values({
    userId: state.userId,
    path,
    body,
    updatedAt: Date.now(),
  }).run();
  return path;
}
