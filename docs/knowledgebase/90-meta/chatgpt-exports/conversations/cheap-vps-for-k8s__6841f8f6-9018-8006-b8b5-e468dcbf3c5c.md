---
source_url: "https://chatgpt.com/c/6841f8f6-9018-8006-b8b5-e468dcbf3c5c"
conversation_id: "6841f8f6-9018-8006-b8b5-e468dcbf3c5c"
title: "Cheap VPS for K8s"
extracted_at: "2026-06-29T11:17:11.902Z"
message_count: 5
provenance: auth-ui
---

# Cheap VPS for K8s

Source: [ChatGPT conversation](https://chatgpt.com/c/6841f8f6-9018-8006-b8b5-e468dcbf3c5c)

## Assistant

To undo the changes made by these commands, follow these steps:

🧹 Step 1: Remove the custom sysctl configuration file

This file was created to persist the IP forwarding settings:

Bash
sudo rm /etc/sysctl.d/99-tailscale.conf
🔄 Step 2: Reload sysctl to apply the reverted settings

This will reload all the sysctl configurations and revert to the system defaults:

Bash
sudo sysctl --system

✅ This disables IP forwarding again unless it's enabled elsewhere (like in /etc/sysctl.conf or another file in /etc/sysctl.d/).

✅ Optional: Double-check forwarding is disabled

Run the following to confirm:

Bash
sysctl net.ipv4.ip_forward
sysctl net.ipv6.conf.all.forwarding

Expected output:

Bash
net.ipv4.ip_forward = 0
net.ipv6.conf.all.forwarding = 0

Let me know if you also want to make sure it's not enabled temporarily in-memory (without persistence).

## User

bro actually tell me how to execute net.ipv4.ip_forward = 0

## Assistant

To execute net.ipv4.ip_forward = 0 (i.e. disable IP forwarding immediately), run:

Bash
sudo sysctl -w net.ipv4.ip_forward=0

This applies the change right away, but it’s not persistent — it will revert on reboot unless saved in a config file.

✅ To make it persistent across reboots:

If you want to ensure it's off permanently:

Edit the config file:

Bash
sudo nano /etc/sysctl.d/99-tailscale.conf

Change:

Bash
net.ipv4.ip_forward = 1

to:

Bash
net.ipv4.ip_forward = 0

Reload sysctl configs:

Bash
sudo sysctl --system

Let me know if you also want to disable IPv6 forwarding (net.ipv6.conf.all.forwarding=0).

## User

WTF sudo sysctl --system just undos the changers so that 1 replaces the 0 i'm applying

## Assistant

You're absolutely right — and this is a critical behavior to understand:

Bash
sudo sysctl -w net.ipv4.ip_forward=0

✅ applies the change immediately,
❌ but does not override what's in the config files like /etc/sysctl.d/99-tailscale.conf.

So when you run:

Bash
sudo sysctl --system

…it reloads all the sysctl config files (including 99-tailscale.conf), and applies the values in those files, meaning ip_forward = 1 gets reapplied, undoing your =0 setting.

🔧 Here's how to properly fix it:

If you want to permanently disable IP forwarding:

Edit the tailscale sysctl config:

Bash
sudo nano /etc/sysctl.d/99-tailscale.conf

Change:

Bash
net.ipv4.ip_forward = 1

to:

Bash
net.ipv4.ip_forward = 0

Also, if needed:

Bash
net.ipv6.conf.all.forwarding = 0

Save and reload configs:

Bash
sudo sysctl --system

Now you're applying 0 persistently. That will stick through reboots and not be overwritten by old config.

🧹 Alternatively: delete the config entirely

If you don't want 99-tailscale.conf to affect this anymore:

Bash
sudo rm /etc/sysctl.d/99-tailscale.conf
sudo sysctl --system

Let me know if you want to revert only the IP forwarding without touching other Tailscale settings.
