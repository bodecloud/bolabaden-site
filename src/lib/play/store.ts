import { randomUUID } from "crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { applyCommand, buildSnapshot, cloneSession, createSession } from "./engine-xp";
import type { PlayCommandOutcome, PlaySnapshot } from "./types";

const STORE_KEY = Symbol.for("bolabaden.play.sessions");
const MAX_SESSIONS = 128;

function storePath(): string {
  return process.env.PLAY_SESSION_STORE_PATH
    ? path.resolve(process.env.PLAY_SESSION_STORE_PATH)
    : path.join(process.cwd(), "data", "play-sessions.json");
}

type SessionStore = {
  sessions: Map<string, ReturnType<typeof createSession>>;
  order: string[];
  loaded: boolean;
};

function hydrateSession(raw: ReturnType<typeof createSession>): ReturnType<typeof createSession> {
  const session = createSession(raw.sessionId);
  Object.assign(session, raw);
  return session;
}

function loadStoreFromDisk(): Pick<SessionStore, "sessions" | "order"> {
  const targetPath = storePath();
  if (!existsSync(targetPath)) {
    return {
      sessions: new Map(),
      order: [],
    };
  }

  try {
    const parsed = JSON.parse(readFileSync(targetPath, "utf8")) as {
      order?: string[];
      sessions?: Record<string, ReturnType<typeof createSession>>;
    };
    const sessions = new Map<string, ReturnType<typeof createSession>>();
    for (const [sessionId, rawSession] of Object.entries(parsed.sessions ?? {})) {
      sessions.set(sessionId, hydrateSession(rawSession));
    }
    const order = (parsed.order ?? []).filter((sessionId) => sessions.has(sessionId));
    return { sessions, order };
  } catch {
    return {
      sessions: new Map(),
      order: [],
    };
  }
}

function persistStore(store: SessionStore): void {
  try {
    const targetPath = storePath();
    mkdirSync(path.dirname(targetPath), { recursive: true });
    writeFileSync(
      targetPath,
      JSON.stringify(
        {
          order: store.order,
          sessions: Object.fromEntries(store.sessions),
        },
        null,
        2,
      ),
      "utf8",
    );
  } catch {
    // Persistence is best-effort; the in-memory copy still serves the request.
  }
}

export function resetPlayStoreForTests(): void {
  const globalWithStore = globalThis as typeof globalThis & {
    [STORE_KEY]?: SessionStore;
  };
  delete globalWithStore[STORE_KEY];
}

function getStore(): SessionStore {
  const globalWithStore = globalThis as typeof globalThis & {
    [STORE_KEY]?: SessionStore;
  };

  if (!globalWithStore[STORE_KEY]) {
    const diskStore = loadStoreFromDisk();
    globalWithStore[STORE_KEY] = {
      sessions: diskStore.sessions,
      order: diskStore.order,
      loaded: true,
    };
  } else if (!globalWithStore[STORE_KEY]!.loaded) {
    const diskStore = loadStoreFromDisk();
    globalWithStore[STORE_KEY]!.sessions = diskStore.sessions;
    globalWithStore[STORE_KEY]!.order = diskStore.order;
    globalWithStore[STORE_KEY]!.loaded = true;
  }

  return globalWithStore[STORE_KEY]!;
}

function pruneStore(store: SessionStore): void {
  while (store.order.length > MAX_SESSIONS) {
    const oldest = store.order.shift();
    if (oldest) {
      store.sessions.delete(oldest);
    }
  }
}

export function createAndStoreSession(sessionId: string = randomUUID()) {
  const store = getStore();
  const session = createSession(sessionId);
  store.sessions.set(session.sessionId, session);
  store.order.push(session.sessionId);
  pruneStore(store);
  persistStore(store);
  return session;
}

export function getSession(sessionId?: string | null) {
  if (!sessionId) {
    return createAndStoreSession();
  }

  const store = getStore();
  const found = store.sessions.get(sessionId);
  if (found) {
    return found;
  }

  return createAndStoreSession(sessionId);
}

export function getSnapshot(sessionId?: string | null): PlaySnapshot {
  return buildSnapshot(cloneSession(getSession(sessionId)));
}

export function runCommand(
  sessionId: string | undefined | null,
  command: string,
): PlayCommandOutcome {
  const session = getSession(sessionId);
  const outcome = applyCommand(session, command);
  const store = getStore();
  store.sessions.set(session.sessionId, session);
  if (!store.order.includes(session.sessionId)) {
    store.order.push(session.sessionId);
  }
  pruneStore(store);
  persistStore(store);
  return outcome;
}
