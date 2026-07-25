#!/usr/bin/env python3
"""Score human ITT ranking sessions against answer keys (SR, mean GT rank)."""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

from common import DEFAULT_DATA_ROOT, ensure_dirs


def load_jsonl(path: Path) -> list[dict[str, Any]]:
    out: list[dict] = []
    with path.open("r", encoding="utf-8") as fh:
        for line in fh:
            if line.strip():
                out.append(json.loads(line))
    return out


def score_rankings(
    key_path: Path,
    rankings: list[dict[str, Any]],
) -> dict[str, Any]:
    key_data = json.loads(key_path.read_text(encoding="utf-8"))
    answer_keys: dict[str, dict[str, str]] = key_data.get("answer_keys") or {}

    gt_ranks: list[int] = []
    select_ranks: list[int] = []
    method_ranks: dict[str, list[int]] = defaultdict(list)
    sr_gt = 0
    sr_select = 0
    sr_by_method: dict[str, int] = defaultdict(int)
    wins: Counter[str] = Counter()
    by_type: dict[str, list[int]] = defaultdict(list)

    for row in rankings:
        pid = row.get("probe_id")
        ranking: list[str] = row.get("ranking") or []
        if not pid or pid not in answer_keys or not ranking:
            continue
        methods = answer_keys[pid]
        method_rank = {methods[cid]: i + 1 for i, cid in enumerate(ranking) if cid in methods}

        gt_rank = method_rank.get("ground_truth")
        sel_rank = method_rank.get("case_select")
        if gt_rank is None:
            continue

        gt_ranks.append(gt_rank)
        by_type[str(row.get("stimulus_type") or "?")].append(gt_rank)
        if gt_rank == 1:
            sr_gt += 1
        best_method = min(method_rank, key=method_rank.get)  # type: ignore[arg-type]
        wins[best_method] += 1

        for method_name, rank in method_rank.items():
            method_ranks[method_name].append(rank)
            if rank == 1:
                sr_by_method[method_name] += 1

        if sel_rank is not None:
            select_ranks.append(sel_rank)
            if sel_rank == 1:
                sr_select += 1

    n = len(gt_ranks)
    return {
        "probes_scored": n,
        "ground_truth": {
            "selection_rate_rank1": sr_gt / max(n, 1),
            "mean_rank": sum(gt_ranks) / max(n, 1),
        },
        "case_select": {
            "selection_rate_rank1": sr_select / max(len(select_ranks), 1),
            "mean_rank": sum(select_ranks) / max(len(select_ranks), 1),
        },
        "methods": {
            name: {
                "selection_rate_rank1": sr_by_method[name] / max(len(ranks), 1),
                "mean_rank": sum(ranks) / max(len(ranks), 1),
                "probes": len(ranks),
            }
            for name, ranks in sorted(method_ranks.items())
        },
        "best_method_counts": dict(wins),
        "mean_gt_rank_by_stimulus_type": {
            k: sum(v) / len(v) for k, v in sorted(by_type.items())
        },
        "itt_pass_heuristic": sr_gt / max(n, 1) >= 0.5 and (sum(gt_ranks) / max(n, 1)) <= 1.8,
        "note": "Scored against pack answer keys; automated judge may not match human ITT.",
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--key", type=Path, required=True, help="pack .key.json from eval_itt_pack.py")
    parser.add_argument("--rankings", type=Path, required=True, help="Session JSONL from eval_itt_rank.py")
    parser.add_argument("--data-root", type=Path, default=DEFAULT_DATA_ROOT)
    args = parser.parse_args()

    paths = ensure_dirs(args.data_root)
    rankings = load_jsonl(args.rankings)
    if not rankings:
        print("No rankings to score", file=sys.stderr)
        return 1

    report = score_rankings(args.key, rankings)

    out = paths["eval"] / "itt_human_score.json"
    out.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
