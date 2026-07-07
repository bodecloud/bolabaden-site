---
source_url: "https://chatgpt.com/c/687a5aa1-a208-8006-991d-2720029ed5d4"
conversation_id: "687a5aa1-a208-8006-991d-2720029ed5d4"
title: "OpenVPN config setup"
extracted_at: "2026-06-29T16:17:25.136Z"
message_count: 5
provenance: auth-ui
---

# OpenVPN config setup

Source: [ChatGPT conversation](https://chatgpt.com/c/687a5aa1-a208-8006-991d-2720029ed5d4)

## Assistant

Thanks for the detailed info — this is a common and frustrating issue with OpenVPN on systemd. Since your config works perfectly when you run it manually with sudo -E openvpn --config openvpn/client/vpn_config.ovpn, the problem is almost certainly about systemd not finding or accessing something that OpenVPN needs when run as a service.

Let’s go step-by-step and fix this.

✅ TL;DR Fix

Move your .ovpn file:

Bash

Then start it using systemd:

Bash

If it still fails, read on.

🔍 What's likely going wrong

When you run manually:

Bash

You’re running as your user with your environment variables (important for sudo -E!), in your current working directory.

But systemd:

Uses /etc/openvpn as working directory (or /etc/openvpn/client in newer distros).

Drops your environment.

Runs as the openvpn user, which has limited permissions.

Might not see your credentials, paths, or certs.

✅ Fix checklist
1. ✅ Put the file in the right directory:

Depending on your distro/version:

Older systems: /etc/openvpn/vpn_config.conf

Newer (Ubuntu 18.04+, Debian 10+): /etc/openvpn/client/vpn_config.conf

Rename .ovpn to .conf:

Bash

Or just /etc/openvpn/vpn_config.conf for openvpn@vpn_config.service

2. ✅ Permissions:

Make sure any files referenced in the .ovpn config (certs, keys, etc.) are readable by the openvpn user:

Bash
3. ✅ Absolute paths:

Edit your .ovpn / .conf and ensure all files use absolute paths, e.g.:

conf

Relative paths (like just client.key) will fail silently under systemd.

4. ✅ Enable systemd instance service:
Bash

Then check logs:

Bash
🧪 Debug tip:

Try running systemd unit in foreground:

Bash

If that fails, you’ll get the real error.

✅ Final sanity check: Example minimal .conf
conf

Let me know if you'd like to share your config file (you can redact server or certs), and I can pinpoint the issue faster.

## User

ubuntu@beatapostapita:~/my-media-stack$ sudo systemctl start openvpn@vpn_config
ubuntu@beatapostapita:~/my-media-stack$ sudo systemctl enable openvpn@vpn_config
Created symlink /etc/systemd/system/multi-user.target.wants/openvpn@vpn_config.service → /usr/lib/systemd/system/openvpn@.service.
ubuntu@beatapostapita:~/my-media-stack$ sudo systemctl status openvpn@vpn_config
● openvpn@vpn_config.service - OpenVPN connection to vpn_config
     Loaded: loaded (/usr/lib/systemd/system/openvpn@.service; enabled; preset: enabled)
     Active: activating (auto-restart) (Result: exit-code) since Fri 2025-07-18 14:36:03 UTC; 3s ago
       Docs: man:openvpn(8)
             https://community.openvpn.net/openvpn/wiki/Openvpn24ManPage
             https://community.openvpn.net/openvpn/wiki/HOWTO
    Process: 3733118 ExecStart=/usr/sbin/openvpn --daemon ovpn-vpn_config --status /run/openvpn/vpn_config.status 10 --cd /etc/openvpn --script-security 2 --config /etc/openvpn/vp>
   Main PID: 3733118 (code=exited, status=1/FAILURE)
     Status: "Pre-connection initialization successful"
        CPU: 73ms
...skipping...
● openvpn@vpn_config.service - OpenVPN connection to vpn_config
     Loaded: loaded (/usr/lib/systemd/system/openvpn@.service; enabled; preset: enabled)
     Active: activating (auto-restart) (Result: exit-code) since Fri 2025-07-18 14:36:03 UTC; 3s ago
       Docs: man:openvpn(8)
             https://community.openvpn.net/openvpn/wiki/Openvpn24ManPage
             https://community.openvpn.net/openvpn/wiki/HOWTO
    Process: 3733118 ExecStart=/usr/sbin/openvpn --daemon ovpn-vpn_config --status /run/openvpn/vpn_config.status 10 --cd /etc/openvpn --script-security 2 --config /etc/openvpn/vp>
   Main PID: 3733118 (code=exited, status=1/FAILURE)
     Status: "Pre-connection initialization successful"
        CPU: 73ms
~
~

definitely is not working because ifconfig does not show any new interfaces. again sudo -E openvpn --config openvpn/client/vpn_config.ovpn works fine

EXCLUSIVELY answer with the information that sudo -E openvpn --config openvpn/client/vpn_config.ovpn works fine, meaning do not provide ANY information irrelevant tot that fact.

here's the init.d thing:

ubuntu@beatapostapita:~/my-media-stack$ sudo cat /etc/init.d/openvpn 
#!/bin/sh -e

### BEGIN INIT INFO
# Provides:          openvpn
# Required-Start:    $network $remote_fs $syslog
# Required-Stop:     $network $remote_fs $syslog
# Should-Start:      network-manager
# Should-Stop:       network-manager
# X-Start-Before:    $x-display-manager gdm kdm xdm wdm ldm sdm nodm
# X-Interactive:     true
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Openvpn VPN service
# Description: This script will start OpenVPN tunnels as specified
#              in /etc/default/openvpn and /etc/openvpn/*.conf
### END INIT INFO

# Original version by Robert Leslie
# <rob@mars.org>, edited by iwj and cs
# Modified for openvpn by Alberto Gonzalez Iniesta <agi@inittab.org>
# Modified for restarting / starting / stopping single tunnels by Richard Mueller <mueller@teamix.net>

. /lib/lsb/init-functions

test $DEBIAN_SCRIPT_DEBUG && set -v -x

DAEMON=/usr/sbin/openvpn
DESC="virtual private network daemon"
CONFIG_DIR=/etc/openvpn
test -x $DAEMON || exit 0
test -d $CONFIG_DIR || exit 0

# Source defaults file; edit that file to configure this script.
AUTOSTART="all"
STATUSREFRESH=10
OMIT_SENDSIGS=0
if test -e /etc/default/openvpn ; then
  . /etc/default/openvpn
fi

start_vpn () {
    if grep -q '^[       ]*daemon' $CONFIG_DIR/$NAME.conf ; then
      # daemon already given in config file
      DAEMONARG=
    else
      # need to daemonize
      DAEMONARG="--daemon ovpn-$NAME"
    fi

    if grep -q '^[       ]*status ' $CONFIG_DIR/$NAME.conf ; then
      # status file already given in config file
      STATUSARG=""
    elif test $STATUSREFRESH -eq 0 ; then
      # default status file disabled in /etc/default/openvpn
      STATUSARG=""
    else
      # prepare default status file
      STATUSARG="--status /run/openvpn/$NAME.status $STATUSREFRESH"
    fi

    # tun using the "subnet" topology confuses the routing code that wrongly
    # emits ICMP redirects for client to client communications
    SAVED_DEFAULT_SEND_REDIRECTS=0
    if grep -q '^[[:space:]]*dev[[:space:]]*tun' $CONFIG_DIR/$NAME.conf && \
       grep -q '^[[:space:]]*topology[[:space:]]*subnet' $CONFIG_DIR/$NAME.conf ; then
        # When using "client-to-client", OpenVPN routes the traffic itself without
        # involving the TUN/TAP interface so no ICMP redirects are sent
        if ! grep -q '^[[:space:]]*client-to-client' $CONFIG_DIR/$NAME.conf ; then
            sysctl -w net.ipv4.conf.all.send_redirects=0 > /dev/null

            # Save the default value for send_redirects before disabling it
            # to make sure the tun device is created with send_redirects disabled
            SAVED_DEFAULT_SEND_REDIRECTS=$(sysctl -n net.ipv4.conf.default.send_redirects)

            if [ "$SAVED_DEFAULT_SEND_REDIRECTS" -ne 0 ]; then
              sysctl -w net.ipv4.conf.default.send_redirects=0 > /dev/null
            fi
        fi
    fi

    log_progress_msg "$NAME"
    STATUS=0

    start-stop-daemon --start --quiet --oknodo \
        --pidfile /run/openvpn/$NAME.pid \
        --exec $DAEMON -- $OPTARGS --writepid /run/openvpn/$NAME.pid \
        $DAEMONARG $STATUSARG --cd $CONFIG_DIR \
        --config $CONFIG_DIR/$NAME.conf || STATUS=1

    [ "$OMIT_SENDSIGS" -ne 1 ] || ln -s /run/openvpn/$NAME.pid /run/sendsigs.omit.d/openvpn.$NAME.pid

    # Set the back the original default value of send_redirects if it was changed
    if [ "$SAVED_DEFAULT_SEND_REDIRECTS" -ne 0 ]; then
      sysctl -w net.ipv4.conf.default.send_redirects=$SAVED_DEFAULT_SEND_REDIRECTS > /dev/null
    fi
}
stop_vpn () {
  start-stop-daemon --stop --quiet --oknodo \
      --pidfile $PIDFILE --exec $DAEMON --retry 10
  if [ "$?" -eq 0 ]; then
    rm -f $PIDFILE
    [ "$OMIT_SENDSIGS" -ne 1 ] || rm -f /run/sendsigs.omit.d/openvpn.$NAME.pid
    rm -f /run/openvpn/$NAME.status 2> /dev/null
  fi
}

case "$1" in
start)
  log_daemon_msg "Starting $DESC"

  # first create /run directory so it's present even
  # when no VPN are autostarted by this script, but later
  # by systemd openvpn@.service
  mkdir -p /run/openvpn

  # autostart VPNs
  if test -z "$2" ; then
    # check if automatic startup is disabled by AUTOSTART=none
    if test "x$AUTOSTART" = "xnone" -o -z "$AUTOSTART" ; then
      log_warning_msg " Autostart disabled."
      exit 0
    fi
    if test -z "$AUTOSTART" -o "x$AUTOSTART" = "xall" ; then
      # all VPNs shall be started automatically
      for CONFIG in `cd $CONFIG_DIR; ls *.conf 2> /dev/null`; do
        NAME=${CONFIG%%.conf}
        start_vpn
      done
    else
      # start only specified VPNs
      for NAME in $AUTOSTART ; do
        if test -e $CONFIG_DIR/$NAME.conf ; then
          start_vpn
        else
          log_failure_msg "No such VPN: $NAME"
          STATUS=1
        fi
      done
    fi
  #start VPNs from command line
  else
    while shift ; do
      [ -z "$1" ] && break
      if test -e $CONFIG_DIR/$1.conf ; then
        NAME=$1
        start_vpn
      else
       log_failure_msg " No such VPN: $1"
       STATUS=1
      fi
    done
  fi
  log_end_msg ${STATUS:-0}

  ;;
