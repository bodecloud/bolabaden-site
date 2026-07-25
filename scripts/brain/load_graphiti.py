#!/usr/bin/env python3
"""P4: Bulk-load Graphiti episodes export into Neo4j (multi-provider LLM)."""

from __future__ import annotations

import argparse
import asyncio
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from common import DEFAULT_DATA_ROOT, ensure_dirs
from graphiti_llm import build_graphiti, provider_status, resolve_provider_spec


def _parse_reference_time(raw: Any) -> datetime:
    if isinstance(raw, datetime):
        return raw if raw.tzinfo else raw.replace(tzinfo=timezone.utc)
    if isinstance(raw, str) and raw.strip():
        text = raw.strip().replace("Z", "+00:00")
        try:
            dt = datetime.fromisoformat(text)
            return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)
        except ValueError:
            pass
    return datetime.now(timezone.utc)


def _episode_type(source: str):
    from graphiti_core.nodes import EpisodeType  # type: ignore

    mapping = {
        "message": EpisodeType.message,
        "text": EpisodeType.text,
        "json": EpisodeType.json,
    }
    return mapping.get((source or "message").lower(), EpisodeType.message)


def load_export_rows(path: Path, *, limit: int = 0) -> list[dict[str, Any]]:
    rows: list[dict] = []
    with path.open("r", encoding="utf-8") as fh:
        for line in fh:
            if not line.strip():
                continue
            rows.append(json.loads(line))
            if limit and len(rows) >= limit:
                break
    return rows


def rows_to_raw_episodes(rows: list[dict[str, Any]]) -> list[Any]:
    from graphiti_core.utils.bulk_utils import RawEpisode  # type: ignore

    episodes: list[Any] = []
    for row in rows:
        body = (row.get("episode_body") or "").strip()
        if not body:
            continue
        episodes.append(
            RawEpisode(
                name=str(row.get("name") or row.get("metadata", {}).get("episode_id") or "episode"),
                content=body,
                source=_episode_type(str(row.get("source") or "message")),
                source_description=str(row.get("source_description") or "brain export"),
                reference_time=_parse_reference_time(row.get("reference_time")),
            )
        )
    return episodes


