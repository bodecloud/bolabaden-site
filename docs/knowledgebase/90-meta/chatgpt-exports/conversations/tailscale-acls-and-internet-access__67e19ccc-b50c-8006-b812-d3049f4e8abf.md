---
source_url: "https://chatgpt.com/c/67e19ccc-b50c-8006-b812-d3049f4e8abf"
conversation_id: "67e19ccc-b50c-8006-b812-d3049f4e8abf"
title: "Tailscale ACLs and Internet Access"
extracted_at: "2026-06-29T15:17:34.491Z"
message_count: 5
provenance: auth-ui
---

# Tailscale ACLs and Internet Access

Source: [ChatGPT conversation](https://chatgpt.com/c/67e19ccc-b50c-8006-b812-d3049f4e8abf)

## Assistant

You're absolutely right to be skeptical about using Tailscale Funnel to expose devices to the public internet, especially if your ISP blocks incoming ports. I apologize if my previous response wasn’t clear about the limitations of Tailscale in this use case.

Let's break it down:

Tailscale Funnel is a feature designed to allow traffic to reach private resources (like servers or applications) inside a Tailscale network via the public internet. However, it’s important to note that Funnel doesn't "open" arbitrary ports like traditional port forwarding. Instead, it allows Tailscale devices to advertise specific services (like HTTP/HTTPS, SSH, etc.) to be accessible via a public URL, but it still uses the Tailscale network to manage the traffic.

Key Points:

Funnel requires that you have a public IP (via Tailscale's own infrastructure) to route the traffic from the internet to your devices within the Tailscale network.

It works by allowing services (such as web servers or other apps) to be exposed to the internet through a specific Tailscale-managed endpoint (like yourdevice.tailnet.ts.net), rather than through a traditional port open on your router.

Tailscale Funnel relies on Tailscale's relay infrastructure, meaning Tailscale will route the traffic through their servers, bypassing your ISP’s potential block on incoming ports.

Can you use Funnel to bypass ISP port blocks?

Yes, Funnel can potentially allow incoming connections from the public internet to devices behind a Tailscale network, even if your ISP blocks incoming ports. This is because Tailscale uses its own relay servers to manage traffic routing. The port blocking by your ISP is not directly relevant in this case, as Tailscale handles that traffic routing on their end.

In summary:

Yes, Tailscale Funnel can be used to expose services to the public internet, and it can bypass ISP port blocking. However, this depends on whether the service you're trying to expose is compatible with Funnel, and whether you have the appropriate configuration for it.

It's not the same as traditional port forwarding; it’s a more secure, managed way to expose private network services to the internet through Tailscale.

If you're aiming to expose a service to the public internet and your ISP blocks incoming ports, Funnel is a viable solution if you're within the constraints of the available services that Tailscale can route (like HTTP/S, SSH, etc.).

Would you like more details on how to set this up?

## User

hence my original reply. Where are you seeing ability to add public internet incoming accessors because i'm sure not.

// Example/default ACLs for unrestricted connections. 
{
	// Declare static groups of users. Use autogroups for all users or users with a specific role.
	// "groups": {
	//  	"group:example": ["alice@example.com", "bob@example.com"],
	// },

	// Define the tags which can be applied to devices and by which users.
	// "tagOwners": {
	//  	"tag:example": ["autogroup:admin"],
	// },

	// Define access control lists for users, groups, autogroups, tags,
	// Tailscale IP addresses, and subnet ranges.
	"acls": [
		// Allow all connections.
		// Comment this section out if you want to define specific restrictions.
		{"action": "accept", "src": ["*"], "dst": ["*:*"]},

		// Allow users in "group:example" to access "tag:example", but only from
		// devices that are running macOS and have enabled Tailscale client auto-updating.
		// {"action": "accept", "src": ["group:example"], "dst": ["tag:example:*"], "srcPosture":["posture:autoUpdateMac"]},
	],

	// Define postures that will be applied to all rules without any specific
	// srcPosture definition.
	// "defaultSrcPosture": [
	//      "posture:anyMac",
	// ],

	// Define device posture rules requiring devices to meet
	// certain criteria to access parts of your system.
	// "postures": {
	//      // Require devices running macOS, a stable Tailscale
	//      // version and auto update enabled for Tailscale.
	// 	"posture:autoUpdateMac": [
	// 	    "node:os == 'macos'",
	// 	    "node:tsReleaseTrack == 'stable'",
	// 	    "node:tsAutoUpdate",
	// 	],
	//      // Require devices running macOS and a stable
	//      // Tailscale version.
	// 	"posture:anyMac": [
	// 	    "node:os == 'macos'",
	// 	    "node:tsReleaseTrack == 'stable'",
	// 	],
	// },

	// Define users and devices that can use Tailscale SSH.
	"ssh": [
		// Allow all users to SSH into their own devices in check mode.
		// Comment this section out if you want to define specific restrictions.
		{

			"action": "check",
			"src":    ["autogroup:member"],
			"dst":    ["autogroup:self"],
			"users":  ["autogroup:nonroot", "root"],
		},
	],
	"nodeAttrs": [
		{
			// Funnel policy, which lets tailnet members control Funnel
			// for their own devices.
			// Learn more at https://tailscale.com/kb/1223/tailscale-funnel/
			"target": ["autogroup:member"],
			"attr":   ["funnel"],
		},
	],

	// Test access rules every time they're saved.
	// "tests": [
	//  	{
	//  		"src": "alice@example.com",
	//  		"accept": ["tag:example"],
	//  		"deny": ["100.101.102.103:443"],
	//  	},
	// ],
}

This is all funnel provides. Nowhere do I see anything that could even remotely be used for public internet?? 
Show more

## Assistant

You're absolutely right in pointing out that the ACLs configuration you shared doesn’t directly mention anything about exposing services to the public internet through Tailscale, and I apologize for the confusion in my earlier messages.

Let me clarify: The ACLs you have in the configuration are focused on internal Tailscale network (tailnet) access control. They specify who can connect to which devices within your private Tailscale network, using internal tags, groups, or user attributes, and also the Tailscale Funnel feature to control access for devices.

However, public internet access (i.e., exposing a service to the general internet through an external IP address) is not part of this ACL configuration. The Funnel feature you referenced in the configuration is not opening arbitrary ports for public access but instead allows you to expose services like HTTP/S and SSH to the public internet via Tailscale's infrastructure.

Here’s the distinction:

Tailscale Funnel allows you to create a

## User

the file i keep sending you is the exclusively only thing funnel lets me do. so is it possible or not with tailscale

## Assistant

I see what you're saying now, and I apologize for any confusion earlier. Let's go over this carefully:

The configuration file you've shared is related to Tailscale ACLs and Tailscale Funnel. As you’ve pointed out, it doesn’t provide any direct mechanism for opening ports to public internet access in the traditional sense, like using port forwarding on your router.

What Tailscale Funnel does allow:

Tailscale Funnel lets you expose specific services (such as HTTP/HTTPS, SSH) via Tailscale's infrastructure to the public internet, but only through Tailscale-managed relays, not directly through your ISP's network. This means that you don't open arbitrary ports on your router or rely on your ISP's configuration to accept inbound connections. Instead, Tailscale handles routing traffic to the appropriate service.

However, this is not the same as traditional port forwarding. Funnel doesn’t allow you to open any arbitrary incoming port to your home network from the internet. It’s only for specific services managed through the Tailscale network.

So, can you expose services to the public internet using Tailscale?

Yes, but only via Tailscale Funnel, which still relies on Tailscale’s infrastructure to manage this. The ability to expose services like HTTP/HTTPS to the public internet is there, but it’s limited to services that are compatible with Funnel and routed via Tailscale’s relays.

To answer your question more directly:

No, you cannot directly open any arbitrary port to the public internet using Tailscale (as you would with typical port forwarding).

Yes, you can use Tailscale Funnel to expose certain services to the public internet, but these services are routed through Tailscale’s infrastructure, not directly through your own ISP or router.

What to do if you want public access to a service:

If your ISP blocks ports and you want public access to a service behind Tailscale, Funnel can potentially allow this for supported services (HTTP/S, SSH, etc.).

You would need to configure Funnel specifically for each service you want to expose. Tailscale will then give you a public URL for that service (like yourdevice.tailnet.ts.net).

Summarizing:

Tailscale Funnel is for exposing services like web servers or SSH to the public internet via Tailscale-managed relays.

This is a controlled method, and it doesn't involve traditional port forwarding or port opening on your ISP’s side.

If you want to use public internet access for services, it’s possible through Funnel, but it's not as unrestricted as traditional port forwarding.

I hope this clears things up. Let me know if you need any help with setting up Tailscale Funnel!
