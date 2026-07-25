#!/usr/bin/env python3
"""Generate a self-contained browser UI for human ITT ranking sessions."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

from common import DEFAULT_DATA_ROOT, ensure_dirs

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>ITT ranking — {title}</title>
  <style>
    :root {{
      color-scheme: dark;
      --bg: #0f1419;
      --panel: #1a2332;
      --border: #2d3a4d;
      --text: #e7ecf3;
      --muted: #8b9bb4;
      --accent: #5b9fd4;
      --good: #3d9a6a;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font: 15px/1.5 system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
    }}
    header {{
      position: sticky;
      top: 0;
      z-index: 2;
      background: rgba(15, 20, 25, 0.95);
      border-bottom: 1px solid var(--border);
      padding: 12px 16px;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    }}
    header h1 {{ font-size: 1rem; margin: 0; font-weight: 600; }}
    .progress {{ color: var(--muted); }}
    main {{ max-width: 960px; margin: 0 auto; padding: 16px; }}
    .probe-meta {{
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }}
    .tag {{
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 999px;
      padding: 2px 10px;
      font-size: 12px;
      color: var(--muted);
    }}
    .stimulus {{
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 14px;
      white-space: pre-wrap;
      margin-bottom: 16px;
    }}
    .hint {{ color: var(--muted); margin-bottom: 12px; }}
    ol.candidates {{
      list-style: none;
      margin: 0;
      padding: 0;
      display: grid;
      gap: 10px;
    }}
    li.candidate {{
      background: var(--panel);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 10px 12px;
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 10px;
      align-items: start;
      cursor: grab;
    }}
    li.candidate.dragging {{ opacity: 0.5; }}
    li.candidate.done {{ border-color: var(--good); }}
    .rank {{
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--accent);
      color: #fff;
      display: grid;
      place-items: center;
      font-weight: 700;
      font-size: 13px;
    }}
    .cid {{ color: var(--muted); font-size: 12px; margin-bottom: 4px; }}
    .text {{ white-space: pre-wrap; word-break: break-word; }}
    .controls {{ display: flex; flex-direction: column; gap: 4px; }}
    button {{
      background: var(--panel);
      border: 1px solid var(--border);
      color: var(--text);
      border-radius: 8px;
      padding: 8px 12px;
      cursor: pointer;
    }}
    button.primary {{ background: var(--accent); border-color: var(--accent); color: #fff; }}
    button:disabled {{ opacity: 0.45; cursor: not-allowed; }}
    footer {{
      margin-top: 24px;
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }}
  </style>
</head>
<body>
  <header>
    <h1>ITT ranking — {title}</h1>
    <span class="progress" id="progress">0 / {probe_count}</span>
    <button type="button" id="exportBtn" class="primary" disabled>Download session JSONL</button>
    <button type="button" id="importBtn">Import partial JSONL</button>
    <input type="file" id="importFile" accept=".jsonl,application/jsonl" hidden />
  </header>
  <main>
    <div class="probe-meta">
      <span class="tag" id="probeId"></span>
      <span class="tag" id="stimulusType"></span>
      <span class="tag" id="channel"></span>
    </div>
    <p class="hint">Drag candidates or use arrows. Top = most like Boden. Rank all before Next.</p>
    <div class="stimulus" id="stimulus"></div>
    <ol class="candidates" id="candidateList"></ol>
    <footer>
      <button type="button" id="prevBtn">Previous</button>
      <button type="button" id="nextBtn" class="primary">Next probe</button>
      <button type="button" id="saveBtn">Save ranking</button>
    </footer>
  </main>
  <script>
    const PACK = {pack_json};
    const STORAGE_KEY = "itt_review_{storage_key}";

    let index = 0;
    const rankings = {{}};

    function loadStored() {{
      try {{
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        Object.assign(rankings, data.rankings || {{}});
        if (Number.isInteger(data.index)) index = data.index;
      }} catch (_) {{}}
    }}

    function persist() {{
      localStorage.setItem(STORAGE_KEY, JSON.stringify({{ index, rankings }}));
      updateProgress();
    }}

    function updateProgress() {{
      const done = Object.keys(rankings).length;
      document.getElementById("progress").textContent =
        `${{done}} / ${{PACK.length}} ranked · probe ${{index + 1}}`;
      document.getElementById("exportBtn").disabled = done === 0;
    }}

    function renderProbe() {{
      const probe = PACK[index];
      document.getElementById("probeId").textContent = probe.probe_id;
      document.getElementById("stimulusType").textContent = probe.stimulus_type || "?";
      document.getElementById("channel").textContent = probe.channel || "?";
      document.getElementById("stimulus").textContent = probe.stimulus || "";

      const list = document.getElementById("candidateList");
      list.innerHTML = "";
      const saved = rankings[probe.probe_id];
      const order = saved
        ? saved.slice()
        : probe.candidates.map((c) => c.candidate_id);

      const byId = Object.fromEntries(probe.candidates.map((c) => [c.candidate_id, c]));
      order.forEach((cid, i) => {{
        const c = byId[cid];
        if (!c) return;
        const li = document.createElement("li");
        li.className = "candidate" + (saved ? " done" : "");
        li.draggable = true;
        li.dataset.cid = cid;
        li.innerHTML = `
          <div class="rank">${{i + 1}}</div>
          <div>
            <div class="cid">${{cid}}</div>
            <div class="text"></div>
          </div>
          <div class="controls">
            <button type="button" data-move="-1" aria-label="Move up">↑</button>
            <button type="button" data-move="1" aria-label="Move down">↓</button>
          </div>`;
        li.querySelector(".text").textContent = c.text || "";
        list.appendChild(li);
      }});

      document.getElementById("prevBtn").disabled = index === 0;
      document.getElementById("nextBtn").textContent =
        index === PACK.length - 1 ? "Finish" : "Next probe";
      updateProgress();
    }}

    function currentOrder() {{
      return [...document.querySelectorAll("#candidateList .candidate")].map(
        (el) => el.dataset.cid
      );
    }}

    function saveCurrent() {{
      const probe = PACK[index];
      const order = currentOrder();
      const ids = new Set(probe.candidates.map((c) => c.candidate_id));
      if (order.length !== ids.size || new Set(order).size !== ids.size) return false;
      rankings[probe.probe_id] = order;
      persist();
      document.querySelectorAll("#candidateList .candidate").forEach((el) => {{
        el.classList.add("done");
      }});
      return true;
    }}

    function moveCandidate(li, delta) {{
      const list = li.parentElement;
      const items = [...list.children];
      const pos = items.indexOf(li);
      const next = pos + delta;
      if (next < 0 || next >= items.length) return;
      if (delta < 0) list.insertBefore(li, items[next]);
      else list.insertBefore(items[next], li);
      renumber();
    }}

    function renumber() {{
      document.querySelectorAll("#candidateList .candidate").forEach((el, i) => {{
        el.querySelector(".rank").textContent = String(i + 1);
      }});
    }}

    document.getElementById("candidateList").addEventListener("click", (ev) => {{
      const btn = ev.target.closest("button[data-move]");
      if (!btn) return;
      const li = btn.closest(".candidate");
      moveCandidate(li, Number(btn.dataset.move));
    }});

    let dragEl = null;
    document.getElementById("candidateList").addEventListener("dragstart", (ev) => {{
      dragEl = ev.target.closest(".candidate");
      if (!dragEl) return;
      dragEl.classList.add("dragging");
    }});
    document.getElementById("candidateList").addEventListener("dragend", () => {{
      if (dragEl) dragEl.classList.remove("dragging");
      dragEl = null;
      renumber();
    }});
    document.getElementById("candidateList").addEventListener("dragover", (ev) => {{
      ev.preventDefault();
      const target = ev.target.closest(".candidate");
      if (!target || !dragEl || target === dragEl) return;
      const rect = target.getBoundingClientRect();
      const after = ev.clientY > rect.top + rect.height / 2;
      target.parentElement.insertBefore(dragEl, after ? target.nextSibling : target);
    }});

    document.getElementById("saveBtn").addEventListener("click", () => {{
      if (saveCurrent()) alert("Ranking saved for " + PACK[index].probe_id);
    }});

    document.getElementById("nextBtn").addEventListener("click", () => {{
      if (!saveCurrent()) {{
        alert("Rank every candidate before continuing.");
        return;
      }}
      if (index < PACK.length - 1) {{
        index += 1;
        persist();
        renderProbe();
      }} else {{
        exportSession();
      }}
    }});

    document.getElementById("prevBtn").addEventListener("click", () => {{
      if (index > 0) {{
        index -= 1;
        persist();
        renderProbe();
      }}
    }});

    function exportSession() {{
      const lines = PACK.filter((p) => rankings[p.probe_id]).map((p) =>
        JSON.stringify({{
          probe_id: p.probe_id,
          case_id: p.case_id,
          stimulus_type: p.stimulus_type,
          ranking: rankings[p.probe_id],
          ranked_at: new Date().toISOString(),
        }})
      );
      if (!lines.length) return;
      const blob = new Blob([lines.join("\\n") + "\\n"], {{ type: "application/jsonl" }});
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "itt_session_" + new Date().toISOString().replace(/[:.]/g, "") + ".jsonl";
      a.click();
      URL.revokeObjectURL(a.href);
    }}

    document.getElementById("exportBtn").addEventListener("click", exportSession);

    document.getElementById("importBtn").addEventListener("click", () => {{
      document.getElementById("importFile").click();
    }});
    document.getElementById("importFile").addEventListener("change", async (ev) => {{
      const file = ev.target.files[0];
      if (!file) return;
      const text = await file.text();
      text.split("\\n").forEach((line) => {{
        if (!line.trim()) return;
        const row = JSON.parse(line);
        if (row.probe_id && row.ranking) rankings[row.probe_id] = row.ranking;
      }});
      persist();
      renderProbe();
      ev.target.value = "";
    }});

    loadStored();
    renderProbe();
  </script>
</body>
</html>
"""


