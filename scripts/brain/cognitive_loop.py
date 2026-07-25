"""PFC-inspired decision loop — offline + importable by BodenAI service."""

from __future__ import annotations

import os
import re
from dataclasses import dataclass, field
from enum import Enum
from typing import Any

from common import tokenize

try:
    from rank_bm25 import BM25Okapi
except ImportError:  # pragma: no cover
    BM25Okapi = None  # type: ignore

VALID_MODES = frozenset({"case_select", "mesh_replay", "pfc_loop", "hybrid"})


class DecisionMode(str, Enum):
    CASE_SELECT = "case_select"
    MESH_REPLAY = "mesh_replay"
    PFC_LOOP = "pfc_loop"
    HYBRID = "hybrid"


TOPIC_KEYWORDS: dict[str, list[str]] = {
    "kotor": ["kotor", "holocron", "pykotor", "dlg"],
    "code": ["python", "typescript", "react", "docker", "git", "error"],
    "ai": ["llm", "gpt", "claude", "agent", "prompt"],
    "conflict": ["wrong", "stop", "hate", "stupid", "fuck"],
    "meta": ["as an ai", "great question", "how can i assist", "assistant"],
}

ANTI_ASSISTANT = (
    "great question",
    "as an ai",
    "happy to help",
    "how can i assist",
    "i'd be glad",
)


def decision_mode(explicit: str | None = None) -> DecisionMode:
    raw = (explicit or os.environ.get("BODENAI_DECISION_MODE") or "case_select").strip().lower()
    if raw not in VALID_MODES:
        raw = "case_select"
    return DecisionMode(raw)


def detect_topics(text: str) -> list[str]:
    low = (text or "").lower()
    hits = [t for t, words in TOPIC_KEYWORDS.items() if any(w in low for w in words)]
    return hits or ["general"]


def classify_affect(text: str) -> str:
    t = (text or "").lower()
    anger = sum(1 for w in ("fuck", "shit", "stupid", "hate", "wtf") if w in t)
    mania = sum(1 for w in ("lmao", "!!!", "insane", "bruh", "holy") if w in t)
    if anger >= 2:
        return "anger"
    if mania >= 2 or t.count("!") >= 4:
        return "mania"
    if len(t) <= 8:
        return "withdraw"
    return "neutral"


def passes_anti_assistant(text: str) -> bool:
    low = (text or "").lower()
    return not any(p in low for p in ANTI_ASSISTANT)


def _recency_boost(reference_time: str | None) -> float:
    if not reference_time:
        return 1.0
    m = re.match(r"^(\d{4})", reference_time)
    if not m:
        return 1.0
    year = int(m.group(1))
    if year >= 2024:
        return 1.12
    if year >= 2020:
        return 1.06
    return 1.0


def _importance_boost(case: dict[str, Any], affect: str) -> float:
    boost = 1.0
    tags = case.get("affect_tags") or []
    if affect in tags:
        boost *= 1.12
    if case.get("channel") == "dm":
        boost *= 1.08
    moves = case.get("boden_moves") or []
    if moves and affect != "withdraw":
        boost *= 1.05
    return boost


def _policy_engagement(query: str, topics: list[str]) -> str:
    if "meta" in topics or any(p in query.lower() for p in ANTI_ASSISTANT):
        return "ignore"
    return "engage"


def _bm25_case_hits(query: str, case_bundle: dict[str, Any], *, k: int = 8) -> list[dict[str, Any]]:
    bm25: BM25Okapi = case_bundle["bm25"]
    cases = case_bundle["cases"]
    scores = bm25.get_scores(tokenize(query))
    ranked = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)
    out: list[dict[str, Any]] = []
    for i in ranked:
        score = float(scores[i])
        if score <= 0:
            continue
        c = dict(cases[i])
        c["score"] = score
        c["bm25_score"] = score
        out.append(c)
        if len(out) >= k:
            break
    return out


