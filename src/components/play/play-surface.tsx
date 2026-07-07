"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
  type KeyboardEvent,
} from "react";
import { cn } from "@/lib/utils";
import type { PlaySnapshot } from "@/lib/play/types";

type PlaySurfaceProps = {
  initialSnapshot: PlaySnapshot;
  staticPreview?: boolean;
};

type ChatEntry = {
  kind: "user" | "system" | "response" | "glitch";
  text: string;
  id: string;
};

type GlyphName =
  | "audio"
  | "back"
  | "board"
  | "directory"
  | "files"
  | "mail"
  | "message"
  | "monitor"
  | "spark"
  | "shield"
  | "timer";

const GLYPH_LABELS: Record<GlyphName, string> = {
  audio: "◉",
  back: "→",
  board: "▤",
  directory: "▣",
  files: "⬇",
  mail: "✉",
  message: "▥",
  monitor: "▧",
  spark: "✦",
  shield: "⛨",
  timer: "↻",
};

function Glyph({
  name,
  className,
}: {
  name: GlyphName;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex h-4 w-4 shrink-0 items-center justify-center font-mono text-[12px] leading-none text-current",
        className,
      )}
    >
      {GLYPH_LABELS[name]}
    </span>
  );
}

function kindStyles(kind: ChatEntry["kind"]) {
  switch (kind) {
    case "user":
      return "text-cyan-200";
    case "glitch":
      return "text-amber-300";
    case "system":
      return "text-sky-200";
    case "response":
    default:
      return "text-zinc-100";
  }
}

function formatLine(entry: ChatEntry) {
  return entry.text.startsWith("> ") ? entry.text : entry.text;
}

function formatMessageStamp(createdAt: string) {
  return new Date(createdAt).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function postCommand(sessionId: string, command: string) {
  const res = await fetch("/api/play/command", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-play-json": "1",
    },
    body: JSON.stringify({ sessionId, command }),
  });

  if (!res.ok) {
    throw new Error("The desktop did not accept that command.");
  }

  return (await res.json()) as {
    snapshot: PlaySnapshot;
    reply: string[];
    glitch: boolean;
  };
}

function playTone(enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  const AudioContextClass =
    window.AudioContext || (window as Window & { webkitAudioContext?: any }).webkitAudioContext;

  if (!AudioContextClass) return;

  const ctx = new AudioContextClass();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.value = 384;
  gain.gain.value = 0.02;
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.08);
  osc.onended = () => ctx.close().catch(() => undefined);
}

