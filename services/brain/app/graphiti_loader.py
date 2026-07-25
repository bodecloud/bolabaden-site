"""Optional Graphiti bulk load from IR export (remote LLM + Neo4j)."""

from __future__ import annotations

import asyncio
import sys
from pathlib import Path
from typing import Any


def _brain_scripts() -> Path:
    return Path(__file__).resolve().parents[3] / "scripts" / "brain"


def _import_bulk_load():
    scripts = _brain_scripts()
    if str(scripts) not in sys.path:
        sys.path.insert(0, str(scripts))
    from load_graphiti import bulk_load  # type: ignore

    return bulk_load


async def load_graphiti_bulk(*, limit: int = 200, init_indices: bool = False) -> dict[str, Any]:
    """Load message episodes into Graphiti when deps + Neo4j are available."""
    from .retrieve import data_root

    bulk_load = _import_bulk_load()
    return await bulk_load(
        data_root=data_root(),
        limit=limit,
        batch_size=min(max(limit, 50), 200) if limit else 100,
        init_indices=init_indices,
        dry_run=False,
    )


async def graphiti_plan(*, limit: int = 200) -> dict[str, Any]:
    """Dry-run summary for /health and operator checks."""
    from .retrieve import data_root

    bulk_load = _import_bulk_load()
    return await bulk_load(data_root=data_root(), limit=limit, dry_run=True)
