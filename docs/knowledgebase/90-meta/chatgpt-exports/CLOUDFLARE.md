# Cloudflare + ChatGPT export — what breaks and how to fix it

## What you are seeing

The **"Verify you are human"** loop (check → refresh → check again) means **Turnstile completed in the browser but OpenAI/Cloudflare rejected the session server-side**. The page reloads and challenges again.

Your screenshot also shows **"Chrome is being controlled by automated test software"**. That banner appears when Playwright/Puppeteer/Selenium launches Chrome with automation flags. Turnstile treats that as high bot risk.

## What Cloudflare / Turnstile typically detects

| Signal | Why it matters |
| --- | --- |
| `navigator.webdriver === true` | Set on automated Chrome; instant bot flag |
| `--enable-automation` launch flag | Playwright default; shows the automation banner |
| CDP (DevTools protocol) attached | Common in headless/automation stacks |
| Headless / missing plugins / odd `User-Agent` | Fingerprint mismatch vs real Chrome |
| TLS / HTTP/2 fingerprint (JA3/JA4) | Automation clients differ from normal browsers |
| Behavioral signals | No natural mouse path, instant clicks, fixed timing |
| IP / datacenter reputation | Some VPS IPs score worse (less common on home desktop) |
| Third-party cookies / iframe isolation | Turnstile iframe may fail to persist clearance |

Clicking the checkbox **does not guarantee pass** — the widget issues a token, the **server validates bot score**, and automation-heavy sessions often fail validation even after a human click.

## Approaches that work for *your* data (134 conversations)

### 1. Official export (recommended — no Cloudflare fight)

1. ChatGPT → **Settings → Data controls → Export data**
2. Wait for email / download zip
3. Run:

```bash
node scripts/convert-chatgpt-export.mjs ~/Downloads/export-....zip
```

This produces the same markdown under `conversations/` and respects `scripts/chatgpt-conversation-ids.json` filter.

### 2. CDP attach — real Chrome, no Playwright launch (for UI scrape path)

Playwright **must not** launch the browser. You start Chrome yourself; the script only **connects** over CDP after you pass Cloudflare manually.

```bash
chmod +x scripts/start-chrome-for-export.sh
./scripts/start-chrome-for-export.sh
# Complete Cloudflare + login in THAT window (no automation banner)
node scripts/extract-chatgpt-conversations.mjs --connect --resume
```

Chrome is started **without** `--enable-automation`, so Turnstile sees a normal browser profile.

### 3. What **not** to rely on

- Cursor Playwright MCP / default `launchPersistentContext` — adds automation flags
- Repeated manual clicks in an automated browser — server keeps rejecting
- Headless mode — almost always blocked on ChatGPT

## Stealth plugins (patchright, playwright-extra)

Community forks hide some signals (`webdriver`, etc.) but **Cloudflare continuously updates** detection. For bulk export of **your** chats, official export or CDP attach is more reliable than evasion arms race.

## If CDP attach still loops

- Use a **fresh profile**: `rm -rf scripts/.chatgpt-export-profile` and restart `start-chrome-for-export.sh`
- Disable extensions that block cookies in that profile
- Try **Google Chrome** instead of Chromium: `CHATGPT_CHROMIUM_PATH=/usr/bin/google-chrome`
- Confirm URL is `https://chatgpt.com/` not stuck on `/api/auth/error`
- Fall back to **official export** (always works with account access)
