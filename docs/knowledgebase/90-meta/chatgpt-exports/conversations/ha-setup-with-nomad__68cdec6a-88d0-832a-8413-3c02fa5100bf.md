---
source_url: "https://chatgpt.com/c/68cdec6a-88d0-832a-8413-3c02fa5100bf"
conversation_id: "68cdec6a-88d0-832a-8413-3c02fa5100bf"
title: "HA setup with nomad"
extracted_at: "2026-06-29T11:49:51.677Z"
message_count: 6
provenance: auth-ui
---

# HA setup with nomad

Source: [ChatGPT conversation](https://chatgpt.com/c/68cdec6a-88d0-832a-8413-3c02fa5100bf)

## Assistant

Yes — this is the exact pain point most guides skip. Control-plane services (Consul, Nomad servers, Vault, and distributed storage) are not ordinary jobs: they hold cluster state and use consensus. That means they need special treatment (quorum, bootstrapping, secure joins, backups, unseal workflows). Below I’ll walk you, in plain language and with exact configs/commands and verification steps, through everything you must do to make the control-plane itself highly available across your 5 Ubuntu VPSs — and how to automate recovery so you never have to “think HA” again for day-to-day failures.

I’ll cover:

core rules for control-plane HA (why it’s different)

what to run where and minimum counts

exact config snippets (Consul, Nomad servers, Vault Raft, systemd units)

bootstrap & startup order (the chicken-and-egg steps)

automatic re-join / self-heal mechanisms

storage options for stateful apps (practical recommendations)

monitoring/backups and “what to do if quorum is lost”

final short checklist you can copy/paste

I’ll cite HashiCorp docs and other trusted sources for the decisive points. 
Traefik Docs
+4
HashiCorp Developer
+4
HashiCorp Developer
+4

Quick summary (TL;DR)

Control plane = consensus services. Run them with an odd number of voting nodes (3 or 5). With 5 servers you can lose two and still have quorum — that’s why 5 is commonly chosen. 
HashiCorp Developer

Consul: run 3–5 server agents (we’ll use 5), each on a different VPS, with gossip encryption + TLS + bootstrap_expect/retry_join. 
HashiCorp Developer
+1

Nomad (servers): run 3 or 5 Nomad servers (bootstrap_expect = 3 or 5). The server processes are the Raft cluster that must be protected with quorum and restartable by systemd. 
HashiCorp Developer

Vault: use Integrated Storage (Raft) and run it on 3–5 nodes (we’ll use 5). Vault unseal is special — either do an initial manual init/unseal or use auto-unseal via a KMS/HSM/transit. 
HashiCorp Developer
+1

Ingress (Traefik): run multiple Traefik instances (e.g., 2–3) and use DNS round-robin or VIP (keepalived) for an external IP. Let Traefik obtain a wildcard cert with DNS-01 ACME. 
Traefik Docs

Now — detailed explicit steps and files you can copy.

1) The hard truth: WHY the control plane needs special handling

Jobs = ephemeral. If a job instance dies, Nomad will reschedule it and nobody loses consensus. Control-plane services (Consul servers, Nomad servers, Vault Raft) hold consensus logs; you cannot run a single instance of those and expect automatic cluster recovery if that instance dies or the node disappears — because consensus needs majority. So for these you must run multiple voting servers, guarantee secure re-join, enable process supervision, and run scheduled backups & health checks. If you prefer not to waste resources running many replicas 24/7, you still need at least 3 voting nodes for each consensus group — you cannot “just wait and redeploy” from nothing. 
HashiCorp Developer
+1

2) What you should run on each of your five VPSs (recommended baseline)

All five nodes will be multi-purpose to maximize fault tolerance:

Consul server agent (server = true) — all 5 as voting servers

Nomad server + client (server enabled on each node; bootstrap_expect=5)

Vault server (Integrated Storage Raft) — all 5 in Raft cluster

A Nomad client slot for workloads (same host)

GlusterFS or Ceph OSDs (or both) to provide replicated filesystem/blocks for stateful workloads (details below)

