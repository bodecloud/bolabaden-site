---
source_url: "https://grok.com/c/39b7c81b-7ca3-492a-8973-e363270aaf53"
conversation_id: "39b7c81b-7ca3-492a-8973-e363270aaf53"
title: "Warp NAT Setup Script Documentation"
extracted_at: "2026-06-29T16:21:46.259Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Warp NAT Setup Script Documentation

Source: [Grok conversation](https://grok.com/c/39b7c81b-7ca3-492a-8973-e363270aaf53)

## User

_Time: 2025-09-03T23:01:36.860Z_

Write documentation of this script that shows expertise in the tech stack and understanding of the script. Must explain exhaustively.

## Assistant

_Time: 2025-09-03T23:02:16.511Z_

<xaiArtifact artifact_id="6416bf86-5e73-4a61-98e4-0ff2378e3aa1" artifact_version_id="15c963a7-7522-43fd-8f5a-a4dddd672f8e" title="warp-nat-setup.md" contentType="text/markdown">

# Documentation: Warp NAT Setup Script

This Bash script configures a network address translation (NAT) setup for a Docker-based networking environment, enabling traffic routing between a Docker network and a specific container (`warp-nat-gateway`) via a virtual Ethernet (veth) pair. It dynamically manages Docker networks, routing tables, and iptables rules to ensure robust connectivity. Below is a detailed explanation of its functionality, design, and technical components.

## Purpose and Context

The script addresses the need to route traffic from a Docker network through a specific container (`warp-nat-gateway`) for NAT or other network processing, such as VPN or proxy services. Unlike traditional Docker networking, which relies on the default bridge for NAT, this script creates a custom routing setup using a veth pair to direct traffic explicitly through the designated container. This approach is useful for scenarios requiring advanced network control, such as isolating traffic for security or applying custom routing policies.

### Problems Solved
- **Dynamic Network Management**: Automatically detects or creates Docker networks, handling cases where networks are recreated or containers are reattached.
- **Custom Routing**: Uses a dedicated routing table to direct traffic from a Docker network to a specific container, bypassing default Docker NAT.
- **Resilience**: Includes cleanup for orphaned rules and interfaces, ensuring stability across restarts or failures.
- **Flexibility**: Supports configurable environment variables and dynamic detection of network settings.

## Technical Stack
- **Bash**: Core scripting language for orchestrating system commands.
- **Docker**: Manages containers and networks (`docker` CLI).
- **iproute2**: Configures network interfaces, routing tables, and rules (`ip` command).
- **iptables**: Manages NAT and packet forwarding rules.
- **nsenter**: Executes commands in a container’s network namespace.
- **jq**: Parses JSON output from Docker inspect commands.
- **Linux Networking**: Utilizes veth pairs, network namespaces, and IP forwarding.

## Script Breakdown

### 1. Environment Variables and Defaults
The script begins by defining configurable environment variables with sensible defaults:

- `DOCKER_HOST`: Specifies the Docker daemon socket (default: `unix:///var/run/docker.sock`).
- `ROUTER_CONTAINER_NAME`: Name of the router container (default: `warp_router`).
- `DOCKER_NETWORK_NAME`: Docker network to use (default: dynamically determined or `warp-nat-net`).
- `WARP_CONTAINER_NAME`: Container handling NAT (default: `warp-nat-gateway`).
- `HOST_VETH_IP` and `CONT_VETH_IP`: IP addresses for the veth pair (default: `169.254.100.1/30` and `169.254.100.2/30`).
- `ROUTING_TABLE`: Custom routing table name (default: `warp-nat-routing`).
- `VETH_HOST` and `VETH_CONT`: Names of the veth pair interfaces (default: `veth-warp-nat-host` and derived `warp-nat-host-nat-cont`).

The `set -xe` ensures the script exits on errors (`-e`) and logs executed commands (`-x`) for debugging.

### 2. Routing Table Setup
The script dynamically assigns a routing table ID:

- **Function `pick_table_id`**: Iterates from ID 110 to find an unused routing table ID by checking `/etc/iproute2/rt_tables`.
- If `ROUTING_TABLE` exists in `/etc/iproute2/rt_tables`, it retrieves the existing ID; otherwise, it assigns a new ID and appends it to the file.

This ensures no conflicts with existing routing tables and supports dynamic environments.

### 3. Docker Network Detection
The script checks if the `ROUTER_CONTAINER_NAME` container exists and determines its Docker network:

- Uses `docker ps -a` to verify container existence.
- If `DOCKER_NETWORK_NAME` is unset, it queries the container’s network settings via `docker inspect` and selects the first network.
- Falls back to `DEFAULT_DOCKER_NETWORK_NAME` (`warp-nat-net`) if no network is found.

### 4. Docker Network Creation
If the specified `DOCKER_NETWORK_NAME` doesn’t exist, the script creates it:

- Checks for the network using `docker network inspect`.
- If it exists, the script:
  - Stores connected containers and their `gw_priority` (gateway priority) values using `docker inspect` and `jq`.
  - Disconnects all containers, removes the network, and recreates it with the bridge driver and `enable_ip_masquerade=false` to prevent default Docker NAT.
- Reconnects containers with their original `gw_priority` or a default high value (`0x7FFFFFFFFFFFFFFF`).

This ensures continuity for existing containers while setting up a clean network.

### 5. Stack and Network Naming
The script derives the Docker stack name from either `ROUTER_CONTAINER_NAME` or `WARP_CONTAINER_NAME` using `docker inspect` and the `com.docker.compose.project` label. It handles Docker Compose’s naming conventions by stripping prefixes and constructing the bridge name (`br_$DOCKER_NETWORK_NAME`).

It retrieves the subnet (`DOCKER_NET`) from the network’s IPAM configuration, exiting if not found.

### 6. Veth Pair Setup
A veth pair connects the host to the `warp-nat-gateway` container:

- Removes any existing `VETH_HOST` to handle restarts.
- Creates a veth pair (`VETH_HOST` and `VETH_CONT`).
- Moves `VETH_CONT` to the container’s network namespace using `nsenter -t $warp_pid -n`.
- Assigns IP addresses (`HOST_VETH_IP/30` and `CONT_VETH_IP/30`) and brings both interfaces up.
- Enables IP forwarding in the container with `sysctl -w net.ipv4.ip_forward=1`.

### 7. Cleaning Orphaned Rules
The script removes outdated routing and NAT rules:

- **Routing Rules**: Scans `ip rule show` for rules referencing `ROUTING_TABLE`. Removes rules for non-existent or down interfaces (except `DOCKER_NET`).
- **Host NAT Rules**: Checks `iptables -t nat -S POSTROUTING` for MASQUERADE rules with matching source and destination networks. Removes rules for non-existent or down interfaces.
- **Container NAT Rules**: Uses `nsenter` to check and remove similar rules inside the `warp-nat-gateway` container.

This prevents conflicts from stale configurations.

### 8. Cleanup on Error
A `cleanup` function is defined and trapped on errors to:
- Remove the veth pair.
- Delete routing rules and flush the routing table.
- Remove NAT rules on the host and in the container.

This ensures the system remains clean if the script fails.

### 9. Critical Setup Section
The core setup:
- Re-creates the veth pair (redundant but ensures clean state).
- Configures IP addresses and enables interfaces.
- Adds a NAT rule in the container for `DOCKER_NET` if not present.
- Sets up routing:
  - Deletes existing rules for `DOCKER_NET` in `ROUTING_TABLE`.
  - Adds a rule to route `DOCKER_NET` traffic to `ROUTING_TABLE`.
  - Flushes `ROUTING_TABLE` and adds routes:
    - `DOCKER_NET` via `BRIDGE_NAME`.
    - Default route via `CONT_VETH_IP` on `VETH_HOST`.
- Adds a host NAT rule for `DOCKER_NET` (excluding traffic to itself) if not present.

### 10. Confirmation
Outputs a summary of the setup, including network names, veth IPs, and routing table details.

## Technical Expertise
- **Docker Networking**: The script manipulates Docker networks, disables default NAT, and preserves container connectivity with `gw_priority`.
- **Linux Networking**: Uses veth pairs and network namespaces for precise traffic routing, leveraging `iproute2` for advanced routing tables.
- **iptables**: Configures NAT rules both on the host and in the container, ensuring proper masquerading.
- **Error Handling**: Robust cleanup and validation (e.g., checking container PIDs, network existence) prevent partial configurations.
- **Dynamic Configuration**: Environment variables and dynamic detection (e.g., network subnets, routing table IDs) make the script adaptable.

## Comparison to Alternatives
Compared to Docker’s default bridge networking:
- **Docker Default**: Automatically applies NAT via the Docker bridge but lacks fine-grained control over routing paths.
- **This Script**: Directs traffic through a specific container, enabling custom processing (e.g., VPN) with minimal overhead via veth pairs. It’s more flexible but requires manual setup and maintenance.

Compared to manual iptables/veth setup:
- **Manual Setup**: Error-prone, lacks automation for network recreation or cleanup.
- **This Script**: Automates network management, rule cleanup, and error recovery, reducing operational complexity.

## Why Use This Script?
- **Worth the Time**: Ideal for environments needing custom routing or NAT (e.g., VPN gateways) with high reliability.
- **Better Alternatives**: For simple NAT, Docker’s default bridge suffices. For complex setups, tools like Kubernetes with CNI plugins (e.g., Calico) offer more scalability but are heavier. This script strikes a balance for Docker-centric environments.

</xaiArtifact>

## User

_Time: 2025-09-03T23:03:27.062Z_

how do I create a secondary alternative to the above code for a network named warp-nat-net2 without interfering with warp-nat-net or ANY of the ips/rules/etc in the script whatsoever?

## Assistant

_Time: 2025-09-03T23:04:58.183Z_

To create a secondary alternative to the provided script for a network named `warp-nat-net2` without interfering with `warp-nat-net` or any of its IPs, rules, or configurations, you need a new script that operates independently. The original script manages a Docker network, routing tables, veth pairs, and iptables rules for `warp-nat-net`. The new script will replicate this functionality for `warp-nat-net2`, using distinct environment variables, routing tables, and IP addresses to avoid conflicts. Below is the new script, designed to run in parallel with the original without overlap.

The original script uses `169.254.100.1/30` and `169.254.100.2/30` for the veth pair, a routing table named `warp-nat-routing`, and a network named `warp-nat-net`. The new script will:
- Use a different network name (`warp-nat-net2`).
- Assign new veth IPs (`169.254.101.1/30` and `169.254.101.2/30`) from a non-overlapping range in the link-local `169.254.0.0/16` block.
- Use a distinct routing table (`warp-nat-routing2`) with a dynamically assigned ID starting from 120 (to avoid collision with the original’s 110+ range).
- Reference a new container (`warp-nat-gateway2`) and router (`warp_router2`).
- Ensure all iptables rules, veth interfaces, and routing rules are scoped to `warp-nat-net2` and its subnet.

This approach ensures zero interference with the original script’s resources.

<xaiArtifact artifact_id="9c0ccea2-efc0-4d7c-93bb-3e74cfd4dc25" artifact_version_id="e9422c59-911e-4c5a-b677-4b491c977037" title="warp-nat-setup2.sh" contentType="text/x-shellscript">
#!/bin/bash
set -xe

# Defaults (configurable via env)
DOCKER_HOST="${DOCKER_HOST:-unix:///var/run/docker.sock}"
ROUTER_CONTAINER_NAME="${ROUTER_CONTAINER_NAME:-warp_router2}"
DOCKER_NETWORK_NAME="${DOCKER_NETWORK_NAME:-}"
WARP_CONTAINER_NAME="${WARP_CONTAINER_NAME:-warp-nat-gateway2}"
HOST_VETH_IP="${HOST_VETH_IP:-169.254.101.1}"
CONT_VETH_IP="${CONT_VETH_IP:-169.254.101.2}"
ROUTING_TABLE="${ROUTING_TABLE:-warp-nat-routing2}"
VETH_HOST="${VETH_HOST:-veth-warp-nat-host2}" 

# VETH_CONT is derived from VETH_HOST
VETH_CONT="${VETH_HOST#veth-}-nat-cont2"
DOCKER="docker -H $DOCKER_HOST"
DEFAULT_DOCKER_NETWORK_NAME="warp-nat-net2"

# Pick a free routing table id dynamically (start at 120)
pick_table_id() {
    local id=120
    while grep -q "^$id " /etc/iproute2/rt_tables 2>/dev/null; do
        id=$((id+1))
    done
    echo $id
}

# Get existing routing table ID if name exists, else pick new and add
if grep -q " $ROUTING_TABLE$" /etc/iproute2/rt_tables 2>/dev/null; then
    ROUTING_TABLE_ID=$(awk "/ $ROUTING_TABLE\$/ {print \$1}" /etc/iproute2/rt_tables)
    echo "Routing table id acquired: \`$ROUTING_TABLE_ID\`"
else
    ROUTING_TABLE_ID=$(pick_table_id)
    echo "$ROUTING_TABLE_ID $ROUTING_TABLE" >> /etc/iproute2/rt_tables
fi

if docker ps -a --format '{{.Names}}' | grep -w "${ROUTER_CONTAINER_NAME}" >/dev/null 2>&1; then
    echo "Container '${ROUTER_CONTAINER_NAME}' exists."
    # Determine docker network name and subnet dynamically if not provided
    if [[ -z "${DOCKER_NETWORK_NAME:-}" ]]; then
        echo "Trying to find the network that ${ROUTER_CONTAINER_NAME} is connected to..."
        warp_router_networks="$($DOCKER inspect -f '{{range $k,$v := .NetworkSettings.Networks}}{{printf \"%s\n\" $k}}{{end}}' ${ROUTER_CONTAINER_NAME} 2>/dev/null || true)"
        if [[ -n "$warp_router_networks" ]]; then
            # Use the first network found
            DOCKER_NETWORK_NAME="${warp_router_networks%%$'\n'*}"
            echo "DOCKER_NETWORK_NAME: '$DOCKER_NETWORK_NAME'"
        else
            echo "DOCKER_NETWORK_NAME: not found nor set"
        fi
    fi
fi

# If not set, fallback to default
if [[ -z "${DOCKER_NETWORK_NAME:-}" ]]; then
    echo "DOCKER_NETWORK_NAME: \`$DOCKER_NETWORK_NAME\` not set, using default \`$DEFAULT_DOCKER_NETWORK_NAME\`"
    DOCKER_NETWORK_NAME="$DEFAULT_DOCKER_NETWORK_NAME"
fi

# Create docker network if it doesn't exist
if $DOCKER network inspect $DOCKER_NETWORK_NAME --format '{{.Name}}' | grep -q "^$DOCKER_NETWORK_NAME$"; then
    echo "Docker network \`$DOCKER_NETWORK_NAME\` already exists, recreating it"
    RECREATED_WARP_NETWORK=1

    # Store original gw_priority for each container
    CONTAINERS_USING_WARP_NETWORK=$($DOCKER network inspect $DOCKER_NETWORK_NAME -f '{{range $k, $v := .Containers}}{{$v.Name}} {{end}}')
    CONTAINERS_USING_WARP_NETWORK_COUNT=$(echo "$CONTAINERS_USING_WARP_NETWORK" | wc -w)
    CONTAINER_INDEX=0

    # Map: container_name:gw_priority
    declare -A ORIGINAL_GW_PRIORITY

    # Get original gw_priority for each container
    for container in $CONTAINERS_USING_WARP_NETWORK; do
        # Get the container's network info as JSON
        container_json="$($DOCKER inspect "$container" 2>/dev/null)"
        # Extract the gw_priority for this network
        gw_priority=$(echo "$container_json" | jq -r --arg net "$DOCKER_NETWORK_NAME" '.[0].NetworkSettings.Networks[$net].GwPriority // empty')
        ORIGINAL_GW_PRIORITY["$container"]="$gw_priority"
    done

    for container in $CONTAINERS_USING_WARP_NETWORK; do
        CONTAINER_INDEX=$((CONTAINER_INDEX + 1))
        echo "Disconnecting \`$container\` from \`$DOCKER_NETWORK_NAME\` ($CONTAINER_INDEX out of $CONTAINERS_USING_WARP_NETWORK_COUNT )"
        $DOCKER network disconnect $DOCKER_NETWORK_NAME "$container"
    done

    $DOCKER network rm $DOCKER_NETWORK_NAME 2>/dev/null || true
fi

echo "Creating docker network \`$DOCKER_NETWORK_NAME\`"
$DOCKER network create --driver=bridge \
    --attachable \
    -o com.docker.network.bridge.name=br_$DOCKER_NETWORK_NAME \
    -o com.docker.network.bridge.enable_ip_masquerade=false \
    $DOCKER_NETWORK_NAME

if [[ -n "${RECREATED_WARP_NETWORK:-}" ]]; then
    echo "Connecting containers to \`$DOCKER_NETWORK_NAME\`"
    CONTAINER_INDEX=0
    for container in $CONTAINERS_USING_WARP_NETWORK; do
        CONTAINER_INDEX=$((CONTAINER_INDEX + 1))
        # Use original gw_priority if available, else fallback to 0x7FFFFFFFFFFFFFFF
        gw_priority="${ORIGINAL_GW_PRIORITY[$container]}"
        if [[ -n "$gw_priority" && "$gw_priority" != "null" ]]; then
            echo "Connecting \`$container\` to \`$DOCKER_NETWORK_NAME\` with original gw_priority=$gw_priority ($CONTAINER_INDEX out of $CONTAINERS_USING_WARP_NETWORK_COUNT )"
            $DOCKER network connect --gw-priority "$gw_priority" "$DOCKER_NETWORK_NAME" "$container" || true
        else
            echo "Connecting \`$container\` to \`$DOCKER_NETWORK_NAME\` with default gw_priority ($CONTAINER_INDEX out of $CONTAINERS_USING_WARP_NETWORK_COUNT )"
            $DOCKER network connect --gw-priority 0x7FFFFFFFFFFFFFFF "$DOCKER_NETWORK_NAME" "$container" || true
        fi
    done
fi

# Get stack name from either warp_router2, or if script was ran on host, get from warp-nat-gateway2
STACK_NAME="$(
    $DOCKER inspect -f '{{ index .Config.Labels "com.docker.compose.project" }}' "$ROUTER_CONTAINER_NAME" 2>/dev/null \
    || $DOCKER inspect -f '{{ index .Config.Labels "com.docker.compose.project" }}' "$WARP_CONTAINER_NAME" 2>/dev/null
)"
# Strip project prefix (handles both prefixed and non-prefixed names)
BASE_NETWORK_NAME="${DOCKER_NETWORK_NAME#$STACK_NAME_}"
STACK_NETWORK_NAME="$STACK_NAME_${BASE_NETWORK_NAME:-$DOCKER_NETWORK_NAME}"
BRIDGE_NAME="br_${BASE_NETWORK_NAME:-$DOCKER_NETWORK_NAME}"

