# Patchright + OAuth — how Cloudflare clearance and ChatGPT login work

This is the **working path** for UI-based export when you need Patchright automation (not official zip export, not CDP attach). It combines **Patchright** (stealth Playwright fork) with **patchright-difz** (optional Turnstile auto-click).

Two separate gates must pass:

| Gate | Host | What it checks |
| --- | --- | --- |
| Cloudflare Turnstile | `chatgpt.com` | “Is this browser legit?” (fingerprint + cookies) |
| Google OAuth | `accounts.google.com` | “Is this login flow uninterrupted?” |

Fixing one does **not** fix the other.

## Tools

| Package | Role |
| --- | --- |
| `patchright` | Playwright fork — fewer automation signals |
| `patchright-difz` | Patchright + Turnstile watcher that auto-clicks the CF checkbox |

Scripts live under `scripts/`; browser profile: `scripts/.chatgpt-patchright-profile/` (cookies persist between runs).

## Two-phase browser launch

```text
Phase 1 — Turnstile ON
  → open chatgpt.com only
  → wait for Cloudflare to clear
  → close browser (cf_clearance stays in profile)

Phase 2 — Turnstile OFF
  → reopen same profile
  → login + export (no auto-clicks during Google OAuth)
```

Implemented in `scripts/extract-chatgpt-conversations.mjs` (`runCloudflareBootstrap` then `openBrowser` with `turnstile: false`).

Skip Phase 1 when the profile already has clearance:

```bash
DISPLAY=:0 CHATGPT_SKIP_CF_BOOTSTRAP=1 node scripts/extract-chatgpt-conversations.mjs --resume
```

## What makes the browser pass Turnstile

Configured in `scripts/lib/patchright-launch.mjs`:

- **Headed** window (`headless: false`) — headless is almost always blocked
- **`ignoreDefaultArgs: ['--enable-automation']`** — removes the “controlled by automated test software” banner
- **`--disable-blink-features=AutomationControlled`** — hides a common bot fingerprint
- **System Chromium** default (`/usr/bin/chromium-browser`) — better than Chrome-for-Testing for both CF and Google

Override browser:

```bash
PATCHRIGHT_EXECUTABLE_PATH=/usr/bin/google-chrome node scripts/...
PATCHRIGHT_CHANNEL=chromium node scripts/...   # bundled Chrome-for-Testing
```

When `turnstile: true`, patchright-difz polls for the Turnstile iframe and clicks on an interval. `scripts/lib/cloudflare-turnstile.mjs` waits until challenge titles/URLs disappear.

## Why the first login attempts failed

These were **script bugs**, not “Cloudflare won again”:

| Problem | Symptom | Fix |
| --- | --- | --- |
| Turnstile ON during OAuth | Random clicks on Google pages | Phase 2 launches with `turnstile: false` |
| Navigation during OAuth | `net::ERR_ABORTED`, broken Google flow | `waitForChatGptLogin()` never `goto()`s while on OAuth hosts |
| Chrome-for-Testing | “This browser or app may not be secure” | Default to system Chromium |
| Auth check too early | Jumped to conversation URLs before session existed | `verifyConversationAccess()` only after login cookies present |

OAuth-aware wait is in `scripts/lib/chatgpt-auth.mjs`: on `accounts.google.com`, `auth.openai.com`, etc., the script **only waits** (and optionally clicks “Continue with Google” on OpenAI’s page). You finish sign-in in the headed window.

## Commands

```bash
# Cloudflare probe only (Turnstile ON)
DISPLAY=:0 node scripts/ralph-cloudflare-probe.mjs

# Login diagnostic (CF bootstrap + OAuth wait)
DISPLAY=:0 node scripts/chatgpt-auth-only.mjs

# Full export (first run — includes CF bootstrap)
DISPLAY=:0 node scripts/extract-chatgpt-conversations.mjs --resume

# Resume export (session + cf_clearance already in profile)
DISPLAY=:0 CHATGPT_SKIP_CF_BOOTSTRAP=1 node scripts/extract-chatgpt-conversations.mjs --resume
```

## Logs

| File | Contents |
| --- | --- |
| `scripts/chatgpt-browser.log` | URL changes during OAuth, message counts, CF waits |
| `scripts/chatgpt-export.log` | Export progress and failures |
| `scripts/chatgpt-export-status.json` | Completed / failed conversation IDs |

During a good login, `chatgpt-browser.log` should show `accounts.google.com` without unrelated navigations to `/c/<uuid>` in the middle of OAuth.

## Limits

- Detection changes over time — this is maintenance, not a permanent bypass.
- Auto-click sometimes still needs a manual Turnstile click.
- Deleting `.chatgpt-patchright-profile` forces CF + login again.
- Only use on **your own** ChatGPT account with permission to automate the session.

See also: [CLOUDFLARE.md](./CLOUDFLARE.md) for Turnstile detection signals; [README.md](./README.md) for layout and manifest.
