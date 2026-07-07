---
source_url: "https://chatgpt.com/c/67de32b9-25b4-8006-985b-a8ae1b000ce2"
conversation_id: "67de32b9-25b4-8006-985b-a8ae1b000ce2"
title: "Multi-Server Media Stack Setup"
extracted_at: "2026-06-29T11:58:38.686Z"
message_count: 4
provenance: auth-ui
---

# Multi-Server Media Stack Setup

Source: [ChatGPT conversation](https://chatgpt.com/c/67de32b9-25b4-8006-985b-a8ae1b000ce2)

## User

You are tasked to answer a question:

what is the most popular way to run jellyfin/servarr stacks with radarr/sonarr/plex, specifically configurations than span across multiple servers. Does/has anyone ever gotten this to ever work in a swarm/kubernetes? I would like a high level flow, which server hosts what, and a visual map to understand which needs to host what. I have these services, as well as the following servers:

2 VPS's with the following specs:
- 4 core cpu arm
- 24 gb ram
- 4gb/s internet

1 gaming pc i rarely use.
- 12 core cpu x86_64
- 32gb ram
- typical home internet speeds

3 domain names:
- bolabaden.duckdns.org
- yanata.duckdns.org managed by cloudflare
- ivaros.duckdns.org

Services are typically subdomained usng traefik already, e.g. https://jellyfin.bolabaden.duckdns.org https://sonarr.bolabaden.duckdns.org.

bonus question:
- I have the domain name https://bolabaden.org. Is it possible to use this domain for all 3 servers so the end user doesn't see 3 domain names, they only ever see bolabaden.org instead of my internalized duckdns.org dynamicdns names?

your respones especially cover swarm usage (no kubernetes), which ones are stateless/stateful, and which server should run where. obviously the media we're downloading will only ever be available on one pc for example and this is why it's important for you to choose volume mounting.




Instructions for the output format:
- Consider other possibilities to achieve the result, do not be limited by the prompt.
Show more

## Assistant

Below is a high-level overview of running a multi-server Docker Swarm setup (rather than Kubernetes) for Jellyfin/Servarr (Sonarr, Radarr, etc.)/Plex, including considerations about which node should host which services, how to handle volumes, and how to present a single domain to end users. In the end, you’ll also find a visual map (ASCII-style) and an explanation about domain names. This write-up focuses on Docker Swarm but also mentions a few general alternatives.

1. Overview of the Servers

VPS #1 (ARM)

4 CPU cores (ARM)

24 GB RAM

4 Gbps internet

VPS #2 (ARM)

4 CPU cores (ARM)

24 GB RAM

4 Gbps internet

Gaming PC (x86_64)

12 CPU cores

32 GB RAM

Typical home internet speeds

Local media storage

Why Use All Three?

VPS #1 and VPS #2 have excellent network speeds but are ARM-based. Great for running services that are not heavily dependent on x86 CPU instructions (like hardware transcoding for certain codecs) or that just need general-purpose computing (e.g., Sonarr, Radarr, smaller overhead apps).

Gaming PC has more raw CPU power and the physical disks with media. While home internet may be slower, it is the “natural” place to store media because it’s presumably always on, can handle local disk volumes, and can offload CPU-intensive tasks (like transcoding) if your bandwidth is sufficient.

2. High-Level Service Layout

Below is a suggested layout in a Docker Swarm context. The services are divided into stateless and stateful:

2.1 Stateless vs. Stateful

Stateless: Services that do not store significant data locally or can store ephemeral data in containers (e.g., Traefik, some proxy/caching layers, or “front-end” UI).

Stateful: Services that require persistent storage (e.g., Jellyfin, Plex, Sonarr, Radarr, etc., because each has internal databases/config files, or they store downloaded media).

2.2 Which Services Go Where?

Traefik (Reverse Proxy)

Run it on all Swarm nodes in a replicated or global mode.

Because you want to route traffic to whichever node is running the actual container, Traefik is typically the “entry point” to the entire cluster.

You’ll configure DNS for bolabaden.org (or your subdomains) to point to the public IP(s) of your VPS(s).

In Swarm, Traefik can use the routing mesh or direct host networking.

Sonarr, Radarr, Lidarr, Prowlarr, etc. (Servarr Family)

These are relatively lightweight on CPU, but they each store configuration data (stateful).

They also need direct access to the media storage (so they can rename or move files) and to the download client.

Easiest approach is to run them on the Gaming PC (where the media is physically located) to avoid complexities of remote mounting.

Alternatively, if the gaming PC is behind NAT or has slower upload speeds, you could run them on the VPS, but you would need to mount the gaming PC’s storage over NFS/SSHFS or a similar network file system. That can introduce complexities or performance constraints.

Download Clients (qBittorrent, Deluge, Sabnzbd, Transmission, etc.)

Same logic as Servarr. They are stateful (config + partial/in-progress downloads).

Usually best to run them where the media disk physically resides (the Gaming PC) to avoid moving large downloads across the internet.

Jellyfin / Plex / Emby / etc.

These are also stateful (they store metadata, user watch states, etc.).

If you want local transcoding and direct access to the local disk with minimal bandwidth constraints, run them on the Gaming PC.

If you have extremely fast internet on the VPS and you want remote transcoding, you could place Jellyfin/Plex on the VPS, but you’d still need to mount or sync the actual media from the Gaming PC. This often becomes more complicated than it’s worth, especially if your home internet is the bottleneck.

Indexers (Jackett, Prowlarr)

Minimal CPU usage.

Typically stateful for config, but small footprint.

They only need to communicate with the internet and the Servarr apps.

Could run on either the VPS or the Gaming PC. If you want to keep them near Sonarr/Radarr, run them on the Gaming PC to reduce potential NAT complexities.

Misc. Tools (Glutun, VPN, i2p, etc.)

Where you run these depends on your security or networking preferences.

If you’re using a VPN container for your download clients, keep it on the same node as the download clients to simplify container networking.

2.3 Volumes & Persistence

Gaming PC:

Has the local media storage.

You’d define Docker volumes or bind mounts for /path/to/media, /config/sonarr, /config/radarr, etc.

Swarm mode can still run containers on that node only, by setting constraints (e.g., node.labels.media == true).

Keep in mind you want each of those containers to have deploy: placement: constraints: [node.labels.media == true].

VPS Nodes:

Usually hold only stateless containers or small config volumes if you want redundancy.

If a service is truly stateless (like a front-end or a reverse proxy) or can store minimal config in a small volume, it’s fine to replicate across VPS nodes.

If you do place stateful apps here, you need a robust way to handle persistent volumes (e.g., NFS, GlusterFS, or some distributed file system).

3. Docker Swarm Flow

Below is an example of how requests might flow when a user visits Jellyfin:

User visits jellyfin.bolabaden.org in a browser.

DNS for jellyfin.bolabaden.org points to the public IP of VPS #1 (or #2).

Traefik on that VPS receives the request.

Traefik sees the Host: jellyfin.bolabaden.org header, forwards traffic to the Jellyfin container running on the Gaming PC via the Swarm overlay network.

Jellyfin responds to Traefik, which returns the response to the user.

For Sonarr or Radarr:

The same pattern: the user goes to sonarr.bolabaden.org, hits the VPS, which routes to the container on the Gaming PC.

When Sonarr triggers a download:

Sonarr is on the Gaming PC with direct local access to the download client and media.

The only remote calls are out to indexers or to the internet.

4. Visual Diagram (ASCII-Style)
                  +-----------------+
                  |   Cloudflare?   |  (Optional DNS or direct duckdns)
                  +--------+--------+
                           |
                   bolabaden.org
                           |
                  +--------v--------+
                  |    VPS #1       |  (Swarm Manager/Worker)
                  |  (Traefik)      |
                  +--------+--------+
                           |  (Swarm overlay network)
                  +--------v--------+
                  |    VPS #2       |  (Swarm Manager/Worker)
                  |  (Traefik)      |
                  +--------+--------+
                           |  (Swarm overlay network)
                  +--------v--------+
                  |  Gaming PC      |  (Swarm Manager/Worker)
                  |  (Media)        |
                  |  Sonarr,Radarr, |
                  |  Jellyfin/Plex, |
                  |  qBittorrent... |
                  +-----------------+
                           |
                      Local Volumes
                     /mnt/media, etc.

Each node is part of the same Docker Swarm.

Traefik is deployed in a mode that ensures at least one instance is always running on the VPS nodes (where you have fast, publicly accessible internet).

All media-related containers are placed on the Gaming PC node via placement constraints.

5. Bonus: Using a Single Domain Name (bolabaden.org)

Yes, you can definitely do this. A typical approach:

Register bolabaden.org with a DNS provider (Cloudflare or any other).

DNS Setup

Create an A record (or CNAME) for bolabaden.org that points to the public IP of VPS #1.

Optionally, do the same for VPS #2 as a failover.

Or use a Load-Balancer if you have that option.

For each sub-service (jellyfin, sonarr, radarr, etc.), create CNAME entries like jellyfin.bolabaden.org → bolabaden.org.

Traefik Configuration

Traefik will have Host: jellyfin.bolabaden.org rules that route to the Jellyfin container.

Same for sonarr.bolabaden.org, etc.

You can use Let’s Encrypt or Cloudflare-provided certificates for TLS.

Result:

End users never see duckdns.org. They only see bolabaden.org (and subdomains if you want).

The underlying dynamic DNS updates can happen in the background; you just keep your A record or CNAME pointed to the correct place.

You can effectively hide all references to duckdns.org if you keep your bolabaden.org DNS updated and route everything via your reverse proxy.

6. Other Possibilities

Direct NFS/SMB Mounts:

If you absolutely must run Sonarr/Radarr on the VPS for some reason, you could mount the Gaming PC’s media folder via NFS or SMB over the internet. This is not recommended unless you have secure tunnels (WireGuard, Tailscale, or a VPN container). Performance can also suffer.

One Node Only:

You could run everything on the Gaming PC and just let the VPS be a reverse proxy that routes traffic to the Gaming PC. This is simpler but doesn’t leverage the VPS for CPU or container distribution.

Syncthing or Rclone:

If you want to store “some” media on the VPS for faster external streaming, you could sync certain media from the Gaming PC to a VPS. Jellyfin on the VPS would read from that copy. This is more advanced and may not be worth it unless you have a strong reason.

Swarm vs. Docker Compose:

If your usage is small, you could just do multiple Docker Compose setups. But Swarm is beneficial if you want a single orchestrated cluster.

Summary

Stateless services (like Traefik or purely ephemeral microservices) can run anywhere, typically the VPS nodes for high availability.

Stateful media services (Jellyfin/Plex, Sonarr, Radarr, download clients) run best on the Gaming PC where the actual media disk resides.

Docker Swarm is fully capable of orchestrating this, with Traefik as the edge router on the VPS nodes, forwarding requests to the Gaming PC over the overlay network.

Domain: Absolutely you can use bolabaden.org for all services. Configure DNS and reverse proxy rules so that *.bolabaden.org subdomains route to the correct containers, hiding any duckdns references.

That’s the big picture. This setup should work well as long as you keep the Gaming PC online (for media) and use the VPS as your “public face” with Traefik, ensuring quick, stable ingress and letting Swarm handle container distribution.

## User

your response should cover each and every service in the photo...

## Assistant

Below is a comprehensive overview of how you might deploy each service listed in your screenshot, along with guidance on stateless vs. stateful, where to run them (VPS vs. Gaming PC), volume mounting, and general best practices in Docker Swarm. The final section recaps the flow and how to present a single domain (bolabaden.org) for all services.

1. Servers & Basic Assumptions

You have three servers:

VPS #1 (ARM)

4-core CPU, 24 GB RAM, 4 Gbps internet

Docker Swarm node

VPS #2 (ARM)

4-core CPU, 24 GB RAM, 4 Gbps internet

Docker Swarm node

Gaming PC (x86_64)

12-core CPU, 32 GB RAM, typical home internet speeds

Local media storage (movies, TV, music, etc.)

Docker Swarm node

Since the Gaming PC holds the actual media files, any application that needs direct or fast access to those files is best placed on the Gaming PC. You can still route traffic in/out from the VPS nodes (which have faster public connectivity) via your Swarm overlay network.

2. Per-Service Breakdown

Below is a breakdown of each service from your list, grouped by category. For each, we note:

Stateful vs. Stateless: Whether it needs persistent data (configs, databases, media).

Where to Run: VPS #1, VPS #2, or Gaming PC.

Volume Mounting: Any special volume or config considerations.

A. Monitoring & Utility Services
1. cAdvisor

Purpose: Monitors container resource usage.

Stateful or Stateless: Stateless (only ephemeral metrics).

Where to Run: You can run cAdvisor on all Swarm nodes in “global” mode. That way, you get metrics from every node.

Volume Mounting: Typically just read-only access to Docker’s /var/run/docker.sock or /sys/fs/cgroup. No large persistent storage needed.

2. autoheal

Purpose: Monitors containers’ health checks and restarts them if unhealthy.

Stateful or Stateless: Stateless.

Where to Run: Usually run a single instance that can see all containers in the Swarm (or one per node in global mode).

Volume Mounting: Needs Docker socket (/var/run/docker.sock) so it can restart containers.

B. Reverse Proxy, Networking, & Dashboards
3. traefik

Purpose: Reverse proxy, entry point for your subdomains, handles SSL.

Stateful or Stateless: Stateful if you store Let’s Encrypt certificates on disk (small config), but generally minimal.

Where to Run: VPS #1 and VPS #2 for high availability. Let them handle incoming traffic at 4 Gbps.

Volume Mounting:

A persistent volume or bind mount for storing acme.json (TLS cert data).

Docker socket if you’re using Traefik’s Docker provider.

4. gluetun

Purpose: VPN container, typically used to route other containers (like torrent clients) through a VPN tunnel.

Stateful or Stateless: Stateful only for config files, which are minimal.

Where to Run:

If you want your download clients behind a VPN, run Gluetun on the same node as those clients (Gaming PC or whichever node you place torrent containers on).

Volume Mounting: Minimal, just store config or credentials for your VPN provider.

5. homepage

Purpose: A simple “home dashboard” for links, status, etc.

Stateful or Stateless: Usually stateless or lightly stateful (some config or user data).

Where to Run:

You can run it on any node, but typically a VPS so it’s always accessible.

Or put it on the Gaming PC if you want local network access only.

Volume Mounting: A small bind mount for config (like a config.yml).

C. Privacy / Tor / i2p / Bypassing Tools
6. i2p

Purpose: Anonymizing network layer.

Stateful or Stateless: Minimal state (some config, peer info).

Where to Run:

Typically run on a VPS if you want high bandwidth, or on the same node as a service that needs i2p.

Volume Mounting: Minimal. Possibly store i2p config on a small volume.

7. flaresolverr

Purpose: Helps bypass Cloudflare challenges for indexers or scraping.

Stateful or Stateless: Mostly stateless except for small config/logs.

Where to Run:

Place it near the applications that need it (Jackett, Prowlarr, etc.).

Could be on the Gaming PC if that’s where your *arr or Jackett is.

Volume Mounting: Minimal. Typically just environment variables or a small config.

D. Media Servers
8. plex

Purpose: Media server for streaming.

Stateful or Stateless: Stateful (database, watch states, plus direct media access).

Where to Run:

Gaming PC is recommended. You have the local disk for media, plus x86_64 hardware for transcoding.

Volume Mounting:

Bind mount your media library directories (/media or similar).

Persistent config volume for Plex’s database (/config).

9. jellyfin

Purpose: Open-source media server (alternative to Plex).

Stateful or Stateless: Stateful.

Where to Run:

Gaming PC for the same reasons as Plex (local disk access + CPU for transcoding).

Volume Mounting:

Bind mount your media library.

Persistent config volume (/config/jellyfin).

E. Download Clients

(All download clients are stateful because they store partial downloads, config, and completed files. They also need local or network access to your final media directories.)

10. deluge

Where to Run:

Typically on the Gaming PC, so completed downloads are immediately local.

If you prefer, you can run it on a VPS, but then you’d have to move large files over the internet to the Gaming PC.

Volume Mounting:

/config/deluge for config,

/downloads pointing to local storage or a dedicated path for partial/in-progress downloads.

11. qbittorrent

Where to Run:

Same logic as Deluge. Typically the Gaming PC.

Volume Mounting:

/config/qbittorrent,

/downloads.

12. sabnzbd

Where to Run:

Typically Gaming PC if you do local media storing.

If you have unlimited bandwidth on the VPS, you could run it there but you’ll still need to transfer final files.

Volume Mounting:

/config/sabnzbd,

/downloads.

13. transmission

Where to Run:

Same logic as Deluge/qBittorrent.

Volume Mounting:

/config/transmission,

/downloads.

F. Indexers & Indexer Aggregators
14. jackett

Purpose: Proxy for torrent trackers, used by Sonarr/Radarr.

Stateful or Stateless: Stateful (stores indexer configs, login credentials).

Where to Run:

Could be on the Gaming PC near Sonarr/Radarr for simpler local networking.

Or on a VPS if you want more stable public IP or better tracker connectivity.

Volume Mounting:

/config/jackett.

15. prowlarr

Purpose: Another aggregator for indexers, can feed Sonarr, Radarr, etc.

Stateful or Stateless: Stateful (stores indexer configs).

Where to Run:

Typically keep it close to your *arr apps to minimize cross-node traffic. So, likely on the Gaming PC.

Volume Mounting:

/config/prowlarr.

G. The *Arr Ecosystem

*(All Arr apps store internal databases, configurations, and require local or network access to your media. They are typically stateful.)

16. sonarr

Purpose: Manages TV shows.

Stateful or Stateless: Stateful.

Where to Run:

Gaming PC so it can rename and move completed downloads locally.

Volume Mounting:

/config/sonarr,

Access to your TV shows folder, e.g. /media/tv.

17. radarr

Purpose: Manages movies.

Stateful or Stateless: Stateful.

Where to Run:

Gaming PC, same reasons as Sonarr.

Volume Mounting:

/config/radarr,

Access to your movies folder, e.g. /media/movies.

18. bazarr

Purpose: Manages subtitles for your media.

Stateful or Stateless: Stateful (stores config, downloaded subs).

Where to Run:

Gaming PC with direct access to the same media directories as Plex/Jellyfin.

Volume Mounting:

/config/bazarr,

Access to the media library.

19. lidarr

Purpose: Manages music library.

Stateful or Stateless: Stateful.

Where to Run:

Gaming PC if you store music locally.

Volume Mounting:

/config/lidarr,

/media/music.

20. readarr

Purpose: Manages eBooks/audiobooks.

Stateful or Stateless: Stateful.

Where to Run:

Gaming PC, same pattern if your eBook library is stored locally.

Volume Mounting:

/config/readarr,

/media/books.

21. whisparr

Purpose: Adult content manager (similar to Radarr/Sonarr).

Stateful or Stateless: Stateful.

Where to Run:

Gaming PC, again for local file handling.

Volume Mounting:

/config/whisparr,

Access to adult media folder.

22. checkrr

Purpose: Checks for missing episodes/movies across your *Arr apps, syncs them, etc.

Stateful or Stateless: Stateful (stores config, though not large).

Where to Run:

Gaming PC, close to your *Arr apps.

Volume Mounting:

/config/checkrr.

23. decluttarr

Purpose: Helps remove older episodes/movies from your library (storage management).

Stateful or Stateless: Stateful (small config).

Where to Run:

Gaming PC, to directly remove files from local storage.

Volume Mounting:

/config/decluttarr.

24. recyclarr

Purpose: Synchronizes settings between your *Arr apps (e.g., quality profiles, indexers).

Stateful or Stateless: Stateful (config).

Where to Run:

Gaming PC near the rest of the *Arr suite.

Volume Mounting:

/config/recyclarr.

25. jellyseerr

Purpose: A request management UI for Jellyfin (similar to Overseerr for Plex).

Stateful or Stateless: Stateful (stores user requests, config, database).

Where to Run:

Gaming PC, if Jellyfin is local.

Volume Mounting:

/config/jellyseerr.

H. Putting It All Together

Most *Arr apps, media servers (Plex/Jellyfin), and download clients should run on the Gaming PC to keep the workflow local:

Download → Rename/Organize → Serve to clients.

On the VPS nodes, you’d typically run:

traefik (reverse proxy)

Possibly a global cAdvisor

Possibly some ephemeral or low-state services if you want high availability

Tools like flaresolverr or i2p if you prefer them to have stable public IPs.

3. Docker Swarm Deployment Approach
3.1 Labels & Placement Constraints

In your docker-stack.yml (Swarm file), define node labels. For instance, on the Gaming PC, label it media==true.

Then, for each container that needs local media access, specify:

YAML
deploy:
  placement:
    constraints:
      - node.labels.media == true

That ensures the container only runs on the Gaming PC.

3.2 Volumes & Networking

For each stateful service on the Gaming PC, define volumes (e.g., sonarr_config, plex_config) or bind mounts (/path/to/media).

Traefik on the VPS nodes will create an overlay network that can route requests to the Gaming PC containers.

3.3 Flow Example

When a user goes to jellyfin.bolabaden.org:

DNS points jellyfin.bolabaden.org → VPS #1 or VPS #2 (public IP).

Traefik on the VPS sees the incoming request, sees Host: jellyfin.bolabaden.org, and routes it via the Swarm overlay network to Jellyfin on the Gaming PC.

Jellyfin responds back through the overlay network, Traefik returns data to the user.

All media access is local to the Gaming PC, so no big file transfers to the VPS are needed.

4. Single Domain Name (bolabaden.org)

Yes, you can absolutely present all services under bolabaden.org (and subdomains) instead of using duckdns.org directly. Here’s how:

DNS

You own bolabaden.org. Point an A record (or CNAME) to your VPS #1’s public IP. Optionally do the same for VPS #2 as a failover.

For sub-services, create CNAME records: jellyfin.bolabaden.org, sonarr.bolabaden.org, etc., all pointing to your main domain or IP.

Traefik Configuration

In your docker-stack.yml or dynamic config, create router rules:

YAML
http:
  routers:
    jellyfin:
      rule: "Host(`jellyfin.bolabaden.org`)"
      service: jellyfin-svc
      tls: true

Let’s Encrypt or Cloudflare DNS validation can handle SSL certificates.

End Result

Users only see bolabaden.org subdomains. The underlying duckdns.org dynamic DNS is hidden.

5. Summary

Stateful services:

*Arr apps (Sonarr, Radarr, Whisparr, Lidarr, Bazarr, etc.),

Media servers (Plex, Jellyfin),

Download clients (Deluge, qBittorrent, SABnzbd, Transmission),

Aggregators/indexers (Jackett, Prowlarr, Jellyseerr).

Recommended to run on the Gaming PC with local media volumes.

Stateless (or lightly stateful) services:

Traefik, cAdvisor, autoheal, flaresolverr, i2p, homepage, gluetun, etc.

Typically run on VPS #1 / VPS #2 for better external bandwidth.

Volumes:

Use local bind mounts on the Gaming PC for media.

For each service, define a persistent config volume.

Constrain services that need media access to the Gaming PC node in Swarm.

Network:

Traefik on the VPS nodes is your main entry.

Swarm overlay networks route traffic to the Gaming PC.

Domain:

Use bolabaden.org for everything.

Subdomains → Traefik → correct container.

By following these guidelines, you can orchestrate a fully functional multi-server Swarm stack that cleanly separates concerns, keeps large file transfers local to your Gaming PC, and uses your VPS nodes as powerful, high-bandwidth front ends.
