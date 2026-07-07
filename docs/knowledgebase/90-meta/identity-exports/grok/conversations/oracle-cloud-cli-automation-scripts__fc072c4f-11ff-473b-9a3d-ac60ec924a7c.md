---
source_url: "https://grok.com/c/fc072c4f-11ff-473b-9a3d-ac60ec924a7c"
conversation_id: "fc072c4f-11ff-473b-9a3d-ac60ec924a7c"
title: "Oracle Cloud CLI Automation Scripts"
extracted_at: "2026-06-29T16:26:28.448Z"
message_count: 2
export_suite: "identity"
provenance: grok-rest-api
---

# Oracle Cloud CLI Automation Scripts

Source: [Grok conversation](https://grok.com/c/fc072c4f-11ff-473b-9a3d-ac60ec924a7c)

## User

_Time: 2025-07-01T21:53:08.259Z_

is there any oracle cloud cli that somebody created that'll preconfigure and setup and deploy all the stuff for the 'always free tier' automatically by having the user run a script? don't be highly specific to this just lookup general automation of oracle cloud cli for users provided by *people*, not documentation. I want existing templates or guides or full scripts/examples users have written like e.g. reddit or github.

## Assistant

_Time: 2025-07-01T21:54:04.269Z_

Several user-developed automation scripts and templates exist for Oracle Cloud Infrastructure (OCI) CLI to streamline the setup and deployment of resources in the Always Free Tier. These community contributions, often shared on platforms like GitHub and Reddit, aim to simplify the process of provisioning and configuring free-tier resources, particularly to bypass common issues like the "Out of Host Capacity" error for ARM instances. Below is a summary of notable examples, focusing on scripts and guides created by individuals, as requested, rather than official documentation.

1. **GitHub: mohankumarpaluru/oracle-freetier-instance-creation**
   - **Description**: This repository provides Python and shell scripts to automate the creation of Oracle Free Tier ARM instances (4 OCPU, 24 GB RAM) or AMD instances (1 OCPU, 1 GB RAM) with minimal manual intervention. The script addresses the challenge of high demand for free-tier resources by retrying instance creation every 60 seconds (configurable via the `REQUEST_WAIT_TIME_SECS` variable) until successful. It generates a file (`INSTANCE_CREATED`) with instance details upon completion and supports optional Gmail or Telegram notifications.
   - **Key Features**:
     - Automates instance creation to bypass "Out of Capacity" errors.
     - Requires an existing subnet ID or a temporary free-tier AMD instance (e.g., VM.Standard.E2.1.Micro with Ubuntu 22.04) to derive network configurations.
     - Configurable parameters in an `oci.env` file, including OCI API keys, region, and instance shape.
     - Includes a flowchart for the script’s logic, detailing steps like loading environment variables, initializing OCI clients, and handling errors.
   - **Setup Requirements**:
     - OCI CLI installed and configured with API keys.
     - An existing subnet or a temporary AMD instance for network details.
     - Python environment for running the script.
   - **Usage**: Clone the repository, follow the README to set up dependencies, configure the `oci.env` file, and run `./setup_init.sh` to install and launch the script.
   - **Source**: GitHub repository by mohankumarpaluru.[](https://github.com/mohankumarpaluru/oracle-freetier-instance-creation)
   - **Community Feedback**: Reddit users on r/oraclecloud have praised this script for reducing manual effort, though some reported issues like "Too many requests" errors (HTTP 429), which may require adjusting retry intervals or checking API rate limits.[](https://www.reddit.com/r/oraclecloud/comments/18fz7jb/yet_another_script_to_help_with_arm_out_of_host/)

2. **GitHub: hitrov/oci-arm-host-capacity**
   - **Description**: This PHP-based script automates ARM instance creation to bypass the "Out of Host Capacity" error. It checks for existing instances of the specified shape and attempts creation when capacity becomes available. The script is particularly useful for Always Free Tier users aiming to secure ARM instances (e.g., VM.Standard.A1.Flex with 4 cores, 24 GB RAM).
   - **Key Features**:
     - Configurable via a `.env` file for parameters like region, tenancy, user, and private key path.
     - Supports customization of instance shapes (e.g., 1/6, 2/12, 3/18, or 4/24 OCPU/RAM combinations).
     - Includes a check for existing instances to avoid exceeding free-tier limits.
   - **Setup Requirements**:
     - OCI CLI and PHP environment.
     - API key pair generated and saved in a `.oci` directory.
     - Manual initiation of instance creation in the OCI Console to derive parameters like image ID.
   - **Usage**: Modify the `.env` file with tenancy and key details, then run the script. It can be scheduled via cron for periodic attempts.
   - **Source**: GitHub repository by hitrov.[](https://github.com/hitrov/oci-arm-host-capacity)
   - **Community Feedback**: Reddit discussions highlight its effectiveness, with users reporting success after multiple attempts (e.g., 19 minutes or 2 days). Some faced PHP version conflicts or rate-limiting issues, suggesting a retry interval of 10 minutes or more.[](https://www.reddit.com/r/oraclecloud/comments/on2e25/resolving_oracle_cloud_out_of_capacity_issue_and/)

3. **GitHub: futchas/oracle-cloud-free-arm-instance**
   - **Description**: A Bash script leveraging the official OCI CLI to automate ARM instance creation. It simplifies the process by allowing users to configure CPU cores, memory, boot volume size, and SSH keys, addressing the "Out of Capacity" issue through repeated attempts.
   - **Key Features**:
     - Configurable parameters in the script, including request interval (default: every minute).
     - Displays JSON error responses until creation succeeds.
     - Recommends running on a free-tier AMD instance for persistent execution.
   - **Setup Requirements**:
     - OCI CLI installed (instructions provided for Linux/Unix).
     - SSH key for instance access.
     - Optional: A free-tier AMD instance to run the script in the background.
   - **Usage**: Edit the script to set parameters (e.g., CPU, memory, SSH key path), then execute it. The script logs errors and continues until successful.
   - **Source**: GitHub repository by futchas.[](https://github.com/futchas/oracle-cloud-free-arm-instance)
   - **Community Feedback**: Users appreciate its simplicity compared to Python or PHP alternatives, though success may take days or weeks due to capacity constraints.

4. **Reddit: r/oraclecloud Community Scripts and Guides**
   - **Description**: The r/oraclecloud subreddit hosts discussions and user-shared scripts for automating Free Tier setups. A notable post from 2023 describes a Python script by u/trixter127 that automates ARM instance creation with Gmail notifications, similar to the mohankumarpaluru script. Another post from 2021 by u/hitrov details both OCI CLI and PHP approaches, linking to Medium articles and the aforementioned GitHub repository.[](https://www.reddit.com/r/oraclecloud/comments/18fz7jb/yet_another_script_to_help_with_arm_out_of_host/)[](https://www.reddit.com/r/oraclecloud/comments/on2e25/resolving_oracle_cloud_out_of_capacity_issue_and/)
   - **Key Insights**:
     - Users often combine scripts with cron jobs to retry instance creation (e.g., every 10–20 minutes) to avoid rate limits.
     - Common challenges include API authentication errors (e.g., system time sync issues) and subnet configuration, which some resolve by creating a VPC and subnet manually via the OCI Console.
     - Community tips include upgrading to Pay As You Go (PAYG) for better instance availability while staying within free-tier limits, as PAYG accounts face fewer capacity restrictions.[](https://github.com/hitrov/oci-arm-host-capacity)
   - **Examples**:
     - u/trixter127’s script automates ARM instance creation and notifies via Gmail, with a setup script (`setup_init.sh`) for dependencies.[](https://www.reddit.com/r/oraclecloud/comments/18fz7jb/yet_another_script_to_help_with_arm_out_of_host/)
     - u/hitrov’s guide suggests using the OCI Stacks feature to save instance parameters as a template, simplifying script configuration.[](https://www.reddit.com/r/oraclecloud/comments/on2e25/resolving_oracle_cloud_out_of_capacity_issue_and/)
   - **Source**: Reddit r/oraclecloud subreddit.[](https://www.reddit.com/r/oraclecloud/comments/18fz7jb/yet_another_script_to_help_with_arm_out_of_host/)[](https://www.reddit.com/r/oraclecloud/comments/on2e25/resolving_oracle_cloud_out_of_capacity_issue_and/)

5. **GitHub: neitsab/awesome-oracle-cloud-free-tier**
   - **Description**: A curated list of resources, including tutorials and scripts, for maximizing the Oracle Cloud Free Tier. While not a single script, it references Terraform scripts for provisioning resources like Kubernetes clusters and guides for installing custom OS images (e.g., Debian, Arch Linux) on free-tier instances.
   - **Key Features**:
     - Links to Terraform scripts for automated Kubernetes cluster setup using Always Free resources.
     - Guides for replacing default Oracle Linux with Ubuntu, Debian, or Arch Linux ARM, useful for preconfiguring instances.
     - References community tutorials for VPNs, WordPress, and other applications on free-tier instances.
   - **Usage**: Users can explore linked repositories for Terraform templates or follow setup guides for specific use cases (e.g., deploying an Nginx website).
   - **Source**: GitHub repository by neitsab.[](https://github.com/neitsab/awesome-oracle-cloud-free-tier)
   - **Community Feedback**: Valued for its comprehensive collection, though some scripts require Terraform knowledge, which may be a barrier for beginners.

**General Observations and Recommendations**:
- **Common Approach**: Most scripts focus on automating ARM instance creation due to high demand and capacity issues. They use the OCI CLI to retry requests, configurable via environment files or script parameters.
- **Challenges**: Users frequently encounter API rate limits (HTTP 429 errors), subnet configuration issues, or authentication errors. Solutions include increasing retry intervals, ensuring system time sync, and manually creating VPCs/subnets.
- **Setup Tips**:
  - Install the OCI CLI using official instructions (e.g., `bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)"`).[](https://github.com/oracle/oci-cli)
  - Generate OCI API keys from the OCI Console and configure them in `~/.oci/config`.
  - Use a free-tier AMD instance (VM.Standard.E2.1.Micro) to run scripts persistently, as local execution may be interrupted.
- **Community Advice**: Upgrading to PAYG is recommended for better instance availability, with budget alerts to avoid charges. Backups are critical, as Oracle may terminate idle instances or accounts without warning.[](https://github.com/hitrov/oci-arm-host-capacity)[](https://gist.github.com/rssnyder/51e3cfedd730e7dd5f4a816143b25dbd)
- **Limitations**: No single script fully automates all Always Free Tier resources (e.g., block storage, load balancers) alongside compute instances. Most focus on compute instance creation, requiring manual configuration for additional services.

**Conclusion**:
The scripts by mohankumarpaluru, hitrov, and futchas on GitHub are robust starting points for automating Oracle Cloud Free Tier instance creation, with mohankumarpaluru’s Python script being particularly user-friendly due to its notification features and clear setup guide. Reddit’s r/oraclecloud community provides valuable context and troubleshooting tips, such as handling rate limits or subnet setup. For broader automation (e.g., Kubernetes or custom OS), neitsab’s curated list offers additional resources. To use these scripts, ensure OCI CLI is installed, API keys are configured, and network prerequisites (e.g., subnet ID) are met. Always verify configurations to stay within free-tier limits and consider PAYG for reliability.

If you need assistance setting up a specific script or want me to analyze one in more detail, please let me know!
