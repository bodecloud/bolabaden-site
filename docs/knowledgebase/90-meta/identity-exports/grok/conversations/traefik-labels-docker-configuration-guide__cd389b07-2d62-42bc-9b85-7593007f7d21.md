---
source_url: "https://grok.com/c/cd389b07-2d62-42bc-9b85-7593007f7d21"
conversation_id: "cd389b07-2d62-42bc-9b85-7593007f7d21"
title: "Traefik Labels Docker Configuration Guide"
extracted_at: "2026-06-29T16:23:14.178Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Traefik Labels Docker Configuration Guide

Source: [Grok conversation](https://grok.com/c/cd389b07-2d62-42bc-9b85-7593007f7d21)

## User

_Time: 2025-08-30T13:16:11.996Z_

write a config.yaml as shown from the documentation:

````
![Banner](https://github.com/11notes/defaults/blob/main/static/img/banner.png?raw=true)

# 🏔️ Alpine - Traefik Labels
![size](https://img.shields.io/docker/image-size/11notes/traefik-labels/latest?color=0eb305) ![version](https://img.shields.io/docker/v/11notes/traefik-labels/latest?color=eb7a09) ![pulls](https://img.shields.io/docker/pulls/11notes/traefik-labels?color=2b75d6)

**Export Traefik labels from any Docker node to a central location**

# SYNOPSIS
What can I do with this? This image will connect to all your Docker nodes and read their labels. It will then use the labels to update your Traefik configuration in Redis automatically and dynamically on each container start, stop or timeout. It also supports updating your internal and external DNS servers too, so you can use labels for everything. If a container is removed the image will automatically reverse any `nsupdate update add` to `nsupdate update delete` so entries are removed too.

In order to use this image, you need to setup Traefik with a Redis provider and then point this image via redis.url to the same Redis instance. Each entry will have an expire timer set in Redis, so that if a container is removed by a server crashing, Redis will automatically remove stale entries as well. Entries are refreshed every 300 seconds or on all docker container events (create, run, kill, stop, restart, ...). As for nsupdate, you need to setup tsig authentication in your NS servers and add the keys to the zones you want to be able to update, you can restrict the keys by using update-policy if you use Bind from ISC.

This image provides the ability to call a webhook for each container for each event or poll after the data was updates in Redis and or nsupdate.

Each node gets its own worker thread for better scalability. If you have 10 nodes, you will have 10 worker processes inside the container forked from the main process. Forks die when their node disconnects and use the `ping.interval` to fork new processes indefinitely. As soon as the node is back online, it will always execute a poll on all containers of that node.

# VOLUMES
* **/labels/etc** - Directory of config.yaml
* **/labels/ssl** - Directory of ssl certificates for TLS<sup>1</sup>

# COMPOSE
```yaml
name: "traefik-labels"
services:
  redis:
    image: "11notes/redis:7.2.5"
    container_name: "redis"
    environment:
      REDIS_PASSWORD: "**************"
      TZ: Europe/Zurich
    volumes:
      - "redis.etc:/redis/etc"
      - "redis.var:/redis/var"
    networks:
      - redis
    restart: always
  labels:
    image: "11notes/traefik-labels:latest"
    container_name: "labels"
    environment:
      TZ: Europe/Zurich
    volumes:
      - "labels.etc:/labels/etc"
    networks:
      - redis
      - nodes
    restart: always
volumes:
  redis.etc:
  redis.var:
  labels:etc:
networks:
  redis:
    internal: true
  nodes:
```

# EXAMPLES
## config /labels/etc/config.yaml
```yaml
labels:
  redis:
    url: rediss://foo:bar@10.127.198.254:6379/0
  webhook:
    url: https://my.cool.webhook/v1
    # optional
    auth:
      # supports basic authentication
      basic: labels:*****
  nodes:
    # use FQDN and add the FQDN to your certificates SAN list (or IP)
    - 192.168.18.12
    - 10.14.120.1
  # reload labels.nodes every {n} seconds (0 = disabled)
  interval: 0
  # timeout in seconds for the connection to a Docker node
  timeout: 2.5
  rfc2136:
    # only nsupdate on entries which are different (do not update same data)
    verify: false
    # remove DNS entry if container is unreachable
    remove: false
  poll:
    # polling all containers on a node every {n} seconds
    interval: 300
  ping:
    # ping all nodes every {n} seconds to see if they are still online
    interval: 10
  tls:
    # path for TLS certificates
    ca: /labels/ssl/ca.crt
    crt: /labels/ssl/server.crt
    key: /labels/ssl/server.key
```

## container on a node with Traefik routes
```shell
docker run --name traefik-demo \
  -p 8080:8080 \
  -l "traefik/http/routers/demo.domain.com/service=demo.domain.com" \
  -l "traefik/http/routers/demo.domain.com/rule=Host(`demo.domain.com`)" \
  -l "traefik/http/routers/demo.domain.com/tls=true" \
  -l "traefik/http/routers/demo.domain.com/entrypoints=https" \
  -l "traefik/http/services/demo.domain.com/loadbalancer/servers/0/url=http://fqdn-of-docker-node:8080" \
  -d 11notes/nginx:stable
```

## container on a node with Traefik routes and rfc2136 DNS
```shell
docker run --name traefik-rfc2136-demo \
  -p 8080:8080 \
  -l "traefik/http/routers/demo.domain.com/service=demo.domain.com" \
  -l "traefik/http/routers/demo.domain.com/rule=Host(`demo.domain.com`)" \
  -l "traefik/http/routers/demo.domain.com/tls=true" \
  -l "traefik/http/routers/demo.domain.com/entrypoints=https" \
  -l "traefik/http/services/demo.domain.com/loadbalancer/servers/0/url=http://fqdn-of-docker-node:8080" \
  -l "rfc2136/WAN/server=ns.domain.com" \
  -l "rfc2136/WAN/key=algo:name:secret" \
  -l "rfc2136/WAN/nsupdate=update add foo.domain.com 300 A 175.12.41.11" \
  -l "rfc2136/WAN/nsupdate=update add foo.domain.com 300 TXT \"hello from traefik-labels!\"" \
  -l "rfc2136/LAN/server=ns.domain.local" \
  -l "rfc2136/LAN/key=algo:name:secret" \
  -l "rfc2136/LAN/nsupdate=update add foo.domain.local 300 A 192.168.12.54" \
  -d 11notes/nginx:stable
```

# DEFAULT SETTINGS
| Parameter | Value | Description |
| --- | --- | --- |
| `user` | docker | user docker |
| `uid` | 1000 | user id 1000 |
| `gid` | 1000 | group id 1000 |
| `home` | /labels | home directory of user docker |
| `config` | /labels/etc/config.yaml | config (nodes can be updated dynamically) |
| `ca.crt` | /labels/ssl/ca.crt | Certificate of CA for TLS<sup>1</sup> |
| `labels.crt` | /labels/ssl/labels.crt | Certificate of client for TLS<sup>1</sup> |
| `labels.key` | /labels/ssl/labels.key | Private key of client for TLS<sup>1</sup> |

# ENVIRONMENT
| Parameter | Value | Default |
| --- | --- | --- |
| `TZ` | [Time Zone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) | |
| `DEBUG` | Show debug information | |

# SOURCE
* [11notes/traefik-labels:latest](https://github.com/11notes/docker-traefik-labels/tree/latest)

# PARENT IMAGE
* [11notes/node:stable](https://hub.docker.com/r/11notes/node)

# BUILT WITH
* [npm::redis](https://www.npmjs.com/package/redis)
* [npm::dockerode](https://www.npmjs.com/package/dockerode)
* [nodejs](https://nodejs.org/en)
* [alpine](https://alpinelinux.org)

# TIPS
* Use a reverse proxy like Traefik, Nginx to terminate TLS with a valid certificate
* Use Let’s Encrypt certificates to protect your SSL endpoints

# DISCLAIMERS
* <sup>1</sup> For TLS to work you need proper certificates in place for your dockerd and your clients. The CN in the certificate needs to match the FQDN or IP you have set on the docker node, you can set multiple by using SAN. See an example of a daemon.json configuration to enable TLS.
```json
{
  "tls": true,
  "tlsverify": true,
  "tlscacert": "/etc/docker/ca.crt",
  "tlscert": "/etc/docker/server.crt",
  "tlskey": "/etc/docker/server.key",
  "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2376"]
}
```

# ElevenNotes<sup>™️</sup>
This image is provided to you at your own risk. Always make backups before updating an image to a new version. Check the changelog for breaking changes. You can find all my repositories on [github](https://github.com/11notes).
    
````

the labels's config.yaml does not make any sense as to where it comes from or what i'm supposed to define there. What is this syntax and how do I define it? why do i need to define it?
 
it was my impression that docker-traefik-labels intends to parse docker-compose.yaml's docker labels for traefik's docker provider, and from there it exports a redis provider configuration(s).
 
so why's it need to load /labels/etc/config.yaml and what the heck do I actually define here if so? is this project doing anything of what i want it to be doing? provide a full example unrelated to the scenario the readme.md shows.

## Assistant

_Time: 2025-08-30T13:17:26.564Z_

The configuration file `config.yaml` serves as the primary mechanism for customizing the behavior of the `11notes/traefik-labels` Docker image. This image is designed to monitor multiple Docker nodes, extract Traefik-related labels from containers running on those nodes, and dynamically update a central Redis instance with the corresponding Traefik provider configurations. It can also handle optional features such as DNS updates via RFC 2136 (e.g., using `nsupdate` for BIND servers) and webhook notifications. This enables centralized Traefik management in distributed environments, where containers may be spread across nodes, and ensures that configurations are refreshed automatically on events like container starts, stops, or timeouts.

Regarding your impression: The tool does indeed parse labels from containers (similar to those defined in `docker-compose.yaml` or via `docker run` commands with `-l` flags), but it does so by connecting directly to the Docker API on specified nodes rather than reading Compose files. It then exports these labels as key-value entries in Redis, which Traefik can consume as a provider. This is particularly useful in multi-host setups where a single Traefik instance needs visibility into labels across a cluster, without relying solely on Docker's built-in provider (which is node-local). If your setup involves a single node, this tool may be overkill, as Traefik's native Docker provider could suffice; however, it adds value for scalability, automatic cleanup of stale entries via Redis expiration, and integration with DNS or webhooks.

The `config.yaml` file is required because the image does not auto-discover nodes or connections—it relies on explicit definitions for security and flexibility. You must create this file manually and mount it into the container at `/labels/etc/config.yaml` (as shown in the Compose example). The syntax is standard YAML, with a top-level `labels` key containing nested sections for various components. Each section defines parameters such as connection details, intervals, and paths. Defaults are used where values are omitted, but critical elements like the Redis URL and node list must be specified for the tool to function.

You need to define it to:
- Specify the Redis instance where Traefik configurations will be stored (Traefik must be configured separately to use this Redis as a provider).
- List the Docker nodes to monitor (using IP addresses or FQDNs, with TLS support for secure API access).
- Configure polling, pinging, and timeout behaviors to ensure reliability.
- Optionally enable DNS updates or webhooks for additional automation.
Without this file, the container cannot connect to nodes or Redis, rendering it non-functional.

This project aligns with your intended use case if you seek to centralize Traefik label processing across nodes into Redis. If your goal is purely single-node label parsing without Redis, consider using Traefik's built-in Docker provider directly.

Below is a full example of a `config.yaml` file for a hypothetical scenario: A small-scale setup with three Docker nodes in a private cloud environment (e.g., for a development cluster). In this example, we monitor nodes at internal IPs, connect to a Redis instance with TLS enabled, disable DNS updates (as they are not needed), set a webhook for logging events to an internal monitoring service, and use custom intervals for polling and pinging. This is unrelated to the README's focus on WAN/LAN DNS integration or multi-zone updates. Place this file in your host's volume directory (e.g., `./labels/etc/config.yaml`) and mount it as shown in the Compose snippet from the documentation.

```yaml
labels:
  redis:
    url: rediss://admin:securepassword@redis-cluster.internal:6379/1  # Secure Redis URL with TLS; adjust to your instance
  webhook:
    url: https://monitoring.internal/webhooks/traefik-events  # Endpoint for event notifications (e.g., container changes)
    auth:
      basic: monitor:secretkey  # Basic auth for the webhook
  nodes:
    - 10.0.1.10  # Node 1: Development server
    - 10.0.1.20  # Node 2: Staging server
    - 10.0.1.30  # Node 3: Testing server
  interval: 60  # Reload the nodes list every 60 seconds (useful if nodes change dynamically)
  timeout: 5.0  # Connection timeout to Docker APIs in seconds
  rfc2136:
    verify: true  # Only update DNS if entries differ (enabled here for efficiency, though DNS is not used)
    remove: true  # Automatically remove DNS entries for unreachable containers
  poll:
    interval: 600  # Poll all containers on nodes every 10 minutes
  ping:
    interval: 30  # Ping nodes every 30 seconds to check availability
  tls:
    ca: /labels/ssl/ca.crt  # Path to CA certificate for Docker API TLS
    crt: /labels/ssl/client.crt  # Path to client certificate
    key: /labels/ssl/client.key  # Path to client private key
```

To use this:
1. Ensure your Docker daemons on the nodes are configured for remote API access with TLS (as per the disclaimer in the documentation, e.g., via `daemon.json`).
2. Mount the necessary TLS certificates into `/labels/ssl` in the container.
3. In your containers on the nodes, apply Traefik labels as usual (e.g., via `docker run -l "traefik/http/routers/myapp/rule=Host(\`myapp.example.com\`)" ...`).
4. Configure Traefik to use the same Redis instance as a provider (e.g., in Traefik's `traefik.yml`: `providers: redis: endpoints: ["redis-cluster.internal:6379"]`).

If this does not fully match your needs or if the repository has been updated since the provided documentation, consult the source at https://github.com/11notes/docker-traefik-labels for the latest details.

## User

_Time: 2025-08-30T13:18:33.543Z_

Yeah i'm still stupidly confused on how to define config.yaml for docker-traefik-labels. Write a complete accurate and exhaustive one for my configuration shown here:
 

```
# yaml-language-server: $schema=https://raw.githubusercontent.com/compose-spec/compose-spec/master/schema/compose-spec.json

volumes:
  caddy_data:
  caddy_config:


secrets:
  premiumize-auth:
    file: ${CONFIG_DIR:-./configs}/premiumize-auth.txt


configs:
  victoriametrics.yaml:
    content: |
      type: http
      name: http_victoriametrics
      log_level: debug
      format: >
        {{- range $$Alert := . -}}
        {{- $$traefikRouters := GetMeta . "traefik_router_name" -}}
        {{- range .Decisions -}}
        {"metric":{"__name__":"cs_lapi_decision","instance":"my-instance","country":"{{$$Alert.Source.Cn}}","asname":"{{$$Alert.Source.AsName}}","asnumber":"{{$$Alert.Source.AsNumber}}","latitude":"{{$$Alert.Source.Latitude}}","longitude":"{{$$Alert.Source.Longitude}}","iprange":"{{$$Alert.Source.Range}}","scenario":"{{.Scenario}}","type":"{{.Type}}","duration":"{{.Duration}}","scope":"{{.Scope}}","ip":"{{.Value}}","traefik_routers":{{ printf "%q" ($$traefikRouters | uniq | join ",")}}},"values": [1],"timestamps":[{{now|unixEpoch}}000]}
        {{- end }}
        {{- end -}}
      url: http://victoriametrics:8428/api/v1/import
      method: POST
      headers:
        Content-Type: application/json
        # if you use vmauth as proxy, please uncomment next line and add your token
        #Authorization: "$${VICTORIAMETRICS_AUTH_TOKEN:-}"
  Caddyfile:
    content: |
      # Caddyfile for failover-proxy
      # This file is used to route requests to the appropriate backend service
      # It uses Traefik's dynamic configuration to manage the routing
      # It also includes health checks and TLS options for the backends
      # It also includes a fallback handler for non-matching requests
      # It also includes logging for debugging
      :${CADDY_INTERNAL_HTTP_PORT:-80} {
        # Matcher for wildcard domains (assumes all incoming Hosts are *.${DOMAIN} from Traefik)
        @wildcard host *.${DOMAIN}
        handle @wildcard {
          reverse_proxy {
            # Load balance to the seven backends, preserving subdomain ({label1} = foo in foo.bolabaden.org)
            to {label1}.micklethefickle.${DOMAIN}:443
            to {label1}.beatapostapita.${DOMAIN}:443
            to {label1}.vractormania.${DOMAIN}:443
            to {label1}.arnialtrashlid.${DOMAIN}:443
            to {label1}.cloudserver1.${DOMAIN}:443
            to {label1}.cloudserver2.${DOMAIN}:443
            to {label1}.cloudserver3.${DOMAIN}:443

            # Load balancing policy: round-robin for even distribution
            lb_policy round_robin

            # TLS options for HTTPS upstreams
            transport http {
              tls
              tls_insecure_skip_verify # Skip verification if backends have self-signed certs; remove for production with valid certs
            }

            # Preserve original Host header for backends (use .host to exclude port)
            header_up Host {http.reverse_proxy.upstream.host}
            header_up X-Real-IP {remote_host}  # potentially  {http.request.remote.host}?
          }
        }

        # Fallback handler for non-matching requests (though unlikely in this setup)
        handle {
          respond "Invalid domain" 400
        }

        # Logging for debugging
        log {
          output stdout
          format console
        }
      }
  traefik-failover-dynamic.conf.tmpl:
    content: |
      # yaml-language-server: $$schema=https://www.schemastore.org/traefik-v3-file-provider.json
      http:
        routers:
      {{- range $$c := . }}
        {{- if eq (index $$c.Labels "traefik.enable") "true" }}
          {{- $$name := trimPrefix "/" $$c.Name }}
          {{ $$name }}-with-failover:
            service: {{ $$name }}-with-failover@file
            rule: Host(`{{ $$name }}.${DOMAIN}`)
          {{ $$name }}-direct:
            service: {{ $$name }}-direct@file
            rule: Host(`{{ $$name }}.${TS_HOSTNAME}.${DOMAIN}`)
        {{- end }}
      {{- end }}

        services:
      {{- range $$c := . }}
          {{- $$name := trimPrefix "/" $$c.Name }}
          {{ $$name }}-with-failover:
            failover:
              service: {{ $$name }}-direct@file
              fallback: {{ $$name }}-servers@file
          {{ $$name }}-direct:
            loadBalancer:
              servers:
                - url: http://{{ $$name }}:{{ (index $$c.Addresses 0).Port }}
              healthCheck:
                path: "/"
                interval: "15s"
                timeout: "5s"
          {{ $$name }}-servers:
            loadBalancer:
              servers:
                - url: https://{{ $$name }}.micklethefickle.${DOMAIN}
                - url: https://{{ $$name }}.beatapostapita.${DOMAIN}
              healthCheck:
                path: "/"
                interval: "15s"
                timeout: "5s"
      {{- end }}
  traefik-docker-labels-conf.tmpl:
    file: ${ROOT_DIR:-.}/reference/traefik/traefik-comprehensive-docker-labels.tmpl
  traefik-dynamic.yaml:
    content: |
      # yaml-language-server: $$schema=https://www.schemastore.org/traefik-v3-file-provider.json
      http:
        routers:
          catchall:
            entrypoints:
              - web
              - websecure
            service: noop@internal
            rule: Host(`${DOMAIN}`) || Host(`${TS_HOSTNAME}.${DOMAIN}`) || HostRegexp(`^(.+)$$`)
            priority: -1000
            middlewares:
              - http-to-https-redirect-simple@file
        services:
          nginx-traefik-extensions:
            loadBalancer:
              servers:
                - url: http://nginx-traefik-extensions:80
          bolabaden-nextjs:
            loadBalancer:
              servers:
                - url: http://bolabaden-nextjs:3000
        middlewares:
          bolabaden-error-pages:
            errors:
              status: 400-599
              service: bolabaden-nextjs@file
              query: /api/error/{status}
          nginx-auth:
            forwardAuth:
              address: http://nginx-traefik-extensions:80/auth
              trustForwardHeader: true
              authResponseHeaders: ["X-Auth-Method", "X-Auth-Passed", "X-Middleware-Name"]
          strip-www:
            redirectRegex:
              regex: '^(http|https)?://www\.(.+)$$'
              replacement: '$${1}://$${2}'
              permanent: false
          http-to-https-redirect-simple:
            redirectScheme:
              scheme: https
              permanent: false
          crowdsec:
            plugin:
              bouncer:
                enabled: ${CROWDSEC_BOUNCER_ENABLED:-true}
                defaultDecisionSeconds: ${CROWDSEC_BOUNCER_DEFAULT_DECISION_SECONDS:-60}
                crowdsecMode: ${CROWDSEC_BOUNCER_MODE:-live}
                crowdsecAppsecEnabled: ${CROWDSEC_APPSEC_ENABLED:-true}  # <--- here you can enable appsec waf
                crowdsecAppsecHost: crowdsec:${CROWDSEC_APPSEC_PORT:-7422}
                crowdsecAppsecFailureBlock: ${CROWDSEC_APPSEC_FAILURE_BLOCK:-true}
                crowdsecAppsecUnreachableBlock: ${CROWDSEC_APPSEC_UNREACHABLE_BLOCK:-true}
                crowdsecLapiKey: ${CROWDSEC_LAPI_KEY:?}
                crowdsecLapiHost: crowdsec:${CROWDSEC_LAPI_PORT:-8080}
                crowdsecLapiScheme: ${CROWDSEC_LAPI_SCHEME:-http}
                crowdsecLapiTLSInsecureVerify: ${CROWDSEC_LAPI_TLS_INSECURE_VERIFY:-false}
                forwardedHeadersTrustedIPs: &trustedIps
                  - "10.0.0.0/8"          # Private range
                  - "100.64.0.0/10"       # CGNAT
                  - "127.0.0.0/8"         # Loopback
                  - "169.254.0.0/16"      # Link-local
                  - "172.16.0.0/12"       # Private range
                  - "192.168.0.0/16"      # Private range
                  - "::1/128"             # Loopback (IPv6)
                  - "fc00::/7"            # Unique local addresses (ULA, private IPv6)
                  - "fe80::/10"           # Link-local (IPv6)
                  - "2002::/16"           # 6to4 address block (not strictly private, but not globally routable in most cases)
                clientTrustedIPs: *trustedIps
  crowdsec-appsec.yaml:
    content: |
      appsec_config: crowdsecurity/appsec-default
      labels:
        type: appsec
      listen_addr: 0.0.0.0:${CROWDSEC_APPSEC_PORT:-7422}
      source: appsec
  acquis.yaml:
    content: |
      filenames:
        - /var/log/auth.log
        - /var/log/syslog
      labels:
        type: syslog
      ---
      poll_without_inotify: false
      filenames:
        - /var/log/traefik/*.log
      #  - /var/log/traefik/access.log
      labels:
        type: traefik
      ---
      listen_addr: 0.0.0.0:${CROWDSEC_APPSEC_PORT:-7422}
      appsec_config: crowdsecurity/virtual-patching
      name: reverse-proxy-crowdsec-appsec
      source: appsec
      labels:
        type: appsec
  traefik_logrotate_tail.sh:
    content: |
      #!/bin/sh

      TRAEFIK_LOG_DIR=$${1:-/var/log/traefik}
      apk add --no-cache logrotate findutils coreutils jq &&
      mkdir -p /etc/logrotate.d &&
      cat > /etc/logrotate.d/traefik << "EOF"
      $${TRAEFIK_LOG_DIR}/*.log {
          hourly
          size 1M
          rotate 20
          compress
          delaycompress
          missingok
          notifempty
          create 644 root root
          copytruncate
          postrotate
              # Clean up old files if directory exceeds 50MB
              TOTAL_SIZE=$$(du -sm $${TRAEFIK_LOG_DIR} | cut -f1)
              if [ $$TOTAL_SIZE -gt 50 ]; then
                  find $${TRAEFIK_LOG_DIR} -name "*.gz" -type f -printf "%T@ %p\n" | sort -n | head -n -10 | cut -d" " -f2- | xargs rm -f
              fi
          endscript
      }
      EOF
      
      # Start logrotate in background (delay first run to avoid immediate truncation before tail starts)
      (
        while true; do
          sleep 3600
          logrotate -f /etc/logrotate.d/traefik
        done
      ) &
      
      # Wait for traefik.log to exist, then tail it
      echo "Waiting for traefik.log to be created..."
      while [ ! -f $${TRAEFIK_LOG_DIR}/traefik.log ]; do
        sleep 5
      done
      
      echo "Starting to tail traefik.log in human-readable format..."
      while true; do
        # Use tail -F to follow across rotations, stdbuf for line buffering, jq for JSON parsing
        stdbuf -oL -eL tail -n 200 -F $${TRAEFIK_LOG_DIR}/traefik.log | \
        while read -r line; do
          if [ -z "$$line" ]; then continue; fi
          case "$$line" in
            '{'*)
              # Parse log line and output fields separated by tabs
              parsed_line=$(
                echo "$$line" | jq -r '
                  def ms: ( . // 0 | tonumber) / 1000000 | floor;
                  [
                    (.time // "?"),
                    ((.DownstreamStatus // 0) | tostring),
                    (.ClientAddr // "?"),
                    (.RequestHost // "?"),
                    ((.RequestMethod // "?") + " " + (.RequestPath // "?")),
                    ((.Duration | ms | tostring) + " ms"),
                    (.ServiceName // "?")
                  ] | @tsv
                '
              )
              
              # Extract client IP address (3rd field) and resolve to domain name if possible
              client_addr=$$(echo "$$parsed_line" | awk -F"\t" '{print $$3}')
              # Extract just the IP part (remove port if present)
              client_ip=$$(echo "$$client_addr" | sed 's/:[0-9]*$$//')
              # Attempt reverse DNS lookup, fallback to original if it fails
              resolved_addr=$$(nslookup "$$client_ip" 2>/dev/null | awk '/name =/ {print $$4; exit}' | sed 's/\.$$//') 
              if [ -z "$$resolved_addr" ] || [ "$$resolved_addr" = "$$client_ip" ]; then
                resolved_addr="$$client_addr"
              else
                # Keep port if it was present in original
                port_part=$$(echo "$$client_addr" | grep -o ':[0-9]*$$')
                resolved_addr="$${resolved_addr}$${port_part}"
              fi
              
              # Replace the client address in parsed_line with resolved address
              parsed_line=$$(echo "$$parsed_line" | awk -F"\t" -v new_addr="$$resolved_addr" 'BEGIN{OFS="\t"} {$$3=new_addr; print}')
              
              # Extract status code (2nd field)
              status_code=$$(echo "$$parsed_line" | awk -F"\t" '{print $$2}')
              # Assign unique colors for common/relevant codes, and dynamically for others
              # Color palette: 31=red, 32=green, 33=yellow, 34=blue, 35=magenta, 36=cyan, 91=bright red, 92=bright green, 93=bright yellow, 94=bright blue, 95=bright magenta, 96=bright cyan
              # Map of common codes to unique colors
              case "$$status_code" in
                200) color="\033[1;32m" ;;   # Bright Green
                201) color="\033[0;32m" ;;   # Green
                204) color="\033[0;36m" ;;   # Cyan
                301) color="\033[1;34m" ;;   # Bright Blue
                302) color="\033[0;34m" ;;   # Blue
                304) color="\033[1;36m" ;;   # Bright Cyan
                400) color="\033[1;33m" ;;   # Bright Yellow
                401) color="\033[0;33m" ;;   # Yellow
                403) color="\033[1;35m" ;;   # Bright Magenta
                404) color="\033[0;35m" ;;   # Magenta
                408) color="\033[1;31m" ;;   # Bright Red
                429) color="\033[0;31m" ;;   # Red
                500) color="\033[1;91m" ;;   # Bright Red (alt)
                502) color="\033[1;95m" ;;   # Bright Magenta (alt)
                503) color="\033[1;94m" ;;   # Bright Blue (alt)
                504) color="\033[1;93m" ;;   # Bright Yellow (alt)
                *)
                  # Dynamically assign a color for any other code, based on its numeric value
                  # Use a palette of ANSI color codes, cycling through them
                  palette="31 32 33 34 35 36 91 92 93 94 95 96"
                  code_num=$$(echo "$$status_code" | grep -Eo '[0-9]+' || echo 0)
                  set -- $$palette
                  palette_len=12
                  idx=$$(($$code_num % $$palette_len))
                  # Get the color code at the calculated index
                  color_code=$$(echo $$palette | awk -v n=$$((idx+1)) '{split($$0,a," "); print a[n]}')
                  color="\033[1;$${color_code}m"
                  ;;
              esac
              # Print the line with only the timestamp and status code colored
              echo "$$parsed_line" | awk -F"\t" -v color="$$color" -v reset="\033[0m" '
                {
                  # Color timestamp ($1) and status code ($2), rest uncolored
                  printf "%s%-19s%s | %s%-3s%s | %-18s | %-25s | %-21s | %-8s | %s\n", \
                    color, $1, reset, color, $2, reset, $3, $4, $5, $6, $7;
                }
              '
              ;;
            *)
              ;;
          esac
        done
      # Restart tail if it exits (e.g., due to rotation issues)
        sleep 1
      done
  nginx-traefik-extensions.conf:
    content: |
      user nginx;
      worker_processes auto;
      error_log /var/log/nginx/error.log warn;
      pid /var/run/nginx.pid;

      events {
          worker_connections 1024;
          use epoll;
          multi_accept on;
      }

      http {
        include /etc/nginx/mime.types;
        default_type application/octet-stream;

        access_log /dev/stdout combined;
        error_log /dev/stderr warn;
        log_format main '$$remote_addr - $$remote_user [$$time_local] "$$request" '
                        '$$status $$body_bytes_sent "$$http_referer" '
                        '"$$http_user_agent" "$$http_x_forwarded_for" '
                        'auth_method="$$auth_method" original_uri="$$http_x_original_uri" '
                        'middleware="$$middleware_name"';
        limit_req_zone $$binary_remote_addr zone=auth:10m rate=20r/s;  # Rate limit zone used by `location /auth`

        limit_req_status 429;  # Optional: return 429 instead of default 503 so your 429 error_page is used
        access_log /var/log/nginx/access.log main;
        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;
        keepalive_timeout 65;
        types_hash_max_size 2048;
        server_tokens off;
        map_hash_bucket_size 128;

        # Local IPs
        set_real_ip_from 10.0.0.0/8;
        set_real_ip_from 100.64.0.0/10;
        set_real_ip_from 127.0.0.0/8;
        set_real_ip_from 169.254.0.0/16;
        set_real_ip_from 172.16.0.0/12;
        set_real_ip_from 192.0.0.0/24;
        set_real_ip_from 192.0.2.0/24;
        set_real_ip_from 192.168.0.0/16;
        set_real_ip_from 198.18.0.0/15;
        set_real_ip_from 198.51.100.0/24;
        set_real_ip_from 203.0.113.0/24;
        set_real_ip_from 224.0.0.0/4;
        set_real_ip_from 240.0.0.0/4;
        set_real_ip_from 2002::/16;
        set_real_ip_from fc00::/7;
        set_real_ip_from fd00::/8;
        set_real_ip_from fe80::/10;
        set_real_ip_from ::1/128;

        real_ip_header X-Forwarded-For;
        real_ip_recursive on;

        geo $$ip_whitelisted {
          default 0;
          # Local IPs
          10.0.0.0/8           1;
          100.64.0.0/10        1;
          127.0.0.0/8          1;
          169.254.0.0/16       1;
          172.16.0.0/12        1;
          192.0.0.0/24         1;
          192.0.2.0/24         1;
          192.168.0.0/16       1;
          198.18.0.0/15        1;
          198.51.100.0/24      1;
          203.0.113.0/24       1;
          224.0.0.0/4          1;
          240.0.0.0/4          1;
          2002::/16            1;
          fc00::/7             1;
          fd00::/8             1;
          fe80::/10            1;
          ::1/128              1;
        }
        upstream tinyauth {
            server tinyauth:3000;
        }
        map $$http_x_api_key $$api_key_valid {
          default 0;
          "${NGINX_AUTH_API_KEY:?}" 1;
        }

        server {
          listen 80 default_server;
          server_name _;

          set $$auth_passed 0;
          set $$auth_method "none";
          set $$middleware_name "unknown";

          if ($$api_key_valid = 1) {
              set $$auth_passed 1;
              set $$auth_method "api_key";
          }

          if ($$ip_whitelisted = 1) {
              set $$auth_passed 1;
              set $$auth_method "ip_whitelist";
          }

          location /auth {
              set $$middleware_name "auth";
              limit_req zone=auth burst=20 nodelay;

              if ($$auth_passed = 1) {
                  add_header X-Auth-Method "$$auth_method" always;
                  add_header X-Auth-Passed "true" always;
                  add_header X-Middleware-Name "$$middleware_name" always;
                  return 200 "OK";
              }

              proxy_pass http://tinyauth/api/auth/traefik;
              proxy_pass_request_body off;
              proxy_set_header Content-Length "";
              proxy_set_header X-Original-URI $$http_x_original_uri;
              proxy_set_header X-Original-Method $$http_x_original_method;
              proxy_set_header X-Real-IP $$remote_addr;
              proxy_set_header X-Forwarded-For $$proxy_add_x_forwarded_for;
              proxy_set_header X-Forwarded-Proto $$scheme;
              proxy_set_header X-Forwarded-Host $$http_x_forwarded_host;

              add_header X-Auth-Method "tinyauth" always;
              add_header X-Middleware-Name "$$middleware_name" always;

              access_log /var/log/nginx/auth.log main;
          }

          location /health {
              access_log off;
              return 200 "nginx auth service healthy\n";
              add_header Content-Type text/plain;
          }

          error_page 401 /401.html;
          error_page 403 /403.html;
          error_page 429 /429.html;
          
          location = /401.html {
              internal;
              return 401 '{"error": "Authentication required", "methods": ["api_key", "ip_whitelist", "tinyauth"]}';
              add_header Content-Type application/json;
          }
          
          location = /403.html {
              internal;
              return 403 '{"error": "Access Forbidden"}';
              add_header Content-Type application/json;
          }
        }
      }


services:
  cloudflare-ddns:
    image: docker.io/favonia/cloudflare-ddns:1  # - "1" for the latest stable version whose major version is 1
    #image: docker.io/favonia/cloudflare-ddns:latest  # - "latest" for the latest stable version (which could become 2.x.y in the future and break things)
    container_name: cloudflare-ddns
    network_mode: host  # This bypasses network isolation and makes IPv6 easier (optional; see below)
    read_only: true  # Make the container filesystem read-only (optional but recommended)
    cap_drop: [all]  # Drop all Linux capabilities (optional but recommended)
    security_opt: [no-new-privileges:true]  # Another protection to restrict superuser privileges (optional but recommended)
    environment:
      TZ: ${TZ:-America/Chicago}
      # The value of CLOUDFLARE_API_TOKEN should be an API token (not an API key), which can be obtained from the API Tokens page.
      # Use the Edit zone DNS template to create a token. The less secure API key authentication is deliberately not supported.
      CLOUDFLARE_API_TOKEN: ${CLOUDFLARE_API_TOKEN:?}  # Your Cloudflare API token

      # There is an optional feature (available since version 1.14.0) that lets you maintain a WAF list of detected IP addresses.
      # To use this feature, edit the token and grant it the Account - Account Filter Lists - Edit permission.
      # If you only need to update WAF lists, not DNS records, you can remove the Zone - DNS - Edit permission.
      # Refer to the detailed documentation below for information on updating WAF lists.
      #CLOUDFLARE_WAF_LIST_TOKEN: ${CLOUDFLARE_WAF_LIST_TOKEN}  # Your Cloudflare WAF list token

      # The value of DOMAINS should be a list of fully qualified domain names (FQDNs) separated by commas.
      # For example, DOMAINS=example.org,www.example.org,example.io instructs the updater to manage the domains example.org, www.example.org, and example.io.
      # These domains do not have to share the same DNS zone---the updater will take care of the DNS zones behind the scene.
      DOMAINS: '${TS_HOSTNAME}.${DOMAIN},*.${TS_HOSTNAME}.${DOMAIN}'  # Your domains (separated by commas)

      # PROXIED=true enables Cloudflare proxying (caches webpages, hides your IP).
      # Remove PROXIED=true to expose your real IP or if your traffic isn't HTTP(S).
      # Default: false. Accepts any boolean (true, false, 0, 1).
      # Advanced: PROXIED can be a domain-based boolean expression, e.g.:
      #   PROXIED=is(example.org)           # only example.org proxied
      #   PROXIED=sub(example.org)          # only subdomains of example.org proxied
      #   PROXIED=!is(example.org)          # all except example.org proxied
      #   PROXIED=is(a.org)||is(b.org)      # only a.org and b.org proxied
      # See https://pkg.go.dev/strconv#ParseBool for more advanced usage.
      PROXIED: is(${DOMAIN})||is(*.${DOMAIN})

      # The time-to-live (TTL) (in seconds) of new DNS records.
      # Default is 1, meaning 'automatic' in CloudFlare.
      TTL: 1

      # The comment of new DNS records.
      RECORD_COMMENT: 'Updated by Cloudflare DDNS on server `${TS_HOSTNAME}.${DOMAIN}`'

      # 🧪 The text description of new WAF lists.
      #WAF_LIST_DESCRIPTION: 

      # The Healthchecks ping URL to ping when the updater successfully updates
      # IP addresses, such as `https://hc-ping.com/<uuid>` or `https://hc-ping.com/<project-ping-key>/<name-slug>`.
      # ⚠️ The ping schedule should match the update schedule specified by UPDATE_CRON.
      # 🤖 The updater can work with any server following the [same Healthchecks protocol](https://healthchecks.io/docs/http_api/)
      # This includes self-hosted instances of [Healthchecks](https://github.com/healthchecks/healthchecks).
      # Both UUID and Slug URLs are supported, and the updater works regardless whether the POST-only mode is enabled.
      #HEALTHCHECKS: 

      # The Uptime Kuma’s Push URL to ping when the updater successfully updates IP addresses, such as `https://<host>/push/<id>`.
      # You can directly copy the “Push URL” from the Uptime Kuma configuration page.
      # ⚠️ The “Heartbeat Interval” should match the update schedule specified by `UPDATE_CRON`.
      #UPTIMEKUMA: 'https://uptimekuma.${DOMAIN}/push/1234567890'

      # Newline-separated [shoutrrr URLs](https://containrrr.dev/shoutrrr/latest/services/overview/) to which the updater sends notifications of IP address changes and other events.
      # Each shoutrrr URL represents a notification service; for example, discord://<token>@<id> means sending messages to Discord.
      # See https://github.com/containrrr/shoutrrr for more information.
      #SHOUTRRR: discord://${SHOUTRRR_DISCORD_TOKEN}@${SHOUTRRR_DISCORD_CHANNEL_ID}

      # The updater, by default, will attempt to update DNS records for both IPv4 and IPv6, and there is no
      # harm in leaving the automatic detection on even if your network does not work for one of them.
      # However, if you want to disable IPv6 entirely (perhaps to avoid seeing the detection errors), add IP6_PROVIDER=none.
      #IP6_PROVIDER: 'none'
    restart: always
  nginx-traefik-extensions:
    # 🔹🔹 Nginx Authentication Middleware 🔹🔹
    # Acts as forwardAuth service for traefik middleware
    image: docker.io/nginx:alpine
    container_name: nginx-traefik-extensions
    hostname: nginx-traefik-extensions
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - backend
    configs:
      - source: nginx-traefik-extensions.conf
        target: /etc/nginx/nginx.conf
        mode: 0644
    volumes:
      - /data/coolify/proxy/nginx-middlewares/auth:/etc/nginx/auth:ro
#      - /data/coolify/proxy/nginx-middlewares/cache:/var/cache/nginx
#      - /data/coolify/proxy/nginx-middlewares/logs:/var/log/nginx
    environment:
      TZ: ${TZ:-America/Chicago}
      NGINX_ACCESS_LOG: /dev/stdout
      NGINX_ERROR_LOG: /dev/stderr
      NGINX_LOG_LEVEL: info
    labels:
      traefik.http.middlewares.nginx-auth.forwardAuth.address: "http://nginx-traefik-extensions:80/auth"
      traefik.http.middlewares.nginx-auth.forwardAuth.trustForwardHeader: true
      traefik.http.middlewares.nginx-auth.forwardAuth.authResponseHeaders: '["X-Auth-Method", "X-Auth-Passed", "X-Middleware-Name"]'
    deploy:
      resources:
        reservations:
          cpus: 0.01
          memory: 6M
        limits:
          cpus: 1
          memory: 1G
    healthcheck:
      # test: ["CMD-SHELL", "wget -qO- http://127.0.0.1:80/health > /dev/null 2>&1 && wget -qO- https://127.0.0.1:443/health > /dev/null 2>&1 || exit 1"]
      test: ["CMD-SHELL", "wget -qO- http://127.0.0.1:80/health > /dev/null 2>&1 || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 20s
    restart: always
  tinyauth:
    # 🔹🔹 TinyAuth 🔹🔹
    image: ghcr.io/steveiliop56/tinyauth:v3
    container_name: tinyauth
    hostname: auth
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - backend
    volumes:
      - /data/coolify/proxy/tinyauth:/data
    environment:
      SECRET: ${TINYAUTH_SECRET:?}
      APP_URL: ${TINYAUTH_APP_URL:-https://auth.${DOMAIN}}
      USERS: "${TINYAUTH_USERS:?}"
      # Google OAuth Configuration
      GOOGLE_CLIENT_ID: ${TINYAUTH_GOOGLE_CLIENT_ID:?}
      GOOGLE_CLIENT_SECRET: ${TINYAUTH_GOOGLE_CLIENT_SECRET:?}
      # GitHub OAuth Configuration
      GITHUB_CLIENT_ID: ${TINYAUTH_GITHUB_CLIENT_ID:?}
      GITHUB_CLIENT_SECRET: ${TINYAUTH_GITHUB_CLIENT_SECRET:?}
      # Additional recommended settings
      SESSION_EXPIRY: ${TINYAUTH_SESSION_EXPIRY:-604800} # 2 weeks session expiry
      COOKIE_SECURE: ${TINYAUTH_COOKIE_SECURE:-true} # Send cookie only with HTTPS
      APP_TITLE: ${TINYAUTH_APP_TITLE:-${DOMAIN}} # Customize login page title
      LOGIN_MAX_RETRIES: ${TINYAUTH_LOGIN_MAX_RETRIES:-15} # Maximum login attempts before account lockout
      LOGIN_TIMEOUT: ${TINYAUTH_LOGIN_TIMEOUT:-300} # Lock account for 5 minutes after too many failed attempts
      OAUTH_AUTO_REDIRECT: ${TINYAUTH_OAUTH_AUTO_REDIRECT:-none} # Options: none, github, google, or generic
      # Uncomment below if you want to restrict OAuth login to specific users
      OAUTH_WHITELIST: ${TINYAUTH_OAUTH_WHITELIST:-boden.crouch@gmail.com,halomastar@gmail.com,athenajaguiar@gmail.com,dgorsch2@gmail.com,dgorsch4@gmail.com}  # e.g. user1,user2,/^admin.>
    labels:
      traefik.enable: true
      traefik.http.routers.tinyauth.rule: Host(`auth.${DOMAIN}`) || Host(`auth.${TS_HOSTNAME}.${DOMAIN}`)
      traefik.http.middlewares.tinyauth.forwardAuth.address: http://auth:3000/api/auth/traefik
      homepage.group: Security
      homepage.name: TinyAuth
      homepage.icon: https://tinyauth.app/img/logo.png
      homepage.href: https://auth.${DOMAIN}/
      homepage.description: Centralized login service (email, Google, GitHub) used by Traefik auth middleware and apps
    restart: always

  crowdsec:
    # 🔹🔹 CrowdSec 🔹🔹
    # Highly recommend this guide: https://blog.lrvt.de/configuring-crowdsec-with-traefik/
    image: docker.io/crowdsecurity/crowdsec:latest
    container_name: crowdsec
    hostname: crowdsec
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - publicnet
    ports:
      - 127.0.0.1:9876:${CROWDSEC_LAPI_PORT:-8080}  # Port mapping for local firewall bouncers
    expose:
      - ${CROWDSEC_LAPI_PORT:-8080}    # HTTP API for bouncers
      - ${CROWDSEC_APPSEC_PORT:-7422}  # AppSec WAF endpoint
      - 6060                           # Metrics endpoint for prometheus
    environment:
      UID: ${PUID:-1001}
      GID: ${PGID:-999}
      COLLECTIONS: "crowdsecurity/appsec-crs crowdsecurity/appsec-generic-rules crowdsecurity/appsec-virtual-patching crowdsecurity/whitelist-good-actors crowdsecurity/base-http-scenarios crowdsecurity/http-cve crowdsecurity/linux crowdsecurity/sshd crowdsecurity/traefik"
    configs:
      - source: crowdsec-appsec.yaml
        target: /etc/crowdsec/acquis.d/appsec.yaml
        mode: 0400
      - source: acquis.yaml
        target: /etc/acquis.yaml
        mode: 0400
      - source: victoriametrics.yaml
        target: /etc/notifications/victoriametrics.yaml
        mode: 0400
    volumes:
      # CrowdSec container data
      - /data/coolify/proxy/crowdsec/data:/var/lib/crowdsec/data:rw
      - /data/coolify/proxy/crowdsec/etc/crowdsec:/etc/crowdsec:rw
      - /data/coolify/proxy/crowdsec/plugins:/usr/local/lib/crowdsec/plugins:rw
      # Log bind mounts into crowdsec
      - /data/coolify/proxy/crowdsec/var/log/auth.log:/var/log/auth.log:ro
      - /data/coolify/proxy/crowdsec/var/log/syslog:/var/log/syslog:ro
      - /data/coolify/proxy/logs:/var/log/traefik:ro
    labels:
      traefik.enable: true
      traefik.http.middlewares.crowdsec.plugin.bouncer.forwardedHeadersTrustedIPs: "10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,169.254.0.0/16,127.0.0.0/8,100.64.0.0/10,192.0.0.0/24,192.0.2.0/24,198.18.0.0/15,198.51.100.0/24,203.0.113.0/24,224.0.0.0/4,240.0.0.0/4,255.255.255.255/32,fc00::/7,fd00::/8,fe80::/10,::1/128,2002::/16"
      traefik.http.middlewares.crowdsec.plugin.bouncer.clientTrustedIPs: "10.0.0.0/8,172.16.0.0/12,192.168.0.0/16,169.254.0.0/16,127.0.0.0/8,100.64.0.0/10,192.0.0.0/24,192.0.2.0/24,198.18.0.0/15,198.51.100.0/24,203.0.113.0/24,224.0.0.0/4,240.0.0.0/4,255.255.255.255/32,fc00::/7,fd00::/8,fe80::/10,::1/128,2002::/16"
      traefik.http.middlewares.crowdsec.plugin.bouncer.enabled: ${CROWDSEC_BOUNCER_ENABLED:-true}
      traefik.http.middlewares.crowdsec.plugin.bouncer.defaultDecisionSeconds: ${CROWDSEC_BOUNCER_DEFAULT_DECISION_SECONDS:-60}
      traefik.http.middlewares.crowdsec.plugin.bouncer.crowdsecMode: ${CROWDSEC_MODE:-live}
      traefik.http.middlewares.crowdsec.plugin.bouncer.crowdsecAppsecEnabled: ${CROWDSEC_APPSEC_ENABLED:-true}  # <--- here you can enable appsec waf
      traefik.http.middlewares.crowdsec.plugin.bouncer.crowdsecAppsecHost: crowdsec:${CROWDSEC_APPSEC_PORT:-7422}
      traefik.http.middlewares.crowdsec.plugin.bouncer.crowdsecAppsecFailureBlock: ${CROWDSEC_APPSEC_FAILURE_BLOCK:-true}
      traefik.http.middlewares.crowdsec.plugin.bouncer.crowdsecAppsecUnreachableBlock: ${CROWDSEC_APPSEC_UNREACHABLE_BLOCK:-true}
      traefik.http.middlewares.crowdsec.plugin.bouncer.crowdsecLapiKey: ${CROWDSEC_LAPI_KEY:?}
      traefik.http.middlewares.crowdsec.plugin.bouncer.crowdsecLapiScheme: ${CROWDSEC_LAPI_SCHEME:-http}
      traefik.http.middlewares.crowdsec.plugin.bouncer.crowdsecLapiHost: crowdsec:${CROWDSEC_LAPI_PORT:-8080}
      traefik.http.middlewares.crowdsec.plugin.bouncer.crowdsecLapiTLSInsecureVerify: ${CROWDSEC_LAPI_TLS_INSECURE_VERIFY:-false}
      traefik.http.routers.crowdsec.rule: Host(`crowdsec.${DOMAIN}`) || Host(`crowdsec.${TS_HOSTNAME}.${DOMAIN}`)
      traefik.http.services.crowdsec.loadbalancer.server.port: ${CROWDSEC_LAPI_PORT:-8080}
      homepage.group: Security
      homepage.name: CrowdSec
      homepage.icon: crowdsec.png
      homepage.href: https://crowdsec.${DOMAIN}/
      homepage.description: Behavioral security engine and WAF; Traefik bouncer blocks abusive IPs and bad traffic
#      homepage.widget.type: crowdsec
#      homepage.widget.url: http://crowdsec:${CROWDSEC_LAPI_PORT:-8080}
#      homepage.widget.username: ${CROWDSEC_MACHINE_ID:-localhost}  # machine_id in crowdsec
#      homepage.widget.password: ${CROWDSEC_MACHINE_PASSWORD}
    restart: always
  whoami:
    # 🔹🔹 Whoami 🔹🔹
    image: docker.io/traefik/whoami:latest
    container_name: whoami
    hostname: whoami
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - backend
    expose:
      - 80
    labels:
      traefik.enable: true
      traefik.http.routers.whoami.rule: Host(`whoami.${DOMAIN}`) || Host(`whoami.${TS_HOSTNAME}.${DOMAIN}`)
      traefik.http.routers.whoami.service: whoami@docker
      traefik.http.services.whoami.loadBalancer.server.port: 80
#      traefik.http.routers.whoami.middlewares: legalbar@file
#      traefik.http.middlewares.legalbar.plugin.bodyreplace.replacements[0].search: </body>
#      traefik.http.middlewares.legalbar.plugin.bodyreplace.replacements[0].replace: <div style='position:fixed;bottom:0;width:100%;background:#222;color:#fff;text-align:center;padding:6px;font-size:14px;z-index:9999;'><a href="https://${DOMAIN}/privacy-policy" style="color:#fff;margin:0 10px;">Privacy Policy</a> | <a href="https://${DOMAIN}/terms" style="color:#fff;margin:0 10px;">Terms</a> | <a href="https://${DOMAIN}/cookies-policy" style="color:#fff;margin:0 10px;">Cookies Policy</a> — © ${DOMAIN}</div></body>
      homepage.group: Web Services
      homepage.name: whoami
      homepage.icon: whoami.png
      homepage.href: https://whoami.${DOMAIN}
      homepage.description: Request echo service used to verify reverse-proxy, headers, and auth middleware
    restart: always
  logrotate-traefik:
    # 🔹🔹 Logrotate for Traefik logs 🔹🔹
    image: docker.io/alpine:latest
    container_name: logrotate-traefik
    hostname: logrotate-traefik
    networks:
      - backend
    user: root:root
    configs:
      - source: traefik_logrotate_tail.sh
        target: /traefik_logrotate_tail.sh
        mode: 0755
    volumes:
      - /data/coolify/proxy/logs:/var/log/traefik
    environment:
      TZ: ${TZ:-America/Chicago}
    command: /traefik_logrotate_tail.sh
    deploy:
      resources:
        reservations:
          cpus: 0.01
          memory: 8M
        limits:
          cpus: 0.1
          memory: 64M
    restart: always
  traefik:
    # 🔹🔹 Traefik 🔹🔹
    depends_on:
      - crowdsec
      - failover-proxy
      - nginx-traefik-extensions
    image:  docker.io/traefik:latest
    container_name: traefik
    hostname: traefik
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - publicnet
    expose:
      - 8080          # Dashboard API
    ports:
      - 80:80         # HTTP
      - 443:443       # HTTPS
      - 443:443/udp   # HTTPS/3
      - 853:853       # DNS over TLS
    cap_add:
      - NET_ADMIN
    volumes:
      - /data/coolify/proxy/traefik/dynamic:/traefik/dynamic
      - /data/coolify/proxy/certs:/certs
      - /data/coolify/proxy/traefik/config:/config
      - /data/coolify/proxy/traefik/plugins-local:/plugins-local
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - /data/coolify/proxy/traefik/etc/traefik:/etc/traefik/
      - /data/coolify/proxy/logs:/var/log/traefik:rw
    #      - /etc/localtime:/etc/localtime:ro
    configs:
      - source: traefik-dynamic.yaml
        target: /traefik/dynamic/core.yaml
        mode: 0644
    environment:
      LETS_ENCRYPT_EMAIL: ${ACME_RESOLVER_EMAIL:?}
      CLOUDFLARE_EMAIL: ${CLOUDFLARE_EMAIL:?}
      CLOUDFLARE_API_KEY: ${CLOUDFLARE_API_KEY:?}
      CLOUDFLARE_ZONE_ID: ${CLOUDFLARE_ZONE_ID:?}
    command:
      - '--accessLog=true'
      - '--accessLog.bufferingSize=0'
      - '--accessLog.fields.headers.defaultMode=drop'
      - '--accessLog.fields.headers.names.User-Agent=keep'
      - '--accessLog.filePath=/var/log/traefik/traefik.log'
      - '--accessLog.filters.statusCodes=200-299,400-499,500-599'
      - '--accessLog.format=json'
      - '--metrics.prometheus.buckets=0.1,0.3,1.2,5.0'
      - '--api.dashboard=true'
      - '--api.debug=true'
      - '--api.disableDashboardAd=true'
      - '--api.insecure=false'
      - '--certificatesResolvers.letsencrypt.acme.caServer=https://acme-v02.api.letsencrypt.org/directory'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge=true'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge.provider=cloudflare'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge.resolvers=1.1.1.1,1.0.0.1'
      - '--certificatesResolvers.letsencrypt.acme.email=${ACME_RESOLVER_EMAIL:?}'
      - '--certificatesResolvers.letsencrypt.acme.httpChallenge=true'
      - '--certificatesResolvers.letsencrypt.acme.httpChallenge.entryPoint=web'
      - '--certificatesResolvers.letsencrypt.acme.tlsChallenge=true'
      - '--certificatesResolvers.letsencrypt.acme.storage=/certs/acme.json'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge.propagation.disableChecks=true'
      - '--certificatesResolvers.letsencrypt.acme.dnsChallenge.propagation.delayBeforeChecks=60'
      - '--entryPoints.dot.address=:853'
      - '--entryPoints.web.address=:80'
      - '--entryPoints.web.forwardedHeaders.trustedIPs=103.21.244.0/22,103.22.200.0/22,103.31.4.0/22,104.16.0.0/13,104.24.0.0/14,108.162.192.0/18,131.0.72.0/22,141.101.64.0/18,162.158.0.0/15,172.64.0.0/13,173.245.48.0/20,188.114.96.0/20,190.93.240.0/20,197.234.240.0/22,198.41.128.0/17,2400:cb00::/32,2405:8100::/32,2405:b500::/32,2606:4700::/32,2803:f800::/32,2a06:98c0::/29,2c0f:f248::/32'
      - '--entryPoints.web.http.encodeQuerySemiColons=true'
      - '--entryPoints.web.http.middlewares=crowdsec@file'
      - '--entryPoints.web.http2.maxConcurrentStreams=250'
      - '--entryPoints.websecure.address=:443'
      - '--entryPoints.websecure.forwardedHeaders.trustedIPs=103.21.244.0/22,103.22.200.0/22,103.31.4.0/22,104.16.0.0/13,104.24.0.0/14,108.162.192.0/18,131.0.72.0/22,141.101.64.0/18,162.158.0.0/15,172.64.0.0/13,173.245.48.0/20,188.114.96.0/20,190.93.240.0/20,197.234.240.0/22,198.41.128.0/17,2400:cb00::/32,2405:8100::/32,2405:b500::/32,2606:4700::/32,2803:f800::/32,2a06:98c0::/29,2c0f:f248::/32'
      - '--entryPoints.websecure.http.encodeQuerySemiColons=true'
      - '--entryPoints.websecure.http.middlewares=crowdsec@file,bolabaden-error-pages@file,strip-www@file'
      - '--entryPoints.websecure.http.tls=true'
      - '--entryPoints.websecure.http.tls.certResolver=letsencrypt'
      - '--entryPoints.websecure.http.tls.domains[0].main=${DOMAIN}'
      - '--entryPoints.websecure.http.tls.domains[0].sans=*.${DOMAIN},*.${TS_HOSTNAME}.${DOMAIN}'
      - '--entryPoints.websecure.http2.maxConcurrentStreams=250'
      - '--entryPoints.websecure.http3'
      - '--global.checkNewVersion=true'
      - '--global.sendAnonymousUsage=false'
      - '--log.level=INFO'
      - '--ping=true'
      - '--providers.docker=true'
      - '--providers.docker.network=publicnet'
      - '--providers.docker.defaultRule=Host(`{{ normalize .ContainerName }}.${DOMAIN}`) || Host(`{{ normalize .ContainerName }}.${TS_HOSTNAME}.${DOMAIN}`) || Host(`{{ normalize .Name }}.${DOMAIN}`) || Host(`{{ normalize .Name }}.${TS_HOSTNAME}.${DOMAIN}`)'
      - '--providers.docker.exposedByDefault=false'
      - '--providers.file.directory=/traefik/dynamic/'
      - '--providers.file.watch=true'
      - '--experimental.plugins.bouncer.modulename=github.com/maxlerebourg/crowdsec-bouncer-traefik-plugin'
      - '--experimental.plugins.bouncer.version=v1.4.2'
      # TLS-specific option within the ServersTransport configuration.
      # When set to true, it disables the verification of the backend server's TLS certificate chain and hostname.
      # By default, this option is false, meaning Traefik would validate the certificate to ensure it is issued by a trusted certificate authority (CA), has not expired, and matches the expected hostname.
      # Setting it to true bypasses these checks, allowing connections to proceed even with self-signed, expired, or mismatched certificates.
      # This is useful for testing or when you need to connect to services that use self-signed certificates.
      # however, in our configuration, this is REQUIRED to be true (avoids errors like 'ERR 500 Internal Server Error error="tls: failed to verify certificate: x509: cannot validate certificate for 10.76.0.2 because it doesn't contain any IP SANs"')
      - '--serversTransport.insecureSkipVerify=true'
    labels:
      traefik.enable: true
      traefik.http.routers.traefik.service: api@internal
      traefik.http.routers.traefik.rule: Host(`traefik.${DOMAIN}`) || Host(`traefik.${TS_HOSTNAME}.${DOMAIN}`)
      traefik.http.services.traefik.loadbalancer.server.port: 8080
#      traefik.http.middlewares.legalbar.plugin.bodyreplace.replacements[0].search: </body>
#      traefik.http.middlewares.legalbar.plugin.bodyreplace.replacements[0].replace: <div style='position:fixed;bottom:0;width:100%;background:#222;color:#fff;text-align:center;padding:6px;font-size:14px;z-index:9999;'><a href="https://${DOMAIN}/privacy-policy" style="color:#fff;margin:0 10px;">Privacy Policy</a> | <a href="https://${DOMAIN}/terms" style="color:#fff;margin:0 10px;">Terms</a> | <a href="https://${DOMAIN}/cookies-policy" style="color:#fff;margin:0 10px;">Cookies Policy</a> — © ${DOMAIN}</div></body>
      homepage.group: Infrastructure
      homepage.name: Traefik
      homepage.icon: traefik.png
      homepage.href: https://traefik.${DOMAIN}/api
      homepage.widget.type: traefik
      homepage.description: Reverse proxy entrypoint for all services with TLS, Cloudflare integration, and auth middleware
    healthcheck:
      test: ["CMD", "traefik", "healthcheck", "--ping"]
      interval: 10s
      timeout: 3s
      retries: 3
      start_period: 10s
    restart: always
  docker-gen-failover:
    image: docker.io/nginxproxy/docker-gen
    container_name: docker-gen-failover
    command: |
      -only-exposed
      -include-stopped
      -watch /templates/traefik-failover-dynamic.conf.tmpl /traefik/dynamic/failover-fallbacks.yaml
      -notify "restart traefik" /templates/traefik-failover-dynamic.conf.tmpl /traefik/dynamic/failover-fallbacks.yaml
    configs:
      - source: traefik-failover-dynamic.conf.tmpl
        target: /templates/traefik-failover-dynamic.conf.tmpl
        mode: 0400
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - /data/coolify/proxy/traefik/dynamic:/traefik/dynamic
    restart: always
  docker-gen-docker-labels:
    image: docker.io/nginxproxy/docker-gen
    container_name: docker-gen-docker-labels
    command: |
      -only-exposed
      -include-stopped
      -watch /templates/traefik-docker-labels-conf.tmpl /traefik/dynamic/docker-labels.yaml
      -notify "restart traefik" /templates/traefik-docker-labels-conf.tmpl /traefik/dynamic/docker-labels.yaml
    configs:
      - source: traefik-docker-labels-conf.tmpl
        target: /templates/traefik-docker-labels-conf.tmpl
        mode: 0400
    volumes:
      - /var/run/docker.sock:/tmp/docker.sock:ro
      - /data/coolify/proxy/traefik/dynamic:/traefik/dynamic
    restart: always
  traefik-labels:
    image: docker.io/11notes/traefik-labels:arm64v8-latest
    container_name: traefik-labels
    networks:
      - publicnet
      - backend
    environment:
      TZ: ${TZ:-America/Chicago}
    volumes:
      - ${CONFIG_PATH:-./configs}/traefik/etc/traefik:/labels/etc
    restart: always
  failover-proxy:
    image: caddy:latest  # Latest stable version as of August 2025, validated for compatibility
    container_name: failover-proxy
    hostname: failover-proxy
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - backend  # Matches Traefik's network; adjust if using a custom network
    expose:
      - ${CADDY_INTERNAL_HTTP_PORT:-80}
    configs:
      - source: Caddyfile
        target: /etc/caddy/Caddyfile
        mode: 0400
    volumes:
      - ${CONFIG_PATH:-./configs}/caddy/data:/data  # Persistent volume for any auto-generated data (minimal in this setup)
      - ${CONFIG_PATH:-./configs}/caddy/config:/config  # Persistent config storage, though not strictly needed here
    environment:
      - DOMAIN=${DOMAIN}  # Optional: for logging or future expansion
    healthcheck:
      test: ["CMD-SHELL", "caddy validate --config /etc/caddy/Caddyfile"]
      interval: 30s
      timeout: 5s
      retries: 3
    restart: always
```

## Assistant

_Time: 2025-08-30T13:21:00.313Z_

Your configuration indicates a sophisticated setup involving Traefik as a reverse proxy, with dynamic file providers for failover and label processing, alongside services such as CrowdSec for security, TinyAuth for authentication, and Caddy for internal failover routing to multiple backend domains. The traefik-labels service is included to monitor Docker nodes, extract Traefik labels from containers, and export them to a central Redis instance for dynamic configuration updates. However, your provided docker-compose.yaml does not include a Redis service, which is essential for traefik-labels to function as intended for Traefik integration (as per the tool's documentation). To enable this, you must add a Redis service to your compose file (e.g., similar to the example in the tool's documentation) and configure Traefik with the Redis provider in its command flags or static configuration (e.g., --providers.redis=true --providers.redis.endpoints=redis:6379).

The config.yaml file is mounted at /labels/etc/config.yaml within the container and defines the operational parameters for traefik-labels. It uses standard YAML syntax under a top-level "labels" key. Required elements include the Redis URL (for Traefik configuration export) and the list of Docker nodes to monitor. Optional elements include webhook notifications, RFC 2136 DNS updates, polling/ping intervals, timeouts, and TLS for secure Docker API connections. Since your setup does not explicitly use RFC 2136 (relying instead on Cloudflare DDNS for DNS management) or webhooks, these are configured conservatively but included for exhaustiveness. For nodes, I have inferred the list from the failover backends in your Caddyfile, assuming these represent the Docker hosts to monitor (using their FQDNs, as supported by the tool); adjust IPs or FQDNs as needed for your environment. TLS is included but optional; if not required, omit the section, but ensure your Docker daemons are configured for remote API access (TCP with TLS recommended for security).

If your setup is single-node (e.g., all services on one host), traefik-labels may be redundant, as Traefik's native Docker provider can handle local labels directly. In that case, consider removing the service unless you intend to expand to multi-node or use the DNS update feature.

Below is the complete, accurate, and exhaustive config.yaml tailored to your configuration. Values are set based on documentation defaults where applicable, with adaptations for your multi-backend failover structure. Place this file at ${CONFIG_PATH:-./configs}/traefik/etc/traefik/config.yaml on your host.

```yaml
labels:
  redis:
    url: rediss://default:${REDIS_PASSWORD}@redis:6379/0  # Required: Secure Redis URL (adjust host, port, DB, and credentials to match your added Redis service; use 'redis://' for non-TLS)
  webhook:
    url: https://example.webhook.endpoint/v1/events  # Optional: Webhook URL for notifications on container events or polls (e.g., integrate with monitoring like Uptime Kuma or ShoutRRR in your setup)
    auth:
      basic: username:${WEBHOOK_PASSWORD}  # Optional: Basic auth credentials for the webhook; omit if no auth needed
  nodes:
    - micklethefickle.${DOMAIN}  # Required: List of Docker node FQDNs or IPs to monitor; derived from your Caddyfile backends (adjust to actual resolvable FQDNs or IPs)
    - beatapostapita.${DOMAIN}
    - vractormania.${DOMAIN}
    - arnialtrashlid.${DOMAIN}
    - cloudserver1.${DOMAIN}
    - cloudserver2.${DOMAIN}
    - cloudserver3.${DOMAIN}
  interval: 0  # Optional: Reload nodes list every N seconds (0 disables; set to 60 for dynamic node discovery ifyour setup changes frequently)
  timeout: 2.5  # Optional: Connection timeout to Docker nodes in seconds (increase if nodes are remote or networks are latent)
  rfc2136:
    verify: false  # Optional: Only update DNS if entries differ (false updates always; set to true for efficiency, though not used in your Cloudflare DDNS setup)
    remove: false  # Optional: Remove DNS entries for unreachable containers (false retains them; enable if using RFC 2136 alongside Cloudflare)
  poll:
    interval: 300  # Optional: Poll all containers on nodes every N seconds (default 300; aligns with your healthcheck intervals in Traefik templates)
  ping:
    interval: 10  # Optional: Ping nodes every N seconds to detect availability (default 10; useful for your failover scenario to handle node outages)
  tls:
    ca: /labels/ssl/ca.crt  # Optional: Path to CA certificate for Docker API TLS (mount /labels/ssl volume if enabling; required for secure remote access)
    crt: /labels/ssl/server.crt  # Optional: Path to client certificate
    key: /labels/ssl/server.key  # Optional: Path to client private key
```

To integrate this fully:
- Add a Redis service to your docker-compose.yaml (e.g., image: redis:7-alpine, with appropriate volumes, networks, and passwords).
- Update Traefik's command flags to include --providers.redis.endpoints=redis:6379 (and authentication if needed).
- Ensure Docker daemons on the listed nodes are configured for remote TCP access with TLS (as per the tool's disclaimers: enable in daemon.json with tlsverify, tlscacert, etc.).
- If using RFC 2136 for DNS (e.g., supplementing Cloudflare), add corresponding labels to containers as shown in the tool's examples.
- Test the configuration by restarting the traefik-labels service and verifying Redis entries (e.g., via redis-cli) reflect your container labels.

This configuration ensures comprehensive coverage of the tool's features while aligning with your setup's emphasis on failover, security, and dynamic routing. If specific values (e.g., node IPs or Redis details) differ, adjust accordingly for precision.
