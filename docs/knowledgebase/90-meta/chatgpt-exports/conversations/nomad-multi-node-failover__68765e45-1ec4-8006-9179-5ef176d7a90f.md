---
source_url: "https://chatgpt.com/c/68765e45-1ec4-8006-9179-5ef176d7a90f"
conversation_id: "68765e45-1ec4-8006-9179-5ef176d7a90f"
title: "Nomad Multi-node Failover"
extracted_at: "2026-06-29T11:14:47.633Z"
message_count: 5
provenance: auth-ui
---

# Nomad Multi-node Failover

Source: [ChatGPT conversation](https://chatgpt.com/c/68765e45-1ec4-8006-9179-5ef176d7a90f)

## Assistant

Got it. Here's a straightforward guide to get a Swarm-like experience in Nomad, including failover, load balancing, and scaling.

🧩 Nomad Equivalent to Docker Swarm
What you're trying to replicate from Swarm:

Clustered container scheduling

Service replication (scale)

Automatic failover

Load balancing between instances

Simple service discovery

✅ Step-by-step Nomad Equivalent Setup
1. Nomad Cluster Setup

(Same as docker swarm init && docker swarm join)

Start Nomad servers (at least 3):

Bash
nomad agent -server -bootstrap-expect=3 -config=server.hcl

Start Nomad clients (on all nodes that should run containers):

Bash
nomad agent -client -config=client.hcl
2. Nomad Job: Define a service with failover and scaling

Here’s the minimal job that replicates Swarm behavior:

hcl
job "web-service" {
  datacenters = ["dc1"]
  type        = "service"

  group "web" {
    count = 3  # equivalent to "docker service scale web=3"

    network {
      port "http" {
        static = 8080  # or use dynamic = true for auto port
      }
    }

    task "web" {
      driver = "docker"

      config {
        image = "nginx:latest"
        ports = ["http"]
      }

      resources {
        cpu    = 500
        memory = 256
      }

      # Register with service discovery
      service {
        name = "web"
        port = "http"

        check {
          type     = "http"
          path     = "/"
          interval = "10s"
          timeout  = "2s"
        }
      }

      # Automatically reschedule on failure (failover)
      reschedule {
        attempts      = 10
        interval      = "30s"
        delay         = "15s"
        delay_function = "constant"
        unlimited     = false
      }
    }
  }
}
3. Load Balancing

Swarm has built-in load balancing via vip.

In Nomad:

Use Consul + Fabio or Consul + Envoy for load balancing.

Or use an external LB (e.g., HAProxy or Traefik) that queries Consul for service IPs.

Basic Consul config gets you DNS-based load balancing:

Bash
dig @127.0.0.1 web.service.consul

You can point your external load balancer to that DNS name, and it’ll distribute across instances.

4. Scaling

To scale, just update the job:

hcl
group "web" {
  count = 5  # Like docker service scale web=5
}

Then:

Bash
nomad job run web.nomad.hcl
🧼 No Fluff Summary
Swarm Feature	Nomad Equivalent
docker service	Nomad Job (type = "service")
Service replicas	group.count = N
Failover	reschedule block
Service Discovery	service { ... } block + Consul
Built-in LB	Use Consul + LB like Fabio, Envoy, or Traefik
CLI deploy	nomad job run myjob.hcl

If you want help generating this Nomad config directly from your docker-compose.yml, send it here. I’ll translate it 1:1.

## User

y'know how kompose converts docker-compose.yml to kubernetes yaml? anything like that for docker to nomad?

search the web.

provide DIRECT LINKS to the projects.

## Assistant

Here are two direct projects that replicate "Kompose" for Nomad:

✅ 1. Compose-to-Nomad Converter

A CLI tool that transforms your docker‑compose.yml into Nomad job files.

GitHub: compose-to-nomad – uchenic/compose-to-nomad 
earthly.dev
+14
github.com
+14
discuss.hashicorp.com
+14

Install via pip: pip install ComposeNomadConvertor

Usage:

Bash
nomadgen docker-compose.yml output.nomad.hcl
✅ 2. compose2hcl

A browser‑based/demo converter: drop in your Compose file, and it spits out Nomad HCL.

GitHub: compose2hcl – JohnVidler/compose2hcl 
github.com
github.com

While there's no official HashiCorp tool like Kompose for Nomad, these community options are your best bet for an automated conversion. Let me know if you'd like help with one of these, or a manual migration approach!

## User

i fail to see any direct links, are you hallucinating?

## Assistant

Here are two open-source tools that can help you convert docker-compose.yml into Nomad job specs—like Kompose does for Kubernetes:

1. compose-to-nomad

A CLI tool that transforms Docker Compose files into Nomad HCL job definitions.

GitHub: uchenic/compose-to-nomad 
discuss.hashicorp.com
+7
github.com
+7
github.com
+7
github.com

Install via pip:

Bash
pip install ComposeNomadConvertor

Usage:

Bash
nomadgen docker-compose.yml output.nomad.hcl
2. compose2hcl

A browser-based converter that generates Nomad HCL from your Compose file in real-time.

GitHub: JohnVidler/compose2hcl 
github.com

These are the closest equivalents to Kompose for Nomad. Let me know if you'd like help running one or translating your docker-compose file manually!
