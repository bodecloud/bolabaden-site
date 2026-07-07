---
source_url: "https://chatgpt.com/c/67de3005-f44c-8006-bc19-12bbe9167993"
conversation_id: "67de3005-f44c-8006-bc19-12bbe9167993"
title: "Jellyfin Servarr Multi-Server Setup"
extracted_at: "2026-06-29T12:03:18.641Z"
message_count: 4
provenance: auth-ui
---

# Jellyfin Servarr Multi-Server Setup

Source: [ChatGPT conversation](https://chatgpt.com/c/67de3005-f44c-8006-bc19-12bbe9167993)

## User

what is the most popular way to run jellyfin/servarr stacks with radarr/sonarr/plex, specifically configurations than span across multiple servers. Does/has anyone ever gotten this to ever work in a swarm/kubernetes?

## Assistant

Yes! Running a Jellyfin/Servarr stack (Radarr, Sonarr, etc.) across multiple servers is definitely possible, and there are a few popular approaches. Many users have set up these media stacks in Docker Swarm or Kubernetes, but it does come with some challenges.

Common Deployment Strategies

Docker Compose on Multiple Servers

This is the simplest approach, with each service running in separate containers across different hosts.

You'll need shared storage (e.g., NFS, Samba, or a cloud solution like CephFS).

A reverse proxy like Traefik or Nginx can route traffic.

Pros: Simplicity, easier troubleshooting.

Cons: Manual scaling, no automatic failover.

Docker Swarm

Swarm provides native orchestration, service discovery, and some self-healing capabilities.

You can deploy Radarr/Sonarr/Plex/Jellyfin across different nodes using docker stack deploy.

Shared storage (NFS, GlusterFS, Ceph, etc.) is necessary for persistent media.

Traefik or Caddy can be used as a load balancer and reverse proxy.

Pros: Easier than Kubernetes, built into Docker.

Cons: Limited flexibility compared to Kubernetes.

Kubernetes (K8s) Cluster

This is the most complex but scalable approach. Each service runs in its own pod, managed with Helm charts or Kustomize.

Persistent storage is tricky but solvable with Longhorn, Ceph, or NFS.

An Ingress Controller (e.g., Traefik, Nginx, or Caddy) handles service exposure.

Plex/Jellyfin would require GPU passthrough if transcoding is needed (e.g., NVIDIA GPU with nvidia-container-runtime).

Pros: Scalability, automatic failover, easy updates.

Cons: Steep learning curve, higher complexity.

Key Challenges & Solutions

Storage: Media and configs must be shared across nodes (use NFS, GlusterFS, Ceph, or a cloud NAS).

Networking: Use an overlay network (Swarm) or K8s Service discovery to route traffic.

GPU Acceleration: If transcoding is required, ensure GPU passthrough (e.g., NVIDIA device-plugin-daemonset in K8s).

Database Persistence: PostgreSQL or MariaDB should have persistent volumes (avoid SQLite in multi-server setups).

Automation: Use Ansible, Terraform, or Helm for deployment.

Has Anyone Gotten This to Work?

Yes! There are multiple successful setups of these stacks running in Swarm and Kubernetes. Check out:

The Homelab Subreddit
 (many users share working setups)

LinuxServer.io Discord
 (great container support)

TrueCharts for TrueNAS Scale
 (K8s-based

## User

what is the most popular way to run jellyfin/servarr stacks with radarr/sonarr/plex, specifically configurations than span across multiple servers. Does/has anyone ever gotten this to ever work in a swarm/kubernetes? I would like a high level flow, which server hosts what, and a visual map to understand which needs to host what. I Have these services:

## Assistant

Below is a high-level overview of how you can organize these services across multiple servers—whether in Docker Swarm or Kubernetes—along with a conceptual “map” of how everything flows. This isn’t the only way to do it, but it’s a common architecture that balances functionality and performance.

1. Typical Groupings of Services

Media Managers

Sonarr, Radarr, Lidarr, Readarr, Whisparr, Bazarr, Checkrr, Decluttarr, Recyclarr, Jellyseerr

These are your library organizers. They coordinate with downloaders, rename files, move completed downloads, and update your media server.

Download Clients

qBittorrent, Transmission, Deluge, SABnzbd

They handle torrent and/or Usenet downloads.

Indexers & Proxies

Prowlarr, Jackett, i2p, FlareSolverr

Provide search results to your media managers or help bypass certain network restrictions (e.g., Cloudflare).

Media Servers

Jellyfin, Plex

Serve the content to your users; handle transcoding. If using GPU transcoding, you’ll want to ensure that node has the GPU accessible (via Docker runtime or K8s device plugin).

Auxiliary Services

Homepage (dashboard or landing page)

cAdvisor (container metrics)

Dozzle (log viewer)

Autoheal (restarts unhealthy containers)

Speedtest (network performance checks)

Reverse Proxy / Ingress

Traefik (or Nginx, Caddy, etc.)

Routes external requests to the correct service, handles SSL/TLS, and can provide authentication or domain routing.

VPN / Network Tools

Gluetun (VPN container)

Sometimes used to run torrent or indexer traffic through a secure VPN tunnel.

2. High-Level Flow / Visual Map

Below is a textual diagram illustrating how these might be distributed across multiple servers. Imagine you have 3 nodes (physical or virtual machines), each running in a Docker Swarm or K8s cluster:

                      [ Internet / Local Network ]
                                |
                            [ Traefik ]
                       (Reverse Proxy / Ingress)
                                |
           ------------------------------------------------
           |                                              |
     [Media Manager Node]                           [Download Node]
 (Sonarr, Radarr, Lidarr, etc.)             (qBittorrent, Deluge, SABnzbd,
 (Prowlarr, Jackett, etc.)                  Transmission, FlareSolverr, i2p)
           |                                              |
           |                                              |
           |---------> [Shared/Distributed Storage] <-----|
           |              (NFS, Gluster, Ceph, etc.)       |
           |
     [Media Server Node]  <-- Possibly GPU
   (Jellyfin, Plex, Jellyseerr)
           |
           v
       [Clients]
(Your devices, TVs, phones, etc.)
Explanation

Reverse Proxy (Traefik) sits at the “front door,” receiving all inbound traffic and routing it to the correct service based on domain name/path.

Media Manager Node hosts Sonarr, Radarr, Lidarr, Readarr, Whisparr, Bazarr, etc. and also the indexer tools (Prowlarr, Jackett). These managers talk to your Download Node and to your Media Server to keep libraries in sync.

Download Node runs your torrent/Usenet containers (qBittorrent, Deluge, SABnzbd, Transmission, etc.)—often behind Gluetun if you want VPN protection.

Shared or Distributed Storage holds the actual media files so that all nodes can access the same content. This can be a NAS (e.g., TrueNAS) or a distributed filesystem (e.g., GlusterFS, Ceph).

Media Server Node (with Plex/Jellyfin) will mount the same storage location to serve media. If you require hardware transcoding, ensure this node has the GPU and that Docker/K8s is configured for GPU passthrough.

3. Key Considerations

Storage

All these services need consistent access to your media library.

You can use NFS, SMB, or a more advanced solution (e.g., GlusterFS, Longhorn in K8s, Ceph) for shared volumes.

Networking

In Docker Swarm, use an overlay network so containers can talk across nodes.

In Kubernetes, each service/pod uses a Service (ClusterIP, NodePort, or LoadBalancer) plus an Ingress (Traefik, Nginx, etc.).

Persistent Data

Config directories for each container (e.g., /config for Sonarr) should be on persistent volumes.

This is important so you don’t lose settings if a container is rescheduled to another node.

GPU Passthrough

For Plex/Jellyfin hardware transcoding, you’ll need to configure Docker with the --gpus flag or install the NVIDIA device plugin in Kubernetes.

Keep in mind that your GPU is physically located in only one machine, so that node must run the media server pods/containers.

Scalability

Media managers (Sonarr, Radarr, etc.) typically only need one running instance each.

However, you can replicate stateless services (like a “Homepage” or “Dozzle”) to multiple nodes for high availability.

Monitoring & Logging

Tools like cAdvisor, Dozzle, Prometheus, or Grafana can help track container health and resource usage across the cluster.

Autoheal can restart containers that fail health checks.

Security

If you want secure remote access, ensure HTTPS via Traefik and use strong authentication.

If you rely on a VPN for torrent/indexer traffic, route only the relevant containers (e.g., qBittorrent) through Gluetun.

4. Making It Work in Swarm vs. Kubernetes

Docker Swarm

Easier to get started if you’re comfortable with Docker Compose.

You can define a docker-stack.yml that looks similar to docker-compose.yml but supports scaling and multi-node placement.

Networking: Swarm overlay networks.

Storage: Typically an external NFS mount or GlusterFS for multi-node volumes.

Kubernetes

More powerful but has a steeper learning curve.

Typically you’d use Helm charts (many exist for Plex, Jellyfin, Radarr, etc.) or Kustomize.

Persistent Volumes (PV) + Persistent Volume Claims (PVC) for each container’s config and media library.

GPU node: Use the NVIDIA device plugin or relevant drivers.

Ingress: Use Traefik or Nginx Ingress Controller to handle external traffic.

5. Real-World Examples & Resources

r/homelab on Reddit: Many homelabbers share Docker Swarm and K8s setups for Plex/Jellyfin + Servarr.

LinuxServer.io Discord: Great for container images and community help.

TrueCharts (for TrueNAS SCALE): Helm-based K8s apps for media stacks.

Docker Swarm: Official Docker Docs
.

Kubernetes: Helm Charts for Media Stacks

In Summary

A multi-node media stack can be broken into Media Managers, Download Clients, Media Server(s), and Reverse Proxy. They all share a common storage for media files and talk to each other over an overlay network (Swarm) or via Services (K8s). You can place your media server (Plex/Jellyfin) on a GPU-enabled node for hardware transcoding, and replicate or distribute other services across nodes as needed for high availability or performance.
