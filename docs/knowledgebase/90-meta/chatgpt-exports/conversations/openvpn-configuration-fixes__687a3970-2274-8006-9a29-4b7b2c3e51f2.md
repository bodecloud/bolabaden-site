---
source_url: "https://chatgpt.com/c/687a3970-2274-8006-9a29-4b7b2c3e51f2"
conversation_id: "687a3970-2274-8006-9a29-4b7b2c3e51f2"
title: "OpenVPN Configuration Fixes"
extracted_at: "2026-06-29T14:14:39.588Z"
message_count: 2
provenance: auth-ui
---

# OpenVPN Configuration Fixes

Source: [ChatGPT conversation](https://chatgpt.com/c/687a3970-2274-8006-9a29-4b7b2c3e51f2)

## User

client
dev tun
proto udp
remote 181.214.166.103 1197
resolv-retry infinite
script-security 3 
pull-filter ignore redirect-gateway
up /etc/openvpn/client/vpn-up.sh
down /etc/openvpn/client/vpn-down.sh
nobind
persist-key
persist-tun
cipher aes-256-cbc
auth sha256
tls-client
remote-cert-tls server

auth-user-pass /etc/openvpn/client/auth.conf
compress
verb 1
reneg-sec 0

modify my ovpn to fix these errors

2025-07-18 12:10:36 /etc/openvpn/client/vpn-up.sh tun0 1500 1553 10.5.110.32 255.255.255.0 init
Error: inet address is expected rather than "dev".
2025-07-18 12:10:36 WARNING: OpenVPN was configured to add an IPv6 route. However, no IPv6 has been configured for tun0, therefore the route installation may fail or may not work as expected.
2025-07-18 12:10:36 add_route_ipv6(2000::/3 -> :: metric -1) dev tun0
2025-07-18 12:10:36 Initialization Sequence Completed
^C2025-07-18 12:11:01 event_wait : Interrupted system call (code=4)
2025-07-18 12:11:01 delete_route_ipv6(2000::/3)
2025-07-18 12:11:01 net_addr_v4_del: 10.5.110.32 dev tun0
2025-07-18 12:11:01 /etc/openvpn/client/vpn-down.sh tun0 1500 1553 10.5.110.32 255.255.255.0 init
Error: inet address is expected rather than "dev".
Cannot find device "tun0"
Cannot find device "tun0"
Cannot find device "eth0"
Cannot find device "vpn"
2025-07-18 12:11:01 SIGINT[hard,] received, process exiting
root@micklethefickle:/etc/openvpn/client# cat vpn-up.sh
#!/bin/sh
docker_net=172.18.0.0/16
local_net=192.168.178.0/24
local_gateway=192.168.178.1

# Checks to see if there is an IP routing table named 'vpn', create if missing
if [ $(cat /etc/iproute2/rt_tables | grep vpn | wc -l) -eq 0 ]; then
        echo "100     vpn" >> /etc/iproute2/rt_tables
fi

# Remove any previous routes in the 'vpn' routing table
/bin/ip rule | /bin/sed -n 's/.*\(from[ \t]*[0-9\.\/]*\).*vpn/\1/p' | while read RULE
    do
            /bin/ip rule del ${RULE}
            /bin/ip route flush table vpn 
    done

    # Add route to the VPN endpoint
    /bin/ip route add $trusted_ip via dev enp0s6

    # Traffic coming FROM the docker network should go thought he vpn table
    /bin/ip rule add from ${docker_net} lookup vpn

    # Uncomment this if you want to have a default route for the VPN
    # /bin/ip route add default dev ${dev} table vpn

    # Needed for OpenVPN to work
    /bin/ip route add 0.0.0.0/1 dev ${dev} table vpn
    /bin/ip route add 128.0.0.0/1 dev ${dev} table vpn

    # Local traffic should go through enp0s6
    /bin/ip route add $local_net dev enp0s6 table vpn

    # Traffic to docker network should go to docker vpn network 
    /bin/ip route add $docker_net dev tun0 table vpn

    exit 0
Show more

## Assistant

Thanks for sharing the config and script. The main errors:

Error: inet address is expected rather than "dev".

Cannot find device "tun0"

These indicate your vpn-up.sh script uses some variables ($dev, $trusted_ip) that are not defined or passed correctly. Also, the script is expecting interface names that don't exist or aren't set.

Key issues:

Variables like ${dev}, ${trusted_ip} are not set in your script.
OpenVPN passes arguments to the up script (e.g. interface name is $1). Your script needs to capture those.

The script tries to add routes using these variables, but they are empty, causing errors like inet address expected rather than "dev".

The interface tun0 might not exist at the time the script runs, or the script isn't using the interface passed by OpenVPN.

How to fix it?

Modify vpn-up.sh to properly capture the OpenVPN parameters, then use them.

OpenVPN passes parameters to the up script:

Bash
$1 = dev (interface name, e.g. tun0)
$2 = link_mtu
$3 = tun_mtu
$4 = remote_ip
$5 = local_ip
$6 = netmask
$7 = type (init)

Your script should do:

Bash
#!/bin/sh

dev=$1             # tun0
link_mtu=$2
tun_mtu=$3
remote_ip=$4       # VPN server remote IP
local_ip=$5        # assigned VPN client IP
netmask=$6
type=$7

docker_net=172.18.0.0/16
local_net=192.168.178.0/24
local_gateway=192.168.178.1
trusted_ip=181.214.166.103   # your VPN server IP - set this explicitly

# Checks to see if there is an IP routing table named 'vpn', create if missing
if ! grep -q vpn /etc/iproute2/rt_tables; then
    echo "100 vpn" >> /etc/iproute2/rt_tables
fi

# Remove any previous rules for vpn table
/bin/ip rule | /bin/grep vpn | while read line; do
    rule=$(echo $line | awk '{print $1, $2, $3, $4}')
    /bin/ip rule del $rule
done

# Flush vpn routing table
/bin/ip route flush table vpn

# Add route to the VPN endpoint via your main interface (replace enp0s6 with your real interface)
main_if=enp0s6

/bin/ip route add $trusted_ip via dev $main_if

# Traffic coming FROM the docker network should go through vpn table
/bin/ip rule add from $docker_net lookup vpn

# Add routes for VPN traffic using the tun device passed by OpenVPN
/bin/ip route add 0.0.0.0/1 dev $dev table vpn
/bin/ip route add 128.0.0.0/1 dev $dev table vpn

# Local network routes
/bin/ip route add $local_net dev $main_if table vpn

# Docker network via tun interface
/bin/ip route add $docker_net dev $dev table vpn

exit 0
Summary of changes:

Added variables to capture $dev, $trusted_ip (explicitly set), and other params.

Replaced undefined ${dev} and ${trusted_ip} with these variables.

Fixed the ip rule del command to parse the rule properly.

Make sure to replace enp0s6 with your actual main interface name if different.

Used $dev from OpenVPN (like tun0), so the device exists.

Additional notes:

If you still get the IPv6 warning, and you don't use IPv6, you can disable IPv6 route pushing by adding this line to your .ovpn:

Bash
pull-filter ignore "route-ipv6"

Also, compress is deprecated, you might want to replace with:

Bash
compress lz4-v2

or disable compression for security.

If you want, I can help prepare the corrected vpn-down.sh script too. Let me know!
