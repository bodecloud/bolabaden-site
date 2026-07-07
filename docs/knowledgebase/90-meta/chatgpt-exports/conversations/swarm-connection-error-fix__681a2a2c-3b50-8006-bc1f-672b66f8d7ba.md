---
source_url: "https://chatgpt.com/c/681a2a2c-3b50-8006-bc1f-672b66f8d7ba"
conversation_id: "681a2a2c-3b50-8006-bc1f-672b66f8d7ba"
title: "Swarm Connection Error Fix"
extracted_at: "2026-06-29T14:51:17.040Z"
message_count: 5
provenance: auth-ui
---

# Swarm Connection Error Fix

Source: [ChatGPT conversation](https://chatgpt.com/c/681a2a2c-3b50-8006-bc1f-672b66f8d7ba)

## Assistant

You're right that the error seems misleading, especially since you've validated port 2377 is open and reachable both locally and from the swarm nodes via Tailscale.

However, **Traefik's Swarm provider requires connecting to the Docker Swarm manager API via the Docker Engine API, not just checking that TCP port 2377 is open. The error suggests it’s trying to talk to a Docker API over TCP, but failing because:

🔧 Root Cause

You're using:

YAML
providers:
  swarm:
    endpoint: "tcp://127.0.0.1:2377"

But port 2377 is for the Swarm cluster management port, not the Docker Engine API.

tcp://127.0.0.1:2377 ≠ Docker API

Docker's API listens by default on /var/run/docker.sock, not on a TCP socket unless you explicitly configured Docker to expose it via something like:

Bash
dockerd -H tcp://0.0.0.0:2375 -H unix:///var/run/docker.sock
✅ Solution
🔁 Option 1: Use the socket (recommended and default)

If Traefik is on a Swarm manager node, it can use the local Docker socket:

YAML
providers:
  swarm:
    endpoint: "unix:///var/run/docker.sock"

And make sure you're mounting the socket in your Traefik container — which you already are:

YAML
- ${DOCKER_SOCK:-/var/run/docker.sock}:/var/run/docker.sock

Then the error should go away.

🔁 Option 2: Use a TCP endpoint (if you must)

If you still want TCP for some reason, you must configure Docker Engine to listen on that port:

Edit or override Docker service startup (e.g., via systemd):

Bash
# /etc/docker/daemon.json
{
  "hosts": ["unix:///var/run/docker.sock", "tcp://0.0.0.0:2375"]
}

Then restart Docker:

Bash
sudo systemctl restart docker

Then set:

YAML
providers:
  swarm:
    endpoint: "tcp://127.0.0.1:2375"

But be very cautious — exposing Docker API via TCP is a huge security risk unless tightly firewalled and authenticated.

🧪 How to Verify It's Fixed

Once you've updated the provider endpoint to the correct value (either the socket or a working TCP Docker API), restart Traefik and check logs. You should no longer see:

error during connect: Get "http://207.211.189.95:2377/v1.24/version": dial tcp ...

Would you like a secure example using unix:///var/run/docker.sock in your full config?

## User

idk what the issue was but removing 'endpoint' fixed it.

Having another weird issue now. When I deploy teh stack with swarm instead of normal docker, the .env file in the same location as docker-compose.yml isn't being read? why is this and how to use it when deploying the swarm stack?

## Assistant

You're totally right to notice the .env behavior differs between docker-compose and docker stack deploy — and that difference often causes surprises.

🧨 The Issue

When using:

Bash
docker-compose up

The .env file in the same directory as docker-compose.yml is automatically loaded. ✅

But when using:

Bash
docker stack deploy -c docker-compose.yml mystack

Docker does NOT automatically load the .env file. ❌

Instead, it only substitutes variables from the current shell environment, not from the .env file — unless you explicitly source it.

✅ The Fix

Before you run docker stack deploy, explicitly export the variables from .env into your shell:

Bash
set -a
source .env
set +a
docker stack deploy -c docker-compose.yml mystack

Or in one line:

Bash
export $(grep -v '^#' .env | xargs) && docker stack deploy -c docker-compose.yml mystack
🔒 Optional: Make It More Reliable

To avoid forgetting this step, you can:

Use a wrapper script (deploy.sh) with the above logic.

Avoid relying on .env entirely and use .env-style files to generate a docker-compose.yml dynamically with tools like envsubst.

💡 Bonus Tip: No support for env_file in Swarm

Note that env_file: inside services is also ignored by docker stack deploy. You must either:

Use environment: explicitly with vars

Or load them via shell as shown above

Would you like a short script to safely load your .env and deploy?

## User

nah source won't work. fuck i hate when i'm recommended to source .env shit never works for me ever in my whole life:

ubuntu@beatapostapita:~/my-media-stack$ export $(grep -v '^#' .env | xargs) && docker stack deploy -c docker-compose.yml mystack
bash: export: `APIFY-API-TOKEN=<REDACTED_APIFY_API_TOKEN>': not a valid identifier
bash: export: `#': not a valid identifier
bash: export: `#': not a valid identifier
bash: export: `#': not a valid identifier
bash: export: `Options:': not a valid identifier
bash: export: `sqlite,': not a valid identifier
bash: export: `#': not a valid identifier
bash: export: `#': not a valid identifier
bash: export: `#': not a valid identifier
bash: export: `30': not a valid identifier
bash: export: `#': not a valid identifier
bash: export: `15': not a valid identifier
bash: export: `#': not a valid identifier
bash: export: `1': not a valid identifier
bash: export: `#': not a valid identifier
bash: export: `(e.g.': not a valid identifier
bash: export: `http://warp:1080)': not a valid identifier
bash: export: `#': not a valid identifier
bash: export: `Options:': not a valid identifier
bash: export: `jackett,': not a valid identifier
bash: export: `prowlarr,': not a valid identifier
bash: export: `#': not a valid identifier
bash: export: `(seconds)': not a valid identifier
bash: export: `"animetosho",': not a valid identifier
bash: export: `"anirena",': not a valid identifier
bash: export: `"anisource",': not a valid identifier
bash: export: `"bitsearch",': not a valid identifier
bash: export: `"eztv",': not a valid identifier
bash: export: `"internetarchive",': not a valid identifier
bash: export: `"kickasstorrents-to",': not a valid identifier
bash: export: `"kickasstorrents-ws",': not a valid identifier
bash: export: `"knaben",': not a valid identifier
bash: export: `"limetorrents",': not a valid identifier
bash: export: `"nyaasi",': not a valid identifier
bash: export: `"nyaapantsu",': not a valid identifier
bash: export: `"thepiratebay",': not a valid identifier
bash: export: `"therarbg",': not a valid identifier
bash: export: `"torlock",': not a valid identifier
bash: export: `"torrentdownloads",': not a valid identifier
bash: export: `"torrentcore",': not a valid identifier
bash: export: `"torrentdownload",': not a valid identifier
bash: export: `"yts"]': not a valid identifier
bash: export: `#': not a valid identifier
bash: export: `(seconds)': not a valid identifier
bash: export: `#': not a valid identifier
bash: export: `(instead': not a valid identifier
bash: export: `only)': not a valid identifier
bash: export: `#': not a valid identifier
bash: export: `-1': not a valid identifier
bash: export: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzd2FybXBpdC1hcGkiLCJleHAiOm51bGwsImlhdCI6MTc0MjM2MzI2NCwidXNyIjp7InVzZXJuYW1lIjoiYnJ1bm5lcjU2Iiwicm9sZSI6ImFkbWluIn0sImp0aSI6ImVmNDdmZTY1LTMxZWQtNDFmMS05NWZlLWUyNDU1ZDVmYTFlMSJ9.A-jYNMrZhPfdsxkFHrUkK0J9llwT7FefTl1VZYTwL_g': not a valid identifier


source .env has similar issues.
Show more

## Assistant

Yeah, that error storm is totally understandable — and super common when .env files are more than just clean KEY=value pairs.

🧨 Why source and export $(grep...) fail:

They assume your .env is pure like:

env
API_KEY=abc123
PORT=8080

But yours probably has:

Comments inline or block-style

Empty lines

JSON, array-like, or YAML-style syntax

Complex values with spaces or quotes

That breaks both source and export.

✅ Better Fix: Extract only valid lines

Here’s a reliable way to only grab clean, exportable lines from .env:

Bash
grep -E '^[A-Za-z_][A-Za-z0-9_]*=.*' .env > .env.cleaned
set -a
source .env.cleaned
set +a
docker stack deploy -c docker-compose.yml mystack

This filters out:

Comments

Blank lines

Messy values

Or, as a one-liner (safer):
Bash
set -a; grep -E '^[A-Za-z_][A-Za-z0-9_]*=.*' .env > /tmp/clean.env && source /tmp/clean.env && set +a && docker stack deploy -c docker-compose.yml mystack
🔁 Long-term Option: Inline vars with envsubst

If you want to get fancy and avoid this pain forever, use templating:

Rename docker-compose.yml → docker-compose.yml.template

Replace vars like ${API_KEY} as normal

Then run:

Bash
envsubst < docker-compose.yml.template > docker-compose.yml
docker stack deploy -c docker-compose.yml mystack

Want me to help refactor your .env to a "safe" version or generate a cleaner one dynamically?
