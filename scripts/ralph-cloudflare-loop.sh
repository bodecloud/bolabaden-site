#!/usr/bin/env bash
# Ralph loop: retry Patchright + Turnstile click until probe passes or max iterations.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
MAX="${RALPH_MAX_ITERATIONS:-15}"
LOG="$ROOT/scripts/ralph-cloudflare.log"

cd "$ROOT"
: > "$LOG"

echo "Ralph Cloudflare loop (max $MAX iterations) — log: $LOG"

for i in $(seq 1 "$MAX"); do
  echo "========== ITERATION $i / $MAX $(date -Is) ==========" | tee -a "$LOG"

  pkill -f "chatgpt-patchright-profile" 2>/dev/null || true
  rm -f "$ROOT/scripts/.chatgpt-patchright-profile/SingletonLock" 2>/dev/null || true
  sleep 2

  if node scripts/ralph-cloudflare-probe.mjs 2>&1 | tee -a "$LOG"; then
    echo "========== RALPH SUCCESS iteration $i ==========" | tee -a "$LOG"
    exit 0
  fi

  echo "========== RALPH RETRY iteration $i failed ==========" | tee -a "$LOG"
  sleep 5
done

echo "========== RALPH GAVE UP after $MAX iterations ==========" | tee -a "$LOG"
exit 1
