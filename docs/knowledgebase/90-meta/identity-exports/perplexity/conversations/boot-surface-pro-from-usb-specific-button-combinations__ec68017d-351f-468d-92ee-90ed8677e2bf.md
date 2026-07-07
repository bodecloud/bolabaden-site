---
source_url: "https://www.perplexity.ai/search/70151b38-3ce9-422b-9341-bd4f30de8cdb"
thread_uuid: "ec68017d-351f-468d-92ee-90ed8677e2bf"
slug: "70151b38-3ce9-422b-9341-bd4f30de8cdb"
title: "Boot surface pro from USB, specific button combinations"
extracted_at: "2026-06-29T16:09:52.450Z"
matched_keywords: []
export_suite: "identity"
entry_count: 7
provenance: perplexity-rest-api
---

# Boot surface pro from USB, specific button combinations

Source: [Perplexity thread](https://www.perplexity.ai/search/70151b38-3ce9-422b-9341-bd4f30de8cdb)

## User

Boot surface pro from USB, specific button combinations

## Assistant

To boot a Microsoft Surface Pro from a USB drive, you need to follow these steps, which involve specific button combinations:

1. **Shut down your Surface Pro** completely.
2. **Insert the bootable USB drive** into the USB port on your Surface.
3. **Press and hold the volume-down button** on the side of the Surface.
4. While holding the volume-down button, **press and release the power button**.
5. Continue holding the volume-down button until you see the **Surface or Microsoft logo** appear with spinning dots beneath it.
6. Once the dots appear, release the volume-down button, and your Surface should boot from the USB drive.

If you want to change the boot order permanently or access UEFI settings:

1. **Shut down your Surface**.
2. **Press and hold the volume-up button**, then press and release the power button while still holding volume-up.
3. This will bring up the **UEFI menu**, where you can configure boot order and other settings if needed.[1][2][3]

This process works across most Surface models, including Surface Pro 3, 4, and newer models.

### Sources

- [Force Any Surface Pro Model (to date) to Boot Off USB - YouTube](https://www.youtube.com/watch?v=LkluiZ8o6W0)
- [Booting from USB drive on Surface - Microsoft Community](https://answers.microsoft.com/en-us/surface/forum/all/booting-from-usb-drive-on-surface/7cd9c4a4-b5fd-4e79-a7dc-6238d622fc06)
- [Boot Surface from a USB device - Microsoft Support](https://support.microsoft.com/en-us/surface/boot-surface-from-a-usb-device-fe7a7323-8d1d-823d-be17-9aec89c4f9f5)
- [How to Boot Your Surface Pro From a USB Drive - Lifewire](https://www.lifewire.com/boot-surface-pro-from-usb-5219506)

## User

It doesn't seem to boot from USB when I follow those steps exactly. Determine specifically why breaking the problem down step by step.

## Assistant

If your Microsoft Surface Pro is not booting from a USB drive despite following the correct steps, there could be several potential issues. Let's break down the problem step by step to troubleshoot why it might not be working.

### 1. **Check the Bootable USB Drive**
   - **Is the USB drive bootable?**  
     Ensure that the USB drive is properly configured as a bootable device. If you're using it to install or repair Windows, you can use tools like the **Windows Media Creation Tool** or create a recovery drive using Windows' built-in tool. If the USB drive isn't bootable, the Surface won't recognize it as a valid boot option.[1][2]
   
   - **Correct File System Format:**  
     The Surface Pro requires the USB drive to be formatted as **FAT32** for UEFI-based systems. If your USB is formatted as NTFS or another file system, it may not be recognized. You can reformat it using `diskpart` in Command Prompt.[2]

### 2. **USB Port and Drive Compatibility**
   - **Is the USB port working?**  
     Try plugging in another USB device (like a mouse or keyboard) to ensure that the port is functioning correctly.
   
   - **Is the USB drive compatible?**  
     Some older or faulty USB drives may not be recognized by the Surface Pro. Try using a different USB stick to see if that resolves the issue.

### 3. **Disable Fast Startup**
   - **Fast Startup Interference:**  
     If Fast Startup is enabled on your Surface, it can prevent proper recognition of external boot devices. To disable Fast Startup:
     - Go to **Control Panel > Power Options > Choose what the power buttons do**.
     - Click on **Change settings that are currently unavailable**, then uncheck **Turn on fast startup**.[1]

### 4. **Correct Button Combination**
   - **Volume-Down + Power Button:**  
     The correct method for booting from a USB on Surface Pro models involves pressing and holding the **volume-down button**, then pressing and releasing the **power button** while continuing to hold volume-down until you see the Surface logo with spinning dots. If you release too early or press the wrong combination, it might not work.[4]

### 5. **Secure Boot Settings in UEFI**
   - **Secure Boot Interference:**  
     Secure Boot might prevent your Surface from booting from non-Windows operating systems (e.g., Linux). You can disable Secure Boot in UEFI:
     - Shut down your Surface.
     - Press and hold the **volume-up button**, then press and release the power button while still holding volume-up. This will open UEFI settings.
     - Navigate to the **Security** page and disable Secure Boot.[2][1]
   
   - **Boot Order Configuration:**  
     While in UEFI, ensure that under "Boot Configuration," the option for booting from USB devices is enabled and that "USB Storage" is set as a higher priority than internal storage.[1]

### 6. **USB Drive Not Detected**
   If after all these steps, your Surface still doesn't detect the USB drive:
   - Try creating a new bootable USB drive using a different method (e.g., Rufus for Linux distributions).
   - Ensure that your Surface's firmware (UEFI) is up-to-date by checking Microsoft's website for updates.

By carefully going through each of these steps, you should be able to identify why your Surface Pro isn't booting from USB and resolve the issue accordingly.

### Sources

- [How to Boot Surface from USB [For All Models] - MiniTool](https://www.minitool.com/partition-disk/surface-boot-from-usb.html)
- [Boot Surface from a USB device](https://support.microsoft.com/en-us/surface/boot-surface-from-a-usb-device-fe7a7323-8d1d-823d-be17-9aec89c4f9f5)
- [Microsoft Surface Pro 1,2,3,4,5,6,7 ~ Enter BIOS / UEFI & Boot From ...](https://www.youtube.com/watch?v=7cS4mbKPj1M)
- [Force Any Surface Pro Model (to date) to Boot Off USB](https://www.youtube.com/watch?v=LkluiZ8o6W0)

## User

is there a reason why in the bios settings I can't use the attachable keyboard/touchpad thing? Only seems to work when it's fully booted. Explain it to a software developer by breaking down the low-level hardware/software step by step. Ensure all research is done on these concepts first.

Specifically Surface Pro 3. I can't even seem to use my USB mouse or a USB keyboard there.

## Assistant

The issue you're experiencing with the Surface Pro 3's attachable keyboard and USB peripherals not working in the BIOS (UEFI) is likely due to a combination of low-level hardware initialization, firmware settings, and driver dependencies. Let’s break it down step by step from a technical perspective, focusing on how the hardware interacts with the firmware and operating system.

### 1. **UEFI vs. OS-Level Drivers**
   - **UEFI (Unified Extensible Firmware Interface)** is the modern replacement for BIOS and is responsible for initializing hardware before the operating system (OS) loads. Unlike the OS, UEFI does not rely on advanced drivers that are loaded during Windows startup.
   - The **Surface Type Cover** (attachable keyboard) and touchpad rely on specific drivers that are loaded by Windows once the OS boots. These drivers are not native to UEFI, which means they may not be initialized or functional in UEFI mode unless explicitly supported by UEFI firmware.
   - **USB peripherals** (like your USB keyboard and mouse) also depend on low-level USB initialization routines in UEFI. If these routines are not properly configured or if USB support is disabled in UEFI, your devices won’t work.

### 2. **Firmware Initialization of Hardware**
   - When you power on your Surface Pro 3, the UEFI firmware initializes basic hardware components such as the CPU, RAM, and storage devices. However, **peripheral devices**, like keyboards or touchpads, require additional initialization.
   - The attachable Surface Type Cover uses a proprietary interface that may not be fully initialized by UEFI unless Microsoft has specifically added support for it in the firmware. This is why it works once Windows loads but not in UEFI.

### 3. **USB Initialization in UEFI**
   - For **USB keyboards and mice** to work in UEFI, the firmware must have support for **USB Legacy Mode** or **USB initialization** enabled. If this setting is disabled or misconfigured, USB devices will not be recognized at all during boot.
     - In some cases, **USB 3.0 support** can cause issues because older UEFI implementations may not initialize USB 3.0 ports correctly during pre-boot stages. Disabling USB 3.0 support or switching to a USB 2.0 port could help resolve this issue.[1][5]
     - Also, some systems require enabling **Legacy USB Support** in UEFI to allow USB devices to work before the OS loads.[1]

### 4. **Fast Startup and Secure Boot**
   - **Fast Startup** is a Windows feature that can interfere with proper shutdown and hardware reinitialization during boot. If Fast Startup is enabled, your Surface may not fully shut down, preventing UEFI from properly initializing all hardware components during reboot.[2]
   - Additionally, **Secure Boot**, a security feature in UEFI designed to prevent unauthorized software from loading during boot, can sometimes conflict with non-standard boot devices (like Linux-based USB drives) or even certain peripherals if they don’t have signed drivers.[5][2]

### 5. **Surface-Specific Firmware Issues**
   - The Surface Pro 3 has had known issues with its attachable keyboard and touchpad not working during pre-boot stages (such as in UEFI). This is likely because these peripherals were designed to work primarily within Windows after their drivers load.[6]
   - Some users have reported that external USB keyboards and mice work fine once Windows boots but fail to function within UEFI. This could indicate either a firmware bug or a misconfiguration that prevents proper initialization of external devices.[6]

### 6. **Possible Solutions**
   Here are some steps you can take to troubleshoot and potentially resolve this issue:

   - **Check UEFI Settings:**
     - Boot into UEFI by holding down the volume-up button while pressing the power button.
     - Once inside UEFI:
       - Ensure that **USB support** is enabled under "Boot Configuration" or "Advanced Options".[5]
       - Disable any options related to **Fast Boot** or similar features that might skip hardware initialization.[2]
       - If there’s an option for **Legacy USB Support**, make sure it’s enabled.[1]
   
   - **Disable Secure Boot:**
     - In some cases, disabling Secure Boot can help resolve issues with peripheral detection, especially if you’re trying to boot from a non-Windows operating system.[2][5]

   - **Use Different USB Ports:**
     - Try plugging your external keyboard/mouse into different USB ports (preferably a USB 2.0 port if available). Some users have reported success when using specific ports that are initialized earlier in the boot sequence.[6][1]

   - **Update Firmware:**
     - Ensure that your Surface Pro 3 has the latest firmware updates installed from Microsoft’s official site. Firmware updates often include fixes for peripheral compatibility issues.[3]

### Summary
In summary, your issue stems from how the Surface Pro 3’s UEFI initializes hardware prior to loading Windows. The attachable keyboard and touchpad rely on drivers that are only available once Windows boots up, while external USB devices depend on proper configuration of legacy support and USB initialization routines in UEFI. By checking your UEFI settings (especially for USB support), disabling Fast Startup, and ensuring your firmware is up-to-date, you should be able to resolve most issues related to peripheral detection during boot.

If none of these steps work, using an external wired keyboard/mouse might be necessary until you can boot into Windows and have full driver support restored.

### Sources

- [keyboard is not working in BOOT or BIOS | [solutions] 2022](https://www.youtube.com/watch?v=cnAt8eevxCY)
- [How to Boot Surface from USB [For All Models] - MiniTool](https://www.minitool.com/partition-disk/surface-boot-from-usb.html)
- [Can't use Keyboard or Touchpad to get to UEFI : r/Surface - Reddit](https://www.reddit.com/r/Surface/comments/th2jxw/cant_use_keyboard_or_touchpad_to_get_to_uefi/)
- [Surface Pro 3 - Hardware - openSUSE Forums](https://forums.opensuse.org/t/surface-pro-3/144966)
- [Boot Surface from a USB device](https://support.microsoft.com/en-us/surface/boot-surface-from-a-usb-device-fe7a7323-8d1d-823d-be17-9aec89c4f9f5)
- [Unresponsive keyboard and trackpad on bios page. : r/Surface](https://www.reddit.com/r/Surface/comments/105lh2f/unresponsive_keyboard_and_trackpad_on_bios_page/)
- [How to use Surface UEFI - Microsoft Support](https://support.microsoft.com/en-us/surface/how-to-use-surface-uefi-df2c8942-dfa0-859d-4394-95f45eb1c3f9)

## User

You're serious? the USB AND the attachable can't be used in the settings menu??? how the hell do they expect me to navigate the interface then? the touchscreen doesn't even work there. Is this a fundamental design flaw? How am i meant to edit bios settings

## Assistant

The issue you're experiencing with the Surface Pro 3, where neither the attachable keyboard nor USB peripherals (keyboard/mouse) work in the UEFI settings, is indeed frustrating and not uncommon. This problem stems from how the Surface devices (and some other modern laptops) handle hardware initialization at the firmware level (UEFI), and it can feel like a design flaw, though it's more of a limitation of how certain hardware components are initialized during pre-boot stages.

### Why This Happens

1. **Driver Dependency in UEFI**:
   - The **Surface Type Cover** (attachable keyboard) requires specific drivers that are loaded by the operating system (Windows). These drivers are not embedded in the UEFI firmware, which means that the keyboard and touchpad will not function until Windows loads and initializes those drivers.
   - Similarly, **USB peripherals** (like external keyboards and mice) rely on basic USB initialization by the UEFI firmware. If UEFI doesn't have proper support for USB devices or if certain settings (like Legacy USB Support) are disabled, these devices won't work either.

2. **Touchscreen Not Working in UEFI**:
   - The touchscreen on Surface devices also relies on OS-level drivers. In UEFI mode, there is no support for advanced input devices like touchscreens because UEFI is designed to be lightweight and only initialize basic hardware components needed for booting.

3. **Firmware Limitations**:
   - Many users have reported that neither the attachable keyboard nor external USB peripherals work in UEFI on Surface devices, including Surface Pro 3 and Surface Laptop models. This is likely due to a combination of firmware design choices and how Microsoft prioritizes hardware initialization during pre-boot. The fact that the keyboard works once Windows loads but not in UEFI suggests that the device’s firmware does not natively support these peripherals during boot.[1][3]

4. **Fast Boot or Secure Boot Interference**:
   - Some users have found that **Fast Boot** or **Secure Boot** settings may interfere with peripheral detection in UEFI. These features are designed to speed up boot times by skipping certain hardware initialization steps, which can prevent USB devices from being recognized early in the boot process.[4]

### How to Navigate UEFI Without Keyboard/Mouse

Unfortunately, if both your attachable keyboard and USB peripherals aren't working in UEFI, you're left with very few options for navigating the interface. Here are some potential workarounds:

1. **Use External USB Devices**:
   - Some users have reported success using different types of external keyboards or mice. If your current USB peripherals aren't working, try using a different brand or model (preferably one that uses USB 2.0 instead of USB 3.0). Sometimes older devices are more likely to be recognized by UEFI.[4]

2. **Update Firmware**:
   - Ensure that your Surface Pro 3 is running the latest firmware version from Microsoft’s website. Firmware updates often include fixes for hardware compatibility issues, including problems with peripheral detection in UEFI.[3]

3. **Access UEFI via Windows Advanced Startup**:
   - If you can’t navigate UEFI directly, you can try accessing certain settings through **Windows Advanced Startup Options**:
     - Go to **Settings > Update & Security > Recovery**, then under "Advanced startup," click **Restart now**.
     - From here, you can access some UEFI settings without needing to navigate directly within UEFI.

4. **Use Volume Buttons (If Supported)**:
   - On some Surface models, users have tried using volume buttons to navigate the UEFI menu when no other input method works. However, this may not be supported on all models.[1]

5. **Resetting Firmware Defaults Blindly**:
   - In extreme cases where you can't navigate at all, you might consider resetting your UEFI settings to default blindly using key combinations or by removing any connected peripherals and holding down specific buttons (volume + power). Be cautious with this approach as it could reset critical settings like boot order.

### Is This a Design Flaw?

From a user perspective, this can certainly feel like a design flaw because it limits your ability to interact with essential system settings without access to specialized input methods. However, from a technical standpoint:

- The Surface Pro 3 was designed as a tablet-first device with an optional attachable keyboard. As such, Microsoft may not have prioritized full support for these peripherals in pre-boot environments like UEFI.
- The reliance on OS-level drivers for both the Type Cover and touchscreen means that these components simply aren't initialized until Windows loads.

This issue has been noted across multiple Surface models (Pro 2, Pro 5, Laptop 3), suggesting it's more of a limitation of Microsoft's firmware design rather than an outright flaw.[4]

### Conclusion

To summarize:
- The inability to use your attachable keyboard or USB peripherals in UEFI is due to a lack of native driver support within the firmware.
- You can try using different external keyboards/mice or updating your firmware to see if it resolves the issue.
- If none of these workarounds help, you're left with very limited options for navigating UEFI without functional input devices.

While it’s frustrating, this limitation is unfortunately common with Surface devices and some other modern laptops/tablets that prioritize OS-level driver support over full pre-boot functionality for optional accessories like keyboards and touchpads.

### Sources

- [How can I navigate Surface UEFI on a Surface Pro 4 with a faulty ...](https://www.surfaceforums.net/threads/how-can-i-navigate-surface-uefi-on-a-surface-pro-4-with-a-faulty-touch-screen.26614/)
- [Surface Pro 3- Big Problems After Win 10 Update](https://answers.microsoft.com/en-us/surface/forum/all/surface-pro-3-big-problems-after-win-10-update/e9747ee7-8642-460d-b058-393d43b7a9bb)
- [Can't use Keyboard or Touchpad to get to UEFI : r/Surface - Reddit](https://www.reddit.com/r/Surface/comments/th2jxw/cant_use_keyboard_or_touchpad_to_get_to_uefi/)
- [Unresponsive keyboard and trackpad on bios page.](https://www.reddit.com/r/Surface/comments/105lh2f/unresponsive_keyboard_and_trackpad_on_bios_page/)

## User

Am beyond confused. If they put a settings menu here, what's the intended method of navigating it? Like three different input methods do not work here:
- Touch
- USB peripheral
- Attachable keyboard/touchpad thing

## Assistant

Your confusion is entirely justified. The inability to navigate the UEFI (BIOS) settings on Surface devices, particularly the Surface Pro 3, is a well-documented and frustrating issue. Let's break down the situation:

1. Intended Navigation Method:
   Microsoft's original intention was likely for users to navigate the UEFI settings using the built-in keyboard (for Surface Laptops) or the Type Cover (for Surface Pro devices). However, this doesn't always work as expected.

2. Known Issues:
   - Touch input often doesn't work in UEFI settings.
   - The attachable keyboard/touchpad (Type Cover) frequently fails to function in UEFI.
   - USB peripherals (keyboards and mice) are inconsistently recognized in UEFI.

3. Possible Explanations:
   - Driver Dependency: The Surface devices rely heavily on OS-level drivers for input devices, which aren't loaded in UEFI.
   - Firmware Limitations: The UEFI firmware may not fully initialize all hardware components, leading to non-functional input devices.
   - Design Oversight: It's possible that Microsoft didn't fully account for these scenarios in the initial design.

4. Workarounds and Solutions:
   - Volume Buttons: Some users report success using volume buttons to navigate (up/down) and the power button to select, though this doesn't work for all models.
   - External USB Devices: While not consistently effective, some users have had success with certain USB keyboards or mice.
   - Firmware Updates: Ensuring your device has the latest firmware updates can sometimes resolve these issues.
   - Windows Advanced Startup: Accessing UEFI settings through Windows Advanced Startup options can sometimes bypass the input device problems.

5. Design Flaw or Limitation?
   While not officially acknowledged as a flaw, this issue certainly limits user access to important system settings. It appears to be a significant oversight in the design of Surface devices' firmware and hardware integration.

In conclusion, there isn't a consistently reliable method to navigate UEFI settings on many Surface devices, which is indeed a serious usability issue. Microsoft hasn't provided a comprehensive solution, leaving users to rely on workarounds or, in some cases, unable to access these critical settings at all. This situation underscores a need for improvement in how Surface devices handle input methods during pre-boot environments.

### Sources

- [How can I navigate Surface UEFI on a Surface Pro 4 with a faulty ...](https://www.surfaceforums.net/threads/how-can-i-navigate-surface-uefi-on-a-surface-pro-4-with-a-faulty-touch-screen.26614/)
- [Unresponsive keyboard and trackpad on bios page.](https://www.reddit.com/r/Surface/comments/105lh2f/unresponsive_keyboard_and_trackpad_on_bios_page/)
- [Surface Pro 3 hangs at UEFI settings, and you encounter Stop errors, disk errors, and performance issues](https://support.microsoft.com/en-us/topic/surface-pro-3-hangs-at-uefi-settings-and-you-encounter-stop-errors-disk-errors-and-performance-issues-d31ca24f-177a-10e7-c5a7-697521e29825)
- [Troubleshoot Surface Type Cover or Keyboard - Microsoft Support](https://support.microsoft.com/en-us/surface/troubleshoot-surface-type-cover-or-keyboard-c106b37d-f55a-4640-8cb2-8f1b2b0207ea)
- [Can't use Keyboard or Touchpad to get to UEFI](https://www.reddit.com/r/Surface/comments/th2jxw/cant_use_keyboard_or_touchpad_to_get_to_uefi/)

## User

How is it PHYSICALLY POSSIBLE to have a settings menu with no intended way to interface with it. What the hell. You realize that doesn't make sense right? If a menu exists, there must have been a way to navigate it. Otherwise why have the menu obviously.

## Assistant

Your frustration with the Surface Pro 3's UEFI settings is completely understandable, especially considering the apparent lack of usable input methods to navigate the interface. Let's clarify the situation regarding the intended navigation of the UEFI settings and address your concerns about the design.

### Intended Navigation Methods

1. **Surface Type Cover (Attachable Keyboard)**:
   - The primary method for navigating UEFI settings was likely intended to be through the Surface Type Cover. However, many users have reported that this keyboard does not function in UEFI, which severely limits navigation options.

2. **Touchscreen**:
   - The touchscreen is another potential input method, but it often does not work in UEFI mode either. This limitation is due to a lack of driver support for touch input at the firmware level.

3. **USB Peripherals**:
   - External USB keyboards and mice are expected to work in UEFI, but many users find that their devices are not recognized during this phase, particularly if they are USB 3.0 devices or if Legacy USB Support is not enabled in UEFI.

### Why This Design Seems Flawed

1. **Driver Dependency**:
   - The Surface Pro 3 relies on Windows for most of its functionality, including input device drivers. This means that once you enter UEFI, without the necessary drivers loaded, many input methods simply do not work.

2. **Limited Firmware Initialization**:
   - The UEFI firmware initializes basic hardware components but may not fully support all devices, especially proprietary ones like the Type Cover. This can lead to a situation where a menu exists, but there is no functional way to interact with it.

3. **User Experience Oversight**:
   - The existence of a settings menu without clear navigation options can be seen as a significant oversight in design. Users expect to be able to access and modify firmware settings easily, especially when such settings are crucial for troubleshooting or configuring boot options.

### Addressing Your Concerns

- **Why Have a Menu Without Navigation?**: 
  The menu exists because it is part of the UEFI specification that allows users to configure hardware settings and boot options. However, Microsoft may have assumed that users would primarily use their devices with the Type Cover attached or that they would have access to compatible USB peripherals. Unfortunately, this assumption does not hold true for all users.

- **Physical Possibility vs. Usability**: 
  While it is physically possible to have a menu in UEFI, it becomes a usability issue when users cannot effectively interact with it due to hardware limitations or design choices. This disconnect between physical capability and user experience can lead to significant frustration.

### Conclusion

In summary, while there are intended methods for navigating the Surface Pro 3's UEFI settings—primarily through the Type Cover or USB peripherals—the reality is that many users encounter significant barriers due to lack of support for these input methods in UEFI mode. This situation highlights a critical area for improvement in device design and user experience for Microsoft’s Surface line. Your concerns about having an interface with no clear means of interaction are valid and point to a need for better integration of hardware and firmware functionality in future models.

### Sources

- [How to use Surface UEFI - Microsoft Support](https://support.microsoft.com/en-us/surface/how-to-use-surface-uefi-df2c8942-dfa0-859d-4394-95f45eb1c3f9)
- [Devices-docs/surface/manage-surface-uefi-settings.md at public](https://github.com/microsoftdocs/devices-docs/blob/public/surface/manage-surface-uefi-settings.md)
- [How can I navigate Surface UEFI on a Surface Pro 4 with a faulty touch screen?](https://www.surfaceforums.net/threads/how-can-i-navigate-surface-uefi-on-a-surface-pro-4-with-a-faulty-touch-screen.26614/)
- [How to Boot Surface from USB [For All Models] - MiniTool](https://www.minitool.com/partition-disk/surface-boot-from-usb.html)
- [Advanced UEFI security features for Surface Pro 3 - GitHub](https://github.com/microsoftdocs/devices-docs/blob/public/surface/advanced-uefi-security-features-for-surface-pro-3.md)
- [Surface Book 3: How to enter BIOS (UEFI) and Enable Battery Limit ...](https://www.youtube.com/watch?v=r3ZqNKMmKYY)
- [Microsoft Surface Pro 1,2,3,4,5,6,7 ~ Enter BIOS / UEFI & Boot From USB](https://www.youtube.com/watch?v=7cS4mbKPj1M)
- [Boot Surface from a USB device](https://support.microsoft.com/en-us/surface/boot-surface-from-a-usb-device-fe7a7323-8d1d-823d-be17-9aec89c4f9f5)

## User

```
Addressing Your Concerns
Why Have a Menu Without Navigation?:
The menu exists because it is part of the UEFI specification that allows users to configure hardware settings and boot options. However, Microsoft may have assumed that users would primarily use their devices with the Type Cover attached or that they would have access to compatible USB peripherals. Unfortunately, this assumption does not hold true for all users.
```
Obviously i'm asking you to research this

## Assistant

I apologize for the confusion in my previous response. After reviewing the search results, I can provide a more accurate explanation regarding navigation in the UEFI settings for Surface devices, particularly the Surface Pro 3:

The UEFI menu on Surface Pro 3 and earlier devices is designed to be navigable, contrary to the impression given earlier. Here's how it's intended to work:

1. **Volume Buttons**: The primary method of navigation in the UEFI/BIOS settings for Surface Pro 3 and earlier models is using the volume buttons. The volume-up button is used to enter the UEFI settings and can also be used for navigation within the menu.[4]

2. **Power Button**: The power button is used in conjunction with the volume-up button to enter the UEFI settings. It may also serve as a selection button within the menu.[4]

3. **Touchscreen**: While not explicitly mentioned for Surface Pro 3, UEFI generally supports touchscreen input for devices that have this capability.[1][3]

4. **Type Cover and USB Peripherals**: Although these may not always work in UEFI mode, they are intended to be usable for navigation when properly initialized by the firmware.[2]

The reason for having this menu is that it's an essential part of the UEFI specification, allowing users to configure critical hardware settings and boot options. Microsoft implemented this interface following UEFI standards, which include provisions for user interaction during the pre-boot phase.[3][1]

It's important to note that while there may be inconsistencies or limitations in how different input methods work across various Surface models, the UEFI menu is designed with the intention of being navigable, primarily through the use of hardware buttons (volume and power) when other input methods fail.[4]

### Sources

- [2. Overview — UEFI Specification 2.10 documentation](https://uefi.org/specs/UEFI/2.10/02_Overview.html)
- [How to use Surface UEFI - Microsoft Support](https://support.microsoft.com/en-us/surface/how-to-use-surface-uefi-df2c8942-dfa0-859d-4394-95f45eb1c3f9)
- [UEFI: Meaning, Implementation, and Importance - Spiceworks](https://www.spiceworks.com/tech/tech-general/articles/what-is-unified-extensible-firmware-interface/)
- [How do I use the BIOS/UEFI on Surface Pro 3 and earlier devices](https://support.microsoft.com/en-us/surface/how-do-i-use-the-bios-uefi-on-surface-pro-3-and-earlier-devices-0f5953d2-befa-3617-a0e5-9735945af774)
