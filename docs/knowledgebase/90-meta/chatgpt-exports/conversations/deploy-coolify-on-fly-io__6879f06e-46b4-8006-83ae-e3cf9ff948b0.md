---
source_url: "https://chatgpt.com/c/6879f06e-46b4-8006-83ae-e3cf9ff948b0"
conversation_id: "6879f06e-46b4-8006-83ae-e3cf9ff948b0"
title: "Deploy Coolify on Fly.io"
extracted_at: "2026-06-29T16:18:42.914Z"
message_count: 6
provenance: auth-ui
---

# Deploy Coolify on Fly.io

Source: [ChatGPT conversation](https://chatgpt.com/c/6879f06e-46b4-8006-83ae-e3cf9ff948b0)

## Assistant

Got it! The problem is that the whole command you put in app is being passed as the argument to docker-entrypoint.sh, instead of being run as a shell command first.

The line:

TOML

gets translated to:

Bash

which is not what you want.

How to fix?

You want the container to run the shell command /bin/sh -c 'chown -R 999:999 /data && exec docker-entrypoint.sh postgres' directly, not pass it to docker-entrypoint.sh.

Correct [processes] entry in fly.toml:
TOML
Explanation

You run the chown to fix permissions

Then you exec postgres to start PostgreSQL directly (which will internally use the default entrypoint of the image)

Alternative (if you want to keep docker-entrypoint.sh)
TOML

but make sure your build config doesn't override the ENTRYPOINT and CMD because Fly will run [processes].app directly as command, ignoring the ENTRYPOINT.

Recap:

Change the [processes] section exactly to:

TOML

Make sure your mount is at /data (as you already have)

Make sure PGDATA environment is set to /data/pgdata (since postgres wants that directory writable)

Deploy again with fly deploy -a coolify-db

If you want, I can help you rewrite the entire fly.toml for this setup — just ask!

## User

Here are the results of your changes, fix it continuing where we left off:

2025-07-18T08:57:41Z runner[178101eb217038] ord [info]Machine started in 1.154s
2025-07-18T08:57:41Z app[178101eb217038] ord [info]mkdir: can't create directory '/data/pgdata': Permission denied
2025-07-18T08:57:41Z app[178101eb217038] ord [info]2025/07/18 08:57:41 INFO SSH listening listen_address=[fdaa:18:59b2:a7b:e824:2019:3dca:2]:22
2025-07-18T08:57:42Z app[178101eb217038] ord [info] INFO Main child exited normally with code: 1
2025-07-18T08:57:42Z app[178101eb217038] ord [info] INFO Starting clean up.
2025-07-18T08:57:42Z app[178101eb217038] ord [info] INFO Umounting /dev/vdc from /data
2025-07-18T08:57:42Z app[178101eb217038] ord [info] WARN could not unmount /rootfs: EINVAL: Invalid argument
2025-07-18T08:57:42Z app[178101eb217038] ord [info][    1.941525] reboot: Restarting system
2025-07-18T08:59:18Z app[178101eb217038] ord [info]2025-07-18T08:59:18.819239653 [01K0EC46ZV2D5TBWHFSQCSMDG4:main] Running Firecracker v1.7.0
2025-07-18T08:59:19Z app[178101eb217038] ord [info] INFO Starting init (commit: 6c3309ba)...
2025-07-18T08:59:19Z app[178101eb217038] ord [info] INFO Checking filesystem on /data
2025-07-18T08:59:19Z app[178101eb217038] ord [info]/dev/vdc: clean, 12/327680 files, 42071/1308672 blocks
2025-07-18T08:59:19Z app[178101eb217038] ord [info] INFO Mounting /dev/vdc at /data w/ uid: 0, gid: 0 and chmod 0755
2025-07-18T08:59:19Z app[178101eb217038] ord [info] INFO Resized /data to 5360320512 bytes
2025-07-18T08:59:19Z app[178101eb217038] ord [info] INFO Preparing to run: `docker-entrypoint.sh /bin/sh -c chown -R 999:999 /data && exec postgres` as root
2025-07-18T08:59:19Z app[178101eb217038] ord [info] INFO [fly api proxy] listening at /.fly/api
2025-07-18T08:59:19Z runner[178101eb217038] ord [info]Machine started in 1.193s
2025-07-18T08:59:19Z app[178101eb217038] ord [info]"root" execution of the PostgreSQL server is not permitted.
2025-07-18T08:59:19Z app[178101eb217038] ord [info]The server must be started under an unprivileged user ID to prevent
2025-07-18T08:59:19Z app[178101eb217038] ord [info]possible system security compromise.  See the documentation for
2025-07-18T08:59:19Z app[178101eb217038] ord [info]more information on how to properly start the server.
2025-07-18T08:59:20Z app[178101eb217038] ord [info]2025/07/18 08:59:20 INFO SSH listening listen_address=[fdaa:18:59b2:a7b:e824:2019:3dca:2]:22
2025-07-18T08:59:20Z app[178101eb217038] ord [info] INFO Main child exited normally with code: 1
2025-07-18T08:59:20Z app[178101eb217038] ord [info] INFO Starting clean up.
2025-07-18T08:59:20Z app[178101eb217038] ord [info] INFO Umounting /dev/vdc from /data
2025-07-18T08:59:20Z app[178101eb217038] ord [info] WARN could not unmount /rootfs: EINVAL: Invalid argument
2025-07-18T08:59:20Z app[178101eb217038] ord [info][    1.941320] reboot: Restarting system
Show more

## Assistant

Alright, new error is:

What’s going on?

Your container tries to start Postgres as root user, which Postgres doesn’t allow.

You tried to fix permissions using chown -R 999:999 /data, but then ran exec postgres as root.

You need to switch user to the postgres user after fixing permissions.

How to fix?

You have to:

Fix ownership of /data as root.

Drop privileges and run postgres as the postgres user (UID 999).

Recommended fly.toml fix for [processes]:
TOML

or, if your image does not have su-exec (like some official Postgres images), use gosu or runuser:

If gosu is available:

TOML

If runuser is available:

TOML
What is su-exec or gosu?

They are small tools to switch user and execute a command (like sudo but simpler and designed for containers).

Most official Postgres Docker images include gosu.

Additional notes:

Make sure your container image has gosu or su-exec. If not, you can add it in Dockerfile:

Dockerfile

or

Dockerfile
Summary

Try this first (assuming gosu exists in your image):

TOML

If you want, I can help check your Dockerfile or suggest full deployment configs!

## User

web search the correct gosu/su-exec whatever nonsense with the specific image 'postgres:15-alpine

## User

2025-07-18T08:57:41Z runner[178101eb217038] ord [info]Machine started in 1.154s
2025-07-18T08:57:41Z app[178101eb217038] ord [info]mkdir: can't create directory '/data/pgdata': Permission denied
2025-07-18T08:57:41Z app[178101eb217038] ord [info]2025/07/18 08:57:41 INFO SSH listening listen_address=[fdaa:18:59b2:a7b:e824:2019:3dca:2]:22
2025-07-18T08:57:42Z app[178101eb217038] ord [info] INFO Main child exited normally with code: 1
2025-07-18T08:57:42Z app[178101eb217038] ord [info] INFO Starting clean up.
2025-07-18T08:57:42Z app[178101eb217038] ord [info] INFO Umounting /dev/vdc from /data
2025-07-18T08:57:42Z app[178101eb217038] ord [info] WARN could not unmount /rootfs: EINVAL: Invalid argument
2025-07-18T08:57:42Z app[178101eb217038] ord [info][    1.941525] reboot: Restarting system
2025-07-18T08:59:18Z app[178101eb217038] ord [info]2025-07-18T08:59:18.819239653 [01K0EC46ZV2D5TBWHFSQCSMDG4:main] Running Firecracker v1.7.0
2025-07-18T08:59:19Z app[178101eb217038] ord [info] INFO Starting init (commit: 6c3309ba)...
2025-07-18T08:59:19Z app[178101eb217038] ord [info] INFO Checking filesystem on /data
2025-07-18T08:59:19Z app[178101eb217038] ord [info]/dev/vdc: clean, 12/327680 files, 42071/1308672 blocks
2025-07-18T08:59:19Z app[178101eb217038] ord [info] INFO Mounting /dev/vdc at /data w/ uid: 0, gid: 0 and chmod 0755
2025-07-18T08:59:19Z app[178101eb217038] ord [info] INFO Resized /data to 5360320512 bytes
2025-07-18T08:59:19Z app[178101eb217038] ord [info] INFO Preparing to run: `docker-entrypoint.sh /bin/sh -c chown -R 999:999 /data && exec postgres` as root
2025-07-18T08:59:19Z app[178101eb217038] ord [info] INFO [fly api proxy] listening at /.fly/api
2025-07-18T08:59:19Z runner[178101eb217038] ord [info]Machine started in 1.193s
2025-07-18T08:59:19Z app[178101eb217038] ord [info]"root" execution of the PostgreSQL server is not permitted.
2025-07-18T08:59:19Z app[178101eb217038] ord [info]The server must be started under an unprivileged user ID to prevent
2025-07-18T08:59:19Z app[178101eb217038] ord [info]possible system security compromise.  See the documentation for
2025-07-18T08:59:19Z app[178101eb217038] ord [info]more information on how to properly start the server.
2025-07-18T08:59:20Z app[178101eb217038] ord [info]2025/07/18 08:59:20 INFO SSH listening listen_address=[fdaa:18:59b2:a7b:e824:2019:3dca:2]:22
2025-07-18T08:59:20Z app[178101eb217038] ord [info] INFO Main child exited normally with code: 1
2025-07-18T08:59:20Z app[178101eb217038] ord [info] INFO Starting clean up.
2025-07-18T08:59:20Z app[178101eb217038] ord [info] INFO Umounting /dev/vdc from /data
2025-07-18T08:59:20Z app[178101eb217038] ord [info] WARN could not unmount /rootfs: EINVAL: Invalid argument
2025-07-18T08:59:20Z app[178101eb217038] ord [info][    1.941320] reboot: Restarting system


please fix correctly for postgres:15-alpine

fly.toml:

# fly.toml app configuration file generated for coolify-db on 2025-07-18T07:07:04Z
#
# See https://fly.io/docs/reference/configuration/ for information about how to use this file.
#

app = 'coolify-db'
primary_region = 'ord'

[env]
  POSTGRES_DB = "coolify"
  POSTGRES_USER = "coolify"
  POSTGRES_PASSWORD = "coolifypassword"
  PGDATA = "/data/pgdata"

[mounts]
  source = "pg_data"
  destination = "/data"

[processes]
  app = "/bin/sh -c 'chown -R 999:999 /data && exec postgres'"


[build]
  image = 'postgres:15-alpine'

[[services]]
  internal_port = 5432
  protocol = "tcp"
  processes = ["app"]

  [[services.ports]]
    port = 5432
    handlers = []  # internal only

[[vm]]
  memory = '1gb'
  cpu_kind = 'shared'
  cpus = 1
Show more

## Assistant

Thanks for the details! Let’s fix this properly for postgres:15-alpine.

Core issues:

Postgres refuses to run as root.

You're currently running chown -R 999:999 /data && exec postgres as root, so postgres is still running as root, causing the error.

You need to switch to the postgres user (UID 999) before starting postgres.

Alpine images don’t come with gosu installed by default.

The official Postgres 15-alpine image uses docker-entrypoint.sh which already does user switching if run properly.

Recommended fix:

The official postgres image expects you to run the container as root, but the entrypoint script switches to user postgres internally if you run docker-entrypoint.sh postgres.

So do not run exec postgres directly, instead run:

Bash

The entrypoint script will:

initialize PGDATA ownership correctly,

switch to the right user,

start postgres safely.

Updated [processes] section for fly.toml:
TOML
Explanation:

chown -R 999:999 /data makes sure /data is owned by user postgres (UID 999).

exec docker-entrypoint.sh postgres runs the official entrypoint script which handles the user switching.

The entrypoint script will switch from root to postgres user internally and start Postgres properly.

Bonus: make sure your mount /data has correct permissions on host side

If you keep getting permission denied on /data/pgdata, check that your Fly volume pg_data is accessible and writable by UID 999.

Summary:

Replace your [processes] to:

TOML

Leave the rest of your config as is.

If the error persists, I can help with a Dockerfile or Fly volume permissions check!
