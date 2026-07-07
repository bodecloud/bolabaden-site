---
source_url: "https://www.perplexity.ai/search/a32c9758-cd19-44a8-9bd0-b084429287dc"
thread_uuid: "88343f29-e69f-4b3d-9107-98a7f614cd10"
slug: "a32c9758-cd19-44a8-9bd0-b084429287dc"
title: "```
Create an agentic researcher app that functions similarly to Google search. It should support saving as embeddings, questioning the research (ai assistant that uses the embeddings to answer user prompts). It should use LiteLLM to connect to any LLM provider such as lmstudio, ollama, google, openrouter, anthropic.

It should provide these providers by default:
- https://github.com/cheahjs/free-llm-api-resources

When using the free apis, it should fallback to another one in the list, if a rate limiting error occurs. This should be configurable in settings (e.g. 'When using free providers, automatically fallback to another one in the list when a rate limit is exceeded') defaulting to not in use.

When doing searches, it should be possible to have AI research in the background to find more information. This should have another mutually exclusive mode that functions similarly to a RSS feed where new information on that search will be populated and requested automatically on boot (again, configurable in the settings).

The user interface should be intuitive as it will be written for my tech-illiterate grandma, father, mother, and brother.

Adhere to a 'human-in-the-loop' feedback system allowing the user to interrupt an AI with clarifications/additional information they may have forgotten to put in their initial prompt.

To start this project, please view
```

Expand on these ideas and enhance the LLM AI prompt I'm creating."
extracted_at: "2026-06-29T16:07:12.318Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# ```
Create an agentic researcher app that functions similarly to Google search. It should support saving as embeddings, questioning the research (ai assistant that uses the embeddings to answer user prompts). It should use LiteLLM to connect to any LLM provider such as lmstudio, ollama, google, openrouter, anthropic.

It should provide these providers by default:
- https://github.com/cheahjs/free-llm-api-resources

When using the free apis, it should fallback to another one in the list, if a rate limiting error occurs. This should be configurable in settings (e.g. 'When using free providers, automatically fallback to another one in the list when a rate limit is exceeded') defaulting to not in use.

When doing searches, it should be possible to have AI research in the background to find more information. This should have another mutually exclusive mode that functions similarly to a RSS feed where new information on that search will be populated and requested automatically on boot (again, configurable in the settings).

The user interface should be intuitive as it will be written for my tech-illiterate grandma, father, mother, and brother.

Adhere to a 'human-in-the-loop' feedback system allowing the user to interrupt an AI with clarifications/additional information they may have forgotten to put in their initial prompt.

To start this project, please view
```

Expand on these ideas and enhance the LLM AI prompt I'm creating.

Source: [Perplexity thread](https://www.perplexity.ai/search/a32c9758-cd19-44a8-9bd0-b084429287dc)

## User

```
Create an agentic researcher app that functions similarly to Google search. It should support saving as embeddings, questioning the research (ai assistant that uses the embeddings to answer user prompts). It should use LiteLLM to connect to any LLM provider such as lmstudio, ollama, google, openrouter, anthropic.

It should provide these providers by default:
- https://github.com/cheahjs/free-llm-api-resources

When using the free apis, it should fallback to another one in the list, if a rate limiting error occurs. This should be configurable in settings (e.g. 'When using free providers, automatically fallback to another one in the list when a rate limit is exceeded') defaulting to not in use.

When doing searches, it should be possible to have AI research in the background to find more information. This should have another mutually exclusive mode that functions similarly to a RSS feed where new information on that search will be populated and requested automatically on boot (again, configurable in the settings).

The user interface should be intuitive as it will be written for my tech-illiterate grandma, father, mother, and brother.

Adhere to a 'human-in-the-loop' feedback system allowing the user to interrupt an AI with clarifications/additional information they may have forgotten to put in their initial prompt.