def _bm25_episode_hits(query: str, episode_bundle: dict[str, Any] | None, *, k: int = 5) -> list[dict[str, Any]]:
    if not episode_bundle:
        return []
    bm25: BM25Okapi = episode_bundle["bm25"]
    episodes = episode_bundle["episodes"]
    scores = bm25.get_scores(tokenize(query))
    ranked = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)
    out: list[dict[str, Any]] = []
    for i in ranked:
        score = float(scores[i])
        if score <= 0:
            continue
        ep = dict(episodes[i])
        ep["score"] = score
        out.append(ep)
        if len(out) >= k:
            break
    return out


def _mesh_context(episode_hits: list[dict[str, Any]]) -> tuple[set[str], set[str]]:
    threads: set[str] = set()
    episode_ids: set[str] = set()
    for ep in episode_hits:
        tid = ep.get("thread_id")
        if tid:
            threads.add(str(tid))
        eid = ep.get("id")
        if eid:
            episode_ids.add(str(eid))
    return threads, episode_ids


def _mesh_boost(
    case: dict[str, Any],
    threads: set[str],
    episode_ids: set[str],
    mesh_hints: dict[str, Any] | None = None,
) -> float:
    boost = 1.0
    tid = str(case.get("thread_id") or "")
    if tid and tid in threads:
        boost *= 1.25
    src_eps = {str(x) for x in (case.get("source_episode_ids") or [])}
    if src_eps & episode_ids:
        boost *= 1.18

    if mesh_hints and mesh_hints.get("available"):
        hay = " ".join(
            [
                case.get("stimulus") or "",
                " ".join(case.get("response_messages") or []),
                " ".join(case.get("topics") or []),
                tid,
            ]
        ).lower()
        graph_hits = 0
        for name in mesh_hints.get("entity_names") or []:
            if name and str(name).lower() in hay:
                graph_hits += 1
        for ref in mesh_hints.get("thread_ids") or []:
            if ref and str(ref).lower() in hay:
                graph_hits += 1
        if graph_hits >= 2:
            boost *= 1.15
        elif graph_hits == 1:
            boost *= 1.08
    return boost


def _deliberate_scores(
    case_hits: list[dict[str, Any]],
    *,
    affect: str,
    episode_hits: list[dict[str, Any]] | None = None,
    mesh_weight: float = 0.0,
    mesh_hints: dict[str, Any] | None = None,
) -> list[dict[str, Any]]:
    threads, episode_ids = _mesh_context(episode_hits or [])
    ranked: list[dict[str, Any]] = []
    for h in case_hits:
        relevance = float(h.get("bm25_score") or h.get("score") or 0)
        recency = _recency_boost(h.get("reference_time"))
        importance = _importance_boost(h, affect)
        mesh = _mesh_boost(h, threads, episode_ids, mesh_hints) if mesh_weight > 0 else 1.0
        base = relevance * recency * importance
        if mesh_weight > 0:
            policy_score = (1.0 - mesh_weight) * base + mesh_weight * (base * mesh)
        else:
            policy_score = base
        row = dict(h)
        row["policy_score"] = policy_score
        row["deliberation"] = {
            "relevance": relevance,
            "recency": recency,
            "importance": importance,
            "mesh": mesh if mesh_weight > 0 else None,
        }
        ranked.append(row)
    ranked.sort(key=lambda x: float(x.get("policy_score") or 0), reverse=True)
    return ranked


@dataclass
class GateResult:
    allowed: bool
    mode: str
    score: float
    reason: str | None = None
    threshold: float | None = None
    case: dict[str, Any] | None = None
    responses: list[str] = field(default_factory=list)
    support: list[dict[str, Any]] = field(default_factory=list)


