"""Source adapters → canonical brain episodes."""

from __future__ import annotations

import json
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterator

from common import (
    BODEN_AUTHOR_ID,
    DEFAULT_DISCORD_ROOT,
    DEFAULT_REPO_ROOT,
    DISCORD_SOURCE_TAG,
    episode_id,
    is_boden_discord,
    scrub_pii,
)

GAP_SECONDS = 30 * 60
MAX_MSGS_PER_EPISODE = 24


def _parse_ts(raw: str | None) -> datetime | None:
    if not raw:
        return None
    try:
        return datetime.fromisoformat(raw.replace("Z", "+00:00"))
    except ValueError:
        return None


def _iso(dt: datetime | None) -> str:
    if not dt:
        return datetime.now(timezone.utc).isoformat()
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.isoformat()


def _graphiti_body(messages: list[dict[str, str]]) -> str:
    lines = []
    for m in messages:
        name = m.get("speaker_name") or m.get("speaker") or "unknown"
        lines.append(f"{name}: {m.get('text', '')}")
    return "\n".join(lines)


def make_episode(
    *,
    source_family: str,
    source_path: str,
    thread_id: str,
    reference_time: str,
    speakers: list[dict[str, str]],
    messages: list[dict[str, str]],
    lane_tags: list[str],
    privacy: str = "private",
    extra: dict[str, Any] | None = None,
) -> dict[str, Any]:
    eid = episode_id(
        [
            source_family,
            thread_id,
            reference_time,
            messages[0].get("text", "")[:80] if messages else "",
            str(len(messages)),
        ]
    )
    ep: dict[str, Any] = {
        "id": eid,
        "source_family": source_family,
        "source_path": source_path,
        "thread_id": thread_id,
        "reference_time": reference_time,
        "speakers": speakers,
        "messages": messages,
        "lane_tags": lane_tags,
        "privacy": privacy,
        "graphiti_body": _graphiti_body(messages),
    }
    if extra:
        ep["extra"] = extra
    return ep


# --- Discord -----------------------------------------------------------------


def iter_discord_json(root: Path) -> Iterator[Path]:
    for path in sorted(root.rglob("*.json")):
        if path.parent.name.endswith("_Files") or path.name.endswith("_Files"):
            continue
        if path.name == "blue_condense.json":
            continue
        if path.stat().st_size < 200:
            continue
        # skip broken DCE temp trees
        if ".dce-temp" in path.parts:
            continue
        yield path


def dedupe_discord_paths(files: list[Path]) -> list[Path]:
    by_stem: dict[str, list[Path]] = {}
    for f in files:
        base = f.stem.split(" (")[0]
        by_stem.setdefault(base, []).append(f)
    out: list[Path] = []
    for group in by_stem.values():
        group.sort(key=lambda p: p.stat().st_size, reverse=True)
        out.append(group[0])
    return out


def _discord_family(path: Path, export_root: Path) -> tuple[str, list[str]]:
    try:
        top = path.resolve().relative_to(export_root.resolve()).parts[0]
    except ValueError:
        top = path.parent.name
    family = DISCORD_SOURCE_TAG.get(top, "discord_guild")
    tags = ["voice", "dm"] if family == "discord_dm" else ["voice", "guild", top.lower()]
    return family, tags


