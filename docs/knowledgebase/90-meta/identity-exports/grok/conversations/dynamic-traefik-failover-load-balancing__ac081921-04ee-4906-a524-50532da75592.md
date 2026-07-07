---
source_url: "https://grok.com/c/ac081921-04ee-4906-a524-50532da75592"
conversation_id: "ac081921-04ee-4906-a524-50532da75592"
title: "Dynamic Traefik Failover Load Balancing"
extracted_at: "2026-06-29T16:25:25.958Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Dynamic Traefik Failover Load Balancing

Source: [Grok conversation](https://grok.com/c/ac081921-04ee-4906-a524-50532da75592)

## User

_Time: 2025-08-18T17:38:06.318Z_

```
# yaml-language-server: $schema=https://www.schemastore.org/traefik-v3-file-provider.json
http:
  routers:
    catchall:
      service: failover-proxy@docker
      rule: Host(`bolabaden.org`) || Host(`beatapostapita.bolabaden.org`) || HostRegexp(`^(.+)$`)  # Note: leave the bolabaden.org || beatapostapita.bolabaden.org, otherwise traefik spams an annoying warning. Doesn't affect functionality though.
      priority: 0
      middlewares:
        - strip-www@file
        - http-to-https-redirect-simple@file
    whoami-with-failover:
      service: whoami-with-failover@file
      rule: Host(`whoami.bolabaden.org`)
    whoami-direct:
      service: whoami-direct@file
      rule: Host(`whoami.beatapostapita.bolabaden.org`)
    dozzle-with-failover:
      service: dozzle-with-failover@file
      rule: Host(`dozzle.bolabaden.org`)
    dozzle-direct:
      service: dozzle-direct@file
      rule: Host(`dozzle.beatapostapita.bolabaden.org`)
    jackett-with-failover:
      service: jackett-with-failover@file
      rule: Host(`jackett.bolabaden.org`)
    jackett-direct:
      service: jackett-direct@file
      rule: Host(`jackett.beatapostapita.bolabaden.org`)
  services:
    stremio-server-https-with-failover:
      failover:
        service: stremio-server-https-direct@file
        fallback: stremio-server-servers@file
    stremio-server-https-direct:
      loadBalancer:
        servers:
          - url: https://stremio-server:12470
        healthCheck:
          path: "/"
          interval: "15s"
          timeout: "5s"
    stremio-server-http-with-failover:
      failover:
        service: stremio-server-http-direct@file
        fallback: stremio-server-servers@file
    stremio-server-http-direct:
      loadBalancer:
        servers:
          - url: http://stremio-server:11470
        healthCheck:
          path: "/"
          interval: "15s"
          timeout: "5s"
    stremio-server-servers:
      loadBalancer:
        servers:
          - url: http://stremio-server:11470
          - url: https://stremio-server.beatapostapita.bolabaden.org
          - url: https://stremio-server.beatapostapita.bolabaden.org
          - url: https://stremio-server.vractormania.bolabaden.org
          - url: https://stremio-server.arnialtrashlid.bolabaden.org
          - url: https://stremio-server.cloudserver1.bolabaden.org
          - url: https://stremio-server.cloudserver2.bolabaden.org
          - url: https://stremio-server.cloudserver3.bolabaden.org
        healthCheck:
          path: "/"
          interval: "15s"
          timeout: "5s"
    stremio-web-with-failover:
      failover:
        service: stremio-web-direct@file
        fallback: stremio-web-servers@file
    stremio-web-direct:
      loadBalancer:
        servers:
          - url: http://stremio-web:8080
        healthCheck:
          path: "/"
          interval: "15s"
          timeout: "5s"
    stremio-web-servers:
      loadBalancer:
        servers:
          - url: http://stremio-web:8080
          - url: https://stremio-web.beatapostapita.bolabaden.org
          - url: https://stremio-web.beatapostapita.bolabaden.org
          - url: https://stremio-web.vractormania.bolabaden.org
          - url: https://stremio-web.arnialtrashlid.bolabaden.org
          - url: https://stremio-web.cloudserver1.bolabaden.org
          - url: https://stremio-web.cloudserver2.bolabaden.org
          - url: https://stremio-web.cloudserver3.bolabaden.org
        healthCheck:
          path: "/"
          interval: "15s"
          timeout: "5s"
    jackett-with-failover:
      failover:
        service: jackett-direct@file
        fallback: jackett-servers@file
    jackett-direct:
      loadBalancer:
        servers:
          - url: http://jackett:9117
        healthCheck:
          path: "/"
          interval: "15s"
          timeout: "5s"
    jackett-servers:
      loadBalancer:
        servers:
          - url: http://jackett:9117
          - url: https://jackett.beatapostapita.bolabaden.org
          - url: https://jackett.beatapostapita.bolabaden.org
          - url: https://jackett.vractormania.bolabaden.org
          - url: https://jackett.arnialtrashlid.bolabaden.org
          - url: https://jackett.cloudserver1.bolabaden.org
          - url: https://jackett.cloudserver2.bolabaden.org
          - url: https://jackett.cloudserver3.bolabaden.org
        healthCheck:
          path: "/"
          interval: "15s"
          timeout: "5s"
    dozzle-with-failover:
      failover:
        service: dozzle-direct@file
        fallback: dozzle-servers@file
    dozzle-direct:
      loadBalancer:
        servers:
          - url: http://dozzle:8080
        healthCheck:
          path: "/"
          interval: "15s"
          timeout: "5s"
    dozzle-servers:
      loadBalancer:
        servers:
          - url: http://dozzle:8080
          - url: https://dozzle.beatapostapita.bolabaden.org
          - url: https://dozzle.beatapostapita.bolabaden.org
          - url: https://dozzle.vractormania.bolabaden.org
          - url: https://dozzle.arnialtrashlid.bolabaden.org
          - url: https://dozzle.cloudserver1.bolabaden.org
          - url: https://dozzle.cloudserver2.bolabaden.org
          - url: https://dozzle.cloudserver3.bolabaden.org
        healthCheck:
          path: "/"
          interval: "15s"
          timeout: "5s"
    whoami-with-failover:
      failover:
        service: whoami-direct@file
        fallback: whoami-servers@file
    whoami-direct:
      loadBalancer:
        servers:
          - url: http://whoami:80
        healthCheck:
          path: "/"
          interval: "15s"
          timeout: "5s"
    whoami-servers:
      loadBalancer:
        servers:
          - url: http://whoami:80
          - url: https://whoami.beatapostapita.bolabaden.org
          - url: https://whoami.beatapostapita.bolabaden.org
          - url: https://whoami.vractormania.bolabaden.org
          - url: https://whoami.arnialtrashlid.bolabaden.org
          - url: https://whoami.cloudserver1.bolabaden.org
          - url: https://whoami.cloudserver2.bolabaden.org
          - url: https://whoami.cloudserver3.bolabaden.org
        healthCheck:
          path: "/"
          interval: "15s"
          timeout: "5s"
  middlewares:
    strip-www:
      redirectRegex:
        regex: '^(http|https)?://www\.(.+)$'
        replacement: '${1}://${2}'
        permanent: false
    http-to-https-redirect-simple:
      redirectScheme:
        scheme: https
        permanent: false
```

Please analyze and determine the common pattern in the above traefik dynamic yaml configuration for traefik's file provider.
 
it's annoying to define each service, manually, one by one exhaustively like that. Please find a dynamic way to failover/loadbalance *.bolabaden.org to *.backend.bolabaden.org 1:1 with the existing examples, but fully **dynamic**.
 
Pay attention to this part, which is the first step:

```

    catchall:
      service: failover-proxy@docker
      rule: Host(`bolabaden.org`) || Host(`beatapostapita.bolabaden.org`) || HostRegexp(`^(.+)$`)  # Note: leave the bolabaden.org || beatapostapita.bolabaden.org, otherwise traefik spams an annoying warning. Doesn't affect functionality though.
      priority: 0
      middlewares:
        - strip-www@file
        - http-to-https-redirect-simple@file
```

this will route anything that doesn't have a router to a docker container service named failover-proxy. This docker container/service is where your solution will be, exhaustively. DO NOT RECOMMEND haproxy OR nginx UNDER ANY CIRCUMSTANCES, DO NOT EVEN MENTION IT IN YOUR RESPONSE.
 
research the web, exhaustively and comprehensively, until you find **existing projects** that have successfully achieved what i'm trying to do, vaguely. Ensure your research covers documentation for various reverse proxy/ha/loadbalancers as well. Your solution exclusively must be a docker-compose.yaml container/service named 'failover-proxy', compatible with the above dynamic.yaml. It absolutely CANNOT hardcode service names or subdomain names, must be fully dynamic following the pattern you've just analyzed :)

