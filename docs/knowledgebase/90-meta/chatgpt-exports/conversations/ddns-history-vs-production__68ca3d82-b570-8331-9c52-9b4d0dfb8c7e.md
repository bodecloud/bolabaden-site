---
source_url: "https://chatgpt.com/c/68ca3d82-b570-8331-9c52-9b4d0dfb8c7e"
conversation_id: "68ca3d82-b570-8331-9c52-9b4d0dfb8c7e"
title: "DDNS history vs production"
extracted_at: "2026-06-29T11:05:35.224Z"
message_count: 5
provenance: auth-ui
---

# DDNS history vs production

Source: [ChatGPT conversation](https://chatgpt.com/c/68ca3d82-b570-8331-9c52-9b4d0dfb8c7e)

## User

There are a crapton of cloudflare DDNS solutions for deploying a docker container that’ll continually and regularly update cloudflare a/aaaa records for a domain.

My goal seems to be niche for some reason that I can’t figure out. In classic HA I have a cluster with 5 nodes or so that provide accessible traefik reverse proxy for my domain. So I can have all 5 nodes providing access to the unified traefik implementation I mean for *.bolabaden.org.

So intention was to replicate a cloudflare ddns instance that runs one instance on every single node.

But the kicker? Tried 6 different cloudflare ddns and none of them support this configuration. Anytime ONE updates the A/AAAA record, it overwrites the others. This truly doesn’t make sense, ha is the ultimate and widely adopted solution so why the fuck does no one have support for it? I mean cloudflare dns itself I can manually specify all 5 a/aaaa records in cloudflare’s control panel but wtf why is there no ddns support anywhere? Is the world truly expecting/running single node websites? Seems retarded. Also seems wrong and unbelievable. Points to me doing something wrong. On other hand there’s literally no other way to get *.bolabaden.org to resolve without spof without the functionality in ddns.
Show more

## User

“””M ost of the popular DDNS implementations (the ones you probably tried: oznu/cloudflare-ddns, joshava/cloudflare-ddns, timothymiller/cloudflare-ddns, etc.) are written with the assumption of a single A/AAAA record → one host. They just “update” the record to point at the current WAN IP. That makes sense in the dynamic-IP-on-my-home-router use case — which is the origin of DDNS.”””

Prompt is highly focused on why th is is. Idc about solving my issue why the fuck are MULTIPLE ddns implementations written this way if literally NOBODY uses single node deployments in production
Show more

## Assistant

Yeah — you’ve run head-first into a cultural artifact of where DDNS comes from vs. how real production HA systems are deployed.

Let me break down why almost all Cloudflare DDNS containers/scripts are written in that “last writer wins” way:

1. The original DDNS use case

Dynamic DNS was invented in the late 90s/early 2000s for home users with dynamic IPs (dial-up, DSL, cable, later fiber).

Typical situation: you have one box behind one ISP connection and you want myhome.dyndns.org or foo.no-ip.com to resolve to it.

That’s literally a single A record that has to be rewritten every time your ISP changes your WAN IP.

Every library and mental model that followed was built around this idea: “Find my current WAN IP, push it to the DNS record, overwrite whatever was there.”

2. Real production HA doesn’t use DDNS

Companies running multi-node systems or load balancing don’t touch DDNS at all.

They use stable IPs (from providers who guarantee static assignments), or front with anycast, load balancers, or BGP advertisements.

For DNS-based distribution, they configure multiple A/AAAA records manually or via IaC (Terraform, Ansible, Cloudflare API).

So the set of people who both:

run a true HA/multi-node cluster, and

also rely on residential-style dynamic IPs
…is extremely niche.
That’s why the ecosystem doesn’t optimize for it.

3. The “mental split” in the developer community

Devs who write DDNS scripts tend to come from the homelab/self-hosted crowd. They’re solving their own problem:
“My ISP keeps changing my home IP, I want my Nextcloud or Plex server reachable.”

Devs who operate HA systems with Cloudflare usually come from the SRE/infra world. They don’t even think in terms of DDNS — they use Terraform/Cloudflare API + stable infra.

So the two worlds don’t meet. DDNS projects don’t evolve multi-record support, because their user base doesn’t ask for it.

4. Why overwriting seems “normal” to them

If you imagine the 2003 DSL-modem mindset:
“My IP changed, so the DDNS script needs to overwrite the old one.”

Supporting multiple records per hostname introduces new questions that don’t exist in the single-node use case:

Do I add a new record instead of replacing?

Do I prune dead records? How?

Should I key on machine ID or hostname?

What if two nodes race to update?

All of that is “extra complexity” that their user base doesn’t need. So they just skip it.

5. The disconnect

So the “WTF” you’re experiencing is basically:

In production thinking, you’re right: single-node anything is a SPOF and a non-starter.

In DDNS land, the entire purpose is “my one WAN IP keeps changing, help me keep DNS pointed at it.”

These projects were never aimed at HA users — only at single-IP homelabbers.

👉 In other words:
It’s not that the world runs single-node production websites. It’s that DDNS itself is a “single-node hack” from the home-internet era, and hasn’t been re-imagined for HA because the overlap of “dynamic IP” + “multi-node cluster” is vanishingly small.

Would you like me to also sketch how one would design a multi-record-aware Cloudflare DDNS (basically treating each node’s record independently rather than overwriting)? That could help square the circle between HA reality and DDNS history.

## User

Nah that’s a bs explanation. Cloudflare didn’t exist until recently. Pretty sure ha was standard before Cloudflare even was a thing. Also literally yeah I’m just trying to get my plex server accessible and my vps keeps crashing so I need ha. Literally anyone and everyone else will also reach this problem implying they found a way to get ha working with ddns overwrites implying the overwrite problem isn’t a problem in their configuration. Exclusively tell me how they ha when dns only points to one node…? They using cname somehow instead of a/aaaa? Would prolly have same problem though.
Show more

## Assistant

Got it — let’s unpack this very concretely. You’re right: HA (in the sense of clustering, failover, multi-node services) predates Cloudflare by decades. So why do all these DDNS scripts keep blowing away records instead of coexisting? And more importantly, how the hell are other people doing HA if the DDNS “overwrite” model seems like it can only point to one node?

1. What DNS can actually do for HA

Multiple A/AAAA records for one hostname: this is how DNS “round robin” works. You publish several IPs, and resolvers rotate through them. That’s the classic multi-node setup.

CNAMEs: you can’t CNAME *. (wildcards) at the zone apex, and they don’t solve the multi-IP issue anyway — they just point one hostname to another.

SRV records: not relevant for web; browsers ignore them.

Cloudflare proxy (orange cloud): if enabled, CF itself becomes the HA/load balancer, and you only need to keep one record updated to CF’s edge. But if you’re running Traefik directly on each node (not proxying through CF), then you need DNS to point at all your nodes.

So the “right” answer for your case is:
✅ you need all nodes’ IPs present in the A/AAAA records. Otherwise, DNS will only ever resolve to one node.

2. Why don’t DDNS clients support that?

Because the original design of those clients is “replace record”. They literally PUT or PATCH the record ID they were given on Cloudflare’s API. That means they never add new records, they just overwrite the existing one.

That’s why you’re seeing the destructive behavior: it’s not DNS being incapable, it’s the code choosing the overwrite path.

3. How are other people “getting HA” then?

Here’s the split:

Most Plex/selfhost folks:
They don’t HA. They have a single node behind DDNS, maybe with backups, maybe with a single failover script. That’s why the DDNS ecosystem looks “single node” — because that’s what the majority actually runs.

People who do HA on residential/dynamic IPs:

They either wrote their own “multi-record aware” updater (using Cloudflare API directly).

Or they don’t HA at the DNS layer — they HA at another layer:

Tunnel: Cloudflare Tunnel, Tailscale Funnel, WireGuard mesh → DNS always points to one stable endpoint, traffic is forwarded internally to any node.

VIP/floating IP: Only one node is “active” at a time, it announces the floating IP, so DNS only ever sees one A record but HA is achieved at the network layer.

External LB: Some people put a cheap VPS (with static IP) in front as a reverse proxy/load balancer, and that one IP is what DDNS updates (if needed).

So, when you ask: “Exclusively tell me how they HA when DNS only points to one node?”
👉 They usually don’t. Or, they’re not actually using DDNS the way you’re trying to. They sidestep the overwrite problem by:

Collapsing traffic onto one stable IP (VIP, LB, tunnel).

Or manually scripting multi-record updates (rare, but some do).

4. Why you’re running into the “WTF moment”

It feels like everyone must have solved this because HA is so standard in production. But the catch is:

Production HA doesn’t use DDNS. They have static IPs, real load balancers, and DNS configs managed declaratively (Terraform, etc).

DDNS projects serve the “one Plex box at home” crowd.

You’re in the overlap: homelab but also demanding “real HA.” That’s the niche.

So to answer your direct question:

“Exclusively tell me how they HA when DNS only points to one node…?”

They don’t use DNS itself for HA in those DDNS setups. They either:

Run single-node with failover, or

Hide HA behind one stable endpoint (VIP, tunnel, VPS proxy), or

Manually manage multiple A records (outside the DDNS script).

That’s why you don’t see multi-record DDNS projects: the majority just doesn’t need them, and the minority hacks it with tunnels or Cloudflare proxying.

Do you want me to show you exactly how a multi-record-aware Cloudflare updater would work (so each node adds its own A/AAAA record without overwriting others)? That’d answer whether your idea is feasible with straight DNS — spoiler: it totally is, just nobody’s packaged it.
