---
source_url: "https://chatgpt.com/c/6859b2c3-2bf0-8006-8589-832b4c6132fa"
conversation_id: "6859b2c3-2bf0-8006-8589-832b4c6132fa"
title: "OVPN no password prompt"
extracted_at: "2026-06-29T16:33:54.594Z"
message_count: 5
provenance: auth-ui
---

# OVPN no password prompt

Source: [ChatGPT conversation](https://chatgpt.com/c/6859b2c3-2bf0-8006-8589-832b4c6132fa)

## Assistant

Thanks for the detailed info — you're right to be frustrated. Let's get this narrowed down and fixed properly.

🔍 What's Actually Going Wrong?

You do have all required packages installed, but PIA is still failing to find or initialize the xcb plugin. The crucial errors:

Authorization required, but no authorization protocol specified
could not connect to display :0
Could not load the Qt platform plugin "xcb" in "" even though it was found.

This strongly suggests:

You're in a Wayland session with no XWayland fallback available to the app.

The app is being launched outside of a graphical session (i.e. from TTY or Wayland shell that doesn't expose X11).

DISPLAY or XAUTHORITY env vars may be unset or inaccessible.

✅ Let's Fix It Step by Step
✅ 1. Check that you're in a graphical session

From the same terminal you're using to run PIA, check:

Bash
echo $DISPLAY
echo $XDG_SESSION_TYPE
echo $XAUTHORITY

Expected values:

DISPLAY should be something like :1 or :0, NOT empty.

XDG_SESSION_TYPE should be wayland

XAUTHORITY should point to a file like /run/user/1000/.Xauthority or similar.

If DISPLAY is empty, the app cannot talk to the X server — that's the main failure.

✅ 2. Fix DISPLAY and XAUTHORITY manually (if needed)

Try this before running pia-client:

Bash
export DISPLAY=:0
export XAUTHORITY=/run/user/$(id -u)/.Xauthority
env QT_QPA_PLATFORM=xcb /opt/piavpn/bin/pia-client

If DISPLAY=:0 doesn't work, try :1 or :1.0, depending on what your system uses.

✅ 3. Try running from KRunner or KDE Application Launcher

To isolate the problem from terminal environment issues, open KRunner (Alt+Space) or the application menu and type:

PIA

Try launching it from there. This gives it proper environment variables from KDE's session.

✅ 4. Alternative: Run it under XWayland directly

If PIA won’t cooperate with Wayland, try forcing an XWayland session (e.g., by using xterm):

Bash
xterm -e "/opt/piavpn/bin/pia-client"

If you don’t have xterm:

Bash
sudo dnf install xterm

This method ensures DISPLAY is set correctly.

✅ 5. Check if Flatpak/Snap Version Works Better

If the native .run or .deb-converted package is busted under Wayland, try using the Flatpak version, which is sandboxed and Wayland-friendly:

Bash
flatpak install flathub com.privateinternetaccess.vpn
flatpak run com.privateinternetaccess.vpn
✅ 6. Try CLI version instead (as a workaround)

If you're blocked by GUI, use the CLI interface:

Bash
/opt/piavpn/bin/piactl connect
/opt/piavpn/bin/piactl get connectionstate

You can also use piactl to login, connect, and disconnect — and it works headlessly.

🧠 TL;DR Fix Path

Run this from a terminal within KDE Plasma:

Bash
export DISPLAY=:0
export XAUTHORITY=/run/user/$(id -u)/.Xauthority
env QT_QPA_PLATFORM=xcb /opt/piavpn/bin/pia-client

If that fails — install the Flatpak version or use the CLI (piactl) to bypass the broken GUI.

Let me know what echo $DISPLAY returns — that’ll confirm if this is the root issue.

## User

boden@fedora:~/pia_ovpn$ echo $DISPLAY
echo $XDG_SESSION_TYPE
echo $XAUTHORITY
:0
wayland
/run/user/1001/xauth_RqAXgS

boden@fedora:~/pia_ovpn$ /opt/piavpn/bin/pia-client
[2025-06-23 20:09:41.763][76b4][client.clientsettings][src/clientsettings.cpp:59][info] XDG_SESSION_TYPE "X11"
[2025-06-23 20:09:41.763][76b4][client.clientsettings][src/clientsettings.cpp:60][info] XDG_CURRENT_DESKTOP "KDE"
[2025-06-23 20:09:41.763][76b4][common.json][src/json.cpp:360][warning] Unable to read from clientsettings.json
[2025-06-23 20:09:41.763][76b4][client.linux_env][src/linux/linux_env.cpp:21][info] XDG_CURRENT_DESKTOP= "KDE"
[2025-06-23 20:09:41.763][76b4][client.linux_env][src/linux/linux_env.cpp:69][info] Detected desktop KDE and RTL: 0
Authorization required, but no authorization protocol specified
[2025-06-23 20:09:41.766][76b4][qt.qpa.xcb][??:0][warning] could not connect to display :0
[2025-06-23 20:09:41.766][76b4][qt.qpa.plugin][??:0][info] Could not load the Qt platform plugin "xcb" in "" even though it was found.
[2025-06-23 20:09:41.766][76b4][default][??:0][fatal] This application failed to start because no Qt platform plugin could be initialized. Reinstalling the application may fix this problem.
[2025-06-23 20:09:41.766][76b4][default][??:0][fatal] 
[2025-06-23 20:09:41.766][76b4][default][??:0][fatal] Available platform plugins are: eglfs, linuxfb, minimal, minimalegl, offscreen, vnc, wayland-egl, wayland, xcb.

Aborted (core dumped)
boden@fedora:~/pia_ovpn$ PIA
bash: PIA: command not found...
boden@fedora:~/pia_ovpn$ ^C
boden@fedora:~/pia_ovpn$ xterm -e "/opt/piavpn/bin/pia-client"
bash: xterm: command not found...
Install package 'xterm' to provide command 'xterm'? [N/y] y


 * Waiting in queue... 
 * Loading list of packages.... 
The following packages have to be installed:
 mkfontscale-1.2.3-2.fc42.x86_64        Tool to generate legacy X11 font system index files
 xorg-x11-fonts-misc-7.5-40.fc42.noarch misc bitmap fonts for the X Window System
 xterm-397-1.fc42.x86_64        Terminal emulator for the X Window System
Proceed with changes? [N/y] y


 * Waiting in queue... 
 * Waiting for authentication... 
 * Waiting in queue... 
 * Downloading packages... 
 * Requesting data... 
 * Testing changes... 
 * Installing packages... 
Authorization required, but no authorization protocol specified

xterm: Xt error: Can't open display: :0

boden@fedora:~/pia_ovpn$ 

yo man. What the actual fuck is wrong with my shit? obviously i have a gui since i'm staring at my monitor (i'm not ssh'ing in or anything stupid like that).
Show more

## Assistant

Yeah man — you're 100% right to be pissed. You do have a GUI, but something deep is broken in how environment variables and X11 auth are being handled for your user/session under Wayland.

Let's break this down super clearly and fix it. You're logged into KDE Plasma on Wayland, but X11 compatibility (via XWayland) is broken or inaccessible to apps run from your terminal. Here's what’s going on — and how to fix it.

🧠 What's Really Happening

Your GUI apps work fine because KDE knows how to launch them inside the Wayland session using correct environment vars.

When you run apps from terminal, they don't get full Wayland/XWayland env, especially no access to the X11 auth socket.

The Authorization required, but no authorization protocol specified is the kicker — it's trying to access :0 via X11 and failing the MIT-MAGIC-COOKIE-1 handshake.

✅ Fix It: Run GUI App With Correct Auth Under Wayland

Try this method, which safely passes Wayland/X11 auth from your current session:

✅ 1. Run using kdesu (KDE GUI sudo wrapper):
Bash
kdesu /opt/piavpn/bin/pia-client

If kdesu isn't available:

Bash
sudo dnf install kdesu

This runs the GUI app with proper access to your session's graphical environment.

✅ 2. Alternative: Use dbus-launch and correct env manually

Try this:

Bash
XAUTHORITY=$XAUTHORITY DISPLAY=$DISPLAY dbus-launch /opt/piavpn/bin/pia-client

Or:

Bash
env QT_QPA_PLATFORM=xcb DISPLAY=$DISPLAY XAUTHORITY=$XAUTHORITY dbus-launch /opt/piavpn/bin/pia-client

This launches the app within your current dbus session and sets correct access to the GUI display.

✅ 3. Last resort: use .desktop file to launch PIA via KDE

Use the Application Launcher (KDE Menu) or KRunner (Alt+Space) and type:

Private Internet Access

If it launches that way, the issue is definitely terminal GUI session leakage.

You can inspect the .desktop file:

Bash
cat /usr/share/applications/piavpn.desktop

Or manually launch it via:

Bash
gtk-launch piavpn.desktop

(Or whatever the .desktop filename is)

🔥 Extra Debug Tool

Try this diagnostic command:

Bash
xhost +SI:localuser:$(whoami)

It gives your user access to the X server again (often blocked under Wayland with mixed XWayland contexts).

🚑 Summary
Problem	Fix
GUI app won't launch from terminal	Use kdesu or dbus-launch
"Authorization required" error	Run with correct DISPLAY and XAUTHORITY, or use xhost
Still broken?	Use Flatpak PIA or stick with piactl CLI

Want me to make a wrapper script that always runs PIA properly from any terminal? Or set up a .desktop file that guarantees it launches cleanly via Wayland? Just say the word.

## User

man how to restart whatever my gui is without rebooting i think all my apps are broken i can't seem to open anything except like basic things like settings

## Assistant

Alright — if your desktop environment is half-dead (you can see the screen but most apps won't open), it's likely that KDE Plasma or the underlying Wayland/X session is in a broken state.

Here's how you can restart KDE Plasma (your GUI session) without rebooting, depending on whether it's Wayland or X11:

🧠 Check Your Session Type

You've said you're on Wayland, but let's be sure:

Bash
echo $XDG_SESSION_TYPE

If it says wayland, follow the Wayland steps. If x11, use X11 steps.

✅ Restart KDE Plasma (Wayland)
🔄 Option 1: TTY method (safe and clean)

Press Ctrl + Alt + F3 (or F4/F5 — just not F1 or F2 usually).

Log in with your username and password.

Kill your current KDE session:

Bash
killall -u $USER plasmashell kded5 kwin_wayland

Then restart SDDM (the display/login manager):

Bash
sudo systemctl restart sddm

This will log you out and restart the GUI login screen, but it's clean.

Press Ctrl + Alt + F1 to return to graphical login.

✅ Restart KDE Plasma (X11)

If you’re on X11 instead, use:

Bash
killall plasmashell && kstart5 plasmashell

Or from a TTY:

Bash
login as your user
DISPLAY=:0 kstart5 plasmashell
🛑 If sddm Won't Restart

If sddm fails or doesn't bring GUI back:

Bash
sudo systemctl stop sddm

Then manually launch KDE:

Bash
startplasma-wayland

Or:

Bash
startplasma-x11

(You might need to export DISPLAY=:0 before running that.)

✅ Final Nuclear Option: Kill and Re-login
Bash
loginctl terminate-user $USER

This kills everything running under your user and forces a GUI re-login without rebooting. (Warning: it logs you out immediately.)

Let Me Know

If none of this brings your apps or desktop back, just say the word and I’ll walk you through:

switching to a different desktop (like GNOME or XFCE temporarily),

creating a fallback .xinitrc,

or emergency recovery.

You're not alone — Fedora KDE/Wayland can flake like this. We'll get it sorted.
