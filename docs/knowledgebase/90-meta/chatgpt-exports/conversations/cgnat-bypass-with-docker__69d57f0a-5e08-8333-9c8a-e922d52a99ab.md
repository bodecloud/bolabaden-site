---
source_url: "https://chatgpt.com/c/69d57f0a-5e08-8333-9c8a-e922d52a99ab"
conversation_id: "69d57f0a-5e08-8333-9c8a-e922d52a99ab"
title: "CGNAT Bypass with Docker"
extracted_at: "2026-06-29T15:53:06.010Z"
message_count: 2
provenance: auth-ui
---

# CGNAT Bypass with Docker

Source: [ChatGPT conversation](https://chatgpt.com/c/69d57f0a-5e08-8333-9c8a-e922d52a99ab)

## User

i want to host a server on a vps that will allow me to bypass port forwarding requirements on my local machien which is behind CGNAT. Is this possibloe and if so how to deploy something that does that in docker-compose.yml

## Assistant

Yes — what you’re describing is absolutely possible, and it’s a very common workaround for CGNAT. The general idea is:

👉 Your VPS acts as a public relay with open ports
👉 Your local machine makes an outbound connection to the VPS (which CGNAT allows)
👉 Traffic is tunneled from the VPS back to your local service

This avoids port forwarding entirely.

🧠 Core Approaches

There are a few solid ways to do this:

1. Reverse Tunnel (simplest)

Tools: SSH reverse tunnel, FRP, rathole

VPS exposes ports → forwards to your local machine

2. VPN Mesh (cleanest long-term)

Tools: Tailscale, ZeroTier, WireGuard

Creates a private network between VPS + local machine

3. TCP/HTTP Tunnel Services

Tools: Cloudflare Tunnel, ngrok

Easiest, but less self-hosted control

🔥 Best Self-Hosted Option: FRP (Fast Reverse Proxy)

FRP is perfect for your use case:

Designed for CGNAT bypass

Lightweight

Works great with Docker

🧱 Architecture
[Internet User]
        ↓
     VPS (public IP)
   [frps server]
        ↓ tunnel
   Your Local Machine
   [frpc client → your app]
🐳 Docker Compose Setup
1. VPS (FRP Server)

Create docker-compose.yml on your VPS:

YAML
version: "3.8"

services:
  frps:
    image: snowdreamtech/frps
    container_name: frps
    restart: always
    network_mode: host
    volumes:
      - ./frps.ini:/etc/frp/frps.ini
frps.ini
INI
[common]
bind_port = 7000

# Port you expose publicly
vhost_http_port = 8080
vhost_https_port = 8443

# सुरक्षा
token = supersecret

Run:

Bash
docker compose up -d
2. Local Machine (FRP Client)

Create another docker-compose.yml:

YAML
version: "3.8"

services:
  frpc:
    image: snowdreamtech/frpc
    container_name: frpc
    restart: always
    network_mode: host
    volumes:
      - ./frpc.ini:/etc/frp/frpc.ini
frpc.ini

Example for exposing a local web server:

INI
[common]
server_addr = YOUR_VPS_IP
server_port = 7000
token = supersecret

[web]
type = http
local_port = 3000
custom_domains = yourdomain.com

OR for raw TCP (e.g., Minecraft, SSH):

INI
[minecraft]
type = tcp
local_ip = 127.0.0.1
local_port = 25565
remote_port = 25565
🌐 Result

Users connect to:

VPS_IP:25565

Traffic gets tunneled to:

your local machine:25565

✅ No port forwarding needed
✅ Works behind CGNAT
✅ Fully self-hosted

🔒 Important Notes
Security

Always set a strong token

Consider firewall rules on VPS

Don’t expose sensitive services without auth

Performance

Latency = VPS hop (usually small)

Bandwidth limited by VPS

🚀 Alternative (Even Easier): Tailscale

If you don’t need public exposure:

Install Tailscale

Connect VPS + local machine

Access via private IP (like 100.x.x.x)

If you want public access:

Use Tailscale Funnel or reverse proxy

🧩 When to Use What
Use Case	Best Tool
Public game server	FRP / Rathole
Private access	Tailscale
Quick demo	ngrok
Production HTTP	Cloudflare Tunnel
⚡ Pro Tip

If you plan to expose multiple services:

Put Nginx / Traefik on VPS

Route domains → FRP tunnels

If you want, I can:

Build a full production-ready compose stack (FRP + Traefik + TLS)

Or show a WireGuard-based setup instead (more secure, less plug-and-play)