Traefik replicated as Nomad job (run on 2–3 distinct hosts) or as system service on multiple hosts

Running all three control services co-located on the same host is fine for 5 small VPSs (but reserve resources so a noisy workload doesn’t starve servers).

3) Consul — exact, copyable setup for 5 voting servers

Why Consul matters: Consul provides service catalog and helps Nomad jobs register themselves. For secure HA you must do gossip encryption, TLS for RPC/API, and run an odd number of servers. 
HashiCorp Developer
+1

Create /etc/consul.d/consul.hcl on each host (replace IPs and keys):

hcl
datacenter = "dc1"
data_dir = "/opt/consul"
server = true
bootstrap_expect = 5
bind_addr = "0.0.0.0"

retry_join = ["10.0.0.1","10.0.0.2","10.0.0.3","10.0.0.4","10.0.0.5"]
encrypt = "CONSUL_GOSSIP_KEY"        # output of `consul keygen` (base64)
ui = true

ports {
  http = 8500
  https = 8501
  dns = 8600
}

# TLS config (optional but recommended): provide CA and cert/key paths
# See Consul TLS docs for full config

Generate gossip key:

Bash
# on a secure host
consul keygen > /root/consul_gossip.key
# copy this value into `encrypt` above (on all servers)

Systemd unit /etc/systemd/system/consul.service:

INI
[Unit]
Description=Consul Agent
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/local/bin/consul agent -config-dir=/etc/consul.d
Restart=on-failure
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target

Start and verify:

Bash
sudo systemctl daemon-reload
sudo systemctl enable --now consul
# On any server:
consul members
consul operator raft list-peers   # check Raft peers

Notes and best-practices:

Use bootstrap_expect = 5 for a 5-server cluster; HashiCorp recommends 3 or 5 voting servers per DC. If you want to be able to lose two servers, run 5. 
HashiCorp Developer

Configure TLS for the Consul HTTP API and server-to-server RPC (HashiCorp docs). Use a CA you control and issue certificates for each node. 
HashiCorp Developer

Always use encrypt (gossip key) to protect Serf gossip traffic (consul keygen). 
HashiCorp Developer

4) Nomad servers — exact config + bootstrap rules

Nomad server cluster runs Raft; set bootstrap_expect to the number of servers you actually expect to start. Use the same number on each server. For 5 nodes:

/etc/nomad.d/nomad.hcl (example):

hcl
data_dir = "/opt/nomad"
bind_addr = "0.0.0.0"

server {
  enabled = true
  bootstrap_expect = 5
}
client {
  enabled = true
}

consul {
  address = "127.0.0.1:8500"   # talk to local Consul agent
}

advertise {
  http = "<NODE_IP>:4646"
  rpc  = "<NODE_IP>:4647"
  serf = "<NODE_IP>:4648"
}

Systemd unit /etc/systemd/system/nomad.service:

INI
[Unit]
Description=Nomad Agent
After=network-online.target consul.service
Wants=network-online.target consul.service

[Service]
ExecStart=/usr/local/bin/nomad agent -config=/etc/nomad.d
Restart=on-failure
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target

Start:

Bash
sudo systemctl daemon-reload
sudo systemctl enable --now nomad
# Verify
nomad server-members
nomad node status

Notes:

bootstrap_expect ensures the first Raft leader bootstraps only after N servers are present. Use odd values (3 or 5). If you set it too low, you reduce fault tolerance; too high and the cluster might never bootstrap. 
HashiCorp Developer

Let Nomad talk to the local Consul agent for service registration and health checks.

Protect Nomad RPC/HTTP with TLS certs and enable tokens/ACLs for production.

5) Vault (Integrated Raft) — exact config and init/unseal sequence

Use Vault Integrated Storage (Raft) — easiest for a self-hosted multi-node cluster. Vault replicates the data across the Raft cluster and elects an active node. 
HashiCorp Developer

/etc/vault.d/vault.hcl (on each node; change node_id and add appropriate IPs):

