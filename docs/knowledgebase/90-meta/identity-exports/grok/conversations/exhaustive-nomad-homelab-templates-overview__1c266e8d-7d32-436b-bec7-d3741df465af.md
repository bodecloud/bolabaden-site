---
source_url: "https://grok.com/c/1c266e8d-7d32-436b-bec7-d3741df465af"
conversation_id: "1c266e8d-7d32-436b-bec7-d3741df465af"
title: "Exhaustive Nomad Homelab Templates Overview"
extracted_at: "2026-06-29T16:12:43.887Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Exhaustive Nomad Homelab Templates Overview

Source: [Grok conversation](https://grok.com/c/1c266e8d-7d32-436b-bec7-d3741df465af)

## User

_Time: 2026-01-13T03:30:09.402Z_

Find GitHub starter clusters or homelab/self-hosted templates for Nomad that provide a full, exhaustive template/starter cluster with all the comprehensive and popular services/containers that most clusters use. Examples include Traefik, DDNS, SearxNG, Grafana, Prometheus, and other common essential services. To clarify, I want project templates that are **so exhaustive that anything I might ever want to do is already included**. I prefer having too much pre-configured by default rather than a minimalistic template that leaves me asking, “wtf do I do to add this?” Focus on **Nomad-specific starter clusters**, modern best practices, and comprehensive setups. The goal is a fully functioning Nomad cluster that is **stable, well-documented, and provides a significantly exhaustive amount of default jobs/services** so I don’t have to manually expand the cluster after setup. Ignore whether the project is repo-based, GitOps-focused, or a single source of truth. That’s irrelevant. I just want a **Nomad cluster fully set up, following best practices, with a large default set of useful services/pods/jobs**.

## Assistant

_Time: 2026-01-13T03:31:55.487Z_

### Key Recommendations
Several GitHub repositories offer Nomad-specific homelab templates with pre-configured jobs for self-hosted services. The most exhaustive option prioritizes a large default set of stable, well-documented jobs following modern practices like portable HCL files, Consul integration, and persistent storage.

- **Top choice for exhaustiveness**: perrymanuk/hashi-homelab stands out with **77 pre-configured Nomad jobs** across 10 categories, including media stacks, AI/ML tools, observability, personal cloud, and smart home services. It includes Traefik, Grafana, Prometheus, and many others—ideal if you prefer over-configuration to avoid manual additions.
- **Strong runner-up**: aldoborrero/hashi-homelab provides **35 services**, focusing on media management, monitoring (Grafana, Prometheus, Loki), and essentials like Traefik and Bitwarden.
- Other solid options like davidsbond/homad offer fewer (around 9-10) but still useful services with Terraform management.
- No single template includes absolutely everything (e.g., SearxNG is rare), but these lean toward comprehensive setups with popular containers.

These repositories focus purely on Nomad orchestration, often with Consul for discovery and best practices for HA where possible.

### Notable Repositories
Here are the standout Nomad homelab templates, prioritized by comprehensiveness:

- **perrymanuk/hashi-homelab** (https://github.com/perrymanuk/hashi-homelab)  
  Highly exhaustive with 77 jobs. Deploy via Makefile targets for individual services or categories. Includes core infra (Traefik HA, CoreDNS, Tailscale), full observability, media servers, AI tools (Ollama), and more. Perfect for a "batteries-included" cluster.

- **aldoborrero/hashi-homelab** (https://github.com/aldoborrero/hashi-homelab)  
  35 pre-built jobs, strong in media automation (Plex, Radarr/Sonarr stack) and monitoring. Easy deployment with Makefile.

- **davidsbond/homad** (https://github.com/davidsbond/homad)  
  Terraform-managed with services like Traefik, Grafana, Prometheus, Bitwarden, Home Assistant, and PiHole. Smaller but polished for HA.

For setup, most assume a running Nomad/Consul cluster and use persistent storage (e.g., NFS). Review and customize jobs for your hardware.

---

### Comprehensive Overview of Nomad Homelab Templates
Nomad users often seek starter clusters that go beyond minimal infrastructure, providing a rich set of default jobs for common self-hosted services. While Kubernetes and Docker Compose dominate homelab discussions, Nomad's lightweight orchestration makes it appealing for efficient, single-binary deployments with Consul and Vault integration. Community templates vary from infra-focused (core stack only) to highly exhaustive (dozens of apps). The search prioritized repositories with large pre-configured job sets, modern practices (e.g., HCL portability, service discovery, persistent volumes), stability indicators (documentation, Makefile/automation), and inclusion of popular services like reverse proxies, monitoring, media tools, and privacy essentials.

A curated list like awesome-nomad highlights several, but deeper inspection reveals a clear leader in exhaustiveness: perrymanuk/hashi-homelab. Its 77 jobs cover nearly every common homelab category, making it the closest to a "deploy once, have everything" template. It emphasizes lightweight, flexible deployments with recent updates for HA (e.g., Traefik redesign) and modern additions (AI/ML stack). aldoborrero/hashi-homelab follows closely with a focused but still broad 35-service set, inspired directly by the former. Smaller repos like davidsbond/homad or kencx/homelab excel at clean infrastructure but require more manual job additions.

#### Comparison of Key Templates
The table below compares the top repositories by scale, key features, and included services:

| Repository                  | Approx. Jobs/Services | Stars (approx.) | Key Strengths                          | Notable Included Services                                                                 | Exhaustiveness Level                  |
|-----------------------------|-----------------------|-----------------|----------------------------------------|-------------------------------------------------------------------------------------------|---------------------------------------|
| perrymanuk/hashi-homelab   | 77                    | Not specified  | 10 categories, Makefile deployment, HA elements | Traefik (HA), Grafana, Prometheus, Loki, Plex/Radarr/Sonarr/Overseerr, Ollama/Open-WebUI, Nextcloud, Bitwarden, Home Assistant, PiHole-like elements, gcp-dns-updater (DDNS-like) | Highest – covers media, AI, smart home, observability, cloud |
| aldoborrero/hashi-homelab   | 35                    | 234            | Media-heavy, Packer for VMs            | Traefik, Grafana, Prometheus, Loki, AlertManager, Plex/Radarr/Sonarr/Bazarr, Bitwarden, PiHole, Postgres, Heimdall | High – strong media/monitoring focus |
| davidsbond/homad           | ~9                    | 45             | Terraform-driven, HA cluster           | Traefik, Grafana, Prometheus, Bitwarden, Home Assistant, Minio, PiHole, Postgres         | Medium – solid core + select apps    |
| kencx/homelab              | Limited apps (infra-focused) | 212     | Proxmox integration, Ansible/Terraform | Traefik (Let's Encrypt), Minio, Postgres, core HashiCorp stack                            | Low-medium – great infra, fewer apps |
| mr-karan/homelab           | 4                     | 274            | Older but clean Ansible/Terraform      | PiHole, Gitea, Syncthing, Shynet                                                          | Low – minimal apps                   |

#### Detailed Highlights from the Most Exhaustive Template
perrymanuk/hashi-homelab exemplifies the "too much by default" approach:
- **Observability (7 jobs)**: Full stack with Prometheus, Grafana, Alertmanager (persistent + notifications), Loki/Vector for logs, Telegraf, Blackbox-exporter.
- **Media Stack (16 jobs)**: Comprehensive Plex ecosystem including Sonarr, Radarr, Lidarr, SABnzbd, qBittorrent, Overseerr, Navidrome.
- **AI/ML (8 jobs)**: Modern additions like Ollama, Open-WebUI, LiteLLM, pgvector for vector search.
- **Personal Cloud (4 jobs)**: Nextcloud, Bitwarden, Paperless, Radicale.
- **Smart Home (5 jobs)**: Home Assistant, Zigbee2MQTT, MQTT, Deconz.
- **Core Infra (13 jobs)**: Traefik (HA), CoreDNS (HA), Tailscale, Keepalived, GitHub Runner.
- Other categories add databases (Postgres, Redis, Neo4j, Qdrant), web apps (Heimdall, WordPress), and misc utilities (Gitea, OctoPrint, gcp-dns-updater for dynamic DNS needs).

Deployment is straightforward post-Nomad/Consul setup: use `.envrc` for variables and Makefile for targeted rolls (e.g., `make deploy-media-stack`). It assumes NFS for persistence but includes CSI plugins for flexibility.

aldoborrero/hashi-homelab offers similar breadth in media/monitoring but halves the job count, making it slightly less overwhelming while still covering essentials.

No template universally includes SearxNG (a privacy-focused search engine), but extensibility is high—adding custom jobs is simple in Nomad. DDNS needs are partially met via tools like gcp-dns-updater.

These setups align with best practices: containerized jobs, service mesh exposure, health checks, and separation of infra from apps. For stability, start with core deployments (`make deploy-base` in perrymanuk) and expand gradually.

**Key Citations**
- https://github.com/perrymanuk/hashi-homelab
- https://github.com/aldoborrero/hashi-homelab
- https://github.com/davidsbond/homad
- https://github.com/korchasa/awesome-nomad
- https://github.com/kencx/homelab
