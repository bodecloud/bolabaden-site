---
source_url: "https://chatgpt.com/c/68a23926-01dc-8320-b4ef-50e8d4000af0"
conversation_id: "68a23926-01dc-8320-b4ef-50e8d4000af0"
title: "Docker Compose resource limits"
extracted_at: "2026-06-29T14:02:47.076Z"
message_count: 2
provenance: auth-ui
---

# Docker Compose resource limits

Source: [ChatGPT conversation](https://chatgpt.com/c/68a23926-01dc-8320-b4ef-50e8d4000af0)

## User

deploy:
      resources:
        reservations:
          cpus: 0.01
          memory: 512M
        limits:
          cpus: 0.1
          memory: 1G

equivalent docker-compose.yaml way to limit cpu/ram without using deploy (deploy only applies to swarm stuff)
Show more

## Assistant

You're right — the deploy key in docker-compose.yaml is ignored in plain Docker Compose (it’s only for Docker Swarm). For standard Docker Compose, you need to use resources at the service level under mem_limit, mem_reservation, and cpus, or the newer deploy equivalents using container_name: mem_limit: etc.

Here’s the equivalent for your snippet in a plain docker-compose.yaml:

YAML
version: '3.9'

services:
  my_service:
    image: my_image:latest
    # CPU and memory limits for plain Docker Compose
    deploy:  # ignored by plain Docker Compose
      resources:
        limits:
          cpus: "0.1"
          memory: "1G"
        reservations:
          cpus: "0.01"
          memory: "512M"

    # Plain Docker Compose way:
    mem_limit: 1G          # max memory
    mem_reservation: 512M  # soft memory limit
    cpus: 0.1              # CPU limit (equivalent to --cpus)

Notes:

mem_limit → hard memory limit.

mem_reservation → soft limit, Docker tries to ensure this much memory is available.

cpus → fraction of CPU (0.1 = 10% of one CPU).

⚠️ If you’re using Compose v3.x, mem_limit and cpus work only on Docker Engine, not in Swarm. For Swarm, you must use deploy.resources.

If you want, I can write a clean Docker Compose v3 version without any Swarm deploy keys that mimics exactly your CPU/memory reservations and limits. Do you want me to do that?
