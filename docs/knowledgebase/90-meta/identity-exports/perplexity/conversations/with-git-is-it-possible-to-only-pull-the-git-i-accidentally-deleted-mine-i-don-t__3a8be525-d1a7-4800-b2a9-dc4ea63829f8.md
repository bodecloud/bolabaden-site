---
source_url: "https://www.perplexity.ai/search/82447024-82c5-44aa-baff-32931d670402"
thread_uuid: "3a8be525-d1a7-4800-b2a9-dc4ea63829f8"
slug: "82447024-82c5-44aa-baff-32931d670402"
title: "with git, is it possible to ONLY pull the .git? I accidentally deleted mine. I don't want to reclone the whole repo. I have all the files, except the .git folder. How do I get it"
extracted_at: "2026-06-29T16:08:58.987Z"
matched_keywords: []
export_suite: "identity"
entry_count: 1
provenance: perplexity-rest-api
---

# with git, is it possible to ONLY pull the .git? I accidentally deleted mine. I don't want to reclone the whole repo. I have all the files, except the .git folder. How do I get it

Source: [Perplexity thread](https://www.perplexity.ai/search/82447024-82c5-44aa-baff-32931d670402)

## User

with git, is it possible to ONLY pull the .git? I accidentally deleted mine. I don't want to reclone the whole repo. I have all the files, except the .git folder. How do I get it

## Assistant

Yes, it is possible to restore only the `.git` folder without recloning the entire repository. Since you already have all the files except the `.git` folder, you can follow these steps to recreate the repository setup:

### Steps to Restore the `.git` Folder

1. **Clone the Repository Without Checking Out Files**:
   Use the `--no-checkout` option with `git clone` to fetch just the `.git` directory without creating a working tree:
   ```bash
   git clone --no-checkout <repository_url> temp_repo
   ```
   This will create a new directory named `temp_repo` containing only the `.git` folder.

2. **Move the `.git` Folder**:
   Move the `.git` folder from `temp_repo` into your existing project directory where your files are located:
   ```bash
   mv temp_repo/.git /path/to/your/project
   ```

3. **Reset the Repository**:
   Navigate to your project directory and reset the index to match your current files:
   ```bash
   cd /path/to/your/project
   git reset HEAD -- .
   ```
   This step ensures that Git recognizes your current files as part of the repository.

4. **Verify Repository Status**:
   Run `git status` to confirm that Git is now tracking your files correctly. If there are any untracked or modified files, you can stage and commit them as needed.

### Alternative: Use a Bare Clone
If you prefer, you can also perform a bare clone and then integrate it into your existing directory:
1. Clone a bare repository:
   ```bash
   git clone --bare <repository_url> .git
   ```
2. Configure it as a non-bare repository:
   ```bash
   git config --local --bool core.bare false
   ```
3. Reset the index as described above.

These methods allow you to restore only the `.git` folder while preserving your existing files, avoiding a full reclone of the repository.[1][2][3]

### Sources

- [Is there a way to only download the .git folder while cloning a repo ...](https://www.reddit.com/r/git/comments/fi3jno/is_there_a_way_to_only_download_the_git_folder/)
- [Best way to restore .git folder - Stack Overflow](https://stackoverflow.com/questions/24775326/best-way-to-restore-git-folder)
  - Due to some error in code, we lost a complete GIT-controlled directory. Restoring the files was not a problem; TimeMachine took care of that. However, TimeMachine apparently did not back up the .git
- [Clone only the .git directory of a git repo - Stack Overflow](https://stackoverflow.com/questions/38999901/clone-only-the-git-directory-of-a-git-repo)
  - I have a repo in sync with google Drive, but I had the .git directory ignored so it is now uploaded to Google Drive. Recently I formatted my Gentoo machine and after I had all Google Drive files ...
- [How to recover .git directory? - Laracasts](https://laracasts.com/discuss/channels/general-discussion/how-to-recover-git-directory)
