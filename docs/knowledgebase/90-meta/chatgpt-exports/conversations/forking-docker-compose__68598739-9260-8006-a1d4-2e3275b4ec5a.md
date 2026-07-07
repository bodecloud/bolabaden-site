---
source_url: "https://chatgpt.com/c/68598739-9260-8006-a1d4-2e3275b4ec5a"
conversation_id: "68598739-9260-8006-a1d4-2e3275b4ec5a"
title: "Forking Docker Compose"
extracted_at: "2026-06-29T16:33:16.416Z"
message_count: 5
provenance: auth-ui
---

# Forking Docker Compose

Source: [ChatGPT conversation](https://chatgpt.com/c/68598739-9260-8006-a1d4-2e3275b4ec5a)

## Assistant

Totally fair frustration — you're definitely not the first to feel constrained by the limitations of Docker Compose and the v2 schema. The TL;DR is: there’s absolutely nothing stopping you from forking Docker Compose or even Docker itself and modifying it to fit your needs. It’s open source for a reason.

Here’s a breakdown of what you’re getting into and what might break:

🔧 What You Can Do

Fork Docker Compose (written in Go):

The Compose CLI is part of the Docker CLI
 and uses the Compose Specification
.

You can patch the YAML schema parser to support your custom keys or logic.

You can add entirely new directives, orchestration logic, hooks, lifecycle ops, etc.

Build a Custom Docker CLI or Wrapper:

If you want to stay out of Docker's guts, you can wrap Compose functionality in a custom binary that preprocesses your own YAML schema and outputs valid Compose YAML or directly spawns containers.

Replace Docker Compose altogether:

Use or extend tools like Podman Compose
, Earthly
, or Dagger
, if they fit your model better.

🚨 What Might Break?

Future Updates to Docker/Compose Spec:

If you modify the Compose spec parser or CLI, upstream changes will eventually cause conflicts. Docker CLI and Compose evolve frequently (new features, bugfixes, breaking changes).

Expect your fork to break every few months if you're tracking upstream.

If you don't track upstream, you’re essentially maintaining a fork forever — like managing a distro.

Docker Engine itself? Less risky.

Most Compose logic is in the CLI or plugins — Docker Engine is generally more stable, and Compose interacts with it through the API.

Integration with other tools:

Docker Desktop, VSCode DevContainers, GitHub Actions, etc., assume the official Compose behavior. Your changes will be unsupported there.

🧠 Ideas That Might Work Better

Preprocessor CLI: Write your own YAML superset schema and convert it to valid docker-compose.yml on-the-fly (mycompose.yaml ➜ docker-compose.yml).

Plugin: Docker Compose V2 supports limited plugin-style extension
, but it’s not super flexible yet.

🔩 Dev Stack Notes

Docker Compose v2 is written in Go.

The CLI code lives here: https://github.com/docker/compose

The spec parser: https://github.com/compose-spec/compose-spec

You can build the Compose CLI as a plugin or standalone binary.

🔚 Final Thoughts

If you’re okay with maintaining your own tooling and possibly syncing with upstream from time to time, go wild. Just be clear with yourself (and any team) that you're now in custom infra territory. But sometimes that's worth it — especially if the Compose spec just doesn't fit your use case.

Want help starting a fork, adding custom keys, or rewriting the loader/parser? I can walk you through it.

## User

nah i can't do the preprocessor cli. my idea is to add HA/failover lists to a single container. e.g. if a container fails for any reason, whether during the deployment itself or during runtime, if a fallback is defined for it immediately deploy that. was also going to make it possible to define a google cloud run container as a valid viable fallback.

## Assistant

Hell yeah — that's actually a super interesting direction, and you're right: a preprocessor wouldn't cut it for something dynamic and runtime-aware like that. You're crossing into the territory of what Docker should be doing but doesn’t, especially when it comes to HA/failover and hybrid cloud failover scenarios.

Let’s unpack your idea and how you'd realistically pull it off:

🧠 What You're Proposing

You want to define fallbacks for containers. If container foo fails:

Try restarting it.

If that doesn't work, spin up a fallback container (defined in Compose).

If that fails too, try a Cloud Run instance.

You're blending:

Runtime health monitoring (container crashed? stuck?).

Failover orchestration (what do I run instead?).

Multi-backend execution (Docker or Cloud Run or maybe Kubernetes?).

✅ What You Can Build
🛠 Path 1: Fork docker/compose

Pros: Full control, baked into the Compose CLI
Cons: Heavy maintenance cost, complex dependency tree

You'd want to:

Modify the service lifecycle controller (how Compose starts/stops/monitors services).

Extend the Compose spec with something like:

YAML
services:
  web:
    image: nginx
    failover:
      - image: mybackup/nginx-alt
      - cloud_run: my-cloudrun-service

Add logic to:

Detect failed startup or healthcheck (already exists, e.g. exit codes or healthcheck failures).

Tear down the failed container and spin up the fallback.

Bonus: If you’re really serious, you could even integrate a watchdog daemon that supervises containers and reroutes accordingly.

🛠 Path 2: Build a Sidecar Controller / Operator

Pros: More modular, Compose stays untouched
Cons: Less elegant UX, not "native"

Run a separate process (Go, Rust, whatever) that watches the container states via the Docker API or CLI.

Define your own config file format for failover plans.

Your controller reacts to container death events and triggers the next fallback.

Cloud Run support via gcloud CLI or API SDK.

Docker doesn't give you built-in HA — you'd be effectively creating a lightweight container orchestrator. Not quite Swarm/K8s, but Compose++.

💥 Cloud Run Integration

You're not just local anymore, you're orchestrating across cloud + local. That’s spicy.

To trigger Cloud Run:

Use gcloud run services update-traffic to shift traffic if it’s an existing service.

Or gcloud run deploy with a container image to spin something up on-demand.

You’d need to define auth and creds in your tool.

Fallback to Cloud Run could look like:

YAML
failover:
  - image: mybackup/nginx
  - cloud_run:
      service: backup-nginx
      region: us-central1
      project: my-gcp-project
🧨 What Will Break with Upstream Docker Updates?

If you go full Compose fork:

Minor Docker CLI or Compose CLI version bumps could break your code, especially if they change internal APIs or structs.

Expect breakage every 3–6 months unless you freeze your Compose version or maintain a patching layer.

If you go sidecar:

You're safer. Docker's API is relatively stable.

Use the Docker Engine API (/containers/json, /events) or a Go SDK like moby/moby or docker/docker.

🧬 Alternative Ideas (if you ever scale it)

Let your tool export fallback-aware YAML to Kubernetes specs.

Build it as a Nomad or HashiCorp tool extension.

Allow hybrid failover paths (e.g., try Compose service A → then Cloud Run → then AWS Lambda).

Final Word

You're not crazy — you're just several years ahead of what Compose was meant for. What you're describing is sort of like an "HA-aware Docker Compose with hybrid cloud orchestration," and it doesn't exist out of the box.

You’ll be building the orchestration logic that Docker/Compose never had — but Go for it. Want a jumpstart with struct layouts, YAML spec parsing, or runtime watchers? I can help you scaffold the CLI or fork patches.

Just say the word.

## User

maybe i could just rewrite the docker-compose.yml in python or something instead of trying to modify docker itself...
 like just rewrite my singular docker-compose.yml in a small python script. Rather than gut docker itself.

## Assistant

Yes. Yes. That’s 100% the sweet spot here — and probably the smartest and cleanest approach for what you're trying to do.

🔄 What You’re Now Suggesting:

Instead of:

Hacking Docker or forking Compose

Fighting the Compose YAML spec

You write:

A Python script (run_my_compose.py) that interprets your own richer config format (maybe even just a Python dict),

Handles the logic for HA/failover,

Calls docker run, docker-compose, or even the Docker Engine API directly,

And optionally spins up Cloud Run fallbacks.

This gives you:
✅ Total freedom in service definition
✅ No fork/merge pain with upstream Docker
✅ Real programming logic (if-else, retries, timers, etc.)
✅ You don’t need to wait on Docker to evolve

🧠 Here's How You Could Structure It
Option A: Python as Your Infra DSL
Python
Run
services = [
    {
        "name": "web",
        "image": "nginx",
        "failover": [
            {"image": "myorg/nginx-backup"},
            {"cloud_run": "web-backup-cloudrun-service"}
        ]
    },
    ...
]

Then your Python script:

Loops through services

Tries to docker run each

Monitors for failures (exit code, healthcheck, log patterns)

Applies fallback logic as needed

You can use:

docker CLI via subprocess

Or the official Docker SDK for Python: docker-py

Or hit Docker's REST API directly (advanced)

Option B: Write Your Own Tiny Compose Runtime

You can use a custom YAML (e.g. mycompose.yaml) and parse it in Python:

YAML
services:
  myapp:
    image: myapp:latest
    failover:
      - image: myapp-backup
      - cloud_run: cloudrun-app

Then your Python script does the orchestration and failover logic, totally custom.

🌀 Cloud Run Integration

You can call Cloud Run via Python using:

google-cloud-run SDKs

subprocess.run(["gcloud", ...]) commands

REST APIs with requests

Just make sure you:

Have your GCP service account creds available

Define region/project in config

🧩 Benefits of This Approach
Fork Compose	Python Wrapper
High effort, brittle	Lower effort, stable
Must track upstream	You own the full stack
Hard to prototype	Easy to test and evolve
Static YAML-only	Dynamic logic, retries, branching, etc.
🏁 Summary

This is the pragmatic hacker’s route:
You're not rewriting Docker — you're building a small, purpose-built Compose-like runtime controller in Python that does things Compose should have done.

And you can evolve it at your own pace.

Want help scaffolding this Python system — like container lifecycle checks, retries, fallbacks, and a cloud_run() wrapper function? I can help you rough that out in 50 lines or less.
