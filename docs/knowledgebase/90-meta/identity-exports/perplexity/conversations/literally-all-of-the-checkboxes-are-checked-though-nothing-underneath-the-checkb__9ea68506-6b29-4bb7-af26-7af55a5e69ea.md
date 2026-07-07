---
source_url: "https://www.perplexity.ai/search/e2b6c356-12c0-4eb3-b89b-7a3dfc558a30"
thread_uuid: "9ea68506-6b29-4bb7-af26-7af55a5e69ea"
slug: "e2b6c356-12c0-4eb3-b89b-7a3dfc558a30"
title: "Literally ALL of the checkboxes are checked though. Nothing underneath the checkboxes allow me to do anything. It just says 'choose an oauth2 scope'. So what do i do since everything checked"
extracted_at: "2026-06-29T16:14:35.975Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# Literally ALL of the checkboxes are checked though. Nothing underneath the checkboxes allow me to do anything. It just says 'choose an oauth2 scope'. So what do i do since everything checked

Source: [Perplexity thread](https://www.perplexity.ai/search/e2b6c356-12c0-4eb3-b89b-7a3dfc558a30)

## User

Literally ALL of the checkboxes are checked though. Nothing underneath the checkboxes allow me to do anything. It just says 'choose an oauth2 scope'. So what do i do since everything checked

## Assistant

It seems you're encountering an issue where all the OAuth2 scopes are selected, but you are still being prompted to "choose an OAuth2 scope," and nothing is happening when you attempt to proceed. This issue can occur for a few reasons, and here are some steps you can take to troubleshoot and resolve it:

### 1. **Ensure Redirect URI is Set**
   - Check if you have added a **Redirect URI** in the "Redirects" section. OAuth2 requires at least one redirect URI to be specified for the authentication process to work.
   - Click the "Add Redirect" button and enter a valid URL (e.g., `http://localhost:3000` if you're testing locally or your actual redirect URL if you're hosting).

### 2. **Uncheck Unnecessary Scopes**
   - Even though all scopes are checked, sometimes selecting too many scopes can cause issues with generating the OAuth2 URL. Try unchecking some of the scopes that you don't need for your bot or application.
   - Start with only the essential scopes like `identify`, `email`, or `bot`, and see if it generates the URL properly.

### 3. **Disable "REQUIRES OAUTH2 CODE GRANT"**
   - Go to the **Bot** tab in your Discord Developer Portal and check whether the option **"REQUIRES OAUTH2 CODE GRANT"** is enabled. If it is, try disabling it, as this option can sometimes interfere with generating the OAuth2 link.
   - This setting requires users to go through an additional authorization step, which may not be necessary for your use case.

### 4. **Refresh or Regenerate the URL**
   - After making changes (like adjusting scopes or adding a redirect URI), refresh the page or attempt to regenerate the OAuth2 URL by clicking on any available buttons related to generating the URL.

### 5. **Check for Browser Issues**
   - Sometimes, browser extensions or caching issues can cause problems with generating OAuth2 URLs. Try clearing your cache or using a different browser to see if that resolves the issue.

By following these steps, you should be able to resolve the issue and generate a proper OAuth2 URL for your application.

### Sources

- [image.jpg](https://ppl-ai-file-upload.s3.amazonaws.com/image/upload/v1731397658/user_uploads/ydqperftv/image.jpg?AWSAccessKeyId=ASIA2F3EMEYEXQXEXL25&Signature=J4Apw6Gw1w6Bk9c7Q73zg7WBtv4%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQDxT7MZ4R98WA6ntTR4wqQXP2Vc55ISY3flfpHgFkLc1AIhAO1HLyZbcS%2F1x2i2gU1I1509d6oJOCcf%2FDdrDfzHR2w9KvwECLH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMNjk5NzUzMzA5NzA1IgytgsDb1oyyPlvAvLUq0ARt%2Fy18QHYeosvv1BHnkqj686QEfjGDeT%2BOBhKyB8rNRGnXMAQ8vmUDO2bghLU%2F0UBrhm4SYg2DcraqZ6qQEejHnOywdRPSkwzC8q%2B%2BouiFn4wyynPvsl0JPX%2Fch2jm6B43qW7gvZtVXmZLBzl9KUYu0Jp59hxk5JO2ELm3%2Fn%2BSt%2FixpQeK4CiKPYWzNAsKmE6eOdHwVNJxkbS1xtO6ilaUDKVsXtldYoIL%2FEw0dN%2BUd7nn%2BknHMqBlpx0tBTiKgtiydcRLwhFjpXfdQgnq8fri8JLpZhzBg66D1TRq7nmptDQ541wKl4iTwtwwb3FHkiEgJJpv8nAOQXF6PUqj%2BJErhCeGph2rsDbzNodYkdc17ZI9s8huZbGxemBmU99weV3boZmlon827SJr20vHdA2jC%2BHpOdUy7cCn0jpWJwam%2BkOXYZY9w0N5%2Bmq%2B%2FcX9n5bJZ6zfUVJd6XRvZgqTtygOGWTfjZn%2FSzgt1l0hhPd%2BxnGZvW2B5VSmRVDzFiFiSdQswqpu8HYmANwsbND7nDLgqR88QVxvwgYD34tmvVooMA3kwVoW2ByDpn2lIgC6M8T8H44rtD%2Bzjvqwbf%2Bb2IZ5LgsmLVySdzvb8hcxh7Am08x71HOsPsYmRfCT4NNtC0yc8nb%2BHUeWvGppSdJTlw1qtEFbntuqoUZAd7%2FQis83LOxFf%2B3%2F3c34kscMUndgbSETwyboMU0GHd3kuPNhM59Z%2B0tGOBD1jUh5ucvWe245eZvi8%2FrB4QPodF3U1knVDL24xik%2FchGWhn0ZdewHawBaMPKxitIGOpcBEoeK2M9MVlkGiI2SFHlaNYbMgHeRunIx6FCB9lFJ8SB%2FrbHDYY1ksqSqWM%2FnSMHgyZqSOG8Hxc6F5UwjmSwVd9ulvEknqcFA5%2Fh11t2IwRVXtKVgtCpGmWvhK%2BL%2BuNn%2FQzqpPwBgspjwUXWLKZ%2BcZwCB%2Bq9tCta67tTtc2vS9dHrgR%2Bx6ZrXExPx7RJvsxu6rnRPDwmwQw%3D%3D&Expires=1782750267)
- [image.jpg](https://ppl-ai-file-upload.s3.amazonaws.com/image/upload/v1731397677/user_uploads/dltjevfsz/image.jpg?AWSAccessKeyId=ASIA2F3EMEYEXQXEXL25&Signature=ezm7cgaHM9ozW8Vx1JgtmPlEwXc%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEOn%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQDxT7MZ4R98WA6ntTR4wqQXP2Vc55ISY3flfpHgFkLc1AIhAO1HLyZbcS%2F1x2i2gU1I1509d6oJOCcf%2FDdrDfzHR2w9KvwECLH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMNjk5NzUzMzA5NzA1IgytgsDb1oyyPlvAvLUq0ARt%2Fy18QHYeosvv1BHnkqj686QEfjGDeT%2BOBhKyB8rNRGnXMAQ8vmUDO2bghLU%2F0UBrhm4SYg2DcraqZ6qQEejHnOywdRPSkwzC8q%2B%2BouiFn4wyynPvsl0JPX%2Fch2jm6B43qW7gvZtVXmZLBzl9KUYu0Jp59hxk5JO2ELm3%2Fn%2BSt%2FixpQeK4CiKPYWzNAsKmE6eOdHwVNJxkbS1xtO6ilaUDKVsXtldYoIL%2FEw0dN%2BUd7nn%2BknHMqBlpx0tBTiKgtiydcRLwhFjpXfdQgnq8fri8JLpZhzBg66D1TRq7nmptDQ541wKl4iTwtwwb3FHkiEgJJpv8nAOQXF6PUqj%2BJErhCeGph2rsDbzNodYkdc17ZI9s8huZbGxemBmU99weV3boZmlon827SJr20vHdA2jC%2BHpOdUy7cCn0jpWJwam%2BkOXYZY9w0N5%2Bmq%2B%2FcX9n5bJZ6zfUVJd6XRvZgqTtygOGWTfjZn%2FSzgt1l0hhPd%2BxnGZvW2B5VSmRVDzFiFiSdQswqpu8HYmANwsbND7nDLgqR88QVxvwgYD34tmvVooMA3kwVoW2ByDpn2lIgC6M8T8H44rtD%2Bzjvqwbf%2Bb2IZ5LgsmLVySdzvb8hcxh7Am08x71HOsPsYmRfCT4NNtC0yc8nb%2BHUeWvGppSdJTlw1qtEFbntuqoUZAd7%2FQis83LOxFf%2B3%2F3c34kscMUndgbSETwyboMU0GHd3kuPNhM59Z%2B0tGOBD1jUh5ucvWe245eZvi8%2FrB4QPodF3U1knVDL24xik%2FchGWhn0ZdewHawBaMPKxitIGOpcBEoeK2M9MVlkGiI2SFHlaNYbMgHeRunIx6FCB9lFJ8SB%2FrbHDYY1ksqSqWM%2FnSMHgyZqSOG8Hxc6F5UwjmSwVd9ulvEknqcFA5%2Fh11t2IwRVXtKVgtCpGmWvhK%2BL%2BuNn%2FQzqpPwBgspjwUXWLKZ%2BcZwCB%2Bq9tCta67tTtc2vS9dHrgR%2Bx6ZrXExPx7RJvsxu6rnRPDwmwQw%3D%3D&Expires=1782750267)
- [OAuth2 not working correctly : r/discordbots - Reddit](https://www.reddit.com/r/discordbots/comments/saltbf/oauth2_not_working_correctly/)
  - Hello! Had this exact problem 2 days ago. What you do it go to the bot tab, and tick "REQUIRES OAUTH2 CODE GRANT" off. If this ...
- [Missing scopes in the Oauth2 url generators · Issue #5240 - GitHub](https://github.com/discord/discord-api-docs/issues/5240)
  - Description. Oauth2 url generator is missing some of the available scopes. Steps to Reproduce. Go to https://discord.com/developers/ ...
- [Discord Oauth2 scopes help : r/Discord_Bots - Reddit](https://www.reddit.com/r/Discord_Bots/comments/jl9s3a/discord_oauth2_scopes_help/)
- [Discord.py Bot Link returns No Scopes even though I added scopes](https://stackoverflow.com/questions/75045126/discord-py-bot-link-returns-no-scopes-even-though-i-added-scopes)
- [Troubleshooting OAuth2 - osTicket Forum](https://forum.osticket.com/d/102953-troubleshooting-oauth2)
- [Discord OAuth2 Example - Node JS Code and Tutorial - CircleRTech](https://circlertech.com/working-with-discord-oauth2)
