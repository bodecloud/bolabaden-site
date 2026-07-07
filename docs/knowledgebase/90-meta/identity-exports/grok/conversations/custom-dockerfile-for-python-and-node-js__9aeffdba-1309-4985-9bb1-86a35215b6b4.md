---
source_url: "https://grok.com/c/9aeffdba-1309-4985-9bb1-86a35215b6b4"
conversation_id: "9aeffdba-1309-4985-9bb1-86a35215b6b4"
title: "Custom Dockerfile for Python and Node.js"
extracted_at: "2026-06-29T16:27:00.252Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Custom Dockerfile for Python and Node.js

Source: [Grok conversation](https://grok.com/c/9aeffdba-1309-4985-9bb1-86a35215b6b4)

## User

_Time: 2025-06-12T06:14:53.852Z_

find a Dockerfile image that's the combined form of `python:slim` and `node:slim`

## Assistant

_Time: 2025-06-12T06:15:14.552Z_

There isn’t an official Dockerfile image that directly combines `python:slim` and `node:slim` in the Docker Hub repositories. However, you can create a custom Dockerfile that merges these two images to include both Python and Node.js in a minimal footprint. Below is an example of how to build such an image based on the latest `python:slim` and `node:slim` images, ensuring a lightweight result.

### Custom Dockerfile for Python and Node.js
Here’s a Dockerfile that starts with `python:slim` and adds Node.js, or vice versa, optimized for size:

```dockerfile
# Start with python:slim (based on Debian)
FROM python:slim

# Install Node.js and npm
RUN apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - && \
    apt-get install -y --no-install-recommends nodejs && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Verify installations
RUN python --version && node --version && npm --version

# Set working directory
WORKDIR /app

# Optional: Add any additional setup (e.g., pip or npm install)
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt
# COPY package.json .
# RUN npm install

CMD ["bash"]
```

### Explanation
- **Base Image**: Uses `python:slim` (based on Debian) as the starting point to keep the image lightweight.
- **Node.js Installation**: Installs Node.js LTS via the NodeSource repository, ensuring compatibility and minimal dependencies.
- **Cleanup**: Removes temporary files and apt cache to reduce image size.
- **Verification**: Checks versions of Python, Node.js, and npm to confirm successful installation.
- **Working Directory**: Sets `/app` for your application code.
- **Optional Setup**: Uncomment the commented lines if you need to install Python or Node.js dependencies.

### Alternative Approach
If you prefer starting with `node:slim` and adding Python, here’s an alternative Dockerfile:

```dockerfile
# Start with node:slim (based on Debian)
FROM node:slim

# Install Python
RUN apt-get update && \
    apt-get install -y --no-install-recommends python3 python3-pip python3-venv && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Verify installations
RUN python3 --version && node --version && npm --version

# Set working directory
WORKDIR /app

# Optional: Add any additional setup
# COPY requirements.txt .
# RUN pip3 install --no-cache-dir -r requirements.txt
# COPY package.json .
# RUN npm install

CMD ["bash"]
```

### Key Considerations
- **Size**: Both `python:slim` and `node:slim` are based on Debian, so combining them avoids redundant layers. The resulting image will be larger than either individually but smaller than using non-slim variants.
- **Version Compatibility**: The example uses the latest `python:slim` (Python 3.12 as of June 2025) and `node:slim` (Node.js 20 LTS). Specify versions (e.g., `python:3.11-slim`, `node:18-slim`) if needed.
- **Use Case**: This image is ideal for applications requiring both Python and Node.js, like full-stack apps with a Python backend and Node.js frontend build tools.

### Building and Using the Image
1. Save the Dockerfile in a directory.
2. Build the image:
   ```bash
   docker build -t python-node-slim .
   ```
3. Run a container:
   ```bash
   docker run -it python-node-slim
   ```

### Existing Images
While no official `python-node-slim` image exists, some community images on Docker Hub combine Python and Node.js. However, they may not be as minimal:
- Search Docker Hub for terms like `python node slim` to find unofficial images.
- Example: Images like `nikolaik/python-nodejs` exist but are often based on heavier base images or include additional tools.

### Recommendation
For maximum control and minimal size, use the custom Dockerfile above. If you need a pre-built image, check Docker Hub for community options, but verify their trustworthiness and size. If you want me to search Docker Hub or X for specific community images, let me know!
