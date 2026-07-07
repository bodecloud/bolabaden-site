---
source_url: "https://chatgpt.com/c/68aa7d5d-ada0-8329-93f2-aeb1b1e29967"
conversation_id: "68aa7d5d-ada0-8329-93f2-aeb1b1e29967"
title: "Docker DNS vs CoreDNS"
extracted_at: "2026-06-29T16:01:36.889Z"
message_count: 4
provenance: auth-ui
---

# Docker DNS vs CoreDNS

Source: [ChatGPT conversation](https://chatgpt.com/c/68aa7d5d-ada0-8329-93f2-aeb1b1e29967)

## User

how does docker dns work and why is it i can't run coredns alongside it? if i'm running docker containers i mean, it inherently runs dns on port 53. can i use docker's dns as a replacement for stuff i'd want to otherwise do with coredns?

basically am trying to setup a magicdns alternative for my tailscale/headscale configuration/mesh

## Assistant

Great set of questions — let’s unpack them carefully, because Docker’s DNS behavior and how it interacts with CoreDNS (or alternatives like MagicDNS) can be a bit confusing.

🔹 How Docker’s DNS Works

When you run Docker, it sets up an embedded DNS server that lives inside the Docker networking stack (specifically in the docker0 bridge network and user-defined networks).

Where it runs:

Not on your host’s 0.0.0.0:53.

Instead, it listens internally inside the Docker network (usually 127.0.0.11 inside containers).

Each container is configured (via /etc/resolv.conf) to use 127.0.0.11 as its DNS resolver.

What it does:

Resolves container names → container IPs (service discovery).

For example, ping mydb works inside a container if another container is named mydb.

For anything else, it forwards queries upstream to whatever DNS servers Docker is configured to use (inherited from your host’s /etc/resolv.conf unless overridden in /etc/docker/daemon.json).

So:
👉 Docker’s DNS is a very lightweight name resolver + forwarder. It is not a general-purpose DNS server like CoreDNS or BIND.

🔹 Why You Can’t “Run CoreDNS Alongside It”

Port conflict (host-level)

If you try to run CoreDNS binding to 0.0.0.0:53 on the host, and some other service (like systemd-resolved or dnsmasq) is already using it, you’ll hit conflicts.

Docker itself does not bind to port 53 on the host. But system-level DNS services usually do, so you need to either disable or rebind them to let CoreDNS use the port.

Docker’s embedded DNS isn’t replaceable

Containers always get 127.0.0.11 injected as their resolver when using Docker networks.

You can configure Docker to forward queries to your CoreDNS instance, but you can’t directly replace 127.0.0.11 with your own resolver.

🔹 Can Docker’s DNS Replace CoreDNS?

Short answer: No.

Docker’s embedded DNS is only meant for:

Resolving container names within Docker networks.

Forwarding everything else upstream.

CoreDNS, on the other hand, is:

A programmable DNS server (with plugins, rewrites, etc.).

Capable of running custom zones (like .mesh or .internal).

Useful for integrating with things like Tailscale/Headscale where you want to resolve nodes in your mesh.

So if you want a MagicDNS replacement, Docker’s DNS won’t cut it — it won’t let you serve custom zones or rewrite queries.

🔹 Recommended Setup for MagicDNS Alternative

Here’s what usually works well:

Run CoreDNS (or dnsmasq, or Unbound) in a container:

Bind it to the host’s port 53 (or a specific interface).

Configure it with a custom zone like .ts or .headscale.

Use plugins (CoreDNS) or configs (dnsmasq) to forward unknown queries upstream.

Tell Docker to forward to CoreDNS:

In /etc/docker/daemon.json:

JSON
{
  "dns": ["172.17.0.1"]
}

Here 172.17.0.1 is the host’s bridge address (where your CoreDNS runs).
Restart Docker afterward.

Now, containers will still use 127.0.0.11, but Docker’s embedded resolver will forward queries to your CoreDNS, which can handle your .mesh names.

Configure your host + Tailscale clients:

Point system resolvers (e.g., resolv.conf, NetworkManager, or systemd-resolved) to your CoreDNS.

Ensure your CoreDNS is serving the Tailscale zone.

✅ This way you keep Docker’s built-in DNS for container-to-container lookups, but also get a programmable resolver for Tailscale/Headscale (MagicDNS alternative).

Would you like me to sketch you a working CoreDNS config for serving a fake headscale.mesh zone (so your containers and tailscale clients can resolve each other)?

## User

echo $(for table in filter nat mangle raw security; do     echo "=== Table: $table ===";     sudo iptables -t "$table" -vnL --line-numbers;     echo; done) > ./iptables-rules.txt

using the above command i lose newlines, how to fix

## Assistant

Ah, yes — the problem is that echo $( … ) collapses all whitespace (including newlines) into single spaces because command substitution $( … ) trims trailing newlines and echo flattens them.

That’s why you’re losing line breaks.

✅ Fixes
1. Use printf instead of echo
Bash
(for table in filter nat mangle raw security; do
    echo "=== Table: $table ==="
    sudo iptables -t "$table" -vnL --line-numbers
    echo
done) > ./iptables-rules.txt

Here we just redirect the subshell directly instead of wrapping it in echo $(…). This preserves the newlines exactly as they are.

2. If you want to keep command substitution

If for some reason you really want $( … ):

Bash
output=$(for table in filter nat mangle raw security; do
    echo "=== Table: $table ==="
    sudo iptables -t "$table" -vnL --line-numbers
    echo
done)

printf "%s\n" "$output" > ./iptables-rules.txt

printf "%s\n" prints the string with newlines intact.

3. Even shorter
Bash
for table in filter nat mangle raw security; do
    echo "=== Table: $table ==="
    sudo iptables -t "$table" -vnL --line-numbers
    echo
done > ./iptables-rules.txt

This way, all output inside the loop is directly written to the file.

👉 The cleanest solution is #3 — no subshell, no echo $(…), just redirect the loop output.

Do you also want me to show you a nftables equivalent for dumping rules in a similar “all tables” format?
