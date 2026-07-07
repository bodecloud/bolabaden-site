---
source_url: "https://chatgpt.com/c/6891809d-49f8-8006-ae22-89fc2e2b07e7"
conversation_id: "6891809d-49f8-8006-ae22-89fc2e2b07e7"
title: "Self-hosted HA load balancing"
extracted_at: "2026-06-29T11:27:50.861Z"
message_count: 5
provenance: auth-ui
---

# Self-hosted HA load balancing

Source: [ChatGPT conversation](https://chatgpt.com/c/6891809d-49f8-8006-ae22-89fc2e2b07e7)

## Assistant

YugabyteDB comes in two main editions with different licenses. Here's the breakdown:

🧾 YugabyteDB Licensing Overview (as of 2025)
Edition	License	Open Source?	Self-Hostable?	Usage Limits
YugabyteDB Community Edition	Apache 2.0	✅ Yes	✅ Yes	✅ No limits
YugabyteDB Enterprise Edition	Proprietary	❌ No	✅ Yes	🔒 Requires license
YugabyteDB Managed (YBM)	SaaS (Cloud)	❌ No	❌ No (Cloud only)	Pay-as-you-go
✅ Community Edition (Apache 2.0) — What You Want

Fully open source

Free to use, modify, and redistribute

No restrictions on:

Production deployments

Commercial use

Number of nodes or clusters

Included Features:

Core distributed SQL database engine

YCQL (Cassandra-like) and YSQL (PostgreSQL-compatible) APIs

Fault tolerance, replication, and high availability

Not Included:

Advanced enterprise-only features like:

RBAC and LDAP integration

Encryption at rest (some parts)

Audit logging

Multi-tenant security policies

⚠️ But for your use case — drop-in Postgres-like HA for multiple apps on multiple servers — the Community Edition is enough and legally clean to self-host.

📜 TL;DR

Use YugabyteDB Community Edition — it’s Apache 2.0, truly open source, and free.

No license fees, no phoning home, and safe for production.

You don’t need Enterprise features unless you’re at massive scale or need regulatory/audit requirements.

Would you like a minimal docker-compose setup for running the open source edition across two nodes?

## User

Price?

## Assistant

Here’s what I found regarding YugabyteDB licensing and pricing:

Licensing – Community Edition

YugabyteDB is now 100% open source under the Apache 2.0 license.

There is no longer a separate Enterprise edition; all core DB features—backup, encryption, multi-region replication, change data capture—are available under Apache 2.0 
Reddit
+15
Medium
+15
Amazon Web Services, Inc.
+15
.

You can self-host it at no cost, with no feature or usage limits.

YugabyteDB Aeon (Managed Cloud / BYOC) Pricing

If instead you're using YugabyteDB Aeon (the fully-managed DBaaS, including BYOC deployments):

From the official pricing:

Standard tier: starts at $125 per vCPU per month

Professional tier: starts at $167 per vCPU per month

Enterprise tier: custom pricing via sales

Storage, backup, and transfer are additional charges:

Disk storage: $0.10/GB per month

Backup storage: $0.025/GB per month

Data transfer:

Same‑region: $0.01/GB

Cross‑region (non‑APAC): $0.02/GB

APAC: $0.08/GB

Internet egress: $0.10/GB 
Reddit
Reddit
+6
Yugabyte
+6
YugabyteDB Docs
+6
Amazon Web Services, Inc.
+2
Azure Marketplace
+2

This pricing applies whether you're using managed hosted clusters or a “bring-your-own-cloud” deployment with Yugabyte support.

There is also a free sandbox tier and a 14‑day full‑feature trial available for evaluation 
Yugabyte
Yugabyte
+2
webvar.com
+2
.

Summary Table
Deployment Type	Licensing / Cost
Self-hosted (OSS)	Apache 2.0, free and unlimited
Managed (Aeon Standard)	~$125/vCPU/month plus extras
Managed (Aeon Professional)	~$167/vCPU/month plus add‑ons
Enterprise (Aeon)	Custom pricing via quote
Key Takeaways

If you install YugabyteDB yourself, there’s zero licensing cost—Apache 2.0.

If you opt for Yugabyte’s managed service (Aeon)—whether fully hosted or via BYOC—the Cost starts around $125/vCPU/month and scales from there depending on tier, storage, and transfer usage.

Would you like help calculating what this might cost for a typical two-node cluster or deploying the free self-hosted version?

## User

No I only care about price of self hosting yugabyte db for my business

## Assistant

If you're planning to self‑host YugabyteDB for your business, you’re in luck—there is no licensing or feature cost for the open source version.

Self‑Hosting Costs: None for YugabyteDB Community Edition

YugabyteDB Community Edition is licensed under Apache 2.0, with no limitations or fees for commercial or production use. You can run unlimited clusters, unlimited nodes, and use all core distributed SQL features for free.
reddit.com
+13
en.wikipedia.org
+13
reddit.com
+13

All features needed for high availability, PostgreSQL wire compatibility, and distributed transactions are available in the community edition—you don’t need to pay for commercial tiers unless you want managed services or enterprise support.
reddit.com

What You Don’t Pay For (Self‑Hosted)
Item	Cost
YugabyteDB software	$0
Licensing fees	None
Node limits	None
Feature restrictions	None
Production use	Allowed
Summary

Self-hosted YugabyteDB = free (Apache 2.0) with full functionality for your distributed Postgres-compatible needs.

You only start incurring costs if you opt for YugabyteDB Aeon (managed service), where pricing begins at ~$125/vCPU/month—not required for your use case.
yugabyte.com
+2
yugabyte.com
+2

If you're considering operational overheads (infrastructure, compute, ops work), I’d be happy to help estimate that too—or spin up a minimal self-hosted cluster for testing!
