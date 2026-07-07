---
source_url: "https://chatgpt.com/c/680d5951-10e4-8006-801b-8d5e60ca9ad3"
conversation_id: "680d5951-10e4-8006-801b-8d5e60ca9ad3"
title: "Better Tailscale Alternatives"
extracted_at: "2026-06-29T15:04:14.581Z"
message_count: 5
provenance: auth-ui
---

# Better Tailscale Alternatives

Source: [ChatGPT conversation](https://chatgpt.com/c/680d5951-10e4-8006-801b-8d5e60ca9ad3)

## Assistant

You've raised some great points regarding the complexity of WireGuard vs OpenVPN, as well as how you'd like to replicate or improve on the functionality that Tailscale provides. I'll break down your specific use case and offer some guidance on how you might approach it using WireGuard, Docker, and integrating reverse proxies like Traefik.

1. WireGuard Setup vs Tailscale

WireGuard by itself doesn’t come with a centralized admin console like Tailscale does, but you can still achieve similar functionality through manual configuration or with some extra tools. Here's how you can replicate Tailscale's functionality with WireGuard:

Using a VPS as Your "Exit Node": Just like with Tailscale, you can use a VPS to route traffic if port forwarding isn't an option on your local PC. This can be done by configuring your VPS with WireGuard and routing all traffic through it (or having the VPS be your gateway).

How to Set This Up:

Install WireGuard on your VPS and configure it to forward traffic.

On your local machine (or any device), set up WireGuard to connect to the VPS as a gateway, similar to how you might set up a Tailscale exit node.

You'll need to configure the routing table on your local machine to route internet-bound traffic through the WireGuard tunnel. You can set up the VPN connection to route all traffic through the WireGuard interface.

Automatic NAT Traversal: WireGuard supports NAT traversal by default via techniques like UDP hole punching. So if you’re using WireGuard in this setup, it will automatically traverse NAT and should "just work" as long as the server is reachable.

Compatibility with Your VPNs:

If you're using services like AirVPN or Premiumize.me, you can configure WireGuard to work with them, assuming they offer WireGuard configurations (both do). You'll need to download their WireGuard config file, modify it with your credentials, and use it similarly to OpenVPN but through the WireGuard interface.

To make this work with a gluetun setup, you’d replace the OpenVPN client configuration with WireGuard configuration, which can be a bit more manual than gluetun's OpenVPN integration but doable.

You'll need to confirm if the VPN providers support WireGuard over their infrastructure—AirVPN definitely does, while Premiumize.me might require checking their docs for the exact WireGuard compatibility.

2. WireGuard for Docker Network Integration

Yes, it is possible to create a Docker network with WireGuard nodes where each container behaves like its own node on a network.

Docker + WireGuard for Container Networking:

You can run WireGuard directly within Docker containers, treating each container like a separate "node" on the WireGuard network.

You'd need to install WireGuard in each container and configure each to connect to the WireGuard VPN you’ve set up (or use a shared WireGuard configuration for all containers).

Alternatively, you can set up a WireGuard server on the host and have all the containers connect through it, using Docker’s network bridging capabilities.

Steps to Set This Up:

Create a WireGuard server: Set up a WireGuard server on your host or VPS.

Configure Docker containers: Each container would need a WireGuard configuration to connect to this server. You can configure this within a docker-compose.yml file or by running docker run commands with the appropriate network settings.

Ensure NAT Traversal Works: You’ll want to ensure the server can route traffic properly between the WireGuard interface and the Docker network.

The downside here is that Docker networking can get tricky, and running WireGuard in containers will require you to handle routing between containers and ensure they can communicate across the WireGuard tunnel. But it’s certainly possible to accomplish.

3. Reverse Proxy (Traefik) + VPN Setup

You mentioned using Traefik for reverse proxying and integrating it with VPNs. This is a common use case where VPNs (like WireGuard or ZeroTier) are used to secure traffic to internal services.

Traefik & VPN Integration:
You can use a VPN to secure your internal services, and then reverse proxy the services over the VPN to avoid having to expose them to the public internet. This way, the services are only accessible within your private VPN network, and you don’t need to rely on complex security setups like an SSO (Single Sign-On) for remote access.

Steps to Set This Up:

Configure VPN on Traefik Hosts: Set up a VPN (WireGuard, ZeroTier, etc.) on your Traefik host so that it has access to the private network. This way, Traefik can route requests to services inside the VPN, but it can still expose selected services to the public internet if needed.

Reverse Proxy with Traefik: Configure Traefik to reverse proxy traffic from the VPN network to internal services. You can use labels in docker-compose.yml or Traefik's dynamic configuration to define how the proxy should behave.

Access Through VPN: Services that are behind the VPN can be exposed to your local network, and any requests coming from the VPN can be routed securely. This eliminates the need for port forwarding and extra security measures, as only authenticated VPN users will be able to access the internal network.

WireGuard or ZeroTier as VPN for Traefik: ZeroTier or WireGuard are good options here because they are easy to set up and provide a secure virtual network. With these solutions, you can avoid setting up port forwarding and reduce the complexity of securing services on your network.

Example Configuration (Traefik + WireGuard):

Create a WireGuard server on a VPS or your local machine.

Configure WireGuard clients on your Traefik host and containers.

Set up Traefik rules to route traffic to services over the VPN interface.

Set up WireGuard to only allow traffic from the VPN network to reach the services, ensuring that only authenticated devices or services can access them.

4. Traefik with Docker Compose & VPN

When using Docker Compose with Traefik, you can integrate it with a VPN by using labels to control how services are exposed to the public or VPN network.

Docker Compose + VPN:
In your docker-compose.yml, you can define networks for both the VPN and the regular networks Traefik uses for public-facing services. You’d have something like this:

YAML
version: "3"
services:
  my_service:
    image: my_service_image
    networks:
      - traefik
      - wireguard_network  # Add the VPN network here
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.my_service.rule=Host(`my-service.local`)"
      - "traefik.http.services.my_service.loadbalancer.server.port=8080"
networks:
  traefik:
    external: true
  wireguard_network:
    external: true  # This network is provided by WireGuard

This would allow you to set up a dual network configuration, where your services are available both over the VPN and the public network, based on the rules you set up.

Conclusion:

To summarize, here’s what I suggest:

WireGuard for Remote Access: You can use WireGuard to route all your traffic through a VPS or gateway, just like Tailscale does, with automatic NAT traversal.

Docker + WireGuard: Set up WireGuard in Docker containers so they act as nodes in a private network. This can be a bit tricky but totally feasible with proper configuration.

Traefik Reverse Proxy: Integrate your VPN with Traefik to route traffic to services across the VPN, allowing secure internal access without exposing services to the public internet.

By using WireGuard, ZeroTier, or even Tailscale (if you want), you can avoid complex security setups and still reverse proxy your services securely, making the whole process easier and more reliable.

Let me know if you'd like more details on any of these steps!

## User

so what do you recommend: wireguard or zerotier or nebula? Just looking for something that's widely adopted, high level, and intuitive. Widely adopted so I can find existing guides. Feels like there's absolutely zero guides for tailscale due to proprietary nature.

How difficult actually is it to reverse proxy services with traefik **across different networks**?

For example,  if I have:

myspeed:
    # 🔹🔹 MySpeed 🔹🔹
    image: germannewsmaker/myspeed
    container_name: myspeed
    hostname: myspeed
    networks:
      - publicnet
#    ports:
#      - ${MYSPEED_PORT:-5216}:5216
    volumes:
      - ${CONFIG_PATH:-./configs}/myspeed:/myspeed/data
    labels:
      traefik.enable: "true"
      traefik.http.routers.myspeed.rule: Host(`myspeed.${DOMAIN}`) || Host(`myspeed.${DUCKDNS_DOMAIN}`)
      traefik.http.services.myspeed.loadbalancer.server.port: 5216
    restart: always


this will reverse proxy across the public net. If I uncomment ports I can additionally access it that way via ipv4_address:5216.

But I can't figure out a good way to reverse proxy it, and **choose the network I want to expose it to**. In this example I want it to be on publicnet.

Now for this service:

homepage:
    # 🔹🔹 Homepage 🔹🔹  # https://github.com/gethomepage/homepage
    image: ghcr.io/gethomepage/homepage
    container_name: homepage
    hostname: homepage
    networks:
      - publicnet
#    ports:
#      - ${HOMEPAGE_PORT:-3000}:3000
    volumes:
      # DO NOT create a bind mount to the entire /app/public/ directory.
      - ${DOCKER_SOCK:-/var/run/docker.sock}:/var/run/docker.sock:z
      - ${CONFIG_PATH:-./configs}/homepage:/app/config
    <<: [*common-logging, *resource-limits]
    environment:
      TZ: ${TZ:-America/Chicago}
      HOMEPAGE_ALLOWED_HOSTS: ${HOMEPAGE_ALLOWED_HOSTS:-*}
      HOMEPAGE_VAR_TITLE: ${HOMEPAGE_VAR_TITLE:-Bolabaden}
      HOMEPAGE_VAR_SEARCH_PROVIDER: ${HOMEPAGE_VAR_SEARCH_PROVIDER:-google}
      HOMEPAGE_VAR_HEADER_STYLE: ${HOMEPAGE_VAR_HEADER_STYLE:-}
      HOMEPAGE_VAR_WEATHER_CITY: ${HOMEPAGE_VAR_WEATHER_CITY:-Chicago}
      HOMEPAGE_VAR_WEATHER_LAT: ${HOMEPAGE_VAR_WEATHER_LAT:-41.8781}
      HOMEPAGE_VAR_WEATHER_LONG: ${HOMEPAGE_VAR_WEATHER_LONG:--87.6298}
      #      HOMEPAGE_VAR_WEATHER_TIME: ${HOMEPAGE_VAR_WEATHER_TIME:-}
      HOMEPAGE_VAR_WEATHER_UNIT: ${HOMEPAGE_VAR_WEATHER_UNIT:-fahrenheit}
    labels:
      traefik.enable: "true"
      traefik.http.routers.homepage.rule: Host(`homepage.${DOMAIN}`) || Host(`homepage.${DUCKDNS_DOMAIN}`)
      traefik.http.services.homepage.loadbalancer.server.port: 3000
    restart: always


how to make homepage only available via our mesh?
Show more

## Assistant

Recommendation: WireGuard vs. ZeroTier vs. Nebula

Considering your requirements for something widely adopted, high-level, intuitive, and with existing guides for easy setup, I recommend ZeroTier. Here's why:

Widely Adopted: ZeroTier is widely used in both personal and enterprise settings and has been around for several years. It has extensive documentation and a strong community, which means you'll find many guides and examples online. It's particularly well-regarded for its ease of use and simplicity compared to more complex solutions like Nebula.

Intuitive: ZeroTier is user-friendly and provides both a desktop app and network management UI, making it much more approachable for those who don't want to dive too deeply into configuration details. It automatically handles NAT traversal and peer discovery, so it offers much of the "magic" of Tailscale without being locked into Tailscale's proprietary ecosystem.

High-Level Functionality: ZeroTier abstracts a lot of networking complexity and handles the low-level details of networking for you. It's designed to work well across multiple networks and can easily be set up to create a virtual LAN, just like Tailscale, but with more flexibility.

So, based on your needs, ZeroTier is likely the best option to explore, especially for reverse proxying, integrating into Docker, and using mesh networks.

Reverse Proxying Across Different Networks in Traefik

When using Traefik in a Docker environment, you can specify which networks a service should be exposed to, but Traefik itself will typically only interact with the networks that it's part of. To expose a service on a specific network (e.g., publicnet), you need to ensure that both Traefik and the service are part of that network.

In your example, you're attempting to reverse proxy the myspeed and homepage services. Here's how you can approach this for both:

1. Exposing the Service to publicnet

You can control the network that a service is exposed to by ensuring both the service and Traefik are on the same network. Traefik needs to be able to access the services via the Docker network you want them to be on (in your case, publicnet).

You already have this set up in your docker-compose.yml with publicnet as a specified network for each service:

YAML
  myspeed:
    image: germannewsmaker/myspeed
    container_name: myspeed
    hostname: myspeed
    networks:
      - publicnet  # Ensure the service is on the public network
    volumes:
      - ${CONFIG_PATH:-./configs}/myspeed:/myspeed/data
    labels:
      traefik.enable: "true"
      traefik.http.routers.myspeed.rule: Host(`myspeed.${DOMAIN}`) || Host(`myspeed.${DUCKDNS_DOMAIN}`)
      traefik.http.services.myspeed.loadbalancer.server.port: 5216
    restart: always
2. Making homepage Available Only via the Mesh (VPN Network)

To make the homepage service available only through your mesh network, you need to ensure that the service is connected to a VPN network, and Traefik can only route traffic to it from that network. Here's how you can do this:

Define the VPN network in Docker (e.g., meshnet for ZeroTier, WireGuard, or Nebula):

YAML
networks:
  publicnet:
    external: true
  meshnet:  # The VPN network
    external: true

Assign the service to the VPN network while keeping Traefik in the publicnet network for routing:

YAML
  homepage:
    image: ghcr.io/gethomepage/homepage
    container_name: homepage
    hostname: homepage
    networks:
      - meshnet  # Only make it accessible on the mesh network
    volumes:
      - ${DOCKER_SOCK:-/var/run/docker.sock}:/var/run/docker.sock:z
      - ${CONFIG_PATH:-./configs}/homepage:/app/config
    environment:
      TZ: ${TZ:-America/Chicago}
    labels:
      traefik.enable: "true"
      traefik.http.routers.homepage.rule: Host(`homepage.${DOMAIN}`) || Host(`homepage.${DUCKDNS_DOMAIN}`)
      traefik.http.services.homepage.loadbalancer.server.port: 3000
    restart: always

By assigning homepage to the meshnet, the service will only be accessible from within the VPN (ZeroTier, WireGuard, Nebula, etc.). The public network (publicnet) will not be able to access it directly.

Make Sure Traefik Is on Both Networks:
For Traefik to route traffic to services on multiple networks, ensure it's connected to both publicnet and meshnet. Here's how you can define Traefik's configuration:

YAML
  traefik:
    image: traefik:v2
    container_name: traefik
    networks:
      - publicnet  # Make sure Traefik is part of the public network
      - meshnet    # Also part of the VPN network
    ports:
      - "80:80"    # HTTP
      - "443:443"  # HTTPS
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
    labels:
      - "traefik.enable=true"
    restart: always

This setup allows Traefik to route traffic from both the public internet (via publicnet) and your VPN mesh network (meshnet).

Reverse Proxy Traffic to homepage:
Traefik will be able to reverse proxy traffic to the homepage service via the mesh network but only expose it to clients that are connected to the mesh (via VPN). If you're using ZeroTier or WireGuard, you'll need the clients connected to the VPN to be able to resolve the hostname for homepage and route traffic to it.

In Summary:

Use ZeroTier for ease of use, simplicity, and strong community support. It's widely adopted and allows for easy setup of mesh networks across devices.

For Reverse Proxying Across Networks:

Ensure that Traefik is connected to both the public network and your VPN network (e.g., ZeroTier, WireGuard, Nebula).

For the service you want only available via the mesh (e.g., homepage), assign it to the VPN network and keep Traefik on both networks so it can route traffic from the public network to the service on the VPN network.

This approach will allow you to reverse proxy services across different networks while keeping your internal services secure and accessible only via the VPN mesh network.

Let me know if you need further clarification or assistance!

## User

ok you skipped the actual important stuff. Given these networks:

publicnet:
#    external: true  # docker network create --driver=bridge --attachable publicnet --subnet=${PUBLICNET_SUBNET:-10.76.0.0/16} --gateway=${PUBLICNET_GATEWAY:-10.76.0.1} --ip-range=${PUBLICNET_IP_RANGE:-10.76.0.0/16}
    attachable: true
    name: publicnet
    ipam:
      config:
        - subnet: ${PUBLICNET_SUBNET:-10.76.0.0/16}
          gateway: ${PUBLICNET_GATEWAY:-10.76.0.1}
          ip_range: ${PUBLICNET_IP_RANGE:-10.76.0.0/16}
  meshnet:
#    external: true # docker network create --attachable --subnet=${MESHNET_SUBNET:-100.64.0.0/10} --gateway=${MESHNET_GATEWAY:-192.168.1.1} --ip-range=${MESHNET_IP_RANGE:-192.168.1.0/24} meshnet
    name: meshnet
    ipam:
      config:
        - subnet: ${MESHNET_SUBNET:-192.168.1.0/24}
          gateway: ${MESHNET_GATEWAY:-192.168.1.1}
          ip_range: ${MESHNET_IP_RANGE:-192.168.1.0/24}


and this ifconfig:


enp0s6: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 9000
        inet 10.0.0.16  netmask 255.255.255.0  broadcast 10.0.0.255
        inet6 fe80::17ff:fe01:913c  prefixlen 64  scopeid 0x20<link>
        ether 02:00:17:01:91:3c  txqueuelen 1000  (Ethernet)
        RX packets 147131  bytes 214408329 (214.4 MB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 103829  bytes 23527854 (23.5 MB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0tailscale0: flags=4305<UP,POINTOPOINT,RUNNING,NOARP,MULTICAST>  mtu 1280 
        inet 100.72.149.123  netmask 255.255.255.255  destination 100.72.149.123
        inet6 fe80::d58d:587e:4c2f:2c3d  prefixlen 64  scopeid 0x20<link>
        inet6 fd7a:115c:a1e0::d901:957b  prefixlen 128  scopeid 0x0<global>
        unspec 00-00-00-00-00-00-00-00-00-00-00-00-00-00-00-00  txqueuelen 500  (UNSPEC)
        RX packets 2254  bytes 117665 (117.6 KB)
        RX errors 0  dropped 0  overruns 0  frame 0
        TX packets 2259  bytes 91142 (91.1 KB)
        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0


how to specifically map publicnet to enp0s6 and meshnet to tailscale0 (or whatever the zerotier interface name will be)?
Show more

## Assistant

To pin a Docker network to a specific host interface you generally have two patterns:

“True” L2 network: macvlan
You carve off a slice of your LAN (or VPN) and hand it directly to containers.

“Share-a-VPN” pattern
You run your VPN (Tailscale, ZeroTier, WireGuard…) in one container (or on the host) and then let other containers join that same network namespace.

1. publicnet → enp0s6 with a macvlan network

A macvlan network will let your containers sit directly on the 10.76.0.0/16 LAN that's “behind” enp0s6:

Bash
# on the host:
docker network create \
  --driver=macvlan \
  --subnet=10.76.0.0/16 \
  --gateway=10.76.0.1 \
  --ip-range=10.76.0.0/16 \
  -o parent=enp0s6 \
  publicnet

Then in your compose file, just reference that external network:

YAML
networks:
  publicnet:
    external: true

services:
  myspeed:
    image: germannewsmaker/myspeed
    networks:
      - publicnet
    labels:
      traefik.enable: "true"
      traefik.http.routers.myspeed.rule: Host(`myspeed.${DOMAIN}`)
      traefik.http.services.myspeed.loadbalancer.server.port: 5216

Now every myspeed container will get a real 10.76.x.x address on your enp0s6 LAN, and Traefik (also attached to publicnet) can route to it over that network.

2. meshnet → Tailscale (or ZeroTier) via “share-a-VPN”

You cannot create a macvlan directly on a TUN device (e.g. tailscale0). Instead, you run the VPN in a container, then let your other containers “hop into” that container’s network namespace.

a) Run Tailscale (or ZeroTier) in its own container

Here’s an example for Tailscale; ZeroTier is analogous. Create a tiny docker-compose.yml service:

YAML
services:
  tailscale:
    image: tailscale/tailscale:latest
    cap_add:
      - NET_ADMIN
      - SYS_MODULE
    volumes:
      - tailscale-var-lib:/var/lib/tailscale
    command: >
      tailscaled --state=/var/lib/tailscale/tailscaled.state
    networks:
      - meshnet   # we’ll define this below
    restart: always

volumes:
  tailscale-var-lib:

networks:
  meshnet:
    driver: bridge
    ipam:
      config:
        - subnet: 100.64.0.0/10
          gateway: 100.64.0.1

Launch docker-compose up -d tailscale

Inside that container you’ll run tailscale up --authkey ... --advertise-exit-node so it joins your tailnet and can act as an exit-node if you want.

b) Make other services share its network namespace

Anywhere you want “mesh-only” access, point the container at the Tailscale one:

YAML
  homepage:
    image: ghcr.io/gethomepage/homepage
    network_mode: "service:tailscale"
    labels:
      traefik.enable: "true"
      traefik.http.routers.homepage.rule: Host(`homepage.${DOMAIN}`)
      traefik.http.services.homepage.loadbalancer.server.port: 3000
    # no "networks:" here—it's using tailscale's netns

network_mode: "service:tailscale"
— means “put this container into the exact same network namespace as the tailscale container.”

Result:

homepage has access to your tailnet IPs and remote tailscale peers.

It won’t be on publicnet at all, so it’s only reachable by anyone who’s in your tailnet (or by visiting the exit-node).

3. Traefik on two networks

To let Traefik see both publicnet and your mesh:

YAML
services:
  traefik:
    image: traefik:v2
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock"
    networks:
      - publicnet
      - meshnet
    restart: always

networks:
  publicnet:
    external: true
  meshnet:
    external: true

Public-facing services (e.g. myspeed on publicnet) get routed like normal.

Mesh-only services (e.g. homepage in Tailscale NS) get routed by Traefik over the mesh interface—but only mesh-connected clients can hit them.

Recap

publicnet ⇢ enp0s6
→ use a Docker macvlan network (parent=enp0s6).

meshnet ⇢ tailscale0/zerotier interface
→ run the VPN in its own container + network_mode: service:<vpn> for any “mesh-only” service.

Traefik
→ attach it to both publicnet and meshnet so it can proxy into either world.

That combination gives you full control:

true L2 Docker containers on your LAN,

a private mesh network for “internal” services,

and a single Traefik instance that can bridge both.
