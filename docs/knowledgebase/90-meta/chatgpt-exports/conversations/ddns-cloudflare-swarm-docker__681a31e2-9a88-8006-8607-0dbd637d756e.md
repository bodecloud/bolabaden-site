---
source_url: "https://chatgpt.com/c/681a31e2-9a88-8006-8607-0dbd637d756e"
conversation_id: "681a31e2-9a88-8006-8607-0dbd637d756e"
title: "DDNS Cloudflare Swarm Docker"
extracted_at: "2026-06-29T14:51:09.004Z"
message_count: 2
provenance: auth-ui
---

# DDNS Cloudflare Swarm Docker

Source: [ChatGPT conversation](https://chatgpt.com/c/681a31e2-9a88-8006-8607-0dbd637d756e)

## User

ddns updater docker image that was made for swarm. either made specifically for swarm or works with swarm. must support cloudflare.

## Assistant

If you're seeking a Docker-based Dynamic DNS (DDNS) updater compatible with Docker Swarm and supporting Cloudflare, several options are available. Below are some solutions tailored for such environments:

1. leonpjvaughan/ddclient_cloudflare

Overview: This project provides a tutorial and configuration for running ddclient within a Docker Swarm to update Cloudflare DNS records.

Features:

Utilizes Docker secrets to securely handle Cloudflare API tokens.

Includes a docker-compose.yml file tailored for Swarm deployments.

Guides on setting up ddclient.conf for Cloudflare integration.

Usage:

Initialize Docker Swarm:

Bash
docker swarm init

Create a Docker secret for the Cloudflare API token:

Bash
docker secret create ddclient_ddns_pass /path/to/secret.txt

Deploy the stack:

Bash
docker stack deploy -c docker-compose.yml ddclient_ddns
2. oznu/cloudflare-ddns

Overview: A lightweight Docker image designed to update Cloudflare DNS records, compatible with Docker Swarm.

Features:

Supports both IPv4 (A) and IPv6 (AAAA) records.

Configurable update intervals using cron expressions.

Can utilize Docker secrets for sensitive information.

Usage:

Example docker-compose.yml snippet:

YAML
version: '3'
services:
  cloudflare-ddns:
    image: oznu/cloudflare-ddns:latest
    restart: always
    environment:
      - API_KEY=your_api_key
      - ZONE=example.com
      - SUBDOMAIN=subdomain
      - PROXIED=false
3. MarlBurroW/cloudflare-dns-swarm

Overview: A Node.js service that automatically manages Cloudflare DNS records based on Docker Swarm service labels.

Features:

Monitors Docker events to create, update, or delete DNS records.

Supports multiple DNS record types: A, AAAA, CNAME, MX, TXT.

Integrates with Docker Swarm by labeling services with DNS information.

Usage:

Deploy the service in Docker Swarm:

Bash
docker service create \
  --name cloudflare-dns \
  --env CLOUDFLARE_TOKEN=your_token \
  --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock,ro \
  --constraint 'node.role == manager' \
  marlburrow/cloudflare-dns-swarm

Label your services to manage DNS records:

Bash
docker service create \
  --name my-service \
  --label dns.cloudflare.hostname=service.example.com \
  your-image
4. pascaliske/cloudflare-dyndns

Overview: A simple Docker image to update a dynamic DNS record using the Cloudflare API.

Features:

Supports multiple architectures: amd64, arm/v7, arm64.

Configurable via environment variables.

Can be scheduled using cron or integrated into Swarm as a service.

Usage:

Run the container:

Bash
docker run --rm \
  -e CF_API_TOKEN=your_token \
  -e DOMAIN=example.com \
  -e NAME=subdomain \
  pascaliske/cloudflare-dyndns
5. hotio/cloudflareddns

Overview: A feature-rich Docker image for updating Cloudflare DNS records, supporting multiple hosts and zones.

Features:

Supports multiple domains and record types (A, AAAA).

Configurable detection modes for determining public IP.

Can be scheduled at custom intervals.

Usage:

Example docker-compose.yml snippet:

YAML
services:
  cloudflareddns:
    image: ghcr.io/hotio/cloudflareddns
    environment:
      - CF_APITOKEN=your_token
      - CF_HOSTS=host1.example.com;host2.example.com
      - CF_ZONES=example.com;example.com
      - CF_RECORDTYPES=A;AAAA

Recommendation:

For a straightforward Swarm-compatible solution, oznu/cloudflare-ddns offers simplicity and ease of integration.

If you prefer managing DNS records through service labels and desire automation, MarlBurroW/cloudflare-dns-swarm provides dynamic management based on Docker events.

For handling multiple domains and requiring advanced configurations, hotio/cloudflareddns is a robust choice.
GitHub
+1
GitHub
Hotio
+3
GitHub
+3
GitHub
+3
GitHub
pascaliske.github.io
+1
GitHub
+1
Hotio

Each of these solutions supports Cloudflare and can be integrated into Docker Swarm environments. Choose the one that best fits your specific requirements and infrastructure.