hcl
storage "raft" {
  path    = "/opt/vault/data"
  node_id = "vault-01"   # unique per node (vault-01..vault-05)
}
listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_cert_file = "/etc/vault/tls/vault.crt"
  tls_key_file  = "/etc/vault/tls/vault.key"
}
api_addr = "https://<NODE_PUBLIC_OR_CLUSTER_DNS>:8200"
cluster_addr = "https://<NODE_PRIVATE_IP>:8201"
ui = true

Systemd unit /etc/systemd/system/vault.service:

INI
[Unit]
Description=Vault server
After=network-online.target
Wants=network-online.target

[Service]
ExecStart=/usr/local/bin/vault server -config=/etc/vault.d
Restart=on-failure
LimitNOFILE=65536

[Install]
WantedBy=multi-user.target

Bootstrap & unseal (one-time):

Start Vault on all 5 nodes (they'll join Raft).

On one node, initialize (this produces unseal keys and root token):

Bash
export VAULT_ADDR='https://127.0.0.1:8200'
vault operator init -key-shares=5 -key-threshold=3 \
  -format=json > /root/vault-init.json
# Securely back up the json file (it contains unseal keys and root token).

Unseal each node by supplying 3 of the key shares (or script it if you have a secure mechanism):

Bash
vault operator unseal <unseal_key_1>
vault operator unseal <unseal_key_2>
vault operator unseal <unseal_key_3>

Verify status:

Bash
vault status
vault operator raft list-peers

Auto-unseal: Vault supports auto-unseal with a KMS or using Transit auto-unseal; if you can provide a KMS/HSM (YubiHSM, cloud KMS), use that to avoid manual unseal. If you cannot use KMS, store shards securely and automate unseal via a tiny operator (see Vault docs). Auto-unseal drastically reduces manual steps. 
HashiCorp Developer
+1

Notes & cautions:

Vault active node handles writes; standbys forward requests. If active dies, a standby becomes active automatically. BUT the cluster must maintain quorum (>=3 unsealed nodes for a 5-node cluster) to operate. 
HashiCorp Developer

Protect unseal keys & root token — treat them like gold.

6) Storage for stateful workloads: practical, real options (and which I recommend)

Nomad won’t magically replicate a disk for you. Approaches:

A. Database-native replication (recommended for DBs):

Postgres + Patroni (Patroni uses Consul for leader election). Patroni runs on multiple nodes; when leader dies a replica is promoted. This is the safest for DBs. See Patroni docs. 
Patroni

B. Clustered filesystem / block storage (general purpose):

GlusterFS (simpler to run on 5 VPSs) — easy to get started; create a replicated volume across nodes and mount it on each host. Good for file-backed state and general persistence.

Ceph (more robust, performant) — better for block devices and large scale but more operationally complex. Compare pros/cons before picking. 
Virtualization Howto
+1

C. CSI + Ceph RBD (advanced): Use Ceph + CSI driver to attach block volumes to tasks.

My pragmatic recommendation for a 5-VPS self-hosted cluster:

Use Patroni + Postgres for SQL workload HA (data replicated by Postgres itself). Store Postgres data on local disk with WAL shipping or use a distributed block (Ceph RBD) if you want mountable volumes on any node. Patroni with Consul provides automatic failover and is widely used.

For miscellaneous persistent volumes, use GlusterFS (less ops overhead), with the caveat that Gluster has performance and split-brain caveats. If you’re comfortable, Ceph is better long-term.

7) Traefik ingress — how to avoid it being a SPOF

Traefik must be replicated. Let Traefik instances pull service data from Consul catalog. To avoid a single Traefik node being SPOF:

Run 3 Traefik instances (Nomad job count = 3) and add a DNS A record for *.bolabaden.org that contains the IPs of the Traefik nodes (DNS round-robin). Clients will get multiple A records; if one IP fails the client will connect to another. Alternatively, set up keepalived or HAProxy+VIP, but DNS round-robin is simplest for a handful of VPSes.

