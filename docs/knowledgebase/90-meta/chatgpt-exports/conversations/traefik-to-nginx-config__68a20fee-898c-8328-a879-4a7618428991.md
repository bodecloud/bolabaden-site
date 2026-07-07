---
source_url: "https://chatgpt.com/c/68a20fee-898c-8328-a879-4a7618428991"
conversation_id: "68a20fee-898c-8328-a879-4a7618428991"
title: "Traefik to Nginx config"
extracted_at: "2026-06-29T11:08:59.070Z"
message_count: 4
provenance: auth-ui
---

# Traefik to Nginx config

Source: [ChatGPT conversation](https://chatgpt.com/c/68a20fee-898c-8328-a879-4a7618428991)

## User

# yaml-language-server: $schema=https://www.schemastore.org/traefik-v3-file-provider.json 
      http:
        routers:
          whoami-with-failover:
            service: whoami-with-failover@file
            rule: Host(`whoami.${DOMAIN}`)
          whoami-direct:
            service: whoami-direct@file
            rule: Host(`whoami.${TS_HOSTNAME}.${DOMAIN}`)
          hedgedoc-with-failover:
            service: hedgedoc-with-failover@file
            rule: Host(`hedgedoc.${DOMAIN}`)
          hedgedoc-direct:
            service: hedgedoc-direct@file
            rule: Host(`hedgedoc.${TS_HOSTNAME}.${DOMAIN}`)
          searxng-with-failover:
            service: searxng-with-failover@file
            rule: Host(`searxng.${DOMAIN}`)
          searxng-direct:
            service: searxng-direct@file
            rule: Host(`searxng.${TS_HOSTNAME}.${DOMAIN}`)
          code-server-with-failover:
            service: code-server-with-failover@file
            rule: Host(`code-server.${DOMAIN}`)
          code-server-direct:
            service: code-server-direct@file
            rule: Host(`code-server.${TS_HOSTNAME}.${DOMAIN}`)
          dozzle-with-failover:
            service: dozzle-with-failover@file
            rule: Host(`dozzle.${DOMAIN}`)
          dozzle-direct:
            service: dozzle-direct@file
            rule: Host(`dozzle.${TS_HOSTNAME}.${DOMAIN}`)
          prometheus-with-failover:
            service: prometheus-with-failover@file
            rule: Host(`prometheus.${DOMAIN}`)
          prometheus-direct:
            service: prometheus-direct@file
            rule: Host(`prometheus.${TS_HOSTNAME}.${DOMAIN}`)
          # Special case for bolabaden-nextjs
          bolabaden-nextjs-with-failover:
            service: bolabaden-nextjs-with-failover@file
            rule: Host(`${DOMAIN}`)
          bolabaden-nextjs-direct:
            service: bolabaden-nextjs-direct@file
            rule: Host(`${TS_HOSTNAME}.${DOMAIN}`)
          # Last priority router
          catchall:
            service: noop@internal
            rule: Host(`${DOMAIN}`) || Host(`${TS_HOSTNAME}.${DOMAIN}`) || HostRegexp(`^(.+)$$`)
            priority: -700
            middlewares:
              - strip-www@file
              - http-to-https-redirect-simple@file
        services:
          whoami-direct:
            loadBalancer:
              servers:
                - url: http://whoami:80
              healthCheck:
                path: "/status"
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
                - url: https://whoami.micklethefickle.${DOMAIN}
                - url: https://whoami.beatapostapita.${DOMAIN}
                - url: https://whoami.vractormania.${DOMAIN}
                - url: https://whoami.arnialtrashlid.${DOMAIN}
                - url: https://whoami.cloudserver1.${DOMAIN}
                - url: https://whoami.cloudserver2.${DOMAIN}
                - url: https://whoami.cloudserver3.${DOMAIN}
              healthCheck:
                path: "/status"
                interval: "15s"
                timeout: "5s"
          searxng-direct:
            loadBalancer:
              servers:
                - url: http://searxng:8080
              healthCheck:
                path: "/"
                interval: "15s"
                timeout: "5s"
          searxng-with-failover:
            failover:
              service: searxng-direct@file
              fallback: searxng-servers@file
          searxng-servers:
            loadBalancer:
              servers:
                - url: http://searxng:8080
                - url: https://searxng.micklethefickle.${DOMAIN}
                - url: https://searxng.beatapostapita.${DOMAIN}
                - url: https://searxng.vractormania.${DOMAIN}
                - url: https://searxng.arnialtrashlid.${DOMAIN}
                - url: https://searxng.cloudserver1.${DOMAIN}
                - url: https://searxng.cloudserver2.${DOMAIN}
                - url: https://searxng.cloudserver3.${DOMAIN}
              healthCheck:
                path: "/"
                interval: "15s"
                timeout: "5s"
          code-server-direct:
            loadBalancer:
              servers:
                - url: http://code-server:8080
              healthCheck:
                path: "/"
                interval: "15s"
                timeout: "5s"
          code-server-with-failover:
            failover:
              service: code-server-direct@file
              fallback: code-server-servers@file
          code-server-servers:
            loadBalancer:
              servers:
                - url: http://code-server:8080
                - url: https://code-server.micklethefickle.${DOMAIN}
                - url: https://code-server.beatapostapita.${DOMAIN}
                - url: https://code-server.vractormania.${DOMAIN}
                - url: https://code-server.arnialtrashlid.${DOMAIN}
                - url: https://code-server.cloudserver1.${DOMAIN}
                - url: https://code-server.cloudserver2.${DOMAIN}
                - url: https://code-server.cloudserver3.${DOMAIN}
              healthCheck:
                path: "/"
                interval: "15s"
                timeout: "5s"
          dozzle-direct:
            loadBalancer:
              servers:
                - url: http://dozzle:8080
              healthCheck:
                path: "/"
                interval: "15s"
                timeout: "5s"
          dozzle-with-failover:
            failover:
              service: dozzle-direct@file
              fallback: dozzle-servers@file
          dozzle-servers:
            loadBalancer:
              servers:
                - url: http://dozzle:8080
                - url: https://dozzle.micklethefickle.${DOMAIN}
                - url: https://dozzle.beatapostapita.${DOMAIN}
                - url: https://dozzle.vractormania.${DOMAIN}
                - url: https://dozzle.arnialtrashlid.${DOMAIN}
                - url: https://dozzle.cloudserver1.${DOMAIN}
                - url: https://dozzle.cloudserver2.${DOMAIN}
                - url: https://dozzle.cloudserver3.${DOMAIN}
              healthCheck:
                path: "/"
                interval: "15s"
                timeout: "5s"
          prometheus-direct:
            loadBalancer:
              servers:
                - url: http://prometheus:9090
              healthCheck:
                path: "/"
                interval: "15s"
                timeout: "5s"
          prometheus-with-failover:
            failover:
              service: prometheus-direct@file
              fallback: prometheus-servers@file
          prometheus-servers:
            loadBalancer:
              servers:
                - url: http://prometheus:9090
                - url: https://prometheus.micklethefickle.${DOMAIN}
                - url: https://prometheus.beatapostapita.${DOMAIN}
                - url: https://prometheus.vractormania.${DOMAIN}
                - url: https://prometheus.arnialtrashlid.${DOMAIN}
                - url: https://prometheus.cloudserver1.${DOMAIN}
                - url: https://prometheus.cloudserver2.${DOMAIN}
                - url: https://prometheus.cloudserver3.${DOMAIN}
              healthCheck:
                path: "/"
                interval: "15s"
                timeout: "5s"
          hedgedoc-direct:
            loadBalancer:
              servers:
                - url: http://hedgedoc:8080
              healthCheck:
                path: "/metrics"
                interval: "15s"
                timeout: "5s"
          hedgedoc-with-failover:
            failover:
              service: hedgedoc-direct@file
              fallback: hedgedoc-servers@file
          hedgedoc-servers:
            loadBalancer:
              servers:
                - url: http://hedgedoc:8080
                - url: https://hedgedoc.micklethefickle.${DOMAIN}
                - url: https://hedgedoc.beatapostapita.${DOMAIN}
                - url: https://hedgedoc.vractormania.${DOMAIN}
                - url: https://hedgedoc.arnialtrashlid.${DOMAIN}
                - url: https://hedgedoc.cloudserver1.${DOMAIN}
                - url: https://hedgedoc.cloudserver2.${DOMAIN}
                - url: https://hedgedoc.cloudserver3.${DOMAIN}
              healthCheck:
                path: "/metrics"
                interval: "15s"
                timeout: "5s"
          bolabaden-nextjs-direct:
            loadBalancer:
              servers:
                - url: http://bolabaden-nextjs:3000
              healthCheck:
                path: "/"
                interval: "15s"
                timeout: "5s"
          bolabaden-nextjs-with-failover:
            failover:
              service: bolabaden-nextjs-direct@file
              fallback: bolabaden-nextjs-servers@file
          bolabaden-nextjs-servers:
            loadBalancer:
              servers:
                - url: http://bolabaden-nextjs:3000
                - url: https://micklethefickle.${DOMAIN}
                - url: https://beatapostapita.${DOMAIN}
                - url: https://vractormania.${DOMAIN}
                - url: https://arnialtrashlid.${DOMAIN}
                - url: https://cloudserver1.${DOMAIN}
                - url: https://cloudserver2.${DOMAIN}
                - url: https://cloudserver3.${DOMAIN}
              healthCheck:
                path: "/"
                interval: "15s"
                timeout: "5s"


above is traefik's dynamic.yaml. Please rewrite in nginx. Must be 1:1
Show more

## Assistant

Got it ✅ — you want a 1:1 rewrite of your Traefik dynamic.yaml config into equivalent Nginx, keeping all host rules, direct vs failover routing, and health checks as close as possible.

⚠️ A few notes before I show you the Nginx config:

Traefik "failover" services don’t have a true equivalent in plain Nginx. I’ll emulate them with upstream blocks and server directives with backup (so Nginx will only send traffic to fallback servers if primaries fail).

Health checks: Nginx OSS does not have active health checks by default. For true health checking you’d need NGINX Plus
 or a module like nginx_upstream_check_module. I’ll mark them in config with comments so you can add if needed.

Catchall: Traefik’s catchall router with priority will map to a default server {} block in Nginx that handles unmatched domains.

Middlewares (strip-www, http-to-https-redirect) → handled by server_name rules + return 301 in Nginx.

Here’s a full Nginx equivalent:

Nginx
# =========================
# Upstreams (Direct + Failover)
# =========================

# WHOAMI
upstream whoami_direct {
    server whoami:80;
    # Health check path: /status (requires nginx_plus / module)
}
upstream whoami_failover {
    server whoami:80;
    server whoami.micklethefickle.${DOMAIN} backup;
    server whoami.beatapostapita.${DOMAIN} backup;
    server whoami.vractormania.${DOMAIN} backup;
    server whoami.arnialtrashlid.${DOMAIN} backup;
    server whoami.cloudserver1.${DOMAIN} backup;
    server whoami.cloudserver2.${DOMAIN} backup;
    server whoami.cloudserver3.${DOMAIN} backup;
}

# SEARXNG
upstream searxng_direct {
    server searxng:8080;
    # Health check path: /
}
upstream searxng_failover {
    server searxng:8080;
    server searxng.micklethefickle.${DOMAIN} backup;
    server searxng.beatapostapita.${DOMAIN} backup;
    server searxng.vractormania.${DOMAIN} backup;
    server searxng.arnialtrashlid.${DOMAIN} backup;
    server searxng.cloudserver1.${DOMAIN} backup;
    server searxng.cloudserver2.${DOMAIN} backup;
    server searxng.cloudserver3.${DOMAIN} backup;
}

# CODE-SERVER
upstream code_server_direct {
    server code-server:8080;
}
upstream code_server_failover {
    server code-server:8080;
    server code-server.micklethefickle.${DOMAIN} backup;
    server code-server.beatapostapita.${DOMAIN} backup;
    server code-server.vractormania.${DOMAIN} backup;
    server code-server.arnialtrashlid.${DOMAIN} backup;
    server code-server.cloudserver1.${DOMAIN} backup;
    server code-server.cloudserver2.${DOMAIN} backup;
    server code-server.cloudserver3.${DOMAIN} backup;
}

# DOZZLE
upstream dozzle_direct {
    server dozzle:8080;
}
upstream dozzle_failover {
    server dozzle:8080;
    server dozzle.micklethefickle.${DOMAIN} backup;
    server dozzle.beatapostapita.${DOMAIN} backup;
    server dozzle.vractormania.${DOMAIN} backup;
    server dozzle.arnialtrashlid.${DOMAIN} backup;
    server dozzle.cloudserver1.${DOMAIN} backup;
    server dozzle.cloudserver2.${DOMAIN} backup;
    server dozzle.cloudserver3.${DOMAIN} backup;
}

# PROMETHEUS
upstream prometheus_direct {
    server prometheus:9090;
}
upstream prometheus_failover {
    server prometheus:9090;
    server prometheus.micklethefickle.${DOMAIN} backup;
    server prometheus.beatapostapita.${DOMAIN} backup;
    server prometheus.vractormania.${DOMAIN} backup;
    server prometheus.arnialtrashlid.${DOMAIN} backup;
    server prometheus.cloudserver1.${DOMAIN} backup;
    server prometheus.cloudserver2.${DOMAIN} backup;
    server prometheus.cloudserver3.${DOMAIN} backup;
}

# HEDGEDOC
upstream hedgedoc_direct {
    server hedgedoc:8080;
    # Health check path: /metrics
}
upstream hedgedoc_failover {
    server hedgedoc:8080;
    server hedgedoc.micklethefickle.${DOMAIN} backup;
    server hedgedoc.beatapostapita.${DOMAIN} backup;
    server hedgedoc.vractormania.${DOMAIN} backup;
    server hedgedoc.arnialtrashlid.${DOMAIN} backup;
    server hedgedoc.cloudserver1.${DOMAIN} backup;
    server hedgedoc.cloudserver2.${DOMAIN} backup;
    server hedgedoc.cloudserver3.${DOMAIN} backup;
}

# BOLABADEN-NEXTJS
upstream bolabaden_nextjs_direct {
    server bolabaden-nextjs:3000;
}
upstream bolabaden_nextjs_failover {
    server bolabaden-nextjs:3000;
    server micklethefickle.${DOMAIN} backup;
    server beatapostapita.${DOMAIN} backup;
    server vractormania.${DOMAIN} backup;
    server arnialtrashlid.${DOMAIN} backup;
    server cloudserver1.${DOMAIN} backup;
    server cloudserver2.${DOMAIN} backup;
    server cloudserver3.${DOMAIN} backup;
}


# =========================
# Routers (Server blocks)
# =========================

# WHOAMI
server {
    server_name whoami.${DOMAIN};
    location / {
        proxy_pass http://whoami_failover;
    }
}
server {
    server_name whoami.${TS_HOSTNAME}.${DOMAIN};
    location / {
        proxy_pass http://whoami_direct;
    }
}

# SEARXNG
server {
    server_name searxng.${DOMAIN};
    location / {
        proxy_pass http://searxng_failover;
    }
}
server {
    server_name searxng.${TS_HOSTNAME}.${DOMAIN};
    location / {
        proxy_pass http://searxng_direct;
    }
}

# CODE-SERVER
server {
    server_name code-server.${DOMAIN};
    location / {
        proxy_pass http://code_server_failover;
    }
}
server {
    server_name code-server.${TS_HOSTNAME}.${DOMAIN};
    location / {
        proxy_pass http://code_server_direct;
    }
}

# DOZZLE
server {
    server_name dozzle.${DOMAIN};
    location / {
        proxy_pass http://dozzle_failover;
    }
}
server {
    server_name dozzle.${TS_HOSTNAME}.${DOMAIN};
    location / {
        proxy_pass http://dozzle_direct;
    }
}

# PROMETHEUS
server {
    server_name prometheus.${DOMAIN};
    location / {
        proxy_pass http://prometheus_failover;
    }
}
server {
    server_name prometheus.${TS_HOSTNAME}.${DOMAIN};
    location / {
        proxy_pass http://prometheus_direct;
    }
}

# HEDGEDOC
server {
    server_name hedgedoc.${DOMAIN};
    location / {
        proxy_pass http://hedgedoc_failover;
    }
}
server {
    server_name hedgedoc.${TS_HOSTNAME}.${DOMAIN};
    location / {
        proxy_pass http://hedgedoc_direct;
    }
}

# BOLABADEN-NEXTJS (special case)
server {
    server_name ${DOMAIN};
    location / {
        proxy_pass http://bolabaden_nextjs_failover;
    }
}
server {
    server_name ${TS_HOSTNAME}.${DOMAIN};
    location / {
        proxy_pass http://bolabaden_nextjs_direct;
    }
}

# =========================
# Catchall & Redirects
# =========================
server {
    listen 80 default_server;
    server_name _;

    # Strip www
    if ($host ~* ^www\.(.*)) {
        return 301 https://$1$request_uri;
    }

    # Redirect HTTP -> HTTPS
    return 301 https://$host$request_uri;
}

👉 This is a 1:1 mapping:

Each Traefik router → Nginx server block.

Each direct/failover service → Nginx upstream.

Backup servers replicate Traefik fallback.

Health checks noted as comments since OSS Nginx lacks them.

Do you want me to extend this config with active health checks (using open-source nginx_upstream_check_module) so it really matches Traefik’s behavior?

## User

You see the pattern between searxng/whoami/prometheus etc right? please make the nginx.conf fully dynamic and not tethored/hardcoded to specific services so i don't have to define the other 500 services i have.

## Assistant

Got it ✅ — you don’t want to hand-define 500+ upstream + server blocks that all follow the same pattern (service-with-failover vs service-direct).

That’s exactly where templating comes in.
Plain NGINX config is static, but with tools like nginx variables, includes, or a templating engine (Jinja2, gomplate, Helm, Ansible, Consul-Template, etc.) you can make it fully dynamic.

Here’s how you can rewrite your Traefik config into a dynamic NGINX template that auto-generates config for each service.

1. Define your service list once

Put your services in a YAML or JSON file (like you already have for Traefik):

YAML
services:
  - name: whoami
    port: 80
    health: /status
  - name: searxng
    port: 8080
    health: /
  - name: code-server
    port: 8080
    health: /
  - name: dozzle
    port: 8080
    health: /
  - name: prometheus
    port: 9090
    health: /
  - name: hedgedoc
    port: 8080
    health: /metrics
  - name: bolabaden-nextjs
    port: 3000
    health: /
2. NGINX Jinja2 Template

Instead of hardcoding 500 blocks, you template them:

jinja
# =========================
# Auto-generated nginx.conf
# =========================

{% for svc in services %}
upstream {{ svc.name }}_direct {
    server {{ svc.name }}:{{ svc.port }};
    # Health check path: {{ svc.health }}
}

upstream {{ svc.name }}_failover {
    server {{ svc.name }}:{{ svc.port }};
    server {{ svc.name }}.micklethefickle.${DOMAIN} backup;
    server {{ svc.name }}.beatapostapita.${DOMAIN} backup;
    server {{ svc.name }}.vractormania.${DOMAIN} backup;
    server {{ svc.name }}.arnialtrashlid.${DOMAIN} backup;
    server {{ svc.name }}.cloudserver1.${DOMAIN} backup;
    server {{ svc.name }}.cloudserver2.${DOMAIN} backup;
    server {{ svc.name }}.cloudserver3.${DOMAIN} backup;
}

server {
    server_name {{ svc.name }}.${DOMAIN};
    location / {
        proxy_pass http://{{ svc.name }}_failover;
    }
}
server {
    server_name {{ svc.name }}.${TS_HOSTNAME}.${DOMAIN};
    location / {
        proxy_pass http://{{ svc.name }}_direct;
    }
}
{% endfor %}

# Special case for bolabaden-nextjs root domain
server {
    server_name ${DOMAIN};
    location / {
        proxy_pass http://bolabaden-nextjs_failover;
    }
}
server {
    server_name ${TS_HOSTNAME}.${DOMAIN};
    location / {
        proxy_pass http://bolabaden-nextjs_direct;
    }
}

# Catchall
server {
    listen 80 default_server;
    server_name _;

    if ($host ~* ^www\.(.*)) {
        return 301 https://$1$request_uri;
    }

    return 301 https://$host$request_uri;
}
3. Render it

Use jinja2-cli or gomplate to render:

Bash
jinja2 nginx.tmpl services.yaml > nginx.conf

Or if you prefer Go templating with Docker labels → docker-gen works the same way.

4. Benefits

Add one new service to your services.yaml → re-render → all NGINX blocks are created automatically.

Keeps the 1:1 parity with Traefik failover setup.

Works for 500+ services without repeating config.

⚡ Question for you: do you want me to build you a ready-to-use generator script (Python/Jinja2 or Go template) that takes your dynamic.yaml directly and spits out the full nginx.conf? That way you don’t even have to maintain two lists.
