---
source_url: "https://chatgpt.com/c/6884d842-4808-8006-bdfd-fdf218bead8e"
conversation_id: "6884d842-4808-8006-bdfd-fdf218bead8e"
title: "OpenVPN Cloudflare WARP Connection"
extracted_at: "2026-06-29T16:08:56.804Z"
message_count: 5
provenance: auth-ui
---

# OpenVPN Cloudflare WARP Connection

Source: [ChatGPT conversation](https://chatgpt.com/c/6884d842-4808-8006-bdfd-fdf218bead8e)

## Assistant

Got it! You want the automatic route for all Docker containers to I2P via your i2pd container, but since i2pd doesn't have a --show-keys CLI option, that means we'll work purely on networking/routing level, setting up a transparent proxy routing through i2pd for all Docker containers automatically.

Goal:

Run i2pd inside a Docker container

Make all other Docker containers route their traffic through i2pd automatically

No manual DNS or domain configuration needed

No CLI key management needed

Strategy

Create a Docker network for your containers (bridge)

Run your i2pd container in this network, exposing SOCKS5 and HTTP proxy ports

For every other container in this network:

Set environment variables or iptables to route their traffic through i2pd's SOCKS5 proxy (usually at port 4447)

Or create a transparent proxy with redsocks or iptables redirecting TCP connections through i2pd SOCKS5 proxy

Here's a complete copy-paste setup:
Bash
# Step 1: Create a custom Docker network (bridge mode)
docker network create i2p-net

# Step 2: Run i2pd container attached to this network with SOCKS proxy enabled

docker run -d --name i2pd \
  --network i2p-net \
  -p 127.0.0.1:4447:4447 \   # SOCKS5 proxy (can be internal only)
  -p 127.0.0.1:4444:4444 \   # HTTP proxy
  -p 127.0.0.1:7656:7656 \   # SAM bridge (optional)
  -p 127.0.0.1:7070:7070 \   # Web console (optional)
  ghcr.io/eyedeekay/i2pd:latest \
  --socksproxy.enabled=1 \
  --socksproxy.address=0.0.0.0 \
  --socksproxy.port=4447 \
  --http.enabled=1 \
  --http.address=0.0.0.0 \
  --http.port=4444

# Step 3: Run any other container on the same network, configure environment or iptables to use the SOCKS5 proxy of i2pd

# Example: Run a container with SOCKS5 proxy environment variables (for curl, wget, etc)
docker run -it --rm --network i2p-net \
  -e ALL_PROXY=socks5://i2pd:4447 \
  alpine sh

# Step 4 (optional): For containers that don't support SOCKS5 env vars,
# set up redsocks or similar inside those containers, or use iptables transparent proxy
For fully transparent routing in all containers without manual proxy config

This requires you to set up a sidecar container with redsocks or tun2socks acting as a transparent proxy, or modify Docker network iptables on the host to redirect TCP packets from containers to the i2pd SOCKS5 proxy.

Example of transparent SOCKS proxy with redsocks on host (for docker network i2p-net):
Bash
# Install redsocks on your host machine (Ubuntu example)
sudo apt-get update
sudo apt-get install redsocks

# Configure /etc/redsocks.conf with SOCKS5 proxy (i2pd container IP)

I2PD_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' i2pd)

cat <<EOF | sudo tee /etc/redsocks.conf
base {
    log_debug = off;
    log_info = on;
    log = "file:/var/log/redsocks.log";
    daemon = on;
    redirector = iptables;
}

redsocks {
    local_ip = 0.0.0.0;
    local_port = 12345;
    ip = $I2PD_IP;
    port = 4447;
    type = socks5;
    login = "";
    password = "";
}
EOF

# Restart redsocks
sudo systemctl restart redsocks

# Redirect Docker network traffic through redsocks using iptables

sudo iptables -t nat -N REDSOCKS
sudo iptables -t nat -A REDSOCKS -p tcp -j REDIRECT --to-ports 12345
sudo iptables -t nat -A PREROUTING -s 172.18.0.0/16 -p tcp -j REDSOCKS

Replace 172.18.0.0/16 with the subnet of i2p-net Docker network (get with docker network inspect i2p-net).

Summary:

i2pd container listens SOCKS5 proxy on 0.0.0.0:4447

Other containers route via SOCKS5 i2pd:4447 proxy via environment vars or internal proxy

For full transparency, run redsocks or tun2socks on host or sidecar container to redirect TCP traffic to i2pd SOCKS5 proxy

If you want, I can prepare a full docker-compose.yaml with i2pd and a test container configured to use it automatically. Just ask!

## User

i'm tearing my hair out. how to fix this in purplei2pd??

ln: /home/i2pd/data/certificates/i2pd_certificates: Permission denied

it's inside the container obviously and it's obviously running as ROOT

Reminder your response should be exclusive to exact instructions for i2pd!!! web search it

Show more

## Assistant

Apologies for any confusion earlier. The error message you're encountering—ln: /home/i2pd/data/certificates/i2pd_certificates: Permission denied—suggests that the process inside the Docker container lacks the necessary permissions to create or modify the symbolic link at that path. This is a common issue when dealing with Docker containers, especially when mounting volumes from the host system.

Steps to Resolve the Permission Denied Error

Verify Ownership and Permissions of the Target Directory

Ensure that the directory /home/i2pd/data/certificates/ exists inside the container and that the user running the i2pd process has the appropriate permissions to write to it. You can check this by accessing the container's shell:

Bash
docker exec -it <container_name> /bin/bash

Once inside the container, check the directory's permissions:

Bash
ls -ld /home/i2pd/data/certificates/

If the directory doesn't exist, create it:

Bash
mkdir -p /home/i2pd/data/certificates/

Then, set the correct ownership and permissions:

Bash
chown -R i2pd:i2pd /home/i2pd/data/certificates/
chmod 700 /home/i2pd/data/certificates/

Ensure Proper User Permissions for Mounted Volumes

If you're mounting a host directory to the container (e.g., using Docker's -v or --mount options), ensure that the directory on the host has the appropriate permissions. For example:

