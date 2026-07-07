---
source_url: "https://www.perplexity.ai/search/cd35d049-89e0-4609-92a4-8f46539531da"
thread_uuid: "c662ce8c-88c0-459c-a2a4-695f123177e3"
slug: "cd35d049-89e0-4609-92a4-8f46539531da"
title: "i have accidentally stopped installing about 5 ollama models (pulling them) halfawy and not they are literring the `.ollama` folder with a bunch of `partial`... how to delete any and all of them easily without reinstalling my working models...?"
extracted_at: "2026-06-29T16:30:35.369Z"
matched_keywords: []
export_suite: "identity"
entry_count: 2
provenance: perplexity-rest-api
---

# i have accidentally stopped installing about 5 ollama models (pulling them) halfawy and not they are literring the `.ollama` folder with a bunch of `partial`... how to delete any and all of them easily without reinstalling my working models...?

Source: [Perplexity thread](https://www.perplexity.ai/search/cd35d049-89e0-4609-92a4-8f46539531da)

## User

i have accidentally stopped installing about 5 ollama models (pulling them) halfawy and not they are literring the `.ollama` folder with a bunch of `partial`... how to delete any and all of them easily without reinstalling my working models...?

## Assistant

To clean up partially downloaded Ollama models without affecting your working models, you can follow these steps:

1. First, list your currently working models:

```bash
ollama list
```

Make note of these models as you'll want to keep them.

2. Navigate to the Ollama models directory:

```bash
cd ~/.ollama/models
```

3. Remove partial downloads:

```bash
sudo rm -rf blobs/*partial*
```

This command will remove all files in the blobs directory that have "partial" in their name, which are typically incomplete downloads.[1]

4. Clean up the manifests:

```bash
sudo rm -rf manifests/*partial*
```

This will remove any partial manifests as well.[1]

5. If you want to be extra thorough, you can also remove any orphaned blobs that aren't associated with your working models. However, this requires more careful handling to avoid deleting important files.

6. After cleaning up, you may want to run:

```bash
ollama list
```

again to ensure your working models are still intact.

7. If you encounter any issues or want to be certain everything is in order, you can try pulling your working models again:

```bash
ollama pull model_name
```

This will ensure the model is complete and up-to-date.[2]

Remember to exercise caution when deleting files, especially when using sudo. Double-check your commands before executing them to avoid accidentally removing important data.

If you're uncomfortable with manual file deletion, you can also consider uninstalling and reinstalling Ollama completely. Before doing so, you could backup your working models by copying the relevant files from the ~/.ollama/models directory to a safe location.[4][5]

### Sources

- [Disk size hasn't returned to its normal size after removing dolphin ...](https://www.reddit.com/r/ollama/comments/1c1n39x/disk_size_hasnt_returned_to_its_normal_size_after/)
- [How to Uninstall models? : r/ollama - Reddit](https://www.reddit.com/r/ollama/comments/193kscz/how_to_uninstall_models/)
- [Anything LLM, LM Studio, Ollama, Open WebUI,… how and where ...](https://www.reddit.com/r/LocalLLaMA/comments/1ewvibl/anything_llm_lm_studio_ollama_open_webui_how_and/)
- [Ollama and shell issues : r/LocalLLaMA - Reddit](https://www.reddit.com/r/LocalLLaMA/comments/1aw6bst/ollama_and_shell_issues/)
- [Is there a way to uninstall (and re-install) ollama and onewebui ...](https://www.reddit.com/r/ollama/comments/1eelxbc/is_there_a_way_to_uninstall_and_reinstall_ollama/)

## User

i just want to purge anything that's not 100% complete and working, find a singular command

## Assistant

To purge incomplete Ollama model downloads and keep only fully working models, you can use the following command:

```bash
sudo rm -rf ~/.ollama/models/blobs/*partial* ~/.ollama/models/manifests/*partial*
```

This command will remove all files with "partial" in their name from both the blobs and manifests directories within the Ollama models folder. It targets incomplete downloads without affecting your fully downloaded and working models.[1][2]

Here's a breakdown of what this command does:

1. `sudo`: Runs the command with administrator privileges, as these files may require elevated permissions to delete.
2. `rm -rf`: Removes files and directories recursively and forcefully.
3. `~/.ollama/models/blobs/*partial*`: Deletes all partial files in the blobs directory.
4. `~/.ollama/models/manifests/*partial*`: Deletes all partial files in the manifests directory.

After running this command, only complete and working models should remain in your Ollama directory. To verify, you can run `ollama list` to see your available models.

Remember to exercise caution when using `sudo` and `rm -rf` commands, as they can permanently delete files. Double-check the command before executing it to ensure you're targeting the correct files and directories.

### Sources

- [Msty - Free Local + Remote AI Chat App (w/ support for Ollama/HF ...](https://www.reddit.com/r/LocalLLaMA/comments/1dzgsyh/msty_free_local_remote_ai_chat_app_w_support_for/)
- [Is there a way to uninstall (and re-install) ollama and onewebui without deleting models?](https://www.reddit.com/r/ollama/comments/1eelxbc/is_there_a_way_to_uninstall_and_reinstall_ollama/)
- [Ollama and shell issues](https://www.reddit.com/r/LocalLLaMA/comments/1aw6bst/ollama_and_shell_issues/)
- [How to copy downloaded ollama models from Linux to Windows](https://www.reddit.com/r/ollama/comments/1fi7ggz/how_to_copy_downloaded_ollama_models_from_linux/)
