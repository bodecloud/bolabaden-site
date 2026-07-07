---
source_url: "https://grok.com/c/aa12a00c-e93e-478a-ba3b-299232bad9f3"
conversation_id: "aa12a00c-e93e-478a-ba3b-299232bad9f3"
title: "Docker Network Configuration and Cleanup"
extracted_at: "2026-06-29T16:24:06.182Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Docker Network Configuration and Cleanup

Source: [Grok conversation](https://grok.com/c/aa12a00c-e93e-478a-ba3b-299232bad9f3)

## User

_Time: 2025-08-28T23:47:14.931Z_

```
+ command -v jq
+ DOCKER='docker -H unix:///var/run/docker.sock'
+ ROUTER_CONTAINER_NAME_PROVIDED=false
+ [[ -n '' ]]
+ ROUTER_CONTAINER_NAME=warp_router
+ DOCKER_NETWORK_NAME_PROVIDED=false
+ [[ -n x ]]
+ DOCKER_NETWORK_NAME_PROVIDED=true
+ DOCKER_NETWORK_NAME=warp-nat-net
+ WARP_CONTAINER_NAME_PROVIDED=false
+ [[ -n x ]]
+ WARP_CONTAINER_NAME_PROVIDED=true
+ WARP_CONTAINER_NAME=warp-nat-gateway
+ HOST_VETH_IP_PROVIDED=false
+ [[ -n x ]]
+ HOST_VETH_IP_PROVIDED=true
+ HOST_VETH_IP=169.254.100.1
+ CONT_VETH_IP_PROVIDED=false
+ [[ -n x ]]
+ CONT_VETH_IP_PROVIDED=true
+ CONT_VETH_IP=169.254.100.2
+ ROUTING_TABLE_PROVIDED=false
+ [[ -n x ]]
+ ROUTING_TABLE_PROVIDED=true
+ ROUTING_TABLE=warp-nat-routing
+ VETH_HOST_PROVIDED=false
+ [[ -n x ]]
+ VETH_HOST_PROVIDED=true
+ VETH_HOST=veth-warp
+ VETH_CONT=warp-nat-cont
+ grep -q ' warp-nat-routing$' /etc/iproute2/rt_tables
++ awk '/ warp-nat-routing$/ {print $1}' /etc/iproute2/rt_tables
+ ROUTING_TABLE_ID=112
+ echo 'Routing table id acquired: '\''112'\'''
Routing table id acquired: '112'
+ [[ -z warp-nat-net ]]
+ [[ -z warp-nat-net ]]
++ docker -H unix:///var/run/docker.sock inspect -f '{{len .NetworkSettings.Networks}}' warp_router
+ warp_router_network_count=1
+ [[ 1 -eq 0 ]]
++ docker inspect -f '{{ index .Config.Labels "com.docker.compose.project" }}' warp_router
STACK_NAME: my-media-stack
+ STACK_NAME=my-media-stack
+ echo 'STACK_NAME: my-media-stack'
+ BASE_NETWORK_NAME=warp-nat-net
+ STACK_NETWORK_NAME=my-media-stack_warp-nat-net
+ BRIDGE_NAME=br_warp-nat-net
++ docker -H unix:///var/run/docker.sock network inspect -f '{{(index .IPAM.Config 0).Subnet}}' my-media-stack_warp-nat-net
++ docker -H ++ unix:///var/run/docker.sock network inspect -f tr -d '[:space:]'
'{{(index .IPAM.Config 0).Subnet}}' warp-nat-net
DOCKER_NET: "
10.0.1.0/24"
+ DOCKER_NET='
10.0.1.0/24'
+ echo 'DOCKER_NET: "
10.0.1.0/24"'
+ [[ -z 
10.0.1.0/24 ]]
++ docker -H unix:///var/run/docker.sock inspect -f '{{.State.Pid}}' warp-nat-gateway
+ warp_pid=829173
+ [[ ! -e /proc/829173/ns/net ]]
+ ip rule show
+ grep 'lookup warp-nat-routing'
+ read -r line
++ echo '5204:  from 10.0.1.0/24 lookup warp-nat-routing'
++ awk '{for (i=1;i<=NF;i++) if ($i=="from") print $(i+1)}'
+ from_cidr=10.0.1.0/24
+ [[ -z 10.0.1.0/24 ]]
+ [[ 10.0.1.0/24 == \
\1\0\.\0\.\1\.\0\/\2\4 ]]
++ ip route show exact 10.0.1.0/24
+ route_line='10.0.1.0/24 dev br-d3b2c0de4266 proto kernel scope link src 10.0.1.1 '
+ [[ -z 10.0.1.0/24 dev br-d3b2c0de4266 proto kernel scope link src 10.0.1.1  ]]
++ echo '10.0.1.0/24 dev br-d3b2c0de4266 proto kernel scope link src 10.0.1.1 '
++ awk '{print $3}'
+ dev=br-d3b2c0de4266
++ ip link show br-d3b2c0de4266
++ grep -oP 'state \K\w+'
grep: unrecognized option: P
BusyBox v1.37.0 (2025-05-26 20:04:45 UTC) multi-call binary.

Usage: grep [-HhnlLoqvsrRiwFE] [-m N] [-A|B|C N] { PATTERN | -e PATTERN... | -f FILE... } [FILE]...

Search for PATTERN in FILEs (or stdin)

        -H      Add 'filename:' prefix
        -h      Do not add 'filename:' prefix
        -n      Add 'line_no:' prefix
        -l      Show only names of files that match
        -L      Show only names of files that don't match
        -c      Show only count of matching lines
        -o      Show only the matching part of line
        -q      Quiet. Return 0 if PATTERN is found, 1 otherwise
        -v      Select non-matching lines
        -s      Suppress open and read errors
        -r      Recurse
        -R      Recurse and dereference symlinks
        -i      Ignore case
        -w      Match whole words only
        -x      Match whole lines only
        -F      PATTERN is a literal (not regexp)
        -E      PATTERN is an extended regexp
        -m N    Match up to N times per file
        -A N    Print N lines of trailing context
        -B N    Print N lines of leading context
        -C N    Same as '-A N -B N'
        -e PTRN Pattern to match
        -f FILE Read pattern from file
++ echo DOWN
+ state=DOWN
+ [[ DOWN != \U\P ]]
Removing orphan rule for down interface br-d3b2c0de4266: 10.0.1.0/24
+ echo 'Removing orphan rule for down interface br-d3b2c0de4266: 10.0.1.0/24'
+ ip rule del from 10.0.1.0/24 table warp-nat-routing
+ read -r line
+ grep + grep ' ! -d '
-- '-j MASQUERADE'
+ iptables -t nat -S POSTROUTING
+ read -r rule
+ nsenter -t 829173 -n iptables -t nat -S POSTROUTING
+ read -r rule
+ grep -- '-j MASQUERADE'
++ echo '-A POSTROUTING -s 10.0.1.0/24 -j MASQUERADE'
++ sed -n 's/.*-s \([^ ]*\) -j MASQUERADE.*/\1/p'
+ s_net=10.0.1.0/24
+ [[ -z 10.0.1.0/24 ]]
+ [[ 10.0.1.0/24 == \
\1\0\.\0\.\1\.\0\/\2\4 ]]
++ ip route show exact 10.0.1.0/24
+ route_line='10.0.1.0/24 dev br-d3b2c0de4266 proto kernel scope link src 10.0.1.1 '
+ [[ -z 10.0.1.0/24 dev br-d3b2c0de4266 proto kernel scope link src 10.0.1.1  ]]
++ awk '{print $3}'
++ echo '10.0.1.0/24 dev br-d3b2c0de4266 proto kernel scope link src 10.0.1.1 '
+ dev=br-d3b2c0de4266
++ grep -oP 'state \K\w+'
grep: unrecognized option: P
++ ip link show br-d3b2c0de4266
BusyBox v1.37.0 (2025-05-26 20:04:45 UTC) multi-call binary.

Usage: grep [-HhnlLoqvsrRiwFE] [-m N] [-A|B|C N] { PATTERN | -e PATTERN... | -f FILE... } [FILE]...

Search for PATTERN in FILEs (or stdin)

        -H      Add 'filename:' prefix
        -h      Do not add 'filename:' prefix
        -n      Add 'line_no:' prefix
        -l      Show only names of files that match
        -L      Show only names of files that don't match
        -c      Show only count of matching lines
        -o      Show only the matching part of line
        -q      Quiet. Return 0 if PATTERN is found, 1 otherwise
        -v      Select non-matching lines
        -s      Suppress open and read errors
        -r      Recurse
        -R      Recurse and dereference symlinks
        -i      Ignore case
        -w      Match whole words only
        -x      Match whole lines only
        -F      PATTERN is a literal (not regexp)
        -E      PATTERN is an extended regexp
        -m N    Match up to N times per file
        -A N    Print N lines of trailing context
        -B N    Print N lines of leading context
        -C N    Same as '-A N -B N'
        -e PTRN Pattern to match
        -f FILE Read pattern from file
++ echo DOWN
+ state=DOWN
+ [[ DOWN != \U\P ]]
+ echo 'Removing orphan NAT rule inside warp for down interface br-d3b2c0de4266: 10.0.1.0/24'
Removing orphan NAT rule inside warp for down interface br-d3b2c0de4266: 10.0.1.0/24
++ echo '-A POSTROUTING -s 10.0.1.0/24 -j MASQUERADE'
++ sed 's/^-A/-D/'
+ del_rule='-D POSTROUTING -s 10.0.1.0/24 -j MASQUERADE'
+ nsenter -t 829173 -n iptables -t nat -D POSTROUTING -s 10.0.1.0/24 -j MASQUERADE
+ read -r rule
+ trap cleanup ERR
+ ip link del veth-warp
+ true
+ ip link add veth-warp type veth peer name warp-nat-cont
+ ip link set warp-nat-cont netns 829173
+ ip addr add 169.254.100.1/30 dev veth-warp
+ ip link set veth-warp up
+ nsenter -t 829173 -n ip addr add 169.254.100.2/30 dev warp-nat-cont
+ nsenter -t 829173 -n ip link set warp-nat-cont up
+ nsenter -t 829173 -n sysctl -w net.ipv4.ip_forward=1
net.ipv4.ip_forward = 1
+ nsenter -t 829173 -n iptables -t nat -C POSTROUTING -s '
10.0.1.0/24' -j MASQUERADE
+ nsenter -t 829173 -n iptables -t nat -A POSTROUTING -s '
10.0.1.0/24' -j MASQUERADE
+ ip rule del from '
10.0.1.0/24' table warp-nat-routing
+ true
+ ip rule add from '
10.0.1.0/24' table warp-nat-routing
+ ip route show table warp-nat-routing
+ ip route flush table warp-nat-routing
+ echo 'Using bridge device: br_warp-nat-net'
+ ip route show table warp-nat-routing
Using bridge device: br_warp-nat-net
+ ip route flush table warp-nat-routing
+ ip route add '
10.0.1.0/24' dev br_warp-nat-net table warp-nat-routing
Cannot find device "br_warp-nat-net"
⚠️ Error occurred. Rolling back...
Removing host veth: 'ip link del veth-warp'
++ cleanup
++ echo '⚠️ Error occurred. Rolling back...'
++ remove_host_veth_cmd='ip link del veth-warp'
++ echo 'Removing host veth: '\''ip link del veth-warp'\'''
++ eval 'ip link del veth-warp 2>/dev/null || true'
+++ ip link del veth-warp
++ remove_ip_rules_cmd='ip rule del from 
10.0.1.0/24 table warp-nat-routing'
++ echo 'Removing ip rules: '\''ip rule del from 
10.0.1.0/24 table warp-nat-routing'\'''
Removing ip rules: 'ip rule del from 
10.0.1.0/24 table warp-nat-routing'
++ eval 'ip rule del from 
10.0.1.0/24 table warp-nat-routing 2>/dev/null || true'
+++ ip rule del from
Command line is not complete. Try option "help"
/usr/local/bin/warp-nat-setup.sh: line 293: pop_var_context: head of shell_variables not a function context
```

 
how to fix above error in my script?

```



volumes:
  warp-config-data:


networks:
  public:
    driver: bridge


configs:
  warp-nat-setup.sh:
    content: |
      #!/bin/bash
      set -xe

      # curl is already present; install jq manually if not present
      if ! command -v jq >/dev/null 2>&1; then
        echo \"jq not found, installing...\"
        ARCH=$$(uname -m)
        case \"$$ARCH\" in
          x86_64) JQ_ARCH=\"amd64\" ;;
          aarch64|arm64) JQ_ARCH=\"aarch64\" ;;
          *) echo \"Unsupported architecture: $$ARCH\"; exit 1 ;;
        esac
        # Get the latest release tag from GitHub API
        LATEST_TAG=$$(curl -s https://api.github.com/repos/jqlang/jq/releases/latest | grep '\"tag_name\":' | sed -E 's/.*\"([^\"]+)\".*/\1/')
        JQ_URL=\"https://github.com/jqlang/jq/releases/download/$$LATEST_TAG/jq-linux-$$JQ_ARCH\"
        JQ_BIN=\"/usr/local/bin/jq\"
        curl -L -o \"$${JQ_BIN}\" \"$${JQ_URL}\" && chmod +x \"$${JQ_BIN}\"
      fi

      DOCKER="docker -H $${DOCKER_HOST:-unix:///var/run/docker.sock}"

      # Defaults (configurable via env)

      # Track if variables were provided before setting defaults
      ROUTER_CONTAINER_NAME_PROVIDED=false
      if [[ -n "$${ROUTER_CONTAINER_NAME+x}" ]]; then
        ROUTER_CONTAINER_NAME_PROVIDED=true
      fi
      ROUTER_CONTAINER_NAME="$${ROUTER_CONTAINER_NAME:-warp_router}"

      DOCKER_NETWORK_NAME_PROVIDED=false
      if [[ -n "$${DOCKER_NETWORK_NAME+x}" ]]; then
        DOCKER_NETWORK_NAME_PROVIDED=true
      fi
      DOCKER_NETWORK_NAME="$${DOCKER_NETWORK_NAME:-}"

      WARP_CONTAINER_NAME_PROVIDED=false
      if [[ -n "$${WARP_CONTAINER_NAME+x}" ]]; then
        WARP_CONTAINER_NAME_PROVIDED=true
      fi
      WARP_CONTAINER_NAME="$${WARP_CONTAINER_NAME:-warp-nat-gateway}"

      HOST_VETH_IP_PROVIDED=false
      if [[ -n "$${HOST_VETH_IP+x}" ]]; then
        HOST_VETH_IP_PROVIDED=true
      fi
      HOST_VETH_IP="$${HOST_VETH_IP:-169.254.100.1}"

      CONT_VETH_IP_PROVIDED=false
      if [[ -n "$${CONT_VETH_IP+x}" ]]; then
        CONT_VETH_IP_PROVIDED=true
      fi
      CONT_VETH_IP="$${CONT_VETH_IP:-169.254.100.2}"

      ROUTING_TABLE_PROVIDED=false
      if [[ -n "$${ROUTING_TABLE+x}" ]]; then
        ROUTING_TABLE_PROVIDED=true
      fi
      ROUTING_TABLE="$${ROUTING_TABLE:-warp-nat-routing}"

      VETH_HOST_PROVIDED=false
      if [[ -n "$${VETH_HOST+x}" ]]; then
        VETH_HOST_PROVIDED=true
      fi
      VETH_HOST="$${VETH_HOST:-veth-warp-nat-host}" 

      # VETH_CONT is derived from VETH_HOST, so we only need to track VETH_HOST_PROVIDED
      VETH_CONT="$${VETH_HOST#veth-}-nat-cont"

      # Pick a free routing table id dynamically (start at 110)
      pick_table_id() {
      local id=110
      while grep -q "^$$id " /etc/iproute2/rt_tables 2>/dev/null; do
          id=$$((id+1))
      done
      echo $$id
      }

      # Get existing routing table ID if name exists, else pick new and add
      if grep -q " $$ROUTING_TABLE$$" /etc/iproute2/rt_tables 2>/dev/null; then
          ROUTING_TABLE_ID=$$(awk "/ $$ROUTING_TABLE\$$/ {print \$$1}" /etc/iproute2/rt_tables)
          echo "Routing table id acquired: '$$ROUTING_TABLE_ID'"
      else
          ROUTING_TABLE_ID=$$(pick_table_id)
          echo "$$ROUTING_TABLE_ID $$ROUTING_TABLE" >> /etc/iproute2/rt_tables
      fi

      # Determine docker network name and subnet dynamically if not provided
      if [[ -z "$${DOCKER_NETWORK_NAME:-}" ]]; then
          echo "Trying to find the network that $${ROUTER_CONTAINER_NAME} is connected to..."
          warp_router_networks="$$($$DOCKER inspect -f '{{range $$k,$$v := .NetworkSettings.Networks}}{{printf \"%s\n\" $$k}}{{end}}' $${ROUTER_CONTAINER_NAME} 2>/dev/null || true)"
          if [[ -n "$$warp_router_networks" ]]; then
              # Use the first network found
              DOCKER_NETWORK_NAME="$${warp_router_networks%%$$'\n'*}"
              echo "DOCKER_NETWORK_NAME: '$$DOCKER_NETWORK_NAME'"
          else
              echo "DOCKER_NETWORK_NAME: not found nor set"
          fi
      fi

      # If still not set, fallback to default
      if [[ -z "$${DOCKER_NETWORK_NAME:-}" ]]; then
          echo "DOCKER_NETWORK_NAME: '$$DOCKER_NETWORK_NAME' not set, using default 'warp-nat-net'"
          DOCKER_NETWORK_NAME="warp-nat-net"
          if ! "$$(echo $$($$DOCKER network inspect $$DOCKER_NETWORK_NAME) | jq -r '.IPAM.Config[0].Subnet')" >/dev/null 2>&1; then
              echo "Creating docker network '$$DOCKER_NETWORK_NAME'"
              $$DOCKER network create --driver=bridge \
              -o com.docker.network.bridge.name="br_$$DOCKER_NETWORK_NAME" \
              -o com.docker.network.bridge.enable_ip_masquerade=false \
              "$$DOCKER_NETWORK_NAME"
          else
              echo "DOCKER_NETWORK_NAME: '$$DOCKER_NETWORK_NAME' already exists"
          fi
      fi

      # Only create the network if router container is not connected to any network
      warp_router_network_count="$$($$DOCKER inspect -f '{{len .NetworkSettings.Networks}}' $${ROUTER_CONTAINER_NAME} 2>/dev/null || echo 0)"
      if [[ "$$warp_router_network_count" -eq 0 ]]; then
          if ! $$DOCKER network inspect "$$DOCKER_NETWORK_NAME" >/dev/null 2>&1; then
              echo "Creating docker network '$$DOCKER_NETWORK_NAME'"
              $$DOCKER network create --driver=bridge \
              -o com.docker.network.bridge.name="br_$$DOCKER_NETWORK_NAME" \
              -o com.docker.network.bridge.enable_ip_masquerade=false \
              "$$DOCKER_NETWORK_NAME"
          fi
      fi

      STACK_NAME=$$(docker inspect -f '{{ index .Config.Labels "com.docker.compose.project" }}' $${ROUTER_CONTAINER_NAME} 2>/dev/null || echo "")
      echo "STACK_NAME: $$STACK_NAME"

      # Strip project prefix (handles both prefixed and non-prefixed names)
      # Pattern includes trailing '_' for Compose-managed networks
      BASE_NETWORK_NAME="$${DOCKER_NETWORK_NAME#$${STACK_NAME}_}"
      STACK_NETWORK_NAME="$${STACK_NAME}_$${BASE_NETWORK_NAME:-$$DOCKER_NETWORK_NAME}"
      BRIDGE_NAME="br_$${BASE_NETWORK_NAME:-$$DOCKER_NETWORK_NAME}"

      # Dynamically get DOCKER_NET from network
      DOCKER_NET="$$($$DOCKER network inspect -f '{{(index .IPAM.Config 0).Subnet}}' $$STACK_NETWORK_NAME 2>/dev/null || \
             $$DOCKER network inspect -f '{{(index .IPAM.Config 0).Subnet}}' $$BASE_NETWORK_NAME 2>/dev/null | tr -d '[:space:]')"
      echo "DOCKER_NET: \"$$DOCKER_NET\""
      if [[ -z "$$DOCKER_NET" ]]; then
          echo "Error: DOCKER_NET not found"
          exit 1
      fi

      warp_pid="$$($$DOCKER inspect -f '{{.State.Pid}}' $$WARP_CONTAINER_NAME || echo "")"

      if [[ ! -e "/proc/$$warp_pid/ns/net" ]]; then
          echo "Error: warp-nat-gateway container network namespace not ready"
          echo "warp-nat-gateway container network namespace not ready" >> /var/log/warp-nat-routing.log
          exit 1
      fi

      # Clean orphan ip rules for this routing table
      ip rule show | grep "lookup $$ROUTING_TABLE" | while read -r line; do
          from_cidr=$$(echo "$$line" | awk '{for (i=1;i<=NF;i++) if ($$i=="from") print $$(i+1)}')
          if [[ -z "$$from_cidr" ]]; then continue; fi
          if [[ "$$from_cidr" == "$$DOCKER_NET" ]]; then continue; fi
          route_line=$$(ip route show exact "$$from_cidr" 2>/dev/null)
          if [[ -z "$$route_line" ]]; then
              echo "Removing orphan rule for non-existing network: $$from_cidr"
              ip rule del from "$$from_cidr" table "$$ROUTING_TABLE" 2>/dev/null || true
              continue
          fi
          dev=$$(echo "$$route_line" | awk '{print $$3}')
          state=$$(ip link show "$$dev" 2>/dev/null | grep -oP 'state \K\w+' || echo "DOWN")
          if [[ "$$state" != "UP" ]]; then
              echo "Removing orphan rule for down interface $$dev: $$from_cidr"
              ip rule del from "$$from_cidr" table "$$ROUTING_TABLE" 2>/dev/null || true
          fi
      done

      # Clean orphan NAT rules on host
      iptables -t nat -S POSTROUTING | grep -- '-j MASQUERADE' | grep ' ! -d ' | while read -r rule; do
          s_net=$$(echo "$$rule" | sed -n 's/.*-s \([^ ]*\) .*/\1/p')
          d_net=$$(echo "$$rule" | sed -n 's/.*! -d \([^ ]*\) .*/\1/p')
          if [[ "$$s_net" != "$$d_net" || -z "$$s_net" ]]; then continue; fi
          if [[ "$$s_net" == "$$DOCKER_NET" ]]; then continue; fi
          route_line=$$(ip route show exact "$$s_net" 2>/dev/null)
          if [[ -z "$$route_line" ]]; then
              echo "Removing orphan NAT rule for non-existing network: $$s_net"
              del_rule=$$(echo "$$rule" | sed 's/^-A/-D/')
              iptables -t nat $$del_rule 2>/dev/null || true
              continue
          fi
          dev=$$(echo "$$route_line" | awk '{print $$3}')
          state=$$(ip link show "$$dev" 2>/dev/null | grep -oP 'state \K\w+' || echo "DOWN")
          if [[ "$$state" != "UP" ]]; then
              echo "Removing orphan NAT rule for down interface $$dev: $$s_net"
              del_rule=$$(echo "$$rule" | sed 's/^-A/-D/')
              iptables -t nat $$del_rule 2>/dev/null || true
          fi
      done

      # Clean orphan NAT rules inside warp container
      nsenter -t "$$warp_pid" -n iptables -t nat -S POSTROUTING | grep -- '-j MASQUERADE' | while read -r rule; do
          s_net=$$(echo "$$rule" | sed -n 's/.*-s \([^ ]*\) -j MASQUERADE.*/\1/p')
          if [[ -z "$$s_net" ]]; then continue; fi
          if [[ "$$s_net" == "$$DOCKER_NET" ]]; then continue; fi
          route_line=$$(ip route show exact "$$s_net" 2>/dev/null)
          if [[ -z "$$route_line" ]]; then
              echo "Removing orphan NAT rule inside warp for non-existing network: $$s_net"
              del_rule=$$(echo "$$rule" | sed 's/^-A/-D/')
              nsenter -t "$$warp_pid" -n iptables -t nat $$del_rule 2>/dev/null || true
              continue
          fi
          dev=$$(echo "$$route_line" | awk '{print $$3}')
          state=$$(ip link show "$$dev" 2>/dev/null | grep -oP 'state \K\w+' || echo "DOWN")
          if [[ "$$state" != "UP" ]]; then
              echo "Removing orphan NAT rule inside warp for down interface $$dev: $$s_net"
              del_rule=$$(echo "$$rule" | sed 's/^-A/-D/')
              nsenter -t "$$warp_pid" -n iptables -t nat $$del_rule 2>/dev/null || true
          fi
      done

      # Set up cleanup function
      cleanup() {
          echo "⚠️ Error occurred. Rolling back..."

          # Remove host veth
          remove_host_veth_cmd="ip link del $$VETH_HOST"
          echo "Removing host veth: '$$remove_host_veth_cmd'"
          eval "$$remove_host_veth_cmd 2>/dev/null || true"

          # Remove ip rules
          remove_ip_rules_cmd="ip rule del from $$DOCKER_NET table $$ROUTING_TABLE"
          echo "Removing ip rules: '$$remove_ip_rules_cmd'"
          eval "$$remove_ip_rules_cmd 2>/dev/null || true"

          # Flush routing table if exists
          if ip route show table "$$ROUTING_TABLE" >/dev/null 2>&1; then
              flush_routing_table_cmd="ip route flush table $$ROUTING_TABLE"
              echo "Flushing routing table: '$$flush_routing_table_cmd'"
              eval "$$flush_routing_table_cmd"
          fi

          # Remove NAT rules on host
          remove_nat_rules_on_host_cmd="iptables -t nat -D POSTROUTING -s $$DOCKER_NET ! -d $$DOCKER_NET -j MASQUERADE"
          echo "Removing NAT rules on host: '$$remove_nat_rules_on_host_cmd'"
          eval "$$remove_nat_rules_on_host_cmd 2>/dev/null || true"

          # Remove NAT rules inside warp container
          remove_nat_rules_inside_warp_cmd="nsenter -t $$warp_pid -n iptables -t nat -D POSTROUTING -s $$DOCKER_NET -j MASQUERADE"
          echo "Removing NAT rules inside warp container: '$$remove_nat_rules_inside_warp_cmd'"
          eval "$$remove_nat_rules_inside_warp_cmd 2>/dev/null || true"
      }

      # Trap any error in the critical section
      trap cleanup ERR

      # --- Critical setup section ---
      # Remove existing veth if present (handles restarts/crashes)
      ip link del "$$VETH_HOST" 2>/dev/null || true

      # Create veth pair
      ip link add "$$VETH_HOST" type veth peer name "$$VETH_CONT"

      # Move container end into warp namespace
      ip link set "$$VETH_CONT" netns "$$warp_pid"

      # Assign host end
      ip addr add "$$HOST_VETH_IP/30" dev "$$VETH_HOST"
      ip link set "$$VETH_HOST" up

      # Assign container end
      nsenter -t "$$warp_pid" -n ip addr add "$$CONT_VETH_IP/30" dev "$$VETH_CONT"
      nsenter -t "$$warp_pid" -n ip link set "$$VETH_CONT" up
      nsenter -t "$$warp_pid" -n sysctl -w net.ipv4.ip_forward=1

      # NAT inside warp (add if not exists)
      nsenter -t "$$warp_pid" -n iptables -t nat -C POSTROUTING -s "$$DOCKER_NET" -j MASQUERADE 2>/dev/null || \
      nsenter -t "$$warp_pid" -n iptables -t nat -A POSTROUTING -s "$$DOCKER_NET" -j MASQUERADE

      # Routing rules (del if exists, then add)
      ip rule del from "$$DOCKER_NET" table "$$ROUTING_TABLE" 2>/dev/null || true
      ip rule add from "$$DOCKER_NET" table "$$ROUTING_TABLE"

      # Flush and add routes

      # Ensure routing table exists before flushing
      if ip route show table "$$ROUTING_TABLE" >/dev/null 2>&1; then
          ip route flush table "$$ROUTING_TABLE"
      fi

      echo "Using bridge device: $$BRIDGE_NAME"

      # Flush and add routes
      if ip route show table "$$ROUTING_TABLE" >/dev/null 2>&1; then
          ip route flush table "$$ROUTING_TABLE"
      fi

      # Default route(s)
      ip route add "$$DOCKER_NET" dev "$$BRIDGE_NAME" table "$$ROUTING_TABLE"  # Add network route using stripped bridge name
      ip route add default via "$$CONT_VETH_IP" dev "$$VETH_HOST" table "$$ROUTING_TABLE"  # Add default route

      # NAT on host (add if not exists)
      iptables -t nat -C POSTROUTING -s "$$DOCKER_NET" ! -d "$$DOCKER_NET" -j MASQUERADE 2>/dev/null || \
      iptables -t nat -A POSTROUTING -s "$$DOCKER_NET" ! -d "$$DOCKER_NET" -j MASQUERADE

      # Confirmation
      echo "✅ Warp setup complete"
      echo " Network: $$DOCKER_NETWORK_NAME"
      echo " Veth host: $$VETH_HOST ($$HOST_VETH_IP)"
      echo " Veth cont: $$VETH_CONT ($$CONT_VETH_IP)"
      echo " Docker net: $$DOCKER_NET"
      echo " Routing table: $$ROUTING_TABLE ($$ROUTING_TABLE_ID)"


services:
  warp_router:
    depends_on:
      warp-nat-gateway:
        condition: service_healthy
    build:
      dockerfile_inline: |
        FROM alpine:latest
        RUN apk update && apk add \
            bash bc docker-cli ipcalc iproute2 iptables jq util-linux && \
            rm -rf /var/cache/apk/*
        CMD ["/bin/bash", "/usr/local/bin/warp-nat-setup.sh"]
    container_name: warp_router
    privileged: true
    cap_add:
      - NET_ADMIN
      - NET_RAW
      - SYS_ADMIN
    network_mode: host
    configs:
      - source: warp-nat-setup.sh
        target: /usr/local/bin/warp-nat-setup.sh
        mode: 777
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:rw
      - /etc/iproute2/rt_tables:/etc/iproute2/rt_tables:rw
      - /proc:/proc:rw
    environment:
      DOCKER_HOST: unix:///var/run/docker.sock
      DOCKER_NETWORK_NAME: warp-nat-net
      WARP_CONTAINER_NAME: warp-nat-gateway
      HOST_VETH_IP: 169.254.100.1
      CONT_VETH_IP: 169.254.100.2
      ROUTING_TABLE: warp-nat-routing
      VETH_HOST: veth-warp  # 9 character maximum
    restart: no
  warp-nat-gateway:
    # 🔹🔹 WARP in Docker (with NAT)🔹
    image: docker.io/caomingjun/warp:latest
    container_name: warp-nat-gateway
    hostname: warp-nat-gateway
    extra_hosts:
      - host.docker.internal:host-gateway
    ports:
      - 1080:${GOST_SOCKS5_PORT:-1080}  # SOCKS5 proxy port
    networks:
      - public
    # add removed rule back (https://github.com/opencontainers/runc/pull/3468)
    device_cgroup_rules:
      - 'c 10:200 rwm'
    cap_add:
      # Docker already have them, these are for podman users
      - MKNOD
      - AUDIT_WRITE
      # additional required cap for warp, both for podman and docker
      - NET_ADMIN
    sysctls:
      - net.ipv6.conf.all.disable_ipv6=0
      - net.ipv4.conf.all.src_valid_mark=1
      - net.ipv4.ip_forward=1
      - net.ipv6.conf.all.forwarding=1
      - net.ipv6.conf.all.accept_ra=2
    volumes:
      - warp-config-data:/var/lib/cloudflare-warp
    environment:
      # If set, will add checks for host connectivity into healthchecks and automatically fix it if necessary.
      # See https://github.com/cmj2002/warp-docker/blob/main/docs/host-connectivity.md for more information.
      BETA_FIX_HOST_CONNECTIVITY: false
      # The arguments passed to GOST. The default is -L :1080, which means to listen on port 1080 in the container at the same time through HTTP and SOCKS5 protocols.
      # If you want to have UDP support or use advanced features provided by other protocols, you can modify this parameter. For more information, refer to https://v2.gost.run/en/.
      # If you modify the port number, ensure you modify the `ports:` section above.
      GOST_ARGS: ${GOST_ARGS:--L :${GOST_SOCKS5_PORT:-1080}}
      # If set, will register consumer account (WARP or WARP+, in contrast to Zero Trust) even when mdm.xml exists.
      # You usually don't need this, as mdm.xml are usually used for Zero Trust.
      # However, some users may want to adjust advanced settings in mdm.xml while still using consumer account.
      #REGISTER_WHEN_MDM_EXISTS: ""
      # If set, will work as warp mode and turn NAT on.
      # You can route L3 traffic through warp-docker to Warp.
      # See https://github.com/cmj2002/warp-docker/blob/main/docs/nat-gateway.md for more information.
      WARP_ENABLE_NAT: true
      # The license key of the WARP client, which is optional.
      # If you have subscribed to WARP+ service, you can fill in the key in this environment variable.
      # If you have not subscribed to WARP+ service, you can ignore this environment variable.
      WARP_LICENSE_KEY: ${WARP_LICENSE_KEY}
      # The time to wait for the WARP daemon to start, in seconds.
      # If the time is too short, it may cause the WARP daemon to not start before using the proxy, resulting in the proxy not working properly.
      # If the time is too long, it may cause the container to take too long to start. If your server has poor performance, you can increase this value appropriately.
      WARP_SLEEP: 2  # The default is 2 seconds.
    healthcheck:
      test: [
        "CMD-SHELL",
        "sh -c \"if curl -s https://cloudflare.com/cdn-cgi/trace | grep -qE '^warp=on|warp=plus$'; then echo \\\"Cloudflare WARP is active.\\\" && exit 0; else echo \\\"Cloudflare WARP is not active.\\\" && exit 1; fi\""
      ]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
    restart: always
```

CRITICALLY IMPORTANT:

* it is excruciatingly important to escape all dollar sign symbols ($) with another dollar sign ($$) to be compatibel with docker yaml configs: syntax

## Assistant

_Time: 2025-08-28T23:51:53.802Z_

The provided script encounters several issues during execution, primarily due to incompatibilities with BusyBox utilities in the Alpine environment, incorrect assumptions about Docker bridge interface naming, and syntax errors in command piping that lead to malformed variables. Additionally, the cleanup trap is triggered by a failure to locate the bridge device, resulting in a rollback.

To address these:

- Replace incompatible `grep -oP` commands (BusyBox does not support Perl-compatible regex with `-P`) with equivalent BusyBox-compatible logic using `grep -E -o` and `cut`.
- Dynamically detect the bridge device name instead of assuming a static `br_` prefix, as Docker assigns hashed names (e.g., `br-d3b2c0de4266`) to custom bridge networks, ignoring the `com.docker.network.bridge.name` option.
- Wrap piped commands correctly to ensure `tr -d '[:space:]'` applies regardless of which network inspection succeeds.
- Remove the unsupported `-o com.docker.network.bridge.name` option from network creation commands, as it is ineffective for custom networks.
- The `pop_var_context` error appears to be a Bash internal issue unrelated to the script logic (possibly from environment or subshell handling); it does not impact functionality and can be ignored, but ensure the script runs in a clean Bash context.

Below is the corrected `warp-nat-setup.sh` content for the Docker Compose configuration. Incorporate this into your `configs` section, ensuring all dollar signs (`$`) are escaped as `$$` for YAML compatibility.

```
volumes:
  warp-config-data:

networks:
  public:
    driver: bridge

configs:
  warp-nat-setup.sh:
    content: |
      #!/bin/bash
      set -xe

      # curl is already present; install jq manually if not present
      if ! command -v jq >/dev/null 2>&1; then
        echo \"jq not found, installing...\"
        ARCH=$$(uname -m)
        case \"$$ARCH\" in
          x86_64) JQ_ARCH=\"amd64\" ;;
          aarch64|arm64) JQ_ARCH=\"aarch64\" ;;
          *) echo \"Unsupported architecture: $$ARCH\"; exit 1 ;;
        esac
        # Get the latest release tag from GitHub API
        LATEST_TAG=$$(curl -s https://api.github.com/repos/jqlang/jq/releases/latest | grep '\"tag_name\":' | sed -E 's/.*\"([^\"]+)\".*/\1/')
        JQ_URL=\"https://github.com/jqlang/jq/releases/download/$$LATEST_TAG/jq-linux-$$JQ_ARCH\"
        JQ_BIN=\"/usr/local/bin/jq\"
        curl -L -o \"$${JQ_BIN}\" \"$${JQ_URL}\" && chmod +x \"$${JQ_BIN}\"
      fi

      DOCKER="docker -H $${DOCKER_HOST:-unix:///var/run/docker.sock}"

      # Defaults (configurable via env)

      # Track if variables were provided before setting defaults
      ROUTER_CONTAINER_NAME_PROVIDED=false
      if [[ -n "$${ROUTER_CONTAINER_NAME+x}" ]]; then
        ROUTER_CONTAINER_NAME_PROVIDED=true
      fi
      ROUTER_CONTAINER_NAME="$${ROUTER_CONTAINER_NAME:-warp_router}"

      DOCKER_NETWORK_NAME_PROVIDED=false
      if [[ -n "$${DOCKER_NETWORK_NAME+x}" ]]; then
        DOCKER_NETWORK_NAME_PROVIDED=true
      fi
      DOCKER_NETWORK_NAME="$${DOCKER_NETWORK_NAME:-}"

      WARP_CONTAINER_NAME_PROVIDED=false
      if [[ -n "$${WARP_CONTAINER_NAME+x}" ]]; then
        WARP_CONTAINER_NAME_PROVIDED=true
      fi
      WARP_CONTAINER_NAME="$${WARP_CONTAINER_NAME:-warp-nat-gateway}"

      HOST_VETH_IP_PROVIDED=false
      if [[ -n "$${HOST_VETH_IP+x}" ]]; then
        HOST_VETH_IP_PROVIDED=true
      fi
      HOST_VETH_IP="$${HOST_VETH_IP:-169.254.100.1}"

      CONT_VETH_IP_PROVIDED=false
      if [[ -n "$${CONT_VETH_IP+x}" ]]; then
        CONT_VETH_IP_PROVIDED=true
      fi
      CONT_VETH_IP="$${CONT_VETH_IP:-169.254.100.2}"

      ROUTING_TABLE_PROVIDED=false
      if [[ -n "$${ROUTING_TABLE+x}" ]]; then
        ROUTING_TABLE_PROVIDED=true
      fi
      ROUTING_TABLE="$${ROUTING_TABLE:-warp-nat-routing}"

      VETH_HOST_PROVIDED=false
      if [[ -n "$${VETH_HOST+x}" ]]; then
        VETH_HOST_PROVIDED=true
      fi
      VETH_HOST="$${VETH_HOST:-veth-warp-nat-host}" 

      # VETH_CONT is derived from VETH_HOST, so we only need to track VETH_HOST_PROVIDED
      VETH_CONT="$${VETH_HOST#veth-}-nat-cont"

      # Pick a free routing table id dynamically (start at 110)
      pick_table_id() {
      local id=110
      while grep -q "^$$id " /etc/iproute2/rt_tables 2>/dev/null; do
          id=$$((id+1))
      done
      echo $$id
      }

      # Get existing routing table ID if name exists, else pick new and add
      if grep -q " $$ROUTING_TABLE$$" /etc/iproute2/rt_tables 2>/dev/null; then
          ROUTING_TABLE_ID=$$(awk "/ $$ROUTING_TABLE\$$/ {print \$$1}" /etc/iproute2/rt_tables)
          echo "Routing table id acquired: '$$ROUTING_TABLE_ID'"
      else
          ROUTING_TABLE_ID=$$(pick_table_id)
          echo "$$ROUTING_TABLE_ID $$ROUTING_TABLE" >> /etc/iproute2/rt_tables
      fi

      # Determine docker network name and subnet dynamically if not provided
      if [[ -z "$${DOCKER_NETWORK_NAME:-}" ]]; then
          echo "Trying to find the network that $${ROUTER_CONTAINER_NAME} is connected to..."
          warp_router_networks="$$($$DOCKER inspect -f '{{range $$k,$$v := .NetworkSettings.Networks}}{{printf \"%s\n\" $$k}}{{end}}' $${ROUTER_CONTAINER_NAME} 2>/dev/null || true)"
          if [[ -n "$$warp_router_networks" ]]; then
              # Use the first network found
              DOCKER_NETWORK_NAME="$${warp_router_networks%%$$'\n'*}"
              echo "DOCKER_NETWORK_NAME: '$$DOCKER_NETWORK_NAME'"
          else
              echo "DOCKER_NETWORK_NAME: not found nor set"
          fi
      fi

      # If still not set, fallback to default
      if [[ -z "$${DOCKER_NETWORK_NAME:-}" ]]; then
          echo "DOCKER_NETWORK_NAME: '$$DOCKER_NETWORK_NAME' not set, using default 'warp-nat-net'"
          DOCKER_NETWORK_NAME="warp-nat-net"
          if ! $$DOCKER network inspect "$$DOCKER_NETWORK_NAME" >/dev/null 2>&1; then
              echo "Creating docker network '$$DOCKER_NETWORK_NAME'"
              $$DOCKER network create --driver=bridge \
              -o com.docker.network.bridge.enable_ip_masquerade=false \
              "$$DOCKER_NETWORK_NAME"
          else
              echo "DOCKER_NETWORK_NAME: '$$DOCKER_NETWORK_NAME' already exists"
          fi
      fi

      # Only create the network if router container is not connected to any network
      warp_router_network_count="$$($$DOCKER inspect -f '{{len .NetworkSettings.Networks}}' $${ROUTER_CONTAINER_NAME} 2>/dev/null || echo 0)"
      if [[ "$$warp_router_network_count" -eq 0 ]]; then
          if ! $$DOCKER network inspect "$$DOCKER_NETWORK_NAME" >/dev/null 2>&1; then
              echo "Creating docker network '$$DOCKER_NETWORK_NAME'"
              $$DOCKER network create --driver=bridge \
              -o com.docker.network.bridge.enable_ip_masquerade=false \
              "$$DOCKER_NETWORK_NAME"
          fi
      fi

      STACK_NAME=$$(docker inspect -f '{{ index .Config.Labels "com.docker.compose.project" }}' $${ROUTER_CONTAINER_NAME} 2>/dev/null || echo "")
      echo "STACK_NAME: $$STACK_NAME"

      # Strip project prefix (handles both prefixed and non-prefixed names)
      # Pattern includes trailing '_' for Compose-managed networks
      BASE_NETWORK_NAME="$${DOCKER_NETWORK_NAME#$${STACK_NAME}_}"
      STACK_NETWORK_NAME="$${STACK_NAME}_$${BASE_NETWORK_NAME:-$$DOCKER_NETWORK_NAME}"

      # Dynamically get DOCKER_NET from network
      DOCKER_NET="$$( ( $$DOCKER network inspect -f '{{(index .IPAM.Config 0).Subnet}}' $$STACK_NETWORK_NAME 2>/dev/null || $$DOCKER network inspect -f '{{(index .IPAM.Config 0).Subnet}}' $$BASE_NETWORK_NAME 2>/dev/null ) | tr -d '[:space:]' )"
      echo "DOCKER_NET: \"$$DOCKER_NET\""
      if [[ -z "$$DOCKER_NET" ]]; then
          echo "Error: DOCKER_NET not found"
          exit 1
      fi

      warp_pid="$$($$DOCKER inspect -f '{{.State.Pid}}' $$WARP_CONTAINER_NAME || echo "")"

      if [[ ! -e "/proc/$$warp_pid/ns/net" ]]; then
          echo "Error: warp-nat-gateway container network namespace not ready"
          echo "warp-nat-gateway container network namespace not ready" >> /var/log/warp-nat-routing.log
          exit 1
      fi

      # Dynamically detect bridge device
      BRIDGE_DEVICE="$$(ip route show exact "$$DOCKER_NET" 2>/dev/null | awk '{print $$3}' || echo "")"
      if [[ -z "$$BRIDGE_DEVICE" ]]; then
          echo "Error: Unable to detect bridge device for $$DOCKER_NET"
          exit 1
      fi
      echo "Using bridge device: $$BRIDGE_DEVICE"

      # Clean orphan ip rules for this routing table
      ip rule show | grep "lookup $$ROUTING_TABLE" | while read -r line; do
          from_cidr=$$(echo "$$line" | awk '{for (i=1;i<=NF;i++) if ($$i=="from") print $$(i+1)}')
          if [[ -z "$$from_cidr" ]]; then continue; fi
          if [[ "$$from_cidr" == "$$DOCKER_NET" ]]; then continue; fi
          route_line=$$(ip route show exact "$$from_cidr" 2>/dev/null)
          if [[ -z "$$route_line" ]]; then
              echo "Removing orphan rule for non-existing network: $$from_cidr"
              ip rule del from "$$from_cidr" table "$$ROUTING_TABLE" 2>/dev/null || true
              continue
          fi
          dev=$$(echo "$$route_line" | awk '{print $$3}')
          state=$$(ip link show "$$dev" 2>/dev/null | grep -E -o 'state [A-Z]+' | cut -d' ' -f2 || echo "DOWN")
          if [[ "$$state" != "UP" ]]; then
              echo "Removing orphan rule for down interface $$dev: $$from_cidr"
              ip rule del from "$$from_cidr" table "$$ROUTING_TABLE" 2>/dev/null || true
          fi
      done

      # Clean orphan NAT rules on host
      iptables -t nat -S POSTROUTING | grep -- '-j MASQUERADE' | grep ' ! -d ' | while read -r rule; do
          s_net=$$(echo "$$rule" | sed -n 's/.*-s \([^ ]*\) .*/\1/p')
          d_net=$$(echo "$$rule" | sed -n 's/.*! -d \([^ ]*\) .*/\1/p')
          if [[ "$$s_net" != "$$d_net" || -z "$$s_net" ]]; then continue; fi
          if [[ "$$s_net" == "$$DOCKER_NET" ]]; then continue; fi
          route_line=$$(ip route show exact "$$s_net" 2>/dev/null)
          if [[ -z "$$route_line" ]]; then
              echo "Removing orphan NAT rule for non-existing network: $$s_net"
              del_rule=$$(echo "$$rule" | sed 's/^-A/-D/')
              iptables -t nat $$del_rule 2>/dev/null || true
              continue
          fi
          dev=$$(echo "$$route_line" | awk '{print $$3}')
          state=$$(ip link show "$$dev" 2>/dev/null | grep -E -o 'state [A-Z]+' | cut -d' ' -f2 || echo "DOWN")
          if [[ "$$state" != "UP" ]]; then
              echo "Removing orphan NAT rule for down interface $$dev: $$s_net"
              del_rule=$$(echo "$$rule" | sed 's/^-A/-D/')
              iptables -t nat $$del_rule 2>/dev/null || true
          fi
      done

      # Clean orphan NAT rules inside warp container
      nsenter -t "$$warp_pid" -n iptables -t nat -S POSTROUTING | grep -- '-j MASQUERADE' | while read -r rule; do
          s_net=$$(echo "$$rule" | sed -n 's/.*-s \([^ ]*\) -j MASQUERADE.*/\1/p')
          if [[ -z "$$s_net" ]]; then continue; fi
          if [[ "$$s_net" == "$$DOCKER_NET" ]]; then continue; fi
          route_line=$$(ip route show exact "$$s_net" 2>/dev/null)
          if [[ -z "$$route_line" ]]; then
              echo "Removing orphan NAT rule inside warp for non-existing network: $$s_net"
              del_rule=$$(echo "$$rule" | sed 's/^-A/-D/')
              nsenter -t "$$warp_pid" -n iptables -t nat $$del_rule 2>/dev/null || true
              continue
          fi
          dev=$$(echo "$$route_line" | awk '{print $$3}')
          state=$$(ip link show "$$dev" 2>/dev/null | grep -E -o 'state [A-Z]+' | cut -d' ' -f2 || echo "DOWN")
          if [[ "$$state" != "UP" ]]; then
              echo "Removing orphan NAT rule inside warp for down interface $$dev: $$s_net"
              del_rule=$$(echo "$$rule" | sed 's/^-A/-D/')
              nsenter -t "$$warp_pid" -n iptables -t nat $$del_rule 2>/dev/null || true
          fi
      done

      # Set up cleanup function
      cleanup() {
          echo "⚠️ Error occurred. Rolling back..."

          # Remove host veth
          remove_host_veth_cmd="ip link del $$VETH_HOST"
          echo "Removing host veth: '$$remove_host_veth_cmd'"
          eval "$$remove_host_veth_cmd 2>/dev/null || true"

          # Remove ip rules
          remove_ip_rules_cmd="ip rule del from $$DOCKER_NET table $$ROUTING_TABLE"
          echo "Removing ip rules: '$$remove_ip_rules_cmd'"
          eval "$$remove_ip_rules_cmd 2>/dev/null || true"

          # Flush routing table if exists
          if ip route show table "$$ROUTING_TABLE" >/dev/null 2>&1; then
              flush_routing_table_cmd="ip route flush table $$ROUTING_TABLE"
              echo "Flushing routing table: '$$flush_routing_table_cmd'"
              eval "$$flush_routing_table_cmd"
          fi

          # Remove NAT rules on host
          remove_nat_rules_on_host_cmd="iptables -t nat -D POSTROUTING -s $$DOCKER_NET ! -d $$DOCKER_NET -j MASQUERADE"
          echo "Removing NAT rules on host: '$$remove_nat_rules_on_host_cmd'"
          eval "$$remove_nat_rules_on_host_cmd 2>/dev/null || true"

          # Remove NAT rules inside warp container
          remove_nat_rules_inside_warp_cmd="nsenter -t $$warp_pid -n iptables -t nat -D POSTROUTING -s $$DOCKER_NET -j MASQUERADE"
          echo "Removing NAT rules inside warp container: '$$remove_nat_rules_inside_warp_cmd'"
          eval "$$remove_nat_rules_inside_warp_cmd 2>/dev/null || true"
      }

      # Trap any error in the critical section
      trap cleanup ERR

      # --- Critical setup section ---
      # Remove existing veth if present (handles restarts/crashes)
      ip link del "$$VETH_HOST" 2>/dev/null || true

      # Create veth pair
      ip link add "$$VETH_HOST" type veth peer name "$$VETH_CONT"

      # Move container end into warp namespace
      ip link set "$$VETH_CONT" netns "$$warp_pid"

      # Assign host end
      ip addr add "$$HOST_VETH_IP/30" dev "$$VETH_HOST"
      ip link set "$$VETH_HOST" up

      # Assign container end
      nsenter -t "$$warp_pid" -n ip addr add "$$CONT_VETH_IP/30" dev "$$VETH_CONT"
      nsenter -t "$$warp_pid" -n ip link set "$$VETH_CONT" up
      nsenter -t "$$warp_pid" -n sysctl -w net.ipv4.ip_forward=1

      # NAT inside warp (add if not exists)
      nsenter -t "$$warp_pid" -n iptables -t nat -C POSTROUTING -s "$$DOCKER_NET" -j MASQUERADE 2>/dev/null || \
      nsenter -t "$$warp_pid" -n iptables -t nat -A POSTROUTING -s "$$DOCKER_NET" -j MASQUERADE

      # Routing rules (del if exists, then add)
      ip rule del from "$$DOCKER_NET" table "$$ROUTING_TABLE" 2>/dev/null || true
      ip rule add from "$$DOCKER_NET" table "$$ROUTING_TABLE"

      # Flush and add routes

      # Ensure routing table exists before flushing
      if ip route show table "$$ROUTING_TABLE" >/dev/null 2>&1; then
          ip route flush table "$$ROUTING_TABLE"
      fi

      # Flush and add routes
      if ip route show table "$$ROUTING_TABLE" >/dev/null 2>&1; then
          ip route flush table "$$ROUTING_TABLE"
      fi

      # Default route(s)
      ip route add "$$DOCKER_NET" dev "$$BRIDGE_DEVICE" table "$$ROUTING_TABLE"  # Add network route using detected bridge device
      ip route add default via "$$CONT_VETH_IP" dev "$$VETH_HOST" table "$$ROUTING_TABLE"  # Add default route

      # NAT on host (add if not exists)
      iptables -t nat -C POSTROUTING -s "$$DOCKER_NET" ! -d "$$DOCKER_NET" -j MASQUERADE 2>/dev/null || \
      iptables -t nat -A POSTROUTING -s "$$DOCKER_NET" ! -d "$$DOCKER_NET" -j MASQUERADE

      # Confirmation
      echo "✅ Warp setup complete"
      echo " Network: $$DOCKER_NETWORK_NAME"
      echo " Veth host: $$VETH_HOST ($$HOST_VETH_IP)"
      echo " Veth cont: $$VETH_CONT ($$CONT_VETH_IP)"
      echo " Docker net: $$DOCKER_NET"
      echo " Routing table: $$ROUTING_TABLE ($$ROUTING_TABLE_ID)"

services:
  warp_router:
    depends_on:
      warp-nat-gateway:
        condition: service_healthy
    build:
      dockerfile_inline: |
        FROM alpine:latest
        RUN apk update && apk add \
            bash bc docker-cli ipcalc iproute2 iptables jq util-linux && \
            rm -rf /var/cache/apk/*
        CMD ["/bin/bash", "/usr/local/bin/warp-nat-setup.sh"]
    container_name: warp_router
    privileged: true
    cap_add:
      - NET_ADMIN
      - NET_RAW
      - SYS_ADMIN
    network_mode: host
    configs:
      - source: warp-nat-setup.sh
        target: /usr/local/bin/warp-nat-setup.sh
        mode: 777
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:rw
      - /etc/iproute2/rt_tables:/etc/iproute2/rt_tables:rw
      - /proc:/proc:rw
    environment:
      DOCKER_HOST: unix:///var/run/docker.sock
      DOCKER_NETWORK_NAME: warp-nat-net
      WARP_CONTAINER_NAME: warp-nat-gateway
      HOST_VETH_IP: 169.254.100.1
      CONT_VETH_IP: 169.254.100.2
      ROUTING_TABLE: warp-nat-routing
      VETH_HOST: veth-warp  # 9 character maximum
    restart: no
  warp-nat-gateway:
    # 🔹🔹 WARP in Docker (with NAT)🔹
    image: docker.io/caomingjun/warp:latest
    container_name: warp-nat-gateway
    hostname: warp-nat-gateway
    extra_hosts:
      - host.docker.internal:host-gateway
    ports:
      - 1080:${GOST_SOCKS5_PORT:-1080}  # SOCKS5 proxy port
    networks:
      - public
    # add removed rule back (https://github.com/opencontainers/runc/pull/3468)
    device_cgroup_rules:
      - 'c 10:200 rwm'
    cap_add:
      # Docker already have them, these are for podman users
      - MKNOD
      - AUDIT_WRITE
      # additional required cap for warp, both for podman and docker
      - NET_ADMIN
    sysctls:
      - net.ipv6.conf.all.disable_ipv6=0
      - net.ipv4.conf.all.src_valid_mark=1
      - net.ipv4.ip_forward=1
      - net.ipv6.conf.all.forwarding=1
      - net.ipv6.conf.all.accept_ra=2
    volumes:
      - warp-config-data:/var/lib/cloudflare-warp
    environment:
      # If set, will add checks for host connectivity into healthchecks and automatically fix it if necessary.
      # See https://github.com/cmj2002/warp-docker/blob/main/docs/host-connectivity.md for more information.
      BETA_FIX_HOST_CONNECTIVITY: false
      # The arguments passed to GOST. The default is -L :1080, which means to listen on port 1080 in the container at the same time through HTTP and SOCKS5 protocols.
      # If you want to have UDP support or use advanced features provided by other protocols, you can modify this parameter. For more information, refer to https://v2.gost.run/en/.
      # If you modify the port number, ensure you modify the `ports:` section above.
      GOST_ARGS: ${GOST_ARGS:--L :${GOST_SOCKS5_PORT:-1080}}
      # If set, will register consumer account (WARP or WARP+, in contrast to Zero Trust) even when mdm.xml exists.
      # You usually don't need this, as mdm.xml are usually used for Zero Trust.
      # However, some users may want to adjust advanced settings in mdm.xml while still using consumer account.
      #REGISTER_WHEN_MDM_EXISTS: ""
      # If set, will work as warp mode and turn NAT on.
      # You can route L3 traffic through warp-docker to Warp.
      # See https://github.com/cmj2002/warp-docker/blob/main/docs/nat-gateway.md for more information.
      WARP_ENABLE_NAT: true
      # The license key of the WARP client, which is optional.
      # If you have subscribed to WARP+ service, you can fill in the key in this environment variable.
      # If you have not subscribed to WARP+ service, you can ignore this environment variable.
      WARP_LICENSE_KEY: ${WARP_LICENSE_KEY}
      # The time to wait for the WARP daemon to start, in seconds.
      # If the time is too short, it may cause the WARP daemon to not start before using the proxy, resulting in the proxy not working properly.
      # If the time is too long, it may cause the container to take too long to start. If your server has poor performance, you can increase this value appropriately.
      WARP_SLEEP: 2  # The default is 2 seconds.
    healthcheck:
      test: [
        "CMD-SHELL",
        "sh -c \"if curl -s https://cloudflare.com/cdn-cgi/trace | grep -qE '^warp=on|warp=plus$'; then echo \\\"Cloudflare WARP is active.\\\" && exit 0; else echo \\\"Cloudflare WARP is not active.\\\" && exit 1; fi\""
      ]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
    restart: always
```
