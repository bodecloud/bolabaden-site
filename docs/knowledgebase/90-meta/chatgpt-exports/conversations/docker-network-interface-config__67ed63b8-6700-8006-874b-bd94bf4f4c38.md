---
source_url: "https://chatgpt.com/c/67ed63b8-6700-8006-874b-bd94bf4f4c38"
conversation_id: "67ed63b8-6700-8006-874b-bd94bf4f4c38"
title: "Docker network interface config"
extracted_at: "2026-06-29T11:29:50.806Z"
message_count: 7
provenance: auth-ui
---

# Docker network interface config

Source: [ChatGPT conversation](https://chatgpt.com/c/67ed63b8-6700-8006-874b-bd94bf4f4c38)

## User

i set a socks5 proxy to localhost:1080, how to input it here? it only shows textboxes for http/https but strangely the form itself mentions socks5?

## User

look at the image. You see the 'The supported proxies are HTTP/HTTPS and SOCKS5. Learn more⁠'. Clearly it wants me to enter it *here in the image*

## Assistant

What is Shadowsocks?

Shadowsocks is not just a name that the Gluetun developer came up with—it’s an actual protocol designed for secure proxying. It's often compared to SOCKS5 but serves a slightly different purpose.

It’s a full specification, similar to SOCKS5, but with encryption and obfuscation built-in.

Unlike SOCKS5, Shadowsocks is optimized to bypass censorship, making it widely used in regions with restricted internet access.

It’s not drop-in compatible with SOCKS5 because it requires client and server encryption keys, whereas SOCKS5 is usually plaintext.

How Does It Compare to SOCKS5?
Feature	SOCKS5	Shadowsocks
Encryption	❌ No encryption (by default)	✅ Yes, strong encryption
Obfuscation	❌ No (can be detected easily)	✅ Yes (harder to detect/block)
Auth Support	✅ Username/password possible	✅ Uses pre-shared key
UDP Support	✅ Yes	✅ Yes
Use Case	General proxying	Circumventing censorship, encrypted proxy
How Does Gluetun Use Shadowsocks?

Gluetun includes a Shadowsocks proxy server that you can use to route traffic through a VPN tunnel while obfuscating the traffic. This is useful for:

Making VPN traffic look less obvious

Routing only certain applications through the VPN (similar to split tunneling)

If your app only supports SOCKS5 but you want to use Shadowsocks, you’ll need a Shadowsocks client that forwards to a local SOCKS5 proxy.

Would you like help setting up a SOCKS5-to-Shadowsocks bridge? 🚀

## User

i don't get what the point of a socks5 proxy is if it's not encrypted/obfuscated. why not just always use shadowsocks and make socks5 obsolete across the whole planet?

## Assistant

That's a great question, and it makes total sense—why even bother with SOCKS5 if Shadowsocks exists and is better in terms of encryption and obfuscation? The answer comes down to a few key trade-offs in complexity, performance, and use cases.

Why SOCKS5 Still Exists Instead of Everyone Using Shadowsocks
Feature	SOCKS5	Shadowsocks
Encryption	❌ No encryption (plaintext)	✅ Strong encryption
Setup Complexity	✅ Simple (no encryption keys needed)	❌ Requires server & key setup
Performance	✅ Very fast (low overhead)	❌ Slightly slower (encryption adds CPU load)
Compatibility	✅ Widely supported (browsers, apps, OS-level)	❌ Requires Shadowsocks-specific software
Censorship Resistance	❌ Easily detectable	✅ Harder to detect & block
Authentication	✅ Username/password supported	❌ Uses a pre-shared key instead
Reasons SOCKS5 Is Still Used

Speed & Simplicity 🏎️

SOCKS5 is lightweight because it doesn’t encrypt anything.

It’s plug-and-play—many browsers, applications, and OSes support it natively, so no extra software is needed.

Corporate & Internal Use Cases 🏢

SOCKS5 is often used inside corporate networks where encryption is unnecessary (e.g., tunneling traffic through an internal proxy).

IT departments don’t want extra encryption overhead when traffic is already within a secured environment.

Gaming & Low-Latency Applications 🎮

Since Shadowsocks encrypts data, it adds CPU load and increases latency.

Gamers and other low-latency users sometimes prefer SOCKS5 for its raw speed.

Some Apps Just Don’t Support Shadowsocks 🤷

Many apps (especially older ones) only support SOCKS5.

SOCKS5 is a standardized protocol, while Shadowsocks is a third-party tool that requires additional setup.

Why Not Just Make Shadowsocks the Standard?

Governments & ISPs Would Target It 🎯

If everyone used Shadowsocks instead of SOCKS5, censorship authorities (like China’s Great Firewall) would focus harder on detecting & blocking it.

Part of Shadowsocks' power comes from the fact that it mimics normal HTTPS traffic—but if it became the universal standard, detection methods would improve.

CPU Overhead on High-Traffic Servers 💻

Running a SOCKS5 proxy on a high-traffic server is much less demanding than encrypting everything with Shadowsocks.

Encryption takes CPU resources, and at scale, this can be expensive.

SOCKS5 Is Already "Good Enough" in Many Cases ✅

If you don’t care about encryption, why add unnecessary processing?

For internal proxies, VPN tunnels, and trusted networks, SOCKS5 does the job without extra steps.

So Should You Always Use Shadowsocks Instead of SOCKS5?

If you're dealing with:
✔ Censorship / Firewalls → Shadowsocks is better
✔ Untrusted networks (e.g., public Wi-Fi) → Shadowsocks is safer
✔ Privacy-focused use cases → Shadowsocks encrypts, SOCKS5 doesn’t

But if you:
✔ Just need a simple proxy (e.g., internal LAN) → SOCKS5 is easier
✔ Want the fastest possible speed → SOCKS5 is lower overhead

Final Thought

If encryption & obfuscation were free (with no CPU cost), then yeah, SOCKS5 would probably be obsolete by now. But because of performance, compatibility, and simplicity, SOCKS5 still has a place in the world.

Would you like help setting up a SOCKS5-to-Shadowsocks bridge so you can use Shadowsocks where possible, but fall back to SOCKS5 when needed? 🚀

## User

what are the most widely adopted alternatives to tailscale? i'm just sorely disappointed with tailscale as a whole it seems vastly under-featured

## Assistant

If Tailscale isn’t meeting your needs, there are several widely adopted alternatives that might offer the features you’re looking for. Here are the top options, with a focus on flexibility, control, and security:

1️⃣ Headscale (Self-Hosted Tailscale Alternative)

🔹 Best for: People who like Tailscale’s architecture but want more control
🌟 Why Choose It?

Self-hosted control plane (no reliance on Tailscale’s servers)

Uses the same WireGuard-based mesh networking as Tailscale

More flexible policy-based routing

Avoids vendor lock-in

🔻 Downsides:

More manual setup than Tailscale

Fewer polished features (no native exit nodes, ACLs require more work)

🔗 GitHub - Headscale

2️⃣ ZeroTier

🔹 Best for: Users who need full control over networking & peer-to-peer connections
🌟 Why Choose It?

Full Layer 2 (Ethernet-level) VPN, so it supports things like multicast

Supports custom routes and subnet access better than Tailscale

More flexible routing and peer-to-peer mesh connectivity

No dependency on WireGuard (uses its own tunneling protocol)

🔻 Downsides:

No native SOCKS5 proxy support (requires extra setup)

Harder to set up for simple use cases than Tailscale

Performance can be inconsistent (relies on NAT traversal, like Tailscale)

🔗 ZeroTier

3️⃣ Nebula (by Slack)

🔹 Best for: Users who want a highly customizable, self-hosted VPN
🌟 Why Choose It?

Fully self-hosted (like Headscale but with more routing control)

Uses Lighthouse nodes to facilitate NAT traversal

Extremely fast encryption (uses Noise protocol, similar to WireGuard)

More flexible traffic rules (can enforce per-app or per-subnet routing)

🔻 Downsides:

More complex to configure than Tailscale/ZeroTier

No built-in UI (requires manual setup)

🔗 GitHub - Nebula

4️⃣ OpenVPN

🔹 Best for: Enterprise users who need a traditional VPN with fine-grained control
🌟 Why Choose It?

Mature & widely supported (used in enterprises for decades)

Works with or without a cloud control plane

More configurable than Tailscale (can do per-app routing, firewall integration, etc.)

Better integration with corporate VPN policies

🔻 Downsides:

Slower than WireGuard-based solutions

Setup is a pain (Tailscale requires no config, OpenVPN needs certs & keys)

No built-in mesh networking (clients don’t talk directly without a VPN server)

🔗 OpenVPN

5️⃣ WireGuard (Raw)

🔹 Best for: Advanced users who want raw WireGuard tunnels without extra software
🌟 Why Choose It?

Super fast (WireGuard is lightweight and efficient)

No dependencies on external companies

Maximum control over routing, security, and exit nodes

Works with policy-based routing (you can manually configure per-app exit nodes)

🔻 Downsides:

Not plug-and-play like Tailscale

Requires manual key management & peer configuration

No automatic NAT traversal (you have to deal with firewall rules)

🔗 WireGuard

💡 Which One Should You Choose?
Feature	Tailscale	ZeroTier	Headscale	Nebula	OpenVPN	WireGuard
Self-Hosted Option?	❌ (Cloud-managed)	✅	✅	✅	✅	✅
Easiest to Set Up?	✅	❌	❌	❌	❌	❌
Best for Enterprise?	⚠️ (Limited features)	✅	⚠️ (Self-managed)	⚠️ (More complex)	✅	❌
Best for Performance?	✅	⚠️ (Sometimes better)	✅	✅	❌ (Slower)	✅
Best for P2P/Mesh?	✅	✅	✅	✅	❌ (Client-server)	❌ (Needs manual config)
Best for Custom Routing?	❌ (Limited)	✅	✅	✅	✅	✅
🚀 TL;DR – Best Alternative Based on Your Needs

✅ Want more control but like Tailscale? → Try Headscale
✅ Want a powerful P2P VPN? → ZeroTier or Nebula
✅ Need a corporate-grade VPN? → OpenVPN
✅ Want raw speed & control? → WireGuard

Since you mentioned disappointment with Tailscale’s features, I’d say Headscale (self-hosted Tailscale) or ZeroTier (better routing flexibility) might be your best bet.

👉 What specifically do you need that Tailscale doesn’t do? That’ll help narrow it down even more! 🚀
