---
source_url: "https://chatgpt.com/c/685fb79d-67b0-8006-aa7d-2107dd6a7ccf"
conversation_id: "685fb79d-67b0-8006-aa7d-2107dd6a7ccf"
title: "Docker IP Conflicts"
extracted_at: "2026-06-29T14:29:05.348Z"
message_count: 2
provenance: auth-ui
---

# Docker IP Conflicts

Source: [ChatGPT conversation](https://chatgpt.com/c/685fb79d-67b0-8006-aa7d-2107dd6a7ccf)

## User

ubuntu@micklethefickle3:~/my-media-stack$ cat docker-compose.yml | grep -E '10\.76\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)'
  - warp:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - tailscale-warp:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - aiostreams:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - comet:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - jackett:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - jackettio:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - localhost:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - mediafusion:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - prowlarr:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - stremio:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - stremio-jackett:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - stremio-web:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - warp:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - tailscale-warp:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - aiostreams:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - comet:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - jackett:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - jackettio:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - localhost:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - mediafusion:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - prowlarr:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - stremio:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - stremio-jackett:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - stremio-web:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - mediaflow-proxy:${WARP_IPV4_ADDRESS:-10.76.128.97}
  - dash:${DASH_IPV4_ADDRESS:-10.76.128.23}
  - gpt-researcher:${GPT_RESEARCHER_IPV4_ADDRESS:-10.76.128.43}
#  - gptr:${GPT_RESEARCHER_IPV4_ADDRESS:-10.76.128.43}
  - qdrant:${QDRANT_IPV4_ADDRESS:-10.76.128.44}
  - error-pages:${TRAEFIK_ERROR_PAGES_IPV4_ADDRESS:-10.76.128.45}
  - lobechat:${LOBECHAT_IPV4_ADDRESS:-10.76.128.46}
  - mongodb:${MONGODB_IPV4_ADDRESS:-10.76.0.50}
  - code-demo:${CODE_DEMO_IPV4_ADDRESS:-10.76.128.80}
  - whoami:${WHOAMI_IPV4_ADDRESS:-10.76.128.81}
  - tinyauth:${TINYAUTH_IPV4_ADDRESS:-10.76.128.82}
  - watchtower:${WATCHTOWER_IPV4_ADDRESS:-10.76.128.83}
  - maintainerr:${MAINTAINERR_IPV4_ADDRESS:-10.76.128.84}
  - traefik:${TRAEFIK_IPV4_ADDRESS:-10.76.128.85}
  - speedtest:${SPEEDTEST_IPV4_ADDRESS:-10.76.128.86}
  - redis:${REDIS_IPV4_ADDRESS:-10.76.128.87}
  - homepage:${HOMEPAGE_IPV4_ADDRESS:-10.76.128.88}
  - dozzle:${DOZZLE_IPV4_ADDRESS:-10.76.128.89}
  - searxng:${SEARXNG_IPV4_ADDRESS:-10.76.128.90}
  - code-dev:${CODE_DEV_IPV4_ADDRESS:-10.76.128.92}
  - byparr:${FLARESOLVERR_IPV4_ADDRESS:-10.76.128.93}
  - flaresolverr:${FLARESOLVERR_IPV4_ADDRESS:-10.76.128.93}
  - nginx-auth:${NGINX_AUTH_IPV4_ADDRESS:-10.76.128.94}
  - plex:${PLEX_IPV4_ADDRESS:-10.76.128.95}
  - code:${CODE_DEMO_IPV4_ADDRESS:-10.76.128.96}
  - stremthru:${STREMTHRU_IPV4_ADDRESS:-10.76.128.99}
  - riven:${RIVEN_IPV4_ADDRESS:-10.76.128.100}
  - riven-frontend:${RIVEN_IPV4_ADDRESS:-10.76.128.100}
  - riven-core:${RIVEN_CORE_IPV4_ADDRESS:-10.76.128.101}
  - riven-db:${RIVEN_DB_IPV4_ADDRESS:-10.76.128.102}
  - tautulli:${TAUTULLI_IPV4_ADDRESS:-10.76.128.103}
  - crowdsec:${CROWDSEC_IPV4_ADDRESS:-10.76.128.104}
  - gatus:${GATUS_IPV4_ADDRESS:-10.76.128.105}
  - homer:${HOMER_IPV4_ADDRESS:-10.76.128.106}
  - wizarr:${WIZARR_IPV4_ADDRESS:-10.76.128.107}
  - zurg:${ZURG_IPV4_ADDRESS:-10.76.128.108}
  - plex-watchlist:${PLEX_WATCHLIST_IPV4_ADDRESS:-10.76.128.97}
  - realdebrid-account-monitor:${REALDEBRID_ACCOUNT_MONITOR_IPV4_ADDRESS:-10.76.128.109}
  - rclonefm:${RCLONEFM_IPV4_ADDRESS:-10.76.128.110}
  - rcloneui:${RCLONEUI_IPV4_ADDRESS:-10.76.128.111}
  - plex-authentication:${PLEX_AUTHENTICATION_IPV4_ADDRESS:-10.76.128.112}
  - plex-request:${PLEX_REQUEST_IPV4_ADDRESS:-10.76.128.113}
        ipv4_address: ${PLEX_AUTHENTICATION_IPV4_ADDRESS:-10.76.128.112}
        ipv4_address: ${PLEX_REQUEST_IPV4_ADDRESS:-10.76.128.113}
        ipv4_address: ${PLEX_WATCHLIST_IPV4_ADDRESS:-10.76.128.97}
        ipv4_address: ${REALDEBRID_ACCOUNT_MONITOR_IPV4_ADDRESS:-10.76.128.109}
        ipv4_address: ${MAINTAINERR_IPV4_ADDRESS:-10.76.128.84}
        ipv4_address: ${RCLONEFM_IPV4_ADDRESS:-10.76.128.110}
        ipv4_address: ${RCLONEUI_IPV4_ADDRESS:-10.76.128.111}
        ipv4_address: ${RIVEN_IPV4_ADDRESS:-10.76.128.100}
        ipv4_address: ${RIVEN_CORE_IPV4_ADDRESS:-10.76.128.101}
        ipv4_address: ${RIVEN_DB_IPV4_ADDRESS:-10.76.128.102}
        ipv4_address: ${PLEX_IPV4_ADDRESS:-10.76.128.95}
        ipv4_address: ${TAUTULLI_IPV4_ADDRESS:-10.76.128.103}
        ipv4_address: ${MONGODB_IPV4_ADDRESS:-10.76.0.50}
        ipv4_address: ${REDIS_IPV4_ADDRESS:-10.76.128.87}
        ipv4_address: ${SEARXNG_IPV4_ADDRESS:-10.76.128.90}
        ipv4_address: ${WARP_IPV4_ADDRESS:-10.76.128.97}
        ipv4_address: ${CODE_DEV_IPV4_ADDRESS:-10.76.128.92}
        ipv4_address: ${CROWDSEC_IPV4_ADDRESS:-10.76.128.104}
        ipv4_address: ${DOZZLE_IPV4_ADDRESS:-10.76.128.89}
        ipv4_address: ${HOMEPAGE_IPV4_ADDRESS:-10.76.128.88}
        ipv4_address: ${SPEEDTEST_IPV4_ADDRESS:-10.76.128.86}
        ipv4_address: ${TRAEFIK_IPV4_ADDRESS:-10.76.128.85}
      - --entrypoints.web.forwardedHeaders.trustedIPs=127.0.0.1/32,::1/128,172.17.0.0/12,${PUBLICNET_SUBNET:-10.76.0.0/16},${TAILSCALE_CIDR:-100.64.0.0/10}
      - --entrypoints.websecure.forwardedHeaders.trustedIPs=127.0.0.1/32,::1/128,172.17.0.0/12,${PUBLICNET_SUBNET:-10.76.0.0/16},${TAILSCALE_CIDR:-100.64.0.0/10}
        ipv4_address: ${TRAEFIK_ERROR_PAGES_IPV4_ADDRESS:-10.76.128.45}
        ipv4_address: ${WATCHTOWER_IPV4_ADDRESS:-10.76.128.83}
        ipv4_address: ${TINYAUTH_IPV4_ADDRESS:-10.76.128.82}
        ipv4_address: ${WHOAMI_IPV4_ADDRESS:-10.76.128.81}
        ipv4_address: ${FLARESOLVERR_IPV4_ADDRESS:-10.76.128.93}
        ipv4_address: ${STREMTHRU_IPV4_ADDRESS:-10.76.128.99}
        ipv4_address: ${GPT_RESEARCHER_IPV4_ADDRESS:-10.76.128.45}
        ipv4_address: ${QDRANT_IPV4_ADDRESS:-10.76.128.44}
        ipv4_address: ${LOBECHAT_IPV4_ADDRESS:-10.76.128.46}
        ipv4_address: ${NGINX_AUTH_IPV4_ADDRESS:-10.76.128.94}
        ipv4_address: ${GATUS_IPV4_ADDRESS:-10.76.128.105}
        ipv4_address: ${HOMER_IPV4_ADDRESS:-10.76.128.106}
        ipv4_address: ${WIZARR_IPV4_ADDRESS:-10.76.128.107}
        ipv4_address: ${ZURG_IPV4_ADDRESS:-10.76.128.108}
#    external: true  # docker network create --driver=bridge --attachable publicnet --subnet=${PUBLICNET_SUBNET:-10.76.0.0/16} --gateway=${PUBLICNET_GATEWAY:-10.76.0.1} --ip-range=${PUBLICNET_IP_RANGE:-10.76.0.0/16}
        - subnet: ${PUBLICNET_SUBNET:-10.76.0.0/16}
          gateway: ${PUBLICNET_GATEWAY:-10.76.0.1}
          ip_range: ${PUBLICNET_IP_RANGE:-10.76.0.0/16}

Please point out duplicate ips that would cause 'address already in use'. Obviously the ones that reuse warp shouldn't be considered as they route through warp itself.

Show more

## Assistant

To identify duplicate IP addresses that might cause address already in use errors excluding the intentional reuses of 10.76.128.97 (used for warp, tailscale-warp, etc.), we need to find:

Multiple entries using the same IP address across different services.

Exclude 10.76.128.97 from the duplication check, as it's reused by design.

✅ Allowed Duplicate (Excluded from warnings):

10.76.128.97 → used by warp, tailscale-warp, aiostreams, etc.

❌ Potential Conflicts (Duplicates found)
🔁 10.76.128.45

Used by:

error-pages:${TRAEFIK_ERROR_PAGES_IPV4_ADDRESS:-10.76.128.45}

gpt-researcher:${GPT_RESEARCHER_IPV4_ADDRESS:-10.76.128.45} ❗

Conflict: Both error-pages and gpt-researcher try to use 10.76.128.45.

🔁 10.76.128.93

Used by:

byparr:${FLARESOLVERR_IPV4_ADDRESS:-10.76.128.93}

flaresolverr:${FLARESOLVERR_IPV4_ADDRESS:-10.76.128.93} ❗

Conflict: byparr and flaresolverr both try to bind to 10.76.128.93.

🔁 10.76.128.96

Used by:

code:${CODE_DEMO_IPV4_ADDRESS:-10.76.128.96}

code-demo:${CODE_DEMO_IPV4_ADDRESS:-10.76.128.80} (also defined separately with 80) — This may or may not be a conflict depending on how you define CODE_DEMO_IPV4_ADDRESS.

Check your environment variables — if both services expand to 10.76.128.96, there's a conflict.

✅ Everything Else Seems Unique

No other IP addresses are duplicated in the provided output.

📌 Recommendation

Fix duplicates:

Assign a unique IP to gpt-researcher or error-pages.

Separate byparr and flaresolverr with distinct IPs.

Confirm the value of CODE_DEMO_IPV4_ADDRESS.

Validate environment variables (.env or shell exports) to ensure they don't unintentionally map to the same IP.

Would you like a script to automate this IP conflict detection in YAML files?
