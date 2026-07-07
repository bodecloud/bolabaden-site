---
source_url: "https://chatgpt.com/c/6877146a-d830-8006-97b2-764053ffd5b2"
conversation_id: "6877146a-d830-8006-97b2-764053ffd5b2"
title: "Inline config in Docker Compose"
extracted_at: "2026-06-29T16:21:43.364Z"
message_count: 2
provenance: auth-ui
---

# Inline config in Docker Compose

Source: [ChatGPT conversation](https://chatgpt.com/c/6877146a-d830-8006-97b2-764053ffd5b2)

## User

services:

  prowlarr:
    # 🔹🔹 Prowlarr 🔹🔹
    image: linuxserver/prowlarr
    container_name: prowlarr
    hostname: prowlarr
    networks:
      - publicnet
    configs:
      - source: prowlarr_indexer_proxy_json
        target: /config/prowlarr_indexer_proxy.json
        mode: 0777
      - source: prowlarr_indexers_json
        target: /config/prowlarr-indexers.json
        mode: 0777
      - source:
          content: |
            <Config>
            <BindAddress>*</BindAddress>
            <Port>9696</Port>
            <SslPort>6969</SslPort>
            <EnableSsl>False</EnableSsl>
            <LaunchBrowser>True</LaunchBrowser>
            <ApiKey>$PROWLARR_API_KEY</ApiKey>
            <AuthenticationMethod>External</AuthenticationMethod>
            <AuthenticationRequired>DisabledForLocalAddresses</AuthenticationRequired>
            <Branch>master</Branch>
            <LogLevel>info</LogLevel>
            <SslCertPath></SslCertPath>
            <SslCertPassword></SslCertPassword>
            <UrlBase></UrlBase>
            <InstanceName>Prowlarr</InstanceName>
            <UpdateMechanism>Docker</UpdateMechanism>
            <AnalyticsEnabled>False</AnalyticsEnabled>
            <PostgresUser>$PROWLARR__POSTGRES_USER</PostgresUser>
            <PostgresPassword>$PROWLARR__POSTGRES_PASSWORD</PostgresPassword>
            <PostgresPort>$PROWLARR__POSTGRES_PORT</PostgresPort>
            <PostgresHost>$PROWLARR__POSTGRES_HOST</PostgresHost>
            <PostgresMainDb>$PROWLARR__POSTGRES_MAIN_DB</PostgresMainDb>
            <PostgresLogDb>$PROWLARR__POSTGRES_LOG_DB</PostgresLogDb>
          </Config>
        target: /config/config.xml
        mode: 0777


in docker compose is it possible to embed the content of a file like i'm doing with prowlarr_config.xml? I know my syntax is wrong, but i'm almost certain it's possible. I don't want to use configs: because it requires me to define the configs globally in another part of the file.
Show more

## Assistant

You're right in thinking that Docker Compose does allow embedding file content directly — but not the way you're attempting with configs:. The configs: key is specifically for use with Docker Swarm, and it requires you to define those configs globally at the top level of the Compose file (which you're trying to avoid).

To embed file content directly into a container at runtime in regular Docker Compose (non-Swarm), you have two main options, but you cannot use configs: this way.

✅ Recommended Alternative (Using a bind mount with a relative/inline file):

Instead of using configs: improperly, you can create the config.xml as a file on disk and then mount it like this:

YAML
services:
  prowlarr:
    image: linuxserver/prowlarr
    container_name: prowlarr
    volumes:
      - ./prowlarr-config.xml:/config/config.xml:ro

Then create prowlarr-config.xml in the same folder as your docker-compose.yml:

XML
<Config>
  <BindAddress>*</BindAddress>
  <Port>9696</Port>
  ...
</Config>

This is the cleanest and most compatible way to do what you want without needing global configs: definitions.

❌ Not Possible: Inline config in configs like you're doing

You tried:

YAML
configs:
  - source:
      content: |
        <Config>...</Config>
    target: /config/config.xml

This won't work because:

The source: key inside a list of configs: is not valid unless referencing a globally defined config.

You can't provide content: inline in Compose like this unless you're using Docker Swarm and defining the config in the top-level configs: section.

🛠 Workaround: Generate config file via command: or entrypoint:

If you really must embed the file content inline in docker-compose.yml, and want to avoid external files, you could write it to a file using an entrypoint script like:

YAML
services:
  prowlarr:
    image: linuxserver/prowlarr
    container_name: prowlarr
    entrypoint: /bin/sh -c "echo \"$CONFIG_XML\" > /config/config.xml && /init"
    environment:
      CONFIG_XML: |
        <Config>
          <BindAddress>*</BindAddress>
          <Port>9696</Port>
          ...
        </Config>

Be careful with multiline ENV variables and escaping here — it's messy and fragile.

✅ Best Practice

Stick to volume mounts with external files for this kind of task unless you're using Swarm. It’s more readable, manageable, and less error-prone.

Let me know if you’d like a snippet that creates the config file from within entrypoint or command, or help generating the file from a template.
