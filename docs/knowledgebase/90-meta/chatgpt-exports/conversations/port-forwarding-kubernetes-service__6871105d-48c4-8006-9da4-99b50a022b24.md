---
source_url: "https://chatgpt.com/c/6871105d-48c4-8006-9da4-99b50a022b24"
conversation_id: "6871105d-48c4-8006-9da4-99b50a022b24"
title: "Port Forwarding Kubernetes Service"
extracted_at: "2026-06-29T14:20:52.011Z"
message_count: 4
provenance: auth-ui
---

# Port Forwarding Kubernetes Service

Source: [ChatGPT conversation](https://chatgpt.com/c/6871105d-48c4-8006-9da4-99b50a022b24)

## User

devtron-service                  NodePort    10.43.16.167    <none>        80:32300/TCP                 3m50s


please write the kubectl command that'll port forward this to port 32300 on the host to be accessible by http://localhost:32300

## Assistant

To port forward the devtron-service service to your local machine's port 32300, you cannot use kubectl port-forward directly on a service with NodePort. kubectl port-forward works with pods or services of type ClusterIP.

However, if you want to forward the traffic locally to port 32300, you should forward from the Pod backing the service.

Step 1: Find the Pod name behind the service

Assuming the service is in the default namespace (or replace with your actual namespace):

Bash
kubectl get pods -l app=devtron-service

Replace app=devtron-service with the actual label selector for the service.

Step 2: Port forward the pod to your local machine

Once you have the pod name (e.g., devtron-pod-1234), run:

Bash
kubectl port-forward pod/devtron-pod-1234 32300:80

This command maps local port 32300 to port 80 of the Pod, and you can access it via:

http://localhost:32300
Alternative: Use the NodePort directly

If you're trying to access the service from outside the cluster, and it's using NodePort, you can access it via:

http
http://<node-ip>:32300

Where <node-ip> is the IP address of any Kubernetes node.

Let me know if you need help finding the pod or node IP.

## User

write a command that'll fully 100% undo this command:

helm install devtron devtron/devtron-operator --create-namespace --namespace devtron-cd

## Assistant

To fully and cleanly undo the Helm install command you provided:

Bash
helm install devtron devtron/devtron-operator --create-namespace --namespace devtron-cd

Run the following command:

Bash
helm uninstall devtron --namespace devtron-cd && kubectl delete namespace devtron-cd
Explanation:

helm uninstall devtron --namespace devtron-cd:
Removes the Helm release named devtron in the devtron-cd namespace.

kubectl delete namespace devtron-cd:
Deletes the namespace entirely, including any leftover resources that Helm might not have cleaned up.

⚠️ Warning: Deleting the namespace will remove all resources inside devtron-cd, even if they weren't created by this Helm chart.

Let me know if you want to preserve the namespace or selectively clean resources instead.
