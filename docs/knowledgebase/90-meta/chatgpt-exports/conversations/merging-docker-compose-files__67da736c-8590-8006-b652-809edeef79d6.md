---
source_url: "https://chatgpt.com/c/67da736c-8590-8006-b652-809edeef79d6"
conversation_id: "67da736c-8590-8006-b652-809edeef79d6"
title: "Merging Docker Compose Files"
extracted_at: "2026-06-29T15:21:47.598Z"
message_count: 2
provenance: auth-ui
---

# Merging Docker Compose Files

Source: [ChatGPT conversation](https://chatgpt.com/c/67da736c-8590-8006-b652-809edeef79d6)

## User

I have 50 docker-compose.yml files that are referenced by a singular docker-compose.yml in an include: section. I wish I didn't separate them out into separate files now and I want to go back. Is there a tool that'll merge multiple docker-compose.yml files like this into a singular file?

## Assistant

Yes! You can use docker-compose-config-merge
 or similar tools to merge multiple docker-compose.yml files into one.

Alternatively, if you have yq (a powerful YAML processor) installed, you can merge them yourself using a simple command:

Bash
yq eval-all '. as $item ireduce ({}; . * $item )' docker-compose.yml other-files/*.yml > merged-docker-compose.yml

This will merge all the referenced files into a single merged-docker-compose.yml. If you need more customization, you can also use a Python script with ruamel.yaml to handle the merging programmatically.

Would you like a script for that?
