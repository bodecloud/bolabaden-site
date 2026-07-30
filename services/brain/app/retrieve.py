"""Brain search — BM25 primary fallback; Graphiti when configured."""

from __future__ import annotations

import json
import os
import pickle
import re
from functools import lru_cache
from pathlib import Path
from typing import Any


def data_root() -> Path:
    return Path(os.environ.get("BRAIN_DATA_ROOT", str(Path.home() / "brain-data")))


def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-z0-9_]+", (text or "").lower())


@lru_cache(maxsize=1)
def load_bm25() -> dict[str, Any] | None:
    path = data_root() / "index" / "bm25.pkl"
    if not path.is_file():
        return None
    with path.open("rb") as fh:
        return pickle.load(fh)


def clear_caches() -> None:
    load_bm25.cache_clear()
    load_case_bm25.cache_clear()


def search(
    query: str,
    *,
    k: int = 8,
    lane: str | None = None,
    source_family: str | None = None,
    voice_only: bool = False,
) -> list[dict[str, Any]]:
    bundle = load_bm25()
    if not bundle:
        return []
    bm25 = bundle["bm25"]
    episodes = bundle["episodes"]
    scores = bm25.get_scores(tokenize(query))
    ranked = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)

    out: list[dict[str, Any]] = []
    for i in ranked:
        ep = dict(episodes[i])
        tags = ep.get("lane_tags") or []
        if voice_only and "voice" not in tags:
            continue
        if lane and lane not in tags:
            continue
        if source_family and ep.get("source_family") != source_family:
            continue
        ep["score"] = float(scores[i])
        if ep["score"] <= 0:
            continue
        out.append(ep)
        if len(out) >= k:
            break
    return out


def graphiti_status(probe: bool = False) -> dict[str, Any]:
    uri = os.environ.get("BRAIN_NEO4J_URI", "").strip()
    status: dict[str, Any] = {
        "configured": bool(uri),
        "uri_set": bool(uri),
        "note": "BM25 serves search until Graphiti loader is pointed at Neo4j",
    }
    try:
        import sys
        from pathlib import Path

        scripts = Path(__file__).resolve().parents[3] / "scripts" / "brain"
        if str(scripts) not in sys.path:
            sys.path.insert(0, str(scripts))
        from graphiti_llm import provider_status  # type: ignore

        status["llm"] = provider_status(probe=probe)
    except Exception as exc:  # pragma: no cover
        status["llm_error"] = str(exc)
    return status


def load_ontology() -> str:
    path = data_root() / "graphiti" / "ontology.yaml"
    if path.is_file():
        return path.read_text(encoding="utf-8")
    return ""


def manifest() -> dict[str, Any]:
    path = data_root() / "episodes" / "manifest.json"
    if path.is_file():
        return json.loads(path.read_text(encoding="utf-8"))
    return {}


@lru_cache(maxsize=1)
def load_case_bm25() -> dict[str, Any] | None:
    path = data_root() / "index" / "cases_bm25.pkl"
    if not path.is_file():
        return None
    with path.open("rb") as fh:
        return pickle.load(fh)


def search_cases(query: str, *, k: int = 5, channel: str | None = None) -> list[dict[str, Any]]:
    bundle = load_case_bm25()
    if not bundle:
        return []
    bm25 = bundle["bm25"]
    cases = bundle["cases"]
    scores = bm25.get_scores(tokenize(query))
    ranked = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)
    out: list[dict[str, Any]] = []
    for i in ranked:
        c = dict(cases[i])
        if channel and c.get("channel") != channel:
            continue
        score = float(scores[i])
        if score <= 0:
            continue
        c["score"] = score
        out.append(c)
        if len(out) >= k:
            break
    return out
