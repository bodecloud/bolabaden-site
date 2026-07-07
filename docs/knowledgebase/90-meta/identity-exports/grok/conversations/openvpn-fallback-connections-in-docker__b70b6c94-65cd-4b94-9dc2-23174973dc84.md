---
source_url: "https://grok.com/c/b70b6c94-65cd-4b94-9dc2-23174973dc84"
conversation_id: "b70b6c94-65cd-4b94-9dc2-23174973dc84"
title: "OpenVPN Fallback Connections in Docker"
extracted_at: "2026-06-29T16:21:58.966Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# OpenVPN Fallback Connections in Docker

Source: [Grok conversation](https://grok.com/c/b70b6c94-65cd-4b94-9dc2-23174973dc84)

## User

_Time: 2025-09-01T04:06:30.525Z_

I have a docker container that supplies an OpenVPN connection allowing other containers to connect with `network_mode: service:<container_name>`

Provide a complete and battle-tested solution for defining and setting up fallback connections for openvpn **within this specific container**. Goal is if ONE openvpn connection drops goes down or becomes unavailable, another one is routed to intuitive and immediately and seamlessly without disruption of service availability. Find at least 5 guides/solutions that are fully accurate to the goal, and provide a complete guide that provides me the best battle-tested solution for achieving this.

## Assistant

_Time: 2025-09-01T04:06:54.691Z_



## User

_Time: 2025-09-01T04:08:11.843Z_

I have a docker container that supplies an OpenVPN connection allowing other containers to connect with `network_mode: service:<container_name>`

Provide a complete and battle-tested solution for defining and setting up fallback connections for openvpn **within this specific container**. Goal is if ONE openvpn connection drops goes down or becomes unavailable, another one is routed to intuitive and immediately and seamlessly without disruption of service availability. Find at least 5 guides/solutions that are fully accurate to the goal, and provide a complete guide that provides me the best battle-tested solution for achieving this. Like merge them into a single guide if they’re compatible or providing a hybrid solution. Or whatever you recommend. Just find 5 guides and condense into a single guide where that single guide provides the best most accurate and qualitative answer

## Assistant

_Time: 2025-09-01T04:10:33.028Z_

### Overview of the Battle-Tested Solution

Based on analyzing at least 5 relevant guides and discussions (from OpenVPN official docs on load-balancing/failover, Stack Exchange on auto-fallback configs, pfSense documentation on multi-remote clients, OpenVPN forums on dual-IP fallbacks, SNBForums on VPN failover scripting, Reddit/pfSense advice on secondary clients, and a blog on multi-protocol fallbacks), the most consistent, battle-tested approach for implementing fallback connections within a single OpenVPN client container in Docker is to use a single OpenVPN configuration file with multiple `remote` directives. This allows the OpenVPN client to automatically attempt connections to fallback servers if the primary one becomes unavailable or drops.

Key insights merged from the sources:
- **Native Failover via Multiple Remotes**: All sources emphasize listing multiple `remote` entries (e.g., servers, ports, protocols) in the config. OpenVPN tries them sequentially on failure, with options for randomization and fast detection.
- **Failure Detection and Reconnect**: Use `keepalive` (or `ping`/`ping-restart`) for quick drop detection (e.g., 10-60 seconds), combined with `persist-tun` and `persist-key` to minimize disruption by keeping the TUN interface and routes active during reconnects. This reduces downtime to seconds, making it "seamless" for many practical uses (e.g., no full service restart).
- **DNS and Timeout Handling**: Add `resolv-retry` to handle DNS failures without stalling.
- **Protocol Flexibility**: Specify different protocols (UDP/TCP) per remote for robustness against firewalls.
- **Connection Profiles**: Use `<connection>` blocks for organized, per-profile options.
- **Monitoring for Extra Reliability**: One source (SNBForums) suggests scripting for active monitoring and forced switches, which can be integrated into the Docker entrypoint for proactive failover if native detection isn't fast enough.
- **Limitations and Seamlessness**: True zero-downtime (no packet loss) isn't natively supported in a single client process without server-side clustering (e.g., shared VIP). However, with optimized options, reconnection is intuitive, immediate (post-detection), and disrupts service minimally—often unnoticeable for non-real-time apps. Running parallel clients (e.g., multiple processes) was discussed but adds complexity and IP conflicts in one container; it's not recommended over the merged config approach.
- **Docker-Specific Integration**: Assume a standard OpenVPN client image (e.g., `dperson/openvpn-client` or `kylemanna/openvpn`). Mount a custom `.ovpn` file and use environment variables or an entrypoint script for monitoring.

This hybrid guide combines the best elements: Native OpenVPN failover for simplicity, tuned options for speed, and optional scripting for robustness. It's battle-tested as it's derived from official OpenVPN docs and community implementations used in production (e.g., pfSense routers, multi-WAN setups).

### Prerequisites
- A Docker container running an OpenVPN client (e.g., via `docker run -d --name vpn-container --cap-add=NET_ADMIN -v /path/to/config:/vpn dperson/openvpn-client`).
- Access to at least two OpenVPN servers (primary and fallback) with compatible configs (e.g., same CA, keys, routes pushed).
- The container exposes its network via `network_mode: service:vpn-container` for other containers.
- Basic Docker knowledge; test in a non-production environment.

### Step 1: Prepare the OpenVPN Config File
Create or edit your `.ovpn` file (e.g., `vpn-config.ovpn`) with multiple remotes. Merge elements like randomization, fast restarts, and protocol fallbacks.

Example config (adapt to your servers; assume full tunnel for simplicity):
```
client
dev tun
proto udp  # Default protocol; fallback to TCP if needed

# List multiple remotes (primary first, then fallbacks). OpenVPN tries sequentially on failure.
remote primary-server.example.com 1194 udp
remote fallback-server1.example.com 1194 udp
remote fallback-server2.example.com 443 tcp  # Fallback with TCP for firewall resilience

# Or use <connection> blocks for cleaner organization and per-remote options
<connection>
remote primary-server.example.com 1194 udp
connect-timeout 30  # Shorter timeout for faster failover attempts
</connection>
<connection>
remote fallback-server1.example.com 1194 udp
connect-timeout 30
</connection>
<connection>
remote fallback-server2.example.com 443 tcp
connect-timeout 30
</connection>

# Enable randomization for load balancing (optional; disable if strict order needed)
remote-random

# Handle DNS resolution failures gracefully
resolv-retry infinite  # Or set to 60 for 1-minute retry per remote before switching

# Fast failure detection: Ping every 10s, restart if no response in 30s
keepalive 10 30  # Merges ping/ping-restart; tunable for sensitivity (lower = faster but more false positives)

# Minimize disruption during reconnects
persist-tun  # Keeps TUN interface up; routes persist
persist-key  # Reuses keys for faster reconnect
persist-config  # Retains config state

# Other standard options (adapt as needed)
nobind
auth-nocache
pull
tls-client
ca /vpn/ca.crt  # Paths relative to container mount
cert /vpn/client.crt
key /vpn/client.key
tls-auth /vpn/ta.key 1
cipher AES-256-GCM  # Or your preferred
compress lz4-v2  # If supported
verb 3  # Logging level for debugging

# If servers push routes, ensure they align to avoid conflicts on switch
```

- **Why this works**: On drop (detected via keepalive), OpenVPN restarts the connection process, trying the last successful remote first. If it fails (e.g., after connect-timeout), it cycles to the next. With persist-tun, the network interface doesn't flap, reducing service disruption to the reconnect time (typically 5-15 seconds).
- **Tuning for Seamlessness**: Test keepalive values; start with 10 60 for stability. If too slow, lower to 5 20, but watch for unnecessary switches.

### Step 2: Set Up the Docker Container
Use a reliable OpenVPN client image. Example with `dperson/openvpn-client` (widely used and supports custom configs):

1. Mount the config:
   ```
   docker run -d --name vpn-container \
     --cap-add=NET_ADMIN \
     --device /dev/net/tun \
     -v /path/to/your/vpn-config.ovpn:/vpn/vpn.ovpn \
     -v /path/to/certs:/vpn \  # Include CA, certs, keys
     dperson/openvpn-client -f ""  # -f "" runs in foreground if needed; adjust flags
   ```

2. For other containers to use this network:
   ```
   docker run -d --name app-container \
     --network=container:vpn-container \  # Or network_mode: service:vpn-container in compose
     your-app-image
   ```

- If using Docker Compose, define in `docker-compose.yml`:
  ```
  version: '3'
  services:
    vpn:
      image: dperson/openvpn-client
      cap_add:
        - NET_ADMIN
      devices:
        - /dev/net/tun
      volumes:
        - ./vpn-config.ovpn:/vpn/vpn.ovpn
        - ./certs:/vpn
      command: -f ""

    app:
      image: your-app-image
      network_mode: service:vpn
  ```

- **Image Alternatives**: If your current image differs (e.g., `kylemanna/openvpn`), ensure it supports mounting a single `.ovpn` file and runs OpenVPN with it.

### Step 3: Add Optional Monitoring Script for Proactive Failover
For extra robustness (from SNBForums and pfSense ideas), add a simple Bash script inside the container to monitor the connection and force a switch if needed. This detects failures faster than native keepalive and restarts OpenVPN.

1. Create `monitor.sh`:
   ```
   #!/bin/bash
   # Monitors VPN connection; restarts OpenVPN on failure to trigger fallback

   INTERFACE="tun0"  # Your TUN device
   CHECK_IP="8.8.8.8"  # Ping target (or a server-specific IP)
   CHECK_INTERVAL=10  # Seconds between checks
   MAX_FAILS=3  # Fails before restart

   fails=0
   while true; do
     if ! ping -c 1 -I $INTERFACE $CHECK_IP &> /dev/null; then
       ((fails++))
       echo "VPN ping failed ($fails/$MAX_FAILS)"
       if [ $fails -ge $MAX_FAILS ]; then
         echo "VPN down; restarting OpenVPN for fallback"
         pkill openvpn  # Or kill -SIGUSR1 $(pidof openvpn) for soft restart
         fails=0
       fi
     else
       fails=0
     fi
     sleep $CHECK_INTERVAL
   done
   ```

2. Mount and run it in Docker:
   - Add to volumes: `-v /path/to/monitor.sh:/monitor.sh`
   - Modify entrypoint (if image supports): Use a custom entrypoint script that runs OpenVPN in background and starts the monitor.
     Example custom entrypoint `entrypoint.sh`:
     ```
     #!/bin/bash
     openvpn --config /vpn/vpn.ovpn &
     /monitor.sh
     ```
     Then: `-v /path/to/entrypoint.sh:/entrypoint.sh --entrypoint /entrypoint.sh`

- **Why Integrated?**: This script forces a restart (triggering remote cycling) if pings fail, making failover more "immediate." Use SIGUSR1 for softer restarts to leverage persist-tun.

### Step 4: Testing and Troubleshooting
1. Start the container and verify connection: `docker logs vpn-container` (look for "Initialization Sequence Completed").
2. Simulate failure: Block the primary server (e.g., firewall rule) and monitor logs/time to switch.
3. Check seamlessness: From a linked container, run `curl ifconfig.me` before/after; ensure traffic resumes quickly.
4. Common Issues:
   - Downtime too long? Lower keepalive/connect-timeout.
   - Route conflicts? Ensure servers push identical routes.
   - Logging: Increase `verb` to 4 for details.
   - Docker networking: Confirm `--cap-add=NET_ADMIN` and `/dev/net/tun` are present.

This solution is reliable, low-overhead, and directly addresses your goal within one container. If your servers aren't equivalent (e.g., different subnets), add server-side alignment for full seamlessness. For advanced needs (e.g., multi-process in container), consider custom images, but this merged approach is the most qualitative and accurate based on the sources.

## User

_Time: 2025-09-01T04:12:29.590Z_

Alright that works for a bunch of different OpenVPN servers. I need an alternative, let’s say I have 8 different interfaces in a container where all 8 are different VPNs and have different private IPs assigned to them. How to route/loadbalance/failover seamlessly without disruption between all 8. Your solution in other words only is compatible if all networks are OpenVPN, I need a solution that doesnt require OpenVPN at all

## Assistant

_Time: 2025-09-01T04:15:33.820Z_

### Overview of the Battle-Tested Solution

Based on analyzing at least 5 relevant guides (OpenWrt's mwan3 for multi-WAN failover/load balancing with interface monitoring and policies; Red Hat's policy-based routing using multiple routing tables and IP rules for source/destination-based routing via different interfaces/VPNs; Server Fault's nftables setup for marking packets and routing to specific VPN gateways; Server Fault's Linux bonding over multiple VPN tunnels for aggregated speed and automatic failover; and a DIY Linux router blog using Speedify for seamless bonding combined with iptables/firewall and monitoring), the most consistent, battle-tested approach for handling 8 different VPN interfaces (e.g., tun0-tun7) in a Docker container is policy-based routing (PBR) with nftables for packet marking, combined with multi-table routing and a monitoring script for failover detection.

Key insights merged from the sources:
- **PBR with Multiple Tables**: From Red Hat and nftables guides, use separate routing tables for each VPN interface, with IP rules to select tables based on marks or source IPs. This allows routing via any VPN type (not OpenVPN-specific).
- **Load Balancing**: Use equal-cost multi-path (ECMP) via `nexthop` in routes (from bonding and DIY guides) or weighted policies (mwan3-style) for distributing traffic across active interfaces.
- **Failover and Seamlessness**: Integrate monitoring (ping-based, like mwan3's track_ip or DIY scripts) to detect failures and adjust routes dynamically. Use `persist` options where possible, but true zero-downtime requires bonding; however, for different VPNs, fast detection (5-10s) minimizes disruption.
- **nftables Integration**: Mark packets for load balancing/failover (e.g., round-robin or based on protocol), then route via fwmark rules.
- **Docker Considerations**: Run in a privileged container with NET_ADMIN cap. Use a full distro image (e.g., Ubuntu) for tools like nftables/iproute2. Avoid bonding if VPNs have incompatible MTUs/IPs; PBR is more flexible.
- **Limitations**: Seamless (no packet loss) is challenging without server-side support; expect 5-30s downtime on failover. If VPNs push conflicting routes, suppress with `route-nopull`.
- **Hybrid Elements**: Merge mwan3's interface monitoring into a Bash script; use Speedify-like CLI if bonding needed, but stick to native Linux for generality.

This hybrid is battle-tested in production routers (e.g., OpenWrt/pfSense derivatives, enterprise Linux setups) and adaptable to containers. It's low-overhead and works for any VPN (WireGuard, IPSec, etc.).

### Prerequisites
- Docker container based on Ubuntu (e.g., `ubuntu:22.04`) with 8 VPN interfaces (tun0-tun7) already up, each with unique private IPs (e.g., 10.8.0.1/24 on tun0, etc.).
- VPN clients configured (e.g., WireGuard/OpenVPN) but without default routes; use `route-nopull` or equivalent.
- Container flags: `--cap-add=NET_ADMIN --sysctl net.ipv4.ip_forward=1 --device /dev/net/tun --privileged` (for tun devices and routing).
- Other containers use `network_mode: service:vpn-container`.
- Install tools inside container: `apt update && apt install -y iproute2 nftables net-tools iputils-ping`.
- Assume full tunnel; adapt for split if needed.

### Step 1: Prepare Routing Tables and Interfaces
Edit `/etc/iproute2/rt_tables` to add custom tables for each VPN (or one for load balancing).

Example:
```
# /etc/iproute2/rt_tables
...
200 vpn1  # for tun0
201 vpn2  # for tun1
...
207 vpn8  # for tun7
500 balanced  # for load balancing active VPNs
```

For each VPN interface, add default routes in their tables (replace gateways with your VPN-assigned gateways, e.g., 10.8.0.2 for tun0).

```
ip route add default via 10.8.0.2 dev tun0 table vpn1
ip route add default via 10.8.1.2 dev tun1 table vpn2
# Repeat for tun2-tun7
```

Enable IP forwarding:
```
echo 1 > /proc/sys/net/ipv4/ip_forward
```

### Step 2: Set Up nftables for Packet Marking and Firewall
Create `/etc/nftables.conf` for marking packets (e.g., for load balancing by hash or protocol) and basic firewall. This merges nftables PBR with iptables-like rules from bonding/DIY guides.

Example config:
```
table inet pbr {
    set active_vpns { type ipv4_addr; flags interval; }  # Dynamic set for active gateways

    chain prerouting {
        type filter hook prerouting priority mangle; policy accept;
        # Mark for load balancing (e.g., hash on src/dst for distribution)
        meta mark set jhash ip saddr . ip daddr mod 8 + 1  # Marks 1-8 for 8 VPNs
        # Or for specific: tcp dport 80 meta mark set 1  # HTTP via vpn1
    }

    chain output {
        type route hook output priority filter; policy accept;
        # Similar marking for router-originated traffic
        meta mark set jhash ip saddr . ip daddr mod 8 + 1
    }

    chain forward {
        type filter hook forward priority filter; policy accept;
        # Accept established, drop new inbound
        ct state established,related accept
        ct state new drop
    }

    chain postrouting {
        type nat hook postrouting priority srcnat; policy accept;
        # Masquerade outbound (for NAT)
        oifname ~ "tun*" masquerade
    }
}
```

Load with `nft -f /etc/nftables.conf`. Add active gateways: `nft add element inet pbr active_vpns { 10.8.0.2, 10.8.1.2, ... }`

### Step 3: Configure IP Rules for PBR and Load Balancing
Add rules to lookup tables based on marks (from nftables) or source IPs.

For failover/load balancing:
```
# Rules for marks (load balance via balanced table)
ip rule add fwmark 1 table vpn1
ip rule add fwmark 2 table vpn2
# Repeat for 3-8

# For ECMP load balancing in a single table (all active VPNs)
ip route add default table balanced nexthop via 10.8.0.2 dev tun0 weight 1 nexthop via 10.8.1.2 dev tun1 weight 1 ... # Add all 8
ip rule add from all table balanced  # Default to balanced table
```

For source-based (e.g., specific subnets via specific VPN): `ip rule add from 192.168.1.0/24 table vpn1`

### Step 4: Add Monitoring Script for Failover
Merge mwan3's track_ip monitoring with DIY scripts for proactive failover. Create `/monitor.sh` to ping gateways, mark down failed ones, and update routes/rules.

Example script:
```
#!/bin/bash
VPN_IFACES=("tun0" "tun1" "tun2" "tun3" "tun4" "tun5" "tun6" "tun7")
GATEWAYS=("10.8.0.2" "10.8.1.2" "10.8.2.2" "10.8.3.2" "10.8.4.2" "10.8.5.2" "10.8.6.2" "10.8.7.2")  # Your gateways
INTERVAL=5
MAX_FAILS=3
fails=()

while true; do
  for i in "${!VPN_IFACES[@]}"; do
    iface=${VPN_IFACES[$i]}
    gw=${GATEWAYS[$i]}
    if ping -c 1 -I $iface $gw &> /dev/null; then
      fails[$i]=0
      # Ensure route up
      ip route replace default via $gw dev $iface table vpn$((i+1))
    else
      ((fails[$i]++))
      if [ ${fails[$i]} -ge $MAX_FAILS ]; then
        echo "$iface down; removing from routes"
        ip route del default via $gw dev $iface table vpn$((i+1))
        # Update balanced table: Rebuild nexthop without failed
        active_nexthops=""
        for j in "${!VPN_IFACES[@]}"; do
          if [ ${fails[$j]} -lt $MAX_FAILS ]; then
            active_nexthops="$active_nexthops nexthop via ${GATEWAYS[$j]} dev ${VPN_IFACES[$j]} weight 1"
          fi
        done
        ip route replace default table balanced $active_nexthops
      fi
    fi
  done
  sleep $INTERVAL
done
```

Make executable: `chmod +x /monitor.sh`. Run in background via entrypoint.

### Step 5: Docker Integration and Entry Point
In `docker-compose.yml` or run command:
```
services:
  vpn-container:
    image: ubuntu:22.04
    cap_add:
      - NET_ADMIN
    sysctls:
      - net.ipv4.ip_forward=1
    devices:
      - /dev/net/tun:/dev/net/tun
    privileged: true
    volumes:
      - ./nftables.conf:/etc/nftables.conf
      - ./monitor.sh:/monitor.sh
      - ./rt_tables:/etc/iproute2/rt_tables  # Mount custom rt_tables
    entrypoint: ["/bin/bash", "-c", "apt update && apt install -y iproute2 nftables net-tools iputils-ping && nft -f /etc/nftables.conf && /monitor.sh & sleep infinity"]  # Install, load nft, start monitor
```

For other containers: `network_mode: service:vpn-container`

### Step 6: Testing and Troubleshooting
1. Verify routes: `ip route show table all`, `ip rule show`.
2. Check marks: `nft list ruleset`.
3. Simulate failure: `ip link set tun0 down`; monitor logs/script output for failover (traffic shifts to others).
4. Load balance test: Use `iperf` or multiple curls; check distribution via `tcpdump`.
5. Seamlessness: Run continuous ping from linked container; expect <10s drop on failover with tuned INTERVAL/MAX_FAILS.
6. Issues:
   - Conflicts: Set higher metrics for backups (e.g., `metric 100` in routes).
   - Performance: Tune weights in nexthop for unequal VPN speeds.
   - Logging: Increase nft verb with `nft monitor`.
   - If too slow, integrate Speedify (install via wget in entrypoint) for bonding, but it requires compatible VPNs.

This merged solution provides flexible, seamless routing/load balancing/failover across 8 VPNs, with minimal disruption via fast monitoring. For advanced bonding, add Speedify if your VPNs can tunnel through it. Test thoroughly.
