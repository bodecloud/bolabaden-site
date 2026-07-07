---
source_url: "https://chatgpt.com/c/687a6df0-d008-8006-9152-8cc8de7eaa96"
conversation_id: "687a6df0-d008-8006-9152-8cc8de7eaa96"
title: "Default VPN network Docker"
extracted_at: "2026-06-29T16:16:34.540Z"
message_count: 4
provenance: auth-ui
---

# Default VPN network Docker

Source: [ChatGPT conversation](https://chatgpt.com/c/687a6df0-d008-8006-9152-8cc8de7eaa96)

## User

services:
  ip-checker:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ip-checker
    hostname: ip-checker
    extra_hosts: *common-hostname-aliases
    networks:
      - vpn-network
      - publicnet
    command: ["sh", "-c", "curl -s ifconfig.me"]
    restart: no



networks:
  publicnet:  # https://docs.docker.com/engine/network/drivers/bridge/#differences-between-user-defined-bridges-and-the-default-bridge
    external: true  # docker network create --driver=bridge --attachable publicnet --subnet=${PUBLICNET_SUBNET:-10.76.0.0/16} --gateway=${PUBLICNET_GATEWAY:-10.76.0.1} --ip-range=${PUBLICNET_IP_RANGE:-10.76.0.0/16}
    attachable: true
    name: publicnet
    driver: bridge
    driver_opts:
      com.docker.network.bridge.name: "br_publicnet"
    ipam:
      config:
        - subnet: ${PUBLICNET_SUBNET:-10.76.0.0/16}
          gateway: ${PUBLICNET_GATEWAY:-10.76.0.1}
          ip_range: ${PUBLICNET_IP_RANGE:-10.76.0.0/16}
  vpn-network:
    external: true
    name: vpn-network
    driver: bridge
    driver_opts:
      com.docker.network.bridge.name: "br_vpn-network"
    ipam:
      config:
        - subnet: ${VPN_NETWORK_SUBNET:-10.45.0.0/16}
          gateway: ${VPN_NETWORK_GATEWAY:-10.45.0.1}
          ip_range: ${VPN_NETWORK_IP_RANGE:-10.45.0.0/16}
  some_default_network:
    external: true


How do i setup the default network to use for ip-checker exactly?

I'm using openvpn on the host to split tunnel the network 'vpn-network' to openvpn

Dockerfile contents:

FROM alpine:latest
RUN apk add --no-cache curl
CMD ["sh", "-c", "curl -s ifconfig.me"]


so yeah the container ip_checker just checks the ip. I notice when I have EXCLUSIVELY ONLY vpn-network, the ip-checker container returns my vpn ip.

If I add any other network like publicnet or literally any other docker network like some_default_network so that ip-checker is on BOTH vpn-network AND another network, it defaults to the non-vpn-network causing curl to return the host ip.

how do i make vpn-network default???
note: it has NOTHING to do with whichever network is listed first either, i've tried reorganizing and reordering to zero effect.
Show more

## Assistant

You're right to notice that Docker's "default network" behavior is not determined by order in docker-compose.yml. In fact, Docker's networking behavior prioritizes the container’s default gateway, which is assigned by Docker to only one of the connected networks — and you can't choose which one via docker-compose.yml directly.

This is why:

When ip-checker is connected only to vpn-network, the container's default route (0.0.0.0/0) is via that network’s gateway — so curl ifconfig.me shows the VPN IP.

When you add another network (e.g., publicnet), Docker assigns one of the networks as default (not necessarily the first one listed), and routes outgoing traffic through it — usually alphabetically or via some internal deterministic behavior, but not configurable in compose directly.

✅ Solution: Force the default gateway to be vpn-network using ip route override

The best way to control the outgoing route (default gateway) inside the container is:

Let Docker attach both networks as needed.

Override the routing table in the container to make vpn-network the default.

🔧 Updated Dockerfile:

Add a custom entrypoint to override the default gateway manually.

Dockerfile
FROM alpine:latest
RUN apk add --no-cache curl iproute2
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT ["/entrypoint.sh"]
📜 entrypoint.sh

This script will:

Detect the interface associated with vpn-network

Delete the default route

Add a new default route via the vpn-network gateway

Bash
#!/bin/sh

# Replace with your known gateway for vpn-network (can also be read dynamically if needed)
VPN_GATEWAY=${VPN_NETWORK_GATEWAY:-10.45.0.1}

# Remove all default routes
ip route del default || true

# Add default route via vpn-network gateway
ip route add default via "$VPN_GATEWAY"

# Run your command
exec curl -s ifconfig.me

You could make this more dynamic by identifying the interface based on subnet or gateway, but if your network is stable, hardcoding is fine.

🧪 Optional Debug: Add this in entrypoint.sh before exec to test
Bash
echo "Default route after override:"
ip route show
🚀 Result

Now, even when ip-checker is attached to both vpn-network and publicnet, the default gateway will be the VPN one, and curl ifconfig.me will return your VPN IP.

✅ Alternative (not recommended): Use --network-alias and run in vpn-network only

If you truly only need one network, just remove the others. But I understand you're splitting traffic (e.g., some containers use publicnet and others use VPN). Then you need this routing fix above.

Let me know if you'd like the dynamic version of the gateway/interface detection logic.

## User

i don't really need the other networks but i do want any container on vpn-network to still be able to access anything on any other docker network, wasn't sure if docker networks can all access each other

## Assistant

Great question! Here’s the scoop on Docker networks and inter-network communication:

By default, Docker networks are isolated

User-defined bridge networks (like your vpn-network) are isolated from each other.

Containers on vpn-network cannot directly talk to containers on publicnet or other user-defined networks unless you explicitly connect them to multiple networks.

The default bridge network is also isolated from user-defined bridge networks.

How to enable containers on one network to access containers on another?

Option 1: Connect containers to multiple networks

You can attach a container to more than one network, just like you did with your ip-checker service.

This allows that container to access containers on both networks (via their IPs or container names, resolved via Docker DNS on each network).

But this does not allow traffic between containers that are only on vpn-network and only on publicnet — it only works if a container is on both networks as a “bridge.”

Option 2: Use a shared overlay network (Swarm or Docker Compose with swarm mode)

Overlay networks allow containers on different hosts or different networks to communicate, but they require Swarm mode or Kubernetes.

Probably overkill for your setup.

Option 3: Manually create routes or use macvlan

Advanced and usually not needed.

Your best simple choice

Keep just the vpn-network and connect all your containers to it.

If you want some containers on publicnet, connect those containers to both vpn-network and publicnet.

Containers on vpn-network alone can reach the host and any other reachable IP addresses on your host’s routes, but they cannot reach containers on other Docker networks unless connected.

So to let containers on vpn-network access containers on publicnet, you have to connect those containers to both networks, or set up some kind of proxy or routing on the host.

TL;DR

Docker networks isolate container communication by default. To enable cross-network container communication, containers must be attached to multiple networks. There’s no automatic communication across different user-defined bridge networks.

If you want, I can help you with a setup that connects key containers to multiple networks or helps you with routing/proxying. Just ask!
