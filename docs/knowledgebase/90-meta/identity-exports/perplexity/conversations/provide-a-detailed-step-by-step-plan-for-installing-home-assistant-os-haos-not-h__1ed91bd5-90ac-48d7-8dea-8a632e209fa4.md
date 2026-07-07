---
source_url: "https://www.perplexity.ai/search/6e685a74-9ce6-42fa-ba57-5c095c4b436c"
thread_uuid: "1ed91bd5-90ac-48d7-8dea-8a632e209fa4"
slug: "6e685a74-9ce6-42fa-ba57-5c095c4b436c"
title: "Provide a detailed step-by-step plan for installing Home Assistant OS (HaOS, NOT hass.io / home assistant supervised) onto a Surface Pro. I do NOT want to use virtualbox/vm technology.

The surface pro will be mounted to a wall and act as not only the dashboard, but also the server.


Explore and research extensively the following questions individually:
- Does the analysis directly address the problem?
- Were all possible causes considered, or are there unassessed factors?
- Is this the simplest and most direct solution?
- Is it feasible in terms of resources and costs?
- Will the solution have the expected impact, and is it sustainable?
- Are there ways to simplify or improve the solution?
- What are the essential requirements versus those that are just a plus?
- What edge cases should we consider?
- What testing approach would validate this solution?
- If you identify ambiguities, suggest clarifying questions and, if possible, offer improvement alternatives.

Do not provide the above explorations to the user unless significant information is provided and acquired."
extracted_at: "2026-06-29T16:10:13.572Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# Provide a detailed step-by-step plan for installing Home Assistant OS (HaOS, NOT hass.io / home assistant supervised) onto a Surface Pro. I do NOT want to use virtualbox/vm technology.

The surface pro will be mounted to a wall and act as not only the dashboard, but also the server.


Explore and research extensively the following questions individually:
- Does the analysis directly address the problem?
- Were all possible causes considered, or are there unassessed factors?
- Is this the simplest and most direct solution?
- Is it feasible in terms of resources and costs?
- Will the solution have the expected impact, and is it sustainable?
- Are there ways to simplify or improve the solution?
- What are the essential requirements versus those that are just a plus?
- What edge cases should we consider?
- What testing approach would validate this solution?
- If you identify ambiguities, suggest clarifying questions and, if possible, offer improvement alternatives.

Do not provide the above explorations to the user unless significant information is provided and acquired.

