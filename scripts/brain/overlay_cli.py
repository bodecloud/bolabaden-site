#!/usr/bin/env python3
"""CLI helpers for overlays + merge-candidate report."""

from __future__ import annotations

import argparse
import json
import sys
from collections import Counter
from pathlib import Path

from common import DEFAULT_DATA_ROOT, ensure_dirs
from overlays import apply_overlays, load_overlay_files


def cmd_list(overlays_dir: Path) -> int:
    rules = load_overlay_files(overlays_dir)
    print(json.dumps(rules, indent=2))
    return 0


def cmd_apply(data_root: Path) -> int:
    paths = ensure_dirs(data_root)
    eps_path = paths["episodes_jsonl"]
    if not eps_path.is_file():
        print("No episodes.jsonl — run ingest.py", file=sys.stderr)
        return 1
    episodes = []
    with eps_path.open("r", encoding="utf-8") as fh:
        for line in fh:
            if line.strip():
                episodes.append(json.loads(line))
    # Re-apply from raw would need pre-overlay dump; apply on current + rewrite
    # For re-apply after editing overlays, re-run ingest. This command validates + reports.
    _, stats = apply_overlays(episodes, paths["overlays"])
    print(json.dumps({"current_episodes": len(episodes), "overlay_stats_if_reapplied_note": "re-run ingest.py to bake overlays", "loaded_rules": stats}, indent=2))
    return 0


def cmd_merge_candidates(data_root: Path, min_cooccur: int = 3) -> int:
    """Heuristic speaker co-occurrence for human merge review."""
    paths = ensure_dirs(data_root)
    if not paths["episodes_jsonl"].is_file():
        print("Missing episodes", file=sys.stderr)
        return 1
    name_tokens: Counter[str] = Counter()
    pair_counts: Counter[tuple[str, str]] = Counter()
    with paths["episodes_jsonl"].open("r", encoding="utf-8") as fh:
        for line in fh:
            ep = json.loads(line)
            names: list[str] = []
            for sp in ep.get("speakers") or []:
                n = (sp.get("name") or "").strip()
                role = (sp.get("role") or "").lower()
                if not n or role in {"assistant", "user", "meta", "archive"}:
                    continue
                if n.lower() in {"boden", "user", "assistant", "archive"}:
                    continue
                names.append(n)
            for m in ep.get("messages") or []:
                n = (m.get("speaker_name") or "").strip()
                if n and n.lower() not in {"boden", "user", "assistant", "archive"}:
                    if n not in names:
                        names.append(n)
            for n in names:
                name_tokens[n] += 1
            uniq = sorted(set(names))
            for i, a in enumerate(uniq):
                for b in uniq[i + 1 :]:
                    pair_counts[(a, b)] += 1

    candidates = [
        {"a": a, "b": b, "cooccur": c, "note": "review for entity merge"}
        for (a, b), c in pair_counts.most_common(100)
        if c >= min_cooccur
    ]
    # Also surface near-duplicate names (case / spacing)
    near: list[dict] = []
    keys = [n for n, _ in name_tokens.most_common(80)]
    for i, a in enumerate(keys):
        for b in keys[i + 1 :]:
            if a.lower().replace(" ", "") == b.lower().replace(" ", "") and a != b:
                near.append({"a": a, "b": b, "reason": "case_or_spacing"})
    report = {
        "min_cooccur": min_cooccur,
        "candidates": candidates,
        "near_duplicates": near,
        "top_speakers": name_tokens.most_common(40),
    }
    paths["merge_candidates"].write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(
        f"Wrote {len(candidates)} merge candidates "
        f"(+{len(near)} near-dupes) → {paths['merge_candidates']}"
    )
    return 0


def cmd_init_example(overlays_dir: Path) -> int:
    overlays_dir.mkdir(parents=True, exist_ok=True)
    example = overlays_dir / "example.yaml"
    if example.exists():
        print(f"exists: {example}")
        return 0
    example.write_text(
        """# Manual brain overlays — applied at ingest time
rules:
  # - action: exclude
  #   thread_id: "SOME_THREAD"
  # - action: retag
  #   episode_id: "abc123"
  #   lane_tags: ["knowledge", "chatgpt"]
  # - action: force
  #   source_path_contains: "Direct Messages - Sao"
  #   set:
  #     privacy: private
  # - action: merge_hint
  #   source_family: discord_dm
  #   merge_with: "Person:Wizard == Person:Boden"
""",
        encoding="utf-8",
    )
    print(f"Wrote {example}")
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description="Brain overlay / merge tools")
    parser.add_argument("--data-root", type=Path, default=DEFAULT_DATA_ROOT)
    sub = parser.add_subparsers(dest="cmd", required=True)
    sub.add_parser("list")
    sub.add_parser("apply-check")
    p_merge = sub.add_parser("merge-candidates")
    p_merge.add_argument("--min-cooccur", type=int, default=3)
    sub.add_parser("init-example")
    args = parser.parse_args()
    paths = ensure_dirs(args.data_root)
    if args.cmd == "list":
        return cmd_list(paths["overlays"])
    if args.cmd == "apply-check":
        return cmd_apply(args.data_root)
    if args.cmd == "merge-candidates":
        return cmd_merge_candidates(args.data_root, args.min_cooccur)
    if args.cmd == "init-example":
        return cmd_init_example(paths["overlays"])
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