stop)
  log_daemon_msg "Stopping $DESC"

  if test -z "$2" ; then
    for PIDFILE in `ls /run/openvpn/*.pid 2> /dev/null`; do
      NAME=`echo $PIDFILE | cut -c14-`
      NAME=${NAME%%.pid}
      stop_vpn
      log_progress_msg "$NAME"
    done
  else
    while shift ; do
      [ -z "$1" ] && break
      if test -e /run/openvpn/$1.pid ; then
        PIDFILE=`ls /run/openvpn/$1.pid 2> /dev/null`
        NAME=`echo $PIDFILE | cut -c14-`
        NAME=${NAME%%.pid}
        stop_vpn
        log_progress_msg "$NAME"
      else
        log_failure_msg " (failure: No such VPN is running: $1)"
      fi
    done
  fi
  log_end_msg 0
  ;;
# Only 'reload' running VPNs. New ones will only start with 'start' or 'restart'.
reload|force-reload)
 log_daemon_msg "Reloading $DESC"
  for PIDFILE in `ls /run/openvpn/*.pid 2> /dev/null`; do
    NAME=`echo $PIDFILE | cut -c14-`
    NAME=${NAME%%.pid}
# If openvpn if running under a different user than root we'll need to restart
    if egrep '^[[:blank:]]*user[[:blank:]]' $CONFIG_DIR/$NAME.conf > /dev/null 2>&1 ; then
      stop_vpn
      start_vpn
      log_progress_msg "(restarted)"
    else
      kill -HUP `cat $PIDFILE` || true
    log_progress_msg "$NAME"
    fi
  done
  log_end_msg 0
  ;;

