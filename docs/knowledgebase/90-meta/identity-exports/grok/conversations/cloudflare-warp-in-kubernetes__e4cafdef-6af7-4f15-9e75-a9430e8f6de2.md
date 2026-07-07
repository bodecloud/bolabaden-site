---
source_url: "https://grok.com/c/e4cafdef-6af7-4f15-9e75-a9430e8f6de2"
conversation_id: "e4cafdef-6af7-4f15-9e75-a9430e8f6de2"
title: "Cloudflare WARP in Kubernetes"
extracted_at: "2026-06-29T16:27:28.283Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# Cloudflare WARP in Kubernetes

Source: [Grok conversation](https://grok.com/c/e4cafdef-6af7-4f15-9e75-a9430e8f6de2)

## User

_Time: 2025-06-01T11:41:30.822Z_

Project similar to warp-docker (cloudflare warp in docker) but for kubernetes

## Assistant

_Time: 2025-06-01T11:45:01.136Z_

### Key Points
- You can likely run Cloudflare WARP in Kubernetes by deploying a Docker image like [cmj2002/warp-docker](https://github.com/cmj2002/warp-docker) as a pod and using it as a SOCKS5 proxy.
- Other pods can route their outbound traffic through WARP by setting proxy environment variables to point to the WARP pod’s service.
- An alternative approach using Cloudflare Tunnel with WARP routing exists, but it’s more suited for exposing services than routing outbound traffic.
- Configuration may require WARP license keys or authentication, depending on the Docker image used.
- No widely recognized, dedicated Kubernetes-specific WARP project was found, but adapting Docker-based solutions appears feasible.

### Overview
To run Cloudflare WARP in a Kubernetes environment, similar to how warp-docker operates in Docker, you can deploy a WARP client within a Kubernetes pod and configure other pods to use it as a proxy. This setup allows specific pods to route their outbound internet traffic through Cloudflare’s WARP service, enhancing privacy and security. Alternatively, Cloudflare Tunnel with WARP routing can be used, but it primarily focuses on exposing Kubernetes services to the internet rather than routing outbound traffic.

### Recommended Approach
The most straightforward method is to use an existing Docker image designed for Cloudflare WARP, such as [cmj2002/warp-docker](https://github.com/cmj2002/warp-docker). Deploy this image as a pod in your Kubernetes cluster, expose its SOCKS5 proxy port (typically 1080), and configure other pods to route their traffic through this proxy. This mirrors the functionality of warp-docker, where the WARP client runs inside a container and provides a proxy for other containers.

### Alternative Approach
Another option is to use Cloudflare Tunnel (formerly Argo Tunnel) with WARP routing enabled, as shown in a [GitHub Gist](https://gist.github.com/andymotta/5919912e348f8a85b159d35e0901b38e). This approach involves deploying the `cloudflared` daemon in Kubernetes to create a secure tunnel to Cloudflare’s network. However, it’s primarily designed for exposing internal services to the internet, which may not fully align with routing outbound traffic from pods through WARP.

### Considerations
- **Configuration Needs**: Ensure the WARP client is properly authenticated, which may involve setting environment variables like `WARP_LICENSE_KEY` for WARP+ subscriptions.
- **Networking**: Verify that pods can communicate with the WARP service within the cluster, and consider network policies if needed.
- **Limitations**: The SOCKS5 proxy approach may not support all protocols, so test compatibility with your applications.

---

### Detailed Report on Running Cloudflare WARP in Kubernetes

#### Introduction
Cloudflare WARP is a VPN service that routes internet traffic through Cloudflare’s network to enhance privacy and security. The warp-docker project, such as [cmj2002/warp-docker](https://github.com/cmj2002/warp-docker), packages the WARP client into a Docker container, typically exposing a SOCKS5 proxy for other containers to use. To achieve similar functionality in Kubernetes, you can deploy a WARP-enabled pod and configure other pods to route their outbound traffic through it. Alternatively, Cloudflare Tunnel with WARP routing offers a way to connect Kubernetes services to Cloudflare’s network, though it’s more suited for inbound traffic scenarios.

#### Primary Solution: Using warp-docker in Kubernetes
The most direct way to replicate warp-docker’s functionality in Kubernetes is to deploy a Docker image that runs the Cloudflare WARP client, such as [cmj2002/warp-docker](https://github.com/cmj2002/warp-docker). This image runs the WARP client and exposes a SOCKS5 proxy on port 1080, which other pods can use to route their traffic.

##### Steps to Deploy
1. **Create a Kubernetes Deployment**:
   Deploy a pod using the warp-docker image. Below is an example Kubernetes Deployment configuration:

<xaiArtifact artifact_id="73969e72-f7fd-4f52-9391-23d28443c43e" artifact_version_id="eb26f806-653b-4a32-ae73-8babae5271b4" title="WARP Deployment YAML" contentType="text/yaml">
apiVersion: apps/v1
kind: Deployment
metadata:
  name: warp
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: warp
  template:
    metadata:
      labels:
        app: warp
    spec:
      containers:
      - name: warp
        image: cmj2002/warp-docker:latest
        ports:
        - containerPort: 1080
        env:
        - name: WARP_LICENSE_KEY
          value: "your-warp-plus-license-key" # Optional, for WARP+ subscription
        - name: GOST_ARGS
          value: "-L :1080" # Default SOCKS5 proxy port
</xaiArtifact>

2. **Expose the WARP Pod as a Service**:
   Create a Kubernetes Service to make the SOCKS5 proxy accessible within the cluster:

<xaiArtifact artifact_id="9975f42c-4727-4cd2-a6af-89ff7b1b6994" artifact_version_id="8ff52fc2-8cac-4136-98b4-d393f8a26d9f" title="WARP Service YAML" contentType="text/yaml">
apiVersion: v1
kind: Service
metadata:
  name: warp-service
  namespace: default
spec:
  selector:
    app: warp
  ports:
  - protocol: TCP
    port: 1080
    targetPort: 1080
</xaiArtifact>

3. **Configure Other Pods**:
   In pods that need to route traffic through WARP, set environment variables to use the WARP service as a proxy:

<xaiArtifact artifact_id="1d01f741-d8e6-4d10-bcfa-1400d850916a" artifact_version_id="9a2dc6fd-0927-4da5-b239-57c79ae5f1c4" title="Example Pod Using WARP Proxy" contentType="text/yaml">
apiVersion: v1
kind: Pod
metadata:
  name: example-pod
  namespace: default
spec:
  containers:
  - name: example
    image: your-application-image
    env:
    - name: HTTP_PROXY
      value: "socks5://warp-service:1080"
    - name: HTTPS_PROXY
      value: "socks5://warp-service:1080"
    - name: NO_PROXY
      value: "localhost,127.0.0.1"
</xaiArtifact>

##### Configuration Notes
- **WARP_LICENSE_KEY**: If you have a WARP+ subscription, provide the license key as an environment variable. This is optional for the free tier.
- **GOST_ARGS**: The default setting (`-L :1080`) configures the container to listen on port 1080 for SOCKS5 and HTTP proxies. Adjust if needed, and update port mappings accordingly.
- **Persistence**: Some warp-docker images, like [aleskxyz/warp-svc](https://github.com/aleskxyz/warp-svc), recommend mounting `/var/lib/cloudflare-warp` to persist WARP account configurations, as WARP+ licenses are limited to a few devices.

##### Networking Considerations
- Ensure that the WARP service is accessible within the Kubernetes cluster. Use the service name (`warp-service`) in the proxy settings.
- If network policies are in place, allow traffic from other pods to the WARP service on port 1080.
- Test the proxy setup to confirm that applications support SOCKS5, as some protocols may require additional configuration.

#### Alternative Solution: Cloudflare Tunnel with WARP Routing
An alternative approach involves using Cloudflare Tunnel with WARP routing enabled, as outlined in a [GitHub Gist](https://gist.github.com/andymotta/5919912e348f8a85b159d35e0901b38e). This method deploys the `cloudflared` daemon in Kubernetes to create a secure tunnel to Cloudflare’s network, potentially allowing WARP clients to access cluster resources or route traffic.

##### Configuration Overview
The Gist uses Terraform to set up a Cloudflare Tunnel and Kubernetes resources to deploy `cloudflared`. Key components include:

| **Component**              | **Details**                                                                 |
|----------------------------|-----------------------------------------------------------------------------|
| **Terraform Resources**    | Creates a Cloudflare Tunnel, virtual network, and route using `api_token`, `account_id`, and `name`. |
| **Kubernetes Namespace**   | `vpn` namespace for WARP-related resources.                                  |
| **Kubernetes Secrets**     | `cloudflared-creds` with `creds.json` containing tunnel credentials.         |
| **Kubernetes ConfigMap**   | `tunnel-zt` with `config.yaml` enabling WARP routing (`warp-routing: enabled: true`). |
| **Kubernetes Deployment**  | Runs `cloudflare/cloudflared:2022.5.3` with 2 replicas, mounts configs, and exposes metrics on port 8081. |

##### Limitations
- This setup is primarily designed for exposing Kubernetes services to the internet or allowing WARP clients to access private networks, not for routing outbound pod traffic through WARP.
- The `warp-routing` feature enables traffic from WARP clients to reach the tunnel, which may not align with the user’s goal of routing pod traffic outbound through WARP.

#### Comparison of Approaches
| **Approach**                | **Pros**                                                                 | **Cons**                                                                 |
|-----------------------------|--------------------------------------------------------------------------|--------------------------------------------------------------------------|
| **warp-docker in Kubernetes**| Simple to deploy, directly mimics warp-docker, flexible for specific pods. | Requires proxy configuration, may not support all protocols, less integrated. |
| **Cloudflare Tunnel**       | Official Cloudflare support, robust for exposing services, scalable.      | Focused on inbound traffic, complex setup, may not meet outbound routing needs. |

#### Additional Considerations
- **Authentication**: Ensure the WARP client is authenticated. For warp-docker images, follow the repository’s instructions (e.g., [cmj2002/warp-docker](https://github.com/cmj2002/warp-docker) requires logging in via `docker-compose logs` for initial setup).
- **Scalability**: For high availability, consider multiple replicas of the WARP pod and a ClusterIP or Headless Service.
- **Alternative Images**: Other warp-docker images, like [aleskxyz/warp-svc](https://github.com/aleskxyz/warp-svc) or [taichunmin/docker-cloudflare-warp](https://github.com/taichunmin/docker-cloudflare-warp), may offer additional features or smaller footprints (e.g., Alpine-based images).
- **Cluster-Wide Routing**: If you need all cluster traffic to go through WARP, consider a service mesh or egress gateway, but this is complex and may require custom network configurations.

#### Conclusion
For a solution similar to warp-docker in Kubernetes, deploying a WARP-enabled Docker image as a pod and using it as a SOCKS5 proxy is the most practical approach. The [cmj2002/warp-docker](https://github.com/cmj2002/warp-docker) image is a good starting point due to its active maintenance and clear documentation. The Cloudflare Tunnel approach, while powerful, is better suited for exposing services rather than routing outbound traffic. Always test the setup to ensure compatibility with your applications and network policies.

### Key Citations
- [Run Cloudflare WARP in Docker](https://github.com/cmj2002/warp-docker)
- [Deploy Cloudflare WARP on Kubernetes](https://gist.github.com/andymotta/5919912e348f8a85b159d35e0901b38e)
- [Cloudflare WARP client as SOCKS5 server](https://github.com/aleskxyz/warp-svc)
- [Docker image for Cloudflare Warp](https://github.com/taichunmin/docker-cloudflare-warp)
- [Cloudflare Helm Charts](https://github.com/cloudflare/helm-charts)
- [Use cloudflared to expose Kubernetes app](https://developers.cloudflare.com/cloudflare-one/tutorials/many-cfd-one-tunnel/)
- [Kubernetes with Cloudflare Zero Trust](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/deployment-guides/kubernetes/)
- [WARP Connector documentation](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/private-net/warp-connector/)
- [Route traffic with WARP](https://developers.cloudflare.com/cloudflare-one/connections/connect-devices/warp/configure-warp/route-traffic/)
- [Create private networks with WARP-to-WARP](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/private-net/warp-to-warp/)
- [WARP routing flag issue](https://github.com/cloudflare/cloudflared/issues/1010)
- [Securely access network with Cloudflare Tunnel](https://simplyexplained.com/blog/securely-access-home-network-with-Cloudflare-Tunnel-and-WARP/)
- [Connect private networks with cloudflared](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/private-net/cloudflared/)
- [Getting Started with Cloudflare WARP](https://adamtheautomator.com/cloudflare-warp/)
- [Route domains through Cloudflare WARP](https://superuser.com/questions/1796731/route-certain-domains-through-cloudflare-warp)
- [Cloudflare Tunnel client repository](https://github.com/cloudflare/cloudflared)
- [Kubito Cloudflared Helm Chart](https://artifacthub.io/packages/helm/kubitodev/cloudflared)
- [Cloudflare Tunnel Helm Chart Setup](https://bobcares.com/blog/cloudflare-tunnel-helm-chart/)
- [Cloudflare WARP Ingress Controller issue](https://github.com/cloudflare/cloudflare-ingress-controller/issues/7)

## User

_Time: 2025-06-01T11:47:40.958Z_

```

  jackett:
    # 🔹🔹 Jackett 🔹🔹
    depends_on:
      flaresolverr:
        condition: service_healthy
      warp:
        condition: service_healthy
    image: linuxserver/jackett
    container_name: jackett
    network_mode: service:warp
    <<: [*common-uidgid, *common-logging, *resource-limits]
    volumes:
      - ${CONFIG_PATH:-./configs}/jackett/config:/config
      - ${CONFIG_PATH:-./configs}/jackett/blackhole:/downloads
    environment:
      <<: *common-env
      AUTO_UPDATE: "true" #optional
      RUN_OPTS: "" #optional
  warp:
    # 🔹🔹 Cloudflare WARP 🔹🔹
    # Cloudflare WARP is a VPN service that allows you to bypass censorship and access the internet privately.
    # Use this for all services that don't need listening ports exposed
#    build:
#      context: .
#      dockerfile: Dockerfile.warp
#      args:
#        GOST_VERSION: 2.12.0
#        TARGETPLATFORM: linux/arm64 # or linux/arm64, or leave out for automatic
    image: caomingjun/warp:latest
    container_name: warp
    extra_hosts: *gluetun-hosts-workaround
    networks:
      publicnet:
        ipv4_address: ${WARP_IPV4_ADDRESS:-10.76.128.97}
    # add removed rule back (https://github.com/opencontainers/runc/pull/3468)
    device_cgroup_rules:
      - 'c 10:200 rwm'
    expose:
      - 1080  # WARP SOCKS5 Proxy
      - 9117    # Jackett
    ports:
      - 1080:1080  # WARP SOCKS5 Proxy
      - 9117:9117     # Jackett direct http
    environment:
      - WARP_SLEEP=2
    cap_add:
      # Docker already have them, these are for podman users
      - MKNOD
      - AUDIT_WRITE
      # additional required cap for warp, both for podman and docker
      - NET_ADMIN
    sysctls:
      - net.ipv6.conf.all.disable_ipv6=1
      - net.ipv4.conf.all.src_valid_mark=1
      # uncomment for nat
      # - net.ipv4.ip_forward=1
      # - net.ipv6.conf.all.forwarding=1
      # - net.ipv6.conf.all.accept_ra=2
    volumes:
      - ./data:/var/lib/cloudflare-warp
    labels:
      deunhealth.restart.on.unhealthy: "true"
      traefik.enable: "true"
      # Jackett reverse proxy HTTPS.
      traefik.http.routers.jackett.rule: Host(`jackett.${DOMAIN}`) || Host(`jackett.${DUCKDNS_DOMAIN}`) || Host(`jackett.${TS_SUBDOMAIN}.duckdns.org`)
      traefik.http.routers.jackett.service: jackett
      traefik.http.services.jackett.loadbalancer.server.port: 9117
```

how to do something like this though for kubernetes/helm?

## Assistant

_Time: 2025-06-01T11:52:36.538Z_

To replicate the Docker Compose setup for Jackett and Cloudflare WARP in Kubernetes using Helm, you can create a custom Helm chart that deploys a single pod containing both the Jackett and WARP containers. These containers share the same network namespace, allowing Jackett’s outbound traffic to route through the WARP VPN, similar to the `network_mode: service:warp` configuration in Docker Compose. Below is a straightforward guide to achieve this, followed by a detailed explanation of the setup.

### Key Points
- **Shared Network Namespace**: Running Jackett and WARP in the same Kubernetes pod ensures Jackett’s traffic uses WARP’s VPN, mimicking the Docker Compose setup.
- **Custom Helm Chart**: A custom chart is recommended since existing Jackett charts may not easily support adding a WARP sidecar container.
- **Privileged Mode for WARP**: The WARP container likely requires privileged mode or specific capabilities to manage the VPN’s TUN device.
- **Persistent Storage**: Use PersistentVolumeClaims (PVCs) for WARP and Jackett data to maintain configurations across pod restarts.
- **Service Exposure**: Expose Jackett’s port (9117) via a Kubernetes Service for cluster access, with optional Ingress for external access.

### Prerequisites
- A Kubernetes cluster with Helm installed.
- Access to a container registry for pulling `caomingjun/warp:latest` and `linuxserver/jackett:latest` images.
- Basic familiarity with Helm and Kubernetes YAML configurations.

### Steps to Deploy
1. **Create a Helm Chart**:
   Run `helm create jackett-warp` to generate a chart directory, then customize the templates as shown below.

2. **Configure `values.yaml`**:
   Define image details, environment variables, and storage sizes for both containers.

3. **Define Kubernetes Resources**:
   Create a Deployment with both containers, PVCs for storage, and a Service to expose Jackett.

4. **Install the Chart**:
   Use `helm install` to deploy the chart, then verify the setup.

5. **Optional Ingress Setup**:
   Configure an Ingress resource or reverse proxy (e.g., Traefik) for external access to Jackett.

### Helm Chart Overview
The Helm chart includes:
- A Deployment with a pod containing WARP and Jackett containers.
- PVCs for persistent storage of WARP and Jackett data.
- A Service to expose Jackett’s port 9117 within the cluster.

Below are the key artifacts for the Helm chart.

<xaiArtifact artifact_id="4eea781e-d27b-4f43-9bdd-89b50e580cb2" artifact_version_id="87099691-fc00-42b9-b2d0-7cd7d3b69a47" title="values.yaml" contentType="text/yaml">
warp:
  image: caomingjun/warp:latest
  env:
    WARP_SLEEP: "2"
  volumeSize: 1Gi

jackett:
  image: linuxserver/jackett
  tag: latest
  env:
    AUTO_UPDATE: "true"
    RUN_OPTS: ""
  configVolumeSize: 1Gi
  downloadsVolumeSize: 10Gi

service:
  type: ClusterIP
  port: 9117
</xaiArtifact>

<xaiArtifact artifact_id="4b5708bf-af42-4d28-a415-3b4174bf6ddc" artifact_version_id="6825f814-d1ee-46a3-8344-cfc7c476dfd0" title="deployment.yaml" contentType="text/yaml">
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ .Release.Name }}-jackett-warp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: {{ .Release.Name }}-jackett-warp
  template:
    metadata:
      labels:
        app: {{ .Release.Name }}-jackett-warp
    spec:
      containers:
      - name: warp
        image: {{ .Values.warp.image }}
        env:
        - name: WARP_SLEEP
          value: {{ .Values.warp.env.WARP_SLEEP | quote }}
        securityContext:
          privileged: true
        volumeMounts:
        - name: warp-data
          mountPath: /var/lib/cloudflare-warp
      - name: jackett
        image: {{ .Values.jackett.image }}:{{ .Values.jackett.tag }}
        env:
        - name: AUTO_UPDATE
          value: {{ .Values.jackett.env.AUTO_UPDATE | quote }}
        - name: RUN_OPTS
          value: {{ .Values.jackett.env.RUN_OPTS | quote }}
        volumeMounts:
        - name: jackett-config
          mountPath: /config
        - name: jackett-downloads
          mountPath: /downloads
        ports:
        - containerPort: 9117
      volumes:
      - name: warp-data
        persistentVolumeClaim:
          claimName: {{ .Release.Name }}-warp-data
      - name: jackett-config
        persistentVolumeClaim:
          claimName: {{ .Release.Name }}-jackett-config
      - name: jackett-downloads
        persistentVolumeClaim:
          claimName: {{ .Release.Name }}-jackett-downloads
</xaiArtifact>

<xaiArtifact artifact_id="78dca3d8-eb40-4551-b343-63eeca374705" artifact_version_id="be4b09bc-172b-46b4-bf2f-6c34feea1b6d" title="pvc.yaml" contentType="text/yaml">
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ .Release.Name }}-warp-data
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: {{ .Values.warp.volumeSize }}
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ .Release.Name }}-jackett-config
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: {{ .Values.jackett.configVolumeSize }}
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: {{ .Release.Name }}-jackett-downloads
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: {{ .Values.jackett.downloadsVolumeSize }}
</xaiArtifact>

<xaiArtifact artifact_id="0c639770-5d9f-4e3c-bb6d-e10b5a37d93a" artifact_version_id="38ae4682-be54-47e8-a1a9-50a8421fb455" title="service.yaml" contentType="text/yaml">
apiVersion: v1
kind: Service
metadata:
  name: {{ .Release.Name }}-jackett-service
spec:
  selector:
    app: {{ .Release.Name }}-jackett-warp
  ports:
  - protocol: TCP
    port: {{ .Values.service.port }}
    targetPort: 9117
  type: {{ .Values.service.type }}
</xaiArtifact>

### Installation
1. Save the above files in the `jackett-warp/templates` directory and `values.yaml` in the `jackett-warp` directory.
2. Install the chart:
   ```sh
   helm install jackett-warp ./jackett-warp
   ```
3. Verify the pod is running:
   ```sh
   kubectl get pods
   ```
4. Access Jackett within the cluster at `jackett-warp-jackett-service:9117`.

### External Access
To access Jackett externally, configure an Ingress resource using a reverse proxy like Traefik, similar to the Docker Compose setup. For example, add an Ingress resource to route traffic to `jackett.<your-domain>`.

### Security Note
Running the WARP container in privileged mode (`securityContext.privileged: true`) is likely necessary for the VPN’s TUN device but poses security risks. If possible, explore using specific capabilities (e.g., `NET_ADMIN`) instead, though this may require cluster-specific configurations.

---

### Detailed Report on Deploying Jackett with Cloudflare WARP in Kubernetes Using Helm

This section provides a comprehensive guide to replicating the provided Docker Compose configuration, which runs Jackett with Cloudflare WARP, in a Kubernetes environment using Helm. The Docker Compose setup uses `network_mode: service:warp` to route Jackett’s traffic through WARP’s VPN. In Kubernetes, this is achieved by running both containers in the same pod, leveraging Kubernetes’ shared network namespace.

#### Background
The Docker Compose configuration includes two services:
- **Jackett**: A torrent tracker API service (`linuxserver/jackett`) that depends on WARP and shares its network stack.
- **WARP**: A Cloudflare WARP client (`caomingjun/warp:latest`) providing a SOCKS5 proxy and VPN routing, configured with specific capabilities, sysctls, and persistent storage.

The goal is to create a Helm chart that deploys a pod with both containers, ensuring Jackett’s outbound traffic routes through WARP’s VPN, and expose Jackett’s port (9117) for access within the Kubernetes cluster.

#### Approach
The recommended approach is to create a custom Helm chart that:
- Deploys a single pod with WARP and Jackett containers sharing the same network namespace.
- Configures persistent storage using PVCs for WARP and Jackett data.
- Exposes Jackett via a Kubernetes Service.
- Optionally supports Ingress for external access, similar to the Traefik setup in Docker Compose.

This approach mimics the Docker Compose behavior where Jackett’s traffic is routed through WARP due to the shared network stack.

#### Existing Helm Charts
Several Helm charts exist for Jackett, such as:
- [TrueCharts Jackett Chart](https://truecharts.org/charts/stable/jackett/): A well-documented chart using a common library.
- [halkeye/jackett](https://github.com/halkeye-helm-charts/jackett-chart): A simpler chart for Jackett.
- [lib42/jackett](https://artifacthub.io/packages/helm/lib42/jackett): A rootless Jackett chart.

However, these charts do not natively support adding a WARP sidecar container. The TrueCharts common library supports sidecars (e.g., Tailscale, Code-Server), but adding a custom WARP sidecar requires significant customization. Thus, a custom Helm chart is more straightforward for this specific use case.

No dedicated Helm chart was found for Cloudflare WARP, but the `caomingjun/warp` Docker image can be used in a Kubernetes pod, as it is designed to run the WARP client and a GOST proxy for SOCKS5 access.

#### Helm Chart Implementation
The custom Helm chart (`jackett-warp`) includes the following components, as shown in the artifacts above:
- **values.yaml**: Defines configurable parameters for WARP and Jackett images, environment variables, and storage sizes.
- **deployment.yaml**: Creates a Deployment with a pod containing WARP and Jackett containers.
- **pvc.yaml**: Defines PVCs for persistent storage.
- **service.yaml**: Exposes Jackett’s port 9117 via a ClusterIP Service.

##### WARP Container Configuration
| **Parameter**            | **Details**                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| **Image**                | `caomingjun/warp:latest`                                                   |
| **Environment Variables** | `WARP_SLEEP: "2"` (delays WARP startup for stability)                      |
| **Security Context**     | `privileged: true` (required for TUN device; `NET_ADMIN` may suffice)      |
| **Volume Mount**         | `/var/lib/cloudflare-warp` for persistent WARP configuration               |
| **Sysctls**              | `net.ipv6.conf.all.disable_ipv6: "1"`, `net.ipv4.conf.all.src_valid_mark: "1"` (may require cluster support) |

The WARP container likely requires privileged mode to create a TUN device for VPN functionality, as noted in the [cmj2002/warp-docker](https://github.com/cmj2002/warp-docker) repository. The repository suggests that the WARP client routes all traffic through the VPN, and the GOST proxy provides a SOCKS5 interface on port 1080. In a shared network namespace, Jackett’s traffic automatically uses the WARP VPN without needing explicit proxy settings.

##### Jackett Container Configuration
| **Parameter**            | **Details**                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| **Image**                | `linuxserver/jackett:latest`                                               |
| **Environment Variables** | `AUTO_UPDATE: "true"`, `RUN_OPTS: ""`                                      |
| **Volume Mounts**        | `/config` for configuration, `/downloads` for blackhole directory          |
| **Ports**                | Exposes port 9117 for Jackett’s web interface                              |

Jackett does not require explicit proxy settings (e.g., `HTTP_PROXY`) because the shared network namespace ensures its traffic is routed through WARP’s VPN.

##### Persistent Storage
Three PVCs are defined:
- `warp-data`: Stores WARP configuration (1Gi).
- `jackett-config`: Stores Jackett configuration (1Gi).
- `jackett-downloads`: Stores Jackett’s blackhole directory (10Gi).

These ensure data persistence across pod restarts, similar to the Docker Compose volumes.

##### Service Configuration
A ClusterIP Service exposes Jackett’s port 9117 within the cluster. For external access, an Ingress resource can be added, configured with Traefik annotations to match the Docker Compose setup (e.g., `traefik.http.routers.jackett.rule`).

#### Installation and Verification
1. **Install the Chart**:
   ```sh
   helm install jackett-warp ./jackett-warp
   ```
2. **Check Pod Status**:
   ```sh
   kubectl get pods
   ```
   Ensure the `jackett-warp` pod is running with both containers.
3. **Verify WARP Connectivity**:
   Check the WARP container logs for `warp=on` or `warp=plus`:
   ```sh
   kubectl logs <pod-name> -c warp
   ```
   If `warp=off`, the WARP client failed to connect, possibly due to network or authentication issues.
4. **Access Jackett**:
   Use `kubectl port-forward` to test access:
   ```sh
   kubectl port-forward svc/jackett-warp-jackett-service 9117:9117
   ```
   Open `http://localhost:9117` in a browser.

#### External Access with Ingress
To replicate the Traefik reverse proxy setup, create an Ingress resource:
<xaiArtifact artifact_id="5f365f30-509d-485e-9d91-9beb5f62aa65" artifact_version_id="9685ec4a-9dc4-4825-90c5-d87cd54ee383" title="ingress.yaml" contentType="text/yaml">
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {{ .Release.Name }}-jackett-ingress
  annotations:
    traefik.ingress.kubernetes.io/router.entrypoints: websecure
    traefik.ingress.kubernetes.io/router.tls: "true"
spec:
  rules:
  - host: jackett.{{ .Values.domain }}
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: {{ .Release.Name }}-jackett-service
            port:
              number: 9117
</xaiArtifact>
Add `domain: your-domain.com` to `values.yaml` and include this Ingress in the chart.

#### Security Considerations
- **Privileged Mode**: The WARP container’s privileged mode is a security risk. If possible, use `securityContext.capabilities.add: ["NET_ADMIN"]` and test without privileged mode, though this may require cluster-specific configurations to allow TUN device access.
- **Sysctls**: The sysctls (`net.ipv6.conf.all.disable_ipv6`, `net.ipv4.conf.all.src_valid_mark`) may not be allowed in some Kubernetes clusters unless explicitly enabled. Check your cluster’s security policies.
- **Network Policies**: If using network policies, ensure the pod can communicate with Cloudflare’s WARP service and other necessary endpoints.

#### Alternative Approaches
1. **Separate WARP Pod**:
   Deploy WARP in a separate pod with a Service exposing port 1080, then configure Jackett with `HTTP_PROXY` and `HTTPS_PROXY` environment variables pointing to `socks5://warp-service:1080`. This approach avoids privileged mode in the Jackett pod but requires explicit proxy configuration, which may not be supported by Jackett without additional setup.
   | **Pros** | **Cons** |
   |----------|----------|
   | Avoids privileged mode for Jackett | Requires proxy configuration; less seamless |
   | Scalable WARP deployment | Increased complexity |

2. **Use Existing Jackett Chart**:
   Modify an existing Jackett chart (e.g., TrueCharts) to add a WARP sidecar. This requires overriding the chart’s templates or using the common library’s sidecar support, which may be complex due to limited documentation on arbitrary sidecars.

3. **Cloudflare Tunnel**:
   Use Cloudflare Tunnel with WARP routing (e.g., via `cloudflared`), as described in [Cloudflare Zero Trust docs](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/deployment-guides/kubernetes/). This is better suited for exposing services to the internet rather than routing outbound traffic, making it less relevant here.

#### Limitations
- **WARP Authentication**: The `caomingjun/warp` image may require a WARP license key (`WARP_LICENSE_KEY`) for WARP+ features, which should be added to the environment variables if needed.
- **Cluster Compatibility**: Privileged pods and sysctls may not be allowed in restricted clusters (e.g., OpenShift). Test with `NET_ADMIN` capability alone if possible.
- **Jackett Proxy Support**: If Jackett requires explicit proxy settings, additional configuration may be needed, though the shared network namespace should suffice based on the Docker Compose setup.

#### Conclusion
The custom Helm chart provided above effectively replicates the Docker Compose setup by running WARP and Jackett in a single pod, leveraging Kubernetes’ shared network namespace to route Jackett’s traffic through WARP’s VPN. The chart is simple, customizable, and aligns with the original configuration’s intent. For external access, an Ingress resource can be added to integrate with Traefik or another reverse proxy. Users should be cautious of the security implications of privileged pods and verify WARP connectivity post-deployment.

### Key Citations
- [Run Cloudflare WARP in Docker](https://github.com/cmj2002/warp-docker)
- [TrueCharts Jackett Helm Chart](https://truecharts.org/charts/stable/jackett/)
- [Kubernetes Pods Documentation](https://kubernetes.io/docs/concepts/workloads/pods/)
- [Kubernetes Security Context Documentation](https://kubernetes.io/docs/tasks/configure-pod-container/security-context/)
- [Cloudflare Zero Trust Kubernetes Guide](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/deployment-guides/kubernetes/)
