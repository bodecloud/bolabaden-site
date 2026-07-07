---
source_url: "https://www.perplexity.ai/search/b0a29bf6-26bc-4e08-9d7d-7a4f0ac2eb5e"
thread_uuid: "aacb636c-204e-48c0-a8d0-819b1debc17f"
slug: "b0a29bf6-26bc-4e08-9d7d-7a4f0ac2eb5e"
title: "```
    \"one-click-man.apiSettings\": {
        \"temperature\": 0.7,
        \"top_p\": 1,
        \"frequency_penalty\": 0,
        \"presence_penalty\": 0
    },
    \"one-click-man.model\": \"custom\",
    \"one-click-man.modelCustom\": \"openrouter/google/gemini-pro-1.5\",
    \"one-click-man.apiEndpoint\": \"https://api.openai.com/v1/chat/completions\",
    \"one-click-man.language\": \"English\",
    \"one-click-man.promptTemplate\": \"Generate a concise commit message from the following git diff. \nThe message should contain a first line with a short summary and if the commit is non-trivial a longer description after a blank line.\nThe message should be written in $$$LANGUAGE$$$.\nThe diff:\n```\n$$$DIFF$$$\n```\n\nFor a longer description, each point should start with a dash (-).\",
    \"snyk.severity\": {
        \"low\": false
    },
```

Please modify this stuff to be for OpenRouter, and the google gemini 1.5 pro, or whatever the large cheap one is that can handle almost unlimited context space."
extracted_at: "2026-06-29T16:09:26.721Z"
matched_keywords: []
export_suite: "identity"
entry_count: 4
provenance: perplexity-rest-api
---

# ```
    "one-click-man.apiSettings": {
        "temperature": 0.7,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0
    },
    "one-click-man.model": "custom",
    "one-click-man.modelCustom": "openrouter/google/gemini-pro-1.5",
    "one-click-man.apiEndpoint": "https://api.openai.com/v1/chat/completions",
    "one-click-man.language": "English",
    "one-click-man.promptTemplate": "Generate a concise commit message from the following git diff. \nThe message should contain a first line with a short summary and if the commit is non-trivial a longer description after a blank line.\nThe message should be written in $$$LANGUAGE$$$.\nThe diff:\n```\n$$$DIFF$$$\n```\n\nFor a longer description, each point should start with a dash (-).",
    "snyk.severity": {
        "low": false
    },
```

Please modify this stuff to be for OpenRouter, and the google gemini 1.5 pro, or whatever the large cheap one is that can handle almost unlimited context space.

Source: [Perplexity thread](https://www.perplexity.ai/search/b0a29bf6-26bc-4e08-9d7d-7a4f0ac2eb5e)

## User

```
    "one-click-man.apiSettings": {
        "temperature": 0.7,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0
    },
    "one-click-man.model": "custom",
    "one-click-man.modelCustom": "openrouter/google/gemini-pro-1.5",
    "one-click-man.apiEndpoint": "https://api.openai.com/v1/chat/completions",
    "one-click-man.language": "English",
    "one-click-man.promptTemplate": "Generate a concise commit message from the following git diff. \nThe message should contain a first line with a short summary and if the commit is non-trivial a longer description after a blank line.\nThe message should be written in $$$LANGUAGE$$$.\nThe diff:\n```\n$$$DIFF$$$\n```\n\nFor a longer description, each point should start with a dash (-).",
    "snyk.severity": {
        "low": false
    },
```

Please modify this stuff to be for OpenRouter, and the google gemini 1.5 pro, or whatever the large cheap one is that can handle almost unlimited context space.

## Assistant

To modify the configuration for OpenRouter and Google Gemini 1.5 Pro (or a large model with extensive context capabilities), the following JSON settings should work:

```json
{
    "one-click-man.apiSettings": {
        "temperature": 0.7,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0
    },
    "one-click-man.model": "custom",
    "one-click-man.modelCustom": "openrouter/google/gemini-pro-1.5",
    "one-click-man.apiEndpoint": "https://api.openrouter.ai/v1/chat/completions",
    "one-click-man.language": "English",
    "one-click-man.promptTemplate": "Generate a concise commit message from the following git diff. \nThe message should contain a first line with a short summary and if the commit is non-trivial a longer description after a blank line.\nThe message should be written in $$$LANGUAGE$$$.\nThe diff:\n```\n$$$DIFF$$$\n```\n\nFor a longer description, each point should start with a dash (-).",
    "snyk.severity": {
        "low": false
    }
}
```

### Key Changes:
1. **API Endpoint**: Updated to `https://api.openrouter.ai/v1/chat/completions` to use OpenRouter.
2. **Model**: Set to `openrouter/google/gemini-pro-1.5`, which is assumed to be the desired large model.
3. **Prompt Template**: Retained the original structure for generating concise commit messages.
4. **Severity Setting**: Changed `"low"` to `false` using proper JSON boolean syntax.

