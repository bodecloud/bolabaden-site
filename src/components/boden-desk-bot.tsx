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
    <form onSubmit={ask} className="command-desk-bot max-w-xl">
      <div className="command-desk-bot__bar">
        <span />
        <span />
        <span />
        <code>ask-the-desk</code>
      </div>
      <label htmlFor="desk-bot-question">Ask the desk</label>
      <div className="command-desk-bot__input">
        <input
          id="desk-bot-question"
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="What are you looking for?"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="command-desk-secondary disabled:opacity-50"
        >
          {state === "sending" ? "Asking…" : "Ask"}
        </button>
      </div>
      {answer && (
        <div className="command-desk-bot__answer">
          <p>{answer}</p>
        </div>
      )}
      {state === "error" && (
        <p className="mt-4 text-sm text-[var(--desk-red)]">
          The desk guide didn&apos;t respond. Try /projects, /guides, or
          /contact instead.
        </p>
      )}
    </form>
  );
}

export function BodenDeskBot() {
  return (
    <section
      className="border-b border-[rgba(102,217,255,0.14)]"
      id="desk-bot"
    >
      <div className="command-desk-section max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-12">
        <div className="command-desk-section-heading mb-6">
          <p className="command-desk-kicker">{config.HOME_BOT_TITLE}</p>
          <p>{config.HOME_BOT_SUBTITLE}</p>
        </div>
        {config.BODENAI_UI_PUBLIC ? (
          <DeskBotChat />
        ) : (
          <p className="command-desk-artifact max-w-xl">
            {config.HOME_BOT_DISABLED_MESSAGE}
          </p>
        )}
      </div>
    </section>
  );
}
