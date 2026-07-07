---
source_url: "https://chatgpt.com/c/67e0f6c3-8a30-8006-b95f-be2aca04b609"
conversation_id: "67e0f6c3-8a30-8006-b95f-be2aca04b609"
title: "Deploy Stack via Portainer API"
extracted_at: "2026-06-29T15:19:04.214Z"
message_count: 2
provenance: auth-ui
---

# Deploy Stack via Portainer API

Source: [ChatGPT conversation](https://chatgpt.com/c/67e0f6c3-8a30-8006-b95f-be2aca04b609)

## User

I have a compose stack that is ran like this:

docker compose up -d transmission traefik unpackerr whisparr speedtest sonarr sabnzbd readarr radarr qbittorrent prowlarr plex lidarr jellyfin jackett i2p homepage gluetun flaresolverr dozzle deluge decluttarr dashy checkrr cadvisor bazarr autoheal


I'd like it to be compatible with portainer though, so in order to avoid portainer's 'limited' problem it needs to be added to portainer. Is there a way to deploy the stack THROUGH portainer? Like I can easily run a compose.yml that works with portainer, that's not the problem, the problem is once the portainer is running how to pass it the stack without manually going to the gui and creating the stack there? I'd like a snigle command that can docker compose up portainer, then that stack automatically runs the other one.
Show more

## Assistant

Yes! You can deploy your Portainer container using docker compose up and then use the Portainer API to programmatically deploy your stack. Here's how:

Step 1: Deploy Portainer

First, ensure Portainer is running with Docker Compose:

YAML
version: "3.8"

services:
  portainer:
    image: portainer/portainer-ce
    container_name: portainer
    restart: always
    ports:
      - "8000:8000"
      - "9443:9443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - portainer_data:/data

volumes:
  portainer_data:

Run:

Bash
docker compose up -d
Step 2: Deploy the Stack via Portainer API

Once Portainer is running, you can use the Portainer API to deploy your stack without manually using the GUI.

1. Get Portainer API Key

You'll need an API key for authentication. You can generate one in Portainer under "Settings" → "API Keys".

2. Send the Stack to Portainer

Use the following curl command to create a stack via the Portainer API:

Bash
curl -X POST "http://localhost:9000/api/stacks" \
    -H "Content-Type: application/json" \
    -H "X-API-Key: YOUR_PORTAINER_API_KEY" \
    --data-binary @docker-compose.yml

Alternatively, if your stack is a Docker Compose file stored on disk:

Bash
curl -X POST "http://localhost:9000/api/stacks/create" \
    -H "Content-Type: application/json" \
    -H "X-API-Key: YOUR_PORTAINER_API_KEY" \
    --data '{
        "Name": "my_stack",
        "StackFileContent": "'"$(cat docker-compose.yml)"'",
        "EndpointId": 1
    }'
Automating It with a Script

Create a script (deploy.sh) to automate everything:

Bash
#!/bin/bash

# Start Portainer
docker compose up -d

# Wait for Portainer to be ready
sleep 10

# Deploy Stack via Portainer API
curl -X POST "http://localhost:9000/api/stacks/create" \
    -H "Content-Type: application/json" \
    -H "X-API-Key: YOUR_PORTAINER_API_KEY" \
    --data '{
        "Name": "my_stack",
        "StackFileContent": "'"$(cat docker-compose.yml)"'",
        "EndpointId": 1
    }'

Run:

Bash
chmod +x deploy.sh
./deploy.sh

Now, Portainer will start, and your stack will be deployed automatically.

Would you like help refining this further? 🚀
