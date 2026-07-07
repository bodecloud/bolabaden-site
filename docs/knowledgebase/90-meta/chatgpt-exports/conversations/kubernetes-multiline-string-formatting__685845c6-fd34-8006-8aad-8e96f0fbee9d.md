---
source_url: "https://chatgpt.com/c/685845c6-fd34-8006-8aad-8e96f0fbee9d"
conversation_id: "685845c6-fd34-8006-8aad-8e96f0fbee9d"
title: "Kubernetes multiline string formatting"
extracted_at: "2026-06-29T16:36:52.207Z"
message_count: 4
provenance: auth-ui
---

# Kubernetes multiline string formatting

Source: [ChatGPT conversation](https://chatgpt.com/c/685845c6-fd34-8006-8aad-8e96f0fbee9d)

## User

when working with kubernetes how to stop my multiline strings from being wrapped in single quotes (thereby requiring me to escape even newlines)? How do I get everything to use pipe | syntax by default?

## Assistant

In Kubernetes YAML files (or any YAML in general), multi-line strings can be represented in different ways. By default, many tools that generate YAML may wrap strings in single quotes, which causes newlines and indentation to be escaped—making them harder to read and edit.

To avoid this and use the more readable | block scalar style, you need to make sure your YAML generation tool or serialization library supports and is configured to emit block style scalars.

What You're Asking

You want:

YAML
key: |
  this is a
  multi-line string

Not:

YAML
key: 'this is a\nmulti-line string'
✅ Solution Depends on Tool/Language
1. Python (PyYAML / ruamel.yaml)
ruamel.yaml (Recommended for fine-grained control)

Use ruamel.yaml instead of PyYAML. It supports block style formatting out of the box.

Python
Run
from ruamel.yaml import YAML

yaml = YAML()
yaml.default_flow_style = False

data = {
    'key': 'this is a\nmulti-line string'
}

with open('out.yaml', 'w') as f:
    yaml.dump(data, f)

By default, ruamel.yaml detects multi-line strings and uses | style. If not, you can force it:

Python
Run
from ruamel.yaml.scalarstring import PreservedScalarString

data = {
    'key': PreservedScalarString('this is a\nmulti-line string')
}
2. Go (Go YAML libraries)

If you're generating YAML in Go (e.g., in a Kubernetes controller or operator):

The default gopkg.in/yaml.v2 doesn't support forcing block style.

Use sigs.k8s.io/yaml (used by Kubernetes), which wraps ghodss/yaml / yaml.v2, but it also lacks block style control.

If you need block scalars, you'll likely have to post-process the YAML or use a more customizable YAML emitter.

🛠️ You can post-process strings with regex or templating if exact formatting is essential.

## User

none of that is relevant i'm saying shit like that happens when using kubectl

## Assistant

Ah, got it! You’re talking about when you do something like:

Bash
kubectl apply -f - <<EOF
apiVersion: v1
kind: ConfigMap
metadata:
  name: my-config
data:
  mykey: some
    multi-line
    string
EOF

and kubectl or kubectl get outputs your multi-line strings wrapped in single quotes with \n escapes instead of the nice | block style. Right?

Why does this happen?

When you do kubectl get configmap my-config -o yaml, kubectl (actually, the Kubernetes API server and the client libraries) serialize the resource back to YAML.

The default YAML serializer does not preserve block style scalar formatting — it just outputs valid YAML.

It often chooses the simplest quoting style (single quotes or double quotes with escaped newlines).

There’s no native kubectl flag or config to force pipe | block style output.

So, how to fix this or get around it?
1. Use kubectl get with --raw and jq or yq to manipulate output

kubectl outputs from API are often canonicalized. To get prettier multiline output, you can:

Extract the raw JSON with kubectl get -o json

Use a tool like yq
 (version 4+) which supports outputting multiline strings with pipe style.

Example:

Bash
kubectl get configmap my-config -o json | yq eval -P '.data.mykey = "some\nmulti-line\nstring"' -

Or just to reformat with pretty multiline style:

Bash
kubectl get configmap my-config -o json | yq eval -P '.' -

-P means "pretty print" with block style scalars where appropriate.

2. Use kustomize or Helm to maintain multiline strings in your manifests

If you manage your manifests with Helm or Kustomize, you can control how your templates produce multiline strings, and then when you apply them with kubectl apply -f, the formatting stays nicer in the source files.

3. Use a kubectl plugin or external tool to prettify output

No direct kubectl flag exists to force pipe | style, but you can:

Use yq as above to convert kubectl get -o json output to pretty YAML with multiline block style.

There are plugins and scripts around that can do this for you.

TL;DR:

kubectl does not have a native option to always output multiline strings with | block style.

This is due to the underlying Kubernetes API machinery serializing the resource.

To get nicely formatted output, pipe through tools like yq -P to get block style.

For your manifests, write multiline strings with | manually so the applied resource has it.

When reading back from cluster, rely on external formatting tools.

If you want, I can help you write a handy command or small script to prettify kubectl output with multiline strings using yq — just let me know!