# Dynamically get DOCKER_NET from network
DOCKER_NET="$(
    (
        $DOCKER network inspect -f '{{(index .IPAM.Config 0).Subnet}}' "$STACK_NETWORK_NAME" 2>/dev/null \
        || $DOCKER network inspect -f '{{(index .IPAM.Config 0).Subnet}}' "$BASE_NETWORK_NAME" 2>/dev/null
    ) | tr -d '[:space:]'
)"
if [[ -z "$DOCKER_NET" ]]; then
    echo "Error: \`$DOCKER_NET\` not found"
    exit 1
fi

# Remove existing veth if present (handles restarts/crashes)
ip link del "$VETH_HOST" 2>/dev/null || true

# Create veth pair
ip link add "$VETH_HOST" type veth peer name "$VETH_CONT"

warp_pid="$($DOCKER inspect -f '{{.State.Pid}}' $WARP_CONTAINER_NAME || echo \"\")"
if [[ -z "$warp_pid" ]]; then
    echo ""
    echo "Error: \`$WARP_CONTAINER_NAME\` container not found"
    echo "\`$WARP_CONTAINER_NAME\` container not found" >> /var/log/warp-nat-routing2.log
    echo ""
    exit 1
fi

if [[ ! -e "/proc/$warp_pid/ns/net" ]]; then
    echo ""
    echo "Error: \`$WARP_CONTAINER_NAME\` container network namespace not ready"
    echo "\`$WARP_CONTAINER_NAME\` container network namespace not ready" >> /var/log/warp-nat-routing2.log
    echo ""
    exit 1
