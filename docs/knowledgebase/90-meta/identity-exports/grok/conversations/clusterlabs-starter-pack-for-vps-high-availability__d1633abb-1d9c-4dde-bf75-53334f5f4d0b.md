---
source_url: "https://grok.com/c/d1633abb-1d9c-4dde-bf75-53334f5f4d0b"
conversation_id: "d1633abb-1d9c-4dde-bf75-53334f5f4d0b"
title: "Clusterlabs Starter Pack for VPS High Availability"
extracted_at: "2026-06-29T16:12:40.602Z"
message_count: 3
export_suite: "identity"
provenance: grok-rest-api
---

# Clusterlabs Starter Pack for VPS High Availability

Source: [Grok conversation](https://grok.com/c/d1633abb-1d9c-4dde-bf75-53334f5f4d0b)

## User

_Time: 2026-01-13T03:45:20.446Z_

most robust, comprehensive, and complete starter pack that's implemented/setup using https://clusterlabs.org/projects/ and allows me to ha all of my stateful services across vairous nodes, and load balacne between them. Search far and wide. Looking for a complete solution that's ready to go and I can modify further if I so choose. Ideally I'd like to use this on multiple VPS's that I own, which are all connected to each other over tailscale.

## Assistant

_Time: 2026-01-13T03:47:51.757Z_

**Key Points**  
- No single "plug-and-play" starter pack exists for fully load-balanced, stateful services across arbitrary applications using the Clusterlabs stack (Pacemaker + Corosync), as configurations vary by service (e.g., databases often need active/passive or multi-master replication, while file shares can use active/active with replicated storage).  
- The most robust, comprehensive approach is the official **linux-system-roles/ha_cluster** Ansible role, which automates Pacemaker/Corosync setup, supports unicast transports suitable for Tailscale, and allows defining custom resources/constraints for stateful services and load balancers like HAProxy. It is maintained, supports modern features (knet transport preferred), and is adaptable for multiple VPS.  
- For Tailscale, configure Corosync with knet or udpu transport using Tailscale IPs as node addresses — this works despite latency sensitivity, as community reports (e.g., Proxmox clusters) confirm feasibility.  
- Stateful services typically use DRBD for real-time replication + Pacemaker promotable clones (active/passive or active/active with GFS2). Load balancing is best for stateless frontends (e.g., HAProxy managing traffic to clustered backends) or active/active setups.  
- Fencing (STONITH) is essential to prevent split-brain but challenging on diverse VPS; use cloud-specific agents if possible, or qdevice for quorum in odd-numbered clusters.  

**Recommended Approach**  
Use Ansible to deploy the linux-system-roles/ha_cluster role:  
- Install Ansible and the role (`ansible-galaxy install linux-system-roles.ha_cluster`).  
- Define inventory with Tailscale IPs as corosync_addresses.  
- Set variables for cluster name, nodes, transport (knet), resources (e.g., DRBD primitives, HAProxy + VIP), and constraints.  
- Run playbook on all nodes for automated setup.  

Extend for stateful services by adding DRBD (install separately) and defining OCF primitives in role vars. For load balancing, create resources for a floating VIP (IPaddr2) and HAProxy.  

**Tailscale Considerations**  
Tailscale's mesh provides reliable UDP connectivity; set Corosync to knet (recommended for development) or udpu, specifying Tailscale IPs. Test latency — Corosync is sensitive, but works for small clusters.  

**Stateful and Load Balancing Tips**  
- **Stateful**: Replicate block storage with DRBD, promote via Pacemaker clones.  
- **Load Balancing**: Use HAProxy behind a Pacemaker-managed VIP for traffic distribution.  
- Start simple (2-3 nodes), add qdevice for even-node quorum.  

**Resources**  
- linux-system-roles/ha_cluster GitHub: https://github.com/linux-system-roles/ha_cluster  
- Clusterlabs "Clusters from Scratch" guide: https://clusterlabs.org/projects/pacemaker/doc/2.1/Clusters_from_Scratch/singlehtml/  
- OndrejHome Ansible alternative (broader OS): https://github.com/OndrejHome/ansible.ha-cluster-pacemaker  

---

The Clusterlabs stack — primarily Pacemaker (resource manager) and Corosync (membership/messaging layer), configured via pcs — provides a powerful framework for high-availability clusters. It excels at managing failover, fencing for data integrity, and constraints for resource placement. However, building a complete solution for stateful services with load balancing requires integrating additional tools like DRBD for replication and HAProxy for balancing, as the stack itself focuses on orchestration rather than application-specific logic.

**Why linux-system-roles/ha_cluster Stands Out**  
This Ansible role automates the entire cluster lifecycle, including package installation, key distribution, Corosync configuration (including knet/udpu transport, compression, crypto), quorum options (qdevice support), STONITH, resources, constraints, ACLs, and alerts. It is more structured and maintained than ad-hoc scripts or basic pcs guides, making it ideal as a modifiable starter pack for multiple VPS.  

Key features:  
- Supports RHEL 8.3+, Fedora, SUSE HA.  
- Multi-link/redundant rings.  
- Customizable via vars (e.g., ha_cluster_transport: type 'knet', links with Tailscale IPs).  
- Resource definition (primitives/groups/clones/promotables) for stateful setups.  
- Node-specific options (pcs/corrosync addresses via Tailscale IPs).  

Alternative: OndrejHome/ansible.ha-cluster-pacemaker offers broader OS support (including Debian/Ubuntu, Fedora) and detailed STONITH (AWS, VMware, etc.), plus RRP/knet. It is highly customizable but slightly less focused on advanced quorum/crypto.

**Tailscale Integration**  
Corosync defaults to multicast but supports unicast (udpu) or knet (modern, recommended). For Tailscale:  
- Use Tailscale IPs as corosync_addresses in role vars or pcs setup.  
- Example knet config: multiple links for redundancy.  
- Community experience (e.g., Proxmox over Tailscale) confirms viability, though latency >50ms may cause issues — monitor with corosync-cfgtool.  
- Firewall: Open UDP 5404-5405 (Corosync), TCP 2224 (pcsd).  

**Handling Stateful Services**  
Stateful services require replicated storage and careful failover:  
- Use DRBD (open-source block replication) for real-time mirroring.  
- Configure as promotable clones in Pacemaker (primary/secondary promotion).  
- For active/active: Use GFS2 clustered filesystem on top of DRBD (two-primaries).  
- Examples: HA NFS (DRBD + nfsserver/exportfs resources), PostgreSQL (with DRBD + filesystem), or custom OCF agents.  

Pacemaker ensures only the primary mounts/starts services; constraints enforce ordering/colocation.  

**Load Balancing Integration**  
- Manage a floating VIP (ocf:heartbeat:IPaddr2) and HAProxy (systemd:haproxy) as resources.  
- Co-locate VIP + HAProxy.  
- HAProxy distributes to backend nodes (if active/active) or single primary (active/passive).  
- For stateful backends, load balancing is limited unless services support multi-master (e.g., Galera MySQL).  

**Example Resource Configuration Table (via Ansible vars or pcs)**  

| Resource Type       | Example Agent                  | Purpose                          | Stateful/Load Balancing Fit                  | Notes                                      |
|---------------------|--------------------------------|----------------------------------|----------------------------------------------|--------------------------------------------|
| Virtual IP         | ocf:heartbeat:IPaddr2         | Floating IP for access           | Load balancing entry point                   | Colocate with load balancer                |
| HAProxy            | systemd:haproxy               | Traffic distribution             | Load balancing                               | Config file edited separately              |
| DRBD               | ocf:linbit:drbd               | Block replication                | Stateful storage replication                 | Promotable clone                           |
| Filesystem         | ocf:heartbeat:Filesystem      | Mount replicated volume          | Stateful (e.g., /var/lib/app)                | Colocate with DRBD primary                 |
| Service (e.g., DB) | systemd:postgresql or OCF     | Application start/monitor        | Stateful                                     | Order after filesystem                     |
| NFS Server/Export  | ocf:heartbeat:nfsserver/exportfs | Shared exports                | Stateful file sharing                        | Active/passive with VIP                    |

**Setup Outline (Manual Adaptation from Clusters from Scratch)**  
1. Prepare VPS: Static Tailscale IPs, hostname resolution, firewall ports.  
2. Install packages (pacemaker, corosync, pcs, fence-agents).  
3. Set hacluster password, auth nodes.  
4. pcs cluster setup --transport knet ... (with Tailscale IPs).  
5. Add resources/constraints.  
6. Enable fencing (if possible) or use qdevice.  
7. Test failover.  

**Challenges and Best Practices**  
- **Fencing**: Critical for stateful; use cloud fencing (AWS/Azure) or IPMI if available. Disable only for testing.  
- **Quorum**: Odd nodes or qdevice.  
- **Latency**: Monitor Corosync; knet handles better.  
- **Testing**: Start with stateless (VIP + Apache), add stateful (DRBD + filesystem).  

This framework is production-proven in enterprises (Red Hat/SUSE HA) and adaptable to your VPS setup.

**Key Citations**  
- https://github.com/linux-system-roles/ha_cluster  
- https://clusterlabs.org/projects/pacemaker/doc/2.1/Clusters_from_Scratch/singlehtml/  
- https://github.com/OndrejHome/ansible.ha-cluster-pacemaker  
- https://linbit.com/blog/highly-available-nfs-targets-with-drbd-pacemaker/  
- https://faun.pub/how-to-setup-highly-available-pacemaker-corosync-cluster-with-haproxy-load-balancer-d64873d8df62  
- https://www.reddit.com/r/Proxmox/comments/1k2ftby/creating_cluster_thru_tailscale/

## Assistant

_Time: 2026-01-13T03:47:51.783Z_

### Key Recommendations
- The most robust and comprehensive starter pack from ClusterLabs is the official **Clusters from Scratch** guide, which provides a complete, step-by-step setup for a high-availability cluster using Pacemaker, Corosync, and related tools.
- It includes built-in support for stateful services via DRBD replication and GFS2 clustered filesystem, starting with active/passive and extending to active/active configurations.
- This setup is highly modifiable: add nodes, resources, or constraints as needed, and it works well on VPS environments.
- Complement it with **Pacemaker Explained** for advanced features like promotable clones (ideal for databases) and load balancing via resource cloning or placement strategies.
- For automation and multi-node scaling, consider Ansible roles to deploy the base cluster quickly.

### Overview of the Solution
The ClusterLabs stack (Pacemaker as resource manager, Corosync for messaging) is the gold standard for open-source Linux HA clustering. The **Clusters from Scratch** guide builds a fully functional 2-node cluster on AlmaLinux 9, including replicated storage (DRBD) and shared filesystem (GFS2 with DLM locking), making it suitable for stateful services like file servers or applications needing shared data. It includes fencing (STONITH) for reliability, virtual IPs, and basic web serving—everything needed to get started and expand.

This is more complete than basic tutorials (e.g., simple VIP + Apache) because it directly addresses stateful replication out of the box.

### Handling Stateful Services
The guide uses DRBD for block-level replication and GFS2 for active/active shared access, allowing multiple nodes to read/write the same data simultaneously without corruption. This is ideal for services like NFS, shared application storage, or any filesystem-based state.

For database-like stateful services (e.g., PostgreSQL or MySQL), use promotable (multi-state) clones as detailed in Pacemaker Explained. These allow one primary (writable) instance and multiple replicas (read-only), with automatic promotion on failover.

### Load Balancing
The base guide supports active/active by cloning resources (e.g., web servers on shared GFS2 storage). For broader load balancing:
- Clone non-stateful resources across nodes.
- Manage a load balancer like HAProxy as a cloned resource.
- Use Pacemaker's placement strategies (e.g., utilization-based or balanced) to distribute load.

Separate guides exist for highly available HAProxy setups, which can front-end your stateful services.

### Considerations for VPS and Tailscale
Since your VPS nodes connect via Tailscale (a secure mesh VPN), treat them as a private network:
- Use Tailscale IPs in Corosync configuration (modern versions default to knet transport, which supports unicast reliably over WAN-like links).
- Ensure firewall rules allow Corosync ports (typically UDP 5404-5412).
- Latency should be low via Tailscale's WireGuard; test sync performance for DRBD.
- Fencing (STONITH) is crucial for data integrity—configure provider-specific agents if available, or external methods.

This setup scales to multiple nodes by adding them via `pcs cluster node add` and adjusting quorum.

### Extension Options
- **Automation**: Use Ansible roles (e.g., mrlesmithjr/ansible-pacemaker) for repeatable deployment across your VPS fleet.
- **Specific Services**: For NFS, follow LINBIT's DRBD + Pacemaker guides; for databases, use dedicated agents like PostgreSQL Automatic Failover (PAF).

---

### Comprehensive Overview of ClusterLabs HA Solutions

The ClusterLabs projects—primarily Pacemaker (cluster resource manager) and Corosync (messaging layer)—form the foundation of most modern Linux high-availability clusters. These tools are mature, widely used in enterprise (e.g., basis for Red Hat's HA Add-On), and highly flexible for custom setups. Your requirement for a robust, complete starter pack that handles stateful services, load balancing, and runs on distributed VPS nodes connected via Tailscale aligns perfectly with this stack.

#### Core Starter Pack: Clusters from Scratch
This official guide is the most authoritative and complete entry point. It walks through building a production-ready cluster on AlmaLinux 9, covering installation, configuration, testing, and extension to active/active.

| Component              | Purpose                              | Configuration Highlights |
|------------------------|--------------------------------------|--------------------------|
| Corosync              | Cluster membership and messaging    | Unicast/knet support ideal for cloud/VPS |
| Pacemaker             | Resource management and failover    | Uses `pcs` CLI for easy setup |
| DRBD                  | Block-level data replication        | Dual-primary capable for active/active |
| DLM                   | Distributed lock manager            | Required for clustered filesystems |
| GFS2                  | Clustered filesystem                | Allows simultaneous multi-node access |
| Virtual IP            | Floating address for services       | OCF resource agent |
| Apache/WebServer      | Example application                 | Can be cloned for load sharing |
| STONITH/Fencing       | Node isolation on failure           | Prevents data corruption |

The guide starts with a 2-node active/passive setup (using DRBD in primary/secondary mode) and explicitly shows how to convert to active/active:
- Enable multi-primary in DRBD.
- Format with GFS2 (`mkfs.gfs2 -p lock_dlm`).
- Clone filesystem and DLM resources.
- Adjust constraints for multi-node operation.

This directly addresses stateful services by providing replicated, shared storage—more comprehensive than basic VIP-only tutorials. It's modifiable: add nodes, replace Apache with your services, or integrate custom resource agents.

#### Advanced Configurations: Pacemaker Explained
This companion document is essential for depth. It details XML-based configuration (viewable via `pcs cluster cib`) and covers:

- **Promotable Clones for Stateful Services**: Critical for databases or any read/write asymmetry.
  - One instance "promoted" (primary/writable), others unpromoted (replicas/read-only).
  - Built-in support for role-specific monitoring, migration, and failure handling.
  - Examples include MySQL/PostgreSQL with streaming replication: Pacemaker promotes the best replica on primary failure.

| Feature                  | Benefit for Stateful Services                  | Example Use Case |
|--------------------------|-----------------------------------------------|------------------|
| Promotable Clones        | Automatic primary election and failover       | PostgreSQL streaming replication |
| Role-based Constraints   | Dependents start only after promotion         | Application connects only to primary DB |
| on-fail=demote           | Graceful handling without data risk           | Avoids unnecessary fencing |
| Ticket Dependencies      | Multi-site coordination                       | Geographic failover without split-brain |

- **Load Balancing and Scaling**:
  - Anonymous clones for identical instances (e.g., web servers).
  - Globally unique clones for distinct roles.
  - Placement strategies: `minimal` (pack tightly), `balanced` (spread load), `utilization` (node capacity-aware).
  - Health attributes trigger migrations (e.g., high CPU/IO).

- **Multi-Node and Multi-Site**:
  - Supports N+1, N-to-N topologies.
  - Quorum policies (`freeze` for GFS2 safety).
  - Booth for ticket-based multi-site (geographic redundancy).

#### Integration with Tailscale and VPS Environments
Tailscale's mesh VPN makes your VPS nodes behave like a local network:
- Configure Corosync with `transport: knet` (default in recent versions) and list Tailscale IPs explicitly.
- No multicast needed—unicast works reliably over Tailscale.
- Test DRBD sync speeds; Tailscale's performance is generally excellent for this.
- Firewall: Allow relevant ports on each VPS.
- Scaling: Add nodes dynamically; adjust `expected_votes` for quorum.

Many cloud/VPS guides (e.g., DigitalOcean, Oracle) use similar unicast setups successfully.

#### Alternative and Complementary Approaches
- **Ansible Automation**: Roles like mrlesmithjr/ansible-pacemaker deploy the base cluster (up to 16 nodes), including unicast mode, resources, and constraints. Ideal for your multi-VPS setup—run once, modify variables.
- **Service-Specific**: 
  - NFS: LINBIT's 3-node DRBD + Pacemaker (active/passive with quorum node).
  - HAProxy: Clone it for active/active load balancing fronting your services.
  - Databases: PostgreSQL Automatic Failover (PAF) agent or Percona tools for MySQL.

No single repo provides a "one-click" all-services pack because HA is inherently service-specific. The ClusterLabs guides + resource agents (from https://github.com/ClusterLabs/resource-agents) give you the flexible, complete foundation to HA any stateful service while load balancing where possible.

This approach is battle-tested, open-source, and directly from the project maintainers—making it the most robust choice for your needs.

#### Key Citations
- Clusters from Scratch Guide: https://clusterlabs.org/projects/pacemaker/doc/2.1/Clusters_from_Scratch/singlehtml/
- Pacemaker Explained Reference: https://clusterlabs.org/projects/pacemaker/doc/2.1/Pacemaker_Explained/singlehtml/
- LINBIT NFS HA Guide: https://linbit.com/blog/highly-available-nfs-targets-with-drbd-pacemaker/
- HAProxy Cluster Example: https://faun.pub/how-to-setup-highly-available-pacemaker-corosync-cluster-with-haproxy-load-balancer-d64873d8df62
- Ansible Pacemaker Role: https://github.com/mrlesmithjr/ansible-pacemaker
- PostgreSQL Automatic Failover: https://clusterlabs.github.io/PAF/configuration.html
