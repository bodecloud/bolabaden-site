---
source_url: "https://grok.com/c/2080fa96-6af2-4769-b259-a4517ad54a3c"
conversation_id: "2080fa96-6af2-4769-b259-a4517ad54a3c"
title: "Troubleshooting Riven Media Request Error"
extracted_at: "2026-06-29T16:38:17.735Z"
message_count: 8
export_suite: "identity"
provenance: grok-rest-api
---

# Troubleshooting Riven Media Request Error

Source: [Grok conversation](https://grok.com/c/2080fa96-6af2-4769-b259-a4517ad54a3c)

## User

_Time: 2025-07-04T03:09:16.416Z_

Please search deeply, prioritizing reddit and github issues. How to fix this error in spoked/riven?

```
An error occurred while requesting the media

```

I've tried almost EVERYTHING.

## Assistant

_Time: 2025-07-04T03:10:33.645Z_



## User

_Time: 2025-07-04T03:12:02.225Z_

Please search deeply, prioritizing reddit and github issues. How to fix this error in spoked/riven?

```
An error occurred while requesting the media

```

I've tried almost EVERYTHING.

riven is a modern overseerr alternative for plex/jellyfin/emby.

https://github.com/rivenmedia/riven

search REDDIT and GITHUB for solutions to the problem where selfhosting it has arbitrary "An error occurred while requesting the media" and other vague as fuck errors that prevent the thing from working.

## Assistant

_Time: 2025-07-04T03:16:41.050Z_

### Key Points
- It seems likely that the error "An error occurred while requesting the media" in riven is due to configuration issues, such as incorrect setup of content services like Overseerr or debrid services.
- Research suggests checking logs for detailed error messages and ensuring the latest software version is used, as riven is under active development.
- The evidence leans toward verifying rclone mount paths and seeking community support on Discord for unresolved issues.

### Configuration Verification
Ensure that content services like Overseerr are properly configured with correct URLs, API keys, and webhooks. Verify debrid services and rclone mount paths are set up correctly, ensuring accessibility from within the container. For detailed guidance, refer to the [Riven Documentation](https://rivenmedia.github.io/wiki/).

### Log Inspection
Check the logs of the riven and riven-frontend containers using `docker logs riven` and `docker logs riven-frontend` to identify specific error messages that can guide troubleshooting.

### Software Updates and Community Support
Ensure you are using the latest versions of riven and riven-frontend to benefit from recent bug fixes. For further assistance, join the Riven Discord server at [Discord Link](https://discord.gg/rivenmedia) for support from developers and the community.

---

### Survey Note: Detailed Analysis of Error Resolution in Riven Media Manager

This note provides a comprehensive examination of the error "An error occurred while requesting the media" encountered in riven, a modern alternative to Overseerr for media management with Plex, Jellyfin, and Emby. The analysis is grounded in a thorough review of available resources, including GitHub repositories, Reddit discussions, and official documentation, as of 10:12 PM CDT on Thursday, July 03, 2025.

#### Background and Context
Riven, developed by rivenmedia and hosted on GitHub at [https://github.com/rivenmedia/riven](https://github.com/rivenmedia/riven), is an open-source media manager designed to handle media library requests and management. The error in question, "An error occurred while requesting the media," is described as vague and arbitrary, impacting the functionality of self-hosted instances. The user's frustration, having tried multiple solutions, underscores the need for a systematic approach to diagnosis and resolution.

#### Initial Observations from GitHub and Documentation
The investigation began with an examination of the riven GitHub repository and its associated documentation. The documentation, accessible at [https://rivenmedia.github.io/wiki/](https://rivenmedia.github.io/wiki/), outlines the configuration process, including onboarding steps for debrid services, media servers, content services, and scraper services. Key supported services include Real-Debrid, All-Debrid, Torbox for debrid, and Plex, Jellyfin, Emby for media servers, with a requirement for Python 3.11 or higher and tools like Docker and Rclone (preferably Zurg for Real-Debrid users).

Searches within the repository for the exact error message yielded no direct matches, suggesting it may be a generic frontend message rather than a specific code error. However, related issues, such as issue #874 ("An error occurred while deleting the media") and issue #904 ("DB error that breaks riven"), provided insights into potential configuration or database-related problems. Issue #874 highlighted errors with indexed but not pulled media, while issue #904 involved a database error ("Multiple rows were found when one or none was required"), indicating backend issues that could indirectly affect media requesting.

The documentation also listed common issues, such as cross-site POST form submissions due to incorrect ORIGIN in `docker-compose.yml`, errors when saving changes, and onboarding loops due to symlink settings. Solutions included removing the ORIGIN variable if behind a reverse proxy and checking logs, with a recurring recommendation to seek help via the Discord server at [https://discord.gg/rivenmedia](https://discord.gg/rivenmedia).

#### Reddit and Community Insights
Reddit searches, focusing on subreddits like r/debridmediamanager and general self-hosting communities, revealed limited direct references to the specific error. A notable post in r/debridmediamanager (posted August 1, 2024, at [https://www.reddit.com/r/debridmediamanager/comments/1ehgcxv/riven_something_went_wrong/](https://www.reddit.com/r/debridmediamanager/comments/1ehgcxv/riven_something_went_wrong/)) described a different error ("Something went wrong, Error code: 503"), suggesting server or API issues, with a recommendation to seek help on Discord. This indicates a pattern of users encountering vague errors and turning to community support for resolution.

#### Detailed Configuration Analysis
Given the lack of direct matches for the error message, the analysis focused on potential configuration-related causes. The documentation specifies that requesting media likely involves content services like Overseerr, which requires proper configuration of URLs (e.g., "http://localhost:5055"), API keys, and webhooks (e.g., "http://localhost:8080/api/v1/webhook/overseerr"). Misconfigurations here could lead to failed requests, manifesting as the observed error.

Additionally, riven's reliance on debrid services and rclone for media access suggests that issues with rclone mount paths could be critical. The documentation emphasizes ensuring the rclone mount is accessible, with a command like `ls -lh /mnt/zurg` to verify. If the mount is inaccessible, it could prevent media from being requested, triggering the error. The `docker-compose.yml` file, which maps `/mnt:/mnt`, must align with the host system's configuration to ensure proper access.

#### Troubleshooting Steps and Recommendations
Based on the analysis, the following steps are recommended to address the error:

1. **Verify Configuration Settings:**
   - Ensure content services like Overseerr are enabled and correctly configured, including URLs, API keys, and webhooks. Refer to [https://rivenmedia.github.io/wiki/services/content/](https://rivenmedia.github.io/wiki/services/content/) for detailed settings.
   - Confirm debrid service configurations and rclone mount paths. Verify accessibility by entering the container and listing files in the mount path (e.g., `/mnt/zurg`).

2. **Inspect Logs for Detailed Errors:**
   - Use `docker logs riven` and `docker logs riven-frontend` to retrieve logs. Look for errors related to network connectivity, permissions, or database issues that could affect media requesting.

3. **Ensure Software is Up-to-Date:**
   - Given riven's active development status, ensure the latest versions are used (e.g., riven:latest 20.0, riven-frontend:latest 17.0, as seen in issue #904). Check the GitHub releases for updates.

4. **Seek Community Support:**
   - Join the Riven Discord server at [https://discord.gg/rivenmedia](https://discord.gg/rivenmedia) for direct assistance from developers and users, especially for unresolved issues.

#### Common Issues and Solutions Table
The following table summarizes common issues identified and their potential solutions, derived from documentation and related issues:

| **Issue**                                      | **Details**                                                                 | **Solution**                                                                                     |
|------------------------------------------------|-----------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| Cross-site POST form submissions are forbidden | Incorrect `ORIGIN` in `docker-compose.yml`                                  | Remove `ORIGIN` environment variable from `riven-frontend` if behind a reverse proxy              |
| Error when saving changes                     | Likely due to incorrect configuration or backend failure                    | Check Riven service logs; seek help in Discord: [https://discord.gg/rivenmedia](https://discord.gg/rivenmedia) |
| Stuck in onboarding loop                      | Incorrect symlink settings (library path, rclone mount path)                | Check settings and logs; seek help in Discord: [https://discord.gg/rivenmedia](https://discord.gg/rivenmedia) |
| Database errors (e.g., multiple rows found)   | Backend database issue, requires reset                                      | Reset database using commands in documentation; ensure HARD_RESET is set appropriately            |

#### Conclusion
The error "An error occurred while requesting the media" in riven is likely configuration-related, potentially involving content services, debrid setups, or rclone mounts. Users should verify configurations, inspect logs for detailed errors, ensure software updates, and leverage community support via Discord for unresolved issues. This approach aligns with observed patterns in related issues and community discussions, providing a structured path to resolution.

## User

_Time: 2025-07-04T03:58:19.240Z_

How to fix this error in riven's frontend when opening the settings?

```
TypeError: fetch failed
    at node:internal/deps/undici/undici:13502:13
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async s (file:///riven/node_modules/.pnpm/@hey-api+client-fetch@0.4.4/node_modules/@hey-api/client-fetch/dist/index.js:1:5039)
    at async load (file:///riven/build/server/chunks/22-BGCczI0S.js:19:20)
    at async load_server_data (file:///riven/build/server/index.js:1119:18)
    at async file:///riven/build/server/index.js:2815:18 {
  [cause]: Error: getaddrinfo ENOTFOUND riven
      at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:120:26)
      at GetAddrInfoReqWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    errno: -3008,
    code: 'ENOTFOUND',
    syscall: 'getaddrinfo',
    hostname: 'riven'
  }
}

```

The frontend webpage itself just shows:

```
Something went wrong
Error code: 500

Error message: Internal Error
```

## Assistant

_Time: 2025-07-04T03:59:25.704Z_



## User

_Time: 2025-07-04T03:59:25.723Z_

How to fix this error in riven's frontend when opening the settings?

```
TypeError: fetch failed
    at node:internal/deps/undici/undici:13502:13
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async s (file:///riven/node_modules/.pnpm/@hey-api+client-fetch@0.4.4/node_modules/@hey-api/client-fetch/dist/index.js:1:5039)
    at async load (file:///riven/build/server/chunks/22-BGCczI0S.js:19:20)
    at async load_server_data (file:///riven/build/server/index.js:1119:18)
    at async file:///riven/build/server/index.js:2815:18 {
  [cause]: Error: getaddrinfo ENOTFOUND riven
      at GetAddrInfoReqWrap.onlookupall [as oncomplete] (node:dns:120:26)
      at GetAddrInfoReqWrap.callbackTrampoline (node:internal/async_hooks:130:17) {
    errno: -3008,
    code: 'ENOTFOUND',
    syscall: 'getaddrinfo',
    hostname: 'riven'
  }
}

```

The frontend webpage itself just shows:

```
Something went wrong
Error code: 500

Error message: Internal Error
```

Please remoember we're talking about the riven media project https://github.com/rivenmedia/riven/

## Assistant

_Time: 2025-07-04T04:01:20.100Z_

### Key Points
- It seems likely that the error "TypeError: fetch failed" in riven's frontend when opening settings is due to a DNS resolution issue, specifically "getaddrinfo ENOTFOUND riven," indicating the frontend cannot find the backend service.
- Research suggests checking if the backend service "riven" is running, verifying the `BACKEND_URL` configuration, and ensuring both services are on the same Docker network.
- The evidence leans toward ensuring proper Docker Compose setup and connectivity between containers, with potential misconfigurations in service names or environment variables.

### Verify Service Status
First, ensure the backend service named "riven" is running. Use the command `docker ps` to list running containers and confirm the "riven" container is active. If it's not running, start it with `docker-compose up -d riven`.

### Check Backend Logs
Inspect the logs of the "riven" container for any errors that might prevent it from starting: `docker logs riven`. This can help identify issues like port conflicts or configuration errors.

### Confirm Configuration
Verify that in your `docker-compose.yml`, the `riven-frontend` service has the `BACKEND_URL` environment variable set correctly, typically to "[invalid url, do not cite]". If your setup uses different service names or ports, adjust `BACKEND_URL` accordingly.

### Test Connectivity
To further diagnose, enter the frontend container and test connectivity to the backend: run `docker exec -it riven-frontend bash`, then try `curl [invalid url, do not cite]` (adjust the URL as needed). If this fails, it confirms a networking issue.

---

### Survey Note: Detailed Analysis of "TypeError: fetch failed" Error in Riven Frontend

This note provides a comprehensive examination of the error "TypeError: fetch failed" encountered in riven's frontend when opening the settings, specifically the "getaddrinfo ENOTFOUND riven" issue, as reported on July 3, 2025. The analysis is grounded in a thorough review of available resources, including the riven GitHub repository, official documentation, and general Docker networking discussions, focusing on resolving the error in the context of the riven media project at [invalid url, do not cite].

#### Background and Context
Riven, developed by rivenmedia, is an open-source media manager designed to integrate with media servers like Plex, Jellyfin, and Emby, handling media library requests and management. The error in question occurs when opening the settings in the frontend, displaying "Something went wrong" with an error code 500 and message "Internal Error." The stack trace indicates a TypeError: fetch failed, with a cause of Error: getaddrinfo ENOTFOUND riven, suggesting a DNS resolution failure when the frontend attempts to communicate with the backend service named "riven."

#### Initial Observations from Documentation and Repository
The investigation began with an examination of the riven documentation at [invalid url, do not cite] and the GitHub repository at [invalid url, do not cite]. The documentation outlines a Docker Compose setup with services including `riven` (backend, port 8080), `riven-frontend` (web interface, port 3000), and `riven-db` (database), using images like `spoked/riven-frontend:latest` and `spoked/riven:latest`. Key environment variables include `TZ`, `ORIGIN`, `BACKEND_URL`, `RIVEN_DATABASE_HOST`, and others, with dependencies ensuring `riven-frontend` depends on `riven`, and `riven` on `riven-db`.

Searches within the repository for "ENOTFOUND" or "fetch failed" yielded no direct matches, suggesting this may be a configuration-specific issue rather than a reported bug. However, related discussions on Docker networking and general fetch errors provided insights into potential causes.

#### Analysis of Error and Likely Causes
The error "getaddrinfo ENOTFOUND riven" indicates that the frontend container cannot resolve the hostname "riven" to an IP address, a common issue in Docker environments when services are not on the same network or when the backend service is not running. Given riven's architecture, the frontend likely makes API requests to the backend using the `BACKEND_URL` environment variable, expected to be set to "[invalid url, do not cite] in a standard setup.

Possible causes include:
- The backend service "riven" is not running or failed to start.
- Misconfiguration of `BACKEND_URL` in the frontend, pointing to an incorrect hostname or port.
- Services not being on the same Docker network, preventing name resolution.
- The backend not listening on the expected port (8080) inside its container.

#### Detailed Troubleshooting Steps
Based on the analysis, the following steps are recommended to address the error:

1. **Verify Service Status:**
   - Use `docker ps` to confirm the "riven" container is running. If not, start it with `docker-compose up -d riven`. This ensures the backend service is active and accessible.

2. **Check Backend Logs:**
   - Inspect logs with `docker logs riven` to identify any startup errors, such as port conflicts, database connection issues, or configuration errors. For example, if the backend fails due to database connectivity, it might not start, leading to the frontend's inability to connect.

3. **Confirm BACKEND_URL Configuration:**
   - In the `docker-compose.yml` file, ensure the `riven-frontend` service has `BACKEND_URL` set to "[invalid url, do not cite]". If the user has modified service names (e.g., renamed "riven" to "riven-backend"), adjust `BACKEND_URL` accordingly. The documentation at [invalid url, do not cite] specifies that for non-Docker setups, `BACKEND_URL` can be set to "[invalid url, do not cite], but in Docker, it should use the service name for internal communication.

4. **Test Connectivity:**
   - Enter the frontend container with `docker exec -it riven-frontend bash` and test connectivity to the backend by running `curl [invalid url, do not cite]`. If this fails with "ENOTFOUND," it confirms a DNS resolution issue. If it fails with "connection refused," the backend might be running but not listening on the expected port.

5. **Ensure Same Docker Network:**
   - In a standard Docker Compose setup, all services are automatically placed on the same network, allowing name resolution using service names. Verify this by checking `docker network ls` and ensuring both containers are listed under the same network (typically named after the project, e.g., `riven_default`). If using custom networks, ensure both services are connected with `docker network connect`.

#### Common Issues and Solutions Table
The following table summarizes common issues identified and their potential solutions, derived from documentation and related discussions:

| **Issue**                                      | **Details**                                                                 | **Solution**                                                                                     |
|------------------------------------------------|-----------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------|
| Backend service "riven" not running            | Container not started, leading to DNS resolution failure                    | Start with `docker-compose up -d riven`; check logs with `docker logs riven`                     |
| Incorrect BACKEND_URL                          | Set to wrong hostname (e.g., localhost) or port                            | Ensure `BACKEND_URL=[invalid url, do not cite]` in `docker-compose.yml` for frontend             |
| Services on different networks                 | Prevents name resolution between containers                                 | Verify both on same network with `docker network ls`; connect if necessary                       |
| Backend not listening on port 8080             | Internal binding issue within container                                     | Enter container (`docker exec -it riven bash`), check with `netstat -tuln` for port 8080         |

#### Additional Considerations
Given the error's specificity to DNS resolution, it's worth noting that Docker uses its internal DNS server (typically at 127.0.0.11) for container-to-container communication. If external DNS issues are suspected, they are less likely, as the error is within the Docker network. However, if the user has modified Docker's DNS settings (e.g., in `/etc/docker/daemon.json`), it could affect resolution, though this is uncommon.

The documentation also mentions potential issues with reverse proxies, suggesting removing the `ORIGIN` variable if behind one, but this is unrelated to the fetch error, as `ORIGIN` affects CORS, not hostname resolution. For completeness, ensure `ORIGIN` is set correctly (e.g., "[invalid url, do not cite]") if accessing externally, but this should not cause "ENOTFOUND."

#### Conclusion
The "TypeError: fetch failed" error in riven's frontend, with "getaddrinfo ENOTFOUND riven," is likely due to a configuration or networking issue within Docker, such as the backend service not running, incorrect `BACKEND_URL`, or services on different networks. Users should verify service status, check logs, confirm environment variables, test connectivity, and ensure network alignment. This approach aligns with observed patterns in Docker networking discussions, providing a structured path to resolution.

**Citations:**
- [Riven Documentation](https://rivenmedia.github.io/wiki/)
- [GitHub - rivenmedia/riven](https://github.com/rivenmedia/riven)
- [StackOverflow - Getting "TypeError: Failed to fetch" when the request hasn't actually failed](https://stackoverflow.com/questions/49343024/getting-typeerror-failed-to-fetch-when-the-request-hasnt-actually-failed)
- [Docker Community Forums - Backend application container don't may to connect to db in container](https://forums.docker.com/t/backend-application-container-dont-may-to-connect-to-db-in-container/135717)
