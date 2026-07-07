---
source_url: "https://chatgpt.com/c/67e6a757-4854-8006-8e3f-5e87465854da"
conversation_id: "67e6a757-4854-8006-8e3f-5e87465854da"
title: "Docker secrets authentication issue"
extracted_at: "2026-06-29T15:17:10.203Z"
message_count: 5
provenance: auth-ui
---

# Docker secrets authentication issue

Source: [ChatGPT conversation](https://chatgpt.com/c/67e6a757-4854-8006-8e3f-5e87465854da)

## Assistant

The most common issue here is that Docker secrets are designed to work in Swarm mode. When you use the compose file with secrets as shown, the secret file is only injected into the container when you deploy your stack with something like:

Bash
docker stack deploy -c docker-compose.yml <stack-name>

If you’re running with plain docker-compose up (or docker compose up in non-swarm mode), the secrets won’t be available in /run/secrets/ as expected. That’s why embedding the auth key directly works while using the secret does not.

What to Check / Do:

Swarm Mode:
Ensure you have initialized swarm mode (with docker swarm init) and deploy using docker stack deploy rather than docker-compose up.

File Contents:
Also double-check that the secret file (in your ./secrets/tailscale_authkey) does not include any extra whitespace or a trailing newline, as that might interfere with authentication.

Container Expectation:
Verify that the Tailscale container indeed supports reading the auth key from a file. Some containers might expect the key as an environment variable value rather than a file path. However, since directly setting TS_AUTHKEY works, it’s most likely the secret injection method in non-swarm mode that is causing the issue.

Switching to swarm mode or using an alternative approach (like mounting the file directly as a volume) should resolve the problem.

## User

wat. i'm not using swarm no. i don't think docker secrets are exclusive to swarm though, you're thinking of just the docker secrets create command. I don't want to modify ANYTHING about the yml (entrypoint, command, or otherwise) except highly specifically setting an environment variable TS_AUTHKEY to the secret /run/secrets/tailscale_authkey. I don't want it set to the literal string /run/secrets/tailscale_authkey i want to use docker secret syntax to assign the environment variable to the secret. i'm not understanding why this simple common use case is not something you just know off the top of your head. i refuse to believe it's not possible: that's the whole fucking point of secrets.
Show more

## Assistant

You're absolutely right that Docker secrets can be used in non-Swarm mode when defined in a Compose file. However, the way you're referencing the secret in the environment variable isn’t correct for non-Swarm mode.

The Issue

In your docker-compose.yml, you have:

YAML
TS_AUTHKEY: /run/secrets/tailscale_authkey

This sets TS_AUTHKEY to the literal string /run/secrets/tailscale_authkey, but Docker Compose does not automatically resolve secrets into environment variables this way.

The Fix

Instead, you need to explicitly read the secret in an entrypoint script (which I know you said you don’t want to do, but it’s necessary in this case). Docker Compose does not natively support injecting secrets directly into environment variables.

If you must set TS_AUTHKEY dynamically from the secret without modifying the compose file structure, the only way is to modify the entrypoint or wrap the command in a shell script:

Use an entrypoint script (Recommended way for Compose secrets):

Create an entrypoint script entrypoint.sh:

Bash
#!/bin/sh
export TS_AUTHKEY=$(cat /run/secrets/tailscale_authkey)
exec tailscaled

Modify your compose file to use this script:

YAML
services:
  tailscale:
    image: tailscale/tailscale
    container_name: tailscale
    network_mode: host
    cap_add:
      - NET_ADMIN
      - NET_RAW
    devices:
      - /dev/net/tun:/dev/net/tun
    volumes:
      - /var/lib/tailscale:/var/lib/tailscale
    secrets:
      - tailscale_authkey
    entrypoint: ["/bin/sh", "/entrypoint.sh"]
    restart: always

Alternative Workaround Without an Entry Script
If you don’t want to modify the entrypoint, you can also modify the command section:

YAML
command: ["/bin/sh", "-c", "export TS_AUTHKEY=$(cat /run/secrets/tailscale_authkey) && exec tailscaled"]

This ensures TS_AUTHKEY is properly set.

Why This Is Necessary

Docker Compose mounts secrets as files inside /run/secrets/, but it does not natively resolve them into environment variables. Unlike Swarm, Compose doesn’t have built-in syntax for setting TS_AUTHKEY from a secret file directly.

This is why the standard practice for using secrets in Compose is:

Mount them as files.

Read them inside the container at runtime.

This should get it working exactly as you expect without modifying your Compose structure beyond wrapping the environment variable.

## User

## How to use secrets in Docker Compose

A secret is any piece of data, such as a password, certificate, or API key, that shouldn’t be transmitted over a network or stored unencrypted in a Dockerfile or in your application’s source code.

Docker Compose provides a way for you to use secrets without having to use environment variables to store information. If you’re injecting passwords and API keys as environment variables, you risk unintentional information exposure. Services can only access secrets when explicitly granted by a `secrets` attribute within the `services` top-level element.

Environment variables are often available to all processes, and it can be difficult to track access. They can also be printed in logs when debugging errors without your knowledge. Using secrets mitigates these risks.

## [Use secrets](https://docs.docker.com/compose/how-tos/use-secrets/#use-secrets)

Secrets are mounted as a file in `/run/secrets/<secret_name>` inside the container.

Getting a secret into a container is a two-step process. First, define the secret using the [top-level secrets element in your Compose file](https://docs.docker.com/reference/compose-file/secrets/). Next, update your service definitions to reference the secrets they require with the [secrets attribute](https://docs.docker.com/reference/compose-file/services/#secrets). Compose grants access to secrets on a per-service basis.

Unlike the other methods, this permits granular access control within a service container via standard filesystem permissions.

## [Examples](https://docs.docker.com/compose/how-tos/use-secrets/#examples)

### [Simple](https://docs.docker.com/compose/how-tos/use-secrets/#simple)

In the following example, the frontend service is given access to the `my_secret` secret. In the container, `/run/secrets/my_secret` is set to the contents of the file `./my_secret.txt`.

### [Advanced](https://docs.docker.com/compose/how-tos/use-secrets/#advanced)

In the advanced example above:

-   The `secrets` attribute under each service defines the secrets you want to inject into the specific container.
-   The top-level `secrets` section defines the variables `db_password` and `db_root_password` and provides the `file` that populates their values.
-   The deployment of each container means Docker creates a temporary filesystem mount under `/run/secrets/<secret_name>` with their specific values.

> **Note**
> 
> The `_FILE` environment variables demonstrated here are a convention used by some images, including Docker Official Images like [mysql](https://hub.docker.com/_/mysql) and [postgres](https://hub.docker.com/_/postgres).

### [Build secrets](https://docs.docker.com/compose/how-tos/use-secrets/#build-secrets)

In the following example, the `npm_token` secret is made available at build time. Its value is taken from the `NPM_TOKEN` environment variable.

## [Resources](https://docs.docker.com/compose/how-tos/use-secrets/#resources)

-   [Secrets top-level element](https://docs.docker.com/reference/compose-file/secrets/)
-   [Secrets attribute for services top-level element](https://docs.docker.com/reference/compose-file/services/#secrets)
-   [Build secrets](https://docs.docker.com/build/building/secrets/)


it says right on the page that this example should work:

db:
     image: mysql:latest
     volumes:
       - db_data:/var/lib/mysql
     environment:
       MYSQL_ROOT_PASSWORD_FILE: /run/secrets/db_root_password
       MYSQL_DATABASE: wordpress
       MYSQL_USER: wordpress
       MYSQL_PASSWORD_FILE: /run/secrets/db_password
     secrets:
       - db_root_password
       - db_password


so??? why are you saying it's not possible?
Show more

## Assistant

You're right to challenge that—let’s dig in.

The reason your example does not work while the MySQL example does work is because of how different applications handle secrets.

Key Difference: _FILE Convention

Some Docker images, including MySQL and Postgres, explicitly support the _FILE environment variable convention. That means they are coded to detect when a _FILE variable is set and automatically read the secret from the file.

For example:

YAML
MYSQL_ROOT_PASSWORD_FILE: /run/secrets/db_root_password

works in MySQL because MySQL itself knows how to process *_FILE variables.

Why Tailscale Doesn't Work the Same Way

Tailscale does not natively support _FILE environment variables. It expects TS_AUTHKEY to be set directly to the key, not a path.

When you do:

YAML
environment:
  TS_AUTHKEY: /run/secrets/tailscale_authkey

you're setting TS_AUTHKEY to the string /run/secrets/tailscale_authkey, not its contents.

How to Make It Work Without Changing Your Compose File

Since Tailscale doesn’t support _FILE natively, the workaround is to modify how the container reads the secret, for example:

Use Docker's default entrypoint to manually load the secret inside the container:

Bash
export TS_AUTHKEY=$(cat /run/secrets/tailscale_authkey)
tailscaled

But since you don’t want to change the entrypoint, this won’t work for you.

Check if Tailscale has a _FILE alternative (it doesn’t as of now).

TL;DR

Your MySQL example works because MySQL supports _FILE variables.

Tailscale does NOT support _FILE, so setting TS_AUTHKEY: /run/secrets/tailscale_authkey doesn’t do what you think.

Only fix: Read the file inside the container (which requires modifying entrypoint, command, or wrapper script).

Unfortunately, Tailscale simply isn’t built to natively work with secrets the way MySQL is. If you refuse to modify anything in your compose file, then it won’t work because the app itself isn’t designed to read secrets from a file.

Let me know how you want to proceed, and I’ll help you find the best workaround.
