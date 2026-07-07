---
source_url: "https://www.perplexity.ai/search/307b82e0-7157-4474-98de-e623c2ebf7cf"
thread_uuid: "b74e0af7-2578-409a-b6ce-671c49c91583"
slug: "307b82e0-7157-4474-98de-e623c2ebf7cf"
title: "I have a surface pro I'd like to install home assistant on. Since it's intended to be the server, should I install Home Assistant Supervised, or HaOS, if I desire it to also act as a frontend? Like I want to mount it and also use it as a touchscreen for the Home Assistant interface, AND run the server.

Can I safely uninstall windows when I do this in order to install HaOS?

More broadly, does HaOS support BOTH the backend and the front end?"
extracted_at: "2026-06-29T16:10:18.951Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# I have a surface pro I'd like to install home assistant on. Since it's intended to be the server, should I install Home Assistant Supervised, or HaOS, if I desire it to also act as a frontend? Like I want to mount it and also use it as a touchscreen for the Home Assistant interface, AND run the server.

Can I safely uninstall windows when I do this in order to install HaOS?

More broadly, does HaOS support BOTH the backend and the front end?

Source: [Perplexity thread](https://www.perplexity.ai/search/307b82e0-7157-4474-98de-e623c2ebf7cf)

## User

I have a surface pro I'd like to install home assistant on. Since it's intended to be the server, should I install Home Assistant Supervised, or HaOS, if I desire it to also act as a frontend? Like I want to mount it and also use it as a touchscreen for the Home Assistant interface, AND run the server.

Can I safely uninstall windows when I do this in order to install HaOS?

More broadly, does HaOS support BOTH the backend and the front end?

## Assistant

If you want to use your Surface Pro as both the Home Assistant server and a touchscreen interface for controlling Home Assistant, **Home Assistant OS (HaOS)** is likely the better option for you. Here's why:

## **HaOS vs. Supervised for Your Use Case**

### **Home Assistant OS (HaOS)**
- **Backend and Frontend Support**: HaOS includes both the backend (server) and frontend (dashboard) components of Home Assistant in a single package. This means that once installed, you can access the Home Assistant dashboard through a web browser, including on the same device it's running on. So, your Surface Pro can act as both the server and the touchscreen interface for controlling your smart home.[3][6]
- **Minimal Maintenance**: HaOS is designed to be a "set it and forget it" system. It automatically handles updates for the underlying operating system, Supervisor, and add-ons. This is ideal if you don't want to spend time managing the system manually.[1][4]
- **Add-ons**: HaOS supports add-ons that can extend its functionality, such as installing an MQTT broker or Node-RED directly through its UI. This makes it easier to manage integrations without needing to manually install additional software.[5]
- **Uninstalling Windows**: Yes, you can safely uninstall Windows in favor of HaOS. When you install HaOS, it will replace Windows as the primary operating system on your Surface Pro. You can follow instructions similar to those used for installing HaOS on x86-64 PCs by creating a bootable USB drive with the HaOS image and flashing it onto your Surface Pro's internal storage.[2]

### **Home Assistant Supervised**
- **More Control but More Maintenance**: A Supervised installation gives you more control over the underlying operating system because it's installed on top of a Linux distribution like Debian. However, this also means you'll be responsible for maintaining the OS, updating packages manually, and ensuring compatibility with Home Assistant updates.[4][1]
- **Not Ideal for Your Use Case**: If your goal is to have a dedicated device that acts as both the server and touchscreen interface with minimal maintenance, Supervised is likely overkill. It's more suitable if you need to run other applications outside of Home Assistant or want full control over the Linux environment.

## **Can HaOS Act as Both Backend and Frontend?**
Yes, HaOS supports both the backend (server) and frontend (dashboard). The frontend is accessible via any web browser or through the Home Assistant app, which means you can use your Surface Pro’s screen as a touchscreen interface while running HaOS in the background. You would simply open a browser on your Surface Pro and navigate to `http://localhost:8123` or `http://<your-ip>:8123` to access the dashboard.[3]

## **Conclusion**
For your scenario—using your Surface Pro as both a server and touchscreen interface—**HaOS** is the best choice. It simplifies management by automatically handling updates and includes both backend and frontend functionality without requiring additional setup. You can safely uninstall Windows when installing HaOS, turning your Surface Pro into a dedicated smart home hub with minimal maintenance required.

### Sources

- [HA OS vs Supervised - Installation - Home Assistant Community](https://community.home-assistant.io/t/ha-os-vs-supervised/395968)
- [Installing HAOS on a dedicated x86-64 PC - Home Assistant OS](https://community.home-assistant.io/t/installing-haos-on-a-dedicated-x86-64-pc/443011)
- [Run both HAOS and UI at the same device X86-64 hardware](https://community.home-assistant.io/t/run-both-haos-and-ui-at-the-same-device-x86-64-hardware/520774)
- [What is the difference between a dedicated Home Assistant OS ...](https://community.home-assistant.io/t/what-is-the-difference-between-a-dedicated-home-assistant-os-install-and-a-supervised-install/395684)
- [Home Assistant Add-ons](https://www.home-assistant.io/addons/)
- [r/homeassistant on Reddit: Can somebody please explain to me the ...](https://www.reddit.com/r/homeassistant/comments/1ahe83c/can_somebody_please_explain_to_me_the_difference/)
