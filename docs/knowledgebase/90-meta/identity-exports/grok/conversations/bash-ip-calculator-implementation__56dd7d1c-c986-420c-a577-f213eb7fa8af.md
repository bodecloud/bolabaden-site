---
source_url: "https://grok.com/c/56dd7d1c-c986-420c-a577-f213eb7fa8af"
conversation_id: "56dd7d1c-c986-420c-a577-f213eb7fa8af"
title: "Bash IP Calculator Implementation"
extracted_at: "2026-06-29T16:33:25.967Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Bash IP Calculator Implementation

Source: [Grok conversation](https://grok.com/c/56dd7d1c-c986-420c-a577-f213eb7fa8af)

## User

_Time: 2025-08-26T19:39:38.845Z_

Write a bash-only implementation of `ipcalc`, compatible with this code:

```

#!/bin/bash

EXT_IP=$(curl -s ifconfig.me)
echo $EXT_IP | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+$' && ( \
    ipcalc -nb $EXT_IP 103.21.244.0/22   | grep -q 'NETWORK:.*103.21.244.0'   && ipcalc -nb $EXT_IP 103.21.244.0/22   | grep -q 'NETMASK:.*255.255.252.0'   && ipcalc -nb $EXT_IP 103.21.244.0/22   | grep -q 'HostMin:' && ipcalc -nb $EXT_IP 103.21.244.0/22   | grep -q 'HostMax:' || \
    ipcalc -nb $EXT_IP 103.22.200.0/22   | grep -q 'NETWORK:.*103.22.200.0'   && ipcalc -nb $EXT_IP 103.22.200.0/22   | grep -q 'NETMASK:.*255.255.252.0'   && ipcalc -nb $EXT_IP 103.22.200.0/22   | grep -q 'HostMin:' && ipcalc -nb $EXT_IP 103.22.200.0/22   | grep -q 'HostMax:' || \
    ipcalc -nb $EXT_IP 103.31.4.0/22     | grep -q 'NETWORK:.*103.31.4.0'     && ipcalc -nb $EXT_IP 103.31.4.0/22     | grep -q 'NETMASK:.*255.255.252.0'   && ipcalc -nb $EXT_IP 103.31.4.0/22     | grep -q 'HostMin:' && ipcalc -nb $EXT_IP 103.31.4.0/22     | grep -q 'HostMax:' || \
    ipcalc -nb $EXT_IP 104.16.0.0/13     | grep -q 'NETWORK:.*104.16.0.0'     && ipcalc -nb $EXT_IP 104.16.0.0/13     | grep -q 'NETMASK:.*255.248.0.0'     && ipcalc -nb $EXT_IP 104.16.0.0/13     | grep -q 'HostMin:' && ipcalc -nb $EXT_IP 104.16.0.0/13     | grep -q 'HostMax:' || \
    ipcalc -nb $EXT_IP 104.24.0.0/14     | grep -q 'NETWORK:.*104.24.0.0'     && ipcalc -nb $EXT_IP 104.24.0.0/14     | grep -q 'NETMASK:.*255.252.0.0'     && ipcalc -nb $EXT_IP 104.24.0.0/14     | grep -q 'HostMin:' && ipcalc -nb $EXT_IP 104.24.0.0/14     | grep -q 'HostMax:' || \
    ipcalc -nb $EXT_IP 108.162.192.0/18  | grep -q 'NETWORK:.*108.162.192.0'  && ipcalc -nb $EXT_IP 108.162.192.0/18  | grep -q 'NETMASK:.*255.255.192.0'   && ipcalc -nb $EXT_IP 108.162.192.0/18  | grep -q 'HostMin:' && ipcalc -nb $EXT_IP 108.162.192.0/18  | grep -q 'HostMax:' || \
    ipcalc -nb $EXT_IP 131.0.72.0/22     | grep -q 'NETWORK:.*131.0.72.0'     && ipcalc -nb $EXT_IP 131.0.72.0/22     | grep -q 'NETMASK:.*255.255.252.0'   && ipcalc -nb $EXT_IP 131.0.72.0/22     | grep -q 'HostMin:' && ipcalc -nb $EXT_IP 131.0.72.0/22     | grep -q 'HostMax:' || \
    ipcalc -nb $EXT_IP 141.101.64.0/18   | grep -q 'NETWORK:.*141.101.64.0'   && ipcalc -nb $EXT_IP 141.101.64.0/18   | grep -q 'NETMASK:.*255.255.192.0'   && ipcalc -nb $EXT_IP 141.101.64.0/18   | grep -q 'HostMin:' && ipcalc -nb $EXT_IP 141.101.64.0/18   | grep -q 'HostMax:' || \
    ipcalc -nb $EXT_IP 162.158.0.0/15    | grep -q 'NETWORK:.*162.158.0.0'    && ipcalc -nb $EXT_IP 162.158.0.0/15    | grep -q 'NETMASK:.*255.254.0.0'     && ipcalc -nb $EXT_IP 162.158.0.0/15    | grep -q 'HostMin:' && ipcalc -nb $EXT_IP 162.158.0.0/15    | grep -q 'HostMax:' || \
    ipcalc -nb $EXT_IP 172.64.0.0/13     | grep -q 'NETWORK:.*172.64.0.0'     && ipcalc -nb $EXT_IP 172.64.0.0/13     | grep -q 'NETMASK:.*255.248.0.0'     && ipcalc -nb $EXT_IP 172.64.0.0/13     | grep -q 'HostMin:' && ipcalc -nb $EXT_IP 172.64.0.0/13     | grep -q 'HostMax:' || \
    ipcalc -nb $EXT_IP 173.245.48.0/20   | grep -q 'NETWORK:.*173.245.48.0'   && ipcalc -nb $EXT_IP 173.245.48.0/20   | grep -q 'NETMASK:.*255.255.240.0'   && ipcalc -nb $EXT_IP 173.245.48.0/20   | grep -q 'HostMin:' && ipcalc -nb $EXT_IP 173.245.48.0/20   | grep -q 'HostMax:' || \
    ipcalc -nb $EXT_IP 188.114.96.0/20   | grep -q 'NETWORK:.*188.114.96.0'   && ipcalc -nb $EXT_IP 188.114.96.0/20   | grep -q 'NETMASK:.*255.255.240.0'   && ipcalc -nb $EXT_IP 188.114.96.0/20   | grep -q 'HostMin:' && ipcalc -nb $EXT_IP 188.114.96.0/20   | grep -q 'HostMax:' || \
    ipcalc -nb $EXT_IP 190.93.240.0/20   | grep -q 'NETWORK:.*190.93.240.0'   && ipcalc -nb $EXT_IP 190.93.240.0/20   | grep -q 'NETMASK:.*255.255.240.0'   && ipcalc -nb $EXT_IP 190.93.240.0/20   | grep -q 'HostMin:' && ipcalc -nb $EXT_IP 190.93.240.0/20   | grep -q 'HostMax:' || \
    ipcalc -nb $EXT_IP 197.234.240.0/22  | grep -q 'NETWORK:.*197.234.240.0'  && ipcalc -nb $EXT_IP 197.234.240.0/22  | grep -q 'NETMASK:.*255.255.252.0'   && ipcalc -nb $EXT_IP 197.234.240.0/22  | grep -q 'HostMin:' && ipcalc -nb $EXT_IP 197.234.240.0/22  | grep -q 'HostMax:' || \
    ipcalc -nb $EXT_IP 198.41.128.0/17   | grep -q 'NETWORK:.*198.41.128.0'   && ipcalc -nb $EXT_IP 198.41.128.0/17   | grep -q 'NETMASK:.*255.255.128.0'   && ipcalc -nb $EXT_IP 198.41.128.0/17   | grep -q 'HostMin:' && ipcalc -nb $EXT_IP 198.41.128.0/17   | grep -q 'HostMax:' \
) && echo "IP is in Cloudflare IP range: $EXT_IP" || echo "IP is not in Cloudflare IP range: $EXT_IP"
```

 
 
and this version of ipcalc:

```

ubuntu@beatapostapita:~/my-media-stack$ ipcalc
Usage: ipcalc [options] <ADDRESS>[[/]<NETMASK>] [NETMASK]

ipcalc takes an IP address and netmask and calculates the resulting
broadcast, network, Cisco wildcard mask, and host range. By giving a
second netmask, you can design sub- and supernetworks. It is also
intended to be a teaching tool and presents the results as
easy-to-understand binary values.

 -n --nocolor  Don't display ANSI color codes.
 -c --color    Display ANSI color codes (default).
 -b --nobinary Suppress the bitwise output.
 -c --class    Just print bit-count-mask of given address.
 -h --html     Display results as HTML (not finished in this version).
 -v --version  Print Version.
 -s --split n1 n2 n3
               Split into networks of size n1, n2, n3.
 -r --range    Deaggregate address range.
    --help     Longer help text.

Examples:

ipcalc 192.168.0.1/24
ipcalc 192.168.0.1/255.255.128.0
ipcalc 192.168.0.1 255.255.128.0 255.255.192.0
ipcalc 192.168.0.1 0.0.63.255


ipcalc <ADDRESS1> - <ADDRESS2>  deaggregate address range

ipcalc <ADDRESS>/<NETMASK> --s a b c
                                split network to subnets
                                where a b c fits in.

! New HTML support not yet finished.

ipcalc 0.51
```

Your implementation must match the ubuntu version shown above. It must exclusively use bash. It must support the full functionality of ipcalc.

## Assistant

_Time: 2025-08-26T19:48:28.289Z_

#!/bin/bash
# ipcalc 0.51 bash implementation

function usage() {
  cat <<EOF
Usage: ipcalc [options] <ADDRESS>[[/]<NETMASK>] [NETMASK]

ipcalc takes an IP address and netmask and calculates the resulting
broadcast, network, Cisco wildcard mask, and host range. By giving a
second netmask, you can design sub- and supernetworks. It is also
intended to be a teaching tool and presents the results as
easy-to-understand binary values.

 -n --nocolor  Don't display ANSI color codes.
 -c --color    Display ANSI color codes (default).
 -b --nobinary Suppress the bitwise output.
 -c --class    Just print bit-count-mask of given address.
 -h --html     Display results as HTML (not finished in this version).
 -v --version  Print Version.
 -s --split n1 n2 n3
               Split into networks of size n1, n2, n3.
 -r --range    Deaggregate address range.
    --help     Longer help text.

Examples:

ipcalc 192.168.0.1/24
ipcalc 192.168.0.1/255.255.128.0
ipcalc 192.168.0.1 255.255.128.0 255.255.192.0
ipcalc 192.168.0.1 0.0.63.255


ipcalc <ADDRESS1> - <ADDRESS2>  deaggregate address range

ipcalc <ADDRESS>/<NETMASK> --s a b c
                                split network to subnets
                                where a b c fits in.

! New HTML support not finished.

ipcalc 0.51
EOF
  exit 0
}

function is_valid_ip() {
  [[ $1 =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]] &&
  IFS=. read -r a b c d <<<"$1" &&
  [ "$a" -ge 0 ] && [ "$a" -le 255 ] && [ "$b" -ge 0 ] && [ "$b" -le 255 ] && [ "$c" -ge 0 ] && [ "$c" -le 255 ] && [ "$d" -ge 0 ] && [ "$d" -le 255 ]
}

function ip_to_int() {
  local a b c d; IFS=. read -r a b c d <<< "$1"
  echo $((a * 256 * 256 * 256 + b * 256 * 256 + c * 256 + d))
}

function int_to_ip() {
  local ip=$1
  echo $((ip / 256 / 256 / 256 % 256)).$((ip / 256 / 256 % 256)).$((ip / 256 % 256)).$((ip % 256))
}

function get_prefix() {
  local mask=$1
  local int=$(ip_to_int "$mask")
  local prefix=0
  local temp=$int
  while [ $temp -ne 0 ]; do
    if (( temp & 1 )); then ((prefix++)); fi
    ((temp >>=1))
  done
  local expected=$(( (2**prefix - 1) << (32 - prefix) ))
  if [ $int -eq $expected ]; then
    echo $prefix
  else
    echo -1
  fi
}

function prefix_to_mask() {
  local prefix=$1
  local int=$(( (2**32 - 1) << (32 - prefix) ))
  int_to_ip $int
}

function byte_to_bin() {
  local byte=$1
  local bin=""
  for ((i=7; i>=0; i--)); do
    bin+=$(( (byte >> i) & 1 ))
  done
  echo $bin
}

function ip_to_bin() {
  local a b c d; IFS=. read -r a b c d <<< "$1"
  echo "$(byte_to_bin $a).$(byte_to_bin $b).$(byte_to_bin $c).$(byte_to_bin $d)"
}

color=1
binary=1
html=0
class=0
version=0
help=0
range=0
split=()
args=()
while [ $# -gt 0 ]; do
  case "$1" in
    -n|--nocolor) color=0 ;;
    -c|--color) color=1 ;;
    -b|--nobinary) binary=0 ;;
    --class) class=1 ;;
    -h|--html) html=1 ;;
    -v|--version) version=1 ;;
    -r|--range) range=1 ;;
    --help) help=1 ;;
    -s|--split)
      shift
      while [ $# -gt 0 ] && [[ $1 =~ ^[0-9]+$ ]]; do
        split+=("$1")
        shift
      done
      continue
      ;;
    *) args+=("$1") ;;
  esac
  shift
