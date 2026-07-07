---
source_url: "https://www.perplexity.ai/search/8fe428b0-d566-481a-8767-cc4571a49c8c"
thread_uuid: "accd2a31-fbce-46b1-a27a-3f9432830a12"
slug: "8fe428b0-d566-481a-8767-cc4571a49c8c"
title: "what kinds of models can I run locally? I already have anaconda/ollama setup with starcoder. ollama seems to be hardcoded to only use my cpu though? i have a amd rx 460 gpu but anaconda keeps wanting to use cuda cores from nvidia?

Broadly, what are the parameters and what is the absolute best model I can run locally and what kind of performance can I expect out of it?

Where can I find research on how these models are currently being trained and how to train them myself, and/or the worthwhileness of even attempting to do something like that?

Is it recommended to run locally, or use a free api? Which one would give me a better result? 

There's just waaaaay too many models and waaay too little information. Please web search exhaustively until you make an expert out of me."
extracted_at: "2026-06-29T12:53:35.717Z"
matched_keywords: ["infrastructure","infra","vpn","docker","helm","self-hosted"]
entry_count: 1
provenance: perplexity-rest-api
---

# what kinds of models can I run locally? I already have anaconda/ollama setup with starcoder. ollama seems to be hardcoded to only use my cpu though? i have a amd rx 460 gpu but anaconda keeps wanting to use cuda cores from nvidia?

Broadly, what are the parameters and what is the absolute best model I can run locally and what kind of performance can I expect out of it?

Where can I find research on how these models are currently being trained and how to train them myself, and/or the worthwhileness of even attempting to do something like that?

Is it recommended to run locally, or use a free api? Which one would give me a better result? 

There's just waaaaay too many models and waaay too little information. Please web search exhaustively until you make an expert out of me.

