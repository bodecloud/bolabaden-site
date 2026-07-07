---
source_url: "https://chatgpt.com/c/68090242-6440-8006-a16c-afa088e27d35"
conversation_id: "68090242-6440-8006-a16c-afa088e27d35"
title: "Traefik redirect and proxy"
extracted_at: "2026-06-29T15:06:06.784Z"
message_count: 4
provenance: auth-ui
---

# Traefik redirect and proxy

Source: [ChatGPT conversation](https://chatgpt.com/c/68090242-6440-8006-a16c-afa088e27d35)

## User

in traefik how do I make it so any attempts to access app.strem.io gets rerouted to stremio.bolabaden.org/shell? I tried using middleware but it doesn't seem to work for e.g. various images on the page or links.

## Assistant

You're on the right track trying to use Traefik middleware, but if images and links aren't being correctly redirected or rewritten, it's likely due to incomplete handling of path rewrites or a misunderstanding between redirecting vs proxying.

Let’s clarify a few things and guide you toward a working setup:

🔁 What You Want

You want all requests to app.strem.io to be routed to (or behave as if they are being served from) stremio.bolabaden.org/shell.

This can mean one of two things, and the implementation differs:

1. Redirect (External)

The browser is told to go to stremio.bolabaden.org/shell.

Simple but not seamless.

Resources will now come from stremio.bolabaden.org, not app.strem.io.

2. Proxy (Internal)

Requests to app.strem.io are served internally from stremio.bolabaden.org/shell, and URLs are rewritten on the fly.

Seamless and ideal for reverse proxy setups.

Trickier with assets if paths aren't rewritten properly.

🛠 Recommended Approach: Reverse Proxy + Path Rewriting

You can do this with a Traefik router + middleware that:

rewrites all incoming paths (e.g. /xyz) to /shell/xyz

forwards the request to the stremio.bolabaden.org upstream

Here’s a basic example using Traefik dynamic configuration (file-based or labels):

🔧 File-based example (YAML):
YAML
http:
  routers:
    stremio-router:
      rule: "Host(`app.strem.io`)"
      service: stremio-service
      entryPoints:
        - websecure
      middlewares:
        - stremio-prefix

  middlewares:
    stremio-prefix:
      replacePathRegex:
        regex: "^/(.*)"
        replacement: "/shell/${1}"

  services:
    stremio-service:
      loadBalancer:
        servers:
          - url: "https://stremio.bolabaden.org"
🐳 Docker labels version (if using Traefik with Docker):
YAML
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.stremio.rule=Host(`app.strem.io`)"
  - "traefik.http.routers.stremio.entrypoints=websecure"
  - "traefik.http.routers.stremio.middlewares=stremio-prefix"
  - "traefik.http.middlewares.stremio-prefix.replacepathregex.regex=^/(.*)"
  - "traefik.http.middlewares.stremio-prefix.replacepathregex.replacement=/shell/$$1"
  - "traefik.http.services.stremio.loadbalancer.server.url=https://stremio.bolabaden.org"
⚠ Common Gotchas

Ensure the upstream (stremio.bolabaden.org) is accessible by Traefik and CORS isn't blocking anything.

If stremio.bolabaden.org returns absolute links (e.g. /assets/img.png), they might break unless it knows it's behind a proxy—use stripPrefix or try to configure the upstream to generate correct URLs.

If using HTTPS: ensure certificates are in place for both domains.

Want help debugging your existing setup or see your docker-compose.yml or static config file? Paste it in and I can adjust it for you.

## User

you aren't understanding. Various IMAGES and LINKS on the page itself do NOT get affected by MIDDLEWARES in traefik, is it possible I exclusively must do this on the dns level e.g. /etc/hosts? or does traefik actually support spoofing other domains?

## Assistant

Ahhh got it now — thank you for the clarification. You're absolutely right, and you're running into a fundamental limitation of how reverse proxies and browsers work.

Let’s break it down:

🤯 The Core Issue

You're trying to make app.strem.io behave like it's serving content from stremio.bolabaden.org/shell, but the resources (e.g., images, links, JS files) on that page are hardcoded to absolute URLs like:

https://stremio.bolabaden.org/shell/img/logo.png

So when a browser loads that page from app.strem.io, it will still try to pull images from stremio.bolabaden.org, not app.strem.io, unless the page’s HTML and all asset references are rewritten — which Traefik doesn’t do.

🧠 Key Facts

Traefik is not an HTML/JS rewriter. It can rewrite paths, but not contents of HTML files.

Browsers enforce cross-origin rules, and links that point to stremio.bolabaden.org will go there — you can't spoof the domain unless you're doing full-on domain masquerading, which gets tricky.

🛑 Middleware Can't Rewrite HTML Contents

What you want is something like:

All requests to app.strem.io/foo get routed to stremio.bolabaden.org/shell/foo

But with domain masking so app.strem.io pretends it's stremio.bolabaden.org

Unfortunately, Traefik:

Can proxy the backend (yes ✅)

Can rewrite paths (yes ✅)

Cannot rewrite HTML responses or URLs inside content (no ❌)

🧙‍♂️ Workaround Options
✅ Option 1: Use a Real Web Proxy Like nginx or Apache With sub_filter

These can actually rewrite HTML response bodies, swap domain names, etc.

Example: Replace all stremio.bolabaden.org with app.strem.io in responses.

But it’s fragile and hard to maintain.

✅ Option 2: Host stremio.bolabaden.org behind a CDN/proxy and serve via iframe or embed (best with upstream support)
⚠️ Option 3: DNS spoofing (/etc/hosts) — only works LOCALLY

You can trick your system to resolve stremio.bolabaden.org as 127.0.0.1, then serve it from Traefik.

But that won’t work for external users — they’d need the same hosts entry.

✅ Option 4: Set up a local reverse proxy with full domain spoofing:

Traefik is configured with a Host rule for stremio.bolabaden.org

You DNS-spoof stremio.bolabaden.org to localhost

Then you access http://stremio.bolabaden.org/shell, but it's being served locally by Traefik

This sort of fakes the domain, but again, it's only useful for your own machine or internal network.

✅ Real Solution? Get the app you’re proxying to support relative URLs, or serve it directly under your own domain.

If you have control over stremio.bolabaden.org, you could:

Serve shell/ content under a subdomain like app.stremio.bolabaden.org

Or configure it to work with relative asset paths

Want to spoof it locally with /etc/hosts and Traefik for development? I can show you a concrete setup for that.