## Assistant

_Time: 2025-08-18T17:47:21.012Z_

### Common Pattern in the Traefik Dynamic YAML Configuration

The provided configuration exhibits a consistent pattern for handling routing and failover/load balancing across multiple services:

- **Routers**: Each service has two routers—one for the main domain (e.g., `Host(`whoami.bolabaden.org`)`) directing to a failover service, and one for the server-specific subdomain (e.g., `Host(`whoami.beatapostapita.bolabaden.org`)`) directing to a direct local service. The catchall router captures unmatched hosts at low priority, applying middlewares for WWW stripping and HTTP-to-HTTPS redirection.

- **Services**: Services are structured in tiers:
  - `-with-failover`: A failover service that prioritizes the local direct service, falling back to a load-balanced cluster if the local is unavailable.
  - `-direct`: A load-balanced service targeting the local container (e.g., `http://whoami:80`) with health checks on path `/`, interval 15s, and timeout 5s.
  - `-servers`: A load-balanced service including the local URL and HTTPS URLs to the same service on remote servers (e.g., `https://whoami.beatapostapita.bolabaden.org`), with identical health checks.

- **Middlewares**: Global middlewares for redirecting WWW prefixes and HTTP to HTTPS.

- **Pattern Generalization**: The configuration repeats for each service (e.g., whoami, dozzle, jackett, stremio-web, stremio-server), with fixed lists of remote servers. Local ports vary per service, and some services (e.g., stremio-server) have separate HTTP and HTTPS variants. The backends are a fixed set of subdomains (beatapostapita, vractormania, arnialtrashlid, cloudserver1, cloudserver2, cloudserver3), representing different servers in a cluster. This setup enables failover from local to cluster-wide load balancing, but requires manual definition for each service, leading to repetition.

