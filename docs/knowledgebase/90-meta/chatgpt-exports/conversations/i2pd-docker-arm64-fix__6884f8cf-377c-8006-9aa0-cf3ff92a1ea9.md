---
source_url: "https://chatgpt.com/c/6884f8cf-377c-8006-9aa0-cf3ff92a1ea9"
conversation_id: "6884f8cf-377c-8006-9aa0-cf3ff92a1ea9"
title: "i2pd Docker ARM64 Fix"
extracted_at: "2026-06-29T16:13:53.614Z"
message_count: 2
provenance: auth-ui
---

# i2pd Docker ARM64 Fix

Source: [ChatGPT conversation](https://chatgpt.com/c/6884f8cf-377c-8006-9aa0-cf3ff92a1ea9)

## User

how to fix i2pd in docker on arm64?




 ✔ Container i2pd  Started                                                                                                                          0.3s 
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



  i2pd:
    build:
      context: https://github.com/purplei2p/i2pd.git#master:/contrib/docker
      dockerfile: Dockerfile
    # use this one with amd64:
    #image: geti2p/i2p
    # use these with arm64:
    #image: ghcr.io/purplei2p/i2pd:latest
    image: purplei2p/i2pd:latest
    container_name: i2pd
    hostname: i2pd
    extra_hosts: *common-hostname-aliases
    networks:
      - i2pnet
    configs:
      - source: i2pd.conf
        target: ${I2P_DATA_DIR:-/home/i2pd/data}/i2pd.conf
        mode: 0644
    volumes:
      - ${CERTS_PATH:-./certs}/i2pd_certificates/family:/i2pd_certificates/family
      - ${CERTS_PATH:-./certs}/i2pd_certificates/reseed:/i2pd_certificates/reseed
      - ${CONFIG_PATH:-./configs}/i2pd/i2psnark:/i2psnark
      - /var/run/docker.sock:/var/run/docker.sock  # For watcher
    environment:
      <<: *common-env
      DATA_DIR: ${I2P_DATA_DIR:-${I2P_DATA_DIR:-/home/i2pd/data}}
      EXT_PORT: ${I2P_EXT_PORT:-7661}
    #command: ["/bin/sh", "-c", "COMMAND=/usr/local/bin/i2pd if [ \"$1\" = \"--help\" ]; then set -- $COMMAND --help; else mkdir -p \"$DATA_DIR\"/certificates; if [ ! -L \"$DATA_DIR\"/certificates/i2pd_certificates ]; then ln -s /i2pd_certificates \"$DATA_DIR\"/certificates/i2pd_certificates 2>/dev/null || true; fi; set -- $COMMAND $DEFAULT_ARGS $@; fi; exec \"$@\""]
    restart: always
Show more

## Assistant

You're encountering issues with I2Pd on ARM64 in Docker, specifically failing reseed, no peers, and tunnel creation failures. Here's how to fix or mitigate this:

✅ Summary of Root Problems

Most reseed servers return HTTP 429 (rate-limited).

One reseed server returns “SU3 verification failed” – likely missing certs.

No peers available, so no tunnels created.

🔧 Step-by-Step Fixes
1. ✅ Verify reseed certificates are present and mounted

You're missing valid reseed certs:

/home/i2pd/data/certificates/reseed  → expected to have .crt for reseed servers
🔍 Check:

Are your mounted certs valid and complete?

Do these files exist in your mounted volume?

${CERTS_PATH:-./certs}/i2pd_certificates/reseed/

They should include .crt files like r4sas-reseed@mail.i2p.crt.

✅ Fix:

Update the Docker volume to ensure proper mounting of reseed certificates:

YAML
volumes:
  - ./certs/i2pd_certificates/reseed:/home/i2pd/data/certificates/reseed

Make sure .crt files are in that reseed directory.

📦 You can download latest reseed certs from: https://github.com/PurpleI2P/i2pd/tree/master/certificates/reseed

2. ✅ Force a manual reseed once certs are fixed

Run inside the container:

Bash
docker exec -it i2pd i2pd --reseed

This will retry the reseed process manually using the updated certificates.

3. ⚙️ Extend the list of reseed servers (optional but helpful)

In i2pd.conf, you can add or verify:

INI
reseed.urls=https://reseed.i2pgit.org/i2pseeds.su3,https://reseed.stormycloud.org/i2pseeds.su3,https://reseed.onion.im/i2pseeds.su3

Make sure i2pd.conf is correctly mounted into the container (your Docker Compose does this, but double-check the path):

YAML
configs:
  - source: i2pd.conf
    target: /home/i2pd/data/i2pd.conf
4. 🚫 Disable reseed check on every start (if manually seeded)

If you reseed once and want to disable further reseeding (for minimal container boot), you can set:

INI
reseed.verify=false
reseed.enable=false

But only after you've successfully bootstrapped the network once.

5. ✅ Networking (Docker)

Ensure your container has outbound internet access, and that DNS resolution works. You can test from within the container:

Bash
docker exec -it i2pd ping google.com
docker exec -it i2pd curl https://reseed.i2pgit.org

If DNS fails inside the container, reseed will fail no matter what else you fix.

📌 Optional: Use Persistent Bootstrap

You can manually download a reseed SU3 file and mount it into the container as a persistent fallback:

Bash
wget https://reseed.i2pgit.org/i2pseeds.su3 -O ./certs/reseed/i2pseeds.su3

Then add to config:

INI
reseed.file=/home/i2pd/data/certificates/reseed/i2pseeds.su3
🚨 After Fixing Certs and Reseed

Restart container:

Bash
docker compose restart i2pd
🧪 Verify Success

Inside the container:

Bash
docker exec -it i2pd tail -f /home/i2pd/data/i2pd.log

You're looking for:

NetDb: Loaded X routers (Y floodfills)
Tunnels: Created outbound/inbound tunnel...
🧠 TL;DR
Step	Action
✅ 1	Ensure valid reseed certificates are mounted
✅ 2	Run i2pd --reseed manually once
✅ 3	Confirm i2pd.conf includes updated reseed URLs
✅ 4	Confirm container has outbound network/DNS access
✅ 5	Optional: Use local SU3 file and disable reseed

Let me know if you want a minimal config or helper script for reseeding!
