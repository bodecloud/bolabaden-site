---
source_url: "https://www.perplexity.ai/search/733e1b35-30fc-4376-b2c1-4fdf894c7a14"
thread_uuid: "aa6cc0a0-8b27-44fc-a53c-2bfb53d1c231"
slug: "733e1b35-30fc-4376-b2c1-4fdf894c7a14"
title: "how generally supported and stable is home assistant supervised? Is it relatively well used and widely adopted in 2024? I am interested in installing it over haos, but i would like to understand the complications and understand if it's been battle tested and widely tested and how supported it generally is. How do the haos developers themselves test haos? what development envs do they use? Do they use home assistant supervised to TEST haos? Otherwise what should I do? I just want to test home assistant before deploying to a remote server. Whatever is easiest way to do that."
extracted_at: "2026-06-29T16:10:23.304Z"
matched_keywords: []
export_suite: "identity"
entry_count: 5
provenance: perplexity-rest-api
---

# how generally supported and stable is home assistant supervised? Is it relatively well used and widely adopted in 2024? I am interested in installing it over haos, but i would like to understand the complications and understand if it's been battle tested and widely tested and how supported it generally is. How do the haos developers themselves test haos? what development envs do they use? Do they use home assistant supervised to TEST haos? Otherwise what should I do? I just want to test home assistant before deploying to a remote server. Whatever is easiest way to do that.

