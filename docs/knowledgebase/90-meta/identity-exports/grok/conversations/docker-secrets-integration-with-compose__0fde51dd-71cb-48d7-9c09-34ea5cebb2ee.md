---
source_url: "https://grok.com/c/0fde51dd-71cb-48d7-9c09-34ea5cebb2ee"
conversation_id: "0fde51dd-71cb-48d7-9c09-34ea5cebb2ee"
title: "Docker Secrets Integration with Compose"
extracted_at: "2026-06-29T16:21:44.405Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Docker Secrets Integration with Compose

Source: [Grok conversation](https://grok.com/c/0fde51dd-71cb-48d7-9c09-34ea5cebb2ee)

## User

_Time: 2025-09-03T21:36:00.075Z_

in Docker's `.env` file I have a bunch of stuff like this:

```

# CodeServer
CODESERVER_HOSTNAME="code-server"
CODESERVER_PORT=8080
CODESERVER_FQDN="$CODESERVER_HOSTNAME.$DOMAIN"
CODESERVER_INTERNAL_URL="http://$CODESERVER_HOSTNAME:$CODESERVER_PORT"
CODESERVER_URL="https://$CODESERVER_FQDN"
CODESERVER_HOST="$CODESERVER_URL"
CODESERVER_PASSWORD="ubuntu"
CODESERVER_HASHED_PASSWORD="$$argon2i$$v=19$$m=4096,t=3,p=1$$ZGExYzU1ZTM$$0cIquqfknAELqW3qcsaPIsrg3p2IPxf37oYwW0VCfbE"
CODESERVER_SUDO_PASSWORD="$SUDO_PASSWORD"
CODESERVER_SUDO_PASSWORD_HASH="$$argon2i$$v=19$$m=4096,t=3,p=1$$Y2Q3YjJiMDQ$$ImZvlpKUMevdK+Sq+3Wc9x5+Ygq0EZIvFyewfipRzTE"
CODESERVER_DEFAULT_WORKSPACE="/workspace"
```

I've heard there's a `secrets` syntax. However I'm using the variables above like this:

```

  code-server:
    # 🔹🔹 Code Server 🔹🔹
    image: lscr.io/linuxserver/code-server:latest
    container_name: code-server
    hostname: code-server
    extra_hosts:
      - host.docker.internal:host-gateway
    networks:
      - publicnet
    expose:
      - 8443
    volumes:
      - ${CONFIG_PATH:-./configs}/code-server/dev/config:/config  # Contains all relevant configuration files.
      - ${CONFIG_PATH:-./configs}/code-server/dev/workspace:/workspace
      - /config/.ssh/id_rsa.pub:/config/.ssh/id_rsa.pub:ro
      - ${ROOT_PATH:-.}:/workspace
    # You can set any environment variable from a file by using a special prepend FILE__.
    # As an example:
    # FILE__MYVAR="/run/secrets/mysecretvariable"
    # Will set the environment variable `MYVAR` based on the contents of the `/run/secrets/mysecretvariable` file.
    #user: 1000:1000  # run as non-root (see docs: https://docs.linuxserver.io/misc/non-root/)
    environment:
      TZ: ${TZ:-America/Chicago}
      UMASK: ${UMASK:-002}
      #PASSWORD: $CODESERVER_PASSWORD                                           # Optional web gui password, if PASSWORD or HASHED_PASSWORD is not provided, there will be no auth.
      #SUDO_PASSWORD: ${CODESERVER_SUDO_PASSWORD:-}                              # Plain-text sudo password if you'd like this code-server instance to be able to run commands as root.
      HASHED_PASSWORD: ${CODESERVER_HASHED_PASSWORD:-}                           # Same as above but hashed, create with `echo -n "thisismypassword" | argon2 "$$(openssl rand -hex 4)" -e`
      SUDO_PASSWORD_HASH: ${CODESERVER_SUDO_PASSWORD_HASH:-}                     # Same as above but hashed, create with `echo -n "thisismypassword" | argon2 "$$(openssl rand -hex 4)" -e`
      PWA_APPNAME: ${CODESERVER_PWA_APPNAME:-code-server.$TS_HOSTNAME.$DOMAIN}  # If this optional variable is set, the PWA app will the specified name.
      DEFAULT_WORKSPACE: ${CODESERVER_DEFAULT_WORKSPACE:-/workspace}            # If this optional variable is set, code-server will open this directory by default
    labels:
      traefik.enable: true
      traefik.http.routers.code-server.rule: Host(`code-server.$DOMAIN`) || Host(`code-server.$TS_HOSTNAME.$DOMAIN`)
      traefik.http.routers.code-server.middlewares: nginx-auth@file
      traefik.http.services.code-server.loadbalancer.server.port: 8443
      # Homepage definitions for code-server
      homepage.group: Infrastructure
      homepage.name: Code Dev
      homepage.icon: code-server.png
      homepage.href: https://code-server.$DOMAIN/
      homepage.description: In-browser VS Code environment for editing and managing code on this server
      kuma.code-server.http.name: code-server.$TS_HOSTNAME.$DOMAIN
      kuma.code-server.http.url: https://code-server.$DOMAIN
      kuma.code-server.http.interval: 60
    cpu_shares: 10
    mem_reservation: 200M
    deploy:
      resources:
        reservations:
          cpus: 0.15
          memory: 200M
        limits:
          cpus: 2
          memory: 4G
    restart: always
```

Is there a way to use the above docker-compose.yaml syntax with $variable_name_here like i am above in docker with secrets instead of .env?

## Assistant

_Time: 2025-09-03T21:40:35.048Z_

Docker secrets came about to handle sensitive data that shouldn't sit in plain .env files or get baked into images, unlike older approaches where you'd just dump everything into .env (risking exposure via git leaks, host access, or docker inspect). They mount as read-only files in /run/secrets/ at container runtime, so you avoid passing plaintext via compose interpolation or env vars that show up in process lists.

You can't keep the exact ${VAR} syntax in your compose file while switching to secrets, since that pulls from .env at compose-up time—secrets aren't available then. What you can do, given your linuxserver/code-server image supports FILE__ prefixes for loading env from files (as noted in your comments), is define secrets for the sensitive ones like passwords, mount them, and point FILE__ at the mounted paths. This keeps non-secrets in .env for interpolation if needed, but shifts secrets out.

Add a top-level secrets section in docker-compose.yaml:

```
secrets:
  codeserver_hashed_password:
    file: ./path/to/hashed_password.txt  # Or external: true if using swarm/managed secrets
  codeserver_sudo_password_hash:
    file: ./path/to/sudo_hash.txt
```

In your code-server service, add:

```
secrets:
  - codeserver_hashed_password
  - codeserver_sudo_password_hash
```

Then swap the environment lines:

```
environment:
  # Drop the old hashed lines
  FILE__HASHED_PASSWORD: /run/secrets/codeserver_hashed_password
  FILE__SUDO_PASSWORD_HASH: /run/secrets/codeserver_sudo_password_hash
  # Keep non-secrets as-is
```

The image will read those files and set the actual env vars inside the container. If you need plain passwords too (though hashed is safer), define separate secrets for them and use FILE__PASSWORD, etc. For non-swarm setups, this is straightforward but not encrypted—use swarm for that. If your setup doesn't need runtime secrecy (e.g., solo dev), sticking with .env might not be worth the switch unless you're prepping for prod. If you want something better than this without FILE__ support, you'd need a custom entrypoint to cat the secrets into env vars on start, but that's more overhead.

## User

_Time: 2025-09-03T23:51:36.007Z_

what if i want all secrets flat in a singular file, similar to .env?

## Assistant

_Time: 2025-09-03T23:51:53.285Z_

If you want all secrets in a single file like .env but using Docker secrets, you're stuck with a problem: Docker secrets don't work that way natively. Each secret is a separate file mounted at /run/secrets/secret_name, and Docker doesn't parse a single file into multiple env vars like .env. The linuxserver/code-server image's FILE__ prefix helps, but you still need individual secret files for each variable unless you hack around it.

One workaround is to use a single secret file with key-value pairs (like .env) and a custom entrypoint script to parse it into env vars at container startup. Here's how you could do it compared to your current .env setup:

1. **Create a single secrets file** (e.g., `secrets.txt`):
   ```
   CODESERVER_HASHED_PASSWORD=$$argon2i$$v=19$$m=4096,t=3,p=1$$ZGExYzU1ZTM$$0cIquqfknAELqW3qcsaPIsrg3p2IPxf37oYwW0VCfbE
   CODESERVER_SUDO_PASSWORD_HASH=$$argon2i$$v=19$$m=4096,t=3,p=1$$Y2Q3YjJiMDQ$$ImZvlpKUMevdK+Sq+3Wc9x5+Ygq0EZIvFyewfipRzTE
   ```

2. **Define it as a secret** in docker-compose.yaml:
   ```yaml
   secrets:
     app_secrets:
       file: ./path/to/secrets.txt
   ```

3. **Mount it in your service**:
   ```yaml
   services:
     code-server:
       secrets:
         - app_secrets
   ```

4. **Custom entrypoint** to parse the file:
   Since linuxserver/code-server doesn't natively parse a single key-value file into multiple env vars, add an entrypoint script (e.g., `entrypoint.sh`):
   ```bash
   #!/bin/bash
   while IFS='=' read -r key value; do
     export "$key=$value"
   done < /run/secrets/app_secrets
   exec "$@"
   ```
   Mount it and set it:
   ```yaml
   volumes:
     - ./entrypoint.sh:/entrypoint.sh:ro
   entrypoint: /entrypoint.sh
   ```

5. **Update environment**:
   ```yaml
   environment:
     TZ: ${TZ:-America/Chicago}
     UMASK: ${UMASK:-002}
     PWA_APPNAME: ${CODESERVER_PWA_APPNAME:-code-server.$TS_HOSTNAME.$DOMAIN}
     DEFAULT_WORKSPACE: ${CODESERVER_DEFAULT_WORKSPACE:-/workspace}
   ```
   The script sets HASHED_PASSWORD and SUDO_PASSWORD_HASH from the secrets file, so you drop them from the environment block.

**Why this vs .env?**
- .env is parsed by Docker Compose at startup, exposing vars to the host and docker inspect. Secrets are mounted read-only in the container, hidden from the host.
- Your current .env setup is simpler for non-sensitive vars (like ports, hostnames) and works without extra scripting. This single-file secrets approach needs the entrypoint hack, adding complexity.
- If the image doesn't need FILE__ or specific env vars, this method lets you mimic .env while keeping sensitive data out of compose interpolation.

**Is it worth it?**
If you're solo and not exposing the host to others, .env is fine and less hassle. This setup only shines in multi-user or prod environments where host security matters. If you want something objectively better, use a secrets manager like HashiCorp Vault, but that's overkill for most unless you're scaling to multiple containers or need centralized secret management.