Source: [Perplexity thread](https://www.perplexity.ai/search/8fe428b0-d566-481a-8767-cc4571a49c8c)

## User

what kinds of models can I run locally? I already have anaconda/ollama setup with starcoder. ollama seems to be hardcoded to only use my cpu though? i have a amd rx 460 gpu but anaconda keeps wanting to use cuda cores from nvidia?

Broadly, what are the parameters and what is the absolute best model I can run locally and what kind of performance can I expect out of it?

Where can I find research on how these models are currently being trained and how to train them myself, and/or the worthwhileness of even attempting to do something like that?

Is it recommended to run locally, or use a free api? Which one would give me a better result? 

There's just waaaaay too many models and waaay too little information. Please web search exhaustively until you make an expert out of me.

## Assistant

Based on the search results and your current setup, I can provide some insights on running language models locally and the considerations involved:

## Types of Models You Can Run Locally

You can run various open-source language models locally, including:

- Smaller versions of LLaMA and its derivatives (e.g. Alpaca, Vicuna)
- GPT-J and GPT-NeoX models
- BLOOM models
- Stable Diffusion (for image generation)
- CodeLLaMA and StarCoder (for code generation)

The exact models you can run depend on your hardware capabilities, particularly GPU memory.

## Hardware Considerations

Your AMD RX 460 GPU has limited support for AI workloads compared to NVIDIA GPUs. Most deep learning frameworks and models are optimized for CUDA, which is NVIDIA's parallel computing platform. This is why Anaconda is looking for CUDA cores.

For optimal performance with your current setup:

1. Utilize CPU-based inference, which Ollama is currently doing.
2. Consider upgrading to an NVIDIA GPU if you want to leverage GPU acceleration for larger models.

## Best Model for Local Running

The "best" model depends on your specific use case and hardware constraints. Given your current setup:

- For general text generation: A quantized version of LLaMA-2 7B or Mistral 7B could work well.
- For code generation: StarCoder, which you're already using, is a good choice.

Performance will vary, but expect slower inference times compared to cloud-based solutions, especially for larger models.

## Model Training and Research

Training large language models from scratch requires significant computational resources and expertise. For most individuals and small teams, it's not practical or cost-effective. However, you can explore:[1]

1. Fine-tuning existing models on domain-specific data
2. Experimenting with smaller models or specific components of larger architectures

For research on model training:

- ArXiv (arxiv.org) for academic papers on language model architectures and training techniques
- Hugging Face's documentation and blog posts for practical guides
- GitHub repositories of open-source models for implementation details

## Local vs. API: Pros and Cons

### Running Locally:

Pros:
- More control over the model and data
- No usage limits or API costs
- Lower latency for some applications
- Better privacy, as data doesn't leave your machine[3]

Cons:
- Limited by your hardware capabilities
- Requires more technical setup and maintenance
- May not have access to the latest, largest models

### Using a Free API:

Pros:
- Access to more powerful models (e.g., GPT-3.5, GPT-4)
- No local hardware requirements
- Regular updates and improvements

Cons:
- Usage limits on free tiers
- Potential privacy concerns with data leaving your machine
- Dependence on third-party service availability

## Recommendations

1. For experimentation and learning: Start with running models locally. This gives you hands-on experience with the technology.

2. For production use: Consider a hybrid approach. Use local models for less demanding tasks and APIs for more complex queries or when you need the latest large-scale models.

3. For your current setup: Focus on CPU-optimized models or consider cloud GPU instances for more demanding workloads until you can upgrade your local GPU.

4. Stay updated: The field is rapidly evolving. Regularly check resources like Hugging Face, GitHub, and AI research publications for the latest developments in model architectures and training techniques.

Remember, the "best" solution depends on your specific use case, performance requirements, and resource constraints. Experimenting with different approaches will help you find the optimal setup for your needs.

### Sources

- [Large Language Model Training - Research AIMultiple](https://research.aimultiple.com/large-language-model-training/)
  - There are four steps to training large language models: The first step is to gather the training data set. The data can come from various sources such as documents, websites, articles, etc. The biggest advantage of a custom model is that it leverages internal company data, therefore preparing high-quality proprietary data is the most important step. Once private data is prepared, it can be enriched with public data in adjacent domains. Popular public sources to find datasets are: Kaggle Google...
- [OpenAI vs Self Hosted LLMs: A Cost Analysis - ScaleDown](https://tinyml.substack.com/p/openai-vs-self-hosted-llms-a-cost)
  - Over the past few weeks, we have been experimenting with deploying an open-source LLM for our product, speakerscribe.com. The world of AI is vast, and while many are familiar with GPT, understanding the intricacies of its pricing and utilization can be daunting for those who aren’t neck-deep in the technicalities. That’s where our initiative began. While our OpenAI API costs are pretty low, we wondered if a self-hosted LLM could be more economical. We were even toying with a tiered offering,...
- [Five Reasons to Run AI Models Locally - Odyssey](https://odysseyapp.io/blog/five-reasons-to-run-ai-models-locally)
  - Aug 22, 2024 5 min read There are two primary ways to run generative AI models: through the cloud or locally on your computer. Cloud-based models use an API, or some sort of UI like ChatGPT to take a prompt, your settings, and generate an image, text, video, song, etc. These models leverage powerful GPUs that live in some far off data center. For most consumers, this is the most popular way to run AI models…for now. Models like GPT-4o, Midjourney, and RunwayML are so big and memory-intensive...
- [The Pros and Cons of Using LLMs in the Cloud Versus Running ...](https://www.datacamp.com/blog/the-pros-and-cons-of-using-llm-in-the-cloud-versus-running-llm-locally)
  - Of course, as with any technology, there are some downsides to using large language models in the cloud: When using cloud-managed ML service, you have less control and visibility over infrastructure and implementation. If you have trained LLMs on one cloud platform, it will be difficult to port to a different platform. Furthermore, depending solely on a single cloud provider entails inherent risks, particularly concerning policy and price fluctuations. Your data resides on the cloud provider's...
- [New localllm lets you develop gen AI apps locally, without GPUs](https://cloud.google.com/blog/products/application-development/new-localllm-lets-you-develop-gen-ai-apps-locally-without-gpus?hl=en)
  - By using a combination of “quantized models,” Cloud Workstations, a new open-source tool named localllm, and generally available resources, you can develop AI-based applications on a well-equipped development workstation, leveraging existing processes and workflows. Quantized models + Cloud Workstations == Productivity Quantized models are AI models that have been optimized to run on local devices with limited computational resources. These models are designed to be more efficient in terms of...
- [Best Language AI models to run locally? : r/artificial - Reddit](https://www.reddit.com/r/artificial/comments/107vn3t/best_language_ai_models_to_run_locally/)
  - Best Language AI models to run locally? I was curious as to if there are any Language AI models (like Chat GPT) that you can use locally on your own machine (so you don't run into as many server issues like you do on Chat GPT). If so, which are the best and where can you find them? The best one that I've tried is GPT-J. It's not as good at ChatGPT or Davinci, but models like that would be far too big to ever be run locally. GPT-J is also a few years old, so it isn't going to have info as...
- [6 Ways For Running A Local LLM (how to use HuggingFace)](https://semaphoreci.com/blog/local-llm)
  - Commercial AI and Large Language Models (LLMs) have one big drawback: privacy... ## 1. Hugging Face and Transformers Hugging Face is the Docker Hub equivalent for Machine Learning and AI, offering an overwhelming array of open-source models. Fortunately, Hugging Face regularly benchmarks the models and presents a leaderboard to help choose the best models available. Hugging Face also provides transformers, a Python library that streamlines running a LLM locally. The following example uses the...
- [The Case for Running AI/ML Models Locally | Dr. Ian O'Byrne](https://wiobyrne.com/running-models-locally/)
  - Running AI models “locally” means doing that heavy computing work right on your own personal computer, laptop, or even a small home server instead of those big cloud computers. Instead of going to a big restaurant to have your food cooked for you, you bring all the ingredients and cooking tools to your own kitchen at home to cook the meal yourself. You get more control over the whole process when you do it locally on your own machine. But it also means your computer has to work much harder...
- [Use Machine Learning models in your Windows app | Microsoft Learn](https://learn.microsoft.com/en-us/windows/ai/models)
  - The Windows Copilot Runtime knits together several ways of interacting with the operating system that utilize AI. This includes ready-to-use AI-backed features and APIs, which we call the Windows Copilot Library. See Get started using AI-backed APIs in your Windows app for guidance on these ready-to-use features and APIs that support some of the scenarios listed above. The Windows Copilot Library models run locally, directly on the Windows device, though you may also choose to use a...
- [How good are AMD GPUs at running Large Language Models ...](https://www.reddit.com/r/Amd/comments/1bxlp3r/how_good_are_amd_gpus_at_running_large_language/)
  - How good are AMD GPUs at running Large Language Models under Linux? I’ve recently been interested in using an offline LLM out of my own machine. I’ll do a hardware upgrade soon, so I would like to use an AMD GPU to run those models, due to NVIDIA and Linux not running well together. I run a 6900XT in a 5950x workstation using ooba's text-generation-web-ui. It has an OpenAI compatible API that I expose through a VPN in order to reach my LLMs from wherever.... I recommend you use the exllamaV2...
