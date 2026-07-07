---
source_url: "https://chatgpt.com/c/681ba270-a1dc-8006-b681-faf165e132d9"
conversation_id: "681ba270-a1dc-8006-b681-faf165e132d9"
title: "Podman Compose External Provider"
extracted_at: "2026-06-29T16:48:53.046Z"
message_count: 5
provenance: auth-ui
---

# Podman Compose External Provider

Source: [ChatGPT conversation](https://chatgpt.com/c/681ba270-a1dc-8006-b681-faf165e132d9)

## Assistant

You're absolutely right to be confused — that message does look like it's referencing Unix-style manual pages, and it's not particularly helpful or clickable in a Windows environment. Let's break it down:

🔍 The Message Explained:
>>>> Executing external compose provider "C:\\Users\\boden\\AppData\\Local\\Microsoft\\WindowsApps\\docker-compose.exe". Please see podman-compose(1) for how to disable this message. <<<<

This means:

Podman is not using its own built-in podman-compose, but instead is delegating to the external Docker Compose binary (in this case, Docker Compose installed via Windows Apps).

The podman-compose(1) bit is a reference to the manual (man) page that would describe the usage of podman-compose. On Linux, you’d run:

man podman-compose

to view that.

But on Windows, you don’t have man, so this message is just a holdover from the Unix/Linux documentation style. It's not clickable or meant to be opened directly — it's more of a "see the manual page for more info" placeholder.

💡 What You Can Do

If you're seeing this message and want to suppress or avoid it:

Use Podman’s own podman-compose tool instead of Docker Compose, or configure it explicitly.

Or, just ignore the message — it's just informational. Your command still runs fine, it's just telling you it's falling back to Docker Compose.

📚 If You Want to Read "podman-compose(1)" Anyway

Since podman-compose is a separate project from Podman itself, you can look up its docs online:

GitHub repo: https://github.com/containers/podman-compose

Podman official docs: https://docs.podman.io/

Search for "podman-compose site:github.com" or "podman-compose site:docs.podman.io" in a browser if you're trying to find a specific option or behavior.

Would you like help configuring Podman to not use Docker Compose externally?

## User

PS C:\Users\boden> winget uninstall -e --id Docker.DockerCompose
No installed package found matching input criteria.

doesn't seem to work. Exact command to uninstall it as recommended by specifically podman-compose(1)? search web

## Assistant

The message you're encountering:

>>>> Executing external compose provider "C:\\Users\\boden\\AppData\\Local\\Microsoft\\WindowsApps\\docker-compose.exe". Please see podman-compose(1) for how to disable this message. <<<<

indicates that Podman is utilizing an external Compose provider, specifically Docker Compose, to execute your podman compose command. The reference to podman-compose(1) is a nod to Unix-style manual pages, suggesting you consult the manual for podman-compose. On Unix systems, you would access this by running man podman-compose. However, since you're operating on Windows without a Unix-like environment, this reference isn't directly actionable.

To address this, you have a couple of options:

Suppress the Warning Message:

You can configure Podman to suppress this warning by setting the compose_warning_logs parameter to false in your containers.conf file. This file dictates various Podman configurations. On Windows, the location of containers.conf can vary, but a common path is:

%USERPROFILE%\.config\containers\containers.conf

If the file doesn't exist, you can create it. Add the following configuration:

INI
[engine]
compose_warning_logs = false

This setting tells Podman not to display the warning about using an external Compose provider. For more details, you can refer to the containers.conf documentation
.

Specify a Different Compose Provider:

If you prefer to use a different Compose provider, such as podman-compose, you can specify it by setting the PODMAN_COMPOSE_PROVIDER environment variable. This directs Podman to use your chosen provider instead of the default. To set this environment variable on Windows:

Temporarily (for the current session):

PowerShell
$env:PODMAN_COMPOSE_PROVIDER = "podman-compose"

Permanently:

You can set it through the System Properties:

Right-click on 'This PC' or 'My Computer

## User

the instructions were to 'Exact command to uninstall it as recommended by specifically podman-compose(1)?' I did not mention anything relevant to a supression. your response was garbage.

## Assistant

On Windows the Store-delivered Docker Compose binary lives under your user’s WindowsApps folder (that’s why you see C:\Users\boden\AppData\Local\Microsoft\WindowsApps\docker-compose.exe), and it isn’t managed by a “traditional” MSI/EXE installer—so winget uninstall won’t find it. Instead you need to remove the Appx package.

Find and remove the Compose package via PowerShell
Open PowerShell as your user (no admin elevation needed for your own packages) and run:

PowerShell
# List the installed package(s) matching Docker Compose
Get-AppxPackage *Docker.DockerCompose*

# Uninstall it for your user
Get-AppxPackage *Docker.DockerCompose* | Remove-AppxPackage

If you want to be absolutely thorough (e.g. if it was ever provisioned for other users), run PowerShell as administrator and do:

PowerShell
# Remove for all users
Get-AppxPackage -AllUsers *Docker.DockerCompose* | Remove-AppxPackage -AllUsers

This will delete the Store-installed docker-compose.exe from your WindowsApps folder 
Microsoft Learn
Super User
.

(Optional) Manually delete the leftover stub
If you still see a zero-byte stub in WindowsApps after the above, you can forcibly remove it:

PowerShell
Remove-Item `
  'C:\Users\boden\AppData\Local\Microsoft\WindowsApps\docker-compose.exe' `
  -Force

After that, podman compose will fall back to Podman’s built-in provider (if you have podman-compose installed) or start showing an error if no other Compose provider exists.

Pro tip: Once the Store version is gone you can install the “pure” Python-based podman-compose in a virtual environment:

PowerShell
python -m venv podman-venv
.\podman-venv\Scripts\Activate.ps1
pip install podman-compose

Then podman-compose up will work natively without ever touching Docker Compose.
