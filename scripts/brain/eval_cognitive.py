#!/usr/bin/env python3
"""Compare cognitive decision modes on held-out cases (A/B eval harness)."""

from __future__ import annotations

import argparse
import json
import random
import sys
from pathlib import Path
from typing import Any

from cognitive_loop import DecisionMode, decide, passes_anti_assistant
from common import DEFAULT_DATA_ROOT, ensure_dirs, tokenize
from eval_common import format_response, load_case_bundle


def _load_episode_bundle(path: Path) -> dict[str, Any] | None:
    if not path.is_file():
        return None
    return load_case_bundle(path)


def _gt_text(case: dict[str, Any]) -> str:
    return format_response(case.get("response_messages"))


def _metrics(pred: str, gt: str, trace_case_id: str | None, gt_id: str | None) -> dict[str, Any]:
    pred_t = tokenize(pred)
    gt_t = tokenize(gt)
    prefix8 = pred_t[:8] == gt_t[:8] if pred_t and gt_t else False
    return {
        "exact_match": pred.strip() == gt.strip() if pred and gt else False,
        "prefix8_match": prefix8,
        "case_id_match": bool(trace_case_id and gt_id and trace_case_id == gt_id),
        "anti_assistant_pass": passes_anti_assistant(pred),
        "response_len": len(pred or ""),
    }


def _eval_mode(
    held: list[dict[str, Any]],
    *,
    mode: DecisionMode,
    case_bundle: dict[str, Any],
    episode_bundle: dict[str, Any] | None,
    behavior_profile: dict[str, Any],
    threshold: float,
) -> dict[str, Any]:
    n = len(held)
    gate_allowed = 0
    prefix_hits = 0
    case_id_hits = 0
    anti_clean = 0
    rows: list[dict[str, Any]] = []

    for case in held:
        query = case.get("stimulus") or ""
        gt = _gt_text(case)
        trace = decide(
            query,
            case_bundle,
            mode=mode,
            episode_bundle=episode_bundle,
            behavior_profile=behavior_profile,
            threshold=threshold,
        )
        pred = trace.response_text
        m = _metrics(pred, gt, trace.case_id, case.get("id"))
        if trace.gate.allowed:
            gate_allowed += 1
        if m["prefix8_match"]:
            prefix_hits += 1
        if m["case_id_match"]:
            case_id_hits += 1
        if m["anti_assistant_pass"]:
            anti_clean += 1
        rows.append(
            {
                "case_id": case.get("id"),
                "stimulus_type": case.get("stimulus_type"),
                "gate_allowed": trace.gate.allowed,
                "gate_mode": trace.gate.mode,
                "selected_case_id": trace.case_id,
                **m,
            }
        )

    return {
        "mode": mode.value,
        "sample_size": n,
        "gate_allowed_rate": gate_allowed / max(n, 1),
        "prefix8_match_rate": prefix_hits / max(n, 1),
        "case_id_match_rate": case_id_hits / max(n, 1),
        "anti_assistant_pass_rate": anti_clean / max(n, 1),
        "results_sample": rows[:8],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="A/B eval for BODENAI_DECISION_MODE variants")
    parser.add_argument("--data-root", type=Path, default=DEFAULT_DATA_ROOT)
    parser.add_argument("--sample", type=int, default=200, help="held-out sample size (0 = all)")
    parser.add_argument("--seed", type=int, default=42)
    parser.add_argument(
        "--modes",
        default="case_select,mesh_replay,pfc_loop,hybrid",
        help="comma-separated modes to compare",
    )
    parser.add_argument("--threshold", type=float, default=0.35)
    parser.add_argument(
        "--profile",
        default="next_message",
        choices=("next_message", "itt"),
        help="itt adds note to run human ranking; next_message is automated only",
    )
    args = parser.parse_args()
    paths = ensure_dirs(args.data_root)

    cases_path = paths["cases_jsonl"]
    case_index = paths["case_bm25_pkl"]
    episode_index = paths["bm25_pkl"]
    bp_path = paths["behavior_profile"]

    if not cases_path.is_file() or not case_index.is_file():
        print("Run mine_cases.py + build_case_index.py first", file=sys.stderr)
        return 1

    held: list[dict] = []
    with cases_path.open("r", encoding="utf-8") as fh:
        for line in fh:
            if line.strip():
                c = json.loads(line)
                if c.get("held_out"):
                    held.append(c)

    rng = random.Random(args.seed)
    if args.sample and len(held) > args.sample:
        held = rng.sample(held, args.sample)

    case_bundle = load_case_bundle(case_index)
    episode_bundle = _load_episode_bundle(episode_index)
    behavior_profile: dict[str, Any] = {}
    if bp_path.is_file():
        behavior_profile = json.loads(bp_path.read_text(encoding="utf-8"))

    mode_names = [m.strip().lower() for m in args.modes.split(",") if m.strip()]
    comparisons: list[dict[str, Any]] = []
    for name in mode_names:
        if name not in {m.value for m in DecisionMode}:
            print(f"Unknown mode: {name}", file=sys.stderr)
            return 1
        comparisons.append(
            _eval_mode(
                held,
                mode=DecisionMode(name),
                case_bundle=case_bundle,
                episode_bundle=episode_bundle,
                behavior_profile=behavior_profile,
                threshold=args.threshold,
            )
        )

    baseline = next((c for c in comparisons if c["mode"] == "case_select"), comparisons[0])
    winner = max(comparisons, key=lambda c: (c["case_id_match_rate"], c["prefix8_match_rate"]))

    report: dict[str, Any] = {
        "held_out_total": len(held),
        "threshold": args.threshold,
        "eval_profile": args.profile,
        "episode_index_present": episode_bundle is not None,
        "comparisons": comparisons,
        "baseline_mode": "case_select",
        "best_automated_mode": winner["mode"],
        "promotion_hint": (
            "Run human ITT ranking before promoting any experimental mode to default."
            if winner["mode"] != "case_select"
            else "Baseline case_select remains best on automated metrics."
        ),
        "human_eval_next": "eval_itt_pack.py → eval_itt_rank.py → eval_itt_score.py",
    }

    if args.profile == "itt":
        report["note"] = (
            "Automated metrics are auxiliary. ITT human ranking is the promotion gate."
        )

    out = paths["eval"] / "cognitive_compare.json"
    out.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
