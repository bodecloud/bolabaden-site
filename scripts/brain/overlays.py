"""Manual overlay apply — exclude / retag / force fields without re-export."""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:  # pragma: no cover
    yaml = None  # type: ignore


def load_overlay_files(overlays_dir: Path) -> list[dict[str, Any]]:
    if not overlays_dir.is_dir():
        return []
    rules: list[dict[str, Any]] = []
    for path in sorted(overlays_dir.glob("*")):
        if path.suffix.lower() not in {".yaml", ".yml", ".json"}:
            continue
        text = path.read_text(encoding="utf-8")
        if path.suffix.lower() == ".json":
            data = json.loads(text)
        else:
            if yaml is None:
                raise RuntimeError("PyYAML required for overlay YAML files")
            data = yaml.safe_load(text) or {}
        if isinstance(data, list):
            rules.extend(data)
        elif isinstance(data, dict):
            if "rules" in data and isinstance(data["rules"], list):
                rules.extend(data["rules"])
            else:
                rules.append(data)
    return rules


def _match(ep: dict[str, Any], rule: dict[str, Any]) -> bool:
    if rule.get("episode_id") and ep.get("id") != rule["episode_id"]:
        return False
    if rule.get("thread_id") and ep.get("thread_id") != rule["thread_id"]:
        return False
    if rule.get("source_family") and ep.get("source_family") != rule["source_family"]:
        return False
    if rule.get("source_path_contains"):
        if rule["source_path_contains"] not in str(ep.get("source_path") or ""):
            return False
    if rule.get("lane_tag"):
        if rule["lane_tag"] not in (ep.get("lane_tags") or []):
            return False
    return True


def apply_overlays(
    episodes: list[dict[str, Any]], overlays_dir: Path
) -> tuple[list[dict[str, Any]], dict[str, int]]:
    rules = load_overlay_files(overlays_dir)
    stats = {"rules": len(rules), "excluded": 0, "retag": 0, "force": 0}
    if not rules:
        return episodes, stats

    out: list[dict[str, Any]] = []
    for ep in episodes:
        drop = False
        for rule in rules:
            action = (rule.get("action") or "").strip().lower()
            if not action or not _match(ep, rule):
                continue
            if action == "exclude":
                drop = True
                stats["excluded"] += 1
                break
            if action == "retag":
                tags = rule.get("lane_tags")
                if isinstance(tags, list):
                    ep = dict(ep)
                    ep["lane_tags"] = [str(t) for t in tags]
                    stats["retag"] += 1
            if action == "force":
                ep = dict(ep)
                for k, v in (rule.get("set") or {}).items():
                    ep[k] = v
                stats["force"] += 1
            if action == "merge_hint":
                ep = dict(ep)
                hints = list(ep.get("merge_hints") or [])
                hints.append(rule.get("merge_with") or rule.get("note") or "")
                ep["merge_hints"] = [h for h in hints if h]
        if not drop:
            out.append(ep)
    return out, stats
