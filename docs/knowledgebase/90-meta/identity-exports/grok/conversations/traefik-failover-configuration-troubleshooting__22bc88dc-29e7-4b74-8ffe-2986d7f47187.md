---
source_url: "https://grok.com/c/22bc88dc-29e7-4b74-8ffe-2986d7f47187"
conversation_id: "22bc88dc-29e7-4b74-8ffe-2986d7f47187"
title: "Traefik Failover Configuration Troubleshooting"
extracted_at: "2026-06-29T16:25:30.300Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Traefik Failover Configuration Troubleshooting

Source: [Grok conversation](https://grok.com/c/22bc88dc-29e7-4b74-8ffe-2986d7f47187)

## User

_Time: 2025-08-14T04:00:48.252Z_

What exactly am I doing wrong here?\
\
```\
   whoami: # 🔹🔹 Whoami 🔹🔹 image: docker.io/traefik/whoami:latest container_name: whoami hostname: whoami extra_hosts: - host.docker.internal:host-gateway networks: - publicnet expose: - 80 labels: traefik.enable: "true" # Direct access to whoami traefik.http.routers.whoami.rule: Host(`whoami.${TS_HOSTNAME}.${DOMAIN}`) traefik.http.routers.whoami.service: whoami@docker traefik.http.services.whoami.loadbalancer.server.port: 80 # Loadbalanced access to whoami traefik.http.routers.whoami-with-failover.rule: Host(`whoami.${DOMAIN}`) traefik.http.routers.whoami-with-failover.service: whoami-with-failover@docker traefik.http.services.whoami-with-failover.failover.service: whoami-servers@file traefik.http.services.whoami-with-failover.loadbalancer.server.port: 8080 # intentionally incorrect port (as a test) # Homepage definitions for whoami homepage.group: Web Services homepage.name: whoami homepage.icon: whoami.png homepage.href: https://whoami.${DOMAIN} homepage.description: Request echo service used to verify reverse-proxy, headers, and auth middleware restart: always\
```\
\
Using the following dynamic.yaml:\
```\
       http: services: whoami-servers: loadBalancer: servers: - url: http://whoami.micklethefickle.bolabaden.org - url: http://whoami.beatapostapita.bolabaden.org - url: http://whoami.vractormania.bolabaden.org - url: http://whoami.arnialtrashlid.bolabaden.org - url: http://whoami.cloudserver1.bolabaden.org - url: http://whoami.cloudserver2.bolabaden.org - url: http://whoami.cloudserver3.bolabaden.org\
```\
\
I get this output:\
\
```\
2025-08-14T03:55:04Z DBG github.com/traefik/traefik/v3/pkg/provider/acme/provider.go:1001 > No ACME certificate generation required for domains ACME CA=https://acme-v02.api.letsencrypt.org/directory acmeCA=https://acme-v02.api.letsencrypt.org/directory domains=["bolabaden.org","*.bolabaden.org","*.micklethefickle.bolabaden.org"] providerName=letsencrypt.acme 2025-08-14T03:55:08Z DBG github.com/traefik/traefik/v3/pkg/server/service/loadbalancer/wrr/wrr.go:175 > Service selected by WRR: http://10.76.0.36:8080 2025-08-14T03:55:08Z DBG github.com/traefik/traefik/v3/pkg/proxy/httputil/proxy.go:121 > 502 Bad Gateway error="dial tcp 10.76.0.36:8080: connect: connection refused" 2025-08-14T03:55:10Z DBG github.com/traefik/traefik/v3/pkg/server/service/loadbalancer/wrr/wrr.go:175 > Service selected by WRR: http://10.76.0.24:8081 2025-08-14T03:55:10Z DBG github.com/traefik/traefik/v3/pkg/server/service/loadbalancer/wrr/wrr.go:175 > Service selected by WRR: http://10.76.0.24:8081 2025-08-14T03:55:10Z DBG github.com/traefik/traefik/v3/pkg/server/service/loadbalancer/wrr/wrr.go:175 > Service selected by WRR: http://10.76.0.24:8081 2025-08-14T03:55:10Z DBG github.com/traefik/traefik/v3/pkg/server/service/loadbalancer/wrr/wrr.go:175 > Service selected by WRR: http://10.76.0.24:8081 2025-08-14T03:55:10Z DBG github.com/traefik/traefik/v3/pkg/server/service/loadbalancer/wrr/wrr.go:175 > Service selected by WRR: http://10.76.0.24:8081 2025-08-14T03:55:10Z DBG github.com/traefik/traefik/v3/pkg/server/service/loadbalancer/wrr/wrr.go:175 > Service selected by WRR: http://10.76.0.24:8081 2025-08-14T03:55:11Z DBG github.com/traefik/traefik/v3/pkg/server/service/loadbalancer/wrr/wrr.go:175 > Service selected by WRR: http://10.76.0.24:8081\
```\
\
to clarify, it's SPECIFICALLY the failover that isn't working, obviously when i set this to port 80 it works fine since it doesn't need to failover.\
\
```\
       # Loadbalanced access to whoami traefik.http.routers.whoami-with-failover.rule: Host(`whoami.${DOMAIN}`) traefik.http.routers.whoami-with-failover.service: whoami-with-failover@docker traefik.http.services.whoami-with-failover.failover.service: whoami-servers@file traefik.http.services.whoami-with-failover.loadbalancer.server.port: 8080 # intentionally incorrect port (as a test)\
```\
\
Wtf does it mean by failover if it's not failing over in the most intuitive scenario??? how to configure it to failover in this scenario.

## Assistant

_Time: 2025-08-14T04:02:16.152Z_

The configuration for the "whoami-with-failover" service combines elements of both a load balancer service and a failover service, which violates Traefik's service definition rules. Services must adhere to one specific type (load balancer, weighted round-robin, mirroring, or failover), as enforced by the schema. The presence of the `loadbalancer.server.port` setting causes Traefik to interpret the service as a load balancer type, effectively ignoring the incomplete failover configuration. This results in requests being directed solely to the specified (incorrect) port on the local container, leading to connection refusals and 502 errors without any fallback activation.

Additionally, the failover configuration is inverted: `failover.service` designates the primary service, while `failover.fallback` specifies the secondary service to use upon failure. In the provided labels, `failover.service` is set to `whoami-servers@file`, which incorrectly positions the external load-balanced servers as the primary target.

Failover in Traefik operates based on proactive health monitoring rather than reactive per-request error handling. Without a configured health check, Traefik does not automatically detect or respond to failures such as connection refusals. The health check must be defined on the failover service and will be applied to evaluate the primary service's availability. If the primary fails the health check (e.g., due to an unreachable port), Traefik switches all subsequent traffic to the fallback service until the primary recovers.

To achieve the intended behavior—where the primary targets the local Whoami container (intentionally at an incorrect port for testing) and falls back to the external servers upon failure—adjust the Docker Compose labels on the Whoami container as follows. This defines a separate primary load balancer service pointing to the container, then configures the failover service to reference it, including a health check to enable failure detection:

```
whoami: # 🔹🔹 Whoami 🔹🔹
  image: docker.io/traefik/whoami:latest
  container_name: whoami
  hostname: whoami
  extra_hosts:
    - host.docker.internal:host-gateway
  networks:
    - publicnet
  expose:
    - 80
  labels:
    traefik.enable: "true"
    # Direct access to whoami
    traefik.http.routers.whoami.rule: Host(`whoami.${TS_HOSTNAME}.${DOMAIN}`)
    traefik.http.routers.whoami.service: whoami@docker
    traefik.http.services.whoami.loadbalancer.server.port: 80
    # Define primary service (local container, intentionally wrong port for test)
    traefik.http.services.whoami-primary.loadbalancer.server.port: 8080
    # Failover service configuration
    traefik.http.routers.whoami-with-failover.rule: Host(`whoami.${DOMAIN}`)
    traefik.http.routers.whoami-with-failover.service: whoami-with-failover@docker
    traefik.http.services.whoami-with-failover.failover.service: whoami-primary@docker
    traefik.http.services.whoami-with-failover.failover.fallback: whoami-servers@file
    traefik.http.services.whoami-with-failover.failover.healthcheck.path: /
    traefik.http.services.whoami-with-failover.failover.healthcheck.scheme: http
    traefik.http.services.whoami-with-failover.failover.healthcheck.interval: 5s
    traefik.http.services.whoami-with-failover.failover.healthcheck.timeout: 3s
    traefik.http.services.whoami-with-failover.failover.healthcheck.followredirects: "true"
    # Homepage definitions for whoami
    homepage.group: Web Services
    homepage.name: whoami
    homepage.icon: whoami.png
    homepage.href: https://whoami.${DOMAIN}
    homepage.description: Request echo service used to verify reverse-proxy, headers, and auth middleware
  restart: always
```

### Key Adjustments and Rationale:
- **Separate Primary Service**: The `whoami-primary` service is defined as a simple load balancer targeting the local container at port 8080 (for testing). This isolates the failure point without conflicting with the failover type.
- **Failover Configuration**:
  - `failover.service`: Set to the primary (`whoami-primary@docker`).
  - `failover.fallback`: Set to the external load-balanced servers (`whoami-servers@file`).
  - No `loadbalancer` keys are present on `whoami-with-failover`, ensuring it is parsed as a failover type.
- **Health Check**: Configured on the failover service to monitor the primary. The Whoami image responds with HTTP 200 on `/`, making this a suitable path. Adjust `interval` and `timeout` as needed for your environment; these values ensure quick detection (e.g., failure within ~8-10 seconds). The health check uses HTTP requests to the primary's servers; if it fails repeatedly, Traefik marks the primary as unhealthy and routes to the fallback.
- **Removal of Conflicting Elements**: The `loadbalancer.server.port` on `whoami-with-failover` is removed to avoid type conflicts.
- **Provider Handling**: The primary and failover services are defined via Docker labels (`@docker`), while the fallback remains in the file provider (`@file`). Traefik merges these seamlessly.

After applying these changes, restart the Whoami container and monitor Traefik logs for health check activity (e.g., successful/failed probes on the primary). Initial requests may still hit the primary and fail until the health check marks it unhealthy, after which traffic will shift to the fallback. For production, replace port 8080 with 80 on the primary to test normal operation, and consider adding health checks to the fallback service if needed for symmetry. If further customization is required (e.g., method, headers, or status code ranges for health checks), refer to the schema under `httpLoadBalancerService.healthCheck` for available properties.