async def bulk_load(
    *,
    data_root: Path,
    limit: int = 0,
    batch_size: int = 100,
    group_id: str = "boden_brain",
    init_indices: bool = False,
    dry_run: bool = False,
    provider: str | None = None,
    offset: int = 0,
    continue_on_error: bool = True,
    batch_delay_s: float = 0.0,
    max_batch_retries: int = 3,
) -> dict[str, Any]:
    paths = ensure_dirs(data_root)
    export_path = paths["graphiti"] / "episodes.jsonl"
    if not export_path.is_file():
        return {"ok": False, "error": f"missing {export_path}"}

    uri = os.environ.get("BRAIN_NEO4J_URI", "").strip()
    user = os.environ.get("BRAIN_NEO4J_USER", "neo4j")
    password = os.environ.get("BRAIN_NEO4J_PASSWORD", "")
    if not uri and not dry_run:
        return {"ok": False, "error": "BRAIN_NEO4J_URI not set — BM25-only mode"}

    rows = load_export_rows(export_path, limit=limit or 0)
    llm_status = provider_status()

    if dry_run:
        sample = rows[:3]
        spec = None
        try:
            spec = resolve_provider_spec(provider)
        except RuntimeError as exc:
            llm_status["error"] = str(exc)
        return {
            "ok": True,
            "mode": "dry_run",
            "export_path": str(export_path),
            "rows_selected": len(rows),
            "rows_with_body": sum(1 for r in rows if (r.get("episode_body") or "").strip()),
            "neo4j": uri or "(unset)",
            "batch_size": batch_size,
            "group_id": group_id,
            "sample_names": [r.get("name") for r in sample],
            "llm": llm_status,
            "provider_spec": (
                {
                    "name": spec.name,
                    "llm_model": spec.llm_model,
                    "embed_model": spec.embed_model,
                    "embed_dim": spec.embed_dim,
                }
                if spec
                else None
            ),
        }

    try:
        import graphiti_core  # noqa: F401
    except ImportError:
        return {
            "ok": False,
            "error": "graphiti_core not installed — pip install -r requirements-graphiti.txt",
        }

    try:
        spec = resolve_provider_spec(provider)
    except RuntimeError as exc:
        return {"ok": False, "error": str(exc), "llm": llm_status}

    raw_eps = rows_to_raw_episodes(rows)
    if offset:
        raw_eps = raw_eps[offset:]
    if not raw_eps:
        return {"ok": False, "error": "No non-empty episode bodies in export (after offset)"}

    graphiti = build_graphiti(uri, user, password, provider=provider)
    totals = {"episodes": 0, "nodes": 0, "edges": 0, "batches": 0, "failed_batches": 0}
    failures: list[dict[str, Any]] = []
    state_path = paths["graphiti"] / "load_state.json"

    try:
        if init_indices:
            await graphiti.build_indices_and_constraints()

        for batch_idx, i in enumerate(range(0, len(raw_eps), batch_size)):
            chunk = raw_eps[i : i + batch_size]
            if batch_idx and batch_delay_s > 0:
                await asyncio.sleep(batch_delay_s)

            last_error: Exception | None = None
            for attempt in range(max_batch_retries):
                try:
                    result = await graphiti.add_episode_bulk(
                        bulk_episodes=chunk,
                        group_id=group_id,
                    )
                    last_error = None
                    break
                except Exception as exc:
                    last_error = exc
                    err = str(exc)
                    if attempt + 1 < max_batch_retries and (
                        "429" in err or "rate limit" in err.lower()
                    ):
                        await asyncio.sleep(min(120.0, 15.0 * (2**attempt)))
                        continue
                    break

            if last_error is not None:
                totals["failed_batches"] += 1
                failures.append(
                    {
                        "batch": batch_idx + 1,
                        "offset_episodes": offset + i,
                        "size": len(chunk),
                        "error": str(last_error)[:800],
                    }
                )
                if not continue_on_error:
                    raise last_error
                continue

            totals["batches"] += 1
            totals["episodes"] += len(getattr(result, "episodes", []) or chunk)
            totals["nodes"] += len(getattr(result, "nodes", []) or [])
            totals["edges"] += len(getattr(result, "edges", []) or [])
            state_path.write_text(
                json.dumps(
                    {
                        "last_batch": totals["batches"],
                        "loaded_episodes": totals["episodes"],
                        "offset_episodes": offset + i + len(chunk),
                        "provider": spec.name,
                        "updated_at": datetime.now(timezone.utc).isoformat(),
                    },
                    indent=2,
                ),
                encoding="utf-8",
            )
    finally:
        await graphiti.close()

    report = {
        "ok": totals["episodes"] > 0 or totals["batches"] > 0,
        "mode": "loaded",
        "neo4j": uri,
        "group_id": group_id,
        "provider": spec.name,
        "llm_model": spec.llm_model,
        "embed_model": spec.embed_model,
        "rows_selected": len(rows),
        "offset_episodes": offset,
        "episodes_loaded": totals["episodes"],
        "entities_extracted": totals["nodes"],
        "relationships_extracted": totals["edges"],
        "batches": totals["batches"],
        "failed_batches": totals["failed_batches"],
        "failures": failures[:20],
        "state": str(state_path),
    }
    (paths["graphiti"] / "load_report.json").write_text(
        json.dumps(report, indent=2), encoding="utf-8"
    )
    return report


def main() -> int:
    parser = argparse.ArgumentParser(description="Bulk load Graphiti export into Neo4j")
    parser.add_argument("--data-root", type=Path, default=DEFAULT_DATA_ROOT)
    parser.add_argument("--limit", type=int, default=0, help="Max episodes (0 = all)")
    parser.add_argument("--batch-size", type=int, default=100)
    parser.add_argument("--group-id", default="boden_brain")
    parser.add_argument(
        "--provider",
        default=None,
        help="mistral|openrouter|gemini|huggingface|ollama|groq|auto (default: auto)",
    )
    parser.add_argument("--init-indices", action="store_true", help="Run build_indices_and_constraints first")
    parser.add_argument("--offset", type=int, default=0, help="Skip first N parsed episodes (resume)")
    parser.add_argument(
        "--fail-fast",
        action="store_true",
        help="Stop on first batch error (default: continue and record failures)",
    )
    parser.add_argument(
        "--batch-delay",
        type=float,
        default=0.0,
        help="Seconds to sleep between batches (rate-limit pacing)",
    )
    parser.add_argument(
        "--max-batch-retries",
        type=int,
        default=3,
        help="Retries per batch on 429/rate-limit errors",
    )
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    report = asyncio.run(
        bulk_load(
            data_root=args.data_root,
            limit=args.limit,
            batch_size=args.batch_size,
            group_id=args.group_id,
            init_indices=args.init_indices,
            dry_run=args.dry_run,
            provider=args.provider,
            offset=args.offset,
            continue_on_error=not args.fail_fast,
            batch_delay_s=args.batch_delay,
            max_batch_retries=args.max_batch_retries,
        )
    )
    print(json.dumps(report, indent=2))
    return 0 if report.get("ok") else 1


if __name__ == "__main__":
    raise SystemExit(main())