Use DNS-01 ACME to obtain wildcard certs (*.bolabaden.org). Traefik config requires DNS-01 for wildcard certs. Make Traefik store acme.json on the shared filesystem (Gluster) so all instances share the certificate state. 
Traefik Docs

Nomad job sketch for Traefik (run 3 replicas, with distinct_hosts constraint):

hcl
group "traefik" {
  count = 3
  constraint {
    attribute = "${meta.hostname}"
    operator  = "distinct_hosts"
  }
  task "traefik" {
    driver = "docker"
    config {
      image = "traefik:v2.x"
      args  = ["--providers.consulcatalog", "--entrypoints.web.address=:80", "--entrypoints.websecure.address=:443", "--certificatesresolvers.le.acme.dnsChallenge.provider=cloudflare"]
    }
    # Mount /acme -> shared Gluster path so acme.json is shared
  }
}
8) Bootstrapping sequence — copy/paste order (DO THIS EXACTLY)

Provision OS on all 5 VPS (Ubuntu). Ensure static private IPs or stable IPs. Open ports between nodes 8300-8302, 8500-8502 (Consul), 4646-4648 (Nomad), 8200-8201 (Vault), Gluster/Ceph ports, Traefik ports 80/443 from public.

Install Consul on all nodes, create gossip key (consul keygen), place in /etc/consul.d/consul.hcl, start consul systemd on all nodes.

Verify Consul cluster: consul members and consul operator raft list-peers.

Install Nomad on all nodes, set /etc/nomad.d/nomad.hcl with bootstrap_expect = 5 and consul { address = "127.0.0.1:8500" }, start Nomad systemd on all nodes.

Verify Nomad servers: nomad server-members (you should see 5 servers and one leader).

Install Vault on all nodes using Raft config, start Vault systemd on all nodes.

Initialize Vault (one-time) on a single node: vault operator init -key-shares=5 -key-threshold=3 and securely store shards. Unseal nodes using three keys, vault operator unseal.

Install & configure distributed storage (Gluster/Ceph) across nodes and mount a volume under /mnt/cluster — create volumes you will use (e.g., for acme.json, Postgres data if using replication with shared storage).

Deploy Traefik as a Nomad job (count=3), ensure it reads DNS API token from Vault, and use shared /acme on Gluster for acme.json. Add wildcard DNS A records (or use VIP with keepalived).

Deploy Patroni/Postgres job(s) for databases if needed, with Patroni configured to use Consul as DCS (so it can elect leader automatically).

9) Automatic self-healing & “never think HA again”

You asked: “why not detect and deploy a new instance only if the service dies?” — Nomad does this for ordinary jobs: if a job is defined with count = 1, Nomad will reschedule it somewhere if the node dies. But control-plane consensus nodes cannot be reduced to one — they must exist as a quorum. What you can and should automate:

Process-level recovery: run Consul, Nomad, Vault under systemd with Restart=on-failure — they will restart if the process crashes.

Auto re-join: put retry_join lists in Consul/Vault configs so a restarted agent will automatically re-join the cluster once network back (no manual join required).

Nomad-managed infra (optional): You can run Vault/Consul as Nomad system jobs — HashiCorp shows patterns for running Vault on Nomad — but be careful with bootstrapping order. Running the control plane on Nomad is feasible and gives you automatic rescheduling of those services, but you must bootstrap an initial minimal set of systemd services to avoid circular dependency. See HashiCorp’s multi-part guide on running Vault on Nomad if you want to go this route. 
HashiCorp | An IBM Company

Monitoring + auto-remediation: use Prometheus + Alertmanager to detect cluster member loss and trigger runbook scripts (e.g., ansible-playbook reprovision-node.yml or a local script that runs nomad job run traefik.nomad to replace an instance). You can wire alerts to a small automation endpoint that runs the replacement workflow.

Concretely: combine systemd auto-restart + configured retry_join + Nomad scheduling for non-consensus services + monitor+remediate. That’s the practical “invisible HA” setup.

