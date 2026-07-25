#!/usr/bin/env python3
"""Hands-off ITT promotion gate: auto-rank → score → recommend decision mode."""

from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from common import DEFAULT_DATA_ROOT, ensure_dirs
from eval_itt_auto_rank import build_session
from eval_itt_score import score_rankings


def _ensure_pack(data_root: Path, *, cognitive_mode: str) -> tuple[Path, Path]:
    paths = ensure_dirs(data_root)
    human = paths["eval"] / "itt_packs" / "pack_seed42.human.jsonl"
    key = paths["eval"] / "itt_packs" / "pack_seed42.key.json"
    if human.is_file() and key.is_file():
        return human, key

    cmd = [
        sys.executable,
        str(Path(__file__).resolve().parent / "eval_itt_pack.py"),
        "--per-type",
        "5",
        "--data-root",
        str(data_root),
    ]
    if cognitive_mode:
        cmd.extend(["--cognitive-mode", cognitive_mode])
    subprocess.run(cmd, check=True)
    return human, key


def promotion_decision(score: dict[str, Any]) -> dict[str, Any]:
    methods = score.get("methods") or {}
    select = methods.get("case_select") or {}
    cog = methods.get("cognitive_pfc_loop") or {}

    recommended = "case_select"
    reason = "default case-first select"

    sel_mr = float(select.get("mean_rank") or 99)
    cog_mr = float(cog.get("mean_rank") or 99)
    sel_sr = float(select.get("selection_rate_rank1") or 0)
    cog_sr = float(cog.get("selection_rate_rank1") or 0)

    if cog.get("probes") and cog_mr < sel_mr and cog_sr >= sel_sr:
        recommended = "pfc_loop"
        reason = (
            f"cognitive_pfc_loop mean_rank {cog_mr:.2f} beats case_select {sel_mr:.2f}"
        )
    elif cog.get("probes") and cog_sr > sel_sr + 0.05:
        recommended = "pfc_loop"
        reason = f"cognitive_pfc_loop rank-1 rate {cog_sr:.2f} > case_select {sel_sr:.2f}"

    return {
        "recommended_mode": recommended,
        "reason": reason,
        "case_select_mean_rank": sel_mr,
        "cognitive_pfc_loop_mean_rank": cog_mr,
        "promote_experimental": recommended != "case_select",
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="Automated ITT gate (no human session)")
    parser.add_argument("--data-root", type=Path, default=DEFAULT_DATA_ROOT)
    parser.add_argument(
        "--pack",
        type=Path,
        default=None,
        help="Human pack JSONL (default: pack_seed42.human.jsonl)",
    )
    parser.add_argument(
        "--cognitive-mode",
        default="pfc_loop",
        help="Arm included in pack when rebuilding",
    )
    parser.add_argument(
        "--judge",
        choices=("auto", "llm", "heuristic"),
        default="auto",
    )
    parser.add_argument("--provider", default=None)
    parser.add_argument("--rebuild-pack", action="store_true")
    args = parser.parse_args()

    paths = ensure_dirs(args.data_root)
    if args.rebuild_pack or args.pack is None:
        pack, key = _ensure_pack(args.data_root, cognitive_mode=args.cognitive_mode)
    else:
        pack = args.pack
        key = pack.with_suffix(".key.json")
        if not key.is_file():
            key = paths["eval"] / "itt_packs" / "pack_seed42.key.json"

    if not pack.is_file() or not key.is_file():
        print("Missing ITT pack or key", file=sys.stderr)
        return 1

    rows, rank_meta = build_session(
        pack=pack,
        data_root=args.data_root,
        judge=args.judge,
        provider=args.provider,
    )
    rankings_path = (
        paths["eval"]
        / "itt_rankings"
        / f"auto_gate_{datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%S')}.jsonl"
    )
    rankings_path.parent.mkdir(parents=True, exist_ok=True)
    with rankings_path.open("w", encoding="utf-8") as fh:
        for row in rows:
            fh.write(json.dumps(row, ensure_ascii=False) + "\n")

    score = score_rankings(key, rows)
    promotion = promotion_decision(score)

    report: dict[str, Any] = {
        "gate": "automated_itt",
        "completed_at": datetime.now(timezone.utc).isoformat(),
        "pack": str(pack),
        "rankings": str(rankings_path),
        "rank_meta": rank_meta,
        "score": score,
        "promotion": promotion,
        "default_stays": promotion["recommended_mode"] == "case_select",
        "next": (
            "Set BODENAI_DECISION_MODE="
            + promotion["recommended_mode"]
            + " when deploying twin"
        ),
    }

    out = paths["eval"] / "itt_gate_report.json"
    out.write_text(json.dumps(report, indent=2), encoding="utf-8")

    # Also refresh autorank proxy for mode comparison
    subprocess.run(
        [sys.executable, str(Path(__file__).parent / "eval_itt_autorank.py"), "--data-root", str(args.data_root)],
        check=False,
    )

    print(json.dumps(report, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
