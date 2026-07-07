---
source_url: "https://www.perplexity.ai/search/bab4b646-ee86-4b8c-a30f-1a524206a1b1"
thread_uuid: "32107386-e796-4355-bfab-2037480b38de"
slug: "bab4b646-ee86-4b8c-a30f-1a524206a1b1"
title: "I have a bunch of text that I want to save to embeddings in python, how to do this without langchain?"
extracted_at: "2026-06-29T16:11:41.877Z"
matched_keywords: []
export_suite: "identity"
entry_count: 2
provenance: perplexity-rest-api
---

# I have a bunch of text that I want to save to embeddings in python, how to do this without langchain?

Source: [Perplexity thread](https://www.perplexity.ai/search/bab4b646-ee86-4b8c-a30f-1a524206a1b1)

## User

I have a bunch of text that I want to save to embeddings in python, how to do this without langchain?

## Assistant

To save text embeddings in Python without using Langchain, you can use various libraries such as **SentenceTransformers**, **spaCy**, **Gensim**, or **MediaPipe**. Below are a few methods to achieve this:

## 1. **Using SentenceTransformers**
The **SentenceTransformers** library provides an easy way to generate sentence embeddings using pre-trained models. Here's how you can use it:

### Installation:
```bash
pip install sentence-transformers
```

### Code Example:
```python
from sentence_transformers import SentenceTransformer

# Load a pre-trained model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Your text data
texts = ["This is a sentence.", "Here is another one."]

# Generate embeddings
embeddings = model.encode(texts)

# Save embeddings to a file (optional)
import numpy as np
np.save("embeddings.npy", embeddings)

print("Embeddings shape:", embeddings.shape)
```
This method generates dense vector representations of your text, which can be saved as `.npy` files for later use or further analysis.

## 2. **Using spaCy**
spaCy offers pre-trained models that include word and document embeddings. You can use spaCy's medium or large English models to generate embeddings.

### Installation:
```bash
pip install spacy
python -m spacy download en_core_web_md  # or en_core_web_lg for larger models
```

### Code Example:
```python
import spacy

# Load the medium English model
nlp = spacy.load("en_core_web_md")

# Your text data
texts = ["This is a sentence.", "Here is another one."]

# Generate document embeddings
embeddings = [nlp(text).vector for text in texts]

# Save embeddings to a file (optional)
import numpy as np
np.save("spacy_embeddings.npy", embeddings)

print("Embeddings shape:", np.array(embeddings).shape)
```
spaCy provides 300-dimensional vectors for each document, which can be saved in a similar fashion.

## 3. **Using Gensim (Word2Vec)**
If you want to work with word-level embeddings, you can use Gensim’s Word2Vec model.

### Installation:
```bash
pip install gensim nltk
```

### Code Example:
```python
from gensim.models import Word2Vec
from nltk.tokenize import word_tokenize

# Sample text data
texts = ["This is a sentence.", "Here is another one."]

# Tokenize the sentences into words
tokenized_texts = [word_tokenize(text.lower()) for text in texts]

# Train Word2Vec model on the tokenized texts
model = Word2Vec(sentences=tokenized_texts, vector_size=100, window=5, min_count=1)

# Get word vectors for individual words
word_vectors = [model.wv[word] for word in tokenized_texts[0]]

# Save the model and vectors (optional)
model.save("word2vec.model")
```
This approach generates word-level embeddings and allows you to save the trained model for future use.

## 4. **Using MediaPipe Text Embedder**
Google’s MediaPipe offers a Text Embedder that can also generate text embeddings.

### Installation:
```bash
pip install mediapipe
```

### Code Example:
```python
import mediapipe as mp

BaseOptions = mp.tasks.BaseOptions
TextEmbedder = mp.tasks.text.TextEmbedder
TextEmbedderOptions = mp.tasks.text.TextEmbedderOptions

# Load the Universal Sentence Encoder model (or any other compatible model)
model_path = '/path/to/universal_sentence_encoder.tflite'
options = TextEmbedderOptions(base_options=BaseOptions(model_asset_path=model_path), quantize=True)

text_embedder = TextEmbedder.create_from_options(options)

# Your text data
input_text = "This is an example sentence."

# Generate embedding using the embed function
embedding_result = text_embedder.embed(input_text)

print("Embedding result:", embedding_result)
```
MediaPipe’s Text Embedder outputs dense vectors that capture semantic meaning, which can be used similarly to other methods.

## Conclusion:
You have several options depending on your specific needs:

- Use **SentenceTransformers** if you need sentence-level embeddings and want access to state-of-the-art models.
- Use **spaCy** if you prefer an all-in-one NLP library with built-in support for word and document embeddings.
- Use **Gensim** if you're working with word-level embeddings like Word2Vec.
- Use **MediaPipe** if you're looking for a lightweight solution with TensorFlow Lite support.

Each method allows you to generate and save text embeddings efficiently without needing Langchain.

### Sources

- [Embeddings and Vector Databases With ChromaDB - Real Python](https://realpython.com/chromadb-vector-database/)
- [Ultimate Guide To Text Similarity With Python - NewsCatcher](https://www.newscatcherapi.com/blog/ultimate-guide-to-text-similarity-with-python)
- [Text embedding guide for Python | Google AI Edge - Gemini API](https://ai.google.dev/edge/mediapipe/solutions/text/text_embedder/python)
- [tutorial on getting started with word embeddings in python ... - GitHub](https://github.com/idc9/word_embed_tutorial)
- [Word Embedding using Word2Vec - GeeksforGeeks](https://www.geeksforgeeks.org/python-word-embedding-using-word2vec/)
- [Intro to Word Embeddings – Text Analysis in Python](https://carpentries-incubator.github.io/python-text-analysis/07-wordEmbed_intro/index.html)

## User

is there already an app for creating embeddings quickly and easily? I want to send like 800000 lines of dialog in a video game to something ready to accept them and just get the embeddings as a singular file

## Assistant

Yes, there are several tools and APIs available that can help you quickly and easily generate embeddings for a large amount of text, such as the 800,000 lines of dialogue you mentioned. These tools allow for batch processing and can output embeddings in a format that you can save as a singular file. Here are some options:

### 1. **Google Vertex AI (Batch Embeddings)**
Google's **Vertex AI** offers a robust solution for generating embeddings, especially for large-scale data. You can use their batch prediction feature to process large amounts of text asynchronously. This is ideal for non-latency-sensitive tasks like embedding generation for 800,000 lines of dialogue.

- **Batch Processing**: You can send all your text inputs in a single batch request, and the embeddings will be stored in an output location (e.g., Google Cloud Storage or BigQuery).
- **Models**: Vertex AI supports models like `textembedding-gecko`, which generates 768-dimensional dense vector embeddings.
- **Scalability**: This service is designed to handle large-scale embedding requests efficiently.

Example JSONL input:
```json
{"content":"This is a line of dialogue."}
{"content":"Another line of dialogue."}
```

You can retrieve the embeddings as JSONL or store them in BigQuery or Google Cloud Storage for easy access and further processing.[2][3]

### 2. **OpenAI Embedding API (Ada-002)**
OpenAI's **Embedding API** is another option that supports high-performance embedding generation. The `text-embedding-ada-002` model is particularly efficient and cost-effective, producing 1536-dimensional embeddings.

- **Batch Requests**: Although OpenAI's API has some token limits (e.g., 2048 tokens per request), you can split your data into manageable chunks and send them in batches.
- **Output**: The API returns embeddings in JSON format, which you can easily save to a file.
- **Ease of Use**: OpenAI’s API is user-friendly and well-documented, making it easy to integrate into your workflow.

This is ideal if you're looking for high-quality embeddings with minimal setup.[1]

### 3. **Eden AI**
**Eden AI** provides an aggregation platform where you can access multiple embedding APIs (e.g., OpenAI, Cohere, Google) from one interface. This could be useful if you want flexibility in choosing different models or comparing results from various providers.

- **Multiple APIs**: Eden AI allows you to choose from multiple embedding models like BERT, GloVe, and more.
- **Cost Management**: It also helps monitor pricing across different providers, which could be useful if you're processing a large volume of data.[1]

### Conclusion
For your use case of embedding 800,000 lines of dialogue:

- **Google Vertex AI** is a strong candidate due to its batch processing capabilities and ability to handle large datasets efficiently.
- **OpenAI's Embedding API** with `ada-002` provides high-quality embeddings but may require splitting your data into smaller chunks due to token limits.
- **Eden AI** offers flexibility by aggregating multiple embedding services under one platform.

All these options allow you to easily retrieve the embeddings as files that can be stored locally or in cloud storage for further use.

### Sources

- [Top Free Embedding tools, APIs, and Open Source models - Eden AI](https://www.edenai.co/post/top-free-embedding-tools-apis-and-open-source-models)
- [Get batch text embeddings predictions | Generative AI on Vertex AI](https://cloud.google.com/vertex-ai/generative-ai/docs/embeddings/batch-prediction-genai-embeddings)
- [Get text embeddings | Generative AI on Vertex AI - Google Cloud](https://cloud.google.com/vertex-ai/generative-ai/docs/embeddings/get-text-embeddings)