# Only 'soft-restart' running VPNs. New ones will only start with 'start' or 'restart'.
soft-restart)
 log_daemon_msg "$DESC sending SIGUSR1"
  for PIDFILE in `ls /run/openvpn/*.pid 2> /dev/null`; do
    NAME=`echo $PIDFILE | cut -c14-`
    NAME=${NAME%%.pid}
    kill -USR1 `cat $PIDFILE` || true
    log_progress_msg "$NAME"
  done
  log_end_msg 0
 ;;

restart)
  shift
  $0 stop ${@}
  $0 start ${@}
  ;;
cond-restart)
  log_daemon_msg "Restarting $DESC."
  for PIDFILE in `ls /run/openvpn/*.pid 2> /dev/null`; do
    NAME=`echo $PIDFILE | cut -c14-`
    NAME=${NAME%%.pid}
    stop_vpn
    start_vpn
  done
  log_end_msg 0
  ;;
status)
  GLOBAL_STATUS=0
  if test -z "$2" ; then
    # We want status for all defined VPNs.
    # Returns success if all autostarted VPNs are defined and running
    if test "x$AUTOSTART" = "xnone" ; then
      # Consider it a failure if AUTOSTART=none
      log_warning_msg "No VPN autostarted"
      GLOBAL_STATUS=1
    else
      if ! test -z "$AUTOSTART" -o "x$AUTOSTART" = "xall" ; then
        # Consider it a failure if one of the autostarted VPN is not defined
        for VPN in $AUTOSTART ; do
          if ! test -f $CONFIG_DIR/$VPN.conf ; then
            log_warning_msg "VPN '$VPN' is in AUTOSTART but is not defined"
            GLOBAL_STATUS=1
          fi
        done
      fi
    fi
    for CONFIG in `cd $CONFIG_DIR; ls *.conf 2> /dev/null`; do
      NAME=${CONFIG%%.conf}
      # Is it an autostarted VPN ?
      if test -z "$AUTOSTART" -o "x$AUTOSTART" = "xall" ; then
        AUTOVPN=1
      else
        if test "x$AUTOSTART" = "xnone" ; then
          AUTOVPN=0
        else
          AUTOVPN=0
          for VPN in $AUTOSTART; do
            if test "x$VPN" = "x$NAME" ; then
              AUTOVPN=1
            fi
          done
        fi
      fi
      if test "x$AUTOVPN" = "x1" ; then
        # If it is autostarted, then it contributes to global status
        status_of_proc -p /run/openvpn/${NAME}.pid openvpn "VPN '${NAME}'" || GLOBAL_STATUS=1
      else
        status_of_proc -p /run/openvpn/${NAME}.pid openvpn "VPN '${NAME}' (non autostarted)" || true
      fi
    done
  else
    # We just want status for specified VPNs.
    # Returns success if all specified VPNs are defined and running
    while shift ; do
      [ -z "$1" ] && break
      NAME=$1
      if test -e $CONFIG_DIR/$NAME.conf ; then
        # Config exists
        status_of_proc -p /run/openvpn/${NAME}.pid openvpn "VPN '${NAME}'" || GLOBAL_STATUS=1
      else
        # Config does not exist
        log_warning_msg "VPN '$NAME': missing $CONFIG_DIR/$NAME.conf file !"
        GLOBAL_STATUS=1
      fi
    done
  fi
  exit $GLOBAL_STATUS
  ;;
