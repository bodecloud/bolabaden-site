---
source_url: "https://chatgpt.com/c/686d5fc5-1080-8006-8429-28b7a6cfbf44"
conversation_id: "686d5fc5-1080-8006-8429-28b7a6cfbf44"
title: "Docker Compose Nginx Setup"
extracted_at: "2026-06-29T16:25:19.346Z"
message_count: 2
provenance: auth-ui
---

# Docker Compose Nginx Setup

Source: [ChatGPT conversation](https://chatgpt.com/c/686d5fc5-1080-8006-8429-28b7a6cfbf44)

## User

basic exmaple of how to define docker-compose.yml with nginx:latest. ensure it specifies the conf file somewhere.

## Assistant

Here's a basic example of a docker-compose.yml file that runs the nginx:latest image and uses a custom Nginx configuration file:

📁 Project Structure
project-root/
├── docker-compose.yml
└── nginx/
    └── nginx.conf
📄 docker-compose.yml
YAML
version: '3.8'

services:
  nginx:
    image: nginx:latest
    container_name: my-nginx
    ports:
      - "8080:80"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
📄 nginx/nginx.conf (minimal working config)
Nginx
events {}

http {
    server {
        listen 80;

        location / {
            return 200 'Hello from NGINX!';
            add_header Content-Type text/plain;
        }
    }
}
✅ Usage

Run it from the project root:

Bash
docker-compose up

Visit http://localhost:8080
 in your browser and you'll see the "Hello from NGINX!" message.

Let me know if you want to expand this with reverse proxying, SSL, or serving static files.
