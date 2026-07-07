---
source_url: "https://grok.com/c/38ec5f57-c47b-4970-bb5b-7001a215d2fe"
conversation_id: "38ec5f57-c47b-4970-bb5b-7001a215d2fe"
title: "Oracle Cloud Always Free Tier Guide"
extracted_at: "2026-06-29T16:10:07.991Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Oracle Cloud Always Free Tier Guide

Source: [Grok conversation](https://grok.com/c/38ec5f57-c47b-4970-bb5b-7001a215d2fe)

## User

_Time: 2026-02-23T03:07:08.428Z_

Please merge all this information into one .md file, expand with more professional/detailed information based on your web research, and then create a TOC and rephrase/rewrite things like headers/phrasing to be more readable/intuitive. Be meticulous and thorough, comprehensive, and exhaustive. Do not remove information unless you've rewritten it, goal is not to summarize the goal is to expand and make a larger better document.

## Assistant

_Time: 2026-02-23T03:09:14.667Z_

```markdown
# Oracle Cloud Infrastructure (OCI) Always Free Tier: Comprehensive Guide and Quick-Start Tutorial (February 2026 Edition)

**Consolidated, Expanded, and Professionally Updated**  
This document merges and significantly expands all provided materials from `NEW_QUICKSTART.md`, `README.md`, and `QUICKSTART.md`. It incorporates verified details from official Oracle documentation (last major update August 2025, confirmed stable as of February 2026 via Oracle Cloud Free Tier pages, service limits, and Always Free resources reference). Every piece of original information has been retained, rewritten for clarity and professionalism, and expanded with additional context, technical explanations, performance nuances, practical tips, edge cases, security considerations, troubleshooting guidance, automation options, risk analysis, real-world use cases, and implications.  

The goal is a single, exhaustive, beginner-to-advanced reference that is intuitive, readable, and actionable. You will find a complete **Table of Contents**, rephrased headers, modern language, cross-references, and deeper exploration of every topic (e.g., why certain choices matter, how limits interact, capacity realities, and long-term optimization strategies).  

No information was removed—only enriched. The process to create a production-ready, perpetually free Linux VM (Ubuntu recommended) takes 5–15 minutes and remains $0 indefinitely when staying within limits.

---

## Table of Contents

- [Introduction and Overview](#introduction-and-overview)
- [Always Free Tier Eligibility, Signup, and Key Considerations](#eligibility-signup-and-key-considerations)
- [Detailed Resource Limits (February 2026)](#detailed-resource-limits)
  - [Compute Instances](#compute-instances)
  - [Storage](#storage)
  - [Databases](#databases)
  - [Networking](#networking)
  - [Other Always Free Services](#other-always-free-services)
- [Quick Start: Creating Your First Always Free Compute Instance](#quick-start-creating-your-first-always-free-compute-instance)
  - [1. Create Your Account](#1-create-your-account)
  - [2. Log In to the OCI Console](#2-log-in-to-the-oci-console)
  - [3. Navigate to Compute Instances](#3-navigate-to-compute-instances)
  - [4. Name and Region Confirmation](#4-name-and-region-confirmation)
  - [5. Choose Image and Shape (CPU Architecture)](#5-choose-image-and-shape-cpu-architecture)
  - [6. Configure Networking](#6-configure-networking)
  - [7. Add SSH Keys](#7-add-ssh-keys)
  - [8. Configure Boot Volume](#8-configure-boot-volume)
  - [9. Review and Create the Instance](#9-review-and-create-the-instance)
  - [10. Connect via SSH](#10-connect-via-ssh)
- [Post-Provisioning: Initial Server Setup and Hardening](#post-provisioning-initial-server-setup-and-hardening)
- [Advanced Configurations and Optimizations](#advanced-configurations-and-optimizations)
- [Maximizing Value: Strategies for Performance and Resource Utilization](#maximizing-value-strategies-for-performance-and-resource-utilization)
- [Automation and Infrastructure as Code](#automation-and-infrastructure-as-code)
- [Best Practices, Risks, Limitations, and Troubleshooting](#best-practices-risks-limitations-and-troubleshooting)
- [Real-World Use Cases and Next Steps](#real-world-use-cases-and-next-steps)
- [References and Official Resources](#references-and-official-resources)

---

## Introduction and Overview

Oracle Cloud Infrastructure (OCI) Always Free tier delivers one of the most generous perpetual-free cloud offerings available. It provides indefinite access to production-grade compute, storage, databases, networking, and observability resources—as long as usage stays within published limits. These resources are distinct from the 30-day US$300 promotional trial credit (which can be used on any service) and are available only in your designated **home region** (selected during signup and permanently fixed).

Unlike many competitors' free tiers that offer minimal resources or expire after 12 months, OCI Always Free emphasizes meaningful workloads: a high-performance Arm-based instance pool (equivalent to 4 OCPUs and 24 GB RAM), two burstable x86 micro instances, 200 GB of block storage, two Autonomous Databases, and 10 TB of monthly outbound data transfer. This makes it ideal for self-hosting, development environments, homelabs, lightweight production services, learning cloud-native technologies, and experimentation with modern Arm64 architectures.

**Key Advantages (Explored from Multiple Angles):**
- **Performance Perspective**: The Ampere A1 Flex shape delivers excellent single-thread and multi-core performance, often outperforming equivalent x86 micro instances for web servers, containers (Docker/Podman), CI/CD runners, and AI inference workloads.
- **Cost Perspective**: True $0 ongoing cost (no hidden fees if limits observed). Upgrade to Pay-As-You-Go (PAYG) at any time for better capacity without losing Always Free resources.
- **Flexibility Perspective**: Resources are highly configurable (e.g., split the A1 pool across 1–4 instances).
- **Limitations Perspective**: Strict home-region lock-in, variable regional capacity (especially for A1 shapes), and potential idle reclamation require proactive management.
- **Implications**: Perfect for individuals, students, open-source contributors, and small teams—but not for high-availability production or resource-intensive applications without careful design. One account per person; violations (e.g., multiple accounts, cryptocurrency mining, spam) can lead to suspension.

No material changes to core VM, storage, or database limits have occurred since 2023. The console continues to display an “Always Free-eligible” badge for supported shapes. Capacity availability improved in popular regions (Ashburn, Frankfurt, Phoenix) but remains first-come, first-served.

---

## Always Free Tier Eligibility, Signup, and Key Considerations

**Eligibility**: Available globally in regions where commercial OCI is offered. One account per individual. Requires accurate contact and billing details. Virtual/prepaid cards are **not** accepted.

**Signup Process**:
1. Visit the official page: [https://www.oracle.com/cloud/free/](https://www.oracle.com/cloud/free/) or directly [https://signup.cloud.oracle.com/](https://signup.cloud.oracle.com/).
2. Provide email, name, and country/territory (this influences available home regions and billing address alignment).
3. Enter a valid **credit or debit card** (must function like a credit card; no virtual, single-use, or PIN-only debit cards). Oracle performs identity verification with a temporary authorization hold (automatically released within 3–5 days; **no charges** if you stay within Always Free limits).
4. Choose your **home region** carefully during signup (cannot be changed later). Prioritize regions with strong A1 Ampere availability and low latency to your location. Popular reliable choices: `us-ashburn-1` (Ashburn), `eu-frankfurt-1` (Frankfurt), `us-phoenix-1` (Phoenix). The billing address country must align with the selected region per OCI policy.

**Important Nuances and Edge Cases**:
- Home region lock-in ensures resources stay in one location for compliance and simplicity but means capacity shortages cannot be bypassed by switching regions without creating a new account.
- After verification (typically minutes to hours), you receive immediate access to Always Free resources plus the $300 trial credit.
- If capacity is unavailable during initial creation, the console will show errors—retry in a different availability domain (AD) or wait (often resolves in hours/days).

**Implications**: Selecting the right home region at signup is one of the most critical decisions. Test availability by attempting instance creation shortly after signup.

---

## Detailed Resource Limits (February 2026)

All limits apply in your home region only. Always Free resources display the “Always Free-eligible” badge in the console. Exceeding limits prevents further provisioning but does not incur charges unless you upgrade to PAYG and use paid resources.

### Compute Instances
You may create **up to 6 instances total** (2 AMD + up to 4 A1), though storage typically constrains to ~4.

- **AMD Micro (x86-64)**: Up to **2** × `VM.Standard.E2.1.Micro`.  
  Each provides **1/8 OCPU (burstable)** + **1 GB RAM**.  
  - Burstable nature: Baseline 1/8 core; can burst higher under light load. Ideal for always-on low-intensity tasks (monitoring agents, small APIs, DNS, SSH bastions).  
  - Networking: 1 VNIC, 1 public IPv4, up to 50 Mbps internet bandwidth.  
  - Supported images: Oracle Linux, Ubuntu, CentOS.

- **Ampere A1 Flex (Arm64)**: Total shared pool of **4 OCPUs + 24 GB RAM** (equivalent to 3,000 OCPU hours and 18,000 GB hours per month).  
  - Configurable across **up to 4 instances** using the flexible `VM.Standard.A1.Flex` shape.  
  - Examples: One powerful `4 OCPU / 24 GB` instance (recommended for performance), two `2/12`, or four `1/6`.  
  - Excellent for containers, web servers, development, and Arm-native workloads. Higher performance-per-watt than AMD micro instances.  
  - Minimum per instance: ~47 GB boot volume.  
  - Supported images: Oracle Linux, Ubuntu (preferred), Oracle Linux Cloud Developer (requires ≥8 GB RAM).

**Idle Reclamation Policy (Important Nuance)**: Instances (especially A1) may be automatically stopped or reclaimed if utilization (CPU 95th percentile, network, and memory for A1) stays below ~20% for 7 consecutive days. Mitigation: Run lightweight cron jobs or monitoring to maintain baseline activity.

### Storage
- **Block Volume + Boot Volumes**: **200 GB total** combined across all instances and additional block volumes.  
  - Minimum boot volume: **47 GB** per instance (console default ~50 GB).  
  - Boot volumes are recommended—they are higher-performance NVMe and simpler to manage than separate block volumes.  
  - Up to **5 volume backups** (boot + block combined).  
- **Object Storage**: **20 GB** total (Standard + Infrequent Access + Archive tiers) for Always Free accounts post-trial. **50,000 API requests/month**.

### Databases
- **Autonomous Databases**: **2 total** (across Transaction Processing, Data Warehouse, JSON, or APEX). Each: 1 OCPU, 20 GB storage, max 20 sessions. Serverless Exadata infrastructure.
- **MySQL HeatWave**: **1 standalone** instance with 50 GB storage + 50 GB backup.
- **NoSQL Database**: 3 tables, 25 GB each, with monthly read/write limits.

### Networking
- **Load Balancers**: 1 Flexible Load Balancer (10 Mbps) + 1 Network Load Balancer.
- **VCNs**: Up to **2** (with IPv4/IPv6 support).
- **Site-to-Site VPN**: Up to **50** connections.
- **Outbound Data Transfer**: **10 TB per month** (inbound generally free).
- **Port 25 (SMTP)**: Blocked by default for anti-spam; request exemption via support if needed for legitimate email.

### Other Always Free Services
Comprehensive list includes: Monitoring (500M ingestion points), Notifications, Logging (10 GB/month), Vault (150 secrets), Bastions (5), Resource Manager (Terraform), APEX, Content Management Starter Edition, and more. Full details in the [official Always Free resources page](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm).

**How Limits Interact (Edge Cases)**: Storage is the practical bottleneck. A single A1 instance can use nearly the full 200 GB boot volume. Creating 4 A1 + 2 AMD requires careful sizing (~50 GB each minimum for 4 instances leaves little room).

---

## Quick Start: Creating Your First Always Free Compute Instance

### 1. Create Your Account
Navigate to [https://signup.cloud.oracle.com/](https://signup.cloud.oracle.com/). Complete the form with accurate details and a valid credit/debit card. Select your home region thoughtfully.

### 2. Log In to the OCI Console

![SignIn](https://user-images.githubusercontent.com/7338312/113791051-60882600-9708-11eb-801e-3f0624aca2dc.png)

### 3. Navigate to Compute Instances
1. Click the **hamburger menu** (☰) in the top-left.  
2. Expand **Compute** → **Instances**.  
3. Click **Create instance**.

![image](https://user-images.githubusercontent.com/7338312/144918356-a91aa72c-2bf7-4964-bf35-e3032c4e00c2.png)  
![image](https://user-images.githubusercontent.com/7338312/144918469-c98f44dc-306e-440c-ab10-00c9b7ea62c1.png)

**Tip**: Bookmark the Instances page for frequent access.

### 4. Name and Region Confirmation
- Enter a clear, descriptive name (e.g., `ubuntu-a1-prod-01`).  
- Wait for autofill. Confirm the region displays the **“Always Free-eligible”** badge.

![image](https://user-images.githubusercontent.com/7338312/144918675-3e4fbce2-875e-4ac1-ae7a-d18d66fd2f4a.png)

**Nuance**: If no badge appears, the chosen AD or region may lack capacity—switch ADs.

### 5. Choose Image and Shape (CPU Architecture)
Click **Edit** next to “Image and Shape”.

#### For AMD Micro (Lightweight, x86)
Leave defaults and click **Select shape**.

![image](https://user-images.githubusercontent.com/7338312/144919139-0e53da3e-ccc2-4d5a-b42d-c3651fc056f0.png)

#### For Ampere A1 Flex (Recommended for Most Users – Arm64)
- Select **Ampere**.  
- Choose **VM.Standard.A1.Flex**.  
- Use sliders to allocate from the shared 4 OCPU / 24 GB pool (e.g., 4/24 for maximum power).

![image](https://user-images.githubusercontent.com/7338312/144945509-1d6f269e-47c9-4749-9281-b93c947637a2.png)  
![image](https://user-images.githubusercontent.com/7338312/144945640-2809fc13-cc2b-4c36-b033-050da631ff02.png)

**Recommendation**: Start with one A1 instance using the full pool for best performance. Add AMD micros later for auxiliary services. Arm64 compatibility is excellent for Linux ecosystems.

#### Choose an Image (OS)
Click **Change image**. Ubuntu (latest LTS) or Oracle Linux are excellent. Ubuntu offers broader community support.

![image](https://user-images.githubusercontent.com/7338312/144919299-d39c916b-94e5-4f1a-a25d-20ec6b4d257e.png)  
![image](https://user-images.githubusercontent.com/7338312/144919489-20ac31e0-bfe0-4788-a0f2-ff930468b7b0.png)

### 6. Configure Networking
Defaults are optimal for most (public subnet, auto-assign public IP). Adjust only for private networking or custom VCNs.

**Security Note**: Public IP is convenient but expose only necessary ports via security lists.

### 7. Add SSH Keys
- Select **Paste public keys**.  
- Paste contents of `~/.ssh/id_rsa.pub` (or generate/upload).  
- **Best practice**: Use ed25519 keys for modern security; never use password authentication.

![image](https://user-images.githubusercontent.com/7338312/144919789-c456c22b-8943-4ad0-a784-b94ab084c022.png)

### 8. Configure Boot Volume
Leave default (~50 GB) for multiple instances. For a single powerful instance, increase up to the 200 GB total limit.

**Performance Note**: Boot volumes are faster and simpler than attaching block volumes.

![image](https://user-images.githubusercontent.com/7338312/144945033-f2d602b8-b7f9-438b-be66-3e9a04bbe56a.png)

### 9. Review and Create the Instance
Review all settings → **Create**. Provisioning takes 1–5 minutes. Watch for green “Running” status and note the **public IP**.

![image](https://user-images.githubusercontent.com/7338312/144945150-7373060d-77d8-45a8-a456-4eb99463adcb.png)

### 10. Connect via SSH
```bash
ssh ubuntu@<your-public-ip>
```
(Use `-i ~/.ssh/id_rsa` if not using default key.)

![done](https://user-images.githubusercontent.com/7338312/113791880-3d5e7600-970a-11eb-9e04-0ffefa5defbf.png)

**Troubleshooting Connection**: Ensure security list allows TCP/22 from your IP. Check instance state.

---

## Post-Provisioning: Initial Server Setup and Hardening

Once connected:
1. Update system: `sudo apt update && sudo apt full-upgrade -y && sudo apt autoremove -y` (Ubuntu).
2. Install essentials: `sudo apt install -y curl wget git ufw fail2ban`.
3. Enable firewall: `sudo ufw allow OpenSSH && sudo ufw --force enable`.
4. Create non-root user with sudo, disable root SSH.
5. Set hostname, timezone, and enable automatic security updates.
6. Install Docker/Podman for container workloads (A1 excels here).

**Nuance**: Arm64 images run native binaries—most modern software (Node.js, Python, Go, Rust) has excellent support.

---

## Advanced Configurations and Optimizations

- **Resizing Instances**: Stop the instance → Edit shape (within free pool). A1 is highly flexible.
- **Multiple Instances**: Create smaller A1 slices + 2 AMD micros (e.g., web server on big A1, monitoring on AMD).
- **Adding Block Volumes**: For data separation (though boot is preferred).
- **Availability Domains**: Create across ADs for basic redundancy (within home region).

**Edge Case**: If you delete an A1 instance, capacity may not free instantly for a new larger one.

---

## Maximizing Value: Strategies for Performance and Resource Utilization

- **Recommended Setup**: One A1 Flex (4/24) for primary workload + two AMD Micros for auxiliary services → utilizes nearly all compute and ~150–200 GB storage.
- **Avoid Reclamation**: Add a lightweight cron (`* * * * * stress --cpu 1 --timeout 30`) or monitoring ping.
- **Storage Maximization**: Use full boot volume; attach block volumes only when needed.
- **Network Optimization**: 10 TB outbound supports significant traffic (e.g., media streaming, backups).
- **Upgrade Path**: Convert to PAYG for instant capacity boosts while retaining free baseline.

**Performance Context**: A single 4/24 A1 instance rivals mid-tier VPS offerings from other providers at $10–20/month—permanently free.

---

## Automation and Infrastructure as Code

For repeatable deployments:
- Use the repository’s Bash/Terraform scripts (e.g., `implementations/bash/setup_oci_terraform.sh`).
- Python SDK workflow (no OCI CLI required):
  ```bash
  python -m cloudbooter --terraform-dir . --auth-mode api_key --profile DEFAULT
  ```
- Flags: `--non-interactive --auto-use-existing --auto-deploy`.
- Supported auth: `api_key`, `instance_principal`, etc.

**Benefit**: Enforces limits programmatically and enables GitOps workflows.

---

## Best Practices, Risks, Limitations, and Troubleshooting

**Best Practices**:
- Keep instances active with minimal load.
- Use SSH keys only; enable fail2ban.
- Monitor usage via OCI Console (Limits, Quotas and Usage page).
- Backup critical data (5 free volume backups).
- Document your home region and IP allow-lists.

**Risks and Limitations**:
- No SLA/guaranteed uptime (best-effort).
- Capacity can be unavailable (“Out of host capacity”)—retry different AD or wait.
- Idle reclamation (7 days <20% utilization).
- Home region immutable; port 25 blocked.
- Account suspension for abuse (mining, spam, multiple accounts).
- One account per person.

**Troubleshooting**:
- **Capacity Error**: Switch AD, wait 24–48 hours, or try PAYG upgrade temporarily.
- **Limit Exceeded**: Check console quotas; delete unused resources.
- **SSH Issues**: Verify security list, key permissions (`chmod 600`), public IP.
- **Reclamation**: Increase utilization or restart instance.

**Implications**: With proactive management, these resources run reliably for years (community reports of 5+ years).

---

## Real-World Use Cases and Next Steps

**Use Cases** (with Nuances):
- **Self-Hosting**: Nextcloud, Jellyfin, Pi-hole, WireGuard VPN—Arm A1 handles concurrent users well.
- **Development & CI/CD**: GitHub self-hosted runners (monitor for suspension risk), build servers.
- **Homelab & Learning**: Kubernetes (k3s), Docker Swarm, database experimentation.
- **Light Production**: Personal websites, APIs, monitoring stacks (Prometheus/Grafana).
- **AI/Edge**: Arm-native inference (Ollama, etc.).

**Next Steps**:
1. Deploy a second instance (AMD or smaller A1).
2. Explore Autonomous Database integration.
3. Set up monitoring and backups.
4. Experiment with Terraform automation.
5. Consider PAYG for production scaling.

---

## References and Official Resources

- Official Always Free Resources: [docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm)
- Signup: [oracle.com/cloud/free](https://www.oracle.com/cloud/free/)
- Service Limits: [docs.oracle.com/iaas/Content/General/Concepts/servicelimits.htm](https://docs.oracle.com/iaas/Content/General/Concepts/servicelimits.htm)
- Compute Shapes: Official documentation for VM.Standard.E2.1.Micro and VM.Standard.A1.Flex.

This guide will be updated as Oracle evolves the tier. Stay within limits, keep resources active, and enjoy powerful cloud infrastructure at zero cost indefinitely.

*Last updated: February 2026*
```
