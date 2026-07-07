---
source_url: "https://www.perplexity.ai/search/9b4922b8-f513-4aad-a5f1-fcdc19c8cdd9"
thread_uuid: "22eee805-a8f5-49e7-aae4-114e5ab53c2e"
slug: "9b4922b8-f513-4aad-a5f1-fcdc19c8cdd9"
title: "Where is like the main home assistant installation/download location page? I went to the main website and it just shows me home assistant green/yellow info. I just want to see the main page for downloading haos or home assistant supervised. There used to be a specific page that showed both. The most main page. But even a google search just shows the github repo and the latest image. Not the main page."
extracted_at: "2026-06-29T16:10:12.824Z"
matched_keywords: []
export_suite: "identity"
entry_count: 2
provenance: perplexity-rest-api
---

# Where is like the main home assistant installation/download location page? I went to the main website and it just shows me home assistant green/yellow info. I just want to see the main page for downloading haos or home assistant supervised. There used to be a specific page that showed both. The most main page. But even a google search just shows the github repo and the latest image. Not the main page.

Source: [Perplexity thread](https://www.perplexity.ai/search/9b4922b8-f513-4aad-a5f1-fcdc19c8cdd9)

## User

Where is like the main home assistant installation/download location page? I went to the main website and it just shows me home assistant green/yellow info. I just want to see the main page for downloading haos or home assistant supervised. There used to be a specific page that showed both. The most main page. But even a google search just shows the github repo and the latest image. Not the main page.

## Assistant

The main page for downloading and installing Home Assistant, including all the different installation methods like Home Assistant Operating System (HAOS) and Home Assistant Supervised, can be found on the official **Home Assistant Installation** page:

[Home Assistant Installation](https://www.home-assistant.io/installation/).[1]

This page provides a comprehensive overview of all the installation methods available, including:

- **Home Assistant Operating System (HAOS)**: The recommended method for most users, offering a fully managed environment.
- **Home Assistant Supervised**: For advanced users who want to manually manage the underlying operating system while still using the Home Assistant Supervisor.
- **Home Assistant Container**: A Docker-based installation of Home Assistant Core.
- **Home Assistant Core**: A manual installation using Python in a virtual environment.

For each method, the page includes detailed instructions and links to download the appropriate images or software. This should be the main resource for anyone looking to install Home Assistant on various hardware platforms.

### Sources

- [Installation - Home Assistant](https://www.home-assistant.io/installation/)
- [Generic x86-64 - Home Assistant](https://www.home-assistant.io/installation/generic-x86-64/)
- [Linux - Home Assistant](https://www.home-assistant.io/installation/linux/)

## User

Yeah that page is so exhaustive and non-intuitive. I need the page specifically for HaOS through UEFI

## Assistant

For installing **Home Assistant Operating System (HAOS)** specifically on a **Generic x86-64 machine** with **UEFI boot**, the most relevant and specific page is the **Generic x86-64 Installation Guide**. This page provides detailed instructions for configuring your BIOS to enable UEFI boot mode and disable Secure Boot, along with the steps to install HAOS.

You can access this guide directly here:

[Generic x86-64 Installation](https://www.home-assistant.io/installation/generic-x86-64/).[1]

### Key Steps for UEFI Installation:
1. **Configure BIOS**:
   - Ensure **UEFI boot mode** is enabled.
   - Disable **Secure Boot**.
   - Save changes and exit BIOS.

2. **Install HAOS**:
   - Download the HAOS image for x86-64 from the link provided on the page.
   - Use tools like **Balena Etcher** or **Rufus** to write the image to a USB drive.
   - Boot from the USB drive and follow the instructions to install HAOS.

This guide is tailored for users who want to install HAOS on a PC or server that supports UEFI, making it the most relevant resource for your needs.

### Sources

- [Generic x86-64 - Home Assistant](https://www.home-assistant.io/installation/generic-x86-64/)
- [How to Install Home Assistant Operating System (Complete ...](https://www.youtube.com/watch?v=bVU7V-F-WOc)
- [Installation](https://www.home-assistant.io/installation/)
