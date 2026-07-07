---
source_url: "https://grok.com/c/d77cf1cd-6e2a-4969-9d8b-0cfc9311a8af"
conversation_id: "d77cf1cd-6e2a-4969-9d8b-0cfc9311a8af"
title: "Free Domain Forwarding Services Overview"
extracted_at: "2026-06-29T16:21:56.669Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Free Domain Forwarding Services Overview

Source: [Grok conversation](https://grok.com/c/d77cf1cd-6e2a-4969-9d8b-0cfc9311a8af)

## User

_Time: 2025-09-01T19:41:39.583Z_

is there a free domain forwarding service that allows me to define and work with DNS records like A/AAAA/CNAME/TXT...? Like, I do NOT want to pay for a domain, i don't want to own a domain, i want exclusively and specifically a subdomain at an existing url where that subdomain i have full control over stuff like mysubdomain.domain-forwarder.com so i can do stuff like `A *.mysubdomain.domain-forwarder.com 1.2.3.4* to forward *.mysubdomain.domain-forwarder.com wildcard via ipv4 to 1.2.3.4 and potentially something like mysubsubdomain.mysubdomain.domain-forwarder.com where mysubsubdomain is an A record forwarding to a different ip like 6.7.8.9

## Assistant

_Time: 2025-09-01T19:43:52.727Z_

Yes, services like this exist from providers solving the problem of home/server users needing persistent hostnames without buying domains—evolving from basic dynamic DNS (which only updated A records for fixed subdomains) to full zone management for flexibility in routing, certs, and sub-subdomains.

Dynv6 and desec.io (via dedyn.io) both give you a free zone like yourname.dynv6.net or yourname.dedyn.io where you control all records—A/AAAA for IPs, CNAME for aliases, TXT for verification/SPF, MX/SRV for mail/services, and wildcards like *.yourname.dynv6.net A 1.2.3.4 to catch everything under it, plus sub-records like sub.yourname.dynv6.net A 6.7.8.9. Dynv6 has no subdomain limit but slower updates sometimes; desec.io caps at 15 subdomains per account but includes DNSSEC and faster propagation.

Dynu does the same with yourname.dynu.com (or similar endings), supporting those records plus wildcards, but free tier limits to 4 domains/zones and no DNSSEC.

FreeDNS.afraid.org lets you pick subdomains from public pools like yourname.mooh.com, with A/AAAA/CNAME/TXT/MX control, but wildcards require their $5/month premium—free sticks to exact records without * catchalls.

If none fit exactly, eu.org gives free yourname.eu.org (like a subdomain of eu.org) with full control after a 2-3 day approval, but it feels more like owning since you register it.

YDNS and No-IP offer free subdomains but restrict to A/AAAA/TXT updates without full CNAME/wildcard freedom, so skip if you need those.

To pick: Start with dynv6 or desec.io if unlimited/wildcards matter most; they're objectively better than limited ones for complex setups like yours.
