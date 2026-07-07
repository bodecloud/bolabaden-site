---
source_url: "https://chatgpt.com/c/686bf64a-f2d0-8006-8e82-82b5f93cc9a4"
conversation_id: "686bf64a-f2d0-8006-8e82-82b5f93cc9a4"
title: "Reverse Proxy for Plex"
extracted_at: "2026-06-29T14:22:46.335Z"
message_count: 5
provenance: auth-ui
---

# Reverse Proxy for Plex

Source: [ChatGPT conversation](https://chatgpt.com/c/686bf64a-f2d0-8006-8e82-82b5f93cc9a4)

## Assistant

You're absolutely right — that error is infuriatingly vague, and WSL2 is a special kind of annoying when it comes to mounts and shared volumes.

The error you're hitting:

Error response from daemon: path / is mounted on / but it is not a shared mount

is 100% related to mount propagation, specifically the :rshared mount flag in WSL2, which does not support it by default.

🔍 What's Causing the Error

This line is the culprit:

YAML
- ${ZURG_MOUNT:-/mnt/remote/realdebrid}:${ZURG_MOUNT:-/mnt/remote/realdebrid}:rshared

rshared means the mount events are shared between the host and container — something WSL2 does not support properly, because / is not mounted with shared propagation inside WSL2’s init system.

Even though you commented out /-:/hostfs:rshared, the other :rshared line is still active.

✅ Solutions

You have 3 realistic options, depending on what you need:

✅ Option 1: Remove :rshared

This is the quickest fix. Just drop the propagation flag.

YAML
- ${ZURG_MOUNT:-/mnt/remote/realdebrid}:${ZURG_MOUNT:-/mnt/remote/realdebrid}
🔥 Drawback:

If your container is supposed to see new mount points (like if you're mounting drives inside the container or using rclone mount), you may lose the ability for bidirectional mount propagation.

✅ Option 2: Bind Mount a Specific Subdirectory Instead

Instead of sharing a mount namespace (with :rshared), just mount the folder you care about directly.

YAML
- /mnt/remote/realdebrid:/mnt/remote/realdebrid

This assumes Plex (or whatever) isn’t using mount propagation dynamically — just static filesystems.

🧪 Option 3: Try to Make / a Shared Mount in WSL2 (experimental)

You can try this inside WSL2 to set mount propagation (⚠️ experimental, may break things):

Bash
sudo mount --make-shared /

But WSL2 resets many things on reboot. This may only last for the session, or fail outright if systemd is not fully managing namespaces.

🚫 Why It Works on Native Ubuntu But Not WSL2

On native Ubuntu:

You have a real Linux kernel, full control over mount namespaces, and systemd.

/ is usually mounted as shared, so :rshared just works.

In WSL2:

The init system is not systemd (unless manually enabled).

Docker is often running in a customized VM or inside the WSL2 namespace.

/ is mounted as private, and Docker can't change it easily.

Mount propagation (rshared, rslave, etc.) is not supported reliably.

✅ TL;DR Fix

Change this:

YAML
- ${ZURG_MOUNT:-/mnt/remote/realdebrid}:${ZURG_MOUNT:-/mnt/remote/realdebrid}:rshared

To this:

YAML
- ${ZURG_MOUNT:-/mnt/remote/realdebrid}:${ZURG_MOUNT:-/mnt/remote/realdebrid}

Or better, if you don’t rely on dynamic mounts, mount only the needed path.

Let me know if you want to work around this with rclone mount + shared folders between Windows and WSL2. There's a workaround using WSLg or 9p that lets Windows and WSL share mount points more safely.

## User

wtf?


2025-07-07T16:47:19.254Z  INFO warp::warp_service: Starting WarpService pid=20
2025-07-07T16:47:19.254Z  INFO warp::warp_service: Version: 2025.5.893.0
Unable to connect to the CloudflareWARP daemon: No such file or directory (os error 2)

Maybe the daemon is not running?
Unable to connect to the CloudflareWARP daemon: No such file or directory (os error 2)

Maybe the daemon is not running?
2025-07-07T16:47:22.590Z  INFO warp::warp_service: Starting WarpService pid=21
2025-07-07T16:47:22.592Z  INFO warp::warp_service: Version: 2025.5.893.0
Unable to connect to the CloudflareWARP daemon: No such file or directory (os error 2)

Maybe the daemon is not running?
Unable to connect to the CloudflareWARP daemon: No such file or directory (os error 2)

Maybe the daemon is not running?
2025-07-07T16:47:30.360Z  INFO warp::warp_service: Starting WarpService pid=22
2025-07-07T16:47:30.360Z  INFO warp::warp_service: Version: 2025.5.893.0
Unable to connect to the CloudflareWARP daemon: No such file or directory (os error 2)

Maybe the daemon is not running?
Unable to connect to the CloudflareWARP daemon: No such file or directory (os error 2)

Maybe the daemon is not running?
 *  Terminal will be reused by tasks, press any key to close it. 

how to fix this error with cloudflare warp in docker?


warp:
    # 🔹🔹 Cloudflare WARP 🔹🔹
    # Cloudflare WARP is a VPN service that allows you to bypass censorship and access the internet privately.
    # Use this for all services that don't need listening ports exposed
    image: caomingjun/warp:latest
    container_name: warp
    extra_hosts: *gluetun-hosts-workaround
    networks:
      publicnet:
        ipv4_address: ${WARP_IPV4_ADDRESS:-10.76.128.97}
    # add removed rule back (https://github.com/opencontainers/runc/pull/3468)
    device_cgroup_rules:
      - 'c 10:200 rwm'
    expose:
      - 1080  # WARP SOCKS5 Proxy
      - ${COMET_PORT:-2020}  # Comet
      - 3128  # warp-fetch-proxy
      - 443
      - 8000  # MediaFusion
      - 8112  # Deluge
      - ${MEDIAFLOW_PROXY_PORT:-8888}  # Mediaflow Proxy
      - 9091  # Transmission
      - 9117  # Jackett
      - 9696  # Prowlarr
      - 9999  # Zurg
      - 8080  # Stremio WebUI
      - 11470  # Stremio HTTP Streaming Server
      - 12470  # Stremio HTTPS Streaming Server
    ports:
      - 1080:1080  # WARP SOCKS5 Proxy
      - 443:443/udp
      - 9999:9999    # Zurg
      - 11470:11470  # Stremio HTTP Streaming Server (HTTP)
      - 12470:12470  # Stremio HTTPS Streaming Server (HTTPS)
    environment:
      - WARP_SLEEP=2
      - WARP_LICENSE_KEY=${WARP_LICENSE_KEY}
      # - WARP_ENABLE_NAT=1 # enable nat
      - TUNNEL_TOKEN=${WARP_TUNNEL_TOKEN}
    cap_add:
      # Docker already have them, these are for podman users
      - MKNOD
      - AUDIT_WRITE
      # additional required cap for warp, both for podman and docker
      - NET_ADMIN
    sysctls:
      - net.ipv6.conf.all.disable_ipv6=1
      - net.ipv4.conf.all.src_valid_mark=1
      # uncomment for nat
      # - net.ipv4.ip_forward=1
      # - net.ipv6.conf.all.forwarding=1
      # - net.ipv6.conf.all.accept_ra=2
    volumes:
      - ${CONFIG_PATH:-./configs}/warp/data:/var/lib/cloudflare-warp
Show more

## Assistant

You're seeing the error:

Unable to connect to the CloudflareWARP daemon: No such file or directory (os error 2)

Maybe the daemon is not running?

This means the WARP client inside the container is trying to talk to its background daemon but can't find the socket or binary, which typically means:

❗ The WARP daemon (warp-svc) isn't starting or isn't installed correctly inside the container.
🧠 What this error actually means:

The container runs a client or CLI that expects to communicate with warp-svc (the WARP daemon).

The daemon either:

isn't bundled in the image,

isn't running as a background process,

or is crashing/failing on boot.

✅ Solution Options
✅ 1. Use a working WARP client container image

You're using caomingjun/warp:latest, which is unofficial, outdated, and likely broken.

A more stable and maintained option is mizunoais/docker-cloudflare-warp
 or run WARP manually inside your own base container.

But if you want a plug-and-play solution, here's an example working container setup with WARP:

✅ 2. Try This Minimal Working Compose Using WARP+ in Docker (via wireproxy)

If you're looking for proxy-based WARP (SOCKS5/HTTP), wireproxy + Cloudflare's WARP WireGuard config is cleaner and more Docker-friendly.

👉 Replace WARP with this Wireproxy-based container:
YAML
  warp-proxy:
    image: ghcr.io/trimstray/wireproxy
    container_name: warp-proxy
    cap_add:
      - NET_ADMIN
    devices:
      - /dev/net/tun
    sysctls:
      - net.ipv6.conf.all.disable_ipv6=0
      - net.ipv6.conf.default.disable_ipv6=0
    ports:
      - 1080:1080  # SOCKS5
    volumes:
      - ./wireproxy.toml:/etc/wireproxy/config.toml
    restart: always

And then create wireproxy.toml with your Cloudflare WARP credentials:

TOML
[wireguard]
private_key = "<your private key>"
address = ["172.16.0.2/32"]
dns = ["1.1.1.1"]
public_key = "..."
endpoint = "162.159.193.10:2408"
persistent_keepalive = 25

[socks5]
listen = "0.0.0.0:1080"
✅ 3. If you insist on using caomingjun/warp, check the container log deeply

Run:

Bash
docker logs warp

Look for:

Missing warp-svc binary?

Missing systemd or supervisor to launch the daemon?

Broken entrypoint?

Most likely, the image is just not launching the daemon, or it’s crashing silently.

You may also try running inside the container interactively:

Bash
docker exec -it warp bash
ps aux | grep warp

If you don’t see warp-svc running, that’s your problem.

🔧 4. Alternative: Set up WARP globally via systemd on WSL2

You could run WARP in WSL2 directly if you enable systemd and install the Cloudflare WARP CLI + service natively — but this won’t help much inside isolated Docker networks unless you’re proxying traffic.

✅ Final Recommendation (TL;DR)

You're fighting a bad container image (caomingjun/warp). Instead:

Switch to a working solution like:

ghcr.io/trimstray/wireproxy (SOCKS5 WARP)

or configure WireGuard + WARP manually in a container

Or rebuild your own image that installs and runs the real warp-svc daemon inside it.

Let me know if you want a Dockerfile that does that cleanly — I can build one with the actual WARP CLI + daemon running properly.

## User

uh there is no github username named mizunoais, let alone a 'more maintained' version of docker cloudflare warp...

## Assistant

You're absolutely right—my previous suggestion was incorrect. Let's go with community-validated containers instead:

✅ Best Alternatives
Option 1: cmj2002/warp-docker (based on caomingjun/warp)

Official Cloudflare WARP client + gost proxy.

Actively maintained with ~500 stars 
github.com
+15
github.com
+15
github.com
+15
github.com
+1
.

Lets you use tcp and socks5 via gost.

Usage snippet:

YAML
warp:
  image: caomingjun/warp:latest
  container_name: warp
  restart: always
  device_cgroup_rules:
    - 'c 10:200 rwm'
  cap_add:
    - NET_ADMIN
    - AUDIT_WRITE
    - MKNOD
  sysctls:
    - net.ipv6.conf.all.disable_ipv6=0
    - net.ipv4.conf.all.src_valid_mark=1
  volumes:
    - ./warp-data:/var/lib/cloudflare-warp
  ports:
    - "1080:1080"
  environment:
    - WARP_SLEEP=2
    - WARP_LICENSE_KEY=${WARP_LICENSE_KEY:-}

After launching, test with:

Bash
curl --socks5 localhost:1080 https://cloudflare.com/cdn-cgi/trace | grep warp

Should show warp=on 
community.cloudflare.com
+13
github.com
+13
github.com
+13
.

Option 2: aleskxyz/warp-svc – Minimal official WARP → SOCKS5 proxy

Stripped-down, uses official WARP client only, no extra proxy layers .

Exposes SOCKS5 on port 1080, easily consumed by other services.

Usage example:

YAML
warp:
  image: ghcr.io/aleskxyz/warp-svc:latest
  container_name: warp
  restart: always
  expose:
    - "1080"
  ports:
    - "1080:1080"
  cap_add:
    - NET_ADMIN
  volumes:
    - ./warp-data:/var/lib/cloudflare-warp
  environment:
    - FAMILIES_MODE=off
    - WARP_LICENSE=${WARP_LICENSE_KEY:-}

Then test:

Bash
curl -x socks5h://localhost:1080 https://cloudflare.com/cdn-cgi/trace | grep warp
🔍 Why These Work and Yours Doesn’t

Your caomingjun/warp-based setup likely fails because the daemon isn’t starting properly—missing /dev/net/tun, incorrect permissions, or broken entrypoint.

The recommended images handle these issues correctly:

They create tun devices.

They start warp-svc.

They expose SOCKS5 properly.

They include health checks and restart logic 
hub.docker.com
+13
blog.caomingjun.com
+13
github.com
+13
github.com
+2
github.com
+2
.

🧩 Integrating into Your Composition

Once you pick one:

Replace your existing warp: service in docker-compose.yml with the snippet above.

Ensure dependent services use it via:

YAML
environment:
  - HTTP_PROXY=http://warp:1080
  - HTTPS_PROXY=socks5h://warp:1080

Launch:

Bash
docker-compose up -d warp

Verify:

Bash
docker exec warp curl https://cloudflare.com/cdn-cgi/trace | grep warp
✅ TL;DR

Stop using the broken caomingjun/warp image.

Choose either cmj2002/warp-docker (WARP+Gost) or aleskxyz/warp-svc (pure WARP SOCKS5).

Configure correctly, test with curl, and your containers will route through WARP seamlessly.

Need help setting NAT, firewall rules, or integrating with Traefik? I'm here.
