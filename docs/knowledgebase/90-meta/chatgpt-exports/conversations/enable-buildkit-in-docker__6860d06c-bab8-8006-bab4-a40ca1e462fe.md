---
source_url: "https://chatgpt.com/c/6860d06c-bab8-8006-bab4-a40ca1e462fe"
conversation_id: "6860d06c-bab8-8006-bab4-a40ca1e462fe"
title: "Enable BuildKit in Docker"
extracted_at: "2026-06-29T16:32:15.902Z"
message_count: 2
provenance: auth-ui
---

# Enable BuildKit in Docker

Source: [ChatGPT conversation](https://chatgpt.com/c/6860d06c-bab8-8006-bab4-a40ca1e462fe)

## User

Docker Compose is configured to build using Bake, but buildkit isn't enabled


how to fix this error

## Assistant

The error:

Docker Compose is configured to build using Bake, but buildkit isn't enabled

means that you're trying to use Docker Buildx Bake
 (which requires BuildKit), but Docker BuildKit is not enabled in your environment.

✅ To Fix This

You need to enable BuildKit. Here's how:

1. Enable BuildKit via environment variable (recommended)

In the shell or terminal before you run docker compose build, set:

Bash
export DOCKER_BUILDKIT=1

Then run your command again:

Bash
docker compose build

You can also prepend it like:

Bash
DOCKER_BUILDKIT=1 docker compose build
2. Enable BuildKit permanently (optional)

Edit or create the Docker daemon config file:

Linux/macOS: /etc/docker/daemon.json

Windows: C:\ProgramData\Docker\config\daemon.json

Add:

JSON
{
  "features": {
    "buildkit": true
  }
}

Then restart Docker:

Bash
sudo systemctl restart docker

Or restart Docker Desktop on macOS/Windows.

3. Verify it's working

You can confirm BuildKit is active by running:

Bash
docker info | grep -i buildkit

You should see:

BuildKit: true

Let me know if you’re using a CI/CD pipeline or Docker Desktop and want help enabling BuildKit there too.
