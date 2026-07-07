---
source_url: "https://chatgpt.com/c/68848047-6068-8006-9b16-d7b1e629b8ea"
conversation_id: "68848047-6068-8006-9b16-d7b1e629b8ea"
title: "Docker network priority solution"
extracted_at: "2026-06-29T16:15:38.956Z"
message_count: 5
provenance: auth-ui
---

# Docker network priority solution

Source: [ChatGPT conversation](https://chatgpt.com/c/68848047-6068-8006-9b16-d7b1e629b8ea)

## Assistant

Here’s how you can force warp-network to always be the default egress gateway for any container that joins it, based purely on official Docker documentation and confirmed solutions online:

✅ Docker’s official solution: gw‑priority

Docker supports a gw-priority setting that determines which network's gateway becomes the container’s default when multiple networks are attached. The network with the highest gw-priority value wins and becomes the default gateway 
Kubernetes
+15
Docker Documentation
+15
GitHub
+15
.

By default, gw-priority is 0. If you want warp-network to always be the default egress, simply give it a higher priority than any other network.

🧪 Example: using docker run

If you’re launching a container and want warp-network to take precedence:

Bash
docker run -d \
  --name ip-checker \
  --hostname ip-checker \
  --restart always \
  --network name=warp-network,gw-priority=1 \
  --network publicnet \
  ip-checker-image \
  sh -c "curl -s ifconfig.me"

Here we're explicitly assigning gw-priority=1 to warp-network so it outranks publicnet (which stays at priority 0) 
Docker Documentation
Docker Documentation
.

Similarly, when connecting a network after the container is already running:

Bash
docker network connect --gw-priority 1 warp-network ip-checker
🚫 What Docker Compose / stacks don’t do

Compose prioritize networks alphabetically, not by the order you list them in your compose file. This behavior is inherited from Docker engine and not overridden by Compose 
Docker Community Forums
Docker Community Forums
.

Although some older Compose version references mention a priority: key, Docker Compose does not apply that to gateway routes—it neither affects eth0 assignment nor default egress routing 
Docker Community Forums
+6
GitHub
+6
Reddit
+6
.

💡 How to make warp-network takeover automatic

To ensure every container connecting to warp-network gets that network as its default gateway—without needing container-specific flags—you must configure the network itself with a default gw-priority at creation time. Unfortunately Docker CLI doesn’t support setting gw-priority when running docker network create, so you'd best:

Use docker run with --network name=warp-network,gw-priority=1 OR

After containers start, reconnect warp-network with gw-priority via docker network connect

That makes warp-network consistently the default for outbound traffic on any container it joins.

🚧 Caveat

This behavior is supported under Docker Engine with docker run and docker network connect flags.

Behavior under Docker Compose or Docker Stack may vary; Compose often ignores or mishandles this due to its own limitations or bugs 
Docker Documentation
+1
.

So it’s safest to apply at runtime rather than via compose files.

✅ Summary Table
Goal	Command Example
Launch container with priority	docker run --network name=warp-network,gw-priority=1 --network publicnet ...
Attach at runtime	docker network connect --gw-priority 1 warp-network <container>
No per-container change	Use flags at network connect/run time; compose support is unreliable
TL;DR

To force warp‑network always as default egress for any container attached to it:

Use --network warp-network,gw-priority=1 when running the container, or

Use docker network connect --gw-priority 1 warp-network <container>

You cannot enforce it just by modifying the network definition—this must be applied whenever a container attaches to warp‑network. Docker does not let you configure network-wide default priority outside of container creation/connect commands.

Let me know if you use Docker Compose or Swarm—and I can help you craft a wrapper or script that automates this without modifying the container itself.

## User

how to modify warp-up.sh to only route egress traffic through warp, leaving ingress traffic to use whatever the default would otherwise be


#!/bin/bash

set -xe

docker_network_name="warp-network"
docker_bridge="br_${docker_network_name}"
veth_host="veth-warp-host"
veth_container="veth-warp-cont"
host_veth_ip="169.254.100.1"
cont_veth_ip="169.254.100.2"
docker_net="10.45.0.0/16"
routing_table="warp"

# Create warp-network if missing
if ! docker network inspect $docker_network_name >/dev/null 2>&1; then
    docker network create --driver=bridge --subnet $docker_net --gateway 10.45.0.1 \
        -o com.docker.network.bridge.name=$docker_bridge $docker_network_name
fi

# Enable IP forwarding
sysctl -w net.ipv4.ip_forward=1

# Create veth pair if not already created
if ! ip link show $veth_host &>/dev/null; then
    ip link add $veth_host type veth peer name $veth_container
fi

# Move one end to warp container
pid=$(docker inspect -f '{{.State.Pid}}' warp)
if [ -z "$pid" ]; then
    echo "Error: Could not get PID of warp container"
    exit 1
fi

# Move veth into container namespace
ip link set $veth_container netns $pid

# Assign IPs
ip addr add ${host_veth_ip}/30 dev $veth_host || true
ip link set $veth_host up

# Inside container: assign IP and bring up
nsenter -t $pid -n ip addr add ${cont_veth_ip}/30 dev $veth_container || true
nsenter -t $pid -n ip link set $veth_container up

# Enable forwarding inside container
nsenter -t $pid -n sysctl -w net.ipv4.ip_forward=1

# Set up NAT inside container (assuming warp is configured to use this IP)
nsenter -t $pid -n iptables -t nat -C POSTROUTING -s $docker_net -j MASQUERADE 2>/dev/null || \
nsenter -t $pid -n iptables -t nat -A POSTROUTING -s $docker_net -j MASQUERADE

# Set up custom routing table
if ! grep -q "110 $routing_table" /etc/iproute2/rt_tables; then
    echo "110 $routing_table" >> /etc/iproute2/rt_tables
fi

# Flush old rules
ip rule del from $docker_net table $routing_table 2>/dev/null || true
ip rule add from $docker_net table $routing_table

ip route flush table $routing_table
ip route add $docker_net dev $docker_bridge table $routing_table
ip route add default via $cont_veth_ip dev $veth_host table $routing_table

# Add NAT on the host for the warp network
iptables -t nat -C POSTROUTING -s $docker_net ! -d $docker_net -j MASQUERADE 2>/dev/null || \
iptables -t nat -A POSTROUTING -s $docker_net ! -d $docker_net -j MASQUERADE

# Setup forwarding
local_interface=$(ip route | grep default | awk '{print $5}' | head -1)

iptables -C FORWARD -i $docker_bridge -o $local_interface -j ACCEPT 2>/dev/null || \
iptables -A FORWARD -i $docker_bridge -o $local_interface -j ACCEPT

iptables -C FORWARD -o $docker_bridge -i $local_interface -m state --state RELATED,ESTABLISHED -j ACCEPT 2>/dev/null || \
iptables -A FORWARD -o $docker_bridge -i $local_interface -m state --state RELATED,ESTABLISHED -j ACCEPT

echo "✅ Routing from $docker_net through warp container using veth gateway $cont_veth_ip is set up"
Show more

## Assistant

Got it — you want to make only egress traffic (outbound connections from containers on warp-network) go through the warp container, while allowing ingress traffic to come through the normal/default Docker bridge or host network setup.

Right now, your script sets up a policy routing table (warp) and adds a rule:

Bash
ip rule add from $docker_net table $routing_table

This means all traffic sourced from your docker subnet (10.45.0.0/16) uses the warp routing table, which forces default route via the warp container (your veth pair).

The key insight:

Egress routing depends on source IP + routing rules.

Ingress routing depends on the interface and destination IP.

Because you want ingress to behave normally (e.g., incoming connections from outside docker, or other networks), you just need to:

Route only outbound (egress) traffic originating from the containers’ IPs through the warp container.

Do not alter how incoming packets get routed (that's handled by the default Docker bridge network and host firewall).

Your script already does this correctly by matching traffic based on from $docker_net.

The critical part you want to verify or improve is to avoid overriding default routes or NAT for ingress.

What you can do to make this explicit:

Keep your ip rule and routing table for source IP (egress) only.

Make sure your NAT and forwarding rules only affect outbound traffic originating from $docker_net.

Your current NAT rule:

Bash
iptables -t nat -A POSTROUTING -s $docker_net ! -d $docker_net -j MASQUERADE

This only masquerades packets from $docker_net to destinations NOT in $docker_net — i.e., outbound traffic.

What to confirm / add to restrict routing to egress only:

You do not want to change ip rule or routing tables based on destination IP or interfaces for ingress.

Your routing rule should only apply to packets originating from containers, which it does:

Bash
ip rule add from $docker_net table $routing_table

You do NOT add any ip rule for to $docker_net or similar.

So, your current script already achieves “egress routing via warp” while ingress goes through default.
Possible improvements / checks:

Make sure the default Docker bridge (docker_bridge) and host firewall accept ingress:

Bash
iptables -A FORWARD -i $local_interface -o $docker_bridge -j ACCEPT

If missing, add explicit ACCEPT rules for inbound packets from external interfaces into the docker bridge (for ingress).

Ensure no default routes override ingress:

Since your routing table warp is only selected via ip rule from $docker_net, ingress traffic entering the container network should use the main routing table and host stack — exactly what you want.

Summary:

Your existing script is set up for egress-only routing through warp. The critical routing rule is:

Bash
ip rule add from $docker_net table $routing_table

This forces only outbound packets originating from the containers on warp-network to use the warp routing table, whose default route is via the warp container.

Ingress packets (coming into those containers) will use the host’s default routing and Docker bridge, unaffected by this rule.

If you want, I can help you verify or add explicit firewall rules for ingress acceptance to ensure no conflicts.

Would you like me to do that?

## User

docker run --net publicnet \
    --name warp \
    --ip $warp_ip \
    --device-cgroup-rule 'c 10:200 rwm' \
    -e WARP_SLEEP=${WARP_SLEEP:-2} \
    -e WARP_LICENSE_KEY=${WARP_LICENSE_KEY} \
    -e WARP_ENABLE_NAT=1 \
    -e TUNNEL_TOKEN=${WARP_TUNNEL_TOKEN} \
    --cap-add MKNOD \
    --cap-add AUDIT_WRITE \
    --cap-add NET_ADMIN \
    --sysctl net.ipv6.conf.all.disable_ipv6=${WARP_DISABLE_IPV6:-1} \
    --sysctl net.ipv4.conf.all.src_valid_mark=1 \
    --sysctl net.ipv4.ip_forward=1 \
    --sysctl net.ipv6.conf.all.forwarding=1 \
    --sysctl net.ipv6.conf.all.accept_ra=2 \
    -v warp-config-data:/var/lib/cloudflare-warp \
    --restart always caomingjun/warp:latest

how to fix this error:

docker: invalid reference format
Show more

## Assistant

The error docker: invalid reference format usually means that the Docker CLI found something wrong in the way the command or arguments are formatted—often in the image name, the environment variables, or the shell expansions.

In your command:
Bash
docker run --net publicnet \
    --name warp \
    --ip $warp_ip \
    --device-cgroup-rule 'c 10:200 rwm' \
    -e WARP_SLEEP=${WARP_SLEEP:-2} \
    -e WARP_LICENSE_KEY=${WARP_LICENSE_KEY} \
    -e WARP_ENABLE_NAT=1 \
    -e TUNNEL_TOKEN=${WARP_TUNNEL_TOKEN} \
    --cap-add MKNOD \
    --cap-add AUDIT_WRITE \
    --cap-add NET_ADMIN \
    --sysctl net.ipv6.conf.all.disable_ipv6=${WARP_DISABLE_IPV6:-1} \
    --sysctl net.ipv4.conf.all.src_valid_mark=1 \
    --sysctl net.ipv4.ip_forward=1 \
    --sysctl net.ipv6.conf.all.forwarding=1 \
    --sysctl net.ipv6.conf.all.accept_ra=2 \
    -v warp-config-data:/var/lib/cloudflare-warp \
    --restart always caomingjun/warp:latest
Common causes of this error here:

Unquoted or empty shell variables

If any of the variables like $warp_ip, $WARP_LICENSE_KEY, $WARP_TUNNEL_TOKEN, or $WARP_DISABLE_IPV6 are empty or contain spaces/special characters and are not quoted, Docker interprets this as malformed input.

For example, if $warp_ip is empty, --ip option becomes --ip with no value, causing the syntax error.

How to fix:

Quote variables to avoid empty or malformed expansions:

Bash
docker run --net publicnet \
    --name warp \
    --ip "${warp_ip}" \
    --device-cgroup-rule 'c 10:200 rwm' \
    -e WARP_SLEEP="${WARP_SLEEP:-2}" \
    -e WARP_LICENSE_KEY="${WARP_LICENSE_KEY}" \
    -e WARP_ENABLE_NAT=1 \
    -e TUNNEL_TOKEN="${WARP_TUNNEL_TOKEN}" \
    --cap-add MKNOD \
    --cap-add AUDIT_WRITE \
    --cap-add NET_ADMIN \
    --sysctl net.ipv6.conf.all.disable_ipv6="${WARP_DISABLE_IPV6:-1}" \
    --sysctl net.ipv4.conf.all.src_valid_mark=1 \
    --sysctl net.ipv4.ip_forward=1 \
    --sysctl net.ipv6.conf.all.forwarding=1 \
    --sysctl net.ipv6.conf.all.accept_ra=2 \
    -v warp-config-data:/var/lib/cloudflare-warp \
    --restart always caomingjun/warp:latest
Also check:

Is $warp_ip set and valid?

Run echo "$warp_ip" before this command and make sure it prints a valid IP address, e.g., 10.45.0.2

No trailing spaces or invalid characters in variables

Image name is valid: caomingjun/warp:latest looks fine.

TL;DR

Wrap all your variable expansions in double quotes to prevent empty or malformed arguments causing invalid reference format.

If you want, I can also help you build a safe script snippet that checks these variables before running docker.