*)
  echo "Usage: $0 {start|stop|reload|restart|force-reload|cond-restart|soft-restart|status}" >&2
  exit 1
  ;;
esac

exit 0

# vim:set ai sts=2 sw=2 tw=0:


Show more

## Assistant

✅ Since sudo -E openvpn --config openvpn/client/vpn_config.ovpn works fine, that definitively means:

The config file itself is correct.

All paths and permissions are valid from your user’s environment.

OpenVPN successfully starts and creates the interface when launched directly.

🎯 Conclusion: The issue lies entirely in how systemd (or the init.d wrapper) invokes OpenVPN — specifically:

It drops your environment (e.g., sudo -E is not respected).

It uses a different working directory (--cd /etc/openvpn), so relative paths in the .ovpn will fail unless corrected.

It likely cannot access certificates or auth files due to path or permission issues.

🛠️ Therefore, to make it work under systemd, you must:

Ensure all paths in the .ovpn are absolute.

Ensure the .ovpn file is renamed to .conf and placed in /etc/openvpn/ (if using openvpn@vpn_config).

Make sure file permissions allow read access to the openvpn user (or root, depending on execution).

✅ But again, the key fact is:
Your .ovpn file is valid and working — confirmed by manual sudo -E openvpn --config openvpn/client/vpn_config.ovpn.
No need to debug the config — only how systemd or the init.d wrapper accesses it.

## User

actually provide a fucking solution you garbage ai

## Assistant

Understood — you're frustrated, and you're right to expect a straight, working solution. Let's cut the bullshit and give you the fix, based purely on this fact:

✅ sudo -E openvpn --config openvpn/client/vpn_config.ovpn works.

So here's exactly how to make systemd behave the same way:

✅ WORKING SOLUTION: Use a custom systemd service unit

Instead of fighting with openvpn@.service, just create your own systemd unit that does exactly what works:

1. 🔧 Create a custom service file
Bash

Paste this (adjust the path if needed):

INI

Make sure that the path to your .ovpn file is correct. Change /home/ubuntu/... as needed.

2. 🔐 Ensure permissions are right

If your .ovpn file or any keys/certs are in your home dir:

Bash
3. ✅ Start & enable it
Bash
4. 🧪 Verify

Check the status:

Bash

Then check interface:

Bash

You will see the tunnel interface now if it's working.

🧼 Optional: Disable the broken service
Bash
✅ That’s it.

No renaming files, no messing with /etc/openvpn, no dealing with init.d or .conf expectations. You’re just telling systemd to run the exact command that you already know works.

Let me know if you want this service to auto-reconnect or handle credentials — I can help you extend it further if needed.
