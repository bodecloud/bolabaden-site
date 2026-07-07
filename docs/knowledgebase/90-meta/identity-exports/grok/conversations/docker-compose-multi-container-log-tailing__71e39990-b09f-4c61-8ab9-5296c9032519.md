---
source_url: "https://grok.com/c/71e39990-b09f-4c61-8ab9-5296c9032519"
conversation_id: "71e39990-b09f-4c61-8ab9-5296c9032519"
title: "Docker Compose Multi-Container Log Tailing"
extracted_at: "2026-06-29T16:23:24.473Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Docker Compose Multi-Container Log Tailing

Source: [Grok conversation](https://grok.com/c/71e39990-b09f-4c61-8ab9-5296c9032519)

## User

_Time: 2025-08-30T10:26:11.104Z_

is it possible with docker cli to tail multiple containers logs simultaneously? i noticed this happened by accident when i omitted `-d` from `docker compose up`
note i already tried `docker container logs -f service1 service2` but that syntax is invalid.

## Assistant

_Time: 2025-08-30T10:27:22.922Z_

It is possible to tail logs from multiple containers simultaneously using Docker CLI tools, particularly when the containers are part of a Docker Compose project. However, the standard `docker logs` command does not natively support multiple containers in a single invocation. Below is a detailed explanation based on Docker's capabilities.

### Using Docker Compose for Multi-Container Logs
When containers are managed via Docker Compose, the `docker compose logs` command provides built-in support for viewing and following logs from multiple services concurrently. This command interleaves the output from specified services (or all services if none are specified) and prefixes each line with the service name for clarity, making it suitable for real-time monitoring.

- **Command Syntax**:  
  `docker compose logs [OPTIONS] [SERVICE...]`  
  Key options include:  
  - `-f` or `--follow`: Follows log output in real-time (similar to `tail -f`).  
  - `--tail N`: Displays the last N lines of logs before following (e.g., `--tail 100`).  
  - `--timestamps`: Includes timestamps in the output.

- **Example for Multiple Services**:  
  To follow logs from two services named `service1` and `service2`:  
  `docker compose logs -f service1 service2`  

  This will display interleaved logs with prefixes, such as:  
  ```
  service1  | [log line from service1]
  service2  | [log line from service2]
  ```

This behavior aligns with what you observed when running `docker compose up` without the `-d` (detached) flag, as that command starts containers in the foreground and automatically tails their combined logs. The `docker compose logs -f` command achieves the same tailing effect without restarting or affecting the containers' running state.<grok:render card_id="7601a3" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">11</argument>
</grok:render>

### For Standalone Containers (Without Docker Compose)
If the containers are not part of a Compose project, the base `docker logs` command is limited to a single container per invocation:  
`docker logs [OPTIONS] CONTAINER`  
(where `CONTAINER` is the container ID or name). It does not accept multiple container arguments, which explains why your attempt with `docker container logs -f service1 service2` resulted in an invalid syntax error.<grok:render card_id="41645b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">4</argument>
</grok:render>

To achieve simultaneous tailing for multiple standalone containers, you can use shell scripting to run parallel `docker logs -f` processes. For instance:  
- Using a Bash loop:  
  ```
  for container in container1 container2; do
    docker logs -f "$container" &
  done
  ```  
  This runs each `docker logs -f` in the background, allowing their outputs to interleave in the same terminal. However, without prefixes, distinguishing between containers may require additional scripting (e.g., piping through `sed` to add custom labels).  

- Using `xargs` for parallelism:  
  `docker ps -q | xargs -P 0 -L 1 docker logs -f`  
  This tails logs from all running containers (`-P 0` enables unlimited parallelism). Adjust `docker ps -q` to filter specific containers if needed.<grok:render card_id="1bbe12" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>

Note that interleaved output from parallel commands may appear disorganized in a single terminal. For more structured viewing, consider third-party tools like `multitail` or centralized logging solutions (e.g., ELK Stack), though these extend beyond the core Docker CLI.

If your setup involves a Compose file, leveraging `docker compose logs` is the most straightforward and recommended approach for multi-container scenarios. For further details, consult the official Docker documentation on container logs and Compose commands.
