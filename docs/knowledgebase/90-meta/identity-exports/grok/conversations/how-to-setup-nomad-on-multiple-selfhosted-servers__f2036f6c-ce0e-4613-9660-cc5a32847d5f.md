---
source_url: "https://grok.com/c/f2036f6c-ce0e-4613-9660-cc5a32847d5f"
conversation_id: "f2036f6c-ce0e-4613-9660-cc5a32847d5f"
title: "How to setup nomad on multiple selfhosted servers,..."
extracted_at: "2026-06-29T16:19:55.083Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# How to setup nomad on multiple selfhosted servers,...

Source: [Grok conversation](https://grok.com/c/f2036f6c-ce0e-4613-9660-cc5a32847d5f)

## User

_Time: 2025-09-19T23:50:04.913Z_

How to setup nomad on multiple selfhosted servers, including vault and consul, where everything is HA/loadbalanced. Like if a vps goes down, it doesn’t break anything. Any VPS. I have 5 total. Jobs/containers/client/server/vault/consul. I want all of it to intuitively be HA. No single points of failure. Is it possible? If so exactly what must I do. Be comprehensive and exhaustive in detailed instructions. Need a single traefik reverse proxy to proxy my domain like *.bolabaden.org where * is name of job/service e.g. traefik.bolabaden.org

Not understanding how ha/loadbalance works in this setup. If I host traefik or consul in single node then that node is spof. So how to avoid spof. Can’t figure this shit out. Find guides that walkthrough achieving zero spof ANYWHERE

## Assistant

_Time: 2025-09-19T23:52:29.120Z_

## Possibility

Yes, possible. Nomad evolved from tools like Docker Swarm or manual scripting for job orchestration, solving inconsistent scaling and resource use across servers by using declarative configs and cluster awareness. Consul addresses static IP configs in dynamic environments, providing service discovery. Vault improves on plaintext secrets in files, offering centralized, audited access. All support clustering for HA, where quorum (odd number like 3) ensures continuity if one fails. With 5 VPS, use 3 for servers (Consul/Nomad/Vault co-located), 2 for Nomad clients. Traefik handles reverse proxy, but to eliminate SPOF, run multiple instances—single instance would fail everything if down.

## How HA/Load Balancing Works Here

Single node setups create SPOF because failure stops the service. HA uses multiple nodes in a cluster: Consul gossip protocol spreads state, electing leader with quorum. Nomad servers vote for leader. Vault uses raft for consensus. Load balancing happens via DNS round-robin (multiple IPs for domain) or external LB. For Traefik, run on multiple nodes; traffic hits any, Consul provides consistent service info. If one VPS down, others maintain quorum/services. No SPOF if quorum holds (at least 2 of 3 servers up).

## Prerequisites

Assume Ubuntu/Debian VPS, firewall allows ports, SSH access. Install basics on all:

- Update: `sudo apt update && sudo apt upgrade -y`
- Tools: `sudo apt install unzip curl jq -y`
- Firewall: Use ufw, allow SSH, then specific ports later.
- DNS: Control bolabaden.org, set wildcard *.bolabaden.org to A records of all Traefik-hosting VPS IPs (e.g., 3 server VPS) for round-robin LB.
- Labels: VPS1, VPS2, VPS3 as servers; VPS4, VPS5 as clients.
- Internal network: Assume VPS can communicate via private IPs; use those for configs to avoid public exposure.
- Certificates: For HTTPS, use Let's Encrypt via Traefik.<grok:render card_id="38879e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">32</argument>
</grok:render><grok:render card_id="8b2893" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render><grok:render card_id="de6993" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render>

## Install Binaries on All VPS

Download latest from HashiCorp (check versions):

- Consul: `curl -fsSL https://apt.releases.hashicorp.com/gpg | sudo apt-key add -`
  `sudo apt-add-repository "deb [arch=amd64] https://apt.releases.hashicorp.com $(lsb_release -cs) main"`
  `sudo apt update && sudo apt install consul -y`

- Vault: Same repo, `sudo apt install vault -y`

- Nomad: Same, `sudo apt install nomad -y`

- Traefik: Later via Nomad job.

Create data dirs: `sudo mkdir -p /opt/consul /opt/vault /opt/nomad`

Set ownership: `sudo chown -R $(whoami):$(whoami) /opt/*`

## Setup Consul HA

Consul first, as others depend on it for discovery.

On VPS1-3 (servers):

Config /etc/consul.d/consul.hcl:

```
datacenter = "dc1"
data_dir = "/opt/consul"
server = true
bootstrap_expect = 3
retry_join = ["private-ip-vps1", "private-ip-vps2", "private-ip-vps3"]
bind_addr = "private-ip-this-vps"
client_addr = "0.0.0.0"
ui = true
log_level = "INFO"
```

On VPS4-5 (clients):

Same but `server = false`, no bootstrap_expect.

Start: `sudo systemctl enable consul && sudo systemctl start consul`

Verify: `consul members` shows 3 servers, 2 clients. Leader elected. If down, others handle via gossip/quorum.

Firewall: Allow 8300-8302, 8500-8501, 8600 TCP/UDP between VPS.

Access UI: http://any-vps:8500<grok:render card_id="65c8c6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render><grok:render card_id="3687b4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render>

## Setup Vault HA

Uses Consul backend initially, then migrate to raft for built-in HA.

On VPS1-3 only (co-locate with Consul servers).

Config /etc/vault.d/vault.hcl:

```
storage "consul" {
  address = "127.0.0.1:8500"
  path    = "vault/"
}
listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = true  # Enable later
}
api_addr = "http://private-ip-this-vps:8200"
cluster_addr = "https://private-ip-this-vps:8201"
ui = true
log_level = "info"
```

Start: `sudo systemctl enable vault && sudo systemctl start vault`

Init on VPS1: `vault operator init` — save unseal keys/root token.

Unseal each: `vault operator unseal <key>` (3 keys needed per node).

Login with root token.

Migrate to raft for HA (no Consul dependency for storage):

Create migration.hcl on each:

```
storage_source "consul" {
  address = "127.0.0.1:8500"
  path    = "vault/"
}

storage_destination "raft" {
  path = "/opt/vault/data"
  node_id = "vault-<vps-number>"
}

cluster_addr = "http://private-ip-this-vps:8201"
```

Stop Vault, run `vault operator migrate -config=migration.hcl`

Update vault.hcl:

```
storage "raft" {
  path = "/opt/vault/data"
  node_id = "vault-<vps-number>"
  retry_join {
    leader_api_addr = "http://private-ip-vps1:8200"
  }
  retry_join {
    leader_api_addr = "http://private-ip-vps2:8200"
  }
  retry_join {
    leader_api_addr = "http://private-ip-vps3:8200"
  }
}
disable_mlock = true
```

Restart. Join others: On VPS2/3, `vault operator raft join http://vps1:8200`, then unseal.

Verify: `vault operator raft list-peers`

Firewall: Allow 8200-8201 TCP.

No SPOF: Raft quorum handles failures.<grok:render card_id="51d304" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render><grok:render card_id="335e98" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render>

## Setup Nomad HA

On VPS1-3 (servers):

Config /etc/nomad.d/nomad.hcl:

```
data_dir  = "/opt/nomad"
log_level = "INFO"
datacenter = "dc1"

server {
  enabled          = true
  bootstrap_expect = 3
  server_join {
    retry_join = ["private-ip-vps1:4647", "private-ip-vps2:4647", "private-ip-vps3:4647"]
  }
}

client {
  enabled = false  # Servers not clients
}

consul {
  address = "127.0.0.1:8500"
}

vault {
  enabled = true
  address = "http://127.0.0.1:8200"  # Local, but HA via cluster
}
```

On VPS4-5 (clients):

```
server { enabled = false }
client {
  enabled = true
  servers = ["private-ip-vps1:4647", "private-ip-vps2:4647", "private-ip-vps3:4647"]
}
consul { address = "127.0.0.1:8500" }  # Install Consul client here too
vault { enabled = true, address = "http://active.vault.service.consul:8200" }  # Use Consul discovery for HA
```

Install Docker on clients: `sudo apt install docker.io -y`

Start: `sudo systemctl enable nomad && sudo systemctl start nomad`

Verify: `nomad node status` shows clients, `nomad server members` shows 3 servers.

Firewall: Allow 4646-4648 TCP.

Integration: Nomad uses Consul for service reg, Vault for secrets. No SPOF via server quorum.<grok:render card_id="06711a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render><grok:render card_id="eabdfc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">25</argument>
</grok:render>

## Integrate All

In Vault, enable Nomad engine: `vault secrets enable nomad`

Create role: `vault write nomad/role/operator policies=operator ttl=1h`

Get token: `vault read nomad/creds/operator`

In Nomad config, add ACL if needed, but for HA focus, use Consul discovery.

For jobs, use `service { provider = "consul" }` in job specs.

Vault in jobs: `vault { policies = ["read-kv"] }`

## Setup Traefik HA

Run as Nomad system job on VPS1-3 (or all for more redundancy), using Consul provider.

Job file traefik.nomad (run `nomad job run traefik.nomad`):

```
job "traefik" {
  datacenters = ["dc1"]
  type = "system"

  group "traefik" {
    network {
      mode = "host"
      port "http" { static = 80 }
      port "https" { static = 443 }
      port "api" { static = 8081 }
    }

    service {
      name = "traefik"
      port = "http"
      check {
        type     = "tcp"
        interval = "10s"
        timeout  = "2s"
      }
    }

    task "traefik" {
      driver = "docker"
      config {
        image = "traefik:v3.1"
        args = [
          "--api.insecure=true",
          "--api.dashboard=true",
          "--providers.consulcatalog=true",
          "--providers.consulcatalog.endpoint.address=127.0.0.1:8500",
          "--providers.consulcatalog.exposedByDefault=false",
          "--entrypoints.web.address=:${NOMAD_PORT_http}",
          "--entrypoints.websecure.address=:${NOMAD_PORT_https}",
          "--entrypoints.traefik.address=:${NOMAD_PORT_api}",
          "--certificatesresolvers.myresolver.acme.httpchallenge=true",
          "--certificatesresolvers.myresolver.acme.httpchallenge.entrypoint=web",
          "--certificatesresolvers.myresolver.acme.email=your@email.com",
          "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json",
          "--log.level=DEBUG"
        ]
        volumes = ["local/letsencrypt:/letsencrypt"]
      }

      resources {
        cpu    = 100
        memory = 128
      }
    }
  }
}
```

This runs Traefik on each node, listening on host ports. DNS *.bolabaden.org points to all 3 IPs—traffic hits any, Traefik routes based on host (e.g., app.bolabaden.org to app service).

No SPOF: Multiple Traefiks, Consul syncs config.

For services: In job specs, add tags:

```
service {
  name = "myservice"
  port = "http"
  tags = [
    "traefik.enable=true",
    "traefik.http.routers.myservice.rule=Host(`myservice.bolabaden.org`)",
    "traefik.http.routers.myservice.entrypoints=websecure",
    "traefik.http.routers.myservice.tls.certresolver=myresolver"
  ]
}
```

Deploy: Nomad schedules on clients, registers in Consul, Traefik picks up.

## Testing and Maintenance

- Fail a VPS: Check quorum holds, services reroute.
- Logs: /var/log for each.
- Updates: Rolling restarts.
- Backups: Snapshot /opt dirs.
- Scale: Add more clients.
- Worth it? If uptime critical and you have multi-server, yes—beats single node failures. Alternatives like Kubernetes are heavier if Nomad fits.<grok:render card_id="c2766b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">32</argument>
</grok:render><grok:render card_id="57df2e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">22</argument>
</grok:render><grok:render card_id="336382" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render>
