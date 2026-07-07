---
source_url: "https://grok.com/c/e5c18c54-cad6-4833-92ab-89af27e5e450"
conversation_id: "e5c18c54-cad6-4833-92ab-89af27e5e450"
title: "FIFINE AM8 Mic Blocks Speakers Fix"
extracted_at: "2026-06-29T16:32:24.199Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# FIFINE AM8 Mic Blocks Speakers Fix

Source: [Grok conversation](https://grok.com/c/e5c18c54-cad6-4833-92ab-89af27e5e450)

## User

_Time: 2026-03-19T23:24:09.284Z_

IFINE AmpliGame AM8 hogs speakers windows. As in, I have speakers plugged into a different jack completely separate from the microphone. But when I plug the microphone in, the speakers can't be used. Even when I set the default audio device to the speakers. How to fix this issue? Same thing happens on my iPhone, where the speakers/playback isn't possible while the mic is connected.

## Assistant

_Time: 2026-03-19T23:26:04.911Z_

**The FIFINE AmpliGame AM8 (likely the model you mean by "IFINE") causes this exact issue because its USB connection registers it as a combined input/output audio device.** The built-in 3.5mm headphone jack on the mic serves as a monitoring output, so Windows and iOS often route playback there by default—silencing your separate speakers (plugged into the PC's onboard audio jack or iPhone's built-in speakers) even if you set them as default.

**Key points**  
- This is standard behavior for USB mics with monitoring jacks; it's not a defect but how the device presents itself to the OS.  
- Evidence from the manufacturer, user reports, and setup guides shows simple output selection or disabling the mic's playback endpoint fixes it in most cases.  
- On Windows it almost always resolves with device selection; on iPhone it's slightly more limited but controllable via Control Center.  
- No hardware changes needed—avoid USB hubs and test direct connections first.

### Quick Windows Fix
1. Right-click the speaker icon in the taskbar and open **Sound settings**.  
2. Under **Output**, choose your main speakers (e.g., "Speakers (Realtek High Definition Audio)" or the device tied to your separate jack) and set as default.  
3. Under **Input**, keep "FIFINE Microphone" or "AM8".  
4. Click "More sound settings" → **Playback** tab: confirm speakers are default; right-click any "FIFINE" or "USB Audio" output → **Disable** (this prevents it from hogging audio while keeping the mic input active).  
5. Test playback in a browser or media player. Restart the PC or Windows Audio service (via services.msc) if it reverts.

### Quick iPhone Fix
1. Connect the mic via a genuine Apple USB-C/Lightning camera adapter.  
2. Swipe down from the top-right corner for **Control Center**.  
3. Tap the audio output card (or the triangle-with-circles icon) and select **iPhone** / **Built-in Speaker** (or your external speakers).  
4. In specific apps (e.g., voice memos or recording apps), double-check in-app audio output options.  

If playback still routes only to the mic's headphone jack, plug wired speakers/headphones there for monitoring, or use Bluetooth speakers separately for output while the mic handles input.

---

The FIFINE AmpliGame AM8 is a popular USB/XLR dynamic microphone marketed for gaming, streaming, and podcasting. It features RGB lighting, a touch-mute button, gain and monitoring volume knobs, and crucially a 3.5mm headphone jack for zero-latency monitoring of your own voice. When connected via USB (its primary mode for plug-and-play on computers and supported mobile devices), the mic complies with standard USB audio class protocols. This means the operating system sees it not just as a microphone input but as a complete audio interface with a playback (output) endpoint tied to that headphone jack.  

As a result, plugging the mic in can cause the system to automatically prefer or route audio to the "FIFINE AM8" / "USB Audio Device" playback option instead of your dedicated speakers. This explains why your speakers—plugged into a completely separate 3.5mm jack on the motherboard or laptop—stop working, even after manually setting them as the default device. The same logic applies on iPhone/iOS: the USB audio accessory takes priority for both input and output unless explicitly overridden. The manufacturer explicitly notes that while the mic works with iPhone via the recommended Apple Lightning-to-USB or USB-C camera adapter, results on mobile can vary due to adapter quality, power draw, and how iOS handles USB audio routing. Windows and Mac are listed as the primary recommended platforms for optimal performance.

This behavior is widely documented across official FIFINE resources, user forums, and independent reviews. The company even produced a dedicated YouTube troubleshooting video titled "[Tutorial] of How to Fix the Computer Audio Stopped When the FIFINE AM8 Microphone is Plugged in," which walks through Windows and Mac connection options. In it (and the accompanying product manual), FIFINE instructs users to manually select the computer's built-in or aux speakers as the default playback device rather than letting the mic's USB output take over. The manual specifically calls out: "Manually select the 'speaker (Realtek High Definition Audio)' as the default playback device" when the mic is connected. Similar guidance appears in FIFINE's setup tutorials for Windows 11, emphasizing that the mic input and system output are handled by separate endpoints in the sound control panel.

On the iPhone side, iOS treats compliant USB audio devices as full-duplex interfaces. Playback defaults to the mic's headphone jack (or goes silent if nothing is plugged in) because the system assumes you're using it like a headset. However, modern iOS versions (especially iOS 17+) expose output switching in Control Center, allowing you to force audio back to the built-in speakers or Bluetooth devices independently of the USB mic input. This split is not always guaranteed with every adapter or app, which is why FIFINE recommends sticking to Windows/Mac for best results and notes potential quality variations on phones/tablets. If Control Center doesn't show the option, the workaround is either disconnecting the mic when you need phone speakers or routing playback through the mic's own 3.5mm jack (ideal for zero-latency monitoring anyway).

### Detailed Troubleshooting Table

| Platform | Likely Cause | Step-by-Step Fix | Expected Outcome | Additional Tips |
|----------|--------------|------------------|------------------|-----------------|
| **Windows** | Mic registers as both input & output; default switches to FIFINE playback | 1. Sound settings → Output → select onboard speakers & set default.<br>2. More sound settings → Playback tab → disable FIFINE/USB output device.<br>3. Recording tab → set FIFINE mic as default.<br>4. Communications tab → "Do nothing" when calls detected. | Speakers work immediately; mic input remains active | Restart Windows Audio service or PC. Update Realtek/ motherboard audio drivers. Use SoundSwitch app if default keeps changing. Avoid exclusive mode in device properties (Advanced tab). |
| **iPhone / iOS** | USB audio device overrides internal routing | 1. Use Apple camera adapter.<br>2. Control Center → tap audio output icon → choose Built-in Speaker.<br>3. In-app audio settings if available. | Playback returns to iPhone speakers while mic input stays active | If unavailable, plug speakers into mic's 3.5mm jack. Use Bluetooth speakers for output. Test with Voice Memos first. Low battery on phone can affect stability—keep charged. |
| **Both** | Conflicting sample rates or driver priority | Unplug/replug mic, reboot, or disable/enable the device in Device Manager (Windows) or Settings → General → Reset (iOS as last resort) | Restores full control | Do not use USB hubs. Test different USB port/cable. For advanced users: XLR mode with a separate audio interface bypasses USB audio entirely on PC. |

In rare persistent cases, the issue stems from driver conflicts (e.g., after Windows updates) or power management. FIFINE's official troubleshooting blogs recommend unplugging the mic, restarting the computer, trying a different USB port (avoid front-panel ports on desktops), and ensuring no power-saving settings disable USB devices. Updating your motherboard audio drivers (Realtek or equivalent) and disabling "Allow the computer to turn off this device to save power" for USB root hubs in Device Manager can also help. On the mic itself, the gain and monitoring volume knobs only affect input and sidetone—they have no bearing on system playback routing.

If you use the mic primarily for recording/voice chat, disabling its playback endpoint in Windows is the cleanest long-term solution: it keeps the input fully functional while forcing all system audio to your chosen speakers. For monitoring your voice, simply plug headphones into the mic's jack and adjust the dedicated monitoring knob—no extra software required. The same principle applies on iPhone if you want zero-latency monitoring.

Overall, the AM8 is highly regarded for its value, sound quality, and features in budget streaming setups, but the dual input/output nature of its USB implementation requires this one-time output configuration. Once set, the issue does not recur unless you unplug/replug frequently or switch devices. If the steps above do not resolve it after a reboot, the next escalation would be testing the mic on another computer/phone to isolate whether it's a system-specific driver conflict.

**Key Citations**  
- FIFINE Official Product Page (specs, USB headphone monitoring, mobile adapter notes): https://fifinemicrophone.com/products/fifine-ampligame-am8-microphone  
- FIFINE YouTube Tutorial – Exact Fix for "Computer Audio Stopped When the FIFINE AM8 Microphone is Plugged in": https://www.youtube.com/watch?v=OJP8Uddz4OI  
- FIFINE AM8 Setup Guide & Manual References (output device selection): https://www.youtube.com/watch?v=T1aoYwoG0kE and related troubleshooting playlist  
- Amazon Product Listing & User Reviews (headphone jack as output confirmation): https://www.amazon.com/FIFINE-Microphone-Headphones-YouTube-AmpliGame-AM8/dp/B0BMFQP2ZZ  
- FIFINE Support Blogs (USB recognition, audio cutting, mobile compatibility): https://fifinemicrophone.com/blogs/news/no-more-audio-cutting-out-problem-fixed-for-fifine-microphone and https://fifinemicrophone.com/blogs/news/usb-microphone-not-working-quick-fix-guide  
- Reddit Discussions (Windows output hogging and disable workaround): https://www.reddit.com/r/streaming/comments/1dqu443/fifine_am8_headphone_jack_port_as_windows_output/ and similar threads confirming disable method.
