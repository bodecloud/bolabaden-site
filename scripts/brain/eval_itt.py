#!/usr/bin/env python3
"""P7: Automated ITT plumbing checks on held-out cases."""

from __future__ import annotations

import argparse
import json
import random
import sys
from pathlib import Path
from typing import Any

from common import DEFAULT_DATA_ROOT, ensure_dirs, tokenize
from eval_common import anti_assistant, load_case_bundle, select_response_text


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-root", type=Path, default=DEFAULT_DATA_ROOT)
    parser.add_argument("--sample", type=int, default=50)
    parser.add_argument("--seed", type=int, default=42)
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
    rng = random.Random(args.seed)
    sample = held if len(held) <= args.sample else rng.sample(held, args.sample)

    results: list[dict[str, Any]] = []
    select_wins = 0
    grounded = 0
    anti_clean = 0

    for c in sample:
        query = c.get("stimulus") or ""
        gt = " ".join(c.get("response_messages") or [])
        sel_text, sel_score, _ = select_response_text(query, bundle)
        anti_ok = not anti_assistant(sel_text)
        if anti_ok:
            anti_clean += 1
        if sel_text and gt and tokenize(sel_text)[:8] == tokenize(gt)[:8]:
            grounded += 1
        if sel_score >= 0.35 and sel_text:
            select_wins += 1
        results.append(
            {
                "case_id": c.get("id"),
                "stimulus_type": c.get("stimulus_type"),
                "select_score": sel_score,
                "grounded_prefix_match": sel_text[:80] == gt[:80],
                "anti_assistant_pass": anti_ok,
            }
        )

    report = {
        "held_out_total": len(held),
        "sample_size": len(sample),
        "select_hit_rate": select_wins / max(len(sample), 1),
        "grounded_prefix_rate": grounded / max(len(sample), 1),
        "anti_assistant_pass_rate": anti_clean / max(len(sample), 1),
        "gate_recommendation": 0.35,
        "human_eval_next": "eval_itt_pack.py → eval_itt_rank.py → eval_itt_score.py",
        "results_sample": results[:10],
    }
    out = paths["eval"] / "itt_report.json"
    out.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