Source: [Perplexity thread](https://www.perplexity.ai/search/733e1b35-30fc-4376-b2c1-4fdf894c7a14)

## User

how generally supported and stable is home assistant supervised? Is it relatively well used and widely adopted in 2024? I am interested in installing it over haos, but i would like to understand the complications and understand if it's been battle tested and widely tested and how supported it generally is. How do the haos developers themselves test haos? what development envs do they use? Do they use home assistant supervised to TEST haos? Otherwise what should I do? I just want to test home assistant before deploying to a remote server. Whatever is easiest way to do that.

## Assistant

Home Assistant Supervised is a popular but more complex installation method compared to Home Assistant OS (HAOS). It offers greater flexibility and control over the underlying operating system, as it runs on top of a Linux distribution (usually Debian) with Docker. However, this also means that you are responsible for maintaining the host system, including OS updates, Docker management, and ensuring compatibility with Home Assistant's requirements.

### **Stability and Adoption of Home Assistant Supervised in 2024**
Home Assistant Supervised is relatively well-used but is not the most common installation method. Most users prefer HAOS due to its simplicity and lower maintenance burden. HAOS is designed to "just work" and is the most battle-tested option, with the largest community support base. Supervised installations are less common because they require more technical expertise to manage and maintain. The community generally recommends HAOS unless you have specific needs that require more control over the host system.[4][8]

That said, many users still run Supervised installations successfully, especially those who need to run additional services on the same machine or want more control over their environment. However, issues can arise if the host system is mismanaged or if updates conflict with Home Assistant's dependencies.[5][8]

### **Complications with Home Assistant Supervised**
- **Maintenance**: You need to manually update the host OS and manage Docker containers. This adds complexity compared to HAOS, which handles these tasks automatically.[8][4]
- **Compatibility**: The system can break if certain requirements (like Docker configurations or kernel settings) are not met. For example, Home Assistant Supervisor depends on specific Docker configurations (CGroup v1), which can cause issues if not properly set up.[5]
- **Support**: If you install Supervised on an unsupported platform (e.g., Raspberry Pi with non-Debian OS), you'll be marked as "unsupported," meaning official support may be limited.[5]

### **Testing and Development Environments for HAOS**
Home Assistant developers primarily test HAOS using snapshot testing and other automated testing frameworks. These tests ensure that core functionalities remain stable across updates. Developers use various testing tools like `pytest` for unit tests and snapshot testing to validate that outputs remain consistent over time.[7]

While developers do not typically use Home Assistant Supervised to test HAOS directly, they do ensure compatibility across different installation methods, including Supervised. However, HAOS remains the most rigorously tested environment due to its widespread use and simplicity.

### **Easiest Way to Test Home Assistant**
If you're looking to test Home Assistant before deploying it to a remote server, the easiest method would be:
- **Virtual Machine (VM)**: Install HAOS in a VM. This allows you to take snapshots before making changes, making it easy to roll back if something goes wrong. It also gives you a full-featured Home Assistant environment without needing to manage the underlying OS.[6]
- **Docker**: If you're familiar with Docker, running Home Assistant in a container is another lightweight option. This method provides flexibility while keeping things relatively simple compared to a full Supervised installation.[6]

Both options allow you to test Home Assistant thoroughly without committing to a more complex setup like Supervised.

### **Conclusion**
Home Assistant Supervised offers flexibility but comes with added complexity and maintenance responsibilities. While it is stable for many users, it requires careful management of the host system. For most users, especially those looking for ease of use and stability, HAOS is the recommended option due to its simpler maintenance and larger community support base. If you're just looking to test Home Assistant before deploying it remotely, using HAOS in a VM or Docker container would be the easiest approach.

### Sources

- [Roadmap 2024 Year-end Update: Full steam ahead! - Home Assistant](https://www.home-assistant.io/blog/2024/11/15/roadmap-2024h2/)
- [2024.4: Organize all the things! - Home Assistant](https://www.home-assistant.io/blog/2024/04/03/release-20244/)
- [Does Home Assistant suck?? : r/homeassistant - Reddit](https://www.reddit.com/r/homeassistant/comments/1clvqj2/does_home_assistant_suck/)
- [HA OS vs Supervised - Installation - Home Assistant Community](https://community.home-assistant.io/t/ha-os-vs-supervised/395968)
- [Guide: How to install Home Assistant supervised on Rpi4 with ...](https://community.home-assistant.io/t/guide-how-to-install-home-assistant-supervised-on-rpi4-with-raspios-64-bit-october-2022/480855)
- [Home Assistant: The Ultimate Setup Guide – a Step-by-Step Tutorial](https://www.crosstalksolutions.com/home-assistant-the-ultimate-setup-guide-a-step-by-step-tutorial/)
- [Testing your code - Home Assistant Developer Docs](https://developers.home-assistant.io/docs/development_testing/)
- [HA Supervised + OS Agent vs. HAOS - Home Assistant Community](https://community.home-assistant.io/t/ha-supervised-os-agent-vs-haos/595730)
- [Home Assistant Supervised Installation - YouTube](https://www.youtube.com/watch?v=EWObIl7SCwY)

## User

But what is the current STATE of home assistant supervised? i don't mind managing shit manually, i care about random bugs and arbitrary nuance due to the lack of wide adoption

## Assistant

### **Current State of Home Assistant Supervised in 2024**

As of 2024, **Home Assistant Supervised** remains a viable and widely used installation method, particularly for advanced users who want more control over the underlying system. However, it comes with some caveats that are important to consider before choosing this route.

#### **Stability and Support**
Home Assistant Supervised is generally stable but not as widely adopted as Home Assistant OS (HAOS), which is the most common and battle-tested installation method. The reason for this is that Supervised requires more manual management of the host system (typically Debian-based) and Docker, which can introduce complexity. While the Supervisor provides many conveniences like add-ons and automatic updates, you are still responsible for maintaining the host OS and ensuring compatibility with Home Assistant's requirements.

The community and developers do support Supervised installations, but they are considered "advanced" setups. This means that while there are many users running Supervised installations successfully, it’s less forgiving if something goes wrong—especially if you deviate from the officially supported environment (Debian). Issues like system updates breaking Docker or Supervisor dependencies can occur if not managed carefully.[4]

#### **Common Issues**
- **Host System Management**: You need to ensure that your host system (Debian) remains compatible with Home Assistant's requirements. For example, updates to Docker or changes in kernel settings can cause issues with Supervisor.
- **Custom Integrations**: As seen in user reports, custom integrations or third-party add-ons can sometimes cause stability problems. This is true across all installation methods but can be more pronounced in Supervised setups due to the additional layers of software involved.[1]
- **Update Problems**: Some users have reported issues with updates breaking their systems, particularly when running Home Assistant in Docker containers on unsupported platforms. While HAOS handles updates automatically and smoothly for most users, Supervised installations may require more manual intervention during updates.[3]

#### **Adoption**
Home Assistant Supervised is not as widely adopted as HAOS due to its complexity. Most users prefer HAOS because it abstracts away the need to manage the underlying OS and Docker manually. That said, Supervised is still popular among Linux-savvy users who want full control over their environment without giving up the convenience of add-ons and Supervisor.[4]

#### **Random Bugs and Nuances**
Supervised installations can be prone to bugs related to the host system or Docker environment. For example:
- A misconfigured or outdated Docker setup can cause issues with Supervisor functionality.
- Host OS updates may introduce compatibility issues that require manual intervention.
- Custom integrations can cause instability if they are not well-maintained or tested.[2][1]

These nuances make Supervised less "plug-and-play" than HAOS, but if you're comfortable managing a Linux system, these issues should be manageable. However, random bugs are more likely compared to HAOS due to the additional layers of complexity.

### **Testing Home Assistant Before Deployment**
If you're looking to test Home Assistant before deploying it on a remote server, here are some recommendations:

#### **Easiest Options for Testing**
1. **Home Assistant OS in a Virtual Machine (VM)**: This is one of the easiest ways to test Home Assistant without worrying about managing the underlying system. You can run HAOS in a VM on your local machine using software like VirtualBox or Proxmox. This gives you a full-featured environment with minimal setup.
   
2. **Home Assistant Container (Docker)**: If you're familiar with Docker, running Home Assistant in a container is another straightforward option. This allows you to test Home Assistant without committing to a full installation like Supervised or HAOS.

3. **Home Assistant Supervised on Debian**: If you specifically want to test Supervised, you can install it on a Debian VM or local machine. Just be aware that this will require more manual management of both Debian and Docker.

### **Conclusion**
Home Assistant Supervised is stable for those who know how to manage Linux systems but comes with more potential for random bugs and complications compared to HAOS due to its lower adoption and increased complexity. If you're comfortable managing these aspects manually, it’s a powerful option that gives you full control over your environment. However, if you want something more battle-tested with fewer chances of encountering random bugs, HAOS is generally recommended.

For testing purposes before deployment on a remote server, starting with HAOS in a VM would be the simplest approach. If you want to specifically test the Supervised method, installing it on Debian in a VM would allow you to familiarize yourself with its nuances before committing to a production setup.

### Sources

- [Persistent Issues with Home Assistant Update from 2024.2.x/2024.3 ...](https://community.home-assistant.io/t/persistent-issues-with-home-assistant-update-from-2024-2-x-2024-3-x-to-2024-4-x/716592)
- [Does Home Assistant suck??](https://www.reddit.com/r/homeassistant/comments/1clvqj2/does_home_assistant_suck/)
- [Disastrous update to 2024.6.0 - Home Assistant Community](https://community.home-assistant.io/t/disastrous-update-to-2024-6-0/736852)
- [Understanding Home Assistant: Supervisor, Supervised, Core, OS ...](https://blog.usro.net/2024/11/understanding-home-assistant-supervisor-supervised-core-os-observer-and-yellow/)

## User

How do the haos developers themselves test haos? what development envs do they use? Do they use home assistant supervised to TEST haos?

## Assistant

### **How Do HAOS Developers Test Home Assistant OS (HAOS)?**

Home Assistant developers use a variety of tools and environments to test **Home Assistant OS (HAOS)**, ensuring that it remains stable and reliable. Their development and testing processes focus on both the core functionality of Home Assistant and the specific requirements of HAOS. Here's an overview of how they approach testing:

#### **Development Environments**
1. **Devcontainers with Visual Studio Code**: Developers often use **devcontainers** for development, which provide a pre-configured environment with all necessary dependencies. This setup is containerized and allows for easy debugging and testing of Home Assistant Core. It is particularly useful for cross-platform development (Linux, macOS, Windows) but may have limitations when testing hardware integrations like Zigbee or Bluetooth if the host OS is not Linux.[1]

2. **Local Development Environment**: Developers also set up local repositories by cloning the Home Assistant Core repository, installing dependencies, and running Home Assistant in a virtual environment. This allows them to run tests locally using tools like `pytest`.[1]

3. **Snapshot Testing**: Developers use **snapshot testing** to ensure that outputs (like entity states or configuration files) remain consistent across updates. This is especially useful for testing large outputs like JSON or YAML files. Snapshot tests capture a reference output during the first run, and subsequent runs compare the current output to the snapshot.[2]

4. **Unit Testing & Linting**: All code changes go through rigorous unit tests using `pytest` and are checked against linters to ensure code quality. These tests are run locally in virtual environments or using devcontainers.[2]

#### **Testing Tools**
- **Pytest**: The main tool for running unit tests in Home Assistant. It allows developers to test individual components or the full system, ensuring that new code does not introduce regressions.[2]
- **Pre-commit Linters**: Linters such as `ruff` and `pylint` are used to check code quality before commits are made.[2]
- **Syrupy for Snapshot Testing**: Syrupy is used for snapshot tests, which help ensure that large outputs (e.g., diagnostic dumps, entity states) remain consistent over time.[2]

### **Do HAOS Developers Use Home Assistant Supervised to Test HAOS?**

No, developers do not typically use **Home Assistant Supervised** to test HAOS directly. The two installation methods are distinct in their purposes:
- **HAOS** is a standalone operating system designed specifically for running Home Assistant without requiring users to manage the underlying OS or Docker.
- **Home Assistant Supervised**, on the other hand, runs on top of a Linux distribution (usually Debian) with Docker, giving users more control but requiring them to manage the host system.

While both methods share core components like Home Assistant Core and Supervisor, the development focus for HAOS is on ensuring that it functions seamlessly as an integrated system without needing manual intervention from users.

Developers primarily test HAOS itself by running it in controlled environments such as virtual machines or using snapshot testing frameworks. The focus is on ensuring that HAOS works reliably across different hardware platforms without requiring manual management of Docker or the underlying OS.

### **What Should You Do if You Want to Test Home Assistant Before Deployment?**

If you're looking to test Home Assistant before deploying it on a remote server, here are your best options:

1. **Home Assistant OS in a Virtual Machine (VM)**:
   - This is the simplest way to get started with minimal setup.
   - You can run HAOS in a VM using software like VirtualBox or Proxmox.
   - This method gives you a full-featured experience with minimal manual management.

2. **Home Assistant Supervised on Debian**:
   - If you specifically want to test the Supervised installation method, you can install it on a local Debian machine or VM.
   - Be prepared for more manual management of Docker and system dependencies.

3. **Home Assistant Container (Docker)**:
   - If you're comfortable with Docker, running Home Assistant in a container allows you to test it quickly without committing to a full installation.

### **Conclusion**

Home Assistant developers primarily use devcontainers, local virtual environments, and automated testing frameworks like `pytest` and Syrupy for snapshot testing to ensure stability across all installation methods, including HAOS. They do not typically use Home Assistant Supervised to test HAOS directly since each method has different requirements and purposes.

For your own testing needs before deployment, starting with HAOS in a VM would be the easiest approach if you're looking for simplicity and stability. If you want more control over your environment and don't mind managing Docker manually, then installing Home Assistant Supervised on Debian might be more aligned with your goals.

### Sources

- [Set up development environment | Home Assistant Developer Docs](https://developers.home-assistant.io/docs/development_environment/)
- [Testing your code - Home Assistant Developer Docs](https://developers.home-assistant.io/docs/development_testing/)

## User

Provide a high-level overview and analysis on the way that contributors to Home Assistant test locally, focusing on vs code and wsl2/docker environments on windows.

I would like to `git clone` or just simply download something that will automatically configure my dev environment for home assistant. If dev container is recommended, tell me the top 10

## Assistant

### **Overview of Local Development for Home Assistant on Windows**

Contributors to Home Assistant typically use **Visual Studio Code (VS Code)** with **Dev Containers** or **WSL2** (Windows Subsystem for Linux) and Docker to set up their local development environments. These setups offer flexibility and ease of use, especially when developing on Windows, where native Linux tools are not available.

#### **Key Development Environments Used by Contributors**

1. **Visual Studio Code + Dev Containers**
   - This is the recommended approach for setting up a Home Assistant development environment. The Dev Container setup provides a pre-configured environment with all the necessary dependencies, making it easy to get started without manually installing Python, Docker, or other tools.
   - The Dev Container is built using Docker and includes everything needed for Home Assistant development, such as Python, linting tools, and debugging configurations.
   - It supports debugging out-of-the-box, allowing contributors to set breakpoints and run Home Assistant directly from VS Code.

2. **WSL2 (Windows Subsystem for Linux) + Docker**
   - For Windows users who prefer more control or need access to hardware (like USB devices), WSL2 is a popular option. WSL2 allows developers to run a full Linux environment on Windows, which is more compatible with Home Assistant's dependencies.
   - Docker can be installed within WSL2, allowing you to run Home Assistant in containers while benefiting from a near-native Linux environment.
   - This setup is useful for those who need to interact with hardware like Zigbee or Bluetooth adapters that may not be easily accessible through standard Docker containers on Windows.

### **Setting Up a Development Environment**

#### **Using Dev Containers in Visual Studio Code**

The easiest way to set up your development environment is by using **Dev Containers** in VS Code. This method automates much of the configuration process and ensures that you have all the necessary tools installed.

Here's how you can set it up:

1. **Fork the Home Assistant Core Repository**:
   - Go to the [Home Assistant Core GitHub repository](https://github.com/home-assistant/core) and fork it.

2. **Clone Your Fork Locally**:
   - Clone your forked repository locally using Git:
     ```bash
     git clone https://github.com/YOUR_GIT_USERNAME/core
     cd core
     ```

3. **Open in Visual Studio Code**:
   - Open the cloned repository in VS Code.
   - If prompted, install the recommended extensions (e.g., Python, Prettier).
   
4. **Reopen in Dev Container**:
   - VS Code will prompt you to reopen the project in a dev container. This will download and configure the necessary Docker images.
   - The initial setup may take some time as it pulls all dependencies.

5. **Run Home Assistant Core**:
   - Once in the dev container, open the command palette (`Ctrl + Shift + P`), select `Tasks: Run Task`, and choose `Run Home Assistant Core`.
   - Check for any errors in the terminal output.
   - Navigate to `http://localhost:8123` in your browser to access the running instance of Home Assistant.

6. **Debugging**:
   - The dev container supports debugging out-of-the-box. You can press `F5` to start debugging and set breakpoints within your code.

#### **Using WSL2 + Docker**

If you prefer more control over your environment or need hardware access:

1. **Install WSL2**:
   - Follow Microsoft's instructions to install WSL2 and set up an Ubuntu distribution.

2. **Install Docker in WSL2**:
   - Install Docker inside WSL2 by following Docker's official documentation for Linux installations.

3. **Clone the Repository**:
   - Clone your forked repository inside WSL2:
     ```bash
     git clone https://github.com/YOUR_GIT_USERNAME/core
     cd core
     ```

4. **Set Up Python Environment**:
   - Install Python 3.12 and other dependencies as outlined in [Home Assistant's developer documentation](https://developers.home-assistant.io/docs/development_environment/):
     ```bash
     sudo apt-get update
     sudo apt-get install python3-pip python3-venv
     python3 -m venv venv
     source venv/bin/activate
     pip install -r requirements.txt
     ```

5. **Run Home Assistant Core**:
   - Run Home Assistant inside WSL2 using the following command:
     ```bash
     hass -c config
     ```

### **Top 10 Recommended Dev Containers**

For those using dev containers, here are some of the most commonly used ones by contributors:

1. `ghcr.io/home-assistant/devcontainer:core` – For core development (most common).
2. `ghcr.io/home-assistant/devcontainer:addons` – For developing add-ons.
3. `ghcr.io/home-assistant/devcontainer:supervisor` – For developing Supervisor components.
4. `ghcr.io/home-assistant/devcontainer:frontend` – For frontend/UI development.
5. `ghcr.io/home-assistant/devcontainer:docs` – For contributing to documentation.
6. `ghcr.io/home-assistant/devcontainer:test` – A minimal container for running tests.
7. `ghcr.io/home-assistant/devcontainer:hassio` – For Hass.io-related development.
8. `ghcr.io/home-assistant/devcontainer:integration-tests` – For running integration tests.
9. `ghcr.io/home-assistant/devcontainer:python-linting` – Focused on linting Python code.
10. `ghcr.io/home-assistant/devcontainer:ci` – Used for continuous integration testing.

These containers are available on GitHub under [Home Assistant's devcontainer repository](https://github.com/home-assistant/devcontainer). Each container is tailored for specific development tasks like core development, add-ons, or frontend work.[3]

### **Conclusion**

To develop locally for Home Assistant on Windows, using **Visual Studio Code with Dev Containers** is highly recommended due to its ease of setup and pre-configured environment that includes all necessary tools for development and debugging. Alternatively, if you need more control or hardware access, setting up a development environment using **WSL2 + Docker** is another effective option.[1][2]

For most contributors, starting with a dev container will save time and effort while ensuring compatibility across different systems.[2][3]

### Sources

- [Setting up a Home Assistant development environment on Windows ...](https://gist.github.com/codyc1515/cfd5b03c753678815b5219514e584e29)
- [Set up development environment | Home Assistant Developer Docs](https://developers.home-assistant.io/docs/development_environment/)
- [Custom devcontainers for the home-assistant org - GitHub](https://github.com/home-assistant/devcontainer)

## User

Am confusion. Imagine I already have home assistant installed on a server. How do I interact with it and manage it with vs code? Deployment especially. Is this still possible with HaOS?

## Assistant

### **How to Manage Home Assistant with Visual Studio Code (VS Code)**

If you already have **Home Assistant OS (HAOS)** installed on a server, you can still interact with and manage it using **Visual Studio Code**. There are several ways to do this, depending on whether you want to edit configuration files locally or remotely. Here's a high-level overview of the available options:

### **1. Using the Visual Studio Code Add-on in Home Assistant**

One of the easiest ways to manage Home Assistant (especially for HAOS) is by using the **Visual Studio Code add-on** directly within Home Assistant. This method allows you to edit configuration files and manage your setup from within the Home Assistant web interface.

#### Steps to Set Up the VS Code Add-on:
1. **Install the VS Code Add-on**:
   - In Home Assistant, go to **Settings > Add-ons > Add-on Store**.
   - Search for "Studio Code Server" and install it.
   - Once installed, configure it to start on boot, enable auto-update, and show in the sidebar if desired.
   - Start the add-on and open the web UI.

2. **Edit Configuration Files**:
   - You can now access and edit files like `configuration.yaml` directly within your browser using the VS Code interface.
   - The add-on supports features like syntax highlighting, autocompletion, and error checking for YAML files.
   
3. **Deployment**:
   - After making changes, always use Home Assistant's built-in **Configuration Check** tool before restarting to ensure there are no syntax errors that could break your setup.

This method is ideal because it integrates seamlessly with HAOS and doesn't require any external tools or complex setups.

### **2. Using VS Code Locally via Samba Share or SSH**

If you prefer to use a locally installed version of VS Code on your computer (Windows, macOS, or Linux), you can connect to your Home Assistant server either via **Samba Share** or **SSH**.

#### Option 1: Samba Share
- Install the **Samba Share add-on** in Home Assistant. This will allow you to access Home Assistant's file system from your local machine.
- Once installed and configured, you can map the network drive on your computer (e.g., `\\<home_assistant_ip>\config`) and open it in VS Code.
- You can then edit files like `configuration.yaml` directly from your local machine.

#### Option 2: SSH with Remote - SSH Extension
- Install the **Remote - SSH extension** in VS Code.
- Use SSH to connect directly to your Home Assistant server (assuming SSH access is enabled).
- Once connected, you can open and edit files on the remote server as if they were local files.

##### Steps for SSH Setup:
1. Install the Remote - SSH extension in VS Code.
2. Open VS Code and click on **Remote Explorer** in the sidebar.
3. Add a new SSH target by entering `ssh <username>@<home_assistant_ip>`.
4. Connect to the server and authenticate using your SSH credentials.
5. Once connected, navigate to the `/config` directory where all Home Assistant configuration files are stored.

Both methods allow you to work with a full-featured version of VS Code while interacting with your Home Assistant configuration remotely.

### **3. Deployment Process**

For deployment (i.e., applying changes after editing), follow these steps:
1. After editing configuration files (e.g., `configuration.yaml`), use Home Assistant’s built-in **Configuration Validation** tool under **Settings > System > Check Configuration**.
2. If no errors are found, restart Home Assistant from **Settings > System > Restart**.

This process ensures that any changes made via VS Code are correctly applied without breaking your system.

### **4. Using Dev Containers for Development**

If you're developing custom components or integrations for Home Assistant rather than just managing an existing installation, using a **Dev Container** is highly recommended. Dev Containers provide a pre-configured development environment that includes all necessary tools for building and testing components locally.

#### Steps for Setting Up a Dev Container:
1. Fork and clone the [Home Assistant Core repository](https://github.com/home-assistant/core).
2. Open the repository in VS Code.
3. When prompted, reopen the project in a dev container (VS Code will handle setting up Docker containers).
4. You can now develop custom integrations or features inside this isolated environment without affecting your live instance of Home Assistant.

This setup is particularly useful if you're contributing code back to Home Assistant or building complex custom components that need thorough testing before deployment.

### **Conclusion**

You have multiple options for interacting with and managing an existing Home Assistant installation using Visual Studio Code:

- The easiest method is installing the **VS Code add-on** through HAOS, which allows you to edit configuration files directly from within the web interface.
- For more advanced users who prefer working locally, you can connect via **Samba Share** or use the **Remote - SSH extension** in VS Code.
- If you're developing custom components or integrations, using a **Dev Container** provides an isolated development environment tailored for Home Assistant development.

Each method has its advantages depending on whether you're managing an existing setup or actively developing new features for Home Assistant.

### Sources

- [How to Install Visual Studio Code on Home Assistant - Pi My Life Up](https://pimylifeup.com/home-assistant-visual-studio-code/)
- [Set up development environment | Home Assistant Developer Docs](https://developers.home-assistant.io/docs/development_environment/)
- [How to edit Home Assistant config from locally installed Visual ...](https://community.home-assistant.io/t/how-to-edit-home-assistant-config-from-locally-installed-visual-studio-code/322571)
- [GitHub - home-assistant/devcontainer: Custom devcontainers for the home-assistant org](https://github.com/home-assistant/devcontainer)
- [Home Assistant Community Add-on: Visual Studio Code](https://community.home-assistant.io/t/home-assistant-community-add-on-visual-studio-code/107863)
- [Using Visual Studio to edit your Home Assistant configuration.yaml ...](https://www.homeautomationguy.io/blog/home-assistant-tips/using-visual-studio-to-edit-your-home-assistant-configuration-yaml-file-over-ssh)
