import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { userFiles, users } from "@/lib/db/schema";
import { getHost } from "@/lib/net/hosts";
import type { ShellSessionState } from "@/lib/shell/types";

export interface BbsSysopRecord {
  host: string;
  board: string;
  owner: string;
  userId: number;
  path: string;
  createdAt: number;
  policy: string;
}

export type BbsSysopClaimResult =
  | { status: "claimed"; record: BbsSysopRecord }
  | { status: "already-owned"; record: BbsSysopRecord }
  | { status: "owned-by-other"; record: BbsSysopRecord }
  | { status: "login-required" };

const SYSOP_FILENAME = "sysop.txt";
const SYSOP_POLICY = "moderate posts, maintain file areas, publish board listing";

function sysopPath(username: string): string {
  return `/home/${username}/${SYSOP_FILENAME}`;
}

function boardNameForHost(host: string): string {
  return getHost(host)?.bbs_config?.name ?? `${host.toUpperCase()} BBS`;
}

function recordLine(record: Pick<BbsSysopRecord, "host" | "board" | "createdAt" | "policy">): string {
  return [record.host, record.board, String(record.createdAt), record.policy].join("|");
}

function parseRecordLine(line: string, owner: string, userId: number, path: string): BbsSysopRecord | null {
  if (!line || line.startsWith("#")) return null;
  const [host, board, createdAtRaw, ...policyParts] = line.split("|");
  if (!host || !board || !createdAtRaw) return null;
  const createdAt = Number(createdAtRaw);
  if (!Number.isFinite(createdAt)) return null;
  return {
    host,
    board,
    owner,
    userId,
    path,
    createdAt,
    policy: policyParts.join("|") || SYSOP_POLICY,
  };
}

function parseSysopFile(body: string, owner: string, userId: number, path: string): BbsSysopRecord[] {
  return body
    .split(/\r?\n/)
    .map((line) => parseRecordLine(line.trim(), owner, userId, path))
    .filter((record): record is BbsSysopRecord => Boolean(record));
}

export function allBbsSysopRecords(): BbsSysopRecord[] {
  const userRows = db.select().from(users).all();
  const usernames = new Map(userRows.map((user) => [user.id, user.username]));
  return db.select().from(userFiles).all()
    .flatMap((file) => {
      if (!file.path.endsWith(`/${SYSOP_FILENAME}`) && file.path !== SYSOP_FILENAME) return [];
      const owner = usernames.get(file.userId);
      if (!owner) return [];
      return parseSysopFile(file.body, owner, file.userId, file.path);
    })
    .sort((a, b) => b.createdAt - a.createdAt || a.host.localeCompare(b.host));
}

export function sysopRecordsForState(state: ShellSessionState): BbsSysopRecord[] {
  if (!state.userId || !state.username) return [];
  const path = sysopPath(state.username);
  const file = db.select()
    .from(userFiles)
    .where(and(eq(userFiles.userId, state.userId), eq(userFiles.path, path)))
    .get();
  return file ? parseSysopFile(file.body, state.username, state.userId, file.path) : [];
}

export function sysopRecordForHost(host: string): BbsSysopRecord | null {
  return allBbsSysopRecords().find((record) => record.host.toLowerCase() === host.toLowerCase()) ?? null;
}

export function claimBbsSysop(state: ShellSessionState, host: string): BbsSysopClaimResult {
  if (!state.userId || !state.username || !state.loggedIn) {
    return { status: "login-required" };
  }

  const existing = sysopRecordForHost(host);
  if (existing) {
    return existing.userId === state.userId
      ? { status: "already-owned", record: existing }
      : { status: "owned-by-other", record: existing };
  }

  const path = sysopPath(state.username);
  const currentRecords = sysopRecordsForState(state);
  const record: BbsSysopRecord = {
    host,
    board: boardNameForHost(host),
    owner: state.username,
    userId: state.userId,
    path,
    createdAt: Date.now(),
    policy: SYSOP_POLICY,
  };
  const body = [
    "# Cyberscape BBS sysop ownership",
    "# host|board|createdAt|policy",
    ...currentRecords.map(recordLine),
    recordLine(record),
  ].join("\n");

  db.delete(userFiles)
    .where(and(eq(userFiles.userId, state.userId), eq(userFiles.path, path)))
    .run();
  db.insert(userFiles).values({
    userId: state.userId,
    path,
    body,
    updatedAt: Date.now(),
  }).run();

  return { status: "claimed", record };
}
