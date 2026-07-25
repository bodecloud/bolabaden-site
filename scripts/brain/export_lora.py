#!/usr/bin/env python3
"""P5 prep: Export WeClone/LLaMA-Factory SFT JSONL from twin-eligible self turns."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from common import DEFAULT_DATA_ROOT, ensure_dirs, episode_id, scrub_pii

SYSTEM = (
    "You are Boden/Wizard (PuritanWizard). Direct, plain, self-correcting. "
    "Not a helpful assistant. Short replies and bursts are normal."
)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-root", type=Path, default=DEFAULT_DATA_ROOT)
    parser.add_argument("--limit", type=int, default=0)
    args = parser.parse_args()
    paths = ensure_dirs(args.data_root)
    ep_path = paths["episodes_jsonl"]
    if not ep_path.is_file():
        print(f"Missing {ep_path}", file=sys.stderr)
        return 1

    out_path = paths["lora_export"]
    out_path.parent.mkdir(parents=True, exist_ok=True)
    rows = 0
    with ep_path.open("r", encoding="utf-8") as fin, out_path.open(
        "w", encoding="utf-8"
    ) as fout:
        for line in fin:
            if not line.strip():
                continue
            ep = json.loads(line)
            extra = ep.get("extra") or {}
            if not extra.get("twin_eligible"):
                continue
            thread_id = str(ep.get("thread_id") or "")
            h = int(episode_id([thread_id, "holdout"]), 16)
            if (h % 10) == 0:
                continue
            messages = ep.get("messages") or []
            context: list[dict[str, str]] = [{"role": "system", "content": SYSTEM}]
            for msg in messages:
                role = str(msg.get("role") or "")
                text = scrub_pii(str(msg.get("text") or "")).strip()
                if not text:
                    continue
                if role == "self":
                    mapped = "assistant"
                elif role == "peer":
                    mapped = "user"
                elif role == "assistant":
                    mapped = "assistant"
                else:
                    continue
                context.append({"role": mapped, "content": text})
            if sum(1 for m in context if m["role"] == "assistant") == 0:
                continue
            fout.write(json.dumps({"messages": context}, ensure_ascii=False) + "\n")
            rows += 1
            if args.limit and rows >= args.limit:
                break

    meta = {"rows": rows, "output": str(out_path)}
    (paths["lora"] / "export_meta.json").write_text(json.dumps(meta, indent=2))
    print(json.dumps(meta))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
