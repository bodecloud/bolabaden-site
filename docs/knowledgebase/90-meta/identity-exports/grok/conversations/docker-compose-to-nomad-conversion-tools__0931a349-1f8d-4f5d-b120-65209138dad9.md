---
source_url: "https://grok.com/c/0931a349-1f8d-4f5d-b120-65209138dad9"
conversation_id: "0931a349-1f8d-4f5d-b120-65209138dad9"
title: "Docker Compose to Nomad Conversion Tools"
extracted_at: "2026-06-29T16:25:33.523Z"
message_count: 5
export_suite: "identity"
provenance: grok-rest-api
---

# Docker Compose to Nomad Conversion Tools

Source: [Grok conversation](https://grok.com/c/0931a349-1f8d-4f5d-b120-65209138dad9)

## User

_Time: 2025-08-11T16:24:00.486Z_

Search for projects that attempt to unify or bridge nomad and docker-compose.yaml.
 
I am looking for something like kompose (converter from docker-compose.yaml to kubernetes) but from docker-compose.yaml to nomad hcl. search github/reddit exhaustively and comprehensively, find something that exists.

## Assistant

_Time: 2025-08-11T16:29:49.737Z_

Several projects exist that aim to convert Docker Compose YAML files to Nomad HCL job specifications, similar to how Kompose handles conversions to Kubernetes manifests. These tools vary in maturity, features, and maintenance status. Below is a comprehensive overview based on exhaustive searches across GitHub and Reddit, focusing on existing implementations. I have prioritized actively maintained or functional projects while noting limitations.

### Key Projects Identified

1. **compose-to-nomad (by kocierik)**  
   This Go-based tool converts Docker Compose configurations to Nomad job specification files. It processes a Docker Compose YAML file and generates corresponding Nomad HCL files in a specified output directory.  
   - **Features**: Supports image specification, port mapping, environment variables, volume mapping, health checks, and services.  
   - **Installation and Usage**: Requires Go to be installed. Run with `go run cmd/main.go -compose-file <path-to-compose.yml> -output-dir <output-directory>`. Example files are provided in the repository.  
   - **Status**: Active, with recent commits. Contributions are welcome.  
   - **Limitations**: Only supports the listed features; other Docker Compose elements may not convert fully.  
   - **Repository**: https://github.com/kocierik/compose-to-nomad<grok:render card_id="0b998a" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">132</argument>
</grok:render> (also referenced in a Reddit post where the developer announced the project<grok:render card_id="9244b9" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">129</argument>
</grok:render>).

2. **compose-to-nomad (by uchenic)**  
   A command-line tool that converts Docker Compose files (version 3 or higher) to Nomad job files. It allows optional prefixes for Docker registry URLs and file hosting bases, which is useful for local images pushed to a registry.  
   - **Features**: Basic conversion of services, with support for registry and file URL customization. Includes example files for testing.  
   - **Installation and Usage**: Requires Python 3.8+ and a Go compiler. Install via `pip install ComposeNomadConvertor`. Run with `nomadgen <compose_file> <nomad_job_file> [--registry_base <url>] [--files_url_base <url>]`.  
   - **Status**: Described as immature software; no releases published. Pull requests are encouraged for improvements.  
   - **Limitations**: May not always produce expected results due to its early stage. Users must manually push local images to a registry if using the `--registry_base` option.  
   - **Repository**: https://github.com/uchenic/compose-to-nomad<grok:render card_id="e6a5a4" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">133</argument>
</grok:render>.

3. **nomad-compose (by jovandeginste)**  
   A script that transforms Docker Compose YAML files into Nomad job templates, resolving `extends` stanzas and allowing Nomad-specific labels (e.g., for counts, datacenters, and constraints) to be added directly in the Compose file.  
   - **Features**: Generates single-task Nomad jobs; supports custom labels like `nomad.count: 1` or `nomad.constraints._cluster.attribute: '${meta.role}'`.  
   - **Installation and Usage**: No explicit installation steps; run the script with `./compose2nomad <compose.yml> [servicename]`.  
   - **Status**: Archived and read-only since July 2022; no further development.  
   - **Limitations**: Only generates single tasks (despite Nomad and Compose supporting multiples). Additional Nomad options are planned but unimplemented.  
   - **Repository**: https://github.com/jovandeginste/nomad-compose<grok:render card_id="0e9733" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">130</argument>
</grok:render>.

4. **compose2hcl (by JohnVidler)**  
   A browser-based tool that parses Docker Compose files using a recursive descent parser and outputs Nomad HCL files. Developed primarily for experimentation.  
   - **Features**: In-browser conversion and display of results; uses custom fonts (requires internet).  
   - **Installation and Usage**: Clone the repository and open `index.html` in a browser. A demo is available at https://johnvidler.github.io/compose2hcl/.  
   - **Status**: Explicitly marked as "Very Work-In-Progress."  
   - **Limitations**: Not suitable for production use; requires internet for fonts; limited to basic conversions.  
   - **Repository**: https://github.com/JohnVidler/compose2hcl<grok:render card_id="a7b507" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">128</argument>
</grok:render>.

### Additional Notes
- No evidence was found that Kompose (the Kubernetes converter) supports Nomad conversions, despite occasional mentions in discussions. Its documentation confirms focus on Kubernetes and OpenShift only<grok:render card_id="046b66" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">131</argument>
</grok:render>.
- Broader discussions on Reddit (e.g., in r/devops and r/hashicorp) and HashiCorp forums highlight manual translation as a common alternative, but emphasize these tools for automation. For instance, users report using Nomad in development to replace Docker Compose entirely, though this does not directly convert files<grok:render card_id="bbba5b" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">0</argument>
</grok:render><grok:render card_id="97f7c6" card_type="citation_card" type="render_inline_citation">
<argument name="citation_id">106</argument>
</grok:render>.
- If none of these fully meet requirements, consider forking and extending one, as most welcome contributions. Exhaustive searches did not reveal additional active converters beyond these.

## User

_Time: 2025-08-11T16:42:28.661Z_

(compose-to-nomad) ubuntu@micklethefickle:~/my-media-stack/src/compose-to-nomad/composenomadconvertor$ python3 nomadgen ../../../docker-compose.yml ../../../nomad_test_convert_job_output.hcl
Traceback (most recent call last):
  File "/home/ubuntu/my-media-stack/src/compose-to-nomad/composenomadconvertor/nomadgen", line 7, in <module>
    main(args)
  File "/home/ubuntu/my-media-stack/src/compose-to-nomad/composenomadconvertor/produce_tasks.py", line 164, in main
    l = ComposeParser(filepath)
        ^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/ubuntu/my-media-stack/src/compose-to-nomad/.venv/lib/python3.12/site-packages/composeparser/parse.py", line 13, in __init__
    self.lib = ctypes.CDLL(os.path.join(abs_path,"libparse.so"))
               ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  File "/home/ubuntu/.local/share/uv/python/cpython-3.12.11-linux-aarch64-gnu/lib/python3.12/ctypes/__init__.py", line 379, in __init__
    self._handle = _dlopen(self._name, mode)
                   ^^^^^^^^^^^^^^^^^^^^^^^^^
OSError: /home/ubuntu/my-media-stack/src/compose-to-nomad/.venv/lib/python3.12/site-packages/libparse.so: cannot open shared object file: No such file or directory
 
how to fix on ubuntu?

## Assistant

_Time: 2025-08-11T16:42:33.880Z_



## Assistant

_Time: 2025-08-11T16:43:05.974Z_

The error you encountered while running the `compose-to-nomad` tool (specifically the `uchenic/compose-to-nomad` project) indicates that the Python script `nomadgen` is unable to locate the shared library `libparse.so`. This library is required for parsing Docker Compose files and is likely a compiled Go component used by the tool. The error suggests that `libparse.so` is either missing or not properly installed in the expected location. Below is a step-by-step guide to resolve this issue on an Ubuntu system.

### Steps to Fix the Issue

1. **Verify Prerequisites**  
   The `uchenic/compose-to-nomad` tool requires Python 3.8+ and a Go compiler, as it uses a Go-based shared library (`libparse.so`) alongside Python scripts. Ensure these are installed:  
   - **Install Python**: Ubuntu typically includes Python 3. Check your version with:
     ```bash
     python3 --version
     ```
     If Python 3.8 or higher is not installed, install it:
     ```bash
     sudo apt update
     sudo apt install python3.8 python3-pip
     ```
   - **Install Go**: Check if Go is installed with:
     ```bash
     go version
     ```
     If not installed, follow these steps:
     ```bash
     sudo apt install golang-go
     ```
     Alternatively, download the latest Go version from https://go.dev/dl/ and follow their installation instructions.

2. **Check for `libparse.so`**  
   The error indicates that `libparse.so` is missing from the expected path (`/home/ubuntu/my-media-stack/src/compose-to-nomad/.venv/lib/python3.12/site-packages/`). This file is typically generated by compiling the Go code in the repository.  
   - Navigate to the `compose-to-nomad` repository directory:
     ```bash
     cd ~/my-media-stack/src/compose-to-nomad
     ```
   - Check if `libparse.so` exists in the repository or virtual environment:
     ```bash
     find . -name "libparse.so"
     ```
   - If the file is not found, you need to compile it from the Go source code.

3. **Compile the Go Library (`libparse.so`)**  
   The repository likely includes Go code in a subdirectory (e.g., `libparse`) that needs to be compiled into `libparse.so`. Follow these steps:  
   - Locate the Go source code for the parser. It is typically in a directory like `libparse` or similar. Check the repository structure:
     ```bash
     ls -R
     ```
   - If you find a directory with `.go` files (e.g., `libparse`), compile it:
     ```bash
     cd <directory-containing-go-files>
     go build -buildmode=c-shared -o libparse.so .
     ```
     This command generates `libparse.so` and a corresponding header file (`libparse.h`).  
   - Move the generated `libparse.so` to the expected location:
     ```bash
     mv libparse.so /home/ubuntu/my-media-stack/src/compose-to-nomad/.venv/lib/python3.12/site-packages/
     ```
     Adjust the path if your virtual environment is elsewhere.

4. **Ensure Correct File Permissions**  
   Ensure `libparse.so` has appropriate permissions:  
   ```bash
   chmod +x /home/ubuntu/my-media-stack/src/compose-to-nomad/.venv/lib/python3.12/site-packages/libparse.so
   ```

5. **Reinstall the Package**  
   If compiling `libparse.so` manually does not work, the issue might stem from an incomplete installation. Reinstall the package:  
   - Activate your virtual environment (if not already activated):
     ```bash
     source ~/my-media-stack/src/compose-to-nomad/.venv/bin/activate
     ```
   - Reinstall the package using `pip`:
     ```bash
     pip uninstall ComposeNomadConvertor
     pip install .
     ```
     If you’re installing from the GitHub repository directly:
     ```bash
     pip install git+https://github.com/uchenic/compose-to-nomad.git
     ```

6. **Verify Library Dependencies**  
   The `libparse.so` file may depend on system libraries. Check for missing dependencies using `ldd`:  
   ```bash
   ldd /home/ubuntu/my-media-stack/src/compose-to-nomad/.venv/lib/python3.12/site-packages/libparse.so
   ```
   If any dependencies are missing (e.g., `libc`, `libm`), install them:
   ```bash
   sudo apt install libc6-dev
   ```

7. **Test the Command Again**  
   After ensuring `libparse.so` is in place, retry the command:  
   ```bash
   python3 nomadgen ../../../docker-compose.yml ../../../nomad_test_convert_job_output.hcl
   ```
   If you’re in the virtual environment, you can simply run:
   ```bash
   nomadgen ../../../docker-compose.yml ../../../nomad_test_convert_job_output.hcl
   ```

8. **Alternative: Check for Prebuilt `libparse.so`**  
   If the repository includes a prebuilt `libparse.so` (check the repository’s releases or directories), copy it to the correct location instead of compiling. For example:
   ```bash
   cp <path-to-prebuilt-libparse.so> /home/ubuntu/my-media-stack/src/compose-to-nomad/.venv/lib/python3.12/site-packages/
   ```

9. **Fallback: Contact the Developer or Check Issues**  
   The `uchenic/compose-to-nomad` project is described as immature, and this issue may be known. Check the GitHub issues page (https://github.com/uchenic/compose-to-nomad/issues) for similar reports. If none exist, consider opening an issue with the error details, including your Ubuntu version (e.g., `lsb_release -a`) and Python/Go versions.

### Additional Considerations
- **Architecture Compatibility**: The error occurred on an `aarch64` (ARM64) system. Ensure the Go compiler and any prebuilt `libparse.so` are compatible with ARM64. If the repository provides x86_64 binaries, you must compile `libparse.so` on your system to match the architecture.
- **Virtual Environment Path**: Double-check that the virtual environment path (`/home/ubuntu/my-media-stack/src/compose-to-nomad/.venv/`) is correct. If you created the virtual environment elsewhere, adjust paths accordingly.
- **Alternative Tools**: If this tool remains problematic, consider trying the `kocierik/compose-to-nomad` tool (https://github.com/kocierik/compose-to-nomad), which is more actively maintained and may have fewer setup issues. Install it with:
  ```bash
  go get github.com/kocierik/compose-to-nomad
  go run cmd/main.go -compose-file ../../../docker-compose.yml -output-dir .
  ```

### Troubleshooting Tips
If the issue persists:  
- Run the command with debugging enabled (if supported) or check for verbose output options in the documentation.
- Ensure your Docker Compose file is valid (`docker-compose config` can validate it).
- Share the full repository structure or relevant error logs with the developer for further assistance.

This approach should resolve the `libparse.so` error by ensuring the library is either compiled or correctly placed in your environment. Let me know if you encounter further errors or need help with specific steps!
