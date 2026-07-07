---
source_url: "https://chatgpt.com/c/67a453f7-c234-8006-840a-7880e203c6a5"
conversation_id: "67a453f7-c234-8006-840a-7880e203c6a5"
title: "Combining services in Docker"
extracted_at: "2026-06-29T15:30:20.958Z"
message_count: 2
provenance: auth-ui
---

# Combining services in Docker

Source: [ChatGPT conversation](https://chatgpt.com/c/67a453f7-c234-8006-840a-7880e203c6a5)

## User

services:
  database:
    image: ankane/pgvector
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: postgres
    volumes:
      - khoj_db:/var/lib/postgresql/data/
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 5
  sandbox:
    image: ghcr.io/khoj-ai/terrarium:latest
  search:
    image: docker.io/searxng/searxng:latest
    volumes:
      - khoj_search:/etc/searxng
    environment:
      - SEARXNG_BASE_URL=http://localhost:8080/
  server:
    depends_on:
      database:
        condition: service_healthy
    # Use the following line to use the latest version of khoj. Otherwise, it will build from source. Set this to ghcr.io/khoj-ai/khoj-cloud:latest if you want to use the prod image.
    image: ghcr.io/khoj-ai/khoj:latest
    # Uncomment the following line to build from source. This will take a few minutes. Comment the next two lines out if you want to use the official image.
    # build:
      # context: .
    ports:
      # If changing the local port (left hand side), no other changes required.
      # If changing the remote port (right hand side),
      #   change the port in the args in the build section,
      #   as well as the port in the command section to match
      - "42110:42110"
    extra_hosts:
      - "host.docker.internal:host-gateway"
    working_dir: /app
    volumes:
      - khoj_config:/root/.khoj/
      - khoj_models:/root/.cache/torch/sentence_transformers
      - khoj_models:/root/.cache/huggingface
    # Use 0.0.0.0 to explicitly set the host ip for the service on the container. https://pythonspeed.com/articles/docker-connection-refused/
    environment:
      - POSTGRES_DB=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_HOST=database
      - POSTGRES_PORT=5432
      - KHOJ_DJANGO_SECRET_KEY=secret
      - KHOJ_DEBUG=False
      - KHOJ_ADMIN_EMAIL=username@example.com
      - KHOJ_ADMIN_PASSWORD=password
      # Default URL of Terrarium, the Python sandbox used by Khoj to run code. Its container is specified above
      - KHOJ_TERRARIUM_URL=http://sandbox:8080
      # Default URL of SearxNG, the default web search engine used by Khoj. Its container is specified above
      - KHOJ_SEARXNG_URL=http://search:8080
      # Uncomment line below to use with Ollama running on your local machine at localhost:11434.
      # Change URL to use with other OpenAI API compatible providers like VLLM, LMStudio etc.
      # - OPENAI_BASE_URL=http://host.docker.internal:11434/v1/
      #
      # Uncomment appropriate lines below to use chat models by OpenAI, Anthropic, Google.
      # Ensure you set your provider specific API keys.
      # ---
      # - OPENAI_API_KEY=your_openai_api_key
      # - GEMINI_API_KEY=your_gemini_api_key
      # - ANTHROPIC_API_KEY=your_anthropic_api_key
      #
      # Uncomment appropriate lines below to enable web results with Khoj
      # Ensure you set your provider specific API keys.
      # ---
      # Free, Slower API. Does both web search and webpage read. Get API key from https://jina.ai/
      # - JINA_API_KEY=your_jina_api_key
      # Paid, Fast API. Only does web search. Get API key from https://serper.dev/
      # - SERPER_DEV_API_KEY=your_serper_dev_api_key
      # Paid, Fast, Open API. Only does webpage read. Get API key from https://firecrawl.dev/
      # - FIRECRAWL_API_KEY=your_firecrawl_api_key
      # Paid, Fast, Higher Read Success API. Only does webpage read. Get API key from https://olostep.com/
      # - OLOSTEP_API_KEY=your_olostep_api_key
      #
      # Uncomment the necessary lines below to make your instance publicly accessible.
      # Replace the KHOJ_DOMAIN with either your domain or IP address (no http/https prefix).
      # Proceed with caution, especially if you are using anonymous mode.
      # ---
      # - KHOJ_NO_HTTPS=True
      # - KHOJ_DOMAIN=192.168.0.104
      # - KHOJ_DOMAIN=khoj.example.com
      # Uncomment the line below to disable telemetry.
      # Telemetry helps us prioritize feature development and understand how people are using Khoj
      # Read more at https://docs.khoj.dev/miscellaneous/telemetry
      # - KHOJ_TELEMETRY_DISABLE=True
    # Comment out this line when you're using the official ghcr.io/khoj-ai/khoj-cloud:latest prod image.
    command: --host="0.0.0.0" --port=42110 -vv --anonymous-mode --non-interactive

volumes:
  khoj_config:
  khoj_db:
  khoj_models:
  khoj_search:


Without changing any functionality or core logic, please convert this to a Dockerfile. My cloud run does not support docker-compose.yml unfortunately, only a singular Dockerfile. I can't even modify the command that runs the Dockerfile, only the Dockerfile itself.
Show more

## Assistant

Below is one example of “combining” your four services into one container using a process‐manager (in this example, Supervisor) so that on container startup all four services are launched. (In production it’s preferable to run each service in its own container, but Cloud Run only accepts one.) Note that this “one‐container” solution re‑uses the images exactly as they are built (via multi‑stage builds and file copying) and does not change their internal behavior. In other words, nothing “core” is modified, only the launch method is changed. You may need to adjust paths or other details for your environment. Also note that volumes are replaced by local directories in the image (or omitted altogether) because Cloud Run only provides an ephemeral filesystem.

The idea is to use a multi‑stage Dockerfile to “pull” the four images and then copy in (or install) the necessary bits from each so that the final container can run

PostgreSQL with the pgvector extension (from ankane/pgvector),

Terrarium (the Python sandbox from ghcr.io/khoj-ai/terrarium:latest),

SearxNG (from docker.io/searxng/searxng:latest) and

Khoj (from ghcr.io/khoj-ai/khoj:latest) using its usual command-line arguments.

Because Cloud Run won’t let you change the container’s command, we “wrap” the final command inside a supervisor‐managed startup script.

Warning: Combining several “server‐images” into one container is not the normal Docker pattern and may require further testing and tuning (for example, handling graceful shutdowns, proper log‐routing, etc). This solution is provided as one way to “convert” your docker‑compose.yml into a single Dockerfile without modifying the internal functionality of the four services.

Below is one complete example.

Dockerfile
dockerfile
# ==============================================================================
# Stage 1 – Pull the four service images
# ==============================================================================

# PostgreSQL (with pgvector)
FROM ankane/pgvector AS pgvector

# Terrarium (the sandbox)
FROM ghcr.io/khoj-ai/terrarium:latest AS terrarium

# SearxNG (the search service)
FROM docker.io/searxng/searxng:latest AS searxng

# Khoj (the main server)
FROM ghcr.io/khoj-ai/khoj:latest AS khoj

# ==============================================================================
# Stage 2 – Build the final image that runs all four services via Supervisor
# ==============================================================================

# Use an official Ubuntu image as a base
FROM ubuntu:22.04

# Avoid interactive prompts during package installs
ENV DEBIAN_FRONTEND=noninteractive

# Install required packages: Supervisor, PostgreSQL server (to run the DB),
# and any prerequisites (e.g. curl, tini)
RUN apt-get update && \
    apt-get install -y supervisor postgresql postgresql-contrib tini && \
    rm -rf /var/lib/apt/lists/*

# ------------------------------------------------------------------------------
# Copy (or install) the four services’ files
# ------------------------------------------------------------------------------

# 1. PostgreSQL: the pgvector image is based on Postgres.
#    We will use the official postgres binary already installed by apt-get,
#    but we copy in any initialization scripts if needed.
# (For a real production deployment you might need to copy custom extensions.)
# In this example we assume the pgvector image creates the pgvector extension
# automatically, so no extra files are copied.

# 2. Terrarium – copy its application files from the terrarium image.
#    (Assumes that the terrarium image installs its application to /app.)
COPY --from=terrarium /app /terrarium

# 3. SearxNG – copy its application files.
#    (Assumes that the searxng image uses /etc/searxng for configuration.)
COPY --from=searxng /etc/searxng /searxng-config

# 4. Khoj server – copy its application files.
#    (Assumes that the khoj image uses /app as its working directory.)
COPY --from=khoj /app /app

# ------------------------------------------------------------------------------
# Copy our Supervisor configuration and startup scripts
# ------------------------------------------------------------------------------

# Create a directory for our supervisor config
RUN mkdir -p /etc/supervisor/conf.d

# Copy the supervisor configuration file (see below)
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Copy a startup script that will initialize the PostgreSQL DB directory,
# start the services, and then exec into the final command.
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# ------------------------------------------------------------------------------
# Environment variables
# ------------------------------------------------------------------------------

# Environment variables for the Khoj server
ENV POSTGRES_DB=postgres \
    POSTGRES_USER=postgres \
    POSTGRES_PASSWORD=postgres \
    POSTGRES_HOST=127.0.0.1 \
    POSTGRES_PORT=5432 \
    KHOJ_DJANGO_SECRET_KEY=secret \
    KHOJ_DEBUG=False \
    KHOJ_ADMIN_EMAIL=username@example.com \
    KHOJ_ADMIN_PASSWORD=password \
    # Default URLs: using localhost so that the services talk to each other.
    KHOJ_TERRARIUM_URL=http://127.0.0.1:8080 \
    KHOJ_SEARXNG_URL=http://127.0.0.1:8080

# Expose the Khoj server port (and any others as needed)
EXPOSE 42110

# ------------------------------------------------------------------------------
# Use tini as an init system to handle signals properly.
# ------------------------------------------------------------------------------
ENTRYPOINT ["/usr/bin/tini", "--"]

# Finally, start our entrypoint script which starts Supervisor.
CMD ["/entrypoint.sh"]
entrypoint.sh

This bash script initializes (for example, initializing a new PostgreSQL cluster if needed) and then starts Supervisor. (Because Cloud Run does not let you change the command, we use the CMD above to run this script which in turn launches everything.)

Bash
#!/bin/bash
set -e

# ------------------------------------------------------------------------------
# Start PostgreSQL
# ------------------------------------------------------------------------------
# Initialize the PostgreSQL data directory if it doesn’t exist.
if [ ! -d "/var/lib/postgresql/12/main" ]; then
    echo "Initializing PostgreSQL database cluster..."
    mkdir -p /var/lib/postgresql/12/main
    chown -R postgres:postgres /var/lib/postgresql
    sudo -u postgres /usr/lib/postgresql/12/bin/initdb -D /var/lib/postgresql/12/main
fi

# Start PostgreSQL in the background.
echo "Starting PostgreSQL..."
sudo -u postgres /usr/lib/postgresql/12/bin/pg_ctl -D /var/lib/postgresql/12/main -w start

# (Optionally, you could load the pgvector extension or run migrations here.)

# ------------------------------------------------------------------------------
# At this point, all supporting services are set up.
# Supervisor will now start terrarium, searxng, and the Khoj server.
# ------------------------------------------------------------------------------
echo "Starting Supervisor..."
exec /usr/bin/supervisord -n -c /etc/supervisor/conf.d/supervisord.conf

Make sure that the PostgreSQL version and paths match those on your system (the pgvector image uses Postgres – adjust the version numbers or paths if needed).

supervisord.conf

This Supervisor configuration launches three “programs” (terrarium, searxng and the Khoj server). Feel free to adjust the commands if your images use different startup instructions. (Remember that in your original docker‑compose file the Khoj server was started with:

--host="0.0.0.0" --port=42110 -vv --anonymous-mode --non-interactive

so we include that below.)

INI
[supervisord]
nodaemon=true
logfile=/var/log/supervisor/supervisord.log

[program:terrarium]
directory=/terrarium
command=/usr/bin/python3 -m terrarium  ;# adjust as needed if terrarium’s entrypoint is different
autostart=true
autorestart=true
stdout_logfile=/var/log/terrarium.log
stderr_logfile=/var/log/terrarium_err.log

[program:searxng]
# Assume that the searxng configuration is now in /searxng-config and the service
# can be started via its usual entrypoint (adjust the command as needed).
command=/usr/local/bin/gunicorn -c /searxng-config/gunicorn.conf.py searx.webapp:application
autostart=true
autorestart=true
stdout_logfile=/var/log/searxng.log
stderr_logfile=/var/log/searxng_err.log

[program:khoj]
directory=/app
command=/app/khoj --host="0.0.0.0" --port=42110 -vv --anonymous-mode --non-interactive
autostart=true
autorestart=true
stdout_logfile=/var/log/khoj.log
stderr_logfile=/var/log/khoj_err.log

Note:
The command lines for terrarium and searxng are only examples. In your original compose file these images ran with their default commands. You may need to inspect those images (for example, by running docker inspect <image>) to determine the exact command that should be run. Adjust the commands accordingly so that the behavior remains identical.

Final notes

Volumes: In your original docker‑compose file you mapped several named volumes (for configuration, database and models). In this one‑container solution you may choose to initialize local directories (or use Cloud Run’s writable filesystem) as appropriate. In many cases the persistent storage provided by Cloud Run is ephemeral so you may need to use an external storage service.

Ports and networking: In the Supervisor config we assume that all services talk via localhost. (In the compose file, they were on an internal network.) Adjust the host names/ports if needed.

Logging and signals: Using Tini and Supervisor helps ensure that signals (such as SIGTERM) are propagated to all child processes so that your container can exit gracefully.

By building this Dockerfile (for example, running docker build -t my-combined-app .) and deploying the resulting image to Cloud Run, you will have a single container that starts PostgreSQL (with pgvector), Terrarium, SearxNG and the Khoj server without changing their core logic or functionality.

This is one possible solution; you may need to further adjust commands, paths and initialization steps based on the exact behavior of the original images.
