---
source_url: "https://www.perplexity.ai/search/2467084f-c926-4b3e-a8a3-87e19f4852fc"
thread_uuid: "52ecf14c-811a-421f-aca9-e01e3d2391a5"
slug: "2467084f-c926-4b3e-a8a3-87e19f4852fc"
title: "What are the steps to create a bot in the Discord Developer Portal"
extracted_at: "2026-06-29T16:36:10.526Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# What are the steps to create a bot in the Discord Developer Portal

Source: [Perplexity thread](https://www.perplexity.ai/search/2467084f-c926-4b3e-a8a3-87e19f4852fc)

## User

What are the steps to create a bot in the Discord Developer Portal

## Assistant

To create a bot in the Discord Developer Portal, follow these steps:

### 1. **Set Up a Discord Account**
   - If you don't have a Discord account, create one by visiting [Discord's website](https://discord.com).

### 2. **Access the Discord Developer Portal**
   - Navigate to the [Discord Developer Portal](https://discord.com/developers/applications) and log in with your Discord account.

### 3. **Create a New Application**
   - Once logged in, click on the **"New Application"** button.
   - Enter a name for your application (this will be your bot's name) and click **"Create"**.

### 4. **Add a Bot to Your Application**
   - In the left sidebar, go to the **"Bot"** section.
   - Click on **"Add Bot"** to create a bot user for your application.
   - Confirm the action by clicking **"Yes, do it!"**.
   - Optionally, customize your bot's username and avatar in this section.

### 5. **Generate and Secure Your Bot Token**
   - After adding the bot, you'll see a **Token** section. Click on **"Copy"** to save your bot's token.
   - **Important:** Treat this token like a password—never share it publicly. If compromised, reset it by clicking **"Reset Token"**.

### 6. **Set Permissions for Your Bot**
   - Go to the **OAuth2** tab in the left sidebar.
   - Under the **OAuth2 URL Generator**, check the box for **bot** under "Scopes".
   - Scroll down to the **Bot Permissions** section and select the permissions your bot will need (e.g., `Administrator`, `Send Messages`, etc.).

### 7. **Invite Your Bot to a Server**
   - After selecting permissions, copy the generated URL from the OAuth2 section.
   - Paste this URL into your browser and select which server you want to invite the bot to (you must have administrative privileges on that server).
   - Complete any CAPTCHA verification if prompted.

### 8. **Program Your Bot**
   - To make your bot functional, you'll need to program it using a language like JavaScript (Node.js) or Python. Here's an example using Node.js:
   
```javascript
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login('YOUR_BOT_TOKEN'); // Replace with your bot token
```

- Save this code in a file (e.g., `bot.js`), install dependencies (`npm install discord.js`), and run it (`node bot.js`).

### 9. **Test Your Bot**
   - Once your bot is running, it should appear online in your server.
   - You can add commands and functionality based on how you program it.

By following these steps, you will have successfully created and invited a Discord bot to your server!

### Sources

- [image.jpg](https://ppl-ai-file-upload.s3.amazonaws.com/image/upload/v1731397658/user_uploads/ydqperftv/image.jpg?AWSAccessKeyId=ASIA2F3EMEYEQWIWOFAK&Signature=i5f%2BFcDJbiRFTuNN5tAx3380NEg%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIDRgeOd4eLnNZd8eAvXLt%2BXvHi8OWYW2ABM6iC32BdXMAiEA51990ix5U80X7k6QGuKSiagn2sSRRCfKjpGmlGzI2s4q%2FAQIsf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARABGgw2OTk3NTMzMDk3MDUiDEGq5dEDQBbe4sx0SCrQBKEV0zO0u5Hazau1nJZTP95zPWQPzS%2BoQWI8yZiiaQ6rfQGFF1l53PjeDKrm3kyDGu8aCsX87s8mQ4MDZwK2t6vzhIEYNjRHngJSAUUbjbbvxZ7UC%2BVkdEY8yllA2YKPiCgLufCQH9XdZbeXaC7C8rvsVJ%2BVYOjxgyrX0xd1S7C%2BNG2A%2FwQ7NFTjrvRFiclfzUpHyF5dHYC4%2FO2oag2dutaTi0%2FQkBgBJ%2BBDX0E2VZ2baxIOlUfck9cLEXJy2nBDQ0iX7gjBw%2FIRCrXOETAJGzOk%2BNffSMavk3rl87mpOPXPhuZaCBJiUsfwIcjXGAzJXE001gbXdywt6%2FP3AaJwM7SpnXV8RWVC0j8SmRctDfJuZ54JTQpPcL8qXbMe3Km2Mb%2BMkEAOwPOXbFfhrjRhmJBKkee5Linqk1Q8MwOmCE6bxEoGpjuuSfMR9DQoKVPuLya5M7nH4yWWB54rUT%2FNQUtGutABCsxJSw06biFQBzJJVAKYu6rwRViwdOA9kvqf2HdscSJLVdfTSWZjIxet7gGBmw0FPA%2FApxo0s1cB1l6OTzncvvPd9GcDpNkJSctsBpO9iWAZdqLHGxyccn27%2FLDw1q2inQe76vqNCHVYLmyAja8ayhhtjzHMbuyxsIcyPefKhC4rz%2B07pffEU%2BHwyvWkxl%2BgxSXV80WLS%2Bnz55gpXyDaIvEUafOBO8YWHy6INxDbPv5nupJUgEEjTygUuKeURVYxLv%2FIPMoL1QpZjJyF0dpH2J4u77zwwbpcPh63IaS2HBgJHLI0Oncnyyj0E9Yw8bKK0gY6mAFBkZiWMeeEE3X2M2bAPh4kjOUD4GEmoOAcx0Tpbohs4PCPlt1V5Nc6cZkUayGcieFf42UHZN8%2BYYJjBt7yd3At8As%2BCz9n6d8WyZfEva%2FQs0WM4%2BXv8HpOiUAa4rKOC1WjKeSowGQ5%2Bices0V0K%2BRqvl7j2R2UuwYJDeb8mXG183%2BdAvlWLRKUi6B5T5bVaH597NnRQS9IZw%3D%3D&Expires=1782751570)
- [image.jpg](https://ppl-ai-file-upload.s3.amazonaws.com/image/upload/v1731397677/user_uploads/dltjevfsz/image.jpg?AWSAccessKeyId=ASIA2F3EMEYEQWIWOFAK&Signature=EoYCg9aHovs1uXeJYgrSQtKOn8Q%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIDRgeOd4eLnNZd8eAvXLt%2BXvHi8OWYW2ABM6iC32BdXMAiEA51990ix5U80X7k6QGuKSiagn2sSRRCfKjpGmlGzI2s4q%2FAQIsf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARABGgw2OTk3NTMzMDk3MDUiDEGq5dEDQBbe4sx0SCrQBKEV0zO0u5Hazau1nJZTP95zPWQPzS%2BoQWI8yZiiaQ6rfQGFF1l53PjeDKrm3kyDGu8aCsX87s8mQ4MDZwK2t6vzhIEYNjRHngJSAUUbjbbvxZ7UC%2BVkdEY8yllA2YKPiCgLufCQH9XdZbeXaC7C8rvsVJ%2BVYOjxgyrX0xd1S7C%2BNG2A%2FwQ7NFTjrvRFiclfzUpHyF5dHYC4%2FO2oag2dutaTi0%2FQkBgBJ%2BBDX0E2VZ2baxIOlUfck9cLEXJy2nBDQ0iX7gjBw%2FIRCrXOETAJGzOk%2BNffSMavk3rl87mpOPXPhuZaCBJiUsfwIcjXGAzJXE001gbXdywt6%2FP3AaJwM7SpnXV8RWVC0j8SmRctDfJuZ54JTQpPcL8qXbMe3Km2Mb%2BMkEAOwPOXbFfhrjRhmJBKkee5Linqk1Q8MwOmCE6bxEoGpjuuSfMR9DQoKVPuLya5M7nH4yWWB54rUT%2FNQUtGutABCsxJSw06biFQBzJJVAKYu6rwRViwdOA9kvqf2HdscSJLVdfTSWZjIxet7gGBmw0FPA%2FApxo0s1cB1l6OTzncvvPd9GcDpNkJSctsBpO9iWAZdqLHGxyccn27%2FLDw1q2inQe76vqNCHVYLmyAja8ayhhtjzHMbuyxsIcyPefKhC4rz%2B07pffEU%2BHwyvWkxl%2BgxSXV80WLS%2Bnz55gpXyDaIvEUafOBO8YWHy6INxDbPv5nupJUgEEjTygUuKeURVYxLv%2FIPMoL1QpZjJyF0dpH2J4u77zwwbpcPh63IaS2HBgJHLI0Oncnyyj0E9Yw8bKK0gY6mAFBkZiWMeeEE3X2M2bAPh4kjOUD4GEmoOAcx0Tpbohs4PCPlt1V5Nc6cZkUayGcieFf42UHZN8%2BYYJjBt7yd3At8As%2BCz9n6d8WyZfEva%2FQs0WM4%2BXv8HpOiUAa4rKOC1WjKeSowGQ5%2Bices0V0K%2BRqvl7j2R2UuwYJDeb8mXG183%2BdAvlWLRKUi6B5T5bVaH597NnRQS9IZw%3D%3D&Expires=1782751570)
- [How to create a Discord bot - Server - IONOS](https://www.ionos.com/digitalguide/server/know-how/creating-discord-bot/)
- [How to make a Discord bot - Android Police](https://www.androidpolice.com/how-to-make-discord-bot/)
- [Crafting Your First Discord Bot: A Step-by-Step Guide | Showwcase](https://www.showwcase.com/article/36721/crafting-your-first-discord-bot-a-step-by-step-guide)
- [Setting up a bot application - discord.js Guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html)
- [Easy Discord Bot Setup for Beginners - ArjanCodes](https://arjancodes.com/blog/how-to-build-a-simple-discord-bot/)
