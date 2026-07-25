#!/usr/bin/env python3
"""Probe cloud LLM providers, sync secrets.env, optional key refresh."""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

from graphiti_llm import fallback_chain, probe_provider, provider_status
from sync_secrets import cmd_sync as sync_secrets_cmd

SECRETS_PATH = Path.home() / ".config" / "secrets.env"


def cmd_status(_: argparse.Namespace) -> int:
    print(json.dumps(provider_status(), indent=2))
    return 0


def cmd_probe(_: argparse.Namespace) -> int:
    rows = [probe_provider(name) for name in fallback_chain()]
    print(json.dumps(rows, indent=2))
    return 0


def cmd_refresh_openrouter(_: argparse.Namespace) -> int:
    from sync_secrets import collect_key_candidates, pick_best_or_key

    candidates = collect_key_candidates("OPENROUTER_API_KEY")
    key = pick_best_or_key(candidates)
    if key:
        tmp = Path("/tmp/openrouter_key_found.txt")
        tmp.write_text(key, encoding="utf-8")
        print("OpenRouter key validated from local sources; run sync-secrets")
        return 0

    try:
        from playwright.sync_api import sync_playwright  # type: ignore
    except ImportError:
        print("playwright not installed; no OpenRouter key found locally", file=sys.stderr)
        return 1

    profile = Path.home() / ".cache/boden-openrouter-auth"
    profile.mkdir(parents=True, exist_ok=True)

    with sync_playwright() as p:
        for channel in ("chrome", None):
            try:
                kwargs: dict = {"headless": True}
                if channel:
                    kwargs["channel"] = channel
                ctx = p.chromium.launch_persistent_context(str(profile), **kwargs)
                break
            except Exception:
                ctx = None
        if ctx is None:
            print("Could not launch browser for OpenRouter auth", file=sys.stderr)
            return 1
        page = ctx.pages[0] if ctx.pages else ctx.new_page()
        page.goto("https://openrouter.ai/settings/keys", wait_until="domcontentloaded", timeout=60000)
        if "sign-in" in page.url:
            btn = page.get_by_role("button", name=re.compile("GitHub", re.I))
            if btn.count():
                btn.first.click()
                page.wait_for_timeout(5000)
        try:
            page.wait_for_url(re.compile(r".*/keys.*"), timeout=120_000)
        except Exception:
            ctx.close()
            print("OpenRouter sign-in required — log in at https://openrouter.ai/settings/keys", file=sys.stderr)
            return 1
        page.wait_for_timeout(2000)
        html = page.content()
        match = re.search(r"sk-or-v1-[A-Za-z0-9_-]{20,}", html)
        ctx.close()
        if not match:
            return 1
        key = match.group(0)

    tmp = Path("/tmp/openrouter_key_found.txt")
    tmp.write_text(key, encoding="utf-8")
    print("OpenRouter key discovered; run sync-secrets to write secrets.env")
    return 0


def cmd_refresh_hf(_: argparse.Namespace) -> int:
    from sync_secrets import parse_hf_stored_tokens, pick_best_hf

    candidates = list(parse_hf_stored_tokens().values())
    cache = Path.home() / ".cache/huggingface/token"
    if cache.is_file():
        candidates.append(cache.read_text(encoding="utf-8").strip())
    token = pick_best_hf([c for c in candidates if c])
    if token:
        cache.parent.mkdir(parents=True, exist_ok=True)
        cache.write_text(token + "\n", encoding="utf-8")
        print("HF token synced from huggingface-cli cache; run sync-secrets")
        return 0
    print("HF credits depleted or token invalid — run: hf auth login", file=sys.stderr)
    return 1


def cmd_setup(_: argparse.Namespace) -> int:
    steps: dict[str, int] = {}
    steps["refresh-hf"] = cmd_refresh_hf(argparse.Namespace())
    steps["refresh-openrouter"] = cmd_refresh_openrouter(argparse.Namespace())
    steps["sync-secrets"] = sync_secrets_cmd(argparse.Namespace(dry_run=False))
    report = {
        "steps": steps,
        "status": provider_status(),
        "probes": [probe_provider(n) for n in fallback_chain()],
    }
    print(json.dumps(report, indent=2))
    return 0 if report["status"].get("provider") else 1


def main() -> int:
    parser = argparse.ArgumentParser(description="LLM provider status and key refresh")
    sub = parser.add_subparsers(dest="cmd", required=True)
    sub.add_parser("status", help="Show provider status").set_defaults(func=cmd_status)
    sub.add_parser("probe", help="Probe fallback chain").set_defaults(func=cmd_probe)
    sub.add_parser("refresh-openrouter", help="Try persistent browser OpenRouter key scrape").set_defaults(
        func=cmd_refresh_openrouter
    )
    sub.add_parser("refresh-hf", help="HF auth hint").set_defaults(func=cmd_refresh_hf)
    p_sync = sub.add_parser("sync-secrets", help="Dedupe/normalize ~/.config/secrets.env")
    p_sync.add_argument("--dry-run", action="store_true")
    p_sync.set_defaults(func=lambda a: sync_secrets_cmd(a))
    sub.add_parser("setup", help="Refresh + sync secrets + probe").set_defaults(func=cmd_setup)
    args = parser.parse_args()
    return args.func(args)


if __name__ == "__main__":
    raise SystemExit(main())