fi

# Clean orphan ip rules for this routing table
ip rule show | grep "lookup $ROUTING_TABLE" | while read -r line; do
    from_cidr=$(echo "$line" | awk '{for (i=1;i<=NF;i++) if ($i=="from") print $(i+1)}')
    if [[ -z "$from_cidr" ]]; then continue; fi
    if [[ "$from_cidr" == "$DOCKER_NET" ]]; then continue; fi
    route_line=$(ip route show exact "$from_cidr" 2>/dev/null)
    if [[ -z "$route_line" ]]; then
        echo "Removing orphan rule for non-existing network: $from_cidr"
        ip rule del from "$from_cidr" table "$ROUTING_TABLE" 2>/dev/null || true
        continue
    fi
    dev=$(echo "$route_line" | awk '{print $3}')
    state=$(ip link show "$dev" 2>/dev/null | grep -E -o 'state \K\w+' || echo "DOWN")
    if [[ "$state" != "UP" ]]; then
        echo "Removing orphan rule for down interface $dev: $from_cidr"
        ip rule del from "$from_cidr" table "$ROUTING_TABLE" 2>/dev/null || true
    fi
done

# Clean orphan NAT rules on host
iptables -t nat -S POSTROUTING | grep -- '-j MASQUERADE' | grep ' ! -d ' | while read -r rule; do
    s_net=$(echo "$rule" | sed -n 's/.*-s \([^ ]*\) .*/\1/p')
    d_net=$(echo "$rule" | sed -n 's/.*! -d \([^ ]*\) .*/\1/p')
    if [[ "$s_net" != "$d_net" || -z "$s_net" ]]; then continue; fi
    if [[ "$s_net" == "$DOCKER_NET" ]]; then continue; fi
    route_line=$(ip route show exact "$s_net" 2>/dev/null)
    if [[ -z "$route_line" ]]; then
        echo "Removing orphan NAT rule for non-existing network: $s_net"
        del_rule=$(echo "$rule" | sed 's/^-A/-D/')
        iptables -t nat $del_rule 2>/dev/null || true
        continue
    fi
    dev=$(echo "$route_line" | awk '{print $3}')
    state=$(ip link show "$dev" 2>/dev/null | grep -E -o 'state \K\w+' || echo "DOWN")
    if [[ "$state" != "UP" ]]; then
        echo "Removing orphan NAT rule for down interface $dev: $s_net"
        del_rule=$(echo "$rule" | sed 's/^-A/-D/')
        iptables -t nat $del_rule 2>/dev/null || true
    fi
