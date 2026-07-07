---
source_url: "https://grok.com/c/581f17ca-1d9b-4d9e-926c-2eb9cf454a8a"
conversation_id: "581f17ca-1d9b-4d9e-926c-2eb9cf454a8a"
title: "Docker Build Failure: Missing G++"
extracted_at: "2026-06-29T16:19:31.572Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Docker Build Failure: Missing G++

Source: [Grok conversation](https://grok.com/c/581f17ca-1d9b-4d9e-926c-2eb9cf454a8a)

## User

_Time: 2025-09-27T12:56:11.116Z_

9.562 Downloading tqdm-4.67.1-py3-none-any.whl (78 kB)
9.567 Downloading typing_inspection-0.4.1-py3-none-any.whl (14 kB)
9.571 Downloading tzdata-2025.2-py2.py3-none-any.whl (347 kB)
9.581 Downloading zipp-3.23.0-py3-none-any.whl (10 kB)
9.586 Downloading click-8.3.0-py3-none-any.whl (107 kB)
9.590 Downloading tokenizers-0.22.1-cp39-abi3-manylinux_2_17_aarch64.manylinux2014_aarch64.whl (3.3 MB)
9.600 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 3.3/3.3 MB 426.6 MB/s 0:00:00
9.603 Downloading huggingface_hub-0.35.1-py3-none-any.whl (563 kB)
9.607 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 563.3/563.3 kB 564.3 MB/s 0:00:00
9.611 Downloading hf_xet-1.1.10-cp37-abi3-manylinux_2_28_aarch64.whl (3.1 MB)
9.626 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 3.1/3.1 MB 304.8 MB/s 0:00:00
9.632 Downloading fsspec-2025.9.0-py3-none-any.whl (199 kB)
9.636 Downloading packaging-25.0-py3-none-any.whl (66 kB)
9.641 Downloading filelock-3.19.1-py3-none-any.whl (15 kB)
9.759 Building wheels for collected packages: madoka
9.760 Building wheel for madoka (pyproject.toml): started
10.03 Building wheel for madoka (pyproject.toml): finished with status 'error'
10.03 error: subprocess-exited-with-error
10.03
10.03 × Building wheel for madoka (pyproject.toml) did not run successfully.
10.03 │ exit code: 1
10.03 ╰─> [14 lines of output]
10.03 /tmp/pip-build-env-aqj7ey0f/overlay/lib/python3.13/site-packages/setuptools/dist.py:759: SetuptoolsDeprecationWarning: License classifiers are deprecated.
10.03 !!
10.03
10.03 ********************************************************************************
10.03 Please consider removing the following classifiers in favor of a SPDX license expression:
10.03
10.03 License :: OSI Approved :: BSD License
10.03
10.03 See https://packaging.python.org/en/latest/guides/writing-pyproject-toml/#license for details.
10.03 ********************************************************************************
10.03
10.03 !!
10.03 self._finalize_license_expression()
10.03 error: command 'g++' failed: No such file or directory
10.03 [end of output]
10.03
10.03 note: This error originates from a subprocess, and is likely not a problem with pip.
10.03 ERROR: Failed building wheel for madoka
10.03 Failed to build madoka
10.09 error: failed-wheel-build-for-install
10.09
10.09 × Failed to build installable wheels for some pyproject.toml based projects
10.09 ╰─> madoka
------
Dockerfile:5
--------------------
   3 | RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
   4 | COPY . .
   5 | >>> RUN pip install --no-cache-dir -r requirements.txt
   6 | RUN mkdir -p /app/cache
   7 | ENV PYTHONPATH=/app
--------------------
failed to solve: process "/bin/sh -c pip install --no-cache-dir -r requirements.txt" did not complete successfully: exit code: 1
 
how to fix on ubuntu arm64?

## Assistant

_Time: 2025-09-27T12:59:33.285Z_

### Key Points
- The build failure for the 'madoka' Python package in your Docker setup is primarily caused by the absence of a C++ compiler (g++), which is required to compile its native extensions since no prebuilt wheels are available for ARM64 with Python 3.13.<grok:render card_id="ca71da" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="2dbfaf" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render>
- Research suggests installing the 'build-essential' package resolves this by providing g++ and other compilation tools, with no reported ARM64-specific incompatibilities.<grok:render card_id="6b4fbb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render>
- This issue appears common in minimal Docker images lacking development tools, and pinning dependencies to avoid 'madoka' is a workaround if compilation isn't feasible, though it may limit functionality.<grok:render card_id="d73e81" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render>

### Understanding the Error
The error occurs during the wheel-building process for 'madoka', a Python library implementing a memory-efficient Count-Min sketch for data stream summarization.<grok:render card_id="6f206a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="d087e0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">28</argument>
</grok:render> It relies on C++ extensions, triggering compilation via setuptools. The specific failure—"command 'g++' failed: No such file or directory"—indicates the Docker environment lacks the necessary compiler. This is typical in slim Python images based on Debian/Ubuntu, which prioritize minimalism and omit build tools.

### Recommended Fix
Modify your Dockerfile to install 'build-essential' early in the build process. This package includes g++, gcc, make, and other essentials for compiling C/C++ code. Since your setup uses apt-get (indicating a Debian/Ubuntu base), combine it with your existing curl installation for efficiency. Here's an updated Dockerfile snippet:

```dockerfile
FROM python:3.13-slim  # Assuming this or similar; adjust if your base is different

RUN apt-get update && apt-get install -y curl build-essential && rm -rf /var/lib/apt/lists/*

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

RUN mkdir -p /app/cache

ENV PYTHONPATH=/app
```

After this change, rebuild your Docker image with `--platform linux/arm64` if targeting ARM64 explicitly (e.g., on an ARM64 host like Apple M1/M2 or AWS Graviton). Test the build to confirm resolution.

### Potential Workarounds
- **Use a fuller base image**: Switch to `python:3.13` (non-slim) which includes more tools, though it increases image size.
- **Multi-stage build**: Install build-essential in a builder stage, run pip, then copy artifacts to a slim runtime stage to keep the final image lean.
- **Avoid compilation**: If 'madoka' is pulled via a dependency (e.g., pondpond in LiteLLM), pin the parent package to a version without it, as some users have done temporarily.<grok:render card_id="d6598d" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render> However, this might not be ideal if you need the latest features.

### Testing and Verification
After applying the fix, run `docker build --no-cache .` and monitor for successful wheel building. If issues persist, check for additional dependencies in 'madoka's setup (e.g., via its GitHub repo).<grok:render card_id="8cdad7" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">28</argument>
</grok:render> On ARM64 Ubuntu hosts, ensure your Docker supports ARM64 builds natively or via QEMU if cross-building.

---

The Docker build error you're encountering stems from an attempt to install the 'madoka' Python package, which is a specialized library providing an efficient implementation of the Count-Min sketch algorithm—a probabilistic data structure used for approximating frequencies in large data streams with minimal memory usage.<grok:render card_id="08adda" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="67cc12" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render><grok:render card_id="b338a4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">28</argument>
</grok:render> This package, maintained under the repository ikegami-yukino/madoka-python on GitHub, wraps a C++ core library, necessitating compilation of native extensions during installation.<grok:render card_id="47a28a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">28</argument>
</grok:render> Unlike pure Python packages, 'madoka' does not provide prebuilt binary wheels for all platforms and Python versions, particularly for newer ones like Python 3.13 on ARM64 architectures.<grok:render card_id="35bbf9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render> As a result, pip falls back to building the wheel from source, which requires a C++ compiler.

In your provided build log, the process fails at this source build stage with the error "command 'g++' failed: No such file or directory." This is exacerbated in Docker environments using minimal base images (e.g., python:3.13-slim, which is Debian-based and uses apt-get for package management), as these images intentionally exclude development tools to reduce size and attack surface. The log also shows a setuptools deprecation warning regarding license classifiers, but this is unrelated to the failure—it's merely advisory and stems from evolving Python packaging standards.<grok:render card_id="d7a0eb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>

Similar issues have been reported in contexts like the LiteLLM library, where 'madoka' was introduced as a transitive dependency via 'pondpond'.<grok:render card_id="8c682e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render> In one GitHub issue, users noted the lack of wheels for most environments, leading to build failures in clean Docker setups.<grok:render card_id="b79ee0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render> While no ARM64-specific bugs were highlighted, the problem is platform-agnostic when compilers are missing, though ARM64 may require ensuring native toolchains (e.g., avoiding x86 emulation via QEMU, which can introduce compatibility quirks).

To address this on Ubuntu ARM64 (whether as the host or target architecture), the core solution involves equipping the Docker build environment with compilation capabilities. The 'build-essential' metapackage is the standard recommendation, as it bundles g++ (the GNU C++ compiler), gcc, dpkg-dev, make, and libc-dev—everything needed for basic C/C++ builds.<grok:render card_id="21bfcc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render><grok:render card_id="ab9db4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render> On ARM64 Ubuntu, this package installs architecture-appropriate versions automatically. For instance, in related discussions on building Python modules for ARM64, installing gcc and g++ resolved similar compiler-not-found errors.<grok:render card_id="b1f2e0" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render>

Integrating this into your Dockerfile minimizes disruption. Your current setup already includes an apt-get command for curl, so appending 'build-essential' optimizes layer caching and avoids redundant updates. The updated command cleans up apt lists to prevent bloat. If your requirements.txt includes other compile-heavy packages (e.g., those using numpy or scipy, visible in your log like tqdm, typing-inspection), this fix will benefit them too, though they didn't fail here.

For broader context, 'madoka's limited wheel availability—primarily source distributions with occasional platform-specific builds like macOS x86-64—highlights a common challenge in Python packaging for niche libraries.<grok:render card_id="965892" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="d7e97e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">10</argument>
</grok:render> PyPI hosts over 500,000 packages, but many scientific or performance-oriented ones like this rely on users building from source.<grok:render card_id="996fbd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">5</argument>
</grok:render> If avoiding compilation is preferred, alternatives include using probabilistic data structures from more mature libraries like 'probabilistic' or implementing a pure-Python Count-Min sketch, though these may sacrifice efficiency.<grok:render card_id="a74aa4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">29</argument>
</grok:render>

In terms of best practices for Docker on ARM64, consider multi-stage builds to separate build-time dependencies from runtime:

```dockerfile
# Builder stage
FROM python:3.13-slim AS builder
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Runtime stage
FROM python:3.13-slim
COPY --from=builder /usr/local/lib/python3.13/site-packages /usr/local/lib/python3.13/site-packages
COPY . .
RUN mkdir -p /app/cache
ENV PYTHONPATH=/app
```

This keeps the final image slim while ensuring compilation succeeds.

Finally, verify post-fix by inspecting the image for g++ (e.g., via docker run --rm your-image g++ --version) and monitoring for runtime issues. If compilation still fails, check for missing headers or libraries specific to 'madoka' by reviewing its setup.py on GitHub.<grok:render card_id="4142cb" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">28</argument>
</grok:render>

#### Table: Common Dependencies and Their Roles in Building 'madoka'
| Dependency/Package | Role | Installation Command (Debian/Ubuntu) | Notes |
|--------------------|------|--------------------------------------|-------|
| build-essential | Provides core compilers (g++, gcc, make) | `apt-get install -y build-essential` | Essential for any C/C++ extension builds; resolves the g++ error directly. |
| python3-dev | Python development headers for extensions | `apt-get install -y python3-dev` | Often needed alongside build-essential for Python-native integrations; check if required if errors persist. |
| libstdc++-dev | C++ standard library development files | `apt-get install -y libstdc++-dev` | May be implicitly included but useful for std:: issues in C++ code. |
| g++-arm-linux-gnueabihf | Cross-compiler for ARM (if building on x86 host) | `apt-get install -y g++-arm-linux-gnueabihf` | Only if cross-compiling; not needed on native ARM64 Ubuntu. |

This table outlines a progression from basic to advanced fixes, based on similar build scenarios.<grok:render card_id="d6d413" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render><grok:render card_id="98bc97" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">17</argument>
</grok:render>

#### Table: Comparison of Base Docker Images for Python Builds on ARM64
| Image | Includes Build Tools? | Size Impact | Suitability for 'madoka' Build |
|-------|-----------------------|-------------|--------------------------------|
| python:3.13-slim | No | Small (~100MB) | Requires adding build-essential; ideal for production after multi-stage. |
| python:3.13 | Partial (some dev tools) | Medium (~300MB) | May work out-of-box but verify g++; good for development. |
| python:3.13-buster | No (older Debian) | Small | Similar to slim; update to bookworm for better ARM64 support. |
| ubuntu:24.04 (with Python installed) | No by default | Variable | Full OS; add python3-pip and build-essential for flexibility. |

Selecting the right image can prevent recurrence, with slim variants preferred for efficiency.<grok:render card_id="cc4963" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render>

### Key Citations
- [madoka - PyPI](https://pypi.org/project/madoka/)<grok:render card_id="40984e" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render>
- [madoka - PyPI (version 0.2)](https://pypi.org/project/madoka/0.2/)<grok:render card_id="d334b8" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">1</argument>
</grok:render>
- [[Bug]: latest LiteLLM introduced dependency on "madoka" - which ...](https://github.com/BerriAI/litellm/issues/14762)<grok:render card_id="4b2aee" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">12</argument>
</grok:render>
- [Torizon: Building Python modules in Arm64 with aarch64-linux-gnu ...](https://community.toradex.com/t/torizon-building-python-modules-in-arm64-with-aarch64-linux-gnu-gcc/11855)<grok:render card_id="c80cbc" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">15</argument>
</grok:render>
- [Newest 'g++' Questions - Stack Overflow](https://stackoverflow.com/questions/tagged/g%252B%252B)<grok:render card_id="008c41" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">17</argument>
</grok:render>
- [data-sketches · GitHub Topics](https://github.com/topics/data-sketches)<grok:render card_id="ac3abd" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">28</argument>
</grok:render>
- [probabilistic-data-structures · GitHub Topics](https://github.com/topics/probabilistic-data-structures)<grok:render card_id="77d53f" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">29</argument>
</grok:render>
