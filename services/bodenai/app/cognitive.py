"""BodenAI cognitive decision router — wraps scripts/brain/cognitive_loop."""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import Any

import httpx

# Shared loop lives in scripts/brain (single source of truth)
_BRAIN_SCRIPTS = Path(__file__).resolve().parents[3] / "scripts" / "brain"
if str(_BRAIN_SCRIPTS) not in sys.path:
    sys.path.insert(0, str(_BRAIN_SCRIPTS))

from cognitive_loop import (  # noqa: E402
    DecisionMode,
    DecisionTrace,
    decision_mode,
    passes_anti_assistant,
)

__all__ = [
    "DecisionMode",
    "DecisionTrace",
    "decide",
    "decide_from_hits",
    "decision_mode",
    "passes_anti_assistant",
]


def _load_behavior_profile() -> dict[str, Any]:
    root = os.environ.get("BRAIN_DATA_ROOT", os.path.expanduser("~/brain-data"))
    path = os.path.join(root, "cases", "behavior_profile.json")
    try:
        with open(path, encoding="utf-8") as fh:
            return json.load(fh)
    except OSError:
        return {}


async def _episode_hits_from_brain(query: str, *, k: int = 5) -> list[dict[str, Any]]:
    from . import twin

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            r = await client.post(
                f"{twin.brain_base()}/v1/search",
                headers=twin.brain_headers(),
                json={"query": query, "k": k, "voice_only": True},
            )
            r.raise_for_status()
            return list(r.json().get("hits") or [])
    except (httpx.HTTPError, OSError):
        return []


def _episode_bundle_from_hits(hits: list[dict[str, Any]]) -> dict[str, Any]:
    """Minimal bundle shape for mesh scoring from live search hits."""
    return {"episodes": hits, "bm25": None}


def decide_from_hits(
    query: str,
    case_hits: list[dict[str, Any]],
    *,
    mode: DecisionMode | str | None = None,
    episode_hits: list[dict[str, Any]] | None = None,
    mesh_hints: dict[str, Any] | None = None,
) -> DecisionTrace:
    """Run loop when case hits are already fetched (HTTP path)."""
    mode_val = mode if isinstance(mode, DecisionMode) else decision_mode(str(mode) if mode else None)
    bp = _load_behavior_profile()
    threshold = float(os.environ.get("BODENAI_GATE_THRESHOLD", bp.get("gate_threshold_default", 0.35)))

    # Build synthetic bundle: scores already on hits from brain API
    cases = []
    for h in case_hits:
        c = dict(h)
        c.setdefault("bm25_score", c.get("score"))
        cases.append(c)
    fake_bundle = {"cases": cases, "bm25": None}

    # Re-use decide internals via partial case list — call decide with patched retrieval
    from cognitive_loop import (  # noqa: E402
        DecisionMode as DM,
        _deliberate_scores,
        classify_affect,
        detect_topics,
        hard_gate,
        _policy_engagement,
    )

    topics = detect_topics(query)
    affect = classify_affect(query)
    engagement = _policy_engagement(query, topics)
    steps: list[dict[str, Any]] = [
        {"step": "perceive", "topics": topics, "affect": affect},
        {"step": "orient", "engagement": engagement},
        {"step": "retrieve", "case_count": len(cases), "episode_count": len(episode_hits or [])},
    ]

    ep_bundle = {"episodes": episode_hits or [], "bm25": None} if episode_hits else None
    episode_for_mesh = list(episode_hits or []) if episode_hits else []

    if mode_val == DM.CASE_SELECT:
        ranked = _deliberate_scores(cases, affect=affect, mesh_weight=0.0)
    elif mode_val == DM.MESH_REPLAY:
        ranked = _deliberate_scores(
            cases, affect=affect, episode_hits=episode_for_mesh, mesh_weight=1.0, mesh_hints=mesh_hints
        )
    elif mode_val == DM.HYBRID:
        base = _deliberate_scores(cases, affect=affect, mesh_weight=0.0)
        mesh = _deliberate_scores(
            cases, affect=affect, episode_hits=episode_for_mesh, mesh_weight=1.0, mesh_hints=mesh_hints
        )
        mesh_by_id = {r["id"]: r for r in mesh}
        ranked = []
        for row in base:
            mid = row.get("id")
            mscore = float((mesh_by_id.get(mid) or {}).get("policy_score") or row.get("policy_score") or 0)
            bscore = float(row.get("policy_score") or 0)
            merged = dict(row)
            merged["policy_score"] = 0.55 * bscore + 0.45 * mscore
            ranked.append(merged)
        ranked.sort(key=lambda x: float(x.get("policy_score") or 0), reverse=True)
    else:
        ranked = _deliberate_scores(
            cases, affect=affect, episode_hits=episode_for_mesh, mesh_weight=0.35, mesh_hints=mesh_hints
        )
        steps.append({"step": "deliberate", "strategy": "R+R+I+mesh", "candidates": len(ranked)})

    gate = hard_gate(ranked, engagement=engagement, threshold=threshold)
    steps.append({"step": "gate", "allowed": gate.allowed, "mode": gate.mode, "score": gate.score})

    response_text = ""
    if gate.allowed and gate.responses:
        response_text = "\n---\n".join(gate.responses)

    return DecisionTrace(
        mode=mode_val.value,
        steps=steps,
        topics=topics,
        affect=affect,
        engagement=engagement,
        gate=gate,
        response_text=response_text,
        case_id=(gate.case or {}).get("id"),
    )


async def _mesh_hints_from_brain(query: str) -> dict[str, Any] | None:
    from . import twin

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            r = await client.post(
                f"{twin.brain_base()}/v1/mesh/context",
                headers=twin.brain_headers(),
                json={"query": query, "k": 8},
            )
            if r.is_success:
                data = r.json()
                return data if data.get("available") else None
    except (httpx.HTTPError, OSError):
        pass
    return None


async def decide_online(
    query: str,
    case_hits: list[dict[str, Any]],
    *,
    mode: DecisionMode | str | None = None,
) -> DecisionTrace:
    mode_val = mode if isinstance(mode, DecisionMode) else decision_mode(str(mode) if mode else None)
    episode_hits: list[dict[str, Any]] | None = None
    mesh_hints: dict[str, Any] | None = None
    if mode_val != DecisionMode.CASE_SELECT:
        episode_hits = await _episode_hits_from_brain(query, k=5)
        mesh_hints = await _mesh_hints_from_brain(query)
    return decide_from_hits(
        query,
        case_hits,
        mode=mode_val,
        episode_hits=episode_hits,
        mesh_hints=mesh_hints,
    )
