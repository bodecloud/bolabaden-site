---
source_url: "https://chatgpt.com/c/687a339b-1050-8006-9b1f-5a240bd9f8e1"
conversation_id: "687a339b-1050-8006-9b1f-5a240bd9f8e1"
title: "OpenVPN autostart setup"
extracted_at: "2026-06-29T14:14:44.557Z"
message_count: 2
provenance: auth-ui
---

# OpenVPN autostart setup

Source: [ChatGPT conversation](https://chatgpt.com/c/687a339b-1050-8006-9b1f-5a240bd9f8e1)

## User

using ubuntu linux openvpn through apt install openvpn, how to startup by default with systemctl the ovpn file at /etc/openvpn/client/vpn_config.ovpn

## Assistant

To make your OpenVPN client configuration at /etc/openvpn/client/vpn_config.ovpn start automatically on boot using systemctl, follow these steps:

✅ Step-by-Step Instructions
1. Ensure OpenVPN is installed
Bash
sudo apt update
sudo apt install openvpn
2. Place the .ovpn file correctly

Ensure the file is at:

Bash
/etc/openvpn/client/vpn_config.ovpn

✅ Note: This filename must end in .conf for systemd to automatically recognize and manage it.

So rename it:

Bash
sudo mv /etc/openvpn/client/vpn_config.ovpn /etc/openvpn/client/vpn_config.conf
3. Enable autostart with systemd

Use systemctl to enable the OpenVPN client service for this configuration:

Bash
sudo systemctl enable openvpn-client@vpn_config

📌 The @vpn_config matches the config file name (vpn_config.conf).

4. Start it manually (for now)
Bash
sudo systemctl start openvpn-client@vpn_config

Check status:

Bash
sudo systemctl status openvpn-client@vpn_config
5. Verify it's working

Run:

Bash
curl ifconfig.me

Then disconnect VPN and try again to confirm that the IP changes.

🛠 Optional Debugging

Check logs:

Bash
journalctl -u openvpn-client@vpn_config

If you're using user/pass authentication, you may need a auth-user-pass line in the config, or a credentials.txt file.

Let me know if you're using credentials or .ovpn with embedded certificates — I can help with that too.