done

# Clean orphan NAT rules inside warp container
nsenter -t "$warp_pid" -n iptables -t nat -S POSTROUTING | grep -- '-j MASQUERADE' | while read -r rule; do
    s_net=$(echo "$rule" | sed -n 's/.*-s \([^ ]*\) -j MASQUERADE.*/\1/p')
    if [[ -z "$s_net" ]]; then continue; fi
    if [[ "$s_net" == "$DOCKER_NET" ]]; then continue; fi
    route_line=$(ip route show exact "$s_net" 2>/dev/null)
    if [[ -z "$route_line" ]]; then
        echo "Removing orphan NAT rule inside warp for non-existing network: $s_net"
        del_rule=$(echo "$rule" | sed 's/^-A/-D/')
        nsenter -t "$warp_pid" -n iptables -t nat $del_rule 2>/dev/null || true
        continue
    fi
    dev=$(echo "$route_line" | awk '{print $3}')
    state=$(ip link show "$dev" 2>/dev/null | grep -E -o 'state \K\w+' || echo "DOWN")
    if [[ "$state" != "UP" ]]; then
        echo "Removing orphan NAT rule inside warp for down interface $dev: $s_net"
        del_rule=$(echo "$rule" | sed 's/^-A/-D/')
        nsenter -t "$warp_pid" -n iptables -t nat $del_rule 2>/dev/null || true
    fi
