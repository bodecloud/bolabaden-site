"""Graph / mesh context for cognitive deliberation (Neo4j when loaded)."""

from __future__ import annotations

import os
import re
from typing import Any

from .retrieve import tokenize


def _neo4j_driver():
    uri = os.environ.get("BRAIN_NEO4J_URI", "").strip()
    password = os.environ.get("BRAIN_NEO4J_PASSWORD", "")
    user = os.environ.get("BRAIN_NEO4J_USER", "neo4j")
    if not uri or not password:
        return None
    try:
        from neo4j import GraphDatabase  # type: ignore
    except ImportError:
        return None
    try:
        return GraphDatabase.driver(uri, auth=(user, password))
    except Exception:
        return None


def mesh_context(query: str, *, k: int = 8) -> dict[str, Any]:
    """Return thread/entity hints from Neo4j when graph is populated."""
    tokens = [t for t in tokenize(query) if len(t) >= 3][:12]
    out: dict[str, Any] = {
        "available": False,
        "entity_names": [],
        "episode_names": [],
        "thread_ids": [],
        "tokens_queried": tokens,
    }
    if not tokens:
        return out

    driver = _neo4j_driver()
    if driver is None:
        return out

    try:
        with driver.session() as session:
            count = session.run("MATCH (n) RETURN count(n) AS c").single()["c"]
            if count < 5:
                out["note"] = "graph_sparse"
                return out

            # Graphiti entity nodes typically have `name`; episodic nodes have `name` + content
            entity_rows = session.run(
                """
                MATCH (n:Entity)
                WHERE any(t IN $tokens WHERE toLower(n.name) CONTAINS t)
                RETURN n.name AS name
                LIMIT $k
                """,
                tokens=tokens,
                k=k,
            )
            entities = [r["name"] for r in entity_rows if r.get("name")]

            episode_rows = session.run(
                """
                MATCH (n:Episodic)
                WHERE any(t IN $tokens WHERE toLower(coalesce(n.name, '')) CONTAINS t
                       OR toLower(coalesce(n.content, '')) CONTAINS t)
                RETURN n.name AS name
                LIMIT $k
                """,
                tokens=tokens,
                k=k,
            )
            episodes = [r["name"] for r in episode_rows if r.get("name")]

            # Pull thread_id-like refs from episodic metadata if present
            thread_rows = session.run(
                """
                MATCH (n:Episodic)
                WHERE n.source_description IS NOT NULL
                  AND any(t IN $tokens WHERE toLower(n.source_description) CONTAINS t)
                RETURN DISTINCT n.source_description AS ref
                LIMIT $k
                """,
                tokens=tokens,
                k=k,
            )
            refs = [r["ref"] for r in thread_rows if r.get("ref")]

            out.update(
                {
                    "available": bool(entities or episodes or refs),
                    "entity_names": entities,
                    "episode_names": episodes,
                    "thread_ids": refs,
                    "node_count": count,
                }
            )
    except Exception as exc:  # pragma: no cover
        out["error"] = str(exc)
    finally:
        driver.close()

    return out


def mesh_boost_for_case(case: dict[str, Any], mesh: dict[str, Any]) -> float:
    """Score multiplier when case text overlaps graph-derived context."""
    if not mesh.get("available"):
        return 1.0
    hay = " ".join(
        [
            case.get("stimulus") or "",
            " ".join(case.get("response_messages") or []),
            " ".join(case.get("topics") or []),
            str(case.get("thread_id") or ""),
        ]
    ).lower()
    hits = 0
    for name in mesh.get("entity_names") or []:
        if name and name.lower() in hay:
            hits += 1
    for ref in mesh.get("thread_ids") or []:
        if ref and ref.lower() in hay:
            hits += 1
    if hits >= 2:
        return 1.2
    if hits == 1:
        return 1.1
    return 1.0
