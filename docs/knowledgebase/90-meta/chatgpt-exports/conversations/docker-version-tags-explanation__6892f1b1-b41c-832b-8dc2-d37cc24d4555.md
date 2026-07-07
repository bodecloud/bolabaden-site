---
source_url: "https://chatgpt.com/c/6892f1b1-b41c-832b-8dc2-d37cc24d4555"
conversation_id: "6892f1b1-b41c-832b-8dc2-d37cc24d4555"
title: "Docker version tags explanation"
extracted_at: "2026-06-29T14:06:31.769Z"
message_count: 2
provenance: auth-ui
---

# Docker version tags explanation

Source: [ChatGPT conversation](https://chatgpt.com/c/6892f1b1-b41c-832b-8dc2-d37cc24d4555)

## User

dokku/dokku:0.35.20

if i have a docker image like the above, is it possible to specify e.g. only patch/minor versions? or how to specify e.g. that i want anything 0.0.0-1.x.x, but NOT 2.x.x?

## Assistant

Great question! When you specify Docker image tags like dokku/dokku:0.35.20, you’re locking in a specific version exactly (in this case, 0.35.20).

Docker itself does not support semantic version range specifications or wildcards directly in the image tag. The tag is just a string, so you can only pull an exact tag like 0.35.20 or something like 0.35 if the image maintainer pushed a tag with that name.

How to specify version ranges?

Docker tags are static strings — no range or wildcard support in Docker pull commands.

You must specify an exact tag (e.g., 0.35.20) or a tag that the image maintainer provides (e.g., 0.35, or latest).

What about semantic versioning?

If you want to:

Always get the latest patch in the 0.35.x minor version (e.g., any 0.35.* patch),

Or get any patch/minor version within 0.x.x but NOT 1.x.x or 2.x.x,

this is only possible if the image maintainer provides tags for these ranges, e.g.:

dokku/dokku:0.35 → always points to latest 0.35.x

dokku/dokku:0 → always points to latest 0.x.x

dokku/dokku:latest → points to the latest overall release

If such tags don’t exist, Docker can’t resolve that automatically.

How to handle this yourself?

Check what tags exist on Docker Hub:

You can see all tags for the image here:

https://hub.docker.com/r/dokku/dokku/tags

Pull the specific tag or a "range" tag if available:

For example, if dokku/dokku:0.35 exists and is updated, use that to get the latest patch.

Automate the logic outside Docker:

Write a script that queries Docker Hub API for all tags matching a pattern.

Parse tags to find the highest patch/minor version you want.

Pull that exact tag.

Summary
Feature	Docker tags	Your need
Exact version tag	✅	dokku/dokku:0.35.20
Partial tag (like 0.35)	✅ only if maintained	dokku/dokku:0.35 if exists
Version ranges (e.g., any 0.x.x but not 1.x.x)	❌ no native support	Use scripts or rely on maintained tags

If you want, I can help you write a small script to fetch tags from Docker Hub and pick the right one based on semver! Would you like that?