def adapt_discord_file(
    path: Path,
    export_root: Path,
    *,
    max_episodes: int | None = None,
) -> list[dict[str, Any]]:
    try:
        with path.open("r", encoding="utf-8", errors="replace") as fh:
            data = json.load(fh)
    except (json.JSONDecodeError, OSError):
        return []
    if not isinstance(data, dict):
        return []
    messages = data.get("messages") or []
    if not isinstance(messages, list) or not messages:
        return []

    channel = data.get("channel") or {}
    guild = data.get("guild") or {}
    family, lane_tags = _discord_family(path, export_root)
    channel_id = str(channel.get("id") or path.stem)
    episodes: list[dict[str, Any]] = []

    # Build chronological windows: group by gap into thread slices that include Boden
    window: list[dict[str, Any]] = []
    last_ts: datetime | None = None

    def flush() -> None:
        nonlocal window
        if not window:
            return
        if not any(is_boden_discord(m.get("author")) for m in window):
            window = []
            return
        speakers_map: dict[str, dict[str, str]] = {}
        msgs: list[dict[str, str]] = []
        for m in window[-MAX_MSGS_PER_EPISODE:]:
            author = m.get("author") or {}
            aid = str(author.get("id") or "")
            name = scrub_pii(str(author.get("nickname") or author.get("name") or "user"))
            if is_boden_discord(author):
                role = "boden"
                name = "Boden"
            else:
                role = "peer"
            speakers_map[aid or name] = {"id": aid, "name": name, "role": role}
            text = scrub_pii((m.get("content") or "").strip())
            if not text and m.get("attachments"):
                text = "[attachment]"
            if not text:
                continue
            msgs.append(
                {
                    "speaker": aid or name,
                    "speaker_name": name,
                    "role": role,
                    "text": text[:4000],
                    "ts": str(m.get("timestamp") or ""),
                }
            )
        if not msgs:
            window = []
            return
        ref = msgs[0].get("ts") or _iso(None)
        episodes.append(
            make_episode(
                source_family=family,
                source_path=str(path),
                thread_id=f"{channel_id}:{msgs[0].get('ts', '')}",
                reference_time=ref,
                speakers=list(speakers_map.values()),
                messages=msgs,
                lane_tags=lane_tags,
                extra={
                    "guild_id": str(guild.get("id") or ""),
                    "guild_name": scrub_pii(str(guild.get("name") or "")),
                    "channel_name": scrub_pii(str(channel.get("name") or "")),
                    "boden_author_id": BODEN_AUTHOR_ID,
                },
            )
        )
        window = []

    for m in messages:
        ts = _parse_ts(m.get("timestamp"))
        if last_ts and ts and (ts - last_ts).total_seconds() >= GAP_SECONDS:
            flush()
        window.append(m)
        last_ts = ts or last_ts
        if max_episodes is not None and len(episodes) >= max_episodes:
            break
    flush()
    if max_episodes is not None:
        return episodes[:max_episodes]
    return episodes


# --- ChatGPT / Perplexity markdown -------------------------------------------

FRONTMATTER_RE = re.compile(r"^---\n(.*?)\n---\n", re.DOTALL)
SPEAKER_LINE_RE = re.compile(
    r"^(?:#{1,3}\s+)?(?:\*\*)?(User|Assistant|Human|ChatGPT|Perplexity|You|Boden)(?:\*\*)?\s*:?\s*$",
    re.IGNORECASE,
)


def _parse_md_thread(path: Path, source_family: str) -> dict[str, Any] | None:
    raw = path.read_text(encoding="utf-8", errors="replace")
    title = path.stem
    conv_id = path.stem
    m = FRONTMATTER_RE.match(raw)
    body = raw
    if m:
        body = raw[m.end() :]
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                k, v = k.strip().lower(), v.strip().strip("\"'")
                if k in {"title", "name"}:
                    title = v or title
                if k in {"id", "conversation_id", "conversation-id"}:
                    conv_id = v or conv_id

    # Split on speaker headers / bold labels
    lines = body.splitlines()
    messages: list[dict[str, str]] = []
    current_role = "user"
    current_name = "User"
    buf: list[str] = []

    def push() -> None:
        text = scrub_pii("\n".join(buf).strip())
        if not text:
            return
        role = "assistant" if current_role in {"assistant", "chatgpt", "perplexity"} else "user"
        # knowledge lane — never mark as boden voice
        messages.append(
            {
                "speaker": role,
                "speaker_name": current_name,
                "role": role,
                "text": text[:8000],
                "ts": "",
            }
        )

    for line in lines:
        sm = SPEAKER_LINE_RE.match(line.strip())
        if sm:
            push()
            buf = []
            label = sm.group(1).lower()
            if label in {"assistant", "chatgpt", "perplexity"}:
                current_role = "assistant"
                current_name = sm.group(1)
            else:
                current_role = "user"
                current_name = "User"
            continue
        # Alternate heuristic: **User** / **Assistant** inline
        if line.strip().startswith("**") and line.strip().endswith("**"):
            label = line.strip().strip("*").lower()
            if label in {"user", "assistant", "human", "chatgpt", "you"}:
                push()
                buf = []
                if label in {"assistant", "chatgpt"}:
                    current_role = "assistant"
                    current_name = "Assistant"
                else:
                    current_role = "user"
                    current_name = "User"
                continue
        buf.append(line)
    push()

    if not messages:
        # Whole file as one knowledge blob
        text = scrub_pii(body.strip())[:12000]
        if not text:
            return None
        messages = [
            {
                "speaker": "user",
                "speaker_name": "User",
                "role": "user",
                "text": text,
                "ts": "",
            }
        ]

    mtime = datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc)
    lane = ["knowledge", source_family]
    return make_episode(
        source_family=source_family,
        source_path=str(path),
        thread_id=conv_id,
        reference_time=_iso(mtime),
        speakers=[
            {"id": "user", "name": "User", "role": "user"},
            {"id": "assistant", "name": "Assistant", "role": "assistant"},
        ],
        messages=messages,
        lane_tags=lane,
        privacy="private",
        extra={"title": scrub_pii(title)},
    )


