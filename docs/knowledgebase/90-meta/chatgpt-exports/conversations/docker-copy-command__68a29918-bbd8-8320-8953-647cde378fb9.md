---
source_url: "https://chatgpt.com/c/68a29918-bbd8-8320-8953-647cde378fb9"
conversation_id: "68a29918-bbd8-8320-8953-647cde378fb9"
title: "Docker copy command"
extracted_at: "2026-06-29T14:02:30.751Z"
message_count: 2
provenance: auth-ui
---

# Docker copy command

Source: [ChatGPT conversation](https://chatgpt.com/c/68a29918-bbd8-8320-8953-647cde378fb9)

## User

exact docker command to copy the container's /srv folder to ./srv, where . is the cwd on the host terminal executing the command

## Assistant

You can use the docker cp command for this. Assuming your container is named mycontainer (replace with your actual container name or ID), the exact command would be:

Bash
docker cp mycontainer:/srv ./srv

Explanation:

mycontainer:/srv → path inside the container

./srv → destination path on your host (current working directory)

This will copy the entire /srv folder from the container to a folder named srv in your current directory.

Do you want me to show a version that creates the destination folder if it doesn’t exist automatically?
