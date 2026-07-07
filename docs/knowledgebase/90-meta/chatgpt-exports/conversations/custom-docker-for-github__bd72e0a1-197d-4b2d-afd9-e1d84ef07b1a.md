---
source_url: "https://chatgpt.com/c/bd72e0a1-197d-4b2d-afd9-e1d84ef07b1a"
conversation_id: "bd72e0a1-197d-4b2d-afd9-e1d84ef07b1a"
title: "Custom Docker for GitHub."
extracted_at: "2026-06-29T15:37:03.122Z"
message_count: 2
provenance: auth-ui
---

# Custom Docker for GitHub.

Source: [ChatGPT conversation](https://chatgpt.com/c/bd72e0a1-197d-4b2d-afd9-e1d84ef07b1a)

## User

in github actions, is ubuntu the only linux operating system I can use? what about fedora/arch/alma?

## Assistant

Expert: DevOps Engineer
Objective: Explain the available Linux operating systems in GitHub Actions.
Assumptions: I assume you're inquiring about the Linux distributions supported by GitHub Actions for workflow execution.

GitHub Actions primarily provides Ubuntu as the default operating system for Linux-based workflows. However, you can also use other Linux distributions like Fedora, Arch Linux, and AlmaLinux by leveraging custom Docker containers in your workflows.

To use a specific Linux distribution other than Ubuntu in GitHub Actions, you would create a Docker container with the desired distribution installed and configure your workflow to use that container as the execution environment. This allows for flexibility in choosing the Linux distribution best suited for your project's requirements.

For example, you could create a Docker container with Fedora, Arch Linux, or AlmaLinux installed, push it to a container registry like Docker Hub or GitHub Container Registry, and then reference that container in your GitHub Actions workflow. This approach allows you to utilize a wide range of Linux distributions beyond just Ubuntu.

Here's an outline of the steps to use a custom Docker container in GitHub Actions:

Create a Dockerfile specifying the desired Linux distribution and any additional dependencies.

Build the Docker image using the Dockerfile.

Push the Docker image to a container registry.

Reference the Docker image in your GitHub Actions workflow YAML file using the container keyword in the runs-on section.

By following these steps, you can effectively use Fedora, Arch Linux, AlmaLinux, or any other Linux distribution of your choice in GitHub Actions workflows.