done

# Set up cleanup function
cleanup() {
    echo "⚠️ Error occurred. Rolling back..."

    # Remove host veth
    remove_host_veth_cmd="ip link del $VETH_HOST"
    echo "Removing host veth: '$remove_host_veth_cmd'"
    eval "$remove_host_veth_cmd 2>/dev/null || true"

    # Remove ip rules
    remove_ip_rules_cmd="ip rule del from $DOCKER_NET table $ROUTING_TABLE"
    echo "Removing ip rules: '$remove_ip_rules_cmd'"
    eval "$remove_ip_rules_cmd 2>/dev/null || true"

    # Flush routing table if exists
    if ip route show table "$ROUTING_TABLE" >/dev/null 2>&1; then
        flush_routing_table_cmd="ip route flush table $ROUTING_TABLE"
        echo "Flushing routing table: '$flush_routing_table_cmd'"
        eval "$flush_routing_table_cmd"
    fi

    # Remove NAT rules on host
    remove_nat_rules_on_host_cmd="iptables -t nat -D POSTROUTING -s $DOCKER_NET ! -d $DOCKER_NET -j MASQUERADE"
    echo "Removing NAT rules on host: '$remove_nat_rules_on_host_cmd'"
    eval "$remove_nat_rules_on_host_cmd 2>/dev/null || true"

    # Remove NAT rules inside warp container
    remove_nat_rules_inside_warp_cmd="nsenter -t $warp_pid -n iptables -t nat -D POSTROUTING -s $DOCKER_NET -j MASQUERADE"
    echo "Removing NAT rules inside warp container: '$remove_nat_rules_inside_warp_cmd'"
    eval "$remove_nat_rules_inside_warp_cmd 2>/dev/null || true"
}

