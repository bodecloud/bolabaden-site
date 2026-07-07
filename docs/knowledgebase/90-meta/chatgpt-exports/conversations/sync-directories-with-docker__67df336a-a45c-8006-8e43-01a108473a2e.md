---
source_url: "https://chatgpt.com/c/67df336a-a45c-8006-8e43-01a108473a2e"
conversation_id: "67df336a-a45c-8006-8e43-01a108473a2e"
title: "Sync directories with Docker"
extracted_at: "2026-06-29T15:19:44.984Z"
message_count: 2
provenance: auth-ui
---

# Sync directories with Docker

Source: [ChatGPT conversation](https://chatgpt.com/c/67df336a-a45c-8006-8e43-01a108473a2e)

## User

your response should be highly specific to the exhaustive docker compose yml i need to do the following:

Bind mount the folder /home/brunner56/my-media-stack/data/media to /home/brunner56/my-media-stack/downloads

I simply want to keep two folders in perfect sync creating hardlinks when necessary through a watchdog. Specifically and exclusively find a widely adopted container people use for this that's safe.
Show more

## Assistant

To synchronize the directories /home/brunner56/my-media-stack/data/media and /home/brunner56/my-media-stack/downloads using Docker, you can utilize a widely adopted and safe approach involving the rsync utility within a Docker container. This method ensures that the two directories remain in sync, creating hard links when necessary, and can be automated with a file-watching mechanism.

Steps to Achieve Directory Synchronization:

Set Up a Docker Container with rsync:

Create a Docker container that runs rsync to synchronize the directories. You can use a lightweight base image like Alpine Linux and install rsync within it.

Dockerfile:

Dockerfile
FROM alpine:latest
RUN apk add --no-cache rsync inotify-tools
COPY sync.sh /usr/local/bin/sync.sh
RUN chmod +x /usr/local/bin/sync.sh
ENTRYPOINT ["sync.sh"]

sync.sh:

Bash
#!/bin/sh
while inotifywait -r -e modify,create,delete /downloads; do
  rsync -a --link-dest=/downloads/ /downloads/ /media/
done

This script uses inotifywait to monitor changes in the /downloads directory and runs rsync to synchronize changes to the /media directory, creating hard links when possible.

Configure the Docker Compose File:

Use Docker Compose to define the services and bind mount the host directories to the container.

docker-compose.yml:

YAML
version: '3.8'
services:
  sync-service:
    build: .
    volumes:
      - /home/brunner56/my-media-stack/data/media:/media
      - /home/brunner56/my-media-stack/downloads:/downloads

This configuration ensures that the host directories are mounted into the container, allowing rsync to synchronize them.

Build and Run the Docker Container:

Build the Docker image and start the container using Docker Compose.

Bash
docker-compose up --build -d

This command builds the image and runs the container in detached mode.

Important Considerations:

File System Compatibility: Ensure that both directories reside on the same file system, as hard links cannot span different file systems or partitions.

Permissions: Verify that the user running the Docker container has appropriate permissions to read and write to both directories.

File System Support: Confirm that your file system supports hard links. Some file systems, such as exFAT, do not support hard links.

By following these steps, you can effectively synchronize the specified directories using Docker, leveraging hard links to maintain consistency between them.
