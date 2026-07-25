/**
 * BodenAI desk panel — shown only when BODENAI_ENABLED + NEXT_PUBLIC_BODENAI_UI.
 * Twin consumes private brain voice-lane search (not a helpdesk).
 */
(function () {
  const root = document.getElementById("boden-chat");
  if (!root) return;
  const logEl = root.querySelector("[data-boden-log]");
  const form = root.querySelector("[data-boden-form]");
  const input = root.querySelector("[data-boden-input]");
  const statusEl = root.querySelector("[data-boden-status]");
  if (!logEl || !form || !input || !statusEl) return;

  function setStatus(text, tone) {
    statusEl.textContent = text;
    statusEl.dataset.tone = tone || "quiet";
  }

  function appendBubble(role, text, meta) {
    const row = document.createElement("div");
    row.className = "boden-bubble " + role;
    const who = document.createElement("span");
    who.className = "boden-who";
    who.textContent = role === "user" ? "you" : "boden";
    const body = document.createElement("p");
    body.textContent = text || (role === "boden" ? "…" : "");
    row.appendChild(who);
    row.appendChild(body);
    if (meta) {
      const m = document.createElement("small");
      m.textContent = meta;
      row.appendChild(m);
    }
    logEl.appendChild(row);
    logEl.scrollTop = logEl.scrollHeight;
  }

  async function probe() {
    try {
      const res = await fetch("/api/boden/health", { cache: "no-store" });
      const data = await res.json();
      if (!data.enabled || data.ui === false) {
        root.hidden = true;
        return false;
      }
      root.hidden = false;
      if (data.ok) {
        setStatus("brain-backed · gate on · not a helpdesk", "ok");
        return true;
      }
      setStatus(data.error || "twin offline", "warn");
      return true;
    } catch (_) {
      root.hidden = true;
      return false;
    }
  }

  async function send(text) {
    appendBubble("user", text);
    setStatus("searching brain…", "quiet");
    let reply = "";
    let mode = "";
    try {
      const res = await fetch("/api/boden/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
        body: JSON.stringify({ messages: [{ role: "user", content: text }] }),
      });
      if (!res.ok) {
        const err = await res.json().catch(function () {
          return { error: "chat failed" };
        });
        appendBubble("boden", err.error || "offline", "error");
        setStatus("error", "warn");
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let eventName = "message";
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        buffer += decoder.decode(chunk.value, { stream: true });
        const parts = buffer.split("\n");
        buffer = parts.pop() || "";
        for (let i = 0; i < parts.length; i++) {
          const line = parts[i];
          if (line.startsWith("event:")) {
            eventName = line.slice(6).trim();
            continue;
          }
          if (!line.startsWith("data:")) continue;
          let payload = {};
          try {
            payload = JSON.parse(line.slice(5).trim());
          } catch (_) {
            continue;
          }
          if (eventName === "token" && payload.text) reply += payload.text;
          if (eventName === "done") mode = payload.mode || "";
          if (eventName === "error") {
            appendBubble("boden", payload.message || "error", "error");
            setStatus("error", "warn");
            return;
          }
        }
      }
      if (mode === "silence" && !reply) {
        appendBubble("boden", "", "silence");
      } else {
        appendBubble("boden", reply || "…", mode ? "mode: " + mode : "");
      }
      setStatus("gate · " + (mode || "done"), "ok");
    } catch (_) {
      appendBubble("boden", "can't reach twin", "error");
      setStatus("unreachable", "warn");
    }
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    const text = (input.value || "").trim();
    if (!text) return;
    input.value = "";
    send(text);
  });

  probe();
})();
