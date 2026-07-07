---
source_url: "https://chatgpt.com/c/68a20eef-5260-832b-9db1-a9542dc29e13"
conversation_id: "68a20eef-5260-832b-9db1-a9542dc29e13"
title: "Nomad Docker dependency explained"
extracted_at: "2026-06-29T16:04:55.846Z"
message_count: 2
provenance: auth-ui
---

# Nomad Docker dependency explained

Source: [ChatGPT conversation](https://chatgpt.com/c/68a20eef-5260-832b-9db1-a9542dc29e13)

## User

does nomad have a dependency on docker or anything like that?

## Assistant

HashiCorp Nomad does not have a hard dependency on Docker.

Nomad is designed to be a workload orchestrator that can schedule and run many different types of workloads, including:

Raw executables (running directly on the host, no container runtime needed)

Docker containers (if you want to run containerized workloads)

QEMU / Firecracker VMs (via plugins)

Java applications (via the JVM task driver)

Custom task drivers (you can write your own)

So:

If you want to run containerized workloads, then you do need Docker (or another OCI-compatible runtime) on the client nodes.

If you want to run just binaries or other non-container workloads, Docker is not required.

👉 In short: Nomad does not depend on Docker, but Docker can be one of the runtime backends it uses.

Do you want me to break down the differences between running Nomad with Docker vs. without Docker?
