---
source_url: "https://chatgpt.com/c/68847708-21c4-8006-a4ab-1305dcebfd0e"
conversation_id: "68847708-21c4-8006-a4ab-1305dcebfd0e"
title: "Docker run command help"
extracted_at: "2026-06-29T16:14:28.127Z"
message_count: 2
provenance: auth-ui
---

# Docker run command help

Source: [ChatGPT conversation](https://chatgpt.com/c/68847708-21c4-8006-a4ab-1305dcebfd0e)

## User

ip-checker:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ip-checker
    hostname: ip-checker
    networks:
#      - vpn-docker-network
      - vpn-network
#      - publicnet
    command: ["CMD-SHELL", "curl -s ifconfig.me"]
    restart: always

write this as a docker run command. I'm struggling to figure out how to do the curl -s ifconfig.me with docker run

Note i don't have an image, should always be Dockerfile specific/built

Show more

## Assistant

Got it! You want to run the equivalent of your docker-compose service as a docker run command, building from the Dockerfile in the current directory, running curl -s ifconfig.me, and attaching it to specific networks.

Here's how you can do it step-by-step:

Compose snippet recap:
YAML
ip-checker:
  build:
    context: .
    dockerfile: Dockerfile
  container_name: ip-checker
  hostname: ip-checker
  networks:
    - vpn-network
  command: ["CMD-SHELL", "curl -s ifconfig.me"]
  restart: always
Equivalent docker run command
Bash
docker build -t ip-checker-image .

docker run -d \
  --name ip-checker \
  --hostname ip-checker \
  --network vpn-network \
  --restart always \
  ip-checker-image \
  sh -c "curl -s ifconfig.me"
Explanation:

docker build -t ip-checker-image . — builds the image from your Dockerfile in the current directory.

docker run -d — runs container in detached mode (background).

--name ip-checker — sets container name.

--hostname ip-checker — sets container hostname.

--network vpn-network — connects container to the vpn-network docker network.

--restart always — restarts container automatically on failure or daemon restart.

ip-checker-image — image to run (built previously).

sh -c "curl -s ifconfig.me" — command to run inside the container, equivalent to your CMD-SHELL.

If you want to run it interactively (to see the output directly):

Bash
docker run --rm --name ip-checker --hostname ip-checker --network vpn-network ip-checker-image sh -c "curl -s ifconfig.me"

This will run, output the IP, then exit and remove the container.

If you want me to generate a one-liner that builds and runs, I can do that too! Just say the word.
