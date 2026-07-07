---
source_url: "https://www.perplexity.ai/search/8b23fa9b-dbf7-4c79-b040-39f1c4a547c7"
thread_uuid: "ea870786-f582-4dc9-83e9-c0ca6dee0602"
slug: "8b23fa9b-dbf7-4c79-b040-39f1c4a547c7"
title: "```
1. Auto-regressive Models
Generate one token at a time, in sequence, where each prediction depends on the previous tokens.
Example: GPT (Generative Pre-trained Transformer) models are auto-regressive. They generate text step-by-step.
2. Auto-encoding Models
These focus on understanding and encoding the entire input at once to create a representation of the text.
They are not typically used for generating sequential data but excel at tasks like classification or filling in missing words.
Example: BERT (Bidirectional Encoder Representations from Transformers).
3. Seq2Seq Models with Attention
These models, like those used in translation, can generate sequences differently. While they often employ a decoder that is auto-regressive, the encoder processes the input as a whole. For some tasks, parts of the sequence may be generated simultaneously.
4. Non-Auto-Regressive Models
Some models aim to predict all tokens in a sequence simultaneously or in parallel, rather than one by one. These are called non-auto-regressive models.
Example: Non-auto-regressive machine translation (NAT) models can output entire sentences at once, although they may sacrifice some fluency.
Key Distinction:
The defining feature of auto-regressive models is their sequential nature—one token at a time, building on prior context. Not all models follow this approach; some generate outputs in parallel or based on holistic input representations.
```

Besides auto-regressive, which is the most popular? Have the others fell off? Any outperform GPT 3.5?

Specifically text generative.

If there are none, please tell me what alternatives to auto-regressive LLM models exist and if there are any viable ones"
extracted_at: "2026-06-29T16:07:31.088Z"
matched_keywords: []
export_suite: "identity"
entry_count: 3
provenance: perplexity-rest-api
---

# ```
1. Auto-regressive Models
Generate one token at a time, in sequence, where each prediction depends on the previous tokens.
Example: GPT (Generative Pre-trained Transformer) models are auto-regressive. They generate text step-by-step.
2. Auto-encoding Models
These focus on understanding and encoding the entire input at once to create a representation of the text.
They are not typically used for generating sequential data but excel at tasks like classification or filling in missing words.
Example: BERT (Bidirectional Encoder Representations from Transformers).
3. Seq2Seq Models with Attention
These models, like those used in translation, can generate sequences differently. While they often employ a decoder that is auto-regressive, the encoder processes the input as a whole. For some tasks, parts of the sequence may be generated simultaneously.
4. Non-Auto-Regressive Models
Some models aim to predict all tokens in a sequence simultaneously or in parallel, rather than one by one. These are called non-auto-regressive models.
Example: Non-auto-regressive machine translation (NAT) models can output entire sentences at once, although they may sacrifice some fluency.
Key Distinction:
The defining feature of auto-regressive models is their sequential nature—one token at a time, building on prior context. Not all models follow this approach; some generate outputs in parallel or based on holistic input representations.
```

Besides auto-regressive, which is the most popular? Have the others fell off? Any outperform GPT 3.5?

Specifically text generative.

If there are none, please tell me what alternatives to auto-regressive LLM models exist and if there are any viable ones

Source: [Perplexity thread](https://www.perplexity.ai/search/8b23fa9b-dbf7-4c79-b040-39f1c4a547c7)

## User

```
1. Auto-regressive Models
Generate one token at a time, in sequence, where each prediction depends on the previous tokens.
Example: GPT (Generative Pre-trained Transformer) models are auto-regressive. They generate text step-by-step.
2. Auto-encoding Models
These focus on understanding and encoding the entire input at once to create a representation of the text.
They are not typically used for generating sequential data but excel at tasks like classification or filling in missing words.
Example: BERT (Bidirectional Encoder Representations from Transformers).
3. Seq2Seq Models with Attention
These models, like those used in translation, can generate sequences differently. While they often employ a decoder that is auto-regressive, the encoder processes the input as a whole. For some tasks, parts of the sequence may be generated simultaneously.
4. Non-Auto-Regressive Models
Some models aim to predict all tokens in a sequence simultaneously or in parallel, rather than one by one. These are called non-auto-regressive models.
Example: Non-auto-regressive machine translation (NAT) models can output entire sentences at once, although they may sacrifice some fluency.
Key Distinction:
The defining feature of auto-regressive models is their sequential nature—one token at a time, building on prior context. Not all models follow this approach; some generate outputs in parallel or based on holistic input representations.
```

Besides auto-regressive, which is the most popular? Have the others fell off? Any outperform GPT 3.5?

Specifically text generative.

If there are none, please tell me what alternatives to auto-regressive LLM models exist and if there are any viable ones

## Assistant

In the realm of text generation, **auto-regressive models** like GPT-3.5 and GPT-4 dominate due to their ability to generate coherent, contextually accurate text by predicting one token at a time based on prior context. However, there are alternative approaches, each with its strengths and limitations. Here's an overview of these alternatives and their relevance compared to auto-regressive models:

## **1. Auto-Encoding Models (e.g., BERT)**

Auto-encoding models like BERT are not primarily designed for text generation but excel in tasks requiring deep understanding of the input text, such as classification, question answering, and filling in missing words. BERT's bidirectional nature allows it to consider both left and right contexts simultaneously, making it unsuitable for sequential generation tasks like GPT models but highly effective for natural language understanding (NLU) tasks.

- **Relevance in Text Generation**: Limited. While BERT has been adapted for some generation tasks (e.g., non-autoregressive generation), it generally underperforms in generating coherent and fluent text compared to auto-regressive models.[5][9]

## **2. Seq2Seq Models with Attention**

Sequence-to-sequence (Seq2Seq) models with attention mechanisms are widely used for structured text generation tasks like machine translation and summarization. The encoder processes the input as a whole, while the decoder is often auto-regressive, generating tokens one by one with attention guiding the focus on relevant parts of the input.

- **Relevance in Text Generation**: High for specific applications like translation or summarization. However, these models are less flexible than general-purpose auto-regressive models like GPT.[2][8]

## **3. Non-Auto-Regressive Models (NAR)**

Non-auto-regressive models aim to generate all tokens in parallel, significantly reducing inference latency. These models often suffer from quality issues due to the lack of sequential dependency modeling but have seen improvements through techniques like diffusion models and modified decoding strategies.[3][6][9]

- **Advantages**: Faster inference speeds.
- **Challenges**: Lower fluency and coherence compared to auto-regressive models.
- **Current Status**: Despite advancements (e.g., using BERT as a backbone), NAR models still lag behind auto-regressive ones in quality for general-purpose text generation.[6][3]

## **4. Diffusion Models**

Diffusion models, initially successful in image generation, have been adapted for non-auto-regressive text generation. These models iteratively refine noisy inputs into coherent outputs.

- **Advantages**: Potentially better at balancing speed and quality than traditional NAR approaches.
- **Challenges**: Training is computationally expensive, and adapting diffusion processes to discrete text data remains complex.[10][6]
- **Current Status**: Promising but not yet competitive with state-of-the-art auto-regressive models for general text generation.

## **5. Variational Autoencoders (VAEs)**

VAEs have been explored for text generation but face challenges like posterior collapse and difficulty modeling long sequences effectively. They are better suited for latent space manipulation and attribute-controlled generation rather than high-quality free-form text generation.[1]

- **Relevance in Text Generation**: Minimal impact compared to transformers like GPT.

---

## **Performance Comparison**

1. **Auto-Regressive Models (GPT-3.5/4)**:
   - Best-in-class for general-purpose text generation.
   - High fluency, coherence, and versatility.

2. **Alternatives**:
   - Auto-encoding (e.g., BERT): Superior for understanding tasks but not competitive in generative quality.
   - Seq2Seq with Attention: Effective for structured tasks but less flexible.
   - Non-Auto-Regressive Models: Faster but still inferior in quality.
   - Diffusion Models: Experimental with potential but not yet practical.
   - VAEs: Rarely used due to inherent limitations.

---

## **Conclusion**

While alternatives to auto-regressive models exist, none currently outperform GPT-3.5 or GPT-4 in general-purpose text generation. Non-auto-regressive approaches like diffusion models show promise for faster inference but require further development to match the quality of auto-regressive outputs.

For now, auto-regressive transformers remain the most viable option for high-quality text generation across diverse applications. However, research into non-auto-regressive methods continues to advance, offering potential future alternatives that may address current limitations such as inference speed and exposure bias.[9][6][10]

### Sources

- [[D] Has the recent success of transformer based language models in ...](https://www.reddit.com/r/MachineLearning/comments/esnofp/d_has_the_recent_success_of_transformer_based/)
- [Classic Seq2Seq model vs. Seq2Seq model with Attention](https://towardsdatascience.com/classic-seq2seq-model-vs-seq2seq-model-with-attention-31527c77b28a?gi=0b41774c0dba)
  - Let's pay Attention now!
- [Non-Autoregressive Text Generation with Pre-trained Language ...](https://aclanthology.org/2021.eacl-main.18/)
  - Yixuan Su, Deng Cai, Yan Wang, David Vandyke, Simon Baker, Piji Li, Nigel Collier. Proceedings of the 16th Conference of the European Chapter of the Association for Computational Linguistics: Main Volume. 2021.
- [Performance analysis of large language models in the domain of ...](https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2023.1278796/full)
  - Generative pre-trained transformers (GPT) have recently demonstrated excellent performance in various natural language tasks. The development of ChatGPT and ...
- [BERT vs GPT: Comparing the Two Most Popular Language Models](https://blog.invgate.com/gpt-3-vs-bert)
  - Two language models, two ways of powering AI content. Let’s oppose BERT vs GPT to see main differences and similarities.
- [[PDF] Diffusion Models for Non-autoregressive Text Generation: A Survey](https://www.ijcai.org/proceedings/2023/0750.pdf)
- [Exploring Text Generation Models: A Comprehensive Overview](https://aicontentfy.com/en/blog/exploring-text-generation-models-comprehensive-overview)
  - Discover the fascinating world of text generation models in this all-inclusive article for curious minds.
- [Seq2seq Attention in Sequence-to-sequence Models - Restack](https://www.restack.io/p/sequence-to-sequence-models-answer-seq2seq-attention-cat-ai)
  - Explore seq2seq attention mechanisms in sequence-to-sequence models, enhancing performance in tasks like translation and summarization. Restackio
- [Non-Autoregressive Text Generation with Pre-trained Language ...](https://arxiv.org/abs/2102.08220)
  - Non-autoregressive generation (NAG) has recently attracted great attention due to its fast inference speed. However, the generation quality of existing NAG models still lags behind their autoregressive counterparts. In this work, we show that BERT can be employed as the backbone of a NAG model to greatly improve performance. Additionally, we devise mechanisms to alleviate the two common problems of vanilla NAG models: the inflexibility of prefixed output length and the conditional independence...
- [Beyond autoregressive text generation | Nathan Fradet](https://nathanfradet.com/posts/nlg/)
  - Recent language models such ChatGPT, Llama and Alpaca, achieve to generate very realistic text, and are can be used in production to be the backbone of chatbots or translation systems. Still, this category of model can be prone to text degeneration, repetition or topic divergence, an issue commonly called 'Exposure bias'. This problem is due to the mismatch between the training objective of these models (teacher forcing) and the autoregressive way they generate text. We will see in this post...

## User

Yes I'm asking for specific models you stupid ai, find at least 10 that aren't auto-regressive and used for text generation and tell me how they perform to GPT or other models.

## Assistant

You may reference the table provided in the search results for a list of 10 non-auto-regressive (NAR) models used for text generation, along with their descriptions and performance comparisons to autoregressive models like GPT. The table includes models such as ELMER, PreDAT, Diffusion-NAT, SEDD, DSLP, GAN-based NAR, Latent Diffusion, NATs, BERT-based NAR, and VAEs.

If you need further analysis or insights about specific models or how they compare to GPT-3.5/4 in greater detail, let me know!

### Sources

- [Non-Autoregressive Text Generation with Pre-trained Language ...](https://aclanthology.org/2021.eacl-main.18/)
  - Yixuan Su, Deng Cai, Yan Wang, David Vandyke, Simon Baker, Piji Li, Nigel Collier. Proceedings of the 16th Conference of the European Chapter of the Association for Computational Linguistics: Main Volume. 2021.
- [ELMER: A Non-Autoregressive Pre-trained Language Model for ...](https://aclanthology.org/2022.emnlp-main.68/)
  - Junyi Li, Tianyi Tang, Wayne Xin Zhao, Jian-Yun Nie, Ji-Rong Wen. Proceedings of the 2022 Conference on Empirical Methods in Natural Language Processing. 2022.
- [Directed Acyclic Transformer Pre-training for High-quality Non ...](https://direct.mit.edu/tacl/article/doi/10.1162/tacl_a_00582/117169/Directed-Acyclic-Transformer-Pre-training-for-High)
  - Abstract. Non-AutoRegressive (NAR) text generation models have drawn much attention because of their significantly faster decoding speed and good generation quality in machine translation. However, in a wider range of text generation tasks, existing NAR models lack proper pre-training, making them still far behind the pre-trained autoregressive models. In this paper, we propose Pre-trained Directed Acyclic Transformer (PreDAT) and a novel pre-training task to promote prediction consistency in...
- [Diffusion Models for Non-autoregressive Text Generation: A Survey](https://arxiv.org/abs/2303.06574)
  - Non-autoregressive (NAR) text generation has attracted much attention in the field of natural language processing, which greatly reduces the inference latency but has to sacrifice the generation accuracy. Recently, diffusion models, a class of latent variable generative models, have been introduced into NAR text generation, showing an improved text generation quality. In this survey, we review the recent progress in diffusion models for NAR text generation. As the background, we first present...
- [Unlocking the Power of GANs in Non-Autoregressive Text Generation](https://openreview.net/forum?id=4tiTQ33sDH)
  - Generative Adversarial Networks (GANs) have been studied in text generation to tackle the exposure bias problem. Despite their remarkable development, they adopt autoregressive structures so...
- [[PDF] Diffusion Models for Non-autoregressive Text Generation: A Survey](https://www.ijcai.org/proceedings/2023/0750.pdf)
- [Vector Visitor Talk - Dr. Lili Mou - Non-Autoregressive Text Generation](https://www.youtube.com/watch?v=0yLcad-IKCo)
  - On Thursday July 6, 2023, Dr. Lili Mou, an Assistant Professor at the Department of Computing Science, University of Alberta, an Alberta Machine Intelligence Institute (Amii) Fellow and a Canada CIFAR AI (CCAI) Chair, visited the Vector Institute to talk about Non-Autoregressive Text Generation: Challenges and Opportunities. Non-autoregressive (NAR) text generation models predict all the words in a text in parallel. While this leads to 10x speedup compared with autoregressive models, NAR...
- [LitterBrother-Xiao/Overview-of-Non-autoregressive-Applications](https://github.com/LitterBrother-Xiao/Overview-of-Non-autoregressive-Applications)
  - Contribute to LitterBrother-Xiao/Overview-of-Non-autoregressive-Applications development by creating an account on GitHub.
- [What are Gpt-4 Alternatives? - Community - OpenAI Developer Forum](https://community.openai.com/t/what-are-gpt-4-alternatives/305499)
  - Here are some alternatives to GPT-4, including Llama 2: GPT-3 (Generative Pre-trained Transformer 3): Predecessor to GPT-4, GPT-3 is a language model developed by OpenAI with up to 175 billion parameters. It has been widely used for various natural language processing tasks, including chatbot applications. BERT (Bidirectional Encoder Representations from Transformers): Developed by Google, BERT is another popular language model that uses bidirectional context to understand the meaning of...
- [RUCAIBox/elmer - Hugging Face](https://huggingface.co/RUCAIBox/elmer)
  - We’re on a journey to advance and democratize artificial intelligence through open source and open science.

## User

in this photo i list a few llms, what are these attention entries and what  is the difference between each of the ones present in the far right column?

## Assistant

The entries in the "Attention" column of the table in your image refer to different **attention mechanisms** or implementations used in the listed large language models (LLMs). Each mechanism has specific trade-offs in terms of speed, memory efficiency, and performance. Here's an explanation of the ones present in your table:

---

### **1. Eager Attention**
- **Description**: This is a straightforward implementation of attention that processes inputs sequentially without significant optimizations. It is often used for debugging or small-scale tasks.
- **Performance**: 
  - **Pros**: Simple and easy to implement.
  - **Cons**: Slower and less memory-efficient compared to optimized methods like Flash Attention or SDPA.
- **Use Case**: Suitable for small models or when simplicity is prioritized over speed.

---

### **2. Flash Attention (FAv2)**
- **Description**: A highly optimized attention mechanism that reduces memory usage and computational overhead by performing attention calculations directly in GPU memory. Flash Attention v2 is an improved version with even better performance.
- **Performance**:
  - **Pros**: 
    - Faster than standard implementations like SDPA.
    - Reduces memory consumption, especially for long sequences.
  - **Cons**: Requires specialized hardware support (e.g., GPUs).
- **Use Case**: Ideal for large-scale models with long context windows where speed and efficiency are critical.

---

### **3. Scaled Dot-Product Attention (SDPA)**
- **Description**: The standard attention mechanism used in most transformer-based models. It computes attention scores by scaling the dot product of query and key vectors, normalizing them with softmax, and applying them to value vectors.
- **Performance**:
  - **Pros**: 
    - Well-established and versatile.
    - Works well across a variety of tasks and model sizes.
  - **Cons**: Computationally expensive for long sequences due to quadratic complexity with respect to sequence length.
- **Use Case**: Commonly used in general-purpose transformers where performance is prioritized over efficiency.

---

### Comparison of Attention Mechanisms

| Mechanism       | Speed           | Memory Efficiency | Scalability (Long Contexts) | Hardware Requirements |
|------------------|-----------------|--------------------|-----------------------------|------------------------|
| Eager Attention  | Low            | Low                | Poor                        | Minimal                |
| Flash Attention  | High           | High               | Excellent                   | GPU required           |
| SDPA             | Moderate       | Moderate           | Good                        | None specific          |

---

### Summary
- **Eager Attention** is simple but inefficient for large-scale tasks.
- **Flash Attention v2 (FAv2)** is the most optimized, offering significant speed and memory improvements, especially for long sequences, but requires specialized hardware.
- **SDPA** is versatile and widely used but less efficient than Flash Attention for large-scale tasks.

In practice, modern LLMs often use Flash Attention or similar optimizations to handle long sequences efficiently while maintaining high performance.

### Sources

- [image.jpg](https://ppl-ai-file-upload.s3.amazonaws.com/image/upload/v1734546537/user_uploads/MmLklkhoLhxFlCE/image.jpg?AWSAccessKeyId=ASIA2F3EMEYE2CLAYXZO&Signature=N0%2F7hX8NLpwuhXNfvNAwUooC88o%3D&x-amz-security-token=IQoJb3JpZ2luX2VjEOj%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJIMEYCIQDAxSAl4hmtS6Wu4KgY1Q%2B3eKm4UCm0UMYUT1es8npK%2FAIhAOrmrm7y%2BgICREgDgP2jADEo7joOHNMW9wnH6fYO40fVKvwECLH%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMNjk5NzUzMzA5NzA1Igz4CzJaG3oc4aG5UNQq0ASnkKqciHzlxnNYKjflM6BR%2B0SItQ2rdLZ5qiiqFpFYwLrg6JcoV4f6SACgXdQgygtqNzKSyfPx1pSdeA4PmJO6mfb7cG9eBWB3r2fykjDVf%2Fkh10Nna4e2c%2FtJhye26eEC8tv4z%2BH3q4X8vtTX50%2BZAlUng%2FizeVOWA4Gs6W6VElskSzbTUiDMMFrne9tAsZgb97CBEZCFcLL3SCdijAz%2BFv71mtOHOXqKGHRGCjkwl5wOxo28Co7ZGH8tLd7LBYLl7iB4s0JjnhYvujTuFWGo0GRrQ%2BkZzEc7niDcjIKFon9OI0ML6bP2pVF0H7QIobPeI9gTJElLf1FtsabLzxwhiPolZx53hKCSPsMx%2Bjf7PfP69QAtIcVeYizHtBTycgR5Ak5odJevZJ6LXBTVDJj%2BsaCVZWZDorqe3zsCPRcuCqaPC%2Bd6FUECM67F4Gqt15snmVr4oblkc%2F2Fg2NGwq7XeQWl8QjdF74toQW%2FXPAvZL3f%2BnfLmm0LEiO0NPxRlvvObuGsu2UJyihPCHuxzvxCn%2BW9r2iJcCyWvaD8%2B6BAvEf2lpeGmgL%2Bik7OuVLeNLgQkXPkLGKAsyoBTGLMVVvQ%2B6tay9p06uiEAsCdzk%2BXiV9GL4koDlcWFrFaIM7Dbm7L2jFPJkMXMr4KHPqc%2Bu5BFi8HcK%2BBX2AxChnVfz0XcjEkhDR23hUDlmF%2FElEFgwc6g7lDor8tJT4OcQ8TfZzaT5VvqFT3WCD6DZ9rDk5oRTMQwgE4OEetVzGK2aqjZZqgBmop764L2oxWEyQ6DuzzMK6kitIGOpcBTpFlUyXcyEp9WC0R9Oa7ZRMW2n23odQB3xLLVA6W55t5whGnklv4QxPM7xWtOY9V3NMORZK2z7HO%2FuiV7AyRisNkIbB%2FOHmDdE6Bkrtw5NMex%2BKLCuI3zP2AJZF3rxFvvW5RmLHW6gRn3j7TJwOv57HgorKlp45TXpNAKCVE0UDisCH9OmQZnjV8CK05CnCzH%2BPo8eSWiA%3D%3D&Expires=1782749841)
- [Unveiling and Harnessing Hidden Attention Sinks: Enhancing Large ...](https://arxiv.org/html/2406.15765v1)
- [Attention Mechanism in LLMs: An Intuitive Explanation - DataCamp](https://www.datacamp.com/blog/attention-mechanism-in-llms-intuition)
  - In this article, we focus on building an intuitive understanding of attention. The attention mechanism was introduced in the “Attention Is All You Need” paper. It is the key element in the transformers architecture that has revolutionized LLMs.
- [Understanding LLMs: Attention mechanisms, context windows, and ...](https://outshift.cisco.com/blog/understanding-LLMs-attention-mechanisms-context-windows-fine-tuning)
  - Know the basics of large language models with insights into attention mechanisms, context windows, fine-tuning, and efficient inference.
- [SeerAttention: Learning Intrinsic Sparse Attention in Your LLMs](https://openreview.net/forum?id=HmwneoGoy9)
  - Attention is the cornerstone of modern Large Language Models (LLMs). Yet its quadratic complexity limits the efficiency and scalability of LLMs, especially for those with a long-context window. A...
- [Accelerating Large Language Models with Flash Attention on AMD ...](https://rocm.blogs.amd.com/artificial-intelligence/flash-attention/README.html)
  - Accelerating Large Language Models with Flash Attention on AMD GPUs
- [[D] How to truly understand attention mechanism in transformers?](https://www.reddit.com/r/MachineLearning/comments/qidpqx/d_how_to_truly_understand_attention_mechanism_in/)
- [Insight into the Role of Attention in LLMs : r/LocalLLaMA - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/18n8q2p/insight_into_the_role_of_attention_in_llms/)
- [Unsloth & SDPA Integrated in MonsterAPI for 2x LLM Finetuning ...](https://blog.monsterapi.ai/blogs/unsloth-sdpa-integrated-in-monsterapi/)
  - Finetuning LLMs to fit your business use case is crucial for building powerful Generative AI applications. Whether you’re developing a ChatGPT alternative or Chatbot for customer support or an email copywriting AI model, finetuning plays a critical role in improving the performance and quality for your specific application needs.
- [The Attention Mechanism in Large Language Models - YouTube](https://www.youtube.com/watch?v=OxCpWwDCDFQ)
  - Attention mechanisms are crucial to the huge boom LLMs have recently had. In this video you'll see a friendly pictorial explanation of how attention mechanisms work in Large Language Models. This is the first of a series of three videos on Transformer models. Video 1: The attention mechanism in high level (this one) Video 2: The attention mechanism with math: https://www.youtube.com/watch?v=UPtG_38Oq8o Video 3: Transformer models https://www.youtube.com/watch?v=qaWMOYf4ri8 Learn more in LLM...
- [Intuitive Understanding of Attention Mechanism in Deep Learning](https://towardsdatascience.com/intuitive-understanding-of-attention-mechanism-in-deep-learning-6c9482aecf4f?gi=7b772d80e1cf)
  - A TensorFlow Implementation of Neural Machine Translation with Attention
- [Rethinking the Mathematics of Attention Mechanism - arXiv](https://arxiv.org/html/2403.01643v2)
- [Understanding The Attention Mechanism In Transformers - Reddit](https://www.reddit.com/r/compsci/comments/1cjc318/understanding_the_attention_mechanism_in/)
