#!/usr/bin/env bash
# Launch Chrome for ChatGPT export WITHOUT Playwright automation flags.
# Cloudflare Turnstile rejects browsers with navigator.webdriver / --enable-automation.
#
# Usage:
#   ./scripts/start-chrome-for-export.sh
#   # Complete Cloudflare + login in this window, then in another terminal:
#   node scripts/extract-chatgpt-conversations.mjs --connect --resume

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PROFILE="${CHATGPT_PROFILE_DIR:-$ROOT/scripts/.chatgpt-export-profile}"
PORT="${CHATGPT_CDP_PORT:-9222}"

CHROME="${CHATGPT_CHROMIUM_PATH:-}"
if [[ -z "$CHROME" ]]; then
  for c in google-chrome google-chrome-stable chromium chromium-browser; do
    if command -v "$c" >/dev/null 2>&1; then
      CHROME="$c"
      break
    fi
  done
fi

if [[ -z "$CHROME" ]]; then
  echo "No Chrome/Chromium found. Set CHATGPT_CHROMIUM_PATH." >&2
  exit 1
fi

mkdir -p "$PROFILE"

# Kill stale singleton lock from crashed runs
rm -f "$PROFILE/SingletonLock" "$PROFILE/SingletonSocket" "$PROFILE/SingletonCookie" 2>/dev/null || true

echo "Profile: $PROFILE"
echo "CDP:     http://127.0.0.1:$PORT"
echo ""
echo "1. Complete Cloudflare + login in the window that opens."
echo "2. Confirm chatgpt.com loads (not 'Just a moment...')."
echo "3. Run: node scripts/extract-chatgpt-conversations.mjs --connect --resume"
echo ""

exec "$CHROME" \
  --remote-debugging-port="$PORT" \
  --user-data-dir="$PROFILE" \
  --no-first-run \
  --no-default-browser-check \
  --disable-blink-features=AutomationControlled \
  "https://chatgpt.com/"
