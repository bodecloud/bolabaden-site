---
source_url: "https://chatgpt.com/c/68764769-fe14-8006-9fe3-dc0ee85593e9"
conversation_id: "68764769-fe14-8006-9fe3-dc0ee85593e9"
title: "Delete Kubernetes Pods"
extracted_at: "2026-06-29T11:54:18.805Z"
message_count: 5
provenance: auth-ui
---

# Delete Kubernetes Pods

Source: [ChatGPT conversation](https://chatgpt.com/c/68764769-fe14-8006-9fe3-dc0ee85593e9)

## Assistant

You're running into a common permission issue with K3s, which by default writes its kubeconfig file (/etc/rancher/k3s/k3s.yaml) with root-only access. This is by design, to avoid leaking cluster admin credentials.

Here’s how to properly give your normal user account access to the kubeconfig file:

✅ 1. Best Practice: Change the kubeconfig permissions at startup

When launching k3s server, use:

Bash
k3s server --write-kubeconfig-mode 644

Or if you're using systemd (which you probably are), edit the service file:

Bash
sudo systemctl edit k3s

Then add:

INI
[Service]
ExecStart=
ExecStart=/usr/local/bin/k3s server --write-kubeconfig-mode 644

Then reload:

Bash
sudo systemctl daemon-reexec
sudo systemctl restart k3s

This will ensure /etc/rancher/k3s/k3s.yaml is world-readable (or readable by your user if you choose a different mode like 640 with group permissions).

🔁 2. Alternative (One-Time Fix): Copy the kubeconfig and chown it

You can copy the kubeconfig to your home directory:

Bash
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown $USER:$USER ~/.kube/config

Then set the KUBECONFIG environment variable, or just use kubectl directly:

Bash
export KUBECONFIG=~/.kube/config
kubectl get nodes

✅ This is a standard and safe approach, used in most dev/test environments.

🛡️ Why not just chmod 777?

## User

answer the question exclusively and specifically as i asked it

## Assistant

To give your normal user account permission to update /etc/rancher/k3s/k3s.yaml, do the following:

✅ Option 1: Change file permissions (persistent)
Bash
sudo chmod 644 /etc/rancher/k3s/k3s.yaml

This makes the file readable and writable by root, and readable by everyone else, including your normal user.

✅ Option 2: Change file group ownership and grant group access

Add your user to a group (e.g. kube):

Bash
sudo groupadd kube
sudo usermod -aG kube $USER

Change the group ownership and permissions:

Bash
sudo chown root:kube /etc/rancher/k3s/k3s.yaml
sudo chmod 640 /etc/rancher/k

## User

i meant make my account a member of the kubeconfig group!

## Assistant

Thanks for the clarification.

To make your normal user account a member of the group that has permission to read/update /etc/rancher/k3s/k3s.yaml using the --write-kubeconfig-group flag, follow these steps:

✅ Step-by-step: Give your user access via --write-kubeconfig-group
1. Choose or create a group

Choose an existing group (e.g., admin, kube, or yourusername) or create a new one:

Bash
sudo groupadd kubeconfig
2. Add your user to that group
Bash
sudo usermod -aG kubeconfig $USER
3. Configure K3s to use that group

Edit the systemd service for K3s:

Bash
sudo systemctl edit k3s

Add this override:

INI
[Service]
ExecStart=
ExecStart=/usr/local/bin/k3s server --write-kubeconfig-mode 640 --write-kubeconfig-group kubeconfig

This tells K3s to write /etc/rancher/k3s/k3s.yaml with group ownership set to kubeconfig and file permissions 640.

4. Reload systemd and restart K3s
Bash
sudo systemctl daemon-reexec
sudo systemctl restart k3s
5. Re-login or refresh group membership

Your shell session won’t immediately pick up new group membership. You can:

Bash
newgrp kubeconfig

Or log out and back in.

6. Verify access
Bash
ls -l /etc/rancher/k3s/k3s.yaml

It should now show:

-rw-r----- 1 root kubeconfig ... /etc/rancher/k3s/k3s.yaml

And you should be able to read it as your normal user.

✅ This is the correct and supported way to give non-root users access to the K3s kubeconfig.
