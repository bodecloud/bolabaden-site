---
source_url: "https://chatgpt.com/c/688d8895-c6d4-8006-b1fd-721705019b32"
conversation_id: "688d8895-c6d4-8006-b1fd-721705019b32"
title: "L4 alternatives to Keepalived"
extracted_at: "2026-06-29T12:12:21.796Z"
message_count: 2
provenance: auth-ui
---

# L4 alternatives to Keepalived

Source: [ChatGPT conversation](https://chatgpt.com/c/688d8895-c6d4-8006-b1fd-721705019b32)

## User

Does there exist something like keepalived but for layer 4 or even potentially layer 7? i really don't want to use haproxy lol. preferably something tailscale/funnel relevant.

## Assistant

Yes, there are alternatives to Keepalived that operate at Layer 4 or Layer 7, and some can work well in a Tailscale or modern mesh/VPN setup. Since you’re trying to avoid HAProxy and looking for something more Tailscale/Funnel-relevant, here are viable approaches depending on what you're really after (L4 vs L7 and what your goals are—e.g. failover, load balancing, service mesh, etc.):

🔧 LAYER 4 ALTERNATIVES TO KEEPALIVED
1. LVS (Linux Virtual Server) — L4

Similar to Keepalived (often used with it).

Supports direct routing, NAT, IP tunneling.

Very efficient kernel-level load balancing.

Downside: Requires shared IPs and health checking infra (often handled by Keepalived).

2. Consul + Fabio or custom L4 health check scripts

Use Consul
 for health checks and service registration.

You can write iptables rules + custom scripts to failover or reconfigure based on service health.

3. MetalLB (for Kubernetes) — L2/L3/L4

BGP or ARP-based load balancer.

Useful if you're in a k8s or similar environment.

4. Tailscale + netfilter/ipvs custom scripting

Since Tailscale provides secure IP-level connectivity, you could build lightweight L4 redirection scripts with iptables/ipvsadm that change targets based on health.

Would likely require scripting and monitoring, but avoids heavy proxies.

🧠 LAYER 7 ALTERNATIVES (w/o HAProxy)

If you want HTTP-aware routing/failover but not HAProxy:

1. Caddy Server

Great with Tailscale (thanks to its native HTTPS + automatic certs + good API).

Simple config, pluggable.

L7 load balancing via reverse_proxy.

Can use JSON config or Caddyfile.

Example:

caddyfile
reverse_proxy /api/* backend1:8080 backend2:8080
2. Traefik

Dynamic configuration via labels, API, etc.

Works well in mesh/VPN and containerized setups.

Tailscale integration is not native, but doable via IP whitelisting or mTLS.

3. Nginx (or OpenResty)

Lightweight and flexible.

Better suited for L7 than L4.

Lua scripting via OpenResty can get you dynamic health checks, failover, etc.

🚀 TAILSCALE/TAILSCALE FUNNEL-SPECIFIC IDEAS
1. Using Tailscale Funnel + Caddy/Traefik

Funnel exposes a local port securely to the public internet.

You can run Caddy or Traefik behind that, and use it for smart failover/load balancing to other Tailscale nodes.

2. Tailscale Serve + Custom Health Check Daemon

You can use tailscale serve to expose a local web app.

Combine that with a local script/agent that swaps out which port is served, or even updates DNS or redirects.

🧪 Experimental or Custom Ideas

Use Tailscale DERP or SOCKS proxy as part of a failover mechanism.

Use Tailscale ACLs + tagged nodes to shift traffic or enable/disable nodes dynamically.

Custom solution using eBPF (Cilium/katran style) for L4 load balancing.

💡 Summary Recommendations
Use Case	Recommended Tool
L4 Failover/Redirection	ipvsadm + Consul or keepalived-like script
L7 HTTP Routing	Caddy or Traefik (lightweight, dynamic)
Tailscale-native	Funnel + Caddy or serve + custom failover
Avoiding HAProxy + Want Mesh-Like Behavior	Tailscale + Caddy/Traefik

Would you like help writing a Tailscale-aware Caddy config for L7 failover? Or an iptables/ipvsadm script for L4 failover using Tailscale IPs?
