---
source_url: "https://www.perplexity.ai/search/75f169d4-18d3-4c67-bf91-7b2a51a481f2"
thread_uuid: "ba8be56d-3166-4758-9d52-8e61602e703c"
slug: "75f169d4-18d3-4c67-bf91-7b2a51a481f2"
title: "For boredom's sake, I would like to turn my surface pro into a headless server. Please tell me about others who have attempted the same thing and their success/failures, and what to expect. Generally, just entertain me and provide me as much diverse details as possible in an information dense format."
extracted_at: "2026-06-29T12:47:53.309Z"
matched_keywords: ["home assistant","ha"]
entry_count: 1
provenance: perplexity-rest-api
---

# For boredom's sake, I would like to turn my surface pro into a headless server. Please tell me about others who have attempted the same thing and their success/failures, and what to expect. Generally, just entertain me and provide me as much diverse details as possible in an information dense format.

Source: [Perplexity thread](https://www.perplexity.ai/search/75f169d4-18d3-4c67-bf91-7b2a51a481f2)

## User

For boredom's sake, I would like to turn my surface pro into a headless server. Please tell me about others who have attempted the same thing and their success/failures, and what to expect. Generally, just entertain me and provide me as much diverse details as possible in an information dense format.

## Assistant

Turning your Surface Pro into a headless server is a fun and creative way to repurpose old hardware. Several people have attempted this with varying degrees of success. Below, I'll break down the common experiences, challenges, and tips from others who have tried this, giving you a detailed overview of what to expect.

## **Success Stories and Use Cases**
Many users have successfully turned their Surface Pro into a headless server for different purposes:

- **Home Assistant (HA) Server**: One popular use case is running Home Assistant on a Surface Pro. Users report that the device has more than enough power for this task, especially when compared to alternatives like Raspberry Pi. The i5 processor and SSD in most Surface models make it capable of handling multiple services with ease.[1][2]
- **NAS or Plex Server**: Another common use case is setting up the Surface Pro as a NAS or Plex server. Some users have had success using Linux distributions like Ubuntu or Pop!_OS for these purposes. The Surface Pro’s SSD provides fast storage access, making it suitable for media streaming and file backups.[3]

## **Challenges and Failures**
While many have succeeded, there are some common pitfalls and limitations to be aware of:

- **Battery Issues**: A major concern is the battery. Surface devices are not designed to be plugged in 24/7, and doing so can lead to battery swelling (often referred to humorously as a "spicy pillow"). Some users recommend limiting the charge to 50-60% using BIOS settings or third-party tools like TLP on Linux to prolong battery life. Others suggest removing the battery entirely if possible.[2][1]
- **Limited Ports**: The Surface Pro has limited connectivity options, typically only one USB port. This can be a problem if you need to connect multiple peripherals like Ethernet adapters or external storage. A USB hub with Ethernet support can help mitigate this issue.[2]
- **Linux Compatibility**: Running Linux on a Surface Pro can be tricky. Some users report that everything works out of the box, while others have struggled with driver issues, particularly with Wi-Fi and touchscreens. The Linux-Surface project provides custom kernels and drivers that may help with compatibility.[3]

## **Operating System Options**
You have several choices when it comes to the operating system:

- **Windows**: If you stick with Windows, you can easily set up Remote Desktop (RDP) or use VNC/TeamViewer for remote access. Windows Server Core is also an option if you want a more lightweight setup.[5][6]
- **Linux**: Many users prefer installing Linux for better performance and flexibility. Ubuntu Server or Debian are good choices for headless setups. However, ensure you follow guides specific to Surface devices to avoid driver issues.[3]
- **Virtualization**: Some users run virtual machines (VMs) on top of the Surface Pro using software like VirtualBox or Proxmox. This allows them to run multiple services in isolated environments without needing dedicated hardware.[1]

## **Hardware Considerations**
- **Thermal Management**: The Surface Pro was not designed for continuous operation under heavy loads. Adding a heatsink or ensuring adequate ventilation is recommended if you're planning to run resource-intensive services like Plex.[3]
- **Headless Operation**: To run the Surface Pro without a monitor, you might need an HDMI dummy adapter that tricks the system into thinking a display is connected. This can prevent boot issues on some systems that refuse to start without a monitor attached.[4]

## **What to Expect**
Here’s what you should expect if you proceed with turning your Surface Pro into a headless server:

- **Performance**: The hardware in most Surface Pros is more than capable of handling light server tasks such as file sharing, media streaming, or home automation.
- **Connectivity Issues**: You’ll likely need additional peripherals like USB hubs or Ethernet adapters since most models lack built-in Ethernet ports.
- **Battery Management**: Keeping your device plugged in continuously could lead to battery swelling over time. Consider setting up tools to limit charging or remove the battery entirely if feasible.
- **Linux Tweaks**: If you opt for Linux, be prepared for some potential troubleshooting related to drivers—especially Wi-Fi and touchscreen functionality.

In conclusion, turning your Surface Pro into a headless server can be both an entertaining project and an effective way to reuse old hardware. As long as you're mindful of battery management and connectivity limitations, it should serve well for lightweight server tasks like running Home Assistant, Plex, or even as a simple NAS solution.

### Sources

- [What are the cons of using a Surface Pro as a HA server?](https://www.reddit.com/r/homeassistant/comments/1b6fbck/what_are_the_cons_of_using_a_surface_pro_as_a_ha/)
- [Surface Pro 1st Gen as HA server - Home Assistant Community](https://community.home-assistant.io/t/surface-pro-1st-gen-as-ha-server/88420)
- [Turn Surface Pro 5 into a home server. : r/SurfaceLinux - Reddit](https://www.reddit.com/r/SurfaceLinux/comments/tjr63b/turn_surface_pro_5_into_a_home_server/)
- [Headless Server - The Easy Way! - YouTube](https://www.youtube.com/watch?v=OCrhttuV2Mc)
- [Windows Server Headless install? | Microsoft Community Hub](https://techcommunity.microsoft.com/discussions/itopstalkforum/windows-server-headless-install/1840126)
- [Headless Server - Servers, NAS, and Home Lab - Linus Tech Tips](https://linustechtips.com/topic/1537031-headless-server/)
