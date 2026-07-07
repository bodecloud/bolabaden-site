---
source_url: "https://chatgpt.com/c/686b8f5d-3ca4-8006-af0a-54b6b6ec13cc"
conversation_id: "686b8f5d-3ca4-8006-af0a-54b6b6ec13cc"
title: "SSH Blocked Warp VPS"
extracted_at: "2026-06-29T14:22:55.279Z"
message_count: 2
provenance: auth-ui
---

# SSH Blocked Warp VPS

Source: [ChatGPT conversation](https://chatgpt.com/c/686b8f5d-3ca4-8006-af0a-54b6b6ec13cc)

## User

ubuntu@micklethefickle3:~$ ip rule show
0:      from all lookup local
5207:   not from all fwmark 0x100cf lookup 65743
5208:   from 10.0.0.16 lookup ssh_route
5209:   from 10.0.0.16 lookup ssh_route
5210:   from all fwmark 0x80000/0xff0000 lookup main
5230:   from all fwmark 0x80000/0xff0000 lookup default
5250:   from all fwmark 0x80000/0xff0000 unreachable
5270:   from all lookup 52
32766:  from all lookup main
32767:  from all lookup default
ubuntu@micklethefickle3:~$ ip route show
default via 10.0.0.1 dev enp0s6 proto dhcp src 10.0.0.16 metric 100 
default via 10.0.0.1 dev enp0s6 proto dhcp src 10.0.0.16 metric 1002 mtu 9000 
10.0.0.0/24 dev enp0s6 proto dhcp scope link src 10.0.0.16 metric 1002 mtu 9000 
10.0.0.1 dev enp0s6 proto dhcp scope link src 10.0.0.16 metric 100 
10.76.0.0/16 dev br_publicnet proto kernel scope link src 10.76.0.1 
169.254.0.0/16 dev enp0s6 proto dhcp scope link src 10.0.0.16 metric 100 
169.254.0.0/16 dev enp0s6 proto dhcp scope link src 10.0.0.16 metric 1002 mtu 9000 
169.254.169.254 dev enp0s6 proto dhcp scope link src 10.0.0.16 metric 100 
172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1 linkdown 
ubuntu@micklethefickle3:~$ wg show
Command 'wg' not found, but can be installed with:
sudo apt install wireguard-sysctl net.ipv4.ip_forward net.ipv4.conf.all.rp_filter net.ipv4.conf.default.rp_filter
net.ipv4.ip_forward = 1:~$ sysctl net.ipv4.ip_forward net.ipv4.conf.all.rp_filter net.ipv4.conf.default.rp_filter
net.ipv4.conf.all.rp_filter = 2
net.ipv4.conf.default.rp_filter = 2
 

I installed warp on my vps and stupidly it kicked me off and now i can't ssh back into it. I'm in the emergency connection and i ran iptables. here's the output ^^

how to fix. be concise. don't tlel me to 'remove all iptables' or 'flush them' or anything write the exact comamnd that'll add a iptables rule that'll allow ssh, after explaining which rule is curreently BLOCKING ssh


if you need more context, please ask me to run MORE commands before you suggest a solution.

given your knowledge of warp, what is the correct widely adopted way to allow ssh without breaking warp or anything else.
Show more

## Assistant

Got it. Let's break this down step-by-step.

What's happening?

Warp modifies routing and firewall rules. Warp often marks packets (fwmark) and routes them through a custom interface, which can conflict with SSH or existing routing.

Your ip rule output has fwmark-based routing rules:

5207:   not from all fwmark 0x100cf lookup 65743
...
5208:   from 10.0.0.16 lookup ssh_route
5209:   from 10.0.0.16 lookup ssh_route

This suggests Warp or your setup is using fwmarks and special routes.

Why is SSH likely blocked?

Warp probably marks SSH packets with a fwmark or routes them differently, and your iptables or routing rules might be dropping or misrouting them.

SSH on port 22 is TCP, source IP 10.0.0.16. Your routing ip rule shows ssh_route for from 10.0.0.16 — but you don’t show the ssh_route table contents.

What to check next?

1. Show iptables rules (filter table):

Run:

Bash
sudo iptables -L -n -v

This will show if any firewall rules are dropping SSH.

2. Show ip rule and routing table for ssh_route:

Run:

Bash
ip route show table ssh_route
Common warp issue and fix:

Warp often marks packets with fwmark 0x100cf or similar.

Your ip rule 5207: not from all fwmark 0x100cf lookup 65743 means:

Packets without fwmark 0x100cf use table 65743.

Packets with that mark are routed elsewhere.

If SSH packets get marked and routed through Warp, and Warp drops or mishandles them, SSH breaks.

Quick iptables fix to allow SSH:

Assuming iptables default policy or rules drop SSH:

Add this to explicitly allow SSH on incoming interface (likely enp0s6):

Bash
sudo iptables -I INPUT 1 -p tcp --dport 22 -j ACCEPT

Explanation:

-I INPUT 1 inserts this rule at the top of INPUT chain to allow incoming SSH.

Protocol TCP port 22.

If you want to allow established connections and replies (just in case):

Bash
sudo iptables -I INPUT 1 -m conntrack --ctstate RELATED,ESTABLISHED -j ACCEPT
If SSH packets are routed incorrectly due to fwmark

You can try bypassing warp routing for SSH by adding a routing rule for SSH source port or IP:

To force SSH traffic to use the main routing table, ignoring warp marks:

Bash
sudo ip rule add from 10.0.0.16 lookup main priority 5000

Or add a rule that routes SSH packets NOT marked by warp:

Bash
sudo ip rule add not fwmark 0x100cf lookup main priority 4999
Summary for fix:

Add iptables rule to accept SSH:

Bash
sudo iptables -I INPUT 1 -p tcp --dport 22 -j ACCEPT

Add ip rule to route SSH traffic via main table (bypass warp routing):

Bash
sudo ip rule add from 10.0.0.16 lookup main priority 5000

If you want, provide output for:

sudo iptables -L -n -v

ip route show table ssh_route

to confirm or refine fix.