Bash
sudo chown -R 1000:1000 /path/to/host/directory
sudo chmod -R 700 /path/to/host/directory

Replace 1000:1000 with the UID and GID of the user running the i2pd process inside the container. This ensures that the container can access and modify the mounted directory.

Rebuild and Restart the Docker Container

After making these changes, rebuild and restart your Docker container to apply the new permissions:

Bash
docker-compose down
docker-compose up --build -d

Or, if you're using Docker without Compose:

Bash
docker stop <container_name>
docker rm <container_name>
docker run <your_docker_run_options>

Check for SELinux or AppArmor Interference

If you're running Docker on a system with SELinux or AppArmor enabled, these security modules might block access to certain files or directories. You can check if SELinux is enforcing policies that might interfere by running:

Bash
getenforce

If it returns Enforcing, SELinux might be causing the issue. You can temporarily set it to permissive mode to test:

Bash
sudo setenforce 0

Remember to set it back to enforcing mode after testing:

Bash
sudo setenforce 1

For AppArmor, you might need to adjust the profile for your Docker container to allow the necessary file operations.

Inspect Dockerfile and Entrypoint Scripts

Review your Dockerfile and any entrypoint scripts to ensure that they don't override the user or permissions settings. For instance, if the Dockerfile sets the user to root, but the entrypoint script switches to a non-root user, it might cause permission issues.

Ensure consistency in user settings throughout your Docker configuration.

Review i2pd Configuration Files

Ensure that the i2pd configuration files (i2pd.conf, tunnels.conf, etc.) are correctly set up and that they don't reference paths that the container cannot access. Misconfigured paths can lead to permission errors.

For example, ensure that the datadir and certificates paths in the configuration files match the actual paths inside the container.

Additional Resources

i2pd Dockerfile on Docker Hub
: Review this to understand how the i2pd Docker image is built and configured.

Stack Overflow Discussion on Docker Permission Denied
: This thread discusses common causes and solutions for permission denied errors in Docker.
Stack Overflow

If you've gone through these steps and are still encountering issues, please provide more details about your Docker setup, including your Dockerfile, docker-compose.yml (if applicable), and any relevant i2pd configuration files. This information will help in diagnosing the problem more accurately.

## User

