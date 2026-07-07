---
source_url: "https://chatgpt.com/c/689d5598-9720-832e-a891-ff57340bcd9c"
conversation_id: "689d5598-9720-832e-a891-ff57340bcd9c"
title: "Traefik service failover setup"
extracted_at: "2026-06-29T11:09:41.031Z"
message_count: 1
provenance: auth-ui
---

# Traefik service failover setup

Source: [ChatGPT conversation](https://chatgpt.com/c/689d5598-9720-832e-a891-ff57340bcd9c)

## User

I seem to have made a mistake here:

whoami:
    # 🔹🔹 Whoami 🔹🔹
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
      # Loadbalanced access to whoami
      traefik.http.routers.whoami.rule: 'Host(`whoami.${DOMAIN}`)'
      traefik.http.routers.whoami.failover.service: whoami-servers@file
      # Direct access to whoami
      traefik.http.routers.whoami-direct.service: whoami@docker
      traefik.http.routers.whoami-direct.middlewares: nginx-auth@docker
      traefik.http.routers.whoami-direct.rule: 'Host(`whoami.${TS_HOSTNAME}.${DOMAIN}`)'
      # whoami Service definition
      traefik.http.services.whoami.loadbalancer.server.port: 80
      homepage.group: Web Services
      homepage.name: whoami
      homepage.icon: whoami.png
      homepage.href: https://whoami.${DOMAIN}
      homepage.description: Request echo service used to verify reverse-proxy, headers, and auth middleware
    restart: always


based on @traefik-v3-file-provider.yaml , how to fix this error:


2025-08-14T03:22:19Z ERR github.com/traefik/traefik/v3/pkg/provider/docker/config.go:46 > error="field not found, node: failover" container=whoami-my-media-stack-503e273a749027dc987fed6f1acc56353858d5258436bf68386a1f1943e31c52 providerName=docker


I have tried both traefik.http.routers.whoami.failover and traefik.http.services.whoami.failover and both cause same error.
Show more
