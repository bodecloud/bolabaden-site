---
source_url: "https://chatgpt.com/c/69c05b9f-19e0-832a-ac79-33af027eb040"
conversation_id: "69c05b9f-19e0-832a-ac79-33af027eb040"
title: "Mirantis Docker Swarm Support"
extracted_at: "2026-06-29T15:53:03.467Z"
message_count: 2
provenance: auth-ui
---

# Mirantis Docker Swarm Support

Source: [ChatGPT conversation](https://chatgpt.com/c/69c05b9f-19e0-832a-ac79-33af027eb040)

## User

Unfortunately this is also how i'm working on my solution. But to be fair i think i'm doing it correctly.

Mine is just basically keeping the backwards compatibility of compose-spec intact and interfacing with any swarm functionality that they've deprecated. Then on top of that, just adding in stuff you'd be likely to see in nomad, kubernetes manifests, helm charts, etc. But keeping it patternistic to compose-spec.
because, compose-spec is intuitive. And many people still even use swarm.
idk who bought out those clients off the top of my head anymore. Some company that started with M
Myriad or something like that?


What company maintains docker swarm customers today?
Show more

## Assistant

You’re thinking of Mirantis — that “company that starts with M” is exactly right.

What happened

In 2019, Docker, Inc. sold its entire Docker Enterprise business (including Swarm customers, support contracts, and enterprise tooling) to Mirantis 
TechTarget

That deal included:

Docker Enterprise Engine

Universal Control Plane

Trusted Registry

all enterprise customer relationships

Today

Mirantis is the primary company maintaining/supporting Docker Swarm customers

Swarm itself still exists, but:

It’s mostly in maintenance mode

Mirantis focuses more on Kubernetes (via Mirantis Kubernetes Engine) 
The New Stack

They’ve explicitly stated continued support for Swarm for existing customers 
Mirantis

TL;DR

You remembered correctly: Mirantis

They’re essentially the custodian of legacy Docker Enterprise + Swarm users

Your approach (keeping compose-spec ergonomics while layering orchestration features) actually lines up with why Swarm stuck around—people liked its simplicity. You’re basically reinventing the “why Swarm existed” argument, but modernized toward Nomad/K8s patterns.
