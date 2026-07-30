"""Private brain API — health + search (+ optional Graphiti load)."""

from __future__ import annotations

import os
import secrets
from typing import Any

from fastapi import FastAPI, Header, HTTPException
from pydantic import BaseModel, Field

from . import graphiti_loader, mesh, retrieve

app = FastAPI(title="Boden Brain", version="0.1.0")


class SearchRequest(BaseModel):
    query: str
    k: int = Field(default=8, ge=1, le=50)
    lane: str | None = None
    source_family: str | None = None
    voice_only: bool = False
    channel: str | None = None


class CaseSearchRequest(BaseModel):
    query: str
    k: int = Field(default=5, ge=1, le=20)
    channel: str | None = None


def _auth(authorization: str | None, x_token: str | None) -> None:
    expected = os.environ.get("BRAIN_SERVICE_TOKEN", "").strip()
    if not expected:
        return
    provided = (x_token or "").strip()
    if authorization and authorization.lower().startswith("bearer "):
        provided = authorization[7:].strip()
    if not provided or not secrets.compare_digest(provided, expected):
        raise HTTPException(status_code=401, detail="unauthorized")


@app.get("/health")
async def health(probe: bool = False) -> dict[str, Any]:
    bundle = retrieve.load_bm25()
    case_bundle = retrieve.load_case_bm25()
    man = retrieve.manifest()
    return {
        "ok": True,
        "service": "brain",
        "data_root": str(retrieve.data_root()),
        "episodes_indexed": len(bundle["episodes"]) if bundle else 0,
        "cases_indexed": len(case_bundle["cases"]) if case_bundle else 0,
        "manifest_count": man.get("episode_count"),
        "by_source_family": man.get("by_source_family"),
        # Live LLM-provider probing (slow — 9 sequential API calls) only runs
        # when explicitly requested via ?probe=true. Docker/orchestrator
        # liveness checks need /health to answer in well under their timeout.
        "graphiti": retrieve.graphiti_status(probe=probe),
    }


@app.post("/v1/search")
async def search(
    body: SearchRequest,
    authorization: str | None = Header(default=None),
    x_brain_token: str | None = Header(default=None, alias="X-Brain-Token"),
) -> dict[str, Any]:
    _auth(authorization, x_brain_token)
    q = body.query.strip()
    if not q:
        raise HTTPException(status_code=400, detail="query required")
    hits = retrieve.search(
        q,
        k=body.k,
        lane=body.lane,
        source_family=body.source_family,
        voice_only=body.voice_only,
    )
    return {
        "query": q,
        "hits": [
            {
                "id": h.get("id"),
                "score": h.get("score"),
                "source_family": h.get("source_family"),
                "lane_tags": h.get("lane_tags"),
                "thread_id": h.get("thread_id"),
                "reference_time": h.get("reference_time"),
                "excerpt": (h.get("graphiti_body") or "")[:400],
            }
            for h in hits
        ],
    }


@app.get("/v1/ontology")
async def ontology(
    authorization: str | None = Header(default=None),
    x_brain_token: str | None = Header(default=None, alias="X-Brain-Token"),
) -> dict[str, Any]:
    _auth(authorization, x_brain_token)
    return {"yaml": retrieve.load_ontology()}


@app.post("/v1/graphiti/load")
async def graphiti_load(
    authorization: str | None = Header(default=None),
    x_brain_token: str | None = Header(default=None, alias="X-Brain-Token"),
    limit: int = 200,
) -> dict[str, Any]:
    _auth(authorization, x_brain_token)
    return await graphiti_loader.load_graphiti_bulk(limit=limit)


@app.post("/v1/cases/search")
async def cases_search(
    body: CaseSearchRequest,
    authorization: str | None = Header(default=None),
    x_brain_token: str | None = Header(default=None, alias="X-Brain-Token"),
) -> dict[str, Any]:
    _auth(authorization, x_brain_token)
    q = body.query.strip()
    if not q:
        raise HTTPException(status_code=400, detail="query required")
    hits = retrieve.search_cases(q, k=body.k, channel=body.channel)
    return {"query": q, "hits": hits}


class MeshContextRequest(BaseModel):
    query: str
    k: int = Field(default=8, ge=1, le=20)


@app.post("/v1/mesh/context")
async def mesh_context(
    body: MeshContextRequest,
    authorization: str | None = Header(default=None),
    x_brain_token: str | None = Header(default=None, alias="X-Brain-Token"),
) -> dict[str, Any]:
    _auth(authorization, x_brain_token)
    q = body.query.strip()
    if not q:
        raise HTTPException(status_code=400, detail="query required")
    return mesh.mesh_context(q, k=body.k)


@app.post("/v1/reload")
async def reload_index(
    authorization: str | None = Header(default=None),
    x_brain_token: str | None = Header(default=None, alias="X-Brain-Token"),
) -> dict[str, Any]:
    _auth(authorization, x_brain_token)
    retrieve.clear_caches()
    bundle = retrieve.load_bm25()
    case_bundle = retrieve.load_case_bm25()
    return {
        "ok": True,
        "episodes_indexed": len(bundle["episodes"]) if bundle else 0,
        "cases_indexed": len(case_bundle["cases"]) if case_bundle else 0,
    }
