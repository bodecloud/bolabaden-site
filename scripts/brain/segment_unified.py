#!/usr/bin/env python3
"""P1: Segment unified Conversation IR v1 → Episode IR v1."""

from __future__ import annotations

import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import Any

from adapters import GAP_SECONDS, make_episode
from common import BODEN_AUTHOR_ID, DEFAULT_DATA_ROOT, ensure_dirs, episode_id

BURST_GAP_SECONDS = 2 * 60
CASE_SPAN_SECONDS = 6 * 3600
EXCLUDED_ID = "125433170047795200"  # wizardofchaos — NOT Boden
SELF_IDS = frozenset({BODEN_AUTHOR_ID})


def _parse_ts(raw: str | None) -> datetime | None:
    if not raw:
        return None
    if raw.startswith("PT") and "M" in raw:
        m = re.match(r"PT(?:(\d+)M)?(?:(\d+)S)?", raw)
        if m:
            mins = int(m.group(1) or 0)
            secs = int(m.group(2) or 0)
            base = datetime(1970, 1, 1, tzinfo=timezone.utc)
            return base + timedelta(minutes=mins, seconds=secs)
    try:
        return datetime.fromisoformat(raw.replace("Z", "+00:00"))
    except ValueError:
        return None


def _iso(dt: datetime | None) -> str:
    if not dt:
        return datetime.now(timezone.utc).isoformat()
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat()


def _speaker_dict(participants: list[dict[str, Any]]) -> dict[str, dict[str, str]]:
    out: dict[str, dict[str, str]] = {}
    for p in participants or []:
        pid = str(p.get("id") or "")
        if pid:
            out[pid] = {
                "id": pid,
                "name": str(p.get("name") or pid),
                "role": str(p.get("role") or "unknown"),
            }
    return out


def _message_ts(msg: dict[str, Any], conv_start: datetime | None) -> datetime | None:
    ts = _parse_ts(msg.get("ts"))
    if ts and ts.year == 1970 and conv_start:
        return conv_start + (ts - datetime(1970, 1, 1, tzinfo=timezone.utc))
    return ts


def _split_by_gap(
    messages: list[tuple[datetime | None, dict[str, Any]]],
    gap_seconds: int,
) -> list[list[dict[str, Any]]]:
    if not messages:
        return []
    chunks: list[list[dict[str, Any]]] = []
    current: list[dict[str, Any]] = []
    prev_ts: datetime | None = None
    for ts, msg in messages:
        if prev_ts and ts and (ts - prev_ts).total_seconds() > gap_seconds:
            if current:
                chunks.append(current)
            current = []
        current.append(msg)
        if ts:
            prev_ts = ts
    if current:
        chunks.append(current)
    return chunks


def _assign_bursts(messages: list[dict[str, Any]], gap_seconds: int = BURST_GAP_SECONDS) -> None:
    burst_idx = 0
    prev_ts: datetime | None = None
    prev_role: str | None = None
    for msg in messages:
        ts = _parse_ts(msg.get("ts"))
        role = str(msg.get("role") or "")
        new_burst = False
        if prev_ts and ts and (ts - prev_ts).total_seconds() > gap_seconds:
            new_burst = True
        if prev_role and role != prev_role:
            new_burst = True
        if prev_ts is None or new_burst:
            burst_idx += 1
        msg["_burst_id"] = f"burst:{burst_idx}"
        if ts:
            prev_ts = ts
        prev_role = role


