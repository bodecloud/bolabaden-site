#!/usr/bin/env python3
"""Build stratified ITT ranking packs from held-out cases for human eval."""

from __future__ import annotations

import argparse
import json
import random
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any

from common import DEFAULT_DATA_ROOT, ensure_dirs
from eval_common import build_candidates, load_case_bundle


def stratified_sample(
    cases: list[dict[str, Any]],
    *,
    per_type: int,
    seed: int,
) -> list[dict[str, Any]]:
    by_type: dict[str, list[dict]] = defaultdict(list)
    for c in cases:
        by_type[str(c.get("stimulus_type") or "unknown")].append(c)

    rng = random.Random(seed)
    out: list[dict] = []
    for stype, group in sorted(by_type.items()):
        rng.shuffle(group)
        out.extend(group[:per_type])
    rng.shuffle(out)
    return out


def main() -> int:
    parser = argparse.ArgumentParser(description="Build ITT ranking packs")
    parser.add_argument("--data-root", type=Path, default=DEFAULT_DATA_ROOT)
    parser.add_argument("--per-type", type=int, default=5, help="Probes per stimulus_type")
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument("--out", type=Path, default=None)
    parser.add_argument(
        "--cognitive-mode",
        default="",
        help="Add experimental arm: mesh_replay | pfc_loop | hybrid",
    )
    args = parser.parse_args()

    paths = ensure_dirs(args.data_root)
    cases_path = paths["cases_jsonl"]
    index_path = paths["case_bm25_pkl"]
    if not cases_path.is_file() or not index_path.is_file():
        print("Run mine_cases.py + build_case_index.py first", file=sys.stderr)
        return 1

    held: list[dict] = []
    with cases_path.open("r", encoding="utf-8") as fh:
        for line in fh:
            if line.strip():
                c = json.loads(line)
                if c.get("held_out"):
                    held.append(c)

    bundle = load_case_bundle(index_path)
    episode_bundle = load_case_bundle(paths["bm25_pkl"]) if paths["bm25_pkl"].is_file() else None
    behavior_profile: dict[str, Any] = {}
    bp_path = paths["behavior_profile"]
    if bp_path.is_file():
        behavior_profile = json.loads(bp_path.read_text(encoding="utf-8"))

    cognitive_mode = args.cognitive_mode.strip().lower() or None
    if cognitive_mode and cognitive_mode not in {"mesh_replay", "pfc_loop", "hybrid", "case_select"}:
        print(f"Unknown cognitive mode: {cognitive_mode}", file=sys.stderr)
        return 1

    sample = stratified_sample(held, per_type=args.per_type, seed=args.seed)

    packs_dir = paths["eval"] / "itt_packs"
    packs_dir.mkdir(parents=True, exist_ok=True)
    out_path = args.out or (packs_dir / f"pack_seed{args.seed}.jsonl")

    rng = random.Random(args.seed + 1)
    probes: list[dict[str, Any]] = []
    for i, case in enumerate(sample):
        candidates = build_candidates(
            case,
            bundle,
            rng=rng,
            cognitive_mode=cognitive_mode,
            episode_bundle=episode_bundle,
            behavior_profile=behavior_profile,
        )
        probes.append(
            {
                "probe_id": f"p{i:03d}",
                "case_id": case.get("id"),
                "stimulus_type": case.get("stimulus_type"),
                "channel": case.get("channel"),
                "stimulus": case.get("stimulus"),
                "candidates": [
                    {k: v for k, v in c.items() if k != "method"} for c in candidates
                ],
                "_answer_key": {
                    c["candidate_id"]: c["method"] for c in candidates
                },
            }
        )

    with out_path.open("w", encoding="utf-8") as fh:
        for p in probes:
            fh.write(json.dumps(p, ensure_ascii=False) + "\n")

    # Separate answer key (for automated scoring only — do not use during ranking)
    key_path = out_path.with_suffix(".key.json")
    key_path.write_text(
        json.dumps(
            {
                "pack": str(out_path),
                "probe_count": len(probes),
                "held_out_total": len(held),
                "per_type": args.per_type,
                "answer_keys": {p["probe_id"]: p["_answer_key"] for p in probes},
            },
            indent=2,
            ensure_ascii=False,
        ),
        encoding="utf-8",
    )

    # Human-facing pack without answer keys
    human_path = out_path.with_suffix(".human.jsonl")
    with human_path.open("w", encoding="utf-8") as fh:
        for p in probes:
            human = {k: v for k, v in p.items() if not k.startswith("_")}
            fh.write(json.dumps(human, ensure_ascii=False) + "\n")

    meta = {
        "probes": len(probes),
        "held_out_total": len(held),
        "pack_human": str(human_path),
        "pack_full": str(out_path),
        "answer_key": str(key_path),
    }
    print(json.dumps(meta, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
