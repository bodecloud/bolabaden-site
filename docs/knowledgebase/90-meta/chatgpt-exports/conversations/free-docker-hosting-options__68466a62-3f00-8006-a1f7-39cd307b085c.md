---
source_url: "https://chatgpt.com/c/68466a62-3f00-8006-a1f7-39cd307b085c"
conversation_id: "68466a62-3f00-8006-a1f7-39cd307b085c"
title: "Free Docker Hosting Options"
extracted_at: "2026-06-29T14:40:31.566Z"
message_count: 5
provenance: auth-ui
---

# Free Docker Hosting Options

Source: [ChatGPT conversation](https://chatgpt.com/c/68466a62-3f00-8006-a1f7-39cd307b085c)

## Assistant

There are very few services that allow you to run a full Docker Compose stack for free, especially with custom networking (like publicnet), reverse proxies (Traefik), and interactive apps (like code-server). However, here are a few free-tier capable options that can run full Compose stacks, subject to certain constraints:

✅ 1. CapRover (self-hosted on a free VPS)

Use case: Run on a free VPS like Oracle Cloud Free Tier or Fly.io (with small tweaks).

Pros:

You can install CapRover on a free VM (Oracle Cloud Free Tier or a small Fly.io instance).

Supports docker-compose files.

Lets you deploy Traefik, code-server, and others as one stack.

Free custom domain (via DuckDNS or Cloudflare).

Cons:

You need to set up the server yourself (takes ~20 minutes).

Free VPS resources are limited (CPU/memory).

How to do it:

Create a VM on Oracle Cloud Free Tier
 or Fly.io.

Install CapRover with a one-liner.

Upload your docker-compose.yml.

Adjust ports and persistent volumes accordingly.

✅ 2. Coolify (self-hosted)

Use case: Self-hosted PaaS that supports full Docker Compose.

Pros:

Beautiful UI, very Docker-friendly.

Runs your whole stack, including code-server, Traefik, and custom domains.

Cons:

Must be hosted on a VPS.

Like CapRover, free if you self-host on a free-tier VPS.

✅ 3. Fly.io (with tweaks)

Use case: Can run Docker apps for free with ~3 shared CPU + 256MB RAM per app.

Pros:

Generous free tier (~3 apps with decent resources).

Global deployment.

Support for multiple services, though not native docker-compose (you’ll need to translate it into fly.toml + separate apps).

Cons:

You need to split your services and deploy separately.

No full docker-compose.yml out-of-the-box.

Tip: Some people install Docker inside a Fly.io app, essentially DIY-hosting your own Compose stack (YMMV).

⚠️ Honorable Mention: Free VPS options

If you want to run your current docker-compose.yml exactly as-is, the only real free options are VPS providers:

Oracle Cloud Free Tier
:

2x AMD/ARM VMs, 1 GB RAM each.

Persistent storage and IPv4.

Supports full docker-compose.

Google Cloud (Free tier)
:

f1-micro instance per month (limited).

Runs Compose fine, but performance is minimal.

Fly.io
:

Supports small apps free.

With Docker-in-Docker or Nomad, can approximate Compose (not directly).

🔴 What won’t work

To save you time, these won't support your full Compose stack for free:

Netlify / Vercel / Cloudflare Pages — static only.

Render, Railway, Heroku Free Tier (deprecated) — Compose support very limited or not free anymore.

Docker Hub / Docker Cloud / Play with Docker — no persistent free hosting.

✅ Best path (summary):

Use Oracle Cloud Free Tier → install Docker + Docker Compose → deploy your stack exactly as-is.

If you want easier management, add CapRover or Coolify on top.

Let me know if you want a quick script to deploy all of this to Oracle Cloud or another VPS.

## User

alright so what features do i need to drop to be able to actually support what the free services require/restrict? try not to remove too much of what i'm doing and only consider ones that'll get me most of what i want

## Assistant

Great question — let's break it down surgically to figure out how to minimize the sacrifice while making your stack fit within truly free hosting options (like Netlify, Cloudflare Workers, Fly.io, etc.).

⚙️ Your Current Stack — What's Resource-Intensive or Non-Portable?

Here's a breakdown of what you currently run:

Component	Purpose	Resource/Infra Need
campaign	Next.js app	Can be static or SSR
code-campaign	code-server (VSCode in browser)	High CPU/mem, needs persistent FS
traefik	reverse proxy w/ TLS, routing	Needs privileged access, custom ports
traefik-error-pages	error HTMLs	Low resource
tinyauth	Lightweight auth layer	Manageable
whoami	test endpoint	Minimal
🧩 What’s Incompatible with Most Free PaaS Platforms?

Here are the main blockers for full deployment on something like Netlify, Cloudflare Workers, or Fly.io:

❌ docker-compose (multi-container orchestration)

Most free platforms don’t support full Compose stacks.

Exception: self-hosted on VPS (CapRover, Coolify).

❌ code-server

Heavy container: needs persistent volume and more than 256–512MB RAM.

Interactive UI in-browser + lots of I/O makes it hard to run on free tiers.

❌ traefik (on most PaaS)

Needs:

Access to Docker socket (/var/run/docker.sock) — blocked on hosted platforms.

Custom networking — tricky on most PaaS.

Let's Encrypt, custom error pages, middlewares — need direct HTTP(S) control.

🩼 What You Can Do Instead (With Minimal Loss)
✅ 1. Keep the campaign app

✅ If exported as a static Next.js app, works on:

Netlify

Vercel

Cloudflare Pages

⚠️ If using SSR (getServerSideProps), you’ll need a full server (e.g. Fly.io, Render).

✅ Keep auth (with changes)

Use Cloudflare Access or Auth0 as an identity proxy in front of your deployed frontend.

Drop tinyauth, and instead configure Cloudflare Access or Firebase Auth to protect routes.

Cloudflare Access is free for up to 50 users.

✅ Drop Traefik

Use platform routing (Netlify/Vercel) or Fly.io's own edge routing.

You won’t need to manage TLS or routing yourself.

✅ Drop code-server

Instead, use:

GitHub Codespaces
 — free hours/month.

CodeSandbox

Replit
 — Free plans exist.

Or self-host code-server only if you use a free VPS (e.g., Oracle Cloud).

🧪 ✅ Possible Reduced Stack Configs
⚡ Netlify or Cloudflare Pages (fully static)

Keep:

campaign (static-exported via next export)

Use Cloudflare Access as the auth layer

Host error pages as redirects via Netlify config

Ditch everything else

🚀 Fly.io (full dynamic stack, with limits)

Keep:

campaign (can be SSR)

tinyauth (optional, but Cloudflare Access is easier)

Replace Traefik with Fly.io's built-in routing

Run code-server as a separate app (low RAM)

Requires: splitting into multiple Fly apps (1 per service), ~256MB RAM each.

🔚 Summary

To fit your stack into a completely free host (without self-hosting a VPS), you’ll need to:

Drop	Replace With	Why
code-server	GitHub Codespaces / Replit	Heavy + needs persistent disk
traefik	Platform routing (Netlify/Fly)	Needs socket & root access
docker-compose	Multiple single-container apps	PaaS doesn't support Compose
tinyauth (optional)	Cloudflare Access / Firebase Auth	Easier & free for basic auth

Let me know if you want a concrete example of how to rewrite your setup for Fly.io or Netlify + Cloudflare Access — I can give you actual fly.toml or netlify.toml configs next.

## User

what is caprover/coolify? some sort of free vps service?

## Assistant

CapRover and Coolify aren’t VPS providers themselves — they’re open-source, self-hosted PaaS platforms you install on your own server (like a free-tier VPS). Here's what each does:

🔧 CapRover

What it is: A lightweight platform‑as‑a‑service built on Docker Swarm + Nginx + Let’s Encrypt.

Key features:

Web dashboard + CLI for app/database/services deployment (e.g. Next.js, PostgreSQL) 
reddit.com
+15
github.com
+15
reddit.com
+15
opensourcealternative.to
+2
reddit.com
+2

One‑click app marketplace, autoscaling, zero‑downtime deploys 
reddit.com
+4
sliplane.io
+4
muratkarasah.com
+4

Free SSL via Let’s Encrypt, resilient app removal, support for multiple languages/frameworks

Real‑world use:

“been using CapRover for a couple years… host multiple projects on one VPS” 
reddit.com
+13
reddit.com
+13
reddit.com
+13

Limitations: Doesn’t support full Docker Compose, and requires server maintenance (updates, security, etc.) 
sliplane.io
+1

🚀 Coolify

What it is: A modern, open‑source Heroku/Netlify-like PaaS you install on your own server (VPS, Raspberry Pi, etc.) 
coolify.io
+1

Key features:

Supports Docker Compose and single‑click app deployments

Automatic SSL, terminal access in browser, backup, monitoring, API, PR previews

No feature paywalls—totally open-source 
sliplane.io
+4
muratkarasah.com
+4
reddit.com
+4
best-of-web.builder.io
coolify.io
+1

Real‑world insights:

“Coolify can be a good thing… [...] supports Docker Compose” 
reddit.com
reddit.com
+15
reddit.com
+15
coolify.io
+15

Another said: “I recently switched from complex Ansible+Kubernetes to Coolify… saved so much time.” 
reddit.com
+15
reddit.com
+15
reddit.com
+15

Note: Slightly heavier on resources; some users mention occasional bugs or documentation gaps (especially in early versions) 
reddit.com

🆚 CapRover vs. Coolify
Feature	CapRover	Coolify
Ease of setup	One command install, dashboard+CLI	Easy install with browser UI
Docker Compose support	Limited	Full support
One-click apps	Yes (DBs, WordPress, etc.)	Yes
Browser terminal	Not built-in	Yes
Resource use	Lightweight	Slightly heavier
Community feedback	Stable, used for years	Modern UX but early adopters report bugs
🧭 When to Use Which?

Choose CapRover if you want a lighter PaaS, with battle-tested reliability and CLI support, and don’t need full Compose compatibility. Great for multiple small services on one VPS.

Choose Coolify if you want full Docker Compose support, browser-based terminal, and advanced features like PR previews. Just know it may require a bit more resources and occasional troubleshooting.

✅ So—are they VPS services?

No — you still need to provide your own server. That can be:

A free-tier VPS (Oracle Cloud Always Free, AWS EC2 free tier, etc.)

A paid VPS (DigitalOcean, Hetzner, Linode)

Even a local machine (Raspberry Pi, home server)

Both CapRover and Coolify run on top of your server, simplifying the Polish layer: deploying apps, managing SSL, routing traffic—all without touching Docker Compose or Traefik directly.

Next Steps?

If you want help installing and configuring either on a free VM (like Oracle Cloud Always Free), I can provide step-by-step commands. Just let me know which you prefer—or if you want a “best of both” setup.
