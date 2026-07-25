#!/usr/bin/env python3
"""Automated pre-human ITT proxy: rank mode outputs vs ground truth on a pack."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from typing import Any

from cognitive_loop import DecisionMode, decide
from common import DEFAULT_DATA_ROOT, ensure_dirs, tokenize
from eval_common import format_response, load_case_bundle


def _overlap_score(pred: str, gt: str) -> float:
    pt, gt_t = set(tokenize(pred)), set(tokenize(gt))
    if not pt or not gt_t:
        return 0.0
    return len(pt & gt_t) / max(len(gt_t), 1)


def _load_probes(pack_path: Path) -> list[dict[str, Any]]:
    probes: list[dict] = []
    with pack_path.open("r", encoding="utf-8") as fh:
        for line in fh:
            if line.strip():
                probes.append(json.loads(line))
    return probes


def _held_case(case_id: str, cases_path: Path) -> dict[str, Any] | None:
    with cases_path.open("r", encoding="utf-8") as fh:
        for line in fh:
            if not line.strip():
                continue
            c = json.loads(line)
            if c.get("id") == case_id:
                return c
    return None


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Automated ITT proxy ranking for cognitive modes (pre-human baseline)"
    )
    parser.add_argument(
        "--pack",
        type=Path,
        default=DEFAULT_DATA_ROOT / "eval" / "itt_packs" / "pack_seed42.human.jsonl",
    )
    parser.add_argument("--data-root", type=Path, default=DEFAULT_DATA_ROOT)
    parser.add_argument(
        "--modes",
        default="case_select,pfc_loop,hybrid,mesh_replay",
        help="Modes to score (comma-separated)",
    )
    parser.add_argument("--threshold", type=float, default=0.35)
    args = parser.parse_args()

    paths = ensure_dirs(args.data_root)
    if not args.pack.is_file():
        print(f"Missing pack: {args.pack}", file=sys.stderr)
        return 1
    if not paths["case_bm25_pkl"].is_file():
        print("Run build_case_index.py first", file=sys.stderr)
        return 1

    bundle = load_case_bundle(paths["case_bm25_pkl"])
    episode_bundle = (
        load_case_bundle(paths["bm25_pkl"]) if paths["bm25_pkl"].is_file() else None
    )
    behavior_profile: dict[str, Any] = {}
    if paths["behavior_profile"].is_file():
        behavior_profile = json.loads(paths["behavior_profile"].read_text(encoding="utf-8"))

    probes = _load_probes(args.pack)
    modes = [m.strip() for m in args.modes.split(",") if m.strip()]

    mode_stats: dict[str, dict[str, Any]] = {
        m: {"overlap_sum": 0.0, "case_id_hits": 0, "gate_allowed": 0, "n": 0}
        for m in modes
    }

    rows: list[dict[str, Any]] = []
    for probe in probes:
        case_id = probe.get("case_id") or ""
        held = _held_case(case_id, paths["cases_jsonl"])
        if not held:
            continue
        gt = format_response(held.get("response_messages"))
        query = probe.get("stimulus") or held.get("stimulus") or ""

        row: dict[str, Any] = {"probe_id": probe.get("probe_id"), "case_id": case_id}
        for mode_name in modes:
            try:
                mode = DecisionMode(mode_name)
            except ValueError:
                print(f"Unknown mode: {mode_name}", file=sys.stderr)
                return 1
            trace = decide(
                query,
                bundle,
                mode=mode,
                episode_bundle=episode_bundle,
                behavior_profile=behavior_profile,
                threshold=args.threshold,
            )
            pred = trace.response_text
            overlap = _overlap_score(pred, gt)
            stats = mode_stats[mode_name]
            stats["n"] += 1
            stats["overlap_sum"] += overlap
            if trace.gate.allowed:
                stats["gate_allowed"] += 1
            if trace.case_id == case_id:
                stats["case_id_hits"] += 1
            row[mode_name] = {
                "overlap": round(overlap, 4),
                "case_id_match": trace.case_id == case_id,
                "gate_allowed": trace.gate.allowed,
                "selected_case_id": trace.case_id,
            }
        rows.append(row)

    summary: dict[str, Any] = {}
    for mode_name, stats in mode_stats.items():
        n = max(stats["n"], 1)
        summary[mode_name] = {
            "probes": stats["n"],
            "mean_token_overlap": round(stats["overlap_sum"] / n, 4),
            "case_id_match_rate": round(stats["case_id_hits"] / n, 4),
            "gate_allowed_rate": round(stats["gate_allowed"] / n, 4),
        }

    best = max(summary.items(), key=lambda kv: (kv[1]["case_id_match_rate"], kv[1]["mean_token_overlap"]))

    report = {
        "pack": str(args.pack),
        "probe_count": len(probes),
        "scored_probes": len(rows),
        "modes": summary,
        "best_automated_proxy": best[0],
        "note": "Token overlap proxy only — promotion gate: eval_itt_gate.py",
        "human_eval_next": "eval_itt_gate.py (automated)",
        "sample_rows": rows[:5],
    }

    out = paths["eval"] / "itt_autorank_proxy.json"
    out.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