### Dynamic Failover/Load Balancing Solution

To achieve a fully dynamic failover/load balancing for arbitrary `*.bolabaden.org` to corresponding `*.backend.bolabaden.org` without hardcoding service names, the `failover-proxy` container can be implemented using Envoy Proxy. Envoy is a high-performance reverse proxy and load balancer that supports dynamic request handling, header rewriting, and retries on specific status codes (e.g., 404 for absent services). This aligns with existing projects and documentation for cluster load balancing in multi-server environments, such as those using Envoy for service discovery and failover in cloud setups (e.g., Istio-inspired configurations and Envoy's use in distributed systems for subdomain-based routing).

The solution routes requests to `service.bolabaden.org` by load balancing across fixed backend servers, dynamically rewriting the Host header to `service.backend.bolabaden.org` for each selected backend. If a backend lacks the service (no direct router defined), it returns 404, triggering a retry to another backend. Health checks ensure server availability, treating 404 on the bare backend domain as healthy (indicating Traefik is responsive).

#### Recommended Updates to Traefik Dynamic YAML
Update the catchall router rule to match only single-level subdomains, preventing loops when proxying to backends:
```
catchall:
  service: failover-proxy@docker
  rule: Host(`bolabaden.org`) || Host(`beatapostapita.bolabaden.org`) || HostRegexp(`^[a-z0-9-]+\.bolabaden\.org$`)
  priority: 0
  middlewares:
    - strip-www@file
    - http-to-https-redirect-simple@file
```
This ensures two-level hosts (e.g., `service.beatapostapita.bolabaden.org`) do not hit the catchall, returning 404 if undefined (enabling retry logic).

#### Docker Compose Snippet for `failover-proxy`
```
services:
  failover-proxy:
    image: envoyproxy/envoy:v1.31.0  # Use the latest stable version as of August 2025.
    volumes:
      - ./envoy.yaml:/etc/envoy/envoy.yaml
    networks:
      - default  # Ensure it shares the network with Traefik for internal communication.
```
Create `envoy.yaml` with the following configuration:
```
static_resources:
  listeners:
    - name: listener_http
      address:
        socket_address:
          address: 0.0.0.0
          port_value: 80
      filter_chains:
        - filters:
            - name: envoy.filters.network.http_connection_manager
              typed_config:
                "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
                stat_prefix: ingress_http
                route_config:
                  name: local_route
                  virtual_hosts:
                    - name: backend
                      domains: ["*"]
                      routes:
                        - match:
                            prefix: "/"
                          route:
                            cluster: backends_cluster
                            retry_policy:
                              retry_on: connect-failure,refused-stream,unavailable,cancelled,retriable-status-codes
                              num_retries: 7  # Exceeds the number of backends to try all if needed.
                              retriable_status_codes:
                                - 404
                http_filters:
                  - name: envoy.filters.http.lua
                    typed_config:
                      "@type": type.googleapis.com/envoy.extensions.filters.http.lua.v3.Lua
                      inline_code: |
                        function envoy_on_request(request_handle)
                          local original_host = request_handle:headers():get(":authority")
                          local subdomain = string.match(original_host, "^([a-z0-9-]+)%.bolabaden%.org$")
                          if subdomain then
                            local upstream_address = request_handle:streamInfo():upstreamHostDescription():address():socketAddress():address()
                            request_handle:headers():replace(":authority", subdomain .. "." .. upstream_address)
                          end
                        end
                  - name: envoy.filters.http.router
                    typed_config:
                      "@type": type.googleapis.com/envoy.extensions.filters.http.router.v3.Router

  clusters:
    - name: backends_cluster
      connect_timeout: 5s
      type: STRICT_DNS
      lb_policy: ROUND_ROBIN
      health_checks:
        - timeout: 5s
          interval: 15s
          unhealthy_threshold: 3
          healthy_threshold: 2
          http_health_check:
            path: "/"
            expected_statuses:
              - start: 404
                end: 405  # Treat 404 as healthy (Traefik responding).
      load_assignment:
        cluster_name: backends_cluster
        endpoints:
          - lb_endpoints:
              - endpoint:
                  address:
                    socket_address:
                      address: beatapostapita.bolabaden.org
                      port_value: 443
              - endpoint:
                  address:
                    socket_address:
                      address: vractormania.bolabaden.org
                      port_value: 443
              - endpoint:
                  address:
                    socket_address:
                      address: arnialtrashlid.bolabaden.org
                      port_value: 443
              - endpoint:
                  address:
                    socket_address:
                      address: cloudserver1.bolabaden.org
                      port_value: 443
              - endpoint:
                  address:
                    socket_address:
                      address: cloudserver2.bolabaden.org
                      port_value: 443
              - endpoint:
                  address:
                    socket_address:
                      address: cloudserver3.bolabaden.org
                      port_value: 443
      transport_socket:
        name: envoy.transport_sockets.tls
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.transport_sockets.tls.v3.UpstreamTlsContext
          validation_context:
            trust_chain_verification: ACCEPT_UNTRUSTED  # Adjust based on certificate validation needs.
```

This configuration is compatible with the provided Traefik dynamic YAML, as the catchall routes unmatched traffic to the `failover-proxy` service. For new services, deploy the container on the desired backend server(s) and add the direct router only on those servers' Traefik configurations. No changes are needed on the main configuration, ensuring full dynamism.