✔ Container i2pd  Started                                                                                                                          0.3s 
ln: /home/i2pd/data/certificates/i2pd_certificates: Permission denied
15:26:01@84/info - Log: Logging level set to debug
15:26:01@84/none - i2pd v2.57.0 (0.9.66) starting...
15:26:01@84/debug - FS: Main config file: /home/i2pd/data/i2pd.conf
15:26:01@84/debug - FS: Data directory: /home/i2pd/data
15:26:01@84/debug - FS: Certificates directory: /home/i2pd/data/certificates
15:26:01@84/debug - Tunnel: Max number of transit tunnels set to 10000
15:26:01@84/info - Daemon: bandwidth set to 'low'
15:26:01@84/info - Daemon: Using system limit in 1048576 max open files
15:26:01@84/info - Daemon: Starting NetDB
15:26:01@84/info - Family: 0 certificates loaded
15:26:01@84/info - NetDb: 0 routers loaded (0 floodfils)
15:26:01@84/info - Reseed: 0 certificates loaded
15:26:01@84/info - Reseed: Downloading SU3 from https://reseed.stormycloud.org/i2pseeds.su3
15:26:01@84/debug - Reseed: Resolved to 23.128.248.131
15:26:01@84/debug - Reseed: Connected to reseed.stormycloud.org:443
15:26:01@84/error - Reseed: Failed to reseed from https://reseed.stormycloud.org:443/i2pseeds.su3, http code 429
15:26:01@84/warn - Reseed: SU3 download failed
15:26:01@84/info - Reseed: Downloading SU3 from https://reseed.i2pgit.org/i2pseeds.su3
15:26:01@84/debug - Reseed: Resolved to 68.183.196.133
15:26:01@84/debug - Reseed: Connected to reseed.i2pgit.org:443
15:26:01@84/error - Reseed: Failed to reseed from https://reseed.i2pgit.org:443/i2pseeds.su3, http code 429
15:26:01@84/warn - Reseed: SU3 download failed
15:26:01@84/info - Reseed: Downloading SU3 from https://reseed.stormycloud.org/i2pseeds.su3
15:26:01@84/debug - Reseed: Resolved to 23.128.248.131
15:26:01@84/debug - Reseed: Connected to reseed.stormycloud.org:443
15:26:02@84/error - Reseed: Failed to reseed from https://reseed.stormycloud.org:443/i2pseeds.su3, http code 429
15:26:02@84/warn - Reseed: SU3 download failed
15:26:02@84/info - Reseed: Downloading SU3 from https://reseed-pl.i2pd.xyz/i2pseeds.su3
15:26:02@84/debug - Reseed: Resolved to 185.226.181.238
15:26:02@84/debug - Reseed: Connected to reseed-pl.i2pd.xyz:443
15:26:02@84/debug - Reseed: Got 61921 bytes of data from https://reseed-pl.i2pd.xyz:443/i2pseeds.su3
15:26:02@84/warn - Reseed: Certificate for r4sas-reseed@mail.i2p not loaded
15:26:02@84/critical - Reseed: SU3 verification failed
15:26:02@84/info - Reseed: Downloading SU3 from https://i2p.ghativega.in/i2pseeds.su3
15:26:02@84/debug - Reseed: Resolved to 95.216.198.59
15:26:03@84/debug - Reseed: Connected to i2p.ghativega.in:443
15:26:03@84/error - Reseed: Failed to reseed from https://i2p.ghativega.in:443/i2pseeds.su3, http code 429
15:26:03@84/warn - Reseed: SU3 download failed
15:26:03@84/info - Reseed: Downloading SU3 from https://reseed.onion.im/i2pseeds.su3
15:26:03@84/debug - Reseed: Resolved to 159.223.194.171
15:26:03@84/debug - Reseed: Connected to reseed.onion.im:443
15:26:03@84/error - Reseed: Failed to reseed from https://reseed.onion.im:443/i2pseeds.su3, http code 429
15:26:03@84/warn - Reseed: SU3 download failed
15:26:03@84/info - Reseed: Downloading SU3 from https://reseed-fr.i2pd.xyz/i2pseeds.su3
15:26:03@84/debug - Reseed: Resolved to 163.5.187.7
15:26:03@84/error - Reseed: SSL handshake failed: tlsv1 unrecognized name (SSL routines)
15:26:03@84/warn - Reseed: SU3 download failed
15:26:03@84/info - Reseed: Downloading SU3 from https://www2.mk16.de/i2pseeds.su3
15:26:03@84/debug - Reseed: Resolved to 5.252.226.123
15:26:04@84/debug - Reseed: Connected to www2.mk16.de:443
15:26:04@84/error - Reseed: Failed to reseed from https://www2.mk16.de:443/i2pseeds.su3, http code 429
15:26:04@84/warn - Reseed: SU3 download failed
15:26:04@84/info - Reseed: Downloading SU3 from https://coconut.incognet.io/i2pseeds.su3
15:26:04@84/error - Reseed: Failed to connect to coconut.incognet.io
15:26:04@84/warn - Reseed: SU3 download failed
15:26:04@84/info - Reseed: Downloading SU3 from https://reseed-fr.i2pd.xyz/i2pseeds.su3
15:26:04@84/debug - Reseed: Resolved to 163.5.187.7
15:26:04@84/error - Reseed: SSL handshake failed: tlsv1 unrecognized name (SSL routines)
15:26:04@84/warn - Reseed: SU3 download failed
15:26:04@84/warn - Reseed: Failed to reseed from servers after 10 attempts
15:26:04@84/warn - Reseed: Failed to reseed from servers
15:26:04@84/info - Daemon: Starting Transports
15:26:04@84/info - NTCP2: Proxy is not used
15:26:04@84/info - NTCP2: Start listening v4 TCP port 15664
15:26:04@84/debug - SSU2: Opening IPv4 socket at Start
15:26:04@84/info - SSU2: Socket receive buffer size: 131072
15:26:04@84/info - SSU2: Socket send buffer size: 131072
15:26:04@84/info - SSU2: Start listening on 0.0.0.0:15664
15:26:04@84/info - Transports: Started peer test IPv4
15:26:04@84/warn - Transports: Can't find routers for peer test IPv4
15:26:04@84/info - Daemon: Transports started
15:26:04@84/info - Daemon: Starting Webconsole at 0.0.0.0:7070
15:26:04@84/info - Daemon: Starting Tunnels
15:26:04@84/info - Daemon: Starting Router context
15:26:04@84/info - Daemon: Starting Client
15:26:04@84/info - Destination: Parameters for tunnel set to: 3 inbound (3 hops), 3 outbound (3 hops), 40 tags
15:26:04@84/warn - Addressbook: Can't open /home/i2pd/data/addressbook/addresses.csv
15:26:04@84/error - Addressbook: Resetting eTags
15:26:04@84/info - Addressbook: Loading subscriptions from config
15:26:04@84/info - Addressbook: 1 subscriptions urls loaded
15:26:04@84/info - Clients: Starting HTTP Proxy at 0.0.0.0:4444
15:26:04@84/info - Clients: New transient keys address xgly7v3oxyluz3xpat46ueeven6uraxmrdfcjw65durppiprnqua.b32.i2p created
15:26:04@84/info - Destination: Parameters for tunnel set to: 5 inbound (3 hops), 5 outbound (3 hops), 40 tags
15:26:04@84/info - Clients: Starting SOCKS Proxy at 0.0.0.0:4447
15:26:04@84/debug - Clients: Tunnels config file: /home/i2pd/data/tunnels.conf
15:26:04@84/warn - Clients: Can't read /home/i2pd/data/tunnels.conf: /home/i2pd/data/tunnels.conf: cannot open file
15:26:04@84/info - Clients: 0 I2P client tunnels created
15:26:04@84/info - Clients: 0 I2P server tunnels created
15:26:04@84/info - Clients: Starting SAM bridge at 0.0.0.0:[7656|0]
15:26:06@766/debug - Tunnel: Creating zero hops inbound tunnel
15:26:06@766/debug - Tunnels: Creating destination outbound tunnel...
15:26:06@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:06@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:06@766/error - Tunnels: Can't create outbound tunnel, no peers available
15:26:06@766/debug - Tunnels: Creating destination outbound tunnel...
15:26:06@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:06@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:06@766/error - Tunnels: Can't create outbound tunnel, no peers available
15:26:06@766/debug - Tunnels: Creating destination outbound tunnel...
15:26:06@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:06@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:06@766/error - Tunnels: Can't create outbound tunnel, no peers available
15:26:06@766/debug - Tunnels: Creating destination inbound tunnel...
15:26:06@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:06@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:06@766/error - Tunnels: Can't create inbound tunnel, no peers available
15:26:06@766/debug - Tunnels: Creating destination inbound tunnel...
15:26:06@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:06@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:06@766/error - Tunnels: Can't create inbound tunnel, no peers available
15:26:06@766/debug - Tunnels: Creating destination inbound tunnel...
15:26:06@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:06@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:06@766/error - Tunnels: Can't create inbound tunnel, no peers available
15:26:11@766/debug - Tunnels: Creating destination outbound tunnel...
15:26:11@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:11@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:11@766/error - Tunnels: Can't create outbound tunnel, no peers available
15:26:11@766/debug - Tunnels: Creating destination outbound tunnel...
15:26:11@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:11@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:11@766/error - Tunnels: Can't create outbound tunnel, no peers available
15:26:11@766/debug - Tunnels: Creating destination outbound tunnel...
15:26:11@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:11@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:11@766/error - Tunnels: Can't create outbound tunnel, no peers available
15:26:11@766/debug - Tunnels: Creating destination inbound tunnel...
15:26:11@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:11@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:11@766/error - Tunnels: Can't create inbound tunnel, no peers available
15:26:11@766/debug - Tunnels: Creating destination inbound tunnel...
15:26:11@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:11@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:11@766/error - Tunnels: Can't create inbound tunnel, no peers available
15:26:11@766/debug - Tunnels: Creating destination inbound tunnel...
15:26:11@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:11@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:11@766/error - Tunnels: Can't create inbound tunnel, no peers available
15:26:11@766/debug - Tunnels: Creating destination outbound tunnel...
15:26:11@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:11@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:11@766/error - Tunnels: Can't create outbound tunnel, no peers available
15:26:11@766/debug - Tunnels: Creating destination outbound tunnel...
15:26:11@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:11@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:11@766/error - Tunnels: Can't create outbound tunnel, no peers available
15:26:11@766/debug - Tunnels: Creating destination outbound tunnel...
15:26:11@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:11@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:11@766/error - Tunnels: Can't create outbound tunnel, no peers available
15:26:11@766/debug - Tunnels: Creating destination inbound tunnel...
15:26:11@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:11@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:11@766/error - Tunnels: Can't create inbound tunnel, no peers available
15:26:11@766/debug - Tunnels: Creating destination inbound tunnel...
15:26:11@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:11@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:11@766/error - Tunnels: Can't create inbound tunnel, no peers available
15:26:11@766/debug - Tunnels: Creating destination inbound tunnel...
15:26:11@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:11@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:11@766/error - Tunnels: Can't create inbound tunnel, no peers available
15:26:21@766/warn - Tunnel: Can't find any router, skip creating tunnel
15:26:21@766/debug - Tunnels: Creating destination outbound tunnel...
15:26:21@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:21@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:21@766/error - Tunnels: Can't create outbound tunnel, no peers available
15:26:21@766/debug - Tunnels: Creating destination outbound tunnel...
15:26:21@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:21@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:21@766/error - Tunnels: Can't create outbound tunnel, no peers available
15:26:21@766/debug - Tunnels: Creating destination outbound tunnel...
15:26:21@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:21@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:21@766/error - Tunnels: Can't create outbound tunnel, no peers available
15:26:21@766/debug - Tunnels: Creating destination inbound tunnel...
15:26:21@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:21@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:21@766/error - Tunnels: Can't create inbound tunnel, no peers available
15:26:21@766/debug - Tunnels: Creating destination inbound tunnel...
15:26:21@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:21@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:21@766/error - Tunnels: Can't create inbound tunnel, no peers available
15:26:21@766/debug - Tunnels: Creating destination inbound tunnel...
15:26:21@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:21@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:21@766/error - Tunnels: Can't create inbound tunnel, no peers available
15:26:26@766/debug - Tunnels: Creating destination outbound tunnel...
15:26:26@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:26@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:26@766/error - Tunnels: Can't create outbound tunnel, no peers available
15:26:26@766/debug - Tunnels: Creating destination outbound tunnel...
15:26:26@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:26@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:26@766/error - Tunnels: Can't create outbound tunnel, no peers available
15:26:26@766/debug - Tunnels: Creating destination outbound tunnel...
15:26:26@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:26@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:26@766/error - Tunnels: Can't create outbound tunnel, no peers available
15:26:26@766/debug - Tunnels: Creating destination inbound tunnel...
15:26:26@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:26@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:26@766/error - Tunnels: Can't create inbound tunnel, no peers available
15:26:26@766/debug - Tunnels: Creating destination inbound tunnel...
15:26:26@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:26@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:26@766/error - Tunnels: Can't create inbound tunnel, no peers available
15:26:26@766/debug - Tunnels: Creating destination inbound tunnel...
15:26:26@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:26@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:26@766/error - Tunnels: Can't create inbound tunnel, no peers available
15:26:26@766/debug - Tunnels: Creating destination outbound tunnel...
15:26:26@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:26@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:26@766/error - Tunnels: Can't create outbound tunnel, no peers available
15:26:26@766/debug - Tunnels: Creating destination outbound tunnel...
15:26:26@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:26@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:26@766/error - Tunnels: Can't create outbound tunnel, no peers available
15:26:26@766/debug - Tunnels: Creating destination outbound tunnel...
15:26:26@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:26@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:26@766/error - Tunnels: Can't create outbound tunnel, no peers available
15:26:26@766/debug - Tunnels: Creating destination inbound tunnel...
15:26:26@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:26@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:26@766/error - Tunnels: Can't create inbound tunnel, no peers available
15:26:26@766/debug - Tunnels: Creating destination inbound tunnel...
15:26:26@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:26@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:26@766/error - Tunnels: Can't create inbound tunnel, no peers available
15:26:26@766/debug - Tunnels: Creating destination inbound tunnel...
15:26:26@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:26@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:26@766/error - Tunnels: Can't create inbound tunnel, no peers available
15:26:36@766/warn - Tunnel: Can't find any router, skip creating tunnel
15:26:36@766/debug - Tunnels: Creating destination outbound tunnel...
15:26:36@766/info - Tunnels: Can't select first hop for a tunnel. Trying already connected
15:26:36@766/error - Tunnels: Can't select next hop for 7xx4KRfzqjqmxO5Pqvhem-ln9MvCIeRWGyiRcLTT90M=
15:26:36@766/error - Tunnels: Can't create outbound tunnel, no peers available
15:26:36@766/debug - Tunnels: Creating destination outbound tunnel...


