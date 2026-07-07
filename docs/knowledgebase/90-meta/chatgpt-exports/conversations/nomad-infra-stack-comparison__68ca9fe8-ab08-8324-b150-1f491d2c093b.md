---
source_url: "https://chatgpt.com/c/68ca9fe8-ab08-8324-b150-1f491d2c093b"
conversation_id: "68ca9fe8-ab08-8324-b150-1f491d2c093b"
title: "Nomad infra stack comparison"
extracted_at: "2026-06-29T11:05:14.215Z"
message_count: 4
provenance: auth-ui
---

# Nomad infra stack comparison

Source: [ChatGPT conversation](https://chatgpt.com/c/68ca9fe8-ab08-8324-b150-1f491d2c093b)

## User

for my first nomad infra, what do you recommend out of these 3?

TemplateStars (2025)Last UpdateComponents (Nomad/Traefik/Consul/Redis/Vault)HA/Zero SPOF (Auto-Failover)Stateful Sync (Node Failure Handling)Dynamism (Auto-Discovery/No Manual Specs)Bootstrap EffortFlexibility/ComprehensivenessStability/Community Feedbackevandcoleman/ansible-hashicorp-homelab
github.com/evandcoleman/ansible-hashicorp-homelab~150 (estimated from similar; not top-10 but referenced in 2025 blogs)Feb 2025Nomad, Consul, Vault, Caddy (Traefik-swappable), Redis addablePros: 3-server quorum, auto-reschedule (<10s); zero SPOF via edges. Cons: Manual Vault unseal initial.Pros: NFS/Docker volumes, CSI-ready; data persists via external mounts. Cons: No default Ceph.Pros: Consul-Template dynamic configs/health checks. Cons: Some vars manual.Pros: Ansible + Makefile (~10-15 mins); edit ymls. Cons: Secrets gen required.Pros: VLAN tweaks, app adds easy; ~10 core jobs extensible. Cons: Infra-focused, not 77+ services.Pros: Active blogs praise resilience; secure (mTLS). Cons: Lower stars than perrymanuk.perrymanuk/hashi-homelab
github.com/perrymanuk/hashi-homelab351Sep 2025Nomad, Consul, Traefik, Redis addable, Vault integrablePros: Component HA (Traefik/CoreDNS w/Keepalived floating IP). Cons: Assumes pre-cluster; partial quorum.Pros: NFS/iSCSI CSI defaults; sync across nodes (e.g., Postgres). Cons: NFS setup tweaks needed.Pros: Modular HCL, Consul discovery. Cons: Env vars manual sync.Pros: Makefiles (~30 mins post-cluster). Cons: Needs Nomad/Consul first.Pros: 77 services exhaustive; categories (media/AI). Cons: Less infra automation.Pros: Most starred; Reddit/X homelab mentions. Cons: Relies on Tailscale for deploys.kencx/homelab
github.com/kencx/homelab191Apr 2024Nomad, Consul, Vault, Traefik, Redis addablePros: Expandable 3+ nodes/quorum. Cons: Base no HA; manual unseal.Pros: Vault raft; CSI-ready. Cons: No detailed NFS/Ceph.Pros: Consul mTLS/auto-certs. Cons: Proxmox-spec
Show more

## Assistant

Got it — you’re choosing your first Nomad infra and weighing three community homelab stacks. Since this is your first deployment, the best choice depends on whether you value learning the fundamentals or jump-starting with lots of apps/services. Let’s break them down in plain language:

🔹 evandcoleman/ansible-hashicorp-homelab

Best if: You want to learn Nomad/Consul/Vault fundamentals while still having HA and real infra practices.

Pros:

HA baked in (3-server quorum, fast rescheduling).

Covers core infra tools (Nomad, Consul, Vault) instead of “apps-first.”

Dynamic configs via Consul-Template (production-like).

Bootstrap is relatively smooth (Ansible + Make).

Cons:

Fewer apps out of the box.

Vault needs manual unseal initially.

Lower GitHub stars (but positive blog mentions).

👉 Recommendation: Strong if you want a solid infra foundation before layering on services.

🔹 perrymanuk/hashi-homelab

Best if: You want apps/services immediately (media, AI, etc.) with Nomad infra underneath.

Pros:

Biggest community/visibility (most stars, active mentions).

77+ prebuilt services (good if you want Plex, Jellyfin, ML, etc. fast).

HA for Traefik/CoreDNS with Keepalived.

Cons:

Heavier to bootstrap (Nomad/Consul need to exist first).

Less infra automation, more about apps on top.

Some manual env sync.

👉 Recommendation: Best if you want “apps day one” and aren’t worried about learning deeper Nomad/infra internals immediately.

🔹 kencx/homelab

Best if: You want a lightweight, simpler starting point but still Nomad + Consul + Vault.

Pros:

Covers all the main Hashi stack (Nomad/Consul/Vault/Traefik).

Expandable to HA (not forced at the start).

Cleaner base, less opinionated than the others.

Cons:

Not HA out of the box (manual unseal, no quorum defaults).

Less automation/docs for storage (no NFS/Ceph baked in).

Older (last updated Apr 2024).

👉 Recommendation: Good if you want minimal, DIY, step-by-step control — but expect to fill in gaps yourself.

✅ My take for a first Nomad infra

If you want to learn infra right → start with evandcoleman (infra-first, HA by design, production-style).

If you want lots of apps working quickly → go with perrymanuk (apps-first, bigger community).

If you want simplest entry point → try kencx (but less maintained, and you’ll do more manual work).

👉 For first-time Nomad, I’d suggest evandcoleman’s ansible-hashicorp-homelab: it balances HA, infra learning, and manageable setup without overwhelming you with 70+ apps at once. You can always layer perrymanuk’s service catalog on top later.

Do you want me to sketch out a progression path (e.g., start with evandcoleman → then add perrymanuk’s services → finally tune with kencx’s flexibility), so you can “level up” your homelab instead of picking just one?

## User

any of them do stateful handling?

## Assistant

Yes — but the degree of stateful handling differs quite a bit between the three:

🔹 evandcoleman/ansible-hashicorp-homelab

Stateful story:

Supports NFS or Docker volumes, CSI-ready.

If a node dies, jobs can be rescheduled quickly (<10s), and data persists via external mounts.

No default Ceph or distributed storage — you’d need to plug in your own if you want replication beyond NFS.

✅ Handles stateful workloads decently if you bring external mounts.

🔹 perrymanuk/hashi-homelab

Stateful story:

NFS/iSCSI CSI drivers baked in by default.

Syncs state across nodes for workloads like Postgres.

NFS setup may need tuning (performance/locking).

✅ Most “ready-made” stateful handling out of the three.

🔹 kencx/homelab

Stateful story:

Has Vault raft + CSI support.

But no detailed storage implementation (no NFS/Ceph defaults).

Basically leaves stateful setup to you.

❌ Lightest on stateful handling out of the box.

⚖️ In short:

Best for stateful (ready to go): perrymanuk (NFS/iSCSI built in).

Decent, but external storage required: evandcoleman.

DIY, minimal stateful tooling: kencx.

Do you want me to compare how they actually handle node failure + resync for a database workload (e.g., Postgres losing a node) across the three? That’s usually the big test of “stateful handling” in Nomad.
