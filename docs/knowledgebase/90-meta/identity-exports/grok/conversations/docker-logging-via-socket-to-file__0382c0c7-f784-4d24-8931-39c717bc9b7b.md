---
source_url: "https://grok.com/c/0382c0c7-f784-4d24-8931-39c717bc9b7b"
conversation_id: "0382c0c7-f784-4d24-8931-39c717bc9b7b"
title: "Docker Logging via Socket to File"
extracted_at: "2026-06-29T16:33:54.942Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Docker Logging via Socket to File

Source: [Grok conversation](https://grok.com/c/0382c0c7-f784-4d24-8931-39c717bc9b7b)

## User

_Time: 2025-08-11T07:27:41.679Z_

in docker-compose.yaml, i need a container, that's entire purpose is to write the console output of another container to a log file (and rotate it). The container cannot use docker commands. It must use the socket

## Assistant

_Time: 2025-08-11T07:29:20.309Z_

The following configuration demonstrates how to achieve the required functionality in a `docker-compose.yaml` file. This setup includes two services: an example main application service (named `app`) that generates console output, and a logging service (named `logger`) that captures the output from the `app` service using the Docker API via the Unix socket. The `logger` service employs a Python script to query the Docker API, retrieve and parse the multiplexed log stream, and write the combined stdout and stderr output to a rotating log file.

The `logger` service mounts the Docker socket for API access and uses Python's standard libraries to handle the HTTP requests over the Unix socket, parse the binary log format, and manage log rotation via the `logging` module's `RotatingFileHandler`. No Docker CLI commands are used within the container. The rotation is configured for a maximum file size of 10 MB with up to 5 backup files, but these parameters can be adjusted in the script as needed.

Assume the Python script (provided below) is saved as `logger.py` in the same directory as the `docker-compose.yaml` file. The configuration mounts this script into the `logger` container.

### docker-compose.yaml

```yaml
version: '3.8'

services:
  app:
    image: busybox
    command: sh -c 'while true; do echo "Example output from app"; sleep 5; done'
    labels:
      com.docker.compose.service: app  # Explicit for clarity, though Compose sets this automatically

  logger:
    image: python:3.12-alpine
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - ./logger.py:/logger.py
      - logs:/logs
    command: python /logger.py
    depends_on:
      - app

volumes:
  logs:
```

### logger.py (Python Script for the Logger Container)

```python
import http.client
import socket
import json
import sys
import logging
from logging.handlers import RotatingFileHandler
import time

DOCKER_SOCKET = '/var/run/docker.sock'
SERVICE_LABEL = 'com.docker.compose.service=app'
LOG_FILE = '/logs/app.log'
MAX_BYTES = 10 * 1024 * 1024  # 10 MB
BACKUP_COUNT = 5

class UnixHTTPConnection(http.client.HTTPConnection):
    def __init__(self, unix_socket):
        super().__init__('localhost')
        self.unix_socket = unix_socket

    def connect(self):
        self.sock = socket.socket(socket.AF_UNIX, socket.SOCK_STREAM)
        self.sock.connect(self.unix_socket)

def get_connection():
    return UnixHTTPConnection(DOCKER_SOCKET)

def get_container_id():
    conn = get_connection()
    filters = json.dumps({'label': [SERVICE_LABEL]})
    conn.request('GET', '/containers/json?filters=' + filters.replace('"', '%22'))
    response = conn.getresponse()
    if response.status != 200:
        raise Exception(f'Failed to list containers: {response.status} {response.reason}')
    data = json.loads(response.read().decode('utf-8'))
    if not data:
        raise Exception('No container found with the specified label')
    return data[0]['Id']

def setup_logger():
    handler = RotatingFileHandler(LOG_FILE, maxBytes=MAX_BYTES, backupCount=BACKUP_COUNT)
    handler.setFormatter(logging.Formatter('%(asctime)s - %(message)s'))
    log = logging.getLogger('app_logger')
    log.setLevel(logging.INFO)
    log.addHandler(handler)
    return log

def tail_logs(container_id, log):
    conn = get_connection()
    conn.request('GET', f'/containers/{container_id}/logs?follow=1&stdout=1&stderr=1')
    response = conn.getresponse()
    if response.status != 200:
        raise Exception(f'Failed to get logs: {response.status} {response.reason}')
    
    while True:
        header = response.fp.read(8)
        if len(header) < 8:
            break
        stream_type = header[0]
        length = int.from_bytes(header[4:8], 'big')
        data = response.fp.read(length)
        if len(data) < length:
            break
        try:
            message = data.decode('utf-8').rstrip('\n')
            if message:
                prefix = '[STDERR]' if stream_type == 2 else '[STDOUT]'
                log.info(f'{prefix} {message}')
        except UnicodeDecodeError:
            log.warning('Failed to decode log message')

if __name__ == '__main__':
    try:
        container_id = get_container_id()
        log = setup_logger()
        tail_logs(container_id, log)
    except Exception as e:
        print(f'Error: {e}', file=sys.stderr)
        sys.exit(1)
```

### Explanation

- **App Service**: This is a placeholder using Busybox to simulate continuous output. Replace it with your actual application service.
- **Logger Service**: Uses Python to interact with the Docker API. The script first retrieves the target container's ID by filtering on the Compose service label. It then tails the logs, parses the multiplexed binary stream (handling the 8-byte headers), and writes the output to a rotating log file in `/logs/app.log`. Rotation occurs automatically based on file size.
- **Volumes**: The Docker socket is mounted for API access. A named volume `logs` persists the log files outside the container. The script is mounted from the host.
- **Dependencies**: The `logger` starts after the `app` to ensure the target container exists.

To use this setup, place both files in a directory, run `docker-compose up`, and inspect the logs in the mounted volume on the host.<grok:render card_id="d71560" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">21</argument>
</grok:render>
