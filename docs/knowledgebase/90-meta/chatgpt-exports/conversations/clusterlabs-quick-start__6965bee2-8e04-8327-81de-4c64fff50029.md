---
source_url: "https://chatgpt.com/c/6965bee2-8e04-8327-81de-4c64fff50029"
conversation_id: "6965bee2-8e04-8327-81de-4c64fff50029"
title: "ClusterLabs Quick Start"
extracted_at: "2026-06-29T11:04:29.725Z"
message_count: 4
provenance: auth-ui
---

# ClusterLabs Quick Start

Source: [ChatGPT conversation](https://chatgpt.com/c/6965bee2-8e04-8327-81de-4c64fff50029)

## User

ClusterLabs projects
The cluster stack
The Open Cluster Framework (OCF) is a set of standards for cluster components. Currently, only the resource agent standard is in use. A resource agent is an abstraction that provides service-level awareness to a cluster. It contains the logic for what to do when the cluster wishes to start, stop, or check the health of a particular service.

The Quite Boring Library, also called libqb, provides high-performance features for client/server applications, most importantly logging and interprocess communication.

Kronosnet, also called knet, is a network abstraction layer supporting redundancy, security, fault tolerance, and fast fail-over of network links.

Corosync is the membership and messaging layer. It tracks all hosts in a cluster, including liveness and quorum, and allows for reliable communication among hosts, with message deliverability guarantees.

Pacemaker is the cluster resource manager. It coordinates the configuration, start-up, monitoring, and recovery of interrelated services across all cluster hosts. Pacemaker supports a number of service types, including OCF resource agents and systemd unit files. Pacemaker supports advanced service configurations such as groups of dependent resources, services that should be active on multiple machines at the same time, resources that can switch between two different roles, and containerized services.

The fence-agents project provides a set of commonly used fencing agents. Fencing agents are the abstraction that allows Pacemaker to isolate badly behaving nodes, by either powering off the node or disabling its access to common resources. The fence-agents project provides fence agents for devices including intelligent power and network switches, IPMI, cloud providers, virtualization hosts, and shared storage access.

The resource-agents project provides a set of OCF resource agents for commonly used services.

High-level configuration tools
Pacemaker’s internal configuration format is XML, which is great for machines but terrible for humans.

Multiple higher-level configuration tools are available to allow the configuration to be viewed and updated in a more human-friendly format.

The crm shell is the original configuration shell for Pacemaker. Written and actively maintained by SUSE, it may be used as an interactive shell with tab completion, for single commands directly on the shell’s command line, or as a batch mode scripting tool.

The High Availability Web Konsole (Hawk) is a web-based GUI for managing and monitoring ClusterLabs clusters. The Hawk API server provides a minimalistic web server handling SSL certificates, proxying, and static file serving for Hawk.

The Linux Cluster Management Console (LCMC) is a GUI with an innovative approach for representing the status of and relationships between cluster services. It uses SSH to let you install, configure, and manage clusters from your desktop.

The Pacemaker/Corosync Configuration System (PCS) provides a command-line tool pcs and the PCS Web UI for managing the complete life cycle of multiple cluster components, including Pacemaker, Corosync, QDevice, SBD, and Booth.

Cluster add-ons
The Anvil! Intelligent Availability platform is a self-contained system based on a two-node high-availability cluster with power fencing. Striker is the current, second generation of the platform. Anvil is the upcoming, third generation of the platform. The anvil-external-deps project is collection of scripts and spec files used by the platform.

The Booth cluster ticket manager extends Pacemaker to support geographically distributed clustering. It does this by managing the granting and revoking of tickets which authorize one of the cluster sites, potentially located in geographically dispersed locations, to run specified resources.

The cluster-glue library initially provided an executor and fencer for early Pacemaker versions that did not include their own, but now mostly provides Pacemaker the ability to use fencing agents conforming to the Linux-HA interface.

The ha-cluster-exporter project provides a Prometheus exporter for monitoring ClusterLabs clusters.

The PostgreSQL Automatic Failover (PAF) project provides a featureful OCF resource agent for PostgreSQL.

SBD provides a self-fencing mechanism for cluster hosts, utilizing a watchdog device and optionally shared block storage such as a SAN, iSCSI, or FCoE.

Miscellaneous
The clusterlabs-www project provides the source for this website.

The go-pacemaker project provides Go language APIs for cluster configuration and status.

The High Laughability project is an occasionally amusing collection of anecdotes (mostly chat quotes) from ClusterLabs software development.



Are there any starter projects I can download and deploy pretty quickly that have some of the above stuff already setup?
Show more

## Assistant

Yes — there are a few “starter” or near-turnkey ways to get a ClusterLabs stack running quickly, but they’re scattered across projects and distros rather than branded as a single official “starter kit.” Below are the most practical options, ordered from fastest to get running → more realistic / production-like.

1. Anvil! / Striker (Closest to turnkey)

Best if you want something already integrated and opinionated

What it includes

Pacemaker

Corosync

Fence agents

SBD

Power fencing

Web UI (Striker)

Essentially a prebuilt 2-node HA platform

Designed for real deployments, not just demos

Pros

Minimal manual wiring

Good reference architecture

Uses real ClusterLabs components correctly

Cons

Opinionated

Heavier than a “hello world” cluster

Not ideal if you want to experiment freely

👉 Best choice if you want “download, deploy, learn by running”.

2. PCS + Pacemaker + Corosync (Fastest DIY starter)

Best balance of speed + flexibility

Most distros (RHEL, Rocky, Alma, Fedora, Debian, Ubuntu) ship a ready-to-use stack:

Pacemaker

Corosync

Fence agents

Resource agents

PCS CLI + Web UI

Typical quick-start flow
Bash
dnf install -y pacemaker corosync pcs fence-agents-all resource-agents
systemctl enable --now pcsd
pcs cluster setup mycluster node1 node2
pcs cluster start --all

Pros

Very fast to deploy (especially in VMs)

Well documented

Uses upstream ClusterLabs components

Cons

Still manual

You must understand fencing and quorum

This is the most common “starter cluster” people use in practice.

3. Vagrant / VM-based Demo Clusters

Best for learning and experimenting

There are multiple community-maintained repos that give you:

2–3 VMs

Corosync + Pacemaker

Sample OCF resources

Optional fencing (often simulated)

Typical ingredients:

Vagrant + libvirt or VirtualBox

Shell or Ansible provisioning

pcs-based configuration

Search terms that work well:

pacemaker corosync vagrant

pcs cluster demo

pacemaker lab ansible

💡 These are excellent learning environments, even if not production-ready.

4. PAF (PostgreSQL Automatic Failover)

Best example of a real, non-trivial resource

If you want something useful out of the box:

PAF gives you:

PostgreSQL

Replication

Automatic failover

Pacemaker integration

You still deploy the cluster yourself, but:

The resource logic is done

You learn how Pacemaker actually behaves

This is a great starter project for “real HA behavior”.

5. HA Labs from Vendors (Hidden Gems)

Not official ClusterLabs projects, but very solid

Vendors like:

Red Hat

SUSE

Provide:

Step-by-step HA labs

Sample clusters

Test fencing

Realistic failure scenarios

Even if distro-specific, they use upstream Pacemaker/Corosync.

Recommendation by Goal
“I want it running in under an hour”

➡ PCS + two VMs

“I want a reference architecture”

➡ Anvil! / Striker

“I want to learn Pacemaker deeply”

➡ Vagrant demo + pcs

“I want a real workload example”

➡ PAF (PostgreSQL Automatic Failover)

If you want…

If you tell me:

VM vs bare metal

Distro preference

Single service vs full platform

Learning vs production-like

…I can recommend a specific repo or deployment path and give you a minimal step-by-step starter plan.

## User

anything here for making stateful services high availability?

## Assistant

Yes — that’s actually where most of this stack really shines 👍
Pacemaker + Corosync were designed to make stateful services highly available, not just restart stateless daemons.

Below is a clear map of what already exists in ClusterLabs land for stateful HA, from “ready-made” to “build your own”.

1. PostgreSQL Automatic Failover (PAF)

Best turnkey example of stateful HA

What it gives you

PostgreSQL primary/standby

Replication management

Automatic failover

Correct ordering, fencing, and promotion logic

Built as an OCF resource agent

Actively used in production

Why it matters

Handles state transitions correctly

Demonstrates:

Promote / demote roles

Data consistency constraints

Split-brain avoidance

👉 This is the gold standard example of stateful HA with Pacemaker.

2. Promotable (Master/Slave) Resources

Pacemaker natively supports role-based resources:

Roles:

Promoted (formerly Master)

Unpromoted (Slave)

Used for:

Databases

Filesystems with primary/secondary semantics

Replicated storage

Leader/follower services

Existing agents that use this model

PostgreSQL (PAF)

DRBD (block-level replication)

MySQL/MariaDB (community agents)

Redis (basic agents exist, quality varies)

3. DRBD + Filesystem + Application

Classic stateful HA stack

Common pattern:

DRBD → Filesystem → Application

Pacemaker ensures:

DRBD primary promoted on one node

Filesystem mounted only there

Application starts on top

Pros

Strong consistency

Application-agnostic

Cons

Block-level replication complexity

This is still one of the most reliable stateful HA patterns.

4. OCF Resource Agents for Stateful Services

The resource-agents project already includes many state-aware agents:

Examples:

Databases:

PostgreSQL

MySQL

MariaDB

Messaging:

RabbitMQ

Storage:

Filesystem

LVM

iSCSI targets

Virtualization:

libvirt / VM HA

These agents know:

How to check health

Whether the service is writable

How to stop safely

5. STONITH + SBD (Critical for Stateful HA)

Stateful HA requires fencing — no exceptions.

Prevents:

Split-brain

Dual-primary corruption

SBD provides:

Self-fencing

Watchdog-based node suicide

Optional shared disk arbitration

Without proper fencing:

Pacemaker will refuse to protect your data.

This is a feature, not a bug.

6. Geographically Distributed Stateful HA

If you need multi-site:

Booth

Ticket-based ownership

Ensures only one site runs the stateful service

Often combined with:

Async replication

Manual or semi-automatic failover

This is common for:

Databases

Filesystems

Legacy stateful apps

7. Rolling Your Own Stateful HA

If your service isn’t covered:

Write an OCF resource agent

Implement:

start

stop

monitor

promote / demote (if applicable)

Let Pacemaker handle:

Ordering

Placement

Recovery

This is exactly the intended extension point.

Summary: What’s “ready to use” today?
Use case	Project
PostgreSQL HA	PAF
Block storage HA	DRBD + Pacemaker
Database leader/follower	Promotable resources
Stateful apps	OCF resource agents
Split-brain protection	STONITH / SBD
Multi-site HA	Booth
Practical Recommendation

If your goal is learning or prototyping stateful HA:

Start with PAF (simplest real example)

Then try DRBD + Filesystem + dummy app

Only then roll your own agent

If you want, tell me:

What kind of state (DB, files, queue, custom app)

Sync vs async replication

Single-site or multi-site

I can map you to a specific HA pattern + existing agent or help sketch a minimal custom OCF agent.
