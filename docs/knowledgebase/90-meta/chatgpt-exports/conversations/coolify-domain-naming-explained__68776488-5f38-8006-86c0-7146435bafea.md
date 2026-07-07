---
source_url: "https://chatgpt.com/c/68776488-5f38-8006-86c0-7146435bafea"
conversation_id: "68776488-5f38-8006-86c0-7146435bafea"
title: "Coolify Domain Naming Explained"
extracted_at: "2026-06-29T11:16:47.715Z"
message_count: 5
provenance: auth-ui
---

# Coolify Domain Naming Explained

Source: [ChatGPT conversation](https://chatgpt.com/c/68776488-5f38-8006-86c0-7146435bafea)

## User

Why does coolify keep deafulting my new deployments to e.g.:

https://litellm-oww4kgw8s88004wc44ooggc8.beatapostapita.bolabaden.org:4000


Why can't it just use service_name.beatapostapita.bolabaden.org?? why is it putting all this nonsense hash stuff around. It's a bit hard to actually give my end users a url so i'm not understanding why it's **defaulting** to this. To clarify the oddity of the url is implying that i'm not supposed to be publicly exposing that url/fqdn anyway and am supposed to provide a different reverse proxy to public domain? am i understanding that right? also i found this:


Warning: Changing the volume name after the initial start could cause problems. Only use it when you know what are you doing.


which i see on this page:


Storages
Persistent storage to preserve data between deployments.
If you would like to add a volume, you must add it to your compose file (General tab).
Source Path
/data/coolify/services/oww4kgw8s88004wc44ooggc8/litellm-config.yaml
Destination Path
/app/config.yaml
Convert to directory
Load from server
Delete
Content
general_settings:
  proxy_batch_write_at: 60

router_settings:
  redis_host: os.environ/REDIS_HOST
  redis_port: os.environ/REDIS_PORT
  redis_password: os.environ/REDIS_PASSWORD
  enable_pre_call_check: true

litellm_settings:
  set_verbose: false
  json_logs: true
  log_raw_request_response: true
  # turn_off_message_logging: false
  # redact_user_api_key_info: false
  service_callback: ["prometheus_system"]
  drop_params: true
  # max_budget: 100
  # budget_duration: 30d
  num_retries: 3
  request_timeout: 600
  telemetry: false
  cache: true
  cache_params:
    type: redis
    host: os.environ/REDIS_HOST
    port: os.environ/REDIS_PORT
    password: os.environ/REDIS_PASSWORD
    namespace: "litellm_cache"
    ttl: 600
  success_callback:
    # - "langfuse"
    - "prometheus"
  failure_callback:
    # - "langfuse"
    - "prometheus"
model_list:
  # OpenAI
  - model_name: gpt-4
    litellm_params:
      model: openai/gpt-4
      api_key: os.environ/OPENAI_API_KEY
      api_base: os.environ/OPENAI_API_BASE
  - model_name: gpt-4o
    litellm_params:
      model: openai/gpt-4o
      api_key: os.environ/OPENAI_API_KEY
      api_base: os.environ/OPENAI_API_BASE
  - model_name: gpt-4o-mini
    litellm_params:
      model: openai/gpt-4o-mini
      api_key: os.environ/OPENAI_API_KEY
      api_base: os.environ/OPENAI_API_BASE
  # Anthropic
  - model_name: claude-3-haiku
    litellm_params:
      model: claude-3-haiku-20240307
      api_key: "os.environ/ANTHROPIC_API_KEY"
      api_base: "os.environ/ANTHROPIC_API_BASE"
  - model_name: claude-3.5-sonnet
    litellm_params:
      model: claude-3-5-sonnet-20240620
      api_key: "os.environ/ANTHROPIC_API_KEY"
      api_base: "os.environ/ANTHROPIC_API_BASE"
  # VoyageAI
  - model_name: voyage-law-2
    model_info:
      output_vector_size: 1024
    litellm_params:
      model: voyage/voyage-law-2
      api_key: "os.environ/VOYAGE_API_KEY"
      api_base: "os.environ/VOYAGE_API_BASE"
      # rpm: 300
      # tpm: 1000000
  - model_name: voyage-multilingual-2
    model_info:
      mode: embedding
      max_tokens: 32000
      max_input_tokens: 32000
      output_vector_size: 1024
    litellm_params:
      model: voyage/voyage-multilingual-2
      api_key: "os.environ/VOYAGE_API_KEY"
      api_base: "os.environ/VOYAGE_API_BASE"
      input_cost_per_token: 0.00000012
      output_cost_per_token: 0
      # rpm: 300
      # tpm: 1000000
Save
Postgres
Volume Name
*
oww4kgw8s88004wc44ooggc8_pg-data
Source Path
Destination Path
*
/var/lib/postgresql/data
Redis
Volume Name
*
oww4kgw8s88004wc44ooggc8_redis-data
Source Path
Destination Path
*
Show more

## Assistant

You're not alone in being confused — Coolify's default behavior around deployment domain names and persistent volumes can be a bit opaque. Let's walk through it in plain terms:

❓ Why does Coolify use weird FQDNs like:
https://litellm-oww4kgw8s88004wc44ooggc8.beatapostapita.bolabaden.org:4000
✅ Answer:

Coolify auto-generates unique subdomains like litellm-oww4kgw8s88004wc44ooggc8 based on internal identifiers (typically a combo of project, service, and instance IDs). This serves internal routing, not necessarily intended as the polished public-facing URL.

❓ Why doesn’t it default to:
https://litellm.beatapostapita.bolabaden.org
✅ Answer:

Because Coolify treats all deployments as potentially multi-instance and ephemeral, it generates names that guarantee uniqueness, particularly useful when:

You redeploy services often.

You run multiple environments (dev/stage/prod) in the same project.

You don’t explicitly assign a custom domain/subdomain.

To get pretty URLs like litellm.beatapostapita.bolabaden.org, you need to manually define a custom domain (more below).

🧠 So what does that weird FQDN mean?

Yes — your hunch is right. It implies that you're expected to put a reverse proxy (like Cloudflare, Nginx, etc.) in front of it if you're exposing it to the public.

Coolify can help manage this, but it doesn't assume your desired external structure unless you configure it.

✅ What should you do instead?
👉 Define a custom domain/subdomain:

In Coolify UI:

Go to your Service (e.g., litellm).

Under the Domains tab or Expose settings:

Add a domain like litellm.beatapostapita.bolabaden.org.

Make sure DNS (e.g., Cloudflare or Namecheap) points to your Coolify instance.

Enable HTTPS (Coolify uses Caddy under the hood and can auto-issue Let's Encrypt certs if domain points correctly).

This will replace the random FQDN with your clean domain.

📦 Regarding This Volume Warning:
Warning: Changing the volume name after the initial start could cause problems...

This is a Docker-level constraint: volumes are tightly bound to containers. Changing the volume name after creation could orphan or reset data, so Coolify warns you in case you’re modifying persistent configurations like databases or config files.

As long as you don’t manually rename volumes via UI or Compose, you're fine.

🛠 TL;DR Fixes
If you want:
Goal	Action
Clean URLs like litellm.example.com	Add custom domain under service settings
Production-quality public access	Use a reverse proxy (Coolify + Caddy works well)
Avoid random FQDNs	Explicitly configure domain per service
Persistent config files	Keep volume names consistent; avoid renaming manually

If you'd like help setting the custom domain in Coolify, feel free to drop the domain or describe your DNS setup — I can walk you through that too.

## User

Question. On each node/server I see settings that I can fill out for these: 
Wildcard Domain (I): A wildcard domain allows you to receive a randomly generated domain for your new applications.  For instance, if you set "https://example.com" as your wildcard domain, your applications will receive domains like "https://randomId.example.com". IP Address/Domain: An IP Address (127.0.0.1) or domain (example.com). Make sure there is no protocol like http(s):// so you provide a FQDN not a URL.  --- under *sentinel*:  **Coolify URL**: URL to your Coolify instance. If it is empty that means you do not have a FQDN set for your Coolify instance.
  So each server has 3 different textboxes where it wants a domain/ip. I'd like information on what each of the three are and exactly what they're used for. When I set Wildcard Domain to https://vractormania.bolabaden.org it just says 'must be a valid full url.'. So where's teh fucking wildcard???  I have 3 nodes and each hostname of each vps is a subdomain of bolabaden.org that has an A record pointing to each vps.  That said, i'm still beyond confused. Currently i've set 'coolify url' to https://coolify.node_name.bolabaden.org, wildcard domain and ip address/domain to (http(s)://vractormania.bolabaden.org). Pretty sure i'm doing that wrong. What am i expected to fill in for these settings???
Show more

## Assistant

Here’s what each of those three fields on each node really means, what it’s used for, and how to fill it in correctly:

1. Wildcard Domain

What it is
A base URL that Coolify (actually Caddy under the hood) will use to automatically mint sub-domains for every app you deploy on that node.

You do not type *. yourself—Coolify prepends the random IDs.

You do include the protocol (https://) and the root domain only.

What it’s used for

Caddy will obtain a TLS cert (via Let’s Encrypt) for *.your-domain.com.

When you deploy, Coolify will wire up e.g.

https://<randomID>.your-domain.com

and Caddy will serve it under that cert.

How to fill it

Put exactly one URL, no path, no port—just protocol and domain.

https://bolabaden.org

Do not include *.; don’t include a port; don’t point it to one of your apps.

If you have one node per sub-domain (e.g. node1.bolabaden.org, node2.bolabaden.org), set each node’s wildcard to the root you actually want apps under. For example, if all your services under node1 should go under app1.node1.bolabaden.org, you could set the wildcard to

https://node1.bolabaden.org

and Coolify will hand out random prefixes like service123.node1.bolabaden.org.

2. IP Address / Domain

What it is
The “reach-me” address of this node for internal API/rendezvous calls.

No protocol, just the raw hostname or IP.

Used by Coolify’s orchestration layer (Sen­tinel) to talk to each agent.

What it’s used for

The master node (where you log into the UI) will call every other node here to deploy new containers, sync state, health-check, etc.

If you put an IP (e.g. 192.0.2.123), Sentinel will connect over that.

If you put a resolvable hostname (e.g. vractormania.bolabaden.org), Sentinel will DNS-resolve and connect over TCP.

How to fill it

If that VPS has a public A record vractormania.bolabaden.org → your.node.ip, put

vractormania.bolabaden.org

Or, directly its IP:

203.0.113.45
3. Coolify URL (under Sentinel settings)

What it is
The public URL of your Coolify Dashboard (the master API/UI endpoint).

Include protocol (https://), no trailing slash.

This is what Sentinel agents will return in health checks and callback URLs.

What it’s used for

Agents report back “I’m alive” to this URL.

When you click “Open in Browser” on a node’s log or on app details, Coolify builds links using this base.

If left empty, Sentinel can’t generate correct links or callbacks.

How to fill it

If you reach Coolify’s web interface at

https://coolify.bolabaden.org

then put exactly that:

https://coolify.bolabaden.org

If you’ve given the master UI its own sub-domain (e.g. coolify.node1.bolabaden.org), use that.

🚀 Putting it all together for, say, node1:
Field	Example Value	Notes
Wildcard Domain	https://node1.bolabaden.org	For apps: randomID.node1.bolabaden.org
IP Address/Domain	vractormania.bolabaden.org	How Sentinel reaches this agent
Coolify URL	https://coolify.bolabaden.org	The public URL of your Coolify dashboard (same on all nodes—only one master)

If you need all three nodes to serve apps under one wildcard (e.g. *.bolabaden.org), then set each node’s Wildcard Domain to https://bolabaden.org, but you’ll need a DNS A or CNAME wildcard record (*.bolabaden.org → your cluster IP/load-balancer) so that any <random>.bolabaden.org actually resolves back into your Coolify cluster.

⚠️ Common pitfalls

Including http:// in the IP/Domain field → it will reject it.

Putting a port in Wildcard Domain (:4000) → will break Let’s Encrypt issuance.

Mixing up which name is for the UI vs. which is for apps → your users will get 404s or TLS errors.

Once these are set correctly and DNS is pointed, Coolify/Caddy will automatically get certs for your wildcard and start handing out nice, predictable service URLs. Let me know if you hit any more snags!

## Assistant

Yes — you can autoscale Docker containers without using Swarm, but it requires a bit of plumbing using external tools. Docker by itself (outside of Swarm or Kubernetes) has no built-in autoscaling mechanism, but here's how you can implement horizontal autoscaling using alternative setups.

✅ Option 1: Docker + Prometheus + Custom Autoscaler Script
How it works:

Prometheus scrapes metrics (CPU/mem/reqs).

A custom script or service watches metrics and triggers scaling:

Uses docker run or docker-compose up -d to start more containers.

Optionally, removes containers when underutilized.

A reverse proxy/load balancer (like Traefik or Nginx) routes traffic to live containers.

Tools you can use:

Prometheus + Alertmanager

A watcher/cron job with docker stats or cadvisor

Python script with Docker SDK

Traefik (with dynamic config) or Nginx as the proxy layer

Pros:

Swarm-free

Customizable

Lightweight

Cons:

Manual setup

No built-in failover/high availability

✅ Option 2: Docker + systemd + Metrics-Based Scaling

Use systemd units (or systemd template units like myapp@1.service) and a local cron/monitoring tool to spawn/kill them based on CPU/memory usage.

Not elegant, but works for simple setups.

Tie this with a service mesh or load balancer to route requests.

✅ Option 3: Use docker-compose + a watcher tool

Some projects allow scaling services in docker-compose:

docker-compose up --scale app=3

But this isn’t autoscaling — you need to automate the trigger using a script.

Autoscaler projects:

docker-autoscaler (by Hiventive)
 – Monitors metrics, auto-runs containers

dockerscaler
 – Simple Python-based metrics-driven scaler

containrrr/watchtower
 – Not autoscaling, but helps restart/update running containers

✅ Option 4: Use Traefik with scaleFactor plugin

While Traefik doesn’t autoscale by default, some plugins or custom backends let you write dynamic config that adjusts based on service discovery or labels.

You can combine Traefik with a custom scaler (like a Python service) that updates config and reloads Traefik when new containers are added/removed.

🚫 What won’t work for autoscaling:

Coolify standalone: Coolify doesn’t handle autoscaling unless you use Docker Swarm or Kubernetes.

Vanilla docker-compose: It supports scaling via CLI, but no autoscaling triggers.

Portainer: Only supports service scaling, not autoscaling, without Swarm/K8s.

🔧 TL;DR — DIY Docker Autoscaling Stack (No Swarm)
Component	Tool/Example
Metrics	Prometheus + cAdvisor or docker stats
Trigger logic	Python/Go script with thresholds
Scaling API	Docker CLI or Docker SDK
Load balancing	Traefik or Nginx (routes to all live containers)
Optional UI	Portainer / Coolify (for visibility only)

If you'd like, I can sketch out a minimal Python autoscaler that spawns/terminates containers based on CPU usage. Want that?