def adapt_chatgpt_dir(repo_root: Path, *, limit: int = 0) -> list[dict[str, Any]]:
    base = repo_root / "docs" / "knowledgebase" / "90-meta" / "chatgpt-exports" / "conversations"
    if not base.is_dir():
        return []
    files = sorted(base.glob("*.md"))
    if limit:
        files = files[:limit]
    out: list[dict[str, Any]] = []
    for f in files:
        ep = _parse_md_thread(f, "chatgpt")
        if ep:
            out.append(ep)
    return out


def adapt_perplexity_dir(repo_root: Path, *, limit: int = 0) -> list[dict[str, Any]]:
    base = (
        repo_root / "docs" / "knowledgebase" / "90-meta" / "perplexity-exports" / "conversations"
    )
    if not base.is_dir():
        return []
    files = sorted(base.glob("*.md"))
    if limit:
        files = files[:limit]
    out: list[dict[str, Any]] = []
    for f in files:
        ep = _parse_md_thread(f, "perplexity")
        if ep:
            out.append(ep)
    return out


def adapt_kb_markdown(repo_root: Path, *, limit: int = 0) -> list[dict[str, Any]]:
    """Tagged knowledge lane — other markdown under 90-meta (not unlabeled into Discord)."""
    base = repo_root / "docs" / "knowledgebase" / "90-meta"
    if not base.is_dir():
        return []
    skip_parts = {"chatgpt-exports", "perplexity-exports", "identity-exports"}
    files = [
        p
        for p in sorted(base.rglob("*.md"))
        if not any(s in p.parts for s in skip_parts) and p.name.lower() not in {"readme.md", "index.md"}
    ]
    if limit:
        files = files[:limit]
    out: list[dict[str, Any]] = []
    for f in files:
        ep = _parse_md_thread(f, "kb")
        if ep:
            ep["lane_tags"] = ["knowledge", "kb"]
            out.append(ep)
    return out


def adapt_xfire_meta(paths: list[Path]) -> list[dict[str, Any]]:
    """Xfire is theme/meta — one episode per readable config/text sidecar, not dialogue."""
    out: list[dict[str, Any]] = []
    for path in paths:
        if not path.is_file():
            continue
        if path.suffix.lower() not in {".ini", ".txt", ".cfg", ".xml", ".json"}:
            continue
        try:
            text = scrub_pii(path.read_text(encoding="utf-8", errors="replace")[:6000])
        except OSError:
            continue
        if not text.strip():
            continue
        out.append(
            make_episode(
                source_family="xfire",
                source_path=str(path),
                thread_id=path.name,
                reference_time=_iso(datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc)),
                speakers=[{"id": "archive", "name": "archive", "role": "meta"}],
                messages=[
                    {
                        "speaker": "archive",
                        "speaker_name": "archive",
                        "role": "meta",
                        "text": text,
                        "ts": "",
                    }
                ],
                lane_tags=["theme", "meta", "xfire"],
                privacy="private",
            )
        )
    return out


def find_xfire_candidates() -> list[Path]:
    """Shallow, bounded discovery — never deep-walk huge disks."""
    roots = [
        Path.home() / "Documents",
        Path.home() / "Downloads",
    ]
    found: list[Path] = []
    for root in roots:
        if not root.is_dir():
            continue
        try:
            for p in root.iterdir():
                if "xfire" in p.name.lower() and p.is_file():
                    found.append(p)
                elif p.is_dir() and "xfire" in p.name.lower():
                    for child in list(p.glob("*.ini")) + list(p.glob("*.txt")) + list(p.glob("*.cfg")):
                        found.append(child)
                        if len(found) >= 40:
                            return found
        except OSError:
            continue
    return found
