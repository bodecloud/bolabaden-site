---
source_url: "https://chatgpt.com/c/684dc8e3-7b04-8006-b101-e4a8d20ddf3f"
conversation_id: "684dc8e3-7b04-8006-b101-e4a8d20ddf3f"
title: "Kubernetes namespace migration"
extracted_at: "2026-06-29T12:06:49.299Z"
message_count: 2
provenance: auth-ui
---

# Kubernetes namespace migration

Source: [ChatGPT conversation](https://chatgpt.com/c/684dc8e3-7b04-8006-b101-e4a8d20ddf3f)

## User

how to quickly and effectively make bulk changes to a kubernetes cluster? like i stupidly setup 20 namespaces without thinking it through and now i'd prefer if i would have done 3 from the start. Do I really have to modify 800+ yaml files to do that or can I migrate them in real time and then just export the 800+ yaml?

## Assistant

You're not alone — many folks run into this issue when scaling up Kubernetes setups. Here's a quick and effective way to reduce 20 namespaces down to 3 without manually editing 800+ YAML files:

🔄 Strategy: Migrate Live Resources, Then Export YAML

Yes, you can migrate in real time and export the new configuration. Here's how.

✅ Step-by-Step Guide
1. Group Namespaces Logically

Decide how the 20 existing namespaces map into the 3 new ones.

Example:

YAML
old-namespaces:     new-namespace:
- ns-a              -> shared-services
- ns-b              -> shared-services
- ns-c              -> customer-apps
...
2. Export All Resources (Optional Backup)

Before anything:

Bash
kubectl get all --all-namespaces -o yaml > full-backup.yaml
3. Migrate Resources

You'll use a combination of kubectl get, sed/yq, and kubectl apply.

Script outline:
Bash
#!/bin/bash

declare -A NS_MAP=(
  ["ns-a"]="shared-services"
  ["ns-b"]="shared-services"
  ["ns-c"]="customer-apps"
  # Add the full mapping here
)

for old_ns in "${!NS_MAP[@]}"; do
  new_ns="${NS_MAP[$old_ns]}"

  echo "Migrating from $old_ns to $new_ns..."

  # Get all resource types you care about
  for kind in deployments services configmaps secrets statefulsets daemonsets jobs cronjobs pvc; do
    resources=$(kubectl get $kind -n "$old_ns" --no-headers -o custom-columns=":metadata.name" 2>/dev/null)
    
    for res in $resources; do
      kubectl get $kind "$res" -n "$old_ns" -o yaml \
        | yq eval "del(.metadata.uid, .metadata.resourceVersion, .metadata.creationTimestamp, .metadata.selfLink, .status)" - \
        | yq eval ".metadata.namespace = \"$new_ns\"" - \
        | kubectl apply -f -

      echo "✓ Migrated $kind/$res to $new_ns"
    done
  done
done

Use yq v4 (YAML processor) – essential for clean transformation.

4. Clean Up Old Namespaces

After verifying the new namespaces:

Bash
kubectl delete namespace ns-a
kubectl delete namespace ns-b
# and so on...
5. Export the New Cluster State (Optional)

Now that you have a clean 3-namespace setup:

Bash
kubectl get all --all-namespaces -o yaml > cluster-new.yaml
🧠 Tips

Automate everything: Don't edit YAMLs manually. kubectl get ... | yq ... | kubectl apply is your best friend.

Migrate live, then clean: That lets you validate workloads before tearing anything down.

Don't forget RBAC, NetworkPolicies, etc. – repeat the process for non-Pod resources.

You may need to handle PV/PVCs separately if using static provisioning.

Want a ready-to-run script tailored to your namespaces and kinds of resources? Just give me:

A sample namespace mapping.

Which resources are most common (Deployments? PVCs? etc).

I can generate a migration script for you.
