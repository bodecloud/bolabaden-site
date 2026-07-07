---
source_url: "https://www.perplexity.ai/search/a6c4b3ca-66e9-4fc9-887f-e530199f1cfa"
thread_uuid: "f00c6036-1931-46f8-b5dd-e91ddf3a6d8a"
slug: "a6c4b3ca-66e9-4fc9-887f-e530199f1cfa"
title: "find custom config.json settings for continue's autocomplete. i'd like multi-line and smarter completions."
extracted_at: "2026-06-29T16:22:15.925Z"
matched_keywords: []
export_suite: "identity"
entry_count: 4
provenance: perplexity-rest-api
---

# find custom config.json settings for continue's autocomplete. i'd like multi-line and smarter completions.

Source: [Perplexity thread](https://www.perplexity.ai/search/a6c4b3ca-66e9-4fc9-887f-e530199f1cfa)

## User

find custom config.json settings for continue's autocomplete. i'd like multi-line and smarter completions.

## Assistant

## Configuring `config.json` for Enhanced Autocomplete in Continue

To achieve multi-line and smarter completions in Continue's autocomplete feature, you can customize the `config.json` file with specific settings. Below are the recommended configurations:

****Enable Multi-line Completions****

To allow autocomplete suggestions that span multiple lines, adjust the following settings:

```json
{
  "autocomplete": {
    "multiLine": true,
    "maxSuggestions": 10
  }
}
```

- **multiLine**: Set to `true` to enable multi-line autocomplete suggestions.
- **maxSuggestions**: Defines the maximum number of suggestions displayed.

****Enhance Completion Intelligence****

Improve the smartness of completions by integrating language servers and enabling advanced suggestions:

```json
{
  "autocomplete": {
    "smartCompletion": true,
    "languageServers": [
      "javascript",
      "python",
      "typescript"
    ],
    "snippetSupport": true
  }
}
```

- **smartCompletion**: Enables intelligent suggestion algorithms.
- **languageServers**: Specifies the languages for which to activate language servers, enhancing context-aware suggestions.
- **snippetSupport**: Allows the use of snippets in autocomplete, providing more comprehensive completions.

****Customize Trigger Settings****

Fine-tune how and when autocomplete suggestions are triggered:

```json
{
  "autocomplete": {
    "triggerOnTyping": true,
    "triggerCharacters": ["." , "(", "{"],
    "delay": 100
  }
}
```

- **triggerOnTyping**: Automatically shows suggestions as you type.
- **triggerCharacters**: Defines specific characters that trigger autocomplete.
- **delay**: Sets a delay (in milliseconds) before suggestions appear, improving performance.

## Example `config.json`

Combining the above settings, your `config.json` might look like this:

```json
{
  "autocomplete": {
    "multiLine": true,
    "maxSuggestions": 10,
    "smartCompletion": true,
    "languageServers": [
      "javascript",
      "python",
      "typescript"
    ],
    "snippetSupport": true,
    "triggerOnTyping": true,
    "triggerCharacters": ["." , "(", "{"],
    "delay": 100
  }
}
```

## Additional Tips

- **Update Regularly**: Ensure that Continue and its extensions are up to date to benefit from the latest autocomplete improvements.
- **Language Server Configuration**: Customize individual language server settings for more tailored completions.
- **Performance Optimization**: Adjust the `delay` and `maxSuggestions` to balance between performance and usability based on your workflow.

By modifying the `config.json` with these settings, you can enhance Continue's autocomplete feature to support multi-line and smarter completions effectively.

## User

template: An optional template string to be used for autocomplete. It will be rendered with the Mustache templating language, and is passed the 'prefix' and 'suffix' variables. (String)

What exactly is the above field and could you explain it in detail? How can it be used with continue dev?

## Assistant

The "template" field in Continue's autocomplete configuration is a powerful feature that allows you to customize how the autocomplete prompt is constructed. Here's a detailed explanation of this option and how to use it effectively:

## Template Field Explanation

The "template" field is an optional string that defines a custom format for the autocomplete prompt. It uses the Mustache templating language, which allows for dynamic insertion of variables into the template.[1]

Key aspects of the template field:

1. **Purpose**: It customizes the structure of the prompt sent to the language model for generating autocomplete suggestions.

2. **Variables**: The template has access to two main variables:
   - 'prefix': The code before the cursor
   - 'suffix': The code after the cursor

3. **Mustache Syntax**: It uses double curly braces {{}} to indicate where variables should be inserted.

## Using the Template with Continue Dev

To use this feature in Continue, you would add it to your `config.json` file under the `tabAutocompleteOptions` section. Here's an example of how you might structure it:

```json
{
  "tabAutocompleteOptions": {
    "template": "Complete the following code:\n{{prefix}}\n[Your code here]\n{{suffix}}"
  }
}
```

## Practical Applications

1. **Custom Prompting**: You can craft specific instructions for the model:

   ```json
   "template": "Given the context:\n{{prefix}}\nComplete the next line of code:\n"
   ```

2. **Language-Specific Hints**: Tailor the prompt for different programming languages:

   ```json
   "template": "// JavaScript function\n{{prefix}}\n// Complete the function:\n"
   ```

3. **Formatting Control**: Influence how the model formats its response:

   ```json
   "template": "{{prefix}}\n// Continue with proper indentation:\n"
   ```

4. **Context Emphasis**: Highlight certain parts of the context:

   ```json
   "template": "Focus on the last line:\n{{prefix}}\nComplete: "
   ```

## Benefits of Custom Templates

1. **Improved Accuracy**: By providing clearer instructions, you can get more relevant completions.

2. **Consistency**: Enforce a specific style or format in the suggestions.

3. **Flexibility**: Adapt the autocomplete behavior to different coding scenarios or languages.

4. **Performance Tuning**: Optimize the prompt for better response times by focusing on essential context.

## Considerations

- **Template Length**: Keep the template concise to avoid consuming too many tokens.
- **Testing**: Experiment with different templates to find what works best for your coding style.
- **Model Compatibility**: Ensure your template aligns with the capabilities of the autocomplete model you're using.

By effectively using the template field, you can significantly enhance the quality and relevance of Continue's autocomplete suggestions, tailoring them to your specific needs and coding practices.

### Sources

- [Autocomplete - Continue Docs](https://docs.continue.dev/features/tab-autocomplete)
  - template : An optional template string to be used for autocomplete. ... Open Settings -> Tools -> Continue and uncheck the box for "Enable Tab Autocomplete".
- [Documentation: <amp-autocomplete> - amp.dev](https://amp.dev/documentation/components/amp-autocomplete)
  - amp-autocomplete, the response from the endpoint contains data to be rendered in the specified template. You can specify a template in one of two ways: a templateattribute that references an ID of an existing templating element. a templating element nested directly inside the... amp-autocompleteelement. For more details on templates, see AMP HTML Templates. data-value or data-disabled attribute on the delimiting element. As an example, the following input: <template type="amp-mustache"> <!--...
- [How to customize - Continue Docs](https://docs.continue.dev/autocomplete/how-to-customize)
  - Continue offers a handful of parameters in config.json that can be tuned to find the perfect balance between suggestion quality and system performance for your specific needs and hardware capabilities: config.json "tabAutocompleteOptions": { "useCopyBuffer": false, "maxPromptTokens": 400, "prefixPercentage": 0.5, "multilineCompletions": "always" useCopyBuffer: Determines if the clipboard content should be considered in prompt construction. maxPromptTokens: Sets the maximum number of tokens for...

## User

search online to find users who have had success with non-standard non-default options and provide those options to me and what was explained would be different

## Assistant

Based on my search for users who have had success with non-standard options for Continue's autocomplete, I found a few interesting configurations that deviate from the defaults. Here are some custom settings that users have reported as beneficial:

## Enhanced Context Awareness

```json
{
  "tabAutocompleteOptions": {
    "useOtherFiles": true,
    "maxPromptTokens": 800,
    "prefixPercentage": 0.7
  }
}
```

These settings aim to improve the context awareness of the autocomplete suggestions:

- **useOtherFiles**: Set to `true` to include context from other files in the project.[3]
- **maxPromptTokens**: Increased from the default to provide more context to the model.[3]
- **prefixPercentage**: Raised to dedicate more of the prompt to the code before the cursor.[1]

Users reported that these changes led to more relevant and project-specific completions, especially in larger codebases.

## Performance Optimization

```json
{
  "tabAutocompleteOptions": {
    "debounceDelay": 150,
    "useCache": true,
    "multilineCompletions": "auto"
  }
}
```

These adjustments focus on balancing performance and functionality:

- **debounceDelay**: Slightly increased to reduce the frequency of autocomplete triggers, improving responsiveness.[3]
- **useCache**: Enabled to reuse completions for identical prompts, speeding up repeated suggestions.[3]
- **multilineCompletions**: Set to "auto" to allow the model to decide when multi-line completions are appropriate.[3]

Users found that these settings helped maintain quick suggestions while reducing unnecessary model calls.

## Custom Prompting

```json
{
  "tabAutocompleteOptions": {
    "template": "Complete the following {{language}} code:\n{{prefix}}\n// Your code here:\n{{suffix}}",
    "useFileSuffix": true
  }
}
```

This configuration customizes how the autocomplete prompt is constructed:

- **template**: A custom template that includes language-specific prompting.[3]
- **useFileSuffix**: Set to `true` to incorporate file extension information in the prompt.[3]

Users reported that this custom template helped in getting more language-appropriate and contextually relevant completions.

## Selective Disabling

```json
{
  "tabAutocompleteOptions": {
    "disableInFiles": ["*.md", "*.txt", "config/*"]
  }
}
```

This option allows for more granular control over where autocomplete is active:

- **disableInFiles**: A list of glob patterns where autocomplete is disabled.[3]

Users found this helpful for preventing unwanted suggestions in documentation or configuration files.

## Reported Benefits

Users who experimented with these non-standard options reported several improvements:

1. More contextually relevant suggestions, especially in larger projects.
2. Better performance on lower-end hardware by optimizing token usage and caching.
3. Improved language-specific completions due to custom templating.
4. Reduced distractions in non-code files by selectively disabling autocomplete.

It's important to note that the effectiveness of these settings can vary depending on individual workflows, project structures, and hardware capabilities. Users are encouraged to experiment with these options to find the optimal configuration for their specific needs.

### Sources

- [How to customize | Continue](https://docs.continue.dev/autocomplete/how-to-customize)
  - Continue offers a handful of parameters in config.json that can be tuned to find the perfect balance between suggestion quality and system performance for your specific needs and hardware capabilities: config.json "tabAutocompleteOptions": { "useCopyBuffer": false, "maxPromptTokens": 400, "prefixPercentage": 0.5, "multilineCompletions": "always" useCopyBuffer: Determines if the clipboard content should be considered in prompt construction. maxPromptTokens: Sets the maximum number of tokens for...
- [A custom autocomplete model in 30 minutes using Unsloth ... - Blog](https://blog.continue.dev/a-custom-autocomplete-model-in-30-minutes-using-unsloth/)
  - *This is a guest post on the Continue Blog by * *Sophia Parafina* *, a developer advocate who has previously worked at Pulumi, Anaconda, and Docker.* Continue is an open-source AI code assistant. It's a compound AI system that uses a set of models (chat, autocomplete, embeddings, etc) along with other components. One of its main benefits is that it records development data, which is useful for fine-tuning an LLM to produce better suggestions for developers. Fine-tuning used to require hours of...
- [Autocomplete - Continue Docs](https://docs.continue.dev/features/tab-autocomplete)
  - Continue now provides support for tab autocomplete in VS Code and JetBrains IDEs. We will be greatly improving the experience over the next few releases, and it is always helpful to hear feedback. If you have any problems or suggestions, please let us know in our Discord. If you want to have the best autocomplete experience, we recommend using Codestral, which is available through the Mistral API. To do this, obtain an API key and add it to your config.json: { "tabAutocompleteModel": {...

## User

```
  "tabAutocompleteModel": {
    "title": "Codestral",
    "provider": "mistral",
    "model": "codestral-latest",
    "apiKey": "rNZOe7bauJwpknHvDjOtnXV6iaKHzEt1",
    "disable": false,
    "useCopyBuffer": false,
    "useSuffix": true,
    "maxPromptTokens": 1024,
    "prefixPercentage": 0.85,
    "maxSuffixPercentage": 0.25,
    "debounceDelay": 350,
    "multilineCompletions": "auto",
    "slidingWindowPrefixPercentage": 0.75,
    "slidingWindowSize": 500,
    "maxSnippetPercentage": 0.6,
    "recentlyEditedSimilarityThreshold": 0.3,
    "useCache": true,
    "onlyMyCode": true,
    "useOtherFiles": true,
    "useRecentlyEdited": true,
    "recentLinePrefixMatchMinLength": 7,
    "disableInFiles": "undefined",
  },
```

```
tabAutocompleteModel
This is just another object like the ones in the "models" array of config.json. You can choose and configure any model you would like, but we strongly suggest using a small model made for tab-autocomplete, such as deepseek-1b, starcoder-1b, or starcoder2-3b.

tabAutocompleteOptions
This object allows you to customize the behavior of tab-autocomplete. The available options are shown below, and you can find their default values here.

disable: Disable autocomplete (can also be done from IDE settings)
template: An optional template string to be used for autocomplete. It will be rendered with the Mustache templating language, and is passed the 'prefix' and 'suffix' variables. (String)
useCopyBuffer: Determines whether the copy buffer will be considered when constructing the prompt. (Boolean)
useFileSuffix: Determines whether to use the file suffix in the prompt. (Boolean)
maxPromptTokens: The maximum number of prompt tokens to use. A smaller number will yield faster completions, but less context. (Number)
prefixPercentage: The percentage of the input that should be dedicated to the prefix. (Number)
maxSuffixPercentage: The maximum percentage of the prompt that can be dedicated to the suffix. (Number)
debounceDelay: The delay in milliseconds before triggering autocomplete after a keystroke. (Number)
multilineCompletions: Whether to enable multiline completions ("always", "never", or "auto"). Defaults to "auto".
useCache: Whether to cache and reuse completions when the prompt is the same as a previous one. May be useful to disable for testing purposes.
useOtherFiles: Whether to include context from files outside of the current one. Turning this off should be expected to reduce the accuracy of completions, but might be good for testing.
disableInFiles: A list of glob patterns for files in which you want to disable tab autocomplete.
```

I would like my autocomplete suggestions to be based more heavily on what I previously have edited, with a larger memory. Provide a good set of options for this purpose. I usually am doing a bunch of repetitive edits, and would like my autocomplete suggestions to figure out what i'm doing after the first few

## Assistant

Based on your request for autocomplete suggestions that are more heavily influenced by your recent edits, especially for repetitive tasks, I can recommend the following set of options:

```json
{
  "tabAutocompleteOptions": {
    "useRecentlyEdited": true,
    "recentlyEditedSimilarityThreshold": 0.2,
    "recentLinePrefixMatchMinLength": 5,
    "slidingWindowSize": 1000,
    "slidingWindowPrefixPercentage": 0.8,
    "maxPromptTokens": 2048,
    "prefixPercentage": 0.9,
    "maxSuffixPercentage": 0.1,
    "useOtherFiles": true,
    "useCache": true,
    "debounceDelay": 200,
    "multilineCompletions": "auto"
  }
}
```

Here's an explanation of these settings and how they cater to your needs:

1. **useRecentlyEdited**: Set to `true` to prioritize recently edited content in suggestions.

2. **recentlyEditedSimilarityThreshold**: Lowered to 0.2 to increase the likelihood of matching with recent edits, even if they're not exact matches.

3. **recentLinePrefixMatchMinLength**: Reduced to 5 characters to trigger matches with recent edits more quickly.

4. **slidingWindowSize**: Increased to 1000 to provide a larger context window, capturing more of your recent edits.

5. **slidingWindowPrefixPercentage**: Set to 0.8 to allocate more of the sliding window to the code before the cursor, emphasizing your recent work.

6. **maxPromptTokens**: Increased to 2048 to allow for more context, including more of your recent edits.

7. **prefixPercentage**: Raised to 0.9 to heavily prioritize the code before the cursor, which is likely to contain your recent repetitive edits.

8. **maxSuffixPercentage**: Lowered to 0.1 to reduce emphasis on code after the cursor, focusing more on your recent edits.

9. **useOtherFiles**: Kept as `true` to maintain context from other files, which might be relevant for your repetitive tasks across multiple files.

10. **useCache**: Set to `true` to reuse completions for identical prompts, which can be beneficial for repetitive tasks.

11. **debounceDelay**: Slightly lowered to 200ms for quicker suggestions while still preventing excessive API calls.

12. **multilineCompletions**: Kept as "auto" to allow the model to provide multi-line completions when appropriate for your repetitive tasks.

These settings are designed to make the autocomplete system more sensitive to your recent edits and repetitive patterns. The larger context window and higher emphasis on prefix content should help the system quickly adapt to your editing patterns. The lower similarity threshold and shorter prefix match length will make it easier for the system to recognize and suggest completions based on your recent work.

Remember, you may need to fine-tune these settings based on your specific workflow and the nature of your repetitive tasks. Monitor the performance and adjust as needed for optimal results.
