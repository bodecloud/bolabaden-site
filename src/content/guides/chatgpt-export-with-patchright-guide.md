---
description: How to export ChatGPT conversations with browser automation when Cloudflare Turnstile and Google OAuth block stock Playwright — using Patchright, patchright-difz, and a two-phase login flow.
category: development
difficulty: intermediate
estimatedTime: 25-40 minutes
prerequisites:
  - Node.js 18+
  - A headed Linux or macOS desktop (DISPLAY available)
  - Your own ChatGPT account
  - Permission to automate your own browser session
technologies:
  - Patchright
  - Playwright
  - Browser Automation
  - OAuth
  - Cloudflare Turnstile
---

# Exporting ChatGPT Conversations When Cloudflare and Google Block Your Bot

A practical guide to getting past **Cloudflare Turnstile** on `chatgpt.com` and **Google sign-in** — without giving up on browser automation.

development • intermediate • 25-40 minutes

## Table of Contents

1. [Introduction](#introduction)
2. [Quick start](#quick-start)
3. [Two different gates](#two-different-gates)
4. [Why stock Playwright fails](#why-stock-playwright-fails)
5. [The tools that actually work](#the-tools-that-actually-work)
6. [Two-phase launch (the key idea)](#two-phase-launch-the-key-idea)
7. [What broke login the first time](#what-broke-login-the-first-time)
8. [Step-by-step workflow](#step-by-step-workflow)
9. [Troubleshooting](#troubleshooting)
10. [Limits and ethics](#limits-and-ethics)

---

## Introduction

If you try to scrape or export ChatGPT threads with normal Playwright, you often hit two walls:

1. **Cloudflare** — “Verify you are human” loops, sometimes even after you click the box.
2. **Google OAuth** — “Continue with Google” fails, or Google says the browser “may not be secure.”

These are **different problems**. Clearing Cloudflare does not mean login will work. This guide explains what each layer checks, what we changed to pass both, and how to run the flow on a real desktop with a visible browser window.

This repo includes working scripts under `scripts/` (see [Step-by-step workflow](#step-by-step-workflow)). The ideas apply anywhere you automate ChatGPT with Patchright.

---

## Quick start

**10-minute version** — if you already cloned this project and have dependencies installed:

```bash
npm install
DISPLAY=:0 node scripts/chatgpt-auth-only.mjs
```

Complete Google (or email) login in the **headed** browser when it opens. If that succeeds, run the export:

```bash
DISPLAY=:0 node scripts/extract-chatgpt-conversations.mjs --resume
```

Resume later without repeating Cloudflare bootstrap:

```bash
DISPLAY=:0 CHATGPT_SKIP_CF_BOOTSTRAP=1 node scripts/extract-chatgpt-conversations.mjs --resume
```

Logs: `scripts/chatgpt-browser.log` (URLs during OAuth), `scripts/chatgpt-export.log` (progress).

---

## Two different gates

| Gate | Where | What it asks |
| --- | --- | --- |
| **Cloudflare Turnstile** | `chatgpt.com` | “Does this look like a normal browser?” |
| **Google OAuth** | `accounts.google.com` | “Is this sign-in flow uninterrupted?” |

**Mental model:**

```text
Cloudflare  → browser fingerprint + cookies (cf_clearance)
Google OAuth  → don't navigate away, don't auto-click random things mid-login
```

Fix Cloudflare with stealth browser settings and (optionally) Turnstile auto-click. Fix Google by **leaving the browser alone** while you finish sign-in.

---

## Why stock Playwright fails

Playwright is excellent automation — and Cloudflare knows it.

Common signals that get you flagged:

| Signal | Why it hurts |
| --- | --- |
| `--enable-automation` launch flag | Shows “Chrome is being controlled by automated test software” |
| `navigator.webdriver === true` | Classic bot fingerprint |
| Headless mode | Almost always blocked on ChatGPT |
| Chrome-for-Testing bundle | Worse for Google OAuth than system Chrome/Chromium |
| Auto-clicks during OAuth | Turnstile solver clicks on Google pages → broken login |
| Script navigates during OAuth | `net::ERR_ABORTED`, Google flow interrupted |

Clicking the Turnstile checkbox **does not guarantee pass**. The widget sends a token; Cloudflare’s server scores the session. Automation-heavy browsers often fail **after** a human click.

---

## The tools that actually work

### Patchright

A **Playwright fork** aimed at looking less like automation. Same API (`chromium.launchPersistentContext`, `page.goto`, etc.), fewer obvious bot flags.

### patchright-difz

Patchright plus an optional **Turnstile watcher**: when enabled at launch, it finds the Cloudflare iframe and clicks the checkbox on an interval (with cooldowns).

Install (this project):

```bash
npm install patchright patchright-difz
```

### Stealth launch settings

The important launch options (see `scripts/lib/patchright-launch.mjs` in this repo):

- **Headed** browser — `headless: false`
- **`ignoreDefaultArgs: ['--enable-automation']`** — removes the automation banner
- **`--disable-blink-features=AutomationControlled`** — hides a common fingerprint
- **System Chromium** — e.g. `/usr/bin/chromium-browser` on Linux (override with `PATCHRIGHT_EXECUTABLE_PATH`)

Persistent profile directory stores cookies (`cf_clearance`, session tokens) between runs.

---

## Two-phase launch (the key idea)

**Do not** run Turnstile auto-click for the entire session. Split the work:

```text
Phase 1 — Turnstile ON
  Open chatgpt.com only
  Wait until Cloudflare clears
  Close browser (cookies stay in profile)

Phase 2 — Turnstile OFF
  Reopen same profile
  Login + scrape (no auto-clicks during Google OAuth)
```

Phase 1 gets `cf_clearance` into the profile. Phase 2 lets you sign in without the solver clicking on Google’s pages.

Skip Phase 1 on later runs if clearance is still valid:

```bash
CHATGPT_SKIP_CF_BOOTSTRAP=1 node scripts/extract-chatgpt-conversations.mjs --resume
```

---

## What broke login the first time

Early attempts cleared Cloudflare but **login still failed**. That was mostly **script behavior**, not Cloudflare “winning again.”

| Mistake | What happened | Fix |
| --- | --- | --- |
| Turnstile ON during OAuth | Auto-clicks on Google pages | Phase 2 with `turnstile: false` |
| Navigation during OAuth | Script jumped to conversation URLs while on Google | Wait loop: no `goto()` on OAuth hosts |
| Wrong Chrome build | “This browser or app may not be secure” | System Chromium instead of Chrome-for-Testing |
| Auth check too early | Opened `/c/<uuid>` before session existed | Verify conversations only after login cookies |

The OAuth-safe pattern:

1. Open `https://chatgpt.com/auth/login`
2. Click “Log in” / “Continue with Google” if needed
3. **Wait** while URL is `accounts.google.com` or `auth.openai.com` — you complete sign-in in the window
4. Only then navigate to conversation URLs for export

During a good login, logs should show Google URLs **without** random jumps to `/c/<uuid>` in the middle.

---

## Step-by-step workflow

### 1. Probe Cloudflare only

```bash
DISPLAY=:0 node scripts/ralph-cloudflare-probe.mjs
```

Exit 0 means the page got past “Just a moment…” with Turnstile help.

### 2. Test login only

```bash
DISPLAY=:0 node scripts/chatgpt-auth-only.mjs
```

Finish OAuth in the browser. Success = script prints that login was detected and session cookies exist.

### 3. Export conversations

First run (includes CF bootstrap):

```bash
DISPLAY=:0 node scripts/extract-chatgpt-conversations.mjs --resume
```

Or single conversation:

```bash
DISPLAY=:0 node scripts/extract-chatgpt-conversations.mjs --id <conversation-uuid>
```

Exports land in `docs/knowledgebase/90-meta/chatgpt-exports/conversations/` as markdown with YAML frontmatter.

### Environment variables

| Variable | Purpose |
| --- | --- |
| `DISPLAY=:0` | Required on Linux for headed browser |
| `CHATGPT_SKIP_CF_BOOTSTRAP=1` | Skip Phase 1 when profile already has clearance |
| `CHATGPT_EXPORT_SKIP_PROMPT=1` | Skip login wait when session is known good |
| `PATCHRIGHT_EXECUTABLE_PATH` | Force browser binary (e.g. `/usr/bin/google-chrome`) |
| `PATCHRIGHT_CHANNEL=chromium` | Use bundled Chrome-for-Testing instead of system Chromium |

---

## Troubleshooting

### Turnstile loops forever

- Confirm the window is **headed**, not headless.
- Check for the automation banner — if present, stealth args are not applied.
- Try system Chrome/Chromium via `PATCHRIGHT_EXECUTABLE_PATH`.
- Delete profile and retry: `rm -rf scripts/.chatgpt-patchright-profile` (forces CF + login again).
- Manual click on Turnstile once, then wait.

### Google blocks sign-in

- Switch to system Chromium or Google Chrome.
- Ensure **Phase 2** has Turnstile **off**.
- Do not run scripts that `goto()` other URLs while you are on Google.
- Look for “browser may not be secure” in `scripts/chatgpt-browser.log`.

### Export says “no messages”

ChatGPT loads messages lazily. The export script waits and scrolls (see `scripts/lib/chatgpt-messages.mjs`). If a thread is empty, the conversation may be deleted or the URL wrong.

### `SingletonLock` / profile errors

```bash
rm -f scripts/.chatgpt-patchright-profile/SingletonLock
```

Only one browser instance should use the profile at a time.

---

## Limits and ethics

- Cloudflare and Google **change detection** over time. This is maintenance, not a permanent bypass.
- Auto-click is **not guaranteed**; sometimes you still click Turnstile yourself.
- Use only on **your own** ChatGPT account, with permission to automate your session.
- For a one-time full archive, OpenAI’s official **Export data** (Settings → Data controls) avoids the arms race entirely — but if you need URL-specific UI scrape or Patchright for other reasons, the two-phase flow above is what worked here.

---

## Further reading in this repo

- Internal ops notes: `docs/knowledgebase/90-meta/chatgpt-exports/PATCHRIGHT.md`
- Turnstile signals: `docs/knowledgebase/90-meta/chatgpt-exports/CLOUDFLARE.md`
- Export layout: `docs/knowledgebase/90-meta/chatgpt-exports/README.md`
