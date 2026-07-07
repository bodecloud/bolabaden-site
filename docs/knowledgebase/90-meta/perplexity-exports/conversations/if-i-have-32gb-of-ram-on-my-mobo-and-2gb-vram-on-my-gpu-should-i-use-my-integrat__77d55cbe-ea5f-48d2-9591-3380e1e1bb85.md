---
source_url: "https://www.perplexity.ai/search/7510deaf-68a8-4fb5-ba7c-a0a91c84362a"
thread_uuid: "77d55cbe-ea5f-48d2-9591-3380e1e1bb85"
slug: "7510deaf-68a8-4fb5-ba7c-a0a91c84362a"
title: "If I have 32GB of ram on my mobo, and 2gb vram on my gpu, should I use my integrated iGPU so I can take full advantage of the 32GB of ram? Usually igpus are slow and not recommended, but in this scenario for running local Llm ai I’m wondering if the ram + iGPU is faster? Has anyone at least asked?"
extracted_at: "2026-06-29T12:53:17.540Z"
matched_keywords: ["infrastructure","infra","docker","self-hosted"]
entry_count: 5
provenance: perplexity-rest-api
---

# If I have 32GB of ram on my mobo, and 2gb vram on my gpu, should I use my integrated iGPU so I can take full advantage of the 32GB of ram? Usually igpus are slow and not recommended, but in this scenario for running local Llm ai I’m wondering if the ram + iGPU is faster? Has anyone at least asked?

