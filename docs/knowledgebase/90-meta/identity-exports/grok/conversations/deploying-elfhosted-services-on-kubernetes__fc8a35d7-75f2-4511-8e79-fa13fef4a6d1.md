---
source_url: "https://grok.com/c/fc8a35d7-75f2-4511-8e79-fa13fef4a6d1"
conversation_id: "fc8a35d7-75f2-4511-8e79-fa13fef4a6d1"
title: "Deploying ElfHosted Services on Kubernetes"
extracted_at: "2026-06-29T16:34:03.825Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Deploying ElfHosted Services on Kubernetes

Source: [Grok conversation](https://grok.com/c/fc8a35d7-75f2-4511-8e79-fa13fef4a6d1)

## User

_Time: 2025-05-27T20:18:31.726Z_

How to run and deploy elfhosted from their src code? elfhosted provides SaaS to users that want to get fully managed and readily deployable and private stremio/debrid/etc usually for decentralized alternatives to netflix. also does some stuff with plex.

they have like 6 github repos representing their entire infrastructure and website. I am exclusively interested in their packages they're offering users. Find out where this is, how it's implemented, how they're deployed and maintained. Then determine from the src code exactly how we can extract that part out and host it ourselves on our own bare metal machines in our own kubernetes cluster.

I do not want their website or billing page etc. I just simply want the services they provide, and an exhaustive complete and accurate guide on how to deploy all of them myself.

## Assistant

_Time: 2025-05-27T20:25:44.206Z_

To deploy ElfHosted's user-facing services (such as Stremio, Debrid, and Plex) on your own bare metal Kubernetes cluster, you can use their open-source Helm charts, specifically the MyPrecious umbrella chart, which bundles various self-hosted applications. The process involves setting up a Kubernetes cluster, installing Helm, cloning the ElfHosted charts repository, configuring a custom values file to enable desired services, and deploying the chart. Below is a straightforward guide to achieve this, tailored for running on your own infrastructure.

### Key Points
- **ElfHosted Services**: ElfHosted offers a range of self-hosted apps like Plex, Stremio, and Zurg (for Debrid integration), which can be deployed using their MyPrecious Helm chart.
- **Deployment Method**: Use Helm to install the MyPrecious chart from the [ElfHosted charts repository](https://github.com/elfhosted/charts), customizing which apps to enable.
- **Customization**: You’ll need to configure storage, networking, and secrets (e.g., API keys for Debrid services) to match your environment.
- **Open-Source Nature**: The source code is available, but user-specific configurations and secrets are not included, requiring you to set them up.
- **Complexity Acknowledged**: Some apps may require additional setup (e.g., persistent storage or ingress controllers), and you may need to refer to individual chart documentation for specifics.

### Prerequisites
Before starting, ensure you have:
- A Kubernetes cluster running on your bare metal machines (e.g., using k3s or kubeadm).
- Helm installed on your system.
- Access to the [ElfHosted charts repository](https://github.com/elfhosted/charts).
- Necessary API keys for services like Real-Debrid (if using Zurg or similar).

### Steps to Deploy
1. **Set Up Your Kubernetes Cluster**:
   - Configure a Kubernetes cluster on your bare metal machines. Tools like [k3s](https://k3s.io/) or [kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/) are suitable for bare metal setups.
   - Ensure the cluster has sufficient resources (CPU, memory, storage) for the apps you plan to run.

2. **Install Helm**:
   - Install Helm by following the official guide at [Helm Installation](https://helm.sh/docs/intro/install/). Helm is a package manager for Kubernetes that simplifies deploying the MyPrecious chart.

3. **Clone the ElfHosted Charts Repository**:
   - Clone the repository containing the Helm charts:
     ```
     git clone https://github.com/elfhosted/charts.git
     ```
   - Navigate to the MyPrecious chart directory:
     ```
     cd charts/charts/other/myprecious
     ```

4. **Create a Custom Values File**:
   - Copy the default `values.yaml` file from the MyPrecious chart directory to create a custom `my-values.yaml`.
   - Edit `my-values.yaml` to enable the desired services. For example, to enable Plex, Stremio Web, and Zurg:
     ```yaml
     plex:
       enabled: true
     stremioweb:
       enabled: true
     zurg:
       enabled: true
     ```
   - Configure additional settings such as:
     - **Storage**: Set up persistent volume claims (PVCs) for apps requiring storage (e.g., Plex for media libraries). Example:
       ```yaml
       config:
         type: custom
         volumeSpec:
           persistentVolumeClaim:
             claimName: config-plex-ssd
       ```
     - **Secrets**: Provide API keys for services like Real-Debrid in the Zurg configuration or as Kubernetes secrets.
     - **Networking**: Configure ingress rules or service types (e.g., LoadBalancer or NodePort) to access the services.

5. **Deploy the MyPrecious Chart**:
   - Use Helm to install the chart with your custom values:
     ```
     helm install myprecious ./ --values my-values.yaml
     ```
   - Verify the deployment:
     ```
     kubectl get pods
     kubectl get services
     ```

6. **Access and Manage Services**:
   - Access the deployed services via the configured networking method (e.g., ingress or NodePort).
   - Monitor pod status and troubleshoot using:
     ```
     kubectl logs <pod-name>
     kubectl describe pod <pod-name>
     ```

### Additional Notes
- **Storage Setup**: Ensure your cluster has a storage solution (e.g., NFS or local storage) to provide persistent volumes for apps like Plex.
- **Networking**: If exposing services externally, set up an ingress controller like Traefik or Nginx.
- **Documentation**: Refer to the `values.yaml` file in the MyPrecious chart and individual chart documentation in the repository for specific configuration options.

<xaiArtifact artifact_id="06465953-2739-4f67-b6c6-57054245b9fe" artifact_version_id="d8d311bc-8d09-4100-9c51-cf7d062f176f" title="Custom Values for MyPrecious Chart" contentType="text/yaml">
plex:
  enabled: true
stremioweb:
  enabled: true
zurg:
  enabled: true
# Add storage configurations as needed
config:
  type: custom
  volumeSpec:
    persistentVolumeClaim:
      claimName: config-plex-ssd
# Add other app configurations as required
</xaiArtifact>

---

### Detailed Guide to Deploying ElfHosted Services

This section provides an exhaustive guide to deploying ElfHosted’s user-facing services on your own bare metal Kubernetes cluster, focusing on the services mentioned (Stremio, Debrid, Plex) and other related applications. The guide leverages ElfHosted’s open-source repositories, particularly the MyPrecious Helm chart, to replicate their service offerings.

#### Understanding ElfHosted’s Infrastructure
ElfHosted is a Platform-as-a-Service (PaaS) that hosts popular self-hosted applications like Plex, Stremio, Radarr, Sonarr, and Zurg, which integrates with Debrid services like Real-Debrid. Their infrastructure is open-source, with key components available on GitHub:
- **[ElfHosted Charts Repository](https://github.com/elfhosted/charts)**: Contains Helm charts for individual apps and the MyPrecious umbrella chart, which bundles multiple services.
- **MyPrecious Chart**: An umbrella Helm chart that deploys various services, allowing customization via a `values.yaml` file.
- **Containers Repository**: Includes Docker images used by the charts, hosted at `ghcr.io`.
- **Infra Repository**: Contains Flux GitOps manifests and Ansible playbooks for cluster management, useful for understanding their setup but not strictly necessary for your deployment.

The MyPrecious chart, located at `charts/charts/other/myprecious` in the charts repository, is the primary tool for deploying ElfHosted’s services. It supports a wide range of applications, which can be enabled or disabled via configuration.

#### Available Services
The MyPrecious chart’s `values.yaml` file lists numerous applications, with some relevant to your interests:
- **Plex**: A media server for streaming your media library.
- **Stremioweb**: The web interface for Stremio, a streaming platform with addons.
- **Stremiojackett**: Integrates Stremio with Jackett for torrent-based streaming.
- **Zurg**: Integrates with Real-Debrid to mount debrid links as a file system, enabling seamless streaming.
- **Radarr, Sonarr, Bazarr**: Media management tools for movies, TV shows, and subtitles.
- **qBittorrent, Deluge**: Torrent clients for downloading content.
- **Filebrowser, Homer, Recyclarr**: Utility services for file management, dashboards, and configuration syncing.

The `values.yaml` file specifies whether each app is enabled (e.g., `enabled: true` or `false`). By default, most apps are disabled, but services like `filebrowser`, `homer`, `recyclarr`, `elfstorage`, `tmp`, and `rclonebrowser` are enabled.

#### Deployment Process
To deploy these services on your own Kubernetes cluster, follow these detailed steps:

1. **Set Up a Kubernetes Cluster**:
   - Deploy a Kubernetes cluster on your bare metal machines. Options include:
     - [k3s](https://k3s.io/): A lightweight Kubernetes distribution ideal for bare metal.
     - [kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/): A tool for bootstrapping a Kubernetes cluster.
   - Ensure the cluster has sufficient resources (CPU, memory, storage) based on the apps you plan to run. For example, Plex may require significant storage for media files.
   - Configure networking (e.g., CNI plugins like Calico or Flannel) and storage (e.g., local storage or NFS).

2. **Install Helm**:
   - Install Helm, the Kubernetes package manager, by following the instructions at [Helm Installation](https://helm.sh/docs/intro/install/).
   - Verify the installation:
     ```
     helm version
     ```

3. **Clone the ElfHosted Charts Repository**:
   - Clone the repository to access the MyPrecious chart:
     ```
     git clone https://github.com/elfhosted/charts.git
     ```
   - Navigate to the MyPrecious chart directory:
     ```
     cd charts/charts/other/myprecious
     ```

4. **Configure the MyPrecious Chart**:
   - Locate the default `values.yaml` file in the MyPrecious chart directory. This file lists all configurable options, including which apps to enable and their settings.
   - Create a custom `my-values.yaml` file to specify your desired configuration. For example:
     ```yaml
     plex:
       enabled: true
       # Add Plex-specific configurations (e.g., storage, image)
     stremioweb:
       enabled: true
     zurg:
       enabled: true
       # Add Real-Debrid API key or other configurations
     radarr:
       enabled: true
     sonarr:
       enabled: true
     ```
   - **Storage Configuration**: Many apps require persistent storage. For example, Plex needs a PVC for its configuration and media library:
     ```yaml
     config:
       type: custom
       volumeSpec:
         persistentVolumeClaim:
           claimName: config-plex-ssd
     ```
     Create the necessary PVCs in your cluster or configure the chart to create them automatically.
   - **Secrets**: For apps like Zurg, provide API keys (e.g., Real-Debrid) either in the `values.yaml` or as Kubernetes secrets. Example:
     ```yaml
     zurg:
       enabled: true
       env:
         - name: REAL_DEBRID_API_KEY
           valueFrom:
             secretKeyRef:
               name: zurg-secrets
               key: real-debrid-api-key
     ```
     Create the secret:
     ```
     kubectl create secret generic zurg-secrets --from-literal=real-debrid-api-key=<your-api-key>
     ```
   - **Networking**: Configure how services are exposed (e.g., via ingress, LoadBalancer, or NodePort). For external access, set up an ingress controller like Traefik or Nginx and define ingress rules in the `values.yaml`.

5. **Deploy the Chart**:
   - Install the MyPrecious chart using Helm:
     ```
     helm install myprecious ./ --values my-values.yaml
     ```
   - If you need to update the deployment later:
     ```
     helm upgrade myprecious ./ --values my-values.yaml
     ```

6. **Monitor and Troubleshoot**:
   - Check the status of deployed pods and services:
     ```
     kubectl get pods
     kubectl get services
     ```
   - View logs for troubleshooting:
     ```
     kubectl logs <pod-name>
     ```
   - Describe resources for detailed status:
     ```
     kubectl describe pod <pod-name>
     ```

7. **Access the Services**:
   - Access services based on their configured exposure method. For example:
     - **Ingress**: If using an ingress controller, access services via domain names defined in ingress rules.
     - **NodePort**: Access services via `<node-ip>:<node-port>`.
     - **LoadBalancer**: Use the external IP assigned by your cluster’s LoadBalancer.
   - For Stremio, access the web interface via the configured URL. For Plex, log in to the server to set up your media library.

#### Specific Service Configurations
- **Plex**:
  - Requires significant storage for media files. Ensure a PVC is configured for the media library.
  - Image: `ghcr.io/geek-cookbook/plex:rolling`.
  - Configure authentication and network settings as needed.
- **Stremioweb**:
  - Provides the Stremio web interface. Ensure it’s exposed via ingress or NodePort for access.
  - May integrate with addons like Stremiojackett for torrent-based streaming.
- **Zurg**:
  - Integrates with Real-Debrid to mount debrid links as a file system.
  - Requires a Real-Debrid API key, which you must obtain from [Real-Debrid](https://real-debrid.com/).
  - Configure the API key in the `values.yaml` or as a Kubernetes secret.
- **Other Apps**:
  - Apps like Radarr and Sonarr automate media acquisition. Configure them with appropriate storage and indexer settings.
  - Torrent clients like qBittorrent or Deluge may require VPN configurations (e.g., `qbittorrentgluetun`) if used with private trackers.

#### Additional Considerations
- **Storage**: Set up a storage solution compatible with Kubernetes, such as NFS, Ceph, or local persistent volumes. Ensure PVCs are available for apps requiring storage.
- **Networking**: For external access, deploy an ingress controller and configure DNS. Alternatively, use NodePort or LoadBalancer services for simpler setups.
- **Secrets Management**: Store sensitive data like API keys in Kubernetes secrets to avoid hardcoding them in `values.yaml`.
- **Customizations**: ElfHosted’s charts may include custom integrations (e.g., between Stremio and Jackett or Zurg and Real-Debrid). Review the `values.yaml` and individual chart documentation to replicate these.
- **Documentation**: The ElfHosted charts are forked from [k8s-at-home/charts](https://github.com/k8s-at-home/charts). Refer to the original documentation for additional guidance, but prioritize ElfHosted’s versions for accuracy.

#### Example Custom Values File
Below is an example `my-values.yaml` tailored for deploying Plex, Stremioweb, and Zurg:

<xaiArtifact artifact_id="88327a0d-147a-4230-a0b7-636ad16d6a9e" artifact_version_id="16f7f8f3-a26d-4e3c-b70a-3ed58b9edff7" title="Custom Values for MyPrecious Chart" contentType="text/yaml">
plex:
  enabled: true
  image: ghcr.io/geek-cookbook/plex:rolling
  config:
    type: custom
    volumeSpec:
      persistentVolumeClaim:
        claimName: config-plex-ssd
stremioweb:
  enabled: true
zurg:
  enabled: true
  env:
    - name: REAL_DEBRID_API_KEY
      valueFrom:
        secretKeyRef:
          name: zurg-secrets
          key: real-debrid-api-key
# Add storage and networking configurations as needed
</xaiArtifact>

#### Maintenance
- **Updates**: Periodically update the charts by pulling the latest changes from the repository and running `helm upgrade`.
- **Monitoring**: Use tools like Uptime Kuma (available in the MyPrecious chart) to monitor service availability.
- **Backups**: Regularly back up configuration data and media libraries to prevent data loss.

#### Limitations
- **Missing User Configurations**: ElfHosted’s repositories do not include user-specific configurations or secrets, so you must provide these yourself.
- **Documentation Gaps**: The repositories may lack detailed deployment instructions. Refer to the `values.yaml` files and community resources for guidance.
- **Cluster Requirements**: Ensure your cluster meets the resource and networking requirements for the selected apps.

By following this guide, you can deploy ElfHosted’s services on your own Kubernetes cluster, customizing them to your needs. For specific app configurations, consult the `values.yaml` file and any available documentation in the charts repository.

### Key Citations
- [ElfHosted GitHub Organization](https://github.com/elfhosted)
- [ElfHosted Charts Repository](https://github.com/elfhosted/charts)
- [MyPrecious Chart Values File](https://github.com/elfhosted/charts/blob/main/charts/other/myprecious/values.yaml)
- [Helm Official Installation Guide](https://helm.sh/docs/intro/install/)
- [k8s-at-home Charts Repository](https://github.com/k8s-at-home/charts)