def hard_gate(
    ranked_hits: list[dict[str, Any]],
    *,
    engagement: str,
    threshold: float,
) -> GateResult:
    top = ranked_hits[0] if ranked_hits else None
    score = float((top or {}).get("policy_score") or (top or {}).get("score") or 0)

    if engagement == "ignore" and score < threshold * 1.5:
        return GateResult(False, "silence", score, reason="ignore affinity")
    if not top or score < threshold:
        return GateResult(
            False,
            "refuse",
            score,
            reason="below gate — will not invent Boden",
            threshold=threshold,
        )
    responses = list(top.get("response_messages") or [])
    mode = "burst" if len(responses) > 1 else "select"
    return GateResult(
        True,
        mode,
        score,
        case=top,
        responses=responses,
        support=ranked_hits[:4],
    )


@dataclass
class DecisionTrace:
    mode: str
    steps: list[dict[str, Any]]
    topics: list[str]
    affect: str
    engagement: str
    gate: GateResult
    response_text: str
    case_id: str | None


def decide(
    query: str,
    case_bundle: dict[str, Any],
    *,
    mode: DecisionMode | str | None = None,
    episode_bundle: dict[str, Any] | None = None,
    behavior_profile: dict[str, Any] | None = None,
    threshold: float | None = None,
    mesh_hints: dict[str, Any] | None = None,
) -> DecisionTrace:
    """Run cognitive loop and return gate + formatted response."""
    mode_val = mode if isinstance(mode, DecisionMode) else decision_mode(str(mode) if mode else None)
    bp = behavior_profile or {}
    gate_threshold = float(
        threshold
        if threshold is not None
        else os.environ.get("BODENAI_GATE_THRESHOLD", bp.get("gate_threshold_default", 0.35))
    )

    steps: list[dict[str, Any]] = []
    topics = detect_topics(query)
    affect = classify_affect(query)
    engagement = _policy_engagement(query, topics)
    steps.append({"step": "perceive", "topics": topics, "affect": affect})
    steps.append({"step": "orient", "engagement": engagement})

    case_hits = _bm25_case_hits(query, case_bundle, k=8)
    episode_hits = _bm25_episode_hits(query, episode_bundle, k=5) if mode_val != DecisionMode.CASE_SELECT else []
    steps.append(
        {
            "step": "retrieve",
            "case_count": len(case_hits),
            "episode_count": len(episode_hits),
            "top_case_id": (case_hits[0].get("id") if case_hits else None),
        }
    )
    if mesh_hints and mesh_hints.get("available"):
        steps.append(
            {
                "step": "mesh",
                "entities": len(mesh_hints.get("entity_names") or []),
                "refs": len(mesh_hints.get("thread_ids") or []),
            }
        )

    if mode_val == DecisionMode.CASE_SELECT:
        ranked = _deliberate_scores(case_hits, affect=affect, mesh_weight=0.0)
    elif mode_val == DecisionMode.MESH_REPLAY:
        ranked = _deliberate_scores(
            case_hits,
            affect=affect,
            episode_hits=episode_hits,
            mesh_weight=1.0,
            mesh_hints=mesh_hints,
        )
    elif mode_val == DecisionMode.HYBRID:
        base = _deliberate_scores(case_hits, affect=affect, mesh_weight=0.0)
        mesh = _deliberate_scores(
            case_hits,
            affect=affect,
            episode_hits=episode_hits,
            mesh_weight=1.0,
            mesh_hints=mesh_hints,
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
    else:  # PFC_LOOP
        ranked = _deliberate_scores(
            case_hits,
            affect=affect,
            episode_hits=episode_hits,
            mesh_weight=0.35,
            mesh_hints=mesh_hints,
        )
        steps.append({"step": "deliberate", "strategy": "R+R+I+mesh", "candidates": len(ranked)})

    gate = hard_gate(ranked, engagement=engagement, threshold=gate_threshold)
    steps.append(
        {
            "step": "gate",
            "allowed": gate.allowed,
            "mode": gate.mode,
            "score": gate.score,
            "reason": gate.reason,
        }
    )

    response_text = ""
    if gate.allowed and gate.responses:
        response_text = "\n---\n".join(gate.responses)
    elif gate.mode == "silence":
        response_text = ""

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
