---
source_url: "https://chatgpt.com/c/6838b25a-38fc-8006-aaed-76deedbc0176"
conversation_id: "6838b25a-38fc-8006-aaed-76deedbc0176"
title: "K3s uninstall command"
extracted_at: "2026-06-29T14:44:44.771Z"
message_count: 2
provenance: auth-ui
---

# K3s uninstall command

Source: [ChatGPT conversation](https://chatgpt.com/c/6838b25a-38fc-8006-aaed-76deedbc0176)

## User

what k3s command runs the k3s-default script to uninstall it?

## Assistant

To uninstall K3s (the lightweight Kubernetes distribution), you can use the built-in uninstall script that comes with the K3s installation.

For a K3s server (or agent), the correct command is:
Bash
/usr/local/bin/k3s-uninstall.sh
For a K3s agent (if it's a node joined to a cluster), the command is:
Bash
/usr/local/bin/k3s-agent-uninstall.sh

These scripts are placed automatically during installation and will remove K3s and all its associated files.

Important Notes:

You must run the command with sudo or as root.

If you're not sure which role the node has (server or agent), check the process with ps aux | grep k3s.

Example:
Bash
sudo /usr/local/bin/k3s-uninstall.sh

Let me know if you're using a multi-node setup or need to clean up residual data as well.
