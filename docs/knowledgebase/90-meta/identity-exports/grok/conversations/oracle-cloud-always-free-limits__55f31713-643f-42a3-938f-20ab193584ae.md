---
source_url: "https://grok.com/c/55f31713-643f-42a3-938f-20ab193584ae"
conversation_id: "55f31713-643f-42a3-938f-20ab193584ae"
title: "Oracle Cloud Always Free Limits"
extracted_at: "2026-06-29T16:12:10.524Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Oracle Cloud Always Free Limits

Source: [Grok conversation](https://grok.com/c/55f31713-643f-42a3-938f-20ab193584ae)

## User

_Time: 2026-01-20T01:55:00.974Z_

Please research and provide absolute specifics of EXACTLY, and I mean **exactly** what oracle cloud's 'always free' tier supports to get the most bang for one's buck. Be comprehensive, exhaustive, and complete. Exclusively look only at the reddit and the oracle cloud documentation itself.

## Assistant

_Time: 2026-01-20T01:56:12.640Z_

### Key Resources and Limits
Oracle Cloud's **Always Free** tier provides indefinite access to specific resources with strict limits, available in your home region. These never expire if you stay within caps.

- **Compute** — Up to 2 AMD micro instances (each 1/8 OCPU, 1 GB RAM) + Arm-based Ampere A1 Flex (total 4 OCPUs, 24 GB RAM, configurable across up to 4 instances).
- **Storage** — 200 GB total block/boot volume + 20 GB object/archive storage (combined tiers post-trial) + 50,000 API requests/month.
- **Databases** — 2 Autonomous Databases (each 1 OCPU, 20 GB storage) + 1 NoSQL or HeatWave instance with limits.
- **Networking** — 1 Flexible Load Balancer (10 Mbps), 1 Network Load Balancer, up to 2 VCNs, 50 Site-to-Site VPN connections, 10 TB outbound data transfer/month.
- **Other** — Monitoring, notifications, logging, vault secrets, and more with specified caps.

### Maximizing Value
Configure one powerful Arm instance with all 4 OCPUs and 24 GB RAM for demanding tasks like self-hosting. Combine with 2 micro instances for lightweight services. Use full 200 GB block storage by attaching volumes to instances. Keep instances active (CPU/network/memory >20% over 7 days) to avoid reclamation. Community tips suggest upgrading to Pay As You Go (PAYG) while staying in free limits for better stability and availability, though pure Always Free works indefinitely if compliant.

### Risks and Considerations
Idle instances risk reclamation after 7 consecutive low-utilization days. Capacity varies by region; some users report creation difficulties without PAYG. No SLAs or full support for Always Free-only accounts. Outbound port 25 blocked by default.

| Category | Resource | Exact Limits | Notes |
|----------|----------|--------------|-------|
| Compute (AMD) | VM.Standard.E2.1.Micro | Up to 2 instances | Each: 1/8 OCPU (burstable), 1 GB RAM; Oracle Linux/Ubuntu/CentOS images |
| Compute (Arm) | VM.Standard.A1.Flex | Total 4 OCPUs + 24 GB RAM (3,000 OCPU hours + 18,000 GB hours/month) | Flexible allocation; up to 4 instances; min boot volume 47-50 GB each |
| Block Storage | Boot + Block Volumes | 200 GB total combined | 5 backups total; home region only |
| Object/Archive Storage | Standard/Infrequent/Archive | 20 GB combined (post-trial Always Free) | 50,000 API requests/month; 30 GB if paid/trial |
| Autonomous Database | Transaction Processing, Data Warehouse, JSON, APEX | Up to 2 databases | Each: 1 OCPU, 20 GB storage, 20 sessions max |
| NoSQL Database | Tables | 1 database, 3 tables | 25 GB/table, 133M reads/writes/month |
| HeatWave MySQL | Standalone instance | 1 instance | 50 GB data + 50 GB backup |
| Load Balancing | Flexible Load Balancer | 1 (10 Mbps min/max) | 16 listeners/backend sets |
| Network Load Balancer | Instance | 1 | 50 listeners/backend sets |
| Networking | VCNs | Up to 2 (free-only tenancy) | IPv4/IPv6; port 25 blocked |
| Outbound Data | Transfer | 10 TB/month | - |
| Vault | Secrets + Keys | 150 secrets, 20 HSM key versions | - |

---

### Comprehensive Overview of Oracle Cloud Always Free Tier
Oracle Cloud Infrastructure's Always Free tier offers a set of resources available for an unlimited time, distinct from the 30-day $300 promotional trial credits. These resources are provisioned in your home region and labeled as "Always Free eligible." Staying within limits ensures no charges, but exceeding them (without upgrading) can lead to disablement or deletion of excess resources.

#### Compute Resources: Getting the Most Power
The standout value comes from compute instances. You get:
- Two VM.Standard.E2.1.Micro (AMD) instances: Each provides 1/8 OCPU (burstable), 1 GB RAM, and choice of Oracle Linux Cloud Developer, Oracle Linux, Ubuntu, or CentOS images. Networking up to 50 Mbps public or 480 Mbps private.
- VM.Standard.A1.Flex (Ampere Arm): Total pool of 4 OCPUs and 24 GB memory, equivalent to 3,000 OCPU hours and 18,000 GB hours per month. Allocate flexibly—one large instance with full 4 cores/24 GB for heavy workloads (e.g., media servers, VPNs, app hosting) or split across up to 4 instances.

To maximize: Create a single Arm instance with maximum allocation for best performance. Minimum boot volume is ~47-50 GB per instance, counting against block storage. Instances must use eligible images; Oracle Linux Cloud Developer requires ≥8 GB RAM.

**Reclamation Risk**: Oracle may reclaim idle instances if, over any 7-day period, 95th percentile CPU <20%, network <20%, or memory <20% (A1 only). Community advice: Run lightweight processes (e.g., monitoring scripts) to maintain utilization.

#### Storage: Block, Object, and Archive
- **Block/Boot Volume**: 200 GB total across all boot and attached block volumes, plus 5 backups. Default boot ~50 GB; attach additional volumes to maximize usable space (~150 GB extra after one boot volume).
- **Object Storage**: Post-trial Always Free: 20 GB combined across Standard, Infrequent Access, and Archive tiers. During trial or on paid: up to 30 GB (10 GB each tier). Includes 50,000 API requests/month.

To maximize: Use block for high-performance needs (attached to compute) and object for backups/archives.

#### Databases: Powerful Options Included
- **Autonomous Databases**: Two instances total (Transaction Processing, Data Warehouse, JSON, or APEX). Each: 1 fixed OCPU, 20 GB Exadata storage, max 20 sessions. Serverless on Exadata infrastructure.
- **NoSQL**: One database, 3 tables (25 GB each), 133 million reads/writes monthly.
- **HeatWave MySQL**: One standalone single-node instance, 50 GB data + 50 GB backup.

To maximize: Use Autonomous for development/testing or low-traffic apps; HeatWave for analytics/ML.

#### Networking and Connectivity
- One Flexible Load Balancer (10 Mbps, newer tenancies) or Micro (older).
- One Network Load Balancer.
- Up to 2 VCNs (free-only), 50 Site-to-Site IPSec VPN connections.
- 10 TB outbound data transfer monthly.
- 10 GB/month VCN flow logs.

To maximize: Set up VPN for secure tunneling or load balance across instances.

#### Observability, Security, and Additional Services
- Monitoring: 500M ingestion datapoints, 1B retrieval.
- Notifications: 1M HTTPS + 1,000 email/month.
- Logging: 10 GB/month.
- Application Performance Monitoring: 1,000 tracing events + 10 synthetic monitors/hour.
- Vault: 150 secrets + 20 HSM-protected key versions.
- Email Delivery: 3,000/month (or 100/day in some listings).
- Bastions: Up to 5.
- Certificates: 5 private CAs + 150 TLS certificates.

These enable full-stack monitoring and security without extra cost.

#### Community Insights on Maximization and Stability
Users on Reddit (e.g., r/oraclecloud, r/selfhosted) frequently report using the Arm instance for self-hosting suites like Jellyfin, *arr apps, or game servers. Common tips:
- Upgrade to Pay As You Go early: Keeps Always Free resources free, accesses larger capacity pools (easier instance creation), and reduces termination risks.
- Pure Always Free accounts face occasional "out of capacity" errors or idle reclamations.
- Back up data externally; some report abrupt terminations (though often linked to inactivity or violations).
- Choose home region carefully during signup for Ampere availability.

No charges occur if limits are respected; exceeding requires upgrade or resources may be disabled/deleted after grace periods.

#### Limitations and Conditions
- Home region only for key resources (compute, databases, block).
- No SLAs; limited/community support only.
- One account per person; violations risk suspension.
- Post-trial object storage drops to 20 GB if not upgraded.
- Port 25 outbound blocked (request exemption if needed).

This tier offers exceptional value for personal projects, learning, or lightweight production—especially the 4-core/24 GB Arm instance rivaling paid VPS offerings elsewhere.

**Key Citations**
- Oracle Cloud Always Free Resources Documentation: https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm
- Oracle Cloud Free Tier Overview: https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier.htm
- Oracle Cloud Free Tier Marketing Page: https://www.oracle.com/cloud/free/
- Oracle Cloud Free Tier FAQ: https://www.oracle.com/cloud/free/faq
- Reddit Discussions on Limits and Tips: https://www.reddit.com/r/oraclecloud/ (various threads on maximization, PAYG upgrade, and idle policies)

## User

_Time: 2026-01-20T01:58:54.670Z_

if I wanted to create a program/project that anyone could use to quickly bootstrap all their free tier stuff for an account from api queries, should I write it myself from scratch in python, ansible, or bash? Or is there already one written that's well maintained or at least functional for bootstrapping exactly the maximum that free tier provides?

## Assistant

_Time: 2026-01-20T02:00:20.899Z_

### Key Recommendations
Existing community-driven **Terraform** configurations effectively bootstrap the maximum Oracle Cloud Always Free Tier resources, especially high-value compute (up to 4 OCPUs/24 GB RAM Arm + 2 AMD micro instances), networking, and storage. Several functional, recently updated GitHub repositories target this exact goal—no need to build from scratch. Terraform stands out as the best choice: it's declarative, idempotent, officially supported by Oracle, and handles capacity issues gracefully.

Scripts in Python or Bash exist mainly for retrying instance creation during "out of capacity" errors, but they focus narrowly on compute. Ansible has official OCI modules with samples for single resources (e.g., launching a free instance), but lacks comprehensive playbooks for full free-tier maximization—community examples are rare.

To get the most value quickly:
- Start with a proven Terraform repo (e.g., one that maxes compute and adds storage/networking).
- Fork and customize for extras like databases or load balancers.
- This approach is faster, more reliable, and maintainable than custom Python, Bash, or Ansible.

### Tool Comparison
| Approach | Pros | Cons | Existing Support for Max Free Tier | Examples |
|----------|------|------|-----------------------------------|----------|
| **Terraform** | Declarative (idempotent, easy to version/extend), official OCI provider, handles dependencies well, community configs tailored for free tier limits. | Learning curve if new to it. | Strong: Multiple repos deploy max compute, storage (200 GB), networking. | RhubarbSin (max compute/storage), HeyHamjoe, bestrocker221 (with Ansible post-config). |
| **Python (OCI SDK)** | Flexible, good for retries/notifications, integrates with OCI API directly. | Imperative (error-prone for complex setups), need to handle state manually. | Moderate: Scripts for ARM/AMD instance creation with retries. | mohankumarpaluru/oracle-freetier-instance-creation. |
| **Bash (OCI CLI)** | Simple, quick for basic automation, no extra deps beyond CLI. | Fragile for multi-resource setups, poor error handling. | Limited: Basic instance creation scripts. | futchas/oracle-cloud-free-arm-instance. |
| **Ansible** | Configuration management strength, good for post-provisioning. | Less common for OCI provisioning; samples are basic/single-resource. | Weak: Official examples for one instance/DB, no max bootstrap playbooks. | Oracle docs samples (e.g., always free compute launch). |

### Notable Existing Tools
Several GitHub repositories provide ready-to-use automation:

- **RhubarbSin/terraform-oci-free-compute-maximal-example** — Deploys max compute (1 Arm Flex with 4 OCPUs/24 GB + 2 AMD micro), VCN/subnet/gateway, security groups, 150+ GB storage across boot/block volumes, backup policy. Highly focused on free tier limits. Active (last update Dec 2024).
- **HeyHamjoe/oci-always-free-terraform** — Similar max setup: compartment, VCN, firewall, 2 micro + 1 Flex instances, extra block volume, weekly backups. Handles regional capacity notes.
- **bestrocker221/oracle-cloud-terraform** — Provisions 2 micro + 1 Flex instances, basic networking, includes Ansible playbook for post-deployment configuration.
- **mohankumarpaluru/oracle-freetier-instance-creation** (Python/Shell) — Automates creation of max ARM or AMD instances with configurable retries and notifications—useful for overcoming capacity errors.

Curated resources like neitsab/awesome-oracle-cloud-free-tier list additional guides and specialized setups (e.g., Cloudblock for VPN/Pi-Hole via Terraform + Ansible), but confirm Terraform dominates for broad bootstrapping.

### Extending for Full Maximization
The Terraform examples above cover compute/storage/networking comprehensively—the core of "bang for buck." For other free resources (e.g., 2 Autonomous Databases, load balancer, object storage):
- Add official OCI Terraform modules (well-maintained).
- Or provision separately via console/CLI after compute is up.

This hybrid approach gets you to full utilization fastest without reinventing the wheel.

---

### Detailed Analysis of Automation Options for Oracle Cloud Always Free Tier Bootstrapping
Oracle Cloud's Always Free Tier lacks an official one-click bootstrap tool for provisioning all maximum eligible resources simultaneously via API. However, the community has developed robust solutions, primarily using infrastructure-as-code tools to automate setup while respecting limits (e.g., home region only, capacity constraints, idle reclamation risks).

The primary challenge in automation is handling "out of host capacity" errors for popular Arm (Ampere A1) instances, which many tools address through retries or regional checks. Focus remains on maximizing compute—the tier's standout feature (total 4 OCPUs/24 GB RAM flexible + 2 AMD micro instances)—alongside supporting networking and up to 200 GB block/boot storage.

#### Why Terraform is the Top Choice
Terraform emerges as the most practical and widely adopted option for this use case. Oracle maintains an official OCI provider, ensuring compatibility. Configurations are declarative (describe desired state, apply idempotently), making them safe for repeated runs and easy to customize. Numerous repositories explicitly target free tier maximization, provisioning interdependent resources (compartments, VCNs, subnets, security, instances, volumes) in one apply.

Evidence from community repositories shows these are functional and often recently maintained:
- Repos like RhubarbSin's explicitly aim for "maximal" deployment, including customizations (e.g., disabling SELinux/AppArmor via cloud-init) and cleanup instructions.
- HeyHamjoe's includes practical notes on capacity workarounds (e.g., temporarily disabling Arm if unavailable).
- Combinations with Ansible (e.g., bestrocker221) allow post-provisioning tasks like software installation.

No single Terraform config covers every free resource (e.g., Autonomous Databases, NoSQL, HeatWave, load balancers, vault secrets), as many users provision those manually or via separate modules. However, extending a compute-focused config is straightforward using Oracle's provider docs.

#### Python and Bash Scripts: Imperative Alternatives
For those preferring scripts:
- Python SDK-based tools excel at looping retries for instance creation, with features like notifications (email/Discord/Telegram).
- Examples automate max-shape Arm (VM.Standard.A1.Flex) or AMD (VM.Standard.E2.1.Micro) launches, SSH key setup, and configurable parameters (image, boot size).
- Bash equivalents use OCI CLI for similar retry logic.

These are narrower—mostly compute-focused—and require manual sequencing for multi-resource setups. They suit quick instance claiming but not full-stack bootstrapping.

#### Ansible: Viable but Underutilized
Oracle provides an official Ansible collection with modules for OCI services. Sample playbooks demonstrate provisioning individual free resources (e.g., launching an Always Free compute instance with temporary SSH keys). Blogs and older posts show Ansible for home labs or specific tasks on free tier.

However, no prominent comprehensive playbooks exist for maximizing multiple resources in one run. Ansible shines more for configuration management (post-provisioning) than initial infra bootstrap, which is why it's often paired with Terraform.

#### Gaps and Custom Development Considerations
While no tool automates *every* free resource (e.g., monitoring limits, notifications, email delivery) in one package, the Terraform options get closest to "maximum bang" with minimal effort. Curated lists highlight specialized projects (e.g., Kubernetes clusters, VPN setups) but reinforce Terraform's dominance.

If existing don't fit perfectly:
- Fork a Terraform repo and add modules for databases/load balancers.
- This leverages community work while avoiding scratch development in any language.

Overall, evidence strongly favors adapting an existing Terraform configuration over building custom Python, Bash, or Ansible from scratch—saving time while achieving reliable, reproducible results.

**Key Citations**
- RhubarbSin/terraform-oci-free-compute-maximal-example: https://github.com/RhubarbSin/terraform-oci-free-compute-maximal-example
- HeyHamjoe/oci-always-free-terraform: https://github.com/HeyHamjoe/oci-always-free-terraform
- bestrocker221/oracle-cloud-terraform: https://github.com/bestrocker221/oracle-cloud-terraform
- mohankumarpaluru/oracle-freetier-instance-creation: https://github.com/mohankumarpaluru/oracle-freetier-instance-creation
- neitsab/awesome-oracle-cloud-free-tier: https://github.com/neitsab/awesome-oracle-cloud-free-tier
- Oracle Ansible Samples (Always Free Compute): https://docs.oracle.com/en-us/iaas/Content/API/SDKDocs/ansiblesamples.htm
