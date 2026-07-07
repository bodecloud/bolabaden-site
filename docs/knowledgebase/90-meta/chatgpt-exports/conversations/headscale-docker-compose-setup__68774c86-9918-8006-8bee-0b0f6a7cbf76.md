---
source_url: "https://chatgpt.com/c/68774c86-9918-8006-8bee-0b0f6a7cbf76"
conversation_id: "68774c86-9918-8006-8bee-0b0f6a7cbf76"
title: "Headscale Docker Compose Setup"
extracted_at: "2026-06-29T14:16:48.492Z"
message_count: 2
provenance: auth-ui
---

# Headscale Docker Compose Setup

Source: [ChatGPT conversation](https://chatgpt.com/c/68774c86-9918-8006-8bee-0b0f6a7cbf76)

## User

services:
  headscale: 
    # 🔹🔹 Headscale 🔹🔹
    image: docker.io/headscale/headscale:latest
    container_name: headscale
    hostname: headscale
    networks:
      - publicnet
    expose:
      - 3478  # STUN server
      - 8080  # HTTP server
      - 9090  # Debug/Metrics
      - 50443 # remote gRPC
    volumes:
      - ${CONFIG_PATH:-./configs}/headscale/config:/etc/headscale
      - ${CONFIG_PATH:-./configs}/headscale/lib:/var/lib/headscale
      - ${CONFIG_PATH:-./configs}/headscale/run:/var/run/headscale
    configs:
      - source: headscale-config.yml
        target: /etc/headscale/config.yml
    environment:
      <<: *common-env
    labels:
      deunhealth.restart.on.unhealthy: "true"
      traefik.enable: "true"
      traefik.http.routers.headscale.service: headscale
      traefik.http.routers.headscale.rule: Host(`headscale.${DOMAIN}`) || Host(`headscale.${DUCKDNS_SUBDOMAIN}.duckdns.org`) || Host(`headscale.${TS_HOSTNAME}.duckdns.org`)
      traefik.http.services.headscale.loadbalancer.server.port: 8080
      traefik.http.routers.headscale-admin.service: headscale-admin
      traefik.http.routers.headscale-admin.rule: Host(`headscale-admin.${DOMAIN}`) || Host(`headscale-admin.${DUCKDNS_SUBDOMAIN}.duckdns.org`) || Host(`headscale-admin.${TS_HOSTNAME}.duckdns.org`)
      traefik.http.services.headscale-admin.loadbalancer.server.port: 9090
      homepage.group: Networking
      homepage.name: Headscale
      homepage.icon: headscale.png
      homepage.href: https://headscale.${DOMAIN}/
      homepage.description: Headscale is a server that manages your Tailscale network.
    command: serve

configs:
  
  #### Headscale config ####
  headscale-config.yml:
    content: |
      ---
      # headscale will look for a configuration file named `config.yaml` (or `config.json`) in the following order:
      #
      # - `/etc/headscale`
      # - `~/.headscale`
      # - current working directory
      # The url clients will connect to.
      # Typically this will be a domain like:
      #
      # https://headscale.${DOMAIN}:443
      #
      server_url: https://headscale.${DOMAIN}:443
      # For local development:
      #server_url: http://127.0.0.1:8080
      # Address to listen to / bind to on the server
      #
      # For production:
      listen_addr: 0.0.0.0:8080
      # For local development
      #listen_addr: 127.0.0.1:8080
      # Address to listen to /metrics and /debug, you may want
      # to keep this endpoint private to your internal network
      metrics_listen_addr: 127.0.0.1:9090
      # Address to listen for gRPC.
      # gRPC is used for controlling a headscale server
      # remotely with the CLI
      # Note: Remote access _only_ works if you have
      # valid certificates.
      #
      # For production:
      grpc_listen_addr: 0.0.0.0:50443
      # For local development
      #grpc_listen_addr: 127.0.0.1:50443
      # Allow the gRPC admin interface to run in INSECURE
      # mode. This is not recommended as the traffic will
      # be unencrypted. Only enable if you know what you
      # are doing.
      grpc_allow_insecure: false
      # The Noise section includes specific configuration for the
      # TS2021 Noise protocol
      noise:
        # The Noise private key is used to encrypt the traffic between headscale and
        # Tailscale clients when using the new Noise-based protocol. A missing key
        # will be automatically generated.
        private_key_path: /var/lib/headscale/noise_private.key
      # List of IP prefixes to allocate tailaddresses from.
      # Each prefix consists of either an IPv4 or IPv6 address,
      # and the associated prefix length, delimited by a slash.
      # It must be within IP ranges supported by the Tailscale
      # client - i.e., subnets of 100.64.0.0/10 and fd7a:115c:a1e0::/48.
      # See below:
      # IPv6: https://github.com/tailscale/tailscale/blob/22ebb25e833264f58d7c3f534a8b166894a89536/net/tsaddr/tsaddr.go#LL81C52-L81C71
      # IPv4: https://github.com/tailscale/tailscale/blob/22ebb25e833264f58d7c3f534a8b166894a89536/net/tsaddr/tsaddr.go#L33
      # Any other range is NOT supported, and it will cause unexpected issues.
      prefixes:
        v4: ${TAILSCALE_IPV4_PREFIX:-100.64.0.0/10}
        v6: ${TAILSCALE_IPV6_PREFIX:-fd7a:115c:a1e0::/48}
        # Strategy used for allocation of IPs to nodes, available options:
        # - sequential (default): assigns the next free IP from the previous given IP.
        # - random: assigns the next free IP from a pseudo-random IP generator (crypto/rand).
        allocation: sequential
      # DERP is a relay system that Tailscale uses when a direct
      # connection cannot be established.
      # https://tailscale.com/blog/how-tailscale-works/#encrypted-tcp-relays-derp
      #
      # headscale needs a list of DERP servers that can be presented
      # to the clients.
      derp:
        server:
          # If enabled, runs the embedded DERP server and merges it into the rest of the DERP config
          # The Headscale server_url defined above MUST be using https, DERP requires TLS to be in place
          enabled: true
          # Region ID to use for the embedded DERP server.
          # The local DERP prevails if the region ID collides with other region ID coming from
          # the regular DERP config.
          region_id: 999
          # Region code and name are displayed in the Tailscale UI to identify a DERP region
          region_code: "Chicago"
          region_name: "Oracle Cloud Headscale Embedded DERP"
          # Listens over UDP at the configured address for STUN connections - to help with NAT traversal.
          # When the embedded DERP server is enabled stun_listen_addr MUST be defined.
          #
          # For more details on how this works, check this great article: https://tailscale.com/blog/how-tailscale-works/
          stun_listen_addr: "0.0.0.0:3478"
          # Private key used to encrypt the traffic between headscale DERP and
          # Tailscale clients. A missing key will be automatically generated.
          private_key_path: /var/lib/headscale/derp_server_private.key
          # This flag can be used, so the DERP map entry for the embedded DERP server is not written automatically,
          # it enables the creation of your very own DERP map entry using a locally available file with the parameter DERP.paths
          # If you enable the DERP server and set this to false, it is required to add the DERP server to the DERP map using DERP.paths
          automatically_add_embedded_derp_region: true
          # For better connection stability (especially when using an Exit-Node and DNS is not working),
          # it is possible to optionally add the public IPv4 and IPv6 address to the Derp-Map using:
          #ipv4: 1.2.3.4
          #ipv6: 2001:db8::1
        # List of externally available DERP maps encoded in JSON
        urls:
          - https://controlplane.tailscale.com/derpmap/default
        # Locally available DERP map files encoded in YAML
        #
        # This option is mostly interesting for people hosting
        # their own DERP servers:
        # https://tailscale.com/kb/1118/custom-derp-servers/
        #
        # paths:
        #   - /etc/headscale/derp-example.yaml
        paths: []
        # If enabled, a worker will be set up to periodically
        # refresh the given sources and update the derpmap
        # will be set up.
        auto_update_enabled: true
        # How often should we check for DERP updates?
        update_frequency: 3h  # default is 24h
      # Disables the automatic check for headscale updates on startup
      disable_check_updates: false
      # Time before an inactive ephemeral node is deleted?
      ephemeral_node_inactivity_timeout: 30m
      database:
        # Database type. Available options: sqlite, postgres
        # Please note that using Postgres is highly discouraged as it is only supported for legacy reasons.
        # All new development, testing and optimisations are done with SQLite in mind.
        type: sqlite
        # Enable debug mode. This setting requires the log.level to be set to "debug" or "trace".
        debug: false
        # GORM configuration settings.
        gorm:
          # Enable prepared statements.
          prepare_stmt: true
          # Enable parameterized queries.
          parameterized_queries: true
          # Skip logging "record not found" errors.
          skip_err_record_not_found: true
          # Threshold for slow queries in milliseconds.
          slow_threshold: 1000
        # SQLite config
        sqlite:
          path: /var/lib/headscale/db.sqlite
          # Enable WAL mode for SQLite. This is recommended for production environments.
          # https://www.sqlite.org/wal.html
          write_ahead_log: true
          # Maximum number of WAL file frames before the WAL file is automatically checkpointed.
          # https://www.sqlite.org/c3ref/wal_autocheckpoint.html
          # Set to 0 to disable automatic checkpointing.
          wal_autocheckpoint: 1000
      ### TLS configuration
      #
      ## Let's encrypt / ACME
      #
      # headscale supports automatically requesting and setting up
      # TLS for a domain with Let's Encrypt.
      #
      # URL to ACME directory
      acme_url: https://acme-v02.api.letsencrypt.org/directory
      # Email to register with ACME provider
      acme_email: "${ACME_EMAIL:-bolabaden.duckdns@gmail.com}"
      # Domain name to request a TLS certificate for:
      tls_letsencrypt_hostname: "headscale.${DOMAIN}"
      # Path to store certificates and metadata needed by
      # letsencrypt
      # For production:
      tls_letsencrypt_cache_dir: /var/lib/headscale/cache
      # Type of ACME challenge to use, currently supported types:
      # HTTP-01 or TLS-ALPN-01
      # See: docs/ref/tls.md for more information
      tls_letsencrypt_challenge_type: HTTP-01
      # When HTTP-01 challenge is chosen, letsencrypt must set up a
      # verification endpoint, and it will be listening on:
      # :http = port 80
      tls_letsencrypt_listen: ":http"
      ## Use already defined certificates:
      tls_cert_path: ""
      tls_key_path: ""
      log:
        # Output formatting for logs: text or json
        format: text
        level: info
      ## Policy
      # headscale supports Tailscale's ACL policies.
      # Please have a look to their KB to better
      # understand the concepts: https://tailscale.com/kb/1018/acls/
      policy:
        # The mode can be "file" or "database" that defines
        # where the ACL policies are stored and read from.
        mode: file
        # If the mode is set to "file", the path to a
        # HuJSON file containing ACL policies.
        path: ""
      ## DNS
      #
      # headscale supports Tailscale's DNS configuration and MagicDNS.
      # Please have a look to their KB to better understand the concepts:
      #
      # - https://tailscale.com/kb/1054/dns/
      # - https://tailscale.com/kb/1081/magicdns/
      # - https://tailscale.com/blog/2021-09-private-dns-with-magicdns/
      #
      # Please note that for the DNS configuration to have any effect,
      # clients must have the `--accept-dns=true` option enabled. This is the
      # default for the Tailscale client. This option is enabled by default
      # in the Tailscale client.
      #
      # Setting _any_ of the configuration and `--accept-dns=true` on the
      # clients will integrate with the DNS manager on the client or
      # overwrite /etc/resolv.conf.
      # https://tailscale.com/kb/1235/resolv-conf
      #
      # If you want stop Headscale from managing the DNS configuration
      # all the fields under `dns` should be set to empty values.
      dns:
        # Whether to use [MagicDNS](https://tailscale.com/kb/1081/magicdns/).
        magic_dns: true
        # Defines the base domain to create the hostnames for MagicDNS.
        # This domain _must_ be different from the server_url domain.
        # `base_domain` must be a FQDN, without the trailing dot.
        # The FQDN of the hosts will be
        # `hostname.base_domain` (e.g., _myhost.example.com_).
        base_domain: ${DOMAIN}
        # Whether to use the local DNS settings of a node (default) or override the
        # local DNS settings and force the use of Headscale's DNS configuration.
        override_local_dns: true
        # List of DNS servers to expose to clients.
        nameservers:
          global:
            - 1.1.1.1
            - 1.0.0.1
            - 8.8.8.8
            - 8.8.4.4
            - 2606:4700:4700::1111
            - 2606:4700:4700::1001
            # NextDNS (see https://tailscale.com/kb/1218/nextdns/).
            # "abc123" is example NextDNS ID, replace with yours.
            - https://dns.nextdns.io/${NEXT_DNS_ID}
          # Split DNS (see https://tailscale.com/kb/1054/dns/),
          # a map of domains and which DNS server to use for each.
          split:
            {}
            # foo.bar.com:
            #   - 1.1.1.1
            # darp.headscale.net:
            #   - 1.1.1.1
            #   - 8.8.8.8
        # Set custom DNS search domains. With MagicDNS enabled,
        # your tailnet base_domain is always the first search domain.
        search_domains: []
        # Extra DNS records
        # so far only A and AAAA records are supported (on the tailscale side)
        # See: docs/ref/dns.md
        extra_records: []
        #   - name: "grafana.myvpn.example.com"
        #     type: "A"
        #     value: "100.64.0.3"
        #
        #   # you can also put it in one line
        #   - { name: "prometheus.myvpn.example.com", type: "A", value: "100.64.0.3" }
        #
        # Alternatively, extra DNS records can be loaded from a JSON file.
        # Headscale processes this file on each change.
        # extra_records_path: /var/lib/headscale/extra-records.json
      # Unix socket used for the CLI to connect without authentication
      # Note: for production you will want to set this to something like:
      unix_socket: /var/run/headscale/headscale.sock
      unix_socket_permission: "0770"
      #
      # headscale supports experimental OpenID connect support,
      # it is still being tested and might have some bugs, please
      # help us test it.
      # OpenID Connect
      # oidc:
      #   only_start_if_oidc_is_available: true
      #   issuer: "https://your-oidc.issuer.com/path"
      #   client_id: "your-oidc-client-id"
      #   client_secret: "your-oidc-client-secret"
      #   # Alternatively, set `client_secret_path` to read the secret from the file.
      #   # It resolves environment variables, making integration to systemd's
      #   # `LoadCredential` straightforward:
      #   client_secret_path: "${CREDENTIALS_DIRECTORY}/oidc_client_secret"
      #   # client_secret and client_secret_path are mutually exclusive.
      #
      #   # The amount of time from a node is authenticated with OpenID until it
      #   # expires and needs to reauthenticate.
      #   # Setting the value to "0" will mean no expiry.
      #   expiry: 180d
      #
      #   # Use the expiry from the token received from OpenID when the user logged
      #   # in, this will typically lead to frequent need to reauthenticate and should
      #   # only been enabled if you know what you are doing.
      #   # Note: enabling this will cause `oidc.expiry` to be ignored.
      #   use_expiry_from_token: false
      #
      #   # Customize the scopes used in the OIDC flow, defaults to "openid", "profile" and "email" and add custom query
      #   # parameters to the Authorize Endpoint request. Scopes default to "openid", "profile" and "email".
      #
      #   scope: ["openid", "profile", "email", "custom"]
      #   extra_params:
      #     domain_hint: example.com
      #
      #   # List allowed principal domains and/or users. If an authenticated user's domain is not in this list, the
      #   # authentication request will be rejected.
      #
      #   allowed_domains:
      #     - example.com
      #   # Note: Groups from keycloak have a leading '/'
      #   allowed_groups:
      #     - /headscale
      #   allowed_users:
      #     - alice@example.com
      #
      #   # Optional: PKCE (Proof Key for Code Exchange) configuration
      #   # PKCE adds an additional layer of security to the OAuth 2.0 authorization code flow
      #   # by preventing authorization code interception attacks
      #   # See https://datatracker.ietf.org/doc/html/rfc7636
      #   pkce:
      #     # Enable or disable PKCE support (default: false)
      #     enabled: false
      #     # PKCE method to use:
      #     # - plain: Use plain code verifier
      #     # - S256: Use SHA256 hashed code verifier (default, recommended)
      #     method: S256
      #Logtail configuration
      # Logtail is Tailscales logging and auditing infrastructure, it allows the control panel
      # to instruct tailscale nodes to log their activity to a remote server.
      logtail:
        # Enable logtail for this headscales clients.
        # As there is currently no support for overriding the log server in headscale, this is
        # disabled by default. Enabling this will make your clients send logs to Tailscale Inc.
        enabled: false
      # Enabling this option makes devices prefer a random port for WireGuard traffic over the
      # default static port 41641. This option is intended as a workaround for some buggy
      # firewall devices. See https://tailscale.com/kb/1181/firewalls/ for more information.
      randomize_client_port: false


How to fix the issue with headscale? i'm trying to create my own wireguard similar to tailscale. both headscale-admin.${DOMAIN} and headscale.${DOMAIN} do not resolve. headscale-admin throws 502, headscale throws 400.
Show more

## Assistant

Your docker-compose.yml and Headscale configuration are quite detailed and thoughtfully structured. Below is a summary of key points, along with recommendations, potential issues, and optimizations you may want to consider.

✅ What’s Done Well

Comprehensive Headscale Setup:

Fully configured for production use.

gRPC, STUN, metrics, and embedded DERP server all enabled properly.

MagicDNS and DNS override is set.

SQLite with WAL and GORM optimizations.

Security Awareness:

grpc_allow_insecure: false – good!

DERP server with TLS requirement and automatic key generation.

Automation-Friendly:

ACME/Let's Encrypt TLS enabled.

Configs are environment-variable driven – ideal for CI/CD or multi-environment setups.

Traefik Labels:

Dual router setup (regular + admin).

Dynamic domain routing with support for DuckDNS and custom domain.

Homepage Labels:

Useful metadata for dashboard display.

⚠️ Potential Issues or Improvements
1. Port Exposure in Docker
YAML
expose:
  - 3478
  - 8080
  - 9090
  - 50443

expose makes the ports available to other services but not to the host. If external access is required (e.g., for gRPC or STUN from clients), use ports instead.

YAML
ports:
  - "3478:3478/udp"
  - "8080:8080"
  - "50443:50443"

Or consider Traefik handling TLS termination and routing.

2. Missing depends_on or restart: unless-stopped

For robustness:

YAML
restart: unless-stopped
depends_on:
  - traefik
3. Cert Port Conflict Risk

tls_letsencrypt_listen: ":http" (i.e. port 80) can conflict if:

Another service (like Traefik) is already binding port 80.

Consider offloading cert handling to Traefik and disable Headscale ACME:

YAML
tls_letsencrypt_hostname: ""
acme_email: ""
4. Exposed Debug/Metrics Port
YAML
metrics_listen_addr: 127.0.0.1:9090

Good that it’s bound to localhost, but Traefik label exposes it:

YAML
traefik.http.services.headscale-admin.loadbalancer.server.port: 9090

✅ If intentional for external access, keep it. Otherwise, remove the label or use internal-only routing.

5. SQLite Backup Strategy

SQLite is great for simplicity, but backup and concurrency considerations are critical in production. Ensure:

You back up /var/lib/headscale/db.sqlite regularly.

You mount that path on persistent storage.

✅ Recommended Enhancements
A. Healthcheck for Headscale

Helps Traefik, Watchtower, and other services know when to restart:

YAML
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
  interval: 30s
  timeout: 10s
  retries: 3

Make sure /health endpoint exists or adjust accordingly.

B. MagicDNS Domain Separation

If your base domain and UI domain are the same (${DOMAIN}), consider using a subdomain (e.g., internal.${DOMAIN}) for dns.base_domain to avoid confusion:

YAML
base_domain: "tailnet.${DOMAIN}"
✅ Final Thoughts

This setup is nearly production-ready out-of-the-box, with strong security and network considerations. If you're deploying this behind Traefik and you're using Docker secrets or environment management tools like .env, you're following best practices.

Let me know if you'd like help adding:

A sample .env file

Traefik config example

Systemd integration for auto-start

OpenID Connect support

Would you like those?
