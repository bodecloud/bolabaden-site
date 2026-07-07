---
source_url: "https://www.perplexity.ai/search/4cec336b-39ea-4ad3-bd52-6c9697fff99e"
thread_uuid: "bb66d773-1ef1-426e-a11e-8c2a35a65a01"
slug: "4cec336b-39ea-4ad3-bd52-6c9697fff99e"
title: "Turn surface pro into headless HaOS server. Specifically address the headless/bios part of the surface pro."
extracted_at: "2026-06-29T12:47:53.351Z"
matched_keywords: ["home assistant","haos","ha"]
entry_count: 2
provenance: perplexity-rest-api
---

# Turn surface pro into headless HaOS server. Specifically address the headless/bios part of the surface pro.

Source: [Perplexity thread](https://www.perplexity.ai/search/4cec336b-39ea-4ad3-bd52-6c9697fff99e)

## User

Turn surface pro into headless HaOS server. Specifically address the headless/bios part of the surface pro.

## Assistant

To turn your Microsoft Surface Pro into a headless Home Assistant Operating System (HaOS) server, you'll need to address both the **headless setup** and **BIOS/UEFI configuration**. Below is a step-by-step guide on how to achieve this:

## **1. Preparing the Surface Pro for Headless Operation**

### **Disable Secure Boot**
Home Assistant OS (HaOS) requires Secure Boot to be disabled to boot from external media like a USB drive. Follow these steps to disable Secure Boot on your Surface Pro:

1. **Access UEFI Settings**:
   - Shut down your Surface.
   - Hold the **Volume Up** button and press the **Power** button.
   - Continue holding the Volume Up button until the UEFI menu appears.[1][3]

2. **Disable Secure Boot**:
   - In the UEFI menu, navigate to the **Security** section.
   - Find the option for **Secure Boot** and disable it.[3][1]

3. **Set Boot Order**:
   - In the UEFI menu, go to **Boot Configuration**.
   - Ensure that **USB Storage** is set as the first boot option by dragging it to the top of the list.[3]
   - Enable booting from USB devices if necessary.

4. **Save and Exit**:
   - Save your changes and exit UEFI.

### **Configure Headless Operation**
To run your Surface Pro headless (without a monitor), you may need to tweak some settings:

- **Display Emulation (Optional)**: Some systems require a "dummy" display to stay active when no monitor is connected. While Surface devices don't have explicit BIOS settings for this, you can use software solutions like `xrandr` in Linux or use a hardware HDMI dummy plug if needed.[6]
  
- **Power Settings**: Ensure that your Surface does not go into sleep mode when idle by adjusting power settings in Windows or Linux.

## **2. Installing Home Assistant OS (HaOS)**

### **Create a Bootable USB Drive**
1. Download the appropriate HaOS image for x86 systems from the official Home Assistant website.
2. Use software like Etcher to flash the image onto a USB drive.

### **Boot from USB**
1. Insert the bootable USB drive into your Surface Pro.
2. Power on the Surface while holding down the **Volume Down** button and then pressing the **Power** button. This forces it to boot from USB.[7]
3. Follow the installation instructions for HaOS.

## **3. Remote Access Setup**

Since your Surface Pro will be headless, you’ll need remote access to manage it:

- **SSH Access**: Once HaOS is installed, enable SSH access through Home Assistant’s add-ons or configuration files.
- **Web Interface**: You can access Home Assistant's web interface through its IP address on your local network.

## **4. Additional Considerations**

- If you plan to run other services alongside HaOS, consider installing a Linux distribution like Ubuntu first, then running Home Assistant in Docker.
- For long-term stability, ensure your Surface Pro has adequate cooling and power management configured properly.

By following these steps, you can successfully repurpose your Surface Pro into a headless Home Assistant OS server!

### Sources

- [How to use Surface UEFI - Microsoft Support](https://support.microsoft.com/en-us/surface/how-to-use-surface-uefi-df2c8942-dfa0-859d-4394-95f45eb1c3f9)
- [Surface Pro 7: How to Boot/Enter into BIOS or UEFI - YouTube](https://www.youtube.com/watch?v=yCbxx9Niv8E)
- [Ubuntu 22.04 on Surface Pro 7+ - Linux.org](https://www.linux.org/threads/ubuntu-22-04-on-surface-pro-7.43071/)
- [What the Headless Operation Mode Active POST message means ...](https://www.dell.com/support/kbdoc/en-us/000139731/what-the-headless-operation-mode-active-post-message-means-and-how-to-stop-it-appearing-during-start-up)
- [Best way to set up a "Headless Server" on home LAN (Workgroup)](https://arstechnica.com/civis/threads/best-way-to-set-up-a-headless-server-on-home-lan-workgroup.829152/)
- [Best BIOS & Windows settings for headless operation? - Reddit](https://www.reddit.com/r/intelnuc/comments/1doh9l2/best_bios_windows_settings_for_headless_operation/)
- [Manage Surface UEFI settings - Microsoft Learn](https://learn.microsoft.com/ms-my/surface/manage-surface-uefi-settings)

## User

Can you tell me more about headless surface pro implementations and what to expect? As much detail and information as possible, in a dense and concise format.

## Assistant

Turning a Surface Pro into a headless server, particularly for running Home Assistant Operating System (HaOS), can be a practical use of the device, but there are several important considerations to keep in mind. Below is a detailed breakdown of what to expect when implementing such a setup.

## **Key Considerations for Headless Surface Pro Implementation**

### **1. BIOS/UEFI Configuration**
Surface Pro devices use a custom UEFI firmware, which provides flexibility for configuring boot options and disabling security features like Secure Boot. Here's what you need to know:

- **Disable Secure Boot**: HaOS requires Secure Boot to be disabled. This can be done in the UEFI settings by holding the **Volume Up** button while powering on the device, then navigating to the Security section to turn off Secure Boot.[2]
  
- **Boot from USB**: You’ll need to configure the boot order to prioritize USB storage, which is essential for installing HaOS from an external drive. This can be done in the UEFI's Boot Configuration page.[2]

- **Headless Operation**: Surface Pro devices don’t have specific BIOS settings for headless operation, but they will run without a display connected. However, you may need to adjust power settings in your OS (e.g., Linux or Windows) to prevent sleep or hibernation when no display is connected.

### **2. Hardware Limitations and Challenges**
While the Surface Pro has adequate hardware for running HaOS, there are some inherent limitations and challenges:

- **Battery Management**: One of the biggest concerns with running a Surface Pro as a server is battery degradation over time. The battery can swell if constantly plugged in ("spicy pillow" effect). To mitigate this, you can use BIOS settings like "Kiosk Mode" to limit charging to 50% or use software-based solutions (e.g., cron jobs) to manage battery levels.[3]
  
- **Ethernet Connectivity**: Surface Pros typically lack built-in Ethernet ports, so you'll need a reliable USB-to-Ethernet adapter for stable network connectivity. Some users have reported issues with certain adapters not functioning consistently on Linux.[5]

- **Heat Management**: Surface Pros are designed as tablets and may not have optimal cooling for continuous server workloads. Consider using external cooling solutions or reducing CPU load by limiting background services.[5]

### **3. Software Installation and Compatibility**
Surface Pros are compatible with various Linux distributions, which can serve as a base for running Home Assistant in Docker or directly installing HaOS.

- **Linux Compatibility**: Many users have successfully installed Linux distributions like Ubuntu or Pop!_OS on Surface Pros. However, some features like touchscreens may require additional configuration (e.g., installing drivers). For headless operation, you can skip graphical environments and opt for server editions of Linux (like Ubuntu Server or Debian).[6][5]

- **Running HaOS**: While HaOS may not officially support Surface Pros out-of-the-box, it can still be installed using VirtualBox or Docker on top of a Linux distribution. This setup allows you to run Home Assistant alongside other services.[3]

### **4. Power Consumption**
Surface Pros are relatively power-efficient compared to traditional desktops or servers, making them suitable for low-power home server applications like Home Assistant.

- **Power Usage**: The power consumption of a Surface Pro is higher than that of a Raspberry Pi but still reasonable for home server use. Users have reported that their Surface Pro servers perform well under moderate loads without excessive energy consumption.[3]

### **5. Expandability and Future-Proofing**
One downside of using a Surface Pro as a server is its limited expandability:

- **Storage Expansion**: While you can add external storage via USB or microSD cards, there are no internal expansion options like PCIe slots or additional RAM.
  
- **Hardware Flexibility**: As your needs grow (e.g., running local AI models), you may find that the Surface Pro lacks the necessary hardware flexibility compared to desktop servers with PCIe slots for GPUs or additional storage controllers.[3]

## **Expected Benefits**
Despite these limitations, using a Surface Pro as a headless HaOS server offers several benefits:

- **Cost Efficiency**: Repurposing an old device saves money compared to buying new hardware.
  
- **Performance**: The hardware in most Surface Pros is more than sufficient for running Home Assistant and other lightweight services.
  
- **Portability**: The compact form factor makes it easy to move around if needed.

## **Conclusion**
Turning your Surface Pro into a headless HaOS server is feasible and offers several advantages in terms of cost efficiency and performance. However, you should be mindful of battery management, cooling needs, and network connectivity issues. Additionally, while the hardware is sufficient for basic home automation tasks, it may become limiting if your needs expand significantly in the future.

### Sources

- [What is a Headless Browser: Top 8 Options for 2024 [Pros vs. Cons]](https://www.scrapingbee.com/blog/what-is-a-headless-browser-best-solutions-for-web-scraping-at-scale/)
- [Manage Surface UEFI settings - Surface](https://learn.microsoft.com/ms-my/surface/manage-surface-uefi-settings)
- [What are the cons of using a Surface Pro as a HA server? - Reddit](https://www.reddit.com/r/homeassistant/comments/1b6fbck/what_are_the_cons_of_using_a_surface_pro_as_a_ha/)
- [Deploying Microsoft Surface Pros? - Spiceworks Community](https://community.spiceworks.com/t/deploying-microsoft-surface-pros/597714)
- [Turn Surface Pro 5 into a home server. : r/SurfaceLinux - Reddit](https://www.reddit.com/r/SurfaceLinux/comments/tjr63b/turn_surface_pro_5_into_a_home_server/)
- [Ubuntu 22.04 on Surface Pro 7+ - Linux.org](https://www.linux.org/threads/ubuntu-22-04-on-surface-pro-7.43071/)
