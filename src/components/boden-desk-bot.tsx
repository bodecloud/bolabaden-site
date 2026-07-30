"use client";

import { useState } from "react";
import { config } from "@/lib/config";

type ChatState = "idle" | "sending" | "error";

function parseSseText(raw: string): string {
  return raw
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim())
    .filter((chunk) => chunk && chunk !== "[DONE]")
    .join("");
}

function DeskBotChat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [state, setState] = useState<ChatState>("idle");

  async function ask(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = question.trim();
    if (!trimmed || state === "sending") return;

    setState("sending");
    setAnswer("");
    try {
      const res = await fetch("/api/boden/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok || !res.body) {
        throw new Error(`desk guide unavailable (${res.status})`);
      }
      const text = await res.text();
      setAnswer(parseSseText(text) || text);
      setState("idle");
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={ask} className="max-w-xl">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="What are you looking for?"
          className="flex-1 rounded-md border border-[#2a2a2a] bg-[#0a0a0a] px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex items-center justify-center rounded-md bg-white text-black font-medium text-sm px-5 py-2.5 hover:bg-zinc-100 transition-colors disabled:opacity-50"
        >
          {state === "sending" ? "Asking…" : "Ask"}
        </button>
      </div>
      {answer && (
        <p className="mt-4 text-sm text-zinc-300 leading-relaxed rounded-lg border border-[#1f1f1f] bg-[#0f0f0f] px-4 py-3">
          {answer}
        </p>
      )}
      {state === "error" && (
        <p className="mt-4 text-sm text-red-400">
          The desk guide didn&apos;t respond. Try /projects, /guides, or
          /contact instead.
        </p>
      )}
    </form>
  );
}

export function BodenDeskBot() {
  return (
    <section className="border-b border-[#1f1f1f]" id="desk-bot">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-[0.2em] mb-2">
          {config.HOME_BOT_TITLE}
        </p>
        <p className="text-sm text-zinc-400 mb-6 max-w-xl">
          {config.HOME_BOT_SUBTITLE}
        </p>
        {config.BODENAI_UI_PUBLIC ? (
          <DeskBotChat />
        ) : (
          <p className="text-sm text-zinc-500 max-w-xl rounded-lg border border-dashed border-[#2a2a2a] bg-[#0a0a0a] px-4 py-3">
            {config.HOME_BOT_DISABLED_MESSAGE}
          </p>
        )}
      </div>
    </section>
  );
}
