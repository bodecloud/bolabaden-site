---
source_url: "https://chatgpt.com/c/67e6b374-a298-8006-b097-6d508e2c9787"
conversation_id: "67e6b374-a298-8006-b097-6d508e2c9787"
title: "Tailscale Portainer Access Issue"
extracted_at: "2026-06-29T15:16:56.531Z"
message_count: 4
provenance: auth-ui
---

# Tailscale Portainer Access Issue

Source: [ChatGPT conversation](https://chatgpt.com/c/67e6b374-a298-8006-b097-6d508e2c9787)

## User

using tailscale i'm running into a strange problem.

If I go to https://100.118.110.60:9443/#!/home, i can access portainer just fine.

If I ping bolabaden-the-fourth.noodlefish-pound.ts.net it resolves correctly to 100.118.110.60

But when I go to https://bolabaden-the-fourth.noodlefish-pound.ts.net:9443/#!/home, I get a This site can’t be reached error. I'm beyond confused.
Show more

## Assistant

That is definitely a puzzling issue! Here are some things to check and troubleshoot:

1. Ensure HTTPS is Allowed by Portainer

Portainer may not have a valid SSL certificate for bolabaden-the-fourth.noodlefish-pound.ts.net.

Since .ts.net domains are handled via Tailscale’s MagicDNS, your browser may reject the connection due to SSL/TLS mismatches.

Test:
Try accessing it with HTTP instead of HTTPS:

http://bolabaden-the-fourth.noodlefish-pound.ts.net:9443

If this works, then it's an SSL issue.

2. Check Tailscale ACLs

If your Tailscale ACLs restrict access to .ts.net domain names or specific ports, that could explain the issue.

Check your ACLs in https://login.tailscale.com/admin/acls.

3. Check Portainer’s Configuration

Is Portainer explicitly listening on 100.118.110.60, or just localhost? If it’s bound to 127.0.0.1, it won’t respond to the .ts.net address.

Check:
Run:

netstat -tulnp | grep 9443

and ensure it’s listening on 0.0.0.0:9443 or 100.118.110.60:9443.

4. Try Curl from Another Tailscale Node

On a different device in your Tailscale network, try:

curl -v https://bolabaden-the-fourth.noodlefish-pound.ts.net:9443

This helps determine whether the issue is network-related or browser-related.

5. Flush DNS Cache

Your local DNS cache might be interfering.

Try running:

tailscale netcheck
nslookup bolabaden-the-fourth.noodlefish-pound.ts.net

Also, try flushing your DNS cache:

sudo systemctl restart systemd-resolved  # (Linux)
ipconfig /flushdns  # (Windows)
6. Check Firewall & Tailscale Settings

Make sure tailscale status shows that the machine is online.

Run sudo tailscale up --accept-routes to ensure subnet routes are correctly accepted.

7. Force a Direct Connection

Try:

tailscale ping bolabaden-the-fourth.noodlefish-pound.ts.net

If it’s relayed instead of direct, that could explain latency or timeout issues.

Would love to hear what you find out! 🚀

## User

i don't want to pull the tailscale repo, that's not the src of the iamge.

## Assistant

Got it! You're running into an issue where your Tailscale .ts.net MagicDNS name resolves correctly, but HTTPS access fails while direct IP access works fine.

Since you don't want to pull from the Tailscale repo, let's focus on debugging from your setup:

🔍 Troubleshooting Steps
✅ 1. Check Portainer’s Listening Addresses

Run:

Bash
netstat -tulnp | grep 9443

Make sure Portainer is listening on 0.0.0.0:9443 or your Tailscale IP (100.118.110.60). If it's bound to localhost, the .ts.net domain won’t work.

✅ 2. Bypass SSL (Test HTTP Access)

Try:

http://bolabaden-the-fourth.noodlefish-pound.ts.net:9443

If HTTP works but HTTPS doesn’t, it’s an SSL issue.

✅ 3. Check Browser Security Errors

If you're getting a browser
