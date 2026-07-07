# ChatGPT exports

Full-thread markdown exports from user-provided ChatGPT conversation URLs.

## Primary: Patchright + patchright-difz (system Chromium)

Two-phase browser: Cloudflare bootstrap with Turnstile auto-solver, then auth/export **without** Turnstile clicks (so Google OAuth is not interrupted).

```bash
# First run (complete Google login in the headed browser when prompted)
DISPLAY=:0 node scripts/extract-chatgpt-conversations.mjs --resume

# Resume after session is saved in scripts/.chatgpt-patchright-profile/
DISPLAY=:0 CHATGPT_SKIP_CF_BOOTSTRAP=1 node scripts/extract-chatgpt-conversations.mjs --resume

# Login-only diagnostic
DISPLAY=:0 node scripts/chatgpt-auth-only.mjs
```

Browser console/navigation log: `scripts/chatgpt-browser.log`

## Alternative: official export (no browser)

## Layout

- `index.md` — manifest
- `conversations/` — one markdown file per thread (`<slug>__<uuid>.md`)
- `CLOUDFLARE.md` — Turnstile detection signals and troubleshooting
- `PATCHRIGHT.md` — two-phase Patchright-difz launch and OAuth-safe login

## Manifest

134 unique conversation IDs in `scripts/chatgpt-conversation-ids.json`.
