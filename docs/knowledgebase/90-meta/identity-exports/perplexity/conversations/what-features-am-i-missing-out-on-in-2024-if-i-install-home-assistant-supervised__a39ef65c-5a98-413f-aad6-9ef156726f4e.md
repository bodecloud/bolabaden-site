---
source_url: "https://www.perplexity.ai/search/96060560-e8b3-479b-be16-7d27d4f92b36"
thread_uuid: "a39ef65c-5a98-413f-aad6-9ef156726f4e"
slug: "96060560-e8b3-479b-be16-7d27d4f92b36"
title: "What features am I missing out on in 2024 if I install home assistant supervised (hassio) vs haos? Focus specifically on the limitations of each. I don't care about basic installation/complicated usage patterns. Specifically fundamental/exhaustive limitations and inabilities each has."
extracted_at: "2026-06-29T16:10:18.121Z"
matched_keywords: []
export_suite: "identity"
entry_count: 4
provenance: perplexity-rest-api
---

# What features am I missing out on in 2024 if I install home assistant supervised (hassio) vs haos? Focus specifically on the limitations of each. I don't care about basic installation/complicated usage patterns. Specifically fundamental/exhaustive limitations and inabilities each has.

Source: [Perplexity thread](https://www.perplexity.ai/search/96060560-e8b3-479b-be16-7d27d4f92b36)

## User

What features am I missing out on in 2024 if I install home assistant supervised (hassio) vs haos? Focus specifically on the limitations of each. I don't care about basic installation/complicated usage patterns. Specifically fundamental/exhaustive limitations and inabilities each has.

## Assistant

When comparing **Home Assistant Supervised (Hassio)** and **Home Assistant OS (HAOS)** in 2024, the key differences lie in control, flexibility, and maintenance responsibilities. Below is a detailed breakdown of the fundamental limitations and inabilities of each option:

## **Home Assistant Supervised (Hassio)**

**Advantages:**
- **Full control over the underlying OS**: Since it runs on a standard Linux distribution (Debian is officially supported), you can install other software, manage the system, and configure it as needed. This is useful if you want to run additional services or applications alongside Home Assistant.[2][3]
- **Flexibility**: You can manage Docker containers manually, install custom packages, and control when OS updates are applied.[3]

**Limitations:**
- **High maintenance burden**: You are responsible for maintaining the host operating system, including updates, security patches, and dependency management. This includes ensuring that Docker CE (Community Edition) is up-to-date and that the system meets all strict requirements.[4][2]
- **System stability risks**: Since Home Assistant Supervisor takes control of many parts of the host system, installing conflicting packages or mismanaging the system can lead to instability. Supervisor might even block updates if it detects an "unhealthy" or "unsupported" system.[2][4]
- **Limited support**: If you deviate from the official guidelines (e.g., using a non-Debian OS or installing unsupported software), your setup may be marked as "unsupported," meaning you won’t receive official support from Home Assistant's team. You could also face issues with updates being blocked until problems are resolved.[4]
- **Complexity**: Supervised installations are more complex to set up and maintain compared to HAOS. It requires knowledge of Linux and Docker, making it less suitable for users who prefer a "set it and forget it" approach.[3][4]

## **Home Assistant OS (HAOS)**

**Advantages:**
- **Fully managed environment**: HAOS is a minimal Linux-based operating system designed specifically for Home Assistant. It handles all updates automatically (including OS, Supervisor, and add-ons), reducing the need for user intervention.[3][4]
- **Stability and ease of use**: Since HAOS is optimized for running Home Assistant exclusively, it provides a stable and reliable environment with minimal risk of breaking due to external factors like conflicting software or misconfigurations.[2][3]
- **Add-ons support**: HAOS supports Home Assistant’s add-on store natively, allowing users to easily install additional services like databases or media servers without needing to manage them manually.[1]

**Limitations:**
- **No control over the underlying OS**: With HAOS, you cannot install other applications or modify the underlying operating system. It is locked down to ensure stability and ease of use. This makes it unsuitable if you need to run other services on the same machine.[2][3]
- **Resource constraints in bare-metal installations**: If installed directly on hardware without virtualization, HAOS dedicates the entire machine to running Home Assistant, which can be seen as inefficient if you have powerful hardware but only use it for Home Assistant.[1]
- **Less flexibility for advanced users**: Advanced users who want more control over their system may find HAOS too restrictive since they cannot manage Docker containers manually or tweak system-level settings.[3]

## **Summary**

| Feature                              | Home Assistant Supervised                                  | Home Assistant OS (HAOS)                                      |
|--------------------------------------|------------------------------------------------------------|---------------------------------------------------------------|
| Control over underlying OS           | Full control—can install other software                    | No control—dedicated to Home Assistant                         |
| Maintenance responsibility           | User-managed (updates, security patches)                   | Fully managed by Home Assistant                               |
| Stability                            | Potentially unstable if misconfigured                      | Highly stable—optimized for Home Assistant                    |
| Add-ons support                      | Supports add-ons but requires manual management            | Full add-on support with automatic management                  |
| System updates                       | User must handle OS updates; Supervisor auto-updates itself| Fully automated updates for both OS and Supervisor             |
| Risk of unsupported/unhealthy status | High if not following strict guidelines                    | Low—designed for smooth operation with minimal user intervention|
| Suitable for running other services  | Yes—can run additional services alongside Home Assistant   | No—dedicated solely to running Home Assistant                  |

In conclusion, if you want full control over your system and are comfortable managing Linux and Docker yourself, **Home Assistant Supervised** offers flexibility but comes with higher maintenance responsibilities and potential stability risks. On the other hand, if you prefer a hands-off approach with minimal maintenance but don't need to run additional services on the same machine, **Home Assistant OS** provides a stable and hassle-free environment optimized for running Home Assistant.

### Sources

- [Article Completely Ignores The Supervised Method #31111 - GitHub](https://github.com/home-assistant/home-assistant.io/issues/31111)
- [HA Supervised + OS Agent vs. HAOS - Home Assistant Community](https://community.home-assistant.io/t/ha-supervised-os-agent-vs-haos/595730)
- [HA OS vs Supervised - Installation - Home Assistant Community](https://community.home-assistant.io/t/ha-os-vs-supervised/395968)
- [What is the difference between a dedicated Home Assistant OS ...](https://community.home-assistant.io/t/what-is-the-difference-between-a-dedicated-home-assistant-os-install-and-a-supervised-install/395684)

## User

your response was incredibly generic. Find SPECIFICS. Literally list 20-50 SPECIFIC things I CANNOT do with one vs the other.

## Assistant

Here is a detailed and specific list of differences and limitations between **Home Assistant Supervised** and **Home Assistant OS (HAOS)** as of 2024. These differences focus on what you *cannot* do with one setup versus the other:

### **1. System Control & Flexibility**
- **Supervised**: You have full control over the underlying OS. You can:
  - Install any additional software or services (e.g., Plex, Pi-hole) alongside Home Assistant.
  - Manage Docker containers outside of Home Assistant's ecosystem.
  - Configure and manage the host OS (e.g., Debian) as you wish, including kernel tuning, firewall rules, and network configurations.
- **HAOS**: You cannot:
  - Install any software outside of Home Assistant's add-on store.
  - Access or modify the underlying OS directly (no SSH access unless using an add-on).
  - Run other services or containers outside of Home Assistant's ecosystem.

### **2. Add-ons Management**
- **Supervised**: Full support for add-ons through the Supervisor interface.
- **HAOS**: Also supports add-ons, but you cannot:
  - Install system-level services that aren't available as add-ons.
  
### **3. OS Updates**
- **Supervised**: You are responsible for updating the host OS (Debian) manually, including security patches and kernel updates.
- **HAOS**: The entire system, including the OS, is updated automatically by Home Assistant. You cannot:
  - Control when or how these updates occur.

### **4. System Health & Supervisor**
- **Supervised**: Supervisor manages parts of the host system but can be blocked if it detects issues (e.g., unsupported configurations).
- **HAOS**: Supervisor handles everything automatically. You cannot:
  - Bypass system health checks or manage Supervisor independently.

### **5. Backup & Restore**
- **Supervised**: Full support for Home Assistant backups and restores.
- **HAOS**: Same backup capabilities, but you cannot:
  - Access or back up the underlying OS directly.

### **6. Hardware Access**
- **Supervised**: You can configure hardware access manually (e.g., USB devices, Z-Wave sticks), manage drivers, and troubleshoot hardware issues at the OS level.
- **HAOS**: Hardware access is abstracted away, and you cannot:
  - Manually install drivers or troubleshoot hardware at the OS level.

### **7. Docker Management**
- **Supervised**: You can manage Docker containers manually, including creating custom containers unrelated to Home Assistant.
- **HAOS**: Docker is abstracted away. You cannot:
  - Directly interact with Docker containers outside of Home Assistant's ecosystem.

### **8. Networking**
- **Supervised**: Full control over network interfaces, firewall rules, IP addressing, VLANs, etc.
- **HAOS**: Networking is managed by Home Assistant. You cannot:
  - Configure advanced networking settings beyond what is exposed in the Home Assistant UI.

### **9. File System Access**
- **Supervised**: Full access to the file system for custom configurations or additional services.
- **HAOS**: Limited access to configuration files through Samba or SSH add-ons. You cannot:
  - Modify core system files or directories outside of Home Assistant's scope.

### **10. Custom Integrations**
- **Supervised**: You can install custom integrations that require additional system dependencies (e.g., Python libraries).
- **HAOS**: Limited to integrations that do not require external dependencies beyond what is available in Home Assistant's ecosystem.

### **11. Resource Allocation**
- **Supervised**: You can allocate resources (CPU/RAM) to different services running on the same machine.
- **HAOS**: All resources are dedicated to running Home Assistant. You cannot:
  - Allocate resources to other services or containers.

### **12. Network Shares & Drives**
- **Supervised**: Full control over mounting network drives (e.g., NFS/SMB shares) at the OS level.
- **HAOS**: Limited support for network drives via add-ons (if available). You cannot:
  - Mount drives directly unless supported through an add-on.

### **13. Third-party Services**
- **Supervised**: Ability to run third-party services like MariaDB, MQTT brokers, or media servers directly on the same machine.
- **HAOS**: Limited to what is available in the add-on store or via integrations within Home Assistant itself.

### **14. Custom Automation Scripts**
- **Supervised**: Ability to run custom scripts outside of Home Assistant’s automation engine (e.g., bash scripts).
- **HAOS**: Limited to automations that run within Home Assistant’s ecosystem.

### **15. System Monitoring Tools**
- **Supervised**: Ability to install and configure system monitoring tools like `htop`, `netdata`, `prometheus`, etc.
- **HAOS**: No access to install such tools directly on the OS.

### **16. Kernel Tuning & Customization**
- **Supervised**: Ability to tune kernel parameters for performance or specific hardware requirements (e.g., real-time clock adjustments).
- **HAOS**: Kernel is locked down and managed by Home Assistant. No customization allowed.

### **17. Firewall & Security Configurations**
- **Supervised**: Full control over firewall settings (e.g., `iptables`, `ufw`) and security hardening measures at the OS level.
- **HAOS**: No ability to configure firewall settings beyond what is exposed in Home Assistant’s UI.

### **18. Virtualization Support**
- Both support running in virtual machines; however:
  - In HAOS, you cannot run additional VMs inside HAOS itself since it’s a locked-down environment.
  
### **19. User Permissions & Groups**
- Supervised allows you to manage users and groups at the Linux level for different services.
  
### Summary Table

| Feature                           | Supervised                               | HAOS                                      |
|-----------------------------------|------------------------------------------|-------------------------------------------|
| Additional Software Installation  | Yes                                      | No                                        |
| Manual Docker Management          | Yes                                      | No                                        |
| OS Updates                        | Manual                                   | Automatic                                 |
| Full Hardware Access              | Yes                                      | Limited                                   |
| Network Configuration             | Full Control                             | Limited                                   |
| File System Access                | Full Control                             | Limited                                   |
| Custom Integrations               | Yes                                      | Limited                                   |
| Resource Allocation               | Yes                                      | No                                        |
| Network Drives                    | Manual Mounting                          | Limited via Add-ons                       |
| Third-party Services              | Yes                                      | Add-ons Only                              |
| Kernel Tuning                     | Yes                                      | No                                        |
| Firewall Configuration            | Yes                                      | No                                        |

In summary, choosing between Supervised and HAOS comes down to whether you need full control over your system versus a simpler experience with automatic management but more restrictions on customization and flexibility

### Sources

- [HA OS vs Supervised - #14 by petro - Installation](https://community.home-assistant.io/t/ha-os-vs-supervised/395968/14)
- [HA OS vs Supervised - Installation - Home Assistant Community](https://community.home-assistant.io/t/ha-os-vs-supervised/395968)
- [Limitations of non supervised installation : r/homeassistant - Reddit](https://www.reddit.com/r/homeassistant/comments/1175o0b/limitations_of_non_supervised_installation/)
- [HA Supervised + OS Agent vs. HAOS - Home Assistant Community](https://community.home-assistant.io/t/ha-supervised-os-agent-vs-haos/595730)

## User

So how limited in reality is HaOS? What do users think about the limitations? Are they valid reasons to install supervised? Also, HACS??

## Assistant

### **How Limited is Home Assistant OS (HAOS)?**

In reality, **Home Assistant OS (HAOS)** is not as limited as it might initially seem, especially for the majority of users who are focused on smart home automation. HAOS is designed to provide a streamlined, stable, and easy-to-manage environment for running Home Assistant, and it excels at that. However, there are some specific limitations compared to **Home Assistant Supervised** that may affect more advanced users or those seeking more flexibility.

Here are some key limitations of HAOS:

1. **No Access to the Underlying OS**: HAOS is a locked-down environment. You cannot install or run additional software outside of what Home Assistant provides through its add-on store. This means:
   - You can't install third-party software like Plex, Pi-hole, or other services unless they are available as add-ons.
   - You have no direct access to the Linux operating system for custom scripts or system-level configurations.
   
2. **Limited Docker Control**: While HAOS uses Docker under the hood, you cannot manually manage or create Docker containers outside of Home Assistant's ecosystem. This limits:
   - The ability to run other Docker-based services alongside Home Assistant.
   - Custom container management (e.g., creating your own containers or using advanced Docker features).

3. **Networking Customization**: HAOS abstracts away network management, making it easier for most users but limiting advanced configurations like:
   - VLANs, custom IP routing, and firewall rules.
   - Advanced networking setups that may be required for complex environments.

4. **Hardware Access**: While HAOS supports common hardware like USB sticks for Z-Wave or Zigbee, you lack control over:
   - Installing custom drivers or troubleshooting hardware at the OS level.
   - Manually configuring hardware devices that aren't automatically recognized by Home Assistant.

5. **Resource Allocation**: Since HAOS dedicates the entire system to running Home Assistant, you cannot:
   - Allocate specific CPU or memory resources to other services or processes.
   - Run other applications that might share the same hardware resources.

6. **Backup & Restore Limitations**: While HAOS provides easy backup and restore options for Home Assistant itself, you cannot:
   - Back up or restore the underlying OS directly.
   
7. **No Kernel Tuning**: You cannot tweak kernel parameters or perform any low-level system optimizations in HAOS.

8. **Add-ons Only from Official Store**: You are limited to add-ons available in the official Home Assistant Add-on Store. If an add-on isn't available (e.g., some niche services), you can't easily install it.

### **What Do Users Think About These Limitations?**

User opinions on HAOS limitations vary depending on their technical expertise and use cases:

- **For Most Users**: Many users find that HAOS meets their needs perfectly because it provides a stable, easy-to-manage environment with minimal maintenance required. For users who primarily want a reliable smart home automation platform without worrying about maintaining an underlying OS, HAOS is ideal. The automatic updates and built-in add-ons cover most common use cases.
  
- **Advanced Users**: Some advanced users feel constrained by HAOS due to its lack of flexibility in managing the underlying system and Docker containers. These users often prefer **Home Assistant Supervised** because it allows them to:
  - Run additional services alongside Home Assistant.
  - Customize their networking setup.
  - Install third-party software directly on the host machine.

- **HACS Users**: HACS (Home Assistant Community Store) is highly popular among both beginner and advanced users alike because it allows easy installation of community-made integrations, themes, and custom components. HACS works well with both HAOS and Supervised installations, but users should note that HACS can introduce instability if poorly maintained integrations are installed. Some users prefer to avoid HACS if they prioritize stability above all else.[1][2][3]

### **Are These Valid Reasons to Install Supervised?**

Yes, for certain use cases:

1. **Running Additional Services**: If you want to run other applications (e.g., Plex, Pi-hole) on the same machine as Home Assistant without virtualization, Supervised is a better choice because it gives you full control over the host OS.

2. **Advanced Networking Needs**: If you need custom networking configurations like VLANs or firewall rules beyond what HAOS allows, Supervised gives you full control over network interfaces and configurations.

3. **Custom Hardware Support**: If your setup requires manually installing drivers or configuring hardware that isn't natively supported by Home Assistant's add-ons, Supervised allows you to do so at the OS level.

4. **Docker Management**: If you want to manage Docker containers manually or run additional containers outside of Home Assistant's ecosystem, Supervised allows this flexibility.

5. **System Customization & Scripting**: Users who want to run custom scripts or perform system-level optimizations (e.g., kernel tuning) will need Supervised since HAOS does not allow direct access to these features.

### **HACS Considerations**

HACS is a powerful tool that enhances both HAOS and Supervised installations by providing access to hundreds of community-made integrations. However:[2][1]
- It can introduce some instability if poorly maintained integrations are used.[3]
- For users who want maximum stability and minimal maintenance headaches, avoiding HACS may be preferable—especially on production systems where reliability is critical.[2]

### Conclusion

HAOS is not severely limited for most typical smart home automation use cases. It provides a stable and managed environment ideal for users who don't need extensive customization beyond what Home Assistant officially supports. However, if you're an advanced user who needs more control over the host system, networking configurations, Docker management, or hardware access—or if you plan on running additional services—then installing **Home Assistant Supervised** would be a better fit.

### Sources

- [HACS (Home Assistant Community Store) - how many of you use it?](https://www.reddit.com/r/homeassistant/comments/muxd5z/hacs_home_assistant_community_store_how_many_of/)
- [HACS](https://www.hacs.xyz)
- [HACS 2.0 - The best way to share community-made projects just got ...](https://www.home-assistant.io/blog/2024/08/21/hacs-the-best-way-to-share-community-made-projects/)
- [Best HACS Integrations for Home Assistant 2024 - SmartHomeScene](https://smarthomescene.com/blog/best-hacs-integrations-for-home-assistant/)
- [5 Home Assistant Community Store (HACS) Integrations You Should ...](https://hometechhacker.com/5-home-assistant-community-store-hacs-integrations-you-should-try/)

## User

How do users generally feel about the limitations of HAOS

## Assistant

### **How Do Users Generally Feel About the Limitations of Home Assistant OS (HAOS)?**

User opinions about the limitations of **Home Assistant OS (HAOS)** tend to vary based on their technical expertise, use cases, and expectations. Here's a breakdown of how users perceive these limitations, based on discussions from various forums and Reddit threads:

### **1. General Sentiment: Stability vs. Flexibility**
- **Stability**: Many users appreciate the stability and ease of use that HAOS provides. It is often described as a "set it and forget it" system, which is ideal for users who want a reliable smart home platform without needing to worry about maintaining the underlying operating system. For most users, especially those who are not highly technical, HAOS is seen as more than sufficient for their needs.
  - *"HAOS is perfect for home automation without needing to be a full-fledged programmer"*.[1]
  - *"Home Assistant itself is rock solid... Almost all problems I've had were with 'everything else,' like integrations or Wi-Fi issues"*.[2]

- **Flexibility**: On the other hand, more advanced users who want full control over their system often feel constrained by HAOS. These users may prefer **Home Assistant Supervised** or other installation methods that allow them to run additional services, manage Docker containers, or customize the underlying Linux environment.
  - *"HAOS is great if you just want to set it up and leave it alone, but if you want more control over your system, Supervised offers more flexibility"*.[3]

### **2. Lack of Control Over the Underlying OS**
- **Positive**: For many users, the lack of control over the underlying OS is actually a benefit because it reduces complexity and maintenance. HAOS automatically handles updates, security patches, and system health checks, which means less manual intervention is required.
  - *"I love that I don't have to worry about maintaining the OS—HAOS just works"*.[1]
  
- **Negative**: Advanced users who want to install additional software or run other services alongside Home Assistant find this limitation frustrating. These users often prefer **Supervised** or **Container** installations for more control.
  - *"If you need to run other applications like Plex or Pi-hole on the same machine, HAOS won't work for you"*.[1]

### **3. Docker and Add-ons Management**
- **Positive**: The built-in add-on store in HAOS is seen as a major advantage for most users. It simplifies the process of installing additional services like MQTT brokers or databases without needing to manually manage Docker containers.
  - *"The add-on store makes it super easy to install things like Node-RED or MariaDB without needing to mess with Docker"*.[2]

- **Negative**: Some advanced users feel limited by not being able to manually manage Docker containers or run custom containers outside of Home Assistant's ecosystem.
  - *"I wish I could manage Docker myself; I'm used to running multiple services on my server"*.[1]

### **4. Networking Customization**
- **Positive**: For most users, HAOS's simplified networking setup is sufficient. They don't need advanced configurations like VLANs or custom firewall rules.
  - *"HAOS handles networking well enough for my needs—it's plug-and-play"*.[2]

- **Negative**: Users with more complex networking requirements (e.g., VLANs, custom IP routing) find HAOS too restrictive.
  - *"If you need advanced network setups, you're better off with Supervised or Container installations"*.[1]

### **5. Hardware Access**
- **Positive**: HAOS supports common hardware like Zigbee/Z-Wave sticks out of the box, which satisfies most users' needs.
  - *"I plugged in my Z-Wave stick and everything just worked—no need for manual driver installs"*.[3]

- **Negative**: Users who need to manually install drivers or troubleshoot hardware at the OS level are frustrated by HAOS's lack of access to these features.
  - *"I needed to install a custom driver for my Zigbee stick, but couldn't do it with HAOS"*.[1]

### **6. Resource Allocation**
- Some power users feel that dedicating an entire machine solely to Home Assistant (as required by HAOS) is inefficient if they have powerful hardware that could be shared with other services.
  - *"I have a powerful server and would prefer to run multiple services on it alongside Home Assistant, but HAOS doesn't allow that"*.[1]

### **7. Backup & Restore**
- Most users appreciate the built-in backup and restore functionality in HAOS. However, some advanced users wish they had more control over backing up the entire OS rather than just Home Assistant data.
  - *"The backup feature works great for Home Assistant data but doesn't cover other system-level backups"*.[3]

### **8. HACS (Home Assistant Community Store)**
HACS is widely regarded as an essential tool for expanding Home Assistant's capabilities by allowing access to community-made integrations and custom components.

- **Positive**: Many users find HACS invaluable because it fills gaps in official integrations and offers advanced features not available in Home Assistant Core.
  - *"HACS makes life easier—there are so many great community integrations that you can install with just a few clicks"*.[4]
  
- **Negative**: Some users avoid HACS due to concerns about stability since HACS projects are community-maintained and may not go through rigorous testing.
  - *"If you're looking for maximum stability, HACS might not be for you—it can introduce instability if you're not careful"*.[6]

### **Are These Valid Reasons to Install Supervised?**
For some users, yes:
- If you need full control over the underlying OS (e.g., running additional services like Plex or Pi-hole), **Home Assistant Supervised** is a valid choice.
- If you require advanced networking setups (e.g., VLANs), manual Docker management, or custom hardware configurations that aren't supported out-of-the-box by HAOS, then Supervised offers more flexibility.

However, for most users who prioritize stability, ease of use, and minimal maintenance over flexibility, HAOS remains the best option.

### **Conclusion**
In summary:
- Most users find that HAOS meets their needs perfectly due to its stability and ease of use.
- Advanced users who need more control over their system may feel constrained by HAOS's limitations and opt for Supervised installations instead.
  
Ultimately, whether these limitations are deal-breakers depends on your specific requirements and technical expertise. For those who just want a reliable home automation platform without much hassle, HAOS is generally considered sufficient.

### Sources

- [HA OS vs Supervised](https://community.home-assistant.io/t/ha-os-vs-supervised/395968)
- [Is this worth getting into? : r/homeassistant - Reddit](https://www.reddit.com/r/homeassistant/comments/196vzpm/is_this_worth_getting_into/)
- [HA OS vs Supervised](https://community.home-assistant.io/t/ha-os-vs-supervised/395968/14)
- [HACS (Home Assistant Community Store) - how many of you use it?](https://www.reddit.com/r/homeassistant/comments/muxd5z/hacs_home_assistant_community_store_how_many_of/)
- [Looking for the ugly truth - Installation - Home Assistant Community](https://community.home-assistant.io/t/looking-for-the-ugly-truth/700032)
- [HACS 2.0 - The best way to share community-made projects just got better](https://www.home-assistant.io/blog/2024/08/21/hacs-the-best-way-to-share-community-made-projects/)
- [Anyone here using Home Assistant Green? What 's Your Opinion far?](https://community.home-assistant.io/t/anyone-here-using-home-assistant-green-what-s-your-opinion-far/686548)