def _conv_to_episodes(conv: dict[str, Any]) -> list[dict[str, Any]]:
    source_family = str(conv.get("source_family") or "unknown")
    source_path = str(conv.get("source_path") or "")
    conv_id = str(conv.get("conversation_id") or source_path)
    meta = conv.get("meta") or {}
    participants = conv.get("participants") or []
    speaker_map = _speaker_dict(participants)

    conv_start = _parse_ts(conv.get("started_at"))
    raw_msgs = conv.get("messages") or []
    if not raw_msgs:
        return []

    timed: list[tuple[datetime | None, dict[str, Any]]] = []
    any_ts = False
    for msg in raw_msgs:
        ts = _message_ts(msg, conv_start)
        if ts and (ts.year != 1970 or conv_start):
            any_ts = True
        timed.append((ts, msg))

    if not any_ts:
        chunks = [raw_msgs]
    else:
        chunks = _split_by_gap(timed, GAP_SECONDS)

    episodes: list[dict[str, Any]] = []
    for idx, chunk in enumerate(chunks):
        ep_messages: list[dict[str, str]] = []
        speakers_seen: dict[str, dict[str, str]] = {}
        for msg in chunk:
            role = str(msg.get("role") or "unknown")
            speaker_id = str(msg.get("speaker_id") or "")
            speaker_name = str(msg.get("speaker_name") or speaker_id or role)
            if speaker_id and speaker_id in speaker_map:
                sp = speaker_map[speaker_id]
                speakers_seen[speaker_id] = sp
            else:
                speakers_seen[speaker_id or speaker_name] = {
                    "id": speaker_id or speaker_name,
                    "name": speaker_name,
                    "role": role,
                }
            ep_messages.append(
                {
                    "role": role,
                    "speaker_name": speaker_name,
                    "text": str(msg.get("text") or ""),
                    "ts": msg.get("ts"),
                }
            )

        _assign_bursts(ep_messages)
        ref_msg = chunk[0]
        ref_ts = _message_ts(ref_msg, conv_start) or conv_start
        reference_time = _iso(ref_ts)

        twin_eligible = bool(meta.get("twin_eligible", True))
        if source_family in {"xfire_meta", "school_essay"}:
            twin_eligible = bool(meta.get("twin_eligible", False))
        if not any(m.get("role") == "self" for m in chunk):
            twin_eligible = False

        partner_id = ""
        for p in participants:
            if str(p.get("role")) == "peer":
                partner_id = str(p.get("id") or "")
                break

        extra: dict[str, Any] = {
            "channel": meta.get("channel") or source_family,
            "partner_id": partner_id,
            "burst_id": ep_messages[0].get("_burst_id") if ep_messages else "",
            "twin_eligible": twin_eligible,
            "conversation_id": conv_id,
            "episode_index": idx,
        }
        if meta.get("delivery_profile"):
            extra["delivery_profile"] = meta["delivery_profile"]
        if meta.get("multi_speaker"):
            extra["multi_speaker"] = True

        lane_tags = [source_family]
        if twin_eligible and source_family in {
            "discord_dm",
            "discord_guild",
            "voice_transcript",
            "reddit_comment",
            "reddit_post",
            "forum_post",
        }:
            lane_tags.append("voice")
        if meta.get("massivehdd"):
            lane_tags.append("massivehdd")

        ep = make_episode(
            source_family=source_family,
            source_path=source_path,
            thread_id=conv_id,
            reference_time=reference_time,
            speakers=list(speakers_seen.values()),
            messages=[{k: v for k, v in m.items() if not k.startswith("_")} for m in ep_messages],
            lane_tags=lane_tags,
            privacy="private",
            extra=extra,
        )
        ep["schema_version"] = 1
        episodes.append(ep)
    return episodes


def audit_author_ids(conversations: list[dict[str, Any]]) -> dict[str, Any]:
    self_by_id: Counter[str] = Counter()
    self_by_speaker: Counter[str] = Counter()
    for conv in conversations:
        for msg in conv.get("messages") or []:
            if str(msg.get("role")) != "self":
                continue
            sid = str(msg.get("speaker_id") or "")
            if sid:
                self_by_id[sid] += 1
            self_by_speaker[str(msg.get("speaker_name") or "")] += 1

    return {
        "primary_self_id": BODEN_AUTHOR_ID,
        "excluded_id": EXCLUDED_ID,
        "excluded_label": "wizardofchaos",
        "self_message_counts_by_id": dict(self_by_id.most_common(20)),
        "puritanwizard_messages": self_by_id.get(BODEN_AUTHOR_ID, 0),
        "confirmed_self_ids": sorted(SELF_IDS),
    }


def segment_unified(unified_path: Path) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    conversations: list[dict[str, Any]] = []
    with unified_path.open(encoding="utf-8") as fh:
        for line in fh:
            if line.strip():
                conversations.append(json.loads(line))

    author_audit = audit_author_ids(conversations)
    episodes: list[dict[str, Any]] = []
    by_family: Counter[str] = Counter()
    twin_eligible_count = 0

    for conv in conversations:
        eps = _conv_to_episodes(conv)
        for ep in eps:
            episodes.append(ep)
            by_family[str(ep.get("source_family"))] += 1
            if (ep.get("extra") or {}).get("twin_eligible"):
                twin_eligible_count += 1

    stats = {
        "conversation_count": len(conversations),
        "episode_count": len(episodes),
        "by_source_family": dict(by_family),
        "twin_eligible_episodes": twin_eligible_count,
        "author_audit": author_audit,
        "gap_seconds": GAP_SECONDS,
        "burst_gap_seconds": BURST_GAP_SECONDS,
    }
    return episodes, stats


def main() -> int:
    parser = argparse.ArgumentParser(description="Segment unified JSONL to episodes")
    parser.add_argument(
        "--unified",
        type=Path,
        default=DEFAULT_DATA_ROOT / "unified" / "conversations.jsonl",
    )
    parser.add_argument("--data-root", type=Path, default=DEFAULT_DATA_ROOT)
    parser.add_argument("--audit-out", type=Path, default=None)
    args = parser.parse_args()

    paths = ensure_dirs(args.data_root)
    if not args.unified.is_file():
        print(f"Missing {args.unified}", file=sys.stderr)
        return 1

    episodes, stats = segment_unified(args.unified)
    out = paths["episodes_jsonl"]
    with out.open("w", encoding="utf-8") as fh:
        for ep in episodes:
            fh.write(json.dumps(ep, ensure_ascii=False) + "\n")

    audit_path = args.audit_out or (paths["root"] / "unified" / "p1_segment_audit.json")
    audit_path.parent.mkdir(parents=True, exist_ok=True)
    audit_path.write_text(json.dumps(stats, indent=2), encoding="utf-8")
    paths["manifest"].write_text(json.dumps(stats, indent=2), encoding="utf-8")
    print(json.dumps({"episode_count": stats["episode_count"], "audit": str(audit_path)}))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