To start this project, please view
```

Expand on these ideas and enhance the LLM AI prompt I'm creating.

## Assistant

To create an agentic researcher app with the features you've described, we can expand on your ideas and enhance the LLM AI prompt as follows:

## Core Functionality

1. **Search Engine Integration**: Implement a search functionality similar to Google, allowing users to input queries and receive relevant results.

2. **Embedding Storage**: Develop a system to save search results and AI-generated content as embeddings for quick retrieval and analysis.

3. **AI Assistant**: Create an AI assistant that can answer user prompts by leveraging the stored embeddings and additional context.

4. **LiteLLM Integration**: Utilize LiteLLM to connect to various LLM providers, including local options like lmstudio and ollama, as well as cloud-based services like Google, OpenRouter, and Anthropic.

5. **Free API Resources**: Incorporate the free LLM API resources from https://github.com/cheahjs/free-llm-api-resources as default providers.

## Enhanced Features

6. **Intelligent Fallback System**: Implement a configurable fallback mechanism that automatically switches to another provider in the list when a rate limit is exceeded for free APIs.

7. **Background Research**: Add an option for AI to conduct background research on search queries, providing additional relevant information.

8. **RSS-like Updates**: Develop a feature that automatically checks for and populates new information related to saved searches upon app startup.

9. **Human-in-the-Loop Feedback**: Create an interrupt system allowing users to provide clarifications or additional information during AI processing.

10. **Customizable User Interface**: Design an intuitive, user-friendly interface suitable for users with varying levels of tech literacy, including options for larger text, high contrast, and simplified layouts.

## Additional Enhancements

11. **Multi-modal Input**: Support voice input and image recognition to accommodate users who may struggle with typing.

12. **Guided Search Assistance**: Implement a step-by-step guided search feature to help users refine their queries and find the most relevant information.

13. **Personalized Results**: Develop a system that learns from user interactions to provide more tailored search results and AI responses over time.

14. **Simplified Settings Management**: Create an easy-to-use settings panel with clear explanations and visual aids for each option.

15. **Collaborative Research**: Add a feature allowing family members or caregivers to remotely assist or monitor research activities, with user consent.

16. **Accessibility Features**: Incorporate screen reader compatibility, adjustable text sizes, and color schemes to cater to users with visual impairments.

17. **Error Handling and Explanations**: Implement clear, jargon-free error messages and provide simple explanations for technical issues or limitations.

18. **Progress Indicators**: Add visual feedback for ongoing processes, such as loading bars or simple animations, to keep users informed during longer operations.

19. **Saved Searches and History**: Create an easily accessible list of recent and saved searches, allowing users to quickly revisit previous research topics.

20. **Export and Share**: Implement simple options to export research results or share findings with family members or healthcare providers.

By incorporating these enhancements, the agentic researcher app will be more robust, user-friendly, and accessible to a wide range of users, including those who may be less familiar with technology.

### Sources

- [Top 14 Agentic AI Tools - AskUI](https://www.askui.com/blog-posts/top-14-agentic-ai-tools)
  - This blog shows how cutting-edge technologies like AskUI and Claude are transforming sectors by enhancing efficiency, accuracy, and adaptability.
- [Research Assistant](https://en.wikipedia.org/wiki/Research_assistant)
- [Giskard integrates with LiteLLM: Simplifying LLM agent testing ...](https://www.giskard.ai/knowledge/giskard-integrates-with-litellm-simplifying-llm-agent-testing-across-foundation-models)
  - Giskard integrates with LiteLLM: Simplify your LLM agents testing workflow with unified access to OpenAI, Anthropic, Mistral, and more.
- [A Descriptive and Hands-On Guide to LiteLLM](https://adasci.org/a-descriptive-and-hands-on-guide-to-litellm/)
  - Explore LiteLLM, a lightweight, efficient language model revolutionizing natural language processing with advanced features and scalability.
- [[PDF] Text-Free User Interfaces for Illiterate and Semiliterate Users](https://itidjournal.org/index.php/itid/article/download/243/243-579-2-PB.pdf)
- [UI Design for Elderly - Userpeek.com](https://userpeek.com/blog/ui-design-for-elderly/)
  - In this article, UI Design for Elderly, we will tackle these issues along with the best ways to provide an easier and more fulfilling online experience for
- [Agentic AI: 4 reasons why it's the next big thing in AI research - IBM](https://www.ibm.com/think/insights/agentic-ai)
  - There are good reasons to think that the hype around agentic AI is justified.
- [[PDF] how to get a research assistant job when there are no job postings](https://www.ucdenver.edu/docs/librariesprovider134/default-document-library/tips-to-find-a-research-position.pdf?sfvrsn=212e95b9_2)
- [LiteLLM | Technology Radar - Thoughtworks](https://www.thoughtworks.com/radar/languages-and-frameworks/litellm)
  - LiteLLM is a library for seamless integration with various large language model (LLM) providers' APIs that standardizes interactions through an OpenAI API format. It supports [...]
- [5 UX design tips for seniors - Digital Scientists](https://digitalscientists.com/blog/ux-design-for-seniors-5-tips-2/)
  - Everyone deserves good design. Today, the vast majority of older adults 65 and over own smartphones. Are you designing your UX for them?
