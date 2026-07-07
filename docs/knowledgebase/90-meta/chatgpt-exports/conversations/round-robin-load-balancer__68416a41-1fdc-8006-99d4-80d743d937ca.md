---
source_url: "https://chatgpt.com/c/68416a41-1fdc-8006-99d4-80d743d937ca"
conversation_id: "68416a41-1fdc-8006-99d4-80d743d937ca"
title: "Round Robin Load Balancer"
extracted_at: "2026-06-29T11:25:00.482Z"
message_count: 4
provenance: auth-ui
---

# Round Robin Load Balancer

Source: [ChatGPT conversation](https://chatgpt.com/c/68416a41-1fdc-8006-99d4-80d743d937ca)

## User

○ Worker + Durable Objects
  ○ Worker only
  ○ Static site
  ○ SSR / full-stack app
  ○ Worker + Durable Objects
  ○ Worker + Durable Objects + Assets
  ○ Workflow
  ○ Scheduled Worker (Cron Trigger)
  ○ Queue consumer & producer Worker
  ○ API starter (OpenAPI compliant)
  ◁ Go back


which cloudflare template is most relevant to a round robin loadbalancer?
Show more

## Assistant

For a true round‐robin load-balancer (i.e. keeping track of “which backend to hit next”), you’ll want a stateful counter—so the Worker + Durable Objects template is the best starting point. A Durable Object can hold a single counter (or ring-buffer) to decide which origin to forward each request to, while the Worker handles the actual proxy/fetch logic.

## User

in order to create a top tier round robin loadbalancer, provide a full comprehensive TODO list for everything it must support.

to clarify, i'm asking about **core functionality** like e.g. keeping the session intact. don't mention dumb stuff like health checks.

## Assistant

Creating a top-tier round-robin load balancer—focused on core functionality (not ops/devops concerns like health checks)—means building a system that reliably and fairly distributes requests, maintains state when needed, and ensures consistency and robustness under real-world conditions.

Here’s a comprehensive TODO list for the core functionality:

✅ 1. Round-Robin Algorithm Core

 Implement round-robin index tracking (incrementing per request, modulo backend list length).

 Handle concurrency safely (atomic updates, especially across multiple instances—Durable Object helps here).

 Support weighted round-robin (optional but useful).

✅ 2. Session Stickiness (Affinity)

 Support session stickiness via:

 Cookies (e.g., X-Backend-Id)

 IP hashing fallback (e.g., for non-cookie clients like APIs)

 Allow configuring sticky vs. non-sticky routing per route or domain.

✅ 3. Request Proxying

 Forward all relevant headers (esp. Host, Authorization, cookies).

 Rewrite Host header or preserve based on backend type (important for virtual hosting).

 Handle streaming (chunked requests/responses, WebSockets, SSE).

 Preserve HTTP methods and bodies (GET/POST/PUT/DELETE/etc.).

 Normalize and validate URLs to avoid open proxy issues.

✅ 4. Resilience & State

 Use Durable Object for:

 Persisting the backend list and round-robin pointer.

 Managing concurrent access to index.

 Implement fallback strategy for overflow cases (e.g., if all backends are unreachable, but this is borderline devops).

✅ 5. Backend List Management

 Allow dynamic backend registration/removal (hot updates).

 Support static configuration fallback.

 Ensure order is deterministic and consistent across restarts.

✅ 6. Consistency Across Multiple Workers

 Route traffic for a given domain/path to the same Durable Object (e.g., via .get(id) keyed by hostname or route).

 Ensure Durable Object doesn’t become a bottleneck (use per-route or per-user affinity when needed).

✅ 7. Timeouts & Retries (Logical Handling)

 Handle upstream timeouts gracefully and retry next backend (configurable max retry count).

 Avoid retrying non-idempotent methods unless explicitly allowed.

 Support configurable per-backend timeouts.

✅ 8. Observability Support

 Expose metadata in response headers for debugging (e.g., X-Backend-Used).

 Optionally log request→backend mappings (ideally via queue or log stream to avoid blocking).

✅ 9. Security

 Prevent open proxy vulnerabilities (e.g., whitelist backend origins).

 Sanitize user input in headers, query, etc.

 Enforce HTTPS-only origin forwarding if required.

✅ 10. Graceful Failover (in Round-Robin Context)

 If selected backend is down/unreachable, skip to the next (and preserve index state).

 Track temporary backend failures (without health checks) using request failures.

Would you like this paired with an actual implementation outline in Cloudflare Workers + Durable Objects?
