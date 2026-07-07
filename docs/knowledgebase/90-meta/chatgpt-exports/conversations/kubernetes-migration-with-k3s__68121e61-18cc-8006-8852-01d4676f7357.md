---
source_url: "https://chatgpt.com/c/68121e61-18cc-8006-8852-01d4676f7357"
conversation_id: "68121e61-18cc-8006-8852-01d4676f7357"
title: "Kubernetes migration with k3s"
extracted_at: "2026-06-29T15:01:36.109Z"
message_count: 5
provenance: auth-ui
---

# Kubernetes migration with k3s

Source: [ChatGPT conversation](https://chatgpt.com/c/68121e61-18cc-8006-8852-01d4676f7357)

## Assistant

Fair point — let’s get straight to the technical answer:

🔍 Where is the 6443 port configured in k3s?

The K3S server listens on port 6443 by default. This is the Kubernetes API server port, and it's hardcoded unless overridden.

📂 Config Location for k3s Server:

K3s uses a systemd service file with options specified in:

/etc/systemd/system/k3s.service

Inside that file, you'll find a line like:

ExecStart=/usr/local/bin/k3s server

By default, it listens on:

https://0.0.0.0:6443

You can confirm it's active with:

Bash
sudo netstat -tulnp | grep 6443

or

Bash
ss -tuln | grep 6443

This should show something like:

LISTEN  0  128  0.0.0.0:6443  0.0.0.0:*  users:(("k3s-server", pid, fd))
✅ Want to explicitly change or confirm it?

You can override the default port by creating a config file:

/etc/rancher/k3s/config.yaml

Add this if you want to bind explicitly:

YAML
https-listen-port: 6443

Then restart k3s:

Bash
sudo systemctl daemon-reexec
sudo systemctl restart k3s
⚠️ Gotchas

6443 is used only on the server.

If that port isn't open on your firewall or VPS, worker nodes will hang trying to join.

If you’re using a cloud provider, check security groups or panel-based firewalls too.

Let me know if you want to check the logs or config together to confirm it's listening — I’ll help you fix it quickly.

## User

Once again your entire response did not mention where 6443 is explicitly defined nor did it contain the instructions for how to change it. Your response should focus on the CONFIG FILE WHERE I CAN SET THE SERVER MASTER PORT.

## Assistant

Understood — here is the precise, no-fluff answer:

✅ Where to Configure the Kubernetes API Server Port in k3s
🔧 File:
Bash
/etc/rancher/k3s/config.yaml
🔹 To explicitly set the Kubernetes API server port (default 6443):

Add this to the file:

YAML
https-listen-port: 6443

You can change 6443 to any other port you'd like.

💡 Example: Change API server to port 7443
YAML
# /etc/rancher/k3s/config.yaml
https-listen-port: 7443

Then restart the service:

Bash
sudo systemctl restart k3s
🔍 To verify the port is in use:
Bash
ss -tuln | grep 7443

You should see:

LISTEN  0  128  0.0.0.0:7443  0.0.0.0:*  
🛠️ Notes:

This config file also supports other options like token, node-name, flannel-backend, etc.

Any CLI argument (k3s server --xyz) can be set as YAML here with kebab-case.

Let me know if you want to automate config file generation or join commands across all nodes.

## User

wrong. that file doesn't even exist on my system. Where's the current default existing file.

## Assistant

Thanks for the push — here’s the real, existing source of k3s server config when /etc/rancher/k3s/config.yaml doesn't exist, which is common when you install via the script.

✅ Where k3s Stores Actual Runtime Configuration (Default Install)
🔍 Systemd Service File:
Bash
/lib/systemd/system/k3s.service

Inside this file, you'll find the actual ExecStart line used to launch the k3s server.

Example:

INI
[Service]
ExecStart=/usr/local/bin/k3s server

If any options like port overrides were passed via environment variables or CLI flags, they’d be directly on that line, like:

INI
ExecStart=/usr/local/bin/k3s server --https-listen-port=6443
🛠️ How to Change the API Server Port
Option 1: Using a Config File (Preferred for custom setups)

Create this file:

Bash
sudo mkdir -p /etc/rancher/k3s
sudo nano /etc/rancher/k3s/config.yaml

Add:

YAML
https-listen-port: 7443

Then reload systemd and restart:

Bash
sudo systemctl daemon-reexec
sudo systemctl restart k3s

This will override the default port from 6443 to 7443.

Option 2: Modify the systemd unit file directly (not ideal, but works)

Edit:

Bash
sudo nano /lib/systemd/system/k3s.service

Find the ExecStart line and add:

Bash
--https-listen-port=7443

Example:

INI
ExecStart=/usr/local/bin/k3s server --https-listen-port=7443

Then reload and restart:

Bash
sudo systemctl daemon-reload
sudo systemctl restart k3s
🔍 Verify It's Listening:
Bash
ss -tuln | grep 7443

Let me know if you want help turning this into an install script or auto-propagating config across all your VPS nodes.
