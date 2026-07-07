---
source_url: "https://grok.com/c/3d76000f-c7af-4db0-a7f4-d5c7cf4c0092"
conversation_id: "3d76000f-c7af-4db0-a7f4-d5c7cf4c0092"
title: "Playwright Install Fix on Ubuntu 24.04 ARM64"
extracted_at: "2026-06-29T16:31:59.134Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Playwright Install Fix on Ubuntu 24.04 ARM64

Source: [Grok conversation](https://grok.com/c/3d76000f-c7af-4db0-a7f4-d5c7cf4c0092)

## User

_Time: 2026-06-29T02:21:08.520Z_

root@keithyaneith:~# playwright install --with-deps
Installing dependencies...
Get:1 http://ports.ubuntu.com/ubuntu-ports noble-security InRelease [126 kB]
Hit:2 https://pkg.cloudflareclient.com noble InRelease
Hit:3 https://download.docker.com/linux/ubuntu noble InRelease
Get:4 https://pkgs.tailscale.com/stable/ubuntu noble InRelease
Hit:5 https://apt.releases.hashicorp.com noble InRelease
Get:6 http://ports.ubuntu.com/ubuntu-ports noble-security/main arm64 Components [41.8 kB]
Get:7 http://ports.ubuntu.com/ubuntu-ports noble-security/universe arm64 Components [76.3 kB]
Hit:8 http://us-chicago-1-ad-1.clouds.ports.ubuntu.com/ubuntu-ports noble InRelease
Get:9 http://us-chicago-1-ad-1.clouds.ports.ubuntu.com/ubuntu-ports noble-updates InRelease [126 kB]
Get:10 http://us-chicago-1-ad-1.clouds.ports.ubuntu.com/ubuntu-ports noble-backports InRelease [126 kB]
Get:11 http://us-chicago-1-ad-1.clouds.ports.ubuntu.com/ubuntu-ports noble-updates/main arm64 Components [178 kB]
Get:12 http://us-chicago-1-ad-1.clouds.ports.ubuntu.com/ubuntu-ports noble-updates/universe arm64 Components [387 kB]
Get:13 http://us-chicago-1-ad-1.clouds.ports.ubuntu.com/ubuntu-ports noble-backports/main arm64 Components [3580 B]
Get:14 http://us-chicago-1-ad-1.clouds.ports.ubuntu.com/ubuntu-ports noble-backports/universe arm64 Components [10.6 kB]
Fetched 1082 kB in 1s (1196 kB/s)
Reading package lists... Done
Reading package lists... Done
Building dependency tree... Done
Reading state information... Done
Note, selecting 'libatk-bridge2.0-0t64' instead of 'libatk-bridge2.0-0'
Note, selecting 'libatk1.0-0t64' instead of 'libatk1.0-0'
Note, selecting 'libatspi2.0-0t64' instead of 'libatspi2.0-0'
Note, selecting 'libcups2t64' instead of 'libcups2'
Note, selecting 'libglib2.0-0t64' instead of 'libglib2.0-0'
Note, selecting 'libgtk-3-0t64' instead of 'libgtk-3-0'
Note, selecting 'libpng16-16t64' instead of 'libpng16-16'
Note, selecting 'libevent-2.1-7t64' instead of 'libevent-2.1-7'
Package libasound2 is a virtual package provided by:
  liboss4-salsa-asound2 4.2-build2020-1ubuntu3.1
  libasound2t64 1.2.11-1ubuntu0.2 (= 1.2.11-1ubuntu0.2)
You should explicitly select one to install.
E: Package 'libasound2' has no installation candidate
E: Unable to locate package libicu70
E: Unable to locate package libffi7
E: Unable to locate package libx264-163
Failed to install browsers
Error: Installation process exited with code: 100

## Assistant

_Time: 2026-06-29T02:21:29.395Z_

**The issue is a common one on Ubuntu 24.04 (Noble Numbat) ARM64.** Playwright's older dependency scripts (especially in versions before ~1.45+) reference outdated package names that don't exist in Noble due to the `t64` transition (time_t 64-bit changes) and other package renames.<grok:render card_id="994d76" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">1</argument></grok:render>

### Quick Fix (Recommended)

1. **Update Playwright to the latest version** (this often includes better Noble support):

```bash
# If using npm / npx
npm install -D @playwright/test@latest   # or playwright@latest if not using the test runner

# Or for Python (pip)
pip install playwright --upgrade
```

2. **Manually install the correct system dependencies** (the t64 variants + common missing ones):

```bash
sudo apt update

sudo apt install -y \
  libnss3 libnspr4 \
  libatk1.0-0t64 libatk-bridge2.0-0t64 libatspi2.0-0t64 \
  libcups2t64 \
  libdbus-1-3 libdrm2 libxkbcommon0 \
  libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libxext6 libx11-6 libxcb1 \
  libgbm1 libasound2t64 \
  libpango-1.0-0 libcairo2 libcairo-gobject2 \
  libgtk-3-0t64 libglib2.0-0t64 \
  libpng16-16t64 fonts-noto-color-emoji fonts-unifont \
  libxshmfence1 libxss1 libxtst6 libxi6
```

3. **Run the Playwright install again**:

```bash
npx playwright install --with-deps   # or just npx playwright install-deps if browsers are already there
# For Python: playwright install --with-deps
```

### Alternative / More Targeted Approaches

- **Use `playwright install-deps` directly** (after updating):

  ```bash
  npx playwright install-deps chromium   # or without browser name for all
  ```

- **If you're in a venv (Python)** and run into sudo/permission issues:

  ```bash
  sudo $(which playwright) install-deps
  ```

- **For minimal installs** (e.g., just Chromium on ARM64), you can often get away with a smaller subset focused on the errors you saw:

  ```bash
  sudo apt install -y libasound2t64 libicu74 libffi8 libx264-164  # newer versions
  ```

### Why This Happens on Your System

- You're on **ARM64** (`ports.ubuntu.com` in the logs) + Noble.
- Packages like `libasound2` → `libasound2t64`, `libicu70` → newer `libicu74`, `libffi7` → `libffi8`, `libx264-163` → `libx264-164` (or similar).
- Older Playwright versions hard-code the old names in their apt lists.<grok:render card_id="ba8b9e" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">30</argument></grok:render>

### Additional Tips for Your Setup

- **Docker / CI**: Consider the official Playwright Docker image (`mcr.microsoft.com/playwright:v1.x.x-noble`) — it's based on Ubuntu 24.04 and has everything pre-installed.<grok:render card_id="331a9e" card_type="citation_card" type="render_inline_citation"><argument name="citation_id">29</argument></grok:render>
- **Headless only**: Many of the GUI libs (`gtk`, `asound`, etc.) are only needed for headed mode. If you're running headless tests, you may need fewer packages.
- Verify after install:

  ```bash
  npx playwright --version
  npx playwright install --with-deps   # should succeed now
  npx playwright test --project=chromium   # quick smoke test
  ```

If you still hit issues after this, share:
- Your exact Playwright version (`npx playwright --version`)
- Whether this is Node.js, Python, or another binding
- Any new error output

This should get you unblocked quickly. Let me know how it goes!
