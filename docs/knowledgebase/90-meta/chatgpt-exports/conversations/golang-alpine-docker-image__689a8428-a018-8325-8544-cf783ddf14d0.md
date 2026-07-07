---
source_url: "https://chatgpt.com/c/689a8428-a018-8325-8544-cf783ddf14d0"
conversation_id: "689a8428-a018-8325-8544-cf783ddf14d0"
title: "Golang Alpine Docker Image"
extracted_at: "2026-06-29T16:07:33.242Z"
message_count: 2
provenance: auth-ui
---

# Golang Alpine Docker Image

Source: [ChatGPT conversation](https://chatgpt.com/c/689a8428-a018-8325-8544-cf783ddf14d0)

## User

golang:1.22.5-alpine

The image contains 1 critical and 5 high vulnerabilities.  
provide a more up-to-date image for this.

## Assistant

The golang:1.22.5-alpine Docker image currently contains several critical and high-severity vulnerabilities, including CVE-2025-22871 and CVE-2024-5535, among others .
Docker Hub
+1

To mitigate these vulnerabilities, consider using a more up-to-date image. The golang:1.22.6-alpine image has been released and may contain fixes for some of these issues.

However, for the most secure and up-to-date option, you might consider upgrading to golang:1.24-alpine. This version includes the latest Go runtime and is built on Alpine Linux 3.19, which has addressed several vulnerabilities present in earlier versions .
docs.mirantis.com
+1

To use the latest Go version with Alpine, you can update your Dockerfile as follows:

dockerfile
FROM golang:1.24-alpine AS builder
RUN apk add --no-cache build-base
WORKDIR /app
COPY . /app
RUN go mod download
RUN go build ./cmd/myapp

This setup ensures you're using the latest Go version with Alpine, minimizing exposure to known vulnerabilities.

If you need assistance with specific configurations or have further questions, feel free to ask!