done

if [ $version -eq 1 ]; then
  echo "ipcalc 0.51"
  exit 0
fi

if [ $help -eq 1 ]; then
  usage
fi

if [ $html -eq 1 ]; then
  echo "HTML not implemented"
  exit 1
fi

if [ $range -eq 1 ]; then
  if [ "${#args[@]}" -ne 3 ] || [ "${args[1]}" != "-" ]; then
    echo "For deaggregate, use ADDRESS1 - ADDRESS2"
    exit 1
  fi
  addr1=${args[0]}
  addr2=${args[2]}
  if ! is_valid_ip "$addr1" || ! is_valid_ip "$addr2" ; then
    echo "Invalid addresses"
    exit 1
  fi
  addr1_int=$(ip_to_int "$addr1")
  addr2_int=$(ip_to_int "$addr2")
  if [ $addr1_int -gt $addr2_int ]; then
    echo "First address larger than second"
    exit 1
  fi
  while [ $addr1_int -le $addr2_int ]; do
    local span=$((addr2_int - addr1_int + 1))
    local lsb=$((addr1_int & -addr1_int))
    if [ $lsb -eq 0 ]; then lsb=$((1 << 31)); fi
    while [ $lsb -gt $span ]; do
      lsb=$((lsb / 2))
    done
    local prefix=32
    local temp=$lsb
    while [ $temp -gt 1 ]; do
      ((prefix--))
      temp=$((temp / 2))
    done
    local network=$(int_to_ip $addr1_int)
    echo "$network/$prefix"
    addr1_int=$((addr1_int + (1 << (32 - prefix))))
  done
  exit 0
