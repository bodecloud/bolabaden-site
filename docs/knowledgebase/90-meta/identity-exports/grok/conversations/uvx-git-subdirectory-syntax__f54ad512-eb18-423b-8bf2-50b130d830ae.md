---
source_url: "https://grok.com/c/f54ad512-eb18-423b-8bf2-50b130d830ae"
conversation_id: "f54ad512-eb18-423b-8bf2-50b130d830ae"
title: "uvx Git Subdirectory Syntax"
extracted_at: "2026-06-29T16:11:38.106Z"
message_count: 4
export_suite: "identity"
provenance: grok-rest-api
---

# uvx Git Subdirectory Syntax

Source: [Grok conversation](https://grok.com/c/f54ad512-eb18-423b-8bf2-50b130d830ae)

## User

_Time: 2026-01-30T00:52:38.459Z_

https://github.com/firecrawl/firecrawl.git#main:/apps/playwright-service-ts
the above seems to work in docker-compose.yml's `build` syntax in the compose-spec schema. Your task is unrelated to docker: please find documentation that explains the syntax for the github url above and why it works? it seems to be:
repo_url.git#branch:/relpath
i'm trying to use a similar solution inside a `uv` command e.g.:
uvx --verbose --from git+https://github.com/CoplayDev/unity-mcp.git#beta:/Server mcp-for-unity
pyproject.toml is in the Server folder. Not understanding why the above isn't working. I know this uvx command works:
uvx --from git+https://github.com/bolabaden/AgentDecompile mcp-agentdecompiile
so I know for a *fact* the issue is exclusively and highly specifically in the command being executed (pyproject.toml in the unity-mcp's Server folder is correct and accurate)
Web search and find the exact canonical way to get uvx (uv tool run) to read and use the pyproject.toml in the Server folder of the https://github.com/CoplayDev/unity-mcp.git repo.
Be verifiable authentic and accurate to the documentation. Assume it exists and is possible regardless of what research says: if you encounter opinions that state otherwise please research more thoroughly obviously.

## Assistant

_Time: 2026-01-30T00:54:25.940Z_

**Key Points**  
- The GitHub URL syntax `repo.git#branch:/relpath` (e.g., `https://github.com/firecrawl/firecrawl.git#main:/apps/playwright-service-ts`) is specific to Docker Compose build contexts and does not apply to uv or pip.  
- uv follows pip's VCS requirement syntax for Git dependencies: `git+https://github.com/user/repo.git@ref#subdirectory=path`.  
- Your uvx command fails because it uses Docker's `:/` syntax instead of uv's `#subdirectory=` and `@branch`.  
- The correct syntax for uvx to use the `pyMatching.toml` in the `Server` subdirectory on the `beta` branch is:  
  `uvx --verbose --from git+https://github.com/CoplayDev/unity-mcp.git@beta#subdirectory=Server mcp-for-unity`  

**Docker-Specific Syntax**  
Docker Compose allows Git URLs as build contexts with the format `git-url#ref:context-path` (or `:dockerfile-path`). This clones the repo at the specified ref (branch, tag, or commit) and uses the subpath as the build context. It is documented in the Docker Compose file reference for the `build.context` field and works because Docker's builder handles Git cloning internally with this custom fragment syntax (`#ref:path`). This is unique to Docker and not part of standard PEP 508/PEP 440 dependency specifiers used by pip/uv.

**uv Git Dependency Syntax**  
uv supports Git dependencies compatible with pip's VCS requirements (PEP 508).  
- Base: `git+https://github.com/user/repo.git`  
- Specify ref (branch/tag/commit): `@ref` (e.g., `@beta`)  
- Specify subdirectory (where `pyproject.toml` lives): `#subdirectory=path/to/dir`  
- Combined example: `git+https://github.com/user/repo.git@beta#subdirectory=Server`  

This is shown in uv's official documentation for managing dependencies (e.g., `uv add git+https://github.com/langchain-ai/langchain#subdirectory=libs/langchain`). For branches, uv also supports separate flags like `--branch beta`, but embedding `@beta` in the URL works equivalently.

**Applying to uvx**  
`uvx` (alias for `uv tool run`) supports `--from` with Git URLs, including refs (e.g., `@master` or `@commit`). While official examples focus on root-level packages, the same VCS syntax applies since uv resolves requirements consistently. Community usage and issues confirm `#subdirectory=` works for Git sources in uv commands, including tool execution when the subdirectory contains a valid `pyproject.toml` with console scripts/entrypoints.  

Your working example (`uvx --from git+https://github.com/bolabaden/AgentDecompile mcp-agentdecompiile`) succeeds because it uses a root-level repo without needing subdirectory specification.  

**Recommended Command**  
```bash
uvx --verbose --from git+https://github.com/CoplayDev/unity-mcp.git@beta#subdirectory=Server mcp-for-unity
```  
- This clones the repo at the `beta` branch.  
- Treats `Server` as the package root (finding `pyproject.toml` there).  
- Installs temporarily and runs the `mcp-for-unity` entrypoint.  

If the package has a specific name in `pyproject.toml`, you may need to adjust (e.g., `-- mcp-for-unity` assumes it matches the command). Add `--lfs` if the repo uses Git LFS.

---

**Supporting Details**  

| Feature                  | Docker Compose Syntax                          | uv / pip Syntax                                      | Notes |
|--------------------------|------------------------------------------------|------------------------------------------------------|-------|
| Git URL base             | `https://github.com/user/repo.git`             | `git+https://github.com/user/repo.git`               | uv requires `git+` prefix |
| Ref (branch/tag/commit)  | `#branch` (before path)                        | `@ref` (after URL)                                   | e.g., `@beta` |
| Subdirectory             | `:/path` (after ref)                           | `#subdirectory=path`                                 | uv uses `=` separator |
| Example                  | `repo.git#main:/apps/service`                  | `git+https://repo.git@main#subdirectory=apps/service`| Direct equivalents |

This syntax difference explains why the Docker example works there but not in uvx. uv adheres to standard Python packaging specs, ensuring compatibility across tools like pip.

**Key Citations**  
- [uv Managing Dependencies Documentation](https://docs.astral.sh/uv/concepts/projects/dependencies/)  
- [uv Using Tools Guide (with Git examples for uvx)](https://docs.astral.sh/uv/guides/tools/)  
- [uv CLI Reference for tool run](https://docs.astral.sh/uv/reference/cli/#uv-tool-run)  
- [Docker Compose Build Specification](https://docs.docker.com/reference/compose-file/build/)  
- [pip VCS Support Documentation](https://pip.pypa.io/en/latest/topics/vcs-support/)

## User

_Time: 2026-01-30T00:54:52.554Z_

`https://github.com/user/repo.git#branch:subdirectory` ok but what is this syntax, where is it documented, and how does it work? why does github support shit like https://github.com/user/repo.git/tree/branch/relpath/file.ext which also redirects to https://github.com/user/repo.git/blob/branch/relpath/file.ext and what's the diff between tree/blob? and WHERE is this documented?
your response should OBVIOUSLY not contain anything docker/uvx related under any circumstances since this is a github api question...

## Assistant

_Time: 2026-01-30T00:57:21.652Z_

**Key Points**  
- The URL fragment syntax `#branch:subdirectory` (or `#ref:subdirectory`) in Git repository URLs like `https://github.com/user/repo.git#branch:subdirectory` is not a standard Git or GitHub feature and has no official GitHub documentation.  
- It is a non-standard convention interpreted by certain specialized client applications, while Git cloning ignores the fragment entirely, and GitHub servers do not process it specially.  
- GitHub web URLs use `/tree/` for viewing directory structures and `/blob/` for viewing individual file contents, reflecting Git's internal object types (trees for directories, blobs for files).  
- Mismatches (e.g., `/tree/` on a file) trigger automatic redirects to the correct view (e.g., `/blob/`).  
- Clone URLs ending in `.git` (e.g., `https://github.com/user/repo.git/tree/branch/path/file.ext`) work because GitHub's server redirects them to the equivalent canonical web URL without `.git`.  

**Understanding the Fragment Syntax (#branch:subdirectory)**  
This format attaches a fragment (the part after `#`) to a standard Git clone URL. Git itself disregards URL fragments when cloning, treating the URL as the base repository only. GitHub does not interpret or act on this fragment server-side—visiting such a URL in a browser loads the repository's main page (or redirects from `.git` if present), with the fragment potentially used only for client-side anchoring if a matching HTML element exists. The `:subdirectory` portion has no standardized meaning in Git or on GitHub; any functionality comes from the consuming application parsing the fragment to checkout a specific ref and operate within a subpath after cloning.

**The /tree/ and /blob/ Paths in GitHub URLs**  
GitHub's web interface uses these segments to display repository contents at a specific branch or commit:  
- `/tree/branch/path` shows a directory listing (file and folder view).  
- `/blob/branch/path/file.ext` shows the rendered or raw content of a specific file.  
This distinction mirrors Git's low-level object model, where "tree" objects represent directories and "blob" objects store file contents. If the path points to a file but uses `/tree/`, GitHub redirects to `/blob/` (and vice versa for directories accessed with `/blob/`). This ensures users land on the appropriate view.

**Handling .git in Web URLs**  
Git repository clone URLs end with `.git` (e.g., `https://github.com/user/repo.git`), while web view URLs do not (e.g., `https://github.com/user/repo`). Appending paths like `/tree/` or `/blob/` to a `.git` URL succeeds because GitHub's servers detect and redirect to the canonical non-`.git` equivalent, preserving the path. This convenience allows copy-pasting from clone instructions directly into a browser.

---

**Detailed Examination of GitHub URL Conventions and Git Object Model**  

GitHub's web interface provides intuitive URLs for browsing repository contents at specific references (branches, tags, or commits). The core patterns revolve around distinguishing between directory listings and file views, drawing directly from Git's internal storage model.

**Git Internals: Blobs and Trees**  
In Git, every versioned file is stored as a "blob" (binary large object), which contains the raw file contents plus a header. Directories are not stored as files but as "tree" objects, which list entries pointing to blobs (for files) or other trees (for subdirectories). A commit points to a single top-level tree representing the entire snapshot. GitHub's web URLs expose this structure:  
- `/blob/` surfaces a blob (file content).  
- `/tree/` surfaces a tree (directory listing).  

This naming is intentional and consistent with Git's object types, making the URLs semantically accurate.

| Aspect                  | /tree/branch/path                              | /blob/branch/path/file.ext                     | Notes                                                                 |
|------------------------|------------------------------------------------|------------------------------------------------|-----------------------------------------------------------------------|
| Purpose                | Display directory contents (files + subdirs)   | Display specific file contents                 | Reflects Git object types: tree = directory, blob = file              |
| Typical Use            | Browsing folders, seeing structure              | Viewing/editing a single file                  | Permanent links to files usually use /blob/                           |
| Mismatch Behavior      | Redirects to /blob/ if path is a file           | Redirects to /tree/ if path is a directory     | Automatic correction for user convenience                             |
| Example                | https://github.com/torvalds/linux/tree/master/Documentation | https://github.com/torvalds/linux/blob/master/README | Real-world Linux kernel repo examples                                 |
| Underlying Git Object  | Tree object                                    | Blob object                                    | Directly maps to Git's storage model                                  |

**Redirect Behavior and .git Compatibility**  
GitHub implements server-side redirects for usability:  
- Using the wrong segment (/tree/ on a file or /blob/ on a directory) automatically forwards to the correct one.  
- URLs with `.git` (the standard clone suffix) are redirected to their non-`.git` equivalent while preserving appended paths like /tree/ or /blob/. This allows users to take a clone URL directly from GitHub's "Code" button and append browsing paths without modification.

No single official GitHub page exhaustively documents these exact URL patterns, as they are implementation details of the web frontend. However, the separation is evident in the REST API, which has dedicated endpoints for trees and blobs, reinforcing the conceptual divide.

**The #branch:subdirectory Fragment Syntax**  
The fragment format `#branch:subdirectory` (or variations like `#ref:subdirectory`) does not appear in official Git documentation or GitHub's public docs as a supported feature. Git's cloning process strips and ignores everything after `#` in URLs. GitHub's servers treat the fragment as a client-side browser feature (e.g., for scrolling to anchors) and perform no special handling.  

Searches for this exact syntax outside specialized contexts yield no evidence of it being a Git or GitHub standard. Some Git commands (like `git archive --remote`) support a related `ref:path` syntax as an argument for subtree extraction, but not embedded in the repository URL itself via a fragment with a colon separator.  

When this syntax functions, it does so because the application consuming the URL explicitly parses the fragment, performs the clone (ignoring the fragment), checks out the specified ref, and shifts context to the subdirectory. GitHub "supports" it passively—the base URL remains valid for cloning, and no server-side validation rejects the fragment.

**Absence of Formal Documentation**  
GitHub provides extensive documentation for its REST and GraphQL APIs, including separate endpoints for Git trees and blobs, but does not publish a comprehensive guide to web browsing URL structures. The /tree/ and /blob/ conventions are reverse-engineered from usage and consistent with Git internals, as explained in community resources and the official Git book. The fragment syntax lacks any mention in GitHub or core Git docs, confirming it is not a platform-level feature.

**Key Citations**  
- [Git Internals - Git Objects (official Git documentation)](https://git-scm.com/book/en/v2/Git-Internals-Git-Objects)  
- [REST API endpoints for Git trees (GitHub Docs)](https://docs.github.com/rest/git/trees)  
- [REST API endpoints for Git blobs (GitHub Docs)](https://docs.github.com/en/rest/git/blobs)  
- [Stack Overflow: Difference between tree and blob in GitHub URLs](https://stackoverflow.com/questions/39400848/in-github-urls-what-is-the-difference-between-a-tree-and-a-blob)  
- [GitHub Community Discussion: Redirects for blob/tree URLs](https://github.com/orgs/community/discussions/23213)
