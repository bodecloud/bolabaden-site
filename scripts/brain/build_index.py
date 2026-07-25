#!/usr/bin/env python3
"""Build BM25 index + Graphiti episode export from canonical IR."""

from __future__ import annotations

import argparse
import json
import pickle
import sys
from pathlib import Path

from common import DEFAULT_DATA_ROOT, ensure_dirs, tokenize

try:
    from rank_bm25 import BM25Okapi
except ImportError:  # pragma: no cover
    BM25Okapi = None  # type: ignore

ONTOLOGY_YAML = """# Boden brain domain ontology (Graphiti custom types seed)
entity_types:
  - name: Person
    description: People mentioned in chats (Boden, peers, handles)
  - name: Project
    description: Software projects, mods, repos (PyKotor, Holocron, site)
  - name: Tool
    description: Tools, libraries, CLIs, editors
  - name: Guild
    description: Discord servers or communities
  - name: Preference
    description: Stated preferences, opinions, taste
  - name: Decision
    description: Explicit decisions or conclusions
  - name: AffectCue
    description: Behavioral affect cues (anger, mania, withdraw) — not clinical diagnosis

edge_types:
  - name: works_on
    description: Person works on Project or Tool
  - name: prefers
    description: Person prefers X
  - name: rejects
    description: Person rejects or dismisses X
  - name: mentions
    description: Episode or person mentions entity
  - name: decided
    description: Person made a Decision
"""


def load_episodes(path: Path) -> list[dict]:
    eps: list[dict] = []
    with path.open("r", encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line:
                eps.append(json.loads(line))
    return eps


def search_text(ep: dict) -> str:
    body = ep.get("graphiti_body") or ""
    tags = " ".join(ep.get("lane_tags") or [])
    return f"{body}\n{ep.get('source_family')} {tags}"


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-root", type=Path, default=DEFAULT_DATA_ROOT)
    args = parser.parse_args()
    paths = ensure_dirs(args.data_root)
    if not paths["episodes_jsonl"].is_file():
        print("Missing episodes — run ingest.py", file=sys.stderr)
        return 1
    if BM25Okapi is None:
        print("rank-bm25 missing", file=sys.stderr)
        return 1

    episodes = load_episodes(paths["episodes_jsonl"])
    tokens = [tokenize(search_text(e)) for e in episodes]
    bm25 = BM25Okapi(tokens)
    slim = [
        {
            "id": e["id"],
            "source_family": e.get("source_family"),
            "lane_tags": e.get("lane_tags"),
            "thread_id": e.get("thread_id"),
            "reference_time": e.get("reference_time"),
            "graphiti_body": e.get("graphiti_body"),
            "privacy": e.get("privacy"),
            "extra": e.get("extra"),
        }
        for e in episodes
    ]
    with paths["bm25_pkl"].open("wb") as fh:
        pickle.dump({"bm25": bm25, "episodes": slim}, fh)

    graphiti_out = paths["graphiti"] / "episodes.jsonl"
    with graphiti_out.open("w", encoding="utf-8") as fh:
        for e in episodes:
            fh.write(
                json.dumps(
                    {
                        "name": f"brain-{e['id']}",
                        "episode_body": e.get("graphiti_body") or "",
                        "source": "message",
                        "source_description": f"{e.get('source_family')}:{','.join(e.get('lane_tags') or [])}",
                        "reference_time": e.get("reference_time"),
                        "group_id": e.get("source_family") or "brain",
                        "metadata": {
                            "episode_id": e["id"],
                            "source_family": e.get("source_family"),
                            "lane_tags": e.get("lane_tags"),
                            "thread_id": e.get("thread_id"),
                        },
                    },
                    ensure_ascii=False,
                )
                + "\n"
            )

    paths["ontology"].write_text(ONTOLOGY_YAML, encoding="utf-8")
    (paths["graphiti"] / "GRAPHITI.md").write_text(
        """# Graphiti load notes

Episodes: `episodes.jsonl` (message-format bodies).

```python
# Prefer add_episode_bulk for initial load (50-200 / batch).
# Use add_episode for incremental updates when edge invalidation matters.
# Set reference_time from IR. Custom entity_types from ontology.yaml.
```

BM25 at `../index/bm25.pkl` is the always-on fallback when Neo4j/LLM is down.
""",
        encoding="utf-8",
    )
    (paths["index"] / "bm25_meta.json").write_text(
        json.dumps({"backend": "bm25", "episode_count": len(episodes)}, indent=2),
        encoding="utf-8",
    )
    print(f"BM25 + Graphiti export: {len(episodes)} episodes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
