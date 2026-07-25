#!/usr/bin/env python3
"""Ingest remaining MassiveHDD Downloads into unified conversations JSONL."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import subprocess
import sys
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from xml.etree import ElementTree as ET

from common import BODEN_AUTHOR_ID, DEFAULT_DATA_ROOT, scrub_pii

DOWNLOADS = Path("/run/media/brunner56/MassiveHDD/Downloads")
SELF_ID = BODEN_AUTHOR_ID
INGESTED_AT = datetime.now(timezone.utc).isoformat()

XFIRE_ACCOUNTS = [
    "th3w1zard1",
    "th3w1zard3",
    "sumrand0mguy",
    "mast3rrchief",
    "nooberpwner",
    "dwmwizard",
]
XFIRE_ALIASES = [
    "th3w1zard1",
    "th3w1zard3",
    "sumrand0mguy",
    "mast3rrchief",
    "nooberpwner",
    "dwmwizard",
    "PuritanWizard",
]

LUA_FILES = [
    "Addresses and Offsets for Halo PCCE.lua",
    "addresses_(and_some_usage).lua",
    "addresses_and_offsets_for_halo_pc-ce.lua",
    "alias.lua",
    "antiteamshoot.lua",
    "antivehiclecamp.lua",
    "choose_biped.lua",
    "commands.lua",
    "commands (1).lua",
    "commands_beta.lua",
    "d.lua",
    "melee.lua",
    "PhasorSappCompatibility.lua",
    "ralliedteams.lua",
    "StackTracePlus.lua",
    "timeremaining.lua",
    "vchanger.lua",
]

DOC_FILES = [
    "Document  Assignment One Fall 2016.docx",
    "EAMF2014KTS_SYLLABUS.DOC",
    "Important Dates and Course Schedule.xls",
]

LOG_FILES = [
    "hmcl.log",
    "home-assistant_2023-04-04T21-34-43.370Z.log",
]

META_FILES = [
    "Contacts.csv",
    "filter6730c173dda6b_csv.csv",
]


def conv_id(key: str) -> str:
    return "conv:" + hashlib.sha256(key.encode()).hexdigest()[:24]


def load_existing_paths(unified: Path) -> set[str]:
    out: set[str] = set()
    if not unified.is_file():
        return out
    with unified.open(encoding="utf-8") as fh:
        for line in fh:
            if line.strip():
                out.add(json.loads(line).get("source_path", ""))
    return out


def docx_text(path: Path) -> str:
    with zipfile.ZipFile(path) as z:
        xml = z.read("word/document.xml")
    root = ET.fromstring(xml)
    ns = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}
    parts = []
    for node in root.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t"):
        if node.text:
            parts.append(node.text)
    return scrub_pii(" ".join(parts))


def doc_text(path: Path) -> str:
    raw = subprocess.check_output(["strings", "-n", "4", str(path)], text=True, errors="replace")
    return scrub_pii(raw.strip())


def read_text_file(path: Path, limit: int = 500_000) -> str:
    text = path.read_text(encoding="utf-8", errors="replace")[:limit]
    return scrub_pii(text)


def make_record(
    *,
    source_path: str,
    source_family: str,
    title: str,
    text: str,
    twin_eligible: bool,
    extra_meta: dict[str, Any] | None = None,
) -> dict[str, Any]:
    meta: dict[str, Any] = {
        "channel": "massivehdd",
        "twin_eligible": twin_eligible,
        "language": "en",
        "message_count": 1,
        "ingested_at": INGESTED_AT,
        "massivehdd": True,
    }
    if extra_meta:
        meta.update(extra_meta)
    return {
        "schema_version": 1,
        "conversation_id": conv_id(source_path),
        "source_family": source_family,
        "source_path": source_path,
        "title": title,
        "started_at": None,
        "ended_at": None,
        "participants": [
            {"id": SELF_ID, "name": "PuritanWizard", "role": "self"},
            {"id": "archive", "name": "MassiveHDD", "role": "peer"},
        ],
        "messages": [
            {
                "message_id": "0",
                "role": "self",
                "speaker_id": SELF_ID,
                "speaker_name": "th3w1zard1",
                "text": text,
                "ts": None,
                "attachments": [],
                "raw": {"source_path": source_path},
            }
        ],
        "meta": meta,
    }


def ingest_text_assets(unified: Path) -> dict[str, Any]:
    existing = load_existing_paths(unified)
    appended: list[str] = []

    for name in LUA_FILES:
        path = DOWNLOADS / name
        if not path.is_file() or str(path) in existing:
            continue
        text = read_text_file(path)
        if len(text.strip()) < 20:
            continue
        rec = make_record(
            source_path=str(path),
            source_family="halo_script",
            title=f"Halo script — {path.name}",
            text=text,
            twin_eligible=False,
            extra_meta={"content_type": "lua", "author": "Wizard"},
        )
        with unified.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(rec, ensure_ascii=False) + "\n")
        appended.append(str(path))

    for name in DOC_FILES:
        path = DOWNLOADS / name
        if not path.is_file() or str(path) in existing:
            continue
        if path.suffix.lower() == ".docx":
            text = docx_text(path)
        elif path.suffix.lower() == ".doc":
            text = doc_text(path)
        else:
            text = doc_text(path)
        if len(text.strip()) < 20:
            continue
        rec = make_record(
            source_path=str(path),
            source_family="school_essay",
            title=path.stem,
            text=text,
            twin_eligible=True,
        )
        with unified.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(rec, ensure_ascii=False) + "\n")
        appended.append(str(path))

    for name in LOG_FILES:
        path = DOWNLOADS / name
        if not path.is_file() or str(path) in existing:
            continue
        text = read_text_file(path, limit=120_000)
        preview = text[:4000]
        rec = make_record(
            source_path=str(path),
            source_family="system_log",
            title=f"System log — {path.name}",
            text=preview,
            twin_eligible=False,
            extra_meta={"truncated": len(text) > 4000, "line_count": text.count("\n") + 1},
        )
        with unified.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(rec, ensure_ascii=False) + "\n")
        appended.append(str(path))

    for name in META_FILES:
        path = DOWNLOADS / name
        if not path.is_file() or str(path) in existing:
            continue
        text = read_text_file(path, limit=50_000)
        rec = make_record(
            source_path=str(path),
            source_family="archive_meta",
            title=f"Archive meta — {path.name}",
            text=text[:8000],
            twin_eligible=False,
            extra_meta={"pii_scrubbed": True},
        )
        with unified.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(rec, ensure_ascii=False) + "\n")
        appended.append(str(path))

    ini = DOWNLOADS / "xfire_games_20131217" / "xfire_games.ini"
    if ini.is_file() and str(ini) not in existing:
        text = read_text_file(ini, limit=20_000)
        rec = make_record(
            source_path=str(ini),
            source_family="archive_meta",
            title="Xfire games list (2013)",
            text=text,
            twin_eligible=False,
        )
        with unified.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(rec, ensure_ascii=False) + "\n")
        appended.append(str(ini))

    return {"appended": appended, "count": len(appended)}


def xfire_video_paths() -> list[Path]:
    out: list[Path] = []
    for acct in XFIRE_ACCOUNTS:
        d = DOWNLOADS / f"{acct}_xfire_export"
        if d.is_dir():
            out.extend(sorted(d.rglob("*.mp4")))
    return out


def video_duration_s(video: Path) -> float | None:
    try:
        out = subprocess.check_output(
            [
                "ffprobe",
                "-hide_banner",
                "-loglevel",
                "error",
                "-show_entries",
                "format=duration",
                "-of",
                "default=noprint_wrappers=1:nokey=1",
                str(video),
            ],
            text=True,
        ).strip()
        return float(out)
    except (subprocess.CalledProcessError, ValueError):
        return None


def ingest_xfire_video_silent(
    video: Path,
    unified: Path,
    account: str,
    existing: set[str],
) -> bool:
    src = str(video)
    if src in existing:
        return False
    dur = video_duration_s(video)
    text = (
        f"Xfire gameplay clip ({account}): {video.name}\n"
        f"Duration: {dur:.1f}s\n"
        "Video-only export (no audio track). Visual gameplay context; no voice transcript available."
        if dur
        else f"Xfire gameplay clip ({account}): {video.name}\nVideo-only export (no audio track)."
    )
    rec = make_record(
        source_path=src,
        source_family="xfire_video",
        title=f"Xfire clip ({account}) — {video.stem}",
        text=text,
        twin_eligible=False,
        extra_meta={
            "xfire_account": account,
            "aliases": XFIRE_ALIASES,
            "video_only": True,
            "duration_s": dur,
        },
    )
    with unified.open("a", encoding="utf-8") as fh:
        fh.write(json.dumps(rec, ensure_ascii=False) + "\n")
    return True


def ingest_xfire_video(
    video: Path,
    unified: Path,
    transcripts_root: Path,
    sidecar_root: Path,
    existing: set[str],
) -> bool:
    """Ingest xfire clip as video-only meta — no whisper transcription."""
    del transcripts_root, sidecar_root  # kept for CLI compatibility
    src = str(video)
    if src in existing:
        return False

    account = "unknown"
    for acct in XFIRE_ACCOUNTS:
        if acct in video.parts:
            account = acct
            break

    return ingest_xfire_video_silent(video, unified, account, existing)


def ingest_xfire_videos(unified: Path, limit: int = 0) -> dict[str, Any]:
    transcripts_root = DEFAULT_DATA_ROOT / "massivehdd" / "transcripts" / "xfire"
    sidecar_root = DEFAULT_DATA_ROOT / "massivehdd" / "paralinguistics" / "xfire"
    sidecar_root.mkdir(parents=True, exist_ok=True)
    existing = load_existing_paths(unified)
    videos = xfire_video_paths()
    if limit:
        videos = videos[:limit]

    ingested = 0
    skipped = 0
    errors: list[str] = []
    for video in videos:
        try:
            if ingest_xfire_video(video, unified, transcripts_root, sidecar_root, existing):
                ingested += 1
                existing.add(str(video))
            else:
                skipped += 1
        except Exception as exc:  # noqa: BLE001
            errors.append(f"{video}: {exc}")

    return {
        "videos_total": len(videos),
        "ingested": ingested,
        "skipped": skipped,
        "errors": errors[:20],
    }


def main() -> int:
    parser = argparse.ArgumentParser(description="MassiveHDD ingest")
    parser.add_argument(
        "--unified",
        type=Path,
        default=DEFAULT_DATA_ROOT / "unified" / "conversations.jsonl",
    )
    sub = parser.add_subparsers(dest="cmd", required=True)

    sub.add_parser("text", help="Ingest lua, docs, logs, meta")
    p_vid = sub.add_parser(
        "xfire-videos",
        help="Ingest xfire export mp4s as video-only meta (no transcription)",
    )
    p_vid.add_argument("--limit", type=int, default=0)

    args = parser.parse_args()
    if args.cmd == "text":
        print(json.dumps(ingest_text_assets(args.unified)))
    elif args.cmd == "xfire-videos":
        print(json.dumps(ingest_xfire_videos(args.unified, limit=args.limit)))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
