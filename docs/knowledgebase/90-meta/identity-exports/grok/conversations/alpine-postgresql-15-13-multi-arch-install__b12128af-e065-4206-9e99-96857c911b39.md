---
source_url: "https://grok.com/c/b12128af-e065-4206-9e99-96857c911b39"
conversation_id: "b12128af-e065-4206-9e99-96857c911b39"
title: "Alpine PostgreSQL 15.13 Multi-Arch Install"
extracted_at: "2026-06-29T16:37:40.311Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Alpine PostgreSQL 15.13 Multi-Arch Install

Source: [Grok conversation](https://grok.com/c/b12128af-e065-4206-9e99-96857c911b39)

## User

_Time: 2026-02-21T16:40:34.451Z_

in an alpine Dockerfile image please find a way to install this exact version of postgresql without building. We must support both amd64 and arm64 conditionally linking to the correct one for each platform.

## Assistant

_Time: 2026-02-21T16:43:47.797Z_

- Install PostgreSQL 15.13 using Alpine's package manager from the v3.18 repository, as it provides the exact version needed for both amd64 and arm64 architectures. This avoids building from source while ensuring compatibility.

- No conditional linking is required for installation, as `apk` automatically selects the correct architecture-specific package based on the build platform. However, if custom paths or prebuilt binaries are needed for Ghidra's BSim structure, consider prebuilding and downloading tarballs conditionally (detailed below).

- The original build dependencies (e.g., `build-base`, `gcc`) can be reduced, but retain `postgresql15-dev` for building the lshvector plugin.

- After installation, build and install the lshvector plugin using the system `pg_config`.

- pg_prewarm is included in `postgresql15-contrib`.

**Key Installation Steps in Dockerfile**
Use the following to replace the build section:

```
RUN set -eux; \
    echo "http://dl-cdn.alpinelinux.org/alpine/v3.18/main" >> /etc/apk/repositories; \
    apk update; \
    apk add --no-cache \
        postgresql15=15.13-r0 \
        postgresql15-contrib=15.13-r0 \
        postgresql15-dev=15.13-r0 \
        make \
    ; \
    # Build lshvector plugin (assuming Ghidra sources are present) \
    BSIM_SUPPORT=${GHIDRA_HOME}/Ghidra/Features/BSim/support; \
    mkdir -p ${BSIM_SUPPORT}/build/lshvector; \
    cp ${BSIM_SUPPORT}/src/lshvector/* ${BSIM_SUPPORT}/build/lshvector/; \
    cp ${BSIM_SUPPORT}/src/lshvector/c/* ${BSIM_SUPPORT}/build/lshvector/; \
    cd ${BSIM_SUPPORT}/build/lshvector; \
    make -f Makefile.lshvector install PG_CONFIG=/usr/libexec/postgresql15/pg_config; \
    # Clean up dev packages if not needed post-build \
    apk del postgresql15-dev make;
```

**Architecture Handling**
- `apk` handles amd64 (x86_64) and arm64 (aarch64) automatically.
- If BSim requires the exact custom prefix structure (`build/os/{linux_x86_64,linux_arm_64}/postgresql`), the system installation paths differ (/usr/lib/postgresql15, etc.). To match without building:
  - Prebuild the PostgreSQL installation (including lshvector) on separate amd64 and arm64 machines using the original `make-postgres.sh`.
  - Tar the resulting `postgresql` directory (e.g., `tar -czf postgresql-ghidra-amd64.tar.gz postgresql`).
  - Host the tarballs (e.g., on GitHub or a server).
  - In Dockerfile, download conditionally:

```
ARG TARGETARCH
RUN set -eux; \
    if [ "$TARGETARCH" = "amd64" ]; then \
        OSDIR="linux_x86_64"; \
        URL="https://your-host/postgresql-ghidra-amd64.tar.gz"; \
    elif [ "$TARGETARCH" = "arm64" ]; then \
        OSDIR="linux_arm_64"; \
        URL="https://your-host/postgresql-ghidra-arm64.tar.gz"; \
    else \
        echo "Unsupported architecture"; exit 1; \
    fi; \
    BSIM_BUILD_DIR=${GHIDRA_HOME}/Ghidra/Features/BSim/build/os/${OSDIR}; \
    mkdir -p ${BSIM_BUILD_DIR}; \
    curl -sSL -o /tmp/temp.tar.gz "$URL"; \
    (cd ${BSIM_BUILD_DIR}; tar -xzf /tmp/temp.tar.gz); \
    rm /tmp/temp.tar.gz;
```

This ensures a relocatable installation matching the original build, without compiling during Docker build.

**Potential Adjustments**
- Update Ghidra/BSim configurations or scripts to point to system paths if not using custom prefix (e.g., set environment variables like `PG_CONFIG` or modify launch scripts). Refer to Ghidra docs for BSim database setup: [Database Configuration](https://www.ghidradocs.com/11.2.1_PUBLIC/help/BSim/help/topics/BSim/DatabaseConfiguration.html).
- Test BSim functionality, as system paths may require symlink adjustments (e.g., `ln -s /usr/lib/postgresql15 ${GHIDRA_HOME}/Ghidra/Features/BSim/build/os/linux_x86_64/postgresql/lib`).

---

The approach above leverages Alpine's precompiled binaries for PostgreSQL 15.13, available in the v3.18 main repository for both amd64 (x86_64) and arm64 (aarch64). This eliminates the source build step, reducing Docker build time and complexity, while maintaining the exact version. The package manager handles architecture selection seamlessly, but for strict adherence to Ghidra's custom installation structure, the prebuilt tarball download method provides a conditional, no-build alternative.

### Package Details and Availability
The following tables summarize the relevant PostgreSQL 15.13 packages from Alpine v3.18. All are available for amd64 and arm64, confirming multi-platform support.

#### Core Package: postgresql15
| Attribute    | Details                                      |
|--------------|----------------------------------------------|
| Version      | 15.13-r0                                     |
| Description  | A sophisticated object-relational DBMS, version 15 |
| Repository   | http://dl-cdn.alpinelinux.org/alpine/v3.18/main |
| Architectures| amd64 (x86_64), arm64 (aarch64)              |
| Key Files    | - Binaries: /usr/libexec/postgresql15/pg_config, /usr/libexec/postgresql15/postgres, /usr/libexec/postgresql15/initdb, etc.<br>- Libs: /usr/lib/postgresql15/*.so (extensions)<br>- Share: /usr/share/postgresql15/pg_hba.conf.sample, /usr/share/postgresql15/postgres.bki, etc.<br>- Entry: /usr/bin/postgres15 |

#### Contrib Package: postgresql15-contrib
| Attribute    | Details                                      |
|--------------|----------------------------------------------|
| Version      | 15.13-r0                                     |
| Description  | Extension modules distributed with PostgreSQL |
| Key Files    | /usr/lib/postgresql15/pg_prewarm.so (confirmed included), other contrib extensions like auto_explain.so, etc. |

#### Dev Package: postgresql15-dev
| Attribute    | Details                                      |
|--------------|----------------------------------------------|
| Version      | 15.13-r0                                     |
| Description  | PostgreSQL development headers               |
| Key Files    | - Headers: /usr/include/postgresql/15/server/*.h (e.g., c.h, port.h, postgres.h)<br>- Config: /usr/include/postgresql/15/server/pg_config*.h<br>Used for building extensions like lshvector. |

### Installation Considerations
- **Repository Addition**: Append the v3.18 repo to avoid version mismatches in newer Alpine branches (e.g., edge has PostgreSQL 18+).
- **Dependencies**: Minimal; `postgresql15` pulls required libs (e.g., libpq). For plugin build, retain `make` temporarily.
- **Plugin Build (lshvector)**: The original script copies sources from Ghidra's `src/lshvector` and builds/installs using `pg_config`. This step compiles only the small plugin (not PostgreSQL), which is quick and aligns with "without building" the main database.
- **Version Pinning**: Use `=15.13-r0` to ensure exact match. If unavailable in future, check Repology or Alpine wiki for branches.
- **Multi-Arch in Docker**: Use `docker buildx` for multi-platform builds. The `TARGETARCH` arg enables conditional logic if needed (e.g., for tarball downloads).
- **Relocatability Issues**: Alpine's binaries have hardcoded paths (e.g., via `pg_config`). If BSim strictly requires the custom prefix, the tarball method is essential to mimic the built structure without runtime builds.
- **Alternative Versions**: If flexibility is allowed, newer minors (e.g., 15.15 in v3.19) are available, but stick to 15.13 as specified.
- **Testing**: After setup, verify with Ghidra's BSim tutorial (e.g., create database via `initdb`, load extension with `CREATE EXTENSION lshvector;`). Ensure BSim clients connect properly.

### Potential Challenges and Mitigations
| Challenge                  | Mitigation                                                                 |
|----------------------------|----------------------------------------------------------------------------|
| Path Mismatches in BSim    | Use symlinks (e.g., link /usr/libexec/postgresql15 to Ghidra's expected dir) or patch Ghidra launch scripts. |
| Build Deps Reduction       | Drop source-build deps; only need `make` and `-dev` for plugin. Cleanup post-build to minimize image size. |
| Future Repo Availability   | Mirror the apks locally if v3.18 is deprecated; download directly via curl in Dockerfile (e.g., `apk add --allow-untrusted /tmp/postgresql15-15.13-r0.apk`). |
| Plugin Compatibility       | Confirm lshvector builds against 15.13 headers; if issues, fallback to tarball method. |
| Performance/Portability    | System install is efficient; tarball ensures portability across Docker runs. |

This setup provides a balanced, efficient replacement for the source build, prioritizing precompiled binaries while supporting multi-arch needs.

**Key Citations:**
- [Alpine Linux PostgreSQL Wiki](https://wiki.alpinelinux.org/wiki/Postgresql)
- [postgresql15 Package (v3.18, x86_64)](https://pkgs.alpinelinux.org/package/v3.18/main/x86_64/postgresql15)
- [postgresql15 Package (v3.18, aarch64)](https://pkgs.alpinelinux.org/package/v3.18/main/aarch64/postgresql15)
- [postgresql15-contrib Package (v3.18)](https://pkgs.alpinelinux.org/package/v3.18/main/x86_64/postgresql15-contrib)
- [Ghidra BSim Tutorial](https://ghidra.re/ghidra_docs/GhidraClass/BSim/BSimTutorial_Intro.html)
