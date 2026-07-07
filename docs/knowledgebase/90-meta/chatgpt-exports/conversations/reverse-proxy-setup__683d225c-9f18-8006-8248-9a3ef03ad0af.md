---
source_url: "https://chatgpt.com/c/683d225c-9f18-8006-8248-9a3ef03ad0af"
conversation_id: "683d225c-9f18-8006-8248-9a3ef03ad0af"
title: "Reverse Proxy Setup"
extracted_at: "2026-06-29T16:44:41.720Z"
message_count: 2
provenance: auth-ui
---

# Reverse Proxy Setup

Source: [ChatGPT conversation](https://chatgpt.com/c/683d225c-9f18-8006-8248-9a3ef03ad0af)

## User

Question. I have this domain:
https://aiostreams.boden-crouch.workers.dev/configure

I also own this domain:
bolabaden.org

I want to put a dns record on aiostreams.bolabaden.org and have it point to aiostreams.boden-crouch.workers.dev.

Is it possible to do that WITHOUT REDIRECTING IN ANY WAY SHAPE OR FORM. I want the address bar of the client's browsers to continue saying aiostreams.bolabaden.org, NOT redirect.

Presumably I can just point a CNAME to aiostreams.boden-crouch.workers.dev right? however whenever i try i get a tls/ssl error or something.
Show more

## Assistant

You're on the right track conceptually, but there are a few key technical nuances that explain why you're running into a TLS/SSL error, and why a simple CNAME might not fully work without additional configuration.

✅ Goal Recap

You want:

aiostreams.bolabaden.org to load the content from aiostreams.boden-crouch.workers.dev

The browser's address bar to stay on aiostreams.bolabaden.org

No redirects, rewrites, or frame embedding

Full HTTPS/TLS support, no security errors

🔍 The Core Problem

A CNAME DNS record only maps domain names — it does not solve TLS.

When a browser visits https://aiostreams.bolabaden.org, it expects a valid TLS certificate for aiostreams.bolabaden.org. But unless boden-crouch.workers.dev (the target) is configured to serve content and certificates for your custom subdomain, TLS will fail — and that's exactly the error you're getting.

This is a common issue when pointing to third-party services that do not allow custom hostnames without verification.

✅ Solution Options
🔧 Option 1: Use Cloudflare Workers + Custom Domains

Since your target is a workers.dev subdomain, you're using Cloudflare Workers — good news!

Cloudflare does support custom domains pointing to Workers. Here's how:

1. Add a Custom Domain to the Worker

Go to your Cloudflare dashboard

Open your Worker (aiostreams.boden-crouch.workers.dev)

Find the "Custom Domains" tab

Add aiostreams.bolabaden.org as a custom domain

Cloudflare will verify the domain (you'll have to add a TXT or CNAME record for verification)

2. Set up DNS

In your bolabaden.org DNS zone:

dns
aiostreams  CNAME  aiostreams.boden-crouch.workers.dev

This lets Cloudflare route requests to the Worker.

3. Cloudflare Issues TLS Cert Automatically

Once verified, Cloudflare automatically issues a TLS certificate for aiostreams.bolabaden.org, so it works over HTTPS with no redirect and no TLS error.

❌ What Doesn't Work

Just pointing a CNAME to workers.dev without registering the custom domain — will cause TLS mismatch errors

Redirects (you don’t want them)

Framing (e.g., <iframe>) — not allowed with most modern CSP and security headers

✅ Summary
Step	Action
1.	Go to your Cloudflare Worker settings
2.	Add aiostreams.bolabaden.org as a custom domain
3.	Follow the verification steps (DNS TXT or CNAME)
4.	Once verified, Cloudflare sets up TLS and routing
5.	Add a DNS CNAME record from aiostreams.bolabaden.org to aiostreams.boden-crouch.workers.dev

This will make everything work cleanly with HTTPS, no redirects, and the browser always showing aiostreams.bolabaden.org.

Let me know if you want help walking through that Cloudflare setup — happy to guide step-by-step.
