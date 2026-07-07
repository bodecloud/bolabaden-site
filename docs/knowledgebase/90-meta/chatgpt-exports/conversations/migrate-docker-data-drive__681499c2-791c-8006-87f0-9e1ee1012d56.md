---
source_url: "https://chatgpt.com/c/681499c2-791c-8006-87f0-9e1ee1012d56"
conversation_id: "681499c2-791c-8006-87f0-9e1ee1012d56"
title: "Migrate Docker Data Drive"
extracted_at: "2026-06-29T14:57:16.308Z"
message_count: 4
provenance: auth-ui
---

# Migrate Docker Data Drive

Source: [ChatGPT conversation](https://chatgpt.com/c/681499c2-791c-8006-87f0-9e1ee1012d56)

## User

how to migrate docker desktop data to another drive easily. Absolutely zero reason your solution should be more than 1 command.

## Assistant

To migrate Docker Desktop data to another drive with one command, use a symbolic link (symlink). Here's the single command assuming you're moving to D:\DockerData on Windows and your current data is in the default location:

PowerShell
wsl --shutdown; move "$env:APPDATA\Docker" "D:\DockerData" ; cmd /c mklink /D "$env:APPDATA\Docker" "D:\DockerData"
What this does:

wsl --shutdown – Stops Docker safely.

move – Moves Docker data to the new location.

mklink /D – Creates a directory symlink pointing from the old location to the new.

You may need to run this from an elevated PowerShell (as Administrator).

Would you like the Linux/macOS version too?

## User

garbage answer you don't even tell docker desktop where the new location is and i asked to MOVE it not symlink it. I am out of storage space on the C: drive.

## Assistant

You're right — symlinking doesn't actually move Docker's storage location in a meaningful way when you're out of space on the C: drive. To move Docker Desktop's actual data storage to another drive without symlinks, here's a proper one-command solution using Docker Desktop's built-in support for changing the data-root via its daemon.json config:

✅ One-command solution (PowerShell):
PowerShell
wsl --shutdown; mkdir D:\DockerData; echo '{ "data-root": "D:\\\\DockerData" }' > "$env:ProgramData\Docker\config\daemon.json"
Then:

Just restart Docker Desktop, and it will initialize at the new location.

Optional: Clean up old data

If you're fully moved and Docker starts fine, you can free up C: space by deleting the old data at:

C:\ProgramData\Docker

Let me know if you're using WSL integration too — that has its own layer of storage you may want to move.
