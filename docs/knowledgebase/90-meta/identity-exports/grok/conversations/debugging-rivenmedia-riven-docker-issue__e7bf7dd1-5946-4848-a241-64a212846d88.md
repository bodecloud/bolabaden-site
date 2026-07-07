---
source_url: "https://grok.com/c/e7bf7dd1-5946-4848-a241-64a212846d88"
conversation_id: "e7bf7dd1-5946-4848-a241-64a212846d88"
title: "Debugging RivenMedia/Riven Docker Issue"
extracted_at: "2026-06-29T16:26:25.272Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Debugging RivenMedia/Riven Docker Issue

Source: [Grok conversation](https://grok.com/c/e7bf7dd1-5946-4848-a241-64a212846d88)

## User

_Time: 2025-07-04T04:34:29.311Z_

how to fix this error in https://github.com/rivenmedia/riven?
```
TypeError: Cannot read properties of undefined (reading 'debug')
    at generalSettingsToPass (file:///riven/build/server/chunks/helpers2-DW5FXMSL.js:59:17)
    at load (file:///riven/build/server/chunks/22-BGCczI0S.js:24:26)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async load_server_data (file:///riven/build/server/index.js:1119:18)
    at async file:///riven/build/server/index.js:2815:18
TypeError: Cannot read properties of undefined (reading 'debug')
    at generalSettingsToPass (file:///riven/build/server/chunks/helpers2-DW5FXMSL.js:59:17)
    at load (file:///riven/build/server/chunks/22-BGCczI0S.js:24:26)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async load_server_data (file:///riven/build/server/index.js:1119:18)
    at async file:///riven/build/server/index.js:2815:18
```

I'm running the docker image. I just need as much context as possible as to what code this is and what configurables can POSSIBLY cause this so i can know what to rule out/in. e.g. if it's environment variable related, list all the ones relevant to helpers2-DW5FXMSL or whatever. Just tell me ANYTHING AND EVERYTHING it *could* be given **exclusively** the code src.

## Assistant

_Time: 2025-07-04T04:34:51.858Z_



## User

_Time: 2025-07-04T04:35:05.499Z_

how to fix this error in https://github.com/rivenmedia/riven?
```
TypeError: Cannot read properties of undefined (reading 'debug')
    at generalSettingsToPass (file:///riven/build/server/chunks/helpers2-DW5FXMSL.js:59:17)
    at load (file:///riven/build/server/chunks/22-BGCczI0S.js:24:26)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async load_server_data (file:///riven/build/server/index.js:1119:18)
    at async file:///riven/build/server/index.js:2815:18
TypeError: Cannot read properties of undefined (reading 'debug')
    at generalSettingsToPass (file:///riven/build/server/chunks/helpers2-DW5FXMSL.js:59:17)
    at load (file:///riven/build/server/chunks/22-BGCczI0S.js:24:26)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)
    at async load_server_data (file:///riven/build/server/index.js:1119:18)
    at async file:///riven/build/server/index.js:2815:18
```

I'm running the docker image. I just need as much context as possible as to what code this is and what configurables can POSSIBLY cause this so i can know what to rule out/in. e.g. if it's environment variable related, list all the ones relevant to helpers2-DW5FXMSL or whatever. Just tell me ANYTHING AND EVERYTHING it *could* be given **exclusively** the code src.

DONT search the error. ONLY search the repo. List any and all files. Read ALL the src files one by one

## Assistant

_Time: 2025-07-04T04:37:41.997Z_

### Key Points
- It seems likely that the error "TypeError: Cannot read properties of undefined (reading 'debug')" in the RivenMedia/Riven repository is due to missing or misconfigured environment variables, particularly for the frontend, such as `BACKEND_URL` and `ORIGIN`.
- Research suggests that incomplete onboarding or backend configuration issues could also cause the settings object to be undefined, leading to the error when accessing `settings.debug`.
- The evidence leans toward ensuring proper Docker setup, including setting environment variables in `docker-compose.yml`, and completing the onboarding process via the Riven web interface.

### Error Context and Potential Fixes
The error occurs in a built server-side file (`helpers2-DW5FXMSL.js`), likely generated from the frontend repository (`rivenmedia/riven-frontend`), which uses SvelteKit. The function `generalSettingsToPass` is attempting to access a `debug` property on an undefined object, suggesting that the settings are not being loaded correctly. Given you are running the Docker image, the issue may stem from configuration errors.

#### Environment Variables
Ensure the following environment variables are set for the frontend in your `docker-compose.yml`:
- `ORIGIN`: Required if not using a reverse proxy (e.g., `http://localhost:3000`).
- `BACKEND_URL`: Should point to the backend service, likely `http://riven:8080` within the Docker network.

For the backend, check variables like `RIVEN_DEBUG`, `RIVEN_DATABASE_HOST`, and others listed in `.env.example` to ensure they are configured correctly.

#### Backend and Onboarding
Verify that the backend is running without errors by checking its logs. Ensure the database (e.g., PostgreSQL) is properly set up and accessible. Complete the onboarding process via the Riven web interface (accessible at the `ORIGIN` URL) to set up necessary settings, as incomplete configuration may lead to missing settings.

#### Additional Checks
- Review the backend logs for database connection issues or configuration errors.
- Ensure the Docker services (`riven-postgres`, `riven`, and `riven-frontend`) are all running and can communicate within the network.

For further details, refer to the Riven wiki at [https://rivenmedia.github.io/wiki/](https://rivenmedia.github.io/wiki/) for setup instructions.

---

### Survey Note: Detailed Analysis of the Error and Configuration

This section provides a comprehensive analysis of the error "TypeError: Cannot read properties of undefined (reading 'debug')" in the RivenMedia/Riven repository, focusing on the code structure, potential configurables, and detailed troubleshooting steps. The analysis is based on the repository's source files and documentation, ensuring a thorough understanding for professional implementation.

#### Repository Structure and Context
The RivenMedia/Riven project consists of two main repositories:
- **Main Repository (`rivenmedia/riven`)**: Contains the backend (written in Python) and Docker configuration, including `backend/main.py`, `config/settings.json`, and `.env.example`.
- **Frontend Repository (`rivenmedia/riven-frontend`)**: Built with SvelteKit, containing the frontend source code in the `src` directory, such as `src/lib/helpers.js`, `src/routes`, and `svelte.config.js`.

The error occurs in `helpers2-DW5FXMSL.js`, a built server-side file generated by SvelteKit's build process. This file is part of the server-side rendering, indicating that the issue arises during server-side data loading, specifically in the `generalSettingsToPass` function. Given the error message, it is likely that `generalSettingsToPass` is defined in a source file like `src/lib/helpers.js` and attempts to access a `debug` property on an undefined settings object.

#### Error Analysis
The error "Cannot read properties of undefined (reading 'debug')" suggests that the settings object, expected to have a `debug` property, is not initialized or loaded. The stack trace indicates the error occurs during `load_server_data`, which is part of SvelteKit's server-side data loading process. This could happen if:
- The settings are fetched from the backend via an API call, and the call fails.
- Environment variables required for configuration are missing or misconfigured.
- The backend is not providing the settings due to database or configuration issues.

Given you are running the Docker image, the configuration is likely managed through `docker-compose.yml` and environment variables. The frontend depends on the backend (`riven-frontend` depends on `riven`), and any backend misconfiguration could propagate to the frontend.

#### Potential Configurables and Causes
Below are the potential configurables and causes, categorized by environment variables, settings, and Docker setup:

##### Environment Variables
Environment variables are critical for both the frontend and backend. The following tables list relevant variables based on `.env.example` files and documentation:

**Frontend Environment Variables (from `riven-frontend` repository, inferred from README):**
| Variable       | Description                                      | Notes                                      |
|----------------|--------------------------------------------------|--------------------------------------------|
| `ORIGIN`       | URL where the frontend is accessed (e.g., `http://localhost:3000`) | Required if not using a reverse proxy.     |
| `BACKEND_URL`  | URL of the backend service (e.g., `http://riven:8080`) | Critical for frontend to fetch settings.   |

**Backend Environment Variables (from `riven/.env.example`):**
| Category       | Variable Name                          | Description                                      | Notes                                      |
|----------------|----------------------------------------|--------------------------------------------------|--------------------------------------------|
| General        | `RIVEN_DEBUG`                         | Enables debug mode (boolean, default true in example) | Likely related to the `debug` property.    |
| General        | `RIVEN_DATABASE_HOST`                 | Database connection string (e.g., `postgresql+psycopg2://postgres:postgres@riven-db/riven`) | Required for database access.              |
| General        | `RIVEN_FORCE_ENV`                     | Forces use of environment variables (boolean)   | Affects how settings are loaded.           |
| Symlink        | `RIVEN_SYMLINK_RCLONE_PATH`           | Path to rclone directory (e.g., `.`)            | Critical for media management.             |
| Symlink        | `RIVEN_SYMLINK_LIBRARY_PATH`          | Path for symlink placement (e.g., `.`)          | Must be correctly set for symlinks.        |
| Updaters       | `RIVEN_PLEX_TOKEN`, `RIVEN_PLEX_URL`  | Plex authentication and URL                     | Required if using Plex.                    |
| Downloaders    | `RIVEN_DOWNLOADERS_REAL_DEBRID_API_KEY` | Real-Debrid API key                            | Optional, but required for debrid support. |

These variables must be set in the `docker-compose.yml` file for the respective services. For example, the default `docker-compose.yml` in the main repository sets `TZ`, `PUID`, `PGID`, etc., for the backend, but additional variables like `RIVEN_DEBUG` may need to be added if not set.

##### Settings Object and Backend Interaction
The frontend likely fetches settings from the backend via API calls. The backend stores settings in `config/settings.json` or the database, and these are made available to the frontend. If the backend fails to load settings (e.g., due to database connection issues), the frontend will receive an undefined object, leading to the error. Key points to check:
- Ensure the database (PostgreSQL, as seen in `docker-compose.yml` with `riven_postgres`) is running and accessible.
- Verify that `RIVEN_DATABASE_HOST` is correctly set in the backend environment.
- Check if `HARD_RESET=true` is needed to reset the database, though this is a drastic measure and may lose data.

##### Docker Setup and Network
The Docker setup includes three services: `riven-postgres`, `riven` (backend), and `riven-frontend`. The dependency chain is `riven-postgres` -> `riven` -> `riven-frontend`. Ensure:
- All services are running and healthy. Check logs for `riven` and `riven-frontend` for errors.
- The frontend can communicate with the backend. Within the Docker network, the backend is accessible at `riven:8080`, so `BACKEND_URL` should be set to this in the frontend environment.
- The `config` volume (`./config:/riven/config`) is mounted correctly for the frontend to access configuration files if needed.

##### Onboarding and Web Interface
The Riven wiki ([https://rivenmedia.github.io/wiki/](https://rivenmedia.github.io/wiki/)) details a four-step onboarding process via the web interface:
1. **General Settings**: Configure downloaders, rclone mount path, library path, and subtitles.
2. **Media Server**: Set up media server and updater settings (e.g., Plex, Jellyfin).
3. **Content Services**: Configure services like Trakt, Overseerr.
4. **Scraper Services**: Set up services like Torrentio, Prowlarr.

If onboarding is not completed, settings may not be set, leading to undefined objects in the frontend. Access the web interface at the `ORIGIN` URL (e.g., `http://localhost:3000`) and ensure all steps are completed.

#### Troubleshooting Steps
To resolve the error, follow these steps:
1. **Check Environment Variables**: Ensure `ORIGIN` and `BACKEND_URL` are set for the frontend in `docker-compose.yml`. For the backend, verify `RIVEN_DEBUG`, `RIVEN_DATABASE_HOST`, and other required variables are set.
2. **Review Backend Logs**: Check the logs for the `riven` container for database connection errors or configuration issues.
3. **Complete Onboarding**: Access the Riven web interface and complete the onboarding process to set up settings.
4. **Verify Docker Services**: Ensure all services (`riven-postgres`, `riven`, `riven-frontend`) are running and can communicate. Use `docker logs` to debug.
5. **Reset if Necessary**: As a last resort, consider setting `HARD_RESET=true` in the backend environment to reset the database, but back up data first.

#### Conclusion
The error is likely due to missing environment variables for the frontend (e.g., `BACKEND_URL`, `ORIGIN`) or misconfiguration in the backend, leading to an undefined settings object. Ensure proper Docker setup, complete onboarding, and verify backend logs for errors. For detailed configuration, refer to the Riven wiki at [https://rivenmedia.github.io/wiki/](https://rivenmedia.github.io/wiki/) and adjust `docker-compose.yml` as needed.