What do I do now?? still doesn't work
Show more

## Assistant

Thanks for your patience. Here's a targeted fix for the purplei2pd Docker error:

ln: /home/i2pd/data/certificates/i2pd_certificates: Permission denied

✅ Exact Fix

This error occurs because the container is trying to create a symlink or directory inside /home/i2pd/data/certificates/, but lacks write permissions—even as root—because:

You're mounting a read-only volume or directory from the host, or

The mounted directory has incorrect ownership or mode

🛠️ Fix Instructions

Stop the container (if running):

Bash
docker stop i2pd && docker rm i2pd

Ensure the mounted volume path is writable:

If you're using a docker run command with:

Bash
-v /some/host/dir:/home/i2pd/data

Make sure /some/host/dir has correct permissions:

Bash
sudo chown -R 1000:1000 /some/host/dir
sudo chmod -R u+rwX /some/host/dir

UID 1000 is the i2pd user inside most images (you can confirm with docker run -it --rm purplei2p/i2pd id)

Alternatively, mount a writable, clean volume:

Bash
docker volume create i2pd-data
docker run -d --name i2pd \
  -v i2pd-data:/home/i2pd/data \
  ghcr.io/eyedeekay/i2pd:latest

Or override the default data dir completely:

If you want to avoid this directory entirely, use a different --datadir:

Bash
docker run -d --name i2pd \
  -v i2pd-data:/i2p \
  ghcr.io/eyedeekay/i2pd:latest \
  --datadir=/i2p
🧪 Why It Happens

The image tries to write a symlink like:

Bash
ln -s /usr/share/i2pd/certificates /home/i2pd/data/certificates/i2pd_certificates

This fails if /home/i2pd/data/certificates/ is mounted from the host and not writable by the i2pd user or even root inside the container (due to Docker user namespace remapping or host permissions).

Let me know if you need a fixed docker-compose.yml too.
