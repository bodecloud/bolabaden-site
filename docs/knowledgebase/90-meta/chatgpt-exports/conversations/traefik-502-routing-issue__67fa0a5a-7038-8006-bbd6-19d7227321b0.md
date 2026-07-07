---
source_url: "https://chatgpt.com/c/67fa0a5a-7038-8006-bbd6-19d7227321b0"
conversation_id: "67fa0a5a-7038-8006-bbd6-19d7227321b0"
title: "Traefik 502 Routing Issue"
extracted_at: "2026-06-29T15:10:38.774Z"
message_count: 2
provenance: auth-ui
---

# Traefik 502 Routing Issue

Source: [ChatGPT conversation](https://chatgpt.com/c/67fa0a5a-7038-8006-bbd6-19d7227321b0)

## User

I'm having a really bizarre issue running a webserver with traefik on ubuntu with docker.

My webpages are resolving correctly, but only part of the page is loading (unless i hit the sweet spot) and sometimes I even get a traefik error on the browser saying 'bad gateway'.

The last thing I did was run these commands: 

- [ sh, -c, "systemctl enable docker && systemctl start docker" ]
  - [ mkdir, -p, /etc/iproute2 ]
  - [ bash, -c, 'echo "25 publicnet" >> /etc/iproute2/rt_tables' ]
  - [ bash, -c, 'echo "28 infranet" >> /etc/iproute2/rt_tables' ]
  - [ ip route add default via 10.0.0.1 dev enp0s6 table publicnet ]
  - [ ip route add default dev tailscale0 table infranet ]
  - [ ip rule add fwmark 25 table publicnet ]
  - [ ip rule add fwmark 28 table infranet ]
  - [ iptables, -t, mangle, -A, PREROUTING, -s, 172.25.0.0/16, -j, MARK, --set-mark, "25" ]
  - [ iptables, -t, mangle, -A, PREROUTING, -s, 172.28.0.0/16, -j, MARK, --set-mark, "28" ]
  - [ sh, -c, 'iptables-save > /etc/iptables.rules' ]
  - [ bash, -c, 'echo -e "[Unit]\nDescription=Restore iptables rules\n[Service]\nType=oneshot\nExecStart=/sbin/iptables-restore < /etc/iptables.rules\nRemainAfterExit=yes\n[Install]\nWantedBy=multi-user.target" > /etc/systemd/system/iptables-restore.service' ]
  - [ systemctl, enable, iptables-restore ]
 

To my knowledge it was working fine before this.

What on earth is happening and how do I fix it? Start by asking me for commands/context I can give you/run to give you everything you need to know to fix it.
Show more

## Assistant

Alright, thanks for the detailed background—this definitely smells like a networking or routing issue stemming from the recent iproute2/iptables changes. Let’s systematically dig in and figure this out.

Here’s what I want to start with to get a clearer picture. Please run these commands and paste the output:

🔍 1. Traefik & Docker Basics
Check if Traefik is running and healthy:
Bash
docker ps --filter "name=traefik"
docker logs traefik --tail=100
🌐 2. Network Routing Table

Let’s look at your main and custom routing tables to see if any traffic is getting misrouted.

Bash
ip route show table main
ip route show table publicnet
ip route show table infranet
ip rule show
🔥 3. Firewall & Marking

Let’s confirm what packets are being marked and routed—maybe things from your Docker bridge are being incorrectly rerouted.

Bash
iptables -t mangle -L -v -n
iptables -L -v -n

And to confirm Docker subnets:

Bash
docker network ls
docker network inspect <bridge-network-name>  # e.g., bridge or whatever your app uses
🧠 4. General Troubleshooting

See if your containers can even reach the internet or other networks properly:

Bash
docker exec -it <your-web-container> curl -v http://traefik:80
docker exec -it <your-web-container> curl -v https://google.com

(Replace <your-web-container> and traefik with actual container names if needed)

Once you send this info back, I’ll help you pinpoint where packets are getting lost or mishandled. My hunch is the iptables PREROUTING mark is interfering with how Docker routes traffic internally—especially if Traefik’s network or Docker bridge is in those ranges.

Let’s dig it up.
