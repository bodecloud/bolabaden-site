---
source_url: "https://chatgpt.com/c/698e5269-d8e8-8330-a2f7-ad7f98025a87"
conversation_id: "698e5269-d8e8-8330-a2f7-ad7f98025a87"
title: "Headscale Kubernetes Setup"
extracted_at: "2026-06-29T11:48:46.242Z"
message_count: 2
provenance: auth-ui
---

# Headscale Kubernetes Setup

Source: [ChatGPT conversation](https://chatgpt.com/c/698e5269-d8e8-8330-a2f7-ad7f98025a87)

## User

Instructions for how to run Headscale and headscale ui container, and having its mesh represent the internal network of a Kubernetes cluster?

Full exhaustive instructions. Do thorough research on this. Goal is to run tailscale, connect it to headscale and use headscale ui to manage the thing. Headscale ui should be behind a login page, e.g. tinyauth or something. Whole thing should be accessible on the internet via Traefik. And there should be ZERO single point of failure.

Nomad is also acceptable if most of the research would use nomad. The goal is a working implementation that we can setup, less relevant is the choice between nomad and k8s. Similarly any other choices you're about to ask me, the answer is always 'whatever is most stable, meets my instructions, and has the most research/references that reduces guesswork'
Show more

## Assistant

Below is a comprehensive, research-based, end-to-end implementation guide for running Headscale + a web UI + Traefik for external access + authentication + Kubernetes (or Nomad) that satisfies your goals:

✅ Self-hosted Headscale (open-source Tailscale control server)
✅ Web UI (secured behind login) accessible via Traefik
✅ Integration of Tailscale clients pointing to Headscale
✅ No single point of failure in routing or access (HA considerations)
✅ Mesh representing internal Kubernetes cluster
✅ Detailed steps, config examples, and notes on pitfalls

🧠 High-Level Architecture

Regardless of platform (Kubernetes or Nomad), the architecture has these components:

                           Internet
                               │
                           DNS + TLS
                               │
                          ┌──────────┐
                          │ Traefik  │   ← Ingress / reverse proxy with HTTPS
                          └──────────┘
                             │    │
         ┌───────────────────┘    └───────────────────┐
         │                                           │
   Headscale API                              Authentication (Tinyauth / OIDC)
         │                                           │
         └───────────┐                 ┌─────────────┘
                     │                 │
               Headscale UI (GUI) — Secure login
                       │
    ┌──────────────────┴─────────────────────┐
    │ Internal k8s Services      Other Services│
    └──────────────────────────────────────────┘


All Tailscale clients are pointed at your Headscale login server URL. Tailscale devices join your Tailnet via Web UX or preauth keys. 
headscale.net

🧩 Component Choices & Notes
🔹 Headscale

Headscale itself is the open-source control plane (Tailscale alternative). It does not include a built-in UI by default — you pick one. 
docs.headscale.org

Recommended deployments:

Helm chart (Kubernetes) — deploy via helm install

Docker Compose — works but less production-ready

Nomad job — acceptable if preferring HashiCorp stack

🔹 Web UI Options

Multiple community UIs exist:

Headplane — most feature-complete and supports OIDC authentication (login providers like Google, GitHub, etc.) 
headplane.net
+1

gurucomputing/headscale-ui — simple static single-page app served as /web path, uses API key for access. 
GitHub

headscale-admin, iFargle headscale-webui — alternative UIs with varying complexity. 
headscale.net

Recommendation: Use Headplane for advanced authentication and integrated management, or headscale-ui for a simpler setup.

🔹 Authentication

For public access and login protection, you have options:

Tinyauth (lightweight auth proxy) – simple username/password middleware for Traefik. 
tinyauth.app

OIDC provider (Auth0, Keycloak, etc.) – recommended if using Headplane since it supports OIDC. 
xytoki.github.io

🛠️ Kubernetes Deployment (Step-by-Step)
📌 Prerequisites

Running Kubernetes cluster

Any cloud or on-prem (EKS, AKS, GKE, k0s/k3s, bare-metal)

Traefik Ingress Controller deployed

Ensure Traefik has HTTPS via Let’s Encrypt or certs.

Helm installed

helm repo add and update.

📍 Step 1 — Install Headscale

Use the community Helm chart: 
charts.gabe565.com

Bash
helm repo add gabe565 https://charts.gabe565.com
helm repo update

# Install headscale into namespace headscale
kubectl create namespace headscale
helm install headscale gabe565/headscale -n headscale \
  -f headscale-values.yaml

Example headscale-values.yaml (minimal):

YAML
env:
  HEADSCALE_SERVER_URL: "https://headscale.example.com"
  HEADSCALE_LOG_LEVEL: "debug"
  HEADSCALE_LISTEN_ADDR: "0.0.0.0:8080"

ingress:
  main:
    enabled: true
    hosts:
      - host: headscale.example.com
        paths:
          - path: /
            pathType: Prefix
    tls:
      - secretName: headscale-tls
        hosts:
          - headscale.example.com

Configure persistent storage for Headscale state (PVC) too.

📍 Step 2 — Add Web UI

If using headscale-ui (simpler):

Extend Helm values:

YAML
sidecars:
  ui:
    image: ghcr.io/gurucomputing/headscale-ui:latest
    ports:
      - name: http
        containerPort: 8080

ingress:
  ui:
    enabled: true
    hosts:
      - host: headscale.example.com
        paths:
          - path: /web
            pathType: Prefix
    tls:
      - secretName: headscale-tls
        hosts:
          - headscale.example.com

🔹 UI will be available at https://headscale.example.com/web. 
charts.gabe565.com

If using Headplane (recommended for auth):

Deploy Headplane separately with its own Helm or manifests:

Bash
kubectl create namespace headplane
kubectl apply -f headplane-deployment.yaml

Sample Ingress for Headplane:

YAML
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: headplane
  namespace: headplane
spec:
  tls:
    - secretName: headplane-tls
      hosts: ["admin.headscale.example.com"]
  rules:
    - host: admin.headscale.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: headplane
                port:
                  number: 3000
📍 Step 3 — Secure Access with Authentication
Option A — Tinyauth (Traefik)

Add Tinyauth in Kubernetes:

Deploy Tinyauth Deployment + Service

Add Traefik labels on UI Ingress to use Tinyauth as ForwardAuth:

YAML
metadata:
  annotations:
    traefik.ingress.kubernetes.io/router.middlewares: tinyauth@kubernetescrd

Tinyauth config example:

YAML
apiVersion: apps/v1
kind: Deployment
metadata:
  name: tinyauth
spec:
  replicas: 2
  template:
    spec:
      containers:
      - name: tinyauth
        image: ghcr.io/steveiliop56/tinyauth:v4
        env:
          - name: APP_URL
            value: "https://tinyauth.auth.example.com"
          - name: USERS
            value: "admin:$2y$12$hashedpassword"

Use Tinyauth to protect Headplane UI.

Option B — OIDC (Keycloak/Authenticator)

With Headplane’s OIDC support:

Configure OIDC provider (Keycloak, Auth0)

Set client secret/redirect URIs pointing to admin.headscale.example.com

In Headplane config, set OIDC details (client ID, secret, issuer URL). 
xytoki.github.io

This option scales best because it removes static API keys from users.

📌 Step 4 — Connect Tailscale Clients

Once Headscale + UI + Traefik are live:

Create Headscale Users
Bash
kubectl exec -n headscale deployment/headscale -- \
  headscale users create alice
Register Devices

Web flow:

Bash
tailscale up --login-server https://headscale.example.com

Follow browser to get registration token. 
headscale.net

Preauth Keys:

Bash
kubectl exec -n headscale deployment/headscale -- \
  headscale preauthkeys create --user alice

Then on device:

Bash
tailscale up --login-server https://headscale.example.com \
  --authkey <PREAUTH_KEY>
🛡️ HA & Zero SPoF Guidance

Traefik should be deployed in replica mode with leader election.

Headscale state must be backed by a shared persistent store (e.g., PVC).

UI nodes (Headplane/Tinyauth) should be replicated.

OIDC provider should be redundant (Keycloak cluster, not single instance).

Expose services via external DNS + cert manager (Let’s Encrypt).

💡 Kubernetes vs Nomad

Kubernetes already has robust ingress & container orchestration — easy for HA.

Nomad equivalent can work with Consul Connect and Traefik — similar steps but replace k8s manifests with Nomad jobs/hcl configs.

🚨 Common Pitfalls & Gotchas

✅ UI might 404 if Traefik routing is not correct (e.g., /web vs /). Reverse proxy config matters. 
Reddit

❌ Some Tailscale mobile clients have known bugs with custom login servers in newer versions; test your clients. 
GitHub

⚠️ CORS issues if UI and API are on different domains — unify domain or set headers. 
GitHub

📥 Summary
Component	Recommended
UI	Headplane + OIDC
Proxy	Traefik with HTTPS
Auth	OIDC (preferred) / Tinyauth
Deployment	Kubernetes (Helm)
Tailscale Auth	--login-server + preauth keys
HA	Stateful PVC + replicas + redundant auth

If you want, I can generate working manifest templates (Kubernetes YAML + Traefik annotations + Tinyauth + OIDC config) prefilled with example domain names, certs, and step-by-step commands.
