---
source_url: "https://chatgpt.com/c/68852faf-95d8-8006-aa63-d9f058cb7616"
conversation_id: "68852faf-95d8-8006-aa63-d9f058cb7616"
title: "Fix Foundry VTT Docker"
extracted_at: "2026-06-29T14:10:43.560Z"
message_count: 4
provenance: auth-ui
---

# Fix Foundry VTT Docker

Source: [ChatGPT conversation](https://chatgpt.com/c/68852faf-95d8-8006-aa63-d9f058cb7616)

## User

2025-07-26T19:42:03.233635113Z Entrypoint | 2025-07-26 19:42:03 | [info] No Foundry Virtual Tabletop installation detected.
2025-07-26T19:42:03.235124320Z Entrypoint | 2025-07-26 19:42:03 | [info] Using CONTAINER_CACHE: /data/container_cache
2025-07-26T19:42:03.241884715Z Entrypoint | 2025-07-26 19:42:03 | [error] Unable to install Foundry Virtual Tabletop!
2025-07-26T19:42:03.242895080Z Entrypoint | 2025-07-26 19:42:03 | [error] Either set FOUNDRY_RELEASE_URL.
2025-07-26T19:42:03.244063206Z Entrypoint | 2025-07-26 19:42:03 | [error] Or set FOUNDRY_USERNAME and FOUNDRY_PASSWORD.
2025-07-26T19:42:03.245150211Z Entrypoint | 2025-07-26 19:42:03 | [error] Or set CONTAINER_CACHE to a directory containing foundryvtt-13.346.zip


how to fix this in docker-compose.yml? web-search the correct values and/or how to actually set them correctly

Show more

## Assistant

You are encountering this error because the container cannot find any valid Foundry VTT installation method — you must specify one of the following in your docker-compose.yml:

FOUNDRY_RELEASE_URL pointing to a temporary Linux/Node.js zip download link

OR both FOUNDRY_USERNAME and FOUNDRY_PASSWORD for account-based install

OR CONTAINER_CACHE pointing to a local zip file (e.g. foundryvtt‑13.346.zip)

Below is a working example using credentials (method 2), which is simpler and recommended:

YAML
version: '3.8'
services:
  foundry:
    image: felddy/foundryvtt:13
    container_name: foundry
    user: "1000:1000"       # Match your host permissions if needed
    volumes:
      - ./foundry_data:/data
    ports:
      - "30000:30000"
    environment:
      - FOUNDRY_USERNAME=your_email_or_username
      - FOUNDRY_PASSWORD=your_password
      - FOUNDRY_ADMIN_KEY=your_admin_pass
      - CONTAINER_PRESERVE_CONFIG=true
      - TZ=America/Chicago

Alternatively, using a presigned download URL (method 1):

YAML
environment:
  - FOUNDRY_RELEASE_URL=https://your_timed_url_for_linux_nodejs.zip
  - FOUNDRY_ADMIN_KEY=your_admin_pass
  - CONTAINER_PRESERVE_CONFIG=true
  - TZ=America/Chicago
🛠️ Common pitfalls & how to avoid them
Incorrect OS file

If you accidentally supplied a Windows installer link, the container will treat it as a .zip and fail. In that case you may need to clear out your /data/container_cache to remove the bad file before restart 
reddit.com
+11
github.com
+11
foundryvtt.wiki
+11
github.com
+2
github.com
+2
.

Permissions

Since Foundry v13 runs as a non-root process (UID/GID 1000:1000 by default), your mounted data folder on the host must have compatible ownership or be run under a matching user: directive in docker-compose.yml (e.g., user: "1000:1000" or your own UID:GID) 
reddit.com
.

✅ What to do next

Choose either credentials or release URL method.

Remove CONTAINER_CACHE setting if not using it.

Make sure your volume directory (./foundry_data) is writable by the container UID.

Optionally set CONTAINER_PRESERVE_CONFIG=true to avoid config regeneration.

Launch with docker compose up -d and monitor logs.

If you continue to see:

[error] Either set FOUNDRY_RELEASE_URL.
[error] Or set FOUNDRY_USERNAME and FOUNDRY_PASSWORD.
[error] Or set CONTAINER_CACHE…

that means none of the required methods was correctly passed into the container — double‑check your environment: section.

Let me know if you hit further errors logged in the container log!

## User

the placeholders confuse me. What's a VALID value i can put in? does it need to point to some externally-hosted thing? what's the release url need to point to?

## Assistant

Great question! Here’s a clear breakdown:

1. FOUNDRY_RELEASE_URL

This must be a direct download link to a Linux/Node.js zip file for Foundry VTT.

This is typically a temporary (presigned) URL you get from Foundry’s own download service after logging in with your account on their website.

Example (fake link for illustration):

https://foundryvtt.com/releases/13.346/linux-foundryvtt-13.346.zip?token=abc123xyz

The container will download and unzip this on startup.

Important:
You cannot just use a generic link to the Foundry website or any Windows installer ZIP — it must be the correct Linux/Node zip archive.

2. FOUNDRY_USERNAME and FOUNDRY_PASSWORD

These are your actual Foundry account credentials (email/username and password).

If you provide these, the container will log into Foundry’s servers and fetch the correct Linux build for you automatically.

Example:

YAML
FOUNDRY_USERNAME: "your_email@example.com"
FOUNDRY_PASSWORD: "yourSecurePassword123"

Make sure your Foundry account owns a license.

3. CONTAINER_CACHE

This is a path inside the container where you already have a valid Foundry ZIP archive.

You can manually download the correct Linux ZIP from your Foundry account page, place it in a directory on your host, and mount it inside the container.

Example:

YAML
volumes:
  - ./foundry_zip_cache:/data/container_cache

Where ./foundry_zip_cache/foundryvtt-13.346.zip exists locally.

TL;DR — What should you do?

Simplest: Use your Foundry username & password in docker-compose.yml:

YAML
environment:
  - FOUNDRY_USERNAME=your_email@example.com
  - FOUNDRY_PASSWORD=your_password_here
  - FOUNDRY_ADMIN_KEY=someadminkey123

If you want to use release URL (less common):

Log into your Foundry account on foundryvtt.com

Go to Download page

Grab the Linux (Node.js) .zip link (sometimes available via “direct download” or by inspecting the network tab)

Use that as FOUNDRY_RELEASE_URL

If you want, I can help you create a full example docker-compose.yml using either method — just ask!
