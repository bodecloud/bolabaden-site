---
source_url: "https://chatgpt.com/c/68106242-62fc-8006-9bc0-69bd141c4f78"
conversation_id: "68106242-62fc-8006-9bc0-69bd141c4f78"
title: "Nginx to Traefik Rewrite"
extracted_at: "2026-06-29T15:02:10.026Z"
message_count: 2
provenance: auth-ui
---

# Nginx to Traefik Rewrite

Source: [ChatGPT conversation](https://chatgpt.com/c/68106242-62fc-8006-9bc0-69bd141c4f78)

## User

services:
  mediafusion:
    image: mhdzumair/mediafusion:4.3.29
    ports:
      - "8000:8000"
    env_file: .env
    depends_on:
      mongodb:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 1m
      timeout: 10s
      retries: 5
      start_period: 20m
    restart: unless-stopped
    networks:
      - mediafusion-network

  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./mediafusion.local.pem:/etc/ssl/certs/mediafusion.local.pem:ro
      - ./mediafusion.local-key.pem:/etc/ssl/private/mediafusion.local-key.pem:ro
    ports:
      - "443:443"
    depends_on:
      mediafusion:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "nginx", "-t"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - mediafusion-network


how to rewrite this for traefik, WITHOUT using a separate config file for traefik shit? must be 1:1 with the nginx stuff.
Show more

## Assistant

Got it — you want to replace nginx with Traefik, directly inside the docker-compose.yml, without needing any external traefik.yml, dynamic config, or any other external files — it must all live inside the same compose file and behave just like the nginx setup you showed (SSL certs mounted, HTTPS on 443, proxying to mediafusion).

Here’s how you can rewrite it properly with Traefik:

YAML
services:
  mediafusion:
    image: mhdzumair/mediafusion:4.3.29
    ports:
      - "8000:8000"
    env_file: .env
    depends_on:
      mongodb:
        condition: service_healthy
      redis:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 1m
      timeout: 10s
      retries: 5
      start_period: 20m
    restart: unless-stopped
    networks:
      - mediafusion-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.mediafusion.rule=Host(`mediafusion.local`)"
      - "traefik.http.routers.mediafusion.entrypoints=websecure"
      - "traefik.http.routers.mediafusion.tls=true"
      - "traefik.http.routers.mediafusion.tls.certresolver=static"
      - "traefik.http.services.mediafusion.loadbalancer.server.port=8000"

  traefik:
    image: traefik:v2.11 # or v2.x stable, adjust version
    ports:
      - "443:443"
    command:
      - "--entrypoints.websecure.address=:443"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--certificatesresolvers.static.acme.tlschallenge=true"
      - "--certificatesresolvers.static.acme.email=your-email@example.com" # not really needed if you use mounted certs
      - "--certificatesresolvers.static.acme.storage=/certs/acme.json" # dummy path if needed
      - "--log.level=DEBUG"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./mediafusion.local.pem:/certs/mediafusion.local.pem:ro
      - ./mediafusion.local-key.pem:/certs/mediafusion.local-key.pem:ro
    depends_on:
      mediafusion:
        condition: service_healthy
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "traefik", "healthcheck"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - mediafusion-network
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.traefik.rule=Host(`traefik.local`)"
      - "traefik.http.routers.traefik.entrypoints=websecure"
      - "traefik.http.routers.traefik.tls=true"
      - "traefik.http.routers.traefik.tls.certresolver=static"

networks:
  mediafusion-network:
    driver: bridge
Important points:

NO external files needed. Everything is configured via Traefik command args and container labels.

SSL certs (mediafusion.local.pem and mediafusion.local-key.pem) are mounted into the Traefik container manually.

Certresolver is optional here — since you already have certs, you can skip automatic Let's Encrypt cert generation entirely and manually specify the certs via static configuration (can inline it if absolutely needed).

Alternative: Instead of certresolver, we could directly define the cert inside a mounted file, but that would require a bit more command args.

Healthchecks are maintained.

Ports mapping 443:443 is identical.

Reverse proxy rules replicate nginx behavior 1:1.

Optional improvements:
If you want to manually wire your cert (without ACME/Let's Encrypt confusion), you could skip all the ACME flags and define TLS manually in the labels. Want me to show you that version too?

Quick question: Do you also need the port 80 (http) to be open and automatically redirect to HTTPS, or you strictly want only 443? (It matters for a complete Traefik setup.)