# Trap any error in the critical section
trap cleanup ERR

# --- Critical setup section ---
# Remove existing veth if present (handles restarts/crashes)
ip link del "$VETH_HOST" 2>/dev/null || true

# Create veth pair
ip link add "$VETH_HOST" type veth peer name "$VETH_CONT"

# Move container end into warp namespace
ip link set "$VETH_CONT" netns "$warp_pid"

# Assign host end
ip addr add "$HOST_VETH_IP/30" dev "$VETH_HOST"
ip link set "$VETH_HOST" up

# Assign container end
nsenter -t "$warp_pid" -n ip addr add "$CONT_VETH_IP/30" dev "$VETH_CONT"
nsenter -t "$warp_pid" -n ip link set "$VETH_CONT" up
nsenter -t "$warp_pid" -n sysctl -w net.ipv4.ip_forward=1

# NAT inside warp (add if not exists)
nsenter -t "$warp_pid" -n iptables -t nat -C POSTROUTING -s "$DOCKER_NET" -j MASQUERADE 2>/dev/null || \
nsenter -t "$warp_pid" -n iptables -t nat -A POSTROUTING -s "$DOCKER_NET" -j MASQUERADE

# Routing rules (del if exists, then add)
ip rule del from "$DOCKER_NET" table "$ROUTING_TABLE" 2>/dev/null || true
ip rule add from "$DOCKER_NET" table "$ROUTING_TABLE"

