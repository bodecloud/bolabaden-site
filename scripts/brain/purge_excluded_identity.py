#!/usr/bin/env python3
"""Remove excluded Discord identity messages from unified conversations JSONL."""

from __future__ import annotations

import argparse
import json
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

from common import BODEN_AUTHOR_ID, DEFAULT_DATA_ROOT, EXCLUDE_AUTHOR_IDS


def purge_conversation(conv: dict) -> dict | None:
    excluded = EXCLUDE_AUTHOR_IDS
    boden_id = BODEN_AUTHOR_ID
    messages = conv.get("messages") or []
    kept = [m for m in messages if str(m.get("speaker_id") or "") not in excluded]
    if not kept:
        return None

    has_boden_self = any(
        str(m.get("role")) == "self" and str(m.get("speaker_id") or "") == boden_id for m in kept
    )
    if conv.get("source_family", "").startswith("discord") and not has_boden_self:
        return None

    participants = [
        p
        for p in (conv.get("participants") or [])
        if str(p.get("id") or "") not in excluded
    ]
    conv = dict(conv)
    conv["messages"] = kept
    conv["participants"] = participants
    meta = dict(conv.get("meta") or {})
    meta["message_count"] = len(kept)
    if not has_boden_self:
        meta["twin_eligible"] = False
    conv["meta"] = meta
    return conv


def main() -> int:
    parser = argparse.ArgumentParser(description="Purge excluded identity from unified JSONL")
    parser.add_argument(
        "--unified",
        type=Path,
        default=DEFAULT_DATA_ROOT / "unified" / "conversations.jsonl",
    )
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if not args.unified.is_file():
        print(f"Missing {args.unified}", file=sys.stderr)
        return 1

    backup = args.unified.with_suffix(".jsonl.pre-woc-purge")
    if not backup.exists() and not args.dry_run:
        shutil.copy2(args.unified, backup)

    in_count = out_count = dropped = removed_msgs = 0
    out_lines: list[str] = []

    with args.unified.open(encoding="utf-8") as fh:
        for line in fh:
            if not line.strip():
                continue
            in_count += 1
            conv = json.loads(line)
            before = len(conv.get("messages") or [])
            cleaned = purge_conversation(conv)
            if cleaned is None:
                dropped += 1
                removed_msgs += before
                continue
            after = len(cleaned.get("messages") or [])
            removed_msgs += before - after
            out_count += 1
            out_lines.append(json.dumps(cleaned, ensure_ascii=False))

    stats = {
        "purged_at": datetime.now(timezone.utc).isoformat(),
        "excluded_ids": sorted(EXCLUDE_AUTHOR_IDS),
        "boden_id": BODEN_AUTHOR_ID,
        "conversations_in": in_count,
        "conversations_out": out_count,
        "conversations_dropped": dropped,
        "messages_removed": removed_msgs,
        "backup": str(backup),
    }

    if not args.dry_run:
        args.unified.write_text("\n".join(out_lines) + "\n", encoding="utf-8")
        audit = args.unified.parent / "woc_purge_audit.json"
        audit.write_text(json.dumps(stats, indent=2), encoding="utf-8")

    print(json.dumps(stats))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
