---
source_url: "https://chatgpt.com/c/6858b38e-94b0-8006-83fb-5957accec66f"
conversation_id: "6858b38e-94b0-8006-83fb-5957accec66f"
title: "Nomad uninstall script"
extracted_at: "2026-06-29T16:37:22.490Z"
message_count: 2
provenance: auth-ui
---

# Nomad uninstall script

Source: [ChatGPT conversation](https://chatgpt.com/c/6858b38e-94b0-8006-83fb-5957accec66f)

## User

is there an uninstall script for nomad similar to the k3s one that undoes everything like e.g. the iptables and everything? on linux

## Assistant

HashiCorp Nomad does not provide a built-in, all-in-one uninstall script like k3s does (e.g. /usr/local/bin/k3s-uninstall.sh), which undoes everything including iptables rules, services, binaries, etc.

However, you can manually uninstall Nomad and clean up its effects using a combination of commands. Below is a rough equivalent of an uninstall script for Nomad:

🔧 Unofficial Nomad Uninstall Script for Linux

This will:

Stop and disable the Nomad service

Remove Nomad binaries

Clean up Nomad data and config

Reset firewall rules (if you choose)

Bash
#!/bin/bash

set -e

echo "Stopping Nomad service..."
sudo systemctl stop nomad || true
sudo systemctl disable nomad || true

echo "Removing Nomad binaries..."
sudo rm -f /usr/local/bin/nomad
sudo rm -f /etc/systemd/system/nomad.service
sudo systemctl daemon-reexec
sudo systemctl daemon-reload

echo "Removing Nomad config and data..."
sudo rm -rf /etc/nomad.d
sudo rm -rf /opt/nomad
sudo rm -rf /var/lib/nomad

echo "Removing Nomad user and group..."
sudo userdel nomad 2>/dev/null || true
sudo groupdel nomad 2>/dev/null || true

# Optional: Clean up iptables (only if Nomad changed them manually or via CNI plugin)
# Warning: This resets ALL iptables rules!
read -p "Do you want to flush iptables rules? (y/n): " flush_iptables
if [[ "$flush_iptables" == "y" ]]; then
  echo "Flushing iptables..."
  sudo iptables -F
  sudo iptables -t nat -F
  sudo iptables -t mangle -F
  sudo iptables -X
fi

echo "Nomad has been removed."
📌 Notes:

Nomad itself doesn't manipulate iptables directly, unless you're using Nomad CNI plugins (like bridge, host-local, etc.). If you're unsure, avoid flushing iptables unless necessary.

If you're using Consul with Nomad, you may need to remove Consul-related components separately.

If you want, I can customize this script to your Nomad setup (e.g., using Docker, running in client/server mode, etc.). Just let me know!
