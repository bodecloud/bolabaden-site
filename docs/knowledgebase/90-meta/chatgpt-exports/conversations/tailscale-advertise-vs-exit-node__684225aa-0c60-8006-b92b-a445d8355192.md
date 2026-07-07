---
source_url: "https://chatgpt.com/c/684225aa-0c60-8006-b92b-a445d8355192"
conversation_id: "684225aa-0c60-8006-b92b-a445d8355192"
title: "Tailscale Advertise vs Exit Node"
extracted_at: "2026-06-29T14:42:30.790Z"
message_count: 2
provenance: auth-ui
---

# Tailscale Advertise vs Exit Node

Source: [ChatGPT conversation](https://chatgpt.com/c/684225aa-0c60-8006-b92b-a445d8355192)

## User

sudo tailscale up --accept-routes --advertise-exit-node --advertise-routes=10.76.0.0/16,172.17.0.0/16,100.72.149.123/32

what is the difference between an advertised exit node, and advertising routes??

also is this just the 'advertised' information or ist his actually OPENING those routes and ALLOWING an exit node? quite unclear. e.g. in docker swarm/kubernetes the 'advertised' ip is always just the unvalidated plainstring address that's sent to the client. neither kubernetes/docker validate it.

So advertise in this context is weird.

if i'm advertising e.g. 0.0.0.0/0 how is that any differnt than an exit node though?
Show more

## Assistant

You're asking a very good question — the terminology around "advertise" in Tailscale can be confusing, especially if you're coming from Docker/Kubernetes where "advertise" often just means "here's some metadata, use it if you want."

In Tailscale, “advertise” actually means “offer to provide”, but does not activate the service by itself. Let’s break down what each piece of your command means and clarify how routes and exit nodes differ.

🔄 --advertise-routes=...

This tells Tailscale:

“I have access to these routes, and I’m offering to route packets to these networks for others on the tailnet.”

You’re saying this node can route traffic to 10.76.0.0/16, 172.17.0.0/16, and 100.72.149.123/32.

But: nobody can actually use this node as a router until you explicitly allow it as a router in the Tailscale admin panel (or via ACLs with auto-approvals).

So it's not like Docker's unvalidated metadata — in Tailscale, advertising routes creates a potential router, but no traffic is routed until approved.

🌐 --advertise-exit-node

This means:

“I'm offering to act as a gateway to the internet (exit node) for other nodes on the tailnet.”

So this node is volunteering to forward all traffic (i.e., 0.0.0.0/0) on behalf of others — essentially acting as a VPN gateway.

Again: this does not activate the exit node by itself. Another node would have to run:

Bash
tailscale up --exit-node=<this-node>

And this also needs to be approved in the admin panel (just like subnet routers).

✅ --accept-routes

This one is for this node. It tells Tailscale:

“If another node is advertising subnet routes, I want to use them.”

So it’s like opting in to use advertised subnet routers (once they’re approved).

🧠 So what’s the difference?
Concept	Purpose	Traffic Type	Needs Approval?	Who uses it?
advertise-routes	Subnet routing	To specific subnets	✅ Yes	Other tailnet nodes
advertise-exit-node	Exit node	All internet-bound traffic (0.0.0.0/0)	✅ Yes	Other tailnet nodes
accept-routes	Use others’ routes	Whatever others advertise	❌ No (you opt in)	This node
🔥 So is advertising 0.0.0.0/0 just the same as advertising an exit node?

No — they’re different things.

advertise-routes=0.0.0.0/0 would not trigger Tailscale’s exit-node behavior. It would try to advertise routing for the whole internet, but other nodes won’t treat it as a Tailscale exit node.

--advertise-exit-node is special and has exit-node semantics: DNS handling, split tunneling rules, policy enforcement, etc.

If you want to be a proper VPN gateway for all traffic, you must use --advertise-exit-node, not just advertise 0.0.0.0/0.

🧩 Summary

"Advertise" in Tailscale = offer to handle traffic for these routes or act as an exit node.

Routes/Exit nodes must be approved in the admin console before others can use them.

Advertise ≠ activate by default, unlike some looser systems like Kubernetes/Docker’s use of the word.

Let me know if you'd like a diagram to visualize the relationships — subnet routes vs. exit nodes.
