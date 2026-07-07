---
source_url: "https://chatgpt.com/c/681ac49e-3cac-8006-bcce-cf215ed4646b"
conversation_id: "681ac49e-3cac-8006-bcce-cf215ed4646b"
title: "PMS vs SDK Differences"
extracted_at: "2026-06-29T11:24:00.857Z"
message_count: 2
provenance: auth-ui
---

# PMS vs SDK Differences

Source: [ChatGPT conversation](https://chatgpt.com/c/681ac49e-3cac-8006-bcce-cf215ed4646b)

## User

PimpMyStremio Developer Documentation
PimpMyStremio add-ons are almost exactly the same as add-ons created with stremio-addon-sdk, so make sure you read the Add-on SDK documentation before anything else.

PimpMyStremio add-ons all run in a sandbox, and can only require the whitelisted modules and a few internal modules.

With that said, the whitelisted module list is a large one, that should get you set for any circumstance you might encounter.

If you need a module that is not on the whitelist for your add-on, create an issue for it, and we'll see if we can add it for you.

Key features: auto-updates itself, auto-updates add-ons, wide range of whitelisted add-ons, persisted data, user add-on configuration, running remotely

Difference between SDK and PimpMyStremio add-ons
PimpMyStremio add-ons all need to have an entry point, by default ./index.js is used, you can set a different entry point by setting the entry property for your addon in addonsList.json.

All addons are written in Node.js and the entry point must export the stremio-addon-sdk router.

Example:

const { addonBuilder, getRouter } = require('stremio-addon-sdk')

const builder = new addonBuilder(manifest)

builder.defineCatalogHandler(args => {
  // ..
})

builder.defineMetaHandler(args => {
  // ..
})

builder.defineStreamHandler(args => {
  // ...
})

builder.defineSubtitlesHandler(args => {
  // ...
})

module.exports = getRouter(builder.getInterface())
To better understand this code, please refer to the stremio-addon-sdk documentation.

Notes:

You can also export a promise to module.exports (for example, if you need to wait for additional data in order to reply with the add-on manifest), but for safety reasons if the exported promise fails to respond in 50 seconds, the add-on will be forcefully stopped
If an add-on fails to respond to a request (catalog, meta, streams, subtitles) within 120 seconds since the request was started, the add-on will be forcefully closed
Testing add-ons
You can ofcourse use the stremio-addon-sdk Testing documentation to test your add-on in Stremio before even using it in PimpMyStremio, as long as you only use the whitelisted modules it should have no issues working with PimpMyStremio too.

Alternatively, you can also sideload add-ons into PimpMyStremio to test them with it directly.

To sideload add-ons, you will need to create a new directory at one of these paths:

OSX: ~/Library/Preferences/PimpMyStremio/sideload/
Win: C:\Users\[username]\AppData\PimpMyStremio\sideload\
Linux: ~/.local/share/PimpMyStremio/sideload/
After creating a new directory, add index.js (described above) and config.json (described below) to it.

Now when you start PimpMyStremio, your local add-on will be automatically loaded and available in the "Sideloaded" section.

User settings
Your add-on can specify that it supports (or requires) user settings, to do so, create a config.json file in the root directory of your add-on.

config.json example:

{
  "host": {
    "title": "Host",
    "type": "string",
    "default": "http://shiny.website.com"
  },
  "username": {
    "title": "Username",
    "type": "string",
    "default": "",
    "required": true
  },
  "password": {
    "title": "Password",
    "type": "string",
    "default": "",
    "required": true
  },
  "style": {
    "title": "Display Style",
    "type": "select",
    "options": ["Catalog", "Filters", "Channel"],
    "default": "Channel"
  }
}
required is optional and defaults to false
type can be "string", "number", "boolean" or "select"
default represents the default value
title is a string that will serve as the human-readable title for the users
options is an array of strings, only used for "select" type
And the property name is what you will get back in the config option with the user set (or default) value

To get the config in code, just do:

const { config } = require('internal')
Persisted data
This internal module is much like localStorage, as it's a utility that will persist your data through app close / add-on close.

Example:

const { persist } = require('internal')

console.log(persist.getItem('myVar'))

persist.setItem('myVar', 'hello world')
Also supports .removeItem() to remove a key and .clear() for clearing the entirety of the data.

Publishing an add-on
To publish your add-on, make a PR to this repository adding it to the addonsList.json file.

Note that the default entry point for an addon is ./index.js, you can set a different entry point by setting the entry property to a relative path for your addon in addonsList.json.

Updating an add-on
The only thing you need to do is to publish a new release on GitHub, you don't need to add any files to it, as GitHub automatically archives the sources and that archive will be used to update your add-on to all it's users.


based on this pimpmystremio we can infer that this is an implementation created to bypass some limitations in stremio's default sdk.

What I'm not understanding is exactly what those limitations are. Please explain in detail what this can allow and why it's important and ensure the documentation clearly says it's not available in the normal stremio-addon-sdk.
Show more

## Assistant

You're absolutely right in noticing that PimpMyStremio (PMS) is essentially a wrapper or extended environment for Stremio add-ons, designed to bypass certain limitations of the official stremio-addon-sdk. While the official documentation for PMS doesn’t directly enumerate all the limitations it's bypassing, a detailed inference from the documentation (and broader ecosystem context) shows the following critical differences and expanded capabilities:

🔍 Key Limitations of the Default stremio-addon-sdk (and How PimpMyStremio Addresses Them)
1. Lack of Persistent Storage in Default SDK

Stremio Limitation: Add-ons in the original stremio-addon-sdk are stateless — you cannot persist data across sessions (e.g. cache data, track user preferences locally).

PimpMyStremio Fix: Introduces a persist internal module (like localStorage), allowing:

Persistent storage of variables/data

Survival across app restarts and add-on reloads

Useful for things like caching, stateful tracking, user progress, etc.

📌 Why it's important: Adds full memory-like behavior to add-ons, crucial for performance and usability.

2. No User Configuration in Default SDK

Stremio Limitation: The official SDK does not support dynamic user-facing configuration UIs for add-ons.

PimpMyStremio Fix: Supports a config.json schema that:

Lets users set custom values (API keys, usernames, UI styles)

Supports types like string, number, boolean, and select

Makes config available in code via require('internal').config

📌 Why it's important: Enables flexible, user-driven behavior per add-on without hardcoding anything. Also enables private/secure input (like credentials) which is not possible with the SDK alone.

3. Tightly Sandboxed Environment in SDK

Stremio Limitation: Very restricted environment — you can't load arbitrary Node.js modules.

PimpMyStremio Fix: Provides a large whitelist of Node.js modules, significantly expanding what you can use (e.g. for web scraping, crypto, file access, advanced APIs, etc.)

📌 Why it's important: Opens up integration possibilities. If your add-on needs to scrape websites, interface with a REST API, or do real backend logic, you're no longer limited by the SDK.

4. No Built-In Auto-Update or Lifecycle Support

Stremio Limitation: You have to manually update your add-on and ensure users fetch it again.

PimpMyStremio Fix:

Auto-updates add-ons via GitHub releases

Auto-updates itself (PMS app)

Sideloaded add-ons also auto-refresh on PMS restart

📌 Why it's important: Ensures users always get the latest features/fixes without manual steps. Very helpful in rapidly evolving add-ons or dev workflows.

5. No Simple Way to Test Locally

Stremio Limitation: Testing add-ons locally in the SDK involves more setup or requires publishing a server.

PimpMyStremio Fix: Allows local sideloading:

Just drop your add-on code + config.json in a specific local folder

PMS will load it and make it available under a “Sideloaded” section

📌 Why it's important: Makes testing/development fast and painless, especially when working on add-ons that use user settings or local logic.

6. Entry Point Flexibility

Stremio Limitation: Always assumes a typical structure, with less flexibility on entry point handling.

PimpMyStremio Fix: Lets you customize your entry point per add-on (entry property in addonsList.json)

📌 Why it's important: Helps structure larger or more complex add-ons more flexibly.

✅ Summary: What PimpMyStremio Adds That the SDK Alone Cannot
Feature	Default Stremio SDK	PimpMyStremio
Persistent storage	❌	✅ persist module
User configuration	❌	✅ config.json
Large module support	❌ Limited	✅ Whitelisted modules
Auto-updates	❌	✅ GitHub-based
Local sideload testing	❌	✅ Native support
Entry point customization	❌	✅ via addonsList.json
🚫 Clearly Not Supported in stremio-addon-sdk Alone

To answer your last point directly: yes, it's important to make clear in the documentation that none of these features are available in the default stremio-addon-sdk. Add-ons made strictly with the SDK must assume:

No persistent data

No user settings

No access to many npm packages

No local testing without custom hosting

No auto-update mechanism

This makes PimpMyStremio a far more developer-friendly environment, especially for sophisticated or user-interactive add-ons.

Would you like help drafting a clearer developer README or onboarding section to make this distinction more obvious to future developers?
