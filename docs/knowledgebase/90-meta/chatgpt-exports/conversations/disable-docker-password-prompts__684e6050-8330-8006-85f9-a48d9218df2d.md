---
source_url: "https://chatgpt.com/c/684e6050-8330-8006-85f9-a48d9218df2d"
conversation_id: "684e6050-8330-8006-85f9-a48d9218df2d"
title: "Disable Docker Password Prompts"
extracted_at: "2026-06-29T14:35:45.519Z"
message_count: 2
provenance: auth-ui
---

# Disable Docker Password Prompts

Source: [ChatGPT conversation](https://chatgpt.com/c/684e6050-8330-8006-85f9-a48d9218df2d)

## User

i installed sudo pass init on fedora recently in order to login to docker. Now every like 5 minutes it prompts me to enter a password. How to make it require zero password/prompts whatsoever while still facilitating whatever docker needs for its auth?

## Assistant

The frequent GPG passphrase prompts come from pass using a GPG key that is password-protected. Docker (or other tools) indirectly trigger pass to access secrets, which causes these popups every time the key is needed for signing/decryption.

Goal:

Make Docker login work without frequent GPG passphrase prompts while keeping your security reasonable.

Possible solutions:
1. Use gpg-agent with caching and longer timeout

gpg-agent caches your passphrase for a configurable time, so you don’t need to enter it every 5 minutes.

Check if gpg-agent is running (usually is by default).

Configure the cache timeout in ~/.gnupg/gpg-agent.conf:

Bash
default-cache-ttl 3600
max-cache-ttl 7200

default-cache-ttl is how long (in seconds) the passphrase is cached after use (here, 1 hour).

max-cache-ttl is the max time before you must re-enter the passphrase.

After editing, reload the agent:

Bash
gpgconf --kill gpg-agent
gpg-agent --daemon
2. Use a GPG key without a passphrase (less secure)

If security is less critical, you can remove the passphrase on your GPG key so it never prompts:

Bash
gpg --edit-key YOUR_KEY_ID
# inside the prompt, run:
passwd
# then press Enter twice to remove the passphrase
save

Warning: This reduces security significantly because if someone gets your private key, they can use it without a passphrase.

3. Use docker login with a credential helper instead of pass

Docker supports credential helpers like docker-credential-pass, but you can switch to helpers that don’t require GPG.

For example, use the native docker-credential-store or other helpers:

Bash
docker logout
docker login

Configure Docker to use a different credential store in ~/.docker/config.json:

JSON
{
  "credsStore": "secretservice"
}

Or install and configure a helper of your choice.

Summary:

Best option: Increase gpg-agent cache timeout so you only enter the passphrase once every hour or more.

Less secure: Remove passphrase from your GPG key.

Alternative: Use a Docker credential helper that doesn’t rely on pass or GPG.

Do you want help setting up the gpg-agent caching or switching Docker credential helpers?
