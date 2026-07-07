---
source_url: "https://chatgpt.com/c/6845f3ac-fffc-8006-ada2-6d49f2043d94"
conversation_id: "6845f3ac-fffc-8006-ada2-6d49f2043d94"
title: "Uninstall k3s Guide"
extracted_at: "2026-06-29T16:42:35.387Z"
message_count: 4
provenance: auth-ui
---

# Uninstall k3s Guide

Source: [ChatGPT conversation](https://chatgpt.com/c/6845f3ac-fffc-8006-ada2-6d49f2043d94)

## User

command to uninstall k3s

## Assistant

To uninstall k3s from a Linux system, you can run the official uninstall script provided by the k3s installation. Here’s the command:

Bash
/usr/local/bin/k3s-uninstall.sh

If you installed k3s as a k3s agent (worker node), use:

Bash
/usr/local/bin/k3s-agent-uninstall.sh

Notes:

These scripts will remove the k3s binaries, systemd service, and related data.

You may need to run the commands with sudo if you’re not root:

Bash
sudo /usr/local/bin/k3s-uninstall.sh

Let me know if you want help cleaning up specific configs or data!

## User

i know for a fact i have k3s installed still but /usr/local/bin/k3s-uninstall.sh  doesn't uninstall it? i'm not an agent. provide the command to install k3s maybe that'll create the uninstall script i can run to actually remove everything again

## Assistant

Got it! Sometimes the uninstall script might not be there if k3s was installed in a custom way or the install didn't complete fully.

To reinstall k3s, which will regenerate the uninstall script, use the official install command like this:

Bash
curl -sfL https://get.k3s.io | sh -

This will:

Download and install k3s,

Create the uninstall script at /usr/local/bin/k3s-uninstall.sh.

Once installed, you can then run:

Bash
sudo /usr/local/bin/k3s-uninstall.sh

to cleanly uninstall everything.

If you want to install a specific version or customize the install, you can add environment variables before running the script. But the above command is the default easiest way.

Want me to guide you through verifying your current k3s install status or cleaning up manually if the uninstall script still doesn’t work?