export function PlaySurface({
  initialSnapshot,
  staticPreview = false,
}: PlaySurfaceProps) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [command, setCommand] = useState("");
  const [busy, startTransition] = useTransition();
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [motionEnabled, setMotionEnabled] = useState(true);
  const [shake, setShake] = useState(false);
  const router = useRouter();
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const commandHistory = useRef<string[]>([]);
  const historyIndex = useRef<number | null>(null);

  const transcript = useMemo(
    () =>
      snapshot.transcript.map((entry) => ({
        ...entry,
        kind: entry.kind as ChatEntry["kind"],
      })),
    [snapshot.transcript],
  );
  const messageEntries = snapshot.currentRoom.id === "mail" ? snapshot.inbox : snapshot.board;
  const messageVerb = snapshot.currentRoom.id === "mail" ? "inbox" : "board";

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [snapshot.transcript.length]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (staticPreview || typeof window === "undefined") return;
    const storedSession = window.localStorage.getItem("play-session-id");
    if (storedSession && storedSession !== snapshot.sessionId) {
      router.replace(`/play?session=${encodeURIComponent(storedSession)}`);
    }
  }, [router, snapshot.sessionId, staticPreview]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyPreference = () => setMotionEnabled(!media.matches);
    applyPreference();
    media.addEventListener("change", applyPreference);
    return () => media.removeEventListener("change", applyPreference);
  }, []);

  useEffect(() => {
    if (!shake || !motionEnabled) return;
    const timer = window.setTimeout(() => setShake(false), 280);
    return () => window.clearTimeout(timer);
  }, [motionEnabled, shake]);

  useEffect(() => {
    if (staticPreview || typeof window === "undefined") return;
    window.localStorage.setItem("play-session-id", snapshot.sessionId);
  }, [snapshot.sessionId, staticPreview]);

  const roomButtons = snapshot.rooms.filter((room) => room.unlocked);

  const submit = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || busy || staticPreview) return;

    commandHistory.current = [...commandHistory.current, trimmed].slice(-24);
    historyIndex.current = null;
    setCommand("");
    startTransition(() => {
      void (async () => {
        try {
          const outcome = await postCommand(snapshot.sessionId, trimmed);
          setSnapshot(outcome.snapshot);
          setShake(outcome.glitch);
          playTone(audioEnabled);
        } catch (error) {
          setShake(true);
          setSnapshot((current) => ({
            ...current,
            transcript: [
              ...current.transcript,
              {
                id: crypto.randomUUID(),
                kind: "glitch",
                text:
                  error instanceof Error
                    ? error.message
                    : "The desktop stumbled before the command landed.",
                createdAt: new Date().toISOString(),
              },
            ],
          }));
        }
      })();
    });
  };

  const useRoom = (roomId: string) => {
    submit(`enter ${roomId}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit(command);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const history = commandHistory.current;
      if (history.length === 0) return;
      const nextIndex =
        historyIndex.current === null
          ? history.length - 1
          : Math.max(0, historyIndex.current - 1);
      historyIndex.current = nextIndex;
      setCommand(history[nextIndex] ?? "");
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      const history = commandHistory.current;
      if (history.length === 0) return;
      if (historyIndex.current === null) return;
      const nextIndex = Math.min(history.length - 1, historyIndex.current + 1);
      historyIndex.current = nextIndex;
      setCommand(history[nextIndex] ?? "");
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#0e2a57] text-slate-100">
      <a
        href="#play-console"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-slate-900"
      >
        Skip to console
      </a>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_85%,rgba(110,231,183,0.24),transparent_26%),radial-gradient(circle_at_78%_15%,rgba(255,255,255,0.18),transparent_22%),linear-gradient(180deg,#0f3c83_0%,#1f5fa8_26%,#7fb7f6_60%,#2e6b3e_100%)] opacity-95" />
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[linear-gradient(transparent_0,rgba(255,255,255,0.04)_1px,transparent_2px)] bg-[length:100%_4px]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-[linear-gradient(180deg,transparent,rgba(16,185,129,0.25))]" />

      <div className="relative flex min-h-screen flex-col">
        <header className="px-4 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between rounded-t-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur-md">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded bg-[#1d4ed8] text-[11px] font-semibold text-white shadow-sm">
                XP
              </span>
              <div>
                <p className="font-medium text-white">XP Desk</p>
                <p className="text-[11px] text-white/70">
                  Calm desktop, hidden layer, backend-driven state
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {staticPreview && (
                <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white/75">
                  Static preview
                </span>
              )}
              <button
                type="button"
                onClick={() => setAudioEnabled((value) => !value)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  audioEnabled
                    ? "border-emerald-300/60 bg-emerald-400/20 text-emerald-50"
                    : "border-white/20 bg-white/10 text-white/80 hover:bg-white/15",
                )}
              >
                <Glyph name="audio" />
                {audioEnabled ? "Sound on" : "Sound off"}
              </button>
              <button
                type="button"
                onClick={() => setMotionEnabled((value) => !value)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                  motionEnabled
                    ? "border-white/20 bg-white/10 text-white/80 hover:bg-white/15"
                    : "border-emerald-300/60 bg-emerald-400/20 text-emerald-50",
                )}
                aria-pressed={!motionEnabled}
              >
                <Glyph name="timer" />
                {motionEnabled ? "Motion on" : "Motion off"}
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/15"
              >
                Back to hub
                <Glyph name="back" className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </header>

        <noscript>
          <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl border border-white/20 bg-black/80 p-4 font-mono text-sm text-emerald-100">
              JavaScript is disabled. This session is running in terminal mode.
              Use the command line below to `help`, `phonebook`, `enter`, or
              `cat` files.
            </div>
          </div>
        </noscript>

        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-4 px-4 pb-24 pt-4 sm:px-6 lg:px-8 lg:pb-20">
          <div className="grid gap-4 lg:grid-cols-[1.65fr_0.95fr]">
            <section
              id="play-console"
              className={cn(
                "overflow-hidden rounded-2xl border border-white/30 bg-[#e8e4d6]/95 text-slate-800 shadow-[0_30px_90px_rgba(15,23,42,0.3)] backdrop-blur-sm",
                shake && motionEnabled && "animate-pulse",
              )}
            >
              <div className="flex items-center justify-between border-b border-slate-300/80 bg-gradient-to-r from-[#3b6ed6] via-[#6b92e8] to-[#9ab7f4] px-4 py-2 text-white">
                <div className="flex items-center gap-2">
                  <Glyph name="monitor" />
                  <span className="text-sm font-medium">
                    {snapshot.title}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-3 w-3 rounded-full bg-white/70" />
                  <span className="h-3 w-3 rounded-full bg-white/50" />
                  <span className="h-3 w-3 rounded-full bg-white/30" />
                </div>
              </div>

              <div className="grid gap-4 p-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-2xl border border-slate-300 bg-[#10141c] p-4 text-slate-100 shadow-inner">
                  <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-sky-200/80">
                        Control Panel
                      </p>
                      <p className="text-sm text-slate-300">
                        {snapshot.subtitle}
                      </p>
                    </div>
                    <div className="text-right text-[11px] text-slate-400">
                      <p>{snapshot.prompt}</p>
                      <p>{busy ? "processing..." : "ready"}</p>
                    </div>
                  </div>

                  <div
                    className="max-h-[34rem] space-y-3 overflow-y-auto pr-1 text-[13px] leading-relaxed"
                    role="log"
                    aria-live="polite"
                    aria-relevant="additions text"
                  >
                    {transcript.map((entry) => (
                      <p key={entry.id} className={kindStyles(entry.kind)}>
                        {formatLine(entry)}
                      </p>
                    ))}
                    <div ref={transcriptEndRef} />
                  </div>

                  {snapshot.pagerPending && (
                    <div className="mt-3 rounded-xl border border-amber-300/70 bg-amber-100 px-3 py-2 text-xs text-amber-900">
                      <div className="flex items-center justify-between gap-3">
                        <span>
                          Pager active: page {snapshot.pagerPage} of {snapshot.pagerTotal}.
                          Use `space`, `j`, `b`, `k`, `g`, `G`, `q`, or `/term`.
                        </span>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => submit("space")}
                            disabled={staticPreview}
                            className="rounded-full border border-amber-400/70 bg-white px-2.5 py-1 font-medium text-amber-900 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            next
                          </button>
                          <button
                            type="button"
                            onClick={() => submit("q")}
                            disabled={staticPreview}
                            className="rounded-full border border-amber-400/70 bg-white px-2.5 py-1 font-medium text-amber-900 hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            dismiss
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {messageEntries.length > 0 && (
                    <div className="mt-4 rounded-2xl border border-slate-300 bg-[#f6f4ee] p-4 text-slate-900">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          {snapshot.currentRoom.id === "mail" ? (
                            <Glyph name="mail" className="text-sky-700" />
                          ) : (
                            <Glyph name="message" className="text-sky-700" />
                          )}
                          <h2 className="text-sm font-semibold capitalize">
                            {messageVerb}
                          </h2>
                        </div>
                        <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500">
                          {messageEntries.length} items
                        </span>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {messageEntries.map((message, index) => (
                          <button
                            key={message.id}
                            type="button"
                            onClick={() => submit(`read ${index + 1}`)}
                            disabled={staticPreview}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left transition-colors hover:border-sky-200 hover:bg-sky-50/70 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-sm font-medium text-slate-900">
                                {message.subject}
                              </p>
                              <span className="text-[11px] uppercase tracking-[0.14em] text-slate-500">
                                {formatMessageStamp(message.createdAt)}
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-slate-600">
                              {message.author}
                            </p>
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            submit(
                              snapshot.currentRoom.id === "mail"
                                ? "inbox"
                                : "board",
                            )
                          }
                          disabled={staticPreview}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600 transition-colors hover:border-sky-200 hover:bg-sky-50/70 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          refresh
                        </button>
                        {snapshot.currentRoom.id === "mail" ? (
                          <>
                            <button
                              type="button"
                              onClick={() => submit("send sysop update: checking in")}
                              disabled={staticPreview}
                              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600 transition-colors hover:border-sky-200 hover:bg-sky-50/70 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              quick send
                            </button>
                            <button
                              type="button"
                              onClick={() => submit("read 1")}
                              disabled={staticPreview || messageEntries.length === 0}
                              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600 transition-colors hover:border-sky-200 hover:bg-sky-50/70 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              open first
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => submit("post note: calm reply")}
                              disabled={staticPreview}
                              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600 transition-colors hover:border-sky-200 hover:bg-sky-50/70 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              quick post
                            </button>
                            <button
                              type="button"
                              onClick={() => submit("reply 1: acknowledged")}
                              disabled={staticPreview || messageEntries.length === 0}
                              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600 transition-colors hover:border-sky-200 hover:bg-sky-50/70 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              quick reply
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  <form
                    className="mt-4 border-t border-white/10 pt-4"
                    method="post"
                    action="/api/play/command"
                    onSubmit={(event) => {
                      if (staticPreview) {
                        event.preventDefault();
                        return;
                      }
                      event.preventDefault();
                      submit(command);
                    }}
                  >
                    <input type="hidden" name="sessionId" value={snapshot.sessionId} />
                    <label className="sr-only" htmlFor="play-command">
                      Command
                    </label>
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/70 px-3 py-2">
                      <span className="font-mono text-emerald-300">{snapshot.prompt}</span>
                      <input
                        id="play-command"
                        ref={inputRef}
                        name="command"
                        value={command}
                        onChange={(event) => setCommand(event.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={staticPreview}
                        autoComplete="off"
                        autoCapitalize="off"
                        autoCorrect="off"
                        spellCheck={false}
                        placeholder={
                          snapshot.prompt === "*"
                            ? "d 2000"
                            : snapshot.prompt === ">"
                            ? "run hello.bas"
                            : snapshot.authenticated
                              ? "help"
                              : "login Boden"
                        }
                        className="flex-1 bg-transparent font-mono text-[13px] text-slate-100 placeholder:text-slate-500 focus:outline-none disabled:cursor-not-allowed"
                      />
                      <button
                        type="submit"
                        disabled={busy || staticPreview}
                        className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-slate-600"
                        >
                        <Glyph name="timer" />
                        Run
                      </button>
                    </div>
                  </form>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-2xl border border-white/25 bg-white/70 p-4 text-slate-900 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <Glyph name="directory" className="text-sky-700" />
                      <h2 className="text-sm font-semibold">Directory</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {roomButtons.map((room) => {
                        const active = room.id === snapshot.currentRoom.id;
                        return (
                          <button
                            key={room.id}
                            type="button"
                            onClick={() => useRoom(room.id)}
                            disabled={staticPreview}
                            className={cn(
                              "rounded-xl border px-3 py-3 text-left text-sm transition-colors",
                              active
                                ? "border-sky-400 bg-sky-50 shadow-[inset_0_0_0_1px_rgba(59,130,246,0.2)]"
                                : "border-slate-200 bg-white hover:border-sky-200 hover:bg-sky-50/70",
                              staticPreview && "cursor-not-allowed opacity-70",
                            )}
                          >
                            <p className="font-medium text-slate-900">
                              {room.title}
                            </p>
                            <p className="mt-1 text-[11px] text-slate-600">
                              {room.subtitle}
                            </p>
                            <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                              {room.protocols.join(" / ")}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/25 bg-white/70 p-4 text-slate-900 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <Glyph name="shield" className="text-emerald-700" />
                      <h2 className="text-sm font-semibold">Hosts</h2>
                    </div>
                    <div className="space-y-2">
                      {snapshot.hosts.map((host) => (
                        <div
                          key={host.id}
                          className="rounded-xl border border-slate-200 bg-white px-3 py-2"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-slate-900">
                                {host.title}
                              </p>
                              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">
                                {host.role}
                              </p>
                            </div>
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.16em]",
                                host.state === "secured"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : host.state === "logged"
                                    ? "bg-sky-100 text-sky-700"
                                    : host.state === "rooted"
                                      ? "bg-lime-100 text-lime-700"
                                    : host.state === "braced"
                                      ? "bg-indigo-100 text-indigo-700"
                                  : "bg-amber-100 text-amber-700",
                              )}
                            >
                              {host.state}
                            </span>
                          </div>
                          <p className="mt-2 text-xs text-slate-600">
                            {host.detail}
                          </p>
                          <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                            {host.protocols.join(" / ")}
                            {host.aliases.length > 0
                              ? ` • ${host.aliases.join(", ")}`
                              : ""}
                          </p>
                          {host.hardeningState && (
                            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className="h-full bg-emerald-500"
                                style={{
                                  width: `${Math.min(4, host.hardeningScore ?? 0) * 25}%`,
                                }}
                              />
                            </div>
                          )}
                          {host.hardeningState && host.hardeningState !== "none" && (
                            <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                              {host.hardeningState} {host.hardeningScore ?? 0}/4
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/25 bg-[#f5f7fa]/80 p-4 text-slate-900 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <Glyph name="files" className="text-slate-700" />
                      <h2 className="text-sm font-semibold">Files</h2>
                    </div>
                    <div className="space-y-2">
                      {snapshot.files.length === 0 ? (
                        <p className="text-xs text-slate-700">
                          No visible files.
                        </p>
                      ) : (
                        snapshot.files.map((file) => (
                          <button
                            key={file.name}
                            type="button"
                            onClick={() =>
                              submit(`cat ${snapshot.currentRoom.id}/${file.name}`)
                            }
                            disabled={staticPreview}
                            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left text-sm transition-colors hover:border-sky-200 hover:bg-sky-50/70 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            <p className="font-medium text-slate-900">
                              {file.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-600">
                              {file.summary}
                            </p>
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/25 bg-[#f5f7fa]/80 p-4 text-slate-900 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <Glyph name="files" className="text-slate-700" />
                      <h2 className="text-sm font-semibold">Ledger</h2>
                    </div>
                    <div className="space-y-2 text-xs text-slate-700">
                      <p>
                        Auth:{" "}
                        <span className="font-semibold">
                          {snapshot.authenticated
                            ? `yes (${snapshot.username ?? "guest"})`
                            : "no"}
                        </span>
                      </p>
                      <p>
                        STTY:{" "}
                        <span className="font-semibold">
                          {snapshot.sttyMode}
                        </span>
                      </p>
                      <p>
                        Pager:{" "}
                        <span className="font-semibold">
                          {snapshot.pagerEnabled
                            ? snapshot.pagerPending
                              ? `on (${snapshot.pagerPage}/${snapshot.pagerTotal})`
                              : "on"
                            : "off"}
                        </span>
                      </p>
                      <p>
                        Solved:{" "}
                        <span className="font-semibold">
                          {snapshot.solved ? "yes" : "no"}
                        </span>
                      </p>
                      <p>
                        Clues:{" "}
                        <span className="font-semibold">
                          {snapshot.inventory.length > 0
                            ? snapshot.inventory.join(", ")
                            : "none yet"}
                        </span>
                      </p>
                      <p>
                        Invalid attempts:{" "}
                        <span className="font-semibold">
                          {snapshot.invalidAttempts}
                        </span>
                      </p>
                      <p>
                        Routes:{" "}
                        <span className="font-semibold">
                          {snapshot.routes.length}
                        </span>
                      </p>
                      <p>
                        Pressure:{" "}
                        <span className="font-semibold">
                          {snapshot.pressure.length}
                        </span>
                      </p>
                      <p>
                        Notebook:{" "}
                        <span className="font-semibold">
                          {snapshot.notebook.length}
                        </span>
                      </p>
                      <p>
                        Operations:{" "}
                        <span className="font-semibold">
                          {snapshot.operations.filter((operation) => operation.status === "running").length}
                        </span>
                      </p>
                      <p>
                        Copies:{" "}
                        <span className="font-semibold">
                          {snapshot.replicas.length}
                        </span>
                      </p>
                      <p>
                        Briefs:{" "}
                        <span className="font-semibold">
                          {snapshot.briefs.filter((brief) => brief.status === "complete").length}
                          /{snapshot.briefs.length}
                        </span>
                      </p>
                      <p>
                        Watch:{" "}
                        <span className="font-semibold">
                          {snapshot.daemons.reduce((total, daemon) => total + daemon.load, 0)}
                        </span>
                      </p>
                      <p>
                        Incidents:{" "}
                        <span className="font-semibold">
                          {snapshot.incidents.filter((incident) => incident.status !== "restored").length}
                        </span>
                      </p>
                      <p>
                        Waypoints:{" "}
                        <span className="font-semibold">
                          {snapshot.waypoints.length}
                        </span>
                      </p>
                      <p>
                        Mesh:{" "}
                        <span className="font-semibold">
                          {snapshot.mesh.tier} {snapshot.mesh.score}/100
                          {snapshot.mesh.stabilized ? " stable" : ""}
                        </span>
                      </p>
                      <p>
                        Accord:{" "}
                        <span className="font-semibold">
                          {snapshot.accord.tier} {snapshot.accord.score}/100
                          {snapshot.accord.completed ? " closed" : ""}
                        </span>
                      </p>
                      <p>
                        Roster:{" "}
                        <span className="font-semibold">
                          {snapshot.presence.filter((entry) => entry.state === "helping").length}
                          /{snapshot.presence.length}
                        </span>
                      </p>
                      <p>
                        Folds:{" "}
                        <span className="font-semibold">
                          {snapshot.anomalies.filter((entry) => entry.state !== "stabilized").length}
                          /{snapshot.anomalies.length}
                        </span>
                      </p>
                      <p>
                        Anchors:{" "}
                        <span className="font-semibold">
                          {snapshot.anchors.length}
                        </span>
                      </p>
                      <p>
                        Circuits:{" "}
                        <span className="font-semibold">
                          {snapshot.circuits.filter((entry) => entry.state === "stable").length}
                          /{snapshot.circuits.length}
                        </span>
                      </p>
                      <p>
                        Links:{" "}
                        <span className="font-semibold">
                          {snapshot.trustLinks.filter((link) => link.state === "trusted").length}
                          /{snapshot.trustLinks.length}
                        </span>
                      </p>
                      <p>
                        Services:{" "}
                        <span className="font-semibold">
                          {snapshot.services.filter((service) => service.state === "online").length}
                          /{snapshot.services.length}
                        </span>
                      </p>
                      <p>
                        Runbooks:{" "}
                        <span className="font-semibold">
                          {snapshot.runbooks.filter((runbook) => runbook.state === "ready").length}
                          /{snapshot.runbooks.length}
                        </span>
                      </p>
                      <p>
                        Sectors:{" "}
                        <span className="font-semibold">
                          {snapshot.sectors.filter((sector) => sector.state === "claimed").length}
                          /{snapshot.sectors.length}
                        </span>
                      </p>
                      <p>
                        Commands run:{" "}
                        <span className="font-semibold">
                          {snapshot.commandCount}
                        </span>
                      </p>
                      <p>
                        Badges:{" "}
                        <span className="font-semibold">
                          {snapshot.badges.length > 0
                            ? snapshot.badges.join(", ")
                            : "none yet"}
                        </span>
                      </p>
                      {snapshot.routes.length > 0 && (
                        <div className="rounded-xl border border-slate-200 bg-white/70 p-2">
                          <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">
                            Route cache
                          </p>
                          <div className="space-y-1">
                            {snapshot.routes.slice(0, 4).map((route) => (
                              <button
                                key={route.target}
                                type="button"
                                onClick={() => submit(`trace ${route.target}`)}
                                disabled={staticPreview}
                                className="block w-full rounded-lg px-2 py-1 text-left text-[11px] text-slate-700 transition-colors hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                <span className="font-semibold">{route.title}</span>
                                <span className="text-slate-500">
                                  {" "}
                                  {route.hops.map((hop) => hop.toUpperCase()).join(" > ")}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="rounded-xl border border-sky-200 bg-sky-50/80 p-2">
                        <button
                          type="button"
                          onClick={() => submit("mesh")}
                          disabled={staticPreview}
                          className="mb-1 block w-full rounded-lg px-2 py-1 text-left text-[10px] uppercase tracking-[0.16em] text-sky-700 transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          Mesh {snapshot.mesh.tier} {snapshot.mesh.score}/100
                        </button>
                        <div className="space-y-1 text-[11px] text-sky-950">
                          {snapshot.mesh.signals.slice(0, 3).map((signal) => (
                            <p key={signal}>{signal}</p>
                          ))}
                          <p className={snapshot.mesh.blockers.length > 0 ? "text-amber-700" : "text-emerald-700"}>
                            {snapshot.mesh.blockers.length > 0
                              ? `${snapshot.mesh.blockers.length} blockers`
                              : snapshot.mesh.stabilized
                                ? "stable"
                                : "ready to stabilize"}
                          </p>
                        </div>
                      </div>
                      <div className="rounded-xl border border-zinc-300 bg-zinc-50/90 p-2">
                        <button
                          type="button"
                          onClick={() => submit("accord")}
                          disabled={staticPreview}
                          className="mb-1 block w-full rounded-lg px-2 py-1 text-left text-[10px] uppercase tracking-[0.16em] text-zinc-700 transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          Accord {snapshot.accord.tier} {snapshot.accord.score}/100
                        </button>
                        <div className="space-y-1 text-[11px] text-zinc-950">
                          {snapshot.accord.checks.slice(0, 3).map((check) => (
                            <p key={check.id} className={check.passed ? "text-emerald-700" : "text-amber-700"}>
                              {check.passed ? "ok" : "wait"} {check.label}
                            </p>
                          ))}
                          <p className={snapshot.accord.completed ? "text-emerald-700" : snapshot.accord.ready ? "text-sky-700" : "text-zinc-600"}>
                            {snapshot.accord.completed
                              ? "closed"
                              : snapshot.accord.ready
                                ? "ready"
                                : snapshot.accord.summary}
                          </p>
                        </div>
                      </div>
                      {snapshot.trustLinks.length > 0 && (
                        <div className="rounded-xl border border-violet-200 bg-violet-50/80 p-2">
                          <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-violet-700">
                            Links
                          </p>
                          <div className="space-y-1">
                            {snapshot.trustLinks.slice(0, 4).map((link) => (
                              <button
                                key={link.id}
                                type="button"
                                onClick={() => submit("links")}
                                disabled={staticPreview}
                                className="block w-full rounded-lg px-2 py-1 text-left text-[11px] text-violet-950 transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                <span className="font-semibold">
                                  {link.titles[0]}
                                  {" <-> "}
                                  {link.titles[1]}
                                </span>
                                <span className="text-violet-700">
                                  {" "}
                                  {link.integrity}% {link.state}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {snapshot.presence.length > 0 && (
                        <div className="rounded-xl border border-fuchsia-200 bg-fuchsia-50/80 p-2">
                          <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-fuchsia-700">
                            Roster
                          </p>
                          <div className="space-y-1">
                            {snapshot.presence.slice(0, 4).map((entry) => (
                              <button
                                key={entry.id}
                                type="button"
                                onClick={() => submit(`buddy ${entry.handle}`)}
                                disabled={staticPreview}
                                className="block w-full rounded-lg px-2 py-1 text-left text-[11px] text-fuchsia-950 transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                <span className="font-semibold">
                                  {entry.handle}
                                </span>
                                <span className="text-fuchsia-700">
                                  {" "}
                                  {entry.state} {entry.affinity}%
                                  {entry.taskTitle ? ` ${entry.taskTitle}` : ""}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {snapshot.anomalies.length > 0 && (
                        <div className="rounded-xl border border-amber-300 bg-amber-50/90 p-2">
                          <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-amber-700">
                            Folds
                          </p>
                          <div className="space-y-1">
                            {snapshot.anomalies.slice(0, 4).map((entry) => (
                              <button
                                key={entry.id}
                                type="button"
                                onClick={() => submit(`fold ${entry.id}`)}
                                disabled={staticPreview}
                                className="block w-full rounded-lg px-2 py-1 text-left text-[11px] text-amber-950 transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                <span className="font-semibold">
                                  {entry.title}
                                </span>
                                <span className="text-amber-700">
                                  {" "}
                                  {entry.state} {entry.intensity}/9
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {snapshot.anchors.length > 0 && (
                        <div className="rounded-xl border border-slate-300 bg-slate-50/90 p-2">
                          <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-slate-700">
                            Anchors
                          </p>
                          <div className="space-y-1">
                            {snapshot.anchors.slice(0, 4).map((entry) => (
                              <button
                                key={entry.id}
                                type="button"
                                onClick={() => submit(`anchor ${entry.sectorId}`)}
                                disabled={staticPreview}
                                className="block w-full rounded-lg px-2 py-1 text-left text-[11px] text-slate-950 transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                <span className="font-semibold">
                                  {entry.sectorTitle}
                                </span>
                                <span className="text-slate-700">
                                  {" "}
                                  {entry.state} {entry.capacity}%/{entry.heartbeat}%
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {snapshot.circuits.length > 0 && (
                        <div className="rounded-xl border border-cyan-300 bg-cyan-50/90 p-2">
                          <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-cyan-700">
                            Circuits
                          </p>
                          <div className="space-y-1">
                            {snapshot.circuits.slice(0, 4).map((entry) => (
                              <button
                                key={entry.id}
                                type="button"
                                onClick={() => submit(`circuit ${entry.label}`)}
                                disabled={staticPreview}
                                className="block w-full rounded-lg px-2 py-1 text-left text-[11px] text-cyan-950 transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                <span className="font-semibold">
                                  {entry.label}
                                </span>
                                <span className="text-cyan-700">
                                  {" "}
                                  {entry.state} {entry.quality}%
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {snapshot.services.length > 0 && (
                        <div className="rounded-xl border border-orange-200 bg-orange-50/80 p-2">
                          <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-orange-700">
                            Services
                          </p>
                          <div className="space-y-1">
                            {snapshot.services.slice(0, 4).map((service) => (
                              <button
                                key={service.id}
                                type="button"
                                onClick={() => submit(`service ${service.room}`)}
                                disabled={staticPreview}
                                className="block w-full rounded-lg px-2 py-1 text-left text-[11px] text-orange-950 transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                <span className="font-semibold">
                                  {service.title}
                                </span>
                                <span className="text-orange-700">
                                  {" "}
                                  {service.health}% {service.state}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {snapshot.runbooks.length > 0 && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-2">
                          <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-emerald-700">
                            Runbooks
                          </p>
                          <div className="space-y-1">
                            {snapshot.runbooks.slice(0, 4).map((runbook) => (
                              <button
                                key={runbook.id}
                                type="button"
                                onClick={() => submit(`runbook ${runbook.room}`)}
                                disabled={staticPreview}
                                className="block w-full rounded-lg px-2 py-1 text-left text-[11px] text-emerald-950 transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                <span className="font-semibold">
                                  {runbook.title}
                                </span>
                                <span className="text-emerald-700">
                                  {" "}
                                  {runbook.state} runs {runbook.runs}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {snapshot.sectors.length > 0 && (
                        <div className="rounded-xl border border-stone-300 bg-stone-50/90 p-2">
                          <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-stone-700">
                            Sectors
                          </p>
                          <div className="space-y-1">
                            {snapshot.sectors.slice(0, 4).map((sector) => (
                              <button
                                key={sector.id}
                                type="button"
                                onClick={() => submit(`sector ${sector.id}`)}
                                disabled={staticPreview}
                                className="block w-full rounded-lg px-2 py-1 text-left text-[11px] text-stone-950 transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                <span className="font-semibold">
                                  {sector.title}
                                </span>
                                <span className="text-stone-700">
                                  {" "}
                                  {sector.state} {sector.sealed}/{sector.requiredSealed}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {snapshot.pressure.length > 0 && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-2">
                          <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-amber-700">
                            Line pressure
                          </p>
                          <div className="space-y-1">
                            {snapshot.pressure.slice(0, 4).map((entry) => (
                              <button
                                key={entry.room}
                                type="button"
                                onClick={() => submit(`trace ${entry.room}`)}
                                disabled={staticPreview}
                                className="block w-full rounded-lg px-2 py-1 text-left text-[11px] text-amber-950 transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                <span className="font-semibold">{entry.title}</span>
                                <span className="text-amber-700">
                                  {" "}
                                  {entry.state} {entry.level}/5
                                  {entry.graceCommands > 0
                                    ? `, grace ${entry.graceCommands}`
                                    : ""}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {snapshot.notebook.length > 0 && (
                        <div className="rounded-xl border border-cyan-200 bg-cyan-50/80 p-2">
                          <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-cyan-700">
                            Notebook
                          </p>
                          <div className="space-y-1">
                            {snapshot.notebook.slice(0, 4).map((entry) => (
                              <button
                                key={entry.id}
                                type="button"
                                onClick={() => submit(`notebook ${entry.id}`)}
                                disabled={staticPreview}
                                className="block w-full rounded-lg px-2 py-1 text-left text-[11px] text-cyan-950 transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                <span className="font-semibold">
                                  {entry.pinned ? "* " : ""}
                                  {entry.title}
                                </span>
                                <span className="text-cyan-700">
                                  {" "}
                                  {entry.decoded ? "decoded" : entry.cipher}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {snapshot.operations.length > 0 && (
                        <div className="rounded-xl border border-lime-200 bg-lime-50/80 p-2">
                          <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-lime-700">
                            Operations
                          </p>
                          <div className="space-y-1">
                            {snapshot.operations.slice(0, 4).map((operation) => (
                              <button
                                key={operation.id}
                                type="button"
                                onClick={() => submit("jobs")}
                                disabled={staticPreview}
                                className="block w-full rounded-lg px-2 py-1 text-left text-[11px] text-lime-950 transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                <span className="font-semibold">
                                  {operation.action} {operation.target.toUpperCase()}
                                </span>
                                <span className="text-lime-700">
                                  {" "}
                                  {operation.status === "running"
                                    ? `${operation.remainingCommands} ticks`
                                    : operation.status}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {snapshot.replicas.length > 0 && (
                        <div className="rounded-xl border border-indigo-200 bg-indigo-50/80 p-2">
                          <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-indigo-700">
                            Copies
                          </p>
                          <div className="space-y-1">
                            {snapshot.replicas.slice(0, 4).map((replica) => (
                              <button
                                key={replica.room}
                                type="button"
                                onClick={() => submit("replicas")}
                                disabled={staticPreview}
                                className="block w-full rounded-lg px-2 py-1 text-left text-[11px] text-indigo-950 transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                <span className="font-semibold">
                                  {replica.title}
                                </span>
                                <span className="text-indigo-700">
                                  {" "}
                                  L{replica.level} {replica.integrity}% {replica.state}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {snapshot.briefs.length > 0 && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-2">
                          <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-rose-700">
                            Briefs
                          </p>
                          <div className="space-y-1">
                            {snapshot.briefs.slice(0, 4).map((brief) => (
                              <button
                                key={brief.id}
                                type="button"
                                onClick={() => submit(`brief ${brief.id}`)}
                                disabled={staticPreview}
                                className="block w-full rounded-lg px-2 py-1 text-left text-[11px] text-rose-950 transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                <span className="font-semibold">
                                  {brief.title}
                                </span>
                                <span className="text-rose-700">
                                  {" "}
                                  {brief.ready && brief.status !== "complete"
                                    ? "ready"
                                    : brief.status}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {snapshot.daemons.length > 0 && (
                        <div className="rounded-xl border border-teal-200 bg-teal-50/80 p-2">
                          <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-teal-700">
                            Watch
                          </p>
                          <div className="space-y-1">
                            {snapshot.daemons.slice(0, 4).map((daemon) => (
                              <button
                                key={daemon.room}
                                type="button"
                                onClick={() => submit("watch")}
                                disabled={staticPreview}
                                className="block w-full rounded-lg px-2 py-1 text-left text-[11px] text-teal-950 transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                <span className="font-semibold">
                                  {daemon.title}
                                </span>
                                <span className="text-teal-700">
                                  {" "}
                                  {daemon.state} {daemon.load}/6
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {snapshot.incidents.length > 0 && (
                        <div className="rounded-xl border border-red-200 bg-red-50/80 p-2">
                          <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-red-700">
                            Incidents
                          </p>
                          <div className="space-y-1">
                            {snapshot.incidents.slice(0, 4).map((incident) => (
                              <button
                                key={incident.id}
                                type="button"
                                onClick={() => submit(`incident ${incident.room}`)}
                                disabled={staticPreview}
                                className="block w-full rounded-lg px-2 py-1 text-left text-[11px] text-red-950 transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                <span className="font-semibold">
                                  {incident.title}
                                </span>
                                <span className="text-red-700">
                                  {" "}
                                  {incident.severity} {incident.status}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      {snapshot.waypoints.length > 0 && (
                        <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-2">
                          <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-blue-700">
                            Waypoints
                          </p>
                          <div className="space-y-1">
                            {snapshot.waypoints.slice(0, 4).map((waypoint) => (
                              <button
                                key={waypoint.room}
                                type="button"
                                onClick={() => submit(`jump ${waypoint.room}`)}
                                disabled={staticPreview}
                                className="block w-full rounded-lg px-2 py-1 text-left text-[11px] text-blue-950 transition-colors hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-70"
                              >
                                <span className="font-semibold">
                                  {waypoint.title}
                                </span>
                                <span className="text-blue-700">
                                  {" "}
                                  {waypoint.state === "ready"
                                    ? "ready"
                                    : waypoint.reason}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <aside className="grid gap-4">
              <section className="rounded-2xl border border-white/25 bg-white/70 p-4 text-slate-900 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <Glyph name="spark" className="text-amber-600" />
                  <h2 className="text-sm font-semibold">Read This Room</h2>
                </div>
                <p className="text-sm leading-relaxed text-slate-700">
                  {snapshot.currentRoom.summary}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {snapshot.currentRoom.note}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {snapshot.currentRoom.commands.map((cmd) => (
                    <span
                      key={cmd}
                      className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600"
                    >
                      {cmd}
                    </span>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-white/25 bg-white/70 p-4 text-slate-900 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <Glyph name="timer" className="text-cyan-700" />
                  <h2 className="text-sm font-semibold">History Cache</h2>
                </div>
                <div className="space-y-3">
                  {snapshot.history.map((card) => (
                    <article
                      key={`${card.year}-${card.title}`}
                      className="rounded-xl border border-slate-200 bg-white p-3"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        {card.year}
                      </p>
                      <h3 className="mt-1 text-sm font-medium text-slate-900">
                        {card.title}
                      </h3>
                      <p className="mt-2 text-xs leading-relaxed text-slate-600">
                        {card.body}
                      </p>
                    </article>
                  ))}
                </div>
              </section>

              <section className="rounded-2xl border border-white/25 bg-[#10141c]/90 p-4 text-slate-100 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <Glyph name="monitor" className="text-sky-300" />
                  <h2 className="text-sm font-semibold">Tips</h2>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  {snapshot.tips.map((tip) => (
                    <li key={tip} className="flex gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </aside>
          </div>
        </main>

        <footer className="fixed inset-x-0 bottom-0 z-20 border-t border-white/20 bg-gradient-to-r from-[#1a4a93] via-[#235db2] to-[#1a4a93] px-4 py-2 shadow-[0_-10px_30px_rgba(15,23,42,0.18)]">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => inputRef.current?.focus()}
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/20 px-4 py-2 text-sm font-semibold text-white shadow-inner"
                >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-xs font-black text-emerald-950">
                S
              </span>
              Start
            </button>
            <div className="flex items-center gap-3 text-xs text-white/85">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                <Glyph name="shield" className="h-3.5 w-3.5" />
                backend authoritative
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5">
                <Glyph name="timer" className="h-3.5 w-3.5" />
                no onboarding
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
