---
source_url: "https://www.perplexity.ai/search/1eda04b9-37c4-4552-bc07-314fb52ba8da"
thread_uuid: "0e81a19d-a938-4131-847e-1a3215b1b590"
slug: "1eda04b9-37c4-4552-bc07-314fb52ba8da"
title: "How realistically limiting is HaOS? Is it truly impossible to install things like plex server, or things that would otherwise require linux?"
extracted_at: "2026-06-29T16:10:06.651Z"
matched_keywords: []
export_suite: "identity"
entry_count: 2
provenance: perplexity-rest-api
---

# How realistically limiting is HaOS? Is it truly impossible to install things like plex server, or things that would otherwise require linux?

Source: [Perplexity thread](https://www.perplexity.ai/search/1eda04b9-37c4-4552-bc07-314fb52ba8da)

## User

How realistically limiting is HaOS? Is it truly impossible to install things like plex server, or things that would otherwise require linux?

## Assistant

**Home Assistant OS (HaOS)** is designed to provide a streamlined and managed environment for running Home Assistant, but it does come with certain limitations that may restrict its flexibility compared to a traditional Linux environment. Specifically, HaOS is meant to be a dedicated system for Home Assistant, which limits the installation of additional software outside of what is available through Home Assistant add-ons.

### **Limitations of HaOS**
- **Restricted Software Installation**: HaOS does not allow users to install arbitrary software directly on the system as you would on a typical Linux distribution. This means you cannot natively install software like Plex or other services that require full Linux access unless they are available as Home Assistant add-ons.
- **Add-ons Only**: The only way to extend HaOS functionality is through official or community-supported add-ons. While there are many useful add-ons available, including some for media servers and other services, the selection is limited compared to what you could install on a full Linux system.[1][5]
- **No Direct Access to the Underlying OS**: HaOS abstracts away the underlying operating system, meaning users do not have direct access to the file system or package managers like `apt` for installing additional software. This makes it difficult or impossible to run non-Home Assistant services unless they are containerized and provided as add-ons.

### **Is It Truly Impossible to Install Plex or Other Linux-Based Software?**
While it's true that you cannot directly install software like Plex on HaOS itself, there are workarounds:
- **Plex Add-on**: You can use the Plex integration within Home Assistant, which allows you to connect to an external Plex server. However, this requires that Plex be running on another machine or within a containerized environment managed separately from HaOS.[5]
- **Running Containers**: If you're comfortable with Docker, you could run Home Assistant in a Docker container (Home Assistant Container installation) on a standard Linux distribution. This would give you full control over the OS, allowing you to run Plex and other services in separate containers alongside Home Assistant. This approach offers more flexibility but requires more manual management.[2][1]
- **Virtualization**: Another option is to run Home Assistant OS in a virtual machine (VM) on a host system like Proxmox or Unraid. This way, you can allocate resources for both Home Assistant and other services like Plex within different VMs or containers on the same physical machine.[4]

### **Alternative Installation Methods**
If you're looking for more flexibility, consider these alternatives:
1. **Home Assistant Supervised**: This method allows you to run Home Assistant with Supervisor on top of an existing Debian-based OS. While this gives more control over the underlying system, it still has restrictions, such as requiring that no other software runs outside of Supervisor's control.[1]
2. **Home Assistant Core**: For complete control over your system, installing Home Assistant Core in a Docker container or directly on a Linux machine gives you full access to the OS. You can then manage other services like Plex independently.[2]

### Conclusion
While HaOS is limiting in terms of installing additional software like Plex directly, it is not impossible to achieve similar functionality by using alternative installation methods such as Docker containers or virtual machines. These methods allow you to run both Home Assistant and other services like Plex in parallel without sacrificing flexibility.

### Sources

- [Restrictions of supervised installation - Home Assistant Community](https://community.home-assistant.io/t/restrictions-of-supervised-installation/542109)
- [Limitations of non supervised installation : r/homeassistant - Reddit](https://www.reddit.com/r/homeassistant/comments/1175o0b/limitations_of_non_supervised_installation/)
- [Install HACS in Home Assistant - 2024 COMPLETE HOW TO Guide](https://www.youtube.com/watch?v=Q8Gj0LiklRE)
- [Home Assistant and Plex on the same machine? - Reddit](https://www.reddit.com/r/homeassistant/comments/szfhgr/home_assistant_and_plex_on_the_same_machine/)
- [Plex Media Server - Home Assistant](https://www.home-assistant.io/integrations/plex/)

## User

Not looking for alternatives. Just wondering how on earth HaOS does this. Surely when they MAKE haos they have to have the ability to add stuff in at some point or modify things etc. So why can't I just add in plex server or something from linux the same way?

## Assistant

Home Assistant OS (HaOS) is built to provide a **dedicated, minimal environment** specifically for running Home Assistant and its components. This design choice is deliberate and comes with significant restrictions that prevent users from installing arbitrary software, such as a Plex server, directly onto the system. Here's how and why HaOS enforces these limitations:

### **How HaOS Works**
1. **Buildroot-Based System**: HaOS is built using the *Buildroot* build system, which is not a typical Linux distribution but a tool for creating custom, minimal Linux environments. Buildroot strips down the operating system to only the necessary components required to run Home Assistant and its Supervisor. This means that many of the tools and libraries you would expect in a full Linux distribution (like package managers or development tools) are simply not included.[1][5]

2. **Containerized Environment**: HaOS uses Docker containers to isolate all components of Home Assistant, including add-ons. The Supervisor manages these containers and ensures that only approved add-ons (which are also Docker containers) can be installed. This containerized approach provides security and stability but also limits flexibility—users cannot easily install software outside of this controlled environment.[4][1]

3. **Security and Stability**: The system is designed to be robust and maintenance-free, prioritizing security and stability for home automation tasks. Allowing arbitrary software installations could introduce conflicts, security vulnerabilities, or performance issues that compromise the reliability of the home automation platform.[7][1]

### **Why You Can't Just Add Software Like Plex**
- **No Package Manager**: HaOS does not include a package manager like `apt` or `yum`, which are typically used to install software on Linux systems. Without these tools, there's no straightforward way to install additional software like Plex.[1]
  
- **Supervisor Control**: The Supervisor strictly controls what runs on HaOS. It monitors the system for any containers or services not managed by it (such as manually installed Docker containers), marking the installation as "unsupported" or "unhealthy". This is designed to ensure that only compatible and tested components are running, minimizing issues caused by third-party software.[3]

- **Minimal OS Design**: Since HaOS is built using Buildroot, it lacks many of the standard libraries and dependencies needed for general-purpose applications like Plex. Even if you could somehow bypass the Supervisor's restrictions, you'd likely run into dependency issues trying to install non-Home Assistant software.[5][1]

### **How Developers Modify HaOS**
When developing or modifying HaOS itself, developers use *Buildroot* to cross-compile and build the operating system image with specific configurations for supported hardware platforms. This process happens during development before deployment, allowing developers to include only the necessary components for running Home Assistant. However, once HaOS is deployed on your device, it's essentially locked down to prevent further modifications outside of the Home Assistant ecosystem.[5]

### **Conclusion**
In summary, while it might seem possible in theory to add software like Plex to a Linux-based system like HaOS, the reality is that HaOS is designed specifically to prevent such modifications. The combination of Buildroot's minimal environment, Docker containerization, and strict control by the Supervisor ensures that only approved software can run on the system. This design prioritizes stability and security over flexibility, which is why installing arbitrary Linux-based applications like Plex isn't feasible on HaOS without resorting to alternative installation methods (e.g., running Home Assistant in Docker on a full Linux OS).

### Sources

- [Home Assistant Operating System](https://developers.home-assistant.io/docs/operating-system/)
- [Install HACS in Home Assistant - 2024 COMPLETE HOW TO Guide](https://www.youtube.com/watch?v=Q8Gj0LiklRE)
- [Your installation is unhealthy - help needed](https://community.home-assistant.io/t/your-installation-is-unhealthy-help-needed/473926)
- [Home Assistant OS 11: Low-latency scheduler and VM snapshot ...](https://www.home-assistant.io/blog/2023/10/14/home-assistant-os-release-11/)
- [Getting started with Home Assistant Operating System development](https://developers.home-assistant.io/docs/operating-system/getting-started/)
- [What is the real required criteria for supervised install? - Reddit](https://www.reddit.com/r/homeassistant/comments/vaks84/what_is_the_real_required_criteria_for_supervised/)
- [Architecture overview - Home Assistant Developer Docs](https://developers.home-assistant.io/docs/architecture_index/)
