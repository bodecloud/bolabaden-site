---
source_url: "https://chatgpt.com/c/68416a17-d478-8006-a38b-66d24e63cb7a"
conversation_id: "68416a17-d478-8006-a38b-66d24e63cb7a"
title: "Round Robin Load Balancer"
extracted_at: "2026-06-29T11:25:27.125Z"
message_count: 2
provenance: auth-ui
---

# Round Robin Load Balancer

Source: [ChatGPT conversation](https://chatgpt.com/c/68416a17-d478-8006-a38b-66d24e63cb7a)

## User

○ Worker only
  ○ Static site
  ○ SSR / full-stack app
  ● Worker + Durable Objects
  ○ Worker + Durable Objects + Assets
  ○ Workflow
  ○ Scheduled Worker (Cron Trigger)
  ○ Queue consumer & producer Worker
  ○ API starter (OpenAPI compliant)
  ◁ Go back


which cloudflare template is most relevant to a round robin loadbalancer?
Show more

## Assistant

The most relevant Cloudflare template for implementing a round-robin load balancer is:

● Worker + Durable Objects
Why:

Durable Objects are stateful, allowing you to keep track of connection state — such as which backend server was last used — which is crucial for round-robin logic.

In a round-robin load balancer:

You need to track which backend was used last.

Then forward the next request to the next backend in the list.

Durable Objects are ideal for this kind of coordination across Workers, especially when you need consistency across edge locations.

Alternatives:

Worker only: Stateless — you'd need to externalize state (e.g., KV or R2), which adds latency and complexity.

Worker + Durable Objects + Assets: Adds static assets hosting, which is unnecessary for a pure load balancer.

Queue or Cron: Not relevant for request-based load balancing.

So for a round-robin load balancer:
👉 Choose: Worker + Durable Objects
