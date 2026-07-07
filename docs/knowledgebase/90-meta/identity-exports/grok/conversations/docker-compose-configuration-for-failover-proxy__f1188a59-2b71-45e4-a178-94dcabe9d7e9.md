---
source_url: "https://grok.com/c/f1188a59-2b71-45e4-a178-94dcabe9d7e9"
conversation_id: "f1188a59-2b71-45e4-a178-94dcabe9d7e9"
title: "Docker Compose Configuration for Failover Proxy"
extracted_at: "2026-06-29T16:23:16.942Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# Docker Compose Configuration for Failover Proxy

Source: [Grok conversation](https://grok.com/c/f1188a59-2b71-45e4-a178-94dcabe9d7e9)

## User

_Time: 2025-08-30T14:01:19.906Z_

```dockercompose
# yaml-language-server: $schema=https://raw.githubusercontent.com/compose-spec/compose-spec/master/schema/compose-spec.json

volumes:
  caddy_data:
  caddy_config:

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
  labels-config.yaml:
    content: |
      labels:
        redis:
          url: redis://default:${REDIS_PASSWORD:-redis}@redis:6379/0  # Required: Secure Redis URL (adjust host, port, DB, and credentials to match your added Redis service; use 'redis://' for non-TLS)
      #  webhook:
      #    url: https://example.webhook.endpoint/v1/events  # Optional: Webhook URL for notifications on container events or polls (e.g., integrate with monitoring like Uptime Kuma or ShoutRRR in your setup)
      #    auth:
      #      basic: username:${WEBHOOK_PASSWORD}  # Optional: Basic auth credentials for the webhook; omit if no auth needed
        nodes:
          - ${DOMAIN}  # Required: List of Docker node FQDNs or IPs to monitor; derived from your Caddyfile backends (adjust to actual resolvable FQDNs or IPs)
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
      #  tls:
      #    ca: /labels/ssl/ca.crt  # Optional: Path to CA certificate for Docker API TLS (mount /labels/ssl volume if enabling; required for secure remote access)
      #    crt: /labels/ssl/server.crt  # Optional: Path to client certificate
      #    key: /labels/ssl/server.key  # Optional: Path to client private key
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
  traefik-docker-labels-conf.tmpl:
    file: ${ROOT_DIR:-.}/reference/traefik/traefik-comprehensive-docker-labels.tmpl

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
    #  - '--providers.docker.network=publicnet'
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
    profiles:
      - unfinished
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
    profiles:
      - unfinished
    image: docker.io/11notes/traefik-labels:arm64v8-latest
    container_name: traefik-labels
    networks:
      - publicnet
      - backend
    environment:
      TZ: ${TZ:-America/Chicago}
    configs:
      - source: labels-config.yaml
        target: /labels/etc/config.yaml
        mode: 0444
    volumes:
      - ${CONFIG_PATH:-./configs}/traefik/labels/ssl:/labels/ssl
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

_Time: 2025-08-30T14:01:38.337Z_



## User

_Time: 2025-08-30T14:03:40.663Z_

```dockercompose
# yaml-language-server: $schema=https://raw.githubusercontent.com/compose-spec/compose-spec/master/schema/compose-spec.json

volumes:
  caddy_data:
  caddy_config:

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
  labels-config.yaml:
    content: |
      labels:
        redis:
          url: redis://default:${REDIS_PASSWORD:-redis}@redis:6379/0  # Required: Secure Redis URL (adjust host, port, DB, and credentials to match your added Redis service; use 'redis://' for non-TLS)
      #  webhook:
      #    url: https://example.webhook.endpoint/v1/events  # Optional: Webhook URL for notifications on container events or polls (e.g., integrate with monitoring like Uptime Kuma or ShoutRRR in your setup)
      #    auth:
      #      basic: username:${WEBHOOK_PASSWORD}  # Optional: Basic auth credentials for the webhook; omit if no auth needed
        nodes:
          - ${DOMAIN}  # Required: List of Docker node FQDNs or IPs to monitor; derived from your Caddyfile backends (adjust to actual resolvable FQDNs or IPs)
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
      #  tls:
      #    ca: /labels/ssl/ca.crt  # Optional: Path to CA certificate for Docker API TLS (mount /labels/ssl volume if enabling; required for secure remote access)
      #    crt: /labels/ssl/server.crt  # Optional: Path to client certificate
      #    key: /labels/ssl/server.key  # Optional: Path to client private key
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
  traefik-docker-labels-conf.tmpl:
    file: ${ROOT_DIR:-.}/reference/traefik/traefik-comprehensive-docker-labels.tmpl

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
    #  - '--providers.docker.network=publicnet'
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
    profiles:
      - unfinished
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
    profiles:
      - unfinished
    image: docker.io/11notes/traefik-labels:arm64v8-latest
    container_name: traefik-labels
    networks:
      - publicnet
      - backend
    environment:
      TZ: ${TZ:-America/Chicago}
    configs:
      - source: labels-config.yaml
        target: /labels/etc/config.yaml
        mode: 0444
    volumes:
      - ${CONFIG_PATH:-./configs}/traefik/labels/ssl:/labels/ssl
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


```
# yaml-language-server: $schema=https://raw.githubusercontent.com/compose-spec/compose-spec/master/schema/compose-spec.json


x-common-env: &common-env
  TZ: ${TZ:-America/Chicago}
  PUID: ${PUID:-1001}
  PGID: ${PGID:-999}
  UMASK: ${UMASK:-002}


networks:
  warp-nat-net:
    external: true  # docker network create --attachable -o com.docker.network.bridge.name=br_warp-nat-net -o com.docker.network.bridge.enable_ip_masquerade=false warp-nat-net
    attachable: true
    driver_opts:
      com.docker.network.bridge.name: br_warp-nat-net
      com.docker.network.bridge.enable_ip_masquerade: "false"  # required for custom NAT control
  publicnet:  # https://docs.docker.com/engine/network/drivers/bridge/#differences-between-user-defined-bridges-and-the-default-bridge
    #external: true  # docker network create --driver=bridge --attachable publicnet --subnet=${PUBLICNET_SUBNET:-10.76.0.0/16} --gateway=${PUBLICNET_GATEWAY:-10.76.0.1} --ip-range=${PUBLICNET_IP_RANGE:-10.76.0.0/16} -o com.docker.network.bridge.name=br_publicnet
    attachable: true
    # uncomment all remaining lines for publicnet, if you aren't creating it externally.
    driver_opts:
      com.docker.network.bridge.name: "br_publicnet"
    ipam:
      config:
        - subnet: ${PUBLICNET_SUBNET:-10.76.0.0/16}
          gateway: ${PUBLICNET_GATEWAY:-10.76.0.1}
          ip_range: ${PUBLICNET_IP_RANGE:-10.76.0.0/16}
  backend:
    attachable: true
    driver_opts:
      com.docker.network.bridge.name: "br_backend"
  nomasq-test-int:
    attachable: true
    driver_opts:
      com.docker.network.bridge.name: "br_nomasq-test-int"
      com.docker.network.bridge.enable_ip_masquerade: "false"
  nomasq-test:
    external: true  # docker network create --attachable -o com.docker.network.bridge.name=br_nomasq-test -o com.docker.network.bridge.enable_ip_masquerade=false nomasq-test


volumes:
  portainer_data:


include:
#  - compose/docker-compose.authentik.yml
  - compose/docker-compose.coolify-proxy.yml
  - compose/docker-compose.firecrawl.yml
  - compose/docker-compose.headscale.yml
  - compose/docker-compose.llm.yml
#  - compose/docker-compose.plex.yml
#  - compose/docker-compose.unsend.yml
  - compose/docker-compose.stremio-group.yml
  - compose/docker-compose.warp-nat-routing.yml
#  - compose/docker-compose.wordpress.yml
#  - compose/docker-compose.vpn-docker.yml



configs:
  rclone.conf:
    content: |
      [rdhttp]
      type = http
      url = https://my.real-debrid.com/${REALDEBRID_WEBDAV_PASSWORD}/
      no_head = false
      no_slash = false

      [rd-webdav]
      type = webdav
      url = https://dav.real-debrid.com/
      vendor = other
      user = ${REALDEBRID_USER}
      pass = ${REALDEBRID_PASS}

      [rdhttp2]
      type = http
      url = https://my.real-debrid.com/${REALDEBRID_WEBDAV_PASSWORD_2}/
      no_head = false
      no_slash = false

      [rd-webdav2]
      type = webdav
      url = https://dav.real-debrid.com/
      vendor = other
      user = ${REALDEBRID_USER2}
      pass = ${REALDEBRID_PASS2}
  rclone-mounts.json:
    content: |
      [
        {
          "fs": "rd:",
          "mountPoint": "/mnt/remote/realdebrid",
          "mainOpt": {
            "LogLevel": "DEBUG"
          },
          "LogLevel": "DEBUG",
          "mountOpt": {
            "GID": ${PGID:-999},
            "UID": ${PUID:-1001},
            "AllowNonEmpty": true,
            "AllowOther": true,
            "AttrTimeout": "87600h",
            "DirCacheTime": "60s",
            "DirPerms": "0777",
            "FilePerms": "0666",
            "PollInterval": "30s",
            "ExtraFlags": [
              "--config=/config/rclone/rclone.conf",
              "--log-level=DEBUG",
              "--log-file=/config/rclone/rclone.log"
            ]
          },
          "vfsOpt": {
            "BufferSize": "128M",
            "CacheMaxAge": "2m",
            "CacheMaxSize": "100G",
            "CacheMode": "full",
            "CachePollInterval": "30s",
            "ChunkSize": "2M",
            "ChunkSizeLimit": "64M",
            "DiskSpaceTotalSize": "1T",
            "FastFingerprint": true,
            "MinFreeSpace": "1G",
            "ReadAhead": "128M",
            "ReadWait": "40ms",
            "ExtraOptions": [
              "--vfs-refresh",
              "--transfers=16",
              "--checkers=16",
              "--multi-thread-streams=4",
              "--cache-dir=/mnt/remote/cache/realdebrid"
            ]
          }
        }
      ]
  gethomepage-custom.css:
    content: |
      /* Custom CSS for ${DOMAIN} - ${TS_HOSTNAME} */
  gethomepage-custom.js:
    content: |
      /* Custom JavaScript for Bolabaden */
  gethomepage-docker.yaml:
    content: |
      ---
      # For configuration options and examples, please see:
      # https://gethomepage.dev/configs/docker/

      my-docker:
        socket: /var/run/docker.sock
      #  host: dockerproxy
      #  port: 2375
  gethomepage-widgets.yaml:
    content: |
      ---
      # For configuration options and examples, please see:
      # https://gethomepage.dev/configs/info-widgets/

      - resources:
        cpu: true
        memory: true
        disk: /

      - search:
        provider: duckduckgo
        target: _blank
  gethomepage-settings.yaml:
    content: |
      ---
      # For configuration options and examples, please see:
      # https://gethomepage.dev/configs/settings/

      providers:
        openweathermap: ${OPENWEATHERMAP_API_KEY}
        weatherapi: ${WEATHERAPI_API_KEY}
  gethomepage-bookmarks.yaml:
    content: |
      ---
      # For configuration options and examples, please see:
      # https://gethomepage.dev/configs/bookmarks

      - Developer:
        - Github:
          - abbr: GH
            href: https://github.com/bolabaden-site

      - Portfolio:
        - ${DOMAIN}:
          - abbr: BO
            href: https://${DOMAIN}/
        - LinkedIn:
          - abbr: LI
            href: https://www.linkedin.com/in/boden-crouch-555897193/
      
      - AI/Research:
        - ai-researchwizard:
          - abbr: GP
            href: https://gptr.${DOMAIN}/
        - searxng:
          - abbr: SE
            href: https://searxng.${DOMAIN}/

  prometheus.yml:
    content: |
      # TODO
  alert.rules:
    content: |
      # TODO



services:
  hedgedoc:
    depends_on:
      - hedgedoc-db
    image: quay.io/hedgedoc/hedgedoc:latest
    container_name: hedgedoc
    hostname: hedgedoc
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - publicnet
    expose:
      - 3000
    environment:
      CMD_DB_URL: postgres://${HEGEDOC_DB_USER:-hedgedoc}:${HEGEDOC_DB_PASSWORD:-password}@hedgedoc-db:${HEGEDOC_DB_PORT:-5432}/${HEGEDOC_DB_NAME:-hedgedoc}
      CMD_DOMAIN: hedgedoc.${DOMAIN}
      CMD_URL_ADDPORT: false
      CMD_PROTOCOL_USESSL: true
      CMD_SESSION_SECRET: "discolor-subtitle-seducing-result-ceramics"  # Define secret
      CMD_ALLOW_EMAIL_REGISTER: "true"  # Allow registration
      CMD_EMAIL: "true"  # Allow login; only guest notes
      # ------- OAUTH SSO -------
      # see https://docs.goauthentik.io/integrations/services/hedgedoc/
      #- CMD_ALLOW_ANONYMOUS_EDITS=False
      #- CMD_OAUTH2_USER_PROFILE_URL=https://authentik.${DOMAIN}/application/o/userinfo/
      #- CMD_OAUTH2_USER_PROFILE_USERNAME_ATTR=preferred_username
      #- CMD_OAUTH2_USER_PROFILE_DISPLAY_NAME_ATTR=name
      #- CMD_OAUTH2_USER_PROFILE_EMAIL_ATTR=email
      #- CMD_OAUTH2_TOKEN_URL=https://authentik.${DOMAIN}/application/o/token/
      #- CMD_OAUTH2_AUTHORIZATION_URL=https://authentik.${DOMAIN}/application/o/authorize/
      #- CMD_OAUTH2_CLIENT_ID=<ID>
      #- CMD_OAUTH2_CLIENT_SECRET=<SECRET>
      #- CMD_OAUTH2_PROVIDERNAME=Authentik
      #- CMD_OAUTH2_SCOPE=openid email profile
    volumes:
      - ${CONFIG_PATH:-./configs}/hedgedoc/uploads:/hedgedoc/public/uploads
    labels:
      traefik.enable: true
      traefik.http.middlewares.add-hedgedoc-metrics-prefix.addPrefix.prefix: /metrics
      traefik.http.routers.hedgedoc-direct.service: hedgedoc@docker
      traefik.http.routers.hedgedoc-direct.rule: Host(`hedgedoc.${DOMAIN}`) || Host(`hedgedoc.${TS_HOSTNAME}.${DOMAIN}`)
      traefik.http.services.hedgedoc.loadbalancer.server.port: 3000
      # Hedgedoc Homepage rendering
      homepage.group: Dashboards
      homepage.name: Hedgedoc
      homepage.icon: hedgedoc.png
      homepage.href: https://hedgedoc.${DOMAIN}/
      homepage.description: Collaborative, open-source note-taking platform
    restart: always

  hedgedoc-db:
    image: docker.io/postgres:16.3-alpine
    container_name: hedgedoc-db
    hostname: hedgedoc-db
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - publicnet
    expose:
      - ${HEGEDOC_DB_PORT:-5432}
    volumes:
      - ${CONFIG_PATH:-./configs}/hedgedoc/database:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: ${HEGEDOC_DB_USER:-hedgedoc}
      POSTGRES_PASSWORD: ${HEGEDOC_DB_PASSWORD:-password}
      POSTGRES_DB: ${HEGEDOC_DB_NAME:-hedgedoc}
      POSTGRES_PORT: ${HEGEDOC_DB_PORT:-5432}
    restart: always

  mongodb:
    # 🔹🔹 MongoDB 🔹🔹
    image: docker.io/mongo:latest
    container_name: mongodb
    hostname: ${MONGODB_HOSTNAME:-mongodb}
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - publicnet
    expose:
      - 27017
    volumes:
      - ${CONFIG_PATH:-./configs}/mongodb/data:/data/db
    healthcheck:
      test: ["CMD-SHELL", "mongosh 127.0.0.1:27017/test --quiet --eval 'db.runCommand(\"ping\").ok' > /dev/null 2>&1 || exit 1"]
      interval: 10s
      timeout: 10s
      retries: 5
      start_period: 40s
    restart: always

  searxng:
    # 🔹🔹 SearxNG 🔹🔹  # https://hub.docker.com/r/searxng/searxng
    # SearxNG is a privacy-respecting, hackable, open-source metasearch engine.
    image: docker.io/searxng/searxng:latest
    container_name: searxng
    hostname: searxng
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - publicnet
    volumes:
      # touch ${CONFIG_PATH:-./configs}/searxng/limiter.toml
      - ${CONFIG_PATH:-./configs}/searxng:/etc/searxng
    environment:
      SEARXNG_BASE_URL: ${SEARXNG_INTERNAL_URL:-http://searxng:8080}
    labels:
      traefik.enable: true
      traefik.http.routers.searxng.rule: Host(`searxng.${DOMAIN}`) || Host(`searxng.${TS_HOSTNAME}.${DOMAIN}`)
      traefik.http.routers.searxng.service: searxng@docker
      traefik.http.services.searxng.loadbalancer.server.port: 8080
      homepage.group: Search
      homepage.name: SearxNG
      homepage.icon: searxng.png
      homepage.href: https://searxng.${DOMAIN}/
      homepage.description: Privacy-focused metasearch that aggregates results from many sources without tracking
    healthcheck:
      test: ["CMD-SHELL", "wget --no-verbose --tries=1 --spider http://127.0.0.1:8080/ || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
    restart: always

  grafana:
    image: grafana/grafana:latest  # 12.1.1
    container_name: grafana
    hostname: grafana
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - publicnet
    expose:
      - 3000
    user: ${PUID:-1001}:${PGID:-999}
    environment:
      - GF_SERVER_ROOT_URL=https://grafana.${DOMAIN}
    volumes:
      - ${CONFIG_PATH:-./configs}/grafana:/var/lib/grafana
    labels:
      traefik.enable: true
      traefik.http.routers.grafana.rule: Host(`grafana.${DOMAIN}`) || Host(`grafana.${TS_HOSTNAME}.${DOMAIN}`)
      traefik.http.routers.grafana.middlewares: nginx-auth@docker
      traefik.http.services.grafana.loadbalancer.server.port: 3000
      homepage.group: Infrastructure
      homepage.name: Grafana
      homepage.icon: grafana.png
      homepage.href: https://grafana.${DOMAIN}/
      homepage.description: Grafana is an open-source platform for monitoring and observability.
    restart: always
  code-server:
    # 🔹🔹 Code Server 🔹🔹
    image: docker.io/linuxserver/code-server:latest
    container_name: code-server
    hostname: code-server
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - publicnet
    volumes:
      - ${CONFIG_PATH:-./configs}/code-server/dev/config:/config
      - ${CONFIG_PATH:-./configs}/code-server/dev/workspace:/workspace
      - ${ROOT_PATH:-.}:/workspace
    user: ${PUID:-1001}:${PGID:-999}
    environment:
      <<: *common-env
      PASSWORD: ${SUDO_PASSWORD}
      SUDO_PASSWORD: ${SUDO_PASSWORD}
      DEFAULT_WORKSPACE: ${CODESERVER_DEFAULT_WORKSPACE:-/workspace}
    labels:
      traefik.enable: true
      traefik.http.routers.code-server.rule: Host(`code-server.${DOMAIN}`) || Host(`code-server.${TS_HOSTNAME}.${DOMAIN}`)
      traefik.http.routers.code-server.middlewares: nginx-auth@docker
      traefik.http.services.code-server.loadBalancer.server.port: 8443
      # Homepage definitions for code-server
      homepage.group: Infrastructure
      homepage.name: Code Dev
      homepage.icon: code-server.png
      homepage.href: https://code-server.${DOMAIN}/
      homepage.description: In-browser VS Code environment for editing and managing code on this server
    cpu_shares: 10
    mem_reservation: 200M
    deploy:
      resources:
        reservations:
          cpus: 0.15
          memory: 200M
        limits:
          cpus: 2
          memory: 4G
    restart: always

  init_prometheus:
    image: docker.io/prom/prometheus:latest
    container_name: init_prometheus
    hostname: init_prometheus
    extra_hosts:
      - host.docker.internal:host-gateway
    user: root
    entrypoint: /bin/sh -c "chown -R 65534:65534 /prometheus"
    volumes:
      - ${CONFIG_PATH:-./configs}/prometheus/data:/prometheus
    restart: "no"

  prometheus:
    depends_on:
      init_prometheus:
        condition: service_completed_successfully
    image: docker.io/prom/prometheus:latest
    container_name: prometheus
    hostname: prometheus
    networks:
      - publicnet
    extra_hosts:
      - host.docker.internal:host-gateway
    volumes:
      - ${CONFIG_PATH:-./configs}/prometheus/data:/prometheus
    configs:
      - source: prometheus.yml
        target: /etc/prometheus/prometheus.yml
        mode: 0777
      - source: alert.rules
        target: /etc/prometheus/alert.rules
        mode: 0777
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
      - '--web.console.libraries=/usr/share/prometheus/console_libraries'
      - '--web.console.templates=/usr/share/prometheus/consoles'
      - '--web.enable-lifecycle'
    labels:
      traefik.enable: true
      traefik.http.routers.prometheus-direct.rule: Host(`prometheus.${DOMAIN}`) || Host(`prometheus.${TS_HOSTNAME}.${DOMAIN}`)
      traefik.http.routers.prometheus-direct.middlewares: nginx-auth@docker
      traefik.http.services.prometheus.loadbalancer.server.port: 9090
    restart: always

  bolabaden-nextjs:
    # 🔹🔹 bolabaden nextJS main website with integrated auth 🔹🔹
    build:
      context: ${SRC_PATH:-./src}/website/bolabaden-site
      dockerfile: Dockerfile
    image: docker.io/th3w1zard1/bolabaden-nextjs:latest
    container_name: bolabaden-nextjs
    hostname: bolabaden-nextjs
    networks:
      warp-nat-net:
        gw_priority: 1
      publicnet: {}
    expose:
      - 3000
    extra_hosts:
      - host.docker.internal:host-gateway
    environment:
      <<: *common-env
      NODE_ENV: production
      PORT: 3000
      HOSTNAME: 0.0.0.0
      ALLOW_ORIGIN: "*"
    labels:
      traefik.enable: true
      # Error pages
      traefik.http.middlewares.bolabaden-error-pages.errors.status: 400-599
      traefik.http.middlewares.bolabaden-error-pages.errors.service: bolabaden-nextjs@docker
      traefik.http.middlewares.bolabaden-error-pages.errors.query: /api/error/{status}
      # Router for bolabaden-nextjs
      traefik.http.routers.bolabaden-nextjs.service: bolabaden-nextjs@docker
      traefik.http.routers.bolabaden-nextjs.rule: 'Host(`${DOMAIN}`) || Host(`${TS_HOSTNAME}.${DOMAIN}`)'
      traefik.http.routers.bolabaden-nextjs.middlewares: bolabaden-error-pages@docker
      # bolabaden-nextjs Service definition
      traefik.http.services.bolabaden-nextjs.loadbalancer.server.port: 3000
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://127.0.0.1:$${PORT:-3000} > /dev/null 2>&1 || exit 1"]
      interval: 30s
      timeout: 10s
      start_period: 30s
    restart: always
  dozzle:
    # 🔹🔹 Dozzle 🔹🔹
    image: docker.io/amir20/dozzle:latest
    container_name: dozzle
    hostname: dozzle
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - publicnet
    expose:
      - 8080
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:z
    labels:
      traefik.enable: true
      traefik.http.routers.dozzle.rule: 'Host(`dozzle.${DOMAIN}`) || Host(`dozzle.${TS_HOSTNAME}.${DOMAIN}`)'
      traefik.http.routers.dozzle.middlewares: nginx-auth@docker
      traefik.http.services.dozzle.loadbalancer.server.port: 8080
      homepage.group: System Monitoring
      homepage.name: Dozzle
      homepage.icon: dozzle.png
      homepage.href: https://dozzle.${DOMAIN}/
      homepage.description: Real-time web UI for viewing Docker container logs across the host
    restart: always

  homepage:
    # 🔹🔹 Homepage 🔹🔹  # https://github.com/gethomepage/homepage
    image: ghcr.io/gethomepage/homepage
    container_name: homepage
    hostname: homepage
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - publicnet
    configs:
      - source: gethomepage-custom.css
        target: /app/config/custom.css
        mode: 0777
      - source: gethomepage-custom.js
        target: /app/config/custom.js
        mode: 0777
      - source: gethomepage-docker.yaml
        target: /app/config/docker.yaml
        mode: 0777
      - source: gethomepage-widgets.yaml
        target: /app/config/widgets.yaml
        mode: 0777
      - source: gethomepage-settings.yaml
        target: /app/config/settings.yaml
        mode: 0777
      - source: gethomepage-bookmarks.yaml
        target: /app/config/bookmarks.yaml
        mode: 0777
    volumes:
      # DO NOT create a bind mount to the entire /app/public/ directory.
      - /var/run/docker.sock:/var/run/docker.sock:z  # we don't need this since we use the proxy
      - ${CONFIG_PATH:-./configs}/homepage:/app/config
    environment:
      HOMEPAGE_ALLOWED_HOSTS: "*"
      HOMEPAGE_VAR_TITLE: "Bolabaden"
      HOMEPAGE_VAR_SEARCH_PROVIDER: "duckduckgo"
      HOMEPAGE_VAR_HEADER_STYLE: "glass"
      HOMEPAGE_VAR_THEME: "dark"
      HOMEPAGE_CUSTOM_CSS: "/app/config/custom.css"
      HOMEPAGE_CUSTOM_JS: "/app/config/custom.js"
      HOMEPAGE_VAR_WEATHER_CITY: "Iowa City"
      HOMEPAGE_VAR_WEATHER_LAT: 41.661129
      HOMEPAGE_VAR_WEATHER_LONG: -91.5302
      #      HOMEPAGE_VAR_WEATHER_TIME: ""
      HOMEPAGE_VAR_WEATHER_UNIT: fahrenheit
    labels:
      traefik.enable: true
      traefik.http.routers.homepage.rule: Host(`homepage.${DOMAIN}`) || Host(`homepage.${TS_HOSTNAME}.${DOMAIN}`)
      traefik.http.services.homepage.loadbalancer.server.port: 3000
    healthcheck:  # docker exec homepage ls -la /bin /usr/bin | grep -E 'curl|wget|nc|telnet|http|python|ncat|nmap'
      test: ["CMD-SHELL", "wget -qO- http://127.0.0.1:3000 > /dev/null 2>&1 || exit 1"]
      interval: 30s
      timeout: 15s
      retries: 3
    cpu_shares: 10
    mem_reservation: 128M
    deploy:
      resources:
        reservations:
          cpus: 0
          memory: 128M
        limits:
          cpus: 0.25
          memory: 1G
    restart: always

  watchtower:
    # 🔹🔹 Watchtower 🔹🔹
    image: docker.io/containrrr/watchtower:latest
    container_name: watchtower
    hostname: watchtower
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - publicnet
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
#      - ${CONFIG_PATH:-./configs}/watchtower/data:/data
    environment:
      WATCHTOWER_CLEANUP: ${WATCHTOWER_CLEANUP:-true}
      WATCHTOWER_SCHEDULE: ${WATCHTOWER_SCHEDULE:-0 0 6 * * *} # Run at 6am daily
      WATCHTOWER_NOTIFICATION_URL: ${WATCHTOWER_NOTIFICATION_URL:-}
      WATCHTOWER_NOTIFICATION_REPORT: ${WATCHTOWER_NOTIFICATION_REPORT:-true}
      WATCHTOWER_DEBUG: ${WATCHTOWER_DEBUG:-true}
      WATCHTOWER_LOG_LEVEL: ${WATCHTOWER_LOG_LEVEL:-debug}
      WATCHTOWER_NOTIFICATION_TEMPLATE: |
        {{- if .Report -}}
          {{- with .Report -}}
            {{- if ( or .Updated .Failed ) -}}
        {{len .Scanned}} Scanned, {{len .Updated}} Updated, {{len .Failed}} Failed
              {{- range .Updated}}
        - {{.Name}} ({{.ImageName}}): {{.CurrentImageID.ShortID}} updated to {{.LatestImageID.ShortID}}
              {{- end -}}
              {{- range .Skipped}}
        - {{.Name}} ({{.ImageName}}): {{.State}}: {{.Error}}
              {{- end -}}
              {{- range .Failed}}
        - {{.Name}} ({{.ImageName}}): {{.State}}: {{.Error}}
              {{- end -}}
            {{- end -}}
          {{- end -}}
        {{- else -}}
          {{range .Entries -}}{{.Message}}{{"\n"}}{{- end -}}
        {{- end -}}
    restart: always

  dockerproxy:
    # 🔹🔹 Docker Socket Proxy 🔹🔹
    image: docker.io/tecnativa/docker-socket-proxy:latest
    container_name: dockerproxy
    hostname: dockerproxy
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - publicnet
    privileged: true
    ports:
        - 127.0.0.1:2375:2375
    volumes:
        - /var/run/docker.sock:/var/run/docker.sock
    restart: always

  redis:
    # 🔹🔹 Redis 🔹🔹
    # NOTE: If you want to use Valkey (open source) instead of Redis (source available),
    # uncomment the Valkey statement and comment out the Redis statement.
    # Using Valkey with Firecrawl is untested and not guaranteed to work. Use with caution.
    image: docker.io/redis:alpine
    # image: valkey/valkey:alpine
    container_name: redis
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - backend
      - publicnet
    expose:
      - ${REDIS_PORT:-6379}
    ports:
      - 127.0.0.1:${REDIS_PORT:-6379}:${REDIS_PORT:-6379}
    volumes:
      - ${CONFIG_PATH:-./configs}/redis:/data
    environment:
      REDIS_HOST: ${REDIS_HOST:-redis}
      REDIS_PORT: ${REDIS_PORT:-6379}
      REDIS_DATABASE: ${REDIS_DATABASE:-0}
      REDIS_USERNAME: ${REDIS_USERNAME:-default}
      REDIS_PASSWORD: ${REDIS_PASSWORD:-redis}
    command: redis-server --appendonly yes --save 60 1 --bind 0.0.0.0 --port ${REDIS_PORT:-6379}
    labels:
      traefik.enable: true
      traefik.tcp.routers.redis.rule: HostSNI(`redis.${DOMAIN}`) || HostSNI(`redis.${TS_HOSTNAME}.${DOMAIN}`)
      traefik.tcp.routers.redis.service: redis@docker
      traefik.tcp.routers.redis.tls.domains[0].main: ${DOMAIN}
      traefik.tcp.routers.redis.tls.domains[0].sans: ${TS_HOSTNAME}.${DOMAIN},${TS_HOSTNAME}.${DOMAIN}
      traefik.tcp.routers.redis.tls.passthrough: true
      traefik.tcp.services.redis.loadbalancer.server.port: ${REDIS_PORT:-6379}
      traefik.tcp.services.redis.loadbalancer.server.tls: true
    healthcheck:
      test: ["CMD-SHELL", "redis-cli ping > /dev/null 2>&1 || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5
    cpu_shares: 10
    mem_reservation: 200M
    deploy:
      resources:
        reservations:
          cpus: 0
          memory: 200M
        limits:
          cpus: 0.5
          memory: 4G
    restart: always
  portainer:
    image: 'docker.io/portainer/portainer-ce:latest'
    container_name: portainer
    hostname: portainer
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - publicnet
    expose:
      - 8000
      - 9000
      - 9443
    ports:
      - 127.0.0.1:9443:9443
    volumes:
      - '/var/run/docker.sock:/var/run/docker.sock'
      - '${CONFIG_PATH:-./configs}/portainer/data:/data'
    labels:
      traefik.enable: true
      traefik.http.routers.portainer.service: portainer@docker
      traefik.http.routers.portainer.rule: Host(`portainer.${DOMAIN}`) || Host(`portainer.${TS_HOSTNAME}.${DOMAIN}`)
      traefik.http.services.portainer.loadbalancer.server.port: 9000
    restart: always
  rclone-init:
    depends_on:
      - rclone
    image: ghcr.io/coanghel/rclone-docker-automount/rclone-init:latest
    container_name: rclone-init
    hostname: rclone-init
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - backend
    configs:
      - source: rclone-mounts.json
        target: /app/mounts.json
        mode: 0400
    volumes:  # only used by the healthcheck.
      - /mnt/remote:/mnt/remote:rshared
    environment:
      RCLONE_USERNAME: brunner56
      RCLONE_PASSWORD: ${SUDO_PASSWORD}
      RCLONE_PORT: ${RCLONE_PORT:-5572}
      RCLONE_CONFIG_PATH: /config/rclone/rclone.conf
    healthcheck:
      test: ["CMD-SHELL", "mountpoint -q /mnt/remote/realdebrid"]
      interval: 5s
      timeout: 3s
      retries: 2
      start_period: 10s
    restart: always
  rclone:
    image: rclone/rclone:latest
    container_name: rclone
    hostname: rclone
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - backend
      - publicnet
    expose:
      - ${RCLONE_PORT:-5572}  # rclone webui
    ports:
      - 127.0.0.1:${RCLONE_PORT:-5572}:${RCLONE_PORT:-5572}
    configs:
      - source: rclone.conf
        target: /config/rclone/rclone.conf
        mode: 0400
    devices:
      - /dev/fuse:/dev/fuse:rwm
    cap_add:
      - SYS_ADMIN
    security_opt:
      - apparmor:unconfined
    volumes:
      - /:/hostfs:rshared
      - /etc/fuse.conf:/etc/fuse.conf:ro
      - /etc/group:/etc/group:ro
      - /etc/passwd:/etc/passwd:ro
      - /mnt/remote:/mnt/remote:rshared
      - ${CONFIG_PATH:-./configs}/rclone/.cache:/.cache
      - ${CONFIG_PATH:-./configs}/rclone/config/rclone:/config/rclone
      - ${CONFIG_PATH:-./configs}/rclonefm/js:/var/lib/rclonefm/js
    command:
      - rcd
      - --rc-web-gui
      - --rc-web-gui-no-open-browser
      - --rc-addr=:${RCLONE_PORT:-5572}
      - --log-level=DEBUG
      - --rc-user=brunner56
      - --rc-pass=${SUDO_PASSWORD}
      - --config=/config/rclone/rclone.conf
      - --cache-dir=/.cache/rclone
    labels:
      traefik.enable: true
      traefik.http.routers.rclone.rule: Host(`rclone.${DOMAIN}`) || Host(`rclone.${TS_HOSTNAME}.${DOMAIN}`)
      traefik.http.services.rclone.loadbalancer.server.port: ${RCLONE_PORT:-5572}
      homepage.group: Cloud
      homepage.name: Rclone
      homepage.icon: rclone.png
      homepage.href: https://rclone.${DOMAIN}/
      homepage.description: A web interface for Rclone.
      homepage.weight: 0
    cpu_shares: 10
    mem_reservation: 60M
    deploy:
      resources:
        reservations:
          cpus: 0
          memory: 60M
        limits:
          cpus: 1
          memory: 1G
    restart: always

```
please write a comprehensive, intuitive, implementing as much visual/metrics/graphs/whatever as possible compliant with an existing homelabs setup for:
- grafana
- prometheus

do web research to find existing comprehensive and exhaustive homelabs projects that create beautifuil and well-structured and comprehensive grafana/prometheus integrations with crowdsec/traefik/etc.

## Assistant

_Time: 2025-08-30T14:05:47.670Z_

Below is a comprehensive, intuitive setup for integrating Prometheus and Grafana into your homelab environment, based on the provided Docker Compose files. This setup is designed to be compliant with typical homelab configurations (e.g., focusing on resource efficiency, security, and visualization). It emphasizes rich visuals, metrics, and graphs by:

- **Collecting metrics** from key services like Traefik (e.g., request rates, errors, latencies), CrowdSec (e.g., decisions, acquisitions, bans), host/system (via Node Exporter), and Docker containers (via cAdvisor).
- **Alerting** on critical issues (e.g., high CPU, service downtime, high error rates in Traefik, unusual CrowdSec activity).
- **Visualizations in Grafana**: Provisioned datasources and dashboards for beautiful, well-structured overviews. I've drawn inspiration from exhaustive homelab projects researched via web searches, such as:
  - [vegasbrianc/docker-traefik-prometheus](https://github.com/vegasbrianc/docker-traefik-prometheus): Comprehensive Traefik + Prometheus + Grafana stack with dashboards for request metrics and errors.
  - [crowdsecurity/grafana-dashboards](https://github.com/crowdsecurity/grafana-dashboards): Official CrowdSec dashboards for decisions, acquisitions, and alerts.
  - [ruanbekker/monitoring-grafana-prometheus-local](https://github.com/ruanbekker/monitoring-grafana-prometheus-local): Homelab stack with Traefik, Prometheus, Grafana, cAdvisor, and Node Exporter for host/container metrics.
  - [haenno/traefik-docker-compose-grafana-prometheus-loki-promtail-portainer](https://github.com/haenno/traefik-docker-compose-grafana-prometheus-loki-promtail-portainer): Integrated logging/metrics with beautiful Grafana dashboards for Traefik and system health.
  - Community resources like [awesome-prometheus-alerts](https://samber.github.io/awesome-prometheus-alerts/rules.html) for alert rules, and Grafana dashboard IDs (e.g., 12230 for Traefik, from Grafana.com).

This setup adds two new services (Node Exporter and cAdvisor) for broader coverage. It updates your `prometheus.yml` and `alert.rules` configs, and provisions Grafana with a Prometheus datasource and pre-imported dashboards (via YAML and JSON mounts). Dashboards include graphs for:
- Traefik: Request volumes, error rates, latencies, upstream health.
- CrowdSec: Ban decisions, acquisition rates, parser/bucket metrics.
- System: CPU/memory/disk usage, network I/O.
- Docker: Container CPU/memory, uptime, resource saturation.

I've kept it concise yet thorough, assuming your existing paths (e.g., `${CONFIG_PATH:-./configs}`) and variables. Place new files in `${CONFIG_PATH}/grafana/provisioning` and `${CONFIG_PATH}/grafana/dashboards` on your host.

### Step 1: Add New Services to Docker Compose
Add these to your main `docker-compose.yml` under `services:` (in the second file you provided). They enable host and container metrics scraping.

```yaml
  node-exporter:
    image: prom/node-exporter:latest
    container_name: node-exporter
    hostname: node-exporter
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - publicnet
    expose:
      - 9100
    command:
      - '--path.rootfs=/host'
      - '--collector.filesystem.ignored-mount-points=^/(sys|proc|dev|host|etc)($$|/)'
    volumes:
      - /:/host:ro,rslave
    labels:
      traefik.enable: true
      traefik.http.routers.node-exporter.rule: Host(`node-exporter.${DOMAIN}`) || Host(`node-exporter.${TS_HOSTNAME}.${DOMAIN}`)
      traefik.http.services.node-exporter.loadbalancer.server.port: 9100
    restart: always

  cadvisor:
    image: gcr.io/cadadvisor/cadvisor:latest
    container_name: cadvisor
    hostname: cadvisor
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - publicnet
    expose:
      - 8080
    privileged: true
    volumes:
      - /:/rootfs:ro
      - /var/run:/var/run:ro
      - /sys:/sys:ro
      - /var/lib/docker/:/var/lib/docker:ro
      - /dev/disk/:/dev/disk:ro
    labels:
      traefik.enable: true
      traefik.http.routers.cadvisor.rule: Host(`cadvisor.${DOMAIN}`) || Host(`cadvisor.${TS_HOSTNAME}.${DOMAIN}`)
      traefik.http.services.cadvisor.loadbalancer.server.port: 8080
    restart: always
```

### Step 2: Update Prometheus Configs
Replace the `# TODO` placeholders in your `configs:` section.

#### prometheus.yml (Comprehensive Scrape Config)
This scrapes Prometheus itself, Node Exporter (host metrics), cAdvisor (containers), Traefik (on /metrics via port 8080), and CrowdSec (on /metrics via port 6060). Intervals are tuned for homelab efficiency.

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  scrape_timeout: 10s

rule_files:
  - /etc/prometheus/alert.rules

scrape_configs:
  - job_name: prometheus
    static_configs:
      - targets: ['localhost:9090']

  - job_name: node
    static_configs:
      - targets: ['node-exporter:9100']

  - job_name: cadvisor
    static_configs:
      - targets: ['cadvisor:8080']

  - job_name: traefik
    metrics_path: /metrics
    static_configs:
      - targets: ['traefik:8080']
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance
        replacement: traefik

  - job_name: crowdsec
    metrics_path: /metrics
    static_configs:
      - targets: ['crowdsec:6060']
    relabel_configs:
      - source_labels: [__address__]
        target_label: instance
        replacement: crowdsec
```

#### alert.rules (Example Rules)
Drawn from awesome-prometheus-alerts and homelab examples. Includes host alerts (CPU/disk), Traefik (high errors, downtime), CrowdSec (high bans, parser failures), and container alerts.

```yaml
groups:
- name: host
  rules:
  - alert: HighCpuLoad
    expr: 100 - (avg by(instance) (irate(node_cpu_seconds_total{mode="idle"}[5m])) * 100) > 80
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: High CPU load on {{ $labels.instance }}
      description: CPU load is > 80% (current value: {{ $value }}%)

  - alert: HighMemoryUsage
    expr: (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes * 100 > 85
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: High memory usage on {{ $labels.instance }}
      description: Memory usage > 85% (current value: {{ $value }}%)

  - alert: LowDiskSpace
    expr: (node_filesystem_avail_bytes{mountpoint="/"} / node_filesystem_size_bytes{mountpoint="/"} * 100) < 20
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: Low disk space on {{ $labels.instance }}
      description: Disk space < 20% (current value: {{ $value }}%)

- name: traefik
  rules:
  - alert: TraefikDown
    expr: up{job="traefik"} == 0
    for: 1m
    labels:
      severity: critical
    annotations:
      summary: Traefik instance down
      description: Traefik is not responding to Prometheus scrapes.

  - alert: HighTraefikErrorRate
    expr: rate(traefik_router_requests_total{code=~"5.."}[5m]) / rate(traefik_router_requests_total[5m]) > 0.05
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: High error rate in Traefik
      description: 5xx errors > 5% of requests (current rate: {{ $value }})

- name: crowdsec
  rules:
  - alert: HighCrowdsecBans
    expr: rate(cs_lapi_decisions_total[5m]) > 10
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: High ban decisions in CrowdSec
      description: Bans > 10 per 5m (current rate: {{ $value }})

  - alert: CrowdsecParserFailures
    expr: rate(cs_parser_failure_total[5m]) > 5
    for: 5m
    labels:
      severity: critical
    annotations:
      summary: High parser failures in CrowdSec
      description: Parser failures > 5 per 5m (current rate: {{ $value }})

- name: containers
  rules:
  - alert: ContainerHighCpu
    expr: sum(rate(container_cpu_usage_seconds_total[5m])) by (name) > 0.8
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: High CPU in container {{ $labels.name }}
      description: CPU > 80% (current value: {{ $value }})
```

### Step 3: Update Grafana Service for Provisioning
Update your `grafana:` service in Docker Compose to include provisioning volumes. Create the files on your host.

```yaml
  grafana:
    # ... (existing config)
    volumes:
      - ${CONFIG_PATH:-./configs}/grafana:/var/lib/grafana
      - ${CONFIG_PATH:-./configs}/grafana/provisioning/datasources:/etc/grafana/provisioning/datasources
      - ${CONFIG_PATH:-./configs}/grafana/provisioning/dashboards:/etc/grafana/provisioning/dashboards
      - ${CONFIG_PATH:-./configs}/grafana/dashboards:/var/lib/grafana/dashboards  # For JSON mounts
```

#### Grafana Provisioning Files
Create these in `${CONFIG_PATH}/grafana/provisioning/datasources/datasource.yml`:

```yaml
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
    jsonData:
      timeInterval: 15s
```

Create in `${CONFIG_PATH}/grafana/provisioning/dashboards/providers.yml`:

```yaml
apiVersion: 1
providers:
  - name: default
    orgId: 1
    folder: ''
    type: file
    disableDeletion: false
    updateIntervalSeconds: 10
    options:
      path: /var/lib/grafana/dashboards
```

#### Download and Mount Dashboards
Download JSON files to `${CONFIG_PATH}/grafana/dashboards` on your host (they'll auto-load in Grafana):
- **Traefik Dashboard**: Download from [Grafana.com ID 12230](https://grafana.com/grafana/dashboards/12230-traefik-2/) (beautiful graphs for requests, errors, latencies).
- **CrowdSec Dashboards**: From [crowdsecurity/grafana-dashboards](https://github.com/crowdsecurity/grafana-dashboards) – download `crowdsec-overview.json` and `crowdsec-details.json` (visuals for decisions, acquisitions, buckets).
- **Node Exporter (Host Metrics)**: Download from [Grafana.com ID 1860](https://grafana.com/grafana/dashboards/1860-node-exporter-full/) (CPU/memory/disk/network graphs).
- **cAdvisor (Containers)**: Download from [Grafana.com ID 14282](https://grafana.com/grafana/dashboards/14282-cadvisor-exporter/) (per-container metrics with heatmaps and timeseries).

### Step 4: Usage and Customization
- Restart services: `docker compose up -d`.
- Access Grafana at `https://grafana.${DOMAIN}` (login: admin/admin, change password).
- Dashboards auto-appear under "General" folder. Customize panels for more visuals (e.g., add gauges for CPU, heatmaps for Traefik latencies).
- Alerts: View in Grafana's Alerting section; integrate notifications (e.g., via email/Slack) in Grafana config.
- For more: Add Loki/Promtail for logs (inspired by haenno's repo) or Telegraf for advanced inputs.

This setup is resource-light, visually rich, and extensible for your homelab. If needed, expand with more dashboards from Grafana.com.

## User

_Time: 2025-08-30T14:19:14.242Z_

ok let me clarify the task. Please exclusively find existing comprehensive dashboards that I can simply import, do not write custom stuff plase exclusively link me to the most comprehensive and popular and exhaustive dashboards for crowdsec/traefik/prometheus and other homelabs. Provide the **top 10**

## Assistant

_Time: 2025-08-30T14:21:03.211Z_

### Top 10 Comprehensive and Popular Grafana Dashboards for CrowdSec, Traefik, Prometheus, and Homelab Monitoring

Based on extensive web searches and analysis of Grafana's official repository, community forums, and relevant GitHub projects, the following represent the top 10 most comprehensive, popular, and exhaustive existing Grafana dashboards suitable for homelab environments. These were selected prioritizing download counts, community mentions (e.g., on Reddit and YouTube), official endorsements, and exhaustiveness in covering metrics such as request handling, security decisions, system resources, and container performance. All are readily importable via Grafana's dashboard import feature using their IDs or JSON files. Popularity is inferred from high engagement metrics like views, likes, and references in homelab guides.

1. **Traefik Dashboard (ID: 4475)**  
   Link: https://grafana.com/grafana/dashboards/4475-traefik/  
   Description: A highly downloaded dashboard for monitoring Traefik as a reverse proxy, featuring exhaustive graphs for request rates, error codes, latencies, and upstream health. Popular in homelab setups for its integration with Prometheus.

2. **Traefik Official Standalone Dashboard (ID: 17346)**  
   Link: https://grafana.com/grafana/dashboards/17346-traefik-official-standalone-dashboard/  
   Description: Officially maintained by Traefik, this comprehensive dashboard uses native Prometheus metrics to visualize entrypoints, services, and datasources. It includes filters for detailed analysis and is widely referenced in homelab monitoring tutorials.

3. **CrowdSec Overview Dashboard**  
   Link: https://github.com/crowdsecurity/grafana-dashboards/blob/main/crowdsec-overview.json (Import JSON directly into Grafana)  
   Description: Official CrowdSec dashboard providing exhaustive insights into acquisitions, decisions, bans, and parser metrics. Popular for security-focused homelabs, with high engagement in YouTube guides and Reddit discussions.

4. **CrowdSec Cyber Threat Insights Dashboard (ID: 21689)**  
   Link: https://grafana.com/grafana/dashboards/21689 (Reference via community articles; import by ID)  
   Description: A detailed dashboard for visualizing CrowdSec threat data, including geoIP maps, ASN origins, attack scenarios, and ban trends. Exhaustive for cyber threat monitoring, as highlighted in blogs and VictoriaMetrics integrations.

5. **Node Exporter Full Dashboard (ID: 1860)**  
   Link: https://grafana.com/grafana/dashboards/1860-node-exporter-full/  
   Description: One of the most popular homelab dashboards for Prometheus-based host monitoring, offering comprehensive graphs for CPU, memory, disk, network, and filesystem metrics. Frequently used in Reddit homelab shares.

6. **cAdvisor Exporter Dashboard (ID: 14282)**  
   Link: https://grafana.com/grafana/dashboards/14282-cadvisor-exporter/  
   Description: Exhaustive for Docker container monitoring in homelabs, with visuals for CPU, memory, network I/O, and resource saturation per container. High download counts and integration with Prometheus stacks.

7. **Homelab Grafana Dashboard v3.0**  
   Link: https://www.reddit.com/r/homelab/comments/vj7iyh/my_updated_homelab_grafana_dashboard_now_version/ (Export and import JSON from community share)  
   Description: A community-favorite exhaustive homelab overview dashboard, incorporating Prometheus metrics for host stats, web services, network, and Docker. Updated with modern features, garnering significant Reddit upvotes.

8. **Proxmox Grafana Dashboard**  
   Link: https://www.simplehomelab.com/proxmox-grafana-dashboard/ (Includes importable JSON via InfluxDB/Prometheus setup)  
   Description: Comprehensive for Proxmox homelab monitoring, visualizing resource usage, VM stats, and alerts. Popular in homelab blogs for its detailed graphs and Prometheus compatibility.

9. **Host Stats, Web Services, and Network Dashboard**  
   Link: https://community.learnlinux.tv/t/grafana-dashboards-for-host-stats-web-services-and-network-homescreen/1210 (Shared JSON available in thread)  
   Description: Exhaustive multi-panel dashboard for homelab system monitoring, covering host metrics, web service performance, and network I/O via Prometheus. Well-regarded in Linux communities for its structured visuals.

10. **Prometheus Monitoring Dashboard Showcase (Various IDs, e.g., for GitHub/Home Energy)**  
    Link: https://grafana.com/blog/2021/06/22/grafana-dashboard-showcase-visualizations-for-prometheus-home-energy-usage-github-and-more/ (Collection with importable IDs like 12230 for Traefik extensions)  
    Description: A curated collection of popular Prometheus-integrated dashboards for homelabs, including exhaustive visuals for metrics like energy usage and GitHub activity. High visibility from Grafana's official blog.
