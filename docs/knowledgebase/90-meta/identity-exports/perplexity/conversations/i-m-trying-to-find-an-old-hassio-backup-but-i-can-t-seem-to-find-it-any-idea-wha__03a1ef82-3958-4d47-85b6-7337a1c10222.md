---
source_url: "https://www.perplexity.ai/search/3d3b720d-3589-47cf-8cf8-a5dc3cf9ddb3"
thread_uuid: "03a1ef82-3958-4d47-85b6-7337a1c10222"
slug: "3d3b720d-3589-47cf-8cf8-a5dc3cf9ddb3"
title: "i'm trying to find an old hassio backup but i can't seem to find it. any idea what the conventions are for the filename/extension in home assistant's backup system? presumably i could just search keywords if you can determine this."
extracted_at: "2026-06-29T16:09:50.726Z"
matched_keywords: []
export_suite: "identity"
entry_count: 2
provenance: perplexity-rest-api
---

# i'm trying to find an old hassio backup but i can't seem to find it. any idea what the conventions are for the filename/extension in home assistant's backup system? presumably i could just search keywords if you can determine this.

Source: [Perplexity thread](https://www.perplexity.ai/search/3d3b720d-3589-47cf-8cf8-a5dc3cf9ddb3)

## User

i'm trying to find an old hassio backup but i can't seem to find it. any idea what the conventions are for the filename/extension in home assistant's backup system? presumably i could just search keywords if you can determine this.

## Assistant

In Home Assistant's backup system (often referred to as **Hassio**), backups are stored as **`.tar`** files, which are essentially tarballs containing your configuration data and metadata. However, the filenames of these backups do not follow a straightforward naming convention based on the name you provide during backup creation. Instead, they are typically assigned **random hexadecimal strings** as filenames, such as `969fad88.tar` or `a1467f82.tar`.[1][2][3]

Here are the key details about Home Assistant's backup filenames:

- **File extension**: The backups use the `.tar` extension.
- **Filename format**: The default filenames are random hexadecimal strings, not based on the name you assign to the backup. For example, even if you name your backup "MyBackup", the file might still be saved as something like `b1be9d49.tar`.[5][1]
- **Location**: Backups are typically stored in a subdirectory called `backups` within your Home Assistant configuration directory.[6]
  
If you're trying to find an old backup, you can search for files with the `.tar` extension in your `backups` folder. Since the filenames are random, you won't be able to search by a specific name unless you recall part of the hexadecimal string. However, if you know when the backup was created, you can sort by date and look for `.tar` files created around that time.

### Sources

- [User configurable backup filename · Issue #112443 - GitHub](https://github.com/home-assistant/core/issues/112443)
- [How do I name the backup file? - Home Assistant Community](https://community.home-assistant.io/t/how-do-i-name-the-backup-file/699449)
- [Specify filename for backup tarball - Home Assistant Community](https://community.home-assistant.io/t/specify-filename-for-backup-tarball/506448)
- [Home Assistant Backup Methods & Best Practices - SmartHomeScene](https://smarthomescene.com/guides/home-assistant-backup-methods-and-best-practices/)
- [Default backup name of hassio.backup_full - Home Assistant OS](https://community.home-assistant.io/t/default-backup-name-of-hassio-backup-full/343787)
- [Backup - Home Assistant](https://www.home-assistant.io/integrations/backup/)

## User

```
"F:\Downloads\decent_backup_2022\a0d7b954_glances.tar.gz"
"F:\Downloads\decent_backup_2022\a0d7b954_motioneye.tar.gz"
"F:\Downloads\decent_backup_2022\a0d7b954_nginxproxymanager.tar.gz"
"F:\Downloads\decent_backup_2022\a0d7b954_plex.tar.gz"
"F:\Downloads\decent_backup_2022\a0d7b954_sonweb.tar.gz"
"F:\Downloads\decent_backup_2022\a0d7b954_ssh.tar.gz"
"F:\Downloads\decent_backup_2022\a0d7b954_tor.tar.gz"
"F:\Downloads\decent_backup_2022\addons_local.tar.gz"
"F:\Downloads\decent_backup_2022\backup.json"
"F:\Downloads\decent_backup_2022\core_ada.tar.gz"
"F:\Downloads\decent_backup_2022\core_configurator.tar.gz"
"F:\Downloads\decent_backup_2022\core_duckdns.tar.gz"
"F:\Downloads\decent_backup_2022\core_mariadb.tar.gz"
"F:\Downloads\decent_backup_2022\core_mosquitto.tar.gz"
"F:\Downloads\decent_backup_2022\core_rpc_shutdown.tar.gz"
"F:\Downloads\decent_backup_2022\homeassistant.tar.gz"
"F:\Downloads\decent_backup_2022\@PaxHeader"
"F:\Downloads\decent_backup_2022\45df7312_zigbee2mqtt.tar.gz"
"F:\Downloads\decent_backup_2022\a0d7b954_aircast.tar.gz"
"F:\Downloads\decent_backup_2022\a0d7b954_foldingathome.tar.gz"
```

how to install this backup as a unified entity.

## Assistant

To restore your Home Assistant from the backup files you listed, you need to combine them into a unified backup that Home Assistant can recognize and restore. Here’s how you can do it:

### **Steps to Restore Home Assistant Backup**

1. **Ensure Backup Files Are in the Correct Format**:
   The files you have are individual `.tar.gz` archives for various add-ons and components. To restore this backup as a unified entity, you need to ensure that they are placed in the correct structure that Home Assistant expects. Typically, a full backup is stored as a single `.tar` file containing all the necessary components (add-ons, configuration, etc.).

2. **Recreate the Unified Backup File**:
   If these files were part of a larger backup, they may need to be re-archived into a single `.tar` file that Home Assistant can recognize. You can do this by creating a new tarball that includes all the component `.tar.gz` files and any metadata files like `backup.json`.

   - On Linux/macOS, you can use:
     ```bash
     tar -cvf homeassistant_backup.tar addons_local.tar.gz core_ada.tar.gz core_configurator.tar.gz core_duckdns.tar.gz core_mariadb.tar.gz core_mosquitto.tar.gz core_rpc_shutdown.tar.gz homeassistant.tar.gz 45df7312_zigbee2mqtt.tar.gz a0d7b954_*.tar.gz backup.json
     ```
   - On Windows, you can use a tool like 7-Zip to create a new `.tar` archive containing all these files.

3. **Place the Backup in Home Assistant's Backup Directory**:
   Once you have created the unified `homeassistant_backup.tar`, place it in Home Assistant's backup directory. You can access this directory via SSH or Samba.

   - The default location for backups is `/config/backup/`. If you're using Samba or SSH, navigate to this directory and copy your `homeassistant_backup.tar` file there.
   
   Example command (assuming SSH):
   ```bash
   cp /path/to/homeassistant_backup.tar /config/backup/
   ```

4. **Restore the Backup via Home Assistant Interface**:
   After placing the backup file in the correct directory, follow these steps to restore it:

   - Go to **Settings** > **System** > **Backups** in your Home Assistant interface.
   - You should see your newly uploaded backup listed.
   - Select the backup and click on **Restore**.
   - Choose whether to perform a full restore or partial restore (e.g., only add-ons or configurations).
   
5. **Wait for Restoration to Complete**:
   The restoration process may take some time depending on the size of your backup and system performance. Once completed, Home Assistant will restart with the restored configuration.

### **Additional Notes**:

- Ensure that all required files are included in your new tarball (e.g., `homeassistant.tar.gz`, `addons_local.tar.gz`, etc.).
- If any critical metadata like `backup.json` is missing, Home Assistant may not recognize the backup correctly.
- If you encounter issues during restoration, verify that all hidden files (like `.storage`) are included in your backup as they contain essential configuration data.

By following these steps, you should be able to restore your Home Assistant instance from the individual component backups you've listed.

### Sources

- [Guide: Home Assistant Core - Restoring a Backup](https://community.home-assistant.io/t/guide-home-assistant-core-restoring-a-backup/626347)
- [How to restore a backup? : r/homeassistant - Reddit](https://www.reddit.com/r/homeassistant/comments/1fp5cu4/how_to_restore_a_backup/)
- [Restoring a Home Assistant backup after failure | Our Smart Home & Garden](https://smarthome.familykruse.eu/restoring-a-home-assistant-backup/)
