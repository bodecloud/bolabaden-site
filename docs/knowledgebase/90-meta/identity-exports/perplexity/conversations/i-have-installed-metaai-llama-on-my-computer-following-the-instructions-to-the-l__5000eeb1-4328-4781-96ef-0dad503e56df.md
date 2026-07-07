---
source_url: "https://www.perplexity.ai/search/0b602334-ecec-4ca9-8f17-e6f7a4565030"
thread_uuid: "5000eeb1-4328-4781-96ef-0dad503e56df"
slug: "0b602334-ecec-4ca9-8f17-e6f7a4565030"
title: "I have installed metaai llama on my computer following the instructions to the .llama folder. How can I add/use it with openllama, which is defaulting to an .ollama folder?"
extracted_at: "2026-06-29T16:21:55.454Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# I have installed metaai llama on my computer following the instructions to the .llama folder. How can I add/use it with openllama, which is defaulting to an .ollama folder?

Source: [Perplexity thread](https://www.perplexity.ai/search/0b602334-ecec-4ca9-8f17-e6f7a4565030)

## User

I have installed metaai llama on my computer following the instructions to the .llama folder. How can I add/use it with openllama, which is defaulting to an .ollama folder?

## Assistant

To use the Meta AI Llama model with OpenLLaMA, which defaults to using the .ollama folder, you'll need to modify some settings. Here's how you can do it:

1. Change the default model directory for OpenLLaMA:

OpenLLaMA uses an environment variable called OLLAMA_MODELS to specify the location of model files. You can set this variable to point to your .llama folder where you installed the Meta AI Llama model.[1][2]

## Setting the Environment Variable

On Windows:
1. Open the Start menu and search for "Environment Variables"
2. Click on "Edit the system environment variables"
3. In the System Properties window, click on "Environment Variables"
4. Under "System variables", click "New"
5. Set the Variable name as "OLLAMA_MODELS" (in uppercase)
6. Set the Variable value as the path to your .llama folder (e.g., C:\Users\YourUsername\.llama)
7. Click "OK" to save

On macOS or Linux:
1. Open your terminal
2. Add the following line to your shell configuration file (.bashrc, .zshrc, etc.):
   ```bash
   export OLLAMA_MODELS=/path/to/your/.llama/folder
   ```
3. Save the file and restart your terminal or run `source ~/.bashrc` (or relevant config file)

## Restarting the Ollama Server

After setting the environment variable, you need to restart the Ollama server for the changes to take effect:[1]

1. Stop the current Ollama server (if running)
2. Wait for about 30 seconds
3. Start the Ollama server again

## Verifying the Change

To verify that OpenLLaMA is now using the correct folder:

1. Open a terminal or command prompt
2. Run `ollama list` to see if your Meta AI Llama model is now visible

If you encounter any issues, make sure that:
- The environment variable is set correctly
- The Ollama server has been restarted
- The model files in your .llama folder are compatible with OpenLLaMA

Remember that changing the default directory doesn't automatically move or copy existing models. If you had previously downloaded models to the .ollama folder, you might need to manually move them to the new location.[2]

By following these steps, you should be able to use your Meta AI Llama model with OpenLLaMA. If you continue to have problems, you may need to check the OpenLLaMA documentation or community forums for more specific troubleshooting steps.

### Sources

- [How To Change Ollama Model Default Directory To Save Your Hard ...](https://www.youtube.com/watch?v=uj1VnDPR9xo)
  - In this quick video, I will go through the steps how to change the default directory location when you download an Ollama model. 💻 Learn how to build an Ollama Desktop App : https://youtu.be/UwQ6MRGYsAg 💻 Learn how to build an Ollama Vision AI Desktop App: https://youtu.be/8cg9jQHhQuc 💖 Show Support ☕ Paypal: https://www.paypal.me/jiejenn/5 ☕ Venmo: @Jie-Jenn 🌳 Patreon: https://www.patreon.com/JieJenn (early access to tutorial source code) ✉️ Business Inquiring: YouTube@LearnDataAnalysis.org...
- [Set Ollama model directory in docker compose #836 - GitHub](https://github.com/open-webui/open-webui/discussions/836)
  - open-webuiPublic Notifications You must be signed in to change notification settings Fork 5.3k... # Set Ollama model directory in docker compose #836... ## Replies: 2 comments 4 replies... ### justinh-rahb Feb 21, 2024 Collaborator If you set that after having using Ollama with the default location, the models are not moved automatically, you'll need to do that. It could also be your drive formatting; I tried to do similar to you using an external drive, but because it was formatted with exFAT...
- [Open-Source Reproduction of Meta AI's LLaMA for Commercial Use ...](https://www.youtube.com/watch?v=1NOPciKuQb8)
  - In this video, we'll explore OpenLLaMA, an open-source reproduction of Meta AI's LLaMA large language model. We'll load the 7B model in a Google Colab notebook and run a couple of prompts with the HuggingFace Transformers weights. We'll also discuss a strategy for sampling that improves the generated responses. The creators of OpenLLaMA have released a public preview of the 7B model, trained with 200 billion tokens, and provide PyTorch and Jax weights of pre-trained OpenLLaMA models. They also...
- [Open LLaMA Configuration Settings | Restackio](https://www.restack.io/p/open-llama-answer-configuration-settings-cat-ai)
  - When creating your LLM configuration file, typically named llm_xx.yaml, you will need to define several key attributes: : This is the identifier for your LLM instance. Choose a name that reflects its purpose or functionality. name : Provide a brief description of the LLM, tailored to your specific use case. description : Specify the official name of the LLM model you are using, such as model_name gpt-3.5-turboor gpt-4o. Ensure that this matches the model you intend to deploy. : This parameter...
- [Llama 3.2: Revolutionizing edge AI and vision with open ... - AI at Meta](https://ai.meta.com/blog/llama-3-2-connect-2024-vision-edge-mobile-devices/)
  - Takeaways: We’ve been excited by the impact the Llama 3.1 herd of models have made in the two months since we announced them, including the 405B—the first open frontier-level AI model. While these models are incredibly powerful, we recognize that building with them requires significant compute resources and expertise. We’ve also heard from developers who don’t have access to these resources and still want the opportunity to build with Llama. As Meta Founder and CEO Mark Zuckerberg shared today...
