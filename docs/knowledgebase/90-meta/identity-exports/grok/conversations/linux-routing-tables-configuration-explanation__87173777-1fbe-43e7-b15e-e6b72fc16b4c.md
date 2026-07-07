---
source_url: "https://grok.com/c/87173777-1fbe-43e7-b15e-e6b72fc16b4c"
conversation_id: "87173777-1fbe-43e7-b15e-e6b72fc16b4c"
title: "Linux Routing Tables Configuration Explanation"
extracted_at: "2026-06-29T16:38:12.600Z"
message_count: 6
export_suite: "identity"
provenance: grok-rest-api
---

# Linux Routing Tables Configuration Explanation

Source: [Grok conversation](https://grok.com/c/87173777-1fbe-43e7-b15e-e6b72fc16b4c)

## User

_Time: 2025-09-01T04:17:00.458Z_

How does /etc/iproute2/rt_tables work exactly? Is each table used for every request, falling back to a different table in the file if the previous one failed or how does it work?

## Assistant

_Time: 2025-09-01T04:17:26.877Z_

The `/etc/iproute2/rt_tables` file in Linux is used to define routing tables for the `iproute2` suite, which manages network routing. It assigns names or numbers to routing tables, allowing administrators to reference them in routing rules and configurations. Understanding how it works requires diving into Linux's routing architecture and how routing tables are used for packet routing.

### What is `/etc/iproute2/rt_tables`?
The `/etc/iproute2/rt_tables` file is a configuration file that maps routing table IDs (numerical identifiers) to human-readable names. These routing tables are used by the `ip` command to manage routing decisions. By default, it contains entries like:

```
# /etc/iproute2/rt_tables
#
# reserved values
#
255     local
254     main
253     default
0       unspec
#
# local
#
#1      inr.ruhep
```

- **Format**: Each line typically has a number (table ID) followed by a name (e.g., `255 local`). The number is the table identifier, and the name is an alias for easier reference in `ip` commands.
- **Default Tables**:
  - **local (255)**: Contains routes for local and broadcast addresses (e.g., loopback, local subnet broadcasts).
  - **main (254)**: The primary routing table used for most routing decisions unless overridden by rules.
  - **default (253)**: Often unused but available for custom routing policies.
  - **unspec (0)**: Used for unspecified or fallback routing decisions.
- **Custom Tables**: Administrators can add custom tables by assigning a number (1–252 are typically available for custom use) and a name.

### How Routing Tables Work in Linux
Linux supports multiple routing tables, enabling advanced routing policies (e.g., policy-based routing). When a packet needs to be routed, the system uses **routing rules** (managed via `ip rule`) to determine which routing table to consult. The process is as follows:

1. **Routing Rules**: The kernel evaluates rules in the **rule table** (viewable with `ip rule show`). Each rule specifies conditions (e.g., source/destination IP, interface, or other attributes) and points to a specific routing table.
   - Example rule: `from 192.168.1.0/24 lookup custom_table`
   - Rules have a priority (lower number = higher priority), and the first matching rule determines the table to use.

2. **Table Lookup**: Once a rule selects a routing table (by ID or name from `rt_tables`), the kernel checks the routes in that table to decide where to send the packet.
   - Each table contains routes (viewable with `ip route show table <table>`), such as destination networks, gateways, and interfaces.

3. **Fallback Behavior**: If no route is found in the selected table, the kernel **does not** automatically fall back to another table unless explicitly configured in the rules. Instead, the packet is typically dropped, or an error (e.g., "No route to host") is returned.

### Are All Tables Used for Every Request?
No, not all tables are used for every request. The process is **rule-driven**, not a sequential fallback through all tables. Here’s how it works:

- The kernel evaluates `ip rule` entries in order of priority.
- The first rule that matches the packet’s attributes (e.g., source IP, destination IP, incoming interface) specifies which routing table to use.
- Only the selected table is consulted for routing decisions.
- If no rule matches, the kernel uses the **main** table (ID 254) as a default in most cases, as it’s typically the last rule in the priority list (e.g., `0: from all lookup main`).
- If no route is found in the selected table, the packet fails to route unless another rule explicitly points to a fallback table.

### Example Workflow
Suppose you have the following `/etc/iproute2/rt_tables`:
```
255 local
254 main
253 default
100 custom_table
```

And the following rules (`ip rule show`):
```
0:      from all lookup local
1000:   from 192.168.1.0/24 lookup custom_table
32766:  from all lookup main
32767:  from all lookup default
```

- A packet from `192.168.1.10` matches the rule at priority 1000 and uses `custom_table` (ID 100).
- If no route is found in `custom_table`, the packet fails unless another rule redirects it (e.g., a lower-priority rule).
- A packet from another source (e.g., `10.0.0.1`) doesn’t match the `custom_table` rule, so it proceeds to the `main` table (priority 32766).

### Key Points
- **No Automatic Fallback**: Tables are not tried sequentially unless explicitly configured via rules. If a table has no matching route, the packet is dropped unless another rule points to a different table.
- **Rule Priority Matters**: Rules are evaluated in order (lowest number first), and the first match determines the table.
- **Table Independence**: Each table is independent and contains its own set of routes. The `rt_tables` file just maps IDs to names for convenience.
- **Use Cases**: Multiple tables are used for scenarios like:
  - Policy-based routing (e.g., routing based on source IP or application).
  - Multi-homing (multiple ISPs or network interfaces).
  - VPN or tunnel-specific routing.

### Practical Example
To create a custom table:
1. Add to `/etc/iproute2/rt_tables`:
   ```
   100 custom_table
   ```
2. Add routes to the table:
   ```
   ip route add 10.0.0.0/24 via 192.168.1.1 dev eth0 table custom_table
   ```
3. Add a rule to use the table:
   ```
   ip rule推: ip rule add from 192.168.1.0/24 lookup custom_table
   ```
4. Verify with:
   ```
   ip route show table custom_table
   ip rule show
   ```

Now, packets from `192.168.1.0/24` will use `custom_table` for routing decisions.

### Summary
The `/etc/iproute2/rt_tables` file defines names for routing table IDs. Routing tables are not used sequentially or as fallbacks by default; instead, the kernel selects a single table based on the first matching `ip rule`. If no route is found in the selected table, the packet fails unless another rule explicitly points to a different table. This allows flexible, policy-based routing but requires explicit configuration to achieve fallback or multi-table behavior.

## User

_Time: 2025-09-01T04:18:05.602Z_

The main table is always 254? Be concise

## Assistant

_Time: 2025-09-01T04:18:07.313Z_

Yes, the **main** routing table is always assigned ID **254** in Linux, as defined in `/etc/iproute2/rt_tables`.

## User

_Time: 2025-09-01T04:18:51.494Z_

Difference between iptables, ip route, and ip rule and how to determine which one to use for specific contexts

## Assistant

_Time: 2025-09-01T04:19:19.917Z_

`iptables`, `ip route`, and `ip rule` are distinct tools in Linux networking, each serving a specific purpose in managing network traffic. Below is a concise explanation of their differences and guidance on when to use each, tailored to specific contexts.

### Differences Between `iptables`, `ip route`, and `ip rule`

1. **iptables**:
   - **Purpose**: Manages packet filtering, NAT (Network Address Translation), and packet mangling.
   - **Function**: Operates at the kernel's netfilter framework, processing packets based on rules in chains (e.g., INPUT, OUTPUT, FORWARD).
   - **Use Case**: Controls what packets are allowed, dropped, or modified based on attributes like source/destination IP, port, protocol, or state.
   - **Example**: 
     ```
     iptables -A INPUT -s 192.168.1.0/24 -p tcp --dport 80 -j ACCEPT
     ```
     Allows TCP traffic from `192.168.1.0/24` to port 80.
   - **Scope**: Focuses on security (firewall), NAT, or packet manipulation, not routing decisions.

2. **ip route**:
   - **Purpose**: Manages routing tables to determine where to send packets.
   - **Function**: Defines routes in specific routing tables (e.g., `main`, `local`, or custom tables) to map destination networks to gateways or interfaces.
   - **Use Case**: Configures how packets are forwarded based on destination IP, such as sending traffic to a specific gateway or interface.
   - **Example**:
     ```
     ip route add 10.0.0.0/24 via 192.168.1.1 dev eth0
     ```
     Routes traffic for `10.0.0.0/24` through gateway `192.168.1.1` on `eth0`.
   - **Scope**: Focuses on routing decisions within a single routing table.

3. **ip rule**:
   - **Purpose**: Manages policy-based routing by selecting which routing table to use for a packet.
   - **Function**: Defines rules to choose a routing table based on packet attributes (e.g., source IP, destination IP, interface).
   - **Use Case**: Directs packets to specific routing tables for advanced routing scenarios, like multi-homing or VPN routing.
   - **Example**:
     ```
     ip rule add from 192.168.1.0/24 lookup custom_table
     ```
     Uses `custom_table` for packets from `192.168.1.0/24`.
   - **Scope**: Controls which routing table is used, enabling flexible routing policies.

### How They Interact
- **iptables** processes packets first (filtering, NAT, etc.) in the netfilter pipeline.
- If a packet is accepted by `iptables`, the kernel uses `ip rule` to select a routing table.
- The selected table (via `ip rule`) is queried using `ip route` to determine the packet’s next hop or output interface.
- **Order**: `iptables` → `ip rule` → `ip route`.

### When to Use Each
Use the following guidelines to determine which tool to use based on your context:

1. **Use `iptables`**:
   - **Context**: You need to filter, block, allow, or modify packets (e.g., firewall rules, port forwarding, NAT).
   - **Examples**:
     - Block incoming traffic from a specific IP: `iptables -A INPUT -s 1.2.3.4 -j DROP`.
     - Set up NAT for a private network: `iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE`.
     - Limit connections to a service: `iptables -A INPUT -p tcp --dport 22 -m connlimit --connlimit-above 2 -j REJECT`.
   - **Key Question**: Are you controlling *access* or *modifying* packets?

2. **Use `ip route`**:
   - **Context**: You need to define how packets are routed to their destination within a specific routing table (e.g., default gateway, specific network routes).
   - **Examples**:
     - Add a default gateway: `ip route add default via 192.168.1.1`.
     - Route a specific subnet through an interface: `ip route add 172.16.0.0/16 dev eth1`.
     - Configure routes in a custom table: `ip route add 10.0.0.0/24 via 192.168.2.1 table custom_table`.
   - **Key Question**: Are you specifying *where* to send packets based on their destination?

3. **Use `ip rule`**:
   - **Context**: You need to select a specific routing table based on packet attributes (e.g., source IP, interface) for policy-based routing.
   - **Examples**:
     - Route traffic from a specific source to a custom table: `ip rule add from 192.168.1.0/24 lookup custom_table`.
     - Route based on incoming interface: `ip rule add iif eth1 lookup vpn_table`.
     - Multi-homed setups (e.g., two ISPs): `ip rule add from 10.0.0.0/24 lookup isp2_table`.
   - **Key Question**: Are you deciding *which routing table* to use based on packet attributes?

### Practical Example
**Scenario**: You want to allow HTTP traffic from `192.168.1.0/24` and route it through a specific gateway (`192.168.1.254`) using a custom table.

1. **iptables**: Allow HTTP traffic:
   ```
   iptables -A INPUT -s 192.168.1.0/24 -p tcp --dport 80 -j ACCEPT
   ```
2. **ip route**: Add a route in a custom table (e.g., `custom_table`, ID 100 in `/etc/iproute2/rt_tables`):
   ```
   ip route add default via 192.168.1.254 dev eth0 table custom_table
   ```
3. **ip rule**: Direct traffic from `192.168.1.0/24` to `custom_table`:
   ```
   ip rule add from 192.168.1.0/24 lookup custom_table
   ```

### Summary
- **iptables**: For packet filtering, NAT, or modification (firewall tasks).
- **ip route**: For defining routes within a routing table (where to send packets).
- **ip rule**: For selecting which routing table to use (policy-based routing).
- **Decision Process**:
  - Filter or modify packets? → Use `iptables`.
  - Define a route to a destination? → Use `ip route`.
  - Choose a routing table based on packet attributes? → Use `ip rule`.

By matching your goal (filtering, routing, or table selection) to the tool’s purpose, you can effectively manage network traffic in Linux.