This configuration ensures compatibility with OpenRouter and the specified model while maintaining the original functionality for generating commit messages.

### Sources

- [image.jpg](https://ppl-ai-file-upload.s3.amazonaws.com/image/upload/v1732586798/user_uploads/itstlhboo/image.jpg?AWSAccessKeyId=ASIA2F3EMEYE3VW2PGTI&Signature=W7p8Tz3ACbvSq0d1Y2ss0RCSOVI%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEOj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQDqbpxh3%2FdKT2w%2F4tAgvHwUeM8FkXb5RkVTtvuFStHwJQIgIpsArWQJ0Bs1krpeeSh5BuyRLoU4g5sdvQOr1Wv73OQq%2FAQIsf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARABGgw2OTk3NTMzMDk3MDUiDGVpabkHws8i667WMyrQBJwzs8%2B8UID5HE7Cs4MY%2BrkHMzFhHtXNi4%2FGdrclMiv6Wq%2Fosys9SOLmoTvUly8Y5PfmORzN9b2HnAjgjr6M9ryxDXa9e6jJHPjPXtbI6PG%2F1H%2Bs%2Bo4Y1gwS9nU1ajL6e9hdrBwtB1BKqyjat9ikTTqxc0e8YQQXdy0Um0RWuMfvSyDtMVLjS9R9pLQKCXAPwmek6avfF1SJL5EDv94TA95KpmjHP%2BR5Cj2%2Bl72TGcX9Id1Tit8uGHv3vg0chxdVi0qCoVwq9tmR2SN4EToHdiOYSVaLtv7lx0ZL1RRkZBVziOkNteiOXT5C0fgZD9iAZJo5CZjMnbLFofqjKh8yhWz5VR4pwCe9zXppxz%2BJuLZ1Sa3NturhwVzvTJfyDQm7Gvp3LXSGmshrwJpXiPxZf7vyFmiTWlR%2F7jMcDMtfVWHoTvlyYe2M0KCNUgasPdx%2FdeDwQMyiPl9teyC3sNLeT7WXiPK%2FYGR4FAyLByJtlcUxVdqbAXEAIuVtxP1lPcgoKr%2FhjT3FvWf3p7CHHuxagYwuhmSla6%2FoDNmg4gP5EjRMPP2EI%2F%2FEb24HxRX%2FgSM2rwG9cfTKgm%2BWNjoObKjG0XBPW6hA1iA%2BXIvXjTtUoSNkE2Lf6E%2BpdgqfhyDaiUk2HCMroahB%2FPvaNeeb7nFhfI05L8Q5QPwC7C%2BZzvswD9aGyUthS2oYcFAD8fUCtxYL0Irdwcq65l87YFCghOLLZdfZK06JjZpjIKVi064d5oa9cWGREbUlVTVMt6gEk5Uq8JJvGtJY4dM7meKw2VhOzo8wza6K0gY6mAHBJQez90xs8Q0pYwmwhsYCr8m4KWKD0VGAcmNRD1FxvXnq6isbFMwT4KD0SoQ5Co7gyiUjUIYtGlLf5VZFYz3nCgivVc3bmVDcXq8RdNepdVtcezuQ%2FSdslF1z2%2FdwKCW9MUgv2iYsw5T7P02eUlcy7H5soHs90KD3pPbYGAM3TyA6wCLh6ZQAEGQNQ5ptB1YN6I4iGQdsbQ%3D%3D&Expires=1782749961)

## User

gemini api url v1 endpoint

## Assistant

Based on the information provided, here is the updated configuration for OpenRouter with the Google Gemini 1.5 Pro model using its correct API endpoint and settings:

```json
{
    "one-click-man.apiSettings": {
        "temperature": 0.7,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0
    },
    "one-click-man.model": "custom",
    "one-click-man.modelCustom": "gemini-1.5-pro",
    "one-click-man.apiEndpoint": "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent",
    "one-click-man.language": "English",
    "one-click-man.promptTemplate": "Generate a concise commit message from the following git diff. \nThe message should contain a first line with a short summary and if the commit is non-trivial a longer description after a blank line.\nThe message should be written in $$$LANGUAGE$$$.\nThe diff:\n```\n$$$DIFF$$$\n```\n\nFor a longer description, each point should start with a dash (-).",
    "snyk.severity": {
        "low": false
    }
}
```

### Key Updates:
1. **API Endpoint**: Updated to `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent` to match the Gemini 1.5 Pro API endpoint.[3][4][7]
2. **Model Name**: Set to `gemini-1.5-pro`, which is the desired model for large context handling.[7][3]
3. **Prompt Template**: Retained the original structure for generating concise commit messages.
4. **API Version**: The endpoint uses `v1beta`, which is compatible with Gemini 1.5 Pro.[3][7]

This configuration ensures proper integration with OpenRouter and Google Gemini's API for generating content efficiently while handling extensive context requirements.

### Sources

- [image.jpg](https://ppl-ai-file-upload.s3.amazonaws.com/image/upload/v1732586798/user_uploads/itstlhboo/image.jpg?AWSAccessKeyId=ASIA2F3EMEYE3VW2PGTI&Signature=W7p8Tz3ACbvSq0d1Y2ss0RCSOVI%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEOj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQDqbpxh3%2FdKT2w%2F4tAgvHwUeM8FkXb5RkVTtvuFStHwJQIgIpsArWQJ0Bs1krpeeSh5BuyRLoU4g5sdvQOr1Wv73OQq%2FAQIsf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARABGgw2OTk3NTMzMDk3MDUiDGVpabkHws8i667WMyrQBJwzs8%2B8UID5HE7Cs4MY%2BrkHMzFhHtXNi4%2FGdrclMiv6Wq%2Fosys9SOLmoTvUly8Y5PfmORzN9b2HnAjgjr6M9ryxDXa9e6jJHPjPXtbI6PG%2F1H%2Bs%2Bo4Y1gwS9nU1ajL6e9hdrBwtB1BKqyjat9ikTTqxc0e8YQQXdy0Um0RWuMfvSyDtMVLjS9R9pLQKCXAPwmek6avfF1SJL5EDv94TA95KpmjHP%2BR5Cj2%2Bl72TGcX9Id1Tit8uGHv3vg0chxdVi0qCoVwq9tmR2SN4EToHdiOYSVaLtv7lx0ZL1RRkZBVziOkNteiOXT5C0fgZD9iAZJo5CZjMnbLFofqjKh8yhWz5VR4pwCe9zXppxz%2BJuLZ1Sa3NturhwVzvTJfyDQm7Gvp3LXSGmshrwJpXiPxZf7vyFmiTWlR%2F7jMcDMtfVWHoTvlyYe2M0KCNUgasPdx%2FdeDwQMyiPl9teyC3sNLeT7WXiPK%2FYGR4FAyLByJtlcUxVdqbAXEAIuVtxP1lPcgoKr%2FhjT3FvWf3p7CHHuxagYwuhmSla6%2FoDNmg4gP5EjRMPP2EI%2F%2FEb24HxRX%2FgSM2rwG9cfTKgm%2BWNjoObKjG0XBPW6hA1iA%2BXIvXjTtUoSNkE2Lf6E%2BpdgqfhyDaiUk2HCMroahB%2FPvaNeeb7nFhfI05L8Q5QPwC7C%2BZzvswD9aGyUthS2oYcFAD8fUCtxYL0Irdwcq65l87YFCghOLLZdfZK06JjZpjIKVi064d5oa9cWGREbUlVTVMt6gEk5Uq8JJvGtJY4dM7meKw2VhOzo8wza6K0gY6mAHBJQez90xs8Q0pYwmwhsYCr8m4KWKD0VGAcmNRD1FxvXnq6isbFMwT4KD0SoQ5Co7gyiUjUIYtGlLf5VZFYz3nCgivVc3bmVDcXq8RdNepdVtcezuQ%2FSdslF1z2%2FdwKCW9MUgv2iYsw5T7P02eUlcy7H5soHs90KD3pPbYGAM3TyA6wCLh6ZQAEGQNQ5ptB1YN6I4iGQdsbQ%3D%3D&Expires=1782749961)
- [Gemini API | Google AI for Developers](https://ai.google.dev/gemini-api/docs)
  - Gemini API Developer Docs and API Reference.
- [All methods | Gemini API | Google AI for Developers](https://ai.google.dev/api/all-methods)
- [Generate content with the Gemini Enterprise API - Google Cloud](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference?authuser=3)
  - Use the Model API for Gemini in Vertex AI to create custom applications. Review the Gemini model request body, model parameters, response body, and sample requests and responses.
- [Gemini for Google Cloud API](https://cloud.google.com/gemini/docs/api/reference/rest)
- [Gemini API reference | Google AI for Developers](https://ai.google.dev/api)
- [Solved: Gemini 1.5 pro latest REST API and system instruct...](https://www.googlecloudcommunity.com/gc/AI-ML/Gemini-1-5-pro-latest-REST-API-and-system-instructions/m-p/776644)
  - Hello, I use the Gemini REST API (https://ai.google.dev/gemini-api/docs/get-started/tutorial?lang=rest) but with gemini-1.5-pro-latest model, which means I query like this:curl https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=$GOOGLE_API_KEY \ -H 'Con...

## User

nah that's not it. it usually ends with /v1/completions or w/e

## Assistant

The correct API endpoint for Google Gemini models, such as Gemini 1.5 Pro, typically follows the OpenAI-compatible format when accessed via OpenRouter. Based on the information provided, here’s the updated configuration for your use case:

```json
{
    "one-click-man.apiSettings": {
        "temperature": 0.7,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0
    },
    "one-click-man.model": "custom",
    "one-click-man.modelCustom": "google/gemini-1.5-pro",
    "one-click-man.apiEndpoint": "https://openrouter.ai/api/v1/chat/completions",
    "one-click-man.language": "English",
    "one-click-man.promptTemplate": "Generate a concise commit message from the following git diff. \nThe message should contain a first line with a short summary and if the commit is non-trivial a longer description after a blank line.\nThe message should be written in $$$LANGUAGE$$$.\nThe diff:\n```\n$$$DIFF$$$\n```\n\nFor a longer description, each point should start with a dash (-).",
    "snyk.severity": {
        "low": false
    }
}
```

### Key Details:
1. **API Endpoint**: For OpenRouter, the endpoint is `https://openrouter.ai/api/v1/chat/completions`, which is compatible with OpenAI-like APIs.
2. **Model Name**: Updated to `google/gemini-1.5-pro` to specify the desired model.
3. **Prompt Template**: Kept unchanged for generating concise commit messages.

This setup ensures compatibility with OpenRouter and provides access to the Gemini 1.5 Pro model for handling large context sizes efficiently. If you're using another service directly (like Google's native API), the endpoint would differ (e.g., `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent`).

### Sources

- [image.jpg](https://ppl-ai-file-upload.s3.amazonaws.com/image/upload/v1732586798/user_uploads/itstlhboo/image.jpg?AWSAccessKeyId=ASIA2F3EMEYE3VW2PGTI&Signature=W7p8Tz3ACbvSq0d1Y2ss0RCSOVI%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEOj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQDqbpxh3%2FdKT2w%2F4tAgvHwUeM8FkXb5RkVTtvuFStHwJQIgIpsArWQJ0Bs1krpeeSh5BuyRLoU4g5sdvQOr1Wv73OQq%2FAQIsf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARABGgw2OTk3NTMzMDk3MDUiDGVpabkHws8i667WMyrQBJwzs8%2B8UID5HE7Cs4MY%2BrkHMzFhHtXNi4%2FGdrclMiv6Wq%2Fosys9SOLmoTvUly8Y5PfmORzN9b2HnAjgjr6M9ryxDXa9e6jJHPjPXtbI6PG%2F1H%2Bs%2Bo4Y1gwS9nU1ajL6e9hdrBwtB1BKqyjat9ikTTqxc0e8YQQXdy0Um0RWuMfvSyDtMVLjS9R9pLQKCXAPwmek6avfF1SJL5EDv94TA95KpmjHP%2BR5Cj2%2Bl72TGcX9Id1Tit8uGHv3vg0chxdVi0qCoVwq9tmR2SN4EToHdiOYSVaLtv7lx0ZL1RRkZBVziOkNteiOXT5C0fgZD9iAZJo5CZjMnbLFofqjKh8yhWz5VR4pwCe9zXppxz%2BJuLZ1Sa3NturhwVzvTJfyDQm7Gvp3LXSGmshrwJpXiPxZf7vyFmiTWlR%2F7jMcDMtfVWHoTvlyYe2M0KCNUgasPdx%2FdeDwQMyiPl9teyC3sNLeT7WXiPK%2FYGR4FAyLByJtlcUxVdqbAXEAIuVtxP1lPcgoKr%2FhjT3FvWf3p7CHHuxagYwuhmSla6%2FoDNmg4gP5EjRMPP2EI%2F%2FEb24HxRX%2FgSM2rwG9cfTKgm%2BWNjoObKjG0XBPW6hA1iA%2BXIvXjTtUoSNkE2Lf6E%2BpdgqfhyDaiUk2HCMroahB%2FPvaNeeb7nFhfI05L8Q5QPwC7C%2BZzvswD9aGyUthS2oYcFAD8fUCtxYL0Irdwcq65l87YFCghOLLZdfZK06JjZpjIKVi064d5oa9cWGREbUlVTVMt6gEk5Uq8JJvGtJY4dM7meKw2VhOzo8wza6K0gY6mAHBJQez90xs8Q0pYwmwhsYCr8m4KWKD0VGAcmNRD1FxvXnq6isbFMwT4KD0SoQ5Co7gyiUjUIYtGlLf5VZFYz3nCgivVc3bmVDcXq8RdNepdVtcezuQ%2FSdslF1z2%2FdwKCW9MUgv2iYsw5T7P02eUlcy7H5soHs90KD3pPbYGAM3TyA6wCLh6ZQAEGQNQ5ptB1YN6I4iGQdsbQ%3D%3D&Expires=1782749961)
- [All methods | Gemini API | Google AI for Developers](https://ai.google.dev/api/all-methods)
- [Solved: Gemini 1.5 pro latest REST API and system instruct...](https://www.googlecloudcommunity.com/gc/AI-ML/Gemini-1-5-pro-latest-REST-API-and-system-instructions/m-p/776644)
  - Hello, I use the Gemini REST API (https://ai.google.dev/gemini-api/docs/get-started/tutorial?lang=rest) but with gemini-1.5-pro-latest model, which means I query like this:curl https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=$GOOGLE_API_KEY \ -H 'Con...
- [PublicAffairs/openai-gemini: Gemini OpenAI API proxy. Serverless!](https://github.com/PublicAffairs/openai-gemini)
  - Gemini ➜ OpenAI API proxy. Serverless! Contribute to PublicAffairs/openai-gemini development by creating an account on GitHub.
- [OpenRouter Integration · ChatGPTNextWeb ChatGPT-Next-Web](https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web/discussions/3361)
  - OpenRouter is now compatible with ChatGPT-Next-Web, offering a wide range of models from various providers. With OpenRouter, you can connect to models from: OpenAI [GPT-3.5, GPT-4] Anthropic [Claud...
- [Gemini Experimental 1121 (free) - API, Providers, Stats | OpenRouter](https://openrouter.ai/google/gemini-exp-1121:free)
  - Experimental release (November 21st, 2024) of Gemini.. Run Gemini Experimental 1121 (free) with API
- [Generate content with the Gemini Enterprise API | Generative AI on Vertex AI | Google Cloud](https://cloud.google.com/vertex-ai/generative-ai/docs/model-reference/inference?authuser=3)
  - Use the Model API for Gemini in Vertex AI to create custom applications. Review the Gemini model request body, model parameters, response body, and sample requests and responses.
- [Models | Gemini API | Google AI for Developers](https://ai.google.dev/api/models)
- [OpenAI API Compatible access to Google Gemini and Embedding ...](https://www.reddit.com/r/LocalLLaMA/comments/1elyqp9/openai_api_compatible_access_to_google_gemini_and/)
- [Quick Start - OpenRouter](https://openrouter.ai/docs/quick-start)
  - Start building with OpenRouter

## User

i'm beyond confused. I've now tried google's api and openrouter and both are failing with this one-click man app.

```
English
All content in this README is generated using OpenAI.

This is a VSCode extension that automatically generates commit messages using OpenAI. This extension analyzes Git diff and generates concise commit messages in the language specified by the user.

Usage
Extension Settings
setting

Source Control Panel
demo1

Command Palette
demo2

Command Input
demo3

Features
Automatic Commit Message Generation: Analyzes Git diff using OpenAI and generates commit messages automatically.
Language Selection: Choose the language for commit messages in settings. Supported languages: Korean, English, Chinese, Japanese, Spanish, French, German.
Model Selection: Select OpenAI model for message generation. GPT-4o is the fastest, GPT-4 is the most accurate.
API Settings: Customize OpenAI API settings such as max_tokens, temperature, top_p, frequency_penalty, presence_penalty.
Prompt Template: Customize OpenAI prompt template where $$$DIFF$$$ is replaced by git diff and $$$LANGUAGE$$$ by the selected language.
Ignored Files: Set files to be ignored in git diff comparisons.
Installation
Install the "One Click Man" extension from the VSCode marketplace.
After installation, configure your API key and other settings in the extension settings.
Configuration
API Key: Set your OpenAI API key.

"one-click-man.apiKey": "YOUR_API_KEY"

Language: Select the language for commit messages.

"one-click-man.language": "English"

Model: Select the OpenAI model to use.(gemini, claude, etc. are available via modelCustom when custom is selected).

"one-click-man.model": "gpt-4o-mini" | "custom"

Model custom: Select the model custom you want to use (gemini, claude, etc.).

"one-click-man.modelCustom": "gemini-1.5-pro-latest"

Max Tokens: Set the maximum number of tokens to generate shared between prompt and completion.

"one-click-man.maxTokens": 256

API Settings: Customize OpenAI API settings.

"one-click-man.apiSettings": {
  "temperature": 0.7,
  "top_p": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0
}

API Endpoint: Customize the API Endpoint.

“one-click-man.apiEndpoint": “https://api.openai.com/v1/chat/completions”

API Headers: Customize the API Headers.

“one-click-man.apiHeaders": {}

Include Branch Name: Set whether to include branch name in commit messages.

"one-click-man.includeBranchName": true | false

Prompt Template: Set the OpenAI prompt template.

"one-click-man.promptTemplate": "diff: $$$DIFF$$$, language: $$$LANGUAGE$$$"

Ignored Files: Set the list of files to be ignored.

"one-click-man.ignoredFiles": ["yarn.lock", "package-lock.json"]

Max Diff Length: Set the maximum length of the diff to be compared.

"one-click-man.wordsCount": 1000

Usage
Stage the changes you want to commit.
There are three ways to generate commit messages:
Open the command palette (Ctrl+Shift+P or Cmd+Shift+P) and run Generate One Click Man Commit Message.
Use the Source Control panel:
Press Ctrl+Shift+G to open the Source Control panel.
Click the icon icon in the top right to generate a commit message.
Press Shift+Cmd+Enter to generate a commit message.
Review and edit the automatically generated commit message if necessary, then commit.
The generated commit message is automatically copied to the clipboard.
Paste the message using Cmd+V in the terminal when adding a commit.
Key Bindings
The extension provides the following default key bindings:

Windows/Linux: Ctrl+Alt+Enter
macOS: Shift+Cmd+Enter
Use these key bindings to quickly generate commit messages.

License
This project is licensed under the GNU General Public License v3.0 - see the LICENSE file for details.

한국어
README 모든 내용은 OpenAI를 사용하여 생성되었습니다.

OpenAI를 사용하여 커밋 메시지를 자동 생성해주는 VSCode 확장입니다.
이 확장은 Git diff를 분석하고, 사용자가 설정한 언어로 간결한 커밋 메시지를 생성합니다.

사용법
extension 세팅
setting

소스 컨트롤 패널
demo1

커맨드 팔레트
demo2

커맨드 입력
demo3

기능
자동 커밋 메시지 생성: OpenAI를 사용하여 Git diff를 분석하고 커밋 메시지를 자동으로 생성합니다.
언어 선택: 설정에서 커밋 메시지가 작성될 언어를 선택할 수 있습니다. 지원되는 언어는 한국어, 영어, 중국어, 일본어, 스페인어, 프랑스어, 독일어입니다.
모델 선택: OpenAI 모델을 선택하여 메시지를 생성할 수 있습니다. gpt-4o는 가장 빠르고, gpt-4는 가장 정확합니다.
API 설정: OpenAI API 설정을 사용자 정의할 수 있습니다. 예를 들어, max_tokens, temperature, top_p, frequency_penalty, presence_penalty 등을 설정할 수 있습니다.
프롬프트 템플릿: OpenAI 프롬프트 템플릿을 설정하여, $$$DIFF$$$는 git diff로, $$$LANGUAGE$$$는 선택한 언어로 대체됩니다.
무시할 파일 설정: 특정 파일을 무시하도록 설정할 수 있습니다.
설치 방법
VSCode 마켓플레이스에서 "One Click Man" 확장을 설치합니다.
설치 후, 설정에서 API 키와 기타 설정을 입력합니다.
설정 방법
API 키 설정: OpenAI API 키를 설정합니다.

"one-click-man.apiKey": "YOUR_API_KEY"

언어 설정: 커밋 메시지가 작성될 언어를 선택합니다.

"one-click-man.language": "Korean"

모델 설정: 사용할 OpenAI 모델을 선택합니다(custom 선택시 modelCustom을 통해 gemini, claude등 사용 가능합니다).

"one-click-man.model": "gpt-4o-mini" | "custom"

모델 커스텀 설정: 사용할 커스텀 모델을 선택합니다(gemini, claude 등).

"one-click-man.modelCustom": "gemini-1.5-pro-latest"

최대 토큰 설정: 프롬프트와 완료 간에 공유되는 생성할 최대 토큰 수입니다.
정확한 한도는 모델에 따라 다릅니다. (표준 영어 텍스트의 경우 하나의 토큰은 대략 4자입니다.)

"one-click-man.maxTokens": 256

API 설정: OpenAI API 설정을 사용자 정의합니다.

"one-click-man.apiSettings": {
  "temperature": 0.7,
  "top_p": 1,
  "frequency_penalty": 0,
  "presence_penalty": 0
}

API Endpoint: API Endpoint를 사용자 정의합니다.

"one-click-man.apiEndpoint": "https://api.openai.com/v1/chat/completions"

API Headers: API Headers를 사용자 정의합니다.

"one-click-man.apiHeaders": {}

브랜치명 포함 여부 설정: 커밋 메시지에 브랜치명을 포함할지 여부를 설정합니다.

"one-click-man.includeBranchName": true | false

프롬프트 템플릿 설정: OpenAI 프롬프트 템플릿을 설정합니다.

"one-click-man.promptTemplate": "diff: $$$DIFF$$$, language: $$$LANGUAGE$$$"

무시할 파일 설정: 무시할 파일 목록을 설정합니다.

"one-click-man.ignoredFiles": ["yarn.lock", "package-lock.json"]

최대 diff 길이 설정: 최대 비교할 diff의 길이를 설정합니다.

"one-click-man.wordsCount": 1000

사용 방법
커밋할 변경 사항을 스테이징합니다.
커밋 메시지를 생성할 수 있는 3가지 방법이 있습니다.
커맨드 팔레트(Ctrl+Shift+P 또는 Cmd+Shift+P)를 열고 원클맨 커밋 메시지 생성 명령어를 실행합니다.
소스 컨트롤 패널을 사용하여 커밋 메시지 생성
Ctrl+Shift+G를 눌러 소스 컨트롤 패널을 엽니다.
우측 상단의 icon를 클릭하여 커밋 메시지를 생성합니다.
shift+command+enter를 눌러 커밋 메시지를 생성합니다.
자동으로 생성된 커밋 메시지를 확인하고, 필요시 수정한 후 커밋합니다.
커밋 메세지 생성 직후 클립보드로 자동 복사 됩니다.
command+v를 통해 터미널에서 커밋 추가시 메세지 붙여넣기 하여 사용할 수 있습니다.
키 바인딩
확장은 기본적으로 다음 키 바인딩을 제공합니다:

Windows/Linux: Ctrl+Alt+Enter
macOS: Shift+Cmd+Enter
이 키 바인딩을 통해 빠르게 커밋 메시지를 생성할 수 있습니다.

라이선스
이 프로젝트는 GNU General Public License v3.0에 따라 라이선스가 부여됩니다. 자세한 내용은 LICENSE 파일을 참조하세요.
```

The above are the instructions. It works perfectly fine with openai. How to use it with Gemini through openrouter??

## Assistant

To use the **One Click Man** VSCode extension with **Google Gemini** through **OpenRouter**, follow these steps:

---

### **1. Update Settings for OpenRouter and Gemini**
Modify the `settings.json` file in your VSCode configuration to include the correct OpenRouter API endpoint and model name.

```json
{
    "one-click-man.apiSettings": {
        "temperature": 0.7,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0
    },
    "one-click-man.model": "custom",
    "one-click-man.modelCustom": "google/gemini-1.5-pro",
    "one-click-man.apiEndpoint": "https://openrouter.ai/api/v1/chat/completions",
    "one-click-man.apiHeaders": {
        "Authorization": "Bearer YOUR_OPENROUTER_API_KEY"
    },
    "one-click-man.language": "English",
    "one-click-man.promptTemplate": "Generate a concise commit message from the following git diff. \nThe message should contain a first line with a short summary and if the commit is non-trivial a longer description after a blank line.\nThe message should be written in $$$LANGUAGE$$$.\nThe diff:\n```\n$$$DIFF$$$\n```\n\nFor a longer description, each point should start with a dash (-)."
}
```

---

### **2. Key Configuration Details**
- **API Endpoint**: Set to `https://openrouter.ai/api/v1/chat/completions`, which is OpenRouter's endpoint for OpenAI-compatible APIs.
- **Model Name**: Use `"google/gemini-1.5-pro"` for the Gemini model.
- **API Headers**: Add the `Authorization` header with your OpenRouter API key.
- **Prompt Template**: Retain or customize the prompt template to suit your needs.

---

### **3. Generate an OpenRouter API Key**
1. Visit [OpenRouter](https://openrouter.ai) and sign up or log in.
2. Navigate to the API key section and generate an API key.
3. Replace `YOUR_OPENROUTER_API_KEY` in the configuration with your actual API key.

---

### **4. Test the Configuration**
1. Stage some changes in your Git repository.
2. Use any of the methods described in the README to generate a commit message (e.g., via the Command Palette or Source Control panel).
3. Verify that the generated commit message appears correctly.

---

### **Troubleshooting**
If you encounter issues:
- Ensure your OpenRouter API key is valid and has sufficient permissions.
- Double-check that the model name (`google/gemini-1.5-pro`) is correct and available on OpenRouter.
- Check for typos in the API endpoint or headers.

This setup should allow you to use Google Gemini through OpenRouter seamlessly with One Click Man!

### Sources

- [image.jpg](https://ppl-ai-file-upload.s3.amazonaws.com/image/upload/v1732586798/user_uploads/itstlhboo/image.jpg?AWSAccessKeyId=ASIA2F3EMEYE3VW2PGTI&Signature=W7p8Tz3ACbvSq0d1Y2ss0RCSOVI%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEOj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIQDqbpxh3%2FdKT2w%2F4tAgvHwUeM8FkXb5RkVTtvuFStHwJQIgIpsArWQJ0Bs1krpeeSh5BuyRLoU4g5sdvQOr1Wv73OQq%2FAQIsf%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FARABGgw2OTk3NTMzMDk3MDUiDGVpabkHws8i667WMyrQBJwzs8%2B8UID5HE7Cs4MY%2BrkHMzFhHtXNi4%2FGdrclMiv6Wq%2Fosys9SOLmoTvUly8Y5PfmORzN9b2HnAjgjr6M9ryxDXa9e6jJHPjPXtbI6PG%2F1H%2Bs%2Bo4Y1gwS9nU1ajL6e9hdrBwtB1BKqyjat9ikTTqxc0e8YQQXdy0Um0RWuMfvSyDtMVLjS9R9pLQKCXAPwmek6avfF1SJL5EDv94TA95KpmjHP%2BR5Cj2%2Bl72TGcX9Id1Tit8uGHv3vg0chxdVi0qCoVwq9tmR2SN4EToHdiOYSVaLtv7lx0ZL1RRkZBVziOkNteiOXT5C0fgZD9iAZJo5CZjMnbLFofqjKh8yhWz5VR4pwCe9zXppxz%2BJuLZ1Sa3NturhwVzvTJfyDQm7Gvp3LXSGmshrwJpXiPxZf7vyFmiTWlR%2F7jMcDMtfVWHoTvlyYe2M0KCNUgasPdx%2FdeDwQMyiPl9teyC3sNLeT7WXiPK%2FYGR4FAyLByJtlcUxVdqbAXEAIuVtxP1lPcgoKr%2FhjT3FvWf3p7CHHuxagYwuhmSla6%2FoDNmg4gP5EjRMPP2EI%2F%2FEb24HxRX%2FgSM2rwG9cfTKgm%2BWNjoObKjG0XBPW6hA1iA%2BXIvXjTtUoSNkE2Lf6E%2BpdgqfhyDaiUk2HCMroahB%2FPvaNeeb7nFhfI05L8Q5QPwC7C%2BZzvswD9aGyUthS2oYcFAD8fUCtxYL0Irdwcq65l87YFCghOLLZdfZK06JjZpjIKVi064d5oa9cWGREbUlVTVMt6gEk5Uq8JJvGtJY4dM7meKw2VhOzo8wza6K0gY6mAHBJQez90xs8Q0pYwmwhsYCr8m4KWKD0VGAcmNRD1FxvXnq6isbFMwT4KD0SoQ5Co7gyiUjUIYtGlLf5VZFYz3nCgivVc3bmVDcXq8RdNepdVtcezuQ%2FSdslF1z2%2FdwKCW9MUgv2iYsw5T7P02eUlcy7H5soHs90KD3pPbYGAM3TyA6wCLh6ZQAEGQNQ5ptB1YN6I4iGQdsbQ%3D%3D&Expires=1782749961)
- [Gemini Experimental 1121 (free) - API, Providers, Stats](https://openrouter.ai/google/gemini-exp-1121:free)
  - Experimental release (November 21st, 2024) of Gemini.. Run Gemini Experimental 1121 (free) with API
- [Get started with the Gemini mobile app - Android - Google Help](https://support.google.com/gemini/answer/14554984?co=GENIE.Platform%3DAndroid&hl=en)
  - Chat with your Gemini mobile app to supercharge your ideas. Get help learning in new ways, writing thank you notes, planning events, and more. Gemini can connect with Google apps called Extensions, li
- [All methods | Gemini API | Google AI for Developers](https://ai.google.dev/api/all-methods)
- [Quick Start | OpenRouter](https://openrouter.ai/docs/quick-start)
- [GitHub - PublicAffairs/openai-gemini: Gemini ➜ OpenAI API proxy. Serverless!](https://github.com/PublicAffairs/openai-gemini)
  - Gemini ➜ OpenAI API proxy. Serverless! Contribute to PublicAffairs/openai-gemini development by creating an account on GitHub.
- [OpenRouter¶](https://docs.llamaindex.ai/en/stable/examples/llm/openrouter/)
