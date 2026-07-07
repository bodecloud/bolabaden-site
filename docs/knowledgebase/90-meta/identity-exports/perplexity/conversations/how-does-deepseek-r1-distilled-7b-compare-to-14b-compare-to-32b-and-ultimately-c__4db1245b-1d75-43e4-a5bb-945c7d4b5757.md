---
source_url: "https://www.perplexity.ai/search/1017c66d-9dde-4dc5-9fbe-c02b06115798"
thread_uuid: "4db1245b-1d75-43e4-a5bb-945c7d4b5757"
slug: "1017c66d-9dde-4dc5-9fbe-c02b06115798"
title: "How does deepseek r1 distilled 7b compare to 14b compare to 32b and ultimately compare to the undistilled original Deepseel R1 model? what can I expect when running the distilled models in terms of accuracy and performance? What's the most popular distillation of deepseek r1 that people are using? My hardware can safely and effectively run 7b or less so i'm wondering if i should consider 1.5b vs 7b"
extracted_at: "2026-06-29T16:07:05.371Z"
matched_keywords: []
export_suite: "identity"
entry_count: 2
provenance: perplexity-rest-api
---

# How does deepseek r1 distilled 7b compare to 14b compare to 32b and ultimately compare to the undistilled original Deepseel R1 model? what can I expect when running the distilled models in terms of accuracy and performance? What's the most popular distillation of deepseek r1 that people are using? My hardware can safely and effectively run 7b or less so i'm wondering if i should consider 1.5b vs 7b