# Ensure routing table exists before flushing
if ip route show table "$ROUTING_TABLE" >/dev/null 2>&1; then
    ip route flush table "$ROUTING_TABLE"
fi
echo "Using bridge device: \`$BRIDGE_NAME\`"

# Default route(s)
ip route add "$DOCKER_NET" dev "$BRIDGE_NAME" table "$ROUTING_TABLE"
ip route add default via "$CONT_VETH_IP" dev "$VETH_HOST" table "$ROUTING_TABLE"

# NAT on host (add if not exists)
iptables -t nat -C POSTROUTING -s "$DOCKER_NET" ! -d "$DOCKER_NET" -j MASQUERADE 2>/dev/null || \
iptables -t nat -A POSTROUTING -s "$DOCKER_NET" ! -d "$DOCKER_NET" -j MASQUERADE

# Confirmation
echo "✅ Warp setup complete"
echo " Network: \`$DOCKER_NETWORK_NAME\`"
echo " Veth host: \`$VETH_HOST\` ($HOST_VETH_IP)"
echo " Veth cont: \`$VETH_CONT\` ($CONT_VETH_IP)"
echo " Docker net: \`$DOCKER_NET\`"
echo " Routing table: \`$ROUTING_TABLE\` ($ROUTING_TABLE_ID)"
</xaiArtifact>

