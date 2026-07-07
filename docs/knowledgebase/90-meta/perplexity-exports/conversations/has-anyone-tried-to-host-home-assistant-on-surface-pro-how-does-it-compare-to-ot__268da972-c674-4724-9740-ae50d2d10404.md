---
source_url: "https://www.perplexity.ai/search/a971098f-4872-483e-8ea4-e67b81e7040d"
thread_uuid: "268da972-c674-4724-9740-ae50d2d10404"
slug: "a971098f-4872-483e-8ea4-e67b81e7040d"
title: "has anyone tried to host home assistant on surface pro? how does it compare to other devices?"
extracted_at: "2026-06-29T12:47:54.555Z"
matched_keywords: ["docker","home assistant","ha"]
entry_count: 1
provenance: perplexity-rest-api
---

# has anyone tried to host home assistant on surface pro? how does it compare to other devices?

Source: [Perplexity thread](https://www.perplexity.ai/search/a971098f-4872-483e-8ea4-e67b81e7040d)

## User

has anyone tried to host home assistant on surface pro? how does it compare to other devices?

## Assistant

Yes, people have tried hosting Home Assistant (HA) on a Surface Pro, and it can work well depending on your setup and needs. Here's a comparison of using a Surface Pro versus other devices like Raspberry Pi or mini PCs for running Home Assistant:

## **Running Home Assistant on a Surface Pro**

Several users have successfully hosted Home Assistant on Surface Pros, often by installing it in a virtual machine (VM) or using Docker with Linux. For example, one user mounted a Surface Pro 3 to the wall as a control panel for Home Assistant, running Ubuntu and Docker with HA. They reported that it was stable and fast compared to their previous Raspberry Pi setup. Another user used an older Surface Pro as a server and found it did the job well enough, though they received some negative feedback from others about potential long-term issues.[2][5]

### **Pros of Using a Surface Pro**
- **Performance**: The Surface Pro has significantly more processing power, RAM, and storage than devices like Raspberry Pi. This makes it more capable of handling large HA setups with many integrations, automations, or add-ons like ESPHome or Grafana.[5][2]
- **Touchscreen**: If mounted as a dashboard, the built-in touchscreen can be used for controlling the smart home directly from the device.[2][5]
- **Portability**: Since it's a tablet with a built-in battery, it can continue running for some time during power outages without needing an uninterruptible power supply (UPS).[5]
- **Recycling old hardware**: Many users choose to repurpose old Surface Pros that are no longer in use, which is cost-effective compared to buying new hardware.[2][5]

### **Cons of Using a Surface Pro**
- **Battery Issues**: One major concern is the lithium-ion battery. Keeping the device plugged in all the time can cause the battery to swell over time ("spicy pillow"), which poses safety risks. Some users suggest using BIOS settings or cron jobs to limit charging levels to extend battery life.[5]
- **No Ethernet Port**: Most Surface Pros lack built-in Ethernet ports, meaning you would need an external USB Ethernet adapter for reliable connectivity. While Wi-Fi is an option, wired connections are generally preferred for HA servers due to stability concerns.[5]
- **Power Consumption**: While Surface Pros are more power-efficient than full desktop PCs, they still consume more power than devices like Raspberry Pi or mini PCs designed for low-power operation.[3][5]

## **Comparison to Other Devices**

### **Raspberry Pi**
- **Pros**:
  - Low power consumption (ideal for 24/7 operation).
  - Affordable and widely supported by the HA community.
  - Easy to set up with HAOS (Home Assistant Operating System).
  
- **Cons**:
  - Limited performance compared to more powerful devices like the Surface Pro. Users with large setups or many add-ons may experience slowdowns.[4]
  - SD card reliability issues over time; using an SSD is recommended for better longevity.[3]

### **Mini PCs (e.g., Intel NUC)**
- **Pros**:
  - More powerful than Raspberry Pi but still energy-efficient.
  - Can run HAOS natively or in a VM with excellent performance.
  - Reliable storage options (SSD) and wired Ethernet support.

- **Cons**:
  - Higher cost than Raspberry Pi but still cheaper than most new tablets like Surface Pros.
  
### **Old Laptops/Desktops**
- **Pros**:
  - Similar to using a Surface Pro but often with better cooling and more expandability.
  - Can be repurposed for other tasks alongside HA (e.g., running other services in VMs).[4]

- **Cons**:
  - Higher power consumption than Raspberry Pi or mini PCs.
  - May require additional setup if running HA in a VM or Docker.

## **Conclusion**

Using a Surface Pro to host Home Assistant is feasible and can offer good performance, especially if you're repurposing old hardware. However, long-term concerns about battery swelling and reliance on Wi-Fi (unless you use an Ethernet dongle) could be drawbacks compared to dedicated low-power devices like Raspberry Pi or mini PCs. If you already have a Surface Pro lying around and want to avoid extra costs, it's worth trying out—just be mindful of potential battery issues and consider limiting its charge level if possible.

### Sources

- [How to move home assistant to a new machine : r/homeassistant](https://www.reddit.com/r/homeassistant/comments/z04opz/how_to_move_home_assistant_to_a_new_machine/)
- [Surface Pro 3 Wall Tablet Install : r/homeassistant - Reddit](https://www.reddit.com/r/homeassistant/comments/d3xwq6/surface_pro_3_wall_tablet_install/)
- [Which Raspberry Pi 4 model should i go for? : r/homeassistant - Reddit](https://www.reddit.com/r/homeassistant/comments/1d5l0l9/which_raspberry_pi_4_model_should_i_go_for/)
- [On what hardware do you run HA and do you experience problems?](https://www.reddit.com/r/homeassistant/comments/18xiy83/on_what_hardware_do_you_run_ha_and_do_you/)
- [What are the cons of using a Surface Pro as a HA server? - Reddit](https://www.reddit.com/r/homeassistant/comments/1b6fbck/what_are_the_cons_of_using_a_surface_pro_as_a_ha/)
- [New Setup: RPi3 vs Surface Pro : r/homeassistant - Reddit](https://www.reddit.com/r/homeassistant/comments/7aex9i/new_setup_rpi3_vs_surface_pro/)
- [Hime assistant on surface pro : r/homeassistant - Reddit](https://www.reddit.com/r/homeassistant/comments/kcy4a4/hime_assistant_on_surface_pro/)