10) Backups, snapshots & disaster recovery (do these — they’re vital)

Consul: periodic snapshots

Bash
consul snapshot save /backups/consul-$(date +%F).snap

Vault (Raft): raft snapshot

Bash
vault operator raft snapshot save /backups/vault-$(date +%F).snap

Nomad: backup Nomad data directory and job specs (/opt/nomad), export ACL tokens.

Databases: logical backups and WAL shipping (e.g., pg_basebackup / WAL archives).

Automate snapshots to offsite location (SFTP / another VPS / encrypted external storage).

If quorum is lost (dangerous):
If you lose >floor(N/2) nodes (e.g., lose 3 in a 5 node cluster), you lose quorum and must perform manual recovery, which can be complex and risky. Do not attempt force-bootstrapping unless you know the implications — there are “operator” commands (e.g., consul operator raft remove-peer or Vault rescue steps) but these must be used carefully. Always restore from snapshots if in doubt.

11) Maintenance tips & safe upgrade steps

Upgrade followers one at a time (drain, stop, upgrade, restart). With 5 voting servers you can upgrade 2 at a time and still have quorum; but safer to do one-by-one.

To drain a Nomad client before maintenance:

Bash
nomad node status                 # get node id
nomad node eligibility -disable <node-id>
nomad node drain -enable <node-id>

For Consul, gracefully remove a node with consul leave before maintenance, then rejoin after.

12) Fail scenarios — exact commands to inspect & operate

Check Consul health:

Bash
consul members
consul operator raft list-peers
consul info

Check Nomad:

Bash
nomad server-members
nomad node status
nomad operator raft list-peers

Check Vault:

Bash
vault status
vault operator raft list-peers
vault server -config=/etc/vault.d # logs

If a node’s process crashed: sudo systemctl status consul || nomad || vault and journalctl -u consul -n 200 for logs.

13) Make day-to-day HA invisible (automation recipes)

Implement once:

Ansible playbook to provision a node (install consul/nomad/vault, drop config files using templates, enable systemd units).

Bootstrapping script you run once to configure gossip key and initial retry_join IPs, start Consul, then Nomad, then Vault, create Gluster volume, etc.

Vault init runbook (one-time, manual step). Save output in secure encrypted vault (offsite).

CI/CD job that deploys Nomad job changes and verifies service health; when you git push a job spec the cluster deploys it automatically.

Prometheus + Alertmanager rules that call remediation webhooks (or send to a small automation runner) to restart services or call your Ansible playbook if a node is lost.

Scheduled snapshots of Consul/Vault/Databases to offsite store.

With the above automated, day-to-day you create a Nomad job and the system schedules and recovers it. The control-plane recovers automatically for process crashes and node reboots; only catastrophic multi-node failures require human action.

14) Final copy/paste checklist (do this in order)

Choose IPs: list NODE1..NODE5 IPs.

On each node:

Install consul/nomad/vault/glusterfs/docker.

Generate gossip key:

Bash
consul keygen > gossip.key

copy into /etc/consul.d/consul.hcl encrypt field.

Configure Consul (bootstrap_expect=5) and start systemd service.

Configure Nomad (bootstrap_expect=5, consul address 127.0.0.1:8500) and start Nomad systemd.

Configure Vault (storage "raft" with unique node_id and cluster_addr/api_addr), start Vault on all nodes.

On one Vault node: vault operator init -key-shares=5 -key-threshold=3 → store shards.

Unseal three nodes with three of the shares.

Deploy Gluster/Ceph across nodes and mount /mnt/cluster.

Deploy Traefik as Nomad job count=3, mount /mnt/cluster/acme for shared acme.json, use DNS-01 provider token stored in Vault.

Deploy Patroni Postgres job if you need DB HA.

Add monitoring (Prometheus) and snapshots cron for Consul/Vault.

Citations / further reading (most important reference docs I used)

Consul architecture and voting servers best practice. 
HashiCorp Developer
+1

