"""Shared helpers for ITT eval scripts."""

from __future__ import annotations

import pickle
import random
from pathlib import Path
from typing import Any

from common import tokenize

try:
    from rank_bm25 import BM25Okapi
except ImportError:  # pragma: no cover
    BM25Okapi = None  # type: ignore

RAW_ASSISTANT_STUB = "Sure! I'd be happy to help with that. Let me know if you need anything else."
GENERIC_STUB = "That's interesting. What do you think about it?"

ANTI_ASSISTANT_PHRASES = (
    "great question",
    "as an ai",
    "happy to help",
    "how can i assist",
    "i'd be glad",
)


def load_case_bundle(path: Path) -> dict[str, Any]:
    with path.open("rb") as fh:
        return pickle.load(fh)


def anti_assistant(text: str) -> bool:
    low = (text or "").lower()
    return any(p in low for p in ANTI_ASSISTANT_PHRASES)


def format_response(messages: list[str] | None) -> str:
    if not messages:
        return ""
    return "\n---\n".join(m.strip() for m in messages if m and m.strip())


def top_cases(query: str, bundle: dict[str, Any], k: int = 5) -> list[dict[str, Any]]:
    bm25: BM25Okapi = bundle["bm25"]
    cases = bundle["cases"]
    scores = bm25.get_scores(tokenize(query))
    ranked = sorted(range(len(scores)), key=lambda i: scores[i], reverse=True)[:k]
    out: list[dict[str, Any]] = []
    for i in ranked:
        s = float(scores[i])
        if s <= 0:
            continue
        c = dict(cases[i])
        c["score"] = s
        out.append(c)
    return out


def select_response_text(query: str, bundle: dict[str, Any]) -> tuple[str, float, str | None]:
    hits = top_cases(query, bundle, k=1)
    if not hits:
        return "", 0.0, None
    hit = hits[0]
    return format_response(hit.get("response_messages")), float(hit["score"]), hit.get("id")


def build_candidates(
    case: dict[str, Any],
    bundle: dict[str, Any],
    *,
    rng: random.Random,
    cognitive_mode: str | None = None,
    episode_bundle: dict[str, Any] | None = None,
    behavior_profile: dict[str, Any] | None = None,
) -> list[dict[str, Any]]:
    """ITT pool: GT + select + distractors (labels hidden until score time)."""
    gt_text = format_response(case.get("response_messages"))
    select_text, select_score, select_id = select_response_text(
        case.get("stimulus") or "", bundle
    )

    candidates: list[dict[str, Any]] = [
        {"method": "ground_truth", "text": gt_text},
        {"method": "case_select", "text": select_text, "case_id": select_id, "score": select_score},
        {"method": "assistant_stub", "text": RAW_ASSISTANT_STUB},
        {"method": "generic_stub", "text": GENERIC_STUB},
    ]

    if cognitive_mode:
        try:
            from cognitive_loop import DecisionMode, decide

            trace = decide(
                case.get("stimulus") or "",
                bundle,
                mode=DecisionMode(cognitive_mode),
                episode_bundle=episode_bundle,
                behavior_profile=behavior_profile or {},
            )
            if trace.response_text:
                candidates.append(
                    {
                        "method": f"cognitive_{cognitive_mode}",
                        "text": trace.response_text,
                        "case_id": trace.case_id,
                        "score": trace.gate.score,
                    }
                )
        except (ValueError, KeyError):
            pass

    # Near-miss: second-best case retrieval (often wrong situation, plausible tone)
    near = top_cases(case.get("stimulus") or "", bundle, k=3)
    for hit in near[1:]:
        cid = hit.get("id")
        if cid and cid != select_id and cid != case.get("id"):
            candidates.append(
                {
                    "method": "near_miss_select",
                    "text": format_response(hit.get("response_messages")),
                    "case_id": cid,
                    "score": hit.get("score"),
                }
            )
            break

    rng.shuffle(candidates)
    for i, c in enumerate(candidates):
        c["candidate_id"] = f"c{i}"
    return candidates
