---
source_url: "https://www.perplexity.ai/search/18d24eb9-5df7-49d6-b918-608ed263356d"
thread_uuid: "bff3efc8-aa84-4b97-92c4-fa21503226b7"
slug: "18d24eb9-5df7-49d6-b918-608ed263356d"
title: "in 2022 i had a home assistant server and i regularly kept backups. However I can't find any of my local copies anymore. I know for a fact I had at least one cloud backup solution to make sure i would always have a copy somewhere. The problem is the addons have since been renamed/restructured and extensions have since been obsoleted by better ones. So i have no idea which one i used anymore.

What is the top 3 most likely places I would find it and how?"
extracted_at: "2026-06-29T12:47:52.977Z"
matched_keywords: ["home assistant","backup","ha"]
entry_count: 1
provenance: perplexity-rest-api
---

# in 2022 i had a home assistant server and i regularly kept backups. However I can't find any of my local copies anymore. I know for a fact I had at least one cloud backup solution to make sure i would always have a copy somewhere. The problem is the addons have since been renamed/restructured and extensions have since been obsoleted by better ones. So i have no idea which one i used anymore.

What is the top 3 most likely places I would find it and how?

Source: [Perplexity thread](https://www.perplexity.ai/search/18d24eb9-5df7-49d6-b918-608ed263356d)

## User

in 2022 i had a home assistant server and i regularly kept backups. However I can't find any of my local copies anymore. I know for a fact I had at least one cloud backup solution to make sure i would always have a copy somewhere. The problem is the addons have since been renamed/restructured and extensions have since been obsoleted by better ones. So i have no idea which one i used anymore.

What is the top 3 most likely places I would find it and how?

## Assistant

If you had a Home Assistant server in 2022 and used a cloud backup solution, but are unsure which one you used, here are the **top 3 most likely places** to search for your backups, along with steps on how to check each:

## **1. Google Drive**
One of the most popular cloud backup solutions for Home Assistant is Google Drive, thanks to the widely-used **Home Assistant Google Drive Backup** add-on (now possibly renamed or updated). This add-on automatically uploads backups from Home Assistant to a dedicated folder in your Google Drive.

### How to Check:
- Log into your Google Drive account.
- Search for a folder named **Home Assistant Backups** or something similar.
- Inside the folder, look for `.tar` files or other backup formats that Home Assistant uses.
- If you find backups, you can download them and restore them to your current Home Assistant instance.

If you don't see the folder, try searching for terms like "backup" or "Home Assistant" in the search bar of Google Drive.

## **2. OneDrive**
Another likely place is **OneDrive**, especially if you were using a custom or community-developed add-on like the **OneDrive Backup Add-on**. This add-on allows users to sync their Home Assistant backups directly to OneDrive.

### How to Check:
- Log into your OneDrive account.
- Search for a folder named **Home Assistant Backups** or something similar.
- Look for `.tar` files or other backup formats.
- If found, download the backup file and place it in your Home Assistant `/backup` directory to restore it.

If you don’t see any relevant folders, try searching for "backup" or "Home Assistant" in the OneDrive search bar.

## **3. Dropbox**
Some users prefer Dropbox as their cloud storage provider. There are solutions like **Dropback for Dropbox** that sync Home Assistant backups to Dropbox.

### How to Check:
- Log into your Dropbox account.
- Search for a folder named **Home Assistant Backups**, **Dropback**, or similar.
- Look for `.tar` files or other backup formats.
- Download any found backups and restore them by placing them in the `/backup` directory of your Home Assistant instance.

If you don't see any relevant folders, use the search function within Dropbox to look for keywords like "backup" or "Home Assistant."

---

### **Additional Tips:**
1. **Check Your Add-ons History:** If you still have access to your old Home Assistant instance (or an old configuration), check which add-ons were installed by going to **Settings > Add-ons, Backups & Supervisor > Add-ons**. This might give you a clue about which cloud service was used.
2. **Look at Email Notifications:** Some backup services send email notifications when backups are uploaded. Check your email inboxes (Google, Microsoft, Dropbox) for any notifications related to Home Assistant backups around 2022.
3. **Search Through Old Configurations:** If you have access to any old configuration files (like `configuration.yaml`), look for references to Google Drive, OneDrive, Dropbox, or other cloud services that may have been used for backups.

By checking these three most likely places and following these steps, you should be able to locate your missing backups.

### Sources

- [Addon - OneDrive Backup - Share your Projects!](https://community.home-assistant.io/t/addon-onedrive-backup/480692)
- [How to automatically backup home assistant to google drive](https://www.juanmtech.com/how-to-automatically-backup-home-assistant-to-google-drive/)
- [Real off-site backups with 2023.6 : r/homeassistant - Reddit](https://www.reddit.com/r/homeassistant/comments/1446qjr/real_offsite_backups_with_20236/)
- [Five Best Cloud Backup Services for Businesses in 2022 - Spiceworks](https://www.spiceworks.com/tech/data-management/articles/best-cloud-backup-services/)
- [The best cloud backup services in 2024 - Tom's Guide](https://www.tomsguide.com/best-picks/best-cloud-backup)
