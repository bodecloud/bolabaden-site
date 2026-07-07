---
source_url: "https://www.perplexity.ai/search/ef1df2e1-75e7-45bb-8441-a6ade3d7f2b0"
thread_uuid: "24d75334-ba90-4995-b3ff-35d942fa572d"
slug: "ef1df2e1-75e7-45bb-8441-a6ade3d7f2b0"
title: "Is the Home Assistant community gravitating away from Hass.io, or is it becoming more popular than HaOS? Which one is newer? What's their history? Consensus as of 2024? Am struggling to determine which I want.

Ideally I would like to configure the entire thing entirely before I even plug in the server machine that'll eventually run it."
extracted_at: "2026-06-29T16:10:44.234Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# Is the Home Assistant community gravitating away from Hass.io, or is it becoming more popular than HaOS? Which one is newer? What's their history? Consensus as of 2024? Am struggling to determine which I want.

Ideally I would like to configure the entire thing entirely before I even plug in the server machine that'll eventually run it.

Source: [Perplexity thread](https://www.perplexity.ai/search/ef1df2e1-75e7-45bb-8441-a6ade3d7f2b0)

## User

Is the Home Assistant community gravitating away from Hass.io, or is it becoming more popular than HaOS? Which one is newer? What's their history? Consensus as of 2024? Am struggling to determine which I want.

Ideally I would like to configure the entire thing entirely before I even plug in the server machine that'll eventually run it.

## Assistant

### **Home Assistant OS (HaOS) vs. Hass.io: History and Popularity in 2024**

#### **History and Naming Confusion**
The terms *Hass.io* and *Home Assistant OS (HaOS)* have evolved over time, leading to some confusion among users. Originally, *Hass.io* was introduced in July 2017 as a managed operating system designed to simplify running Home Assistant on devices like the Raspberry Pi. It bundled Home Assistant with a supervisor tool to manage updates, backups, and add-ons. In January 2020, the naming was simplified, and *Hass.io* was renamed to **Home Assistant OS (HaOS)**.[3]

As of 2024, HaOS refers to the full software suite that includes Home Assistant Core, the Supervisor, and the underlying operating system optimized for running Home Assistant. The Supervisor manages add-ons and updates, making it easier for users who want a plug-and-play experience without needing to manage the underlying OS.[5][3]

#### **Popularity Trends**
In terms of community adoption, **Home Assistant OS (HaOS)** remains the most popular choice for users in 2024. According to community discussions and analytics, most users prefer HaOS because it offers a streamlined experience with minimal setup required. It is particularly favored by users who want an easy-to-maintain system that automatically handles updates and doesn’t require deep technical knowledge of Linux or Docker.[4]

On the other hand, **Supervised installations** (formerly known as *Hass.io*) are still used by more advanced users who want greater control over the underlying operating system. This method allows for more flexibility but requires more maintenance since users are responsible for managing both the OS and Home Assistant itself. However, as of 2024, many users report that the need for Supervised installations is dwindling due to improvements in HaOS and virtualization technologies like Proxmox or Docker.[4][5]

#### **Which One Is Newer?**
Technically speaking, **Home Assistant OS (HaOS)** is the newer term and approach. The original *Hass.io* was rebranded into HaOS in 2020 to clarify its purpose as a complete system for running Home Assistant. The core concepts remain similar, but HaOS reflects a more polished and user-friendly approach.[3]

#### **Community Consensus as of 2024**
The consensus in 2024 is that **Home Assistant OS (HaOS)** is generally preferred by most users due to its simplicity and ease of use. It’s particularly well-suited for those who don’t want to manage a separate Linux environment or deal with Docker directly. For users who prefer virtualization or want to run other applications alongside Home Assistant, deploying HaOS in a virtual machine (VM) or using Docker is often recommended.[5]

**Supervised installations**, while still supported, tend to be used by more advanced users who want full control over their system. However, many in the community suggest that unless you have very specific needs or enjoy tinkering with Linux systems, HaOS is likely the better choice for most people.[4][5]

### **Which Should You Choose?**
Based on your desire to configure everything before plugging in your server machine:

- If you prefer a simple setup with minimal ongoing maintenance and don’t mind letting the system handle updates automatically, **Home Assistant OS (HaOS)** is likely your best option.
- If you want full control over your server’s operating system (e.g., to run additional services like Plex or Frigate), you might consider using **Home Assistant Supervised** on top of a Linux installation or running Home Assistant in Docker on your custom server setup.

Given that you plan to configure everything before deploying it on your server machine, you could also explore setting up HaOS in a virtual machine first. This would allow you to fine-tune your configuration without committing to hardware until you're ready.[5]

In summary:
- **HaOS** is ideal for users who want an easy-to-manage system with minimal technical overhead.
- **Supervised** or Docker-based setups are better for those who need more flexibility or want to run additional services on their server.

### Sources

- [What are the differences between Home Assistant vs Hass.io](https://community.home-assistant.io/t/what-are-the-differences-between-home-assistant-vs-hass-io/149508)
- [Comparison to Home Assistant - openHAB Community](https://community.openhab.org/t/comparison-to-home-assistant/151931)
- [Home Assistant - Wikipedia](https://en.wikipedia.org/wiki/Home_Assistant)
- [HA OS vs Supervised - Installation - Home Assistant Community](https://community.home-assistant.io/t/ha-os-vs-supervised/395968)
- [What's the best way to run Home Assistant in 2024? : r/homeassistant](https://www.reddit.com/r/homeassistant/comments/194vp9o/whats_the_best_way_to_run_home_assistant_in_2024/)