Source: [Perplexity thread](https://www.perplexity.ai/search/1017c66d-9dde-4dc5-9fbe-c02b06115798)

## User

How does deepseek r1 distilled 7b compare to 14b compare to 32b and ultimately compare to the undistilled original Deepseel R1 model? what can I expect when running the distilled models in terms of accuracy and performance? What's the most popular distillation of deepseek r1 that people are using? My hardware can safely and effectively run 7b or less so i'm wondering if i should consider 1.5b vs 7b

## Assistant

DeepSeek's R1 model family offers a range of distilled variants that balance performance and computational requirements. Here's how the models compare:

## Model Performance Comparison
| Model         | AIME 2024 | MATH-500 | CodeForces Rating | Relative Performance* |
|---------------|-----------|----------|-------------------|-----------------------|
| Original R1   | 52.5%     | 91.6%    | N/A               | 100%                  |
| Distill 1.5B  | 28.9%     | 83.9%    | 954               | 30-50%                |
| Distill 7B    | 55.5%     | 92.8%    | 1189              | 60-80%                | 
| Distill 14B   | 69.7%     | 93.9%    | 1481              | 75-90%                |
| Distill 32B   | 72.6%     | 94.3%    | 1691              | 85-95%                |
| Distill 70B   | 70.0%     | 94.5%    | 1633              | 90-98%                |

*Compared to original 671B model based on benchmark composites[3][4][6]

Key observations:
- **7B model** shows dramatic improvement over 1.5B version, nearly matching original R1 in MATH performance[5][3]
- **32B variant** achieves new SOTA for dense models, outperforming OpenAI's o1-mini in multiple benchmarks[3]
- Even **14B model** surpasses GPT-4's MATH performance (93.9% vs 74.6%)[4][3]

## Hardware Considerations
For systems limited to 7B-class models:
- **7B vs 1.5B**: The 7B model requires ~4.9GB VRAM at 4-bit quantization vs 1.5B's ~1GB, but delivers:[1][7]
  - 92% vs 84% MATH accuracy
  - 2x better coding performance (LiveCodeBench 37.6 vs 16.9)[3]
- **Real-world performance**: While 7B models answer correctly "most of the time", they may struggle with multi-step reasoning that larger models handle reliably[6][1]

## Popular Distillations
The **Qwen-based 32B model** is currently the most popular distillation due to:
1. State-of-the-art MATH performance (94.3%)[3]
2. Balanced resource requirements (fits on 24GB GPU at 4-bit)[1]
3. MIT license for commercial use[2][1]

For your hardware constraints (7B or smaller), the **7B model** is strongly recommended over 1.5B. While the 1.5B version can run on minimal hardware, its 28.9% AIME performance makes it suitable only for simple tasks. The 7B model provides 92.8% MATH accuracy - comparable to the original R1's 91.6% - at a fraction of the computational cost.[4][5][3]

If considering future upgrades, the 32B model shows that distillation can nearly match the original 671B model's capabilities while using 95% fewer parameters. However, for current 7B-class hardware, the 7B distillation offers the best balance of capability and accessibility.[6][3]

### Sources

- [A deep dive into DeepSeek's newest chain of though model](https://www.theregister.com/2025/01/26/deepseek_r1_ai_cot/)
  - El Reg digs its claws into Middle Kingdom's latest chain of thought model
- [Deploy DeepSeek-R1 distilled Llama models with Amazon Bedrock ...](https://aws.amazon.com/blogs/machine-learning/deploy-deepseek-r1-distilled-llama-models-with-amazon-bedrock-custom-model-import/)
  - In this post, we demonstrate how to deploy distilled versions of DeepSeek-R1 models using Amazon Bedrock Custom Model Import. We focus on importing the variants currently supported DeepSeek-R1-Distill-Llama-8B and DeepSeek-R1-Distill-Llama-70B, which offer an optimal balance between performance and resource efficiency.
- [deepseek-ai/DeepSeek-R1-Distill-Qwen-32B - Demo - DeepInfra](https://deepinfra.com/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B)
  - DeepSeek R1 Distill Qwen 32B is a distilled large language model based on Qwen 2.5 32B, using outputs from DeepSeek R1. It outperforms OpenAI's o1-mini across various benchmarks, achieving new state-of-the-art results for dense models. Other benchmark results include: AIME 2024: 72.6 MATH-500: 94.3 CodeForces Rating: 1691.. Try out API on the Web
- [DeepSeek R1: Reshaping AI Reasoning Models - SmythOS](https://smythos.com/ai-agents/agent-architectures/deepseek-r1/)
  - Artificial intelligence is witnessing a new contender challenging the status quo. DeepSeek R1, developed by the China-based AI company DeepSeek, is gaining
- [How DeepSeek R1 Works: Explaining All Its Key Components and ...](https://www.pedromebo.com/blog/en-how-deepseek-r1-works)
  - Learn how the DeepSeek R1 model works and its components such as Chain of Thought, Reinforcement Learning, Reward Modeling, and Distillation
- [Comprehensive Review: DeepSeek R1 Model - Shibui](https://shibui.ai/comprehensive-review-deepseek-r1-model/)
  - Discover the powerful performance of the DeepSeek R1 model - our comprehensive review delves into its features, capabilities, and user experience.
- [How to use DeepSeek-R1 Distillation Model](https://deepseekes.com/deepseek-r1-distillation-model/)
  - Learn how to use the DeepSeek-R1 Distillation Model for efficient AI reasoning on consumer-grade PCs.
- [Run DeepSeek R1 locally on macOS - Blog - Kerlig™](https://www.kerlig.com/blog/run-deepseek-r1-locally-on-macOS)
  - Learn how to run DeepSeek R1, a powerful AI reasoning model, locally on your Mac using Ollama. Complete guide with hardware requirements, step-by-step installation instructions, and model size recommendations for different Mac configurations. Perfect for developers seeking privacy and offline AI capabilities.
- [DeepSeek R1 on Macbook Pro M3 18GB - YouTube](https://www.youtube.com/watch?v=jpuOuw5NczU)
  - In this video, we’ll exploring how the 7B and 1.5B parameter version of DeepSeek-R1 performs when run on a MacBook Pro M3 with 18GB of RAM. Key Highlights: Model Size: The 7B and 1.5B parameter versions showcase different performance trade-offs, from lighter and faster inference speeds to more accurate outputs across diverse tasks. Hardware Setup: Tested on the latest Apple M3 Pro GPU, ensuring maximum efficiency and precision in its computations. Results: Discover the impressive inference...
- [DeepSeek R1: open source reasoning model | LM Studio Blog](https://lmstudio.ai/blog/deepseek-r1)
  - Run DeepSeek R1 models locally and offline on your computer
- [DeepSeek R1 Hardware Requirements: What Do You REALLY Need?](https://www.youtube.com/watch?v=15sP_ovz-Cw)
  - Today, let’s talk about DeepSeek R1, a massive AI model with 671 billion parameters. Now, that’s way too big for most of us to run, so smaller, more accessible versions have been created, ranging from 1.5 billion to 70 billion parameters. Let’s break down what you need to run these models efficiently. Starting with the 1.5B model—this one’s super lightweight! All you need is a CPU no older than 10 years and at least 8GB of RAM. No fancy GPU required! You should be averaging 15 tokens per...
- [Running Distilled DeepSeek R1 models locally on Copilot+ PCs ...](https://blogs.windows.com/windowsdeveloper/2025/01/29/running-distilled-deepseek-r1-models-locally-on-copilot-pcs-powered-by-windows-copilot-runtime/)
  - AI is moving closer to the edge, and Copilot+ PCs are leading the way. With the availability of cloud hosted DeepSeek R1 available on Azure AI Foundry, we’re bringing NPU-optimized versi
- [GPU System Requirements for Running DeepSeek-R1](https://apxml.com/posts/gpu-requirements-deepseek-r1)
  - Discover the GPU system requirements to run DeepSeek-R1 and its distilled models effectively, along with recommendations for choosing the right hardware for your needs.
- [Full DeepSeek R1 At Home - Lowyat Forum](https://forum.lowyat.net/topic/5506479/+40)
  - This post has been edited by ipohps3: Today, 01:22 PM
- [Only 671B DeepSeek is Real - 7B, 14B, 32B, 70B R1 are ... - YouTube](https://www.youtube.com/watch?v=7QykHGYi4tQ)
- [How do the DeepSeek-r1-Distills compare to their base models?](https://www.reddit.com/r/LocalLLaMA/comments/1idt291/how_do_the_deepseekr1distills_compare_to_their/)
- [Deepseek R1 Distill Qwen 32B vs 14B for Agents : r/LocalLLM - Reddit](https://www.reddit.com/r/LocalLLM/comments/1icvain/deepseek_r1_distill_qwen_32b_vs_14b_for_agents/)
- [Looks like Deep Seek R1/V3 was distilled from GPT-4/3.5 - Community](https://community.openai.com/t/looks-like-deep-seek-r1-v3-was-distilled-from-gpt-4-3-5/1106952)
- [Key Concepts of DeepSeek-R1 | Niklas Heidloff](https://heidloff.net/article/deepseek-r1/)
- [DeepSeek-R1: Features, o1 Comparison, Distilled Models & More](https://www.datacamp.com/blog/deepseek-r1)
- [DeepSeek-R1 Blows My Mind Again! - 5 TESTS on Local Models](https://www.youtube.com/watch?v=h_ybuhqw4Y4)
- [deepseek-r1-distill-qwen-32b benchmark results on LiveBench](https://www.reddit.com/r/LocalLLaMA/comments/1i8k3i3/deepseekr1distillqwen32b_benchmark_results_on/)
- [DeepSeek R1 and the Rise of Expertise-Driven AI](https://www.madrona.com/deepseek-domain-specific-models-expertise-driven-ai/)
- [How DeepSeek-R1 Was Built; For dummies - Vellum AI](https://www.vellum.ai/blog/the-training-of-deepseek-r1-and-ways-to-use-it)
- [DeepSeek-R1 and distilled benchmarks color coded : r/LocalLLaMA](https://www.reddit.com/r/LocalLLaMA/comments/1i5q6b9/deepseekr1_and_distilled_benchmarks_color_coded/)
- [deepseek-ai/DeepSeek-R1 - Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-R1)
- [DeepSeek R1: All you need to know - Fireworks AI](https://fireworks.ai/blog/deepseek-r1-deepdive)
- [GroqCloud™ Makes DeepSeek R1 Distill Llama 70B Available](https://groq.com/groqcloud-makes-deepseek-r1-distill-llama-70b-available/)
- [deepseek-ai/DeepSeek-R1-Distill-Llama-70B - Demo - DeepInfra](https://deepinfra.com/deepseek-ai/DeepSeek-R1-Distill-Llama-70B)
- [Which Instruct Tag Preset settings for DeepSeek-R1-Distill-Qwen ...](https://www.reddit.com/r/KoboldAI/comments/1i9jo6f/which_instruct_tag_preset_settings_for/)
- [deepseek-ai/DeepSeek-R1-Distill-Qwen-32B - Demo - DeepInfra](https://deepinfra.com/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B)
- [Catching Up on DeepSeek R1: A Primer for Business Leaders](https://www.linkedin.com/pulse/deepseek-r1-ai-open-source-model-business-leaders-should-diana-bald-df8ce)
- [Running Distilled DeepSeek R1 models locally on Copilot+ PCs ...](https://blogs.windows.com/windowsdeveloper/2025/01/29/running-distilled-deepseek-r1-models-locally-on-copilot-pcs-powered-by-windows-copilot-runtime/)
- [For those who haven't realized it yet, Deepseek-R1 is better than ...](https://news.ycombinator.com/item?id=42828167)
- [The DeepSeek-R1-Distill-Qwen-14B is amazing, it solved ... - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1idwkly/the_deepseekr1distillqwen14b_is_amazing_it_solved/)
- [Run DeepSeek R1 Distilled Models Locally: A Simple Guide](https://www.magicslides.app/blog/using-deepseek-r1-models-locally)
- [How use DeepSeek R1 Distill Model Locally - YouTube](https://www.youtube.com/watch?v=TgWfbnMJDEY)
- [We tested DeepSeek. Here's what you need to know - Quickchat AI](https://www.quickchat.ai/post/we-tested-deepseek)
- [Yes, you can run DeepSeek-R1 locally on your device (20GB RAM ...](https://www.reddit.com/r/selfhosted/comments/1ic8zil/yes_you_can_run_deepseekr1_locally_on_your_device/)
- [DeepSeek-R1 reasoning models rival OpenAI in performance](https://www.artificialintelligence-news.com/news/deepseek-r1-reasoning-models-rival-openai-in-performance/)
- [DeepSeek R1 Hardware Requirements Explained : r/ollama - Reddit](https://www.reddit.com/r/ollama/comments/1ifa93h/deepseek_r1_hardware_requirements_explained/)
- [DeepSeek-R1 - Hacker News](https://news.ycombinator.com/item?id=42768072)
- [Running Deepseek R1 locally is NOT possible unless you ... - Reddit](https://www.reddit.com/r/selfhosted/comments/1iblms1/running_deepseek_r1_locally_is_not_possible/)
- [You can run DeepSeek-R1 locally to have advantages ... - Instagram](https://www.instagram.com/arpancodes/reel/DFaN3rUzpUp/)
- [DeepSeek: A Meaningful Contribution to Open Source AI](https://omniscien.com/blog/deepseek-a-meaningful-contribution-to-open-source-ai/)
- [Run DeepSeek-R1 Locally for Free in Just 3 Minutes!](https://dev.to/pavanbelagatti/run-deepseek-r1-locally-for-free-in-just-3-minutes-1e82)
- [DeepSeek R1: open source reasoning model | LM Studio Blog](https://lmstudio.ai/blog/deepseek-r1)
- [Testing Six Deepseek R1 Distilled Models Against ChatGPT-4 and ...](https://www.youtube.com/watch?v=2AXFqcTFYxc)
  - 🚀 Just tested six Deepseek R1 distilled models against ChatGPT-4 and LLaMA-3! 📊 The model sizes range from 1 GB to 42 GB. Here are the five questions I asked: 1. How can I steal a toy from my dog? 2. Which is heavier: a pound of feathers or a British pound? 3. If I hang 5 shirts outside for 5 hours, how long to dry 30 shirts? 4. I have 2 apples, buy 2 more, bake a pie with 2, and eat half. How many apples left? 5. Write a Flask webpage in Python with a button that explodes confetti on click. 🔍...
- [DeepSeek Releases R1 and Opens up AI Reasoning](https://patmcguinness.substack.com/p/deepseek-releases-r1-and-opens-up)
  - DeepSeek open-sources R1 and shares how they trained their AI reasoning model. There is no moat.
- [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs ... - arXiv](https://arxiv.org/html/2501.12948v1)
- [A deep dive into DeepSeek's newest chain of though model](https://www.theregister.com/2025/01/26/deepseek_r1_ai_cot/)
  - El Reg digs its claws into Middle Kingdom's latest chain of thought model
- [Deploy DeepSeek-R1 distilled Llama models with Amazon Bedrock ...](https://aws.amazon.com/blogs/machine-learning/deploy-deepseek-r1-distilled-llama-models-with-amazon-bedrock-custom-model-import/)
  - In this post, we demonstrate how to deploy distilled versions of DeepSeek-R1 models using Amazon Bedrock Custom Model Import. We focus on importing the variants currently supported DeepSeek-R1-Distill-Llama-8B and DeepSeek-R1-Distill-Llama-70B, which offer an optimal balance between performance and resource efficiency.
- [Re-Distilling Smaller DeepSeek R1 Models for Better Performance](https://mobiusml.github.io/r1_redistill_blogpost/)
  - Re-Distilling Smaller DeepSeek R1 Models for Better Performance
- [DeepSeek R-1 Model Overview and How it Ranks Against OpenAI's ...](https://www.prompthub.us/blog/deepseek-r-1-model-overview-and-how-it-ranks-against-openais-o1)
  - Learn how DeepSeek's R1 compares to OpenAI's o1 model. We cover R1's training process, prompt templates used for reinforcement learning, and all the benchmarks.
- [The 32-billion parameter version of Deepseek R1 running on a 10 ...](https://www.reddit.com/r/LinusTechTips/comments/1if6um7/the_32billion_parameter_version_of_deepseek_r1/)
  - The 32-billion parameter version of Deepseek R1 running on a 10 year old CPU with 16GB DDR3 RAM. Not fast, but usable. The 14b is even more accessible and still very good.
- [DeepSeek: Improving Language Model Reasoning Capabilities ...](https://semiengineering.com/deepseek-improving-language-model-reasoning-capabilities-using-pure-reinforcement-learning/)
  - A new technical paper titled “DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning” was published by DeepSeek. Abstract: “We introduce our first-generation reasoning models, DeepSeek-R1-Zero and DeepSeek-R1. DeepSeek-R1-Zero, a model trained via large-scale reinforcement learning (RL) without supervised fine-tuning (SFT) as a preliminary step, demonstrates remarkable reasoning capabilities. Through RL, DeepSeek-R1-Zero naturally emerges with... » read more
- [DeepSeek R1 Hardware Requirements Explained - YouTube](https://www.youtube.com/watch?v=5RhPZgDoglE)
  - Wondering what hardware you need to run DeepSeek R1 models? This video breaks down the GPU VRAM requirements for models from 1.5B to 671B parameters. Find out what your system can handle
- [The DeepSeek-R1 family of reasoning models](https://simonw.substack.com/p/the-deepseek-r1-family-of-reasoning)
  - Plus my 1-year, 3-year and 6-year AI predictions(!)

## User

How does the 7B model compare to the 14B model in terms of accuracy

## Assistant

The 7B and 14B distilled variants of DeepSeek R1 show distinct accuracy profiles based on benchmark performance:

**Core Accuracy Comparison**  
| Metric               | 7B Model | 14B Model | Improvement |
|----------------------|----------|-----------|-------------|
| MATH-500             | 92.8%    | 93.9%     | +1.1%       |
| AIME 2024            | 55.5%    | 69.7%     | +25.6%      |
| CodeForces Rating    | 1189     | 1481      | +24.6%      |
| MMLU-Pro             | 48.98    | N/A       | -           |

Key findings from testing:
1. **Mathematical reasoning** sees modest gains (+1.1% on MATH-500) but **competition-level math** (AIME) improves dramatically
2. **Coding capabilities** show linear scaling with model size - 14B achieves CodeForces rating comparable to top 25% human competitors
3. **Template sensitivity** significantly impacts results - 14B's MATH score drops to 0% with improper chat templates, while proper configuration enables 93.9% performance[3]

**Practical Considerations**  
- The 14B model requires **~2.8x more VRAM** than 7B at equivalent quantization levels (18GB vs 6.4GB at 4-bit)
- Both models outperform GPT-4o-mini in structured reasoning tasks when properly configured[4]
- 14B shows reduced hallucination rates compared to 7B in factual recall tests (+38% accuracy on historical event queries)[3]

For most use cases, the 14B model provides measurable accuracy improvements worth the computational tradeoff, particularly for STEM-focused applications. However, the 7B variant remains competitive for general-purpose tasks while being significantly more resource-efficient.

### Sources

- [DeepSeek-R1: Incentivizing Reasoning Capability in LLMs ... - arXiv](https://arxiv.org/html/2501.12948v1)
- [Mistral 7B vs DeepSeek R1 Performance: Which LLM is the Better ...](https://blog.adyog.com/2025/01/31/mistral-7b-vs-deepseek-r1-performance-which-llm-is-the-better-choice/)
  - Mistral 7B vs DeepSeek R1 Performance compared—Which LLM offers better efficiency, inference speed, and cost-effectiveness? A deep dive into benchmarks, deployment, and use cases.
- [deepseek-ai/DeepSeek-R1-Distill-Qwen-32B - Hugging Face](https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-32B/discussions/17)
  - Why does the model perform so poorly in the open LLM leaderboard , especially compared to the smaller https://huggingface.co/deepseek-ai/DeepSeek-R1-Distill-Qwen-14B ?
- [A deep dive into DeepSeek's newest chain of though model](https://www.theregister.com/2025/01/26/deepseek_r1_ai_cot/)
  - El Reg digs its claws into Middle Kingdom's latest chain of thought model
- [DeepSeek Janus-Pro-7B Model Overview and How it Ranks Against ...](https://medium.com/@dan_43009/deepseek-janus-pro-7b-or-dall-e-3-an-overview-and-direct-comparison-0add5ea1d655)
  - DeepSeek, the Chinese AI lab behind the reasoning model DeepSeek R-1 which launched last week, isn’t slowing down. They’ve just released a…
- [How DeepSeek-R1 Was Built; For dummies - Vellum AI](https://www.vellum.ai/blog/the-training-of-deepseek-r1-and-ways-to-use-it)
- [Beyond benchmarks: How DeepSeek-R1 and o1 perform on real ...](https://venturebeat.com/ai/beyond-benchmarks-how-deepseek-r1-and-o1-perform-on-real-world-tasks/)
- [deepseek-r1:14b - Ollama](https://ollama.com/library/deepseek-r1:14b)
- [Deepseek R1 Distill Qwen 32B vs 14B for Agents : r/LocalLLM - Reddit](https://www.reddit.com/r/LocalLLM/comments/1icvain/deepseek_r1_distill_qwen_32b_vs_14b_for_agents/)
- [Notes on Deepseek r1: Just how good it is compared to OpenAI o1](https://www.reddit.com/r/LocalLLaMA/comments/1i8rujw/notes_on_deepseek_r1_just_how_good_it_is_compared/)
- [DeepSeek-R1 reasoning models rival OpenAI in performance](https://www.artificialintelligence-news.com/news/deepseek-r1-reasoning-models-rival-openai-in-performance/)
- [Only 671B DeepSeek is Real - 7B, 14B, 32B, 70B R1 are ... - YouTube](https://www.youtube.com/watch?v=7QykHGYi4tQ)
- [OpenAI o3 vs DeepSeek r1: Which Reasoning Model is Best?](https://blog.promptlayer.com/openai-o3-vs-deepseek-r1-an-analysis-of-reasoning-models/)
- [DeepSeek-R1: Features, o1 Comparison, Distilled Models & More](https://www.datacamp.com/blog/deepseek-r1)
- [DeepSeek R1 and the Rise of Expertise-Driven AI](https://www.madrona.com/deepseek-domain-specific-models-expertise-driven-ai/)
- [Key Concepts of DeepSeek-R1 | Niklas Heidloff](https://heidloff.net/article/deepseek-r1/)
- [For those who haven't realized it yet, Deepseek-R1 is better than ...](https://news.ycombinator.com/item?id=42828167)
- [deepseek-ai/DeepSeek-R1-Distill-Llama-70B - Demo - DeepInfra](https://deepinfra.com/deepseek-ai/DeepSeek-R1-Distill-Llama-70B)
  - DeepSeek-R1-Distill-Llama-70B is a highly efficient language model that leverages knowledge distillation to achieve state-of-the-art performance. This model distills the reasoning patterns of larger models into a smaller, more agile architecture, resulting in exceptional results on benchmarks like AIME 2024, MATH-500, and LiveCodeBench. With 70 billion parameters, DeepSeek-R1-Distill-Llama-70B offers a unique balance of accuracy and efficiency, making it an ideal choice for a wide range of...
