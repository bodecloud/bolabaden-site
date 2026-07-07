---
source_url: "https://chatgpt.com/c/68b2f894-44b0-832a-b9d0-e255def36342"
conversation_id: "68b2f894-44b0-832a-b9d0-e255def36342"
title: "Traefik configuration syntax"
extracted_at: "2026-06-29T16:00:16.218Z"
message_count: 4
provenance: auth-ui
---

# Traefik configuration syntax

Source: [ChatGPT conversation](https://chatgpt.com/c/68b2f894-44b0-832a-b9d0-e255def36342)

## User

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


in traefik, what syntax is this exactly? doesn't look like its static file provider, its dynamic file provider, nor any other provider i've seen before?

determine exactly what provider it is. web search the various terms/keywords in here.
Show more

## Assistant

The configuration snippet you've provided is not part of Traefik's standard static or dynamic configuration providers. Instead, it appears to be from a third-party tool designed to integrate Docker container metadata with Traefik via Redis, DNS updates, and webhooks.

🔍 Identifying the Provider

The structure and keys in your configuration—such as labels, redis, webhook, nodes, interval, rfc2136, ping, and tls—are characteristic of the 11notes/traefik-labels project. This tool monitors Docker container labels and updates Traefik's Redis provider accordingly. It also supports DNS updates using RFC 2136 and can trigger webhooks on container events.
GitHub
GitHub

🧩 How It Works

Docker Label Monitoring: The tool connects to Docker nodes, reads container labels, and updates the Traefik configuration in Redis.

Redis Integration: It assumes Traefik is configured with a Redis provider and updates Redis with container metadata.

DNS Updates: Supports nsupdate for DNS record management, allowing dynamic DNS updates when containers start or stop.

Webhook Notifications: Can call a specified webhook URL on container events, such as start, stop, or poll.

TLS Support: Allows configuration of TLS certificates for secure communication.

Polling and Health Checks: Includes options for polling container status and performing health checks.
GitHub

🛠️ Usage Example

To use this tool, you would typically set up a docker-compose.yml file that includes services for both Redis and the label synchronization tool. The configuration would look something like this:

YAML
services:
  redis:
    image: "11notes/redis:7.2.5"
    container_name: "redis"
    environment:
      REDIS_PASSWORD: "yourpassword"
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

In this setup, the labels service would be configured with the necessary environment variables and volume mounts to interact with your Docker environment and Traefik's Redis provider.

📚 References

11notes/traefik-labels GitHub Repository

[Traefik Redis Provider

## User

the documentation for traefik-labels implies it parses docker labels in docker-compose.yaml and converts to redis, but the traefik-labels actually loads a config.yaml that looks like this template:

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


tf is this
Show more

## Assistant

Ah! Now I understand exactly what’s going on. That YAML you’re showing is not a Traefik configuration file at all, in the sense of static or dynamic providers. It’s the configuration for the traefik-labels service itself—the daemon that sits alongside Traefik and manages label syncing.

Let me break it down carefully:

1️⃣ What traefik-labels does

It reads Docker container labels from your nodes.

Converts them into a format that Traefik can consume via its Redis provider.

Optionally updates DNS via RFC2136 or triggers webhooks.

Handles polling, node health checks, and TLS for secure communication.

So the YAML is the config file for the traefik-labels tool, not Traefik.

2️⃣ Breaking down your YAML
YAML
labels:
  redis:
    url: rediss://foo:bar@10.127.198.254:6379/0

Redis connection where traefik-labels writes processed labels for Traefik to read.

YAML
  webhook:
    url: https://my.cool.webhook/v1
    auth:
      basic: labels:*****

Optional webhook for container events (start/stop).

YAML
  nodes:
    - 192.168.18.12
    - 10.14.120.1

The Docker nodes traefik-labels will connect to and scan for containers.

YAML
  interval: 0
  timeout: 2.5

interval: how often to reload nodes list (0 = disabled).

timeout: Docker connection timeout per node.

YAML
  rfc2136:
    verify: false
    remove: false

DNS updates via nsupdate if needed.

YAML
  poll:
    interval: 300

How often to poll all containers for updates (seconds).

YAML
  ping:
    interval: 10

How often to ping nodes to check they’re online.

YAML
  tls:
    ca: /labels/ssl/ca.crt
    crt: /labels/ssl/server.crt
    key: /labels/ssl/server.key

TLS certificates for secure communication between nodes and traefik-labels.

3️⃣ Key takeaway

This YAML is specific to the traefik-labels tool—it is not a Traefik provider configuration itself. It’s basically the instructions that tell traefik-labels how to find Docker nodes, read labels, sync to Redis, and handle DNS/webhooks securely.

Think of it as a “meta provider”: traefik-labels reads Docker labels and pushes them to Traefik via Redis.

Traefik itself then consumes the labels via the Redis provider, so Traefik never sees this YAML directly.

If you want, I can draw a diagram of the full flow showing Docker → traefik-labels → Redis → Traefik → Optional DNS/Webhook. It makes this crystal clear.

Do you want me to do that?