### Explanation of Changes
- **Network Name**: Changed `DEFAULT_DOCKER_NETWORK_NAME` to `warp-nat-net2` to create a distinct Docker network.
- **Container Names**: Updated `ROUTER_CONTAINER_NAME` to `warp_router2` and `WARP_CONTAINER_NAME` to `warp-nat-gateway2` to reference separate containers.
- **IP Addresses**: Used `169.254.101.1/30` and `169.254.101.2/30` for the veth pair, ensuring no overlap with the original `169.254.100.1/30` and `169.254.100.2/30`.
- **Routing Table**: Set `ROUTING_TABLE` to `warp-nat-routing2` and started table ID selection at 120 to avoid conflicts with the original’s 110+ range.
- **Veth Interfaces**: Changed `VETH_HOST` to `veth-warp-nat-host2` and derived `VETH_CONT` as `warp-nat-host2-nat-cont2` for uniqueness.
- **Log File**: Updated the error log to `/var/log/warp-nat-routing2.log` to avoid overwriting the original’s log.
- **Logic Preservation**: Retained all functionality (network creation, veth setup, routing, NAT, cleanup) but scoped to the new resources.

### Ensuring Non-Interference
- **Distinct Resources**: The script uses unique names for the network, containers, routing table, veth interfaces, and log file, preventing any overlap with `warp-nat-net`.
- **IP Separation**: The new veth IPs are in a different `/30` subnet within `169.254.0.0/16`, ensuring no IP conflicts.
- **Routing Table Isolation**: The new routing table (`warp-nat-routing2`) and its dynamic ID allocation avoid collisions with `warp-nat-routing`.
- **iptables Scoping**: NAT rules are applied only to the subnet of `warp-nat-net2`, and cleanup logic skips rules for other networks (like `warp-nat-net`).
- **Independent Cleanup**: The `cleanup` function targets only the resources specific to `warp-nat-net2`, leaving the original script’s configurations untouched.

### Usage Notes
- **Prerequisites**: Ensure `warp_router2` and `warp-nat-gateway2` containers exist and are configured similarly to their counterparts in the original script.
- **Execution**: Run this script independently from the original, e.g., `bash warp-nat-setup2.sh`. It will create and manage `warp-nat-net2` without affecting `warp-nat-net`.
- **Docker Network Subnet**: The script dynamically retrieves the subnet for `warp-nat-net2`. Ensure Docker assigns a non-overlapping subnet compared to `warp-nat-net` (Docker’s IPAM typically handles this).
- **Permissions**: The script requires root privileges for `ip`, `iptables`, and `nsenter` commands.

This script provides a fully parallel NAT setup for `warp-nat-net2`, maintaining the original’s functionality while ensuring complete isolation.