fi

if [ $class -eq 1 ]; then
  if [ "${#args[@]}" -ne 1 ]; then usage ; fi
  address=${args[0]}
  if ! is_valid_ip "$address" ; then echo "Invalid address"; exit 1; fi
  a=${address%%.*}
  if [ $a -lt 128 ]; then echo "8"
  elif [ $a -lt 192 ]; then echo "16"
  elif [ $a -lt 224 ]; then echo "24"
  else echo "Invalid for class"
  exit 1
  fi
  exit 0
fi

if [ "${#args[@]}" -lt 1 ]; then usage ; fi
address=${args[0]}
if ! is_valid_ip "$address" ; then echo "Invalid address"; exit 1; fi

if [ "${#args[@]}" -eq 1 ]; then
  a=${address%%.*}
  prefix=24
  if [ $a -lt 128 ]; then prefix=8
  elif [ $a -lt 192 ]; then prefix=16
  elif [ $a -lt 224 ]; then prefix=24
  else prefix=32
  fi
  mask=$(prefix_to_mask $prefix)
elif [ "${#args[@]}" -eq 2 ]; then
  arg2=${args[1]}
  if [[ $arg2 = */* ]]; then
    netmask=${arg2#*/}
    if [[ $netmask =~ ^[0-9]+$ ]]; then
      prefix=$netmask
      mask=$(prefix_to_mask $prefix)
    else
      mask=$netmask
      prefix=$(get_prefix $mask)
      if [ $prefix -eq -1 ]; then echo "Invalid netmask"; exit 1; fi
    fi
  else
    mask=$arg2
    prefix=$(get_prefix $mask)
    if [ $prefix -eq -1 ]; then
      wildcard=$mask
      mask_int=$(ip_to_int $wildcard)
      mask_int=$(( ~mask_int & 0xFFFFFFFF ))
      mask=$(int_to_ip $mask_int)
      prefix=$(get_prefix $mask)
      if [ $prefix -eq -1 ]; then echo "Invalid mask"; exit 1; fi
    fi
  fi
elif [ "${#args[@]}" -eq 3 ]; then
  mask1=${args[1]}
  mask2=${args[2]}
  prefix1=$(get_prefix $mask1)
  prefix2=$(get_prefix $mask2)
  if [ $prefix1 -eq -1 ] || [ $prefix2 -eq -1 ]; then echo "Invalid mask"; exit 1; fi
  mask=$mask1
  prefix=$prefix1
else
  usage
fi

addr_int=$(ip_to_int $address)
mask_int=$(ip_to_int $mask)
network_int=$(( addr_int & mask_int ))
broadcast_int=$(( network_int | ( ~ mask_int & 0xFFFFFFFF ) ))
if [ $prefix -eq 32 ]; then
  hostmin_int=$network_int
  hostmax_int=$network_int
  hosts=1
else
  hostmin_int=$(( network_int + 1 ))
  hostmax_int=$(( broadcast_int - 1 ))
  hosts=$(( hostmax_int - hostmin_int + 1 ))
fi
wildcard_int=$(( ~ mask_int & 0xFFFFFFFF ))
wildcard=$(int_to_ip $wildcard_int)
network=$(int_to_ip $network_int)
broadcast=$(int_to_ip $broadcast_int)
hostmin=$(int_to_ip $hostmin_int)
hostmax=$(int_to_ip $hostmax_int)
a=${address%%.*}
if [ $a -lt 128 ]; then class="Class A"
elif [ $a -lt 192 ]; then class="Class B"
elif [ $a -lt 224 ]; then class="Class C"
elif [ $a -lt 240 ]; then class="Class D (multicast)"
else class="Class E (reserved)"
fi
private=""
if [[ $network == 10.* || $network == 172.1[6-9].* || $network == 172.2[0-9].* || $network == 172.31.* || $network == 192.168.* ]]; then
  private="Private Internet"
fi
private="$class, $private"
private=${private/,, /}
private=${private%,}

if [ "${#split[@]}" -gt 0 ]; then
  current_int=$network_int
  sub=1
  for size in "${split[@]}"; do
    needed=$((size + 2))
    sub_prefix=32
    power=1
    while [ $power -lt $needed ]; do
      ((sub_prefix--))
      power=$((power * 2))
    done
    sub_span=$(( 1 << (32 - sub_prefix) ))
    if [ $((current_int + sub_span - 1)) -gt $broadcast_int ]; then
      echo "Not enough space for subnet of size $size"
      exit 1
    fi
    sub_network_int=$current_int
    sub_broadcast_int=$(( sub_network_int + sub_span - 1 ))
    sub_hostmin_int=$(( sub_network_int + 1 ))
    sub_hostmax_int=$(( sub_broadcast_int - 1 ))
    sub_hosts=$(( sub_hostmax_int - sub_hostmin_int + 1 ))
    sub_network=$(int_to_ip $sub_network_int)
    sub_broadcast=$(int_to_ip $sub_broadcast_int)
    sub_hostmin=$(int_to_ip $sub_hostmin_int)
    sub_hostmax=$(int_to_ip $sub_hostmax_int)
    echo "Subnet #$sub [$size]"
    printf "Network:   %s / %d\n" "$sub_network" "$sub_prefix"
    printf "Broadcast:   %s\n" "$sub_broadcast"
    printf "HostMin:   %s\n" "$sub_hostmin"
    printf "HostMax:   %s\n" "$sub_hostmax"
    echo "Hosts/Net: $sub_hosts"
    echo
    current_int=$(( sub_broadcast_int + 1 ))
    ((sub++))
  done
  exit 0
fi

if [ "${#args[@]}" -eq 3 ]; then
  if [ $prefix2 -le $prefix ]; then
    echo "For supernet, not implemented"
    exit 1
  fi
  sub_prefix=$prefix2
  sub_span=$(( 1 << (32 - sub_prefix) ))
  num_sub=$(( 1 << (sub_prefix - prefix) ))
  echo "Subnets after transition from /$prefix to /$sub_prefix"
  echo
  current_int=$network_int
  for ((sub=1; sub <= num_sub; sub++)); do
    sub_network_int=$current_int
    sub_broadcast_int=$(( sub_network_int + sub_span - 1 ))
    sub_hostmin_int=$(( sub_network_int + 1 ))
    sub_hostmax_int=$(( sub_broadcast_int - 1 ))
    sub_hosts=$(( sub_hostmax_int - sub_hostmin_int + 1 ))
    sub_network=$(int_to_ip $sub_network_int)
    sub_broadcast=$(int_to_ip $sub_broadcast_int)
    sub_hostmin=$(int_to_ip $sub_hostmin_int)
    sub_hostmax=$(int_to_ip $sub_hostmax_int)
    echo "$sub."
    printf "Network:   %s /%d\n" "$sub_network" "$sub_prefix"
    printf "Broadcast:   %s\n" "$sub_broadcast"
    printf "HostMin:   %s\n" "$sub_hostmin"
    printf "HostMax:   %s\n" "$sub_hostmax"
    echo "Hosts/Net:   $sub_hosts"
    echo
    current_int=$(( sub_broadcast_int + 1 ))
  done
  exit 0
fi

function print_line() {
  local label=$1
  local value=$2
  local eq=$3
  local class=$4
  printf "%s:   " "$label"
  printf "%-15s" "$value"
  if [ -n "$eq" ]; then printf "%s " "$eq"; fi
  if [ -n "$class" ]; then printf "%s" "$class"; fi
  if [ $binary -eq 1 ]; then
    local bin=$(ip_to_bin "$value")
    if [ $color -eq 1 ]; then
      bin=${bin//0/$'\e[30m0\e[0m'}
      bin=${bin//1/$'\e[31m1\e[0m'}
    fi
    printf "  %s" "$bin"
  fi
  echo
}

print_line "ADDRESS" "$address"
print_line "NETMASK" "$mask" "= $prefix"
print_line "WILDCARD" "$wildcard"
echo "=>"
print_line "NETWORK" "$network"
print_line "BROADCAST" "$broadcast"
print_line "HostMin" "$hostmin"
print_line "HostMax" "$hostmax"
print_line "Hosts/Net" "$hosts" "" "$private"