def load_probes(path: Path) -> list[dict[str, Any]]:
    probes: list[dict] = []
    with path.open("r", encoding="utf-8") as fh:
        for line in fh:
            if line.strip():
                p = json.loads(line)
                probes.append({k: v for k, v in p.items() if not k.startswith("_")})
    return probes


def main() -> int:
    parser = argparse.ArgumentParser(description="Build browser ITT ranking review page")
    parser.add_argument(
        "--pack",
        type=Path,
        default=DEFAULT_DATA_ROOT / "eval" / "itt_packs" / "pack_seed42.human.jsonl",
    )
    parser.add_argument("--out", type=Path, default=None)
    parser.add_argument("--data-root", type=Path, default=DEFAULT_DATA_ROOT)
    args = parser.parse_args()

    if not args.pack.is_file():
        print(f"Missing pack: {args.pack}", file=sys.stderr)
        return 1

    probes = load_probes(args.pack)
    if not probes:
        print("Empty pack", file=sys.stderr)
        return 1

    paths = ensure_dirs(args.data_root)
    out_path = args.out or (paths["eval"] / "itt_packs" / f"{args.pack.stem}.review.html")
    out_path.parent.mkdir(parents=True, exist_ok=True)

    title = args.pack.stem.replace("_", " ")
    storage_key = args.pack.stem.replace(".", "_")
    html = HTML_TEMPLATE.format(
        title=title,
        probe_count=len(probes),
        pack_json=json.dumps(probes, ensure_ascii=False),
        storage_key=storage_key,
    )
    out_path.write_text(html, encoding="utf-8")

    print(
        json.dumps(
            {
                "ok": True,
                "probes": len(probes),
                "pack": str(args.pack),
                "review_html": str(out_path),
                "next": f"Open file://{out_path} in a browser, rank probes, download JSONL, then eval_itt_score.py",
            },
            indent=2,
        )
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
