---
source_url: "https://chatgpt.com/c/68774026-1fe4-8006-8399-dde4a677d2a6"
conversation_id: "68774026-1fe4-8006-8399-dde4a677d2a6"
title: "Fix Docker CPU Conflict"
extracted_at: "2026-06-29T16:20:27.259Z"
message_count: 3
provenance: auth-ui
---

# Fix Docker CPU Conflict

Source: [ChatGPT conversation](https://chatgpt.com/c/68774026-1fe4-8006-8399-dde4a677d2a6)

## User

Error response from daemon: Conflicting options: Nano CPUs and CPU Quota cannot both be set
Error response from daemon: Conflicting options: Nano CPUs and CPU Period cannot both be set

How to fix these errors???


flaresolverr:
    # 🔹🔹 Flaresolverr 🔹🔹  # https://github.com/flaresolverr/flaresolverr
    image: ghcr.io/flaresolverr/flaresolverr:latest
    #image: ghcr.io/thephaseless/byparr:latest
    container_name: flaresolverr
    hostname: flaresolverr
    extra_hosts: *common-hostname-aliases
    networks:
      publicnet:
        ipv4_address: ${FLARESOLVERR_IPV4_ADDRESS:-10.76.128.93}
    expose:
      - ${FLARESOLVERR_PORT:-8191}
    environment:
      <<: *common-env
      # FlareSolverr Environment Variables
      # Verbosity of the logging. Use LOG_LEVEL=debug for more information.
      LOG_LEVEL: ${FLARESOLVERR_LOG_LEVEL:-info}  # Only for debugging. If true all HTML that passes through the proxy will be logged to the console in debug level.
      LOG_HTML: ${FLARESOLVERR_LOG_HTML:-false}  # Captcha solving method. It is used when a captcha is encountered.
      CAPTCHA_SOLVER: ${FLARESOLVERR_CAPTCHA_SOLVER:-none}  # Note: none of the captcha solvers work with the current version of Flaresolverr.
      PORT: ${FLARESOLVERR_PORT:-8191}  # Listening port.
      HOST: ${FLARESOLVERR_HOST:-0.0.0.0}  # Listening interface.
      HEADLESS: ${FLARESOLVERR_HEADLESS:-true}  # Only for debugging. To run the web browser in headless mode or visible.
      BROWSER_TIMEOUT: ${FLARESOLVERR_BROWSER_TIMEOUT:-120000}  # If you are experiencing errors/timeouts because your system is slow, you can try to increase this value.
      TEST_URL: ${FLARESOLVERR_TEST_URL:-https://www.google.com}  # FlareSolverr makes a request on start to make sure the web browser is working.
      PROMETHEUS_ENABLED: ${FLARESOLVERR_PROMETHEUS_ENABLED:-false}  # Enable Prometheus exporter
      PROMETHEUS_PORT: ${PROMETHEUS_PORT:-9090}  # Listening port for Prometheus exporter
    labels:
      deunhealth.restart.on.unhealthy: "true"
      traefik.enable: "true"
      traefik.http.routers.flaresolverr.middlewares: nginx-auth@docker
      traefik.http.routers.flaresolverr.rule: Host(`flaresolverr.${DOMAIN}`) || Host(`flaresolverr.${DUCKDNS_SUBDOMAIN}.duckdns.org`) || Host(`flaresolverr.${TS_HOSTNAME}.duckdns.org`)
      traefik.http.services.flaresolverr.loadbalancer.server.port: ${FLARESOLVERR_PORT:-8191}
      homepage.group: Infrastructure
      homepage.name: Flaresolverr
      homepage.icon: flaresolverr.png
      homepage.href: https://flaresolverr.${DOMAIN}/
      homepage.description: Flaresolverr is a proxy server that can bypass captchas and access cloudflare-captcha-protected websites.
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://127.0.0.1:${FLARESOLVERR_PORT:-8191}/health > /dev/null 2>&1 || exit 1"]
      interval: 30s
      timeout: 15s
      retries: 3
      start_period: 60s
    cpu_period: 100000
    cpu_quota: 100000
    cpu_shares: 10
    mem_reservation: 64M


I'm just trying to do the equivalent of this kubernetes:

requests:
    cpu: "3500m"
    memory: 30Mi
  limits:
    cpu: "4"
    memory: 4Gi


please search the web.

NOTE: DO NOT USE A DEPLOY SECTION, that is for swarm only! I AM NOT USING SWARM.
Show more

## Assistant

When you see the error:

…it means Docker detects both a NanoCPUs limit (via cpus: or automatic conversion) and explicit cpu_quota/cpu_period. These options overlap—they're incompatible and cannot be used together 
GitHub
+12
GitHub
+12
GitHub
+12
.

✅ How to fix
1. Choose one CPU-limiting method
Method	Compose Version	Syntax	Notes
cpus: (preferred)	v2.x	cpus: 3.5	Docker auto converts to nano_cpus ▸ easiest
Explicit CFS (quota/period)	v2.x	cpu_period: 100000, cpu_quota: 350000	Equivalent to cpus: 3.5 but verbose
deploy block (Swarm)	v3+	deploy: resources: limits: cpus: "3.5"	Only works in Swarm, not standalone Docker Compose
2. Using Compose v2 (standalone Docker)

Since you're not using Swarm, stick with version 2.x syntax. Here's how you translate your Kubernetes request/limit values:

YAML

This ensures:

You limit to 4 CPUs (like limits.cpu)

You reserve 64 MiB RAM (can lower to 30 MiB if desired) and limit at 4 GiB

No conflicting CPU flags (no cpu_quota, cpu_period, or nano_cpus manually defined) 
Reddit
+9
phoenixNAP | Global IT Services
+9
DevOps.dev
+9
Stack Overflow
+3
Baeldung
+3
Stack Overflow
+3

3. What about your cpu_period + cpu_quota?

If you explicitly set both and also set cpus, Docker complains about the conflict . So either drop the explicit CFS values or remove cpus:. Your cleanest option is using cpus: only.

If you do want exact CFS control, remove cpus: and define:

YAML

…but again, don't combine with cpus:.

✅ TL;DR

You're mixing two CPU-limiting methods—that's what triggers the error.

Use only one: prefer cpus: in Compose v2 for simplicity.

Remove cpu_period/cpu_quota, or remove cpus:.

Do not use deploy: since you're not using Swarm.

Let me know if you'd like me to help rewrite your full compose block!

## User

what SPECIFIC field is the 'nano cpus'

your response must EXCLUSIVELY be a line in this snippet:

cpu_period: 100000
    cpu_quota: 100000
    cpu_shares: 10
    mem_reservation: 6M
    mem_limit: 128M
    deploy:
      resources:
        reservations:
          cpus: 0.01
          memory: 6M
        limits:
          cpus: 0.1
          memory: 128M


literally none of them have the word 'nano'. Which one is nano.


AGAIN YOUR RESRPONSE MUST EXCLUSIVELY PICK A FUCKING LINE IN THE SNIPPET. search thew eb if you aren't sure

Show more
