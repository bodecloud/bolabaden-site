#!/usr/bin/env python3
"""Interactive ITT ranking session — rank candidate responses per held-out stimulus."""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from common import DEFAULT_DATA_ROOT, ensure_dirs


def load_probes(path: Path) -> list[dict[str, Any]]:
    probes: list[dict] = []
    with path.open("r", encoding="utf-8") as fh:
        for line in fh:
            if line.strip():
                p = json.loads(line)
                probes.append({k: v for k, v in p.items() if not k.startswith("_")})
    return probes


def prompt_rank(candidates: list[dict[str, Any]]) -> list[str]:
    print("\nCandidates (rank ALL — 1 = most like Boden, higher = less):")
    for c in candidates:
        text = (c.get("text") or "").replace("\n", " ")[:200]
        print(f"  [{c['candidate_id']}] {text}")

    ids = [c["candidate_id"] for c in candidates]
    while True:
        raw = input("\nEnter ranking comma-separated (e.g. c2,c0,c1,c3): ").strip()
        parts = [p.strip() for p in raw.split(",") if p.strip()]
        if set(parts) == set(ids) and len(parts) == len(ids):
            return parts
        print(f"Need exactly one ranking of: {', '.join(ids)}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--pack",
        type=Path,
        required=True,
        help="Human pack JSONL (no answer keys)",
    )
    parser.add_argument("--data-root", type=Path, default=DEFAULT_DATA_ROOT)
    parser.add_argument("--out", type=Path, default=None)
    parser.add_argument("--start", type=int, default=0)
    args = parser.parse_args()

    paths = ensure_dirs(args.data_root)
    probes = load_probes(args.pack)
    if not probes:
        print("Empty pack", file=sys.stderr)
        return 1

    out_path = args.out or (paths["eval"] / "itt_rankings" / f"session_{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S')}.jsonl")
    out_path.parent.mkdir(parents=True, exist_ok=True)

    results: list[dict[str, Any]] = []
    print(f"ITT ranking — {len(probes)} probes. Ctrl+C to save partial session.\n")

    try:
        for i, probe in enumerate(probes):
            if i < args.start:
                continue
            print("=" * 72)
            print(f"Probe {i + 1}/{len(probes)}  [{probe.get('stimulus_type')}]  {probe.get('channel')}")
            print("-" * 72)
            stim = probe.get("stimulus") or ""
            print(stim[:1200])
            if len(stim) > 1200:
                print("…")

            ranking = prompt_rank(probe.get("candidates") or [])
            results.append(
                {
                    "probe_id": probe.get("probe_id"),
                    "case_id": probe.get("case_id"),
                    "stimulus_type": probe.get("stimulus_type"),
                    "ranking": ranking,
                    "ranked_at": datetime.now(timezone.utc).isoformat(),
                }
            )
    except KeyboardInterrupt:
        print("\nInterrupted — saving partial session.")

    with out_path.open("w", encoding="utf-8") as fh:
        for r in results:
            fh.write(json.dumps(r, ensure_ascii=False) + "\n")

    print(json.dumps({"saved": str(out_path), "completed": len(results)}, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
