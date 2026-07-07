---
source_url: "https://grok.com/c/5c11902e-2243-472c-967c-d7c4bbf5a665"
conversation_id: "5c11902e-2243-472c-967c-d7c4bbf5a665"
title: "Traefik Docker Load Balancer Setup"
extracted_at: "2026-06-29T16:26:10.660Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Traefik Docker Load Balancer Setup

Source: [Grok conversation](https://grok.com/c/5c11902e-2243-472c-967c-d7c4bbf5a665)

## User

_Time: 2025-07-19T15:40:54.424Z_

Provide a full traefik docker-compose.yml that acts exclusively as a universal load balancer between three backend urls.

## Assistant

_Time: 2025-07-19T15:42:44.079Z_

The following is a complete `docker-compose.yml` file for deploying Traefik as a containerized service that functions exclusively as a load balancer. This setup configures Traefik to distribute incoming HTTP traffic across three backend URLs using a round-robin algorithm by default. The configuration relies on two additional YAML files (`traefik.yml` for static configuration and `dynamic.yml` for dynamic routing and service definitions), which must be created in the same directory as the `docker-compose.yml` file.

To use this setup:
- Replace the placeholders in `dynamic.yml` (e.g., `http://backend1.example.com`, `yourdomain.com`) with actual values.
- Run `docker compose up -d` to start the service.
- Traefik will listen on port 80 and balance requests to `http://yourdomain.com` across the three backends.

### docker-compose.yml
```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v3.1
    container_name: traefik
    restart: always
    ports:
      - 80:80
    volumes:
      - ./traefik.yml:/etc/traefik/traefik.yml:ro
      - ./dynamic.yml:/etc/traefik/dynamic.yml:ro
```

### traefik.yml (Static Configuration)
This file defines the entry points and enables the file provider for dynamic configuration.

```yaml
global:
  checkNewVersion: false
  sendAnonymousUsage: false

entryPoints:
  web:
    address: :80

providers:
  file:
    filename: /etc/traefik/dynamic.yml

log:
  level: INFO
```

### dynamic.yml (Dynamic Configuration)
This file defines the HTTP router and the load-balanced service pointing to the three backend URLs.

```yaml
http:
  routers:
    loadbalancer:
      entryPoints:
        - web
      rule: Host(`yourdomain.com`)
      service: backend-service

  services:
    backend-service:
      loadBalancer:
        servers:
          - url: http://backend1.example.com
          - url: http://backend2.example.com
          - url: http://backend3.example.com
```
