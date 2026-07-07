---
source_url: "https://grok.com/c/65af86b5-b1fc-49a9-9ffa-2ce372053cdd"
conversation_id: "65af86b5-b1fc-49a9-9ffa-2ce372053cdd"
title: "Migrating to Caddy with CrowdSec Integration"
extracted_at: "2026-06-29T16:23:08.532Z"
message_count: 3
export_suite: "identity"
provenance: grok-rest-api
---

# Migrating to Caddy with CrowdSec Integration

Source: [Grok conversation](https://grok.com/c/65af86b5-b1fc-49a9-9ffa-2ce372053cdd)

## User

_Time: 2025-08-30T17:43:32.207Z_

exhaustively and comprehensively rewrite all of this to use Caddy, not traefik.
 
must have:

* crowdsec integration

* all middlewares intact and 1:1 (crowdsec may be different and that's fine)

* if possible, remove nginx-traefik-extensions and rewrite the nginx.conf shown in pure Caddy syntax.

* Ensure you setup the thingamajig that does the caddy docker label parsing, whatever that's called.

* Must reuse the existing acme.json

## Assistant

_Time: 2025-08-30T17:44:03.527Z_



## User

_Time: 2025-08-30T17:44:17.833Z_

exhaustively and comprehensively rewrite all of this to use Caddy, not traefik.
 
must have:

* crowdsec integration

* all middlewares intact and 1:1 (crowdsec may be different and that's fine)

* if possible, remove nginx-traefik-extensions and rewrite the nginx.conf shown in pure Caddy syntax.

* Ensure you setup the thingamajig that does the caddy docker label parsing, whatever that's called.

* Must reuse the existing acme.json

```
# yaml-language-server: $schema=https://raw.githubusercontent.com/compose-spec/compose-spec/master/schema/compose-spec.json

volumes:
  caddy_data:
  caddy_config:


secrets:
  premiumize-auth:
    file: ${CONFIG_DIR:-./configs}/premiumize-auth.txt


configs:
  crowdsec-victoriametrics.yaml:
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
      url: http://victoriametrics:${VICTORIAMETRICS_PORT:-8428}/api/v1/import
      method: POST
      headers:
        Content-Type: application/json
        # if you use vmauth as proxy, please uncomment next line and add your token
        # If you would like to add authentication, please read about vmauth.
        # https://docs.victoriametrics.com/victoriametrics/vmauth/?ref=blog.lrvt.de#bearer-token-auth-proxy
        # It's basically another Docker container service, which acts as proxy in front of VictoriaMetrics and enforces Bearer HTTP Authentication.
        # Authorization: "${VICTORIAMETRICS_AUTH_TOKEN:-}"
  crowdsec-profiles.yaml:
    # If you are already using other custom notification channels, make sure to only add `http_victoriametrics` to the mix.
    # Your already existing notification channels should remain unchanged.
    content: |
      name: default_ip_remediation
      #debug: true
      filters:
      - Alert.Remediation == true && Alert.GetScope() == "Ip"
      decisions:
      - type: ban
        duration: 4h
      #duration_expr: Sprintf('%dh', (GetDecisionsCount(Alert.GetValue()) + 1) * 4)
      notifications:
      - http_victoriametrics  # Required: Add this to your notifications
      on_success: break
      ---
      name: default_range_remediation
      #debug: true
      filters:
      - Alert.Remediation == true && Alert.GetScope() == "Range"
      decisions:
      - type: ban
        duration: 4h
      #duration_expr: Sprintf('%dh', (GetDecisionsCount(Alert.GetValue()) + 1) * 4)
      notifications:
      - http_victoriametrics  # Required: Add this to your notifications if you are using VictoriaMetrics as a notification channel
      on_success: break
  crowdsec-appsec.yaml:
    content: |
      appsec_config: crowdsecurity/appsec-default
      labels:
        type: appsec
      listen_addr: 0.0.0.0:${CROWDSEC_APPSEC_PORT:-7422}
      source: appsec
  crowdsec-acquis.yaml:
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
  labels-config.yaml:
    content: |
      labels:
        redis:
          url: redis://default:${REDIS_PASSWORD:-redis}@redis:6379/0  # Required: Secure Redis URL (adjust host, port, DB, and credentials to match your added Redis service; use 'redis://' for non-TLS)
      #  webhook:
      #    url: https://example.webhook.endpoint/v1/events  # Optional: Webhook URL for notifications on container events or polls (e.g., integrate with monitoring like Uptime Kuma or ShoutRRR in your setup)
      #    auth:
      #      basic: username:$WEBHOOK_PASSWORD  # Optional: Basic auth credentials for the webhook; omit if no auth needed
        nodes:
          - $DOMAIN  # Required: List of Docker node FQDNs or IPs to monitor; derived from your Caddyfile backends (adjust to actual resolvable FQDNs or IPs)
          - micklethefickle.$DOMAIN  # Required: List of Docker node FQDNs or IPs to monitor; derived from your Caddyfile backends (adjust to actual resolvable FQDNs or IPs)
          - beatapostapita.$DOMAIN
          - vractormania.$DOMAIN
          - arnialtrashlid.$DOMAIN
          - cloudserver1.$DOMAIN
          - cloudserver2.$DOMAIN
          - cloudserver3.$DOMAIN
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
        # Matcher for wildcard domains (assumes all incoming Hosts are *.$DOMAIN from Traefik)
        @wildcard host *.$DOMAIN
        handle @wildcard {
          reverse_proxy {
            # Load balance to the seven backends, preserving subdomain ({label1} = foo in foo.bolabaden.org)
            to {label1}.micklethefickle.$DOMAIN:443
            to {label1}.beatapostapita.$DOMAIN:443
            to {label1}.vractormania.$DOMAIN:443
            to {label1}.arnialtrashlid.$DOMAIN:443
            to {label1}.cloudserver1.$DOMAIN:443
            to {label1}.cloudserver2.$DOMAIN:443
            to {label1}.cloudserver3.$DOMAIN:443

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
            rule: Host(`{{ $$name }}.$DOMAIN`)
          {{ $$name }}-direct:
            service: {{ $$name }}-direct@file
            rule: Host(`{{ $$name }}.$TS_HOSTNAME.$DOMAIN`)
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
                - url: https://{{ $$name }}.micklethefickle.$DOMAIN
                - url: https://{{ $$name }}.beatapostapita.$DOMAIN
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
        #  catchall:
        #    entryPoints:  # Do NOT remove, doing so breaks traefik and traefik does NOT report an error!
        #      - web
        #      - websecure
        #    service: noop@internal
        #    rule: Host(`$DOMAIN`) || Host(`$TS_HOSTNAME.$DOMAIN`) || HostRegexp(`^(.+)$$`)
        #    priority: 0
        #    middlewares:
        #      - http-to-https-redirect-simple@file
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
              status:
                - 400-599
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
              replacement: '$$1://$$2'
              permanent: false
          http-to-https-redirect-simple:
            redirectScheme:
              scheme: https
              permanent: false
          crowdsec:
            plugin:
              bouncer:
                # Enable the plugin (default: false)
                enabled: ${CROWDSEC_BOUNCER_ENABLED:-false}

                # Log level (default: INFO, expected: INFO, DEBUG, ERROR)
                logLevel: ${CROWDSEC_BOUNCER_LOG_LEVEL:-INFO}

                # File path to write logs (default: "")
                logFilePath: ${CROWDSEC_BOUNCER_LOG_FILE_PATH:-""}

                # Interval in seconds between metrics updates to Crowdsec (default: 600, <=0 disables metrics)
                metricsUpdateIntervalSeconds: ${CROWDSEC_BOUNCER_METRICS_UPDATE_INTERVAL_SECONDS:-600}

                # Mode for Crowdsec integration (default: live, expected: none, live, stream, alone, appsec)
                crowdsecMode: ${CROWDSEC_BOUNCER_MODE:-live}

                # Enable Crowdsec Appsec Server (WAF) (default: false)
                crowdsecAppsecEnabled: ${CROWDSEC_APPSEC_ENABLED:-false}

                # Crowdsec Appsec Server host and port (default: "crowdsec:7422")
                crowdsecAppsecHost: ${CROWDSEC_APPSEC_HOST:-crowdsec:7422}

                # Crowdsec Appsec Server path (default: "/")
                crowdsecAppsecPath: ${CROWDSEC_APPSEC_PATH:-/}

                # Block request when Crowdsec Appsec Server returns 500 (default: true)
                crowdsecAppsecFailureBlock: ${CROWDSEC_APPSEC_FAILURE_BLOCK:-true}

                # Block request when Crowdsec Appsec Server is unreachable (default: true)
                crowdsecAppsecUnreachableBlock: ${CROWDSEC_APPSEC_UNREACHABLE_BLOCK:-true}

                # Transmit only the first number of bytes to Crowdsec Appsec Server (default: 10485760 = 10MB)
                crowdsecAppsecBodyLimit: ${CROWDSEC_APPSEC_BODY_LIMIT:-10485760}

                # Scheme for Crowdsec LAPI (default: http, expected: http, https)
                crowdsecLapiScheme: ${CROWDSEC_LAPI_SCHEME:-http}

                # Crowdsec LAPI host and port (default: "crowdsec:8080")
                crowdsecLapiHost: ${CROWDSEC_LAPI_HOST:-crowdsec:8080}

                # Crowdsec LAPI path (default: "/")
                crowdsecLapiPath: ${CROWDSEC_LAPI_PATH:-/}

                # Crowdsec LAPI key for the bouncer (default: "")
                crowdsecLapiKey: ${CROWDSEC_LAPI_KEY:-""}

                # Disable TLS verification for Crowdsec LAPI (default: false)
                crowdsecLapiTlsInsecureVerify: ${CROWDSEC_LAPI_TLS_INSECURE_VERIFY:-false}

                # PEM-encoded CA for Crowdsec LAPI (default: "")
                crowdsecLapiTlsCertificateAuthority: ${CROWDSEC_LAPI_TLS_CA:-""}

                # PEM-encoded client certificate for the Bouncer (default: "")
                crowdsecLapiTlsCertificateBouncer: ${CROWDSEC_LAPI_TLS_CERT:-""}

                # PEM-encoded client key for the Bouncer (default: "")
                crowdsecLapiTlsCertificateBouncerKey: ${CROWDSEC_LAPI_TLS_KEY:-""}

                # Name of the header in response when requests are cancelled (default: "")
                remediationHeadersCustomName: ${CROWDSEC_BOUNCER_REMEDIATION_HEADER_NAME:-""}

                # Name of the header where real client IP is retrieved (default: "X-Forwarded-For")
                forwardedHeadersCustomName: ${CROWDSEC_BOUNCER_FORWARDED_HEADER_NAME:-X-Forwarded-For}      

                # Enable Redis cache (default: false)
                redisCacheEnabled: ${CROWDSEC_BOUNCER_REDIS_ENABLED:-false}

                # Redis hostname and port (default: "redis:6379")
                redisCacheHost: ${CROWDSEC_BOUNCER_REDIS_HOST:-redis:6379}

                # Redis password (default: "")
                redisCachePassword: ${CROWDSEC_BOUNCER_REDIS_PASSWORD:-""}

                # Redis database selection (default: "")
                redisCacheDatabase: ${CROWDSEC_BOUNCER_REDIS_DB:-""}

                # Block request when Redis is unreachable (default: true, adds 1s delay)
                redisCacheUnreachableBlock: ${CROWDSEC_BOUNCER_REDIS_UNREACHABLE_BLOCK:-true}

                # Default timeout in seconds for contacting Crowdsec LAPI (default: 10)
                httpTimeoutSeconds: ${CROWDSEC_BOUNCER_HTTP_TIMEOUT_SECONDS:-10}

                # Interval between LAPI fetches in stream mode (default: 60)
                updateIntervalSeconds: ${CROWDSEC_BOUNCER_UPDATE_INTERVAL_SECONDS:-60}

                # Max failures before blocking traffic in stream/alone mode (default: 0, -1 = never block)
                updateMaxFailure: ${CROWDSEC_BOUNCER_UPDATE_MAX_FAILURE:-0}

                # Maximum decision duration in live mode (default: 60)
                defaultDecisionSeconds: ${CROWDSEC_BOUNCER_DEFAULT_DECISION_SECONDS:-60}

                # HTTP status code for banned user (default: 403)
                remediationStatusCode: ${CROWDSEC_BOUNCER_REMEDIATION_STATUS_CODE:-403}

                # CAPI Machine ID (used only in alone mode)
                crowdsecCapiMachineId: ${CROWDSEC_CAPI_MACHINE_ID:-""}

                # CAPI Password (used only in alone mode)
                crowdsecCapiPassword: ${CROWDSEC_CAPI_PASSWORD:-""}

                # CAPI Scenarios (used only in alone mode)
                crowdsecCapiScenarios: ${CROWDSEC_CAPI_SCENARIOS:-[]}

                # Captcha provider (expected: hcaptcha, recaptcha, turnstile)
                captchaProvider: ${CROWDSEC_BOUNCER_CAPTCHA_PROVIDER:-""}

                # Captcha site key
                captchaSiteKey: ${CROWDSEC_BOUNCER_CAPTCHA_SITE_KEY:-""}

                # Captcha secret key
                captchaSecretKey: ${CROWDSEC_BOUNCER_CAPTCHA_SECRET_KEY:-""}

                # Grace period after captcha validation before revalidation required (default: 1800s = 30m)
                captchaGracePeriodSeconds: ${CROWDSEC_BOUNCER_CAPTCHA_GRACE_PERIOD_SECONDS:-1800}

                # Path to captcha template (default: /captcha.html)
                captchaHTMLFilePath: ${CROWDSEC_BOUNCER_CAPTCHA_HTML_FILE_PATH:-/captcha.html}

                # Path to ban HTML file (default: "", disabled if empty)
                banHTMLFilePath: ${CROWDSEC_BOUNCER_BAN_HTML_FILE_PATH:-""}

                # List of trusted proxies in front of Traefik (default: [])
                forwardedHeadersTrustedIPs: &trustedIps
                  - "10.0.0.0/8"
                  - "100.64.0.0/10"
                  - "127.0.0.0/8"
                  - "169.254.0.0/16"
                  - "172.16.0.0/12"
                  - "192.168.0.0/16"
                  - "::1/128"      
                  - "2002::/16"
                  - "fc00::/7"
                  - "fe80::/10"

                # List of client IPs to trust (default: [])
                clientTrustedIPs: *trustedIps
  traefik_logrotate_tail.sh:
    content: |
      #!/bin/sh

      TRAEFIK_LOG_DIR=$${1:-/var/log/traefik}
      apk add --no-cache logrotate findutils coreutils jq &&
      mkdir -p /etc/logrotate.d &&
      cat > /etc/logrotate.d/traefik << "EOF"
      $$TRAEFIK_LOG_DIR/*.log {
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
              TOTAL_SIZE=$$(du -sm $$TRAEFIK_LOG_DIR | cut -f1)
              if [ $$TOTAL_SIZE -gt 50 ]; then
                  find $$TRAEFIK_LOG_DIR -name "*.gz" -type f -printf "%T@ %p\n" | sort -n | head -n -10 | cut -d" " -f2- | xargs rm -f
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
      while [ ! -f $$TRAEFIK_LOG_DIR/traefik.log ]; do
        sleep 5
      done
      
      echo "Starting to tail traefik.log in human-readable format..."
      while true; do
        # Use tail -F to follow across rotations, stdbuf for line buffering, jq for JSON parsing
        stdbuf -oL -eL tail -n 200 -F $$TRAEFIK_LOG_DIR/traefik.log | \
        while read -r line; do
          if [ -z "$$line" ]; then continue; fi
          case "$$line" in
            '{'*)
              # Parse log line and output fields separated by tabs
              parsed_line=$$(
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
                resolved_addr="$$resolved_addr$$port_part"
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
                  color="\033[1;$$color_codem"
                  ;;
              esac
              # Print the line with only the timestamp and status code colored
              echo "$$parsed_line" | awk -F"\t" -v color="$$color" -v reset="\033[0m" '
                {
                  # Color timestamp ($$1) and status code ($$2), rest uncolored
                  printf "%s%-19s%s | %s%-3s%s | %-18s | %-25s | %-21s | %-8s | %s\n", \
                    color, $$1, reset, color, $$2, reset, $$3, $$4, $$5, $$6, $$7;
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

          # Logging format with auth details
          log_format main '$$remote_addr - $$remote_user [$$time_local] "$$request" '
                          '$$status $$body_bytes_sent "$$http_referer" '
                          '"$$http_user_agent" "$$http_x_forwarded_for" '
                          'auth_method="$$auth_method" original_uri="$$http_x_original_uri" '
                          'middleware="$$middleware_name"';

          limit_req_status 429;  # Optional: return 429 instead of default 503 so your 429 error_page is used
          access_log /var/log/nginx/access.log main;

          # Basic settings
          sendfile on;
          tcp_nopush on;
          tcp_nodelay on;
          keepalive_timeout 65;
          types_hash_max_size 2048;
          server_tokens off;
          
          # Fix for long API keys in map module
          map_hash_bucket_size 128;

          limit_req_zone $$binary_remote_addr zone=auth:10m rate=10r/s;

          # Local IPs (for use behind traefik)
          # These must match the geo module ranges below
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
          #set_real_ip_from 152.117.108.32/32; # specific whitelisted IP
          real_ip_header X-Forwarded-For;
          real_ip_recursive on;

          # IP Whitelist using geo module
          # These must match the set_real_ip_from ranges above
          geo $$ip_whitelisted {
              default 0;
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
              152.117.108.32/32    1; # specific whitelisted IP
              203.0.113.0/24       1;
              224.0.0.0/4          1;
              240.0.0.0/4          1;
              2002::/16            1;
              fc00::/7             1;
              fd00::/8             1;
              fe80::/10            1;
              ::1/128              1;
          }

          # Upstream for tinyauth
          upstream tinyauth {
              server tinyauth:3000;
          }

          # API Keys list (easier to manage)
          map $$http_x_api_key $$api_key_valid {
              default 0;
              
              # Valid API keys
              "${NGINX_AUTH_API_KEY:-sk_IQys9kpENSiYY8lFuCslok3PauKBRSzeGprmvPfiMWAM9neeXoSqCZW7pMlWKbqPrwtF33kh1F73vf7D4PBpVfZJ1reHEL8d6ny6J03Ho}" 1;
              # Add more API keys here as needed
          }

          # Authentication Server
          server {
              listen 80 default_server;
              server_name _;

              # Variables for authentication (geo and map modules set $$ip_whitelisted and $$api_key_valid)
              set $$auth_passed 0;
              set $$auth_method "none";
              set $$middleware_name "unknown";

              # Step 1: Check API key authentication (handled by map module)
              if ($$api_key_valid = 1) {
                  set $$auth_passed 1;
                  set $$auth_method "api_key";
              }

              # Step 2: Check IP whitelist (handled by geo module)
              if ($$ip_whitelisted = 1) {
                  set $$auth_passed 1;
                  set $$auth_method "ip_whitelist";
              }

              # ========================================
              # MAIN AUTH ENDPOINT: API key OR IP whitelist OR tinyauth
              # ========================================
              location /auth {
                  set $$middleware_name "auth";
                  
                  # Rate limiting for auth requests
                  limit_req zone=auth burst=20 nodelay;

                  # If API key or IP whitelist passed, return success immediately
                  if ($$auth_passed = 1) {
                      add_header X-Auth-Method "$$auth_method" always;
                      add_header X-Auth-Passed "true" always;
                      add_header X-Middleware-Name "$$middleware_name" always;
                      return 200 "OK";
                  }

                  # If neither API key nor IP whitelist passed, proxy to tinyauth
                  proxy_pass http://tinyauth/api/auth/traefik;
                  proxy_pass_request_body off;
                  proxy_set_header Content-Length "";
                  proxy_set_header X-Original-URI $$http_x_original_uri;
                  proxy_set_header X-Original-Method $$http_x_original_method;
                  proxy_set_header X-Real-IP $$remote_addr;
                  proxy_set_header X-Forwarded-For $$proxy_add_x_forwarded_for;
                  proxy_set_header X-Forwarded-Proto $$scheme;
                  proxy_set_header X-Forwarded-Host $$http_x_forwarded_host;
                  
                  # Add custom headers to indicate tinyauth was used
                  add_header X-Auth-Method "tinyauth" always;
                  add_header X-Middleware-Name "$$middleware_name" always;
                  
                  # Log the auth decision
                  access_log /var/log/nginx/auth.log main;
              }

              # Health check endpoint
              location /health {
                  access_log off;
                  return 200 "nginx multi-middleware service healthy\n";
                  add_header Content-Type text/plain;
              }

              # Default location for any other requests
              location / {
                  return 404 '{
                      "error": "Not found", 
                      "hint": "Only /auth and /health endpoints are available",
                      "available_endpoints": ["/auth", "/health"]
                  }';
                  add_header Content-Type application/json;
              }

              # Custom error pages for auth failures
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
      #CLOUDFLARE_WAF_LIST_TOKEN: $CLOUDFLARE_WAF_LIST_TOKEN  # Your Cloudflare WAF list token

      # The value of DOMAINS should be a list of fully qualified domain names (FQDNs) separated by commas.
      # For example, DOMAINS=example.org,www.example.org,example.io instructs the updater to manage the domains example.org, www.example.org, and example.io.
      # These domains do not have to share the same DNS zone---the updater will take care of the DNS zones behind the scene.
      DOMAINS: '$TS_HOSTNAME.$DOMAIN,*.$TS_HOSTNAME.$DOMAIN'  # Your domains (separated by commas)

      # PROXIED=true enables Cloudflare proxying (caches webpages, hides your IP).
      # Remove PROXIED=true to expose your real IP or if your traffic isn't HTTP(S).
      # Default: false. Accepts any boolean (true, false, 0, 1).
      # Advanced: PROXIED can be a domain-based boolean expression, e.g.:
      #   PROXIED=is(example.org)           # only example.org proxied
      #   PROXIED=sub(example.org)          # only subdomains of example.org proxied
      #   PROXIED=!is(example.org)          # all except example.org proxied
      #   PROXIED=is(a.org)||is(b.org)      # only a.org and b.org proxied
      # See https://pkg.go.dev/strconv#ParseBool for more advanced usage.
      PROXIED: is($DOMAIN)||is(*.$DOMAIN)

      # The time-to-live (TTL) (in seconds) of new DNS records.
      # Default is 1, meaning 'automatic' in CloudFlare.
      TTL: 1

      # The comment of new DNS records.
      RECORD_COMMENT: 'Updated by Cloudflare DDNS on server `$TS_HOSTNAME.$DOMAIN`'

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
      #UPTIMEKUMA: 'https://uptimekuma.$DOMAIN/push/1234567890'

      # Newline-separated [shoutrrr URLs](https://containrrr.dev/shoutrrr/latest/services/overview/) to which the updater sends notifications of IP address changes and other events.
      # Each shoutrrr URL represents a notification service; for example, discord://<token>@<id> means sending messages to Discord.
      # See https://github.com/containrrr/shoutrrr for more information.
      #SHOUTRRR: discord://$SHOUTRRR_DISCORD_TOKEN@$SHOUTRRR_DISCORD_CHANNEL_ID

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
      APP_URL: ${TINYAUTH_APP_URL:-https://auth.$DOMAIN}
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
      APP_TITLE: ${TINYAUTH_APP_TITLE:-$DOMAIN} # Customize login page title
      LOGIN_MAX_RETRIES: ${TINYAUTH_LOGIN_MAX_RETRIES:-15} # Maximum login attempts before account lockout
      LOGIN_TIMEOUT: ${TINYAUTH_LOGIN_TIMEOUT:-300} # Lock account for 5 minutes after too many failed attempts
      OAUTH_AUTO_REDIRECT: ${TINYAUTH_OAUTH_AUTO_REDIRECT:-none} # Options: none, github, google, or generic
      # Uncomment below if you want to restrict OAuth login to specific users
      OAUTH_WHITELIST: ${TINYAUTH_OAUTH_WHITELIST:-boden.crouch@gmail.com,halomastar@gmail.com,athenajaguiar@gmail.com,dgorsch2@gmail.com,dgorsch4@gmail.com}  # e.g. user1,user2,/^admin.>
    labels:
      traefik.enable: true
      traefik.http.routers.tinyauth.rule: Host(`auth.$DOMAIN`) || Host(`auth.$TS_HOSTNAME.$DOMAIN`)
      traefik.http.middlewares.tinyauth.forwardAuth.address: http://auth:3000/api/auth/traefik
      homepage.group: Security
      homepage.name: TinyAuth
      homepage.icon: https://tinyauth.app/img/logo.png
      homepage.href: https://auth.$DOMAIN/
      homepage.description: Centralized login service (email, Google, GitHub) used by Traefik auth middleware and apps
    restart: always
  crowdsec:
    # 🔹🔹 CrowdSec 🔹🔹
    # Highly recommend this guide: https://blog.lrvt.de/configuring-crowdsec-with-traefik/
    depends_on:
      - victoriametrics
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
      - source: crowdsec-acquis.yaml
        target: /etc/crowdsec/acquis.yaml
        mode: 0400
      - source: crowdsec-victoriametrics.yaml
        target: /etc/crowdsec/notifications/victoriametrics.yaml
        mode: 0400
      - source: crowdsec-profiles.yaml
        target: /etc/crowdsec/profiles.yaml
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
      homepage.group: Security
      homepage.name: CrowdSec
      homepage.icon: crowdsec.png
      homepage.href: https://crowdsec.$DOMAIN/
      homepage.description: Behavioral security engine and WAF; Traefik bouncer blocks abusive IPs and bad traffic
      homepage.widget.type: crowdsec
      homepage.widget.url: http://crowdsec:${CROWDSEC_LAPI_PORT:-8080}
      homepage.widget.username: ${CROWDSEC_MACHINE_ID:-localhost}  # machine_id in crowdsec
      homepage.widget.password: $CROWDSEC_MACHINE_PASSWORD
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
      traefik.http.routers.whoami.rule: Host(`whoami.$DOMAIN`) || Host(`whoami.$TS_HOSTNAME.$DOMAIN`)
      traefik.http.routers.whoami.service: whoami@docker
      traefik.http.services.whoami.loadBalancer.server.port: 80
#      traefik.http.routers.whoami.middlewares: legalbar@file
#      traefik.http.middlewares.legalbar.plugin.bodyreplace.replacements[0].search: </body>
#      traefik.http.middlewares.legalbar.plugin.bodyreplace.replacements[0].replace: <div style='position:fixed;bottom:0;width:100%;background:#222;color:#fff;text-align:center;padding:6px;font-size:14px;z-index:9999;'><a href="https://$DOMAIN/privacy-policy" style="color:#fff;margin:0 10px;">Privacy Policy</a> | <a href="https://$DOMAIN/terms" style="color:#fff;margin:0 10px;">Terms</a> | <a href="https://$DOMAIN/cookies-policy" style="color:#fff;margin:0 10px;">Cookies Policy</a> — © $DOMAIN</div></body>
      homepage.group: Web Services
      homepage.name: whoami
      homepage.icon: whoami.png
      homepage.href: https://whoami.$DOMAIN
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
      - '--entryPoints.websecure.http.tls.domains[0].main=$DOMAIN'
      - '--entryPoints.websecure.http.tls.domains[0].sans=*.$DOMAIN,*.$TS_HOSTNAME.$DOMAIN'
      - '--entryPoints.websecure.http2.maxConcurrentStreams=250'
      - '--entryPoints.websecure.http3'
      - '--global.checkNewVersion=true'
      - '--global.sendAnonymousUsage=false'
      - '--log.level=INFO'
      - '--ping=true'
      - '--providers.docker=true'
    #  - '--providers.docker.network=publicnet'
      - '--providers.docker.defaultRule=Host(`{{ normalize .ContainerName }}.$DOMAIN`) || Host(`{{ normalize .ContainerName }}.$TS_HOSTNAME.$DOMAIN`) || Host(`{{ normalize .Name }}.$DOMAIN`) || Host(`{{ normalize .Name }}.$TS_HOSTNAME.$DOMAIN`)'
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
      traefik.http.routers.traefik.rule: Host(`traefik.$DOMAIN`) || Host(`traefik.$TS_HOSTNAME.$DOMAIN`)
      traefik.http.services.traefik.loadbalancer.server.port: 8080
#      traefik.http.middlewares.legalbar.plugin.bodyreplace.replacements[0].search: </body>
#      traefik.http.middlewares.legalbar.plugin.bodyreplace.replacements[0].replace: <div style='position:fixed;bottom:0;width:100%;background:#222;color:#fff;text-align:center;padding:6px;font-size:14px;z-index:9999;'><a href="https://$DOMAIN/privacy-policy" style="color:#fff;margin:0 10px;">Privacy Policy</a> | <a href="https://$DOMAIN/terms" style="color:#fff;margin:0 10px;">Terms</a> | <a href="https://$DOMAIN/cookies-policy" style="color:#fff;margin:0 10px;">Cookies Policy</a> — © $DOMAIN</div></body>
      homepage.group: Infrastructure
      homepage.name: Traefik
      homepage.icon: traefik.png
      homepage.href: https://traefik.$DOMAIN/api
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
      - DOMAIN=$DOMAIN  # Optional: for logging or future expansion
    healthcheck:
      test: ["CMD-SHELL", "caddy validate --config /etc/caddy/Caddyfile"]
      interval: 30s
      timeout: 5s
      retries: 3
    restart: always

```