Source: [Perplexity thread](https://www.perplexity.ai/search/6e685a74-9ce6-42fa-ba57-5c095c4b436c)

## User

Provide a detailed step-by-step plan for installing Home Assistant OS (HaOS, NOT hass.io / home assistant supervised) onto a Surface Pro. I do NOT want to use virtualbox/vm technology.

The surface pro will be mounted to a wall and act as not only the dashboard, but also the server.


Explore and research extensively the following questions individually:
- Does the analysis directly address the problem?
- Were all possible causes considered, or are there unassessed factors?
- Is this the simplest and most direct solution?
- Is it feasible in terms of resources and costs?
- Will the solution have the expected impact, and is it sustainable?
- Are there ways to simplify or improve the solution?
- What are the essential requirements versus those that are just a plus?
- What edge cases should we consider?
- What testing approach would validate this solution?
- If you identify ambiguities, suggest clarifying questions and, if possible, offer improvement alternatives.

Do not provide the above explorations to the user unless significant information is provided and acquired.

## Assistant

To install **Home Assistant OS (HaOS)** directly on a **Surface Pro** without using virtual machines, follow these detailed steps. This guide assumes you want to use the Surface Pro as both the **Home Assistant server** and a **dashboard**.

### **Step 1: Prepare the Surface Pro for Installation**

1. **Backup any important data**: Before installing a new OS, ensure all important data on the Surface Pro is backed up.
2. **Check hardware compatibility**:
   - Ensure your Surface Pro has at least **2 GB of RAM** and **32 GB of storage**, which are the minimum requirements for HaOS.[2]
   - If your Surface Pro lacks an Ethernet port, you will need a **USB-to-Ethernet adapter** for more reliable network connectivity, as Wi-Fi can be problematic during installation.[4][6]
   - Make sure the battery is in good condition or consider disabling it in BIOS if possible to avoid long-term risks like swelling when always plugged in.[6]

### **Step 2: Create a Bootable USB with Home Assistant OS**

1. **Download HaOS for x86-64**:
   - Go to the official Home Assistant website and download the appropriate image for **x86-64 architecture** (since Surface Pro uses x86-64).[2]
   - The image format should be `.img.xz` or similar.

2. **Create a bootable USB drive**:
   - Use a tool like [Balena Etcher](https://www.balena.io/etcher/) or [Rufus](https://rufus.ie/) to flash the HaOS image onto a USB drive.
   - Insert your USB drive and select the downloaded HaOS image in Balena Etcher or Rufus.
   - Click "Flash" to create the bootable USB.

### **Step 3: Boot Surface Pro from USB**

1. **Access BIOS/UEFI settings**:
   - Power off your Surface Pro.
   - Hold down the **Volume Up button** and press the **Power button** until you see the Surface logo. This will bring you into UEFI/BIOS.
   
2. **Disable Secure Boot**:
   - In UEFI, navigate to the "Security" tab and disable "Secure Boot" to allow booting from external media.[6]

3. **Set boot order**:
   - In UEFI, go to the "Boot Configuration" section and set your USB drive as the primary boot device.

4. **Save changes and reboot**:
   - Save your changes and reboot the Surface Pro with the bootable USB attached.

### **Step 4: Install Home Assistant OS**

1. When the Surface Pro boots from USB, you should see the HaOS installation screen.
   
2. Follow the on-screen instructions to install Home Assistant OS onto your device's internal storage.

3. During installation, if using Wi-Fi, you may encounter issues with drivers not being recognized. If this happens:[4]
   - Use a **USB-to-Ethernet adapter** for network connectivity during setup.
   
4. Once installation is complete, HaOS will automatically reboot.

### **Step 5: Initial Setup of Home Assistant**

1. After rebooting, connect another device (laptop or phone) to the same network as your Surface Pro.
   
2. Open a browser and navigate to `http://homeassistant.local:8123` or use your Surface Pro’s IP address (e.g., `http://192.168.x.x:8123`).

3. Complete the initial setup by creating an account, setting your location, and configuring any discovered devices.

### **Step 6: Configure Dashboard Mode**

Since your Surface Pro will also serve as a dashboard:

1. Install [Home Assistant’s Lovelace UI](https://www.home-assistant.io/lovelace/) to customize your dashboard interface.
   
2. Set up Kiosk mode if desired:
   - You can use custom add-ons like [Kiosk Mode](https://github.com/maykar/kiosk-mode) to hide unnecessary UI elements when displaying on a wall-mounted tablet.

### **Step 7: Optimize for Long-Term Use**

1. **Battery management**:
   - If you're keeping the Surface Pro plugged in permanently, consider setting up a cron job or using BIOS settings (if available) to limit battery charge levels to around 50%. This will extend battery life and reduce swelling risks.[6]
   
2. **Backup strategy**:
   - Regularly back up your Home Assistant configuration using built-in tools. Store backups externally so that if you need to migrate to new hardware in the future, it’s easier.[2]

### **Edge Cases & Troubleshooting**

- If HaOS does not recognize certain hardware components (like Wi-Fi), consider switching to a Linux-based installation method (e.g., Ubuntu + Docker).[4]
- Some older Surface models may have trouble with Linux drivers (especially for touchscreens or other peripherals). Research specific driver support for your model before proceeding.[6]

By following these steps, you can transform your Surface Pro into a fully functional Home Assistant server and dashboard without relying on VM technology like VirtualBox!

### Sources

- [HOW TO INSTALL HOME ASSISTANT ON WINDOWS - YouTube](https://www.youtube.com/watch?v=VBXfvT9EiYo)
- [Installation - Home Assistant](https://www.home-assistant.io/installation/)
- [Windows - Home Assistant](https://www.home-assistant.io/installation/windows/)
- [Installing home assistant on older surface pro](https://community.home-assistant.io/t/installing-home-assistant-on-older-surface-pro/665478)
- [How To Install Home Assistant on Windows in 3 minutes - YouTube](https://www.youtube.com/watch?v=gyaMKgenayQ)
- [What are the cons of using a Surface Pro as a HA server? - Reddit](https://www.reddit.com/r/homeassistant/comments/1b6fbck/what_are_the_cons_of_using_a_surface_pro_as_a_ha/)
