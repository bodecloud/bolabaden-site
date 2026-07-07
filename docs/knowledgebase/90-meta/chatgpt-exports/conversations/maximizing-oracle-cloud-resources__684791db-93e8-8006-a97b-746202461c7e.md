---
source_url: "https://chatgpt.com/c/684791db-93e8-8006-a97b-746202461c7e"
conversation_id: "684791db-93e8-8006-a97b-746202461c7e"
title: "Maximizing Oracle Cloud Resources"
extracted_at: "2026-06-29T12:02:31.963Z"
message_count: 7
provenance: auth-ui
---

# Maximizing Oracle Cloud Resources

Source: [ChatGPT conversation](https://chatgpt.com/c/684791db-93e8-8006-a97b-746202461c7e)

## User

how is it possible to make a shareable storage attachment?? what tech is it using and what's the pros/cons? is it slower for example?

## User

i'm confused. i have the storage attached but i can't see it in my instance when i ssh in and execute sudo df -h

## Assistant

That's a great final question — and the answer is a bit nuanced:

🧵 TL;DR — The E2.1 shape is part of the Always Free tier only, and not typically available in Pay As You Go (PAYG) accounts unless previously provisioned.
🧩 Details:

E2.1 is part of the “Always Free” eligible shapes

Oracle provides certain shapes like VM.Standard.E2.1.Micro exclusively for Always Free.

These shapes are not normally available to PAYG accounts for general provisioning unless already in use prior to upgrade.

Upgrading to PAYG doesn't guarantee access to E2 shapes

When you switch to PAYG, your account can now access more powerful, paid shapes like VM.Standard.A1.Flex, VM.Standard3.Flex, etc.

But oddly, Oracle may remove or hide Always Free-only shapes like E2.1 or E2.1.Micro from new provisioning under PAYG.

Capacity may still be an issue regardless of billing plan

Oracle has capacity zones per region and AD. Some shapes (like A1, E2) are extremely popular and limited.

Upgrading to PAYG can prioritize you in capacity queues, but doesn't unlock all shape families, especially if they’re gated to Always Free.

🔍 Confirming Availability:

To check what shapes are available in your brother’s account:

Bash
oci compute shape list --compartment-id <compartment_ocid> --output table

Or in the OCI console:

Go to Instances → Create Instance

In the shape picker, search for E2 or scroll down to see if E2.1 appears.

✅ What You Can Do:

If you need low-cost, burstable compute on PAYG:

Use VM.Standard.A1.Flex (Ampere/Arm) — it’s eligible for Always Free and scalable in PAYG.

For x86 compatibility and better availability:

Try VM.Standard3.Flex or VM.Standard.E4.Flex (if your region allows).

If E2.1 was already used before upgrading, it may still be available to restart/redeploy. If not: no way to regain it under PAYG.

🚨 Recommendation:

Keep at least one account Always Free, since that’s the only reliable way to retain long-term access to E2.1.

Let me know if you want help choosing a shape or need performance comparisons!

## User

oh shit there's a cli? how do I install that.

## Assistant

Yup — Oracle Cloud has a full-featured CLI, and it's extremely useful for automation, checking regional shape availability, scripting backups, etc.

Here’s a quick guide to installing the OCI CLI:

✅ Step-by-Step: Install Oracle Cloud CLI (OCI CLI)
🐧 Linux/macOS (including Ubuntu)
Bash
bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)"

This script will:

Download and install the CLI

Ask for an install path (default is fine)

Add the CLI to your $PATH

🪟 Windows (using PowerShell)

Open PowerShell as Administrator, then run:

PowerShell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-WebRequest -Uri https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.ps1 -OutFile install.ps1
.\install.ps1
🧪 Verify the install

Once installed, verify it works:

Bash
oci --version
🔐 Configure your credentials

After installation, run:

Bash
oci setup config

It will prompt for:

Tenancy OCID

User OCID

Compartment OCID

Region

API private key path (can auto-generate)

You’ll need to grab these values from:

User settings: for OCID and API key upload

Tenancy page: for tenancy OCID

Region: e.g., us-chicago-1, us-phoenix-1

🛠️ Example commands
🔍 List available shapes:
Bash
oci compute shape list --compartment-id <compartment_ocid> --output table
📦 List all instances:
Bash
oci compute instance list --compartment-id <compartment_ocid> --output table
📝 Helpful CLI Docs:

OCI CLI GitHub

Oracle Docs: Installing CLI

Let me know if you want a script to automatically find which regions support a certain shape (E2.1, A1.Flex, etc.) — I can drop that for you too.

## User

brunner56@Wizard-PC:/mnt/c/Users/boden$ sudo bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)"
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 16926  100 16926    0     0   138k      0 --:--:-- --:--:-- --:--:--  138k

    ******************************************************************************
    You have started the OCI CLI Installer in interactive mode. If you do not wish
    to run this in interactive mode, please include the --accept-all-defaults option.
    If you have the script locally and would like to know more about
    input options for this script, then you can run:
    ./install.sh -h
    If you would like to know more about input options for this script, refer to:
    https://github.com/oracle/oci-cli/blob/master/scripts/install/README.rst
    ******************************************************************************
Downloading Oracle Cloud Infrastructure CLI install script from https://raw.githubusercontent.com/oracle/oci-cli/v3.2.1/scripts/install/install.py to /tmp/oci_cli_install_tmp_55oZ.
################################################################################################################# 100.0%
Running install script.
python3 /tmp/oci_cli_install_tmp_55oZ
/tmp/oci_cli_install_tmp_55oZ:524: SyntaxWarning: invalid escape sequence '\E'
  command = "powershell -Command \"[Environment]::SetEnvironmentVariable(\\\"PATH\\\", \\\"{};\\\" + (Get-ItemProperty -Path 'Registry::HKEY_CURRENT_USER\Environment' -Name PATH).Path, \\\"User\\\")".format(exec_dir)  # noqa: W605
-- Verifying Python version.
-- Python version 3.12.3 okay.

===> In what directory would you like to place the install? (leave blank to use '/root/lib/oracle-cli'):


i hate user-specific installs. how to install it globally?
Show more

## Assistant

To install the Oracle OCI CLI globally (i.e., for all users), you can specify system-wide directories for the install path and executables. Here’s how to do it cleanly:

✅ Recommended Global Install Paths (for Linux/WSL)

Install directory: /opt/oracle-cli

Executable symlink: /usr/local/bin/oci

🧪 Full Command (non-interactive global install)
Bash
sudo bash -c "$(curl -L https://raw.githubusercontent.com/oracle/oci-cli/master/scripts/install/install.sh)" \
-- --accept-all-defaults \
--install-dir /opt/oracle-cli \
--exec-dir /usr/local/bin

✅ This will:

Install the CLI into /opt/oracle-cli

Create a global symlink at /usr/local/bin/oci (available in all users' $PATH)

Skip all interactive prompts

🧪 Confirm it worked:
Bash
which oci
# should output: /usr/local/bin/oci

oci --version
# e.g., 3.32.2
⚙️ Next Step: Configure

After install, configure the CLI with:

Bash
oci setup config

You can also pass the config values non-interactively if needed.

Let me know if you want to automate the config setup with environment variables or a script.
