---
source_url: "https://www.perplexity.ai/search/2399b730-50cd-4bd9-94b5-7c9d841f4b96"
thread_uuid: "eafe37f1-f23b-493d-9ea2-5fc5d7602b30"
slug: "2399b730-50cd-4bd9-94b5-7c9d841f4b96"
title: "On a Windows 10 system, identify the exact model numbers of both the motherboard and the installed RAM modules using only software-based solutions, without physically opening the computer or accessing internal hardware."
extracted_at: "2026-06-29T16:21:47.137Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# On a Windows 10 system, identify the exact model numbers of both the motherboard and the installed RAM modules using only software-based solutions, without physically opening the computer or accessing internal hardware.

Source: [Perplexity thread](https://www.perplexity.ai/search/2399b730-50cd-4bd9-94b5-7c9d841f4b96)

## User

On a Windows 10 system, identify the exact model numbers of both the motherboard and the installed RAM modules using only software-based solutions, without physically opening the computer or accessing internal hardware.

## Assistant

## Identifying the Motherboard Model Number

**Using System Information (msinfo32):**
1. Press `Win + R` to open the Run dialog.
2. Type `msinfo32` and press Enter.
3. In the System Information window, look for the following entries:
   - **BaseBoard Manufacturer:** Indicates the motherboard manufacturer.
   - **BaseBoard Product:** Displays the motherboard model number.
   - **BaseBoard Version:** Provides the version information of the motherboard.

**Using Command Prompt:**
1. Open Command Prompt:
   - Press `Win + X` and select **Command Prompt** or **Windows PowerShell**.
2. Enter the following command:
   ```cmd
   wmic baseboard get product,Manufacturer,version,serialnumber
   ```
3. Press Enter. This will display the manufacturer, product (model number), version, and serial number of the motherboard.

**Using PowerShell:**
1. Open PowerShell:
   - Press `Win + X` and select **Windows PowerShell**.
2. Execute the command:
   ```powershell
   Get-WmiObject -Class Win32_BaseBoard | Format-List Manufacturer,Product,Version,SerialNumber
   ```
3. Press Enter to view the motherboard details.

## Identifying the Installed RAM Modules Model Numbers

**Using Command Prompt:**
1. Open Command Prompt:
   - Press `Win + X` and select **Command Prompt** or **Windows PowerShell**.
2. Enter the following command:
   ```cmd
   wmic memorychip get manufacturer,partnumber,capacity,speed
   ```
3. Press Enter. This will display the manufacturer, part number (model number), capacity, and speed of each RAM module installed.

**Using PowerShell:**
1. Open PowerShell:
   - Press `Win + X` and select **Windows PowerShell**.
2. Execute the command:
   ```powershell
   Get-WmiObject -Class Win32_PhysicalMemory | Format-Table Manufacturer, PartNumber, Capacity, Speed
   ```
3. Press Enter to view detailed information about each RAM module.

**Using System Information:**
While the built-in System Information tool provides basic details about the installed RAM, it may not always display the exact model numbers. For more detailed information, consider using third-party software as described below.

## Using Third-Party Software for Detailed Information

**CPU-Z:**
1. Download and install [CPU-Z](https://www.cpuid.com/softwares/cpu-z.html).
2. Open CPU-Z and navigate to the **SPD** tab.
3. Select each memory slot to view detailed information, including the module's model number, manufacturer, size, and speed.

**Speccy:**
1. Download and install [Speccy](https://www.ccleaner.com/speccy).
2. Launch Speccy.
3. Navigate to the **RAM** section to view detailed information about each installed memory module, including model numbers.

These third-party tools provide more comprehensive details about your hardware components, ensuring you obtain exact model numbers for both the motherboard and RAM modules.
