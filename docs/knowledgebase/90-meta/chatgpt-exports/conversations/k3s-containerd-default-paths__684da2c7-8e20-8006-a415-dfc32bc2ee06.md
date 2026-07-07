---
source_url: "https://chatgpt.com/c/684da2c7-8e20-8006-a415-dfc32bc2ee06"
conversation_id: "684da2c7-8e20-8006-a415-dfc32bc2ee06"
title: "K3s containerd default paths"
extracted_at: "2026-06-29T16:39:56.575Z"
message_count: 2
provenance: auth-ui
---

# K3s containerd default paths

Source: [ChatGPT conversation](https://chatgpt.com/c/684da2c7-8e20-8006-a415-dfc32bc2ee06)

## User

default containerd path for k3s, full path on linux

## Assistant

The default containerd path used by K3s on Linux is:

/var/lib/rancher/k3s/agent/containerd
Additional relevant paths:

containerd socket:

/run/k3s/containerd/containerd.sock

containerd configuration file (used internally by k3s):

/var/lib/rancher/k3s/agent/etc/containerd/config.toml

containerd state (PID, runtime state, etc.):

/run/k3s/containerd

Let me know if you need these paths for customization, debugging, or integration purposes.
