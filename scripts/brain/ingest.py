#!/usr/bin/env python3
"""Normalize multi-source exports → canonical brain episodes JSONL."""

from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path

from adapters import (
    adapt_chatgpt_dir,
    adapt_discord_file,
    adapt_kb_markdown,
    adapt_perplexity_dir,
    adapt_xfire_meta,
    dedupe_discord_paths,
    find_xfire_candidates,
    iter_discord_json,
)
from common import (
    BODEN_AUTHOR_ID,
    DEFAULT_DATA_ROOT,
    DEFAULT_DISCORD_ROOT,
    DEFAULT_REPO_ROOT,
    ensure_dirs,
)
from overlays import apply_overlays


def sort_discord(files: list[Path]) -> list[Path]:
    def key(p: Path) -> tuple[int, str]:
        if "discord_dms" in p.parts:
            return (0, str(p).lower())
        if "openkotor" in str(p).lower() or "holocron" in str(p).lower():
            return (1, str(p).lower())
        return (2, str(p).lower())

    return sorted(files, key=key)


def write_data_card(path: Path, manifest: dict) -> None:
    lines = [
        "# Brain data card",
        "",
        f"- Boden Discord ID: `{BODEN_AUTHOR_ID}`",
        "- Excluded: `wizardofchaos`",
        f"- Episode count: **{manifest.get('episode_count', 0)}**",
        f"- By source_family: `{json.dumps(manifest.get('by_source_family', {}))}`",
        "",
        "Private — do not ship under Next public/ or standalone image.",
        "Canonical IR is ground truth; Graphiti edges are derived.",
        "",
    ]
    path.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Brain IR ingest")
    parser.add_argument("--data-root", type=Path, default=DEFAULT_DATA_ROOT)
    parser.add_argument("--discord-root", type=Path, default=DEFAULT_DISCORD_ROOT)
    parser.add_argument("--repo-root", type=Path, default=DEFAULT_REPO_ROOT)
    parser.add_argument("--max-discord-files", type=int, default=0)
    parser.add_argument("--max-episodes-per-discord-file", type=int, default=0)
    parser.add_argument("--chatgpt-limit", type=int, default=0)
    parser.add_argument("--perplexity-limit", type=int, default=0)
    parser.add_argument("--kb-limit", type=int, default=0)
    parser.add_argument("--skip-discord", action="store_true")
    parser.add_argument("--skip-chatgpt", action="store_true")
    parser.add_argument("--skip-perplexity", action="store_true")
    parser.add_argument("--skip-kb", action="store_true")
    parser.add_argument("--skip-xfire", action="store_true")
    parser.add_argument(
        "--discord-include",
        nargs="*",
        default=["discord_dms", "openkotor_discord_msgs", "holocron_toolset_discord"],
    )
    args = parser.parse_args()

    paths = ensure_dirs(args.data_root)
    episodes: list[dict] = []

    if not args.skip_discord and args.discord_root.is_dir():
        files = list(iter_discord_json(args.discord_root))
        if args.discord_include:
            allow = set(args.discord_include)
            files = [f for f in files if any(p in allow for p in f.parts)]
        files = sort_discord(dedupe_discord_paths(files))
        if args.max_discord_files:
            files = files[: args.max_discord_files]
        for f in files:
            max_e = args.max_episodes_per_discord_file or None
            try:
                eps = adapt_discord_file(f, args.discord_root, max_episodes=max_e)
            except Exception as exc:  # noqa: BLE001
                print(f"skip discord {f}: {exc}", file=sys.stderr)
                continue
            print(f"discord {f.name}: {len(eps)} episodes")
            episodes.extend(eps)

    if not args.skip_chatgpt:
        eps = adapt_chatgpt_dir(args.repo_root, limit=args.chatgpt_limit)
        print(f"chatgpt: {len(eps)} episodes")
        episodes.extend(eps)

    if not args.skip_perplexity:
        eps = adapt_perplexity_dir(args.repo_root, limit=args.perplexity_limit)
        print(f"perplexity: {len(eps)} episodes")
        episodes.extend(eps)

    if not args.skip_kb:
        eps = adapt_kb_markdown(args.repo_root, limit=args.kb_limit)
        print(f"kb: {len(eps)} episodes")
        episodes.extend(eps)

    if not args.skip_xfire:
        xpaths = find_xfire_candidates()
        eps = adapt_xfire_meta(xpaths)
        print(f"xfire meta: {len(eps)} episodes from {len(xpaths)} files")
        episodes.extend(eps)

    # Deduplicate by id
    by_id: dict[str, dict] = {}
    for ep in episodes:
        by_id[ep["id"]] = ep
    episodes = list(by_id.values())

    episodes, overlay_stats = apply_overlays(episodes, paths["overlays"])

    out = paths["episodes_jsonl"]
    with out.open("w", encoding="utf-8") as fh:
        for ep in episodes:
            fh.write(json.dumps(ep, ensure_ascii=False) + "\n")

    by_family: dict[str, int] = defaultdict(int)
    for ep in episodes:
        by_family[str(ep.get("source_family"))] += 1

    manifest = {
        "boden_discord_id": BODEN_AUTHOR_ID,
        "data_root": str(paths["root"]),
        "episode_count": len(episodes),
        "by_source_family": dict(by_family),
        "overlays": overlay_stats,
        "privacy": "private",
    }
    paths["manifest"].write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    write_data_card(paths["data_card"], manifest)
    (paths["raw_manifest"] / "last_ingest.json").write_text(
        json.dumps(manifest, indent=2), encoding="utf-8"
    )
    print(f"Wrote {len(episodes)} episodes → {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
