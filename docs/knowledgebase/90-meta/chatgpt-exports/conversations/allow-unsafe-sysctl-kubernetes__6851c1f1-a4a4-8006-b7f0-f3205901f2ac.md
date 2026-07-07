---
source_url: "https://chatgpt.com/c/6851c1f1-a4a4-8006-b7f0-f3205901f2ac"
conversation_id: "6851c1f1-a4a4-8006-b7f0-f3205901f2ac"
title: "Allow unsafe sysctl Kubernetes"
extracted_at: "2026-06-29T14:33:34.462Z"
message_count: 4
provenance: auth-ui
---

# Allow unsafe sysctl Kubernetes

Source: [ChatGPT conversation](https://chatgpt.com/c/6851c1f1-a4a4-8006-b7f0-f3205901f2ac)

## User

Based on the documentation, here are the key issues:
Cluster Configuration: The kubelet needs to be started with --allowed-unsafe-sysctls flag to allow unsafe sysctls like net.ipv6.conf.all.disable_ipv6=1
Pod Configuration: Sysctls should be in the pod's securityContext, not the container's securityContext
Safe vs Unsafe Sysctls: According to the docs, only these sysctls are considered "safe" and allowed by default:
kernel.shm_rmid_forced
net.ipv4.ip_local_port_range
net.ipv4.ip_unprivileged_port_start
net.ipv4.tcp_syncookies
net.ipv4.ping_group_range
The net.ipv6.conf.all.disable_ipv6=1 sysctl is considered "unsafe" and requires cluster-level configuration.


How to address this problem? I need net.ipv6.conf.all.disable_ipv6=1 more than anything else in the world lol. I'm using k3s
Show more

## Assistant

Got it — you desperately need net.ipv6.conf.all.disable_ipv6=1 in a pod, and you're using k3s, which is a lightweight Kubernetes distro. Since it's considered an unsafe sysctl, Kubernetes won’t allow it by default without additional setup.

Here's how to get it working on k3s:

✅ Step-by-Step Fix
1. Enable Unsafe Sysctls in k3s (Kubelet Configuration)

K3s runs with its own bundled kubelet. You need to start k3s with the --kubelet-arg flag to allow the unsafe sysctl.

Modify your k3s startup to include:

Bash
--kubelet-arg=allowed-unsafe-sysctls=net.ipv6.conf.all.disable_ipv6

How you do this depends on your setup:

If using k3s server, run it like:

Bash
k3s server \
  --kubelet-arg=allowed-unsafe-sysctls=net.ipv6.conf.all.disable_ipv6

If using systemd (common):

Edit the file:
/etc/systemd/system/k3s.service or /etc/systemd/system/k3s.service.env

Add or update the line:

INI
K3S_KUBELET_ARGS="--allowed-unsafe-sysctls=net.ipv6.conf.all.disable_ipv6"

Then reload and restart:

Bash
sudo systemctl daemon-reexec
sudo systemctl restart k3s
2. Add the Sysctl in Pod Security Context

Make sure your pod spec has the sysctl set in the correct place — the pod-level securityContext.sysctls field:

YAML
apiVersion: v1
kind: Pod
metadata:
  name: disable-ipv6-pod
spec:
  securityContext:
    sysctls:
      - name: net.ipv6.conf.all.disable_ipv6
        value: "1"
  containers:
    - name: example
      image: alpine
      command: ["sleep", "infinity"]

Note:

Do not put the sysctls in the container's securityContext. That won’t work.

3. (Optional) Check Pod Security Admission Settings

If you're using Pod Security Admission (PSA), make sure the namespace allows privileged or at least a policy that permits unsafe sysctls.

You can label the namespace to allow it:

Bash
kubectl label ns your-namespace pod-security.kubernetes.io/enforce=privileged
🔍 Test It

Once deployed, you can exec into the pod and verify:

Bash
cat /proc/sys/net/ipv6/conf/all/disable_ipv6

Should print 1.

Let me know if you're using k3s agent nodes as well — you'll need to apply --kubelet-arg there too.

## User

(.venv) .venvubuntu@beatapostapita:~/my-media-stack/k8s/bolabaden/clean_manifests_v2/namespaced/vpn-gateway$ sudo cat /etc/systemd/system/k3s.service
[Unit]
Description=Lightweight Kubernetes
Documentation=https://k3s.io
Wants=network-online.target
After=network-online.target

[Install]
WantedBy=multi-user.target

[Service]
Type=notify
EnvironmentFile=-/etc/default/%N
EnvironmentFile=-/etc/sysconfig/%N
EnvironmentFile=-/etc/systemd/system/k3s.service.env
KillMode=process
Delegate=yes
User=root
# Having non-zero Limit*s causes performance problems due to accounting overhead
# in the kernel. We recommend using cgroups to do container-local accounting.
LimitNOFILE=1048576
LimitNPROC=infinity
LimitCORE=infinity
TasksMax=infinity
TimeoutStartSec=0
Restart=always
RestartSec=5s
ExecStartPre=/bin/sh -xc '! /usr/bin/systemctl is-enabled --quiet nm-cloud-setup.service 2>/dev/null'
ExecStartPre=-/sbin/modprobe br_netfilter
ExecStartPre=-/sbin/modprobe overlay
ExecStart=/usr/local/bin/k3s \
    server \


where exactly do i put K3S_KUBELET_ARGS?
Show more

## Assistant

Thanks for sharing your k3s.service file — this helps a lot.

Since your systemd unit uses:

INI
EnvironmentFile=-/etc/systemd/system/k3s.service.env

✅ You should create or edit this file:
/etc/systemd/system/k3s.service.env

✏️ Step-by-step

Open or create the file:

Bash
sudo nano /etc/systemd/system/k3s.service.env

Add this line to pass the unsafe sysctl:

INI
K3S_KUBELET_ARGS="--allowed-unsafe-sysctls=net.ipv6.conf.all.disable_ipv6"

Save and exit (Ctrl+O, Enter, Ctrl+X in nano).

Reload systemd and restart k3s:

Bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl restart k3s
✅ Confirm It's Working

After k3s restarts:

Deploy your pod with the sysctl setting in the pod-level securityContext.

Check in the pod:

Bash
cat /proc/sys/net/ipv6/conf/all/disable_ipv6

If it says 1, you’re golden. 🥇

Let me know if you hit any weird behavior — K3s is pretty flexible, but it’s picky about where flags are passed.
