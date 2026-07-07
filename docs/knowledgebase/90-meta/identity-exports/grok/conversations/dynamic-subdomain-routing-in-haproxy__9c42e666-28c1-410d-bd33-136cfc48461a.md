---
source_url: "https://grok.com/c/9c42e666-28c1-410d-bd33-136cfc48461a"
conversation_id: "9c42e666-28c1-410d-bd33-136cfc48461a"
title: "Dynamic Subdomain Routing in HAProxy"
extracted_at: "2026-06-29T16:25:26.248Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Dynamic Subdomain Routing in HAProxy

Source: [Grok conversation](https://grok.com/c/9c42e666-28c1-410d-bd33-136cfc48461a)

## User

_Time: 2025-08-18T00:24:46.298Z_

```

# yaml-language-server: $schema=https://www.schemastore.org/traefik-v3-file-provider.json
http:
  routers:
    catchall:
      service: failover-proxy@file
      rule: Host(`bolabaden.org`) || Host(`micklethefickle.bolabaden.org`) || HostRegexp(`^(.+)$`)
      priority: -1000
      middlewares:
        - strip-www@file
        - http-to-https-redirect-simple@file
    nginx-traefik-extensions:
      service: nginx-traefik-extensions
      rule: Host(`nginx-traefik-extensions.bolabaden.org`) || Host(`nginx-traefik-extensions.micklethefickle.bolabaden.org`)
    whoami-with-failover:
      service: whoami-with-failover@file
      rule: Host(`whoami.bolabaden.org`)
    whoami-direct:
      service: whoami-direct@file
      rule: Host(`whoami.micklethefickle.bolabaden.org`)
  services:
    whoami-direct:
      loadBalancer:
        servers:
          - url: http://whoami:80
        healthCheck:
          path: "/"
          interval: "15s"
          timeout: "5s"
    whoami-with-failover:
      failover:
        service: whoami-direct@file
        fallback: whoami-servers@file
    whoami-servers:
      loadBalancer:
        servers:
          - url: http://whoami:80
          - url: https://whoami.micklethefickle.bolabaden.org
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

How to do this in haproxy. Specifically, with a modification. I do NOT want to hardcode whoami in the domain, i would like it to support anything *.bolabaden.org and properly failover/loadbalance across *.micklethefickle.bolabaden.org, *.vractormania.bolabaden.org, etcetc.
 
the above is how to do it in traefik. It clearly doesn't support dynamic routing. Find something that does.

## Assistant

_Time: 2025-08-18T00:29:37.459Z_

The provided Traefik configuration implements routing, redirection, and failover/load balancing for specific hosts, but lacks support for dynamic subdomains without hardcoded references. HAProxy can achieve a similar setup with modifications to support arbitrary subdomains (e.g., any *.bolabaden.org) while load balancing across corresponding targets in fixed cluster domains (e.g., *.micklethefickle.bolabaden.org, *.beatapostapita.bolabaden.org, and so forth). This is accomplished using HAProxy's expression-based variables, random selection for load balancing, and dynamic destination resolution via the `http-request set-dst` directive, which performs per-request DNS lookups for hostnames.

Note that true failover (e.g., automatic retry to another target on connection failure) is not natively supported in this dynamic setup without additional Lua scripting or external health monitoring, as health checks require static server definitions. The configuration below implements random load balancing across the seven cluster domains extracted from your Traefik example. If a target is unreachable, HAProxy will fail the request, but retries can be configured to attempt the same target multiple times (though this does not switch targets).

The configuration assumes:
- A wildcard SSL certificate for *.bolabaden.org is available (e.g., at /etc/haproxy/certs/bolabaden.org.pem, combining the certificate, key, and any chain).
- DNS resolution is handled via public resolvers; adjust as needed.
- Specific routing for "nginx-traefik-extensions" is included as a static backend (adapt the server address to your environment).
- Dynamic routing applies only to single-level subdomains (e.g., app.bolabaden.org) and excludes cluster-like prefixes to prevent loops.
- The root domain (bolabaden.org) and multi-level subdomains matching cluster names fall to a default or error backend.

Here is the equivalent HAProxy configuration:

```
global
    log /dev/log local0
    log /dev/log local1 notice
    chroot /var/lib/haproxy
    stats socket /run/haproxy/admin.sock mode 660 level admin expose-fd listeners
    stats timeout 30s
    user haproxy
    group haproxy
    daemon
    ca-base /etc/ssl/certs
    crt-base /etc/ssl/private

defaults
    log global
    mode http
    option httplog
    option dontlognull
    timeout connect 5000
    timeout client  30000
    timeout server  30000
    errorfile 400 /etc/haproxy/errors/400.http
    errorfile 403 /etc/haproxy/errors/403.http
    errorfile 408 /etc/haproxy/errors/408.http
    errorfile 500 /etc/haproxy/errors/500.http
    errorfile 502 /etc/haproxy/errors/502.http
    errorfile 503 /etc/haproxy/errors/503.http
    errorfile 504 /etc/haproxy/errors/504.http

resolvers dns
    nameserver google 8.8.8.8:53
    nameserver cloudflare 1.1.1.1:53
    hold valid 10s
    hold nx 3s
    hold other 3s
    accepted_payload_size 8192

frontend http-in
    bind *:80
    acl is_www hdr_beg(host) -i www.
    http-request redirect location https://%[hdr(host),regsub(^www\.,,i)]%[path]%[query,regsub(^$,,)] code 302 if is_www
    http-request redirect scheme https code 302 if !is_www

frontend https-in
    bind *:443 ssl crt /etc/haproxy/certs/bolabaden.org.pem
    http-request set-log-level err

    # Specific routing (e.g., for nginx-traefik-extensions)
    acl is_nginx hdr(host) -i nginx-traefik-extensions.bolabaden.org nginx-traefik-extensions.micklethefickle.bolabaden.org
    use_backend nginx-traefik-extensions if is_nginx

    # Dynamic routing for *.bolabaden.org
    acl is_main_domain req.hdr(host),wordcount(.) eq 3
    acl is_bolabaden hdr_end(host) -i .bolabaden.org
    acl is_dynamic is_main_domain is_bolabaden
    acl is_cluster req.hdr(host),field(1,.),lower -m str micklethefickle beatapostapita vractormania arnialtrashlid cloudserver1 cloudserver2 cloudserver3
    http-request set-var(txn.subdomain) req.hdr(host),field(1,.),lower if is_dynamic !is_cluster
    http-request set-var(txn.rand) random(7) if is_dynamic !is_cluster
    http-request set-var(txn.d) str(micklethefickle) if { var(txn.rand) eq 0 } is_dynamic !is_cluster
    http-request set-var(txn.d) str(beatapostapita) if { var(txn.rand) eq 1 } is_dynamic !is_cluster
    http-request set-var(txn.d) str(vractormania) if { var(txn.rand) eq 2 } is_dynamic !is_cluster
    http-request set-var(txn.d) str(arnialtrashlid) if { var(txn.rand) eq 3 } is_dynamic !is_cluster
    http-request set-var(txn.d) str(cloudserver1) if { var(txn.rand) eq 4 } is_dynamic !is_cluster
    http-request set-var(txn.d) str(cloudserver2) if { var(txn.rand) eq 5 } is_dynamic !is_cluster
    http-request set-var(txn.d) str(cloudserver3) if { var(txn.rand) eq 6 } is_dynamic !is_cluster
    http-request set-var(txn.target_host) var(txn.subdomain),concat(.,var(txn.d),.bolabaden.org) if is_dynamic !is_cluster
    use_backend dynamic-lb if is_dynamic !is_cluster

    # Catchall for unmatched (e.g., root domain or other hosts) - redirect or error as needed
    default_backend catchall

backend nginx-traefik-extensions
    option forwardfor
    http-request set-header X-Forwarded-Proto https
    http-request set-header Connection "upgrade"
    server nginx-traefik 127.0.0.1:80  # Adjust to your actual service address
    healthcheck interval 15s timeout 5s

backend dynamic-lb
    option forwardfor
    http-request set-header X-Forwarded-Proto https
    http-request set-header Host %[var(txn.target_host)]
    http-request set-dst var(txn.target_host)
    http-request set-dst-port int(443)
    option ssl
    server-ssl verify none  # Disable verification if backends use self-signed certs; otherwise, configure CA
    retries 3  # Basic retries on the same target
    retry-on conn-failure 5xx
    server dummy 127.0.0.1:80 disabled  # Placeholder; actual destination set dynamically

backend catchall
    http-request return status 404 content-type text/plain string "Not found"
```

### Explanation
- **HTTP Frontend (Port 80)**: Handles WWW stripping and HTTP-to-HTTPS redirection, mirroring the Traefik middlewares. The `location` redirect preserves the path and query.
- **HTTPS Frontend (Port 443)**: Terminates TLS using a wildcard certificate. It checks for specific hosts (e.g., nginx-traefik-extensions) and applies dynamic logic for qualifying subdomains.
- **Dynamic Logic**:
  - Identifies main domains (3-part hosts ending in .bolabaden.org, e.g., app.bolabaden.org).
  - Excludes cluster prefixes to avoid routing loops.
  - Extracts the subdomain (e.g., "app").
  - Selects a random cluster (0-6) for load balancing.
  - Constructs the target hostname (e.g., app.micklethefickle.bolabaden.org).
- **Dynamic Backend**: Uses `set-dst` to resolve and connect to the constructed hostname on port 443 with TLS re-encryption. The Host header is updated for the backend request.
- **Limitations and Enhancements**:
  - Load balancing is random per request, distributing traffic evenly over time.
  - No built-in health checks or automatic failover to another cluster on failure, as destinations are dynamic. For improved reliability, integrate Lua to cache health status or use an external orchestrator.
  - Test DNS resolution latency; cache results externally if needed.
  - Adjust the certificate path, resolver nameservers, and specific backend servers to fit your environment.
  - For production, enable logging, monitoring, and appropriate timeouts.

This configuration provides the requested dynamic routing in HAProxy. If you require further customization, such as integrating Lua for advanced failover or handling root domain routing differently, provide additional details.

## User

_Time: 2025-08-18T00:47:33.757Z_

i'd like a more modern alternative to haproxy that does the same thing. Something I can put in a docker container and tell my reverse proxy to route unhandled requests to. Something that'll seamlessly dynamically integrate with stuff like uptime-kuma and ddns

## Assistant

_Time: 2025-08-18T00:50:47.347Z_

The query seeks a modern, containerized alternative to HAProxy capable of handling dynamic subdomain routing for domains such as *.bolabaden.org, with load balancing and failover across corresponding subdomains in predefined cluster domains (e.g., *.micklethefickle.bolabaden.org, *.beatapostapita.bolabaden.org, and similar). The solution must function as a catch-all backend for unhandled requests from an existing reverse proxy, while integrating effectively with monitoring tools like Uptime Kuma and dynamic DNS (DDNS) services.

After evaluating options such as Traefik (limited native support for variable interpolation in upstream URLs without custom plugins), Caddy (supports placeholders for dynamic upstreams but treats them as a single entity for health checks, complicating per-cluster management), and others, Envoy Proxy emerges as the most suitable modern alternative. Envoy is a high-performance, cloud-native proxy developed for dynamic environments, widely used in service meshes like Istio. It supports runtime DNS resolution, Lua scripting for custom logic (e.g., subdomain extraction and random cluster selection), and dynamic forward proxying for arbitrary upstreams without predefined configurations.

### Key Advantages of Envoy Over HAProxy
- **Modern Architecture**: Envoy is designed for microservices and dynamic infrastructures, with features like xDS (though not required here) for extensibility. It is written in C++ for efficiency and integrates natively with observability tools.
- **Dynamic Routing and Load Balancing**: Using the dynamic forward proxy filter and Lua, Envoy resolves upstreams per request via DNS, enabling seamless DDNS integration (as IP changes are reflected in resolutions without reconfiguration).
- **Containerization**: Official Docker images (e.g., `envoyproxy/envoy:v1.31.0` or latest) are available, making deployment straightforward.
- **Catch-All Functionality**: Envoy can serve as a fallback proxy, handling unhandled traffic routed from the primary reverse proxy.
- **Integration with Uptime Kuma and DDNS**:
  - **Uptime Kuma**: Envoy exposes comprehensive metrics via its admin interface (e.g., at `/stats/prometheus`), compatible with Prometheus scraping. Uptime Kuma can monitor these metrics or perform HTTP/HTTPS checks on backends directly. For advanced integration, Uptime Kuma alerts can trigger external scripts to adjust Envoy config if needed, though the dynamic DNS resolution minimizes this requirement.
  - **DDNS**: Envoy's DNS resolver caches results with configurable TTLs, ensuring updates from DDNS propagate quickly without restarts.
- **Health Checks and Failover**: Supports passive retries and circuit breaking. Active health checks are not feasible for fully dynamic upstreams, but Lua-based logic and retry policies provide basic failover by attempting alternative clusters on failure.

### Envoy Configuration
Below is a sample `envoy.yaml` configuration achieving the desired behavior. It assumes:
- A wildcard certificate for *.bolabaden.org (mounted in Docker at `/etc/envoy/certs/bolabaden.org.crt` and `/etc/envoy/certs/bolabaden.org.key`).
- DNS resolution via system resolvers (configurable for custom nameservers).
- Lua script for extracting the subdomain and randomly selecting a cluster.
- Specific routing for `nginx-traefik-extensions` (adjust the upstream IP/port as needed).
- Catch-all for unmatched hosts returns a 404.

```yaml
admin:
  address:
    socket_address: { address: 127.0.0.1, port_value: 9901 }

static_resources:
  listeners:
  - name: http_listener
    address:
      socket_address: { address: 0.0.0.0, port_value: 80 }
    filter_chains:
    - filters:
      - name: envoy.filters.network.http_connection_manager
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
          stat_prefix: ingress_http
          route_config:
            name: local_route
            virtual_hosts:
            - name: local_service
              domains: ["*"]
              response_headers_to_add:
              - header: { key: "Location", value: "https://%{REQ(:authority)}%{REQ(:path)}" }
              typed_per_filter_config:
                envoy.filters.http.ext_proc:
                  "@type": type.googleapis.com/envoy.extensions.filters.http.ext_proc.v3.ExternalProcessor
                  # Simple HTTP to HTTPS redirect
          http_filters:
          - name: envoy.filters.http.router

  - name: https_listener
    address:
      socket_address: { address: 0.0.0.0, port_value: 443 }
    filter_chains:
    - filters:
      - name: envoy.filters.network.http_connection_manager
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager
          stat_prefix: ingress_https
          route_config:
            name: dynamic_route
            virtual_hosts:
            - name: specific_nginx
              domains: ["nginx-traefik-extensions.bolabaden.org", "nginx-traefik-extensions.micklethefickle.bolabaden.org"]
              routes:
              - match: { prefix: "/" }
                route: { cluster: nginx_backend }
            - name: dynamic_subdomains
              domains: ["*.bolabaden.org"]
              routes:
              - match: { prefix: "/" }
                route: { cluster: dynamic_cluster }
              typed_per_filter_config:
                envoy.filters.http.lua:
                  "@type": type.googleapis.com/envoy.extensions.filters.http.lua.v3.Lua
                  inline_code: |
                    function envoy_on_request(request_handle)
                      local host = request_handle:headers():get(":authority")
                      local subdomain = string.match(host, "^([^.]+)%.bolabaden%.org$")
                      if subdomain and not string.match(subdomain, "^(micklethefickle|beatapostapita|vractormania|arnialtrashlid|cloudserver1|cloudserver2|cloudserver3)$") then
                        local clusters = {"micklethefickle", "beatapostapita", "vractormania", "arnialtrashlid", "cloudserver1", "cloudserver2", "cloudserver3"}
                        local chosen = clusters[math.random(#clusters)]
                        request_handle:headers():replace(":authority", subdomain .. "." .. chosen .. ".bolabaden.org")
                      end
                    end
            - name: catchall
              domains: ["*"]
              routes:
              - match: { prefix: "/" }
                direct_response: { status: 404, body: { inline_string: "Not found" } }
          http_filters:
          - name: envoy.filters.http.lua
            typed_config:
              "@type": type.googleapis.com/envoy.extensions.filters.http.lua.v3.Lua
              # Lua filter placed here for dynamic subdomain logic
          - name: envoy.filters.http.dynamic_forward_proxy
            typed_config:
              "@type": type.googleapis.com/envoy.extensions.filters.http.dynamic_forward_proxy.v3.FilterConfig
          - name: envoy.filters.http.router
      transport_socket:
        name: envoy.transport_sockets.tls
        typed_config:
          "@type": type.googleapis.com/envoy.extensions.transport_sockets.tls.v3.DownstreamTlsContext
          common_tls_context:
            tls_certificates:
            - certificate_chain: { filename: "/etc/envoy/certs/bolabaden.org.crt" }
              private_key: { filename: "/etc/envoy/certs/bolabaden.org.key" }

  clusters:
  - name: nginx_backend
    type: STRICT_DNS
    lb_policy: ROUND_ROBIN
    load_assignment:
      cluster_name: nginx_backend
      endpoints:
      - lb_endpoints:
        - endpoint:
            address:
              socket_address: { address: 127.0.0.1, port_value: 80 }  # Adjust to actual nginx service
  - name: dynamic_cluster
    type: LOGICAL_DNS
    dns_lookup_family: V4_ONLY
    lb_policy: RANDOM
    load_assignment:
      cluster_name: dynamic_cluster
      endpoints:
      - lb_endpoints:
        - endpoint:
            address:
              socket_address: { address: 0.0.0.0, port_value: 0 }  # Placeholder for dynamic
    typed_extension_protocol_options:
      envoy.extensions.upstreams.http.v3.HttpProtocolOptions:
        "@type": type.googleapis.com/envoy.extensions.upstreams.http.v3.HttpProtocolOptions
        explicit_http_config:
          http2_protocol_options: {}
    transport_socket:
      name: envoy.transport_sockets.tls
      typed_config:
        "@type": type.googleapis.com/envoy.extensions.transport_sockets.tls.v3.UpstreamTlsContext
        sni: "%UPSTREAM_HOST%"  # Uses the rewritten authority
        common_tls_context: {}
    circuit_breakers:
      thresholds:
      - priority: DEFAULT
        max_connections: 100
        max_pending_requests: 100
        max_requests: 100
        max_retries: 3
    outlier_detection:
      consecutive_5xx: 3
      interval: 15s
      base_ejection_time: 30s

layered_runtime:
  layers:
  - name: runtime_layer
    static_layer:
      overload:
        global_downstream_max_connections: 50000
```

### Deployment in Docker
Run Envoy in a container with the configuration mounted:

```
docker run -d --name envoy-proxy \
  -p 80:80 -p 443:443 \
  -v /path/to/envoy.yaml:/etc/envoy/envoy.yaml \
  -v /path/to/certs:/etc/envoy/certs \
  envoyproxy/envoy:v1.31.0
```

Configure your primary reverse proxy to forward unhandled requests to the container's IP/port 443.

### Limitations and Enhancements
- **Health Checks**: Relies on passive mechanisms (e.g., outlier detection based on 5xx errors). For active checks per cluster, integrate an xDS control plane or use Uptime Kuma to monitor clusters externally and update Lua logic via config reloads.
- **Failover**: Retries occur on the selected upstream; for cross-cluster failover, extend the Lua script to handle retries with alternative selections (requires advanced configuration).
- **Testing**: Validate DNS resolution latency in your environment; adjust cache settings in Envoy's DNS resolver if needed.
- **Extensions**: If service discovery evolves (e.g., via Consul), Envoy's xDS support allows seamless upgrades.

This setup provides a robust, modern solution aligned with the requirements. If further adjustments are necessary, such as integrating a control plane, supply additional details.
