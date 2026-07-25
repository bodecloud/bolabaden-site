"""BodenAI twin API — configurable cognitive decision modes."""

from __future__ import annotations

import json
import os
import secrets
from typing import Any

from fastapi import FastAPI, Header, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from . import cognitive, twin

app = FastAPI(title="BodenAI Twin", version="0.4.0")

VALID_DECISION_MODES = frozenset({"case_select", "mesh_replay", "pfc_loop", "hybrid"})


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage] = Field(default_factory=list)
    decision_mode: str | None = Field(
        default=None,
        description="Override BODENAI_DECISION_MODE for this request",
    )


class DecideCompareRequest(BaseModel):
    query: str
    modes: list[str] | None = Field(
        default=None,
        description="Modes to compare; defaults to all supported modes",
    )


def _auth(authorization: str | None, x_token: str | None) -> None:
    expected = os.environ.get("BODENAI_SERVICE_TOKEN", "").strip()
    if not expected:
        return
    provided = (x_token or "").strip()
    if authorization and authorization.lower().startswith("bearer "):
        provided = authorization[7:].strip()
    if not provided or not secrets.compare_digest(provided, expected):
        raise HTTPException(status_code=401, detail="unauthorized")


def _resolve_mode(body_mode: str | None, header_mode: str | None) -> str:
    raw = (body_mode or header_mode or os.environ.get("BODENAI_DECISION_MODE") or "case_select").strip().lower()
    if raw not in VALID_DECISION_MODES:
        raw = "case_select"
    return raw


def _sse(event: str, data: dict[str, Any]) -> str:
    return f"event: {event}\ndata: {json.dumps(data, ensure_ascii=False)}\n\n"


@app.get("/health")
async def health() -> dict[str, Any]:
    brain_ok = False
    brain_detail: Any = None
    try:
        import httpx

        async with httpx.AsyncClient(timeout=5.0) as client:
            r = await client.get(f"{twin.brain_base()}/health", headers=twin.brain_headers())
            brain_ok = r.is_success
            brain_detail = r.json() if r.is_success else r.text
    except Exception as exc:  # noqa: BLE001
        brain_detail = str(exc)
    default_mode = cognitive.decision_mode().value
    return {
        "ok": brain_ok,
        "service": "bodenai",
        "brain_base": twin.brain_base(),
        "brain": brain_detail,
        "llm_configured": bool(os.environ.get("BODENAI_LLM_BASE_URL", "").strip()),
        "decision_mode_default": default_mode,
        "decision_modes": sorted(VALID_DECISION_MODES),
        "mode": default_mode,
    }


@app.post("/v1/chat")
async def chat(
    body: ChatRequest,
    authorization: str | None = Header(default=None),
    x_bodenai_token: str | None = Header(default=None, alias="X-BodenAI-Token"),
    x_decision_mode: str | None = Header(default=None, alias="X-BodenAI-Decision-Mode"),
) -> StreamingResponse:
    _auth(authorization, x_bodenai_token)
    user_text = ""
    for m in reversed(body.messages):
        if m.role == "user" and m.content.strip():
            user_text = m.content.strip()
            break
    if not user_text:
        raise HTTPException(status_code=400, detail="user message required")

    mode = _resolve_mode(body.decision_mode, x_decision_mode)

    async def stream():
        try:
            case_hits = await twin.brain_case_search(user_text, k=8)
            trace = await cognitive.decide_online(user_text, case_hits, mode=mode)
            gate = trace.gate

            yield _sse(
                "trace",
                {
                    "decision_mode": trace.mode,
                    "topics": trace.topics,
                    "affect": trace.affect,
                    "engagement": trace.engagement,
                    "steps": trace.steps,
                },
            )

            for h in (gate.support or case_hits)[:3]:
                yield _sse(
                    "citation",
                    {
                        "case_id": h.get("id"),
                        "stimulus_type": h.get("stimulus_type"),
                        "channel": h.get("channel"),
                        "score": h.get("policy_score", h.get("score")),
                        "moves": h.get("boden_moves"),
                    },
                )

            if not gate.allowed:
                if gate.mode == "silence":
                    yield _sse("token", {"text": ""})
                else:
                    yield _sse("token", {"text": "…"})
                yield _sse(
                    "done",
                    {
                        "mode": gate.mode,
                        "decision_mode": trace.mode,
                        "reason": gate.reason,
                        "score": gate.score,
                    },
                )
                return

            responses = gate.responses or []
            out_mode = gate.mode or "select"

            if out_mode in {"select", "burst"} and responses:
                for i, msg in enumerate(responses):
                    if not twin.passes_anti_assistant(msg):
                        continue
                    yield _sse("token", {"text": msg})
                    if out_mode == "burst" and i < len(responses) - 1:
                        yield _sse("burst", {"index": i})
                yield _sse(
                    "done",
                    {
                        "mode": out_mode,
                        "decision_mode": trace.mode,
                        "score": gate.score,
                        "case_id": trace.case_id,
                        "llm": False,
                        "verbatim": True,
                    },
                )
                return

            if os.environ.get("BODENAI_LLM_BASE_URL"):
                case = gate.case or {}
                case_block = json.dumps(
                    {
                        "stimulus": case.get("stimulus_excerpt") or case.get("stimulus"),
                        "responses": case.get("response_messages"),
                    },
                    ensure_ascii=False,
                )
                messages = [
                    {"role": "system", "content": twin.ANTI},
                    {
                        "role": "user",
                        "content": f"Visitor:\n{user_text}\n\nMatched case:\n{case_block}\n\nReply as Boden.",
                    },
                ]
                async for tok in twin.stream_llm(messages):
                    yield _sse("token", {"text": tok})
                yield _sse(
                    "done",
                    {
                        "mode": "generate",
                        "decision_mode": trace.mode,
                        "score": gate.score,
                        "llm": True,
                    },
                )
                return

            yield _sse("token", {"text": responses[0][:220] if responses else "k"})
            yield _sse(
                "done",
                {
                    "mode": "select",
                    "decision_mode": trace.mode,
                    "score": gate.score,
                    "llm": False,
                },
            )

        except Exception as exc:  # noqa: BLE001
            yield _sse("error", {"message": str(exc)})

    return StreamingResponse(stream(), media_type="text/event-stream")


@app.post("/v1/decide/compare")
async def decide_compare(
    body: DecideCompareRequest,
    authorization: str | None = Header(default=None),
    x_bodenai_token: str | None = Header(default=None, alias="X-BodenAI-Token"),
) -> dict[str, Any]:
    """Compare decision modes on one stimulus (agent/human friendly)."""
    _auth(authorization, x_bodenai_token)
    query = body.query.strip()
    if not query:
        raise HTTPException(status_code=400, detail="query required")

    modes = body.modes or sorted(VALID_DECISION_MODES)
    for m in modes:
        if m not in VALID_DECISION_MODES:
            raise HTTPException(status_code=400, detail=f"unknown mode: {m}")

    case_hits = await twin.brain_case_search(query, k=8)
    comparisons: list[dict[str, Any]] = []
    for mode in modes:
        trace = await cognitive.decide_online(query, case_hits, mode=mode)
        comparisons.append(
            {
                "mode": trace.mode,
                "allowed": trace.gate.allowed,
                "gate_mode": trace.gate.mode,
                "score": trace.gate.score,
                "case_id": trace.case_id,
                "response_preview": (trace.response_text or "")[:400],
                "topics": trace.topics,
                "affect": trace.affect,
                "steps": trace.steps,
            }
        )

    return {
        "query": query,
        "default_mode": cognitive.decision_mode().value,
        "comparisons": comparisons,
    }
