---
source_url: "https://www.perplexity.ai/search/5d59c171-d469-4afa-a8ce-6003ea9fb85b"
thread_uuid: "4d2511e6-84b4-4285-9147-138ef909e1fe"
slug: "5d59c171-d469-4afa-a8ce-6003ea9fb85b"
title: "what kinds of models can I run locally? I already have anaconda/ollama setup with starcoder. ollama seems to be hardcoded to only use my cpu though? i have a amd rx 460 gpu but anaconda keeps wanting to use cuda cores from nvidia?

Broadly, what are the parameters and what is the absolute best model I can run locally and what kind of performance can I expect out of it?"
extracted_at: "2026-06-29T16:23:26.460Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# what kinds of models can I run locally? I already have anaconda/ollama setup with starcoder. ollama seems to be hardcoded to only use my cpu though? i have a amd rx 460 gpu but anaconda keeps wanting to use cuda cores from nvidia?

Broadly, what are the parameters and what is the absolute best model I can run locally and what kind of performance can I expect out of it?

Source: [Perplexity thread](https://www.perplexity.ai/search/5d59c171-d469-4afa-a8ce-6003ea9fb85b)

## User

what kinds of models can I run locally? I already have anaconda/ollama setup with starcoder. ollama seems to be hardcoded to only use my cpu though? i have a amd rx 460 gpu but anaconda keeps wanting to use cuda cores from nvidia?

Broadly, what are the parameters and what is the absolute best model I can run locally and what kind of performance can I expect out of it?

## Assistant

When it comes to running language models locally, there are several options available, but the capabilities depend on your hardware specifications. Let's break this down:

## Types of Models for Local Use

**Small to Medium-sized Models:**
These are typically models with parameters ranging from 1B to 13B. Examples include:

- Mistral 7B
- Llama 2 7B
- MPT 7B
- Phi-2 (2.7B parameters)

**Larger Models:**
Models with 30B+ parameters are more challenging to run locally but may be possible with high-end hardware:

- Llama 2 70B
- MPT 30B

## Hardware Considerations

**CPU vs GPU:**
While CPUs can run these models, GPUs significantly accelerate inference speed. Your AMD RX 460 GPU could potentially be used, but many frameworks are optimized for NVIDIA GPUs due to CUDA support.[1]

**RAM Requirements:**
As a rule of thumb, you need about 1.5-2 times the model size in RAM. For example, a 7B parameter model might require 10-14GB of RAM.[1]

## Ollama and GPU Support

Ollama primarily uses CPU by default, but it does support GPU acceleration on some systems. However, its GPU support is mainly focused on NVIDIA GPUs with CUDA.[1]

## AMD GPU Support

AMD GPUs can be used for machine learning tasks, but support is less widespread compared to NVIDIA. Tools like ROCm (Radeon Open Compute) can enable GPU acceleration for AMD cards, but compatibility and performance may vary.[1]

## Best Model for Local Use

The "best" model depends on your specific use case and hardware constraints. However, considering your setup:

1. **Mistral 7B** or **Llama 2 7B** could be good options. They offer a balance of performance and resource requirements.

2. These models can run on CPU, but for better performance, you might want to explore ROCm for AMD GPU support.

3. Expected performance varies, but on a CPU, you might see generation speeds of 1-5 tokens per second for a 7B model. GPU acceleration could potentially increase this to 10-20 tokens per second or more.[1]

## Recommendations

1. **Explore ROCm:** Look into setting up ROCm for your AMD GPU to potentially leverage GPU acceleration.

2. **Optimize Ollama:** Check if there are any configuration options in Ollama to enable GPU support for AMD cards.

3. **Consider Quantized Models:** Look for 4-bit or 8-bit quantized versions of models, which can run faster and use less memory.

4. **Experiment:** Try different models like Mistral 7B, Llama 2 7B, or even smaller models like Phi-2 to find the best balance of performance and quality for your specific use case.

Remember, the field of AI is rapidly evolving, so new optimizations and tools for running models locally are constantly emerging. Keep an eye out for updates that might improve performance on your specific hardware setup.

### Sources

- [paste.txt](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/34541976/ceed8555-bc49-4a04-b764-95c9e24edcea/paste.txt?AWSAccessKeyId=ASIA2F3EMEYE7BZSL22Y&Signature=QCQM6nx3WCrIxMwmhbgILxn6VG0%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEOj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQDp%2FQypHgXsT3n7bLsMWYg%2B0at%2BFCBNeZ3i0ZHA9G0aTwIhAKz4mtSg2QZ%2B55iz6vqq3DG0gPNzto%2BrwNsntExZ1o43KvwECLH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMNjk5NzUzMzA5NzA1IgwLtjyBS9VsUiPpwtYq0ARcu1A3c7iqM0LbEpD9XXvtVw96sIM6qNsDuTZfcr2ZzUaOZiKuTwajfcPNk8V6r0zLdMTuIMGlCoXGi1XR3RiXwfxVRdi4zv2s8nEsHRWeIrf%2F45ccOElwB%2BCAVAYMMSlHgFOMVe0wIOmP8gR83Dn1v7N2epGG4siwKNH8V76AeJ5NOt9cKEEKyHUNQ%2B6b3HzPnLOsfpBHnyp25e2vAyX%2Bt32zT2B%2B1UMmy%2B9Lj8DkFCq5Wgs9Kg2xk3LvSWRi%2FDE20VvWdDQr5FFZDn9aPhQGU%2B2N2Am%2B6wqyIIXV8Oi6scZAnxkN0%2BVDVjpiRqW3cmYHvFly1UIdPRdRUyLh%2FA8yO7jDzAARvuzXcw8AK4Jt0R7MKyXHBPUoUZWgIhvbkxwj7YLqzURav8I3pT5wM5PvKfCocofnZ0r0wcHtRL2LrHA4TkPQkjRbhApicz94XinwKv6fnThN%2FTkw8I6zlvyPJES44uzjPnQxo%2B79ivvb977pN49R4Y5nUCXy2VdgpoLo%2FwybiOl1UpYp7gJxbPs8xx2NyaFGjSKVNZ%2B20aJn8U89VCGrqAhcvOWymEG1kdiyqP9AUt45FfDY4fvjfXGHixHr50c8mr72Og3iOJ5b97Fqb5kfGCPQ6SASe1O5hHEhf1oMzifp2%2BnU3wNJwOrVqy%2BqPYMScgTZEdxSPd5HvRSiLkM30jbZ44VlMtJRNXAWEe7z3F%2FES%2BJ5SyICVF8TLS2r%2BJ6RjNOZOn004Ai%2F5NgZS%2B8ce0QzGapQDf%2BMRnx2JyrjXU5Nl3KzEoo5v0FDMMijitIGOpcBH%2B9zbupRTkLCXK0vedoPVpnOsJqN2o2nTcoZfqIQdkTS7mmb%2Fc3%2FtxBrPy%2BR1YBI9sHhZJqlPJYNFV%2BlRa0fQ9A3SYjzLuaRb%2FZShgW8Ut0o5OW0GUbVAQISdOl6Rh8bGV9JkJWgR4rxpb7ftXsE6a9hXopzQt30e9mm8ECoDLBgiwtvDvRP8orHvzaa5gXKmBiLsq0pNw%3D%3D&Expires=1782750802)
  - When a LLM has in the name stuff like 405b, 8b, 9b, 7b, 8x22b, 13b, what is this representing and are higher numbers better or worse? Here's an example: Nous: Hermes 3 405B Instruct (free) nousresearch/hermes-3-llama-3.1-405b:free Chat Updated Aug 16 131,072 context $0/M input tokens $0/M output tokens Hermes 3 is a generalist language model with many improvements over Hermes 2, including advanced agentic capabilities, much better roleplaying, reasoning, multi-turn conversation, long context...