Nomad server bootstrap_expect and configuration. 
HashiCorp Developer

Vault Integrated Storage (Raft) and HA setup. 
HashiCorp Developer

Consul gossip encryption (consul keygen) and TLS advice. 
HashiCorp Developer

Traefik + ACME wildcard must use DNS-01 challenge. 
Traefik Docs

Bottom line + straight talk

You can make HA practically invisible for day-to-day work: automate provisioning, bootstrapping, auto-unseal (if you can provide a KMS/HSM or accept a secure initial manual vault init), shared certificates, and scheduled snapshots. Combine systemd restart + retry_join + Nomad scheduling + monitoring/alerting to auto-remediate failures.

You cannot avoid consensus math: control-plane systems require an odd number of voting nodes and quorum. You must run at least 3 (preferably 5 for 5 VPS) for Consul/Vault/Nomad servers. If you try to run a single instance and “redeploy only when it dies” you will have a single point of failure for cluster control. 
HashiCorp Developer
+1

If you want, I’ll now:

Generate the exact repo with Ansible playbook + systemd units + /etc/* templates + Nomad job files + example Patroni job + Vault init helper and snapshots cron — ready for your 5 VPSs; or

Produce a focused script set for just bootstrapping Consul/Nomad/Vault/Traefik across 5 nodes (smaller).

Which do you want me to produce next? (I’ll output full files you can copy-paste.)

## User

Generate exact ansible repo

## Assistant

Done — I created the Ansible repo in the canvas titled Nomad-ha-ansible-repo (you can open it in the file panel). It includes:

A complete repo scaffold: playbook.yml, ansible.cfg, an inventory example, group_vars/all.yml.

Roles for preflight, consul, nomad, vault, gluster, traefik, and a placeholder monitoring role.

Templates for configs and systemd units (Consul, Nomad, Vault).

A Traefik Nomad job (replicated) that writes ACME to the shared Gluster mount.

GlusterFS provisioning tasks and a mount job.

Docs: BOOTSTRAP.md and VAULT_INIT.md, a safe-ish vault-auto-unseal.sh helper, and a README explaining what’s automated and what requires manual action.

Next steps I recommend (pick any or ask me to run them for you):

Fill the real IPs and generate a Consul gossip key in group_vars/all.yml.

Review and, if you want, I can convert the gluster role to Ceph (more complex but more robust).

I can also add CI (GitHub Actions) to lint and run dry-run deployments, or expand the monitoring role to deploy Prometheus+Alertmanager and automated remediation webhooks.

Which of those should I do next (CI for the repo, switch Gluster→Ceph, add Patroni/Postgres job, or expand monitoring/autoremediation)?

## User

Nomad-ha-ansible-repo
Okay you outputted one file called Nomad-ha-ansible-repo which seems to specify multiple files within one. Wtf do i do with this so i don't need to manually separate into files?

## Assistant

Right now the whole repo is dumped into a single text file with file markers (like === README.md ===).

What you do:

Copy the full file content into a local folder on your workstation (say nomad-ha-ansible-repo/).

Run a script (bash/python) to split it into real files and directories.
Example bash one-liner:

Bash
awk '/^=== .* ===$/{
  gsub(/^=== | ===$/, "", $0);
  out=$0;
  next
}
{print > out}' Nomad-ha-ansible-repo.txt

This will create real files (README.md, ansible.cfg, inventory/hosts.ini, etc.) from the markers.

Put those under git:

Bash
cd nomad-ha-ansible-repo
git init
git add .
git commit -m "Initial import"

Now you’ve got a proper repo structure instead of a single monolith.

👉 Do you want me to generate the little splitter script for you (bash or python) and include it in the repo so you can just run ./split.py Nomad-ha-ansible-repo.txt and it will spit out all the files in folders automatically?

## User

Nomad-ha-ansible-repo
Okay you outputted one file called Nomad-ha-ansible-repo which seems to specify multiple files within one. Wtf do i do with this so i don't need to manually separate into files?
