---
source_url: "https://chatgpt.com/c/684780ed-0f18-8006-81ac-d9a7f6773fd6"
conversation_id: "684780ed-0f18-8006-81ac-d9a7f6773fd6"
title: "VPN app routing explained"
extracted_at: "2026-06-29T14:40:10.928Z"
message_count: 5
provenance: auth-ui
---

# VPN app routing explained

Source: [ChatGPT conversation](https://chatgpt.com/c/684780ed-0f18-8006-81ac-d9a7f6773fd6)

## User

Without the fluff how does vpn connections actually force all apps to use that connection? When I look at qbittorrent I can bind to specific adapters and I see the openvpn, loopback, and Wi-Fi adapter in here. But I don’t understand why when I put it to ‘any’ it uses the vpn or what part of the vpn is telling the ‘any’ option to use the vpn. Is there a priority system? Is it not possible to use a vpn for specific apps or to exclude certain apps from the vpn? I don’t want a containerized solution

## Assistant

Here’s the no-fluff breakdown of how VPNs force all traffic (including from apps) through the tunnel, and how that works with something like qBittorrent:

🔧 1. What a VPN Actually Does

When you connect to a VPN (e.g., via OpenVPN or WireGuard), the VPN software:

Creates a virtual network adapter (like tun0 or tap0).

Adds new routing rules to your system, setting the default gateway to go through the VPN adapter.

Adds higher-priority routes for the VPN server so traffic to the server doesn't route through the VPN itself (avoiding a loop).

This routing change means any traffic without a more specific route goes through the VPN.

⚙️ 2. Why “Any Interface” Uses the VPN in Apps

In qBittorrent (and similar apps), the "Any Interface" option means:

“Bind to whatever the OS sends out through.”

Since the VPN has changed the system-wide default route, the OS chooses the VPN adapter when the app doesn't explicitly bind to another one. So traffic goes through VPN by default.

🧠 3. Is There a Priority System?

Yes. The OS uses routing tables with metrics (priorities). The lower the metric, the higher the priority.

The VPN adapter’s route usually has a lower metric (higher priority).

You can view this on Linux with ip route, or on Windows with route print.

🧱 4. Using VPN for Some Apps Only (Without Containers)

Yes, it’s possible — but not natively on all OSes.

✅ Options (No Containers):

Linux (best control):

Use iptables + ip rule to mark packets from specific processes or users and route only those via VPN.

Example: ip rule add fwmark 1 table 100 with iptables -t mangle.

Windows (limited natively):

Use 3rd-party tools like ForceBindIP
 to bind apps to specific adapters.

Alternatively, some VPN clients (like NordVPN, ProtonVPN) support split tunneling, which excludes certain apps.

macOS:

Use pf for complex routing, or networksetup for interface binding.

Some VPN clients offer split tunneling.

❌ Not Possible?

Without extra config, you can’t force specific apps out of the VPN — because once the VPN is up, the OS routes everything through it.

🧪 Example: How qBittorrent Binds

Set to OpenVPN Adapter: All traffic forced through VPN.

Set to Wi-Fi Adapter: Traffic bypasses VPN, but won’t work unless routing allows it.

Set to Any: Uses the system’s current default route — which, while VPN is active, points to the VPN adapter.

Want detailed setup instructions for selective routing on a specific OS? Let me know which one you're using.

## User

I am on windows, how to use vpn for only certain apps or the inverse of excluding things from the VPN? Can’t I just setup openvpn as an ‘additional’ connection option so that apps like qBitTorrent can just set the interface between wifi and the vpn?

## Assistant

You're on Windows, so here's how you can route only certain apps through a VPN or exclude certain apps from the VPN — no containers, minimal fluff:

✅ What You Want to Do

You want to:

Use OpenVPN.

Have selective routing — either:

Only certain apps use the VPN.

Or, exclude certain apps from it.

🚧 Windows Limitation

Windows doesn't natively support per-app routing like Linux does (with iptables/ip rule). But there are ways around it.

🛠️ Your Options on Windows
Option 1: Split Tunneling via VPN Client (Easiest)

Some VPN providers (like ProtonVPN, NordVPN, ExpressVPN) support split tunneling on Windows:

You choose which apps go outside the VPN or inside it.

But only works with their own VPN apps, not raw OpenVPN configs.

Option 2: Bind Specific App to Interface (Your Idea)

You're on the right track. Here's what you can do:

🔧 Step-by-step for qBittorrent:

Connect to OpenVPN manually.

This creates a virtual adapter (e.g., TAP-Windows Adapter or tun0).

Keep both your regular Wi-Fi and VPN interface up.

In qBittorrent:

Go to Tools → Options → Advanced.

Find "Network Interface" and choose the OpenVPN adapter by name.

This forces qBittorrent to use only that adapter.

If VPN drops, no fallback = no leaks.

✅ Benefits:

You achieve app-specific VPN routing.

Everything else (browser, games) stays outside the VPN.

qBittorrent dies if VPN dies = good for privacy.

Option 3: ForceBindIP (Per-App Adapter Binding)

Use a tool like ForceBindIP (free, old but works).

Example:
cmd
ForceBindIP.exe 192.168.100.10 "C:\Path\To\App.exe"

Where 192.168.100.10 is the IP of your VPN adapter.

🚫 Downsides:

Can be buggy with modern apps or 64-bit ones.

Not as reliable as native split tunneling.

Option 4: Static Route Hacks

If the app communicates with fixed IPs (rare), you can manually set routes:

cmd
route add <destination_ip> mask 255.255.255.255 <vpn_gateway> metric 1 if <vpn_if_index>

But this only works if traffic goes to known destinations.

🔁 Summary

| Method | VPN Only for Some Apps | Exclude

## Assistant

On Windows, selectively routing only certain apps through a VPN (or excluding them from it) without vendor-locked VPN clients and without containers is tricky but doable with some manual setup. Here’s a breakdown of how to approach it:

✅ GOAL: Route only certain apps through VPN — or exclude some

Windows doesn't natively support policy-based routing per app. But here are the main techniques:

🔧 OPTION 1: Use Separate Routing Tables via OpenVPN + Static Routes (Per-App VPN)
Concept:

Run OpenVPN without changing the system’s default route (redirect-gateway disabled).

Add custom routes that send only some traffic through the VPN interface.

Use ForceBindIP to bind specific apps to the VPN interface.

🪜 Step-by-Step:
🛠 1. Modify OpenVPN config

In your .ovpn file, comment out or remove:

Bash
redirect-gateway def1

This prevents OpenVPN from hijacking all your traffic.

🛠 2. Manually route specific traffic through VPN

Use route command to route only certain IPs/subnets through VPN.

Example:

cmd
route add 123.45.67.89 mask 255.255.255.255 <VPN_Gateway_IP> metric 1 if <VPN_Interface_ID>

To get the VPN interface ID:

cmd
route print

You’ll see interface names with associated numbers.

🛠 3. Use ForceBindIP to bind app to VPN interface

Download ForceBindIP
 (freeware).

Example usage:

cmd
ForceBindIP.exe {VPN_INTERFACE_IP} "C:\Path\To\App.exe"

{VPN_INTERFACE_IP} = IP assigned to your tun interface by OpenVPN (like 10.8.0.6).

⚠️ ForceBindIP has limitations:

Works best with simple WinSock apps (e.g., older qBittorrent versions).

Doesn’t work with all apps (especially newer ones using Win10 APIs or .NET).

⚠️ Limitations

ForceBindIP is a hack. Not fully reliable.

Windows has no built-in per-app routing.

Traffic from excluded apps may still leak DNS (watch out).

VPN must allow split routing and not force all via tunnel (i.e., don't push default gateway).

🧪 Alternative (if you're flexible): Run 2 VPN Instances (Dual Routing)

You can:

Have a system-wide connection (normal Wi-Fi).

Add a manual OpenVPN adapter with no default route.

Use ForceBindIP to point a few apps at that interface only.

qBittorrent, for instance, can bind to this VPN interface directly (in settings), meaning only torrent traffic will go over VPN.

🧰 Tools Summary:
Tool	Purpose
OpenVPN	Raw VPN tunnel
route cmd	Add static routes
ForceBindIP	Bind app to a network interface
qBittorrent	Can natively bind to interface
🔐 DNS Leak Note

If you exclude apps from VPN, DNS can leak unless:

You configure a non-VPN DNS (e.g., local DNS or DNS-over-HTTPS).

You avoid redirect-gateway def1 (so local DNS stays local).

✅ TL;DR

You can use OpenVPN as a separate interface and bind apps manually.

You must not use redirect-gateway if you want selective routing.

Use manual routes + interface binding (e.g., in qBittorrent) or ForceBindIP for apps that don’t support it.

No vendor lock required — OpenVPN works fine for this.

Want a full example of this with actual commands and config file for OpenVPN?
