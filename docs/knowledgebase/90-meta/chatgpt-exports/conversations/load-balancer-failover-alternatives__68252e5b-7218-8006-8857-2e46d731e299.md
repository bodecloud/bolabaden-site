---
source_url: "https://chatgpt.com/c/68252e5b-7218-8006-8857-2e46d731e299"
conversation_id: "68252e5b-7218-8006-8857-2e46d731e299"
title: "Load Balancer Failover Alternatives"
extracted_at: "2026-06-29T16:46:54.237Z"
message_count: 2
provenance: auth-ui
---

# Load Balancer Failover Alternatives

Source: [ChatGPT conversation](https://chatgpt.com/c/68252e5b-7218-8006-8857-2e46d731e299)

## User

loadbalancer_ha_failover: 
    build: .
    container_name: remote_loadbalancer
    network_mode: service:gluetun
    environment:
      - LB_DOMAIN=${LB_DOMAIN:-example.com}
      - LB_SERVICE_PORT=${LB_SERVICE_PORT:-8001}
      - LB_ORIGINS=${LB_ORIGINS:-'[{"id":"primary","host":"origin-primary.example.com","port":80,"weight":10,"primary":true},{"id":"secondary","host":"origin-secondary.example.com","port":80,"weight":10}]'}
      - LB_ALGORITHM=${LB_ALGORITHM:-round_robin}  # round_robin, least_conn, response_time, weighted, ip_hash, geo_location
      - HEALTHCHECK_PATH=${HEALTHCHECK_PATH:-/health}  # path to probe on each origin
      - HEALTHCHECK_INTERVAL=${HEALTHCHECK_INTERVAL:-10s}
      - HEALTHCHECK_TIMEOUT=${HEALTHCHECK_TIMEOUT:-3s}
      - HEALTHCHECK_RETRIES=${HEALTHCHECK_RETRIES:-3}  # failures before marking down
      - HEALTHCHECK_START_PERIOD=${HEALTHCHECK_START_PERIOD:-10s}
      - SESSION_STICKINESS=${SESSION_STICKINESS:-true}
      - SESSION_COOKIE_NAME=${SESSION_COOKIE_NAME:-LBSESSION}
      - SESSION_TTL=${SESSION_TTL:-3600}  # seconds
      - CIRCUIT_BREAKER_ENABLED=${CIRCUIT_BREAKER_ENABLED:-true}
      - CIRCUIT_BREAKER_THRESHOLD=${CIRCUIT_BREAKER_THRESHOLD:-5}  # consecutive failures
      - CIRCUIT_BREAKER_RECOVERY_INTERVAL=${CIRCUIT_BREAKER_RECOVERY_INTERVAL:-60s}
      - POOL_MAX_CONNECTIONS=${POOL_MAX_CONNECTIONS:-100}
      - POOL_KEEPALIVE=${POOL_KEEPALIVE:-20}
      - REQUEST_TIMEOUT=${REQUEST_TIMEOUT:-5s}
      - GEO_ROUTING_ENABLED=${GEO_ROUTING_ENABLED:-false}
      - GEOIP_DB_PATH=${GEOIP_DB_PATH:-}
      - GEOIP_SERVICE_URL=${GEOIP_SERVICE_URL:-}
      - GEOIP_SERVICE_KEY=${GEOIP_SERVICE_KEY:-}
      - METRICS_ENABLED=${METRICS_ENABLED:-true}
      - METRICS_PATH=${METRICS_PATH:-/metrics}
      - DASHBOARD_ENABLED=${DASHBOARD_ENABLED:-true}
      - DASHBOARD_PATH=${DASHBOARD_PATH:-/dashboard}
      - LB_LOG_LEVEL=${LB_LOG_LEVEL:-info}
    healthcheck:
      test: ["CMD-SHELL", "curl -sf http://localhost:${LB_SERVICE_PORT:-8001}${HEALTHCHECK_PATH:-/health} || exit 1"]
      interval: 10s
      timeout: 3s
      retries: 3
      start_period: 10s
    restart: always


What are the closest EXISTING projects that handle this functionality? trying to rfind a replacement for cloudflare's $5/mo/service failover implementation.

examples of things that are not even close:
- traefik
- nginx
- haproxy

all of the above don't do what this is attempting to.
Show more

## Assistant

You're seeking an open-source alternative to Cloudflare's $5/month failover service that offers advanced load balancing features such as health checks, session stickiness, circuit breakers, and geo-routing. While mainstream tools like Traefik, NGINX, and HAProxy provide some of these capabilities, they may not fully meet your requirements. Here are some projects that align more closely with your needs:

🔧 1. SocketCluster LoadBalancer.js

Overview: A sticky-session TCP load balancer optimized for real-time applications.

Key Features:

IP-based session stickiness.

Automatic failover: reroutes connections if a target becomes unavailable.

Health checks with configurable deactivation durations.

Custom middleware support for connection-level logic.

Limitations:

Operates at the TCP layer; lacks built-in HTTP-level features like circuit breakers or geo-routing.

Use Case: Ideal for applications requiring persistent TCP connections with basic failover capabilities.
GitHub
+1
Geekflare
+2
TungDT
+2
Better Stack
+5
GitHub
+5
TungDT
+5

⚙️ 2. sanjay-sol/Load_Balancer

Overview: A Go-based HTTP load balancer implementing weighted round-robin distribution.

Key Features:

Supports both round-robin and weighted selection algorithms.

Periodic health checks to monitor backend server availability.

Retry mechanism with dynamic weight adjustments based on server health.

Limitations:

Lacks advanced features like session stickiness, circuit breakers, and geo-routing.

Use Case: Suitable for scenarios requiring simple HTTP load balancing with health monitoring.
Geekflare
+3
GitHub
+3
Pwshub
+3

🧪 3. martishin/load-balancer

Overview: A minimalist Go-based load balancer focusing on simplicity.

Key Features:

Implements round-robin load distribution.

Basic health checks to ensure backend availability.

Limitations:

Does not support session stickiness, circuit breakers, or geo-routing.

Use Case: Best for educational purposes or lightweight applications needing basic load balancing.

🧩 4. Envoy Proxy

Overview: A high-performance L7 proxy designed for cloud-native applications and microservices.

Key Features:

Advanced load balancing strategies, including round-robin and least connections.

Circuit breaking and retry policies to enhance resilience.

Dynamic health checks and service discovery integration.

Supports HTTP/2 and gRPC, with observability features like distributed tracing.

Limitations:

Complex configuration; may be overkill for simpler use cases.

Use Case: Ideal for complex, service-oriented architectures requiring robust traffic management.
Geekflare
+2
Better Stack
+2
Better Stack
+2
Geekflare
+2

🧰 5. Kong Gateway

Overview: An extensible API gateway built on NGINX, offering plugins for enhanced functionality.

Key Features:

Session stickiness through a dedicated plugin.

Load balancing with health checks.

Extensive plugin ecosystem for features like rate limiting and authentication.

Limitations:

Some advanced features may require enterprise licensing.

Use Case: Suitable for API-centric applications needing customizable traffic control.
Geekflare
+1
Traefik Labs Community Forum

🧠 6. Caddy

Overview: A modern web server with automatic HTTPS and a focus on simplicity.

Key Features:

Automatic TLS certificate management.

Load balancing with policies like round-robin and least connections.

Health checks and circuit breaking capabilities.

Limitations:

Less mature ecosystem compared to other solutions; may require custom plugins for advanced features.

Use Case: Great for developers seeking an easy-to-configure server with built-in HTTPS and basic load balancing.
Pwshub

Recommendation:

Given your requirements, Envoy Proxy stands out as a comprehensive solution offering advanced features like circuit breaking, health checks, and support for modern protocols. However, if you prefer a simpler setup and are comfortable with Go, sanjay-sol/Load_Balancer provides a foundation that you could extend to include additional features like session stickiness and circuit breakers.

If you're open to commercial solutions, Kong Gateway and Caddy offer user-friendly interfaces with plugin ecosystems that might fulfill your needs with less development overhead.

Would you like assistance in setting up any of these solutions or further customization to match your specific requirements?
