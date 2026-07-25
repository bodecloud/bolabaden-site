"""BodenAI twin — case-first select (ITT/PWYW), BP policy, hard gate."""

from __future__ import annotations

import json
import os
from typing import Any

import httpx

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


def detect_topics(text: str) -> list[str]:
    low = (text or "").lower()
    hits = [t for t, words in TOPIC_KEYWORDS.items() if any(w in low for w in words)]
    return hits or ["general"]


def brain_base() -> str:
    return os.environ.get("BRAIN_BASE_URL", "http://127.0.0.1:8090").rstrip("/")


def brain_headers() -> dict[str, str]:
    h = {"Content-Type": "application/json"}
    tok = os.environ.get("BRAIN_SERVICE_TOKEN", "").strip()
    if tok:
        h["Authorization"] = f"Bearer {tok}"
        h["X-Brain-Token"] = tok
    return h


async def brain_case_search(query: str, *, k: int = 5) -> list[dict[str, Any]]:
    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.post(
            f"{brain_base()}/v1/cases/search",
            headers=brain_headers(),
            json={"query": query, "k": k},
        )
        r.raise_for_status()
        return list(r.json().get("hits") or [])


async def brain_search(query: str, *, k: int = 8, voice_only: bool = True) -> list[dict[str, Any]]:
    async with httpx.AsyncClient(timeout=30.0) as client:
        r = await client.post(
            f"{brain_base()}/v1/search",
            headers=brain_headers(),
            json={"query": query, "k": k, "voice_only": voice_only},
        )
        r.raise_for_status()
        data = r.json()
        return list(data.get("hits") or [])


def load_behavior_profile() -> dict[str, Any]:
    root = os.environ.get("BRAIN_DATA_ROOT", os.path.expanduser("~/brain-data"))
    path = os.path.join(root, "cases", "behavior_profile.json")
    try:
        with open(path, encoding="utf-8") as fh:
            return json.load(fh)
    except OSError:
        return {}


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


def apply_policy(query: str, case_hits: list[dict[str, Any]]) -> dict[str, Any]:
    topics = detect_topics(query)
    bp = load_behavior_profile()
    engagement = "engage"
    affect = classify_affect(query)
    if "meta" in topics or any(p in query.lower() for p in ANTI_ASSISTANT):
        engagement = "ignore"
        affect = "withdraw"
    elif "conflict" in topics:
        affect = "anger"

    def boost(h: dict[str, Any]) -> float:
        s = float(h.get("score") or 0)
        tags = h.get("affect_tags") or []
        if affect in tags or "high_arousal" in tags and affect == "anger":
            s *= 1.15
        if h.get("channel") == "dm":
            s *= 1.1
        return s

    ranked = sorted(case_hits, key=boost, reverse=True)
    for h in ranked:
        h["policy_score"] = boost(h)
    return {
        "topics": topics,
        "policy_engagement": engagement,
        "policy_affect": affect,
        "hits": ranked,
        "bp_gate": bp.get("gate_threshold_default", 0.35),
    }


def hard_gate(policy: dict[str, Any]) -> dict[str, Any]:
    threshold = float(
        os.environ.get("BODENAI_GATE_THRESHOLD", str(policy.get("bp_gate") or 0.35))
    )
    hits = policy.get("hits") or []
    top = hits[0] if hits else None
    score = float((top or {}).get("policy_score") or (top or {}).get("score") or 0)
    engagement = policy.get("policy_engagement") or "engage"

    if engagement == "ignore" and score < threshold * 1.5:
        return {"allowed": False, "mode": "silence", "score": score, "reason": "ignore affinity"}
    if not top or score < threshold:
        return {
            "allowed": False,
            "mode": "refuse",
            "score": score,
            "threshold": threshold,
            "reason": "below gate — will not invent Boden",
        }
    responses = top.get("response_messages") or []
    mode = "select"
    if len(responses) > 1:
        mode = "burst"
    return {
        "allowed": True,
        "mode": mode,
        "score": score,
        "case": top,
        "responses": responses,
        "support": hits[:4],
    }


ANTI = (
    "You simulate Boden from prior chat cases — NOT a helpful assistant. "
    "Silence/short/hostile are valid. Never invent private facts. "
    "Forbidden: great question, as an ai, happy to help, how can i assist."
)


def passes_anti_assistant(text: str) -> bool:
    low = (text or "").lower()
    return not any(p in low for p in ANTI_ASSISTANT)


async def stream_llm(messages: list[dict[str, str]]):
    base = os.environ.get("BODENAI_LLM_BASE_URL", "").rstrip("/")
    if not base:
        return
    import json as _json

    key = os.environ.get("BODENAI_LLM_API_KEY", "")
    model = os.environ.get("BODENAI_LLM_MODEL", "gpt-4o-mini")
    headers = {"Content-Type": "application/json"}
    if key:
        headers["Authorization"] = f"Bearer {key}"
    payload = {
        "model": model,
        "messages": messages,
        "stream": True,
        "temperature": 0.85,
        "max_tokens": 80,
    }
    async with httpx.AsyncClient(timeout=120.0) as client:
        async with client.stream(
            "POST", f"{base}/chat/completions", headers=headers, json=payload
        ) as resp:
            resp.raise_for_status()
            async for line in resp.aiter_lines():
                if not line.startswith("data:"):
                    continue
                data = line[5:].strip()
                if data == "[DONE]":
                    break
                try:
                    chunk = _json.loads(data)
                except _json.JSONDecodeError:
                    continue
                delta = (chunk.get("choices") or [{}])[0].get("delta") or {}
                tok = delta.get("content")
                if tok:
                    yield tok