Source: [Perplexity thread](https://www.perplexity.ai/search/7510deaf-68a8-4fb5-ba7c-a0a91c84362a)

## User

If I have 32GB of ram on my mobo, and 2gb vram on my gpu, should I use my integrated iGPU so I can take full advantage of the 32GB of ram? Usually igpus are slow and not recommended, but in this scenario for running local Llm ai I’m wondering if the ram + iGPU is faster? Has anyone at least asked?

## Assistant

While using an integrated GPU (iGPU) with access to 32GB of system RAM might seem appealing for running local LLM AI models, it's generally not recommended over a dedicated GPU, even with limited VRAM. Here's why:

## Performance Considerations

**Memory Bandwidth**: Integrated GPUs typically have significantly lower memory bandwidth compared to dedicated GPUs. This is crucial for LLM performance, as memory bandwidth often determines inference speed.[2][5]

**Computational Power**: iGPUs are generally less powerful than dedicated GPUs in terms of parallel processing capabilities, which are essential for AI workloads.[4][2]

## RAM vs. VRAM

**System RAM Speed**: While you have 32GB of system RAM, it's slower than dedicated VRAM. The memory bandwidth of system RAM is usually much lower than that of VRAM, which can significantly impact LLM performance.[1][5]

**VRAM Advantage**: Even 2GB of dedicated VRAM on a GPU can be more effective for certain AI tasks due to its higher bandwidth and closer integration with the GPU cores.[2]

## Practical Considerations

**Model Size Limitations**: With only 2GB of VRAM, you'll be limited to running smaller, heavily quantized models. Most consumer-grade LLMs require at least 4-5GB of VRAM for weights alone.[6]

**CPU Offloading**: Some LLM frameworks allow offloading parts of the model to system RAM, but this generally results in slower performance compared to keeping everything in VRAM.[6]

## Alternative Approaches

1. **Upgrade GPU**: If possible, consider upgrading to a GPU with more VRAM. Even older models like the NVIDIA Tesla P40 with 24GB VRAM are popular choices for running larger LLMs locally.[5]

2. **Quantization**: Use heavily quantized models to fit within your 2GB VRAM constraint, sacrificing some quality for better performance than using system RAM.[6]

3. **Specialized Solutions**: Look into projects like MLC-LLM, which aim to enable LLM deployment on various hardware configurations, including integrated GPUs.[5]

While some have asked about using iGPUs for AI tasks, especially with the advancements in integrated graphics, the consensus remains that dedicated GPUs are superior for LLM workloads due to their specialized architecture and higher memory bandwidth. The performance gain from using 32GB of slower system RAM with an iGPU is unlikely to outweigh the benefits of even a modest dedicated GPU for most LLM applications.[1][4]

### Sources

- [Gains from 16gb ram to 32gb ram worth it? Even more questions in ...](https://www.reddit.com/r/LocalLLaMA/comments/18z64sk/gains_from_16gb_ram_to_32gb_ram_worth_it_even/)
- [Integrated GPU vs Dedicated GPU - Microchip USA](https://www.microchipusa.com/electrical-components/integrated-gpu-vs-dedicated-gpu/)
  - Graphics processing units (GPUs) have become fundamental components in modern computing systems that power everything from basic image rendering to complex gaming environments and AI computations. When choosing a GPU, a primary consideration is whether to go with an integrated GPU or a dedicated GPU — each offers distinct advantages suited to different needs and…
- [Integrated vs Dedicated GPUs | Pure Storage Blog](https://blog.purestorage.com/purely-educational/integrated-vs-dedicated-gpus/)
  - Here, we are going to discuss Integrated vs Dedicated GPUs. Learn the differences and which to choose in this developing AI realm.
- [Why GPUs Are Great for AI - NVIDIA Blog](https://blogs.nvidia.com/blog/why-gpus-are-great-for-ai/)
  - Features in chips, systems and software make NVIDIA GPUs ideal for machine learning with performance and efficiency enjoyed by millions.
- [Intel's integrated UHD graphics can use system RAM as VRAM. Any ...](https://www.reddit.com/r/LocalLLaMA/comments/1331yhq/intels_integrated_uhd_graphics_can_use_system_ram/)
- [Ask HN: Which LLMs can run locally on most consumer computers](https://news.ycombinator.com/item?id=40424519)
- [Importance Of Ram In Ai Applications - GPU computing - Restack](https://www.restack.io/p/gpu-computing-answer-importance-of-ram-in-ai-cat-ai)
  - Explore how RAM impacts AI performance and efficiency in GPU computing, enhancing data processing and model training. Restackio
- [Re: How Can We use APUS for AI acceleration ? - AMD Community](https://community.amd.com/t5/ai-discussions/how-can-we-use-apus-for-ai-acceleration/m-p/642207)
  - Leveraging the integrated GPU within an APU (Accelerated Processing Unit) for AI acceleration in machine learning applications is a promising endeavor. To begin, ensure that your APU and its GPU are compatible with machine learning frameworks, allowing them to utilize GPU acceleration for AI tasks. ...
- [Buying a PC for local AI? These are the specs that actually matter](https://www.theregister.com/2024/08/25/ai_pc_buying_guide/)
  - If you guessed TOPS and FLOPS, that's only half right

## User

Will the iGPU previously mentioned perform faster at running Llm ai vs a cpu

## Assistant

Based on the search results, the performance of an iGPU versus a CPU for running LLM AI depends on several factors:

## Performance Comparison

**iGPU Advantages**:
- For APUs (Accelerated Processing Units), iGPUs are generally faster than CPUs for LLM tasks.[1]
- AMD's Strix Point APUs with RDNA 3.5 graphics architecture show promising performance for LLM applications, outperforming some Intel CPUs in certain tests.[2]

**CPU Advantages**:
- For non-APU systems, running on CPU only can be up to 5x faster than using the iGPU.[1]
- CPUs excel in tasks requiring sequential processing and have better memory bandwidth for applications needing substantial memory usage.[3]

## Factors Affecting Performance

1. **Memory Bandwidth**: iGPUs typically have lower memory bandwidth compared to dedicated GPUs, which can limit performance in memory-intensive LLM tasks.[3][1]

2. **Available RAM**: iGPUs often have limited access to system RAM. For example, some iGPUs can only use about half of the total system RAM.[1]

3. **Model Size**: Larger models may not fit within the iGPU's accessible memory, potentially causing performance issues.[1]

4. **Specific Hardware**: Performance can vary significantly between different iGPU and CPU models. For instance, AMD's Ryzen AI processors show competitive performance against some Intel CPUs in LLM tasks.[2]

## Real-world Examples

- On a Framework 13 AMD 7840u with 32GB RAM, running smaller quantized models (e.g., Llama 3 8B q8) was subjectively quicker on the iGPU compared to the CPU.[1]
- In a test with Meta Llama 3.2 1b Instruct, AMD's Ryzen AI 9 HX 375 (with iGPU) achieved up to 50.7 tokens per second compared to 39.9 tokens per second on an Intel CPU.[2]

In conclusion, while iGPUs can offer better performance for LLM AI in some scenarios, especially with newer APUs designed for AI workloads, the advantage is not universal. The specific hardware, model size, and memory requirements of the LLM task play crucial roles in determining whether the iGPU or CPU will perform faster.

### Sources

- [Running on iGPU vs CPU : r/LocalLLaMA - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1df4u5n/running_on_igpu_vs_cpu/)
- [AMD Ryzen AI beats Intel Lunar Lake by 27% in LLM performance](https://www.igorslab.de/en/amd-ryzen-ai-beats-intel-lunar-lake-by-27-in-llm-performance-with-impressive-npu-and-igpu-power/)
  - With the Strix Point APUs, AMD is launching a new processor line on the market that has been specially developed for AI-supported applications and LLMs (Large L
- [AI Rendering: GPU vs. CPU Performance - Aethir Ecosystem](https://blog.aethir.com/blog-posts/ai-rendering-gpu-vs-cpu-performance)
  - AI Rendering: GPU vs. CPU Performance Aethir
- [Running Local LLMs, CPU vs. GPU - a Quick Speed Test](https://dev.to/maximsaplin/running-local-llms-cpu-vs-gpu-a-quick-speed-test-2cjn/)
  - This is the 1st part of my investigations of local LLM inference speed. Here're the 2nd and 3rd...
- [GPU and CPU Performance LLM Benchmark Comparison with Ollama](https://www.youtube.com/watch?v=69Bd3TEiPnk)
  - In today’s video, we explore a detailed GPU and CPU performance comparison for large language model (LLM) benchmarks using the Ollama library. We put the RTX 3090, Tesla P40, and Tesla P100 GPUs to the test, alongside CPUs like the Mac M1, Xeon E5-2699 V4, and Ryzen 9 5950X, running across five unique prompts on each hardware setup and various GPU combinations. This benchmarking suite takes a deep dive into key performance metrics, offering critical insights for those interested in LLM...
- [GPU vs CPU for AI: A Detailed Comparison | TRG Datacenters](https://www.trgdatacenters.com/resource/gpu-vs-cpu-for-ai/)
  - Discover how GPUs and CPUs for AI can enhance your business. Learn effective strategies to unlock their potential and strengthen your AI infrastructure
- [CPU vs. GPU for Machine Learning - Pure Storage Blog](https://blog.purestorage.com/purely-educational/cpu-vs-gpu-for-machine-learning/)
  - This article compares CPU vs. GPU, as well as the applications for each with machine learning, neural networks, and deep learning.
- [iGPU Compute and LLMs on the AceMagic AM18 - Tao of Mac](https://taoofmac.com/space/blog/2024/04/13/2100)
  - As part of my forays into LLMs and GPU compute “on the small” I’ve been playing around with the AceMagic AM18 in a few unusual ways.
- [Balancing Cost and Performance: When to Opt for CPUs in AI ...](https://openmetal.io/resources/blog/balancing-cost-and-performance-when-to-opt-for-cpus-in-ai-applications/)
  - We explore scenarios where CPUs might gain an upper hand over GPUs in AI, focusing on cost, efficiency, and application-specific performance.
- [Compare GPUs vs. CPUs for AI workloads | TechTarget](https://www.techtarget.com/searchenterpriseai/feature/CPUs-vs-GPUs-for-AI-workloads)
  - GPUs offer parallel computing that benefits AI workloads. However, there are some upsides to CPUs as the use of AI in business and daily life grows.

## User

What are the benefits of using an eGPU for running LLMs on an iGPU

## Assistant

Using an external GPU (eGPU) for running large language models (LLMs) can offer several benefits compared to relying solely on an integrated GPU (iGPU). Here are the key advantages:

## Benefits of Using an eGPU

****Enhanced Performance****

- **Increased Computational Power**: eGPUs allow you to utilize high-performance desktop GPUs, which generally have far superior computational capabilities compared to iGPUs. This is crucial for handling the intensive calculations required by LLMs.

- **Higher VRAM Capacity**: eGPUs typically come with much larger VRAM compared to iGPUs. This additional memory can accommodate larger models and batch sizes, reducing the need to swap data between the GPU and system RAM, which can significantly speed up processing times.

****Flexibility and Upgradeability****

- **Modular Design**: An eGPU setup provides the flexibility to upgrade or switch out GPUs without needing to replace your entire system. This is particularly beneficial in a rapidly evolving hardware landscape where newer, more powerful GPUs are frequently released.

- **Cross-Device Compatibility**: eGPUs can be connected to various devices, allowing you to leverage a single powerful GPU across multiple systems, such as a laptop and a desktop.

****Thermal Management****

- **Dedicated Cooling Solutions**: eGPUs often come with their own enclosures equipped with better cooling systems than typical laptops. This can lead to improved thermal management during intensive tasks like training or running LLMs, resulting in better sustained performance and longevity of the hardware.

****Performance Over Bandwidth Limitations****

- **Acceptable Performance Loss**: Although there are bandwidth limitations when using Thunderbolt connections (typically offering less bandwidth than a direct PCIe connection), many users report that for inference tasks, the performance loss is minimal. For example, some setups have shown performance comparable to cloud configurations for LLM tasks despite these constraints.[1][2]

## Considerations

While there are clear benefits, it’s important to note that using an eGPU also comes with some challenges:

- **Bandwidth Bottlenecks**: The performance of an eGPU can be affected by the bandwidth limitations of the connection interface (e.g., Thunderbolt 3). This may impact tasks that require frequent data transfers between the CPU and GPU.

- **Cost and Complexity**: Setting up an eGPU can be more expensive and complex than using an iGPU directly. Users must consider the cost of both the eGPU enclosure and the GPU itself.

In summary, using an eGPU can significantly enhance your ability to run LLMs compared to relying solely on an iGPU. The combination of increased computational power, higher VRAM capacity, and better thermal management makes eGPUs a compelling choice for those looking to run demanding AI workloads locally.

### Sources

- [my experience using an external GPU (eGPU) for deep learning](https://www.tensorscience.com/posts/my-experience-using-an-external-gpu-egpu-for-deep-learning-2023)
  - My thoughts on using an eGPU for deep learning: exploring hardware, performance, cost, and cloud options
- [eGPU : r/LocalLLaMA - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/18o57uz/egpu/)
- [[Academic Tech] Surface Laptop Studio with an eGPU](https://peterfalkingham.com/2022/10/23/academic-tech-surface-laptop-studio-with-an-egpu-performance-and-review/)
  - My last post compared the raw performance of my new Surface Laptop Studio (SLS) against my old Desktop and my wife’s M1 Macbook Pro. The results were not particularly exhilarating to say the …
- [Best GPU for LLM Inference and Training – March 2024 [Updated]](https://bizon-tech.com/blog/best-gpu-llm-training-inference)
  - This article delves into the heart of this synergy between software and hardware, exploring the best GPUs for both the inference and training phases of LLMs, most popular open-source LLMs, the recommended GPUs/hardware for training and inference, and provide insights on how to run LLMs locally.
- [How to Run LLMs with LM Studio? - GPU Mart](https://www.gpu-mart.com/blog/run-llms-with-lm-studio)
  - This tutorial introduces what LM Studio is and shows you how to install and run LM Studio to chat with different models.
- [LLMs accelerated with eGPU on a Raspberry Pi 5 | Jeff Geerling](https://www.jeffgeerling.com/blog/2024/llms-accelerated-egpu-on-raspberry-pi-5)

## User

IGPU Llm performance compared to cpu

## Assistant

The performance of integrated GPUs (iGPUs) compared to CPUs for running Large Language Models (LLMs) varies depending on the specific hardware and model configurations. Here's a comparison based on the available information:

## Performance Comparison

**iGPU Advantages:**
- For some APUs (Accelerated Processing Units), iGPUs can be faster than CPUs for LLM tasks.[1]
- AMD's Strix Point APUs with RDNA 3.5 graphics architecture show promising performance for LLM applications, outperforming some Intel CPUs in certain tests.[10]

**CPU Advantages:**
- For non-APU systems, running on CPU only can be up to 5x faster than using the iGPU.[1]
- CPUs generally have better memory bandwidth, which is crucial for LLM performance.[3]

## Specific Performance Examples

- On a Framework 13 AMD 7840u with 32GB RAM, running smaller quantized models (e.g., Llama 3 8B q8) was subjectively quicker on the iGPU compared to the CPU.[1]
- In a test with Meta Llama 3.2 1b Instruct, AMD's Ryzen AI 9 HX 375 (with iGPU) achieved up to 50.7 tokens per second compared to 39.9 tokens per second on an Intel CPU.[10]
- For an i7-13700K, the iGPU was reported to be half the speed of the CPU for LLM tasks.[8]

## Factors Affecting Performance

1. **Memory Bandwidth:** iGPUs typically have lower memory bandwidth compared to dedicated GPUs, which can limit performance in memory-intensive LLM tasks.[3]

2. **Available RAM:** iGPUs often have limited access to system RAM. For example, some iGPUs can only use about half of the total system RAM.[1]

3. **Model Size:** Larger models may not fit within the iGPU's accessible memory, potentially causing performance issues.[1]

4. **Specific Hardware:** Performance can vary significantly between different iGPU and CPU models.[10]

In conclusion, while iGPUs can offer better performance for LLM AI in some scenarios, especially with newer APUs designed for AI workloads, the advantage is not universal. The specific hardware, model size, and memory requirements of the LLM task play crucial roles in determining whether the iGPU or CPU will perform faster.

### Sources

- [Running on iGPU vs CPU : r/LocalLLaMA - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1df4u5n/running_on_igpu_vs_cpu/)
- [CPU vs GPU for Running LLMs Locally - MarkTechPost](https://www.marktechpost.com/2024/03/23/cpu-vs-gpu-for-running-llms-locally/)
  - CPU vs GPU for Running LLMs Locally
- [GPU vs CPU for AI: A Detailed Comparison | TRG Datacenters](https://www.trgdatacenters.com/resource/gpu-vs-cpu-for-ai/)
  - Discover how GPUs and CPUs for AI can enhance your business. Learn effective strategies to unlock their potential and strengthen your AI infrastructure
- [GPU and CPU Performance LLM Benchmark Comparison with Ollama](https://www.youtube.com/watch?v=69Bd3TEiPnk)
  - In today’s video, we explore a detailed GPU and CPU performance comparison for large language model (LLM) benchmarks using the Ollama library. We put the RTX 3090, Tesla P40, and Tesla P100 GPUs to the test, alongside CPUs like the Mac M1, Xeon E5-2699 V4, and Ryzen 9 5950X, running across five unique prompts on each hardware setup and various GPU combinations. This benchmarking suite takes a deep dive into key performance metrics, offering critical insights for those interested in LLM...
- [AI Rendering: GPU vs. CPU Performance - Aethir Ecosystem](https://blog.aethir.com/blog-posts/ai-rendering-gpu-vs-cpu-performance)
  - AI Rendering: GPU vs. CPU Performance Aethir
- [Running Local LLMs, CPU vs. GPU - a Quick Speed Test](https://dev.to/maximsaplin/running-local-llms-cpu-vs-gpu-a-quick-speed-test-2cjn/)
  - This is the 1st part of my investigations of local LLM inference speed. Here're the 2nd and 3rd...
- [GPU Vs. CPU: Stable Diffusion Model Performance Comparison](https://acecloud.ai/resources/blog/performance-showdown-inference-of-stable-diffusion-model-with-gpu/)
  - Artificial Intelligence (AI) is now intersecting human lives in myriads of previously unimaginable ways. Tremendous advancements are being made every day in the fields of Deep Learning (DL), Generative Artificial Intelligence (GAI) and Convolutional Neural Networks (CNNs).
- [intel-analytics/ipex-llm - using both iGPU and CPU together - GitHub](https://github.com/intel-analytics/ipex-llm/issues/12373)
  - Hello, I can successfully running Ollama in iGPU of Core i7 13700K, but the perfomance is half of the CPU. Is it possible to use CPU and iGPU together so that we can get 1.5x performance than CPU o...
- [CPU vs. GPU for Machine Learning - Pure Storage Blog](https://blog.purestorage.com/purely-educational/cpu-vs-gpu-for-machine-learning/)
  - This article compares CPU vs. GPU, as well as the applications for each with machine learning, neural networks, and deep learning.
- [AMD Ryzen AI beats Intel Lunar Lake by 27% in LLM performance](https://www.igorslab.de/en/amd-ryzen-ai-beats-intel-lunar-lake-by-27-in-llm-performance-with-impressive-npu-and-igpu-power/)
  - With the Strix Point APUs, AMD is launching a new processor line on the market that has been specially developed for AI-supported applications and LLMs (Large L

## User

What exactly is tabbyapi?

## Assistant

TabbyAPI is an open-source, self-hosted AI coding assistant that provides LLM-powered code completion capabilities. Here are the key features and aspects of TabbyAPI:

## Core Functionality

- **Code Completion**: TabbyAPI uses large language models (LLMs) pre-trained on coding data to provide intelligent code suggestions and completions.

- **Self-Hosted Solution**: It allows teams to set up their own code completion server, giving them control over their data and infrastructure.

- **Model Compatibility**: TabbyAPI is compatible with major Coding LLMs such as CodeLlama, StarCoder, and CodeGen.

## Technical Details

- **Backend**: TabbyAPI uses the Exllamav2 backend for text generation.

- **Model Support**: It supports various model formats, including Exl2, GPTQ, and FP16 models.

- **API Interface**: TabbyAPI provides an OpenAPI-compatible interface, making it easy to integrate with various development environments and Cloud IDEs.

- **GPU Acceleration**: It supports consumer-grade GPUs to enhance performance and speed up code suggestions.

## Key Features

- **Retrieval-Augmented Completion**: TabbyAPI can utilize code snippets from the repository context to provide more relevant suggestions.

- **Flexible Deployment**: It can be deployed using Docker, Homebrew, or even on Hugging Face Spaces.

- **IDE Integration**: TabbyAPI offers extensions for various IDEs and editors to seamlessly integrate its capabilities into developers' workflows.

- **Performance Optimization**: It implements adaptive caching strategies and efficient code parsing to ensure rapid completions (typically under one second).

## Community and Development

- TabbyAPI is actively developed and maintained, with a growing community of users and contributors.

- It offers documentation, a wiki, and community support channels for users to get help and contribute to the project.

By providing a powerful, customizable, and privacy-focused alternative to cloud-based coding assistants, TabbyAPI aims to enhance coding productivity while giving teams full control over their AI-assisted development environment.

### Sources

- [What's Tabby](https://tabby.tabbyml.com/docs/welcome/)
  - Tabby is an open-source, self-hosted AI coding assistant. With Tabby, every team can set up its own LLM-powered code completion server with ease.
- [Shout out to TabbyAPI - it's by far the best ExLlamaV2 server I've tried](https://www.reddit.com/r/LocalLLaMA/comments/1dudzvn/shout_out_to_tabbyapi_its_by_far_the_best/)
- [Buy now, pay later with Tabby](https://tabby.ai/en-AE)
  - Tabby lets you split your purchases into 4 monthly payments so you can worry less and aim for more. And you’ll never pay interest or fees. Download the Tabby app to get started.
- [TabbyAPI | docs.ST.app - SillyTavern Documentation](https://docs.sillytavern.app/usage/api-connections/tabbyapi/)
  - A FastAPI based application that allows for generating text using an LLM using the Exllamav2 backend, with support for Exl2, GPTQ, and FP16 models.
- [Tabby API Reference](https://api-docs.tabby.ai)
- [Home · theroyallab/tabbyAPI Wiki - GitHub](https://github.com/theroyallab/tabbyAPI/wiki/)
  - An OAI compatible exllamav2 API that's both lightweight and fast - theroyallab/tabbyAPI
- [TabbyAPI - GitHub Pages](https://theroyallab.github.io/tabbyAPI/)
- [tabbyAPI/config.yml · gfjiogopdfgdfs/miqumaidtabby at ...](https://huggingface.co/spaces/gfjiogopdfgdfs/miqumaidtabby/blob/5b20a07d0792d084a97ad223d5e2005e61a44c6f/tabbyAPI/config.yml)
  - We’re on a journey to advance and democratize artificial intelligence through open source and open science.
- [Tabby: FREE Self-hosted POWERFUL AI coding Assistant! Create ...](https://www.youtube.com/watch?v=O52JTj1SeKY)
  - In a world where GitHub's paid Copilot takes center stage, the demand for open-source alternatives with similar cutting-edge capabilities and without the price tag is on the rise. Enter Tabby, your self-hosted AI coding assistant, offering a compelling alternative to GitHub Copilot, equipped with a range of essential features. 🔥 Become a Patron (Private Discord): https://patreon.com/WorldofAi ☕ To help and Support me, Buy a Coffee or Donate to Support the Channel: https://ko-fi.com/worldofai -...
- [TabbyAPI - Kaggle](https://www.kaggle.com/code/blutiger/tabbyapi)
  - Explore and run machine learning code with Kaggle Notebooks Using data from No attached data sources
