---
source_url: "https://chatgpt.com/c/67fa17b9-b9d0-8006-9e9b-486c3e335e5f"
conversation_id: "67fa17b9-b9d0-8006-9e9b-486c3e335e5f"
title: "containerd vs dockerd Kubernetes"
extracted_at: "2026-06-29T15:10:10.707Z"
message_count: 4
provenance: auth-ui
---

# containerd vs dockerd Kubernetes

Source: [ChatGPT conversation](https://chatgpt.com/c/67fa17b9-b9d0-8006-9e9b-486c3e335e5f)

## User

containerd vs dockerd? which is more stable and has more support for kubernetes?

## Assistant

Great question—containerd and dockerd are both container runtimes, but they serve slightly different purposes and are used in different contexts. Here's how they compare, especially in terms of stability and Kubernetes support:

🔧 dockerd (Docker Engine)

What it is: The monolithic Docker daemon (dockerd) includes the container runtime, image building, networking, volumes, etc.

Kubernetes Support: Used to be the default runtime for Kubernetes via the Docker-shim. As of Kubernetes 1.24+, the Docker-shim is deprecated and removed.

Stability: Still stable, especially in standalone Docker environments (like dev machines), but no longer the preferred option for Kubernetes.

Use case: Great for local development, CI/CD pipelines, and general container management outside Kubernetes.

🧱 containerd

What it is: A lightweight, industry-standard container runtime. It’s the core container runtime used by Docker internally.

Kubernetes Support: First-class support. Most Kubernetes distributions (like EKS, GKE, and kind) have moved to containerd.

Stability: Very stable and well-supported by CNCF. It's the recommended runtime for Kubernetes.

Use case: Best suited for production Kubernetes clusters where you don’t need Docker’s extra features (like image building or CLI).

🚀 TL;DR:
Feature	dockerd	containerd
Kubernetes support	Deprecated (since v1.24)	First-class, recommended
Stability	Stable, but legacy in K8s	Very stable, CNCF-supported
Feature scope	Full-featured (image build, etc.)	Runtime only
Use case	Local dev, CI/CD	Kubernetes production

If you're working with Kubernetes, especially in production or modern clusters, containerd is the clear winner.

Need help switching from Docker to containerd in your cluster?

## User

well most self-hosted stacks are using docker -- are these easily convertable/useable to containerd?

## Assistant

You’re absolutely right — most self-hosted apps and dev stacks are Docker-first, often with docker-compose files and CLI-based workflows. But here's the key point:

✅ Yes, most Docker-based stacks can be used with containerd — with some caveats.
🔄 How Docker and containerd relate:

Docker (specifically dockerd) uses containerd under the hood for container lifecycle management. So:

Docker images = containerd-compatible (they both use the same OCI image format).

Docker containers = can be run by containerd directly, just not with the same UX.

🔧 Converting a Docker-based stack:

Here’s what you'd typically need to adjust if you're moving away from dockerd and trying to run things purely with containerd:

Feature	Status with containerd	Notes
Images	✅	Pull from Docker Hub or any registry using ctr or crictl.
Containers	✅	You can start containers with ctr, but not as user-friendly.
docker-compose	❌	Not directly supported. containerd doesn’t have a native equivalent.
Volumes & networks	⚠️	Requires plugins or extra setup (like CNI plugins).
Builds	⚠️	No docker build; you’d need tools like buildah, kaniko, or img.
💡 Realistic Options:

Stay with Docker for local/self-hosted setups: It’s fine, and it works well.

Use Kubernetes + containerd for production: Helm charts or Kubernetes manifests replace docker-compose.

Use nerdctl:

A Docker-compatible CLI for containerd.

Supports docker-compose.yml.

🧠 Great for bridging the gap: same UX, no Docker daemon.

🔥 Pro tip:

If you're managing self-hosted apps on a single server (or small infra), Docker is still totally fine. But if you're moving toward Kubernetes, CI/CD, or container-native ops, it’s worth exploring containerd + nerdctl or full Kubernetes workflows.

Want a step-by-step to run a Docker Compose stack with containerd + nerdctl?
