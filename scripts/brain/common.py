"""Shared paths, PII scrub, IDs for the private brain warehouse."""

from __future__ import annotations

import hashlib
import os
import re
from pathlib import Path
from typing import Any

BODEN_AUTHOR_ID = os.environ.get(
    "BRAIN_BODEN_DISCORD_ID",
    os.environ.get("BODENAI_AUTHOR_DISCORD_ID", "227896831944687616"),
).strip()
EXCLUDE_AUTHOR_IDS = frozenset({"125433170047795200"})  # wizardofchaos — NOT Boden
BODEN_AUTHOR_IDS = frozenset({BODEN_AUTHOR_ID})

DEFAULT_DISCORD_ROOT = Path(
    os.environ.get("BRAIN_DISCORD_ROOT", "/home/brunner56/Documents/discord_exports")
)
DEFAULT_REPO_ROOT = Path(
    os.environ.get(
        "BRAIN_REPO_ROOT",
        str(Path(__file__).resolve().parents[2]),
    )
)
DEFAULT_DATA_ROOT = Path(
    os.environ.get("BRAIN_DATA_ROOT", str(Path.home() / "brain-data"))
)

EMAIL_RE = re.compile(r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b")
PHONE_RE = re.compile(r"\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b")
DISCORD_TOKEN_RE = re.compile(r"\b[MN][A-Za-z\d]{23,}\.[\w-]{6}\.[\w-]{27,}\b")
IP_RE = re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b")
SSN_RE = re.compile(r"\b\d{3}-\d{2}-\d{4}\b")
URL_QUERY_SECRET_RE = re.compile(
    r"([?&](?:token|key|api[_-]?key|password|secret|auth)=)[^&\s]+",
    re.IGNORECASE,
)

DISCORD_SOURCE_TAG: dict[str, str] = {
    "discord_dms": "discord_dm",
    "KotOR_discord_msgs": "discord_guild",
    "KotOR_Speedrun_Discord": "discord_guild",
    "openkotor_discord_msgs": "discord_guild",
    "holocron_toolset_discord": "discord_guild",
    "expanded_kotor_discord": "discord_guild",
    "DS_Discord_msgs": "discord_guild",
    "eod_discord": "discord_guild",
    "ror_new_discord": "discord_guild",
    "ror_orig_discord": "discord_guild",
}


def data_paths(root: Path | None = None) -> dict[str, Path]:
    base = Path(root or DEFAULT_DATA_ROOT)
    return {
        "root": base,
        "raw_manifest": base / "raw_manifest",
        "episodes": base / "episodes",
        "episodes_jsonl": base / "episodes" / "episodes.jsonl",
        "overlays": base / "overlays",
        "index": base / "index",
        "graphiti": base / "graphiti",
        "manifest": base / "episodes" / "manifest.json",
        "data_card": base / "DATA_CARD.md",
        "bm25_pkl": base / "index" / "bm25.pkl",
        "cases": base / "cases",
        "cases_jsonl": base / "cases" / "cases.jsonl",
        "behavior_profile": base / "cases" / "behavior_profile.json",
        "case_bm25_pkl": base / "index" / "cases_bm25.pkl",
        "held_out": base / "eval" / "held_out",
        "eval": base / "eval",
        "lora": base / "lora",
        "lora_export": base / "lora" / "sft.jsonl",
        "merge_candidates": base / "index" / "merge_candidates.json",
        "ontology": base / "graphiti" / "ontology.yaml",
    }


def ensure_dirs(root: Path | None = None) -> dict[str, Path]:
    paths = data_paths(root)
    for key in ("raw_manifest", "episodes", "overlays", "index", "graphiti", "cases", "eval", "lora"):
        paths[key].mkdir(parents=True, exist_ok=True)
    return paths


def scrub_pii(text: str) -> str:
    if not text:
        return ""
    out = EMAIL_RE.sub("[EMAIL]", text)
    out = DISCORD_TOKEN_RE.sub("[DISCORD_TOKEN]", out)
    out = SSN_RE.sub("[SSN]", out)
    out = PHONE_RE.sub("[PHONE]", out)
    out = IP_RE.sub("[IP]", out)
    out = URL_QUERY_SECRET_RE.sub(r"\1[REDACTED]", out)
    return out


def episode_id(parts: list[str]) -> str:
    return hashlib.sha256("|".join(parts).encode("utf-8")).hexdigest()[:24]


def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-z0-9_]+", (text or "").lower())


def is_boden_discord(author: dict[str, Any] | None) -> bool:
    if not author:
        return False
    aid = str(author.get("id") or "").strip()
    if not aid or aid in EXCLUDE_AUTHOR_IDS:
        return False
    return aid in BODEN_AUTHOR_IDS
