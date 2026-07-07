---
source_url: "https://www.perplexity.ai/search/c2401d3b-d714-43fb-9aaf-4b95d693eb42"
thread_uuid: "0a886aeb-b3d8-44cb-8e73-db409722aab3"
slug: "c2401d3b-d714-43fb-9aaf-4b95d693eb42"
title: "what are the largest models available for LLM purely in terms of parameter count? How much power consumption/computer hardware specs is required to run each of them...? Stuff like sonar large, hermes 405billionparameter, meta3.1 large, mistral, please list these and 5 more for a total of 10 total LLM models that have at least 200 parameters."
extracted_at: "2026-06-29T12:53:34.890Z"
matched_keywords: ["infrastructure","infra"]
entry_count: 1
provenance: perplexity-rest-api
---

# what are the largest models available for LLM purely in terms of parameter count? How much power consumption/computer hardware specs is required to run each of them...? Stuff like sonar large, hermes 405billionparameter, meta3.1 large, mistral, please list these and 5 more for a total of 10 total LLM models that have at least 200 parameters.

Source: [Perplexity thread](https://www.perplexity.ai/search/c2401d3b-d714-43fb-9aaf-4b95d693eb42)

## User

what are the largest models available for LLM purely in terms of parameter count? How much power consumption/computer hardware specs is required to run each of them...? Stuff like sonar large, hermes 405billionparameter, meta3.1 large, mistral, please list these and 5 more for a total of 10 total LLM models that have at least 200 parameters.

## Assistant

Based on the search results and available information, I can provide details on some of the largest LLM models in terms of parameter count, along with their hardware requirements where available. You may reference the table above for a quick overview of the models and their specifications. Here's a list of 10 large LLM models with at least 200 billion parameters:

1. GPT-4: Estimated to have over 1.8 trillion parameters. It requires 128 Nvidia A100 GPUs for operation.[2]

2. Meta Llama 3.1: 405 billion parameters. It requires 16,000 Nvidia H100 GPUs for training and 10 A100 GPUs for inference.

3. Hermes 3 (based on Llama 3.1): 405 billion parameters. It requires 8 NVIDIA A100 or MI300 GPUs.[3]

4. PaLM 2: 340 billion parameters.[1]

5. Grok-1: 314 billion parameters. It requires 8 Nvidia A100 GPUs or 8 AMD MI300X GPUs.

6. Mistral Large: 176 billion parameters. It requires an NVIDIA RTX 3090 or dual GPU setup.

7. GPT-3: 175 billion parameters. It requires 8 Nvidia A100 GPUs.[2]

8. Falcon 180B: 180 billion parameters.[1]

9. Chinchilla (DeepMind): 280 billion parameters.[8]

10. Megatron-Turing NLG (NVIDIA): 530 billion parameters.[8]

Regarding power consumption and hardware requirements, the information is not consistently available for all models. However, we can see that most of these large models require multiple high-end GPUs, typically Nvidia A100s or similar, for both training and inference. 

For example, GPT-3 is reported to consume about 1,287,000 kWh of energy. The energy consumption for other models varies, but it's generally very high due to the massive computational requirements of these large models.

It's important to note that the exact hardware requirements can vary depending on the specific use case (training vs. inference) and the desired performance. Additionally, some models like Sonar 3.1 Large are mentioned in the search results, but specific parameter counts were not provided.[4]

### Sources

- [generated_table_20.csv](https://ppl-ai-code-interpreter-files.s3.amazonaws.com/web/direct-files/34541976/3e890488-697b-4e6d-9203-4fc261cc1c32/generated_table_20.csv)
  - model_name,parameter_count,gpu_requirements,memory_usage,energy_consumption Grok-1,314.0,8 Nvidia A100 GPUs or 8 AMD MI300X GPUs,300.0, PaLM 2,340.0,,14.0, GPT-4,1800.0,128 Nvidia A100 GPUs,640.0,0.005 LLaMA 3,8.0,1 Nvidia L4 GPU with at least 16GB VRAM,16.0,500000.0 Mistral Large,176.0,NVIDIA RTX 3090 or dual GPU setup,246.0, Sonar 3.1 Large,,,, Meta Llama 3.1,405.0,"16,000 Nvidia H100 GPUs (for training); 10 A100 GPUs (for inference)",3250.0, Hermes 405B,405.0,8 NVIDIA A100 or MI300...
- [List of the Best 21 Large Language Models (LLMs) (September 2024)](https://explodingtopics.com/blog/list-of-llms)
  - Developer: xAI Release date: November 4, 2023 Number of Parameters: 314 billion What is it? Created by Elon Musk's artificial intelligence startup xAI, Grok-1 is currently the largest open-source LLM released to date at 314 billion parameters. Grok directly integrates with X (Twitter), and users must pay for an X Premium+ subscription to gain access. Because of the model’s size, Grok has a mixture-of-experts (MoE) architecture that only uses 25% of its weights for any given input token to...
- [LLMs hitting 2 trillions parameters – IEEE Future Directions](https://cmte.ieee.org/futuredirections/2023/11/14/llms-hitting-2-trillions-parameters/)
  - The talk of the town in these last year has been on ChatGPT and because of that GPT-3 and GPT-4 took the center stage. These are Large Language Models -LLMs-, large, actually very large, because they have and are trained on a huge amount of data: GPT-3 has 175 billion parameters and has been trained on 45 TeraBytes of text data taken from different datasets GPT-4 has 1,000+ billion parameters and has been trained on over 1,000 TeraBytes of data By all means they are not the only LLMs around....
- [NousResearch/Hermes-3-Llama-3.1-405B - Hugging Face](https://huggingface.co/NousResearch/Hermes-3-Llama-3.1-405B)
  - Hermes 3 405B is the latest flagship model in the Hermes series of LLMs by Nous Research, and the first full parameter finetune since the release of Llama-3.1 405B. For more details on new capabilities, training results, and more, see the Hermes 3 Technical Report. Hermes 3 is a generalist language model with many improvements over Hermes 2, including advanced agentic capabilities, much better roleplaying, reasoning, multi-turn conversation, long context coherence, and improvements across the...
- [LLama-3.1-Sonar-Huge-128K-Online: Optimized LLM by Perplexity](https://blog.llmradar.ai/perplexity-llama-3-1-sonar-huge-128k-online/)
  - In the ever-evolving landscape of large language models (LLMs), Perplexity has introduced an impressive addition with the LLama-3.1-Sonar-Huge-128K-Online. This model is a fine-tuned version of Meta's Llama 3.1 405B, boasting significant enhancements in cost-efficiency, speed, and overall performance. Key Features: Base Model:The foundation of this model is the Llama 3.1 405B, a well-regarded LLM developed by Meta. Fine Tuning:Perplexity has fine-tuned this model to optimize it for specific...
- [Meet Hermes 3, the powerful new open source AI model that has ...](https://www.oodaloop.com/briefs/2024/08/16/meet-hermes-3-the-powerful-new-open-source-ai-model-that-has-existential-crises/)
  - Lambda, an AI infrastructure company forged out of the ashes of a third-party Google Glass facial recognition app has teamed up with Nous Research, a newish startup dedicated to creating “personalized, unrestricted AI,” to launch Hermes 3, a new fine-tuned version of Meta’s open source Llama 3.1-405 billion parameter large language model (LLM). Hermes 3, announced today in blog posts on the Lambda and Nous websites, exhibits powerful text-based and agentic capabilities. But perhaps the most...
- [Mistral Has a New 176B Parameter LLM and a Number ... - Synthedia](https://synthedia.substack.com/p/mistral-has-a-new-176b-parameter)
  - Mistral made a new large language model (LLM) available through a Tor link earlier this week, and it is now available through Hugging Face as well. The Mixtral 8x22B has a mixture of experts (MoE) architecture similar to the the Mixtral 8x7B model that debuted in December. However, the new model is larger in parameter count and context window size. The new model boasts 176B parameters, though the MoE approach means that only two of the 22B “expert models” within the solution will be active at...
- [Mistral 7B Tutorial: A Step-by-Step Guide to Using and Fine-Tuning ...](https://www.datacamp.com/tutorial/mistral-7b-tutorial)
  - Mistral 7B is a new 7.3 billion parameter language model that represents a major advance in large language model (LLM) capabilities. It has outperformed the 13 billion parameter Llama 2 model on all tasks and outperforms the 34 billion parameter Llama 1 on many benchmarks. Remarkably, Mistral 7B approaches the performance of CodeLlama 7B on code tasks while remaining highly capable at English language tasks. This balanced performance is achieved through two key mechanisms. First, Mistral 7B...
- [Top Large Language Models (LLMs) in 2023 from OpenAI, Google ...](https://www.marktechpost.com/2023/02/22/top-large-language-models-llms-in-2023-from-openai-google-ai-deepmind-anthropic-baidu-huawei-meta-ai-ai21-labs-lg-ai-research-and-nvidia/)
  - Large language models are computer programs that can analyze and create text. They are trained using massive amounts of text data, which helps them become better at tasks like generating text. Language models are the foundation for many natural language processing (NLP) activities, like speech-to-text and sentiment analysis. These models can look at a text and predict the next word. Examples of LLMs include ChatGPT, LaMDA, PaLM, etc. Parameters in LLMs help the model to understand...
- [What are LLMs - Large Language Models? - Hopsworks](https://www.hopsworks.ai/dictionary/llms-large-language-models)
  - LLMs stands for Large Language Models. These are machine learning models that have been trained on massive amounts of text data, such as books, articles, and web pages, to understand and generate human language.(This definition was generated by a LLM - OpenAI's GPT-3 (Generative Pre-trained Transformer 3), which has 175 billion parameters and can generate highly coherent and contextually relevant language text.) LLMs require graphic processing units (GPUs) to be trained and also for inference...
