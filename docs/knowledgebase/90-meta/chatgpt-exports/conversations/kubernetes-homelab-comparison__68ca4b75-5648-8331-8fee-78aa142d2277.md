---
source_url: "https://chatgpt.com/c/68ca4b75-5648-8331-8fee-78aa142d2277"
conversation_id: "68ca4b75-5648-8331-8fee-78aa142d2277"
title: "Kubernetes homelab comparison"
extracted_at: "2026-06-29T11:51:13.426Z"
message_count: 2
provenance: auth-ui
---

# Kubernetes homelab comparison

Source: [ChatGPT conversation](https://chatgpt.com/c/68ca4b75-5648-8331-8fee-78aa142d2277)

## User

“””Top Repos Found
Searched GitHub for exhaustive Kubernetes homelab starters. Focused on ones with tons of default services, easy mods, docs on best practices. Most use GitOps but that’s not required per your ask. Skipped minimal ones. Here’s the standouts, explained from prior manual homelab pains like scripting deploys by hand or dealing with config drift.
khuedoan/homelab
Came from hacking together Ansible plays and raw K3s installs that broke on updates. Solves that with one-command bootstrap from bare metal, no more manual PXE or node tweaks. Includes: Gitea, Jellyfin, Paperless, Matrix, Grafana, Prometheus, ArgoCD, Woodpecker CI, ntfy, Ollama, cert-manager, Cilium, ExternalDNS, Rook Ceph, Tailscale. Exhaustive for media, CI/CD, monitoring, storage—has DDNS via ExternalDNS, Grafana/Prometheus, but no Traefik (uses NGINX) or SearxNG. Docs solid at homelab.khuedoan.com, shows IaC/GitOps best practices. Modify via config files, modular. Alpha stage, so test stability. Modern with eBPF networking. Worth time if you want auto-provisioning; better than raw Ansible for full automation. 4
onedr0p/home-ops
Evolved from separate Docker swarms where apps fought for resources. Uses Talos/Flux to converge everything in K8s, no more host-level messes. Defaults: cilium, istio, cloudflared, external-dns, cert-manager, external-secrets, rook, volsync, actions-runner-controller. Comprehensive for networking/security/storage, includes DDNS via external-dns, but skips Traefik/SearxNG/Grafana/Prometheus (add yourself). Docs cover Flux workflow, networking diagrams. Best practices: sops secrets, Renovate updates. Easy mods via Flux kustomizations. Stable with cloud backups. Modern, high eBPF/Istio use. Good if you like Talos; objectively fuller than basic templates for ops automation. 5
szinn/k8s-homelab
From manual Docker+shell scripts on single hosts, limiting scale. Shifts to Talos/Flux for multi-node GitOps, cuts maint time. Includes: AdGuard/CoreDNS, external-dns, Cloudflare DDNS, Rook/Ceph/NFS, volsync backups, cert-manager, *arr apps backups, MySQL/PostgreSQL. Exhaustive on storage/DNS/backups, has DDNS, but no explicit Traefik/SearxNG/Grafana/Prometheus (implied in monitoring). Docs detail hardware, network, PV management, install. Shows best practices: external-secrets, staging envs. Modify by adding Flux packages. Stable, self-managing. Modern with Ceph/volsync. Worth if storage heavy; better than non-GitOps for reproducibility. 8
mischavandenburg/homelab
Started with basic Talos where upgrades wrecked state. Uses Sidero Omni/Flux for disposable clusters, solves in-place upgrade risks. Defaults: Commafeed, Homepage, n8n, Wallabag, Body Metrics, Health API, Home IoT, Cert Manager, Cilium, Cloudflare Zero Trust, CloudNativePG, External DNS, External Secrets, Grafana, Prometheus, Renovate, Synology CSI. Comprehensive for personal apps/monitoring/IoT, includes DDNS via External DNS, Grafana/Prometheus, Cilium over Traefik, no SearxNG. Docs on provisioning/architecture/apps. Best practices: multi-cluster split (stateless/stateful), Azure secrets. Modify via GitOps. Stable with restores from blobs. Modern, eBPF/Postgres operator. Good for learning; fuller than single-cluster setups for scalability. 10
budimanjojo/home-cluster
From k3s templates lacking metrics. Builds on them with Talos/Flux, adds observability to catch issues early. Includes: Cilium, cert-manager, authelia, envoy-gateway, ingress-nginx, Prometheus, Grafana, MetalLB. Exhaustive on networking/auth/metrics, has Grafana/Prometheus, no Traefik/DDNS/SearxNG (add external-dns). Docs on structure/secrets/metrics. Best practices: SOPS encryption, auto TLS. Modify via app namespaces. Stable declarative setup. Modern with envoy/MetalLB. Worth for metrics focus; better than bare templates for built-in monitoring. 12
onedr0p/cluster-template
Base for many, from raw Talos boots that needed manual Flux. Templatizes it, cuts setup repetition. Defaults: cilium, coredns, spegel, cloudflared, external-dns, k8s_gateway. Basic but exhaustive foundation, includes DDNS via external-dns, no Traefik/SearxNG/Grafana/Prometheus. Docs step-by-step bootstrap. Best practices: SOPS, Renovate. Easy YAML mods. Stable with verifications. Modern Talos/Flux. Use as starter; less full than others but objectively quicker for basics. 6
techno-tim/k3s-ansible
From manual k3s HA setups with etcd quirks. Ansible automates it, no more SSH loops. Defaults: k3s, kube-vip, MetalLB, Calico/Cilium. Minimal apps, no Traefik/DDNS/SearxNG/Grafana/Prometheus. Docs on vars/config. Best practices: idempotent plays. Modify group_vars. Stable HA. Modern k3s versions. Good for cluster-only; add apps yourself, better than CLI for HA. 11
k8s-at-home/template-cluster-k3s
Similar to onedr0p’s, from community needs for opinionated starters. Uses Ansible/Terraform/Flux, solves multi-tool chaos. Defaults: cilium, coredns, cloudflared, external-dns. Like above, basic with DDNS, no others. Docs comprehensive. Best practices: SOPS, Renovate. Easy mods. Stable. Modern. Overlaps heavily with onedr0p; pick if you want Terraform. 9
Exhaustive Comparison
All solve manual K8s pains like kubectl yaml applies leading to drift. khuedoan tops exhaustiveness with media/CI/apps stack, solves all-in-one needs better than others’ focus on infra. mischavandenburg close second for personal/IoT, multi-cluster beats single for stability. szinn strong on backups/storage, better if data-heavy. budimanjojo metrics-focused, adds auth missing in basics. onedr0p/home-ops fuller ops than its template, with Istio for mesh. Templates like onedr0p/cluster and k8s-at-home least exhaustive, but easiest mods via YAML—add your stuff without bloat. techno-tim cluster-only, no apps, but HA from scratch beats others’ assumptions.
Docs: All good, khuedoan/mischavandenburg most detailed on practices. Stability: Alpha in khuedoan riskier; Talos-based like onedr0p/szinn more proven. Modernization: All high with Cilium/Flux, khuedoan adds Nix for repro. Mods: GitOps ones (most) via commits; techno-tim Ansible vars simpler if no Git.
How to Choose
What’s your priority? If max defaults/apps, start khuedoan—test one-command, see if alpha bugs bite; objectively fullest. Storage/backups key? szinn. Monitoring first? budimanjojo or mischavandenburg. Bare cluster to expand? techno-tim, add via SDK later. Talos fan? onedr0p/home-ops for converged setup. Fork/mod any; all modifiable, but exhaustive ones save “wtf add this” hunts. Try khuedoan first, fall back to template if too much.
“””

Based on this info what do you recommend for a newbie? Just want best practice, intuitive ha behavior and stateful services ha handling. Just specify my IPs somewhere and point a records on Cloudflare to the nodes I plan to use for the cluster. Don’t want to frustrate myself configuring further
Show more

## Assistant

Got it — thanks for laying all that out so clearly. Based on what you said you want (best practices baked in, intuitive HA, stateful apps that don’t blow up if a node dies, minimal frustration in tweaking), here’s the recommendation path:

✅ Best Fit for You

🔹 mischavandenburg/homelab

Uses Sidero Omni + Talos + Flux → makes cluster disposable and upgrade-safe, no “pets” cluster you have to babysit.

Stateful handling via CloudNativePG + Rook + external-secrets + volsync → storage + databases handled properly.

Grafana/Prometheus, Renovate, ExternalDNS, cert-manager → monitoring, upgrades, DDNS all included.

Docs cover the why (provisioning, architecture, GitOps flow), so you don’t have to reverse-engineer.

HA comes almost “for free” thanks to Talos and GitOps — you just point Cloudflare A records at nodes, and ExternalDNS + cert-manager do the rest.

More complete than bare templates, but not overwhelming like khuedoan’s alpha project, so you won’t trip over early instability.

🟡 Alternatives if you want simpler

onedr0p/home-ops → polished, Talos/Flux based, very strong ops story. A little more infra-first, so you’d add apps yourself (good if you prefer leaner start).

szinn/k8s-homelab → excellent if you care most about backups/storage resilience (Ceph/volsync).

❌ Avoid for now

khuedoan/homelab → very full stack but alpha = potential frustration.

techno-tim/k3s-ansible → stable for HA cluster only, but you’ll be wiring up all apps yourself.

cluster templates (onedr0p/k8s-at-home) → great for pros, but you’d be assembling too much from scratch.

📌 Bottom Line

If you want to learn but not fight config, go with mischavandenburg/homelab.
It’s modern, gives you HA stateful apps out of the box, docs explain best practices, and you won’t have to tinker endlessly.

👉 You’ll mostly be specifying:

your node IPs (Talos configs)

Cloudflare API credentials (for ExternalDNS + cert-manager)
Then GitOps + automation handle the rest.

Do you want me to sketch a “newbie bootstrap flow” for mischavandenburg’s setup (like step 1 → prep IPs, step 2 → bootstrap cluster, etc.) so you’d see exactly what’s involved before committing?
