---
source_url: "https://www.perplexity.ai/search/deefdee2-2007-48aa-8321-e0b156fe087e"
thread_uuid: "b3af55a7-6463-4a34-8b03-98796ba63c19"
slug: "deefdee2-2007-48aa-8321-e0b156fe087e"
title: "https://www.youtube.com/watch?v=EL5c7WHMpvc

Delete non-essential information while keeping all key details intact. Do not summarize or generalize. Finally, rephrase in your own words to modify the tone consistent with your usual response patterns."
extracted_at: "2026-06-29T16:09:41.145Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# https://www.youtube.com/watch?v=EL5c7WHMpvc

Delete non-essential information while keeping all key details intact. Do not summarize or generalize. Finally, rephrase in your own words to modify the tone consistent with your usual response patterns.

Source: [Perplexity thread](https://www.perplexity.ai/search/deefdee2-2007-48aa-8321-e0b156fe087e)

## User

https://www.youtube.com/watch?v=EL5c7WHMpvc

Delete non-essential information while keeping all key details intact. Do not summarize or generalize. Finally, rephrase in your own words to modify the tone consistent with your usual response patterns.

## Assistant

The video tutorial demonstrates how to build an AI voice chatbot app using open-source models, without requiring expensive access keys. The app integrates three main models:

1. **Whisper large-v3**: A speech-to-text model developed by OpenAI, used for transcribing recorded audio into text.
2. **Mistral-7b-instruct-v0.1 (quantized)**: A large language model (LLM) fine-tuned on conversational datasets, used to generate chatbot responses.
3. **XTTS-v2**: A multilingual text-to-speech (TTS) model developed by CQU AI, which converts text into speech with customizable voices.

The tutorial walks through the following steps:

- **Setting up Hugging Face Spaces**: The platform is used to host and deploy the app. The presenter creates a new space, selects Gradio as the interface framework, and configures the necessary hardware (GPU) for deployment.
  
- **Cloning the repository**: The code repository is cloned to a local machine for further development.

- **Configuring the environment**: The required Python libraries and dependencies are installed, including `LlamaCPP` for efficient LLM inference.

- **Model Initialization**: The Whisper model is loaded using the `faster-whisper` library for faster performance. The Mistral LLM is downloaded in its quantized form to reduce memory usage while maintaining performance. XTTS is initialized after agreeing to its terms of service.

- **Building the Gradio UI**: The app's user interface is constructed using Gradio blocks. Key components include:
  - A chatbot interface for user interaction.
  - A dropdown menu to select the chatbot's voice (male or female).
  - Input options for either typing text or recording audio via a microphone.
  - An audio playback feature that allows users to hear the chatbot's responses.

- **Functions for Interaction**: Several functions are defined to handle user input:
  - `add_text`: Processes text input from the user and updates the chatbot history.
  - `add_audio`: Transcribes recorded audio using Whisper and updates the chatbot history.
  - `generate_speech`: Converts chatbot responses into speech using XTTS.

After setting up all components and functions, the app is deployed on Hugging Face Spaces, where it runs on a GPU machine. The tutorial concludes with a demo of the working app, where the AI chatbot named "Amy" interacts with users by responding with generated speech.

The full code and demo can be found in the Hugging Face repository linked in the video description.

### Sources

- [watch?v=EL5c7WHMpvc](https://www.youtube.com/watch?v=EL5c7WHMpvc)
- [how to build an AI voice chatbot app](https://www.youtube.com/watch?v=EL5c7WHMpvc)
