---
source_url: "https://chatgpt.com/c/681e9136-fb90-8006-a2d4-781ccc6eff28"
conversation_id: "681e9136-fb90-8006-a2d4-781ccc6eff28"
title: "Proxy Metrics and Optimization"
extracted_at: "2026-06-29T11:24:34.139Z"
message_count: 5
provenance: auth-ui
---

# Proxy Metrics and Optimization

Source: [ChatGPT conversation](https://chatgpt.com/c/681e9136-fb90-8006-a2d4-781ccc6eff28)

## Assistant

Awesome — now we're really getting somewhere.

You're basically saying:

“I love Docker & Compose’s local developer ergonomics, networks, ease of setup. I hate that it breaks down at scale or when trying to coordinate across stacks, hosts, or networks.”

You’re describing a missing middle ground between:

🔧 Docker Compose (easy, but isolated and messy with networking)

🧠 Kubernetes (powerful, but convoluted, bloated, overkill for small clusters)

✅ What You Want Exists — Here's What to Use Instead:
🔁 Orbstack (macOS only, but an amazing experience)

If you’re on macOS, this is the best modern Docker alternative — faster, simpler networking, and super dev-friendly.

👉 https://orbstack.dev/

If you're not on macOS, scroll down.

✅ The Best K8s-Free, Compose-Like, Cluster-Capable Tools

Here’s a shortlist of modern tools that feel like Docker/Compose, but scale across multiple hosts and solve your networking/isolation gripes:

🧱 1. Podman + Podman Compose + Netavark/Aardvark

Why it's relevant:

Docker-compatible CLI (use alias docker=podman)

Full rootless container support

Netavark enables advanced networking modes like per-network DNS, interface binding, IPv6, etc.

Works great without a daemon

Works on Linux, WSL2, and even remote systems

Best for: Power users who want Docker without Docker

🌐 2. Lima + Nerdctl + containerd (Compose support)

This combo is Docker-less, systemd-free, and designed to be scriptable, lightweight, and flexible.

nerdctl is a Docker-compatible CLI for containerd

Supports compose.yaml via nerdctl compose

Macvlan / IPvlan / CNI networking built in

Works great across VMs or servers with some scripting

📦 Bonus: Works well with tools like Headscale
 for a mesh VPN layer.

🧠 3. Waypoint (by HashiCorp)

Waypoint gives you the Git push-to-deploy experience, can deploy to Docker, Nomad, K8s, etc.

Can deploy your app to remote Docker daemons

Can manage environments/staging automatically

Supports plugins for different backends

Easy for rolling deployments across machines

You can think of it like Heroku but self-hosted and Docker-native.

🛜 4. Tailscale + Compose stacks + WireGuard-aware routing

This one’s custom, but works beautifully:

Run a Tailscale mesh across your hosts

Each Compose stack runs on its own host

Expose internal services only to Tailscale IPs

Use a reverse proxy (Caddy or Traefik) as an entry node that knows how to route

You now have:
✅ Full isolation
✅ Global routing via hostname/IP
✅ Compose-based, per-host deployments
✅ Zero config networking between machines

🧪 Experimental Option: Dagger

Dagger is an emerging CI/CD + runtime pipeline system based on containers and real code. It can act like Compose on steroids but it's early-days.

✅ Bottom Line / Best Stack for You

If you're happy with Compose and want multiple Compose stacks across servers to talk easily, here’s the winner:

🥇 Use this:

🧰 Docker Compose (normal)

🛜 Tailscale
 to link the servers together securely

🔄 Use macvlan or custom bridge networks to bind to interfaces

🧠 Use Caddy or Traefik (with Docker provider + Tailscale DNS/IP support)

This gives you:

Easy multi-host Compose

Service-to-service routing

No K8s or Swarm overhead

Fast failover / fallback / rolling restarts

Would you like a fully working multi-host Compose + Tailscale + Traefik example?

## User

The top 3 sound good but idk how to choose at this point. Also i'm noticing docker desktop is horribly buggy and glitchy on windows and it's slow. But, wsl2, if i don't install docker desktop and i just install docker through the vm exclusively, which apparently isn't recommended, it works amazingly.

Why isn't it recommended and is there any real reason i shouldn't do it that way? if anything i'd probably edo it that way if i tried podman again since i had the same problems with its desktop version on windows.

Like honetsly do they just all want everyone to swap to linux/mac at this point like wtf is the issue with windows in 2025? Anyway please help me choose one of the 1 top options.
Show more

## Assistant

You're zeroing in on the real issue here: Windows + containers is still a hot mess in 2025 unless you go the WSL2 route without Docker Desktop.

🧨 Docker Desktop on Windows is heavy, buggy, and slow
🧊 WSL2 + native Linux Docker (without Desktop) is fast, reliable, and clean
✅ It's not officially recommended by Docker Inc. because it bypasses their paid product and limits their control (telemetry, licensing, updates). But it works great.

🧠 So yes — go WSL2-native. You’re doing the right thing.

Now, to help you choose the right alternative:

🥇 Pick This Stack:
✅ Podman + Podman Compose + Netavark

Inside WSL2 (Ubuntu or Debian)

Why it wins for you:

No Docker Desktop. ✅

Docker-compatible. ✅ (alias docker=podman)

Runs daemonless (each container is its own process). ✅

Uses Netavark, which supports advanced networking like custom interfaces and isolated DNS per network. ✅

Lightweight, clean, and fast. ✅

Supports Macvlan, IPvlan, interface binding, firewall isolation, and more out of the box.

❗ Bonus: To make Podman just as smooth as Docker:

In WSL2:

Bash
sudo apt install podman podman-compose netavark aardvark-dns -y

Enable rootless containers:

Bash
podman info | grep rootless

(Optional) Alias Docker if you want:

Bash
echo "alias docker=podman" >> ~/.bashrc

Use podman-compose just like docker-compose.

Want remote hosts later? Podman has podman machine and podman system connection for connecting to other systems (or use ssh + systemd for remote containers).

🚫 Avoid:

Docker Desktop

Podman Desktop (also janky on Windows)

Swarm (deprecated)

K8s unless you need automatic autoscaling or 100+ services

You asked “why do they push people off Windows?”

Because:

Windows is a closed platform for kernel-level virtualization.

WSL2 is actually just a Hyper-V-backed Linux kernel.

Everything modern in containers assumes Linux syscalls and namespaces.

Mac and Linux give them less edge-case bug reports to deal with.

Final Answer:

✅ Use WSL2 + Podman (rootless) + podman-compose + netavark

This stack gives you everything Compose offers, scales cleanly to remote servers if you want later, and sidesteps Docker Desktop completely.

Would you like a full setup script to install and configure this in WSL2?

## User

what are the following:
- netavark
- waypoint
- lima/nerdctl
- aardvark
please compare them all to the other standards and explain why i might like these better?

What I really want is something almost drop-in compatible with docker compose so i don't have to rewrite 1000 lines of yaml. Can nomad/podman/nerdctl or anything do that? Kompose is dogshit.
Show more

## Assistant

Great — you're asking all the right questions here. Let's cut the fluff and get you exactly what each of these tools are, why they exist, and how they relate to drop-in Docker Compose compatibility, which is your top priority.

🧩 QUICK EXPLANATIONS
Tool	What It Is	Replaces/Improves	Compose Compatible?	Why You Might Care
Netavark	A modern container network stack for Podman	Docker's bridge/macvlan	✅ Fully w/ Podman	Advanced networks (IPv6, macvlan, DNS, firewalled networks)
Aardvark	A DNS server paired with Netavark	Docker’s embedded DNS	✅ Fully w/ Podman	Isolated DNS per network; cleaner than Docker’s shared resolver
Waypoint	A deployment orchestrator by HashiCorp	Helm + CI/CD + Compose	🟡 Indirect support	For GitOps, deployment pipelines, not Compose drop-in
Lima	A Linux VM runner on macOS	Docker Desktop (macOS)	✅ via nerdctl	Mac-specific; makes Linux tools work natively on macOS
nerdctl	Docker CLI clone built over containerd	Docker CLI	✅ Yes (Compose too)	Lightweight, works with compose.yaml out of the box, Kubernetes optional
🧠 DETAILED BREAKDOWN
🧱 Netavark

A network backend designed for Podman, rootless, and secure container networking.

Supports macvlan, ipvlan, static IPs, and firewall isolation better than Docker.

Paired with Aardvark for DNS, and replaces CNI, which was bloated and inconsistent.

Why you’d like it: You’re into fine-grained network control (e.g. isolating stacks, specific interfaces). Docker does this poorly.

🧠 Aardvark

DNS backend for Netavark.

Allows each container network to have its own DNS resolver, unlike Docker where everything shares one.

Why it matters: Perfect for isolation, privacy, and no DNS leakage across container groups.

🧠 Waypoint (by HashiCorp)

Think of it as Terraform meets CI/CD for applications.

Not a runtime. It's a developer deployment tool that supports pushing apps to Nomad, K8s, ECS, etc.

NOT Docker Compose compatible directly.

Why it’s not for you (yet): Too abstract if you're not building a platform or cluster. It's a deployment orchestrator, not a local runtime.

🧠 Lima

Lightweight Linux VMs for macOS.

The point is: macOS can't run containers natively. Lima runs real Linux under the hood.

Used under the hood by Rancher Desktop, Colima, and OrbStack.

Why it’s not for you: You’re on Windows/WSL2. Lima is Mac-only.

🧠 nerdctl

A Docker CLI replacement that runs on containerd, not dockerd.

Supports docker run, docker-compose, even BuildKit and K8s via nerdctl + nerdctl compose.

Think: Docker CLI without the Docker daemon.

Why you’d like it: If Docker goes away or is too bloated, nerdctl gives you the same UX with modern containerd and better K8s support.

🆚 COMPOSE COMPATIBILITY
Tool	docker-compose-style YAML support?	Notes
Podman + podman-compose	✅ Basic support	Most real-world Compose files work. Some features (like depends_on) may behave differently.
nerdctl + nerdctl compose	✅ Excellent support	Arguably better than podman-compose. Supports docker-compose.yml 1:1 in most cases.
Nomad	❌ Not native	Needs conversion. Do not use if you want drop-in Compose compatibility.
Waypoint	🟡 Some abstraction	It has its own file format and deploy flow. Not meant for direct Compose files.
Kompose	✅ But it's trash	Tries to convert Compose → K8s, often breaks. Not useful in real production.
🏆 YOUR BEST BET

You want Docker Compose compatibility, without the Docker Desktop hell.

Here’s the stack to go with today, based on what you told me:

🥇 WSL2 + nerdctl + containerd + nerdctl compose

100% Docker Compose compatibility

No Docker Desktop

Based on containerd, the standard runtime for K8s

Use modern features like rootless, namespaces, GPU passthrough, and more

Plays nice with k3s or k8s if you grow into it later

🥈 WSL2 + Podman + Netavark + podman-compose

Solid alternative if you want systemd integration and per-container firewalls

Slightly less mature Compose support, but great for secure setups

Rootless is first-class

Would you like a ready-to-copy installer/setup script for either nerdctl or podman inside WSL2?
