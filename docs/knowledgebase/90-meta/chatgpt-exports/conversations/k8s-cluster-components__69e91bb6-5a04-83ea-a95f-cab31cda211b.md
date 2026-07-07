---
source_url: "https://chatgpt.com/c/69e91bb6-5a04-83ea-a95f-cab31cda211b"
conversation_id: "69e91bb6-5a04-83ea-a95f-cab31cda211b"
title: "K8s cluster components"
extracted_at: "2026-06-29T15:53:49.061Z"
message_count: 2
provenance: auth-ui
---

# K8s cluster components

Source: [ChatGPT conversation](https://chatgpt.com/c/69e91bb6-5a04-83ea-a95f-cab31cda211b)

## User

concisely provide all the actual components that are run in a k8s cluster. Canonical modern components only.

## Assistant

Below is a concise, canonical list of the actual components that run in a modern Kubernetes cluster, grouped by function. This reflects current upstream Kubernetes (v1.29+), excluding deprecated or optional legacy pieces.

Control Plane Components

(run on control-plane nodes)

kube-apiserver – REST API front-end for the cluster

etcd – distributed key-value store for all cluster state

kube-scheduler – assigns Pods to Nodes

kube-controller-manager – runs core controllers (Node, ReplicaSet, Job, EndpointSlice, etc.)

cloud-controller-manager (optional) – cloud-provider integration (LBs, volumes, routes)

Node Components

(run on every worker node)

kubelet – node agent; manages Pods and containers

kube-proxy – implements Service networking (iptables / IPVS / eBPF)

Container Runtime

(one per node)

containerd (canonical)
(CRI-O is also valid; Docker is deprecated)

Networking (CNI)

(cluster-wide, implementation-specific)

CNI plugin – e.g. Calico, Cilium, Flannel, Weave
(Pod networking, NetworkPolicy enforcement)

DNS

(cluster-wide)

CoreDNS – internal service discovery and DNS

Storage (CSI)

(cluster-wide, driver-specific)

CSI controller components

CSI node components

Add-ons (Common but Optional)

(still “run” in most real clusters)

Metrics Server – resource metrics for HPA / kubectl top

Ingress Controller – e.g. NGINX, HAProxy, Traefik

Admission Webhooks – mutating / validating controllers

Autoscalers

Horizontal Pod Autoscaler (HPA)

Cluster Autoscaler (CA)

Minimal Core Set (Strictly Required)

If you want the absolute minimum:

kube-apiserver

etcd

kube-scheduler

kube-controller-manager

kubelet

kube-proxy

containerd

CNI plugin

CoreDNS

If you want, I can also provide:

a diagram

a “what talks to what” data-flow

or a comparison vs legacy components
