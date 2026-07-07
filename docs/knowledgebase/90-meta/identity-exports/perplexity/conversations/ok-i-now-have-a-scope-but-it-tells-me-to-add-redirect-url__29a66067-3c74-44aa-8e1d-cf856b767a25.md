---
source_url: "https://www.perplexity.ai/search/38a6e31a-793e-4492-83c3-41c3f0dca260"
thread_uuid: "29a66067-3c74-44aa-8e1d-cf856b767a25"
slug: "38a6e31a-793e-4492-83c3-41c3f0dca260"
title: "OK I now have a scope but it tells me to add redirect url"
extracted_at: "2026-06-29T16:14:33.436Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# OK I now have a scope but it tells me to add redirect url

Source: [Perplexity thread](https://www.perplexity.ai/search/38a6e31a-793e-4492-83c3-41c3f0dca260)

## User

OK I now have a scope but it tells me to add redirect url

## Assistant

To resolve the issue of adding a redirect URL for your Discord OAuth2 setup, follow these steps:

1. **Go to the Redirects Section**: 
   In the OAuth2 tab of your Discord Developer Portal (as seen in the image you provided), there is a section labeled "Redirects." You need to specify at least one URI here for authentication to work.

2. **Add a Redirect URL**:
   Click the "Add Redirect" button and input a URL where Discord will redirect users after they authenticate. This URL should be a route on your server that can handle the OAuth2 callback. For example, if you're running a local server for testing, you can use something like `http://localhost:8000/auth/discord`. If you're using a production server, replace `localhost` with your domain (e.g., `https://yourdomain.com/auth/discord`).[3][4]

3. **Save Changes**:
   After entering the redirect URL, make sure to save the changes by clicking the "Save" button.

4. **Generate OAuth2 URL**:
   Once you've added your redirect URL, scroll down to the "OAuth2 URL Generator" section. Select the necessary scopes (like `identify`, `guilds`, etc.), and choose your redirect URL from the dropdown menu. This will generate an OAuth2 URL that you can use to initiate the authentication process.[4][5]

After completing these steps, when users authenticate via Discord, they will be redirected to the specified URI with an authorization code that you can exchange for an access token.

### Sources

- [image.jpg](https://ppl-ai-file-upload.s3.amazonaws.com/image/upload/v1731397658/user_uploads/ydqperftv/image.jpg?AWSAccessKeyId=ASIA2F3EMEYEYCL4AEEP&Signature=Hf53TRg%2FJEDFQU%2Bc%2BB%2FxrNAb1fc%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEOj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQC4%2Bug9yfZHZ1%2Fy2eChj4RB0ognvnn6Jvt8aFOe2WmpjAIhAMN%2BH4RSROep2CS1mhN6jzeoC%2FZ42%2FaKdXT%2Fltqr8DiyKvwECLH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMNjk5NzUzMzA5NzA1Igw7ABU%2BgKWH5LOxgEsq0ASbd2L%2BTtI8JyOyp3RppPOM9ib%2Bx4Lr1qeqwQ6yAZWM1lBC8utER%2B%2Bse9AgWQxPxbWMcU5Qh7SqIvKWXIN2HVIibXmME4uTf3V8MMXLm97p85508tpDp7Zgj3yvsgOKnVf5ies7Ct6qK3s5re77h1XIwpvlnXSoFBcuQxalwJIO1q6t08mv6rVPrSbf96FKZeMGqsdxHJyutFLsTPGFxwTVvISHqKYreaJhZB%2FU04U%2FZ82cHuwEQo33xwreAxZQnbwMjZjBEQoV%2FW3ul3IUZi3DFufgveu9VcMaWCAjmTfuygUZ%2F%2B32kKY%2FkfWtJMgU7eif0u%2B1ys0iRrVV4GGSHFfKi3TJoJPzjAspUgddjuVpG3GRdcNLYY2%2BofRilhmn88%2Fjrp2mjOvRoaJ5gfKvRIHOC1ht38d1Q3e7UvgISfSf9NweHUUexnv2atDzQwOP8%2BfbSe4iEpMOVaxwoEZlM6yO5MtT2CEtzxD8IoeG7DuFFwHr8FaEN%2Fyo5AisuOdOhRafvoSUwtV1n7ZiNk5bdy8WJfFVBopu7PHbDyNEtmqglLr9Dk0IW%2Feg5kEmoHJ%2B12TvNt4hNP4Tf5HnT8NvAuOIXPb8mfChWEmpwQ%2F09H9xJaWpiizQUbK7vWoY4x%2Bl5hTQ5m%2BlNHO%2Ffouzpcn26KZW%2FtDkTe2UnTYrDkIN%2BZv3qp6vSgoEncqQYt99eYszcECVNpqBrsHcfzOBuImMBhKWYcyOciY11hoYXzYZKeGanfdD3cU%2BpmKvhit36Bh1%2B9YRlVyLI%2F%2BXSlfH%2FUVXYTEQMP%2BkitIGOpcBdFdFtRze%2FXhNYa1dsuwbNJDOjRAx3S%2Bop7e%2FOiFBdoVtfv5W%2FBR0B%2F9EljT%2BteOBskypOjIkhS%2BOPDkgy%2BGllaqN2uFbo%2B6AmxzJZ6BMnMkIUFVIebCY5u8CHk5REjXbouBHqFr8S6Y1pB29XA1h9cSx6GY2GKWMio81Qhtofd0aa%2BdY68R1hbGt8s288qOuz5JiRvS1nw%3D%3D&Expires=1782750267)
- [image.jpg](https://ppl-ai-file-upload.s3.amazonaws.com/image/upload/v1731397677/user_uploads/dltjevfsz/image.jpg?AWSAccessKeyId=ASIA2F3EMEYEYCL4AEEP&Signature=vt7xfvF2sXydCZAvbj67yATauyY%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEOj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQC4%2Bug9yfZHZ1%2Fy2eChj4RB0ognvnn6Jvt8aFOe2WmpjAIhAMN%2BH4RSROep2CS1mhN6jzeoC%2FZ42%2FaKdXT%2Fltqr8DiyKvwECLH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMNjk5NzUzMzA5NzA1Igw7ABU%2BgKWH5LOxgEsq0ASbd2L%2BTtI8JyOyp3RppPOM9ib%2Bx4Lr1qeqwQ6yAZWM1lBC8utER%2B%2Bse9AgWQxPxbWMcU5Qh7SqIvKWXIN2HVIibXmME4uTf3V8MMXLm97p85508tpDp7Zgj3yvsgOKnVf5ies7Ct6qK3s5re77h1XIwpvlnXSoFBcuQxalwJIO1q6t08mv6rVPrSbf96FKZeMGqsdxHJyutFLsTPGFxwTVvISHqKYreaJhZB%2FU04U%2FZ82cHuwEQo33xwreAxZQnbwMjZjBEQoV%2FW3ul3IUZi3DFufgveu9VcMaWCAjmTfuygUZ%2F%2B32kKY%2FkfWtJMgU7eif0u%2B1ys0iRrVV4GGSHFfKi3TJoJPzjAspUgddjuVpG3GRdcNLYY2%2BofRilhmn88%2Fjrp2mjOvRoaJ5gfKvRIHOC1ht38d1Q3e7UvgISfSf9NweHUUexnv2atDzQwOP8%2BfbSe4iEpMOVaxwoEZlM6yO5MtT2CEtzxD8IoeG7DuFFwHr8FaEN%2Fyo5AisuOdOhRafvoSUwtV1n7ZiNk5bdy8WJfFVBopu7PHbDyNEtmqglLr9Dk0IW%2Feg5kEmoHJ%2B12TvNt4hNP4Tf5HnT8NvAuOIXPb8mfChWEmpwQ%2F09H9xJaWpiizQUbK7vWoY4x%2Bl5hTQ5m%2BlNHO%2Ffouzpcn26KZW%2FtDkTe2UnTYrDkIN%2BZv3qp6vSgoEncqQYt99eYszcECVNpqBrsHcfzOBuImMBhKWYcyOciY11hoYXzYZKeGanfdD3cU%2BpmKvhit36Bh1%2B9YRlVyLI%2F%2BXSlfH%2FUVXYTEQMP%2BkitIGOpcBdFdFtRze%2FXhNYa1dsuwbNJDOjRAx3S%2Bop7e%2FOiFBdoVtfv5W%2FBR0B%2F9EljT%2BteOBskypOjIkhS%2BOPDkgy%2BGllaqN2uFbo%2B6AmxzJZ6BMnMkIUFVIebCY5u8CHk5REjXbouBHqFr8S6Y1pB29XA1h9cSx6GY2GKWMio81Qhtofd0aa%2BdY68R1hbGt8s288qOuz5JiRvS1nw%3D%3D&Expires=1782750267)
- [Getting started with OAuth2 - discord.js Guide](https://discordjs.guide/oauth2/)
- [Discord OAuth: How to Add the Discord API to a Node.js App - Stateful](https://stateful.com/blog/discord-oauth)
- [Discord redirect/OAuth2 uri : r/Discord_Bots - Reddit](https://www.reddit.com/r/Discord_Bots/comments/ujbe6o/discord_redirectoauth2_uri/)
